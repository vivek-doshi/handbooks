# LLM API Standards and Tooling Handbook

Audience: Beginner-to-intermediate developers working on enterprise-grade AI integrations.

---

## Module 1: The Paradigm of LLM APIs

### The API Landscape
API standards in AI are like standard shipping containers in logistics. If every vendor used a custom container size, ports, trucks, and warehouses would all need custom handling. In LLM systems, that same friction appears as provider-specific SDK logic, schema mapping, and duplicated testing.

Why it matters:
- Standards reduce integration cost and onboarding time.
- Standards make incident failover possible.
- Standards reduce vendor lock-in risk (pricing, legal, latency, compliance).

### The De Facto Standard
The OpenAI shape around `/v1/chat/completions` became the practical common language. Open-source servers such as vLLM, Ollama, and llama.cpp adopted OpenAI-compatible endpoints so existing clients, prompts, and tooling could be reused.

---

## Module 2: The OpenAI API Standard

### The Payload Structure (Raw JSON)

```json
{
  "model": "gpt-4o-mini",
  "temperature": 0.2,
  "max_tokens": 400,
  "messages": [
    {
      "role": "system",
      "content": "You are an enterprise support assistant. Be concise and accurate."
    },
    {
      "role": "user",
      "content": "Summarize the SLA policy for API retries."
    }
  ]
}
```

Role definitions:
- `system`: global behavior and constraints
- `user`: end-user request
- `assistant`: prior model output

### The Code (Python SDK)

```python
import os
from typing import Optional

from openai import OpenAI


def get_openai_chat_reply(user_prompt: str) -> str:
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.2,
        max_tokens=400,
        messages=[
            {"role": "system", "content": "You are an enterprise support assistant."},
            {"role": "user", "content": user_prompt},
        ],
    )

    content: Optional[str] = response.choices[0].message.content
    return content or ""
```

Key characteristic:
- OpenAI allows multiple `system` messages and repeated roles, which is highly flexible.

---

## Module 3: The Anthropic API Standard (Messages API)

### The Payload Structure (Raw JSON)

```json
{
  "model": "claude-3-5-sonnet-20240620",
  "max_tokens": 400,
  "temperature": 0.2,
  "system": "You are an enterprise support assistant. Be concise and accurate.",
  "messages": [
    {
      "role": "user",
      "content": "Summarize the SLA policy for API retries."
    }
  ]
}
```

### Core Differences vs OpenAI
1. `system` is top-level, not inside `messages`.
2. Anthropic strictly enforces user/assistant alternation.

### The Code (Python SDK)

```python
import os
from typing import List

from anthropic import Anthropic
from anthropic.types import MessageParam


def get_anthropic_reply(user_prompt: str) -> str:
    client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    messages: List[MessageParam] = [
        {"role": "user", "content": user_prompt}
    ]

    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=400,
        temperature=0.2,
        system="You are an enterprise support assistant.",
        messages=messages,
    )

    text_blocks = [block.text for block in response.content if block.type == "text"]
    return "\n".join(text_blocks)
```

---

## Module 4: The Tool Calling Formats (The Big Divide)

### Why Tools Matter
Tool calling is critical because enterprise agents must produce structured outputs that can be validated, audited, and executed by downstream systems.

### OpenAI Tool Format

Raw request:

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {"role": "system", "content": "You are a weather assistant."},
    {"role": "user", "content": "Will it rain in Seattle tomorrow?"}
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get weather forecast by city and date.",
        "parameters": {
          "type": "object",
          "properties": {
            "city": {"type": "string"},
            "date": {"type": "string", "description": "ISO date, YYYY-MM-DD"}
          },
          "required": ["city", "date"],
          "additionalProperties": false
        }
      }
    }
  ],
  "tool_choice": "auto"
}
```

Tool call response shape:

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "tool_calls": [
          {
            "id": "call_123",
            "type": "function",
            "function": {
              "name": "get_weather",
              "arguments": "{\"city\":\"Seattle\",\"date\":\"2026-04-21\"}"
            }
          }
        ]
      }
    }
  ]
}
```

### Anthropic Tool Format

Raw request:

```json
{
  "model": "claude-3-5-sonnet-20240620",
  "max_tokens": 500,
  "system": "You are a weather assistant.",
  "messages": [
    {
      "role": "user",
      "content": "Will it rain in Seattle tomorrow?"
    }
  ],
  "tools": [
    {
      "name": "get_weather",
      "description": "Get weather forecast by city and date.",
      "input_schema": {
        "type": "object",
        "properties": {
          "city": {"type": "string"},
          "date": {"type": "string"}
        },
        "required": ["city", "date"]
      }
    }
  ]
}
```

Tool usage response shape:

```json
{
  "content": [
    {
      "type": "text",
      "text": "<thinking>I should call weather data first.</thinking>"
    },
    {
      "type": "tool_use",
      "id": "toolu_01ABC",
      "name": "get_weather",
      "input": {
        "city": "Seattle",
        "date": "2026-04-21"
      }
    }
  ],
  "stop_reason": "tool_use"
}
```

Note: some Claude outputs include XML-like `<thinking>` text before tool requests.

---

## Module 5: Building an Agnostic Wrapper (Enterprise Architecture)

### The Problem
Without an abstraction layer, switching from GPT-4o to Claude 3.5 Sonnet requires multiple code paths for message formatting, tool schema handling, and response parsing.

### The Solution
Create an internal router/wrapper with one app-facing contract and provider-specific adapters.

### Implementation Option A: Factory Pattern

```python
import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Dict, List

from anthropic import Anthropic
from openai import OpenAI


@dataclass
class ChatRequest:
    model: str
    messages: List[Dict[str, Any]]
    temperature: float = 0.2
    max_tokens: int = 500


class LlmProvider(ABC):
    @abstractmethod
    def complete(self, request: ChatRequest) -> str:
        raise NotImplementedError


class OpenAIProvider(LlmProvider):
    def __init__(self) -> None:
        self.client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

    def complete(self, request: ChatRequest) -> str:
        response = self.client.chat.completions.create(
            model=request.model,
            messages=request.messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        return response.choices[0].message.content or ""


class AnthropicProvider(LlmProvider):
    def __init__(self) -> None:
        self.client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    def complete(self, request: ChatRequest) -> str:
        system_prompt = "\n".join(m["content"] for m in request.messages if m["role"] == "system")
        non_system_messages = [m for m in request.messages if m["role"] != "system"]
        response = self.client.messages.create(
            model=request.model,
            system=system_prompt,
            messages=non_system_messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        return "\n".join(block.text for block in response.content if block.type == "text")
```

### Implementation Option B: LiteLLM

```python
from typing import Dict, List

from litellm import completion


def run_with_litellm(messages: List[Dict[str, str]]) -> str:
    response = completion(
        model="anthropic/claude-3-5-sonnet-20240620",
        messages=messages,
        temperature=0.2,
        max_tokens=500,
    )
    return response["choices"][0]["message"]["content"]
```

---

## Module 6: Common Pitfalls and Anti-Patterns

### 1) Ignoring Streaming
Blocking requests for long generations cause poor UX and timeout risk.

Raw payload:

```json
{
  "model": "gpt-4o-mini",
  "stream": true,
  "messages": [
    {"role": "user", "content": "Generate a 1200-word architecture proposal."}
  ]
}
```

Streaming code:

```python
import os
from typing import Iterator

from openai import OpenAI


def stream_openai_text(prompt: str) -> Iterator[str]:
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
```

### 2) Hardcoding Schemas
Do not hand-maintain tool JSON schema. Generate from typed models.

```python
import json
from pydantic import BaseModel, Field


class GetWeatherInput(BaseModel):
    city: str = Field(description="City name")
    date: str = Field(description="ISO date YYYY-MM-DD")


def openai_tool_definition() -> dict:
    return {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather forecast by city and date.",
            "parameters": GetWeatherInput.model_json_schema(),
        },
    }


print(json.dumps(openai_tool_definition(), indent=2))
```

### 3) Failing to Handle Tool Results
Tool execution result must be sent back in provider-specific format.

OpenAI handoff message:

```json
{
  "role": "tool",
  "tool_call_id": "call_123",
  "content": "{\"temperature_c\":9,\"condition\":\"rain\"}"
}
```

Anthropic handoff message:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01ABC",
      "content": "{\"temperature_c\":9,\"condition\":\"rain\"}"
    }
  ]
}
```

If you skip this step, the model cannot continue with fresh tool data.

---

## Final Enterprise Checklist
- Define one internal message and tool contract.
- Route providers behind adapters.
- Stream by default for long outputs.
- Auto-generate tool schemas from typed models.
- Log raw request/response envelopes with redaction.
- Always complete the tool loop with provider-correct result blocks.
