const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11.5, fill: "#80868a" } as const;
const spiky = [8, 16, 28, 14, 34, 20, 40, 18, 30, 12, 24, 10, 16, 8];
const flat = Array(14).fill(6);
const smooth = [10, 18, 26, 32, 36, 32, 26, 32, 36, 32, 26, 18, 10, 6];

function State({ x, y, w, title, sub, bars, active }: { x: number; y: number; w: number; title: string; sub: string; bars: number[]; active: boolean }) {
  const color = active ? "#46b17b" : "#6b7073";
  return <g transform={`translate(${x} ${y})`}>
    <rect width={w} height="110" rx="14" fill="#161819" stroke={active ? color : "#2c2f31"} />
    {bars.map((h, i) => <rect key={i} x={w / 2 - 49 + i * 7} y={35 - h / 2} width="3.5" height={h} rx="1.75" fill={color} opacity={active ? 1 : 0.4} />)}
    <text x={w / 2} y="70" textAnchor="middle" fill="#f4f5f5" fontSize="15" fontWeight="500" fontFamily="Manrope, sans-serif">{title}</text>
    <text x={w / 2} y="90" textAnchor="middle" fill="#80868a" fontSize="11.5" fontFamily="Outfit, sans-serif">{sub}</text>
  </g>;
}

function Layout({ mobile }: { mobile: boolean }) {
  const id = mobile ? "voice-mobile" : "voice-desktop";
  const arrow = (green: boolean) => `url(#${id}-${green ? "audio" : "event"})`;
  return <svg viewBox={mobile ? "0 0 360 560" : "0 0 800 220"} className={`diagram diagram-${mobile ? "mobile" : "desktop"}`} role="img" aria-label="Voice loop: listening, processing, speaking, then back to listening when the response completes or is interrupted.">
    <defs>
      <marker id={`${id}-audio`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#46b17b" /></marker>
      <marker id={`${id}-event`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#6b7073" /></marker>
    </defs>
    <State x={mobile ? 70 : 0} y={20} w={mobile ? 220 : 200} title="Listening" sub="I2S mic → binary frames" bars={spiky} active />
    <State x={mobile ? 70 : 300} y={mobile ? 210 : 20} w={mobile ? 220 : 200} title="Processing" sub="Higgs generates a reply" bars={flat} active={false} />
    <State x={mobile ? 70 : 600} y={mobile ? 400 : 20} w={mobile ? 220 : 200} title="Speaking" sub="Opus → I2S → speaker" bars={smooth} active />
    {mobile ? <>
      <path className="diagram-stream" d="M180 130 V210" stroke="#6b7073" markerEnd={arrow(false)} />
      <text x="199" y="175" {...mono}>turn ends</text>
      <path className="diagram-stream" d="M180 320 V400" stroke="#46b17b" markerEnd={arrow(true)} />
      <text x="199" y="365" {...mono}>audio.delta</text>
      <path d="M180 510 V540 H30 V75 H70" fill="none" stroke="#6b7073" markerEnd={arrow(false)} />
    </> : <>
      <path className="diagram-stream" d="M202 75 H298" stroke="#6b7073" markerEnd={arrow(false)} />
      <text x="250" y="65" textAnchor="middle" {...mono}>turn ends</text>
      <path className="diagram-stream" d="M502 75 H598" stroke="#46b17b" markerEnd={arrow(true)} />
      <text x="550" y="65" textAnchor="middle" {...mono}>audio.delta</text>
      <path d="M700 130 V170 H100 V130" fill="none" stroke="#6b7073" markerEnd={arrow(false)} />
      <text x="400" y="199" textAnchor="middle" {...mono}>Response complete or interrupted → listening</text>
    </>}
  </svg>;
}

export default function VoiceDiagram() {
  return <figure className="diagram-figure">
    <Layout mobile={false} /><Layout mobile />
    <figcaption>Green shows response audio; gray shows session transitions. Completion or interruption returns the device to listening.</figcaption>
    <div className="diagram-sleep"><span>Sleep</span> Hold for 1.5 seconds to sleep; touch to wake.</div>
  </figure>;
}
