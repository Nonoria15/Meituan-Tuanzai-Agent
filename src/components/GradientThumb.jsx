export default function GradientThumb({ gradient, label, className = '' }) {
  const isImage = typeof gradient === 'string' && (gradient.startsWith('http') || gradient.startsWith('url(') || gradient.startsWith('/'));
  const style = isImage
    ? {
        backgroundImage: gradient.startsWith('url(') ? gradient : `url("${gradient}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: gradient };

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#f4f4f4] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] ${className}`}
      style={style}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/8 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-2 text-xs font-semibold leading-4 text-white drop-shadow">
        {label}
      </div>
    </div>
  );
}
