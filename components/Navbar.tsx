import Dead from "./Dead";
import Logo from "./Logo";

const Chevron = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M2 3.5 5 6.5 8 3.5" />
  </svg>
);

export default function Navbar() {
  return (
    <header className="nav">
      <Dead className="nav-logo"><Logo /></Dead>
      <nav className="nav-links">
        {["Products", "API", "Company"].map((l) => (
          <Dead key={l} className="nav-link">{l} <Chevron /></Dead>
        ))}
        <Dead className="nav-link">Blog</Dead>
        <Dead className="nav-workspace">Workspace</Dead>
      </nav>
    </header>
  );
}
