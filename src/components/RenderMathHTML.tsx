// RenderMathHTML.jsx / tsx
import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function RenderMathHTML({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set raw HTML dulu
    containerRef.current.innerHTML = html;

    // Cari semua elemen math-inline dan render dengan KaTeX
    containerRef.current
      .querySelectorAll('[data-type="math-inline"]')
      .forEach((el) => {
        const content = el.getAttribute("data-content") || "";
        try {
          katex.render(content, el as HTMLElement, {
            throwOnError: false,
            displayMode: false,
          });
        } catch (e) {
          (el as HTMLElement).innerHTML = `<span style="color:red;">Err</span>`;
        }
      });
  }, [html]);

  return <div ref={containerRef} />;
}
