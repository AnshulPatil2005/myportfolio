"use client";
import { motion, useReducedMotion, AnimationProps } from "framer-motion";

interface SlideProps extends AnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Slide = ({ children, className, delay }: SlideProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, translateY: reduceMotion ? 0 : 10 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      viewport={{ once: true, amount: 0, margin: "0px 0px -80px 0px" }}
      transition={{
        ease: "easeInOut",
        duration: reduceMotion ? 0.01 : 0.3,
        delay: reduceMotion ? 0 : delay,
      }}
    >
      <div className={className}>{children}</div>
    </motion.div>
  );
};
