export default function Marquee({ items, speed = 28, className = "", separator = "·", big = false }) {
  const content = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span className={big ? "font-display font-semibold tracking-tight" : "font-mono"}>
            {item}
          </span>
          {!big && <span className="mx-4 opacity-40">{separator}</span>}
          {big && <span className="mx-6 opacity-30">/</span>}
        </span>
      ))}
    </>
  );

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        <span className="flex items-center shrink-0">{content}</span>
        <span className="flex items-center shrink-0" aria-hidden="true">{content}</span>
      </div>
    </div>
  );
}
