import { motion } from 'framer-motion';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'btn-tactile inline-flex items-center justify-center font-bold rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-300 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-coral-400 hover:bg-coral-500 text-white border-2 border-navy shadow-[0_4px_0_#2D3436] active:shadow-[0_1px_0_#2D3436]',
    secondary:
      'bg-white hover:bg-cream text-navy border-2 border-navy shadow-[0_4px_0_#2D3436] active:shadow-[0_1px_0_#2D3436]',
    gold:
      'bg-gold hover:bg-[#F5CC27] text-navy border-2 border-navy shadow-[0_4px_0_#2D3436] active:shadow-[0_1px_0_#2D3436]',
    mint:
      'bg-mint hover:bg-[#5BB967] text-navy border-2 border-navy shadow-[0_4px_0_#2D3436] active:shadow-[0_1px_0_#2D3436]',
    ghost:
      'bg-transparent hover:bg-navy/5 text-navy-light hover:text-navy border-2 border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base',
    lg: 'px-5 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { y: 2 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
