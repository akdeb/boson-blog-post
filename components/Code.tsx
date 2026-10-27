import { Fragment } from "react";

// Tiny regex highlighter so code blocks match the Boson blog's palette.
const KW = /^(import|from|const|let|async|await|function|if|else|return|case|switch|break|new|for|in|extern|static|enum|void|int|bool|define|include|export|class)$/;
const TOKEN = /(\/\/.*|#.*|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|\b\d[\d_.]*\b|\b[A-Za-z_]\w*\b(?=\()|\b[A-Za-z_]\w*\b)/g;

function highlight(line: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  line.replace(TOKEN, (m, _g, idx: number) => {
    if (idx > last) parts.push(line.slice(last, idx));
    let cls = "";
    if (m.startsWith("//") || m.startsWith("#")) cls = "c-com";
    else if (m[0] === '"' || m[0] === "`") cls = "c-str";
    else if (/^\d/.test(m)) cls = "c-num";
    else if (KW.test(m)) cls = "c-kw";
    else if (line[idx + m.length] === "(") cls = "c-fn";
    parts.push(cls ? <span key={idx} className={cls}>{m}</span> : m);
    last = idx + m.length;
    return m;
  });
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

export default function Code({ lang, children }: { lang: string; children: string }) {
  const lines = children.replace(/^\n/, "").replace(/\n$/, "").split("\n");
  return (
    <div className="codeblock">
      <div className="codeblock-lang">{lang}</div>
      <pre>
        {lines.map((l, i) => (
          <Fragment key={i}>{highlight(l)}{"\n"}</Fragment>
        ))}
      </pre>
    </div>
  );
}
