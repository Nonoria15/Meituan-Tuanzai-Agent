export type SceneType =
  | 'date'
  | 'friends'
  | 'family'
  | 'elderly'
  | 'kids'
  | 'rainy'
  | 'budget'
  | 'quiet'
  | 'indoor'
  | 'short_distance'
  | 'not_too_late'
  | 'mixed';

export type ToolStatus = 'pending' | 'success' | 'failed';
export type QueueLevel = 'low' | 'medium' | 'high';
export type NoiseLevel = 'quiet' | 'normal' | 'lively';

export interface UserIntent {
  rawInput: string;
  timeWindow: string;
  peopleCount: number;
  budget: number;
  keywords: string[];
  constraints: string[];
  weather?: 'rainy' | 'normal';
}

export interface Companion {
  id: string;
  name: string;
  source: 'meituan_friend' | 'manual' | 'invite';
  relation?: string;
  authorized: boolean;
  preferenceTags: string[];
  note?: string;
}

export interface Place {
  id: string;
  name: string;
  type: string;
  sceneTags: SceneType[];
  preferenceTags: string[];
  rating: number;
  pricePerPerson: number;
  packagePrice?: number;
  distanceKm: number;
  walkingMinutes: number;
  businessHours: string;
  bookable: boolean;
  queueLevel: QueueLevel;
  noiseLevel: NoiseLevel;
  indoor: boolean;
  suitableFor: string[];
  image: string;
  reason: string;
}

export interface Activity extends Place {
  type: 'activity' | 'movie' | 'indoor' | 'outdoor';
  category: string;
}

export interface Restaurant extends Place {
  type: 'restaurant' | 'cafe';
  cuisine: string;
  wait: string;
}

export interface RouteResult {
  stops: string[];
  totalMinutes: number;
  distanceLabel: string;
}

export interface BudgetResult {
  total: number;
  withinBudget: boolean;
  detail: string;
}

export interface Plan {
  id: string;
  sceneType: SceneType;
  title: string;
  badge: string;
  tags: string[];
  timeline: string[];
  activity: Activity;
  restaurant: Restaurant;
  budget: number;
  route: RouteResult;
  highlight: string;
  reason: string;
  score: number;
}

export interface ToolResult<T = unknown> {
  toolName: string;
  status: ToolStatus;
  input: Record<string, unknown>;
  output?: T;
  message: string;
  timestamp: string;
}

export interface ReservationResult {
  success: boolean;
  reservationId?: string;
  message: string;
}

export interface FallbackResult {
  reason: string;
  options: Restaurant[];
  selected: Restaurant;
  updatedPlan: Plan;
  toolTrace: ToolResult[];
}

const now = () => new Date().toISOString();

const toolResult = <T>(
  toolName: string,
  status: ToolStatus,
  input: Record<string, unknown>,
  output: T | undefined,
  message: string,
): ToolResult<T> => ({
  toolName,
  status,
  input,
  output,
  message,
  timestamp: now(),
});

export const mockCompanions: Companion[] = [
  {
    id: 'xiaoyu',
    name: '小雨',
    source: 'meituan_friend',
    authorized: true,
    preferenceTags: ['日料', '展览', '拍照', '少走路', '讨厌排队'],
  },
  {
    id: 'azhe',
    name: '阿哲',
    source: 'meituan_friend',
    authorized: true,
    preferenceTags: ['电影', '火锅', '预算敏感', '不喜欢太赶'],
  },
  {
    id: 'mom',
    name: '妈妈',
    source: 'manual',
    relation: '老人',
    authorized: true,
    preferenceTags: ['安静', '少走路', '环境好', '不要太晚'],
  },
  {
    id: 'xiaochen',
    name: '小陈',
    source: 'invite',
    authorized: true,
    preferenceTags: ['火锅', '预算内', '少排队', '同商圈'],
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'act_art',
    name: '光影沉浸式艺术展',
    type: 'activity',
    category: '展览',
    sceneTags: ['date', 'indoor', 'quiet'],
    preferenceTags: ['拍照', '少走路', '可预约', '室内'],
    rating: 4.9,
    pricePerPerson: 98,
    packagePrice: 196,
    distanceKm: 1.2,
    walkingMinutes: 8,
    businessHours: '10:00-21:00',
    bookable: true,
    queueLevel: 'low',
    noiseLevel: 'quiet',
    indoor: true,
    suitableFor: ['情侣', '朋友'],
    image: 'https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=720&q=80',
    reason: '适合拍照，今日余票充足。',
  },
  {
    id: 'act_boardgame',
    name: '城市桌游咖啡局',
    type: 'indoor',
    category: '桌游',
    sceneTags: ['friends', 'rainy', 'budget'],
    preferenceTags: ['室内', '热闹', '预算内', '可预约'],
    rating: 4.7,
    pricePerPerson: 58,
    packagePrice: 116,
    distanceKm: 1.6,
    walkingMinutes: 10,
    businessHours: '12:00-22:00',
    bookable: true,
    queueLevel: 'low',
    noiseLevel: 'lively',
    indoor: true,
    suitableFor: ['朋友'],
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=720&q=80',
    reason: '适合朋友聚会破冰，室内不受天气影响。',
  },
  {
    id: 'act_kids',
    name: '万象城儿童探索乐园',
    type: 'indoor',
    category: '亲子',
    sceneTags: ['family', 'kids', 'rainy', 'indoor'],
    preferenceTags: ['亲子友好', '室内', '少走路', '不要太晚'],
    rating: 4.8,
    pricePerPerson: 88,
    packagePrice: 176,
    distanceKm: 1,
    walkingMinutes: 5,
    businessHours: '10:00-20:00',
    bookable: true,
    queueLevel: 'low',
    noiseLevel: 'normal',
    indoor: true,
    suitableFor: ['亲子', '家庭'],
    image: 'https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=720&q=80',
    reason: '亲子友好，商场内少走路。',
  },
  {
    id: 'act_tea',
    name: '茶文化室内展馆',
    type: 'indoor',
    category: '展馆',
    sceneTags: ['elderly', 'family', 'quiet', 'indoor'],
    preferenceTags: ['安静', '少走路', '室内', '不要太晚'],
    rating: 4.8,
    pricePerPerson: 36,
    packagePrice: 72,
    distanceKm: 0.9,
    walkingMinutes: 5,
    businessHours: '10:00-18:00',
    bookable: true,
    queueLevel: 'low',
    noiseLevel: 'quiet',
    indoor: true,
    suitableFor: ['老人', '家庭'],
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=720&q=80',
    reason: '安静、少走路，适合家人和老人。',
  },
  {
    id: 'act_free_gallery',
    name: '免费公共艺术展',
    type: 'activity',
    category: '展览',
    sceneTags: ['budget', 'date', 'quiet', 'indoor'],
    preferenceTags: ['低预算', '拍照', '室内', '少走路'],
    rating: 4.5,
    pricePerPerson: 0,
    packagePrice: 0,
    distanceKm: 1.3,
    walkingMinutes: 7,
    businessHours: '10:00-20:00',
    bookable: false,
    queueLevel: 'low',
    noiseLevel: 'quiet',
    indoor: true,
    suitableFor: ['情侣', '朋友'],
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=720&q=80',
    reason: '免费展览，适合低预算拍照路线。',
  },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'res_sushi_full',
    name: '椿山日料·寿喜烧',
    type: 'restaurant',
    cuisine: '日料',
    sceneTags: ['date', 'quiet'],
    preferenceTags: ['环境好', '日料', '少走路'],
    rating: 4.7,
    pricePerPerson: 86,
    packagePrice: 168,
    distanceKm: 0.5,
    walkingMinutes: 4,
    businessHours: '11:00-21:30',
    bookable: false,
    queueLevel: 'high',
    noiseLevel: 'quiet',
    indoor: true,
    suitableFor: ['情侣'],
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=720&q=80',
    reason: '原推荐餐厅，18:00 已满。',
    wait: '18:00 已满',
  },
  {
    id: 'res_sushi_fallback',
    name: '晴川日料·炙烧专门店',
    type: 'restaurant',
    cuisine: '日料',
    sceneTags: ['date', 'quiet'],
    preferenceTags: ['日料', '可预约', '评分高', '预算内'],
    rating: 4.8,
    pricePerPerson: 86,
    packagePrice: 172,
    distanceKm: 0.65,
    walkingMinutes: 7,
    businessHours: '11:00-22:00',
    bookable: true,
    queueLevel: 'low',
    noiseLevel: 'quiet',
    indoor: true,
    suitableFor: ['情侣'],
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=720&q=80',
    reason: '同商圈评分更高，人均不变，适合轻松约会。',
    wait: '18:00 可预约',
  },
  {
    id: 'res_bbq',
    name: '牧野烤肉研究所',
    type: 'restaurant',
    cuisine: '烤肉',
    sceneTags: ['friends'],
    preferenceTags: ['热闹', '团购优惠', '可预约'],
    rating: 4.8,
    pricePerPerson: 118,
    packagePrice: 236,
    distanceKm: 0.9,
    walkingMinutes: 9,
    businessHours: '11:00-23:00',
    bookable: true,
    queueLevel: 'medium',
    noiseLevel: 'lively',
    indoor: true,
    suitableFor: ['朋友'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=720&q=80',
    reason: '氛围热闹，适合朋友聚会。',
    wait: '16:30 可预约',
  },
  {
    id: 'res_yue',
    name: '南园粤菜小馆',
    type: 'restaurant',
    cuisine: '粤菜',
    sceneTags: ['elderly', 'family', 'quiet'],
    preferenceTags: ['安静', '环境好', '可预约', '不要太晚'],
    rating: 4.8,
    pricePerPerson: 82,
    packagePrice: 164,
    distanceKm: 0.52,
    walkingMinutes: 5,
    businessHours: '11:00-21:00',
    bookable: true,
    queueLevel: 'low',
    noiseLevel: 'quiet',
    indoor: true,
    suitableFor: ['老人', '家庭'],
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=720&q=80',
    reason: '安静、可预约，适合家人提前晚餐。',
    wait: '17:00 可预约',
  },
  {
    id: 'res_budget',
    name: '平价小食集合店',
    type: 'restaurant',
    cuisine: '简餐',
    sceneTags: ['budget', 'rainy'],
    preferenceTags: ['低预算', '团购券', '室内'],
    rating: 4.6,
    pricePerPerson: 42,
    packagePrice: 84,
    distanceKm: 0.48,
    walkingMinutes: 5,
    businessHours: '10:00-22:00',
    bookable: true,
    queueLevel: 'low',
    noiseLevel: 'normal',
    indoor: true,
    suitableFor: ['朋友', '情侣'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=720&q=80',
    reason: '低预算团购券，减少踩雷。',
    wait: '17:30 可预约',
  },
];

export const mockCafes = mockRestaurants.filter((item) => item.type === 'cafe');
export const mockFallbackRestaurants = mockRestaurants.filter((item) => item.bookable);

export async function mockDelay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parseUserIntent(input: string): Promise<ToolResult<UserIntent>> {
  await mockDelay();
  const keywords = input.match(/约会|朋友|聚会|妈妈|老人|亲子|雨天|室内|低预算|少走路|安静|不要太晚|火锅|日料|拍照/g) || [];
  const budgetMatch = input.match(/预算\s*(\d+)/);
  const intent: UserIntent = {
    rawInput: input,
    timeWindow: /下午|14|15/.test(input) ? '14:00-19:00' : 'flexible',
    peopleCount: /多人|几个|朋友/.test(input) ? 3 : 2,
    budget: budgetMatch ? Number(budgetMatch[1]) : 400,
    keywords,
    constraints: keywords.filter((item) => ['少走路', '安静', '不要太晚', '室内', '低预算'].includes(item)),
    weather: /雨天|下雨/.test(input) ? 'rainy' : 'normal',
  };
  return toolResult('parseUserIntent', 'success', { input }, intent, '已解析自然语言目标。');
}

export async function getUserPreferenceMemory(userId: string) {
  await mockDelay();
  const memory = { userId, preferenceTags: ['少走路', '预算内', '可预约'], disliked: ['高排队'] };
  return toolResult('getUserPreferenceMemory', 'success', { userId }, memory, '读取用户本地生活偏好记忆。');
}

export async function requestCompanionAuthorization(companionIds: string[]) {
  await mockDelay();
  const companions = mockCompanions.filter((item) => companionIds.includes(item.id) && item.authorized);
  return toolResult('requestCompanionAuthorization', 'success', { companionIds }, companions, '已获得本次偏好授权。');
}

export function mergeGroupPreferences(userIntent: UserIntent, companions: Companion[]) {
  const merged = [...new Set([...userIntent.keywords, ...companions.flatMap((item) => item.preferenceTags)])];
  return toolResult('mergeGroupPreferences', 'success', { userIntent, companions }, merged, '已合并个人与同行人偏好。');
}

export function detectSceneType(userIntent: UserIntent, companions: Companion[] = []): ToolResult<SceneType> {
  const text = `${userIntent.rawInput} ${companions.map((item) => `${item.name} ${item.relation || ''} ${item.preferenceTags.join(' ')}`).join(' ')}`;
  let sceneType: SceneType = 'friends';
  if (/妈妈|老人|家人|少走路|安静|不要太晚/.test(text)) sceneType = 'elderly';
  else if (/亲子|孩子|儿童/.test(text)) sceneType = 'family';
  else if (/雨天|下雨|室内/.test(text)) sceneType = 'rainy';
  else if (/低预算|预算 200|便宜|团购/.test(text)) sceneType = 'budget';
  else if (/约会|情侣|拍照|日料/.test(text)) sceneType = 'date';
  if (companions.length > 1 && /妈妈|老人|家人/.test(text) && /朋友|小雨|阿哲|Leo/.test(text)) sceneType = 'mixed';
  return toolResult('detectSceneType', 'success', { text }, sceneType, `识别场景为 ${sceneType}。`);
}

const scorePlace = (place: Place, sceneType: SceneType, constraints: string[]) => {
  let score = place.rating * 10;
  if (place.sceneTags.includes(sceneType)) score += 30;
  if (place.bookable) score += 10;
  if (place.queueLevel === 'low') score += 8;
  if (constraints.includes('少走路')) score -= place.walkingMinutes;
  if (constraints.includes('安静') && place.noiseLevel === 'quiet') score += 12;
  if (constraints.includes('室内') && place.indoor) score += 12;
  if (constraints.includes('低预算')) score -= place.pricePerPerson / 8;
  return score;
};

export function searchNearbyActivities(sceneType: SceneType, constraints: string[] = []) {
  const output = [...mockActivities]
    .sort((a, b) => scorePlace(b, sceneType, constraints) - scorePlace(a, sceneType, constraints))
    .slice(0, 6);
  return toolResult('searchNearbyActivities', 'success', { sceneType, constraints }, output, '已检索附近活动候选。');
}

export function searchRestaurants(sceneType: SceneType, constraints: string[] = []) {
  const output = [...mockRestaurants]
    .sort((a, b) => scorePlace(b, sceneType, constraints) - scorePlace(a, sceneType, constraints))
    .slice(0, 6);
  return toolResult('searchRestaurants', 'success', { sceneType, constraints }, output, '已检索附近餐厅候选。');
}

export function checkBusinessHours(place: Place, targetTime = '18:00') {
  const open = place.businessHours === '全天' || place.businessHours >= '09:00-18:00';
  return toolResult('checkBusinessHours', open ? 'success' : 'failed', { placeId: place.id, targetTime }, { open }, open ? '营业时间匹配。' : '营业时间不匹配。');
}

export function checkAvailability(place: Place, targetTime = '18:00', peopleCount = 2) {
  const available = place.bookable && place.queueLevel !== 'high';
  return toolResult('checkAvailability', available ? 'success' : 'failed', { placeId: place.id, targetTime, peopleCount }, { available }, available ? '可预约。' : '不可预约或排队风险过高。');
}

export function estimateRoute(stops: Place[]): ToolResult<RouteResult> {
  const totalMinutes = stops.reduce((sum, item) => sum + item.walkingMinutes, 0);
  const route = { stops: stops.map((item) => item.name), totalMinutes, distanceLabel: totalMinutes <= 18 ? '同商圈少走路' : '跨商圈需换乘' };
  return toolResult('estimateRoute', 'success', { stops: route.stops }, route, '已估算路线时间。');
}

export function calculateBudget(items: Place[], peopleCount = 2, budget = 400): ToolResult<BudgetResult> {
  const total = items.reduce((sum, item) => sum + (item.packagePrice ?? item.pricePerPerson * peopleCount), 0);
  const output = { total, withinBudget: total <= budget, detail: `预计 ¥${total} / 预算 ¥${budget}` };
  return toolResult('calculateBudget', output.withinBudget ? 'success' : 'failed', { items: items.map((item) => item.id), budget }, output, output.withinBudget ? '预算内。' : '超预算，需要降级套餐或替换商家。');
}

export function rankPlans(candidates: Plan[], constraints: string[]) {
  const ranked = candidates
    .map((plan) => ({
      ...plan,
      score:
        plan.score +
        (plan.restaurant.bookable ? 10 : -20) +
        (plan.restaurant.queueLevel === 'low' ? 8 : -8) +
        (constraints.includes('少走路') ? -plan.route.totalMinutes : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  return toolResult('rankPlans', 'success', { count: candidates.length }, ranked, '已按偏好、距离、预算、预约成功率排序。');
}

export function createTicketOrder(activity: Activity, peopleCount = 2): ToolResult<ReservationResult> {
  const success = activity.bookable || activity.pricePerPerson === 0;
  return toolResult('createTicketOrder', success ? 'success' : 'failed', { activityId: activity.id, peopleCount }, { success, reservationId: success ? `ticket_${activity.id}` : undefined, message: success ? '活动名额已锁定。' : '活动不可预订。' }, success ? '活动票/名额锁定成功。' : '活动不可预订。');
}

export function createRestaurantReservation(restaurant: Restaurant, time = '18:00', peopleCount = 2): ToolResult<ReservationResult> {
  const availability = checkAvailability(restaurant, time, peopleCount);
  const success = availability.status === 'success';
  return toolResult('createRestaurantReservation', success ? 'success' : 'failed', { restaurantId: restaurant.id, time, peopleCount }, { success, reservationId: success ? `reserve_${restaurant.id}` : undefined, message: success ? '餐厅预约成功。' : '餐厅满座或不可预约。' }, success ? '餐厅预约成功。' : '餐厅预约失败，进入 fallback。');
}

export function createRouteReminder(plan: Plan) {
  return toolResult('createRouteReminder', 'success', { planId: plan.id }, { reminderTime: '13:40' }, '已生成出发提醒。');
}

export function saveWeekendTrip(plan: Plan) {
  return toolResult('saveWeekendTrip', 'success', { planId: plan.id }, { tripId: `trip_${plan.id}` }, '已保存到周末行程。');
}

export function syncTripToCompanions(plan: Plan, companions: Companion[]) {
  const output = companions.map((item) => ({
    companionId: item.id,
    name: item.name,
    mode: item.source === 'manual' ? 'share_link' : 'meituan_account',
  }));
  return toolResult('syncTripToCompanions', 'success', { planId: plan.id, companionIds: companions.map((item) => item.id) }, output, '已同步同行人行程。');
}

export function searchFallbackRestaurants(sceneType: SceneType, constraints: string[] = []) {
  const output = searchRestaurants(sceneType, constraints).output?.filter((item) => item.bookable && item.queueLevel !== 'high') || [];
  return toolResult('searchFallbackRestaurants', 'success', { sceneType, constraints }, output, '已搜索同场景可预约替代餐厅。');
}

export function compareFallbackOptions(options: Restaurant[], constraints: string[] = []) {
  const selected = [...options].sort((a, b) => scorePlace(b, 'quiet', constraints) - scorePlace(a, 'quiet', constraints))[0];
  return toolResult('compareFallbackOptions', 'success', { optionIds: options.map((item) => item.id), constraints }, selected, '已比较替代餐厅。');
}

export function updatePlanBudget(plan: Plan, replacement: Restaurant): ToolResult<Plan> {
  const updated = { ...plan, restaurant: replacement, budget: plan.budget - plan.restaurant.pricePerPerson * 2 + replacement.pricePerPerson * 2 };
  return toolResult('updatePlanBudget', 'success', { planId: plan.id, replacementId: replacement.id }, updated, '已更新预算和餐厅信息。');
}

export function generateFallbackPlan(reason: string, currentPlan: Plan, constraints: string[] = []): FallbackResult {
  const trace: ToolResult[] = [];
  const optionsTool = searchFallbackRestaurants(currentPlan.sceneType, constraints);
  trace.push(optionsTool);
  const compareTool = compareFallbackOptions(optionsTool.output || [], constraints);
  trace.push(compareTool);
  const selected = compareTool.output as Restaurant;
  const updateTool = updatePlanBudget(currentPlan, selected);
  trace.push(updateTool);
  return { reason, options: optionsTool.output || [], selected, updatedPlan: updateTool.output as Plan, toolTrace: trace };
}

const makePlan = (id: string, sceneType: SceneType, activity: Activity, restaurant: Restaurant, peopleCount: number): Plan => {
  const route = estimateRoute([activity, restaurant]).output as RouteResult;
  const budget = calculateBudget([activity, restaurant], peopleCount).output as BudgetResult;
  return {
    id,
    sceneType,
    title: `${activity.category} + ${restaurant.cuisine}路线`,
    badge: id === 'A' ? '最推荐' : id === 'B' ? '备选' : '低风险',
    tags: ['预算内', restaurant.bookable ? '可预约' : '需替换', activity.indoor ? '室内' : '轻松'],
    timeline: [`14:00-15:30 ${activity.name}`, `15:45-16:20 咖啡/休息`, `17:30-18:40 ${restaurant.name}`],
    activity,
    restaurant,
    budget: budget.total,
    route,
    highlight: `${activity.reason} ${restaurant.reason}`,
    reason: `匹配理由：结合 ${sceneType} 场景、同行偏好、预算、距离和预约状态综合排序。`,
    score: activity.rating * 10 + restaurant.rating * 10 - route.totalMinutes + (budget.withinBudget ? 20 : -30),
  };
};

export async function generateWeekendPlans(input: string, selectedCompanions: Companion[] = [], options: { userId?: string } = {}) {
  const toolTrace: ToolResult[] = [];
  const intentTool = await parseUserIntent(input);
  toolTrace.push(intentTool);
  const memoryTool = await getUserPreferenceMemory(options.userId || 'demo_user');
  toolTrace.push(memoryTool);
  const authTool = await requestCompanionAuthorization(selectedCompanions.map((item) => item.id));
  toolTrace.push(authTool);
  const companions = selectedCompanions.length ? selectedCompanions : ((authTool.output as Companion[]) || []);
  const mergeTool = mergeGroupPreferences(intentTool.output as UserIntent, companions);
  toolTrace.push(mergeTool);
  const sceneTool = detectSceneType(intentTool.output as UserIntent, companions);
  toolTrace.push(sceneTool);
  const sceneType = sceneTool.output as SceneType;
  const constraints = mergeTool.output as string[];
  const activitiesTool = searchNearbyActivities(sceneType, constraints);
  const restaurantsTool = searchRestaurants(sceneType, constraints);
  toolTrace.push(activitiesTool, restaurantsTool);
  const candidates = (activitiesTool.output || []).slice(0, 3).map((activity, index) =>
    makePlan(['A', 'B', 'C'][index], sceneType, activity, (restaurantsTool.output || [])[index] || mockRestaurants[0], (intentTool.output as UserIntent).peopleCount),
  );
  const rankTool = rankPlans(candidates, constraints);
  toolTrace.push(rankTool);
  return {
    plans: rankTool.output || [],
    toolTrace,
    planningSteps: [
      '解析用户输入',
      '获取并合并同行人偏好',
      `识别场景：${sceneType}`,
      '搜索活动和餐厅',
      '校验营业、预约、排队、预算和路线',
      '排序生成 3 个可执行方案',
    ],
    detectedScene: sceneType,
    recommendationReasons: (rankTool.output || []).map((plan) => plan.reason),
  };
}

export async function executePlan(plan: Plan, selectedCompanions: Companion[] = []) {
  const toolTrace: ToolResult[] = [];
  const executionSteps: string[] = [];
  const ticketTool = createTicketOrder(plan.activity);
  toolTrace.push(ticketTool);
  executionSteps.push(ticketTool.message);
  let finalPlan = plan;
  const restaurantTool = createRestaurantReservation(plan.restaurant);
  toolTrace.push(restaurantTool);
  if (restaurantTool.status === 'failed') {
    executionSteps.push('原餐厅满座，进入异常兜底。');
    const fallback = generateFallbackPlan('餐厅满座', plan, plan.tags);
    toolTrace.push(...fallback.toolTrace);
    finalPlan = fallback.updatedPlan;
    const reservationTool = createRestaurantReservation(fallback.selected);
    toolTrace.push(reservationTool);
    executionSteps.push(`已切换为 ${fallback.selected.name} 并继续预约。`);
  } else {
    executionSteps.push(restaurantTool.message);
  }
  const reminderTool = createRouteReminder(finalPlan);
  const saveTool = saveWeekendTrip(finalPlan);
  const syncTool = syncTripToCompanions(finalPlan, selectedCompanions);
  toolTrace.push(reminderTool, saveTool, syncTool);
  executionSteps.push(reminderTool.message, saveTool.message, syncTool.message);
  return { executionSteps, toolTrace, finalPlan, syncResult: syncTool.output };
}
