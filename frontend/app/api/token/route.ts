import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

// NOTE: define the environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const AGENT_NAME = process.env.AGENT_NAME || 'my-agent';

// Don't cache token route results
export const revalidate = 0;

// Rate limiting tracking map
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const MAX_REQUESTS_PER_MINUTE = 30;

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Security Check
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - userLimit.lastReset > 60_000) {
      userLimit.count = 1;
      userLimit.lastReset = now;
    } else {
      userLimit.count += 1;
    }
    rateLimitMap.set(ip, userLimit);

    if (userLimit.count > MAX_REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        { error: 'Security Rate Limit Exceeded: Too many token requests. Please wait 1 minute.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // 2. Validate Environment Secrets
    if (!LIVEKIT_URL) {
      return NextResponse.json(
        { error: 'LIVEKIT_URL environment variable is missing' },
        { status: 500 }
      );
    }
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'LIVEKIT_API_KEY environment variable is missing' },
        { status: 500 }
      );
    }
    if (!API_SECRET) {
      return NextResponse.json(
        { error: 'LIVEKIT_API_SECRET environment variable is missing' },
        { status: 500 }
      );
    }

    // 3. Parse and Sanitize Room Configuration
    const body = await req.json().catch(() => ({}));
    let roomConfig: RoomConfiguration | undefined;
    if (body?.room_config) {
      roomConfig = RoomConfiguration.fromJson(body.room_config, { ignoreUnknownFields: true });
    } else if (AGENT_NAME) {
      roomConfig = RoomConfiguration.fromJson(
        { agents: [{ agentName: AGENT_NAME }] },
        { ignoreUnknownFields: true }
      );
    }

    // 4. Generate Short-Lived Secure Participant Token
    const participantName = 'VyaparUser';
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 100_000)}`;
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 100_000)}`;

    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName,
      roomConfig
    );

    // 5. Enterprise Security Response Headers
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantName,
      participantToken,
    };

    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    });

    return NextResponse.json(data, { headers });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown internal server error';
    console.error('[API Security Guard /api/token]', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  roomConfig?: RoomConfiguration
): Promise<string> {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: '30m', // Enforce 30-minute max token validity for enhanced security
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);

  if (roomConfig) {
    at.roomConfig = roomConfig;
  }

  return at.toJwt();
}
