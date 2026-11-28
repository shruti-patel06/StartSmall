import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Interactive 3D Question Block cube rendered with CSS preserve-3d.
 * Rotates smoothly on hover and bounces on tap.
 */
export function Quest3DCube({ onTap, tapCount = 0 }) {
  const faceBase =
    'absolute inset-0 rounded-2xl border-2 border-navy flex items-center justify-center backface-hidden select-none';

  return (
    <div className="perspective-900 inline-block">
      <motion.button
        type="button"
        onClick={onTap}
        aria-label="Tap 3D quest cube for a psychology insight"
        initial={{ rotateX: -14, rotateY: 22 }}
        animate={{
          rotateX: [-14, -10, -14],
          rotateY: [22, 28, 22],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ rotateX: -8, rotateY: 42, scale: 1.06 }}
        whileTap={{ scale: 0.94, y: 6, rotateY: 112 }}
        key={tapCount}
        className="relative w-20 h-20 preserve-3d cursor-pointer focus:outline-none"
      >
        {/* Front */}
        <div
          className={`${faceBase} bg-gold shadow-inner`}
          style={{ transform: 'translateZ(40px)' }}
        >
          <span className="text-4xl font-black text-navy leading-none">
            ?
          </span>
          <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-navy" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-navy" />
          <span className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-navy" />
          <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-navy" />
        </div>

        {/* Right face */}
        <div
          className={`${faceBase} bg-gold-dark`}
          style={{ transform: 'rotateY(90deg) translateZ(40px)' }}
        >
          <span className="text-xl font-black text-navy/80">60s</span>
        </div>

        {/* Left face */}
        <div
          className={`${faceBase} bg-coral-300`}
          style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}
        >
          <span className="text-xl font-black text-navy/80">AI</span>
        </div>

        {/* Top face */}
        <div
          className={`${faceBase} bg-gold-light`}
          style={{ transform: 'rotateX(90deg) translateZ(40px)' }}
        />

        {/* Bottom face */}
        <div
          className={`${faceBase} bg-navy`}
          style={{ transform: 'rotateX(-90deg) translateZ(40px)' }}
        />

        {/* Back face */}
        <div
          className={`${faceBase} bg-mint`}
          style={{ transform: 'rotateY(180deg) translateZ(40px)' }}
        >
          <span className="text-xl font-black text-navy">GO</span>
        </div>
      </motion.button>
    </div>
  );
}

/**
 * Interactive 3D perspective card that responds smoothly to pointer position.
 */
export function TiltCard3D({ children, className = '' }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 220, damping: 20 });
  const springY = useSpring(y, { stiffness: 220, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="perspective-900">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className={`preserve-3d transition-shadow duration-200 hover:shadow-[0_10px_0_#2D3436] ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
