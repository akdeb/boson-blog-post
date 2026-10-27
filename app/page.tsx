import Image from "next/image";
import Dead from "@/components/Dead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlowDiagram from "@/components/FlowDiagram";
import VoiceDiagram from "@/components/VoiceDiagram";
import Code from "@/components/Code";

const Back = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 2 4 7l5 5" /></svg>
);
const Chip = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="4" y="4" width="10" height="10" rx="2" /><path d="M7 1v3M11 1v3M7 14v3M11 14v3M1 7h3M1 11h3M14 7h3M14 11h3" /></svg>
);
const Book = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M9 4C7.5 3 5 2.8 2 3v11c3-.2 5.500 0 7 1 1.500-1 4-1.200 7-1V3c-3-.2-5.500 0-7 1zM9 4v11" /></svg>
);

const config = "// firmware-arduino/src/Config.cpp\nconst uint32_t MIC_SAMPLE_RATE = 16000;\n\n// INMP441 microphone on I2S_NUM_1\nconst int I2S_SCK = 1;\nconst int I2S_WS  = 4;\nconst int I2S_SD  = 14;\n\n// MAX98357A amplifier on I2S_NUM_0\nconst int I2S_BCK_OUT  = 6;\nconst int I2S_WS_OUT   = 5;\nconst int I2S_DATA_OUT = 7;\nconst int I2S_SD_OUT   = 10;\n\n// Button or touch pad; also wakes the device from deep sleep\nconst gpio_num_t BUTTON_PIN = GPIO_NUM_2;\nconst int RED_LED_PIN = 9, GREEN_LED_PIN = 8, BLUE_LED_PIN = 13;";

const sessionUpdate = "// server/deno/models/boson.ts — session setup excerpt\nconst BOSON_REALTIME_URL = \"wss://api.boson.ai/v1/realtime\";\nconst BOSON_MODEL = Deno.env.get(\"BOSON_REALTIME_MODEL\") || \"higgs-realtime\";\n\nconst bosonWs = new WebSocket(`${BOSON_REALTIME_URL}?model=${BOSON_MODEL}`, {\n    headers: { Authorization: `Bearer ${bosonApiKey}` },\n});\n\nbosonWs.on(\"open\", () => {\n    sendBoson({\n        type: \"session.update\",\n        session: {\n            type: \"realtime\",\n            model: BOSON_MODEL,\n            output_modalities: [\"audio\"],\n            instructions: systemPrompt,\n            audio: {\n                input: {\n                    format: { type: \"audio/pcm\", rate: SAMPLE_RATE },\n                    transcription: { model: BOSON_TRANSCRIPTION_MODEL },\n                    turn_detection: {\n                        type: \"server_vad\",\n                        threshold: Number(Deno.env.get(\"BOSON_ESP32_VAD_THRESHOLD\") || \"0.35\"),\n                        prefix_padding_ms: 400,\n                        silence_duration_ms: Number(Deno.env.get(\"BOSON_ESP32_VAD_SILENCE_MS\") || \"700\"),\n                    },\n                },\n                output: { format: { type: \"audio/pcm\", rate: SAMPLE_RATE }, voice },\n            },\n            tools: sendFunctionTools(),\n            temperature: Number(Deno.env.get(\"BOSON_TEMPERATURE\") || \"0.3\"),\n        },\n    });\n});";

const relay = "// server/deno/models/boson.ts — audio and event handling excerpts\nbosonWs.on(\"message\", async (data: Buffer) => {\n    const event = JSON.parse(data.toString(\"utf-8\"));\n    switch (event.type) {\n        case \"response.output_audio.delta\":\n            opus.push(Buffer.from(event.delta, \"base64\")); // PCM in, Opus packets out\n            break;\n        case \"response.done\":\n            opus.flush(true);\n            if (event.response?.status !== \"cancelled\") {\n                ws.send(JSON.stringify({ type: \"server\", msg: \"RESPONSE.COMPLETE\" }));\n            }\n            break;\n        case \"input_audio_buffer.speech_started\":\n            ws.send(JSON.stringify({ type: \"server\", msg: \"RESPONSE.INTERRUPTED\" }));\n            break;\n    }\n});\n\n// ESP32 → Higgs Realtime: forward microphone audio once connected\nclientWs.on(\"message\", (data: RawData, isBinary: boolean) => {\n    if (isBinary) {\n        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);\n        sendBoson({\n            type: \"input_audio_buffer.append\",\n            audio: buffer.toString(\"base64\"),\n        });\n    }\n});";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="article">
        <Dead className="btn btn-back"><Back /> More articles</Dead>

        <h1>Running Higgs Realtime on ESP32</h1>

        <div className="meta">The Boson AI Team</div>

        <div className="meta">October 27, 2026</div>

        <p className="lead">Developers can now build ESP32 voice devices powered by Higgs Realtime using <a className="inline-code" href="https://github.com/akdeb/ElatoAI" target="_blank" rel="noopener noreferrer">Elato’s open-source stack</a>. With a roughly $10 ESP32-S3 board, a microphone and a speaker, the setup brings live speech-to-speech conversation to low-cost, low-power hardware, without external PSRAM.</p>

        <p className="lead">A kitchen assistant that talks you through a recipe, an equipment interface you can use hands-free, or an educational gadget with choose-your-adventure stories all need the same foundation: a device that can listen, send speech to the model and play the reply. This implementation provides that foundation with Arduino firmware, secure WebSockets and a Deno edge relay.</p>

        <div className="btn-row">
          <a className="btn btn-primary" href="https://boson.ai/higgs-realtime" target="_blank" rel="noopener noreferrer"><Chip /> Higgs Realtime</a>
          <a className="btn" href="https://github.com/akdeb/ElatoAI" target="_blank" rel="noopener noreferrer"><Book /> View the repo</a>
        </div>

        <figure className="photo hero"><Image src="/images/hero.jpg" alt="Voice assistants in a factory, a kitchen and a child’s room" width={1774} height={887} priority /></figure>

        <h4>A speech-to-speech model for physical devices</h4>

        <p><a className="inline-code" href="https://docs.boson.ai/overview" target="_blank" rel="noopener noreferrer">Higgs Realtime</a> accepts live audio and streams spoken responses within a persistent, two-way session. Turn detection, interruption handling and tool use are part of the API, so developers can build conversational behavior around an ongoing session.</p>

        <p>The model runs in the cloud. On the device, the work is limited to audio capture, networking, decoding and playback. This keeps the processing and memory requirements small enough for an ESP32-S3 and lets developers configure the voice and instructions on the server.</p>

        <h4>The hardware</h4>

        <p>The Elato reference build uses:</p>

        <ul className="article-list"><li>An ESP32-S3 development board with Wi-Fi</li><li>An INMP441 I2S microphone</li><li>A MAX98357A I2S amplifier and a small speaker</li><li>A button or touch pad to control the conversation</li><li>An RGB LED for status feedback</li></ul>

        <p>The microphone and amplifier connect to separate I2S ports for audio input and output. Pin assignments live in the firmware’s <code>Config.cpp</code>, so builders can adapt the wiring to their board layout. The firmware uses the Arduino framework and can be built and flashed with PlatformIO.</p>

        <Code lang="C++">{config}</Code>

        <figure className="photo"><Image src="/images/pcb-design.png" alt="ESP32-S3 wiring diagram with microphone, amplifier, speaker, button and RGB LED" width={1916} height={1120} /></figure>

        <p>Deep sleep reduces idle power use between sessions. Battery requirements depend on the application: Wi-Fi, audio processing, speaker volume and time spent in conversation all contribute to active power consumption.</p>

        <h4>From microphone to model and back</h4>

        <FlowDiagram />

        <p>Higgs Realtime uses an OpenAI-compatible API, so the integration can reuse the same messaging protocol already used for OpenAI Realtime. The ESP32 sends microphone audio over a secure WebSocket to the relay, which forwards it to the API as <code>input_audio_buffer.append</code> events. As the model generates a reply, the relay receives <code>response.output_audio.delta</code> events, compresses the audio with Opus and streams it back to the board. The firmware decodes each chunk for playback without waiting for the complete answer.</p>

        <p>The relay handles the API protocol and keeps the Boson API key off the device. At the start of a session, it sends a <code>session.update</code> message with the character’s instructions, voice, audio configuration and turn-detection settings. These can change without reflashing the firmware. The backend also stores transcripts for conversation history.</p>

        <Code lang="TypeScript">{sessionUpdate}</Code>

        <h4>Turn-taking and interruptions</h4>

        <VoiceDiagram />

        <p>Once a session is open, server-side voice activity detection identifies when the user has finished speaking. The adapter defaults to a 700 ms silence window, with a configurable detection threshold. These settings let developers tune the pause before a response for their application.</p>

        <p>The relay translates session events into device messages such as <code>RESPONSE.COMPLETE</code> and <code>RESPONSE.INTERRUPTED</code>, coordinating the conversation with speaker playback. When the device sends an interruption command, the adapter cancels the current response and truncates the conversation to the audio already heard. That prevents an unplayed portion of an answer from remaining in the conversation as though the user had heard it.</p>

        <Code lang="TypeScript">{relay}</Code>

        <p>A session can end through a device command or through the model’s <code>end_call</code> tool when the user says goodbye.</p>

        <h4>Streaming across a global network</h4>

        <p>Stable speech on a microcontroller depends on the whole audio path. Opus keeps returning audio compact, and continuous streaming lets the board play chunks as they arrive. The Deno relay can be deployed on globally distributed edge infrastructure to serve devices in different regions.</p>

        <p><a className="inline-code" href="https://github.com/akdeb/ElatoAI#-important-stats" target="_blank" rel="noopener noreferrer">Elato’s published results</a> report roughly two to three seconds of round-trip latency globally, with tests of up to 17 minutes of uninterrupted conversation. These are results for the broader stack, rather than a dedicated Higgs Realtime benchmark. Wi-Fi quality, deployment region and model response time affect latency; establishing the first connection adds delay, and the edge host’s runtime limit caps session length.</p>

        <p>For a deployment, the practical checks are response time and continuous playback on the networks and in the regions where people will use the device.</p>

        <h4>See it in action</h4>

        <figure className="short">
          <iframe src="https://www.youtube-nocookie.com/embed/GZK36IFCv0U" title="Higgs Realtime on an ESP32 voice device" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          <figcaption>An ESP32 voice device using Higgs Realtime.</figcaption>
        </figure>

        <h4>Get started</h4>

        <p>The <a className="inline-code" href="https://github.com/akdeb/ElatoAI/blob/main/server/deno/models/boson.ts" target="_blank" rel="noopener noreferrer">Higgs Realtime adapter</a> is available under <code>server/deno/models/boson.ts</code>.</p>

        <ol className="article-list"><li>Follow the <a className="inline-code" href="https://github.com/akdeb/ElatoAI" target="_blank" rel="noopener noreferrer">Elato setup guides</a> to assemble the hardware and configure the backend, device registration and web app.</li><li>Create a <a className="inline-code" href="https://boson.ai/workspace/api-key" target="_blank" rel="noopener noreferrer">Boson API key</a> and set <code>BOSON_API_KEY</code> on the Deno server.</li><li>Select Higgs Realtime for your character and configure its voice and instructions.</li><li>Build and flash the firmware, connect the board to Wi-Fi, and start talking.</li></ol>

        <p>The adapter defaults to <code>higgs-realtime</code>. You can override the model, transcription model and temperature through server environment variables. The <a className="inline-code" href="https://docs.boson.ai/overview" target="_blank" rel="noopener noreferrer">API documentation</a> covers session events and audio configuration; the repository contains the firmware, wiring and deployment instructions for building your own device.</p>

        <div className="tags">
          {["higgs-realtime", "esp32", "elato", "edge", "physical-ai"].map((t) => (
            <Dead key={t} className="tag">#{t}</Dead>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
