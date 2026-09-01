export default function WaveDivider({
  fill = "var(--surface)",
  bg = "transparent",
  variant = "wave",
  flip = false,
  className = "",
}) {
  const getPath = () => {
    switch (variant) {
      case "wave":
        return "M0 90 L0 52 C 120 12 240 12 360 44 C 480 76 600 76 720 44 C 840 12 960 12 1080 44 C 1200 76 1320 76 1440 48 L1440 90 Z";
      case "scallop":
        return "M0 90 V56 Q30 18 66 44 Q96 62 132 38 Q168 12 208 40 Q244 64 284 38 Q320 10 360 36 Q398 60 440 34 Q478 10 520 38 Q556 62 600 36 Q640 8 684 38 Q720 62 760 36 Q800 10 844 40 Q880 64 920 38 Q958 12 1000 40 Q1040 64 1080 36 Q1118 10 1160 40 Q1200 62 1240 36 Q1280 10 1324 40 Q1360 62 1400 40 Q1420 30 1440 44 V90 Z";
      case "crest":
        return "M0 90 L0 30 Q 360 90 720 30 T 1440 30 L1440 90 Z";
      case "slope":
        return "M0 90 L0 20 Q 720 80 1440 10 L1440 90 Z";
      default:
        return "M0 90 L0 52 C 120 12 240 12 360 44 C 480 76 600 76 720 44 C 840 12 960 12 1080 44 C 1200 76 1320 76 1440 48 L1440 90 Z";
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden leading-none z-10 pointer-events-none select-none ${className}`}
      style={{ backgroundColor: bg }}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={`block w-full h-[clamp(35px,5vw,80px)] -mb-px ${flip ? "rotate-180" : ""}`}
      >
        <path d={getPath()} fill={fill} />
      </svg>
    </div>
  );
}
