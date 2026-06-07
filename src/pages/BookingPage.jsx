import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPinned,
  Star,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { bookingSteps, getFallbackRestaurantsForScene } from '../data/mockData.js';

const statusCopy = {
  exception_detected: 'exception_detected · 原推荐餐厅 18:00 已满',
  fallback_searching: 'fallback_searching · 团崽正在重新搜索同商圈餐厅',
  fallback_options: 'fallback_options · 已找到可预约替代餐厅',
  fallback_selected: 'fallback_selected · 已切换用户选择的餐厅',
  execution_resumed: 'execution_resumed · 继续执行订座、提醒和保存',
  completed: 'completed · 规划执行闭环完成',
};

function buildSteps(selectedRestaurant) {
  return [
    bookingSteps[0],
    '原推荐餐厅 18:00 已满',
    selectedRestaurant
      ? `已切换为 ${selectedRestaurant.name}，${selectedRestaurant.walkTime}，仍满足预算/距离/预约约束`
      : '已切换同商圈评分 4.8 的替代餐厅',
    selectedRestaurant
      ? `已预约 18:00 ${selectedRestaurant.name} 双人位`
      : '已预约 18:00 日料双人位',
    '已生成 13:40 出发提醒',
    '已保存到周末行程',
  ];
}

function toolTraceFor(status, selectedRestaurant) {
  const searching = status === 'fallback_searching';
  const hasOptions = ['fallback_options', 'fallback_selected', 'execution_resumed', 'completed'].includes(status);
  const selected = ['fallback_selected', 'execution_resumed', 'completed'].includes(status);
  const resumed = ['execution_resumed', 'completed'].includes(status);

  return [
    { name: '小团商家预约状态', state: 'failed', result: '18:00 已满，无法完成原餐厅订座' },
    {
      name: '异常替换工具',
      state: searching ? 'running' : hasOptions ? 'completed' : 'pending',
      result: hasOptions ? '找到 3 家同商圈可预约餐厅' : '按同商圈、评分、人均、步行时间检索',
    },
    {
      name: '餐厅候选比较',
      state: hasOptions ? 'completed' : 'pending',
      result: hasOptions ? '按预算、距离、评分和约会适配度排序' : '等待候选餐厅返回',
    },
    {
      name: '路线与预算计算',
      state: selected ? 'completed' : 'pending',
      result: selectedRestaurant
        ? `预算调整 ${selectedRestaurant.budgetDelta >= 0 ? '+' : ''}${selectedRestaurant.budgetDelta}，仍在 ¥400 内`
        : '等待选择替代餐厅',
    },
    {
      name: '餐厅预约执行',
      state: resumed ? 'completed' : selected ? 'running' : 'pending',
      result: resumed && selectedRestaurant ? `${selectedRestaurant.name} 18:00 双人位已确认` : '等待执行订座',
    },
  ];
}

function friendNames(selectedFriends = []) {
  return selectedFriends.map((friend) => friend.name).join('、');
}

function syncCopy(selectedFriends = []) {
  if (!selectedFriends.length) {
    return {
      title: '本次未选择同行人',
      detail: '行程已保存到你的周末行程，可稍后手动分享。',
    };
  }
  const accountFriends = selectedFriends.filter((friend) => !friend.source || friend.source === 'meituan');
  const invitedFriends = selectedFriends.filter((friend) => friend.source === 'invite');
  const manualFriends = selectedFriends.filter((friend) => friend.source === 'manual');
  const syncedNames = [...accountFriends, ...invitedFriends].map((friend) => friend.name).join('、');
  const manualNames = manualFriends.map((friend) => friend.name).join('、');

  if (manualFriends.length && !syncedNames) {
    return {
      title: '已生成同行人共享行程',
      detail: `${manualNames}为本次创建同行人，可通过分享链接查看行程、预约状态和出发提醒。`,
    };
  }

  if (manualFriends.length) {
    return {
      title: `已同步给同行人：${syncedNames}`,
      detail: `对方可在自己的美团账号中查看行程；${manualNames}为本次创建同行人，可通过分享链接查看。`,
    };
  }

  return {
    title: `已同步给同行人：${syncedNames}`,
    detail: invitedFriends.length
      ? '已同步至已接受邀请的同行人，对方可查看行程、预约状态和出发提醒。'
      : '对方可在自己的美团账号中查看行程、预约状态和出发提醒。',
  };
}

export default function BookingPage({ plan, selectedFriends = [], onBack, onFinish, onRestaurantSelected }) {
  const [visible, setVisible] = useState(0);
  const [exceptionVisible, setExceptionVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [exceptionStatus, setExceptionStatus] = useState('exception_detected');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const currentBudget = (plan?.budget || 368) + (selectedRestaurant?.budgetDelta || 0);
  const fallbackOptions = useMemo(
    () => getFallbackRestaurantsForScene(plan?.sceneType),
    [plan?.sceneType],
  );
  const recommendedFallbackRestaurant = fallbackOptions[0];
  const steps = useMemo(() => buildSteps(selectedRestaurant), [selectedRestaurant]);
  const toolTrace = useMemo(
    () => toolTraceFor(exceptionStatus, selectedRestaurant),
    [exceptionStatus, selectedRestaurant],
  );

  useEffect(() => {
    if (accepted) return undefined;
    const timer = setInterval(() => {
      setVisible((current) => {
        if (current >= 2) {
          setExceptionVisible(true);
          setExceptionStatus('exception_detected');
          clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 650);
    return () => clearInterval(timer);
  }, [accepted]);

  useEffect(() => {
    if (exceptionStatus !== 'fallback_searching') return undefined;
    const timer = window.setTimeout(() => {
      setExceptionStatus('fallback_options');
    }, 720);
    return () => window.clearTimeout(timer);
  }, [exceptionStatus]);

  useEffect(() => {
    if (!accepted) return undefined;
    const timer = setInterval(() => {
      setVisible((current) => Math.min(current + 1, steps.length));
    }, 560);
    return () => clearInterval(timer);
  }, [accepted, steps.length]);

  useEffect(() => {
    if (!accepted) return undefined;
    const resumeTimer = window.setTimeout(() => setExceptionStatus('execution_resumed'), 360);
    const doneTimer = window.setTimeout(() => setExceptionStatus('completed'), 1900);
    return () => {
      window.clearTimeout(resumeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [accepted]);

  const chooseRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    onRestaurantSelected?.(restaurant);
    setExceptionStatus('fallback_selected');
    setAccepted(true);
    setVisible(3);
  };

  const done = visible >= steps.length;

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#f6f6f6]">
      <header className="sticky top-0 z-10 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-[#f5f5f5]">
            <ArrowLeft size={19} />
          </button>
          <div>
            <h1 className="font-black">确认方案并模拟预订</h1>
            <p className="text-xs text-[#777]">团崽正在调用小团票务、订座、提醒和保存能力</p>
          </div>
        </div>
      </header>

      <section className="space-y-4 px-4 py-4">
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#ff6500]">当前执行</p>
              <h2 className="mt-1 text-xl font-black">方案 {plan?.id || 'A'} · {plan?.title || '轻松约会路线'}</h2>
            </div>
            <span className="rounded-full bg-[#fff1b8] px-2 py-1 text-xs font-bold">预算 ¥{currentBudget}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-[#fafafa] p-3">
              <CalendarCheck className="mx-auto mb-1 text-[#ff7a00]" size={19} />
              活动票
            </div>
            <div className="rounded-xl bg-[#fafafa] p-3">
              <Clock3 className="mx-auto mb-1 text-[#ff7a00]" size={19} />
              餐厅预约
            </div>
            <div className="rounded-xl bg-[#fafafa] p-3">
              <MapPinned className="mx-auto mb-1 text-[#ff7a00]" size={19} />
              路线提醒
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-card">
          <h3 className="mb-3 font-bold">执行步骤</h3>
          <div className="space-y-3">
            {steps.slice(0, Math.max(1, visible)).map((step, index) => {
              const isException = step.includes('已满');
              return (
                <div key={`${step}-${index}`} className="flex gap-3">
                  <span
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                      isException ? 'bg-[#fff1d6] text-[#ff7a00]' : 'bg-[#e7f8ef] text-[#138a3d]'
                    }`}
                  >
                    {isException ? <TriangleAlert size={15} /> : <CheckCircle2 size={15} />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{step}</p>
                    {index === 0 && <p className="text-xs text-[#777]">票务锁定 10 分钟，等待统一确认</p>}
                    {index === 2 && selectedRestaurant && (
                      <p className="text-xs text-[#777]">
                        用户保留控制权后选择该餐厅，Agent 已同步预算、路线和订座动作。
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {exceptionVisible && !accepted && (
          <div className="rounded-2xl border border-[#ffd18a] bg-[#fff8ea] p-4 shadow-card">
            <div className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ffedd5] text-[#ff7a00]">
                <TriangleAlert size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-black">团崽发现餐厅已满座</h3>
                <p className="mt-1 text-sm leading-6 text-[#654500]">
                  已基于美团小团实时预约能力，重新搜索同商圈、同预算、可预约餐厅
                  {selectedFriends.length ? `，并结合 ${friendNames(selectedFriends)} 的偏好` : ''}。你可以接受推荐替代，也可以重新选择餐厅。
                </p>
                <div className="mt-3 rounded-xl bg-white p-3 text-sm">
                  <p className="font-bold">{recommendedFallbackRestaurant.name}</p>
                  <p className="mt-1 text-xs text-[#666]">
                    {recommendedFallbackRestaurant.wait} · 人均 ¥{recommendedFallbackRestaurant.average} · {recommendedFallbackRestaurant.walkTime}
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => chooseRestaurant(recommendedFallbackRestaurant)}
                    className="rounded-full bg-mt-yellow py-2 text-sm font-black"
                  >
                    接受推荐替代
                  </button>
                  <button
                    onClick={() => setExceptionStatus('fallback_searching')}
                    className="rounded-full border border-[#eee] bg-white py-2 text-sm font-bold"
                  >
                    重新选择餐厅
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {exceptionVisible && !accepted && exceptionStatus === 'fallback_searching' && (
          <div className="rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-center gap-2 font-bold">
              <Loader2 size={17} className="animate-spin text-[#ff7a00]" />
              团崽正在基于美团小团实时预约能力重新搜索同商圈可预约餐厅
            </div>
            <p className="mt-2 text-xs leading-5 text-[#777]">
              正在同时校验评分、人均、步行时间、18:00 档期和预算约束。
            </p>
          </div>
        )}

        {exceptionVisible && !accepted && exceptionStatus === 'fallback_options' && (
          <div className="rounded-2xl bg-white p-4 shadow-card">
            <h3 className="font-black">可选替代餐厅</h3>
            <p className="mt-1 text-xs leading-5 text-[#777]">
              这些候选都满足可预约、同商圈、预算 ¥400 内。你可以保留控制权并选择其中一家。
            </p>
            <div className="mt-3 space-y-3">
              {fallbackOptions.map((restaurant, index) => (
                <div key={restaurant.id} className="rounded-2xl border border-[#f0f0f0] bg-[#fffdf8] p-3">
                  <div className="flex gap-3">
                    <div
                      className="h-16 w-20 shrink-0 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url("${restaurant.image}")` }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        {index === 0 && (
                          <span className="rounded-full bg-[#1f1f1f] px-2 py-0.5 text-[10px] font-bold text-white">
                            推荐
                          </span>
                        )}
                        <h4 className="truncate text-sm font-black">{restaurant.name}</h4>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#ff6500]">
                        <Star size={12} fill="currentColor" /> {restaurant.rating} · 人均 ¥{restaurant.average}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#666]">
                        {restaurant.walkTime} · {restaurant.wait} · {restaurant.reason}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => chooseRestaurant(restaurant)}
                    className="mt-3 w-full rounded-full bg-mt-yellow py-2 text-sm font-black"
                  >
                    选择此餐厅
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedRestaurant && accepted && (
          <div className="rounded-2xl border border-[#b7efc5] bg-[#f0fff4] p-4 shadow-card">
            <div className="flex gap-3">
              <CheckCircle2 className="shrink-0 text-[#16a34a]" size={22} />
              <div>
                <h3 className="font-black text-[#166534]">已切换并继续执行</h3>
                <p className="mt-1 text-sm leading-6 text-[#276749]">
                  已根据双方偏好和小团实时预约状态切换为 {selectedRestaurant.name}，{selectedRestaurant.walkTime}，人均 ¥{selectedRestaurant.average}，
                  方案仍满足预算、距离、时间和可预约约束。
                </p>
              </div>
            </div>
          </div>
        )}

        {done && (
          <div className="rounded-2xl bg-white p-4 text-center shadow-card">
            <CheckCircle2 className="mx-auto text-[#16a34a]" size={42} />
            <h3 className="mt-2 text-lg font-black">已完成：活动票 + 餐厅预约 + 路线提醒</h3>
            <p className="mt-1 text-sm text-[#666]">团崽已完成订座、团购/票务锁定、提醒生成和行程保存。</p>
            <div className="mt-3 rounded-2xl border border-[#c8efd5] bg-[#f0fff4] p-3 text-left">
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[#16a34a]" size={17} />
                <div>
                  <p className="text-sm font-black text-[#166534]">{syncCopy(selectedFriends).title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#2f6f43]">{syncCopy(selectedFriends).detail}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={onFinish} className="rounded-full border border-[#eee] py-3 text-sm font-bold">
                完成规划
              </button>
              <button onClick={onFinish} className="rounded-full bg-mt-yellow py-3 text-sm font-black">
                查看我的周末行程
              </button>
            </div>
          </div>
        )}

        {exceptionVisible && (
          <div className="rounded-2xl bg-white p-4 shadow-card">
            <h3 className="font-bold">异常处理 Tool Trace</h3>
            <p className="mt-1 rounded-full bg-[#f7f7f7] px-3 py-1 text-[11px] font-semibold text-[#666]">
              {statusCopy[exceptionStatus]}
            </p>
            <div className="exception-tool-list mt-3">
              {toolTrace.map((tool) => (
                <div key={tool.name} className={`exception-tool-item is-${tool.state}`}>
                  {tool.state === 'failed' ? (
                    <>
                      <div className="exception-tool-warning">
                        <span className="exception-tool-warning-icon">
                          <TriangleAlert size={15} />
                        </span>
                        <p>
                          <strong>{tool.name}</strong>
                          <span>失败</span>
                        </p>
                      </div>
                      <p className="exception-tool-result">{tool.result}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <code>{tool.name}</code>
                        <span className="exception-tool-state">
                          {tool.state === 'completed' ? '完成' : tool.state === 'running' ? '进行中' : '等待'}
                        </span>
                      </div>
                      <p className="exception-tool-result">{tool.result}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
