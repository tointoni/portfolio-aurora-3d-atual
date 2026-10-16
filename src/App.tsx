import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
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
  Send,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

interface Project {
  title: string;
  type: string;
  description: string;
  stack: string[];
  gradient: string;
  image: string;
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

const TYPEWRITER_WORDS = [
  "Front-End Developer",
  "Creative Coder",
  "UI Engineer",
] as const;

const NAVIGATION = ["Sobre", "Stack", "Projetos", "Contato"] as const;

const PROJECTS: Project[] = [
  {
    title: "Nebula Commerce",
    type: "E-commerce UI",
    description:
      "Experiência de compra responsiva com filtros inteligentes, carrinho fluido e microinterações.",
      image: "/projects/nebula-commerce.webp",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    gradient: "from-emerald-400/30 via-cyan-400/20 to-blue-500/30",
  },
  {
    title: "StockFlow | Controle de Estoque",
    type: "Dashboard",
    description:
      "Uma interface moderna e responsiva desenvolvida para centralizar o gerenciamento de produtos, quantidades e movimentações de estoque.",
      image: "./projects/dashboard.png",
    stack: ["HTML", "CSS", "JS", "Bootstrap 5"],
    gradient: "from-cyan-400/30 via-blue-500/20 to-violet-500/30",
  },
  {
    title: "Atlas Tasks",
    type: "Productivity App",
    description:
      "Organizador de tarefas com experiência otimista, atalhos de teclado e foco em produtividade.",
      image: "/projects/nebula-commerce.webp",
    stack: ["Next.js", "Zustand", "Supabase"],
    gradient: "from-teal-400/30 via-emerald-500/20 to-cyan-500/30",
  },
];

const TECHNOLOGIES = [
  { name: "Next.js", symbol: "N", color: "#ffffff" },
  { name: "TypeScript", symbol: "TS", color: "#3178c6" },
  { name: "React", symbol: "⚛", color: "#61dafb" },
  { name: "Tailwind", symbol: "〰", color: "#38bdf8" },
  { name: "Three.js", symbol: "△", color: "#00f5a0" },
  { name: "Motion", symbol: "M", color: "#d8ff00" },
] as const;
const SOCIAL_LINKS = [
  { label: "GitHub", Icon: Github },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "E-mail", Icon: Mail },
] as const;

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};

const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 80, damping: 16 },
  },
};

function useTypewriter(words: readonly string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = words[wordIndex];
    const completed = text === target;
    const empty = text.length === 0;
    const delay = completed ? 1300 : deleting ? 45 : 88;

    const timer = window.setTimeout(() => {
      if (completed && !deleting) {
        setDeleting(true);
        return;
      }

      if (empty && deleting) {
        setDeleting(false);
        setWordIndex((current) => (current + 1) % words.length);
        return;
      }

      setText(target.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, text, wordIndex, words]);

  return text;
}

function AuroraScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const particles = Array.from(
      { length: reducedMotion ? 40 : 120 },
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
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const handlePointer = (event: PointerEvent) => {
      pointerX = event.clientX / width - 0.5;
      pointerY = event.clientY / height - 0.5;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.y -= particle.speed * (reducedMotion ? 0 : 1);
        if (particle.y < -0.03) particle.y = 1.03;

        const x =
          particle.x * width +
          pointerX * particle.z * 22 +
          Math.sin(time * 0.0003 + particle.phase) * 4;
        const y = particle.y * height + pointerY * particle.z * 18;

        context.beginPath();
        context.fillStyle = `rgba(0,245,160,${0.13 + particle.z * 0.45})`;
        context.shadowColor = "#00f5a0";
        context.shadowBlur = 8;
        context.arc(x, y, particle.size * (0.7 + particle.z), 0, Math.PI * 2);
        context.fill();
      }

      context.shadowBlur = 0;
      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointer);
    };
  }, []);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
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
           {" "}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(11,15,25,.36)_85%)]" />
    </div>
  );
}

function TiltCard({
  children,
  className = "",
  onClick,
  ariaLabel,
}: TiltCardProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 24,
    mass: 0.65,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 24,
    mass: 0.65,
  });
  return (
    <motion.article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? ariaLabel : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
        pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      whileHover={{ y: -3, scale: 1.006 }}
      className={`glass-card group relative overflow-hidden rounded-[1.75rem] p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0f19] ${className}`}
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
  project: Project;
  onOpen: () => void;
}) {
  return (
    <TiltCard
      onClick={onOpen}
      ariaLabel={`Abrir detalhes do projeto ${project.title}`}
      className="min-h-[320px] cursor-pointer"
    >
      
           {" "}
      <div
        className={`project-card-gradient absolute inset-0 bg-gradient-to-br ${project.gradient}`}
      />
      <div className="absolute -right-10 top-10 h-40 w-40 rounded-full border border-white/20 bg-white/10 shadow-[0_0_70px_rgba(0,245,160,.25)] backdrop-blur-xl transition-transform duration-700 group-hover:-translate-x-4 group-hover:rotate-12" />
           {" "}
      <div className="relative flex min-h-[270px] flex-col justify-between">
               {" "}
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.2em] text-white/60">
                    <span>{project.type}</span>
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
        </div>
        <div>
                    <h3 className="text-3xl font-black">{project.title}</h3>
                   {" "}
          <p className="mt-3 text-sm leading-6 text-white/65">
                        {project.description}
                     {" "}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
                       {" "}
            {project.stack.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs"
              >
                                {technology}
                             {" "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
           {" "}
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-5 backdrop-blur-xl"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
                   {" "}
          <motion.div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-[2rem] border border-white/15 bg-[#101724] p-8"
            initial={{ y: 40, scale: 0.94 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.97, opacity: 0 }}
          >
                       {" "}
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Fechar detalhes do projeto"
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/10 p-3"
            >
                            <X aria-hidden="true" />
                         {" "}
            </button>
                       {" "}
            <div
              className={`mb-8 h-64 rounded-3xl bg-gradient-to-br ${project.gradient}`}
            />
                       {" "}
            <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">
                            {project.type}
                         {" "}
            </p>
                       {" "}
            <h3 id="project-modal-title" className="mt-3 text-4xl font-black">
                            {project.title}
                         {" "}
            </h3>
                       {" "}
            <p className="mt-4 text-white/70">{project.description}</p>
                       {" "}
            <div className="mt-6 flex flex-wrap gap-2">
                           {" "}
              {project.stack.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm"
                >
                                    {technology}
                                 {" "}
                </span>
              ))}
                         {" "}
            </div>
                     {" "}
          </motion.div>
                 {" "}
        </motion.div>
      )}
         {" "}
    </AnimatePresence>
  );
}

export default function PortfolioAurora() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const typedText = useTypewriter(TYPEWRITER_WORDS);
  const closeProject = useCallback(() => setSelectedProject(null), []);
  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    let completionTimer = 0;

    const updateProgress = (now: number) => {
      const value = Math.min(100, Math.round(((now - startedAt) / 1500) * 100));
      setProgress(value);

      if (value < 100) {
        frame = window.requestAnimationFrame(updateProgress);
      } else {
        completionTimer = window.setTimeout(() => setLoading(false), 250);
      }
    };

    frame = window.requestAnimationFrame(updateProgress);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(completionTimer);
    };
  }, []);

  return (
    <div className="portfolio-root min-h-screen overflow-x-hidden bg-[#0b0f19] text-white">
      {/* Foi removido o style que esta no txt */}
      <AnimatePresence>
        {loading && (
          <motion.div
            role="status"
            aria-label={`Carregando ${progress}%`}
            exit={{ opacity: 0, scale: 1.08, filter: "blur(15px)" }}
            transition={{ duration: 0.65 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-[#070a11]"
          >
            <div className="text-center">
                           {" "}
              <motion.div
                animate={{ rotateX: 360, rotateY: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="mx-auto h-16 w-16 rounded-2xl border border-emerald-300/70 bg-gradient-to-br from-emerald-300/20 to-cyan-400/20 shadow-[0_0_50px_rgba(0,245,160,.4)]"
              />
                           {" "}
              <div className="mt-8 text-5xl font-black">
                                {progress}
                <span className="text-emerald-300">%</span>
                             {" "}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
            <AuroraScene />
           {" "}
      <header className="fixed inset-x-0 top-0 z-50 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
               {" "}
        <a
          href="#top"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 font-black backdrop-blur-xl"
        >
                   {" "}
          <Code2 aria-hidden="true" className="h-4 w-4 text-emerald-400" />
                    AE<span className="text-emerald-400">.</span>
                 {" "}
        </a>
               {" "}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center rounded-full border border-white/10 bg-black/30 p-1 text-sm backdrop-blur-xl sm:flex"
        >
                   {" "}
          {NAVIGATION.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="rounded-full px-4 py-2 hover:bg-white/10"
            >
                            {label}
                         {" "}
            </a>
          ))}
                 {" "}
        </nav>
             {" "}
      </header>
           {" "}
      <main
        id="top"
        className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-28 lg:px-8"
      >
               {" "}
        <motion.section
          variants={STAGGER}
          initial="hidden"
          animate={loading ? "hidden" : "show"}
          className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12"
        >
                   {" "}
          <motion.div
            variants={STAGGER_ITEM}
            className="md:col-span-6 lg:col-span-8"
          >
                       {" "}
            <TiltCard className="glass min-h-[530px] sm:p-10">
                           {" "}
              <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-300">
                               {" "}
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                Disponível para oportunidades              {" "}
              </div>
                           {" "}
              <div className="relative flex min-h-[470px] flex-col justify-end">
                               {" "}
                <div className="mb-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-400 text-slate-950">
                                    <Sparkles aria-hidden="true" />
                                 {" "}
                </div>
                               {" "}
                <p className="mb-4 font-mono text-sm font-bold uppercase tracking-[.22em] text-cyan-300">
                                    Olá, eu sou Antonio                {" "}
                </p>
                                <MagneticTitle />
                               {" "}
                <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                                   {" "}
                  <p className="max-w-xl leading-7 text-white/65">
                                        Desenvolvedor Júnior focado em criar
                    produtos digitais rápidos,                     acessíveis e
                    memoráveis, unindo código limpo, interface e movimento.
                                     {" "}
                  </p>
                                   {" "}
                  <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-sm">
                                       {" "}
                    <span className="text-emerald-400">&gt;</span> {typedText}_
                  </div>
                </div>
                             {" "}
              </div>
                         {" "}
            </TiltCard>
                     {" "}
          </motion.div>
                   {" "}
          <motion.div
            variants={STAGGER_ITEM}
            id="sobre"
            className="md:col-span-3 lg:col-span-4"
          >
                       {" "}
            <TiltCard className="glass h-full min-h-[255px]">
              <div className="flex items-start justify-between">
                  <span className="text-xs font-bold uppercase tracking-[.2em] text-slate-500 dark:text-white/40">
                    Sobre mim
                  </span>
                            <Zap aria-hidden="true" className="text-cyan-400" />
              </div>
                           {" "}
              <h2 className="mt-10 text-3xl font-black">
                                Curioso por natureza.
                <br />
                               {" "}
                <span className="text-cyan-400">Preciso por escolha.</span>
                             {" "}
              </h2>
                           {" "}
              <p className="mt-5 text-white/65">
                                Transformo ideias em experiências digitais
                fluidas, acessíveis e reutilizáveis.              {" "}
              </p>
                         {" "}
            </TiltCard>
                     {" "}
          </motion.div>
                   {" "}
          <motion.div
            variants={STAGGER_ITEM}
            id="stack"
            className="md:col-span-3 lg:col-span-4"
          >
                       {" "}
            <TiltCard className="glass h-full min-h-[255px]">
                           {" "}
              <span className="text-xs uppercase tracking-[.2em] text-white/50">
                Tech stack
              </span>
                           {" "}
              <div className="mt-7 grid grid-cols-3 gap-3">
                               {" "}
                {TECHNOLOGIES.map((technology, index) => (
                  <motion.div
                    key={technology.name}
                    animate={{ y: [0, -3, 0] }}
                    whileHover={{
                      y: -7,
                      scale: 1.1,
                      boxShadow: `0 0px 22px ${technology.color}45, 0 0 26px ${technology.color}36, inset 0 1px 0 rgba(255,255,255,.15)`,
                    }}
                    transition={{
                      y: {
                        duration: 2.6 + index * 0.14,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      scale: { type: "spring", stiffness: 260, damping: 18 },
                      boxShadow: { duration: 0.25 },
                    }}
                    className="glass tech-glass-card group/tech grid aspect-square place-items-center rounded-2xl text-center dark:border-white/10 dark:bg-white/5"
                    style={
                      {
                        "--tech-color": technology.color,
                        "--tech-glow": `${technology.color}2e`,
                      } as React.CSSProperties
                    }
                  >
                                       {" "}
                    <div className="relative z-10">
                                           {" "}
                      <motion.div
                        className="text-lg font-black"
                        style={{ color: technology.color }}
                        whileHover={{ scale: 1.12, rotate: 2 }}
                      >
                                                {technology.symbol}
                                             {" "}
                      </motion.div>
                                           {" "}
                      <div className="mt-1 text-[10px] text-slate-500 font-medium text-white/60 transition-colors group-hover/tech:text-white/85">
                                                {technology.name}
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                                     {" "}
                  </motion.div>
                ))}
                             {" "}
              </div>
                         {" "}
            </TiltCard>
                     {" "}
          </motion.div>
                   {" "}
          <motion.div
            variants={STAGGER_ITEM}
            className="md:col-span-6 lg:col-span-8"
          >
                       {" "}
            <TiltCard className="glass h-full min-h-[255px]">
                           {" "}
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
                     {" "}
          </motion.div>
                 {" "}
        </motion.section>
               {" "}
        <section id="projetos" className="pt-24">
                   {" "}
          <h2 className="mb-8 text-5xl font-black">Projetos em destaque</h2>
                   {" "}
          <div className="grid gap-4 lg:grid-cols-3">
                       {" "}
            {PROJECTS.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                onOpen={() => setSelectedProject(project)}
              />
            ))}
                     {" "}
          </div>
                 {" "}
        </section>
               {" "}
        <section id="contato" className="pt-24">
                   {" "}
          <div className="glass glass-card grid rounded-[2rem] lg:grid-cols-2 overflow-hidden">
                       {" "}
            <div className="relative p-7 sm:p-10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 via-transparent to-cyan-400/15" />
              <div className="relative">
                            <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-400">Vamos conversar</p>
                           {" "}
              <h2 className="mt-4 text-5xl font-black tracking-tight sm:text-5xl">
                                Tem uma ideia?
                <br />
                Vamos torná-la real.              {" "}
              </h2>
                           {" "}
              <p className="max-w-md leading-7 text-slate-600 dark:text-white/60">
                    Estou aberto a oportunidades, colaborações e projetos que
                    valorizem boas experiências digitais.
                  </p>
              <div className="mt-10 flex gap-3">
                               {" "}
                {SOCIAL_LINKS.map(({ label, Icon }) => (
                 <motion.button
                    key={label}
                    type="button"
                    whileHover={{ y: -4, scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={label}
                    className="grid h-12 w-12 place-items-center rounded-full border border-slate-900/10 border-white/30 bg-white/5"
                  >
                                        <Icon aria-hidden="true" />
                                     {" "}
                  </motion.button>
                ))}
                             {" "}
                </div>
              </div>
            </div>
                       {" "}
            <form
              aria-label="Formulário de contato"
              className="flex flex-col gap-3 border-t border-white/10 p-7 sm:p-10 lg:border-l lg:border-t-0"
              onSubmit={(event) => event.preventDefault()}
            >
                           {" "}
              {[
                {
                  id: "name",
                  label: "Seu nome",
                  type: "text",
                  autoComplete: "name",
                },
                {
                  id: "email",
                  label: "Seu e-mail",
                  type: "email",
                  autoComplete: "email",
                },
                {
                  id: "subject",
                  label: "Assunto",
                  type: "text",
                  autoComplete: "off",
                },
              ].map((field) => (
                <label key={field.id} htmlFor={field.id}>
                                   {" "}
                  <span className="mb-2 ms-2 block text-xs font-bold uppercase text-white/50">
                                        {field.label}
                                     {" "}
                  </span>
                                   {" "}
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    className="block w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_24px_rgba(0,217,246,.2)] dark:border-white/10 dark:bg-black/20"
                  />
                                 {" "}
                </label>
              ))}
                           {" "}
              <label htmlFor="message">
                               {" "}
                <span className="mb-2 ms-2 block text-xs font-bold uppercase text-white/50">
                  Mensagem
                </span>
                               {" "}
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-emerald-400 transition focus:border-emerald-400 focus:shadow-[0_0_24px_rgba(0,245,160,.2)] dark:border-white/10 dark:bg-black/20"
                />
                             {" "}
              </label>
                           {" "}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-4 font-bold text-slate-950 shadow-[0_0_35px_rgba(0,245,160,.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0f19] dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:text-slate-950"
              >
                                <span>Enviar mensagem</span>         {" "}
                <Send aria-hidden="true" className="h-4 w-4" />
                             {" "}
              </motion.button>
                         {" "}
            </form>
                     {" "}
          </div>
                 {" "}
        </section>
               {" "}
        <footer className="flex flex-col items-center justify-between gap-3 pt-12 text-xs text-white/45 sm:flex-row">
                    <span>© 2026 Antonio. Criado com intenção.</span>
                    <span>React · TypeScript · WebGL · Motion</span>
                 {" "}
        </footer>
             {" "}
      </main>
            <ProjectModal project={selectedProject} onClose={closeProject} />
    </div>
  );
}
