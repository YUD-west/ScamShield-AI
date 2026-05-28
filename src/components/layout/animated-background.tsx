export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 cyber-grid opacity-70" />
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[130px] animate-glow-pulse" />
      <div className="absolute -right-32 top-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/15 blur-[110px] animate-glow-pulse [animation-delay:1.5s]" />
      <div className="absolute bottom-0 left-1/3 h-[300px] w-[600px] rounded-full bg-violet-500/10 blur-[100px]" />
    </div>
  );
}
