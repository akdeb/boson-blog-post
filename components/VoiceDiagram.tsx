// What the ESP32 does during a conversation: one loop, driven by the relay.
const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11.5, fill: "#80868a" } as const;

const Wave = ({ x, y, bars, color, active = true }: { x: number; y: number; bars: number[]; color: string; active?: boolean }) => (
  <g>
    {bars.map((h, i) => (
      <rect key={i} x={x + i * 7} y={y - h / 2} width="3.5" height={h} rx="1.75" fill={color} opacity={active ? 1 : 0.4} />
    ))}
  </g>
);

const State = ({ x, title, sub, accent, children }: { x: number; title: string; sub: string; accent?: boolean; children: React.ReactNode }) => (
  <g>
    <rect x={x} y="70" width="200" height="110" rx="14" fill="#161819" stroke={accent ? "#46b17b" : "#2c2f31"} />
    {children}
    <text x={x + 100} y="140" textAnchor="middle" fill="#f4f5f5" fontSize="15" fontWeight="500" fontFamily="Manrope, sans-serif">{title}</text>
    <text x={x + 100} y="160" textAnchor="middle" fill="#80868a" fontSize="11.5" fontFamily="Outfit, sans-serif">{sub}</text>
  </g>
);

export default function VoiceDiagram() {
  const spiky = [8, 16, 28, 14, 34, 20, 40, 18, 30, 12, 24, 10, 16, 8];
  const flat = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6];
  const smooth = [10, 18, 26, 32, 36, 32, 26, 32, 36, 32, 26, 18, 10, 6];
  return (
    <svg viewBox="0 0 800 300" className="diagram" role="img" aria-label="ESP32 voice loop: listening, processing, speaking, with interrupt and sleep">
      <defs>
        <marker id="vg" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#46b17b" /></marker>
        <marker id="vw" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#6b7073" /></marker>
      </defs>
      <State x={0} title="Listening" sub="I2S mic → binary frames" accent><Wave x={51} y={105} bars={spiky} color="#46b17b" /></State>
      <State x={300} title="Processing" sub="Higgs Realtime generates a reply"><Wave x={351} y={105} bars={flat} color="#6b7073" active={false} /></State>
      <State x={600} title="Speaking" sub="Opus → I2S → speaker" accent><Wave x={651} y={105} bars={smooth} color="#46b17b" /></State>

      <line x1="202" y1="112" x2="298" y2="112" stroke="#6b7073" strokeDasharray="3 4" markerEnd="url(#vw)" />
      <text x="250" y="102" textAnchor="middle" {...mono}>turn ends</text>
      <line x1="502" y1="112" x2="598" y2="112" stroke="#46b17b" strokeDasharray="3 4" markerEnd="url(#vg)" />
      <text x="550" y="102" textAnchor="middle" {...mono}>audio.delta</text>

      {/* complete: speaking back to listening, underneath */}
      <path d="M700 182 V228 H100 V184" fill="none" stroke="#6b7073" markerEnd="url(#vw)" />
      <text x="400" y="246" textAnchor="middle" {...mono}>RESPONSE.COMPLETE · or RESPONSE.INTERRUPTED when the user cuts in</text>

      <rect x="300" y="12" width="200" height="34" rx="17" fill="none" stroke="#3a3d3f" strokeDasharray="4 4" />
      <text x="400" y="34" textAnchor="middle" {...mono}>Sleep · hold 1.5 s, touch to wake</text>
      <path d="M100 68 V29 H298" fill="none" stroke="#3a3d3f" strokeDasharray="3 4" markerEnd="url(#vw)" />
      <path d="M502 29 H700 V68" fill="none" stroke="#3a3d3f" strokeDasharray="3 4" markerEnd="url(#vw)" />
    </svg>
  );
}
