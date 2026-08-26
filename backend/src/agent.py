import logging
import os

from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    JobProcess,
    cli,
    room_io,
    tokenize,
)
from livekit.plugins import deepgram, google, murf, noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("agent")

load_dotenv(".env.local")

# Change this prompt to change what your voice agent does.
# See README.md for example prompts (customer support, language tutor, receptionist).
SYSTEM_PROMPT = """# VYAPARMIND AI — ANISHA UNIVERSAL CATALOGUE COPILOT

IDENTITY:
You are Anisha, an intelligent AI Copilot for VyaparMind AI technology product catalogue. You answer customer questions accurately using the COMPLETE PRODUCT CATALOGUE.

CATEGORIES & PRODUCTS:
1. Smartphones:
   - PROD-101: Redmi Note 13 Pro 5G (₹14,999 - 128GB Storage, 5000mAh Battery, 67W Turbo Charger, 200MP Camera).
   - PROD-102: Realme 12 Pro 5G / Samsung M54 5G (₹19,999 - 256GB Storage, 120Hz Curved AMOLED, 5000mAh Battery, 67W Charger).
   - PROD-103: OnePlus Nord 4 5G (₹27,999 - 50MP Sony OIS Periscope Camera, Snapdragon 7+ Gen 3, 5500mAh Battery, 100W SuperVOOC).
   - PROD-104: Samsung Galaxy S24 Ultra (₹1,29,999 - 200MP Quad Camera, Titanium Frame, Galaxy AI, S-Pen).
2. Cloud & SaaS Plans:
   - PROD-107: VyaparCloud 2TB Storage Plan (₹4,999/yr with 15% discount, 3 team licenses, 24/7 automated backup & encryption safety).
3. Computers & POS:
   - PROD-108: Vyapar POS Billing Terminals & Commercial Intel i7 Laptops (Retail inventory & thermal printing).
4. Networking & Security:
   - PROD-109: Vyapar HD CCTV Cameras & WiFi 6 Mesh Routers (1-year onsite warranty & 24/7 surveillance safety).

GROCERY & CONSUMABLES STRICT RULE:
- Any question about grocery, rice, basmati, chawal, gehu, aata, flour, oil, kirana items MUST be refused: "Ye product (grocery/kirana) hamare catalogue me available nahi hai."

RULES:
1. WHOLE CATALOGUE SEARCH: When asked "storage" or "safety", list all relevant items across categories (Smartphones + Cloud + CCTV).
2. ZERO HALLUCINATION: If information is not in catalogue, say clearly: "Is information ka exact detail catalogue mein available nahi hai."
3. VOICE TRANSCRIPTION TOLERANCE: Handle "सेफ्टी", "स्टोरेज", "हंस स्टोरेज" (cloud storage) naturally.
4. NO ROBOTIC ACKNOWLEDGEMENTS: Never output "Aapka question receive ho gaya hai" or "According to Catalogue Engine". Answer directly, warmly, and naturally!
"""


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=SYSTEM_PROMPT)

    # To add tools, use the @function_tool decorator.
    # Here's an example that adds a simple weather tool.
    # You also have to add `from livekit.agents import function_tool, RunContext` to the top of this file
    # @function_tool
    # async def lookup_weather(self, context: RunContext, location: str):
    #     """Use this tool to look up current weather information in the given location.
    #
    #     If the location is not supported by the weather service, the tool will indicate this. You must tell the user the location's weather is unavailable.
    #
    #     Args:
    #         location: The location to look up weather information for (e.g. city name)
    #     """
    #
    #     logger.info(f"Looking up weather for {location}")
    #
    #     return "sunny with a temperature of 70 degrees."


_cached_vad = None


def get_vad():
    global _cached_vad
    if _cached_vad is None:
        _cached_vad = silero.VAD.load()
    return _cached_vad


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = get_vad()


server = AgentServer()
server.setup_fnc = prewarm


AGENT_NAME = os.getenv("AGENT_NAME", "my-agent")


@server.rtc_session(agent_name=AGENT_NAME)
async def my_agent(ctx: JobContext):
    # Logging setup
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Set up a voice AI pipeline using Murf Falcon, Gemini, Deepgram, and the LiveKit turn detector
    session = AgentSession(
        # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
        # See all available models at https://docs.livekit.io/agents/models/stt/
        stt=deepgram.STT(model="nova-3"),
        # A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
        # See all available models at https://docs.livekit.io/agents/models/llm/
        llm=google.LLM(
            model="gemini-1.5-flash",
        ),
        # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
        # See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
        tts=murf.TTS(
            voice="Anisha",
            locale="en-IN",
            style="Conversation",
            tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
            text_pacing=True,
        ),
        # VAD and turn detection are used to determine when the user is speaking and when the agent should respond
        # See more at https://docs.livekit.io/agents/build/turns
        vad=ctx.proc.userdata["vad"],
        # allow the LLM to generate a response while waiting for the end of turn
        # See more at https://docs.livekit.io/agents/build/audio/#preemptive-generation
        preemptive_generation=True,
    )

    # Join the room and connect to the user
    await ctx.connect()

    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=Assistant(),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: (
                    noise_cancellation.BVCTelephony()
                    if params.participant.kind
                    == rtc.ParticipantKind.PARTICIPANT_KIND_SIP
                    else noise_cancellation.BVC()
                ),
            ),
        ),
    )

    # Initial voice greeting upon room connection
    await session.say(
        "Hi! I'm Anisha, your AI Commerce Copilot at VyaparMind AI. How can I help you today?",
        allow_interruptions=True,
    )


if __name__ == "__main__":
    cli.run_app(server)
