import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";


const DEFAULT_ITEMS = [
  "REACT 19",
  "PYTHON",
  "GSAP SCROLLTRIGGER",
  "LENIS SMOOTH SCROLL",
  "FASTAPI",
  "TAILWIND CSS",
  "MACHINE LEARNING",
  "FRAMER MOTION",
  "FULL STACK ARCHITECTURE",
  "REST APIS",
];

export default function TiltedMarquee({
  items = DEFAULT_ITEMS,
  tiltAngle = -2.5,
  baseVelocity = 2.5,
  className = "",
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Track direction: reverses based on user's scroll direction
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000) * 20;

    // Detect user scroll direction to dynamically invert / reverse marquee
    const currentVelocity = scrollVelocity.get();
    if (currentVelocity < -20) {
      directionFactor.current = -1; // Scrolling up -> reverse direction
    } else if (currentVelocity > 20) {
      directionFactor.current = 1; // Scrolling down -> normal direction
    }

    if (velocityFactor.get() !== 0) {
      moveBy += directionFactor.current * moveBy * velocityFactor.get();
    }

    baseX.set(baseX.get() + moveBy);
  });

  // Wrap percentage for infinite loop
  const x = useTransform(baseX, (v) => `${((v % 50) + 50) % 50 - 50}%`);

  return (
    <div
      className={`relative w-full overflow-hidden py-6 sm:py-8 my-6 sm:my-10 select-none z-20 pointer-events-none ${className}`}
      style={{
        transform: `rotate(${tiltAngle}deg) scale(1.04)`,
        transformOrigin: "center center",
      }}
    >
      {/* Tilted Marquee Background Ribbon */}
      <div
        className="py-3 sm:py-4 shadow-xl border-y border-[var(--border)] overflow-hidden flex items-center"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <motion.div
          className="flex whitespace-nowrap items-center will-change-transform"
          style={{ x }}
        >
          {/* Repeated items for infinite seamless looping */}
          {[0, 1, 2, 3].map((setIndex) => (
            <div key={setIndex} className="flex items-center gap-6 sm:gap-8 px-3 sm:px-4">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-6 sm:gap-8 shrink-0">
                  <span
                    className="font-display font-extrabold text-base sm:text-lg md:text-xl tracking-wider uppercase transition-colors"
                    style={{ color: "var(--surface-ink)" }}
                  >
                    {item}
                  </span>
                  <span
                    className="text-xs sm:text-sm font-black"
                    style={{ color: "var(--accent)" }}
                  >
                    ✦
                  </span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
