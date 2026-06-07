import {
  Battery,
  CalendarDays,
  Clock3,
  Coffee,
  Film,
  MapPin,
  Route,
  Signal,
  Store,
  Utensils,
  Wifi,
} from 'lucide-react';

const mapNodes = [
  { label: '展览', icon: Store, className: 'demo-map-poi-left-one' },
  { label: '咖啡', icon: Coffee, className: 'demo-map-poi-left-two' },
  { label: '餐厅', icon: Utensils, className: 'demo-map-poi-right-one' },
  { label: '影院', icon: Film, className: 'demo-map-poi-right-two' },
  { label: '预约', icon: CalendarDays, className: 'demo-map-poi-right-three' },
];

export default function PhoneShell({ children }) {
  return (
    <div className="demo-stage text-mt-black">
      <div className="demo-bg-orb demo-bg-orb-one" />
      <div className="demo-bg-orb demo-bg-orb-two" />
      <div className="demo-decor-grid" />
      <div className="demo-city-blocks demo-city-blocks-left" />
      <div className="demo-city-blocks demo-city-blocks-right" />
      <div className="demo-map-path demo-map-path-left" />
      <div className="demo-map-path demo-map-path-right" />
      <div className="demo-map-scan demo-map-scan-left" />
      <div className="demo-map-scan demo-map-scan-right" />
      <div className="demo-particle-field" />
      <div className="demo-route-label demo-route-label-left" aria-hidden="true">
        <Route size={13} />
        同商圈路线
      </div>
      <div className="demo-route-label demo-route-label-right" aria-hidden="true">
        <Clock3 size={13} />
        约22分钟
      </div>
      {mapNodes.map(({ label, icon: Icon, className }) => (
        <div className={`demo-map-poi ${className}`} aria-hidden="true" key={label}>
          <span><Icon size={13} /></span>
          {label}
        </div>
      ))}
      <div className="demo-map-anchor demo-map-anchor-left" aria-hidden="true">
        <MapPin size={14} />
      </div>
      <div className="demo-map-anchor demo-map-anchor-right" aria-hidden="true">
        <MapPin size={14} />
      </div>

      <div className="demo-phone-frame">
        <div className="demo-phone-speaker" />
        <div className="demo-phone-screen">
          <div className="demo-status-bar">
            <span>14:00</span>
            <div className="flex items-center gap-1">
              <Signal size={13} />
              <Wifi size={13} />
              <Battery size={15} />
            </div>
          </div>
          <div className="demo-app-viewport">{children}</div>
        </div>
      </div>
    </div>
  );
}
