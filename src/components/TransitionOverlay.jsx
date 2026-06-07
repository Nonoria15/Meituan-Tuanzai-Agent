export default function TransitionOverlay({ active }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <div className={`transition-bloom ${active ? 'transition-bloom-active' : ''}`} />
      <div className={`transition-rings ${active ? 'transition-rings-active' : ''}`} />
      <div className={`transition-flash ${active ? 'transition-flash-active' : ''}`} />
    </div>
  );
}
