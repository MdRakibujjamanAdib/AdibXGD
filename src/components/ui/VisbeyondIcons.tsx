import React from 'react';

// Exact VB shield logo extracted from visbeyond.com
export function VBLogo({ className = "w-12 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 65 47" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M 17.437 0 L 65 0 L 59.431 4.406 L 59.431 10.281 L 53.223 15.697 L 59.431 21.297 L 33.869 47 L 33.869 14.229 L 38.251 9.822 L 42.451 9.822 L 42.451 14.229 L 48.841 7.803 L 17.437 7.803 Z" />
      <path d="M 0 0 L 14.607 0 L 14.607 18.451 L 23.188 26.07 L 23.188 9.822 L 34.691 9.822 L 31.496 13.035 L 31.496 46.541 L 5.751 21.297 L 5.751 4.406 Z" />
    </svg>
  );
}

// Stylized Barcode for pricing ticket cards
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

// For Fixed Viewport Frame: bottom-right inner concave corner
export function InvertedCornerBottomRightFrame({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 18 18 L 18 0 C 18 9.941 9.941 18 0 18 Z" />
    </svg>
  );
}
