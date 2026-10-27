import Dead from "./Dead";
import Logo from "./Logo";

const cols: Record<string, string[]> = {
  Products: ["Higgs Realtime", "Higgs Audio", "Higgs Avatar", "Boson Workspace"],
  Solutions: ["Enterprise", "Voice experience"],
  API: ["API Docs ↗", "API Reference ↗", "Pricing"],
  Company: ["About", "Team", "Careers", "Blog"],
  Connect: ["Contact Us", "Request a demo", "X (Twitter)", "LinkedIn", "GitHub"],
};

export default function Footer() {
  return (
    <footer className="footer">
      <Dead><Logo /></Dead>
      <p className="footer-tag">Making communication with AI as easy, natural and fun as talking to a human.</p>
      <div className="footer-cols">
        {Object.entries(cols).map(([h, items]) => (
          <div key={h}>
            <h6>{h}</h6>
            {items.map((i) => <Dead key={i}>{i}</Dead>)}
          </div>
        ))}
      </div>
      <div className="footer-legal">
        <span>© 2026 Boson AI. All Rights Reserved</span>
        {["Privacy Policy", "Terms of Service", "Cookie Policy", "Do Not Sell or Share My Personal Information"].map((l) => (
          <span key={l}>· <Dead>{l}</Dead></span>
        ))}
      </div>
    </footer>
  );
}
