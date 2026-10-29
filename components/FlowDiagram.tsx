const Box = ({ x, y, w = 180, title, sub, accent }: { x: number; y: number; w?: number; title: string; sub: string; accent?: boolean }) => (
  <g>
    <rect x={x} y={y} width={w} height="72" rx="12" fill="#161819" stroke={accent ? "#46b17b" : "#2c2f31"} />
    <text x={x + w / 2} y={y + 34} textAnchor="middle" fill="#f4f5f5" fontSize="15" fontWeight="500" fontFamily="Manrope, sans-serif">{title}</text>
    <text x={x + w / 2} y={y + 54} textAnchor="middle" fill="#80868a" fontSize="11.5" fontFamily="Outfit, sans-serif">{sub}</text>
  </g>
);
const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11.5, fill: "#80868a" } as const;

function Layout({ mobile }: { mobile: boolean }) {
  const id = mobile ? "flow-mobile" : "flow-desktop";
  const arrow = (green: boolean) => `url(#${id}-${green ? "audio" : "input"})`;
  return (
    <svg viewBox={mobile ? "0 0 360 640" : "0 0 800 290"} className={`diagram diagram-${mobile ? "mobile" : "desktop"}`} role="img" aria-label="Audio flows from Higgs Realtime through the Deno relay and ESP32 to the speaker; microphone audio returns along the same path.">
      <defs>
        <marker id={`${id}-audio`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#46b17b" /></marker>
        <marker id={`${id}-input`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#6b7073" /></marker>
      </defs>
      {mobile ? <>
        <rect x="10" y="140" width="340" height="480" rx="14" fill="none" stroke="#3a3d3f" strokeDasharray="4 4" />
        <text x="26" y="163" {...mono}>Elato stack</text>
        <Box x={60} y={10} w={240} title="Higgs Realtime" sub="holds the conversation" />
        <Box x={60} y={190} w={240} title="Edge relay" sub="Deno · boson.ts" />
        <Box x={60} y={360} w={240} title="ESP32-S3" sub="Elato firmware" accent />
        <Box x={60} y={530} w={240} title="Mic + speaker" sub="INMP441 · MAX98357A" />
        <path d="M170 82 V190" stroke="#6b7073" markerEnd={arrow(false)} />
        <path d="M190 190 V82" stroke="#6b7073" markerEnd={arrow(false)} />
        <text x="205" y="120" {...mono}>WebSocket</text>
        <path className="diagram-stream" d="M170 262 V360" stroke="#46b17b" markerEnd={arrow(true)} />
        <text x="26" y="301" {...mono}>Opus</text><text x="26" y="319" {...mono}>WSS</text>
        <path className="diagram-stream" d="M190 360 V262" stroke="#6b7073" markerEnd={arrow(false)} />
        <text x="205" y="315" {...mono}>mic frames</text>
        <path className="diagram-stream" d="M170 432 V530" stroke="#46b17b" markerEnd={arrow(true)} />
        <text x="26" y="477" {...mono}>I2S</text><text x="26" y="495" {...mono}>PCM</text>
        <path className="diagram-stream" d="M190 530 V432" stroke="#6b7073" markerEnd={arrow(false)} />
        <text x="205" y="485" {...mono}>mic audio</text>
      </> : <>
        <Box x={20} y={10} title="Higgs Realtime" sub="holds the conversation" />
        <path d="M100 82 V175" stroke="#6b7073" markerEnd={arrow(false)} />
        <path d="M120 175 V82" stroke="#6b7073" markerEnd={arrow(false)} />
        <text x="140" y="115" {...mono}>wss://api.boson.ai/v1/realtime</text>
        <rect x="1" y="140" width="798" height="140" rx="14" fill="none" stroke="#3a3d3f" strokeDasharray="4 4" />
        <text x="780" y="162" textAnchor="end" {...mono}>Elato · edge + device</text>
        <Box x={20} y={175} title="Edge relay" sub="Deno · boson.ts" />
        <Box x={310} y={175} title="ESP32-S3" sub="Elato firmware" accent />
        <Box x={600} y={175} title="Mic + speaker" sub="INMP441 · MAX98357A" />
        <path className="diagram-stream" d="M200 203 H308" stroke="#46b17b" markerEnd={arrow(true)} />
        <text x="204" y="194" {...mono}>Opus · WSS</text>
        <path className="diagram-stream" d="M308 227 H200" stroke="#6b7073" markerEnd={arrow(false)} />
        <text x="212" y="261" {...mono}>mic frames</text>
        <path className="diagram-stream" d="M490 203 H598" stroke="#46b17b" markerEnd={arrow(true)} />
        <text x="500" y="194" {...mono}>I2S · PCM</text>
        <path className="diagram-stream" d="M598 227 H490" stroke="#6b7073" markerEnd={arrow(false)} />
        <text x="500" y="261" {...mono}>mic audio</text>
      </>}
    </svg>
  );
}

export default function FlowDiagram() {
  return <figure className="diagram-figure"><Layout mobile={false} /><Layout mobile /><figcaption>Green: response audio. Gray: microphone audio and API connection.</figcaption></figure>;
}
