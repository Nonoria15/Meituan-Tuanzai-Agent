import { ArrowLeft, Bot, SendHorizontal } from 'lucide-react';
import { quickScenes, sampleRequests } from '../data/mockData.js';

const socialScenes = [
  {
    label: '双人轻松约会',
    text: '今天下午想和同行人轻松约会，最好能拍照、有甜品和一顿不太贵的晚餐，别走太多路。',
  },
  {
    label: '朋友聚会不踩雷',
    text: '今晚和朋友聚会，想先玩再吃饭，气氛热闹一点，预算别太高，最好同一个商圈解决。',
  },
  {
    label: '拍照 + 晚餐路线',
    text: '今天想安排一条适合拍照和晚餐的路线，活动轻松一点，餐厅希望可预约、别排太久。',
  },
  {
    label: '同商圈少走路',
    text: '请帮我把活动、咖啡和晚餐安排在同一个商圈，少走路，节奏轻松一点。',
  },
  {
    label: '预算内吃喝玩乐',
    text: '周末和同行人想吃喝玩乐一起安排，预算控制在 400 内，优先选择不踩雷、可预约的店。',
  },
];

const familyScenes = [
  {
    label: '亲子周末计划',
    text: '周末想带孩子出门 3-4 小时，希望室内、有互动体验，晚饭简单一点，路线不要太折腾。',
  },
  {
    label: '带老人少走路',
    text: '周末想带家人出门，老人不方便走太多路，希望安静、好停车、不要太晚。',
  },
  {
    label: '雨天室内方案',
    text: '今天下雨，想安排室内活动和晚餐，交通方便，不要排队太久。',
  },
  {
    label: '安静餐厅优先',
    text: '想和家人轻松吃个饭，优先推荐安静、环境好、可预约的餐厅，路线不要太远。',
  },
  {
    label: '不要太晚回家',
    text: '帮我安排一个不要太晚结束的周末计划，适合家人一起，少走路，餐厅环境好一点。',
  },
];

const mixedScenes = [
  {
    label: '多人偏好平衡',
    text: '周末和几个同行人一起出门，请帮我平衡大家的餐厅、活动、预算和路线偏好。',
  },
  {
    label: '同商圈少走路',
    text: '多人一起出门，希望活动和餐厅都在同一个商圈，少走路，方便集合和预约。',
  },
  {
    label: '预算内聚会',
    text: '周末多人聚会，预算不要超，想兼顾大家口味和活动偏好，最好能提前预约。',
  },
  {
    label: '可预约餐厅优先',
    text: '请优先推荐可预约餐厅，避开排队店，同时兼顾同行人的口味、预算和路线。',
  },
  {
    label: '雨天室内备选',
    text: '如果下雨，请给我一套多人室内备选方案，活动、吃饭和路线都要方便。',
  },
];

function friendNames(selectedFriends = []) {
  if (!selectedFriends.length) return '';
  const names = selectedFriends.map((friend) => friend.name);
  if (names.length <= 2) return names.join('、');
  return `${names.slice(0, 2).join('、')} +${names.length - 2}`;
}

function getFriendScenarioType(selectedFriends = []) {
  if (!selectedFriends.length) return 'generic';
  const hasAccessibility = selectedFriends.some((friend) => {
    const text = [friend.name, friend.relation, friend.summary, ...(friend.tags || [])].join(' ');
    return /爷爷|奶奶|行动不便|需要轮椅|轮椅|需要陪同|不能吃辣|不吃辣|无障碍|电梯方便|好停车/.test(text);
  });
  if (hasAccessibility) return 'accessibility';
  const hasFamily = selectedFriends.some((friend) => {
    const text = [friend.name, friend.relation, ...(friend.tags || [])].join(' ');
    return /妈妈|爸爸|宝宝|孩子|老人|家人|亲子|安静|少走路|不要太晚/.test(text);
  });
  const hasSocial = selectedFriends.some((friend) => {
    const text = [friend.id, friend.name, ...(friend.tags || [])].join(' ');
    return /xiaoyu|azhe|leo|小雨|阿哲|Leo|朋友|日料|展览|拍照|电影|火锅|Livehouse|烧烤/.test(text);
  });
  if (selectedFriends.length > 1 && hasFamily && hasSocial) return 'mixed';
  if (hasFamily) return 'family';
  if (hasSocial) return 'social';
  return 'mixed';
}

function getDynamicScenes(selectedFriends = []) {
  const type = getFriendScenarioType(selectedFriends);
  if (type === 'accessibility') {
    return [
      { label: '无障碍少走路', text: '周末想带行动不便的家人出门，需要轮椅友好、少走路、电梯方便、好停车，餐厅不能吃辣，不要太晚。' },
      { label: '清淡不辣晚餐', text: '想安排适合老人陪同的室内活动和清淡不辣晚餐，路线要短，可预约，环境安静。' },
      { label: '电梯方便路线', text: '请优先安排同商圈、电梯方便、无障碍通行的活动和餐厅，减少换乘和排队。' },
      { label: '安静陪同出行', text: '和家人轻松出门，不要吵，不要走太多路，最好有休息区和可预约的清淡餐厅。' },
      { label: '不太晚回家', text: '下午出门，想在 18 点左右结束，适合老人、轮椅友好、餐厅不辣。' },
    ];
  }
  if (type === 'social') return socialScenes;
  if (type === 'family') return familyScenes;
  if (type === 'mixed') return mixedScenes;
  return quickScenes.map((item) => ({
    label: item.label,
    text: sampleRequests[item.key],
  }));
}

function getDynamicQuestions(selectedFriends = []) {
  const names = friendNames(selectedFriends);
  const type = getFriendScenarioType(selectedFriends);
  if (type === 'accessibility') {
    const familyName = names || '家人';
    return [
      `带${familyName}出门，轮椅友好、少走路怎么安排？`,
      '能不能过滤掉火锅烧烤和需要久站的活动？',
      '请优先推荐不辣、安静、可预约的餐厅。',
    ];
  }
  if (type === 'social') {
    return [
      `我和${names}下午 4 小时怎么安排？`,
      '能不能避开排队店，同时保留拍照和晚餐？',
      '预算 400 内，适合多人轻松出行吗？',
    ];
  }
  if (type === 'family') {
    const familyName = names || '家人';
    return [
      `带${familyName}出门，少走路的路线怎么安排？`,
      '下雨天适合家人一起去哪里？',
      '能不能优先推荐安静、可预约的餐厅？',
    ];
  }
  if (type === 'mixed') {
    return [
      `我和${names}一起出门，怎么平衡大家偏好？`,
      '能不能优先安排同商圈、少走路、可预约的方案？',
      '预算 400 内，多人吃喝玩乐怎么安排？',
    ];
  }
  return [
    '附近 3 小时轻松约会怎么安排？',
    '餐厅满座时能自动换同价位选择吗？',
    '帮我控制预算并减少路上时间。',
  ];
}

export default function AgentInputPage({ value, onChange, onBack, onPlan, selectedFriends = [] }) {
  const dynamicScenes = getDynamicScenes(selectedFriends);
  const dynamicQuestions = getDynamicQuestions(selectedFriends);
  const names = friendNames(selectedFriends);

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#f6f6f6]">
      <header className="sticky top-0 z-10 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-[#f5f5f5]">
            <ArrowLeft size={19} />
          </button>
          <div>
            <h1 className="font-black">周末帮我排</h1>
            <p className="text-xs text-[#777]">团崽 AI 正在接入美团小团本地生活工具链</p>
          </div>
        </div>
      </header>

      <section className="px-4 pb-5 pt-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#fff6bf] to-white p-4 shadow-card">
          <div className="mb-4 flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-mt-yellow">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black">团崽帮你规划</h2>
              <p className="mt-1 text-sm leading-5 text-[#666]">
                告诉团崽时间、预算、同行人和偏好，我来帮你把周末安排好。
              </p>
              <div className="mt-2 rounded-full border border-[#ffe5a0] bg-[#fff8df] px-3 py-1.5 text-[11px] font-bold text-[#8a5a00]">
                {selectedFriends.length
                  ? `已纳入同行人偏好：${names}`
                  : '未选择同行人，将按你的个人偏好规划。'}
              </div>
            </div>
          </div>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-36 w-full resize-none rounded-2xl border border-[#eee] bg-white p-4 text-[15px] leading-6 outline-none focus:border-mt-yellow"
          />
          <button
            onClick={onPlan}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#222] text-sm font-bold text-white"
          >
            开始规划 <SendHorizontal size={17} />
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
          <h3 className="mb-3 text-sm font-bold">快捷场景</h3>
          <div className="grid grid-cols-2 gap-2">
            {dynamicScenes.map((item) => (
              <button
                key={item.label}
                onClick={() => onChange(item.text)}
                className="rounded-xl border border-[#f1e3c8] bg-[#fffaf0] px-3 py-3 text-left text-sm font-semibold text-[#5a3218] shadow-[0_6px_14px_rgba(132,67,13,0.04)] active:bg-[#fff3b0]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
          <h3 className="text-sm font-bold">推荐问题</h3>
          <div className="mt-3 space-y-2 text-sm text-[#555]">
            {dynamicQuestions.map((question) => (
              <button
                key={question}
                onClick={() => onChange(question)}
                className="block w-full rounded-xl bg-[#f7f7f7] px-3 py-2 text-left text-sm text-[#555] active:bg-[#fff3b0]"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
