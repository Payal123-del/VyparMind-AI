# Backend — Murf Falcon Voice AI Agent

The Python backend for the Murf AI Voice Agent Starter. Built with [LiveKit Agents SDK](https://docs.livekit.io/agents), [Murf Falcon TTS](https://murf.ai/api/docs/text-to-speech/streaming), [Deepgram Nova-3 STT](https://developers.deepgram.com), and [Google Gemini LLM](https://aistudio.google.com).

## 🚀 Quickstart

### 1. Install dependencies

```bash
cd backend
uv sync
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required keys:
- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `MURF_API_KEY`
- `DEEPGRAM_API_KEY`
- `GOOGLE_API_KEY`

### 3. Pre-warm models (first run only)

```bash
uv run python src/agent.py download-files
```

### 4. Run development agent

```bash
uv run python src/agent.py dev
```

---

## 🧪 Testing & Quality

Run unit tests and linter:

```bash
# Run pytest evaluation suite
uv run pytest

# Check code formatting and lints
uv run ruff check .
uv run ruff format --check .
```

---

## 🛠️ Adding Tools

To add custom tools to your voice agent, extend the `Assistant` class in `src/agent.py` using `@function_tool`:

```python
from livekit.agents import function_tool, RunContext

@function_tool
async def lookup_account(self, context: RunContext, user_id: str):
    """Look up user account details."""
    return f"Account {user_id} active."
```
