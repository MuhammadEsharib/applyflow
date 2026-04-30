import { useCallback } from 'react';
import { motion, useScroll } from 'framer-motion';

// Hook for smooth scrolling to elements
// eslint-disable-next-line react-refresh/only-export-components
export function useSmoothScroll() {
  const scrollToElement = useCallback((elementId: string, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  return {
    scrollToElement,
    scrollToTop,
    scrollToBottom
  };
}

// Progress bar component for scroll indication
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-purple-500 z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}