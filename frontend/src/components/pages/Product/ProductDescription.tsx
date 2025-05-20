import { useEffect, useRef, useState } from "react";
export function ProductDescription({
  description,
}: {
  description: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [maxLines, setMaxLines] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMaxLines(6);
      } else if (window.innerWidth >= 768) {
        setMaxLines(4);
      } else {
        setMaxLines(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      requestAnimationFrame(() => {
        const style = getComputedStyle(el);
        const lineHeight = Number.parseFloat(style.lineHeight) || 24;
        const height = el.scrollHeight;
        setLineCount(Math.ceil(height / lineHeight));
      });
    }
  }, []);

  return (
    <div className="grow mb-6">
      <div
        ref={contentRef}
        className={`text-gray-700 whitespace-pre-line transition-all duration-300 ${
          !expanded ? "line-clamp-3 md:line-clamp-4 lg:line-clamp-6" : ""
        }`}
      >
        {description}
      </div>

      {lineCount > maxLines && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-orange-500 mt-2 hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}
