export function CometRings() {
  const rings = [
    // Large outer rings — slow, wide orbits
    { rx: 65, ry: 15, rz: 5, top: '5%', left: '-5%', w: '95%', h: '95%', r: 280, vb: 600, dash: '520 1050', dur: '6s', from: '20', to: '1590', color: '#4A6A42', opacity: 0.7, sw: 0.75 },
    { rx: -55, ry: 25, rz: -8, top: '-3%', left: '8%', w: '100%', h: '100%', r: 320, vb: 700, dash: '900 1100', dur: '5.5s', from: '0', to: '-2000', color: '#4A6A42', opacity: 0.5, sw: 0.75 },
    { rx: 70, ry: -20, rz: 12, top: '2%', left: '-2%', w: '92%', h: '92%', r: 260, vb: 580, dash: '600 1000', dur: '7s', from: '100', to: '1700', color: '#3A5A32', opacity: 0.6, sw: 0.6 },
    // Medium rings — moderate speed
    { rx: -50, ry: -30, rz: -3, top: '8%', left: '5%', w: '88%', h: '88%', r: 220, vb: 500, dash: '450 850', dur: '4.5s', from: '50', to: '1350', color: '#4A6A42', opacity: 0.55, sw: 0.7 },
    { rx: 60, ry: 35, rz: -15, top: '-8%', left: '-3%', w: '105%', h: '105%', r: 340, vb: 740, dash: '700 1400', dur: '8s', from: '200', to: '2300', color: '#3A5A32', opacity: 0.4, sw: 0.5 },
    { rx: -68, ry: -10, rz: 20, top: '10%', left: '3%', w: '85%', h: '85%', r: 200, vb: 460, dash: '380 700', dur: '4s', from: '0', to: '-1080', color: '#5A7A52', opacity: 0.45, sw: 0.6 },
    // Inner rings — faster, tighter
    { rx: 55, ry: -25, rz: 8, top: '15%', left: '10%', w: '75%', h: '75%', r: 170, vb: 400, dash: '300 770', dur: '3.5s', from: '60', to: '1130', color: '#4A6A42', opacity: 0.5, sw: 0.5 },
    { rx: -45, ry: 40, rz: -12, top: '12%', left: '8%', w: '80%', h: '80%', r: 190, vb: 440, dash: '350 850', dur: '3s', from: '0', to: '-1200', color: '#5A7A52', opacity: 0.35, sw: 0.5 },
    // Amber accent — one small inner thread
    { rx: 58, ry: -15, rz: 18, top: '18%', left: '12%', w: '70%', h: '70%', r: 150, vb: 360, dash: '280 660', dur: '3s', from: '40', to: '980', color: '#C86A1A', opacity: 0.4, sw: 0.4 },
  ];

  return (
    <div
      className="hidden sm:block absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] pointer-events-none"
      style={{ perspective: '1200px' }}
    >
      {rings.map((ring, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            transform: `rotateX(${ring.rx}deg) rotateY(${ring.ry}deg) rotateZ(${ring.rz}deg)`,
            transformStyle: 'preserve-3d',
            top: ring.top,
            left: ring.left,
            width: ring.w,
            height: ring.h,
          }}
        >
          <svg viewBox={`0 0 ${ring.vb} ${ring.vb}`} width="100%" height="100%">
            <defs>
              <linearGradient id={`rg-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={ring.color} stopOpacity={ring.opacity} />
                <stop offset="100%" stopColor={ring.color} stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <circle
              cx={ring.vb / 2}
              cy={ring.vb / 2}
              r={ring.r}
              fill="none"
              stroke={`url(#rg-${i})`}
              strokeWidth={ring.sw}
              strokeDasharray={ring.dash}
              strokeDashoffset={ring.from}
            >
              <animate
                attributeName="stroke-dashoffset"
                from={ring.from}
                to={ring.to}
                dur={ring.dur}
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      ))}
    </div>
  );
}
