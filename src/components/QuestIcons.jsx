export function QuestionBlockIcon({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="2" width="36" height="36" rx="8" fill="#FFD93D" stroke="#2D3436" strokeWidth="3" />
      <circle cx="8" cy="8" r="1.5" fill="#2D3436" />
      <circle cx="32" cy="8" r="1.5" fill="#2D3436" />
      <circle cx="8" cy="32" r="1.5" fill="#2D3436" />
      <circle cx="32" cy="32" r="1.5" fill="#2D3436" />
      <path
        d="M16.5 15.5C16.5 13.5 18.1 12 20 12C21.9 12 23.5 13.5 23.5 15.5C23.5 17.2 22.3 18.2 21 19C20.2 19.5 20 20.1 20 21.5V22.5"
        stroke="#2D3436"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="20" cy="27.5" r="2" fill="#2D3436" />
    </svg>
  );
}

export function CoinIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="#FFD93D" stroke="#2D3436" strokeWidth="2.5" />
      <rect x="14" y="9" width="4" height="14" rx="2" fill="#2D3436" />
    </svg>
  );
}

export function FlagIcon({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M8 28V5" stroke="#2D3436" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M9 6H25L21 11.5L25 17H9V6Z"
        fill="#6BCB77"
        stroke="#2D3436"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="4.5" r="2.5" fill="#FFD93D" stroke="#2D3436" strokeWidth="2" />
    </svg>
  );
}

export function StarIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 3L19.8 10.7L28.3 11.9L22.1 17.9L23.6 26.4L16 22.4L8.4 26.4L9.9 17.9L3.7 11.9L12.2 10.7L16 3Z"
        fill="#FFD93D"
        stroke="#2D3436"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CategoryIcon({ name, className = 'w-6 h-6' }) {
  switch (name) {
    case 'book':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 5.5C4 4.4 4.9 3.5 6 3.5H11C11.6 3.5 12 3.9 12 4.5V19.5C12 18.9 11.6 18.5 11 18.5H6C4.9 18.5 4 19.4 4 20.5V5.5Z"
            fill="#FFE0D9"
            stroke="#2D3436"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M20 5.5C20 4.4 19.1 3.5 18 3.5H13C12.4 3.5 12 3.9 12 4.5V19.5C12 18.9 12.4 18.5 13 18.5H18C19.1 18.5 20 19.4 20 20.5V5.5Z"
            fill="#FFF3CD"
            stroke="#2D3436"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'puzzle':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M10 4H14V6.5C14 7.3 14.7 8 15.5 8C16.3 8 17 7.3 17 6.5V4H19C19.6 4 20 4.4 20 5V9H17.5C16.7 9 16 9.7 16 10.5C16 11.3 16.7 12 17.5 12H20V19C20 19.6 19.6 20 19 20H5C4.4 20 4 19.6 4 19V5C4 4.4 4.4 4 5 4H10Z"
            fill="#E3F0FF"
            stroke="#2D3436"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'code':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="3" fill="#E8F8E8" stroke="#2D3436" strokeWidth="2" />
          <path d="M9 10L6.5 12.5L9 15" stroke="#2D3436" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 10L17.5 12.5L15 15" stroke="#2D3436" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 9L11 16" stroke="#2D3436" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'refresh':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 12A8 8 0 0 1 18.3 7.3M20 12A8 8 0 0 1 5.7 16.7"
            stroke="#2D3436"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M19 3V8H14" stroke="#2D3436" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 21V16H10" stroke="#2D3436" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}
