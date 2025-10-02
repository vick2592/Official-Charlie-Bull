export const dynamic = 'force-static';

export default function ChatPage() {
  // ChatWidget is included globally via RootLayout and will auto-open on this route.
  // Provide a minimal fallback page content for SEO and non-JS environments.
  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center opacity-70">
        <h1 className="text-2xl font-bold mb-2">Chat</h1>
        <p>The chat is loading…</p>
      </div>
    </main>
  );
}
