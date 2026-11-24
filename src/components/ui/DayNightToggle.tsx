import React, { useId, useSyncExternalStore } from 'react';

const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

interface DayNightToggleProps {
  dark: boolean;
  onToggle: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Exact cloud paths extracted from DayNightButton.json
const CLOUD_FRONT_PATH =
  'M 119.660 -54.745 C 104.995 -54.745, 93.106 -42.856, 93.106 -28.191 C 93.106 -25.382, 93.546 -22.678, 94.354 -20.137 C 91.385 -18.639, 88.830 -16.453, 86.891 -13.781 C 84.363 -14.731, 81.626 -15.255, 78.765 -15.255 C 68.264 -15.255, 59.405 -8.247, 56.594 1.346 C 56.282 1.332, 55.976 1.298, 55.660 1.298 C 53.450 1.298, 51.322 1.652, 49.325 2.293 C 44.627 -6.263, 35.534 -12.064, 25.085 -12.064 C 10.522 -12.064, -1.401 -0.799, -2.467 13.491 C -4.922 13.809, -7.240 14.548, -9.348 15.646 C -13.029 12.295, -17.906 10.234, -23.277 10.234 C -28.245 10.234, -32.801 11.987, -36.370 14.901 C -37.336 13.805, -38.414 12.816, -39.589 11.943 C -39.555 11.378, -39.531 10.808, -39.531 10.234 C -39.531 -5.030, -51.907 -17.404, -67.171 -17.404 C -76.342 -17.404, -84.465 -12.933, -89.492 -6.056 C -90.056 -6.270, -90.629 -6.463, -91.215 -6.629 C -91.035 -7.904, -90.936 -9.206, -90.936 -10.531 C -90.936 -25.795, -103.310 -38.171, -118.574 -38.171 C -133.838 -38.171, -146.213 -25.795, -146.213 -10.531 C -146.213 -10.531, -146.213 54.745, -146.213 54.745 C -146.213 54.745, 146.212 54.745, 146.212 54.745 C 146.212 54.745, 146.212 -28.191, 146.212 -28.191 C 146.212 -42.856, 134.325 -54.745, 119.660 -54.745 Z';

const CLOUD_BACK_PATH =
  'M 148.110 -36.386 C 147.090 -50.119, 135.633 -60.947, 121.639 -60.947 C 106.974 -60.947, 95.085 -49.058, 95.085 -34.393 C 95.085 -32.177, 95.362 -30.025, 95.873 -27.966 C 91.738 -27.114, 88.178 -24.713, 85.794 -21.406 C 81.941 -24.285, 77.159 -25.989, 71.979 -25.989 C 59.218 -25.989, 48.873 -15.644, 48.873 -2.883 C 48.873 -0.758, 49.165 1.297, 49.701 3.251 C 46.215 3.754, 43.073 5.299, 40.594 7.569 C 35.530 1.203, 27.724 -2.883, 18.958 -2.883 C 5.308 -2.883, -6.023 7.016, -8.269 20.025 C -9.307 20.368, -10.307 20.792, -11.266 21.288 C -15.064 16.557, -20.886 13.521, -27.425 13.521 C -32.457 13.521, -37.069 15.318, -40.659 18.301 C -40.951 18.058, -41.262 17.840, -41.568 17.613 C -41.533 17.047, -41.510 16.479, -41.510 15.904 C -41.510 0.640, -53.884 -11.734, -69.148 -11.734 C -78.320 -11.734, -86.443 -7.263, -91.471 -0.386 C -92.035 -0.600, -92.608 -0.793, -93.194 -0.959 C -93.013 -2.235, -92.914 -3.536, -92.914 -4.862 C -92.914 -20.126, -105.288 -32.500, -120.553 -32.500 C -134.810 -32.500, -146.543 -21.703, -148.029 -7.840 C -148.134 -6.861, -148.191 -5.868, -148.191 -4.862 C -148.191 -3.855, -148.134 -2.862, -148.029 -1.883 C -148.029 -1.883, -148.029 60.947, -148.029 60.947 C -148.029 60.947, 148.191 60.947, 148.191 60.947 C 148.191 60.947, 148.191 -36.436, 148.191 -36.436 C 148.191 -36.436, 148.110 -36.386, 148.110 -36.386 Z';

// Exact 4-point sparkle star path from DayNightButton.json
const SPARKLE_STAR_PATH =
  'M 0 -5.722 C 0.648 -1.172 1.172 -0.648 5.722 0 C 1.172 0.648 0.648 1.172 0 5.722 C -0.648 1.172 -1.172 0.648 -5.722 0 C -1.172 -0.648 -0.648 -1.172 0 -5.722 Z';

export default function DayNightToggle({
  dark,
  onToggle,
  className = '',
  size = 'md',
}: DayNightToggleProps) {
  const ready = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  // Sizing configurations - compact, refined proportions matching 41px nav bar
  const width = size === 'sm' ? 36 : size === 'lg' ? 50 : 44;
  const height = size === 'sm' ? 15 : size === 'lg' ? 20 : 18;

  return (
    <button
      type="button"
      className={`vb-theme vb-daynight-toggle relative inline-flex items-center justify-center p-0 border-0 bg-transparent cursor-pointer outline-none select-none shrink-0 transition-opacity duration-200 active:scale-95 ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
      onClick={onToggle}
    >
      {ready ? <ToggleArtwork dark={dark} /> : (
        <>
          <span className="vb-toggle-initial-light absolute inset-0"><ToggleArtwork dark={false} /></span>
          <span className="vb-toggle-initial-dark absolute inset-0"><ToggleArtwork dark={true} /></span>
        </>
      )}
    </button>
  );
}


function ToggleArtwork({ dark }: { dark: boolean }) {
  const clipId = useId();
  return (
      <svg
        viewBox="0 0 264 108"
        className="w-full h-full overflow-visible block"
        aria-hidden="true"
      >
        <defs>
          {/* Unique Clip Path for Capsule Track */}
          <clipPath id={clipId}>
            <rect x="0" y="0" width="264" height="108" rx="54" ry="54" />
          </clipPath>
        </defs>

        {/* Main Capsule Track */}
        <g clipPath={`url(#${clipId})`}>
          {/* Animated Sky Background */}
          <rect
            x="0"
            y="0"
            width="264"
            height="108"
            rx="54"
            ry="54"
            fill={dark ? '#212838' : '#43a9ef'}
            className="transition-colors duration-500 ease-in-out"
          />

          {/* Concentric Aura Rings Radiating from Knob */}
          {/* Outer Halo 3 */}
          <circle
            cx={dark ? 211 : 53}
            cy="54"
            r="115"
            fill="rgba(255, 255, 255, 1)"
            opacity={dark ? 0.03 : 0.11}
            className="transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.25,0.64,1)]"
          />
          {/* Mid Halo 2 */}
          <circle
            cx={dark ? 211 : 53}
            cy="54"
            r="88"
            fill="rgba(255, 255, 255, 1)"
            opacity={dark ? 0.05 : 0.2}
            className="transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.25,0.64,1)]"
          />
          {/* Inner Halo 1 */}
          <circle
            cx={dark ? 211 : 53}
            cy="54"
            r="64"
            fill="rgba(255, 255, 255, 1)"
            opacity={dark ? 0.08 : 0.29}
            className="transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.25,0.64,1)]"
          />

          {/* Night Sky Stars & Sparkles (Fade in when Dark) */}
          <g
            opacity={dark ? 1 : 0}
            className="transition-opacity duration-500 ease-in-out pointer-events-none"
          >
            {/* Pinpoint Dot Stars */}
            <circle cx="39.5" cy="63.6" r="2.2" fill="#ffffff" opacity="0.8" />
            <circle cx="129.9" cy="44.0" r="2.2" fill="#ffffff" opacity="0.9" />
            <circle cx="32.8" cy="35.5" r="1.5" fill="#ffffff" opacity="0.7" />
            <circle cx="153.9" cy="62.6" r="1.5" fill="#ffffff" opacity="0.85" />
            <circle cx="111.8" cy="28.6" r="2.0" fill="#ffffff" opacity="0.95" />
            <circle cx="63.4" cy="75.3" r="2.0" fill="#ffffff" opacity="0.8" />

            {/* 4-Point Sparkle Stars */}
            <path
              transform="translate(157.3, 35.5) scale(1.1)"
              d={SPARKLE_STAR_PATH}
              fill="#ffffff"
              opacity="0.95"
            />
            <path
              transform="translate(135.9, 77.0) scale(0.9)"
              d={SPARKLE_STAR_PATH}
              fill="#ffffff"
              opacity="0.9"
            />
            <path
              transform="translate(56.6, 40.6) scale(1.2)"
              d={SPARKLE_STAR_PATH}
              fill="#ffffff"
              opacity="0.95"
            />
            <path
              transform="translate(92.0, 58.3) scale(0.85)"
              d={SPARKLE_STAR_PATH}
              fill="#ffffff"
              opacity="0.85"
            />
          </g>

          {/* Daytime Cumulus Clouds (Sink beneath track when Dark) */}
          {/* Back Cloud Layer (Translucent sky-blue shadow) */}
          <path
            transform={`translate(135.6, ${dark ? 210 : 68}) scale(0.92)`}
            d={CLOUD_BACK_PATH}
            fill="#a2d4fa"
            className="transition-transform duration-500 ease-in-out"
          />
          {/* Front Cloud Layer (Fluffy white cloud front) */}
          <path
            transform={`translate(147.7, ${dark ? 220 : 82}) scale(0.92)`}
            d={CLOUD_FRONT_PATH}
            fill="#d1ecfc"
            className="transition-transform duration-500 ease-in-out"
          />

          {/* Inset Bezel Shadow / Stroke for Tactical Depth */}
          <rect
            x="0"
            y="0"
            width="264"
            height="108"
            rx="54"
            ry="54"
            fill="none"
            stroke="rgba(0, 0, 0, 0.16)"
            strokeWidth="5"
          />
        </g>

        {/* Sliding Celestial Knob (Sun <-> Moon) */}
        <g
          transform={`translate(${dark ? 211 : 53}, 54)`}
          className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.25,0.64,1)]"
        >
          {/* Knob Drop Shadow */}
          <ellipse
            cx={dark ? 3 : -3}
            cy="6"
            rx="41"
            ry="39"
            fill="rgba(0, 0, 0, 0.28)"
          />

          {/* Sun State (Active in Day Mode) */}
          <g
            opacity={dark ? 0 : 1}
            transform={`scale(${dark ? 0.8 : 1})`}
            className="transition-all duration-400 ease-in-out origin-center"
          >
            {/* Radiant Sun Base */}
            <circle cx="0" cy="0" r="41" fill="#ffd331" />
            {/* Sun Soft Specular Highlight */}
            <circle cx="-6" cy="-6" r="32" fill="rgba(255, 255, 255, 0.25)" />
          </g>

          {/* Moon State with Rotating Craters (Active in Night Mode) */}
          <g
            opacity={dark ? 1 : 0}
            transform={`scale(${dark ? 1 : 0.8})`}
            className="transition-all duration-400 ease-in-out origin-center"
          >
            {/* Moon Base Disc */}
            <circle cx="0" cy="0" r="41" fill="#d1d9e1" />

            {/* Moon Craters Group (Rotates dynamically as knob slides) */}
            <g
              transform={`rotate(${dark ? 0 : 120})`}
              className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.25,0.64,1)] origin-center"
            >
              {/* Large Crater (Lower-Left) */}
              <circle cx="-16" cy="4" r="10" fill="#97a7b8" />
              <circle cx="-17" cy="3" r="8" fill="#8898a9" />

              {/* Medium Crater (Lower-Right) */}
              <circle cx="15" cy="14" r="7.5" fill="#97a7b8" />
              <circle cx="14" cy="13" r="6" fill="#8898a9" />

              {/* Small Crater (Upper-Right) */}
              <circle cx="5" cy="-18" r="5.5" fill="#97a7b8" />
              <circle cx="4.5" cy="-18.5" r="4.2" fill="#8898a9" />
            </g>
          </g>
        </g>
      </svg>
  );
}
