import {
  CalendarCheck,
  Clock3,
  MapPinned,
  Radar,
  ReceiptText,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  TicketCheck,
} from 'lucide-react';

const cards = [
  { text: '正在理解用户需求', icon: Sparkles },
  { text: '搜索附近休闲玩乐', icon: Search },
  { text: '匹配高评分餐厅', icon: Radar },
  { text: '检查营业时间', icon: Clock3 },
  { text: '计算路线时间', icon: Route },
  { text: '预算控制中', icon: ReceiptText },
  { text: '发现可预约座位', icon: CalendarCheck },
  { text: '异常兜底方案生成', icon: ShieldCheck },
  { text: '活动票已锁定', icon: TicketCheck },
  { text: '餐厅预约已确认', icon: MapPinned },
];

function FlowColumn({ reverse = false, delay = '0s', tone = 'outer' }) {
  const doubled = [...cards, ...cards];

  return (
    <div className={`landing-flow-column landing-flow-${tone}`} aria-hidden="true">
      <div
        className={`landing-flow-track ${reverse ? 'landing-flow-reverse' : ''}`}
        style={{ animationDelay: delay }}
      >
        {doubled.map(({ text, icon: Icon }, index) => (
          <div className={`landing-data-card data-depth-${index % 5}`} key={`${text}-${index}`}>
            <span className="landing-status-dot" />
            <Icon size={17} className="text-[#ffd100]" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WaterfallCards() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[4vw] top-[-12vh] hidden h-[130vh] w-60 rotate-[-8deg] opacity-80 md:block">
        <FlowColumn delay="-2s" />
      </div>
      <div className="absolute right-[5vw] top-[-18vh] hidden h-[138vh] w-64 rotate-[7deg] opacity-75 lg:block">
        <FlowColumn reverse delay="-7s" />
      </div>
      <div className="absolute left-[18vw] top-[58vh] h-[70vh] w-56 rotate-[10deg] opacity-45 max-md:left-[-18vw] max-md:w-52">
        <FlowColumn reverse delay="-11s" tone="inner" />
      </div>
      <div className="absolute right-[16vw] top-[50vh] h-[72vh] w-56 rotate-[-10deg] opacity-45 max-md:right-[-20vw] max-md:w-52">
        <FlowColumn delay="-5s" tone="inner" />
      </div>
    </div>
  );
}
