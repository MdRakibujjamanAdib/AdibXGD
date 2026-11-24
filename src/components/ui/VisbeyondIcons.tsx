import React from 'react';

// Lucide-family matching TikTok stroke icon (24x24 grid, geometric line weight)
export function TiktokIcon({
  size = 18,
  strokeWidth = 1.5,
  className = "",
  ...props
}: {
  size?: number | string;
  strokeWidth?: number | string;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

// Stylized Barcode component
export function Barcode({ className = "w-44 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="3" height="32" />
      <rect x="5" y="0" width="1" height="32" />
      <rect x="8" y="0" width="2" height="32" />
      <rect x="13" y="0" width="4" height="32" />
      <rect x="19" y="0" width="1" height="32" />
      <rect x="22" y="0" width="3" height="32" />
      <rect x="27" y="0" width="2" height="32" />
      <rect x="31" y="0" width="1" height="32" />
      <rect x="35" y="0" width="4" height="32" />
      <rect x="42" y="0" width="2" height="32" />
      <rect x="46" y="0" width="1" height="32" />
      <rect x="49" y="0" width="3" height="32" />
      <rect x="54" y="0" width="2" height="32" />
      <rect x="58" y="0" width="1" height="32" />
      <rect x="62" y="0" width="4" height="32" />
      <rect x="68" y="0" width="2" height="32" />
      <rect x="72" y="0" width="3" height="32" />
      <rect x="77" y="0" width="1" height="32" />
      <rect x="80" y="0" width="2" height="32" />
      <rect x="84" y="0" width="4" height="32" />
      <rect x="90" y="0" width="1" height="32" />
      <rect x="93" y="0" width="3" height="32" />
      <rect x="98" y="0" width="2" height="32" />
      <rect x="102" y="0" width="1" height="32" />
      <rect x="106" y="0" width="3" height="32" />
      <rect x="111" y="0" width="2" height="32" />
      <rect x="115" y="0" width="4" height="32" />
      <rect x="121" y="0" width="1" height="32" />
      <rect x="124" y="0" width="3" height="32" />
      <rect x="129" y="0" width="2" height="32" />
      <rect x="133" y="0" width="1" height="32" />
      <rect x="136" y="0" width="4" height="32" />
      <rect x="142" y="0" width="2" height="32" />
      <rect x="146" y="0" width="1" height="32" />
      <rect x="149" y="0" width="3" height="32" />
      <rect x="154" y="0" width="2" height="32" />
      <rect x="158" y="0" width="2" height="32" />
    </svg>
  );
}

// Exact mathematical cubic-bezier inverted corners extracted from visbeyond.com
export function InvertedCornerTopRight({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z" />
    </svg>
  );
}

export function InvertedCornerBottomLeft({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z" />
    </svg>
  );
}

export function InvertedCornerBottomRightLeft({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 18 18 L 18 0 C 18 9.941 9.941 18 0 18 Z" />
    </svg>
  );
}

export function InvertedCornerBottomRightTop({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 18 18 L 0 18 C 9.941 18 18 9.941 18 0 Z" />
    </svg>
  );
}

// For Top-Right tabs (e.g. Menu button): inverted corner to the left of the tab
export function InvertedCornerTopLeft({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 18 0 L 0 0 C 9.941 0 18 8.059 18 18 Z" />
    </svg>
  );
}

// For Top-Right tabs (e.g. Menu button): inverted corner below the tab on the right edge
export function InvertedCornerTopRightBottom({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 18 0 L 18 18 C 18 9.941 9.941 0 0 0 Z" />
    </svg>
  );
}

// For Fixed Viewport Frame: bottom-left inner concave corner
export function InvertedCornerBottomLeftFrame({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 0 18 L 0 0 C 0 9.941 8.059 18 18 18 Z" />
    </svg>
  );
}

// For Fixed Viewport Frame: top-right inner concave corner
export function InvertedCornerTopRightFrame({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 18 0 L 18 18 C 18 8.059 9.941 0 0 0 Z" />
    </svg>
  );
}

// For Fixed Viewport Frame: top-left inner concave corner
export function InvertedCornerTopLeftFrame({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z" />
    </svg>
  );
}

// For Fixed Viewport Frame: bottom-right inner concave corner
export function InvertedCornerBottomRightFrame({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 18 18 L 18 0 C 18 9.941 9.941 18 0 18 Z" />
    </svg>
  );
}
