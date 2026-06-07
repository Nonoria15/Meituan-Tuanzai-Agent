# 团崽 AI 手机首页 UI 参数文档

## A. 文档范围

本文件只整理当前 Demo 手机内部界面的现有 UI 参数，不做修改建议。重点分析手机首页，包括顶部黄色区域、搜索栏、功能图标宫格、橙色团崽 AI 主卡片、同行人模块、生成方案按钮、附近值得去卡片、底部 Tab Bar。其余页面只做简要参数概览。

参数来源主要来自：

- `src/styles.css`
- `src/pages/HomePage.jsx`
- `src/components/PhoneShell.jsx`
- `src/components/BottomNav.jsx`
- `src/pages/AgentInputPage.jsx`
- `src/pages/PlanningPage.jsx`
- `src/pages/PlansPage.jsx`
- `src/pages/BookingPage.jsx`
- `src/pages/ItineraryPage.jsx`

## B. 手机模拟器基础参数

| 参数 | 当前值 | 中文说明 |
|---|---:|---|
| phone frame width（手机外框宽度） | `430px` | 手机模拟器外壳宽度 |
| phone frame height（手机外框高度） | `884px` | 手机模拟器外壳高度 |
| phone frame padding（手机外框内边距） | `12px` | 外壳到屏幕之间的厚度 |
| phone border radius（手机外框圆角） | `48px` | 手机外壳圆角 |
| phone background（手机外框背景） | `linear-gradient(145deg, #2b2d34, #07080b 46%, #202229)` | 深色金属质感外框 |
| phone shadow（手机外框阴影） | `0 38px 100px rgba(0,0,0,0.46)` + inset shadows | 手机整体投影与内阴影 |
| screen width（屏幕内部宽度） | `406px` | 手机屏幕区域宽度 |
| screen height（屏幕内部高度） | `860px` | 手机屏幕区域高度 |
| screen border radius（屏幕圆角） | `38px` | 手机屏幕圆角 |
| screen background（屏幕背景） | `#f6f6f6` | 手机 App 背景底色 |
| screen overflow（屏幕溢出） | `overflow: hidden` | 屏幕裁切内容，不允许溢出手机圆角 |
| fixed height（是否固定高度） | 是，默认 `884px / 860px` | 小屏下通过 media query 缩放到视口内 |
| status bar height（状态栏高度） | `34px` | 顶部状态栏高度 |
| status bar padding（状态栏内边距） | `0 28px` | 状态栏左右内边距 |
| app viewport overflow（App 视口溢出） | `.demo-app-viewport { overflow: hidden }` | App 页面容器不滚动 |
| page scroll layer（页面滚动层） | 每个页面的 `<main class="overflow-y-auto">` | 手机内部纵向滚动发生在页面 main 层 |
| bottom tab height（底部 Tab 高度） | 代码中未显式定义，按 `py-2 + item min-height 46px` 推测约 `62px` | 底部 Tab Bar 高度 |

响应式参数：

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| responsive phone width（响应式外框宽度） | `min(430px, calc(100vw - 24px))` | 小屏幕时手机不超出浏览器宽度 |
| responsive phone height（响应式外框高度） | `min(884px, calc(100vh - 32px))` | 小屏幕时手机不超出浏览器高度 |
| responsive screen height（响应式屏幕高度） | `calc(100% - 24px)` | 响应式时屏幕高度随外框缩放 |

## C. 首页整体布局参数【重点】

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| page background（页面背景色） | `#f6f6f6` | 手机首页整体背景 |
| page root class（页面根类） | `mobile-home-page min-h-0 flex-1 overflow-y-auto bg-[#f6f6f6]` | 首页 main 是滚动容器 |
| page horizontal padding（页面左右 padding） | 未统一定义；各模块使用 `12px` 或 `16px` | 首页模块间距分散定义 |
| top yellow area padding（顶部黄色区域内边距） | `12px 16px 20px` | 顶部黄色区域内边距 |
| feature card margin（功能宫格外边距） | `-12px 12px 0` | 宫格上移覆盖黄色区底部 |
| AI card margin（AI 卡片外边距） | `16px 12px 0` | AI 主卡片上下与左右间距 |
| nearby card margin（附近卡片外边距） | `24px 12px 20px` | 附近值得去模块间距 |
| section gap（模块垂直间距） | 主要为 `16px / 24px` | 首页各大模块间距 |
| content width（内容实际宽度） | 屏幕宽 `406px`，左右 margin `12px` 时内容约 `382px` | 首页主体卡片实际宽度 |
| bottom padding（底部预留） | 附近模块 bottom margin `20px`，底部 Tab 独立占位 | 代码中未显式为 Tab 额外设置 padding |

首页 typography tokens（首页字体变量）：

| 参数 | 当前值 | 中文说明 |
|---|---:|---|
| `--home-font-h1`（首页一级标题） | `22px` | AI 主卡标题字号 |
| `--home-font-h2`（首页二级标题） | `18px` | 附近值得去标题字号 |
| `--home-font-body`（首页正文） | `14px` | AI 副标题、搜索栏等正文 |
| `--home-font-caption`（首页辅助文字） | `12px` | 标签、说明、meta |
| `--home-font-icon-label`（宫格文字） | `11px` | 功能入口文字 |
| `--home-weight-bold`（粗体） | `700` | 首页标题粗体 |
| `--home-weight-semibold`（半粗） | `600` | 小标题、定位文字 |
| `--home-weight-medium`（中粗） | `500` | icon label / chip |
| `--home-line-height-title`（标题行高） | `1.3` | 标题行高 |
| `--home-line-height-body`（正文行高） | `1.5` | 正文行高 |
| `--home-line-height-caption`（辅助文字行高） | `1.4` | 辅助文字行高 |

## D. 顶部黄色区域参数【重点】

### 1. 顶部区域

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| top header class（顶部区域类） | `.mobile-home-hero` | 首页顶部黄色区域 |
| height（高度） | 代码中未显式定义，由内容 + padding 决定，推测约 `88px-100px` | 顶部区域视觉高度 |
| padding（内边距） | `12px 16px 20px` | 上、左右、下内边距 |
| background（背景） | `linear-gradient(180deg, #ffd100 0%, #ffd84a 100%)` | 美团黄色渐变 |
| border radius（圆角） | 无 | 顶部区域铺满，不单独圆角 |

### 2. 定位行

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| topbar margin-bottom（定位行下间距） | `12px` | 定位行与搜索栏间距 |
| city button display（定位按钮布局） | `flex` | 定位按钮横向排列 |
| icon size（定位图标尺寸） | `16px` | `MapPin size={16}` |
| text font-size（定位文字字号） | `14px` | 使用 `--home-font-body` |
| font-weight（定位文字字重） | `600` | 使用 `--home-weight-semibold` |
| color（定位文字颜色） | `#1f1f1f` | 深色文字 |
| gap（图标文字间距） | `4px` | icon 与“北京”的间距 |

### 3. 搜索栏

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| search height（搜索栏高度） | `44px` | 搜索栏固定高度 |
| search width（搜索栏宽度） | 宽度自适应父容器，约 `374px` | 父容器左右 padding 后撑满 |
| border radius（搜索栏圆角） | `22px` | 胶囊圆角 |
| background（搜索栏背景） | `rgba(255,255,255,0.96)` | 近白半透明 |
| padding（搜索栏内边距） | `0 16px` | 左右内边距 |
| gap（搜索图标文字间距） | `8px` | icon 与 placeholder 间距 |
| icon size（搜索图标尺寸） | `18px` | `Search size={18}` |
| placeholder font-size（占位文字字号） | `14px` | 使用 `--home-font-body` |
| placeholder color（占位文字颜色） | `#777` | 搜索提示文字颜色 |
| shadow（阴影） | `0 8px 20px rgba(91,69,0,0.08)` | 轻微暖色投影 |

### 4. 右上角 Logo

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| image class（图片类） | `h-8 w-auto object-contain` | Tailwind 类 |
| height（高度） | `h-8` = `32px` | logo 高度 |
| width（宽度） | `auto` | 按图片比例自适应 |
| object-fit（图片适配） | `object-contain` | 保持完整比例 |
| position（位置） | topbar 内 `space-between` 右侧 | 不是 absolute 定位 |

## E. 功能图标宫格参数【重点】

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| grid container class（宫格容器类） | `.mobile-feature-card` | 功能入口白色卡片 |
| container margin（容器外边距） | `-12px 12px 0` | 上移 12px，左右 12px |
| container padding（容器内边距） | `12px` | 宫格卡片内部留白 |
| container background（容器背景） | `#fff` | 白色卡片 |
| container radius（容器圆角） | `18px` | 白卡圆角 |
| container shadow（容器阴影） | `0 8px 22px rgba(18,18,18,0.06)` | 卡片阴影 |
| grid columns（宫格列数） | `repeat(4, minmax(0, 1fr))` | 单行 4 个入口 |
| grid gap（宫格行列间距） | `12px` | 行列统一间距 |
| item gap（图标文字间距） | `4px` | icon box 与文字间距 |
| icon container size（图标底块尺寸） | `28px × 28px` | 图标彩色底块 |
| icon container radius（图标底块圆角） | `10px` | 彩色方块圆角 |
| icon size（图标尺寸） | `18px` | lucide icon size |
| icon stroke（图标线宽） | `2.25` | 首页宫格图标 strokeWidth |
| label font-size（文字大小） | `11px` | 使用 `--home-font-icon-label` |
| label font-weight（文字字重） | `500` | 使用 `--home-weight-medium` |
| label color（文字颜色） | `#333` | 功能文字颜色 |
| active dot（呼吸光点） | `2px × 2px`，`rgba(255,107,0,0.72)` | 部分入口右上角弱光点 |
| active dot animation（呼吸动画） | `mobileHomeDotPulse 2.8s ease-in-out infinite` | 光点呼吸 |

图标背景色：

| 入口 | 当前值 | 中文说明 |
|---|---|---|
| 外卖 | `bg-[#ffd100]` | 黄色 |
| 美食 | `bg-[#ff7a00]` | 橙色 |
| 休闲玩乐 | `bg-[#69c7ff]` | 蓝色 |
| 电影演出 | `bg-[#ff7aac]` | 粉色 |
| 酒店民宿 | `bg-[#5aa7ff]` | 蓝色 |
| 景点门票 | `bg-[#31c98b]` | 绿色 |
| 预约订座 | `bg-[#f4b83f]` | 金黄色 |
| 周边商圈 | `bg-[#9c86ed]` | 紫色 |

## F. 团崽 AI 主卡片参数【最重点】

### 1. 主卡片容器

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| card section margin（卡片区域外边距） | `16px 12px 0` | AI 区块与宫格间距 |
| card width（卡片宽度） | 父级宽度撑满，约 `382px` | 屏幕宽 406px，左右 12px |
| card height（卡片高度） | 代码中未显式定义，由内容撑开，推测约 `280px-330px` | AI 卡片视觉高度 |
| card padding（卡片内边距） | `16px` | 内容内边距 |
| card radius（卡片圆角） | `20px` | 主卡片圆角 |
| card color（文字颜色） | `#fff` | 卡片内默认白字 |
| card overflow（溢出） | `overflow: hidden` | 裁切装饰光斑 |
| card background（卡片背景） | `linear-gradient(135deg, #ffc900 0%, #ff9300 46%, #ff6b00 100%)` + 2 个白色 radial gradient | 橙黄主渐变 |
| card shadow（卡片阴影） | `0 16px 34px rgba(255,111,0,0.24)` + inset | 暖色投影 |
| decorative blur（装饰模糊） | `::after` 180px 圆形，`filter: blur(8px)` | 右上角装饰光斑 |

### 2. 小标签

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| badge margin-bottom（标签下间距） | `8px` | 与标题间距 |
| badge display（标签布局） | `inline-flex` | 图标文字横排 |
| badge gap（图标文字间距） | `4px` | icon 与文字间距 |
| badge radius（标签圆角） | `20px` | 胶囊圆角 |
| badge background（标签背景） | `rgba(255,255,255,0.16)` | 半透明白 |
| badge padding（标签内边距） | `4px 8px` | 上下 4，左右 8 |
| badge font-size（标签字号） | `12px` | 使用 `--home-font-caption` |
| badge font-weight（标签字重） | `600` | 使用 `--home-weight-semibold` |
| badge color（标签颜色） | `rgba(255,255,255,0.92)` | 白色半透明 |
| icon size（标签图标尺寸） | `13px` | `Sparkles size={13}` |

### 3. 主标题

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| title text（标题文案） | `团崽 AI · 周末帮我排` | 主卡片标题 |
| font-size（字号） | `22px` | 使用 `--home-font-h1` |
| font-weight（字重） | `700` | 使用 `--home-weight-bold` |
| line-height（行高） | `1.3` | 使用 `--home-line-height-title` |
| color（颜色） | `#fff` | 白色 |
| margin（外边距） | `margin: 0` | 标题无默认外边距 |

### 4. 副标题

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| subtitle margin（副标题外边距） | `8px 0 0` | 与标题间距 8px |
| max-width（最大宽度） | `320px` | 副标题最长宽度 |
| font-size（字号） | `14px` | 使用 `--home-font-body` |
| font-weight（字重） | `400` | 使用 `--home-weight-regular` |
| line-height（行高） | `1.5` | 使用 `--home-line-height-body` |
| color（颜色） | `rgba(255,255,255,0.84)` | 白色半透明 |

### 5. 功能 Chips

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| chips container margin-top（容器上间距） | `16px` | 与副标题距离 |
| display（布局） | `flex` | 横向排列 |
| flex-wrap（是否换行） | `wrap` | 可换行 |
| gap（chip 间距） | `8px` | 横向/纵向统一间距 |
| chip padding（chip 内边距） | `6px 12px` | 上下 6，左右 12 |
| chip radius（chip 圆角） | `20px` | 胶囊圆角 |
| chip border（chip 边框） | `1px solid rgba(255,255,255,0.12)` | 半透明白边 |
| chip background（chip 背景） | `rgba(255,255,255,0.15)` | 半透明白 |
| chip font-size（chip 字号） | `12px` | 使用 `--home-font-caption` |
| chip font-weight（chip 字重） | `500` | 使用 `--home-weight-medium` |
| chip color（chip 字色） | `rgba(255,255,255,0.86)` | 白色半透明 |
| chip height（chip 高度） | 未显式定义，按 padding + 12px 字号推测约 `29px-32px` | 胶囊实际高度 |

### 6. 输入框

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| input margin-top（输入框上间距） | `16px` | 与 chips 间距 |
| input width（输入框宽度） | `100%`，由 flex 容器撑满 | 主卡片内宽 |
| input height（输入框高度） | 未显式定义，按 padding 推测约 `45px-48px` | 模拟输入框高度 |
| display（布局） | `flex` | 图标文字横排 |
| gap（图标文字间距） | `8px` | icon 与文字间距 |
| radius（圆角） | `12px` | 输入框圆角 |
| border（边框） | `1px solid rgba(255,255,255,0.1)` | 半透明白边 |
| background（背景） | `rgba(0,0,0,0.24)` | 深色半透明 |
| padding（内边距） | `12px 16px` | 上下 12，左右 16 |
| icon size（图标尺寸） | `16px` | `WandSparkles size={16}` |
| placeholder font-size（占位文字字号） | `14px` | 使用 `--home-font-body` |
| color（文字颜色） | `rgba(255,255,255,0.68)` | 白色弱化 |

### 7. 同行人 Row

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| row margin-top（上间距） | `12px` | 与输入框间距 |
| row min-height（最小高度） | `42px` | 同行人行高度 |
| row width（宽度） | `100%` | 撑满卡片 |
| display（布局） | `flex; justify-content: space-between` | 左右信息分布 |
| gap（内部间距） | `8px` | 左右内容间距 |
| border（边框） | `1px solid rgba(255,255,255,0.16)` | 半透明白边 |
| radius（圆角） | `14px` | 同行人行圆角 |
| background（背景） | `rgba(255,255,255,0.14)` | 半透明白 |
| padding（内边距） | `10px 12px` | 上下 10，左右 12 |
| icon size（图标尺寸） | `15px` | `Users size={15}` |
| left font-size（左侧字号） | `13px` | 同行人文字 |
| left font-weight（左侧字重） | `700` | 同行人文字 |
| right font-size（右侧状态字号） | `12px` | 已授权 / 选择好友 |
| right color（右侧状态颜色） | `#fff7c2` | 浅黄色 |

### 8. 生成方案按钮

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| button margin-top（按钮上间距） | `16px` | 与同行人 row 间距 |
| button min-height（最小高度） | `44px` | 生成方案按钮高度 |
| button width（宽度） | `100%` | 撑满卡片 |
| border（边框） | `0` | 无边框 |
| radius（圆角） | `20px` | 按钮圆角 |
| background（背景） | `linear-gradient(135deg, #ff8a00, #ff6b00)` | 橙色渐变 |
| color（字色） | `#fff` | 白字 |
| font-size（字号） | `16px` | 按钮文字字号 |
| font-weight（字重） | `500` | 使用 `--home-weight-medium` |
| shadow（阴影） | `0 10px 20px rgba(119,45,0,0.22)` + inset | 暖色投影 |
| active state（点击态） | `.demo-app-viewport button:active { transform: scale(0.98); filter: saturate(1.04) }` | 手机内按钮按压反馈 |

## G. 附近值得去卡片参数【重点】

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| card margin（模块外边距） | `24px 12px 20px` | 与 AI 卡片和底部间距 |
| card width（卡片宽度） | 约 `382px` | 手机屏幕减左右 12px |
| card height（卡片高度） | 未显式定义，由 3 条列表撑开，推测约 `330px-360px` | 附近值得去模块高度 |
| card padding（内边距） | `16px` | 白卡内边距 |
| card radius（圆角） | `18px` | 卡片圆角 |
| background（背景） | `#fff` | 白色 |
| shadow（阴影） | `0 8px 22px rgba(18,18,18,0.06)` | 轻阴影 |
| heading divider（标题分割线） | `1px solid rgba(31,31,31,0.1)` | 标题下分割线 |
| heading padding-bottom（标题下内边距） | `12px` | 标题区底部间距 |
| title font-size（标题字号） | `18px` | 使用 `--home-font-h2` |
| title font-weight（标题字重） | `600` | 使用 `--home-weight-semibold` |
| subtitle font-size（副标题字号） | `12px` | 使用 `--home-font-caption` |
| subtitle color（副标题颜色） | `#8a8f99` | 灰色 |
| list item display（列表项布局） | `flex` | 横向图文 |
| list item gap（列表项间距） | `12px` | 图片与文字间距 |
| list item padding（列表项内边距） | `16px 0` | 上下间距 |
| list divider（列表分割线） | `1px solid rgba(31,31,31,0.08)` | 每项底部分割线 |
| image width（图片宽度） | `96px` | 推荐图宽 |
| image height（图片高度） | `72px` | 推荐图高 |
| image radius（图片圆角） | `12px` | 推荐图圆角 |
| image object（图片裁切） | `background-size: cover; background-position: center` | 背景图裁切 |
| item title font-size（条目标题字号） | `16px` | 商家/活动名 |
| item title font-weight（条目标题字重） | `600` | 标题半粗 |
| item title line clamp（标题行数） | `-webkit-line-clamp: 2` | 最多两行 |
| meta font-size（评分距离字号） | `12px` | 使用 caption |
| rating color（评分颜色） | `#f59e0b` | 金色评分 |
| distance color（距离颜色） | `#9aa0aa` | 灰色 |
| price font-size（价格字号） | `12px` | 使用 caption |
| price color（价格颜色） | `#e65f2b` | 柔和橙红 |
| arrow icon size（箭头尺寸） | `20px` | `ChevronRight size={20}` |
| arrow color（箭头颜色） | `rgba(31,31,31,0.4)` | 弱化深色 |

## H. 底部 Tab Bar 参数【重点】

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| tab class（Tab 类） | `.bottom-nav grid grid-cols-5 border-t border-black/5 bg-white px-1 py-2` | 底部 Tab 容器 |
| position（定位） | `relative` | 非 fixed，作为 App viewport flex 子项 |
| height（高度） | 未显式定义，推测约 `62px` | `py-2` + item min-height `46px` |
| background（背景） | `#fff` | 白色 |
| border（边框） | `border-t border-black/5` | 顶部分割线 |
| shadow（阴影） | `0 -8px 24px rgba(18,18,18,0.045)` | 顶部轻阴影 |
| item count（数量） | `5` | 首页 / 视频 / 团崽 / 购物车 / 我的 |
| item min-height（条目最小高度） | `46px` | 每个 Tab item |
| item radius（条目圆角） | `12px` | 选中态背景圆角 |
| icon size（图标尺寸） | `20px` | lucide icon size |
| icon stroke selected（选中图标线宽） | `2.6` | 选中态更粗 |
| icon stroke normal（普通图标线宽） | `2` | 普通态线宽 |
| label font-size（标签字号） | `11px` | `text-[11px]` |
| selected background（选中背景） | `linear-gradient(180deg, #fff8d8, #fff)` | 选中态浅黄背景 |
| selected color（选中字色） | `#1f1f1f / #111` | 深色 |
| normal color（普通字色） | `#777` | 灰色 |
| selected underline（选中下划线） | `18px × 3px` | 黄色小条 |
| underline color（下划线颜色） | `#ffd100` | 美团黄 |
| bottom safe area（底部安全区） | 未显式定义 | 当前 Tab 未使用 safe-area padding |

## I. 其他页面简要参数

### 1. 周末帮我排输入页

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| page padding（页面内边距） | `px-4 pb-5 pt-4` = `16px / 20px / 16px` | 页面内容区 |
| header padding（头部内边距） | `px-4 py-3` = `16px / 12px` | 顶部标题栏 |
| input card padding（输入卡片内边距） | `p-4` = `16px` | 输入主卡片 |
| input card radius（输入卡片圆角） | `.rounded-2xl` 在 viewport 内覆盖为 `18px` | 主卡片圆角 |
| avatar icon size（头像块尺寸） | `h-11 w-11` = `44px` | Bot 图标底块 |
| textarea height（文本框高度） | `h-36` = `144px` | 需求输入区域 |
| textarea padding（文本框内边距） | `p-4` = `16px` | 文本框内边距 |
| textarea font-size（文本框字号） | `text-[15px]` | 输入文字字号 |
| main button height（主按钮高度） | `h-12` = `48px` | 开始规划按钮 |
| quick scene grid（快捷场景网格） | `grid-cols-2 gap-2` = 两列，间距 `8px` | 快捷按钮布局 |
| quick scene button padding（快捷按钮内边距） | `px-3 py-3` = `12px / 12px` | 快捷按钮内边距 |

### 2. Agent Planning / Tool Trace 页面

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| content padding（内容区内边距） | `px-4 py-4` = `16px` | 页面主体 |
| section gap（卡片间距） | `space-y-4` = `16px` | 卡片纵向间距 |
| user bubble max-width（用户气泡最大宽） | `max-w-[86%]` | 用户消息宽度 |
| user bubble padding（用户气泡内边距） | `px-4 py-3` = `16px / 12px` | 气泡内边距 |
| planning card max-width（规划卡片最大宽） | `max-w-[92%]` | Agent 卡片宽度 |
| planning card padding（规划卡片内边距） | `p-4` = `16px` | 卡片内边距 |
| card radius（卡片圆角） | `18px` | `.rounded-2xl` 覆盖值 |
| step icon size（步骤圆点尺寸） | `h-5 w-5` = `20px` | 步骤序号圆点 |
| step gap（步骤间距） | `space-y-2` = `8px` | 步骤列表间距 |
| tool card padding（工具卡片内边距） | `p-3` = `12px` | 每个工具调用卡片 |
| status badge font-size（状态标签字号） | `11px` | 完成/进行中标签 |

### 3. 方案列表页

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| filter row padding（筛选栏内边距） | `px-4 py-3` = `16px / 12px` | 顶部筛选栏 |
| plan section padding（方案区域内边距） | `px-4 pb-5` = `16px / 20px` | 方案列表区域 |
| plan card radius（方案卡片圆角） | `rounded-[20px]` | 方案卡片圆角 |
| plan card padding（方案卡片内边距） | `p-4` = `16px` | 卡片内容 |
| plan image height（方案图片高度） | `h-[92px]` | 活动/餐厅图片 |
| image gap（图片间距） | `gap-2` = `8px` | 两张图片间距 |
| price font-size（价格字号） | `22px` | 总价字号 |
| tag font-size（标签字号） | `11px` | 方案标签 |
| action button padding（操作按钮内边距） | `py-2` = `8px` | 按钮高度由内容决定 |

### 4. 预订执行 / 异常兜底 / 最终行程页

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| main card padding（主卡片内边距） | `p-4` = `16px` | 通用卡片内边距 |
| main card radius（主卡片圆角） | `18px` | `.rounded-2xl` 覆盖值 |
| status icon circle（状态图标圆形） | `h-6 w-6` = `24px` 或 `h-9 w-9` = `36px` | 状态图标容器 |
| exception card border（异常卡片边框） | `#ffd18a` | 异常卡片黄边 |
| exception card background（异常卡片背景） | `#fff8ea` | 异常卡片浅黄背景 |
| fallback image size（替代餐厅图片） | `w-20 h-16` = `80px × 64px` | 候选餐厅图片 |
| CTA button height（CTA 高度） | `h-12` = `48px` 或 `py-3` 推测约 `44px-48px` | 主操作按钮 |
| timeline gap（时间线间距） | `space-y-4` = `16px` | 最终行程时间线间距 |

### 5. 同行人 Bottom Sheet

| 参数 | 当前值 | 中文说明 |
|---|---|---|
| sheet width（弹层宽度） | `100%` | 手机屏幕内部宽度 |
| sheet max-height（弹层最大高度） | `78%` | 手机屏幕内部高度的 78% |
| sheet radius（弹层圆角） | `24px 24px 18px 18px` | 顶部大圆角，底部小圆角 |
| sheet z-index（弹层层级） | `80` | 高于底部 Tab |
| backdrop background（遮罩背景） | `rgba(0,0,0,0.34)` | 手机内暗色遮罩 |
| header padding（头部内边距） | `0 16px` | 弹层头部左右留白 |
| list overflow（列表滚动） | `overflow-y: auto` | 只有中部内容滚动 |
| list padding（列表内边距） | `0 14px 12px 16px` | 好友列表内边距 |
| friend card padding（好友卡片内边距） | `12px` | 好友卡片留白 |
| friend card radius（好友卡片圆角） | `16px` | 好友卡片圆角 |
| footer padding（底部按钮区内边距） | `12px 16px calc(12px + env(safe-area-inset-bottom))` | 按钮区安全区 |
| footer button height（按钮高度） | `min-height: 48px` | 底部取消/确认按钮 |
| footer grid（底部按钮布局） | `1fr 1.35fr` | 确认按钮更宽 |

## J. 当前参数集中程度

| 类型 | 当前状态 | 中文说明 |
|---|---|---|
| 首页字体参数 | 已集中在 `.mobile-home-page` CSS 变量 | 首页字号/字重/行高较集中 |
| 颜色参数 | 部分集中在 `tailwind.config.js` 的 `mt.yellow/orange/black/gray`，大量硬编码在 CSS/JSX | 黄色、橙色、灰色在多处重复 |
| 卡片圆角 | `.demo-app-viewport .rounded-2xl = 18px`、`.rounded-xl = 14px` 有局部统一 | 但部分组件仍硬编码 `20px / 24px / 16px` |
| 阴影参数 | `shadow-card` 和 `.demo-app-viewport article/.shadow-card` 有统一 | 首页部分卡片也单独硬编码阴影 |
| 首页布局 | 主要集中在 `styles.css` 的 `.mobile-*` 类 | 首页结构在 `HomePage.jsx` |
| 其他页面布局 | 多数写在 JSX Tailwind class 中 | 如 `p-4`, `space-y-4`, `rounded-2xl` |
| Bottom sheet 参数 | 集中在 `.mobile-friend-*` CSS | 结构在 `HomePage.jsx` |
| 动画参数 | 集中在 `styles.css` keyframes | 页面、sheet、按钮、success 动效分散但都在 CSS |

如果 UI 设计同学要调整手机首页，优先查看：

1. `src/styles.css`
   - `.mobile-home-*`
   - `.mobile-feature-*`
   - `.mobile-ai-*`
   - `.mobile-nearby-*`
   - `.mobile-friend-*`
   - `.bottom-nav`
2. `src/pages/HomePage.jsx`
   - 首页模块结构、宫格入口数据、推荐列表数据、同行人弹层结构
3. `src/components/PhoneShell.jsx`
   - 手机外框、屏幕、状态栏
4. `src/components/BottomNav.jsx`
   - 底部 Tab 文案、图标、选中态逻辑
5. `tailwind.config.js`
   - `mt.yellow`, `mt.orange`, `mt.black`, `mt.gray`, `shadow.card`

