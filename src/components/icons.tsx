import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function BaseIcon({
  className,
  children,
  viewBox = "0 0 24 24"
}: IconProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox={viewBox}
    >
      {children}
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </BaseIcon>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </BaseIcon>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </BaseIcon>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="m6 9 6 6 6-6" />
    </BaseIcon>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="m12 3.5 2.7 5.49 6.05.88-4.38 4.27 1.03 6.03L12 17.3 6.6 20.17l1.03-6.03-4.38-4.27 6.05-.88L12 3.5Z" />
    </BaseIcon>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.48 19.48 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.98.37 1.93.7 2.84a2 2 0 0 1-.45 2.11L8.1 9.91a16 16 0 0 0 6 6l1.24-1.26a2 2 0 0 1 2.11-.45c.91.33 1.86.57 2.84.7A2 2 0 0 1 22 16.92Z" />
    </BaseIcon>
  );
}

export function WhatsappIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className} viewBox="0 0 24 24">
      <path d="M20.5 11.62A8.5 8.5 0 0 1 7.8 19.16L3.5 20.5l1.4-4.13A8.5 8.5 0 1 1 20.5 11.62Z" />
      <path d="M8.8 8.67c.16-.38.33-.39.63-.4h.54c.18 0 .42.07.64.54.22.48.73 1.67.8 1.8.06.12.1.27.02.44-.08.17-.12.28-.24.43-.12.14-.25.31-.36.41-.12.1-.24.22-.1.44.14.21.63 1.04 1.34 1.69.92.82 1.69 1.08 1.93 1.2.24.12.38.1.52-.06.14-.16.57-.67.73-.9.16-.23.32-.19.54-.11.22.08 1.39.66 1.63.78.24.12.4.18.45.28.06.1.06.6-.14 1.17-.2.56-1.15 1.11-1.57 1.18-.42.07-.94.1-1.52-.09a7.36 7.36 0 0 1-1.37-.5 11.67 11.67 0 0 1-2.04-1.25 9.5 9.5 0 0 1-2.2-2.74c-.23-.4-.63-1.23-.63-2.34 0-1.12.58-1.65.8-1.88.2-.23.45-.29.6-.29Z" />
    </BaseIcon>
  );
}

export function QuoteIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M9 11H5.5A2.5 2.5 0 0 1 8 8.5V6A5 5 0 0 0 3 11v7h6v-7Zm12 0h-3.5A2.5 2.5 0 0 1 20 8.5V6a5 5 0 0 0-5 5v7h6v-7Z" />
    </BaseIcon>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M14 17H3V6h11v11Z" />
      <path d="M14 9h4l3 3v5h-7" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="17.5" cy="17.5" r="1.5" />
    </BaseIcon>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M12 3 5 6v6c0 5 3.4 8.9 7 10 3.6-1.1 7-5 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.6 1.6 3.4-3.4" />
    </BaseIcon>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="m12 20-1.1-1C5 13.7 2 11 2 7.8A4.8 4.8 0 0 1 6.8 3a5.4 5.4 0 0 1 5.2 3.2A5.4 5.4 0 0 1 17.2 3 4.8 4.8 0 0 1 22 7.8c0 3.2-3 5.9-8.9 11.2L12 20Z" />
    </BaseIcon>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </BaseIcon>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M12 3v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </BaseIcon>
  );
}

export function FilterIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </BaseIcon>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
    </BaseIcon>
  );
}

export function ListIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M8 7h12" />
      <path d="M8 12h12" />
      <path d="M8 17h12" />
      <circle cx="4" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="17" r="1" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function SparklesIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M12 3 13.7 8.3 19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
      <path d="m19 3 .7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7L19 3Z" />
      <path d="m5 15 .8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z" />
    </BaseIcon>
  );
}
