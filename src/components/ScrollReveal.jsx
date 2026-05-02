import { motion } from 'framer-motion';

export const FadeIn = ({ children, delay = 0, direction = 'up', distance = 20, duration = 0.8 }) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, delayChildren = 0, staggerChildren = 0.1 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerChildren,
            delayChildren: delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, distance = 20 }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: distance },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.21, 0.47, 0.32, 0.98],
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const Parallax = ({ children, offset = 50 }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: -offset }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
      }}
    >
      {children}
    </motion.div>
  );
};
