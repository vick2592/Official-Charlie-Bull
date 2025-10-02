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
  const [lowEndIOS, setLowEndIOS] = useState(false); // detect once and reuse
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
  const [theme, setTheme] = useState<'dark'|'light'>('dark');

  // Refs
  const endRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(`sess_${Date.now()}_${Math.random().toString(36).slice(2,10)}`);
  const scrollPosRef = useRef(0); // preserve scroll position to prevent jump
  const autoOpenedFromRouteRef = useRef(false);

  // Derived: standalone lightweight mode for older iPhones on /chat
  const standalone = pathname === '/chat' && lowEndIOS;
  const legacy = standalone; // alias for readability

  // Detect low-end iOS once on mount
  useEffect(() => {
    try {
      const ua = navigator.userAgent || '';
      const isIOS = /(iPhone|iPad|iPod)/i.test(ua);
      const m = ua.match(/OS (\d+)_/);
      const major = m ? parseInt(m[1], 10) : undefined;
      const smallScreen = Math.min(window.screen.width, window.screen.height) <= 375;
      const low = isIOS && ((typeof major === 'number' && major <= 14) || smallScreen);
      setLowEndIOS(!!low);
    } catch {
      setLowEndIOS(false);
    }
  }, []);

  // Track and control theme locally so settings can toggle it
  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem('theme') as 'dark'|'light') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next: 'dark'|'light' = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
      } catch {}
      return next;
    });
  }, []);

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
    // In standalone mode we don't lock scroll at all to avoid extra compositing layers
    if (standalone) {
      document.body.classList.remove('no-scroll');
      return;
    }
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
  }, [open, fullscreen, standalone]);

  // Expose chat-open state via body class and a custom event for other components (like ThemeSwitcher)
  useEffect(() => {
    try {
      const b = document.body;
      if (open) b.classList.add('chat-open'); else b.classList.remove('chat-open');
      const ev = new CustomEvent('charlie:chatOpenChange', { detail: { open } });
      document.dispatchEvent(ev);
    } catch {}
    return () => {
      try { document.body.classList.remove('chat-open'); } catch {}
    };
  }, [open]);

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
        if (Array.isArray(parsed)) setMessages(() => {
          const next = parsed as ChatMessage[];
          return legacy ? next.slice(-20) : next;
        });
      }
    } catch (e) {
      console.log('Init load error', e);
    }

    // Skip welcome modal entirely on /chat (lighter UX) or if explicitly disabled
    if (!showInitialModal || pathname === '/chat') return;

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
  }, [showInitialModal, pathname, standalone, legacy]);

  // Persist messages (skip in legacy mode entirely)
  useEffect(() => {
    if (legacy) return;
    if (settings.persist) {
      try {
        const toStore = messages;
        localStorage.setItem(STORAGE.MESSAGES, JSON.stringify(toStore));
      } catch {}
    }
  }, [messages, settings.persist, legacy]);

  // Persist settings
  useEffect(() => {
    try { localStorage.setItem(STORAGE.SETTINGS, JSON.stringify(settings)); } catch {}
  }, [settings]);

  // Scroll to bottom on new content
  const scrollBottom = useCallback(() => {
    const el = messagesRef.current;
    if (el) {
      // Jump directly to bottom within the scroll container to avoid scrolling the page
      el.scrollTop = el.scrollHeight;
    } else {
      // Fallback (should rarely happen)
      endRef.current?.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
    }
  }, []);
  useEffect(() => { scrollBottom(); }, [messages, typing, scrollBottom]);


  // Removed visualViewport keyboard handler; using font-size and dvh fixes instead

  // Close when tapping outside on mobile (only if not fullscreen desktop mode)
  useEffect(() => {
    if (!open || standalone) return; // no outside-close in standalone to reduce listeners
    const handler = (e: MouseEvent | TouchEvent) => {
      if (window.matchMedia('(min-width: 768px)').matches) return; // only mobile
      if (!panelRef.current) return;
      if (panelRef.current.contains(e.target as Node)) return;
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
  }, [open, closeChat, standalone]);

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
      setMessages((m: ChatMessage[]) => {
        const rateMsg: ChatMessage = { id: 'rate_'+now, content: withDog(`Please wait a moment before sending another question.`), sender: 'charlie', timestamp: now };
        const next: ChatMessage[] = [...m, rateMsg];
        return legacy ? next.slice(-20) : next;
      });
      return;
    }
    if (trimmed.length > MAX_CHARS) {
      setMessages((m: ChatMessage[]) => {
        const lenMsg: ChatMessage = { id: 'len_'+now, content: withDog(`That message is too long. Keep it under ${MAX_CHARS} characters.`), sender: 'charlie', timestamp: now };
        const next: ChatMessage[] = [...m, lenMsg];
        return legacy ? next.slice(-20) : next;
      });
      return;
    }
    // Push user message
    const userMsg: ChatMessage = { id: 'u_'+now, content: trimmed, sender: 'user', timestamp: now };
    setMessages((m: ChatMessage[]) => {
      const next: ChatMessage[] = [...m, userMsg];
      return legacy ? next.slice(-20) : next;
    });
    setInput('');
    setLastSentAt(now);
    setLoading(true);
    if (!legacy) setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId: sessionIdRef.current })
      });
      const data = await res.json();
      const charMsg: ChatMessage = { id: 'c_'+Date.now(), content: withDog(data.message || 'Woof! Something went odd.'), sender: 'charlie', timestamp: Date.now() };
      if (!legacy) {
        // non-legacy: natural delay and typing feedback
        const delay = 800 + Math.random()*1000;
        setTimeout(() => {
          setTyping(false);
          setMessages((m: ChatMessage[]) => {
            const next: ChatMessage[] = [...m, charMsg];
            return next;
          });
          playSound();
          setLoading(false);
        }, delay);
      } else {
        // legacy: immediate response, no sound/typing
        setMessages((m: ChatMessage[]) => {
          const next: ChatMessage[] = [...m, charMsg];
          return next.slice(-20);
        });
        setLoading(false);
      }
  } catch {
      if (!legacy) setTyping(false);
      setLoading(false);
      setMessages((m: ChatMessage[]) => {
        const errMsg: ChatMessage = { id: 'err_'+Date.now(), content: withDog('Woof! Network hiccup—try again shortly.'), sender: 'charlie', timestamp: Date.now() };
        const next: ChatMessage[] = [...m, errMsg];
        return legacy ? next.slice(-20) : next;
      });
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
          className={(function(){
            if (standalone) {
              // Simple page layout: no fixed positioning or shadows
              return 'relative flex flex-col z-10 w-full h-[calc(100dvh-0px)]';
            }
            return [
              'fixed flex flex-col z-[60] md:z-50',
              fullscreen
                ? 'inset-0 w-full'
                : [
                    'inset-0',
                    'md:bottom-20 md:inset-x-auto md:right-4 md:top-auto md:left-auto md:h-[560px]',
                    'w-full md:w-96 max-w-full md:max-w-[calc(100vw-2rem)]'
                  ].join(' ')
            ].join(' ');
          })()}
          style={(() => {
            const style: React.CSSProperties & { ['--header-height']?: string } = {};
            style['--header-height'] = `${headerOffset}px`;
            if (!standalone && fullscreen) {
              style.top = headerOffset;
              style.height = `calc(100dvh - ${headerOffset}px)`;
            }
            return style;
          })()}
        >
          <div className={[
            'relative flex flex-col h-full overflow-hidden bg-base-100',
            standalone ? 'border-t border-base-300' : 'md:bg-base-100 md:rounded-2xl md:shadow-xl border-t border-base-300 md:border md:border-base-300/70 md:backdrop-blur md:supports-[backdrop-filter]:bg-base-100/85'
          ].join(' ')}>
            {/* Header */}
            <div className={[
              'flex items-center justify-between px-4 py-3 border-b border-base-300',
              standalone ? 'bg-base-200' : 'bg-base-300 md:bg-base-300/90 md:backdrop-blur md:supports-[backdrop-filter]:bg-base-300/70 md:rounded-t-2xl'
            ].join(' ')}>
              <div className="flex items-center gap-3">
                {legacy ? (
                  <div className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center text-xs font-bold">C</div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center overflow-hidden p-1 ring-1 ring-base-300">
                    <Image src="/charlie-bull.png" alt="Charlie Bull" width={40} height={40} className="w-full h-full object-contain drop-shadow" />
                  </div>
                )}
                <div>
                  <p className="font-creambeige font-bold leading-tight text-lg tracking-wide">Charlie</p>
                  {!legacy && <p className="text-[11px] opacity-60 font-medium">AI DeFi Assistant</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!legacy && <button aria-label="Settings" onClick={() => setShowSettings(s => !s)} className="btn btn-ghost btn-sm btn-circle"><Settings size={16} /></button>}
                {!standalone && (
                <button aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={() => setFullscreen(f => !f)} className="btn btn-ghost btn-sm btn-circle hidden md:inline-flex">
                  {fullscreen ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                </button>
                )}
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

            {showSettings && !legacy && (
              <div className="px-4 py-3 border-b border-base-300 bg-base-200 text-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span>Sound notifications</span>
                  <button onClick={() => setSettings(p => ({ ...p, sound: !p.sound }))} className="btn btn-ghost btn-xs btn-circle" aria-label="Toggle sound">
                    {settings.sound ? <Volume2 size={16}/> : <VolumeX size={16}/>}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Theme</span>
                  <button onClick={toggleTheme} className="btn btn-ghost btn-xs btn-circle" aria-label="Toggle theme">
                    {theme === 'dark' ? (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
                    ) : (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
                    )}
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
                {!standalone && (
                  <div className="flex items-center justify-between">
                    <span>Fullscreen (desktop)</span>
                    <button onClick={() => setFullscreen(f => !f)} className="btn btn-ghost btn-xs btn-circle hidden md:inline-flex" aria-label="Toggle fullscreen">
                      {fullscreen ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Messages area */}
            <div ref={messagesRef} className={[
              'flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 text-sm bg-base-100',
              standalone ? 'pb-4' : 'pb-32',
              !standalone && (fullscreen ? 'md:pb-36' : 'md:pb-4')
            ].filter(Boolean).join(' ')} role="log" aria-live="polite">
              {messages.length === 0 && !legacy && (
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
                    <div className={`rounded-xl px-3 py-2 ${m.sender==='user' ? 'bg-primary text-primary-content ml-1 shadow-sm' : legacy ? 'bg-base-200 text-base-content mr-1' : 'bg-base-50 text-base-content mr-1 border border-base-300 shadow-sm'} transition-colors`}>
                      {m.sender==='charlie' && (
                        legacy ? (
                          <div className="text-[10px] uppercase tracking-wide opacity-70 font-semibold mb-1">C</div>
                        ) : (
                          <div className="flex items-center gap-2 mb-1"><span className="inline-block w-5 h-5 rounded-md overflow-hidden bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 p-[1px] ring-1 ring-base-300"><Image src="/charlie-bull.png" alt="Charlie Bull" width={20} height={20} className="w-full h-full object-contain" /></span><span className="text-[10px] uppercase tracking-wide opacity-70 font-semibold">CHAR</span></div>
                        )
                      )}
                      <p className="whitespace-pre-wrap leading-snug">{m.content}</p>
                      {!legacy && <span className="block text-[10px] mt-1 opacity-50">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {typing && !legacy && (
                <div className="flex justify-start">
                  <div className="bg-base-50 text-base-content border border-base-300 rounded-xl px-3 py-2 mr-1 max-w-[60%] shadow-sm">
                    <div className="flex items-center gap-2 mb-1"><span className="inline-block w-5 h-5 rounded-md overflow-hidden bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 p-[1px] ring-1 ring-base-300"><Image src="/charlie-bull.png" alt="Charlie Bull" width={20} height={20} className="w-full h-full object-contain" /></span><span className="text-[10px] uppercase tracking-wide opacity-70 font-semibold">CHAR</span></div>
                    {standalone ? (
                      <div className="text-xs">Typing…</div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs">
                        <span>Typing</span>
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            {/* Background tail: matches input area's blue and extends to footer.
                Visible: always on mobile; on desktop/tablet only when fullscreen. */}
            {!standalone && (
              <div
                className={[
                  'absolute left-0 right-0 bottom-0 z-0',
                  'h-16',
                  'bg-base-300',
                  'block',
                  'md:block'
                ].join(' ')}
              />
            )}

            <div className={[
              'border-base-300 bg-base-300',
              standalone ? 'pt-4 pb-2 px-3 relative border-t' : 'pt-6 pb-2 md:pt-5 md:pb-2 px-3 absolute left-0 right-0 bottom-1 z-10',
              !standalone && (fullscreen ? 'md:absolute md:left-0 md:right-0 md:bottom-14' : 'md:relative md:border-t md:-mb-1')
            ].filter(Boolean).join(' ')}>
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