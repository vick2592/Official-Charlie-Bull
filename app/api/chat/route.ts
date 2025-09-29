export const runtime = 'nodejs';

export async function POST(req: Request) {
  const base = process.env.AI_SERVER_URL?.replace(/\/$/, '');
  if (!base) {
    return new Response(JSON.stringify({ error: 'misconfigured', message: 'AI_SERVER_URL not set' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
  const upstream = `${base}/v1/chat`;
  const body = await req.text(); // pass through as-is
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const r = await fetch(upstream, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      signal: controller.signal
    });
    const text = await r.text().catch(() => '');
    return new Response(text, {
      status: r.status,
      headers: { 'content-type': 'application/json' }
    });
  } catch (e) {
    const err = e as { name?: string; message?: string } | undefined;
    const msg = err?.name === 'AbortError' ? 'upstream_timeout' : (err?.message || 'upstream_error');
    return new Response(JSON.stringify({ error: 'bad_gateway', message: msg }), {
      status: 502,
      headers: { 'content-type': 'application/json' }
    });
  } finally {
    clearTimeout(timeout);
  }
}

