import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  yOffset = 24,
  scaleOffset = 0.98,
  className = "",
  direction = "up",
  once = false,
}) {
  const getInitial = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: yOffset, scale: scaleOffset };
      case "down":
        return { opacity: 0, y: -yOffset, scale: scaleOffset };
      case "left":
        return { opacity: 0, x: yOffset, scale: scaleOffset };
      case "right":
        return { opacity: 0, x: -yOffset, scale: scaleOffset };
      default:
        return { opacity: 0, y: yOffset, scale: scaleOffset };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: once, amount: 0.15 }}
      transition={{
        duration: duration,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}



