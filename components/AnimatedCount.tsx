import React, { useEffect, useState, useRef } from 'react';
import { formatCompactNumber } from '../utils/numberUtils';

const easeOutQuint = (t: number): number => 1 - Math.pow(1 - t, 5);

interface AnimatedCountProps {
  count: number;
}

export const AnimatedCount: React.FC<AnimatedCountProps> = ({ count }) => {
    const [displayCount, setDisplayCount] = useState(count);
    const frameRef = useRef<number | undefined>();
    const prevCountRef = useRef(count);

    useEffect(() => {
        const startCount = prevCountRef.current;
        const endCount = count;
        const diff = endCount - startCount;

        if (diff === 0) return;

        let startTime: number | null = null;
        const duration = 500; // ms

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // FIX: Pass the 'progress' variable to the easing function.
            const easedProgress = easeOutQuint(progress);
            
            const currentAnimatedCount = Math.floor(startCount + diff * easedProgress);
            
            setDisplayCount(currentAnimatedCount);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayCount(endCount); // Ensure it ends exactly on the target
                prevCountRef.current = endCount;
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
            // Set prevCount to the target count when effect cleans up or re-runs
            prevCountRef.current = count;
        };
    }, [count]);

    return <span>{formatCompactNumber(displayCount)}</span>;
};