import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!glowRef.current) return;
      // Center the glow on the cursor
      // We use px instead of % for precise tracking
      const x = e.clientX;
      const y = e.clientY;
      
      // Update the custom properties
      glowRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        width: '600px',
        height: '600px',
        marginLeft: '-300px',
        marginTop: '-300px',
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 60%)',
        filter: 'blur(40px)',
        willChange: 'transform',
        // Optional: you can use transform transition for smoother but slightly delayed tracking, 
        // but no transition usually feels snappier.
      }}
    />
  );
}
