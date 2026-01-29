import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ParallaxSection Component
 * Creates smooth parallax scrolling effect
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to apply parallax to
 * @param {number} props.speed - Parallax speed (0.5 = slow, 1.5 = fast)
 * @param {string} props.direction - Direction: 'up' or 'down'
 */
const ParallaxSection = ({
    children,
    speed = 0.5,
    direction = 'up',
    className = ''
}) => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const yMovement = direction === 'up' ? -100 * speed : 100 * speed;

        const ctx = gsap.context(() => {
            gsap.to(section, {
                y: yMovement,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true, // Smooth scrubbing effect
                }
            });
        });

        return () => ctx.revert();
    }, [speed, direction]);

    return (
        <div ref={sectionRef} className={className}>
            {children}
        </div>
    );
};

export default ParallaxSection;
