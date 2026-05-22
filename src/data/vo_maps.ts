export interface TemplateDNA {
  templateId: string;
  name: string;
  industry: string;
  style: string;
  mood: string;
  spacing: string;
  typography: string;
  colors: {
    primary: string;
    accent: string;
    bg: string;
    card: string;
    text: string;
  };
  layout: string;
  heroStyle: string;
  productStyle: string;
  ctaStyle: string;
  motionStyle: string;
  imageStyle: string;
  // Brand DNA Civilization Attributes
  brandEmotion: string[];
  audience: string[];
  layoutRhythm: {
    hero: string;
    spacing: string;
    cta: string;
  };
  visualGravity: {
    contrast: string;
    focus: string;
  };
  typographySpec: {
    title: string;
    body: string;
  };
  commerceFlow: string[];
}

export interface UIAction {
  id: string;
  label: string;
  description: string;
  component: string;
  action: string;
  triggerEvent: string;
}

export interface DBTable {
  id: string;
  name: string;
  description: string;
  recordCount: number;
  fields: { name: string; type: string; desc: string; required: boolean }[];
}

export const TEMPLATE_DNA_MAP: Record<string, TemplateDNA> = {
  "amber-coffee": {
    templateId: "amber-coffee",
    name: "琥珀时光精品咖啡馆",
    industry: "餐饮美食 / 慢生活体验",
    style: "手作拼配原木温润风 (Warm & Cozy)",
    mood: "质朴温暖、咖啡豆香、静心安详",
    spacing: "宽裕呼吸感布局 (Spacious & Natural), 72px 纵向内边距",
    typography: "宋体/衬线配组 (Classic Serif) + 衬线大标题",
    colors: {
      primary: "#895129",
      accent: "#C19A6B",
      bg: "#FDFBF7",
      card: "#FFFFFF",
      text: "#3E2723"
    },
    layout: "经典杂志分栏配图比例, 主打慢节奏与故事探索",
    heroStyle: "巨幅原木大边框沉浸式主图 banner, 居中排布",
    productStyle: "优雅复古圆角卡片 (border-md), 极具模拟质感",
    ctaStyle: "琥珀橡木褐色微圆按钮 (rounded-md), 有实体触感",
    motionStyle: "平缓徐行淡入 (Smooth Stagger, 300ms 缓动)",
    imageStyle: "高色温烘焙咖啡静物图, 偏暖金滤调",
    brandEmotion: ["cozy", "artisanal", "serene", "community"],
    audience: ["22-45", "urban creatives", "coffee lovers", "slow-life advocates"],
    layoutRhythm: {
      hero: "center-heavy",
      spacing: "spacious (72px paddings)",
      cta: "warm-rounded-pill"
    },
    visualGravity: {
      contrast: "subtle-cohesive",
      focus: "asymmetric story flow"
    },
    typographySpec: {
      title: "serif (宋体客宿)",
      body: "sans-serif (中性暖灰色)"
    },
    commerceFlow: ["storytelling", "trust value badges", "curated menu", "sensory reservation"]
  },
  "tokyo-matcha": {
    templateId: "tokyo-matcha",
    name: "京都宇治·古木古茶庄",
    industry: "茶道美美学 / 静心禅意空间",
    style: "宋代禅意古制深色风 (Zen Elegance)",
    mood: "竹影清风、素静优雅、尘嚣尽消",
    spacing: "幽静微紧凑空间排版, 强调框线严整性",
    typography: "高挑衬线宋体 (Playfair / Traditional Serif)",
    colors: {
      primary: "#3B533E",
      accent: "#A4996F",
      bg: "#F4F6F2",
      card: "#FFFFFF",
      text: "#1C251D"
    },
    layout: "多重边框内缩茶道故事轴, 左右对称和风韵味",
    heroStyle: "水墨松针大图背景, 单栏浮空徽标",
    productStyle: "纸质和风精典边线卡片, 留白占比高",
    ctaStyle: "清竹苍绿角方按钮 (border-sm), 禅意内敛",
    motionStyle: "微风竹叶摇曳式缓推 transition",
    imageStyle: "低饱和度翠绿茶筅与青竹静物, 透露空灵",
    brandEmotion: ["reverence", "quietude", "spiritual", "historicity"],
    audience: ["28-55", "cultural purists", "tea connoisseurs", "interior designers"],
    layoutRhythm: {
      hero: "floating-symmetric",
      spacing: "highly ordered grid",
      cta: "sharp rectangular outline"
    },
    visualGravity: {
      contrast: "medium-high (green/accent gold)",
      focus: "perfect lateral balance"
    },
    typographySpec: {
      title: "playfair (高挑宋体)",
      body: "serif-classic (古典衬线)"
    },
    commerceFlow: ["heritage story", "ancient processing gallery", "connoisseur grading", "limited preorder"]
  },
  "minimalist-linen-store": {
    templateId: "minimalist-linen-store",
    name: "北欧林间素白生活馆",
    industry: "家居百货 / 纯棉麻成衣",
    style: "极致简约极客冷淡风 (Minimalist Clean)",
    mood: "素色无尘、呼吸自然、安静放空",
    spacing: "极度空旷无界留白 (Ultra-Spacious), 96px 过渡区隔",
    typography: "中性现代无衬线 Inter / Space Grotesk",
    colors: {
      primary: "#18181B",
      accent: "#71717A",
      bg: "#FAFAFA",
      card: "#FFFFFF",
      text: "#09090B"
    },
    layout: "非对称现代建筑折叠排布, 无网格透气线框",
    heroStyle: "纯透高雅无边大留白画面, 极致现代冷色调",
    productStyle: "无边缝拼折扁平大间距卡骨设计, 突出材质天然触感",
    ctaStyle: "正炭黑冷黑纯直角按钮 (rounded-none), 精简洗练",
    motionStyle: "高帧无痕瞬时切镜 (Instant Layout Transition)",
    imageStyle: "冷调白色原胚棉织、极高光照静音林中透光物",
    brandEmotion: ["authority", "luxury", "minimal"],
    audience: ["25-40", "high-income", "fashion"],
    layoutRhythm: {
      hero: "full-screen",
      spacing: "ultra-wide",
      cta: "minimal"
    },
    visualGravity: {
      contrast: "high",
      focus: "center-heavy"
    },
    typographySpec: {
      title: "playfair",
      body: "grotesk"
    },
    commerceFlow: ["emotion", "trust", "product", "conversion"]
  },
  "bento-tech-deck": {
    templateId: "bento-tech-deck",
    name: "CYBER DECK 便当极客舱",
    industry: "极客数码 / 电竞组设 / AI Hardware",
    style: "赛博霓虹便当微光风 (Bento Cyberpunk)",
    mood: "暗黑脉冲、智能流彩、等宽精密",
    spacing: "严整密致二维 Bento 网格, 细描深灰边框 border-zinc-900",
    typography: "技术极客专用等宽字 (JetBrains Mono / Fira Code)",
    colors: {
      primary: "#6366F1",
      accent: "#10B981",
      bg: "#0A0A0C",
      card: "#121216",
      text: "#E4E4E7"
    },
    layout: "自适应折叠非等高便当矩阵格, 极高屏幕效率集成",
    heroStyle: "流光半屏多格仪表特控, 微发光卡片",
    productStyle: "小曲率暗拉丝卡骨配以指示指示微光点",
    ctaStyle: "高亮霓虹靛蓝微发光胶囊按钮 (shadow-emerald/20)",
    motionStyle: "极速弹簧碰撞回弹 (Bounce Layout, 150ms)",
    imageStyle: "偏冷偏暗带青蓝冷光照射机械键盘、极高像素晶片零件",
    brandEmotion: ["autonomy", "efficiency", "precision", "futurism"],
    audience: ["18-35", "developers", "cyberpunk enthusiasts", "gamers"],
    layoutRhythm: {
      hero: "bento-bilingual",
      spacing: "dense-pixel borders",
      cta: "glow-active-pill"
    },
    visualGravity: {
      contrast: "neon lights glow contrast",
      focus: "bento multi-box mosaic"
    },
    typographySpec: {
      title: "grotesk-bold (Space Grotesk)",
      body: "mono-strict (JetBrains Mono)"
    },
    commerceFlow: ["specification manifest", "interactive config table", "quick cart payload", "lightning crypto checkout"]
  },
  "luxury-gold-motor": {
    templateId: "luxury-gold-motor",
    name: "黑金重机狂热实验室",
    industry: "定制机车 / 精英潮牌配饰",
    style: "暗黑奢华黑金机能风 (Luxury Dark Gold)",
    mood: "冷酷尊贵、重工业齿轮、奢金流苏",
    spacing: "极佳戏剧性黑幕留白 (High Contrast Dramatic Blank)",
    typography: "高挑窄金哥特粗体 / Playfair Display",
    colors: {
      primary: "#D4AF37",
      accent: "#996515",
      bg: "#090909",
      card: "#121212",
      text: "#F3F4F6"
    },
    layout: "极简垂直对齐, 暗金单线网格系统",
    heroStyle: "狂野改装机壳抛光暗光大图, 金属颗粒纹理",
    productStyle: "黑拉丝底面加细亮金描边卡片 (border-amber-500/20)",
    ctaStyle: "奢华暗金抛年渐变按钮 (Pill capsule shape)",
    motionStyle: "黄金液态丝滑融化过渡 (Fluid Transition)",
    imageStyle: "黑背景冷光照射抛光不锈钢、金色仪表细节",
    brandEmotion: ["authority", "hedonism", "audacity", "extreme quality"],
    audience: ["30-50", "luxury watch collectors", "high-net bikers", "night owls"],
    layoutRhythm: {
      hero: "dramatic noir spotlight",
      spacing: "wide vertical borders",
      cta: "heavy metallic amber pill"
    },
    visualGravity: {
      contrast: "super-extreme depth contrast",
      focus: "central single spotlight"
    },
    typographySpec: {
      title: "playfair (意式中世纪重奢)",
      body: "sans-medium (现代雅黑)"
    },
    commerceFlow: ["theatrical introduction", "bespoke tailored details", "singular elite showcase", "personal concierge contact"]
  }
};

export const UI_AWARENESS_MAP: Record<string, UIAction> = {
  "openCart": {
    id: "openCart",
    label: "打开侧边购物袋",
    description: "唤起右侧抽屉式购物袋, 进行商品增删、结算及填写配送地址",
    component: "CartDrawer",
    action: "setIsCartOpen(true)",
    triggerEvent: "USER_CLICK_CART | COMPONENT_INVOKE"
  },
  "closeCart": {
    id: "closeCart",
    label: "关闭侧边购物袋",
    description: "收起右侧抽屉式购物袋, 回到主页面流",
    component: "CartDrawer",
    action: "setIsCartOpen(false)",
    triggerEvent: "USER_CLICK_BACKDROP | ESC_KEY"
  },
  "openTemplates": {
    id: "openTemplates",
    label: "打开甄选模板中心",
    description: "载入云端 AI 预调配多品类高端模板卡片供用户切换",
    component: "TemplateGalleryModal",
    action: "setIsTemplatesOpen(true)",
    triggerEvent: "USER_CLICK_TOP_TEMPLATES_HUB"
  },
  "changeThemeSkin": {
    id: "changeThemeSkin",
    label: "一键调换开发舱皮肤",
    description: "快速切换 Cyber 霓虹黑绿与 Mono 经典纸质白黑开发工作流主题",
    component: "ChatWorkspace / App",
    action: "workspaceSkin === 'cyber' ? 'mono' : 'cyber'",
    triggerEvent: "USER_TOGGLE_SKIN_DOCK"
  },
  "triggerCheckout": {
    id: "triggerCheckout",
    label: "引导购买结算",
    description: "将购物袋状态晋升至配送信息表单填写态",
    component: "CartDrawer",
    action: "setCheckoutStep('shipping')",
    triggerEvent: "USER_CLICK_CHECKOUT_BUTTON"
  },
  "openDeployPopup": {
    id: "openDeployPopup",
    label: "打开一键发布弹出层",
    description: "展示店铺多端分发地址、静态下载包及一键上传 Firebase 引导",
    component: "DeploymentPopup",
    action: "setIsDeployOpen(true)",
    triggerEvent: "USER_CLICK_TOP_DEPLOY_LAUNCH"
  },
  "scrollToProducts": {
    id: "scrollToProducts",
    label: "重锚聚焦到商品区",
    description: "预览画面平滑滚动聚焦到‘Products’栏目区块",
    component: "LivePreviewFrame",
    action: "scrollToAnchor('products')",
    triggerEvent: "USER_CLICK_NAV_LINK_PRODUCTS"
  }
};

export const DB_AWARENESS_SCHEMA: Record<string, DBTable> = {
  "products": {
    id: "products",
    name: "products (精选好物池)",
    description: "管理店铺当前主打的专属设计商品池",
    recordCount: 3,
    fields: [
      { name: "id", type: "string", desc: "商口唯一键, 如 p1, p2", required: true },
      { name: "name", type: "string", desc: "商品臻选名, 如 琥珀手冲", required: true },
      { name: "price", type: "number", desc: "实售价 (元)", required: true },
      { name: "originalPrice", type: "number", desc: "促销划线原价 (元)", required: false },
      { name: "description", type: "string", desc: "产品艺术化品鉴描绘词", required: true },
      { name: "image", type: "string", desc: "高精 Unsplash 静态素材源 url", required: true },
      { name: "category", type: "string", desc: "分类索引标签", required: false }
    ]
  },
  "sections": {
    id: "sections",
    name: "sections (排版核心模块)",
    description: "管理页面流由上至下的模块组合与文案排列",
    recordCount: 4,
    fields: [
      { name: "id", type: "string", desc: "模块键, 如 hero, products, about, contact", required: true },
      { name: "type", type: "string", desc: "类型: hero | products | features | about | testimonials | contact", required: true },
      { name: "title", type: "string", desc: "大框核心标语", required: true },
      { name: "subtitle", type: "string", desc: "副标题说明文字", required: false },
      { name: "content", type: "string", desc: "主体段落叙述文案", required: false },
      { name: "productIds", type: "string[]", desc: "多关联商品键集合", required: false },
      { name: "items", type: "any[]", desc: "非标准嵌套子组 (如优势信任卡片)", required: false }
    ]
  },
  "theme": {
    id: "theme",
    name: "theme (色相倒角与排版)",
    description: "管理全渲染节点的色彩变量、圆角规范与通用字体",
    recordCount: 1,
    fields: [
      { name: "primaryColor", type: "string", desc: "主色调 Hex 码, 多用于填充与强调", required: true },
      { name: "accentColor", type: "string", desc: "辅强调色 Hex 码, 用于悬浮 and 气泡", required: true },
      { name: "backgroundColor", type: "string", desc: "页面大背景暖冷基调色", required: true },
      { name: "cardBgColor", type: "string", desc: "盒型卡片底衬灰白度", required: true },
      { name: "textColor", type: "string", desc: "高对比易读墨色 / 亮白", required: true },
      { name: "fontFamily", type: "string", desc: "sans (系统无衬线) | serif (宋体衬线) | mono (代码等宽)", required: true },
      { name: "styleType", type: "string", desc: "设计调性: warm | minimal | cyberpunk | luxury | retro", required: true },
      { name: "borderRadius", type: "string", desc: "倒角跨度: none (直角) | sm | md | lg | full", required: true }
    ]
  },
  "history": {
    id: "history",
    name: "history (方案时间机器)",
    description: "高频保存的 Schema 历史时光节点, 用于极速撤销 and 对比",
    recordCount: 0,
    fields: [
      { name: "id", type: "string", desc: "版本凭证 v_17x", required: true },
      { name: "timestamp", type: "string", desc: "高精记录物理时间", required: true },
      { name: "schema", type: "object", desc: "序列化快照 StoreSchema 数据", required: true },
      { name: "description", type: "string", desc: "促发该版本的用户原 prompt 意图", required: true }
    ]
  }
};
