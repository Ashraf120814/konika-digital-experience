import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, Mic, MicOff, Minus, Phone, Send, X } from 'lucide-react';
import {
  buildRecord,
  createConversationId,
  emptyContext,
  processMessage,
  welcomeMessage,
  type AgentContext,
} from '../agent';
import type { ChatMessage, ConversationResult, QueryCategory, Sentiment, Priority } from '../../types/saru';
import { upsertConversation } from '../services/conversationStore';
import { sendEscalationEmail } from '../services/emailService';

type WidgetMode = 'closed' | 'chat' | 'voice';

function mid() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function SaruWidget() {
  const [mode, setMode] = useState<WidgetMode>('closed');
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ctx, setCtx] = useState<AgentContext>(emptyContext());
  const [conversationId, setConversationId] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [meta, setMeta] = useState({
    category: 'General' as QueryCategory,
    subcategory: 'General',
    sentiment: 'Neutral' as Sentiment,
    priority: 'Low' as Priority,
    confidence: 90,
    actions: [] as string[],
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const closedRef = useRef(false);

  useEffect(() => {
    setVoiceSupported(
      typeof window !== 'undefined' &&
        !!(window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition)
    );
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const persistClose = useCallback(
    async (
      msgs: ChatMessage[],
      context: AgentContext,
      result: ConversationResult,
      resolution: string,
      channel: 'Chat' | 'Voice'
    ) => {
      if (!conversationId || !startedAt || msgs.filter((m) => m.role === 'customer').length === 0) {
        return;
      }
      const record = buildRecord({
        conversationId,
        channel,
        messages: msgs,
        ctx: context,
        category: meta.category,
        subcategory: meta.subcategory,
        sentiment: meta.sentiment,
        priority: meta.priority,
        result,
        confidence: meta.confidence,
        actions: meta.actions,
        resolution,
        startedAt,
        endedAt: new Date().toISOString(),
      });
      upsertConversation(record);
      if (result === 'Human Escalation') {
        await sendEscalationEmail(record);
      }
    },
    [conversationId, startedAt, meta]
  );

  const openChat = (asVoice = false) => {
    closedRef.current = false;
    const id = createConversationId();
    const start = new Date().toISOString();
    const welcome: ChatMessage = {
      id: mid(),
      role: 'saru',
      content: welcomeMessage(),
      timestamp: start,
    };
    setConversationId(id);
    setStartedAt(start);
    setMessages([welcome]);
    setCtx(emptyContext());
    setMode(asVoice ? 'voice' : 'chat');
    setMinimized(false);
    setMeta({
      category: 'General',
      subcategory: 'Greeting',
      sentiment: 'Neutral',
      priority: 'Low',
      confidence: 95,
      actions: ['Session started'],
    });
  };

  const closeWidget = async (abandoned = false) => {
    if (closedRef.current) {
      setMode('closed');
      return;
    }
    closedRef.current = true;
    const channel = mode === 'voice' ? 'Voice' : 'Chat';
    const result: ConversationResult = abandoned
      ? 'Customer Abandoned'
      : ctx.escalate
        ? 'Human Escalation'
        : messages.some((m) => m.role === 'customer')
          ? 'Resolved'
          : 'Customer Abandoned';
    await persistClose(
      messages,
      ctx,
      result,
      ctx.escalate ? 'Escalated to human support' : 'Session closed',
      channel
    );
    setMode('closed');
    setListening(false);
    recognitionRef.current?.stop();
  };

  const runTurn = async (text: string, fromVoice = false) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: mid(),
      role: 'customer',
      content: text.trim(),
      timestamp: new Date().toISOString(),
      isVoice: fromVoice,
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setTyping(true);

    // Simulated latency for natural feel
    await new Promise((r) => setTimeout(r, 450 + Math.random() * 400));

    const reply = processMessage(text, ctx);
    const saruMsg: ChatMessage = {
      id: mid(),
      role: 'saru',
      content: reply.text,
      timestamp: new Date().toISOString(),
      isVoice: fromVoice,
    };
    const finalMessages = [...nextMessages, saruMsg];
    setMessages(finalMessages);
    setCtx(reply.context);
    setMeta({
      category: reply.category,
      subcategory: reply.subcategory,
      sentiment: reply.sentiment,
      priority: reply.priority,
      confidence: reply.confidence,
      actions: [...meta.actions, ...reply.actions],
    });
    setTyping(false);

    // Voice TTS
    if (fromVoice && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(reply.text.replace(/\*\*/g, ''));
      utter.rate = 1;
      utter.pitch = 1.05;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }

    if (reply.shouldEscalate || reply.endConversation) {
      const result: ConversationResult = reply.shouldEscalate
        ? 'Human Escalation'
        : 'Resolved';
      await persistClose(
        finalMessages,
        reply.context,
        result,
        reply.shouldEscalate
          ? reply.escalationReason || 'Escalated'
          : reply.text.slice(0, 200),
        fromVoice || mode === 'voice' ? 'Voice' : 'Chat'
      );
      closedRef.current = true;
    }
  };

  const onSend = () => void runTurn(input, mode === 'voice');

  const toggleMic = () => {
    const SR =
      window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition })
        .webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition is not supported in this browser. You can still type to Saru.');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (ev: SpeechRecognitionEvent) => {
      const transcript = ev.results[0]?.[0]?.transcript;
      if (transcript) void runTurn(transcript, true);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };

  // Floating launcher
  if (mode === 'closed') {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => openChat(true)}
          className="hidden sm:flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal px-4 py-2.5 text-[11px] tracking-widest uppercase text-ivory shadow-lg hover:bg-gold-dark transition-colors"
        >
          <Phone className="h-3.5 w-3.5 text-gold" />
          Call Saru
        </button>
        <button
          type="button"
          onClick={() => openChat(false)}
          className="flex items-center gap-2 rounded-full bg-charcoal px-5 py-3.5 text-[11px] tracking-widest uppercase text-ivory shadow-xl hover:bg-gold-dark transition-colors"
          aria-label="Chat with Saru"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-gold text-xs font-serif">
            S
          </span>
          Chat with Saru
          <MessageCircle className="h-4 w-4 text-gold" />
        </button>
      </div>
    );
  }

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-charcoal px-4 py-3 text-ivory shadow-xl"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Saru · available
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex w-[min(100vw-1.5rem,380px)] flex-col overflow-hidden rounded-lg border border-charcoal/10 bg-ivory shadow-2xl"
      style={{ height: 'min(560px, calc(100vh - 2rem))' }}
      role="dialog"
      aria-label="Chat with Saru"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-charcoal/8 bg-charcoal px-4 py-3 text-ivory">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/30 font-serif text-lg text-gold-light">
            S
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-charcoal bg-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-base leading-tight">Saru</p>
          <p className="text-[10px] tracking-wide text-ivory/60">
            AI Customer Support · {mode === 'voice' ? 'Voice' : 'Chat'} · Online
          </p>
        </div>
        <button type="button" className="p-1.5 hover:text-gold" onClick={() => setMinimized(true)} aria-label="Minimize">
          <Minus className="h-4 w-4" />
        </button>
        <button type="button" className="p-1.5 hover:text-gold" onClick={() => void closeWidget(true)} aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-ivory">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'customer' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'customer'
                  ? 'bg-charcoal text-ivory rounded-br-md'
                  : 'bg-white border border-charcoal/8 text-charcoal rounded-bl-md'
              }`}
            >
              {m.content.replace(/\*\*(.*?)\*\*/g, '$1')}
              {m.isVoice && (
                <span className="mt-1 block text-[9px] uppercase tracking-wider opacity-50">Voice</span>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-charcoal/8 bg-white px-4 py-3">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-charcoal/8 bg-white p-3">
        <div className="flex items-end gap-2">
          {voiceSupported && (
            <button
              type="button"
              onClick={toggleMic}
              className={`rounded-full p-2.5 transition-colors ${
                listening ? 'bg-red-500 text-white' : 'bg-ivory-deep text-charcoal hover:bg-gold/20'
              }`}
              aria-label={listening ? 'Stop listening' : 'Speak to Saru'}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={listening ? 'Listening…' : 'Type your message…'}
            className="flex-1 resize-none rounded-lg border border-charcoal/12 bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!input.trim() || typing}
            className="rounded-full bg-charcoal p-2.5 text-ivory hover:bg-gold-dark disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 text-[9px] text-muted text-center">
          Saru is an AI assistant · Demo orders: KJ10245, KJ10246, KJ10247
        </p>
      </div>
    </div>
  );
}

// Web Speech API typings (subset)
interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}
