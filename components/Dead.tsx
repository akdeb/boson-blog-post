"use client";
import type { ReactNode, CSSProperties } from "react";

// Every link on the page is intentionally inert: it looks and focuses like a
// link but never navigates anywhere.
export default function Dead({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <a
      href="#"
      className={className}
      style={style}
      onClick={(e) => e.preventDefault()}
    >
      {children}
    </a>
  );
}
