# Murf AI & LiveKit Voice Agent Starter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Murf Falcon](https://img.shields.io/badge/TTS-Murf%20Falcon-6366F1)](https://murf.ai/api/docs/text-to-speech/streaming)
[![LiveKit](https://img.shields.io/badge/Transport-LiveKit-002cf2)](https://docs.livekit.io)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![CI](https://github.com/murf-ai/murf-livekit-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/murf-ai/murf-livekit-starter/actions)

A production-ready voice AI agent starter powered by **Murf Falcon TTS** (ultra-fast text-to-speech) and **LiveKit Agents** framework.

This project includes a Python backend voice pipeline (STT → LLM → TTS) and a modern, fully responsive Next.js frontend web UI with real-time audio visualization, theme toggling, and transcript display.

---

## 🌟 Key Features

- **Ultra-Low Latency Voice AI**: ~55ms TTS streaming latency powered by Murf Falcon.
- **Full Responsiveness**: Mobile, tablet, and desktop layout with fluid typography and dark/light mode support.
- **Production Ready**: Zero broken imports, full linting compliance, automated CI workflows, and single-command local setup.
- **Modular Backend**: Extensible assistant class with support for `@function_tool` decorators (weather, database, API calls).
- **Accessibility & Performance**: Built with semantic HTML, focus indicators, WCAG AA contrast, and optimized assets.

---

## 🏗️ Architecture

```mermaid
flowchart LR
    A[🎙️ User Audio Input] -->|LiveKit WebRTC| B[Deepgram STT (Nova-3)]
    B -->|Transcribed Text| C[Google Gemini LLM]
    C -->|Response Stream| D[Murf Falcon TTS]
    D -->|Streaming Audio| E[LiveKit Transport]
    E -->|Audio Output| F[🔊 User Hears Agent]

    style A fill:#1e293b,stroke:#64748b,color:#fff
    style B fill:#0284c7,stroke:#38bdf8,color:#fff
    style C fill:#6366f1,stroke:#818cf8,color:#fff
    style D fill:#059669,stroke:#34d399,color:#fff
    style E fill:#ea580c,stroke:#fb923c,color:#fff
    style F fill:#1e293b,stroke:#64748b,color:#fff
```

---

## 🚀 Quickstart & One-Command Run

### Prerequisites

- **Python**: 3.10 to 3.14
- **[uv](https://docs.astral.sh/uv/)**: High-performance Python package installer
- **Node.js**: 18+
- **pnpm**: Fast, disk space efficient package manager (`npm install -g pnpm`)

### 1. Clone & Set Up Environment

```bash
git clone https://github.com/murf-ai/murf-livekit-starter.git
cd murf-livekit-starter
```

Copy the example environment files for backend and frontend:

```bash
# Backend environment setup
cp backend/.env.example backend/.env.local

# Frontend environment setup
cp frontend/.env.example frontend/.env.local
```

Fill in your API keys in `backend/.env.local`:

| Environment Variable | Description | Source |
| -------------------- | ----------- | ------ |
| `LIVEKIT_URL` | LiveKit Cloud / Local Server URL | [LiveKit Cloud](https://cloud.livekit.io) |
| `LIVEKIT_API_KEY` | LiveKit API Key | [LiveKit Cloud](https://cloud.livekit.io) |
| `LIVEKIT_API_SECRET` | LiveKit API Secret | [LiveKit Cloud](https://cloud.livekit.io) |
| `MURF_API_KEY` | Murf API Key | [Murf AI Dashboard](https://murf.ai/api/dashboard) |
| `DEEPGRAM_API_KEY` | Deepgram STT API Key | [Deepgram Console](https://console.deepgram.com) |
| `GOOGLE_API_KEY` | Google Gemini LLM Key | [Google AI Studio](https://aistudio.google.com) |

Fill in your LiveKit connection details in `frontend/.env.local`:

```env
LIVEKIT_URL=wss://your-livekit-project.livekit.cloud
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
```

### 2. Run with a Single Command

#### Windows (PowerShell):
```powershell
.\start_app.ps1
```

#### macOS / Linux (Bash):
```bash
chmod +x start_app.sh
./start_app.sh
```

#### Using root `package.json`:
```bash
pnpm setup  # Install backend & frontend dependencies
pnpm dev    # Run services
```

The app will start:
- Frontend UI: `http://localhost:3000`
- Backend Agent: Listening for LiveKit WebRTC connections

---

## 🧪 Testing & Code Quality

Run tests and linter checks directly from the root workspace:

```bash
# Run backend pytest suite
pnpm test

# Run code linter checks
pnpm lint

# Format codebase
pnpm format

# Build production frontend bundle
pnpm build
```

---

## 📁 Repository Structure

```
murf-livekit-starter/
├── backend/                  # Python Voice AI Agent
│   ├── src/
│   │   └── agent.py          # Entrypoint, voice pipeline & function tools
│   ├── tests/
│   │   └── test_agent.py     # Async LLM evaluation tests
│   ├── pyproject.toml        # uv package configuration
│   └── requirements.txt      # Deployment requirement list
├── frontend/                 # Next.js Web UI
│   ├── app/                  # App Router pages and token API
│   ├── components/           # UI components, visualizers, control bar
│   ├── app-config.ts         # Branding, visualizer, & accent configurations
│   ├── package.json          # Node dependencies
│   └── .prettierrc           # Cross-platform code style rules
├── .github/workflows/ci.yml  # GitHub Actions CI workflow
├── package.json              # Monorepo root scripts
├── start_app.ps1             # PowerShell single-command launcher
└── start_app.sh              # Bash single-command launcher
```

---

## 🚢 Deployment

### Frontend (Vercel)
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Root Directory to `frontend`.
4. Configure environment variables (`LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`).
5. Deploy!

### Backend (Railway / Docker / Cloud Run)
1. Set up a Python 3.11 server environment or Docker container.
2. Install dependencies using `uv sync` or `pip install -r backend/requirements.txt`.
3. Set all required environment variables in your hosting provider configuration.
4. Set the start command: `python backend/src/agent.py start`.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
