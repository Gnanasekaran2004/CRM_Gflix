import { useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const { theme } = useTheme();

    const handleMouseMove = e => {
        if (!divRef.current || isFocused) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => { setIsFocused(true); setOpacity(0.6); };
    const handleBlur = () => { setIsFocused(false); setOpacity(0); };
    const handleMouseEnter = () => { setOpacity(0.6); };
    const handleMouseLeave = () => { setOpacity(0); };

    const isLight = theme === 'light';
    const baseClasses = isLight
        ? 'border-gray-100 bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-md'
        : 'border-neutral-800 bg-neutral-900';

    // Default spotlight adjustment: White on light bg is invisible, so switch to subtle gray if default is used
    const finalSpotlightColor = (isLight && spotlightColor === 'rgba(255, 255, 255, 0.25)')
        ? 'rgba(0, 0, 0, 0.04)'
        : spotlightColor;

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative rounded-3xl border overflow-hidden p-8 transition-shadow duration-300 ${baseClasses} ${className}`}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
                style={{
                    opacity,
                    background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${finalSpotlightColor}, transparent 80%)`
                }}
            />
            {children}
        </div>
    );
};

export default SpotlightCard;
