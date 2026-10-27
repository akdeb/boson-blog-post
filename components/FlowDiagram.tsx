// "How the stream flows" — drawn in the same style as Boson's own diagram.
const Box = ({ x, y, w = 180, h = 72, title, sub, accent }: { x: number; y: number; w?: number; h?: number; title: string; sub: string; accent?: boolean }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="12" fill="#161819" stroke={accent ? "#46b17b" : "#2c2f31"} />
    <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fill="#f4f5f5" fontSize="15" fontWeight="500" fontFamily="Manrope, sans-serif">{title}</text>
    <text x={x + w / 2} y={y + h / 2 + 18} textAnchor="middle" fill="#80868a" fontSize="11.5" fontFamily="Outfit, sans-serif">{sub}</text>
  </g>
);
const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11.5, fill: "#80868a" } as const;

export default function FlowDiagram() {
  return (
    <svg viewBox="0 0 800 330" className="diagram" role="img" aria-label="Higgs Realtime to Elato edge relay to ESP32 device flow">
      <defs>
        <marker id="ag" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#46b17b" /></marker>
        <marker id="aw" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#6b7073" /></marker>
        <marker id="aws" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto-start-reverse"><path d="M0 0 8 4 0 8z" fill="#6b7073" /></marker>
      </defs>
      <Box x={20} y={10} title="Higgs Realtime" sub="holds the conversation" />
      {/* WebSocket up/down */}
      <line x1="100" y1="82" x2="100" y2="140" stroke="#6b7073" markerEnd="url(#aw)" markerStart="url(#aws)" />
      <text x="116" y="116" {...mono}>wss://api.boson.ai/v1/realtime</text>
      <rect x="1" y="140" width="798" height="190" rx="14" fill="none" stroke="#3a3d3f" strokeDasharray="4 4" />
      <text x="780" y="162" textAnchor="end" {...mono}>Elato · edge + device</text>
      <Box x={20} y={175} title="Edge relay" sub="Deno · boson.ts" />
      <Box x={310} y={175} w={180} title="ESP32-S3" sub="Elato firmware" accent />
      <Box x={600} y={175} title="Mic + speaker" sub="INMP441 · MAX98357A" />
      {/* relay <-> esp32 */}
      <line x1="200" y1="203" x2="308" y2="203" stroke="#46b17b" strokeDasharray="3 4" markerEnd="url(#ag)" />
      <text x="204" y="194" {...mono}>Opus · WSS</text>
      <line x1="308" y1="227" x2="200" y2="227" stroke="#6b7073" strokeDasharray="3 4" markerEnd="url(#aw)" />
      <text x="212" y="244" {...mono}>mic frames</text>
      {/* esp32 <-> audio */}
      <line x1="490" y1="203" x2="598" y2="203" stroke="#46b17b" strokeDasharray="3 4" markerEnd="url(#ag)" />
      <text x="500" y="194" {...mono}>I2S · PCM</text>
      <path d="M690 247 V290 H110 V249" fill="none" stroke="#6b7073" markerEnd="url(#aw)" />
      <text x="400" y="311" textAnchor="middle" {...mono}>user speech → input_audio_buffer.append</text>
    </svg>
  );
}
