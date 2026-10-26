import { useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { BookOpen, Brain, CalendarDays, Check, ChevronRight, CircleHelp, Clock3, Compass, FileText, GraduationCap, Languages, LoaderCircle, MessageCircle, NotebookPen, Send, Sparkles, Target, Wifi, X } from 'lucide-react';
import type { StudyChatTurn, StudyGenerationInput, StudyGenerationInputIntent, StudyGenerationResponse } from '@workspace/api-client-react';
import { useGenerateStudyContent, useHealthCheck } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import './index.css';

const queryClient = new QueryClient();

const navItems = [
  { href: '/', label: 'My dashboard', icon: Compass },
  { href: '/chat', label: 'Study chat', icon: MessageCircle },
  { href: '/homework', label: 'Homework help', icon: GraduationCap },
  { href: '/notes', label: 'Chapter notes', icon: NotebookPen },
  { href: '/quiz', label: 'Quiz & MCQs', icon: Brain },
  { href: '/planner', label: 'Study planner', icon: CalendarDays },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? 'mobile-brand' : 'brand'}>
    <span className="brand-mark"><BookOpen size={20} strokeWidth={2.4} /></span>
    <span><span className="brand-name">AI 4 STUDENT</span>{!compact && <span className="brand-sub">YOUR STUDY SIDEKICK</span>}</span>
  </div>;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const health = useHealthCheck({ query: { queryKey: ['/api/healthz'], refetchInterval: 60000, retry: 1 } });
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/" className="brand"><span className="brand-mark"><BookOpen size={20} strokeWidth={2.4} /></span><span><span className="brand-name">AI 4 STUDENT</span><span className="brand-sub">YOUR STUDY SIDEKICK</span></span></Link>
      <div className="nav-caption">Your learning space</div>
      <nav aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} data-testid={`link-nav-${href === '/' ? 'dashboard' : href.slice(1)}`} className={`nav-link ${location === href ? 'active' : ''}`}><Icon size={18} /><span>{label}</span></Link>)}
      </nav>
      <div className="side-note">
        <div style={{ display: 'flex', gap: 9, alignItems: 'center', fontWeight: 700, fontSize: 13 }}><Sparkles size={16} /> Your pace, your way</div>
        <p style={{ fontSize: 11, lineHeight: 1.6, margin: '8px 0 0', color: '#777ca0' }}>Ask in English or Hindi. We’ll make the tricky bits clearer.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '15px 11px 0', color: health.isError ? '#bd6671' : '#8a91a8', fontSize: 11 }} data-testid="status-service">
        {health.isLoading ? <LoaderCircle size={13} className="loading-pulse" /> : health.isError ? <X size={13} /> : <Wifi size={13} />}
        {health.isLoading ? 'Checking study service' : health.isError ? 'Service status unavailable' : `Study service ${health.data?.status ?? 'ready'}`}
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar">
        <Brand compact />
        <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Languages size={16} color="#626dd0" /> Learn in English or Hindi</div>
      </header>
      <div className="content page-enter">{children}</div>
      <nav className="bottom-nav" aria-label="Quick navigation">
        {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={location === href ? 'active' : ''} data-testid={`mobile-nav-${href === '/' ? 'dashboard' : href.slice(1)}`}><Icon /><span>{label === 'My dashboard' ? 'Home' : label.split(' ')[0]}</span></Link>)}
      </nav>
    </main>
  </div>;
}

const features: { href: string; title: string; blurb: string; icon: typeof MessageCircle; color: string; tint: string; action: string }[] = [
  { href: '/chat', title: 'Study chat', blurb: 'Ask anything. Get a clear, friendly explanation.', icon: MessageCircle, color: '#5968ce', tint: '#eff0ff', action: 'Start a chat' },
  { href: '/homework', title: 'Homework help', blurb: 'Work through a question one step at a time.', icon: GraduationCap, color: '#8c62c9', tint: '#f5efff', action: 'Get unstuck' },
  { href: '/notes', title: 'Chapter notes', blurb: 'Turn a chapter or topic into quick revision notes.', icon: FileText, color: '#39999b', tint: '#eaf8f7', action: 'Make notes' },
  { href: '/quiz', title: 'Quiz & MCQs', blurb: 'Practise a topic and check what you know.', icon: Brain, color: '#d28b42', tint: '#fff5e9', action: 'Take a quiz' },
  { href: '/planner', title: 'Study planner', blurb: 'Shape your available time into a practical plan.', icon: CalendarDays, color: '#d3678a', tint: '#fff0f5', action: 'Plan study time' },
];

function Dashboard() {
  return <>
    <div className="hero-panel" style={{ marginBottom: 27 }}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 610 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#ffffff20', border: '1px solid #ffffff2b', borderRadius: 20, padding: '6px 10px', fontSize: 11, fontWeight: 700, marginBottom: 17 }}><Sparkles size={13} /> A little help goes a long way</div>
        <h1 style={{ font: '800 clamp(27px,4vw,39px)/1.13 Manrope,sans-serif', letterSpacing: '-1.2px', margin: '0 0 11px' }}>Your next big idea<br />starts with a question.</h1>
        <p style={{ margin: 0, color: '#e7e8ff', fontSize: 14, lineHeight: 1.65, maxWidth: 440 }}>Study at your own pace with friendly explanations, useful notes and a plan that fits your day.</p>
        <Link href="/chat" className="primary-button" style={{ marginTop: 22, display: 'inline-flex', background: '#fff', color: '#4e59be', textDecoration: 'none' }} data-testid="button-hero-chat">Ask your first question <ChevronRight size={16} /></Link>
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', right: 48, bottom: 20, opacity: .24, transform: 'rotate(-9deg)' }}><BookOpen size={132} strokeWidth={1} /></div>
    </div>
    <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 15 }}>
      <div><div className="eyebrow" style={{ marginBottom: 6 }}>PICK UP WHERE YOU ARE</div><h2 style={{ font: '750 21px Manrope,sans-serif', letterSpacing: '-.5px', margin: 0 }}>What would help today?</h2></div>
      <span className="eyebrow" style={{ display: 'flex', gap: 5, alignItems: 'center' }}><Languages size={14} /> Bilingual support</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,205px),1fr))', gap: 14 }}>
      {features.map(({ href, title, blurb, icon: Icon, color, tint, action }) => <Link key={href} href={href} className="surface feature-card" data-testid={`card-feature-${href.slice(1)}`}>
        <div className="feature-icon" style={{ background: tint, color }}><Icon size={20} /></div>
        <div style={{ font: '750 16px Manrope,sans-serif', marginTop: 18, letterSpacing: '-.3px' }}>{title}</div>
        <p style={{ color: '#7b8299', fontSize: 12, lineHeight: 1.55, margin: '7px 0 13px' }}>{blurb}</p>
        <div style={{ marginTop: 'auto', color, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>{action}<ChevronRight size={14} /></div>
      </Link>)}
    </div>
    <div className="surface" style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, padding: '17px 20px' }}>
      <div className="feature-icon" style={{ background: '#f0f3fb', color: '#65709c', flexShrink: 0 }}><Target size={19} /></div>
      <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>Small steps count</div><div className="eyebrow" style={{ marginTop: 4 }}>Choose one topic, then take it one question at a time.</div></div>
      <Link href="/planner" className="secondary-button" style={{ textDecoration: 'none' }} data-testid="button-dashboard-plan">Make a plan <ChevronRight size={14} /></Link>
    </div>
  </>;
}

type ToolConfig = { intent: StudyGenerationInputIntent; title: string; subtitle: string; icon: typeof Brain; promptLabel: string; placeholder: string; button: string; showSubject?: boolean; showGrade?: boolean; showCount?: boolean; showHours?: boolean };
const toolConfigs: Record<string, ToolConfig> = {
  '/homework': { intent: 'explain', title: 'Homework, one step at a time', subtitle: 'Let’s understand the question first, then work through it together.', icon: GraduationCap, promptLabel: 'What question are you working on?', placeholder: 'Paste your homework question here…', button: 'Explain step by step', showSubject: true, showGrade: true },
  '/notes': { intent: 'notes', title: 'Notes that make sense', subtitle: 'Create clear revision notes from a chapter, topic or key idea.', icon: NotebookPen, promptLabel: 'Which chapter or topic?', placeholder: 'For example: photosynthesis, class 8…', button: 'Create my notes', showSubject: true, showGrade: true },
  '/quiz': { intent: 'quiz', title: 'Ready for a quick check?', subtitle: 'Build a practice quiz around exactly what you’re learning.', icon: Brain, promptLabel: 'What should the quiz cover?', placeholder: 'For example: fractions, the water cycle…', button: 'Make my quiz', showSubject: true, showGrade: true, showCount: true },
  '/planner': { intent: 'timetable', title: 'Make room for studying', subtitle: 'Tell us how much time you have. We’ll suggest a study timetable.', icon: CalendarDays, promptLabel: 'What would you like to study?', placeholder: 'List subjects or topics you want to fit in…', button: 'Build my study plan', showHours: true },
};

function LanguagePicker({ language, setLanguage }: { language: 'english' | 'hindi'; setLanguage: (value: 'english' | 'hindi') => void }) {
  return <div className="segmented" aria-label="Response language">
    <button type="button" onClick={() => setLanguage('english')} className={language === 'english' ? 'selected' : ''} data-testid="button-language-english">English</button>
    <button type="button" onClick={() => setLanguage('hindi')} className={language === 'hindi' ? 'selected' : ''} data-testid="button-language-hindi">हिन्दी</button>
  </div>;
}

function ResultPanel({ response, title = 'Here’s your study help', onClear }: { response: StudyGenerationResponse | null; title?: string; onClear: () => void }) {
  if (!response) return null;
  return <section className="surface page-enter" style={{ marginTop: 22, padding: '22px 24px' }} data-testid="result-study-response">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span className="feature-icon" style={{ width: 34, height: 34, borderRadius: 11, background: '#f0f0ff', color: '#5967c9' }}><Sparkles size={17} /></span><div><div style={{ fontWeight: 750, fontSize: 14 }}>{title}</div><div className="eyebrow" style={{ fontSize: 10, marginTop: 2 }}>{response.language === 'hindi' ? 'हिन्दी' : 'English'} · {response.model}</div></div></div>
      <button className="secondary-button" onClick={onClear} aria-label="Clear response" data-testid="button-clear-response"><X size={15} /><span className="hidden sm:inline">Clear</span></button>
    </div>
    <div className="result-box" data-testid="text-generated-response">{response.answer}</div>
    <div className="eyebrow" style={{ borderTop: '1px solid #eff0f5', marginTop: 16, paddingTop: 12, fontSize: 10 }}>Made for your learning journey · {new Date(response.createdAt).toLocaleString()}</div>
  </section>;
}

function ErrorNotice({ retry }: { retry: () => void }) {
  return <div role="alert" style={{ marginTop: 14, padding: '13px 15px', background: '#fff1f1', color: '#a54f59', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 13 }} data-testid="status-generation-error">
    <span>We couldn’t get a response just now. Please check your connection and try again.</span><button className="secondary-button" onClick={retry} style={{ color: '#a54f59' }} data-testid="button-retry">Try again</button>
  </div>;
}

function ToolPage({ config }: { config: ToolConfig }) {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [studyHours, setStudyHours] = useState(2);
  const [response, setResponse] = useState<StudyGenerationResponse | null>(null);
  const [lastInput, setLastInput] = useState<StudyGenerationInput | null>(null);
  const generation = useGenerateStudyContent({ mutation: { onSuccess: (result) => setResponse(result) } });
  const Icon = config.icon;
  const send = (input: StudyGenerationInput) => { setLastInput(input); setResponse(null); generation.mutate({ data: input }); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    const input: StudyGenerationInput = { intent: config.intent, prompt: prompt.trim(), language, ...(subject.trim() ? { subject: subject.trim() } : {}), ...(grade.trim() ? { grade: grade.trim() } : {}), ...(config.showCount ? { questionCount } : {}), ...(config.showHours ? { studyHours } : {}) };
    send(input);
  };
  return <>
    <div style={{ marginBottom: 24 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>STUDY TOOLS / {config.title.toUpperCase()}</div>
      <h1 className="page-title" data-testid="text-page-title">{config.title}</h1>
      <p style={{ color: '#777f99', fontSize: 14, lineHeight: 1.6, margin: '9px 0 0' }}>{config.subtitle}</p>
    </div>
    <form className="surface" onSubmit={submit} style={{ padding: '23px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="feature-icon" style={{ background: '#f0f1ff', color: '#5967c9' }}><Icon size={20} /></span><div style={{ font: '750 15px Manrope,sans-serif' }}>Let’s get started</div></div>
        <LanguagePicker language={language} setLanguage={setLanguage} />
      </div>
      <label htmlFor="study-prompt" style={{ display: 'block', fontWeight: 700, fontSize: 12, marginBottom: 8 }}>{config.promptLabel}</label>
      <textarea id="study-prompt" className="form-control" value={prompt} onChange={event => setPrompt(event.target.value)} placeholder={config.placeholder} rows={4} maxLength={5000} required data-testid="input-study-prompt" />
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ba1b3', fontSize: 10, marginTop: 5 }}><span>Specific questions get more helpful answers.</span><span>{prompt.length}/5000</span></div>
      {(config.showSubject || config.showGrade || config.showCount || config.showHours) && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(145px,1fr))', gap: 12, marginTop: 17 }}>
        {config.showSubject && <label style={{ fontSize: 11, fontWeight: 700, color: '#707791' }}>Subject <input className="form-control" style={{ marginTop: 7 }} value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Science" maxLength={80} data-testid="input-subject" /></label>}
        {config.showGrade && <label style={{ fontSize: 11, fontWeight: 700, color: '#707791' }}>Grade <input className="form-control" style={{ marginTop: 7 }} value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g. Grade 8" maxLength={40} data-testid="input-grade" /></label>}
        {config.showCount && <label style={{ fontSize: 11, fontWeight: 700, color: '#707791' }}>Number of questions <select className="form-control" style={{ marginTop: 7 }} value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))} data-testid="select-question-count">{[5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n} questions</option>)}</select></label>}
        {config.showHours && <label style={{ fontSize: 11, fontWeight: 700, color: '#707791' }}>Available study hours <select className="form-control" style={{ marginTop: 7 }} value={studyHours} onChange={e => setStudyHours(Number(e.target.value))} data-testid="select-study-hours">{Array.from({ length: 12 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? 'hour' : 'hours'}</option>)}</select></label>}
      </div>}
      {config.showHours && <div style={{ background: '#f7f6ff', color: '#6d6b93', borderRadius: 11, padding: '11px 13px', marginTop: 15, display: 'flex', alignItems: 'center', gap: 9, fontSize: 11 }}><Clock3 size={16} color="#7269c2" /> Your plan will be based on {studyHours} available {studyHours === 1 ? 'hour' : 'hours'}.</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}><button className="primary-button" type="submit" disabled={generation.isPending || !prompt.trim()} data-testid="button-generate"><span>{generation.isPending ? 'Working on it…' : config.button}</span>{generation.isPending ? <LoaderCircle size={16} className="loading-pulse" /> : <ChevronRight size={16} />}</button></div>
      {generation.isError && <ErrorNotice retry={() => lastInput && send(lastInput)} />}
    </form>
    {generation.isPending && <div className="surface" style={{ marginTop: 22, padding: 22 }} aria-live="polite" data-testid="status-generating"><div className="loading-pulse" style={{ color: '#747b9b', fontSize: 13 }}>Putting together a clear, helpful answer…</div><div style={{ height: 8, background: '#eef0f8', borderRadius: 8, marginTop: 14, width: '88%' }} /><div style={{ height: 8, background: '#eef0f8', borderRadius: 8, marginTop: 8, width: '73%' }} /><div style={{ height: 8, background: '#eef0f8', borderRadius: 8, marginTop: 8, width: '54%' }} /></div>}
    <ResultPanel response={response} title={config.intent === 'timetable' ? 'Your study timetable' : config.intent === 'quiz' ? 'Your practice quiz' : config.intent === 'notes' ? 'Your chapter notes' : 'Step-by-step help'} onClear={() => setResponse(null)} />
    {!response && !generation.isPending && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 17, color: '#949bb0', fontSize: 11 }}><Check size={14} color="#56a597" /> No pressure to get it perfect. Start with what you know.</div>}
  </>;
}

function StudyChat() {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [text, setText] = useState('');
  const [history, setHistory] = useState<StudyChatTurn[]>([]);
  const [response, setResponse] = useState<StudyGenerationResponse | null>(null);
  const [lastPrompt, setLastPrompt] = useState('');
  const generation = useGenerateStudyContent({ mutation: { onSuccess: result => { setResponse(result); setHistory(previous => [...previous, { role: 'model' as const, text: result.answer }].slice(-12)); } } });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const clean = text.trim();
    if (!clean || generation.isPending) return;
    const turns = [...history, { role: 'user' as const, text: clean }].slice(-12);
    setHistory(turns);
    setText('');
    setResponse(null);
    setLastPrompt(clean);
    generation.mutate({ data: { intent: 'chat', prompt: clean, language, history: turns } });
  };
  const retry = () => {
    if (!lastPrompt) return;
    generation.mutate({ data: { intent: 'chat', prompt: lastPrompt, language, history: history.slice(-12) } });
  };
  return <>
    <div style={{ marginBottom: 21 }}><div className="eyebrow" style={{ marginBottom: 8 }}>YOUR FRIENDLY STUDY SPACE</div><h1 className="page-title">Ask away. We’re listening.</h1><p style={{ color: '#777f99', fontSize: 14, margin: '9px 0 0' }}>No question is too small. Get a clear explanation in your language.</p></div>
    <div className="surface" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '15px 19px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eff0f5' }}><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span className="feature-icon" style={{ width: 35, height: 35, borderRadius: 11, background: '#eff0ff', color: '#5968ce' }}><MessageCircle size={18} /></span><div><div style={{ fontWeight: 750, fontSize: 13 }}>Study chat</div><div className="eyebrow" style={{ fontSize: 10 }}>A helpful answer, one message at a time</div></div></div><LanguagePicker language={language} setLanguage={setLanguage} /></div>
      <div style={{ minHeight: 300, maxHeight: '52vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, padding: '21px 18px' }} data-testid="chat-conversation">
        {history.length === 0 && !generation.isPending && <div style={{ margin: 'auto', maxWidth: 350, textAlign: 'center', padding: 20 }}><div className="feature-icon" style={{ margin: '0 auto 14px', width: 52, height: 52, background: '#f0f1ff', color: '#5c69cd', borderRadius: 17 }}><Sparkles size={24} /></div><div style={{ font: '750 17px Manrope,sans-serif' }}>What are you curious about?</div><p style={{ color: '#848ba2', fontSize: 12, lineHeight: 1.6 }}>Try asking about a tough topic, a homework question or something you want to understand better.</p></div>}
        {history.map((turn, index) => <div key={`${index}-${turn.role}`} className={turn.role === 'user' ? 'chat-user' : 'chat-model'} style={{ alignSelf: turn.role === 'user' ? 'flex-end' : 'flex-start' }} data-testid={`chat-message-${index}`}>{turn.text}</div>)}
        {generation.isPending && <div className="chat-model loading-pulse" aria-live="polite">Thinking it through…</div>}
      </div>
      {generation.isError && <div style={{ padding: '0 18px' }}><ErrorNotice retry={retry} /></div>}
      <form onSubmit={submit} style={{ borderTop: '1px solid #eff0f5', display: 'flex', gap: 10, padding: 15 }}>
        <input className="form-control" value={text} onChange={e => setText(e.target.value)} placeholder="Type your question here…" maxLength={2000} data-testid="input-chat-message" />
        <button className="primary-button" type="submit" disabled={!text.trim() || generation.isPending} aria-label="Send message" data-testid="button-send-message"><Send size={17} /><span className="hidden sm:inline">Send</span></button>
      </form>
    </div>
    {response && <div className="eyebrow" style={{ marginTop: 12, textAlign: 'right' }} data-testid="text-chat-model">Reply by {response.model}</div>}
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#969db0', fontSize: 11, marginTop: 14 }}><CircleHelp size={14} /> Use your own words, or paste a question to get started.</div>
  </>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Shell><Switch>
    <Route path="/" component={Dashboard} />
    <Route path="/chat" component={StudyChat} />
    <Route path="/homework">{() => <ToolPage config={toolConfigs['/homework']} />}</Route>
    <Route path="/notes">{() => <ToolPage config={toolConfigs['/notes']} />}</Route>
    <Route path="/quiz">{() => <ToolPage config={toolConfigs['/quiz']} />}</Route>
    <Route path="/planner">{() => <ToolPage config={toolConfigs['/planner']} />}</Route>
    <Route component={NotFound} />
  </Switch></Shell></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>;
}

export default App;
