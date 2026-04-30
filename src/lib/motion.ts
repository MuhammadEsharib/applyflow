import type { Variants, Transition } from 'framer-motion';

// Global Animation Configuration - High-Key Spring Physics
export const motionConfig = {
  fast: { type: 'spring' as const, stiffness: 100, damping: 20 },
  smooth: { type: 'spring' as const, stiffness: 100, damping: 20 },
  slow: { type: 'spring' as const, stiffness: 100, damping: 20 },
  spring: { type: 'spring' as const, stiffness: 100, damping: 20 },
};

// Page Transitions - High-Key Fade-and-Scale
export const pageTransition: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const pageTransitionConfig: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
};

// Component Entrance Animations
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Staggered List Animations
export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const listItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Modal/Dialog Animations
export const modalAnimation: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
};

// Sidebar Animations
export const sidebarExpand: Variants = {
  collapsed: { width: '80px' },
  expanded: { width: '280px' },
};

// Card Hover Animations
export const cardHover = {
  whileHover: { y: -4, transition: motionConfig.smooth },
  whileTap: { scale: 0.98 },
};

// Button Animations
export const buttonHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

// Loading States
export const shimmer: Variants = {
  initial: { backgroundPosition: '-1000px 0' },
  animate: {
    backgroundPosition: '1000px 0',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const pulse: Variants = {
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Scroll Reveal
export const scrollReveal: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
};

// Theme Transition
export const themeTransition = {
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

// Drag Animations
export const dragAnimations = {
  drag: { transition: motionConfig.spring },
  dragEnd: { transition: motionConfig.smooth },
};

// Number Count Up
export const countUp = (value: number, duration: number = 1) => ({
  initial: { value: 0 },
  animate: { value },
  transition: { duration, ease: [0.25, 0.8, 0.25, 1] as const },
});

// Utility: Combine variants
export const combineVariants = (...variants: Variants[]): Variants => {
  return variants.reduce((acc, variant) => ({ ...acc, ...variant }), {});
};
