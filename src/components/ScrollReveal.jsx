import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollReveal Component
 * Wraps children with GSAP scroll-triggered animations
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.animation - Animation type: 'fade-up', 'fade-in', 'slide-left', 'slide-right', 'scale'
 * @param {number} props.delay - Animation delay in seconds (default: 0)
 * @param {number} props.duration - Animation duration in seconds (default: 0.8)
 * @param {string} props.triggerStart - When to start animation (default: 'top 80%')
 */
const ScrollReveal = ({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 0.8,
    triggerStart = 'top 80%',
    className = ''
}) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Animation configurations
        const animations = {
            'fade-up': {
                y: 50,
                opacity: 0
            },
            'fade-in': {
                opacity: 0
            },
            'slide-left': {
                x: -80,
                opacity: 0
            },
            'slide-right': {
                x: 80,
                opacity: 0
            },
            'scale': {
                scale: 0.8,
                opacity: 0
            },
            'rotate-in': {
                rotation: -10,
                opacity: 0
            }
        };

        const initialState = animations[animation] || animations['fade-up'];

        // Set initial state
        gsap.set(element, initialState);

        // Create scroll trigger animation
        const ctx = gsap.context(() => {
            gsap.to(element, {
                ...Object.keys(initialState).reduce((acc, key) => {
                    if (key === 'opacity') acc[key] = 1;
                    else if (key === 'scale') acc[key] = 1;
                    else acc[key] = 0;
                    return acc;
                }, {}),
                duration: duration,
                delay: delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: triggerStart,
                    toggleActions: 'play none none none',
                    // markers: true, // Uncomment for debugging
                }
            });
        });

        return () => ctx.revert(); // Cleanup
    }, [animation, delay, duration, triggerStart]);

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    );
};

export default ScrollReveal;
