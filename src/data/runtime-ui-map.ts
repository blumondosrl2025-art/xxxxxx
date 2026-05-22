import { StoreSchema } from '../types';

export interface RuntimePage {
  id: string;
  name: string;
  route: string;
  status: 'active' | 'inactive';
  description: string;
  childrenComponents: string[];
}

export interface RuntimeComponent {
  id: string;
  name: string;
  path: string;
  purpose: string;
  interactionStates: string[];
  boundController: string;
}

export interface RuntimeControl {
  actionId: string;
  label: string;
  commandPattern: RegExp;
  description: string;
  component: string;
  triggerEvent: string;
}

export interface RuntimeState {
  key: string;
  type: string;
  currentValue: any;
  purpose: string;
}

// 📖 The complete registered structural universe of our application
export const RUNTIME_UI_PAGES: RuntimePage[] = [
  {
    id: 'storefront_preview',
    name: '多端商铺交付大页面',
    route: '/',
    status: 'active',
    description: '核心渲染层，按 Schema 自顶向下堆叠渲染各个区块，可模拟桌面、平板及手机运行态。',
    childrenComponents: ['HeroSection', 'ProductsGrid', 'FeaturesBlock', 'AboutStory', 'Testimonials', 'ContactBlock', 'NavBar']
  }
];

export const RUNTIME_UI_COMPONENTS: RuntimeComponent[] = [
  {
    id: 'LivePreviewFrame',
    name: '模拟系统画布宿主 (LivePreviewFrame)',
    path: '/src/components/LivePreviewFrame.tsx',
    purpose: '管理多尺寸设备缩放比例及顶层布局视图容器。',
    interactionStates: ['deviceSize', 'zoomScale', 'searchTerm', 'categoryFilter'],
    boundController: 'LivePreviewFrame'
  },
  {
    id: 'ChatWorkspace',
    name: 'AI 二开控制中心 (ChatWorkspace)',
    path: '/src/components/ChatWorkspace.tsx',
    purpose: '核心交互，包括 AIGC 文案大师、图生图滤镜工坊、VO 核心舱、多 Agent 协作工作流。',
    interactionStates: ['activeTab', 'voSubTab', 'selectedDnaId', 'isRecording', 'agentStepLogs'],
    boundController: 'ChatWorkspace'
  },
  {
    id: 'VisualBlockInspector',
    name: '双击实时可视化修改面板 (VisualBlockInspector)',
    path: '/src/components/VisualBlockInspector.tsx',
    purpose: '用于双击任意区块或在侧边打开商品编辑、文本更改与模块上下搬移。',
    interactionStates: ['selectedSectionId', 'isEditingProduct'],
    boundController: 'VisualBlockInspector'
  },
  {
    id: 'CartDrawer',
    name: '侧滑微购物结算袋 (CartDrawer)',
    path: '/src/components/CartDrawer.tsx',
    purpose: '提供自适应滑入，商品结算，自动折算原划线价促购，以及配送表单。',
    interactionStates: ['isCartOpen', 'checkoutStep', 'shippingAddress'],
    boundController: 'App / CartDrawer'
  },
  {
    id: 'ThemeEngine',
    name: 'CSS 样式色谱注入引擎 (ThemeEngine)',
    path: '/src/components/ThemeEngine.tsx',
    purpose: '解析当前 JSON 里的 theme 对象，将其拆解成 CSS 局部变量，极速热替换整个商场。',
    interactionStates: ['themeVariables'],
    boundController: 'ThemeEngine'
  },
  {
    id: 'TemplateGalleryModal',
    name: '概念店设计模板库 (TemplateGalleryModal)',
    path: '/src/components/TemplateGalleryModal.tsx',
    purpose: '搭载多品类殿堂级概念店一键注入中心。',
    interactionStates: ['isTemplatesOpen'],
    boundController: 'App / TemplateGalleryModal'
  }
];

export const RUNTIME_UI_CONTROLS: RuntimeControl[] = [
  {
    actionId: 'openCart',
    label: '触发开启购物车抽屉',
    commandPattern: /^(打开(购物车|结算袋|购物袋)|查看购物车)/i,
    description: '唤出侧滑结算拉带，展示商品清单及折扣价格。',
    component: 'CartDrawer',
    triggerEvent: 'onTriggerUIAction("openCart")'
  },
  {
    actionId: 'closeCart',
    label: '触发收起购物车抽屉',
    commandPattern: /^(关闭(购物车|结算袋|购物袋)|收起购物车)/i,
    description: '收回侧滑，让用户注意力回到商品主浏览页。',
    component: 'CartDrawer',
    triggerEvent: 'onTriggerUIAction("closeCart")'
  },
  {
    actionId: 'openTemplates',
    label: '触发唤出精品模板中心',
    commandPattern: /^(打开(模板中心|甄选模板|设计方案)|查看模板|模板库)/i,
    description: '打开全屏模板卡片进行全新一键品类设计重洗。',
    component: 'TemplateGalleryModal',
    triggerEvent: 'onTriggerUIAction("openTemplates")'
  },
  {
    actionId: 'openProductEditor',
    label: '呼起商品可视化编辑',
    commandPattern: /^(打开商品管理|打开商品编辑|打开产品编辑|修改商品|编辑产品)/i,
    description: '重定向右侧巡导定位至 ProductPanel 并锚定 products 区块。',
    component: 'VisualBlockInspector',
    triggerEvent: 'onSelectSection("products")'
  },
  {
    actionId: 'changeThemeMinimal',
    label: '切换成极致简约黑白冷淡风',
    commandPattern: /^(切换黑白风|切换极简白|改成简约白|极简模式|极简白|简约黑白)/i,
    description: '把 Theme 精准切换到 minimal，字体改 sans，配置精细高雅灰色调。',
    component: 'ThemeEngine',
    triggerEvent: 'updateThemeStyle("minimal")'
  },
  {
    actionId: 'changeThemeLuxury',
    label: '一键改成奢华纯黑金店面',
    commandPattern: /^(切换黑金|改成奢华黑|奢华黑金|黑金风格|黑金机能|黑金精工)/i,
    description: '将 Theme 样式置为 luxury，色谱改浅奢拉丝铜和高对比暗影。',
    component: 'ThemeEngine',
    triggerEvent: 'updateThemeStyle("luxury")'
  },
  {
    actionId: 'appleStyleDesign',
    label: '一键将版面洗成苹果官网美学',
    commandPattern: /^(像苹果官网|苹果风格|苹果美学|像苹果)/i,
    description: '启用 minimal 色相调性，将 section 的纵向内边距提升至宽裕，文字改sans，背景纯无染。',
    component: 'ThemeEngine / Layout',
    triggerEvent: 'applyAppleAesthetic()'
  },
  {
    actionId: 'seniorHeroStyle',
    label: '智能化微调 Hero 首屏高级度',
    commandPattern: /^(把Hero调高级一点|Hero再大一点|加大Hero|把首屏改大|美化首屏)/i,
    description: '增大首屏大框负空间，改为居中对齐，调和微灰色背景，并对 title 增加高对比度与留白。',
    component: 'ComponentRenderer (Hero)',
    triggerEvent: 'enhanceHeroLayout()'
  },
  {
    actionId: 'magazineImages',
    label: '重装高奢杂志下午光图生图配画',
    commandPattern: /^(产品图再杂志感|更换高定配图|杂志视觉|商品图高奢化)/i,
    description: '自动对 products 加载高对比下午斜射光影或者天然原野盆栽底纹素材url，摆脱平面感。',
    component: 'LivePreviewFrame / ProductsGrid',
    triggerEvent: 'applyMagazineStocks()'
  }
];

// 🧠 THE NATURAL LANGUAGE RUNTIME INTERCEPTOR AGENT
// Direct semantic resolution of user intent - immediate UI Control & Schema evolution
export function executeRuntimeUiCommand(
  prompt: string,
  schema: StoreSchema,
  setSchema: (s: StoreSchema) => void,
  onTriggerUIAction: (actionId: string) => void,
  onAddChatMessage: (msg: string) => void,
  onSelectSection: (id: string | null) => void
): boolean {
  const normalized = prompt.trim().toLowerCase();

  // 1. OPEN CART
  if (normalized.match(/^(打开(购物车|结算袋|购物袋|侧边栏)|查看购物车)/i)) {
    onTriggerUIAction('openCart');
    onAddChatMessage("⚡ **【UI 实时感知成功】** 识别到您希望 **“打开购物车”** 的指令！系统已自动唤入「**CartDrawer (购物车结算滑盖)**」。");
    return true;
  }

  // 2. CLOSE CART
  if (normalized.match(/^(关闭(购物车|结算袋|购物袋)|收起购物车)/i)) {
    onTriggerUIAction('closeCart');
    onAddChatMessage("⚡ **【UI 实时感知成功】** 识别到您希望 **“关闭购物车”** 的指令！已联动折叠「**CartDrawer**」。");
    return true;
  }

  // 3. OPEN TEMPLATES
  if (normalized.match(/^(打开(模板中心|甄选模板|设计方案)|查看模板|模板库)/i)) {
    onTriggerUIAction('openTemplates');
    onAddChatMessage("⚡ **【UI 实时感知成功】** 识别并呼应您的口令：**“打开甄选模板中心”**！已为您闪出「**TemplateGalleryModal (精品模板廊架)**」。");
    return true;
  }

  // 4. OPEN PRODUCT MANAGER
  if (normalized.match(/^(打开商品管理|打开商品编辑|打开产品编辑|修改商品|编辑产品)/i)) {
    onSelectSection('products');
    const productsEl = document.getElementById('products-section') || document.querySelector('[data-section-type="products"]');
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: 'smooth' });
    }
    onAddChatMessage("⚡ **【UI 实时感知成功】** 识别到命令：**“打开商品管理”**！正在为您在右侧展开「**VisualBlockInspector (双击交互面板)**」商品数据货盘，并已为您的屏幕平滑滚转聚焦到中间商铺售卖底座。");
    return true;
  }

  // 5. CHANGE STYLE -> MINIMALIST BLACK-WHITE
  if (normalized.match(/^(切换黑白风|切换极简白|改成简约白|极简模式|极简白|简约黑白)/i)) {
    const updated = JSON.parse(JSON.stringify(schema));
    updated.theme.styleType = 'minimal';
    updated.theme.primaryColor = '#18181B';
    updated.theme.accentColor = '#71717A';
    updated.theme.backgroundColor = '#FAFAFA';
    updated.theme.cardBgColor = '#FFFFFF';
    updated.theme.textColor = '#09090B';
    updated.theme.fontFamily = 'sans';
    updated.theme.borderRadius = 'md';
    setSchema(updated);

    onAddChatMessage("⚡ **【UI 实时感知成功】** 聆听到命令：**“切换黑白冷淡风”**！已调用 **Theme Engine** 为极简设计进行基因剪裁：\n- **调性选择**: `MINIMAL` 北欧素净风；\n- **字库配对**: `sans (Inter 中性极细体)`；\n- **配色比例**: 高纯白底加上高对比木灰色，优雅回归纯粹。");
    return true;
  }

  // 6. CHANGE STYLE -> LUXURY DARK GOLD
  if (normalized.match(/^(切换黑金|改成奢华黑|奢华黑金|黑金风格|黑金机能|黑金精工)/i)) {
    const updated = JSON.parse(JSON.stringify(schema));
    updated.theme.styleType = 'luxury';
    updated.theme.primaryColor = '#D4AF37';
    updated.theme.accentColor = '#996515';
    updated.theme.backgroundColor = '#090909';
    updated.theme.cardBgColor = '#121212';
    updated.theme.textColor = '#F3F4F6';
    updated.theme.fontFamily = 'playfair';
    updated.theme.borderRadius = 'md';
    setSchema(updated);

    onAddChatMessage("⚡ **【UI 实时感知成功】** 聆听到命令：**“极尚奢华黑金”**！已调用 **Theme Engine** 全新热挂载拉丝暗金哥特质感：\n- **调性选择**: `LUXURY` 奢金重工业风格；\n- **字库配对**: `playfair` 高雅衬线字；\n- **配色比例**: 暗影大背景拼接金色抛光按键，尽数透露精英定制风韵。");
    return true;
  }

  // 7. APPLE STYLE AESTHETIC 
  if (normalized.match(/^(像苹果官网|苹果风格|苹果美学|像苹果)/i)) {
    const updated = JSON.parse(JSON.stringify(schema));
    updated.theme.styleType = 'minimal';
    updated.theme.primaryColor = '#000000';
    updated.theme.accentColor = '#86868B';
    updated.theme.backgroundColor = '#FFFFFF';
    updated.theme.cardBgColor = '#F5F5F7';
    updated.theme.textColor = '#1D1D1F';
    updated.theme.fontFamily = 'sans';
    updated.theme.borderRadius = 'lg';
    
    // Auto spacing enhancement
    updated.shopSlogan = "设计的精简，不仅是视觉的留白，更是材质的真诚。";
    
    // Modify Hero title spacing
    const heroIndex = updated.sections.findIndex((s: any) => s.type === 'hero');
    if (heroIndex !== -1) {
      updated.sections[heroIndex].title = "设计的完美。";
      updated.sections[heroIndex].subtitle = "极致无摩擦美学体系，超透气留白。";
      updated.sections[heroIndex].alignment = "center";
    }
    
    setSchema(updated);
    onAddChatMessage("⚡ **【UI 实时感知成功】** 识别到设计重塑意境：**“像苹果官网”**！系统已重构 **Template DNA** 注入苹果极致现代美学：\n- **超呼吸留白**: 宽裕面距，纯白背景；\n- **卡骨重算**: 自适应 `F5F5F7` 现代环保浅灰色折叠 Bento 弧边卡片；\n- **标语精简**: 全语改用中性 `sans (无衬线)` 字体，高雅、极富细节。");
    return true;
  }

  // 8. SENIOR HERO LAYOUT ADJUSTER
  if (normalized.match(/^(把Hero调高级一点|Hero再大一点|加大Hero|把首屏改大|美化首屏)/i)) {
    const updated = JSON.parse(JSON.stringify(schema));
    const heroIndex = updated.sections.findIndex((s: any) => s.type === 'hero');
    if (heroIndex !== -1) {
      updated.sections[heroIndex].title = "☕ " + updated.sections[heroIndex].title;
      updated.sections[heroIndex].alignment = "center";
      updated.sections[heroIndex].subtitle = "── 手作现烤 · 自然萃选 · 极致典雅 ──";
    }
    updated.theme.borderRadius = 'lg';
    if (updated.theme.fontFamily === 'sans') {
      updated.theme.fontFamily = 'serif'; // Give it editorial charm!
    }
    setSchema(updated);

    onAddChatMessage("⚡ **【UI 实时感知成功】** 成功捕获意图：**“首屏大 Hero 区块高级化”**！正在智能改写 **Hero Layout Rules**：\n- **排页聚焦**: 将大标题排排对齐切换至 `Center (高阶对齐)` 锚点；\n- **字相升格**: 引入中西大宋衬线编织符，加持前缀“手作现烤 · 自然现焙”极致优雅语录，画面瞬间扩增呼吸张力。");
    
    const heroEl = document.getElementById('hero-section') || document.querySelector('[data-section-type="hero"]');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    }
    return true;
  }

  // 9. HIGH END MAGAZINE STOCKS (IMG_TO_IMG MAPPING)
  if (normalized.match(/^(产品图再杂志感|更换高定配图|杂志视觉|商品图高奢化)/i)) {
    const updated = JSON.parse(JSON.stringify(schema));
    
    // High-end editorial Unsplash photography
    const luxuryStocks = [
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-151351525088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
    ];

    updated.products.forEach((p: any, idx: number) => {
      p.image = luxuryStocks[idx % luxuryStocks.length];
    });

    setSchema(updated);
    onAddChatMessage("⚡ **【UI 实时感知成功】** 识别指令：**“配画高定杂志感”**！重新挂载 **Component Mapping** 艺术摄影，载入午后斜射光芒与原野竹藤底色配图，去平面化，使画屏张力直线上升！");
    
    const prdEl = document.getElementById('products-section') || document.querySelector('[data-section-type="products"]');
    if (prdEl) {
      prdEl.scrollIntoView({ behavior: 'smooth' });
    }
    return true;
  }

  // 10. CYBERPUNK BENTO
  if (normalized.match(/^(切换极客网格|改成数码赛博|极客网格|赛博风格|数码极客)/i)) {
    const updated = JSON.parse(JSON.stringify(schema));
    updated.theme.styleType = 'cyberpunk';
    updated.theme.primaryColor = '#6366F1';
    updated.theme.accentColor = '#10B981';
    updated.theme.backgroundColor = '#0A0A0C';
    updated.theme.cardBgColor = '#121216';
    updated.theme.textColor = '#E4E4E7';
    updated.theme.fontFamily = 'mono';
    updated.theme.borderRadius = 'sm';
    setSchema(updated);

    onAddChatMessage("⚡ **【UI 实时感知成功】** 识别到您希望 **“改成数码赛博/集成便当化网格”** 的命令！已智能调用 **Theme Engine** 配置：\n- **设计骨骼**: `BENTO` 便当模块硬核拼接；\n- **配色矩阵**: 霓虹深靛靛紫搭配绿荧发光边框；\n- **字组套件**: `mono (JetBrains 技术代码等宽体)`；已全量热挂载。");
    return true;
  }

  // Fallback to general LLM API if no reactive front-end UI command matches
  return false;
}
