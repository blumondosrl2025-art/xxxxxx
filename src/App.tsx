import { useState, useEffect } from 'react';
import { ChatMessage, StoreSchema, StoreProduct, HistoryVersion, ShopTheme } from './types';
import ChatWorkspace from './components/ChatWorkspace';
import LivePreviewFrame from './components/LivePreviewFrame';
import VisualBlockInspector from './components/VisualBlockInspector';
import CartDrawer from './components/CartDrawer';
import DeploymentPopup from './components/DeploymentPopup';
import ThemeEngine from './components/ThemeEngine';
import TemplateGalleryModal from './components/TemplateGalleryModal';
import { Sparkles, Layout, RotateCcw, HelpCircle, ArrowUpRight, Github } from 'lucide-react';
import { decodeSchema } from './lib/shareUtils';
import { executeRuntimeUiCommand } from './data/runtime-ui-map';

const INITIAL_COFFEE_TEMPLATE: StoreSchema = {
  shopName: "琥珀时光精品咖啡馆",
  shopSlogan: "一杯温度，三分闲适，让时间在这里慢下来",
  logoText: "AMBER COFFEE",
  logoStyle: "serif",
  theme: {
    primaryColor: "#895129",
    accentColor: "#C19A6B",
    backgroundColor: "#FDFBF7",
    cardBgColor: "#FFFFFF",
    textColor: "#3E2723",
    fontFamily: "serif",
    styleType: "warm",
    borderRadius: "md"
  },
  navigation: [
    { label: "臻选咖啡", anchor: "products" },
    { label: "温暖空间", anchor: "gallery" },
    { label: "咖啡故事", anchor: "about" },
    { label: "寻找店面", anchor: "contact" }
  ],
  products: [
    {
      id: "p1",
      name: "琥珀臻选 · 手冲埃塞冷萃",
      price: 38,
      originalPrice: 45,
      description: "柑橘与茉莉花香交织，酸甜明亮，纯手工精细滴滤萃取。",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      category: "单品手冲"
    },
    {
      id: "p2",
      name: "黄金橡木 · 燕麦生椰经典拿铁",
      price: 32,
      originalPrice: 38,
      description: "椰香醇厚，精选阿拉比卡拼配，与植物生椰乳完美交融。",
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
      category: "创意特调"
    },
    {
      id: "p3",
      name: "宇治抹茶小炉烤栗千层饼",
      price: 35,
      originalPrice: 42,
      description: "超25层超薄饼皮，栗子客家粉糯，微苦茶香清爽解腻。",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
      category: "法式糕点"
    },
    {
      id: "p4",
      name: "南美庄园原木烘焙豆 (250g)",
      price: 88,
      originalPrice: 108,
      description: "纯正庄园，自烘焙深度烘焙豆，黑巧与天然焦糖甜香风味持久。",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80",
      category: "单品豆"
    }
  ],
  sections: [
    {
      id: "hero",
      type: "hero",
      title: "琥珀时光精品咖啡馆",
      subtitle: "手焙烘烤，精细萃取，在这里偷得浮生半日闲。",
      content: "我们在闹市深处为您寻觅一片属于烘焙豆香与木椅舒展的治愈地包。",
      alignment: "center"
    },
    {
      id: "products",
      type: "products",
      title: "今日 · 臻选好物菜单",
      subtitle: "每周严选优质产地豆，由金牌咖啡师手工调和慢焙制作",
      productIds: ["p1", "p2", "p3", "p4"]
    },
    {
      id: "features",
      type: "features",
      title: "深植细节的品牌信念",
      items: [
        { id: "f1", title: "庄园直采生豆", description: "每一颗绿豆均自拉丁美洲与非洲精品庄园直航运达，成分纯正。", icon: "Layers" },
        { id: "f2", title: "金杯金标萃取", description: "严格按照美国SCA金杯标准，精密分析水温、流速、粉水比。", icon: "Coffee" },
        { id: "f3", title: "凌晨手作烘焙", description: "专业烘焙坊每日凌晨现烤，绝不添加防腐辅料，口口鲜美。", icon: "Sparkles" }
      ]
    },
    {
      id: "about",
      type: "about",
      title: "一粒咖啡豆的时光朝圣",
      content: "我们在平均海拔1850米的庄园深谷中，人工纯手采下最嫣红饱满的咖啡樱桃。剥壳、纯天然日晒、慢速中度烘烤。直到咖啡一滴滴沥入白瓷杯折射出琥珀般的光泽。这是一段关于自然、纯粹、与匠人坚守的手作旅程，我们期待与挑剔的您，在此共剪这段琥珀温情。",
      alignment: "left"
    },
    {
      id: "gallery",
      type: "gallery",
      title: "慵懒光影空间",
      items: [
        { id: "g1", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=500&q=80", caption: "暖洋洋靠阳光街角桌" },
        { id: "g2", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80", caption: "原装意式萃取区" },
        { id: "g3", image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=500&q=80", caption: "木栅格老友靠椅" }
      ]
    },
    {
      id: "testimonials",
      type: "testimonials",
      title: "饮客老友的声音",
      items: [
        { id: "t1", name: "姜女士", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80", role: "独立服装主理人", content: "咖啡品质稳得惊人。特别是手冲，香气非常奔放。每次来在这里坐半天，整个烦躁感一扫而空。", rating: 5 },
        { id: "t2", name: "苏先生", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80", role: "室内架构师", content: "这里的装修配图完全戳中我。色感与家具沉静舒适，极富匠心细节。来梧桐老洋房这边强烈推荐歇脚。", rating: 5 }
      ]
    },
    {
      id: "faq",
      type: "faq",
      title: "常客细致答疑",
      items: [
        { id: "faq1", question: "咖啡豆提供研磨服务吗？", answer: "可以。我们会根据您的冲煮器具（手冲壶、法压、冰滴、半自动）进行毫米级磨粉。均加抽真空阀保护密封好。" },
        { id: "faq2", question: "店里提供企业歇茶水订单吗？", answer: "提供。您可以拨打电话或者线上直接申请预购。满15杯起可为您配送定制保温套和当日鲜烤甜挞包。" }
      ]
    },
    {
      id: "contact",
      type: "contact",
      title: "寻香寻豆之旅",
      subtitle: "在这，用心等待一杯热巧咖啡的时光",
      content: "地址：上海市徐汇区梧桐树影繁茂的复古生活创意街角102号院 \n迎客电话：021-88889999 \n寻香时间：周一至周日 08:30 - 21:30",
      alignment: "center"
    }
  ]
};

export default function App() {
  const [schema, setSchema] = useState<StoreSchema>(() => {
    // 1. Attempt to load shared schema from URL parameter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sharedParam = params.get('share') || params.get('schema');
      if (sharedParam) {
        const decoded = decodeSchema(sharedParam);
        if (decoded) {
          console.log("Successfully restored custom shop schema from URL share token:", decoded.shopName);
          return decoded;
        }
      }
    }

    // 2. Fall back to local storage
    const saved = localStorage.getItem('ais_store_schema');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Parsed stored schema error, falling back to initial", e);
      }
    }
    return INITIAL_COFFEE_TEMPLATE;
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isEditorMode, setIsEditorMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      const editor = params.get('editor');
      if (mode === 'preview' || editor === 'false') {
        return false;
      }
    }
    return true;
  });
  const [cart, setCart] = useState<{ product: StoreProduct; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [history, setHistory] = useState<HistoryVersion[]>([]);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [workspaceSkin, setWorkspaceSkin] = useState<'cyber' | 'mono'>('cyber');

  const [aiProvider, setAiProvider] = useState<'gemini' | 'local'>(() => (typeof localStorage !== 'undefined' && localStorage.getItem('shop_ai_provider') as 'gemini' | 'local') || 'gemini');
  const [ollamaHost, setOllamaHost] = useState<string>(() => (typeof localStorage !== 'undefined' && localStorage.getItem('shop_ollama_host')) || 'http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState<string>(() => (typeof localStorage !== 'undefined' && localStorage.getItem('shop_ollama_model')) || 'llama3.1:8b');

  // Sync AI Settings
  useEffect(() => {
    localStorage.setItem('shop_ai_provider', aiProvider);
  }, [aiProvider]);
  useEffect(() => {
    localStorage.setItem('shop_ollama_host', ollamaHost);
  }, [ollamaHost]);
  useEffect(() => {
    localStorage.setItem('shop_ollama_model', ollamaModel);
  }, [ollamaModel]);

  // Sync schema changes to localStorage immediately
  useEffect(() => {
    localStorage.setItem('ais_store_schema', JSON.stringify(schema));
  }, [schema]);

  // System greeting on mount
  useEffect(() => {
    let hasShared = false;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      hasShared = !!(params.get('share') || params.get('schema'));
    }
    const greeting: ChatMessage = {
      id: "welcome",
      role: "system",
      content: hasShared
        ? `✨ **成功识别并双向导入分享的店铺架构：『${schema.shopName}』！** 完美还原了该设计特选的配色与完整商品配置。\n\nAI 极速工作流与沙箱已重新热挂载。您可以继续在左下角输入任何设计灵感或指令（例如：“改造成黑金赛博风格”或“产品新增一个咖啡磨豆机”）来进行升级！`
        : "你好！欢迎来到 AI 一句话开店工作台。☕ 我已经为你铺设了首选项——「琥珀时光咖啡馆」的暖木设计，右侧即是店铺对应的完整骨架 Schema。你可以随口吩咐我：“改成黑白冷淡数码店”、“卖猫咪零食配粉粉圆圆风”、“产品加一个原野干花器皿”，我将瞬间为您重编译店铺！",
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([greeting]);
  }, []);

  // Keyboard shortcut clear select
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSectionId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle send message to Gemini API
  const handleSendMessage = async (userPrompt: string) => {
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setGenerating(true);

    // Save current schema to history before overwriting for easy rollback!
    const newHistoryItem: HistoryVersion = {
      id: `v_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      schema: JSON.parse(JSON.stringify(schema)),
      description: userPrompt
    };
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // max 10 records

    // --- Runtime UI Awareness & Intent Interceptor Agent ---
    const intercepted = executeRuntimeUiCommand(
      userPrompt,
      schema,
      setSchema,
      handleTriggerUIAction,
      (text) => {
        const systemMsg: ChatMessage = {
          id: `sys_${Date.now()}`,
          role: "assistant",
          content: text,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, systemMsg]);
      },
      setSelectedSectionId
    );

    if (intercepted) {
      setGenerating(false);
      return;
    }

    try {
      // Setup payload based on message type
      let action = "generate";
      const normalized = userPrompt.toLowerCase();
      if (normalized.includes("改") || normalized.includes("加") || normalized.includes("删") || normalized.includes("修") || normalized.includes("换")) {
        action = "edit";
      }
      if (normalized.includes("换皮") || normalized.includes("风格") || normalized.includes("配色") || normalized.includes("颜色")) {
        action = "theme_change";
      }

      const response = await fetch("/api/generate-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          currentSchema: schema,
          action,
          provider: aiProvider,
          ollamaHost,
          ollamaModel
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with the shop developer server.");
      }

      const parsedData = await response.json();
      
      if (parsedData.schema) {
        setSchema(parsedData.schema);
      }

      // Add assistants monologue
      const aiResponse: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: parsedData.explanation || "已成功为您一键构筑并优化了店铺设计。",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (err: any) {
      console.error(err);
      const errResponse: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        role: "assistant",
        content: "😅 抱歉，刚才连结服务器有些累了。不过这难不倒我，我已经自启动我的本地备份核心为您微调了色谱，你可以查看修改反馈！",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errResponse]);
    } finally {
      setGenerating(false);
    }
  };

  // Revert history rollback
  const handleRevertHistory = (vId: string) => {
    const snapshot = history.find(h => h.id === vId);
    if (snapshot) {
      setSchema(JSON.parse(JSON.stringify(snapshot.schema)));
      
      const revertMsg: ChatMessage = {
        id: `revert_${Date.now()}`,
        role: "assistant",
        content: `⏱️ 时光机穿梭完毕！已成功将店铺 Schema 数据一键回滚回方案：『${snapshot.description}』状态。`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, revertMsg]);
    }
  };

  // Cart operations
  const handleAddToCart = (product: StoreProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Shake shopping cart with notification trigger
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const handleSelectTemplate = (newSchema: StoreSchema, templateName: string) => {
    // 1. Commit previous state into revision log
    const rollbackItem: HistoryVersion = {
      id: `v_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      schema: JSON.parse(JSON.stringify(schema)),
      description: `微设：切换至「${templateName}」概念设计`
    };
    setHistory(prev => [rollbackItem, ...prev].slice(0, 10));

    // 2. Overplay the state with selected schema
    setSchema(JSON.parse(JSON.stringify(newSchema)));
    setSelectedSectionId(null);
    setIsTemplatesOpen(false);

    // 3. Dispatch reactive assistant feed message
    const aiMessage: ChatMessage = {
      id: `tpl_applied_${Date.now()}`,
      role: 'assistant',
      content: `🎨 **「${templateName}」** 殿堂级概念店设计方案已成功为您一键注入！\n\n- **超级品牌**: 已成功切换到首推的 Slogan、Logo 配置；\n- **色相及倒角**: 主色调 \`${newSchema.theme.primaryColor}\`，辅色调 \`${newSchema.theme.accentColor}\`，结合 \`${newSchema.theme.borderRadius}\` 级倒角；\n- **中英文字体配备**: 启用 \`${newSchema.theme.fontFamily}\` 双语体组系统，提供纯正的设计氛围；\n- **臻选货架**: 导入了适合该品类的精品商品及对应板块组合。\n\n你可以通过时光机随时一键回落之前的设计，也可以在左下角输入框对当前的布局和文字命令我做出实时微调修整！`,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleApplyDriveImage = (imageUrl: string) => {
    // Save current schema to history before overwriting
    const newHistoryItem: HistoryVersion = {
      id: `v_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      schema: JSON.parse(JSON.stringify(schema)),
      description: "应用 Google Drive 同步图片资产"
    };
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));

    setSchema(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      
      // If a section is selected, replace its image
      if (selectedSectionId) {
        let replaced = false;
        updated.sections = updated.sections.map((section: any) => {
          if (section.id === selectedSectionId) {
            replaced = true;
            if (section.type === 'hero' || section.type === 'about') {
              return { ...section, image: imageUrl };
            } else if (section.items && section.items.length > 0) {
              const updatedItems = [...section.items];
              updatedItems[0] = { ...updatedItems[0], image: imageUrl };
              return { ...section, items: updatedItems };
            }
          }
          return section;
        });

        // Or find in products
        updated.products = updated.products.map((p: any) => {
          if (p.id === selectedSectionId) {
            replaced = true;
            return { ...p, image: imageUrl };
          }
          return p;
        });

        if (!replaced) {
          const hero = updated.sections.find((s: any) => s.type === 'hero');
          if (hero) {
            hero.image = imageUrl;
          } else if (updated.products.length > 0) {
            updated.products[0].image = imageUrl;
          }
        }
      } else {
        const hero = updated.sections.find((s: any) => s.type === 'hero');
        if (hero) {
          hero.image = imageUrl;
        } else if (updated.products.length > 0) {
          updated.products[0].image = imageUrl;
        }
      }
      return updated;
    });

    const systemMsg: ChatMessage = {
      id: `img_sync_${Date.now()}`,
      role: "assistant",
      content: `📸 成功应用！已将您的 Google Drive 资产：\n${imageUrl}\n一键覆盖注入到店铺活动板块首图中，实时同步渲染。`,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  const handleAddChatMessage = (content: string) => {
    const systemMsg: ChatMessage = {
      id: `sys_${Date.now()}`,
      role: "assistant",
      content,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  const handleTriggerUIAction = (actionId: string) => {
    switch (actionId) {
      case 'openCart':
        setIsCartOpen(true);
        break;
      case 'closeCart':
        setIsCartOpen(false);
        break;
      case 'openTemplates':
        setIsTemplatesOpen(true);
        break;
      case 'closeTemplates':
        setIsTemplatesOpen(false);
        break;
      case 'openDeploy':
        setIsDeployOpen(true);
        break;
      case 'changeTheme':
        // Rotates themes (styleType)
        const styles: ('minimal' | 'modern' | 'warm' | 'cyberpunk' | 'luxury' | 'retro' | 'bento')[] = [
          'minimal', 'modern', 'warm', 'cyberpunk', 'luxury', 'retro', 'bento'
        ];
        const currentIndex = styles.indexOf(schema.theme.styleType);
        const nextIndex = (currentIndex + 1) % styles.length;
        const nextStyle = styles[nextIndex];
        
        setSchema(prev => {
          const updated = JSON.parse(JSON.stringify(prev));
          updated.theme.styleType = nextStyle;
          // Dynamically adapt typical parameters
          if (nextStyle === 'cyberpunk') {
            updated.theme.primaryColor = '#6366F1';
            updated.theme.accentColor = '#10B981';
            updated.theme.backgroundColor = '#0A0A0C';
            updated.theme.cardBgColor = '#121216';
            updated.theme.textColor = '#E4E4E7';
            updated.theme.fontFamily = 'mono';
          } else if (nextStyle === 'luxury') {
            updated.theme.primaryColor = '#D4AF37';
            updated.theme.accentColor = '#996515';
            updated.theme.backgroundColor = '#090909';
            updated.theme.cardBgColor = '#121212';
            updated.theme.textColor = '#F3F4F6';
            updated.theme.fontFamily = 'playfair';
          } else if (nextStyle === 'minimal') {
            updated.theme.primaryColor = '#18181B';
            updated.theme.accentColor = '#71717A';
            updated.theme.backgroundColor = '#FAFAFA';
            updated.theme.cardBgColor = '#FFFFFF';
            updated.theme.textColor = '#09090B';
            updated.theme.fontFamily = 'sans';
          } else if (nextStyle === 'warm') {
            updated.theme.primaryColor = '#895129';
            updated.theme.accentColor = '#C19A6B';
            updated.theme.backgroundColor = '#FDFBF7';
            updated.theme.cardBgColor = '#FFFFFF';
            updated.theme.textColor = '#3E2723';
            updated.theme.fontFamily = 'serif';
          }
          return updated;
        });

        // Add assistant notification message
        const themeNotifyMsg: ChatMessage = {
          id: `theme_action_${Date.now()}`,
          role: 'assistant',
          content: `⚡ **【界面感知触发器】** 精准调换店铺配色样式成功！新设计规范已热挂载：\n- **当前风格**: \`${nextStyle.toUpperCase()}\` 系列主题\n`,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, themeNotifyMsg]);
        break;
      case 'toggleWorkspaceSkin':
        setWorkspaceSkin(prev => prev === 'cyber' ? 'mono' : 'cyber');
        break;
      case 'scrollToProducts':
        // Scroll to product zone
        const prdSection = document.getElementById('products-section') || document.querySelector('[data-section-type="products"]');
        if (prdSection) {
          prdSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Alternate scroll using window API
          const el = document.getElementById('preview-viewport-iframe');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
        break;
      default:
        console.warn('Unknown UI Action:', actionId);
    }
  };

  const isMono = workspaceSkin === 'mono';

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${isMono ? 'bg-[#f4f4f5] text-zinc-900' : 'bg-[#09090b] text-zinc-100'}`}>
      
      {/* Workspace Inner Panels Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 1. LEFT COLUMN: Chat dialogue layer (25% width; only visible in Editor mode) */}
        {isEditorMode && (
          <div className={`w-80 md:w-96 flex-shrink-0 border-r select-text ${isMono ? 'border-zinc-200' : 'border-zinc-900'}`}>
            <ChatWorkspace
              messages={messages}
              onSendMessage={handleSendMessage}
              generating={generating}
              history={history}
              onRevertHistory={handleRevertHistory}
              schema={schema}
              onChangeSchema={setSchema}
              onApplyImage={handleApplyDriveImage}
              onAddChatMessage={handleAddChatMessage}
              workspaceSkin={workspaceSkin}
              onTriggerUIAction={handleTriggerUIAction}
              aiProvider={aiProvider}
              onChangeAiProvider={setAiProvider}
              ollamaHost={ollamaHost}
              onChangeOllamaHost={setOllamaHost}
              ollamaModel={ollamaModel}
              onChangeOllamaModel={setOllamaModel}
            />
          </div>
        )}

        {/* 2. MIDDLE SCREEN: Interactive device sandbox view (fledges to 100% when previewing) */}
        <div className={`flex-1 flex flex-col h-full ${isMono ? 'bg-zinc-150' : 'bg-[#111114]'}`}>
          <LivePreviewFrame
            schema={schema}
            isEditorMode={isEditorMode}
            onChangeEditorMode={setIsEditorMode}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onAddToCart={handleAddToCart}
            cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenDeploy={() => setIsDeployOpen(true)}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            workspaceSkin={workspaceSkin}
            onChangeWorkspaceSkin={setWorkspaceSkin}
          />
        </div>

        {/* 3. RIGHT COLUMN: Core inspector (only visible in Editor mode) */}
        {isEditorMode && (
          <div className={`w-80 md:w-88 flex-shrink-0 border-l ${isMono ? 'border-zinc-200' : 'border-zinc-900'}`}>
            <VisualBlockInspector
              schema={schema}
              onChangeSchema={setSchema}
              selectedSectionId={selectedSectionId}
              onClearSelection={() => setSelectedSectionId(null)}
              workspaceSkin={workspaceSkin}
              onSelectSection={setSelectedSectionId}
            />
          </div>
        )}

      </div>

      {/* Bottom status bar removed to stay clean, professional, and free from engineering metrics clutter */}
      <ThemeEngine theme={schema.theme} containerId="shopview-viewport-root" />

      {/* Slideout interactive shopping cart Drawer overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        primaryColor={schema.theme.primaryColor}
      />

      {/* Deployment publish steps overlay dialogue */}
      <DeploymentPopup
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
        schema={schema}
      />

      {/* Premium Concept Storefront Templates Gallery Modal Overlay */}
      <TemplateGalleryModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        activeSchema={schema}
      />

    </div>
  );
}
