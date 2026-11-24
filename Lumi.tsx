export type Expression = "normal" | "happy" | "celebrating" | "studying" | "thinking" | "sleepy";

/** Placeholder vector Lumi. Replace with final 3D renders later; the props API stays the same. */
export default function Lumi({ expression = "normal", size = 120 }: { expression?: Expression; size?: number }) {
  const eyes = expression === "sleepy"
    ? <><path d="M38 52q5 4 10 0M72 52q5 4 10 0" stroke="#2E2640" strokeWidth="3" fill="none" strokeLinecap="round" /></>
    : expression === "happy" || expression === "celebrating"
    ? <><path d="M38 54q5-8 10 0M72 54q5-8 10 0" stroke="#2E2640" strokeWidth="3" fill="none" strokeLinecap="round" /></>
    : <><ellipse cx="43" cy="52" rx="6" ry="8" fill="#2E2640" /><ellipse cx="77" cy="52" rx="6" ry="8" fill="#2E2640" />
        <circle cx="45" cy="49" r="2" fill="#fff" /><circle cx="79" cy="49" r="2" fill="#fff" /></>;
  const mouth = expression === "thinking" ? <circle cx="60" cy="70" r="3" fill="#2E2640" />
    : <path d="M52 68q8 7 16 0" stroke="#2E2640" strokeWidth="3" fill="none" strokeLinecap="round" />;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`Lumi, ${expression}`}>
      <ellipse cx="60" cy="108" rx="30" ry="6" fill="#C9B8F0" opacity=".35" />
      <ellipse cx="44" cy="22" rx="7" ry="16" fill="#FFF7EC" /><ellipse cx="76" cy="22" rx="7" ry="16" fill="#FFF7EC" />
      <ellipse cx="60" cy="58" rx="36" ry="34" fill="#FFF7EC" stroke="#EADFCF" strokeWidth="2" />
      {eyes}
      <ellipse cx="32" cy="66" rx="7" ry="5" fill="#E8BFCB" opacity=".8" /><ellipse cx="88" cy="66" rx="7" ry="5" fill="#E8BFCB" opacity=".8" />
      {mouth}
      <path d="M30 86q30 16 60 0l4 12q-34 16-68 0z" fill="#8F73CC" />
      {expression === "studying" && <rect x="44" y="94" width="32" height="12" rx="3" fill="#E8BFCB" />}
      {expression === "celebrating" && <><path d="M12 20l4 8-8 0z M104 14l4 8-8 0z" fill="#E8BFCB" /><circle cx="18" cy="48" r="3" fill="#C9B8F0" /></>}
    </svg>
  );
}
