import { NextRequest, NextResponse } from 'next/server';

// --- Types ---
interface PostBody {
	message?: string;
	sessionId?: string;
}

interface AIUpstreamResponse {
	response?: string; // preferred
	message?: string;  // fallback key if upstream uses message
}

interface OutMessage {
	message: string;
	timestamp: number;
	success: boolean;
	meta?: {
		rateLimited?: boolean;
		fallback?: boolean;
	};
}

// --- Config ---
const RATE_LIMIT_MS = 2000; // 1 msg / 2s per IP (or session)
const lastRequestTime = new Map<string, number>();
const AI_SERVER_URL = process.env.NEXT_PUBLIC_AI_SERVER_URL?.replace(/\/$/, '') || '';

// Simple helper to build JSON responses
function json(data: OutMessage, init?: ResponseInit) {
	return NextResponse.json(data, init);
}

export async function GET() {
	return json({
		message: "Woof! Charlie Bull chat endpoint is alive. POST a message to talk! 🐕",
		timestamp: Date.now(),
		success: true
	});
}

export async function POST(req: NextRequest) {
	const now = Date.now();
	let body: PostBody = {};
	try {
		body = await req.json();
	} catch {
		return json({
			message: "Woof! I couldn't read that. Make sure it's valid JSON. 🐕",
			timestamp: now,
			success: false
		}, { status: 400 });
	}

	const { message, sessionId } = body;
	if (!message || typeof message !== 'string') {
		return json({
			message: "Woof! I need a 'message' string to respond to! 🐕",
			timestamp: now,
			success: false
		}, { status: 400 });
	}

	if (message.length > 300) {
		return json({
			message: "Woof! That's a long one—keep it under 300 characters, please! 🐕",
			timestamp: now,
			success: false
		}, { status: 400 });
	}

	// Basic rate limiting by IP or session
	const clientKey = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || sessionId || 'anon';
	const last = lastRequestTime.get(clientKey) || 0;
	if (now - last < RATE_LIMIT_MS) {
		lastRequestTime.set(clientKey, now); // still advance to prevent hammering
		return json({
			message: "Easy there! Give Charlie a second to fetch the next bone of knowledge. 🐕",
			timestamp: now,
			success: false,
			meta: { rateLimited: true }
		}, { status: 429 });
	}
	lastRequestTime.set(clientKey, now);

	// Try upstream AI server if configured
	if (AI_SERVER_URL) {
		try {
			const upstream = await fetch(`${AI_SERVER_URL}/chat`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message, sessionId, personality: 'charlie_bull' }),
			// @ts-expect-error: timeout is not a standard fetch option but supported in some runtimes
				timeout: 10000
			});

			if (upstream.ok) {
				const data: AIUpstreamResponse = await upstream.json();
				const upstreamMsg = data.response || data.message;
				if (upstreamMsg) {
					return json({
						message: ensureDogEmoji(upstreamMsg),
						timestamp: now,
						success: true
					});
				}
			}
		} catch (err) {
			// Silent fallback
			console.log('[chat] Upstream AI unavailable, falling back.', err instanceof Error ? err.message : err);
		}
	}

	// Fallback personality response
	const fallback = generateCharlieFallback(message.toLowerCase());
	return json({
		message: fallback,
		timestamp: now,
		success: true,
		meta: { fallback: true }
	});
}

// --- Helpers ---
function ensureDogEmoji(text: string) {
	const trimmed = text.trim();
	if (/🐕|🐶/.test(trimmed.slice(-3))) return trimmed; // ends with dog already
	return trimmed + ' 🐕';
}

function pick(arr: string[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateCharlieFallback(lower: string): string {
	// Categories
	if (/hello|hi |hey|gm|greetings/.test(lower)) {
		return ensureDogEmoji(pick([
			"Woof! Hey there, DeFi explorer! I'm Charlie—ready to sniff out answers for you!",
			"Hi friend! Charlie Bull reporting for blockchain duty—what should we dig into?",
			"Hey! I'm your cross-chain AI pup—ask me anything about tokens, staking, or DeFi!"
		]));
	}

	if (/token|supply|distribution|burn|omics/.test(lower)) {
		return ensureDogEmoji(pick([
			"Our tokenomics are built for sustainability—balanced allocation across community, liquidity, growth, and long-term incentives.",
			"Token distribution focuses on ecosystem health: community rewards, liquidity provisioning, development, and vested team allocation.",
			"Healthy token models balance utility + governance + incentives—ours aims to reward participation while avoiding inflationary drift."
		]));
	}

	if (/stake|staking|yield|farm|apr|apy|reward/.test(lower)) {
		return ensureDogEmoji(pick([
			"Staking lets holders earn yield while supporting ecosystem security—always check lockup + reward mechanics.",
			"Yield farming rewards liquidity provision but carries impermanent loss risk—understand the pair dynamics first.",
			"APR vs APY: APR is simple annual rate; APY compounds results—auto-compounding boosts effective return over time."
		]));
	}

	if (/bridge|cross|chain|l2|layer 2|rollup|evm/.test(lower)) {
		return ensureDogEmoji(pick([
			"Cross-chain design prioritizes safety: validated messaging + liquidity routing reduce fragmentation.",
			"Layer 2 scaling (rollups, zk proofs, optimistic frameworks) reduces cost while inheriting mainnet security.",
			"Interoperability unlocks capital efficiency—secure bridging avoids replay + routing exploits."
		]));
	}

	if (/price|moon|pump|invest|buy/.test(lower)) {
		return ensureDogEmoji(pick([
			"I don't give financial advice—always DYOR and manage risk like a disciplined trader.",
			"Momentum is fun, but fundamentals + sustainability build real value—diversify and stay patient.",
			"Focus on utility, security, and adoption metrics—not just short-term volatility."
		]));
	}

	if (/security|audit|exploit|risk|hack/.test(lower)) {
		return ensureDogEmoji(pick([
			"Security first: audited contracts, principle of least privilege, and monitoring reduce exploit surface.",
			"Never sign blind transactions—verify contract addresses and simulate actions when possible.",
			"Smart contract risks include re-entrancy, unchecked external calls, and oracle manipulation—defense in depth matters."
		]));
	}

	// General fallback
	return ensureDogEmoji(pick([
		"Great question! I can chat about tokenomics, DeFi mechanics, cross-chain design, staking, or security—what area should we explore next?",
		"I'm here to help decode crypto concepts—try asking about staking mechanics, interoperability, or risk management!",
		"Curious about something in blockchain? Fire away—I'll fetch an answer!"
	]));
}

