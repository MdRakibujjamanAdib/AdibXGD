/** Two clipped rows reproduce the reference's upward title rollover. */
export default function RolloverText({ children }: { children: string }) {
  return <span className="vb-roll"><span className="vb-roll-track">
    <span>{children}</span><span aria-hidden="true">{children}</span>
  </span></span>;
}
