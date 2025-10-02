// components/ChatWidget.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, MessageCircle, Send, Volume2, VolumeX, Trash2, Settings, Loader, Maximize2, Minimize2 } from 'lucide-react';

// ---- Types ----
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'charlie';
  timestamp: number;
}

interface ChatWidgetProps { showInitialModal?: boolean }

interface SettingsState {
  sound: boolean;
  persist: boolean;
}

// ---- Constants ----
const MAX_CHARS = 300;
const RATE_LIMIT_MS = 2000;
const STORAGE = {
  MESSAGES: 'charlie_chat_messages',
  SETTINGS: 'charlie_chat_settings',
  WELCOME: 'charlie_welcome_seen_v5' // switched to localStorage persistence across visits
} as const;

// Utility ensure dog emoji ending
const withDog = (t: string) => /🐕|🐶/.test(t.trim().slice(-3)) ? t : t.trim() + ' 🐕';

// Extend window typing for load flag
declare global {
  interface Window { __CHARLIE_SITE_LOADED__?: boolean }
}

export function ChatWidget({ showInitialModal = true }: ChatWidgetProps) {
  const router = useRouter();
  const pathname = usePathname();
  // UI state
  const [open, setOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSentAt, setLastSentAt] = useState(0);
  const [headerOffset, setHeaderOffset] = useState(0); // dynamic header height / fallback

  // Data state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [settings, setSettings] = useState<SettingsState>({ sound: false, persist: true });
  const [showSettings, setShowSettings] = useState(false);
  const [fullscreen, setFullscreen] = useState(false); // desktop fullscreen toggle

  // Refs
  const endRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(`sess_${Date.now()}_${Math.random().toString(36).slice(2,10)}`);
  const scrollPosRef = useRef(0); // preserve scroll position to prevent jump
  const autoOpenedFromRouteRef = useRef(false);

  // Helper open/close functions that preserve scroll position
  const openChat = useCallback(() => {
    // Heuristic detect older iOS to reduce crash risk by routing to a dedicated page
    try {
      const ua = navigator.userAgent || '';
      const isIOS = /(iPhone|iPad|iPod)/i.test(ua);
      const m = ua.match(/OS (\d+)_/);
      const major = m ? parseInt(m[1], 10) : undefined;
      const smallScreen = Math.min(window.screen.width, window.screen.height) <= 375;
      const lowEnd = isIOS && ((typeof major === 'number' && major <= 14) || smallScreen);
      if (lowEnd && pathname !== '/chat') {
        router.push('/chat');
        return;
      }
    } catch {}
    scrollPosRef.current = window.scrollY;
    setOpen(true);
  }, [pathname, router]);
  const closeChat = useCallback(() => {
    const y = scrollPosRef.current;
    setOpen(false);
    // Restore after next paint to avoid layout thrash
    requestAnimationFrame(() => {
      window.scrollTo({ top: y });
    });
    if (!window.matchMedia('(min-width: 768px)').matches) {
      document.body.classList.remove('no-scroll');
    }
  }, []);

  // Keep scroll lock in sync with viewport changes while chat is open
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => {
      if (!open) {
        document.body.classList.remove('no-scroll');
        return;
      }
      if (mq.matches) {
        // Desktop/tablet: lock page only when chat is fullscreen
        if (fullscreen) document.body.classList.add('no-scroll');
        else document.body.classList.remove('no-scroll');
      } else {
        // Mobile: always lock while open
        document.body.classList.add('no-scroll');
      }
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [open, fullscreen]);

  // ---- Effects: load persisted ----
  useEffect(() => {
    // Auto-open when landing directly on /chat route and mark as route-driven
    if (typeof window !== 'undefined' && pathname === '/chat') {
      setOpen(true);
      (autoOpenedFromRouteRef.current = true);
    } else {
      // If we navigate away from /chat and the widget was opened by the route, close it
      if (autoOpenedFromRouteRef.current) {
        autoOpenedFromRouteRef.current = false;
        setOpen(false);
      }
    }
    // Determine header height (if header component exists) and set CSS var fallback
    const computeHeader = () => {
      const header = document.querySelector('.header');
      if (header) {
        const h = header.getBoundingClientRect().height;
        setHeaderOffset(h);
      } else {
        // fallback typical header height
        setHeaderOffset(80);
      }
    };
    computeHeader();
    window.addEventListener('resize', computeHeader);
    return () => window.removeEventListener('resize', computeHeader);
  }, [pathname]);

  // (Removed initial viewport height lock; relying on 100dvh and input font-size fix instead)

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE.SETTINGS);
      if (s) setSettings(prev => ({ ...prev, ...JSON.parse(s) }));
      const m = localStorage.getItem(STORAGE.MESSAGES);
      if (m) {
        const parsed = JSON.parse(m);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch (e) {
      console.log('Init load error', e);
    }

    if (!showInitialModal) return;

    const maybeShow = () => {
      try {
        const seen = localStorage.getItem(STORAGE.WELCOME);
        if (!seen) {
          setTimeout(() => setShowWelcome(true), 250); // slight delay after load fade
        }
      } catch {}
    };

    // if loading already finished (event may have fired), show immediately
  const loadedFlag = window.__CHARLIE_SITE_LOADED__;
    if (loadedFlag) {
      maybeShow();
    } else {
      const onLoaded = () => {
        window.__CHARLIE_SITE_LOADED__ = true;
        maybeShow();
      };
      document.addEventListener('charlie:siteLoaded', onLoaded, { once: true });
      // Fallback: if no event fires (e.g., route without loading screen), still show after delay
      const fallbackTimer = setTimeout(() => {
        if (!window.__CHARLIE_SITE_LOADED__) {
          maybeShow();
        }
      }, 4000);
      return () => {
        document.removeEventListener('charlie:siteLoaded', onLoaded);
        clearTimeout(fallbackTimer);
      };
    }
  }, [showInitialModal]);

  // Persist messages
  useEffect(() => {
    if (settings.persist) {
      try { localStorage.setItem(STORAGE.MESSAGES, JSON.stringify(messages)); } catch {}
    }
  }, [messages, settings.persist]);

  // Persist settings
  useEffect(() => {
    try { localStorage.setItem(STORAGE.SETTINGS, JSON.stringify(settings)); } catch {}
  }, [settings]);

  // Scroll to bottom on new content
  const scrollBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  useEffect(() => { scrollBottom(); }, [messages, typing, scrollBottom]);


  // Removed visualViewport keyboard handler; using font-size and dvh fixes instead

  // Close when tapping outside on mobile (only if not fullscreen desktop mode)
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (window.matchMedia('(min-width: 768px)').matches) return; // only mobile
      if (!panelRef.current) return;
      if (panelRef.current.contains(e.target as Node)) return;
      // New behavior: only close if the tap is in the header / navigation area to avoid
      // accidental closures when user taps near bottom (theme switcher region or general content).
      const headerEl = document.querySelector('.header');
      if (headerEl && headerEl.contains(e.target as Node)) {
        closeChat();
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open, closeChat]);

  // Simple notification sound (generated programmatically)
  const playSound = useCallback(() => {
    if (!settings.sound) return;
    try {
      const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
      const AudioCtor = w.AudioContext || w.webkitAudioContext;
      if (!AudioCtor) return;
      const ctx: AudioContext = new AudioCtor();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 760;
      osc.connect(gain); gain.connect(ctx.destination);
      gain.gain.value = 0.12;
      osc.start();
      setTimeout(() => { gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25); osc.stop(ctx.currentTime + 0.26); }, 10);
    } catch {}
  }, [settings.sound]);

  // ---- Message sending ----
  const sendMessage = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const now = Date.now();
    if (now - lastSentAt < RATE_LIMIT_MS) {
      setMessages(m => [...m, { id: 'rate_'+now, content: withDog(`Please wait a moment before sending another question.`), sender: 'charlie', timestamp: now }]);
      return;
    }
    if (trimmed.length > MAX_CHARS) {
      setMessages(m => [...m, { id: 'len_'+now, content: withDog(`That message is too long. Keep it under ${MAX_CHARS} characters.`), sender: 'charlie', timestamp: now }]);
      return;
    }
    // Push user message
    const userMsg: ChatMessage = { id: 'u_'+now, content: trimmed, sender: 'user', timestamp: now };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLastSentAt(now);
    setLoading(true);
    setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId: sessionIdRef.current })
      });
      const data = await res.json();
      // Simulate natural typing delay 0.8 - 1.8s
      const delay = 800 + Math.random()*1000;
      setTimeout(() => {
        setTyping(false);
        const charMsg: ChatMessage = { id: 'c_'+Date.now(), content: withDog(data.message || 'Woof! Something went odd.'), sender: 'charlie', timestamp: Date.now() };
        setMessages(m => [...m, charMsg]);
        playSound();
        setLoading(false);
      }, delay);
  } catch {
      setTyping(false);
      setLoading(false);
      setMessages(m => [...m, { id: 'err_'+Date.now(), content: withDog('Woof! Network hiccup—try again shortly.'), sender: 'charlie', timestamp: Date.now() }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const quickAsk = (text: string) => sendMessage(text);

  const clearChat = () => {
    setMessages([]);
    try { localStorage.removeItem(STORAGE.MESSAGES); } catch {}
  };

  const closeWelcome = () => {
    setShowWelcome(false);
    try { localStorage.setItem(STORAGE.WELCOME, '1'); } catch {}
    openChat();
  };

  const remaining = MAX_CHARS - input.length;
  const limitClass = remaining < 0 ? 'text-error' : remaining < 40 ? 'text-warning' : 'text-base-content/60';
  const disabledSend = loading || typing || !input.trim() || remaining < 0;

  return (
    <>
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-base-100 border border-primary/30 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Image src="/charlie-bull.png" alt="Charlie Bull" width={96} height={96} className="w-24 h-24 object-contain" priority />
              </div>
              <h2 className="text-2xl font-bold mb-2">Chat with Charlie</h2>
              <p className="text-sm opacity-80 mb-4">Get quick, friendly DeFi explanations on staking, tokenomics, cross-chain moves, security and more. Ask anything—Charlie will fetch it (with a wag). 🐕</p>
              <div className="flex gap-2 justify-center">
                <button onClick={closeWelcome} className="btn btn-primary">Let&apos;s Chat 🚀</button>
                <button onClick={() => { setShowWelcome(false); try { localStorage.setItem(STORAGE.WELCOME,'1'); } catch {}; }} className="btn btn-ghost">Later</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      {!open && (
        <div className="fixed bottom-16 right-4 md:bottom-20 md:right-4 z-40">
          <button aria-label="Open chat" onClick={openChat} className="btn btn-primary btn-circle btn-sm md:btn-md shadow-lg hover:shadow-xl transition-all">
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      )}

      {open && (
        <div
          ref={panelRef}
          className={[
            'fixed flex flex-col z-[60] md:z-50',
            fullscreen
              ? 'inset-0 w-full'
              : [
                  // Mobile: truly fullscreen overlay
                  'inset-0',
                  // Desktop/Tablet: float near bottom-right with fixed height
                  'md:bottom-20 md:inset-x-auto md:right-4 md:top-auto md:left-auto md:h-[560px]',
                  'w-full md:w-96 max-w-full md:max-w-[calc(100vw-2rem)]'
                ].join(' ')
          ].join(' ')}
          style={(() => {
            const style: React.CSSProperties & { ['--header-height']?: string } = {};
            style['--header-height'] = `${headerOffset}px`;
            if (fullscreen) {
              style.top = headerOffset;
              style.height = `calc(100dvh - ${headerOffset}px)`;
            }
            return style;
          })()}
        >
          <div className="relative flex flex-col h-full overflow-hidden bg-base-100 md:bg-base-100 md:rounded-2xl md:shadow-xl border-t border-base-300 md:border md:border-base-300/70 md:backdrop-blur md:supports-[backdrop-filter]:bg-base-100/85">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-300 md:bg-base-300/90 md:backdrop-blur md:supports-[backdrop-filter]:bg-base-300/70 md:rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center overflow-hidden p-1 ring-1 ring-base-300">
                  <Image src="/charlie-bull.png" alt="Charlie Bull" width={40} height={40} className="w-full h-full object-contain drop-shadow" />
                </div>
                <div>
                  <p className="font-creambeige font-bold leading-tight text-lg tracking-wide">Charlie</p>
                  <p className="text-[11px] opacity-60 font-medium">AI DeFi Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button aria-label="Settings" onClick={() => setShowSettings(s => !s)} className="btn btn-ghost btn-sm btn-circle"><Settings size={16} /></button>
                <button aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={() => setFullscreen(f => !f)} className="btn btn-ghost btn-sm btn-circle hidden md:inline-flex">
                  {fullscreen ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                </button>
                <button
                  aria-label="Close"
                  onClick={() => {
                    if (pathname === '/chat') {
                      setFullscreen(false);
                      router.push('/'); // client-side nav avoids the loading screen
                    } else {
                      closeChat();
                      setFullscreen(false);
                    }
                  }}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {showSettings && (
              <div className="px-4 py-3 border-b border-base-300 bg-base-200/95 md:bg-base-200 text-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span>Sound notifications</span>
                  <button onClick={() => setSettings(p => ({ ...p, sound: !p.sound }))} className="btn btn-ghost btn-xs btn-circle" aria-label="Toggle sound">
                    {settings.sound ? <Volume2 size={16}/> : <VolumeX size={16}/>}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Persist history</span>
                  <input type="checkbox" className="toggle toggle-sm" checked={settings.persist} aria-label="Toggle persistence" onChange={() => setSettings(p => ({ ...p, persist: !p.persist }))} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Clear chat</span>
                  <button onClick={clearChat} className="btn btn-ghost btn-xs btn-circle text-error" aria-label="Clear chat"><Trash2 size={16}/></button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fullscreen (desktop)</span>
                  <button onClick={() => setFullscreen(f => !f)} className="btn btn-ghost btn-xs btn-circle hidden md:inline-flex" aria-label="Toggle fullscreen">
                    {fullscreen ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                  </button>
                </div>
              </div>
            )}

            {/* Messages area */}
            <div className={[ 
              'flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 text-sm bg-base-100 md:bg-base-50',
              // Reserve space for overlaid input bar at the bottom on mobile
              'pb-32',
              // On desktop/tablet, only reserve space in fullscreen mode; a bit more to clear the larger send button and spacing
              fullscreen ? 'md:pb-36' : 'md:pb-4'
            ].join(' ')} role="log" aria-live="polite">
              {messages.length === 0 && (
                <div className="text-center opacity-70">
                  <p className="text-lg mb-2">Start a conversation!</p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button onClick={() => quickAsk('Tell me about tokenomics')} className="btn btn-outline btn-xs">Tokenomics</button>
                    <button onClick={() => quickAsk('How does staking work?')} className="btn btn-outline btn-xs">Staking</button>
                    <button onClick={() => quickAsk('Explain cross-chain interoperability')} className="btn btn-outline btn-xs">Cross-Chain</button>
                    <button onClick={() => quickAsk('How to manage DeFi risk?')} className="btn btn-outline btn-xs">Risk</button>
                  </div>
                </div>
              )}
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] ${m.sender==='user' ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-xl px-3 py-2 ${m.sender==='user' ? 'bg-primary text-primary-content ml-1 shadow-sm' : 'bg-base-50 text-base-content mr-1 border border-base-300 shadow-sm'} transition-colors`}>
                      {m.sender==='charlie' && <div className="flex items-center gap-2 mb-1"><span className="inline-block w-5 h-5 rounded-md overflow-hidden bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 p-[1px] ring-1 ring-base-300"><Image src="/charlie-bull.png" alt="Charlie Bull" width={20} height={20} className="w-full h-full object-contain" /></span><span className="text-[10px] uppercase tracking-wide opacity-70 font-semibold">CHAR</span></div>}
                      <p className="whitespace-pre-wrap leading-snug">{m.content}</p>
                      <span className="block text-[10px] mt-1 opacity-50">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-base-50 text-base-content border border-base-300 rounded-xl px-3 py-2 mr-1 max-w-[60%] shadow-sm">
                    <div className="flex items-center gap-2 mb-1"><span className="inline-block w-5 h-5 rounded-md overflow-hidden bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 p-[1px] ring-1 ring-base-300"><Image src="/charlie-bull.png" alt="Charlie Bull" width={20} height={20} className="w-full h-full object-contain" /></span><span className="text-[10px] uppercase tracking-wide opacity-70 font-semibold">CHAR</span></div>
                    <div className="flex items-center gap-1 text-xs">
                      <span>Typing</span>
                      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            {/* Background tail: matches input area's blue and extends to footer.
                Visible: always on mobile; on desktop/tablet only when fullscreen. */}
            <div
              className={[
                'absolute left-0 right-0 bottom-0 z-0',
                'h-16',
                // Solid color to prevent translucent lightening differences
                'bg-base-300',
                // Visibility rules
                'block',
                'md:block'
              ].join(' ')}
            />

            <div className={[
              'border-base-300 bg-base-300',
              'pt-6 pb-2 md:pt-5 md:pb-2 px-3',
              // Overlay the input above the theme button: place it slightly above bottom on mobile
              'absolute left-0 right-0 bottom-1',
              // On desktop/tablet, overlay only when fullscreen; otherwise keep normal flow and nudge down a bit for centering in tail
              fullscreen ? 'md:absolute md:left-0 md:right-0 md:bottom-14' : 'md:relative md:border-t md:-mb-1',
              'z-10'
            ].join(' ')}>
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                  <input
                    aria-label="Chat input"
                    className={`input input-bordered input-sm h-9 md:h-12 flex-1 text-[16px] md:text-base ${remaining < 0 ? 'input-error' : ''}`}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask Charlie a DeFi question..."
                    maxLength={MAX_CHARS + 20}
                    disabled={loading || typing}
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    disabled={disabledSend}
                    className={[
                      'btn btn-primary btn-sm h-9 w-9 min-h-0 p-0 mt-0 flex items-center justify-center',
                      // Desktop/tablet: always use larger size for clearer alignment
                      'md:btn-md md:h-12 md:w-12'
                    ].join(' ')}
                  >
                    {loading
                      ? <Loader className="animate-spin w-4 h-4 md:w-8 md:h-8" />
                      : <Send className="w-4 h-4 md:w-8 md:h-8" />}
                  </button>
                </div>
                <div className="flex justify-between mt-1 text-[10px] px-1">
                  <span className={limitClass}>{remaining}/{MAX_CHARS}</span>
                  {(loading || typing) && <span className="opacity-70">Processing...</span>}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}