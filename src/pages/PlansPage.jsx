import { useState } from 'react';
import { Clock3, ExternalLink, MapPinned, RotateCcw, SlidersHorizontal, Star } from 'lucide-react';
import { activities, generatePlans, restaurants } from '../data/mockData.js';

function getById(list, id) {
  return list.find((item) => item.id === id);
}

function friendNames(selectedFriends = []) {
  if (!selectedFriends.length) return '';
  const names = selectedFriends.map((friend) => friend.name);
  if (names.length <= 2) return names.join('、');
  return `${names.slice(0, 2).join('、')} +${names.length - 2}`;
}

function friendConstraintReason(selectedFriends = []) {
  const manual = selectedFriends.find((friend) => friend.source === 'manual');
  const invited = selectedFriends.find((friend) => friend.source === 'invite');
  if (manual) {
    const tags = (manual.tags || []).slice(0, 2).join('和');
    return `已考虑${manual.name}的${tags || '少走路'}偏好。`;
  }
  if (invited) {
    const tags = (invited.tags || []).slice(0, 2).join('和');
    return `已结合${invited.name}的${tags || '餐厅'}偏好和你的预算限制。`;
  }
  return '';
}

function groupReason(plan, selectedFriends = []) {
  if (plan.reason) return plan.reason;
  const names = friendNames(selectedFriends);
  if (!selectedFriends.length) {
    return '匹配理由：已避开高排队商家，优先选择今日可预约餐厅，路线集中在同一商圈。';
  }
  const extra = friendConstraintReason(selectedFriends);
  if (plan.id === 'A') return `匹配理由：兼顾少走路、预算内和可预约。同行偏好已纳入：${names}。${extra}`;
  if (plan.id === 'B') return `匹配理由：保留氛围感，避开高排队商家，优先选择同商圈可预约餐厅。同行偏好已纳入：${names}。${extra}`;
  return `匹配理由：节奏稳定、预算可控，优先选择今日可预约餐厅。同行偏好已纳入：${names}。${extra}`;
}

function buildTimeline(plan, activity, restaurant) {
  if (plan.timelineDetails?.length) return plan.timelineDetails;

  const parseTimeline = (entry = '') => {
    const [time, ...rest] = entry.split(' ');
    return {
      time: time || '',
      title: rest.join(' ') || entry,
    };
  };

  if (plan.id === 'A') {
    return [
      {
        time: '14:00–15:30',
        title: '光影沉浸式艺术展',
        meta: `★${activity.rating} ｜ ¥${activity.price}/人`,
      },
      {
        time: '15:45–16:30',
        title: '商场甜品/咖啡',
        meta: '同商圈休息点 ｜ 可拍照',
      },
      {
        time: '17:30–18:50',
        title: restaurant.name,
        meta: `${restaurant.rating}分 ｜ 人均 ¥${restaurant.average} ｜ ${restaurant.coupon}`,
      },
    ];
  }

  const first = parseTimeline(plan.timeline[0]);
  const second = parseTimeline(plan.timeline[1]);
  const third = parseTimeline(plan.timeline[2]);

  return [
    {
      time: first.time || '14:30-16:00',
      title: first.title || activity.name,
      meta: `★${activity.rating} ｜ ¥${activity.price}/人`,
    },
    {
      time: second.time || '16:30-18:00',
      title: second.title || restaurant.name,
      meta: `${restaurant.rating}分 ｜ 人均 ¥${restaurant.average}`,
    },
    {
      time: third.time || '18:20-19:00',
      title: third.title || '附近轻松收尾',
      meta: plan.highlight,
    },
  ];
}

const stopImagePools = {
  boardgameCafe: [
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?auto=format&fit=crop&w=720&q=80',
  ],
  livehouse: [
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=720&q=80',
  ],
  bbq: [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=720&q=80',
  ],
  hotpot: [
    'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1585653621032-a5fec164ee92?auto=format&fit=crop&w=720&q=80',
  ],
  movie: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=720&q=80',
  ],
  mallWalk: [
    'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=720&q=80',
  ],
  exhibition: [
    'https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=720&q=80',
  ],
  sushi: [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=720&q=80',
  ],
  cafeDessert: [
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=720&q=80',
  ],
  tea: [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?auto=format&fit=crop&w=720&q=80',
  ],
  park: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=720&q=80',
  ],
  bookstore: [
    'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=720&q=80',
  ],
  familyKids: [
    'https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1564927154034-bffbb086db11?auto=format&fit=crop&w=720&q=80',
  ],
  quietRestaurant: [
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=720&q=80',
  ],
  western: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=720&q=80',
  ],
  snack: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=720&q=80',
  ],
};

const fixedStopRules = [
  { pattern: /城市桌游咖啡局|桌游咖啡局|桌游/, type: '桌游/咖啡局', pool: 'boardgameCafe' },
  { pattern: /牧野烤肉研究所|烤肉|烧烤/, type: '烤肉', pool: 'bbq' },
  { pattern: /Livehouse|演出|音乐现场/, type: 'Livehouse', pool: 'livehouse' },
  { pattern: /商圈影院|电影|影院/, type: '电影', pool: 'movie' },
  { pattern: /铜炉记火锅|火锅/, type: '火锅', pool: 'hotpot' },
  { pattern: /光影|沉浸|公共艺术|艺术展|展馆|展览/, type: '展览', pool: 'exhibition' },
  { pattern: /椿山日料|晴川日料|日料|寿喜|寿司|刺身|烧鸟/, type: '日料', pool: 'sushi' },
  { pattern: /商圈散步|轻松散步|散步\/饮品|饮品|商场休息|附近轻松收尾|商场内轻松散步|商圈散步\/饮品/, type: '商圈散步/饮品', pool: 'mallWalk' },
  { pattern: /咖啡|甜品/, type: '咖啡/甜品', pool: 'cafeDessert' },
  { pattern: /茶文化|茶馆|茶点/, type: '茶馆/茶文化', pool: 'tea' },
  { pattern: /公园|短步行/, type: '公园短步行', pool: 'park' },
  { pattern: /书店|阅读/, type: '书店', pool: 'bookstore' },
  { pattern: /儿童|亲子|乐园|科学馆/, type: '亲子室内', pool: 'familyKids' },
  { pattern: /粤菜|家常菜|暖汤|安静餐厅|南园/, type: '安静餐厅', pool: 'quietRestaurant' },
  { pattern: /西餐/, type: '西餐', pool: 'western' },
  { pattern: /平价小食|小食/, type: '简餐小食', pool: 'snack' },
];

function chooseImage(candidates = [], planUsedImages, pageUsedImages) {
  const uniqueCandidates = candidates.filter(Boolean);
  if (!uniqueCandidates.length) return stopImagePools.mallWalk[0];

  const freshForPage = uniqueCandidates.find((image) => !planUsedImages.has(image) && !pageUsedImages.has(image));
  const freshForPlan = uniqueCandidates.find((image) => !planUsedImages.has(image));
  const selected = freshForPage || freshForPlan || uniqueCandidates[0];

  planUsedImages.add(selected);
  pageUsedImages.add(selected);
  return selected;
}

function inferStopVisual(title = '', planUsedImages = new Set(), pageUsedImages = new Set()) {
  const rule = fixedStopRules.find(({ pattern }) => pattern.test(title));
  const pool = rule ? stopImagePools[rule.pool] : stopImagePools.mallWalk;
  return {
    image: chooseImage(pool, planUsedImages, pageUsedImages),
    imageGallery: pool,
    type: rule?.type || '本地生活',
  };
}

function priceText(place = {}) {
  if (place.packagePrice) return `套餐 ¥${place.packagePrice}`;
  if (place.pricePerPerson) return `¥${place.pricePerPerson}/人`;
  if (place.average) return `人均 ¥${place.average}`;
  if (place.price) return `¥${place.price}/人`;
  return '价格以门店为准';
}

function queueText(level) {
  if (level === 'high') return '排队较高';
  if (level === 'medium') return '排队适中';
  return '低排队风险';
}

function typeText(place = {}) {
  return place.category || place.cuisine || place.detailType || place.type || '本地生活';
}

function makeFallbackStop(item, plan, planUsedImages, pageUsedImages) {
  const visual = inferStopVisual(item.title, planUsedImages, pageUsedImages);
  return {
    id: `${plan.id}-${item.time}-${item.title}`,
    name: item.title,
    detailType: visual.type,
    image: visual.image,
    imageGallery: visual.imageGallery,
    rating: 4.7,
    pricePerPerson: /咖啡|甜品|书店|茶/.test(item.title) ? 36 : 58,
    distanceKm: 0.6,
    walkingMinutes: 5,
    businessHours: '10:00-21:30',
    bookable: true,
    queueLevel: 'low',
    tags: ['同商圈', '少走路', '可预约'],
    reason: plan.reason || '适合当前方案节奏，路线集中在同一商圈，便于继续执行预订和提醒。',
  };
}

function resolveStop(item, index, timeline, activity, restaurant, plan, planUsedImages, pageUsedImages) {
  const title = item.title || '';
  const rule = fixedStopRules.find(({ pattern }) => pattern.test(title));
  const activityMatch = activity && (title.includes(activity.name) || activity.name.includes(title));
  const restaurantMatch = restaurant && (title.includes(restaurant.name) || restaurant.name.includes(title));
  const restaurantLike = /餐|日料|火锅|烤肉|粤菜|小馆|食|烧鸟|寿喜|晚餐/.test(title);

  let place = null;
  if (rule) {
    const pool = stopImagePools[rule.pool] || stopImagePools.mallWalk;
    const matchedPlace = restaurantMatch ? restaurant : activityMatch ? activity : null;
    place = {
      ...matchedPlace,
      id: matchedPlace?.id || `${plan.id}-${index}-${title}`,
      name: title,
      detailType: rule.type,
      imageGallery: [...pool, matchedPlace?.previewImage, matchedPlace?.image].filter(Boolean),
    };
  } else if (activityMatch || (!restaurantLike && index === 0 && activity)) {
    place = activity;
  } else if (restaurantMatch || (restaurantLike && restaurant)) {
    place = restaurant;
  } else {
    place = makeFallbackStop(item, plan, planUsedImages, pageUsedImages);
  }

  const fallback = inferStopVisual(title, new Set(planUsedImages), new Set(pageUsedImages));
  const gallery = place?.imageGallery || [place?.previewImage, place?.image, fallback.image];
  const image = chooseImage(gallery, planUsedImages, pageUsedImages);

  return {
    ...place,
    name: place?.name || title,
    detailType: typeText(place) || fallback.type,
    image,
    planTime: item.time,
    planMeta: item.meta,
    currentPlan: plan,
  };
}

function buildPlanStops(plan, activity, restaurant, timeline, pageUsedImages = new Set()) {
  const planUsedImages = new Set();
  return timeline
    .slice(0, 3)
    .map((item, index) => resolveStop(item, index, timeline, activity, restaurant, plan, planUsedImages, pageUsedImages));
}

export default function PlansPage({ request = '', onBack, onConfirm, selectedFriends = [] }) {
  const [detailPlace, setDetailPlace] = useState(null);
  const recommendedPlans = generatePlans(request, selectedFriends);
  const pageUsedImages = new Set();

  return (
    <>
      <main className="plans-page min-h-0 flex-1 overflow-y-auto bg-[#f6f6f6]">
        <header className="sticky top-0 z-10 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="plans-back-button" aria-label="返回">
              ←
            </button>
            <div>
              <h1 className="text-[18px] font-black leading-tight text-[#1f1f1f]">为你生成 3 个方案</h1>
              <p className="mt-1 text-xs text-[#777]">已按同行偏好、排队风险、预算和可预约成功率排序</p>
            </div>
          </div>
        </header>

        <div className="plans-filter-row flex gap-2 overflow-x-auto px-4 py-3 text-sm">
          {['综合排序', '距离近', '预算内', '可预约'].map((filter, index) => (
            <button
              key={filter}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${
                index === 0 ? 'bg-mt-yellow text-[#111] shadow-sm' : 'bg-white text-[#555]'
              }`}
            >
              {filter}
            </button>
          ))}
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white shadow-sm">
            <SlidersHorizontal size={17} />
          </button>
        </div>

        <section className="space-y-4 px-4 pb-5">
          {recommendedPlans.map((plan) => {
            const activity = getById(activities, plan.activityId);
            const restaurant = getById(restaurants, plan.restaurantId);
            const timeline = buildTimeline(plan, activity, restaurant);
            const stops = buildPlanStops(plan, activity, restaurant, timeline, pageUsedImages);

            return (
              <article key={plan.id} className="plan-card">
                <div className="plan-card-header">
                  <div className="min-w-0">
                    <div className="plan-badge-row">
                      <span className="plan-code">方案 {plan.id}</span>
                      <span className="plan-recommend-badge">{plan.badge}</span>
                    </div>
                    <h2>{plan.title}</h2>
                    <p>{plan.highlight}</p>
                  </div>
                  <div className="plan-price">
                    <span>预计总价</span>
                    <strong>¥{plan.budget}</strong>
                  </div>
                </div>

                <div className="plan-stop-preview" aria-label={`${plan.title} 站点预览`}>
                  {stops.map((stop) => (
                    <button
                      key={`${plan.id}-${stop.planTime}-${stop.name}`}
                      type="button"
                      className="plan-stop-thumb"
                      onClick={() => setDetailPlace(stop)}
                    >
                      <img src={stop.image} alt={stop.name} />
                      <span className="plan-stop-detail-icon">
                        <ExternalLink size={12} />
                      </span>
                      <span className="plan-stop-thumb-title">{stop.name}</span>
                    </button>
                  ))}
                </div>

                <div className="plan-timeline">
                  {timeline.map((item, index) => (
                    <button
                      key={`${plan.id}-${item.time}-${item.title}`}
                      type="button"
                      className="plan-timeline-item is-clickable"
                      onClick={() => setDetailPlace(stops[index] || stops[0])}
                    >
                      <div className="plan-time">{item.time}</div>
                      <div className="plan-node" />
                      <div className="plan-timeline-copy">
                        <strong>{item.title}</strong>
                        <span>{item.meta}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="plan-route-grid">
                  <div>
                    <Clock3 size={13} />
                    <span>路线耗时</span>
                    <strong>{plan.travel}</strong>
                  </div>
                  <div>
                    <MapPinned size={13} />
                    <span>距离</span>
                    <strong>{plan.distance}</strong>
                  </div>
                </div>

                <div className="plan-reason-box">
                  <Star size={13} fill="currentColor" />
                  <span>{groupReason(plan, selectedFriends)}</span>
                </div>

                <div className="plan-tag-row">
                  {plan.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="plan-action-row">
                  <button>
                    <RotateCcw size={13} /> 换一个
                  </button>
                  <button onClick={() => onConfirm(plan)}>确认这个方案</button>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      {detailPlace && (
        <div className="plan-detail-backdrop" onClick={() => setDetailPlace(null)}>
          <section className="plan-detail-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="plan-detail-handle" />
            <div className="plan-detail-scroll">
              <img className="plan-detail-hero" src={detailPlace.image} alt={detailPlace.name} />
              <div className="plan-detail-title-row">
                <div>
                  <p>{typeText(detailPlace)}</p>
                  <h3>{detailPlace.name}</h3>
                </div>
                <span>{detailPlace.rating || 4.7}分</span>
              </div>

              <div className="plan-detail-meta-grid">
                <div>
                  <span>价格</span>
                  <strong>{priceText(detailPlace)}</strong>
                </div>
                <div>
                  <span>距离</span>
                  <strong>
                    {detailPlace.distance || `${detailPlace.distanceKm || 0.6}km`} · 步行
                    {detailPlace.walkingMinutes || 5}分钟
                  </strong>
                </div>
                <div>
                  <span>营业时间</span>
                  <strong>{detailPlace.businessHours || '10:00-21:30'}</strong>
                </div>
                <div>
                  <span>预约状态</span>
                  <strong>{detailPlace.bookable === false ? '需排队' : '可预约/可买券'}</strong>
                </div>
              </div>

              <div className="plan-detail-time">
                <Clock3 size={14} />
                <span>当前方案时间段：{detailPlace.planTime}</span>
              </div>

              <div className="plan-detail-reason">
                <strong>推荐理由</strong>
                <p>{detailPlace.reason || groupReason(detailPlace.currentPlan, selectedFriends)}</p>
              </div>

              <div className="plan-detail-tags">
                {(detailPlace.tags || ['同商圈', queueText(detailPlace.queueLevel), '适合当前偏好'])
                  .slice(0, 5)
                  .map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
              </div>
            </div>
            <div className="plan-detail-actions">
              <button onClick={() => setDetailPlace(null)}>返回方案</button>
              <button onClick={() => setDetailPlace(null)}>保留此站点</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
