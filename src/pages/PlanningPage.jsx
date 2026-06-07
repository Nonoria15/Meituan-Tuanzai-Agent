import { ArrowLeft, CheckCircle2, Loader2, Wrench } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toolCalls } from '../data/mockData.js';

const thinkingSteps = [
  '理解用户需求：时间、预算、距离、活动与餐厅目标',
  '读取个人偏好记忆：少走路、预算内、偏好日料/展览',
  '检查营业时间与预约状态',
  '计算路线、预算与排队风险',
  '生成可执行方案',
];

function friendNames(selectedFriends = []) {
  return selectedFriends.map((friend) => friend.name).join('、');
}

function mergedTags(selectedFriends = []) {
  const tags = selectedFriends.flatMap((friend) => friend.tags || []);
  return [...new Set(tags)].slice(0, 4).join(' / ');
}

function sourceSummary(selectedFriends = []) {
  const labels = selectedFriends.map((friend) => {
    if (friend.source === 'manual') return '本次创建';
    if (friend.source === 'invite') return '邀请加入';
    return '美团好友';
  });
  return [...new Set(labels)].join(' / ');
}

function constraintSummary(selectedFriends = []) {
  const hasFamily = selectedFriends.some((friend) =>
    ['家人', '孩子', '老人'].includes(friend.relation) || friend.tags?.some((tag) => ['少走路', '不要太晚', '亲子友好'].includes(tag)),
  );
  return hasFamily ? '正在平衡老人/孩子/朋友等不同出行约束' : '正在平衡朋友/情侣等不同出行偏好';
}

export default function PlanningPage({ request, selectedFriends = [], onBack, onDone }) {
  const [step, setStep] = useState(0);
  const [toolStep, setToolStep] = useState(0);
  const activeThinkingSteps = useMemo(() => {
    if (!selectedFriends.length) return thinkingSteps;
    return [
      thinkingSteps[0],
      `已选择同行人：${friendNames(selectedFriends)}`,
      `已识别同行人来源：${sourceSummary(selectedFriends)}`,
      '请求同行人本次偏好授权：仅用于本次行程规划，不展示具体订单记录',
      `合并多人偏好：${mergedTags(selectedFriends)} / 预算400`,
      constraintSummary(selectedFriends),
      '基于美团小团实时排队、预约和营业状态重新排序',
      ...thinkingSteps.slice(2),
    ];
  }, [selectedFriends]);
  const activeToolCalls = useMemo(() => {
    if (selectedFriends.length) return toolCalls;
    return toolCalls.filter(
      (tool) =>
        ![
          '小团偏好记忆',
          '同行人授权',
          '合并多人偏好',
          '实时排队检查',
        ].includes(tool.name),
    );
  }, [selectedFriends]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) => Math.min(current + 1, activeThinkingSteps.length));
      setToolStep((current) => Math.min(current + 1, activeToolCalls.length));
    }, 520);
    return () => clearInterval(timer);
  }, [activeThinkingSteps.length, activeToolCalls.length]);

  useEffect(() => {
    if (step >= activeThinkingSteps.length && toolStep >= activeToolCalls.length) {
      const doneTimer = setTimeout(onDone, 850);
      return () => clearTimeout(doneTimer);
    }
    return undefined;
  }, [step, toolStep, onDone, activeThinkingSteps.length, activeToolCalls.length]);

  const visibleTools = useMemo(() => activeToolCalls.slice(0, Math.max(1, toolStep)), [activeToolCalls, toolStep]);

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#f6f6f6]">
      <header className="sticky top-0 z-10 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-[#f5f5f5]">
            <ArrowLeft size={19} />
          </button>
          <div>
            <h1 className="font-black">团崽正在为你安排周末</h1>
            <p className="text-xs text-[#777]">基于美团小团的本地生活能力，正在拆解需求、协调同行人偏好并调用美团工具链。</p>
          </div>
        </div>
      </header>

      <section className="space-y-4 px-4 py-4">
        <div className="ml-auto max-w-[86%] rounded-2xl rounded-tr-md bg-mt-yellow px-4 py-3 text-sm leading-6 shadow-card">
          {request}
        </div>

        <div className="max-w-[92%] rounded-2xl rounded-tl-md bg-white p-4 shadow-card">
          <div className="mb-3 flex items-center gap-2 font-bold">
            {step < thinkingSteps.length ? (
              <Loader2 size={18} className="animate-spin text-[#ff7a00]" />
            ) : (
              <CheckCircle2 size={18} className="text-[#16a34a]" />
            )}
            Agent Planning
          </div>
          <div className="space-y-2">
            {activeThinkingSteps.slice(0, Math.max(1, step)).map((item, index) => (
              <div key={item} className="flex gap-2 text-sm leading-5">
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                    index < step - 1 ? 'bg-[#dcfce7] text-[#16833a]' : 'bg-[#fff1b8] text-[#8a5a00]'
                  }`}
                >
                  {index < step - 1 ? '✓' : index + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <Wrench size={18} className="text-[#ff7a00]" />
              Tool Trace
            </div>
            <span className="rounded-full bg-[#f5f5f5] px-2 py-1 text-[11px] text-[#666]">
              Mock API
            </span>
          </div>
          <div className="space-y-2">
            {visibleTools.map((tool, index) => {
              const complete = index < toolStep - 1 || toolStep >= toolCalls.length;
              return (
                <div key={tool.name} className="rounded-xl border border-[#eee] bg-[#fafafa] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-semibold text-[#333]">{tool.name}</code>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        complete ? 'bg-[#e7f8ef] text-[#138a3d]' : 'bg-[#fff4cc] text-[#986100]'
                      }`}
                    >
                      {complete ? '完成' : '进行中'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#666]">{tool.result}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
