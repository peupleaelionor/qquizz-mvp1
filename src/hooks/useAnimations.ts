/**
 * QQUIZ PRODIGY - Animation Hooks
 * Copyright 2024-2026 QQUIZ PRODIGY. All rights reserved.
 */

import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';

// Hook for fade-in animation on scroll
export function useFadeIn<T extends HTMLElement>(
  options: {
    delay?: number;
    duration?: number;
    y?: number;
    once?: boolean;
  } = {}
): RefObject<T> {
  const ref = useRef<T>(null);
  const { delay = 0, duration = 0.6, y = 30, once = true } = options;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    gsap.set(element, { opacity: 0, y });
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(element, {
              opacity: 1,
              y: 0,
              duration,
              delay,
              ease: 'power3.out',
            });
            if (once) {
              observer.unobserve(element);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, duration, y, once]);

  return ref;
}

// Hook for stagger animation on children
export function useStaggerChildren<T extends HTMLElement>(
  options: {
    stagger?: number;
    duration?: number;
    y?: number;
    delay?: number;
  } = {}
): RefObject<T> {
  const ref = useRef<T>(null);
  const { stagger = 0.1, duration = 0.5, y = 20, delay = 0 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const children = ref.current.children;
    
    gsap.set(children, { opacity: 0, y });
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(children, {
              opacity: 1,
              y: 0,
              duration,
              delay,
              stagger,
              ease: 'power3.out',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [stagger, duration, y, delay]);

  return ref;
}

// Hook for scale animation
export function useScaleIn<T extends HTMLElement>(
  options: {
    delay?: number;
    duration?: number;
    scale?: number;
  } = {}
): RefObject<T> {
  const ref = useRef<T>(null);
  const { delay = 0, duration = 0.5, scale = 0.8 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    gsap.set(element, { opacity: 0, scale });
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(element, {
              opacity: 1,
              scale: 1,
              duration,
              delay,
              ease: 'back.out(1.7)',
            });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, duration, scale]);

  return ref;
}

// Hook for counting animation (numbers)
export function useCountUp(
  targetValue: number,
  options: {
    duration?: number;
    delay?: number;
    decimals?: number;
  } = {}
): { ref: RefObject<HTMLElement>; value: number } {
  const ref = useRef<HTMLElement>(null);
  const { duration = 1.5, delay = 0, decimals = 0 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const obj = { value: 0 };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(obj, {
              value: targetValue,
              duration,
              delay,
              ease: 'power2.out',
              onUpdate: () => {
                element.textContent = obj.value.toFixed(decimals);
              },
            });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [targetValue, duration, delay, decimals]);

  return { ref, value: targetValue };
}

// Hook for parallax effect
export function useParallax<T extends HTMLElement>(
  speed: number = 0.5
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const offset = (scrollY - elementTop) * speed;
      
      gsap.set(element, { y: offset });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

// Hook for hover glow effect
export function useHoverGlow<T extends HTMLElement>(
  color: string = 'rgba(139, 92, 246, 0.5)'
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    const handleMouseEnter = () => {
      gsap.to(element, {
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        boxShadow: 'none',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [color]);

  return ref;
}

// Hook for magnetic button effect
export function useMagnetic<T extends HTMLElement>(
  strength: number = 0.3
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}

// Hook for text reveal animation
export function useTextReveal<T extends HTMLElement>(
  options: {
    duration?: number;
    delay?: number;
  } = {}
): RefObject<T> {
  const ref = useRef<T>(null);
  const { duration = 0.8, delay = 0 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const text = element.textContent || '';
    
    // Split text into spans
    element.innerHTML = text
      .split('')
      .map((char) => `<span style="display: inline-block; opacity: 0; transform: translateY(20px);">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');

    const chars = element.querySelectorAll('span');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(chars, {
              opacity: 1,
              y: 0,
              duration,
              delay,
              stagger: 0.03,
              ease: 'power3.out',
            });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [duration, delay]);

  return ref;
}

// Hook for pulse animation
export function usePulse<T extends HTMLElement>(
  options: {
    scale?: number;
    duration?: number;
  } = {}
): RefObject<T> {
  const ref = useRef<T>(null);
  const { scale = 1.05, duration = 1 } = options;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    gsap.to(element, {
      scale,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    return () => {
      gsap.killTweensOf(element);
    };
  }, [scale, duration]);

  return ref;
}

// Hook for shake animation (for wrong answers)
export function useShake<T extends HTMLElement>(): {
  ref: RefObject<T>;
  shake: () => void;
} {
  const ref = useRef<T>(null);

  const shake = () => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      x: [-10, 10, -10, 10, 0],
      duration: 0.4,
      ease: 'power2.inOut',
    });
  };

  return { ref, shake };
}

// Hook for success bounce animation
export function useBounce<T extends HTMLElement>(): {
  ref: RefObject<T>;
  bounce: () => void;
} {
  const ref = useRef<T>(null);

  const bounce = () => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { scale: 1 },
      {
        scale: [1.2, 0.9, 1.1, 1],
        duration: 0.5,
        ease: 'power2.out',
      }
    );
  };

  return { ref, bounce };
}
