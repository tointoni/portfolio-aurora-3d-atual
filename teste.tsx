import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Mail,
  Moon,
  Send,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";

const projects = [
  {
    title: "Nebula Commerce",
    type: "E-commerce UI",
    description:
      "Experiência de compra responsiva com filtros inteligentes, carrinho fluido e microinterações.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    gradient: "from-emerald-400/30 via-cyan-400/20 to-blue-500/30",
  },
  {
    title: "Pulse Analytics",
    type: "Dashboard",
    description:
      "Dashboard de métricas com visualização de dados, estados de carregamento e navegação acessível.",
    stack: ["React", "Recharts", "Framer Motion"],
    gradient: "from-cyan-400/30 via-blue-500/20 to-violet-500/30",
  },
  {
    title: "Atlas Tasks",
    type: "Productivity App",
    description:
      "Organizador de tarefas com experiência otimista, atalhos de teclado e foco em produtividade.",
    stack: ["Next.js", "Zustand", "Supabase"],
    gradient: "from-teal-400/30 via-emerald-500/20 to-cyan-500/30",
  },
];

const stack = [
  { name: "Next.js", symbol: "N", color: "#ffffff" },
  { name: "TypeScript", symbol: "TS", color: "#3178c6" },
  { name: "React", symbol: "⚛", color: "#61dafb" },
  { name: "Tailwind", symbol: "〰", color: "#38bdf8" },
  { name: "Three.js", symbol: "△", color: "#00f5a0" },
  { name: "Motion", symbol: "M", color: "#d8ff00" },
];

function useTypewriter(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = words[wordIndex];
    const done = text === target;
    const empty = text === "";
    const delay = done ? 1300 : deleting ? 45 : 88;
    const timer = window.setTimeout(() => {
      if (done && !deleting) return setDeleting(true);
      if (empty && deleting) {
        setDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
        return;
      }
      setText(target.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [text, deleting, wordIndex, words]);
  return text;
}

function AuroraScene({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const particles = Array.from(
      { length: reduceMotion ? 45 : 130 },
      (_, index) => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        size: 0.35 + Math.random() * 1.5,
        speed: 0.00005 + Math.random() * 0.00014,
        phase: index * 0.63,
      }),
    );

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onPointer = (event: PointerEvent) => {
      pointerX = event.clientX / width - 0.5;
      pointerY = event.clientY / height - 0.5;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const base = dark ? [0, 245, 160] : [0, 130, 220];
      for (const particle of particles) {
        particle.y -= particle.speed * (reduceMotion ? 0 : 1);
        if (particle.y < -0.03) particle.y = 1.03;
        const x =
          particle.x * width +
          pointerX * particle.z * 22 +
          Math.sin(time * 0.0003 + particle.phase) * 4;
        const y = particle.y * height + pointerY * particle.z * 18;
        const alpha = 0.13 + particle.z * 0.45;
        context.beginPath();
        context.fillStyle = `rgba(${base[0]},${base[1]},${base[2]},${alpha})`;
        context.shadowColor = dark ? "#00f5a0" : "#00d9f6";
        context.shadowBlur = 8;
        context.arc(x, y, particle.size * (0.7 + particle.z), 0, Math.PI * 2);
        context.fill();
      }
      context.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [dark]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />
      <div className="orb orb-one">
        <div />
      </div>
      <div className="orb orb-two">
        <div />
      </div>
      <div className="orb orb-three">
        <div />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(11,15,25,.36)_85%)] dark:block hidden" />
    </div>
  );
}

function TiltCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 180,
    damping: 22,
  });

  return (
    <motion.article
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`glass-card group relative overflow-hidden rounded-[1.75rem] p-6 ${className}`}
    >
      {children}
    </motion.article>
  );
}

function MagneticTitle() {
  return (
    <motion.h1 className="max-w-4xl text-5xl font-black tracking-[-0.055em] sm:text-7xl lg:text-[5.4rem] lg:leading-[.93]">
      {"Interfaces que parecem vivas.".split("").map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          className="inline-block"
          whileHover={{
            y: -5,
            color: index % 3 === 0 ? "#00f5a0" : "#00d9f6",
            scale: 1.06,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 18 }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: (typeof projects)[number];
  onOpen: () => void;
}) {
  return (
    <TiltCard onClick={onOpen} className="min-h-[320px] cursor-pointer">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-70 transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div className="absolute -right-10 top-10 h-40 w-40 rounded-full border border-white/20 bg-white/10 shadow-[0_0_70px_rgba(0,245,160,.25)] backdrop-blur-xl transition-transform duration-700 group-hover:-translate-x-4 group-hover:rotate-12" />
      <div className="relative flex h-full min-h-[270px] flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.2em] text-slate-600 dark:text-white/60">
          <span>{project.type}</span>
          <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        <div>
          <h3 className="text-3xl font-black tracking-tight">
            {project.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-white/65">
            {project.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-900/10 bg-white/30 px-3 py-1 text-xs dark:border-white/10 dark:bg-black/20"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

export default function PortfolioAurora() {
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(
    null,
  );
  const typed = useTypewriter(
    useMemo(() => ["Front-End Developer", "Creative Coder", "UI Engineer"], []),
  );

  useEffect(() => {
    const started = performance.now();
    const run = (now: number) => {
      const value = Math.min(100, Math.round(((now - started) / 1500) * 100));
      setProgress(value);
      if (value < 100) requestAnimationFrame(run);
      else window.setTimeout(() => setLoading(false), 250);
    };
    requestAnimationFrame(run);
  }, []);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 80, damping: 16 },
    },
  };

  return (
    <div className={dark ? "dark" : ""}>
      <style>{`
        :root { color-scheme: light; } .dark { color-scheme: dark; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        .glass-card { border: 1px solid rgba(15,23,42,.10); background: rgba(255,255,255,.62); box-shadow: 0 24px 80px rgba(15,23,42,.08); backdrop-filter: blur(22px); transform-style: preserve-3d; }
        .dark .glass-card { border-color: rgba(255,255,255,.11); background: linear-gradient(145deg,rgba(19,26,42,.76),rgba(9,13,23,.57)); box-shadow: 0 20px 80px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.06); }
        .glass-card:after { content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none; background:linear-gradient(120deg,transparent 20%,rgba(255,255,255,.12),transparent 70%); opacity:0; transition:opacity .4s; }
        .glass-card:hover:after { opacity:1; }
        .aurora { position:absolute; border-radius:999px; filter:blur(90px); opacity:.28; mix-blend-mode:screen; animation:drift 14s ease-in-out infinite alternate; }
        .aurora-one { width:48vw; height:38vw; left:-10vw; top:-8vw; background:#00f5a0; }
        .aurora-two { width:45vw; height:42vw; right:-8vw; top:28vh; background:#00d9f6; animation-delay:-6s; }
        .orb { position:absolute; transform-style:preserve-3d; animation:float 7s ease-in-out infinite; filter:drop-shadow(0 0 24px rgba(0,245,160,.25)); }
        .orb div { width:100%; height:100%; border:1px solid rgba(255,255,255,.25); background:linear-gradient(135deg,rgba(255,255,255,.23),rgba(0,217,246,.05)); box-shadow:inset -14px -18px 30px rgba(0,217,246,.08), inset 12px 8px 24px rgba(255,255,255,.15); backdrop-filter:blur(5px); }
        .orb-one { width:85px; height:85px; right:8%; top:16%; } .orb-one div { border-radius:50%; }
        .orb-two { width:66px; height:66px; left:5%; top:55%; animation-delay:-3s; transform:rotate(30deg); } .orb-two div { border-radius:18px; }
        .orb-three { width:42px; height:42px; right:12%; top:73%; animation-delay:-5s; transform:rotate(45deg); } .orb-three div { clip-path:polygon(50% 0,100% 30%,82% 100%,18% 100%,0 30%); }
        @keyframes drift { to { transform:translate3d(12vw,9vh,0) scale(1.18); } }
        @keyframes float { 0%,100% { transform:translateY(0) rotate(0); } 50% { transform:translateY(-24px) rotate(14deg); } }
        @media (prefers-reduced-motion: reduce) { *,*:before,*:after { animation-duration:.01ms!important; animation-iteration-count:1!important; scroll-behavior:auto!important; } }
      `}</style>

      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0, scale: 1.08, filter: "blur(15px)" }}
            transition={{ duration: 0.65 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-[#070a11] text-white"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotateX: 360, rotateY: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="mx-auto h-16 w-16 rounded-2xl border border-emerald-300/70 bg-gradient-to-br from-emerald-300/20 to-cyan-400/20 shadow-[0_0_50px_rgba(0,245,160,.4)]"
              />
              <div className="mt-8 text-5xl font-black tabular-nums tracking-tighter">
                {progress}
                <span className="text-emerald-300">%</span>
              </div>
              <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-300 to-cyan-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen overflow-x-hidden bg-[#f4f7f8] text-slate-950 transition-colors duration-700 dark:bg-[#0b0f19] dark:text-white">
        <AuroraScene dark={dark} />
        <header className="fixed inset-x-0 top-0 z-50 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <a
            href="#top"
            className="flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/60 px-4 py-2 font-black backdrop-blur-xl dark:border-white/10 dark:bg-black/30"
          >
            <Code2 className="h-4 w-4 text-emerald-400" />
            AE<span className="text-emerald-400">.</span>
          </a>
          <nav className="hidden items-center gap-1 rounded-full border border-slate-900/10 bg-white/60 p-1 text-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/30 sm:flex">
            {["Sobre", "Stack", "Projetos", "Contato"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="rounded-full px-4 py-2 transition hover:bg-white/80 dark:hover:bg-white/10"
              >
                {label}
              </a>
            ))}
          </nav>
          <motion.button
            whileTap={{ scale: 0.86 }}
            onClick={() => setDark((value) => !value)}
            aria-label="Alternar tema"
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-900/10 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-black/30"
          >
            <AnimatePresence mode="wait" initial={false}>
              {dark ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -80, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 80, scale: 0 }}
                >
                  <Sun className="h-5 w-5 text-amber-300" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 80, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: -80, scale: 0 }}
                >
                  <Moon className="h-5 w-5 text-blue-600" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </header>

        <main
          id="top"
          className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-28 lg:px-8"
        >
          <motion.section
            variants={container}
            initial="hidden"
            animate={loading ? "hidden" : "show"}
            className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12"
          >
            <motion.div variants={item} className="md:col-span-6 lg:col-span-8">
              <TiltCard className="min-h-[530px] sm:p-10">
                <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_#00f5a0]" />
                  Disponível para oportunidades
                </div>
                <div className="relative flex min-h-[470px] flex-col justify-end">
                  <div className="mb-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-400 text-slate-950 shadow-[0_0_45px_rgba(0,245,160,.35)]">
                    <Sparkles />
                  </div>
                  <p className="mb-4 font-mono text-sm font-bold uppercase tracking-[.22em] text-cyan-600 dark:text-cyan-300">
                    Olá, eu sou Antonio
                  </p>
                  <MagneticTitle />
                  <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-white/60">
                      Desenvolvedor Júnior focado em criar produtos digitais
                      rápidos, acessíveis e memoráveis, unindo código limpo,
                      interface e movimento.
                    </p>
                    <div className="shrink-0 rounded-full border border-slate-900/10 bg-white/40 px-5 py-3 font-mono text-sm dark:border-white/10 dark:bg-white/5">
                      <span className="text-emerald-500">&gt;</span> {typed}
                      <span className="animate-pulse">_</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              variants={item}
              id="sobre"
              className="md:col-span-3 lg:col-span-4"
            >
              <TiltCard className="h-full min-h-[255px]">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold uppercase tracking-[.2em] text-slate-500 dark:text-white/40">
                    Sobre mim
                  </span>
                  <Zap className="text-cyan-400" />
                </div>
                <h2 className="mt-10 text-3xl font-black tracking-tight">
                  Curioso por natureza.
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Preciso por escolha.
                  </span>
                </h2>
                <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-white/60">
                  Transformo ideias em experiências digitais fluidas. Gosto de
                  interfaces expressivas, componentes reutilizáveis e detalhes
                  que tornam um produto especial.
                </p>
              </TiltCard>
            </motion.div>

            <motion.div
              variants={item}
              id="stack"
              className="md:col-span-3 lg:col-span-4"
            >
              <TiltCard className="h-full min-h-[255px]">
                <span className="text-xs font-bold uppercase tracking-[.2em] text-slate-500 dark:text-white/40">
                  Tech stack
                </span>
                <div className="mt-7 grid grid-cols-3 gap-3">
                  {stack.map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      whileHover={{
                        y: -7,
                        scale: 1.08,
                        boxShadow: `0 0 24px ${tech.color}45`,
                      }}
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        y: {
                          duration: 2.6 + index * 0.14,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                      className="grid aspect-square place-items-center rounded-2xl border border-slate-900/10 bg-white/45 text-center dark:border-white/10 dark:bg-white/5"
                    >
                      <div>
                        <div
                          className="text-lg font-black"
                          style={{ color: tech.color }}
                        >
                          {tech.symbol}
                        </div>
                        <div className="mt-1 text-[10px] text-slate-500 dark:text-white/45">
                          {tech.name}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>

            <motion.div variants={item} className="md:col-span-6 lg:col-span-8">
              <TiltCard className="h-full min-h-[255px]">
                <div className="relative flex h-full min-h-[205px] flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[.2em] text-slate-500 dark:text-white/40">
                      Filosofia
                    </span>
                    <span className="font-mono text-xs text-emerald-500">
                      01 / 03
                    </span>
                  </div>
                  <blockquote className="max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                    “Uma boa interface explica. Uma{" "}
                    <span className="text-cyan-500">ótima interface</span> faz
                    sentir.”
                  </blockquote>
                  <div className="h-px bg-gradient-to-r from-emerald-400 via-cyan-400 to-transparent" />
                </div>
              </TiltCard>
            </motion.div>
          </motion.section>

          <section id="projetos" className="pt-24">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.22em] text-emerald-500">
                  Trabalhos selecionados
                </p>
                <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                  Projetos em destaque
                </h2>
              </div>
              <div className="hidden text-sm text-slate-500 sm:block">
                Clique para explorar
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  onOpen={() => setSelected(project)}
                />
              ))}
            </div>
          </section>

          <section id="contato" className="pt-24">
            <div className="glass-card grid overflow-hidden rounded-[2rem] lg:grid-cols-2">
              <div className="relative p-7 sm:p-10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 via-transparent to-cyan-400/15" />
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-500">
                    Vamos conversar
                  </p>
                  <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                    Tem uma ideia?
                    <br />
                    Vamos torná-la real.
                  </h2>
                  <p className="mt-5 max-w-md leading-7 text-slate-600 dark:text-white/60">
                    Estou aberto a oportunidades, colaborações e projetos que
                    valorizem boas experiências digitais.
                  </p>
                  <div className="mt-10 flex gap-3">
                    {[Github, Linkedin, Mail].map((Icon, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ y: -4, scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        className="grid h-12 w-12 place-items-center rounded-full border border-slate-900/10 bg-white/50 dark:border-white/10 dark:bg-white/5"
                      >
                        <Icon className="h-5 w-5" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              <form
                className="border-t border-slate-900/10 p-7 dark:border-white/10 sm:p-10 lg:border-l lg:border-t-0"
                onSubmit={(event) => event.preventDefault()}
              >
                {["Seu nome", "Seu e-mail", "Assunto"].map((label) => (
                  <label key={label} className="mb-4 block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      {label}
                    </span>
                    <input className="w-full rounded-2xl border border-slate-900/10 bg-white/50 px-4 py-3 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_24px_rgba(0,217,246,.2)] dark:border-white/10 dark:bg-black/20" />
                  </label>
                ))}
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mensagem
                  </span>
                  <textarea
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-slate-900/10 bg-white/50 px-4 py-3 outline-none transition focus:border-emerald-400 focus:shadow-[0_0_24px_rgba(0,245,160,.2)] dark:border-white/10 dark:bg-black/20"
                  />
                </label>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white shadow-[0_0_35px_rgba(0,245,160,.18)] dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:text-slate-950"
                >
                  <span>Enviar mensagem</span>
                  <Send className="h-4 w-4" />
                </motion.button>
              </form>
            </div>
          </section>
          <footer className="flex flex-col items-center justify-between gap-3 pt-12 text-xs text-slate-500 sm:flex-row">
            <span>© 2026 Antonio. Criado com intenção.</span>
            <span>Next.js · TypeScript · WebGL · Motion</span>
          </footer>
        </main>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-5 backdrop-blur-xl"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ y: 50, scale: 0.92 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 30, scale: 0.94, opacity: 0 }}
                transition={{ type: "spring", damping: 22 }}
                onClick={(event) => event.stopPropagation()}
                className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#101724] p-7 text-white shadow-2xl sm:p-10"
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10"
                >
                  <X />
                </button>
                <div
                  className={`mb-8 h-64 rounded-3xl bg-gradient-to-br ${selected.gradient} p-5`}
                >
                  <div className="h-full rounded-2xl border border-white/15 bg-black/15 backdrop-blur-sm" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">
                  {selected.type}
                </p>
                <h3 className="mt-3 text-4xl font-black">{selected.title}</h3>
                <p className="mt-4 max-w-2xl leading-7 text-white/60">
                  {selected.description} Este modal representa o preview
                  expandido do case, pronto para receber imagens, métricas,
                  desafios e decisões técnicas.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {selected.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-white/10 px-3 py-1 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
