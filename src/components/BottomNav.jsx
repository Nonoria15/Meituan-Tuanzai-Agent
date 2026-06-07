const items = [
  { label: '首页', icon: '/images/icon_home.png' },
  { label: '视频', icon: '/images/icon_video.png' },
  { label: '团崽', icon: '/images/icon_tuanzi.png' },
  { label: '购物车', icon: '/images/icon_cart.png' },
  { label: '我的', icon: '/images/icon_profile.png' },
];

export default function BottomNav({ active = '首页', onHome }) {
  return (
    <div className="bottom-nav grid grid-cols-5 border-t border-black/5 bg-white px-1 py-2">
      {items.map(({ label, icon }) => (
        <button
          key={label}
          className={`bottom-nav-item flex flex-col items-center gap-1 text-[11px] ${
            active === label ? 'font-semibold text-[#111]' : 'text-[#777]'
          }`}
          onClick={label === '首页' ? onHome : undefined}
        >
          <img src={icon} alt="" className="bottom-nav-icon" />
          {label}
        </button>
      ))}
    </div>
  );
}
