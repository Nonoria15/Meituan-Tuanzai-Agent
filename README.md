完整 Tool 实现代码位于 src/agent/mockAgentTools.ts，包含需求解析、同行人偏好合并、活动/餐厅检索、预约检查、路线预算计算、异常兜底和行程同步等 Mock API 调用逻辑。

# 团崽 AI：基于美团小团的多人周末出行规划 Agent

赛题：美团黑客松「本地探索：周末闲时活动规划」

## 项目简介

团崽 AI 是基于美团小团能力延展出的多人周末出行规划 Agent，聚焦周末 4-6 小时本地闲时出行。它不是重新做一个旅游攻略网站，而是把美团本地生活搜索、商家、团购、预约、排队、票务、地图和账号能力组织成一个能规划、能执行、能兜底的 Agent 流程。

用户可以用一句话描述目标，例如“周末想和朋友聚会，预算 400，最好同一个商圈解决”，系统会结合同行人偏好、预算、距离、营业时间、预约状态、排队风险、天气与特殊出行需求，生成 3 个可执行方案，并模拟完成活动锁票、餐厅预约、路线提醒、异常兜底、行程保存和同行人同步。

## 核心解决的问题

- 用户周末临时出门，经常不知道去哪、怎么安排顺序、怎么控制预算。
- 普通攻略模板化、广告多，热门店排队久，临时决策成本高。
- 美团榜单和商家很多，但用户仍需要自己筛选、查路线、看排队、比预算、订座。
- 多人出行时，情侣、朋友、家人之间的偏好很难协调。
- 老人、孩子、行动不便者等群体的少走路、无障碍、不辣、安静等需求经常被普通推荐忽略。

## 核心功能

- 一句话输入周末目标。
- 选择同行人：美团好友、手动创建同行人、分享链接邀请。
- 同行人偏好授权与多人偏好合并。
- 根据情侣、朋友、亲子、妈妈/老人、爷爷无障碍、雨天、低预算等场景生成方案。
- 生成 3 个可执行方案，包含时间线、预算、路线耗时、匹配理由和可预约状态。
- 店铺/活动图片预览与 Mock 详情弹层。
- 支持“换一个”刷新整套方案，也支持“替换此站点”进行局部调整。
- 模拟活动锁票、餐厅预约、路线提醒和行程保存。
- 餐厅满座等异常兜底，支持接受推荐替代或重新选择餐厅。
- 最终行程同步给同行人；手动创建同行人可通过分享链接查看。

## Agent Planning 策略

团崽 AI 的规划逻辑分为五步：

1. **Parse user intent**：解析时间、人数、预算、地点、同行人、天气、是否少走路、是否室内、是否安静、是否不要太晚、是否可预约/可排队/可买券等约束。
2. **Detect scene type**：根据自然语言、快捷场景和同行人标签识别情侣约会、朋友聚会、亲子周末、妈妈/老人、爷爷无障碍、雨天室内、低预算、多人偏好平衡等场景。
3. **Merge personal and companion preferences**：合并用户个人偏好、美团好友授权偏好、手动创建同行人偏好和分享邀请同行人偏好。
4. **Apply hard constraints**：当同行人存在老人、行动不便、轮椅、不能吃辣、少走路、电梯方便等需求时，将这些需求作为强约束优先过滤。
5. **Rank candidate plans**：对活动、餐厅、咖啡、电影、室内场所等候选项进行组合排序，生成 3 个可执行方案。

排序公式：

```text
preferenceMatch + distanceScore + budgetScore + availabilityScore + timeFitScore + ratingScore - riskPenalty
```

系统优先选择同商圈、低等待、可预约、预算内、评分较高且符合同行人约束的组合，而不是单纯推荐热门榜单。

## Mock Tools / API

当前版本不接真实美团后端，而是使用 Mock API 模拟真实美团工具链。主要工具包括：

- `parseUserIntent()`：解析用户自然语言目标。
- `detectSceneType()`：识别情侣、朋友、亲子、雨天、低预算、无障碍等场景。
- `detectAccessibilityNeeds()`：识别老人、轮椅、不能吃辣、少走路等特殊需求。
- `getUserPreferenceMemory()`：模拟读取用户偏好记忆。
- `requestCompanionAuthorization()`：模拟同行人偏好授权。
- `mergeGroupPreferences()`：合并用户与同行人偏好。
- `searchNearbyActivities()`：检索附近活动、展览、电影、室内场所。
- `searchRestaurants()`：检索餐厅、咖啡、甜品等商家。
- `searchAccessiblePlaces()`：检索无障碍、少走路、安静、不辣的友好场所。
- `checkBusinessHours()`：检查营业时间。
- `checkAvailability()`：检查票务、订座和可预约状态。
- `estimateRoute()`：估算路线和移动时间。
- `calculateBudget()`：计算总预算与套餐价格。
- `rankPlans()`：对候选方案排序。
- `applyHardConstraints()`：应用无障碍、饮食、距离、时间等强约束。
- `createTicketOrder()`：模拟活动票锁定。
- `createRestaurantReservation()`：模拟餐厅预约。
- `createRouteReminder()`：模拟出发提醒。
- `saveWeekendTrip()`：模拟保存周末行程。
- `syncTripToCompanions()`：模拟同步行程给同行人。
- `searchAlternativePlaces()`：为不满意的站点搜索同类替代。
- `replacePlanStop()`：替换方案中的单个站点。
- `recalculatePlanAfterReplacement()`：替换后重新计算预算、路线和推荐理由。
- `generateFallbackPlan()`：异常发生时生成兜底方案。

未来如果接入真实美团系统，可以将这些 Mock Tools 替换为真实的商家、票务、订座、排队、团购、地图、账号和消息接口。

## 异常处理机制

Demo 中展示的不只是推荐结果，还包括执行过程中的恢复能力：

- **餐厅满座**：原推荐餐厅 18:00 已满时，自动寻找同商圈、预算相近、评分较高、可预约且符合同行人偏好的替代餐厅。
- **活动不可预订**：活动票不可锁定时，替换为同类型活动或室内备选。
- **超预算**：方案超过预算时，替换套餐或更低价商家。
- **距离过远**：移动时间过长时，切换为同商圈方案。
- **天气不佳**：优先选择室内活动、商场动线和交通方便的餐厅。
- **特殊需求冲突**：老人、轮椅、不能吃辣等强约束在“换一个”和“替换此站点”时仍然保留，避免替换到 Livehouse、嘈杂火锅、烧烤或长距离户外路线。

重点流程为：确认方案后，Agent 模拟锁定活动票、检查餐厅预约、发现满座、搜索替代餐厅、比较评分/预算/距离/同行人偏好、切换餐厅、继续完成订座、路线提醒、行程保存和同行人同步。

## 创新点

### 多人偏好协调

团崽 AI 不只是给单个用户推荐店铺，而是支持美团好友、手动创建同行人和分享链接邀请。系统会把“小雨喜欢拍照和日料”“阿哲预算敏感”“妈妈希望安静少走路”“爷爷需要轮椅友好且不能吃辣”等信息纳入规划，从“我去哪”升级为“我们适合去哪”。

### 弱势群体友好

Demo 中加入“爷爷”作为无障碍示例同行人。行动不便、需要轮椅、不辣、少走路、电梯方便、好停车等不是普通偏好，而是 hard constraints。只要这些需求出现，系统会优先选择无障碍、安静、不辣、可预约、低等待的路线。

### 美团社交属性

同行人选择、授权、分享邀请和行程同步让美团不只是个人消费工具，也可以成为多人本地出行协作入口。这个能力未来可以延展为电影搭子、火锅搭子、展览搭子、亲子周末局等本地生活社交场景。

### 美团中台客流调度

普通攻略和榜单容易把用户导向少数热门店，导致排队更长、体验下降。团崽 AI 通过模拟预约、排队、营业时间、距离、库存和商圈信息，把需求从过热商家调度到同商圈低等待、可预约、匹配度更高的替代供给，同时提升长尾商家曝光和平台履约效率。

### 从推荐到执行闭环

团崽 AI 不是只给攻略，而是模拟完成锁票、订座、提醒、兜底、局部替换、保存和同步。用户可以查看站点详情，不喜欢某个店时替换该站点，系统再重新计算预算和路线，更接近“帮用户把事情做完”的 Agent 价值。

## 技术栈

以当前 `package.json` 为准：

- Vite 7
- React 19
- JavaScript / JSX
- TypeScript（用于 `src/agent/mockAgentTools.ts`）
- Tailwind CSS
- PostCSS / Autoprefixer
- lucide-react 图标
- Mock API / local data
- Vercel deployment

## 项目结构

```text
.
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── agent/
│   │   └── mockAgentTools.ts
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── PhoneShell.jsx
│   │   ├── MouseTrailParticles.jsx
│   │   ├── TransitionOverlay.jsx
│   │   └── WaterfallCards.jsx
│   ├── data/
│   │   └── mockData.js
│   └── pages/
│       ├── LandingPage.jsx
│       ├── HomePage.jsx
│       ├── AgentInputPage.jsx
│       ├── PlanningPage.jsx
│       ├── PlansPage.jsx
│       ├── BookingPage.jsx
│       └── ItineraryPage.jsx
├── public/
│   ├── images/
│   └── assets/
├── docs/
│   ├── TuanZai_AI_Design_Document_Final.docx
│   ├── TuanZai_AI_Product_Introduction_For_Review_v2.docx
│   └── Vercel_Deployment_Guide.md
├── package.json
├── package-lock.json
├── index.html
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 运行方式

```bash
npm install
npm run dev
```

本地开发服务默认由 Vite 启动，命令中已配置 `--host 0.0.0.0`。

构建生产版本：

```bash
npm run build
```

预览构建产物：

```bash
npm run preview
```

## 在线 Demo

Online Demo: https://meituan-tuanzai-agent.vercel.app/

## 提交材料说明

- Demo：https://meituan-tuanzai-agent.vercel.app/
- Tool 实现代码：`src/agent/mockAgentTools.ts`。
- 设计文档：`docs/TuanZai_AI_Design_Document_Final.docx`。
- 交互说明文档：`docs/TuanZai_AI_Product_Introduction_For_Review_v2.docx`。

## 注意事项

当前项目为黑客松概念 Demo，使用 Mock API 模拟美团真实工具链，未接入美团真实后端、真实支付、真实下单或真实用户数据。所有订票、订座、排队、异常兜底和同行人同步均为本地 Mock 流程，用于展示 Agent 的 Planning、Tool-use、Execution 和 Recovery 能力。
