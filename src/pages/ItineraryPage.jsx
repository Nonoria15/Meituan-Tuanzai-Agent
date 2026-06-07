import { ArrowLeft, CalendarClock, CircleDollarSign, Map, RotateCcw, ShieldCheck } from 'lucide-react';
import { getFallbackRestaurantsForScene } from '../data/mockData.js';

function friendNames(selectedFriends = []) {
  return selectedFriends.map((friend) => friend.name).join('、');
}

function companionSyncRows(selectedFriends = []) {
  const accountFriends = selectedFriends.filter((friend) => !friend.source || friend.source === 'meituan');
  const invitedFriends = selectedFriends.filter((friend) => friend.source === 'invite');
  const manualFriends = selectedFriends.filter((friend) => friend.source === 'manual');
  const rows = [];

  if (accountFriends.length) {
    rows.push(`已同步至${friendNames(accountFriends)}的美团账号。`);
  }
  if (invitedFriends.length) {
    rows.push(`已同步至已接受邀请的同行人：${friendNames(invitedFriends)}。`);
  }
  if (manualFriends.length) {
    rows.push(`${friendNames(manualFriends)}为本次创建同行人，可通过分享链接查看行程。`);
  }
  return rows;
}

export default function ItineraryPage({ onRestart, onBack, plan, selectedRestaurant, selectedFriends = [] }) {
  const restaurant = selectedRestaurant || getFallbackRestaurantsForScene(plan?.sceneType)[0];
  const budget = (plan?.budget || 368) + (restaurant?.budgetDelta || 0);
  const syncRows = companionSyncRows(selectedFriends);

  const itinerary = plan?.timelineDetails?.length
    ? [
        { time: '13:40', text: '出发提醒，已根据路线和预约时间生成' },
        ...plan.timelineDetails.map((item) => ({
          time: item.time.split('-')[0],
          text: `${item.title} · ${item.meta}`,
        })),
        { time: '18:00', text: `${restaurant.name}，双人位已预约` },
        { time: '19:00', text: '行程结束' },
      ]
    : [
    { time: '13:40', text: '出发提醒，建议打车或地铁到万象商圈' },
    { time: '14:00', text: '到达光影沉浸式艺术展，双人票已锁定' },
    { time: '15:45', text: '商场甜品/咖啡，预留休息和拍照时间' },
    { time: '17:50', text: `步行到 ${restaurant.name}` },
    { time: '18:00', text: `${restaurant.cuisine || '日料'}晚餐，双人位已预约` },
    { time: '19:00', text: '行程结束，可继续附近散步' },
  ];

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#f6f6f6]">
      <header className="sticky top-0 z-10 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-[#f5f5f5]">
            <ArrowLeft size={19} />
          </button>
          <div>
            <h1 className="font-black">团崽已安排好你的周末</h1>
            <p className="text-xs text-[#777]">已完成路线规划、餐厅预约、活动安排和异常兜底。</p>
          </div>
        </div>
      </header>

      <section className="space-y-4 px-4 py-4">
        <div className="rounded-2xl bg-gradient-to-r from-mt-yellow to-[#ff9d2f] p-4 shadow-card">
          <p className="text-sm font-bold text-[#5f4300]">今天 14:00-19:00</p>
          <h2 className="mt-1 text-2xl font-black">{plan?.title || '轻松约会路线'}</h2>
          <p className="mt-2 text-sm leading-5 text-[#4c3900]">
            路线规划、餐厅预约、活动安排和异常兜底都已完成。
          </p>
          {selectedFriends.length > 0 && (
            <p className="mt-2 rounded-full bg-white/35 px-3 py-1 text-xs font-bold text-[#5f4300]">
              同行人：{friendNames(selectedFriends)} · 已基于多方偏好完成规划
            </p>
          )}
        </div>

        {syncRows.length > 0 && (
          <div className="rounded-2xl border border-[#c8efd5] bg-[#f0fff4] p-4 shadow-card">
            <h3 className="mb-2 flex items-center gap-2 font-black text-[#166534]">
              <ShieldCheck size={18} className="text-[#16a34a]" /> 同行人同步
            </h3>
            <div className="space-y-2 text-sm leading-6 text-[#276749]">
              {syncRows.map((row) => (
                <p key={row}>{row}</p>
              ))}
              <p>对方可查看活动票、餐厅预约、路线提醒和异常处理记录。</p>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white p-4 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-black">
            <CalendarClock size={18} className="text-[#ff7a00]" /> 时间线
          </h3>
          <div className="space-y-4">
            {itinerary.map((item, index) => (
              <div key={item.time} className="grid grid-cols-[48px_1fr] gap-3">
                <p className="text-sm font-black text-[#ff6500]">{item.time}</p>
                <div className="relative border-l-2 border-[#ffe28a] pl-4">
                  <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-mt-yellow ring-2 ring-white" />
                  <p className="text-sm font-semibold leading-5">{item.text}</p>
                  {index < itinerary.length - 1 && <div className="h-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-card">
            <CircleDollarSign size={20} className="text-[#ff7a00]" />
            <p className="mt-2 text-xs text-[#777]">总预算</p>
            <p className="text-lg font-black">¥{budget}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-card">
            <Map size={20} className="text-[#ff7a00]" />
            <p className="mt-2 text-xs text-[#777]">总路程</p>
            <p className="text-lg font-black">约22分钟</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-card">
          <h3 className="mb-3 flex items-center gap-2 font-black">
            <ShieldCheck size={18} className="text-[#16a34a]" /> 已预约项目
          </h3>
          <div className="space-y-2 text-sm">
            <p className="rounded-xl bg-[#f7f7f7] px-3 py-2">光影沉浸式艺术展 · 双人票已锁定</p>
            <p className="rounded-xl bg-[#f7f7f7] px-3 py-2">
              {restaurant.name} · 18:00 双人位 · {restaurant.wait}
            </p>
            <p className="rounded-xl bg-[#f7f7f7] px-3 py-2">13:40 出发提醒 · 已生成</p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#fff8ea] p-4 shadow-card">
          <h3 className="font-black">异常处理记录</h3>
          <p className="mt-2 text-sm leading-6 text-[#654500]">
            原推荐餐厅已满座，团崽基于美团小团实时预约状态{selectedFriends.length ? `与 ${friendNames(selectedFriends)} 的偏好` : '与个人偏好'}，
            切换为同商圈可预约餐厅 {restaurant.name}；
            {restaurant.walkTime}，人均 ¥{restaurant.average}，预算仍在 ¥400 内。用户可接受推荐，也可自主选择替代餐厅。
          </p>
        </div>

        <button
          onClick={onRestart}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-mt-yellow text-sm font-black"
        >
          <RotateCcw size={17} /> 重新规划
        </button>
      </section>
    </main>
  );
}
