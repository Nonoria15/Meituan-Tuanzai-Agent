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
  hotpotTongluji: ['/images/hotpot-tongluji.png'],
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
    '/images/hotpot-tongluji.png',
    'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=720&q=80',
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
  { pattern: /铜炉记火锅|火锅/, type: '火锅', pool: 'hotpotTongluji' },
  { pattern: /光影|沉浸|公共艺术|艺术展|展馆|展览/, type: '展览', pool: 'exhibition' },
  { pattern: /椿山日料|晴川日料|日料|寿喜|寿司|刺身|烧鸟/, type: '日料', pool: 'sushi' },
  { pattern: /商圈散步|轻松散步|散步\/饮品|饮品|商场休息|附近轻松收尾|商场内轻松散步|商圈散步\/饮品/, type: '商圈散步/饮品', pool: 'mallWalk' },
  { pattern: /咖啡|甜品/, type: '咖啡/甜品', pool: 'cafeDessert' },
  { pattern: /茶文化|茶馆|茶点/, type: '茶馆/茶文化', pool: 'tea' },
  { pattern: /公园|短步行/, type: '公园短步行', pool: 'park' },
  { pattern: /书店|阅读/, type: '书店', pool: 'bookstore' },
  { pattern: /无障碍|轮椅|博物馆|室内展馆|休闲无障碍动线/, type: '无障碍友好', pool: 'quietRestaurant' },
  { pattern: /养生汤|清淡|不辣|松鹤|半日茶餐厅/, type: '清淡不辣餐厅', pool: 'quietRestaurant' },
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

const wholePlanVariants = {
  date: [
    {
      title: '拍照 + 西餐约会',
      badge: '约会备选',
      tags: ['可预约', '适合拍照', '预算内', '少走路'],
      timelineDetails: [
        { time: '14:10-15:30', title: '公共艺术展', meta: '★4.8 ｜ ¥68/人 ｜ 可预约' },
        { time: '15:45-16:35', title: '云朵咖啡甜品', meta: '同商圈甜品 ｜ 适合拍照' },
        { time: '17:20-18:40', title: '月白西餐小馆', meta: '4.7分 ｜ 人均 ¥98 ｜ 可预约' },
      ],
      budget: 368,
      travel: '约18分钟',
      distance: '同商圈内',
      highlight: '拍照、甜品和晚餐节奏更轻',
      reason: '匹配理由：保留拍照和轻松约会体验，餐厅支持预约，路线集中在同一商圈。',
      activityId: 'a10',
      restaurantId: 'r10',
    },
    {
      title: '展览 + 日料轻松路线',
      badge: '低排队',
      tags: ['推荐', '距离近', '可预约', '低排队'],
      timelineDetails: [
        { time: '14:00-15:20', title: '光影沉浸式艺术展', meta: '★4.9 ｜ ¥98/人 ｜ 余票充足' },
        { time: '15:35-16:25', title: '商场咖啡甜品', meta: '同商圈休息点 ｜ 可拍照' },
        { time: '17:20-18:40', title: '晴川日料·炙烧专门店', meta: '4.8分 ｜ 人均 ¥86 ｜ 可预约' },
      ],
      budget: 368,
      travel: '约16分钟',
      distance: '集中在同一商圈',
      highlight: '不赶路，适合拍照和日料偏好',
      reason: '匹配理由：优先选择低排队展览和可预约日料，兼顾拍照、预算和少走路。',
      activityId: 'a1',
      restaurantId: 'r2',
    },
  ],
  friends: [
    {
      title: '桌游 + 烤肉路线',
      badge: '聚会备选',
      tags: ['热闹', '可预约', '同商圈', '预算内'],
      timelineDetails: [
        { time: '14:30-16:00', title: '城市桌游咖啡局', meta: '★4.7 ｜ ¥58/人 ｜ 可预约' },
        { time: '16:20-17:50', title: '牧野烤肉研究所', meta: '4.8分 ｜ 人均 ¥118 ｜ 可预约' },
        { time: '18:10-19:00', title: '商圈散步/饮品', meta: '同商圈 ｜ 节奏灵活' },
      ],
      budget: 352,
      travel: '约20分钟',
      distance: '同商圈内',
      highlight: '热闹但不赶路，适合朋友聚会',
      reason: '匹配理由：保留聚会氛围，活动和餐厅都可预约，避开高排队商家。',
      activityId: 'a2',
      restaurantId: 'r3',
    },
    {
      title: '电影 + 火锅聚会',
      badge: '稳定备选',
      tags: ['室内', '热闹', '预算内', '可预约'],
      timelineDetails: [
        { time: '14:20-16:20', title: '商圈影院双人电影', meta: '★4.6 ｜ 室内稳定' },
        { time: '16:40-18:10', title: '铜炉记火锅', meta: '4.6分 ｜ 人均 ¥92 ｜ 可取号' },
        { time: '18:20-19:00', title: '商场轻松散步', meta: '同商圈收尾 ｜ 不赶路' },
      ],
      budget: 330,
      travel: '约18分钟',
      distance: '同商圈内',
      highlight: '稳定、热闹，雨天也可执行',
      reason: '匹配理由：适合朋友聚会，保留热闹氛围，同时控制预算和排队风险。',
      activityId: 'a4',
      restaurantId: 'r4',
    },
  ],
  elderly: [
    {
      title: '茶馆 + 粤菜少走路路线',
      badge: '少走路',
      tags: ['安静', '少走路', '可预约', '不太晚'],
      timelineDetails: [
        { time: '14:00-15:20', title: '茶文化室内展馆', meta: '★4.8 ｜ ¥36/人 ｜ 电梯方便' },
        { time: '15:30-16:20', title: '栖木茶馆休息', meta: '安静茶点 ｜ 步行 3 分钟' },
        { time: '17:00-18:10', title: '南园粤菜小馆', meta: '4.8分 ｜ 人均 ¥82 ｜ 可预约' },
      ],
      budget: 296,
      travel: '约12分钟',
      distance: '同商圈少走路',
      highlight: '安静、少走路、不太晚',
      reason: '匹配理由：已考虑老人少走路、安静和不要太晚偏好，优先同商圈可预约餐厅。',
      activityId: 'a7',
      restaurantId: 'r6',
    },
    {
      title: '公园短步行 + 家常菜',
      badge: '低强度',
      tags: ['短步行', '安静', '预算内', '早结束'],
      timelineDetails: [
        { time: '14:30-15:20', title: '滨河公园短步行', meta: '免费 ｜ 低强度' },
        { time: '15:35-16:20', title: '栖木茶馆', meta: '安静休息 ｜ 可预约' },
        { time: '17:00-18:00', title: '暖汤家常菜', meta: '4.7分 ｜ 人均 ¥68 ｜ 可预约' },
      ],
      budget: 238,
      travel: '约18分钟',
      distance: '短步行动线',
      highlight: '慢节奏，适合家人',
      reason: '匹配理由：不安排夜间活动，路线低强度，餐厅安静可预约。',
      activityId: 'a8',
      restaurantId: 'r7',
    },
  ],
  family: [
    {
      title: '科学馆 + 亲子餐厅',
      badge: '亲子备选',
      tags: ['亲子友好', '室内', '不太晚', '可预约'],
      timelineDetails: [
        { time: '14:00-15:30', title: '城市科学馆亲子展', meta: '★4.7 ｜ ¥48/人 ｜ 室内互动' },
        { time: '15:40-16:20', title: '商场甜品休息', meta: '少走路 ｜ 亲子休息点' },
        { time: '17:00-18:00', title: '亲子动物主题餐厅', meta: '4.7分 ｜ 人均 ¥78 ｜ 可预约' },
      ],
      budget: 270,
      travel: '约14分钟',
      distance: '商场及周边',
      highlight: '室内互动，适合亲子',
      reason: '匹配理由：孩子有互动体验，餐厅亲子友好且可预约，结束时间不晚。',
      activityId: 'a6',
      restaurantId: 'r8',
    },
  ],
  rainy: [
    {
      title: '书店 + 安静晚餐',
      badge: '雨天室内',
      tags: ['雨天', '室内', '安静', '预算内'],
      timelineDetails: [
        { time: '14:00-15:30', title: '独立书店雨天阅读局', meta: '★4.7 ｜ ¥28/人 ｜ 室内' },
        { time: '15:40-16:30', title: '咖啡休息', meta: '同商圈 ｜ 少走路' },
        { time: '17:00-18:00', title: '暖汤家常菜', meta: '4.7分 ｜ 人均 ¥68 ｜ 可预约' },
      ],
      budget: 208,
      travel: '约12分钟',
      distance: '同商圈内',
      highlight: '雨天室内，安静舒适',
      reason: '匹配理由：全程室内，减少户外步行，餐厅安静可预约。',
      activityId: 'a9',
      restaurantId: 'r7',
    },
  ],
  budget: [
    {
      title: '免费展 + 简餐路线',
      badge: '预算最优',
      tags: ['低预算', '团购券', '室内', '少走路'],
      timelineDetails: [
        { time: '14:00-15:20', title: '免费公共艺术展', meta: '免费 ｜ 可拍照' },
        { time: '15:30-16:20', title: '独立书店雨天阅读局', meta: '★4.7 ｜ ¥28/人' },
        { time: '17:00-18:00', title: '平价小食集合店', meta: '4.6分 ｜ 人均 ¥42 ｜ 团购券' },
      ],
      budget: 168,
      travel: '约14分钟',
      distance: '同商圈内',
      highlight: '低预算、少踩雷、团购优先',
      reason: '匹配理由：优先免费/低价活动和团购套餐，总预算明显低于 ¥400。',
      activityId: 'a10',
      restaurantId: 'r9',
    },
  ],
  mixed: [
    {
      title: '多人偏好平衡路线',
      badge: '多方平衡',
      tags: ['多人偏好', '可预约', '同商圈', '低排队'],
      timelineDetails: [
        { time: '14:20-16:20', title: '商圈影院双人电影', meta: '★4.6 ｜ 室内稳定' },
        { time: '16:30-16:50', title: '商场休息/饮品', meta: '少走路 ｜ 同商圈' },
        { time: '17:00-18:00', title: '暖汤家常菜', meta: '4.7分 ｜ 人均 ¥68 ｜ 可预约' },
      ],
      budget: 292,
      travel: '约12分钟',
      distance: '同商圈内',
      highlight: '兼顾多人偏好，稳妥可执行',
      reason: '匹配理由：同时平衡同行人的餐厅、活动、预算和路线偏好，优先同商圈可预约选择。',
      activityId: 'a4',
      restaurantId: 'r7',
    },
  ],
  accessibility: [
    {
      title: '无障碍商场轻松路线',
      badge: '强约束优先',
      tags: ['无障碍', '少走路', '不辣', '安静', '可预约', '电梯方便'],
      timelineDetails: [
        { time: '14:00-15:20', title: '无障碍商场室内展', meta: '★4.8 ｜ 电梯直达 ｜ 轮椅友好' },
        { time: '15:30-16:10', title: '半日茶餐厅休息', meta: '不辣茶点 ｜ 步行 3 分钟' },
        { time: '16:30-17:40', title: '松鹤清淡粤菜', meta: '4.8分 ｜ 人均 ¥86 ｜ 不辣可预约' },
      ],
      budget: 248,
      travel: '约9分钟',
      distance: '同商场无障碍动线',
      highlight: '轮椅友好、少走路、清淡不辣',
      reason: '匹配理由：已优先满足行动不便、需要陪同和不能吃辣需求，路线集中在同一商场，电梯方便、少走路、可预约。',
      activityId: 'a11',
      restaurantId: 'r11',
    },
    {
      title: '博物馆 + 养生汤路线',
      badge: '安静备选',
      tags: ['室内', '无障碍', '不辣', '低排队', '可陪同'],
      timelineDetails: [
        { time: '14:00-15:30', title: '城市博物馆无障碍展厅', meta: '★4.7 ｜ 无障碍通道 ｜ 休息座椅' },
        { time: '15:40-16:20', title: '商场休闲无障碍动线', meta: '电梯方便 ｜ 平路少走' },
        { time: '17:00-18:00', title: '暖椿养生汤馆', meta: '4.7分 ｜ 清淡不辣 ｜ 可预约' },
      ],
      budget: 228,
      travel: '约11分钟',
      distance: '同商圈无障碍路线',
      highlight: '避免嘈杂和高排队，结束时间早',
      reason: '匹配理由：优先无障碍通行、少走路、不辣餐厅和安静环境，同时保留轻松陪同氛围。',
      activityId: 'a12',
      restaurantId: 'r12',
    },
  ],
};

const alternativePlaceCatalog = {
  exhibition: [
    { name: '公共艺术展二馆', detailType: '展览', rating: 4.8, pricePerPerson: 68, walkingMinutes: 6, image: stopImagePools.exhibition[1], tags: ['室内', '可拍照', '可预约'], reason: '同商圈展览空间，适合拍照，余票充足。' },
    { name: '光影沉浸式艺术展', detailType: '展览', rating: 4.9, pricePerPerson: 98, walkingMinutes: 8, image: stopImagePools.exhibition[0], tags: ['热门', '室内', '余票充足'], reason: '视觉体验更强，适合轻松约会和拍照。' },
  ],
  cafeDessert: [
    { name: '云朵咖啡甜品', detailType: '咖啡/甜品', rating: 4.7, pricePerPerson: 42, walkingMinutes: 4, image: stopImagePools.cafeDessert[0], tags: ['可拍照', '同商圈', '少走路'], reason: '甜品和环境更适合拍照，步行距离短。' },
    { name: '莓果甜品研究所', detailType: '咖啡/甜品', rating: 4.6, pricePerPerson: 36, walkingMinutes: 5, image: stopImagePools.cafeDessert[1], tags: ['甜品', '预算内', '可预约'], reason: '价格更低，适合作为活动后的休息点。' },
    { name: '商场饮品休息点', detailType: '饮品', rating: 4.5, pricePerPerson: 28, walkingMinutes: 3, image: stopImagePools.mallWalk[2], tags: ['少走路', '同商圈', '灵活'], reason: '不额外增加路线，适合临时调整节奏。' },
  ],
  sushi: [
    { name: '晴川日料·炙烧专门店', detailType: '日料', rating: 4.8, pricePerPerson: 86, packagePrice: 172, walkingMinutes: 7, image: stopImagePools.sushi[1], tags: ['可预约', '评分高', '预算内'], reason: '同商圈评分更高，适合约会且可预约。' },
    { name: '和风小馆·寿喜锅', detailType: '日料', rating: 4.6, pricePerPerson: 78, packagePrice: 156, walkingMinutes: 5, image: stopImagePools.sushi[0], tags: ['预算更低', '可预约', '少走路'], reason: '预算更稳，排队风险低，路线变化小。' },
    { name: '山隐烧鸟居酒屋', detailType: '日料', rating: 4.7, pricePerPerson: 92, packagePrice: 184, walkingMinutes: 6, image: stopImagePools.sushi[1], tags: ['氛围感', '可预约', '适合约会'], reason: '氛围更强，适合双人轻松晚餐。' },
  ],
  western: [
    { name: '月白西餐小馆', detailType: '西餐', rating: 4.7, pricePerPerson: 98, packagePrice: 196, walkingMinutes: 8, image: stopImagePools.western[0], tags: ['适合拍照', '可预约', '环境好'], reason: '环境更柔和，适合拍照和轻松约会。' },
    { name: '街角小酒馆早晚餐', detailType: '西餐', rating: 4.6, pricePerPerson: 88, packagePrice: 176, walkingMinutes: 7, image: stopImagePools.western[0], tags: ['不太晚', '可预约', '预算内'], reason: '早晚餐时段可预约，不增加太多预算。' },
  ],
  boardgameCafe: [
    { name: '城市桌游咖啡局', detailType: '桌游/咖啡局', rating: 4.7, pricePerPerson: 58, packagePrice: 116, walkingMinutes: 10, image: stopImagePools.boardgameCafe[0], tags: ['朋友聚会', '可预约', '室内'], reason: '适合朋友破冰，室内不受天气影响。' },
    { name: '慢半拍桌游咖啡', detailType: '桌游/咖啡局', rating: 4.6, pricePerPerson: 52, packagePrice: 104, walkingMinutes: 8, image: stopImagePools.boardgameCafe[1], tags: ['预算内', '室内', '可预约'], reason: '预算更低，适合轻松聚会。' },
    { name: '剧本轻社交局', detailType: '桌游/咖啡局', rating: 4.7, pricePerPerson: 68, packagePrice: 136, walkingMinutes: 9, image: stopImagePools.boardgameCafe[0], tags: ['互动强', '同商圈', '可预约'], reason: '互动感更强，适合多人聚会。' },
  ],
  bbq: [
    { name: '牧野烤肉研究所', detailType: '烤肉', rating: 4.8, pricePerPerson: 118, packagePrice: 236, walkingMinutes: 9, image: stopImagePools.bbq[0], tags: ['热闹', '团购优惠', '可预约'], reason: '氛围热闹，适合朋友聚会。' },
    { name: '炭火烤肉小馆', detailType: '烤肉', rating: 4.7, pricePerPerson: 98, packagePrice: 196, walkingMinutes: 8, image: stopImagePools.bbq[1], tags: ['预算更稳', '可预约', '同商圈'], reason: '价格更友好，仍保留聚会氛围。' },
    { name: '牛焰烤肉二店', detailType: '烤肉', rating: 4.6, pricePerPerson: 108, packagePrice: 216, walkingMinutes: 7, image: stopImagePools.bbq[0], tags: ['可预约', '低排队', '近地铁'], reason: '等待更短，适合临时替换。' },
  ],
  hotpot: [
    { name: '铜炉记火锅二店', detailType: '火锅', rating: 4.6, pricePerPerson: 92, packagePrice: 184, walkingMinutes: 8, image: stopImagePools.hotpot[0], tags: ['热闹', '预算内', '可取号'], reason: '适合朋友聚会，预算可控。' },
    { name: '围炉小火锅', detailType: '火锅', rating: 4.7, pricePerPerson: 88, packagePrice: 176, walkingMinutes: 6, image: stopImagePools.hotpot[1], tags: ['可预约', '同商圈', '低排队'], reason: '排队风险更低，路线变化小。' },
  ],
  livehouse: [
    { name: 'Livehouse 早场', detailType: 'Livehouse', rating: 4.8, pricePerPerson: 128, packagePrice: 256, walkingMinutes: 16, image: stopImagePools.livehouse[0], tags: ['氛围感', '早场', '余票少'], reason: '氛围更强，适合朋友或情侣夜间活动。' },
    { name: '黑胶现场早场', detailType: 'Livehouse', rating: 4.7, pricePerPerson: 108, packagePrice: 216, walkingMinutes: 13, image: stopImagePools.livehouse[1], tags: ['早场', '可预约', '氛围强'], reason: '演出时间更早，降低回程压力。' },
    { name: '轻唱 KTV 小包间', detailType: 'KTV', rating: 4.6, pricePerPerson: 76, packagePrice: 152, walkingMinutes: 10, image: stopImagePools.livehouse[1], tags: ['朋友聚会', '可预约', '室内'], reason: '更适合多人互动，预算更低。' },
  ],
  movie: [
    { name: '商圈影院双人电影', detailType: '电影', rating: 4.6, pricePerPerson: 78, packagePrice: 156, walkingMinutes: 6, image: stopImagePools.movie[0], tags: ['室内', '稳定', '可选座'], reason: '室内稳定，不受天气影响。' },
    { name: '艺术影院下午场', detailType: '电影', rating: 4.7, pricePerPerson: 68, packagePrice: 136, walkingMinutes: 7, image: stopImagePools.movie[1], tags: ['低排队', '可选座', '同商圈'], reason: '人流更少，适合安静观影。' },
  ],
  mallWalk: [
    { name: '商圈散步/饮品', detailType: '商圈散步/饮品', rating: 4.5, pricePerPerson: 28, walkingMinutes: 4, image: stopImagePools.mallWalk[2], tags: ['同商圈', '灵活', '少走路'], reason: '不增加额外路线，适合作为收尾。' },
    { name: '商场中庭休息动线', detailType: '商圈散步', rating: 4.6, pricePerPerson: 0, walkingMinutes: 3, image: stopImagePools.mallWalk[0], tags: ['免费', '少走路', '室内'], reason: '动线短，适合雨天或家庭路线。' },
    { name: '步行街轻松散步', detailType: '商圈散步', rating: 4.5, pricePerPerson: 0, walkingMinutes: 8, image: stopImagePools.mallWalk[1], tags: ['轻松', '同商圈', '可调整'], reason: '适合在行程末尾放松收尾。' },
  ],
  quietRestaurant: [
    { name: '南园粤菜小馆', detailType: '安静餐厅', rating: 4.8, pricePerPerson: 82, packagePrice: 164, walkingMinutes: 5, image: stopImagePools.quietRestaurant[0], tags: ['安静', '可预约', '不太晚'], reason: '环境安静，适合家人或老人提前晚餐。' },
    { name: '暖汤家常菜', detailType: '安静餐厅', rating: 4.7, pricePerPerson: 68, packagePrice: 136, walkingMinutes: 6, image: stopImagePools.quietRestaurant[1], tags: ['家常菜', '预算内', '可预约'], reason: '口味稳，预算更低，适合家庭路线。' },
    { name: '栖木茶馆轻食', detailType: '茶馆/轻食', rating: 4.8, pricePerPerson: 48, packagePrice: 96, walkingMinutes: 3, image: stopImagePools.tea[0], tags: ['安静', '少走路', '本次可约'], reason: '低强度，适合老人或安静偏好。' },
    { name: '松鹤清淡粤菜', detailType: '无障碍餐厅', rating: 4.8, pricePerPerson: 86, packagePrice: 172, walkingMinutes: 3, image: stopImagePools.quietRestaurant[0], tags: ['无障碍', '不辣', '电梯方便', '可预约'], reason: '清淡不辣，电梯直达，轮椅友好，适合行动不便同行人。' },
    { name: '暖椿养生汤馆', detailType: '养生汤', rating: 4.7, pricePerPerson: 72, packagePrice: 144, walkingMinutes: 4, image: stopImagePools.quietRestaurant[1], tags: ['清淡', '不辣', '安静', '可预约'], reason: '汤品清淡不辣，动线短，适合老人和陪同出行。' },
  ],
  familyKids: [
    { name: '万象城儿童探索乐园', detailType: '亲子室内', rating: 4.8, pricePerPerson: 88, packagePrice: 176, walkingMinutes: 5, image: stopImagePools.familyKids[0], tags: ['亲子友好', '室内', '可预约'], reason: '适合孩子互动，商场内少走路。' },
    { name: '城市科学馆亲子展', detailType: '亲子室内', rating: 4.7, pricePerPerson: 48, packagePrice: 96, walkingMinutes: 9, image: stopImagePools.familyKids[1], tags: ['互动', '低预算', '室内'], reason: '寓教于乐，适合亲子周末。' },
  ],
  tea: [
    { name: '栖木茶馆休息', detailType: '茶馆', rating: 4.8, pricePerPerson: 48, packagePrice: 96, walkingMinutes: 3, image: stopImagePools.tea[0], tags: ['安静', '少走路', '可预约'], reason: '茶点安静，适合老人或家庭休息。' },
    { name: '茶文化室内展馆', detailType: '茶馆/茶文化', rating: 4.8, pricePerPerson: 36, packagePrice: 72, walkingMinutes: 5, image: stopImagePools.tea[1], tags: ['室内', '安静', '不太晚'], reason: '低强度室内体验，适合家庭路线。' },
  ],
  park: [
    { name: '滨河公园短步行', detailType: '公园短步行', rating: 4.6, pricePerPerson: 0, packagePrice: 0, walkingMinutes: 8, image: stopImagePools.park[0], tags: ['免费', '短步行', '安静'], reason: '步行强度低，适合天气好时替换。' },
    { name: '商场屋顶花园', detailType: '公园短步行', rating: 4.5, pricePerPerson: 0, packagePrice: 0, walkingMinutes: 5, image: stopImagePools.park[1], tags: ['短步行', '少走路', '同商圈'], reason: '距离更近，适合低强度收尾。' },
  ],
  bookstore: [
    { name: '独立书店雨天阅读局', detailType: '书店', rating: 4.7, pricePerPerson: 28, walkingMinutes: 6, image: stopImagePools.bookstore[0], tags: ['雨天', '安静', '低预算'], reason: '雨天室内休息点，安静且预算低。' },
    { name: '商场书店咖啡区', detailType: '书店', rating: 4.6, pricePerPerson: 32, walkingMinutes: 4, image: stopImagePools.bookstore[1], tags: ['室内', '少走路', '可休息'], reason: '适合雨天或家庭路线中的休息段。' },
  ],
};

function replacementKind(stop = {}) {
  const text = `${stop.name || ''} ${stop.detailType || ''} ${stop.category || ''} ${stop.cuisine || ''}`;
  if (/Livehouse|演出|音乐现场|KTV/.test(text)) return 'livehouse';
  if (/烤肉|烧烤/.test(text)) return 'bbq';
  if (/火锅/.test(text)) return 'hotpot';
  if (/电影|影院/.test(text)) return 'movie';
  if (/桌游/.test(text)) return 'boardgameCafe';
  if (/散步|饮品|商场休息|商圈/.test(text)) return 'mallWalk';
  if (/展|艺术|沉浸/.test(text)) return 'exhibition';
  if (/日料|寿喜|寿司|刺身|烧鸟/.test(text)) return 'sushi';
  if (/西餐|小酒馆/.test(text)) return 'western';
  if (/咖啡|甜品/.test(text)) return 'cafeDessert';
  if (/茶/.test(text)) return 'tea';
  if (/公园|短步行/.test(text)) return 'park';
  if (/书店|阅读/.test(text)) return 'bookstore';
  if (/儿童|亲子|科学馆|乐园/.test(text)) return 'familyKids';
  if (/粤菜|家常菜|安静餐厅|暖汤|南园/.test(text)) return 'quietRestaurant';
  return 'mallWalk';
}

function replacementPoolsForScene(kind, sceneType) {
  const scenePools = {
    accessibility: ['quietRestaurant', 'tea', 'bookstore', 'mallWalk', 'park'],
    date: ['exhibition', 'cafeDessert', 'sushi', 'western', 'mallWalk'],
    friends: ['boardgameCafe', 'bbq', 'hotpot', 'livehouse', 'movie', 'mallWalk'],
    elderly: ['tea', 'quietRestaurant', 'park', 'bookstore', 'mallWalk'],
    family: ['familyKids', 'bookstore', 'quietRestaurant', 'mallWalk', 'tea'],
    rainy: ['movie', 'bookstore', 'exhibition', 'quietRestaurant', 'mallWalk'],
    budget: ['exhibition', 'bookstore', 'cafeDessert', 'mallWalk', 'quietRestaurant'],
    mixed: ['movie', 'mallWalk', 'quietRestaurant', 'bookstore', 'cafeDessert'],
  };
  const compatible = scenePools[sceneType] || scenePools.mixed;
  return [kind, ...compatible.filter((item) => item !== kind)];
}

function isBlockedForScene(option, sceneType) {
  if (!['elderly', 'family', 'accessibility'].includes(sceneType)) return false;
  const text = `${option.name} ${option.detailType} ${(option.tags || []).join(' ')}`;
  if (/Livehouse|酒吧|火锅|烤肉|烧烤|KTV/.test(text)) return true;
  if (sceneType === 'accessibility' && /辣|热闹|夜间|排队/.test(text) && !/不辣|低排队/.test(text)) return true;
  return false;
}

function normalizeAlternative(option, kind, index) {
  return {
    id: option.id || `${kind}-${index}-${option.name}`,
    type: option.type || 'mock-place',
    detailType: option.detailType || typeText(option),
    businessHours: option.businessHours || '10:00-21:30',
    bookable: option.bookable !== false,
    queueLevel: option.queueLevel || 'low',
    distanceKm: option.distanceKm || 0.6,
    walkingMinutes: option.walkingMinutes || 6,
    imageGallery: option.imageGallery || [option.image],
    ...option,
  };
}

function searchAlternativePlacesForStop(currentStop, currentPlan) {
  const kind = replacementKind(currentStop);
  const pools = replacementPoolsForScene(kind, currentPlan.sceneType);
  const seen = new Set([currentStop?.name, currentStop?.image]);
  return pools
    .flatMap((poolKey) => (alternativePlaceCatalog[poolKey] || []).map((item, index) => normalizeAlternative(item, poolKey, index)))
    .filter((option) => !seen.has(option.name) && !seen.has(option.image))
    .filter((option) => !isBlockedForScene(option, currentPlan.sceneType))
    .filter((option, index, list) => list.findIndex((item) => item.name === option.name) === index)
    .slice(0, 3);
}

function placeCost(place = {}) {
  return place.packagePrice ?? (place.pricePerPerson ?? place.average ?? place.price ?? 48) * 2;
}

function planMinutes(value = '') {
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : 18;
}

function replacementMeta(place) {
  return `${place.rating || 4.7}分 ｜ ${priceText(place)} ｜ ${place.bookable === false ? '需排队' : '可预约'}`;
}

function replacementReason(oldStop, replacement, plan, selectedFriends = []) {
  const names = friendNames(selectedFriends);
  const suffix = names ? `同行偏好已纳入：${names}。` : '已继续按你的个人偏好规划。';
  return `匹配理由：已将「${oldStop.name}」替换为「${replacement.name}」，并重新计算预算和路线；仍符合${plan.sceneType || '当前'}场景、预算、距离和可预约约束。${suffix}`;
}

function buildReplacementToolTrace(oldStop, replacement, deltaBudget, deltaTravel) {
  return [
    {
      toolName: 'searchAlternativePlaces()',
      status: 'completed',
      message: '找到 3 个同类可替代选择，已排除不符合场景的商家。',
    },
    {
      toolName: 'replacePlanStop()',
      status: 'completed',
      message: `已将「${oldStop.name}」替换为「${replacement.name}」。`,
    },
    {
      toolName: 'recalculatePlanAfterReplacement()',
      status: 'completed',
      message: `预算 ${deltaBudget >= 0 ? '+' : ''}${deltaBudget}，路线 ${deltaTravel >= 0 ? '+' : ''}${deltaTravel} 分钟，仍在约束内。`,
    },
  ];
}

export default function PlansPage({ request = '', onBack, onConfirm, selectedFriends = [] }) {
  const [detailPlace, setDetailPlace] = useState(null);
  const [planOverrides, setPlanOverrides] = useState({});
  const [variantIndexByPlan, setVariantIndexByPlan] = useState({});
  const [replacementTarget, setReplacementTarget] = useState(null);
  const [replacementOptions, setReplacementOptions] = useState([]);
  const [toast, setToast] = useState('');
  const recommendedPlans = generatePlans(request, selectedFriends);
  const displayPlans = recommendedPlans.map((plan) => planOverrides[plan.id] || plan);
  const pageUsedImages = new Set();

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(''), 1800);
  };

  const getDisplayPlan = (planId) => displayPlans.find((item) => item.id === planId) || recommendedPlans.find((item) => item.id === planId);

  const handleRefreshPlan = (plan) => {
    const variants = wholePlanVariants[plan.sceneType] || wholePlanVariants.mixed;
    if (!variants?.length) {
      showToast('当前已是最优组合，可尝试调整预算或同行偏好。');
      return;
    }
    const nextIndex = variantIndexByPlan[plan.id] || 0;
    const variant = variants[nextIndex % variants.length];
    const nextPlan = {
      ...plan,
      ...variant,
      id: plan.id,
      sceneType: plan.sceneType,
      replacementToolTrace: [
        {
          toolName: 'rank_itinerary_plans()',
          status: 'completed',
          message: '已按当前场景、同行人偏好、预算、距离和可预约状态刷新整套方案。',
        },
      ],
    };
    setPlanOverrides((prev) => ({ ...prev, [plan.id]: nextPlan }));
    setVariantIndexByPlan((prev) => ({ ...prev, [plan.id]: nextIndex + 1 }));
    showToast('已换一套同场景方案，并保持预算、距离和可预约约束。');
  };

  const handleOpenReplacement = () => {
    const currentPlan = getDisplayPlan(detailPlace?.planId) || detailPlace?.currentPlan;
    const options = searchAlternativePlacesForStop(detailPlace, currentPlan);
    if (!options.length) {
      showToast('暂时没有更合适的同类替代选择。');
      return;
    }
    setReplacementTarget({ ...detailPlace, currentPlan });
    setReplacementOptions(options);
    setDetailPlace(null);
  };

  const handleApplyReplacement = (replacement) => {
    const currentPlan = getDisplayPlan(replacementTarget.planId) || replacementTarget.currentPlan;
    const currentActivity = getById(activities, currentPlan.activityId);
    const currentRestaurant = getById(restaurants, currentPlan.restaurantId);
    const currentTimeline = buildTimeline(currentPlan, currentActivity, currentRestaurant);
    const stopIndex = replacementTarget.stopIndex ?? 0;
    const oldCost = placeCost(replacementTarget);
    const nextCost = placeCost(replacement);
    const deltaBudget = Math.round(nextCost - oldCost);
    const deltaTravel = Math.round((replacement.walkingMinutes || 6) - (replacementTarget.walkingMinutes || 6));
    const nextTimelineDetails = currentTimeline.map((item, index) =>
      index === stopIndex
        ? {
            ...item,
            title: replacement.name,
            meta: replacementMeta(replacement),
          }
        : item,
    );
    const nextPlan = {
      ...currentPlan,
      timelineDetails: nextTimelineDetails,
      timeline: nextTimelineDetails.map((item) => `${item.time} ${item.title}`),
      budget: Math.max(0, Math.round((currentPlan.budget || 0) + deltaBudget)),
      travel: `约${Math.max(8, planMinutes(currentPlan.travel) + deltaTravel)}分钟`,
      distance: deltaTravel <= 3 ? currentPlan.distance : '同商圈周边',
      tags: [...new Set([...(currentPlan.tags || []), '已替换', replacement.bookable === false ? '需排队' : '可预约'])].slice(0, 5),
      reason: replacementReason(replacementTarget, replacement, currentPlan, selectedFriends),
      replacementToolTrace: buildReplacementToolTrace(replacementTarget, replacement, deltaBudget, deltaTravel),
    };
    setPlanOverrides((prev) => ({ ...prev, [currentPlan.id]: nextPlan }));
    setReplacementTarget(null);
    setReplacementOptions([]);
    showToast('已替换，并重新计算预算和路线。');
  };

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
          {displayPlans.map((plan) => {
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
                  {stops.map((stop, stopIndex) => (
                    <button
                      key={`${plan.id}-${stop.planTime}-${stop.name}`}
                      type="button"
                      className="plan-stop-thumb"
                      onClick={() => setDetailPlace({ ...stop, planId: plan.id, stopIndex })}
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
                      onClick={() => setDetailPlace({ ...(stops[index] || stops[0]), planId: plan.id, stopIndex: index })}
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

                {plan.replacementToolTrace?.length > 0 && (
                  <div className="plan-replacement-trace">
                    {plan.replacementToolTrace.map((tool) => (
                      <div key={`${plan.id}-${tool.toolName}-${tool.message}`}>
                        <strong>{tool.toolName}</strong>
                        <span>{tool.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="plan-tag-row">
                  {plan.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="plan-action-row">
                  <button onClick={() => handleRefreshPlan(plan)}>
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
              <button onClick={handleOpenReplacement}>替换此站点</button>
            </div>
          </section>
        </div>
      )}

      {replacementTarget && (
        <div className="plan-detail-backdrop" onClick={() => setReplacementTarget(null)}>
          <section className="plan-detail-sheet plan-replace-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="plan-detail-handle" />
            <div className="plan-detail-scroll">
              <div className="plan-replace-head">
                <p>团崽已按同行人偏好、预算、距离和可预约状态重新筛选。</p>
                <h3>为你找到 {replacementOptions.length} 个同类替代选择</h3>
              </div>
              <div className="plan-replace-list">
                {replacementOptions.map((option) => (
                  <article key={option.id} className="plan-replace-card">
                    <img src={option.image} alt={option.name} />
                    <div>
                      <div className="plan-replace-title-row">
                        <h4>{option.name}</h4>
                        <span>{option.rating || 4.7}分</span>
                      </div>
                      <p>{priceText(option)} · 步行{option.walkingMinutes || 6}分钟 · {option.bookable === false ? '需排队' : '可预约'}</p>
                      <small>{option.reason}</small>
                      <button onClick={() => handleApplyReplacement(option)}>替换为这个</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="plan-detail-actions plan-replace-actions">
              <button onClick={() => setReplacementTarget(null)}>返回方案</button>
            </div>
          </section>
        </div>
      )}

      {toast && <div className="plan-toast">{toast}</div>}
    </>
  );
}
