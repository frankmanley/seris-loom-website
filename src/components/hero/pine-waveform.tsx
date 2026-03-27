export function PineWaveform() {
  return (
    <div className="relative w-full max-w-[700px] h-[100px] border-t border-b border-accent-green/15 flex items-center justify-center mb-8">
      <svg className="w-full h-[60px]" viewBox="0 0 700 60" preserveAspectRatio="none">
        <path className="wave-pine" d="M0,30 C80,10 120,50 200,30 C280,10 320,50 400,30 C480,10 520,50 600,30 C650,20 680,40 700,30" />
        <path className="wave-pine-ghost" d="M0,30 C80,10 120,50 200,30 C280,10 320,50 400,30 C480,10 520,50 600,30 C650,20 680,40 700,30" transform="translate(5, 2)" />
        <path className="wave-amber-accent" d="M0,30 C175,25 350,35 525,30 C612,28 656,32 700,30" />
      </svg>
      <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-accent-green to-transparent opacity-40 shadow-[0_0_8px_rgba(74,106,66,0.3)]" />
    </div>
  );
}
