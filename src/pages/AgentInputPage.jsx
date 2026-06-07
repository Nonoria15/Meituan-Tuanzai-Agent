import { ArrowLeft, Bot, SendHorizontal } from 'lucide-react';
import { quickScenes, sampleRequests } from '../data/mockData.js';

const dateScenes = [
  {
    label: '双人轻松约会',
    text: '周末想和小雨轻松约会，希望能拍照、有甜品或日料，路线别太远，最好同一个商圈解决。',
  },
  {
    label: '拍照 + 晚餐',
    text: '想安排适合拍照的活动和晚餐，节奏轻松一点，餐厅希望可预约、别排太久。',
  },
  {
    label: '日料甜品路线',
    text: '周末想安排日料和甜品，路线少走一点，预算控制在 400 内。',
  },
  {
    label: '同商圈少走路',
    text: '请把活动、甜品和晚餐安排在同一个商圈，少走路，节奏轻松一点。',
  },
  {
    label: '预算内不踩雷',
    text: '想和小雨轻松约会，预算别太高，优先选择评分高、可预约、不排队的店。',
  },
];

const socialScenes = [
  {
    label: '朋友聚会吃喝玩乐',
    text: '今晚和朋友聚会，想先玩再吃饭，气氛热闹一些，最好同一个商圈解决。',
  },
  {
    label: '热闹不踩雷',
    text: '今晚和朋友聚会，想先玩再吃饭，气氛热闹一点，预算别太高，最好同一个商圈解决。',
  },
  {
    label: '桌游 + 烤肉',
    text: '今晚想和朋友先玩桌游再吃烤肉，气氛热闹一点，最好都在同一个商圈。',
  },
  {
    label: '电影 + 火锅',
    text: '想和朋友看电影后吃火锅，预算别太高，尽量避开高排队商家。',
  },
  {
    label: '同商圈少折腾',
    text: '朋友聚会希望活动和餐厅都在同一个商圈，少换乘，能提前预约最好。',
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

const familyElderScenes = [
  {
    label: '陪老人轻松出门',
    text: '周末想和妈妈一起带爷爷出门，希望路线少走路、电梯方便，餐厅清淡不辣，最好安静一点、不要太晚回家。',
  },
  {
    label: '清淡不辣晚餐',
    text: '想安排适合家人陪同的室内活动和清淡不辣晚餐，路线要短，可预约，环境安静。',
  },
  {
    label: '无障碍同商圈',
    text: '请优先安排同商圈、电梯方便、无障碍通行的活动和餐厅，减少换乘和排队。',
  },
  {
    label: '安静家庭路线',
    text: '和妈妈一起带爷爷轻松出门，不要吵，不要走太多路，最好有休息区和可预约餐厅。',
  },
  {
    label: '不太晚回家',
    text: '下午出门，希望 18 点左右结束，适合老人陪同，餐厅清淡不辣、好停车。',
  },
];

const accessibilityScenes = [
  {
    label: '无障碍少走路',
    text: '周末想带爷爷出门，希望少走路、电梯方便、安静不吵，餐厅要有不辣选择，最好不要太晚回家。',
  },
  {
    label: '清淡不辣晚餐',
    text: '想带爷爷轻松出门，优先选择无障碍、少走路、安静、好停车的路线，餐厅需要清淡不辣。',
  },
  {
    label: '电梯方便路线',
    text: '请优先安排同商圈、电梯方便、无障碍通行的活动和餐厅，减少换乘和排队。',
  },
  {
    label: '安静陪同出行',
    text: '和爷爷轻松出门，不要吵，不要走太多路，最好有休息区和可预约的清淡餐厅。',
  },
  {
    label: '不太晚回家',
    text: '下午带爷爷出门，希望 18 点左右结束，轮椅友好、少走路，餐厅要有不辣选择。',
  },
];

const soloScenes = [
  {
    label: '一个人轻松转转',
    text: '周末想一个人轻松转转，找个附近的活动或咖啡休息一下，预算别太高，路线简单一点。',
  },
  {
    label: '附近咖啡休息',
    text: '想找附近咖啡馆坐一会儿，顺便安排一个轻松活动，路线不要太远。',
  },
  {
    label: '低预算不踩雷',
    text: '周末想低预算放松半天，优先推荐便宜、评分稳定、离我近的活动和餐厅。',
  },
  {
    label: '雨天室内方案',
    text: '如果下雨，帮我安排室内活动和咖啡/简餐，交通方便，不要排队太久。',
  },
  {
    label: '半日放松路线',
    text: '想安排一个半日轻松路线，有活动、有休息点，预算别太高，少走路。',
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
    return /爷爷|奶奶|老人|行动不便|需要轮椅|轮椅|需要陪同|不能吃辣|不吃辣|无障碍|电梯方便|好停车/.test(text);
  });
  const hasElderFamily = selectedFriends.some((friend) => {
    const text = [friend.name, friend.relation, friend.summary, ...(friend.tags || [])].join(' ');
    return /妈妈|爸爸|家人|家庭/.test(text);
  });
  if (hasAccessibility && hasElderFamily) return 'family_elder';
  if (hasAccessibility) return 'accessibility';
  const hasKids = selectedFriends.some((friend) => {
    const text = [friend.name, friend.relation, friend.summary, ...(friend.tags || [])].join(' ');
    return /孩子|宝宝|儿童|亲子/.test(text);
  });
  if (hasKids) return 'family';
  const hasFamily = selectedFriends.some((friend) => {
    const text = [friend.name, friend.relation, ...(friend.tags || [])].join(' ');
    return /妈妈|爸爸|家人|亲子/.test(text);
  });
  const hasSocial = selectedFriends.some((friend) => {
    const text = [friend.id, friend.name, ...(friend.tags || [])].join(' ');
    return /azhe|leo|阿哲|Leo|朋友|电影|火锅|Livehouse|烧烤|热闹/.test(text);
  });
  const hasDate = selectedFriends.some((friend) => {
    const text = [friend.id, friend.name, ...(friend.tags || [])].join(' ');
    return /xiaoyu|小雨|拍照|日料|展览|约会|少走路/.test(text);
  });
  if (hasDate && !hasSocial) return 'date';
  if ((hasSocial || selectedFriends.length >= 3) && !hasFamily) return 'social';
  if (selectedFriends.length > 1 && hasFamily && hasSocial) return 'mixed';
  if (hasFamily) return 'family';
  if (hasDate) return 'date';
  if (hasSocial) return 'social';
  return 'mixed';
}

export function getDefaultPlanningContent(selectedFriends = []) {
  const type = getFriendScenarioType(selectedFriends);
  if (type === 'accessibility') {
    return {
      sceneType: type,
      defaultInput: '周末想带爷爷出门，希望少走路、电梯方便、安静不吵，餐厅要有不辣选择，最好不要太晚回家。',
      quickScenes: accessibilityScenes,
      recommendedQuestions: [
        '带爷爷出门，轮椅友好、少走路怎么安排？',
        '能不能过滤掉火锅烧烤和需要久站的活动？',
        '想找安静、好停车、不辣的晚餐路线。',
      ],
    };
  }
  if (type === 'family_elder') {
    return {
      sceneType: type,
      defaultInput: '周末想和妈妈一起带爷爷出门，希望路线少走路、电梯方便，餐厅清淡不辣，最好安静一点、不要太晚回家。',
      quickScenes: familyElderScenes,
      recommendedQuestions: [
        '和妈妈一起带爷爷出门，少走路路线怎么安排？',
        '有没有电梯方便、可预约、不辣的餐厅？',
        '想要安静、好停车、适合陪同的半日路线。',
      ],
    };
  }
  if (type === 'date') {
    return {
      sceneType: type,
      defaultInput: '周末想和小雨轻松约会，希望能拍照、有甜品或日料，路线别太远，最好同一个商圈解决。',
      quickScenes: dateScenes,
      recommendedQuestions: [
        '和小雨约会，拍照加晚餐怎么安排？',
        '想少走路，有日料和甜品的路线有哪些？',
        '预算内轻松约会，怎么避开排队店？',
      ],
    };
  }
  if (type === 'social') {
    return {
      sceneType: type,
      defaultInput: '今晚和朋友聚会，想先玩再吃饭，气氛热闹一些，最好同一个商圈解决。',
      quickScenes: socialScenes,
      recommendedQuestions: [
        '三四个人聚会，怎么安排不踩雷？',
        '能不能避开高排队商家，同时保留热闹氛围？',
        '预算 400 内，朋友聚会怎么安排？',
      ],
    };
  }
  if (type === 'family') {
    return {
      sceneType: type,
      defaultInput: '周末想带孩子出门，希望室内、轻松、安全，餐厅亲子友好，路线不要太折腾。',
      quickScenes: familyScenes,
      recommendedQuestions: [
        '带孩子出门，室内轻松路线怎么安排？',
        '有没有亲子友好、少走路的餐厅？',
        '下雨天适合家人一起去哪里？',
      ],
    };
  }
  if (type === 'mixed') {
    return {
      sceneType: type,
      defaultInput: '周末和几个同行人一起出门，请帮我平衡大家的餐厅、活动、预算和路线偏好。',
      quickScenes: mixedScenes,
      recommendedQuestions: [
        '多人一起出门，怎么平衡大家偏好？',
        '能不能优先安排同商圈、少走路、可预约的方案？',
        '预算 400 内，多人吃喝玩乐怎么安排？',
      ],
    };
  }
  return {
    sceneType: 'generic',
    defaultInput: '周末想一个人轻松转转，找个附近的活动或咖啡休息一下，预算别太高，路线简单一点。',
    quickScenes: soloScenes,
    recommendedQuestions: [
      '附近一个人轻松转转怎么安排？',
      '想找个咖啡和活动，路线别太远。',
      '低预算半日放松有什么选择？',
    ],
  };
}

export default function AgentInputPage({ value, onChange, onBack, onPlan, selectedFriends = [] }) {
  const planningContent = getDefaultPlanningContent(selectedFriends);
  const dynamicScenes = planningContent.quickScenes;
  const dynamicQuestions = planningContent.recommendedQuestions;
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
