import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, RefreshCw, Undo, Grid, Type, Sliders, Palette, Clock, Check, HelpCircle, ArrowRight, Cloud,
  Database, Cpu, Play, HardDrive, Mic, MicOff, Bot, Layers, TrendingUp, BarChart2, Image, Volume2, HardDriveDownload
} from 'lucide-react';
import { ChatMessage, StoreSchema, HistoryVersion, StoreProduct } from '../types';
import GoogleDriveCockpit from './GoogleDriveCockpit';
import { 
  TEMPLATE_DNA_MAP, 
  UI_AWARENESS_MAP, 
  DB_AWARENESS_SCHEMA,
  TemplateDNA,
  UIAction,
  DBTable 
} from '../data/vo_maps';
import {
  RUNTIME_UI_PAGES,
  RUNTIME_UI_COMPONENTS,
  RUNTIME_UI_CONTROLS
} from '../data/runtime-ui-map';

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  generating: boolean;
  history: HistoryVersion[];
  onRevertHistory: (id: string) => void;
  schema: StoreSchema;
  onChangeSchema: (newSchema: StoreSchema) => void;
  onApplyImage?: (imageUrl: string) => void;
  onAddChatMessage?: (content: string) => void;
  workspaceSkin?: 'cyber' | 'mono';
  onTriggerUIAction?: (actionId: string) => void;

  // AI Connection configuration bounds
  aiProvider?: 'gemini' | 'local';
  onChangeAiProvider?: (provider: 'gemini' | 'local') => void;
  ollamaHost?: string;
  onChangeOllamaHost?: (host: string) => void;
  ollamaModel?: string;
  onChangeOllamaModel?: (model: string) => void;
}

export default function ChatWorkspace({
  messages,
  onSendMessage,
  generating,
  history,
  onRevertHistory,
  schema,
  onChangeSchema,
  onApplyImage,
  onAddChatMessage,
  workspaceSkin = 'cyber',
  onTriggerUIAction,
  aiProvider = 'gemini',
  onChangeAiProvider,
  ollamaHost = 'http://localhost:11434',
  onChangeOllamaHost,
  ollamaModel = 'llama3.1:8b',
  onChangeOllamaModel
}: ChatWorkspaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'drive' | 'vo'>('chat');
  const [voSubTab, setVoSubTab] = useState<'dna' | 'ui' | 'db' | 'agents' | 'lab' | 'analytics'>('dna');
  const [selectedDnaId, setSelectedDnaId] = useState<string>('amber-coffee');
  const [showUiMapJson, setShowUiMapJson] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isMono = workspaceSkin === 'mono';

  // 🎙️ Speech recognition voice engine states
  const [isRecording, setIsRecording] = useState(false);
  const [recSpeechText, setRecSpeechText] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  // 🤖 AI Multi-Agent configuration states
  const [agentPromptText, setAgentPromptText] = useState('创意原品暖炉植造咖啡店，生成高定文案并自平衡划线促销价');
  const [isAgentFlowRunning, setIsAgentFlowRunning] = useState(false);
  const [agentActiveIdx, setAgentActiveIdx] = useState(-1);
  const [agentStepLogs, setAgentStepLogs] = useState<string[]>([]);

  // 🎨 Generative visual vision states
  const [visionConcept, setVisionConcept] = useState('拉花特色咖啡');
  const [txt2ImgPromptText, setTxt2ImgPromptText] = useState('An artistic high-end ceramic espresso cup with clean patterns, over deep neutral cedar planks, natural afternoon rays');
  const [isVisualImageCreating, setIsVisualImageCreating] = useState(false);
  const [createdLabImg, setCreatedLabImg] = useState('');
  const [atelierProductTarget, setAtelierProductTarget] = useState('p1');
  const [selectedArtFilter, setSelectedArtFilter] = useState('黑金机能');
  const [isApplyingVibeFusing, setIsApplyingVibeFusing] = useState(false);
  const [fusedAestheticResult, setFusedAestheticResult] = useState('');
  const [isCopyExpertRunning, setIsCopyExpertRunning] = useState(false);
  const [selectedAtelierProduct, setSelectedAtelierProduct] = useState('p1');
  const [isCopyRewriting, setIsCopyRewriting] = useState(false);

  // Predefined gorgeous Unsplash themed stocks for rapid vision generation
  const AI_UNSPLASH_CATALOG: Record<string, string[]> = {
    '拉花特色咖啡': [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80'
    ],
    '赛博极客数码': [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
    ],
    '北欧藤编陈列': [
      'https://images.unsplash.com/photo-151351525088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80'
    ],
    '粉嫩猫咪周边': [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
    ],
    '原水茶道静修': [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80'
    ]
  };

  // Setup client Speech recognition if permissible at top level
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechAPIEngine = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechAPIEngine) {
        const recognitionIns = new SpeechAPIEngine();
        recognitionIns.continuous = false;
        recognitionIns.interimResults = false;
        recognitionIns.lang = 'zh-CN';

        recognitionIns.onstart = () => {
          setIsRecording(true);
        };
        recognitionIns.onend = () => {
          setIsRecording(false);
        };
        recognitionIns.onresult = (e: any) => {
          const spokenContent = e.results[0][0].transcript;
          if (spokenContent) {
            setRecSpeechText(spokenContent);
            onAddChatMessage?.(`🎤 [语音输入识别成功] "${spokenContent}"`);
          }
        };
        recognitionIns.onerror = (e: any) => {
          console.error("Mic speech recognition error:", e);
          setIsRecording(false);
        };
        setRecognition(recognitionIns);
      } else {
        setSpeechSupported(false);
      }
    }
  }, []);

  const handleVoiceRecordingTrigger = () => {
    if (!recognition) {
      // Simulate real translation trigger using random stylish speech cues
      const styleSpeeches = [
        "把风格改成黑金机能店",
        "添加一个日式原水抹茶壶，定价58元",
        "店名改叫：琥珀秋实手作甜品屋",
        "更换色相配色为冷淡北欧"
      ];
      const randomLine = styleSpeeches[Math.floor(Math.random() * styleSpeeches.length)];
      setRecSpeechText(randomLine);
      onAddChatMessage?.(`🎤 [语音模拟识别输入] "${randomLine}"`);
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      setRecSpeechText('');
      try {
        recognition.start();
      } catch (err) {
        console.warn("Could not start SpeechRecognition:", err);
      }
    }
  };

  const applyPhase1DNA = (dnaId: string) => {
    const updated = JSON.parse(JSON.stringify(schema));
    
    if (dnaId === 'amber-coffee') {
      updated.theme.styleType = 'warm';
      updated.theme.primaryColor = '#895129';
      updated.theme.accentColor = '#C19A6B';
      updated.theme.backgroundColor = '#FDFBF7';
      updated.theme.cardBgColor = '#FFFFFF';
      updated.theme.textColor = '#3E2723';
      updated.theme.fontFamily = 'serif';
      updated.theme.borderRadius = 'md';
      updated.logoStyle = 'serif';
      updated.shopName = "琥珀时光精品手工馆";
      updated.shopSlogan = "设计的温暖并非偶然，而是木石竹藤与真实光影印刻的写相。";
      onAddChatMessage?.("🧬 **【第一阶段：品牌基因投影成功】** 已注入「**琥珀时光暖木手作 DNA**」：\n- **色彩意蕴**: 暖茶褐、暖金奶油白\n- **字库配对**: 宋体/衬线配组 (Classic Serif)\n- **面距宽裕度**: 72px 呼吸感大留白，设计温润而高级。");
    } else if (dnaId === 'tokyo-matcha') {
      updated.theme.styleType = 'warm';
      updated.theme.primaryColor = '#3B533E';
      updated.theme.accentColor = '#A4996F';
      updated.theme.backgroundColor = '#F4F6F2';
      updated.theme.cardBgColor = '#FFFFFF';
      updated.theme.textColor = '#1C251D';
      updated.theme.fontFamily = 'serif';
      updated.theme.borderRadius = 'md';
      updated.logoStyle = 'serif';
      updated.shopName = "京都宇治·古木古茶庄";
      updated.shopSlogan = "一缕茶香，一嗅回甘。设计的克制，是回归材质原始状态下的朴素敬畏。";
      onAddChatMessage?.("🧬 **【第一阶段：品牌基因投影成功】** 已注入「**京都禅意国风茶道 DNA**」：\n- **色彩配组**: 青竹戴、茶黄、素白\n- **字库配对**: Playfair Serif 并提大幅留白\n- **框格系统**: 对称和风细墨规整对齐，静谧雅静。");
    } else if (dnaId === 'minimalist-linen-store') {
      updated.theme.styleType = 'minimal';
      updated.theme.primaryColor = '#18181B';
      updated.theme.accentColor = '#71717A';
      updated.theme.backgroundColor = '#FAFAFA';
      updated.theme.cardBgColor = '#FFFFFF';
      updated.theme.textColor = '#09090B';
      updated.theme.fontFamily = 'sans';
      updated.theme.borderRadius = 'none';
      updated.logoStyle = 'minimal';
      updated.shopName = "素白原质 · 极简北欧棉麻";
      updated.shopSlogan = "极窄边框、全透大气空气感大留白，剔除矫饰，回归面料天然的温柔触摸。";
      onAddChatMessage?.("🧬 **【第一阶段：品牌基因投影成功】** 已注入「**极简北欧素雅棉麻 DNA (国际一线美学)**」：\n- **色彩配租**: 纯高光雅白、深炭石墨黑\n- **卡骨重塑**: 无缝边线、大气折线无边框设计\n- **字库配对**: Sans-Serif (中性、现代、呼吸感大号字重)，空间悠久洗练。");
    } else if (dnaId === 'bento-tech-deck') {
      updated.theme.styleType = 'cyberpunk';
      updated.theme.primaryColor = '#6366F1';
      updated.theme.accentColor = '#10B981';
      updated.theme.backgroundColor = '#0A0A0C';
      updated.theme.cardBgColor = '#121216';
      updated.theme.textColor = '#E4E4E7';
      updated.theme.fontFamily = 'mono';
      updated.theme.borderRadius = 'sm';
      updated.logoStyle = 'mono';
      updated.shopName = "CYBER DECK 智能便当极客舱";
      updated.shopSlogan = "Bento Grid (便当盒) 二维矩阵严谨分割，极致的数字集成与效率美学。";
      onAddChatMessage?.("🧬 **【第一阶段：品牌基因投影成功】** 已注入「**Bento便当盒矩阵科技格 DNA**」：\n- **设计骨架**: 自适应黄金比例二维便当网格\n- **配色矩阵**: 深黑色暗调底衬搭配极光靛蓝与脉冲绿色，质感利落\n- **字组套件**: JetBrains Mono 等宽字，具有无与伦比的技术精密感。");
    } else if (dnaId === 'luxury-gold-motor') {
      updated.theme.styleType = 'luxury';
      updated.theme.primaryColor = '#D4AF37';
      updated.theme.accentColor = '#996515';
      updated.theme.backgroundColor = '#090909';
      updated.theme.cardBgColor = '#121212';
      updated.theme.textColor = '#F3F4F6';
      updated.theme.fontFamily = 'playfair';
      updated.theme.borderRadius = 'none';
      updated.logoStyle = 'playfair';
      updated.shopName = "NOIR GOLD 奢选重工机车派";
      updated.shopSlogan = "在极暗黑影大背景中注入拉丝琥珀金，用极致的戏剧性反差释放精英野趣。";
      onAddChatMessage?.("🧬 **【第一阶段：品牌基因投影成功】** 已注入「**奢华黑金机能重置 DNA**」：\n- **色彩配置**: 重度冷黑、拉丝抛光古铜金\n- **卡骨质感**: 直角重工、拉丝底面配细亮描线 (border-amber-500/15)\n- **情绪契合**: 精英复古衬线大标题，极强对比舞台剧张力，令人过目难忘。");
    }
    
    onChangeSchema(updated);
  };

  const runOpenClawOperation = () => {
    if (isAgentFlowRunning) return;
    setIsAgentFlowRunning(true);
    setAgentActiveIdx(0);
    
    const logs: string[] = [
      "👑 [Manager 星轨总控 - OpenClaw 协同核]：正在初始化全链品牌巡检。目标店铺「" + schema.shopName + "」",
      "👑 [Manager 星轨总控 - OpenClaw 协同核]：检测到高阶货盘运营指令。已激活 4 组智能体，目标：将全要素推升至【国际高端奢品级】并开启闭环自动运营..."
    ];
    setAgentStepLogs(logs);

    setTimeout(() => {
      setAgentActiveIdx(1);
      setAgentStepLogs(prev => [
        ...prev,
        "✍️ [Copywriter AIGC 首席文案]：正在重写整站名写与描述，剥离廉价网感，赋格奢牌意识修辞...",
        "✍️ [Copywriter AIGC 首席文案]：新标语升级 ➔ " + (schema.theme.styleType === 'luxury' ? "“时间的极限研磨，手作金属与速度的高阶融合。”" : "“物之本色，静水深流。抚平日常褶皱，回归生活应有的呼吸。”"),
        "✍️ [Copywriter AIGC 首席文案]：升维商品陈列，采用「精工材质 + 匠心古法」典藏散文式命名。"
      ]);
    }, 1300);

    setTimeout(() => {
      setAgentActiveIdx(2);
      setAgentStepLogs(prev => [
        ...prev,
        "🎨 [Designer 光影画坊]：开始重绘产品配图资产，连接 Unsplash 殿堂级精品目录...",
        "🎨 [Designer 光影画坊]：替换全线产品画报：一律采用「午后斜照切光」、「棉麻原胚」及「陶瓷冰裂」高级质感实景图...",
        "🎨 [Designer 光影画坊]：高还原度杂志级图片挂载，全站视觉张力瞬间升格 300%！"
      ]);
    }, 2600);

    setTimeout(() => {
      setAgentActiveIdx(3);
      setAgentStepLogs(prev => [
        ...prev,
        "📊 [Product MD 商品货盘专家]：智能核算货架体系与折扣系数自平衡策略...",
        "📊 [Product MD 商品货盘专家]：设计并上架了跨界限定孤品：「▎高定孤品 • 手工粗陶流沙极光艺术杯 (Amber Aurora Cup)」",
        "📊 [Product MD 商品货盘专家]：智能设定秒降价自平衡：售价 ¥198，并附带划线优惠 ¥298，折算促购系数，锁紧毛利空间..."
      ]);
    }, 3900);

    setTimeout(() => {
      setAgentActiveIdx(4);
      setAgentStepLogs(prev => [
        ...prev,
        "⚙️ [Architect 编译与部署专家]：智能合成 Meta Title、Schema.org 结构数据及 SiteMap 索引...",
        "⚙️ [Architect 编译与部署专家]：极速编译生产就绪包，安全部署发布至 Cloud Run 服务群与 Edge CDN 节点...",
        "🚀 [OpenClaw]：恭喜！国际店铺已自动全闭环发布上线！整店视觉、货盘、文案与SEO均已一键就绪！"
      ]);
    }, 5200);

    setTimeout(() => {
      setIsAgentFlowRunning(false);
      setAgentActiveIdx(-1);
      
      const updated = JSON.parse(JSON.stringify(schema));
      
      updated.shopSlogan = schema.theme.styleType === 'luxury' 
        ? "时间的极限研磨，手作金属与速度的高阶融合。" 
        : "物之本色，静水深流。抚平日常褶皱，回归生活应有的呼吸。";
      
      if (!updated.shopName.includes("• 一线高定")) {
        updated.shopName = updated.shopName + " • 一线高定";
      }

      const premiumPhotos = [
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
      ];

      updated.products.forEach((p: any, idx: number) => {
        p.image = premiumPhotos[idx % premiumPhotos.length];
        if (!p.name.includes("▎")) {
          p.name = "▎国际名作 • " + p.name;
        }
        p.originalPrice = Math.round(p.price * 1.4);
      });

      const specialId = "p_special_aurora";
      if (!updated.products.find((p: any) => p.id === specialId)) {
        updated.products.push({
          id: specialId,
          name: "▎高定典藏 • 琥珀秋实手作流沙极光艺术杯",
          price: 198,
          originalPrice: 298,
          description: "历经65天手胚制型，1300度高窑融凝极光流沙釉绘。每一只杯盏拥有绝不重复的绚丽冰曜纹，属于国度殿堂级艺术藏品。附尊属礼包纸盒包装。",
          image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80",
          category: "高定奢品限定"
        });

        const productsSection = updated.sections.find((s: any) => s.type === "products");
        if (productsSection) {
          productsSection.productIds = [specialId, ...(productsSection.productIds || [])];
        }
      }

      onChangeSchema(updated);

      onAddChatMessage?.("⚡ **【OpenClaw 自动运营执行完毕】** 店铺全资产要素已高成升维为**国际高端品牌名店**：\n- **文案增益**: 注入了文学质感的双语艺术修辞；\n- **视觉突变**: 所有货品配图一键升级为 Unsplash 特约实拍高定画报；\n- **货盘自建**: 自动新增名奢特供商品「琥珀秋实手工流沙极光艺术杯」并设定秒杀折扣；\n- **运维部署**: 编译站点索引并打包，已于云端 Cloud Run 高速缓存部署完成。");
    }, 6500);
  };

  // Auto scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || generating) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const starterTemplates = [
    { title: '北欧风精品咖啡馆', query: '做一个温馨质朴的北欧风手作精品咖啡店，主营单品手冲、燕麦特调咖啡和当天烘焙糕点。温暖色调。' },
    { title: '软萌猫咪好物铺', query: '设计一家可爱的马卡龙粉红猫咪萌宠用品馆。有柔软被铺、生肉冻干、猫咪罐头商品。' },
    { title: '黑金硬核数码专柜', query: '做一个炫酷黑金黑胶风格的智能数码店。主营金属快充配件、无线降噪耳机。' },
    { title: '素雅原木藤编家居', query: '做一个素雅中古风格的藤编原木家居陈列馆。主营手工编织单椅、中古大圆桌。' }
  ];

  return (
    <div className={`h-full flex flex-col border-r font-sans transition-colors duration-300 ${isMono ? 'bg-[#fcfcfc] text-zinc-900 border-zinc-200' : 'bg-zinc-950 text-zinc-350 border-zinc-850'}`}>
      
      {/* Brand Header */}
      <div className={`p-4 border-b flex items-center justify-between ${isMono ? 'border-zinc-200 bg-white' : 'border-zinc-850 bg-zinc-100/5 bg-zinc-950'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white shadow-md ${isMono ? 'bg-zinc-900' : 'bg-indigo-600 shadow-indigo-600/10'}`}>
            ✨
          </div>
          <div>
            <h1 className={`text-xs font-bold tracking-tight select-none ${isMono ? 'text-zinc-900' : 'text-zinc-100'}`}>
              AI 智能开店
            </h1>
            <p className={`text-[10px] ${isMono ? 'text-zinc-400' : 'text-zinc-500 font-medium'}`}>一句话构筑您的专属设计</p>
          </div>
        </div>
      </div>

      {/* Workspace Navigation Tabs Selector */}
      <div className={`flex border-b p-1 gap-1 ${isMono ? 'border-zinc-200 bg-zinc-100/50' : 'border-zinc-900 bg-zinc-950'}`}>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1 text-center font-bold rounded-md select-none transition-all cursor-pointer text-[10px] ${activeTab === 'chat' ? (isMono ? 'bg-zinc-900 text-white' : 'bg-indigo-600/90 text-white') : (isMono ? 'text-zinc-500 hover:text-zinc-800' : 'text-zinc-400 hover:text-zinc-200')}`}
        >
          💬 AI 客流对话
        </button>
        <button
          onClick={() => setActiveTab('drive')}
          className={`flex-1 py-1 text-center font-bold rounded-md select-none transition-all cursor-pointer text-[10px] ${activeTab === 'drive' ? (isMono ? 'bg-zinc-900 text-white' : 'bg-indigo-600/90 text-white') : (isMono ? 'text-zinc-500 hover:text-zinc-800' : 'text-zinc-400 hover:text-zinc-200')}`}
        >
          📂 Google Drive 仓
        </button>
        <button
          onClick={() => setActiveTab('vo')}
          className={`flex-1 py-1 text-center font-bold rounded-md select-none transition-all cursor-pointer text-[10px] ${activeTab === 'vo' ? (isMono ? 'bg-zinc-900 text-white' : 'bg-indigo-600/90 text-white') : (isMono ? 'text-zinc-500 hover:text-zinc-800' : 'text-zinc-400 hover:text-zinc-200')}`}
        >
          ⚙️ VO 品牌引擎仓
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {activeTab === 'chat' && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Messages Scroll Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className={`p-5 rounded-lg border leading-relaxed space-y-3.5 ${isMono ? 'bg-white border-zinc-200 text-zinc-650' : 'bg-zinc-900/60 border-zinc-850 text-zinc-400'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🛎️</span>
                    <span className={`font-bold text-xs ${isMono ? 'text-zinc-900' : 'text-zinc-100'}`}>欢迎进入 AI 双相自适应品牌空间</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    这是一套基于 <strong>Brand DNA (品牌文明本源) </strong> 与 <strong>Projection Intelligence (多端自适应投影)</strong> 双核引擎的 AI 生态级商用建店方案。
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    您可以在下方直接用简短的语言陈述您想要的主题调性，AI 会自动构筑相应的商品底盘、排版美学与品牌文体。
                  </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className={`flex flex-col space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[8px] text-zinc-500 font-semibold uppercase tracking-widest px-1">
                    {msg.sender === 'user' ? '💎 CUSTOMER' : '🤖 BRAND_ENGINE'}
                  </span>
                  <div className={`p-3 rounded-lg text-xs max-w-[90%] leading-relaxed ${
                    msg.sender === 'user'
                      ? (isMono ? 'bg-zinc-900 text-white rounded-tr-none' : 'bg-indigo-600 text-white rounded-tr-none')
                      : (isMono ? 'bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-tl-none' : 'bg-zinc-900 border border-zinc-850 text-zinc-100 rounded-tl-none')
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Starters */}
            {messages.length === 0 && (
              <div className="px-4 pb-2">
                <div className="text-[9px] text-zinc-500 mb-1.5 uppercase font-bold tracking-wider">🛎️ 挑选高定品牌起源DNA创意模板:</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {starterTemplates.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(item.query)}
                      className={`p-2 border text-left rounded-md transition-all select-none cursor-pointer hover:-translate-y-0.5 shadow-sm hover:shadow-md ${
                        isMono 
                          ? 'bg-white hover:bg-zinc-50 border-zinc-200 hover:border-zinc-400 text-zinc-700' 
                          : 'bg-zinc-900 border-zinc-850 hover:border-zinc-750 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-[9.5px] text-indigo-400">{item.title}</div>
                      <div className="text-[8px] text-zinc-500 line-clamp-2 mt-0.5 font-medium">{item.query}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-900">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={generating ? "AI正在编织品牌空间..." : "告诉我你想做个什么样的高端店铺..."}
                  disabled={generating}
                  className={`flex-1 text-xs rounded-md border p-2 focus:outline-hidden ${
                    isMono 
                      ? 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-500' 
                      : 'bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700 font-medium'
                  }`}
                />
                <button
                  type="submit"
                  disabled={generating || !inputValue.trim()}
                  className={`px-3 py-2 rounded-md font-bold text-white text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all ${
                    isMono ? 'bg-zinc-900 hover:bg-black' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Google Drive Cockpit */}
        {activeTab === 'drive' && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <GoogleDriveCockpit 
              schema={schema}
              onChangeSchema={onChangeSchema}
              onAddChatMessage={onAddChatMessage}
              workspaceSkin={workspaceSkin}
              onTriggerUIAction={onTriggerUIAction}
            />
          </div>
        )}

        {/* Tab 3: VO Brand Control Cockpit */}
        {activeTab === 'vo' && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Sub-tab selection menu */}
            <div className={`flex border-b overflow-x-auto pb-1 gap-1 px-3 ${isMono ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-900 bg-zinc-950'}`}>
              {[
                { id: 'dna', label: '🧬 Brand DNA' },
                { id: 'ui', label: '📦 UI Awareness' },
                { id: 'db', label: '🗄️ Database' },
                { id: 'agents', label: '🤖 Multi-Agents' },
                { id: 'lab', label: '🎨 Creative Lab' },
                { id: 'analytics', label: '📈 Diagnosis' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setVoSubTab(sub.id as any)}
                  className={`py-1.5 px-2 text-[9.5px] font-bold tracking-tight rounded-md select-none transition-all cursor-pointer whitespace-nowrap ${
                    voSubTab === sub.id 
                      ? (isMono ? 'bg-zinc-900 text-white' : 'bg-indigo-600 text-white') 
                      : (isMono ? 'text-zinc-500 hover:text-zinc-800' : 'text-zinc-400 hover:text-zinc-200')
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar min-h-0">
              {/* Sub-Tab 1: Brand DNA registry list view */}
              {voSubTab === 'dna' && (
                <div className="space-y-3 animate-fade-in text-xs">
                  <div className={`p-4 rounded-lg border leading-relaxed space-y-2.5 ${isMono ? 'bg-white border-zinc-200' : 'bg-zinc-900/60 border-zinc-850 text-zinc-400'}`}>
                    <span className="text-[10px] text-zinc-450 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1 animate-pulse text-indigo-400 select-none">
                      <Palette className="w-3.5 h-3.5" /> 品牌 DNA 活体细胞资源库 (Brand DNA Grid)
                    </span>
                    <p className="text-[9.5px] text-zinc-550 leading-normal">
                      我们坚信，高端品牌绝非来自随机的拼盘，而是高品质、深自洽的 **稳定 DNA**。在这里您可以直接唤醒特定的顶级模因系统，AI 将会自动把它们投影对齐到画布排版。
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(TEMPLATE_DNA_MAP).map(dna => (
                      <button
                        key={dna.templateId}
                        onClick={() => {
                          setSelectedDnaId(dna.templateId);
                          const updated = JSON.parse(JSON.stringify(schema));
                          updated.shopName = dna.name;
                          updated.shopSlogan = dna.mood;
                          updated.theme.borderRadius = dna.templateId === "minimalist-linen-store" ? "none" : (dna.templateId === "tokyo-matcha" ? "sm" : "md");
                          updated.theme.fontFamily = dna.typography.toLowerCase().includes("sans") ? "sans" : (dna.typography.toLowerCase().includes("mono") ? "mono" : "serif");
                          updated.theme.primaryColor = dna.colors.primary;
                          updated.theme.accentColor = dna.colors.accent;
                          updated.theme.backgroundColor = dna.colors.bg;
                          updated.theme.cardBgColor = dna.colors.card;
                          updated.theme.textColor = dna.colors.text;
                          updated.theme.styleType = dna.templateId === "amber-coffee" ? "warm" : (dna.templateId === "minimalist-linen-store" ? "minimal" : (dna.templateId === "tokyo-matcha" ? "retro" : (dna.templateId === "luxury-gold-motor" ? "luxury" : "cyberpunk")));
                          
                          // apply brand image
                          const heroIndex = updated.sections.findIndex((s: any) => s.type === "hero");
                          if (heroIndex !== -1) {
                            if (dna.templateId === "amber-coffee") {
                              updated.sections[heroIndex].backgroundImage = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80";
                              updated.sections[heroIndex].title = "琥珀时光 · 精品手作拼配";
                              updated.sections[heroIndex].subtitle = "一杯手冲瑰夏，重润都市慢生活的高奢序言";
                              updated.sections[heroIndex].content = "精心萃取、静候温香。我们执守 48h 恒温微流预发酵工艺，只为您唇边那一抹不可复制的柑橘茉莉清韵。";
                            } else if (dna.templateId === "tokyo-matcha") {
                              updated.sections[heroIndex].backgroundImage = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80";
                              updated.sections[heroIndex].title = "京都宇治 · 古木古野茶庄";
                              updated.sections[heroIndex].subtitle = "和香清气，素雅古制茶席时光";
                              updated.sections[heroIndex].content = "借一抹山岚松风，温一盏宋代禅茶。纯正手扫宇治顶选初绿，无垢素静，让心神重拾古典纯粹。";
                            } else if (dna.templateId === "minimalist-linen-store") {
                              updated.sections[heroIndex].backgroundImage = "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80";
                              updated.sections[heroIndex].title = "素白原胚 · 北欧极简生活馆";
                              updated.sections[heroIndex].subtitle = "天然无染，林间旷野呼吸麻织家居";
                              updated.sections[heroIndex].content = "摒弃繁琐，让感官归于无尘素白。甄选天然低韧棉、原胚初麻紧密缝梭，还原肌肤最本真纯净的包覆触感。";
                            } else if (dna.templateId === "bento-tech-deck") {
                              updated.sections[heroIndex].backgroundImage = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80";
                              updated.sections[heroIndex].title = "CYBER DECK 赛博极客舱";
                              updated.sections[heroIndex].subtitle = "纯净黑锋等宽矩阵，高能 AI 交互底牌";
                              updated.sections[heroIndex].content = "未来已至，掌间执裁。专为桌面极客量身设计的重骨多格 Bento 格局，霓虹脉冲点按回落响应，引燃生产力极限。";
                            } else if (dna.templateId === "luxury-gold-motor") {
                              updated.sections[heroIndex].backgroundImage = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80";
                              updated.sections[heroIndex].title = "黄金咆哮 · 烈火改装暗金舱";
                              updated.sections[heroIndex].subtitle = "定制哥特窄骨重机狂热实验室";
                              updated.sections[heroIndex].content = "重工业抛光齿轮，高贵暗金金属纹理，全手工打造独一无二的机车改装重器，冷光折射出至高权柄。";
                            }
                          }
                          onChangeSchema(updated);
                          onAddChatMessage?.(`⚡ [DNA 重组成功] 已成功唤醒宿主「${dna.name}」的品牌文明模因！色彩、比例圆角、排版韵律一键对齐投影部署完毕。`);
                        }}
                        className={`p-2.5 rounded-lg border-2 text-left transition-all relative select-none cursor-pointer hover:scale-[1.015] ${
                          selectedDnaId === dna.templateId
                            ? 'border-indigo-500 bg-indigo-500/5'
                            : (isMono ? 'bg-white border-zinc-200 hover:border-zinc-400' : 'bg-zinc-900 border-zinc-850 hover:border-zinc-750')
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-[10.5px] text-indigo-400 truncate max-w-[80%]">{dna.name}</span>
                          {selectedDnaId === dna.templateId && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </div>
                        <p className="text-[8px] text-zinc-500 line-clamp-2 leading-relaxed">{dna.mood}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-dashed border-zinc-800">
                          <span className="text-[7.5px] px-1 bg-zinc-950 text-zinc-400 rounded border border-zinc-850 truncate">{dna.industry}</span>
                          <span className="text-[7.5px] px-1 bg-zinc-950 text-[#A4996F] rounded border border-zinc-850 font-mono">DNA_ACTIVE</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: UI Awareness System */}
              {voSubTab === 'ui' && (
                <div className="space-y-3.5 animate-fade-in text-xs">
                  <div className={`p-3 rounded-lg border leading-relaxed space-y-2 ${isMono ? 'bg-white border-zinc-200' : 'bg-zinc-900/60 border-zinc-850 text-zinc-400'}`}>
                    <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold flex items-center gap-1.5 select-none animate-pulse">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" /> UI_AWARENESS 流态感知系统
                    </span>
                    <p className="text-[9.5px] text-zinc-500 leading-normal">
                      本舱负责暴露全店铺组件的生命周期事件与交互 API。您可以一键从左侧反向唤起前端的所有实体组件进行极速调校和开发。
                    </p>
                  </div>

                  <div className="space-y-2">
                    {Object.values(UI_AWARENESS_MAP).map(act => (
                      <div
                        key={act.id}
                        className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 ${
                          isMono ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-850 hover:border-zinc-750 transition-colors'
                        }`}
                      >
                        <div className="space-y-0.5 max-w-[70%]">
                          <span className="text-[10px] font-bold text-zinc-200 flex items-center gap-1">🎮 {act.label}</span>
                          <p className="text-[8px] leading-relaxed text-zinc-500">{act.description}</p>
                          <div className="font-mono text-[7px] text-zinc-550 break-all select-all flex gap-1.5 items-center bg-zinc-950/50 p-0.5 rounded border border-zinc-900">
                            <span className="text-zinc-500">HOOK:</span>
                            <span className="text-indigo-400">{act.action}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (onTriggerUIAction) {
                              onTriggerUIAction(act.id);
                              onAddChatMessage?.(`🎮 [自适应联动唤起] 已执行钩子「${act.action}」，反向在画布唤醒组件 【${act.component}】！`);
                            }
                          }}
                          className={`py-1 px-2.5 rounded-md font-bold text-white text-[9px] shadow-xs cursor-pointer select-none transition-transform hover:scale-[1.03] duration-150 ${
                            isMono ? 'bg-zinc-900 hover:bg-black' : 'bg-indigo-600 hover:bg-indigo-750'
                          }`}
                        >
                          唤起组件
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Tab 3: Database Awareness System */}
              {voSubTab === 'db' && (
                <div className="space-y-3.5 animate-fade-in text-xs">
                  <div className={`p-3 rounded-lg border leading-relaxed space-y-2 ${isMono ? 'bg-white border-zinc-200' : 'bg-zinc-900/60 border-zinc-850 text-zinc-400'}`}>
                    <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold flex items-center gap-1.5 select-none animate-pulse">
                      <Database className="w-3.5 h-3.5" /> 双向数据实体管理器 (Database Awareness Grid)
                    </span>
                    <p className="text-[9.5px] text-zinc-550 leading-normal">
                      本舱反映当前内存数据库 (Schema State) 的实时元数据字段规格。双向绑定，任意字段更改皆可实时渲染挂载。
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {Object.values(DB_AWARENESS_SCHEMA).map(table => {
                      let recs = 0;
                      if (table.id === 'products') recs = schema.products.length;
                      else if (table.id === 'sections') recs = schema.sections.length;
                      else if (table.id === 'theme') recs = 1;
                      else if (table.id === 'history') recs = history.length;

                      return (
                        <div
                          key={table.id}
                          className={`p-3 border rounded-lg ${
                            isMono ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-850'
                          }`}
                        >
                          <div className="flex justify-between items-center pb-1.5 border-b border-zinc-900 mb-2">
                            <span className="text-[10px] font-bold text-zinc-200">{table.name}</span>
                            <span className="text-[8px] px-1.5 py-0.5 bg-zinc-950 text-zinc-400 font-bold border border-zinc-850 rounded-sm">
                              RECORDS_COUNT: {recs}
                            </span>
                          </div>
                          
                          <div className="space-y-1 font-mono text-[8px] text-zinc-400">
                            {table.fields.map(f => (
                              <div key={f.name} className="flex justify-between items-start border-b border-zinc-850 border-dashed pb-0.5 hover:bg-zinc-950/10">
                                <span className={f.required ? "text-indigo-400 font-bold" : "text-zinc-550"}>
                                  {f.name} {f.required && "*"}
                                </span>
                                <div className="text-right space-y-0.5">
                                  <span className="text-[7.5px] text-[#A4996F]">{f.type}</span>
                                  <p className="text-[7.5px] text-zinc-500 select-none leading-none max-w-[12rem] truncate">{f.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-Tab 4: Multi-Agent Dynamic Operational Control */}
              {voSubTab === 'agents' && (
                <div className="space-y-3 animate-fade-in text-xs">
                  <div className={`p-3 rounded-lg border leading-relaxed space-y-2 ${isMono ? 'bg-white border-zinc-200' : 'bg-zinc-900/60 border-zinc-850 text-zinc-400'}`}>
                    <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold flex items-center gap-1.5 select-none animate-pulse">
                      <Bot className="w-3.5 h-3.5" /> 多智能体自编译运营控制舱 (Multi-Agents Operation)
                    </span>
                    <p className="text-[9.5px] text-zinc-550 leading-normal">
                      将一句话直接分派给宿主自适应运营集群：【Master品牌主管】牵头，协同【Copywriter文案助理】撰写高奢字词，协调【Designer设计师】重绘图像，交付【Analyst商业】设定吊牌促销价。一键完成店铺的高维自动进化。
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg space-y-2.5">
                    <div className="space-y-0.5">
                      <span className="text-[9.5px] text-zinc-500">输入下阶段运营方针 (Prompt):</span>
                      <textarea
                        value={agentPromptText}
                        onChange={(e) => setAgentPromptText(e.target.value)}
                        placeholder="创意暖木植造咖啡店，生成大师级文案并锁定毛利"
                        className="w-full h-11 bg-zinc-950 border border-zinc-850 rounded p-1 text-[9.5px] text-zinc-300 focus:outline-hidden font-mono leading-tight"
                      />
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 py-1 select-none">
                      {[
                        { label: 'Master(品牌)' },
                        { label: 'Copy(文体)' },
                        { label: 'Designer(视觉)' },
                        { label: 'Analyst(商业)' },
                        { label: 'Architect(双向)' }
                      ].map((ag, idx) => (
                        <div
                          key={idx}
                          className={`p-1 border rounded-md text-center text-[7.5px] flex flex-col items-center justify-center gap-0.5 transition-all ${
                            agentActiveIdx === idx 
                              ? 'bg-indigo-600 border-indigo-500 text-white font-bold scale-102 animate-pulse' 
                              : (isMono ? 'bg-white border-zinc-200 text-zinc-500' : 'bg-zinc-950 border-zinc-850 text-zinc-500')
                          }`}
                        >
                          <span>🤖 {ag.label}</span>
                          <span className={agentActiveIdx === idx ? 'text-white font-mono' : 'text-zinc-650'}>
                            {agentActiveIdx === idx ? '● RUN' : 'idle'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setIsAgentFlowRunning(true);
                        setAgentStepLogs([]);
                        setAgentActiveIdx(0);
                        setAgentStepLogs(["🛎️ [Master统筹] 正在唤醒 OpenClaw 自适应运营高频协作链路，深度阅读宿主 DNA..."]);
                        
                        setTimeout(() => {
                          setAgentActiveIdx(1);
                          setAgentStepLogs(prev => [...prev, "✍️ [Copy文案] 双语高品质文学修辞注入中，重撰 Sections/Products 核心品藻词..."]);
                        }, 350);

                        setTimeout(() => {
                          setAgentActiveIdx(2);
                          setAgentStepLogs(prev => [...prev, "🎨 [Designer视觉] 对接 Unsplash 高定精修底卷配图组，自适应装帧视觉组件结构与Banner图..."]);
                        }, 700);

                        setTimeout(() => {
                          setAgentActiveIdx(3);
                          setAgentStepLogs(prev => [...prev, "📊 [Analyst商业] 智能优化商品吊牌折扣及划线价格自平衡，锁紧利润边界..."]);
                        }, 1050);

                        setTimeout(() => {
                          setAgentActiveIdx(4);
                          setAgentStepLogs(prev => [...prev, "⚙️ [Architect架构] 底层 JSON 编译解析成功，开始双向热挂载到前端画布！"]);
                        }, 1400);

                        setTimeout(() => {
                          setIsAgentFlowRunning(false);
                          setAgentActiveIdx(-1);
                          setAgentStepLogs(prev => [...prev, "✅ [协同完成] 自适应运营架构指令链执行完毕，渲染引擎刷新成功！"]);
                          
                          // apply real modifications to schema matching user's text!
                          const updated = JSON.parse(JSON.stringify(schema));
                          
                          // SEO prefix names
                          updated.products.forEach((p: any, idx: number) => {
                            const prefixes = ["琥珀臻选 ·", "黑金奢野 ·", "手造极点 ·"];
                            const cleaned = p.name.replace(/^(琥珀臻选|黑金星野|黑金奢野|手造极点|原山手造|琥珀臻选)\s*·\s*/g, '');
                            p.name = `${prefixes[idx % prefixes.length]} ${cleaned}`;
                          });

                          // strike price
                          updated.products.forEach((p: any) => {
                            p.originalPrice = Math.round(p.price * 1.3) + 7;
                          });

                          // master copywriter descriptions match prompt
                          if (agentPromptText.includes("咖啡")) {
                            updated.shopName = "琥珀手造 · 特选极光咖啡店";
                            updated.shopSlogan = "手作烘焙瑰夏点亮秋日的星河微温";
                          } else if (agentPromptText.includes("机车") || agentPromptText.includes("黑金")) {
                            updated.shopName = "烈火定制 · 暗光黑金机车舱";
                            updated.shopSlogan = "哥特窄骨重机齿轮咆哮出金属贵权";
                          } else {
                            updated.shopName = "原山手造 · 多维品牌太空店";
                            updated.shopSlogan = "用微甜且质朴的艺术质感去重写未来店铺";
                          }

                          onChangeSchema(updated);
                          onAddChatMessage?.(`⚡ **【OpenClaw 多Agent自适应协作成功】** \n\n已执行方针方针：「${agentPromptText}」：\n\n- **Master** 重新定义商铺大格调；\n- **Copywriter** 大师级商品人文文学描述注入完毕；\n- **Designer** 配图调换及色彩氛围网格校正完毕；\n- **Analyst** 一键差价打折锁死利润、激增下单率！`);
                        }, 1750);
                      }}
                      disabled={isAgentFlowRunning || !agentPromptText.trim()}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md flex items-center justify-center gap-1 text-[10px] select-none cursor-pointer disabled:opacity-50 transition-all shadow-xs"
                    >
                      {isAgentFlowRunning ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>多智能体深度协同中...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>一键启动多Agent自编译流</span>
                        </>
                      )}
                    </button>
                  </div>

                  {agentStepLogs.length > 0 && (
                    <div className="p-2 bg-zinc-950 border border-zinc-850 rounded-md font-mono text-[8.5px] text-zinc-400 space-y-0.5 max-h-28 overflow-y-auto select-none custom-scrollbar leading-tight animate-fade-in">
                      {agentStepLogs.map((log, idx) => (
                        <div key={idx} className={log.includes("✅") ? 'text-emerald-400' : 'text-zinc-400'}>
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-Tab 5: AIGC Creative Vision Lab */}
              {voSubTab === 'lab' && (
            <div className="space-y-3.5 animate-fade-in text-xs">
              <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-400 select-none">
                  <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5 text-indigo-400" /> AIGC 创意文生图工坊</span>
                  <span className="text-[9px] text-[#A4996F] font-mono">TEXT_TO_IMG</span>
                </div>

                <div className="space-y-2">
                  <div className="space-y-0.5 text-[9.5px]">
                    <span className="text-zinc-500">挑选意境分类:</span>
                    <select
                      value={visionConcept}
                      onChange={(e) => {
                        setVisionConcept(e.target.value);
                        if (e.target.value === '拉花特色咖啡') setTxt2ImgPromptText('An artistic high-end ceramic espresso cup with clean patterns, over deep neutral cedar planks, natural afternoon rays');
                        if (e.target.value === '赛博极客数码') setTxt2ImgPromptText('Futuristic black mechanic desk layout with neon cyan lighting stripes, gaming mouse and charging docks close-up');
                        if (e.target.value === '北欧藤编陈列') setTxt2ImgPromptText('Warm cozy cream aesthetics linen chair under wooden hanger and plant pot gallery, soft shadows');
                        if (e.target.value === '粉嫩猫咪周边') setTxt2ImgPromptText('A cute soft pink plushy cat bed with cat food can packages next to it, pastel background');
                        if (e.target.value === '原水茶道静修') setTxt2ImgPromptText('An organic tea glass pot on stone brick plates with botanical garden plants around, zen vibe');
                      }}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-1 text-[9.5px] text-white focus:outline-hidden"
                    >
                      {Object.keys(AI_UNSPLASH_CATALOG).map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-0.5 text-[9.5px]">
                    <span className="text-zinc-500">艺术微排提示词 (Prompt):</span>
                    <textarea
                      value={txt2ImgPromptText}
                      onChange={(e) => setTxt2ImgPromptText(e.target.value)}
                      className="w-full h-11 bg-zinc-950 border border-zinc-850 rounded p-1 text-[9px] text-zinc-300 focus:outline-hidden font-mono leading-tight"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setIsVisualImageCreating(true);
                      setCreatedLabImg('');
                      setTimeout(() => {
                        setIsVisualImageCreating(false);
                        const list = AI_UNSPLASH_CATALOG[visionConcept] || AI_UNSPLASH_CATALOG['拉花特色咖啡'];
                        const url = list[Math.floor(Math.random() * list.length)];
                        setCreatedLabImg(url);
                        onAddChatMessage?.(`🎨 [AIGC文生图成功] 已利用视觉模型为您创作了贴合「${visionConcept}」艺术属性的高品质影像。`);
                      }, 1000);
                    }}
                    disabled={isVisualImageCreating || !txt2ImgPromptText.trim()}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded flex items-center justify-center gap-1 text-[10px] cursor-pointer disabled:opacity-50 select-none transition-all shadow-xs"
                  >
                    {isVisualImageCreating ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>正在像素渲染并生成意境中...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>开始 AI 创作文生图</span>
                      </>
                    )}
                  </button>
                </div>

                {createdLabImg && (
                  <div className="p-2 bg-zinc-950 border border-zinc-850 rounded-md select-none animate-fade-in space-y-2">
                    <img 
                      src={createdLabImg} 
                      alt="AIGC Result" 
                      referrerPolicy="no-referrer"
                      className="w-full h-24 object-cover rounded-md border border-zinc-850" 
                    />
                    
                    <div className="flex gap-1.5 text-[9px]">
                      <button
                        onClick={() => {
                          const updated = JSON.parse(JSON.stringify(schema));
                          const heroIndex = updated.sections.findIndex((s: any) => s.type === "hero");
                          if (heroIndex !== -1) {
                            updated.sections[heroIndex].backgroundImage = createdLabImg;
                            onChangeSchema(updated);
                            onAddChatMessage?.("🎨 [应用成功] 已一键配置该 AI 艺术画作为您的【商铺顶部首屏大 Banner 背景图】！");
                            setCreatedLabImg('');
                          }
                        }}
                        className="flex-1 py-1 rounded bg-zinc-900 border border-zinc-800 font-bold text-zinc-300 cursor-pointer text-center hover:text-white"
                      >
                        替换主页 Banner
                      </button>
                      <button
                        onClick={() => {
                          const updated = JSON.parse(JSON.stringify(schema));
                          const targetProd = updated.products.find((p: any) => p.id === atelierProductTarget);
                          if (targetProd) {
                            targetProd.image = createdLabImg;
                            onChangeSchema(updated);
                            onAddChatMessage?.(`🎨 [应用成功] 已将 AI 生成的配图一键应用至商品「${targetProd.name}」主卡片！`);
                            setCreatedLabImg('');
                          }
                        }}
                        className="flex-1 py-1 rounded bg-indigo-600 text-white font-bold cursor-pointer text-center shadow-xs hover:bg-indigo-750"
                      >
                        替换选定商品图
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-400 select-none">
                  <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-indigo-400" /> AI 创意图生图滤镜工坊</span>
                  <span className="text-[9px] text-[#A4996F] font-mono">IMG_TO_IMG</span>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div className="space-y-0.5">
                      <span className="text-zinc-500">挑选融合的商品:</span>
                      <select
                        value={atelierProductTarget}
                        onChange={(e) => setAtelierProductTarget(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded p-1 text-white focus:outline-hidden truncate"
                      >
                        {schema.products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-zinc-500">艺术风格融合滤镜:</span>
                      <select
                        value={selectedArtFilter}
                        onChange={(e) => setSelectedArtFilter(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded p-1 text-white focus:outline-hidden"
                      >
                        <option value="黑金机能">🕶️ 豪华暗黑机能</option>
                        <option value="日式素白">🌱 北欧极简素白</option>
                        <option value="粉红浪漫">💖 浪漫柔蜜梦幻</option>
                        <option value="和风禅意">🍵 原野静心禅意</option>
                        <option value="赛博朋克">⚡ 霓虹赛博狂飙</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsApplyingVibeFusing(true);
                      setFusedAestheticResult('');
                      setTimeout(() => {
                        setIsApplyingVibeFusing(false);
                        let finalUrl = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80';
                        if (selectedArtFilter === '黑金机能') finalUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80';
                        if (selectedArtFilter === '日式素白') finalUrl = 'https://images.unsplash.com/photo-151351525088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';
                        if (selectedArtFilter === '粉红浪漫') finalUrl = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80';
                        if (selectedArtFilter === '和风禅意') finalUrl = 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80';
                        if (selectedArtFilter === '赛博朋克') finalUrl = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80';
                        
                        setFusedAestheticResult(finalUrl);
                        onAddChatMessage?.(`🎨 [图生图融合成功] 已完成对所选产品的「${selectedArtFilter}」材质和调色盘深度重塑。`);
                      }, 950);
                    }}
                    disabled={isApplyingVibeFusing}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-md flex items-center justify-center gap-1 text-[10px] select-none cursor-pointer disabled:opacity-50 transition-all shadow-xs"
                  >
                    {isApplyingVibeFusing ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>AI 深度融合中...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>开始 AI 意境图生图</span>
                      </>
                    )}
                  </button>
                </div>

                {fusedAestheticResult && (
                  <div className="p-2 bg-zinc-950 border border-zinc-850 rounded-md select-none animate-fade-in space-y-2">
                    <img 
                      src={fusedAestheticResult} 
                      alt="Fused Result" 
                      referrerPolicy="no-referrer"
                      className="w-full h-22 object-cover rounded-md border border-zinc-850" 
                    />
                    <button
                      onClick={() => {
                        const updated = JSON.parse(JSON.stringify(schema));
                        const targetProd = updated.products.find((p: any) => p.id === atelierProductTarget);
                        if (targetProd) {
                          targetProd.image = fusedAestheticResult;
                          onChangeSchema(updated);
                          onAddChatMessage?.(`🎨 [图生图应用成功] 成功完成对「${targetProd.name}」的卡片意境图覆盖！`);
                          setFusedAestheticResult('');
                        }
                      }}
                      className="w-full py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] rounded transition-colors select-none cursor-pointer text-center shadow-xs"
                    >
                      替换选定商品配画
                    </button>
                  </div>
                )}
              </div>

              <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-405 select-none font-sans border-b border-zinc-900 pb-1.5">
                  <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5 text-indigo-400" /> AI 商品文案优化专家</span>
                  <span className="text-[9px] text-[#A4996F] font-mono">COPY_OPTIMIZER</span>
                </div>

                <div className="space-y-2 pt-1 font-sans">
                  <div className="space-y-0.5 text-[9.5px]">
                    <span className="text-zinc-500">挑选润色的目标商品:</span>
                    <select
                      value={selectedAtelierProduct}
                      onChange={(e) => setSelectedAtelierProduct(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-1 text-white focus:outline-hidden truncate"
                    >
                      {schema.products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setIsCopyRewriting(true);
                      setTimeout(() => {
                        setIsCopyRewriting(false);
                        const updated = JSON.parse(JSON.stringify(schema));
                        const targetProd = updated.products.find((p: any) => p.id === selectedAtelierProduct);
                        if (targetProd) {
                          const baseDescriptions: Record<string, string> = {
                            'p1': '采用阿拉比卡G1等级瑰夏咖啡豆，经冷置常温慢速发酵与48h双向微流滴滤萃取，茉莉香与百香果微酸纯净、醇厚深邃，犹如秋日第一缕温馨和煦的风。',
                            'p2': '选用原野有机生椰乳与天然燕麦草，伴有中度烘焙的原麦拼配豆。甘饴香滑，在唇齿间漾开温润、纯植物的极奢天香质感。',
                            'p3': '选用正宗日本宇治初绿抹茶粉，历经25次折叠毫米级工艺。抹茶茶气在轻薄淡乳香与板烤栗茸粉糯间得到轻柔调和，高雅而绝不甜腻。',
                            'p4': '采撷自南美耶加高海拔秘鲁庄园，经极低产量手工精细采收，焦糖清气奔放。在时间与风味的对白编撰里，温软唇边，留存长达上百秒的甘苦回味。'
                          };
                          const newDesc = baseDescriptions[targetProd.id] || "融合自然的纯粹原麦气味，倾注手作匠人的每一份真诚。入口即舒展出柔和纯净的微酸，将时光与艺术融于舌尖，这是无可复制的生活美学礼赞。";
                          targetProd.description = newDesc;
                          onChangeSchema(updated);
                          onAddChatMessage?.(`✍️ [AI文案大师撰写完成] 已对宿主商品「${targetProd.name}」的卡片描述进行了高奢文学重润：\n"${newDesc}"`);
                        }
                      }, 850);
                    }}
                    disabled={isCopyRewriting}
                    className="w-full py-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-400 font-bold rounded text-[10px] select-none cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1"
                  >
                    {isCopyRewriting ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                        <span>AI 大师正在撰写文案...</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-3.5 h-3.5 text-indigo-400" />
                        <span>大师级 AIGC 商品文案生成</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Sub-Tab 6: Autonomous Business Diagnostics & Optimization */}
          {voSubTab === 'analytics' && (
            <div className="space-y-3.5 animate-fade-in text-xs">
              {(() => {
                const descLenSum = schema.products.reduce((acc, p) => acc + p.description.length, 0);
                const hasSolidSlogan = schema.shopSlogan.length > 8;
                const matchesTheme = schema.theme.styleType !== 'legacy';
                const hasPromotionalPricing = schema.products.some(p => p.originalPrice && p.originalPrice > p.price);
                
                let score = 55;
                if (schema.products.length >= 4) score += 15;
                else score += schema.products.length * 3;
                if (hasSolidSlogan) score += 10;
                if (matchesTheme) score += 10;
                if (hasPromotionalPricing) score += 10;
                if (descLenSum > 60) score += 5;

                let ratingText = "及格资质 (运营尚可)";
                let ratingColor = "text-amber-500 border-amber-500/10 bg-amber-950/20";
                if (score >= 90) {
                  ratingText = "完美等级 (高阶一致性)";
                  ratingColor = "text-emerald-400 border-emerald-500/10 bg-emerald-950/20";
                } else if (score >= 80) {
                  ratingText = "优秀级 (极高商业潜能)";
                  ratingColor = "text-indigo-400 border-indigo-500/10 bg-indigo-950/20";
                }

                return (
                  <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg space-y-3">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-450 select-none border-b border-zinc-850 pb-2">
                      <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> AI 诊断自治商业分析评估</span>
                      <span className="text-[9px] text-[#A4996F] font-mono">INTELLIGENCE</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 rounded-full flex items-center justify-center border-2 border-indigo-600/30">
                        <span className="text-xl font-bold font-mono text-indigo-400">
                          {score}
                        </span>
                        <div className="absolute top-0 left-0 w-full h-full border-2 border-indigo-500 rounded-full animate-pulse opacity-10 scale-102"></div>
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <div className="text-[11px] font-bold text-zinc-200">
                          店铺 AI 运营体检：<span className="text-indigo-300 font-mono font-bold">{score}%</span>
                        </div>
                        <span className={`text-[8px] px-1.5 py-0.5 border rounded-sm font-semibold inline-block ${ratingColor}`}>
                          {ratingText}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 bg-zinc-950 border border-zinc-850 rounded-md space-y-1.5 text-[9px] font-sans">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">视觉搭配协调率:</span>
                        <span className="text-emerald-400 font-bold">100% 极契合</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">信息文字丰满度:</span>
                        <span className={descLenSum > 60 ? "text-indigo-400 font-bold" : "text-amber-500 font-bold"}>
                          {descLenSum > 60 ? "完备 (Perfect)" : "中等 (宜用AI续写)"}
                        </span>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-zinc-900 border-dashed">
                        <span className="text-zinc-500">商业高毛利转换率:</span>
                        <span className={hasPromotionalPricing ? "text-emerald-400 font-bold" : "text-rose-500 font-bold"}>
                          {hasPromotionalPricing ? "极高转化 (4.8%)" : "低价差无对比 (促购偏弱)"}
                        </span>
                      </div>
                      <div className="text-[8.5px] leading-relaxed text-zinc-550 text-zinc-500 font-mono italic">
                        诊断：文字及大图风格一致，无明显瑕疵。建议一键对宿主产品注入划线折扣以增加对买单用户的决策刺激！
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg space-y-2.5">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-400 select-none">
                  <span className="flex items-center gap-1.5"><BarChart2 className="w-3.5 h-3.5 text-indigo-400" /> AI 智能自治数据优化罗盘</span>
                  <span className="text-[9px] text-[#A4996F] font-mono">OPTIMIZER</span>
                </div>

                <div className="space-y-1.5 pt-0.5 font-sans">
                  
                  {/* Action 1: Title Optimizer */}
                  <div className="p-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-750 transition-colors rounded-lg flex items-start justify-between gap-1.5">
                    <div className="space-y-0.5 max-w-[70%]">
                      <span className="text-[9.5px] font-bold text-zinc-200">SEO 标题爆款重塑</span>
                      <p className="text-[8.5px] leading-normal text-zinc-500">一键重构所有产品名称，插入具有极高客流感召力的商业前缀词。</p>
                    </div>
                    <button
                      onClick={() => {
                        const updated = JSON.parse(JSON.stringify(schema));
                        const highEndPrefixes = ["琥珀臻选 ·", "黑金野逸 ·", "原山手造 ·", "特邀珍粹 ·", "冷置时空 ·"];
                        updated.products.forEach((p: any, idx: number) => {
                          const cleaned = p.name.replace(/^(琥珀臻选|黑金野逸|原山手造|特邀珍粹|冷置时空|定制)\s*·\s*/g, '');
                          const prefix = highEndPrefixes[idx % highEndPrefixes.length];
                          p.name = `${prefix} ${cleaned}`;
                        });
                        onChangeSchema(updated);
                        onAddChatMessage?.("📈 [SEO优化执行成功] 我们用本地大师级奢华前缀对您名下的商品进行了重命名署，视觉品质感跃增！");
                      }}
                      className="py-1 px-1.5 border border-indigo-500/20 bg-indigo-600 text-white text-[9px] font-semibold rounded cursor-pointer select-none"
                    >
                      <span>一键SEO</span>
                    </button>
                  </div>

                  {/* Action 2: Premium promotional strike prices */}
                  <div className="p-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-750 transition-colors rounded-lg flex items-start justify-between gap-1.5">
                    <div className="space-y-0.5 max-w-[70%]">
                      <span className="text-[9.5px] font-bold text-zinc-200">一键划线促销价</span>
                      <p className="text-[8.5px] leading-normal text-zinc-500">一键为所有产品注入自适应折算吊牌原价，创造 7.2 折高额刺激买单差价。</p>
                    </div>
                    <button
                      onClick={() => {
                        const updated = JSON.parse(JSON.stringify(schema));
                        updated.products.forEach((p: any) => {
                          p.originalPrice = Math.round(p.price * 1.3) + 7;
                        });
                        onChangeSchema(updated);
                        onAddChatMessage?.("📈 [促销价部署成功] 成功在商品库应用了自平衡吊牌折扣（售价约为原价的 7-8 折），大幅飙升买家下单意愿！");
                      }}
                      className="py-1 px-1.5 border border-indigo-500/20 bg-indigo-600 text-white text-[9px] font-semibold rounded cursor-pointer select-none"
                    >
                      <span>一键促销</span>
                    </button>
                  </div>

                  {/* Action 3: Balance Pricing indexes */}
                  <div className="p-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-750 transition-colors rounded-lg flex items-start justify-between gap-1.5">
                    <div className="space-y-0.5 max-w-[70%]">
                      <span className="text-[9.5px] font-bold text-zinc-200">AI 高利润锁频微调</span>
                      <p className="text-[8.5px] leading-normal text-zinc-500">自动分析当前零售底盘，将低门槛爆品毛利向上校对微调 15%，锁定更多盈利利润。</p>
                    </div>
                    <button
                      onClick={() => {
                        const updated = JSON.parse(JSON.stringify(schema));
                        updated.products.forEach((p: any) => {
                          if (p.price < 40) {
                            p.price = Math.round(p.price * 1.15);
                            if (p.originalPrice && p.originalPrice < p.price) {
                              p.originalPrice = Math.round(p.price * 1.4);
                            }
                          }
                        });
                        onChangeSchema(updated);
                        onAddChatMessage?.("📈 [利润微调自治成功] 成功对低于 40 元定价的产品进行毛利护盾校准（上调15%），极大提升店家净收益深度！");
                      }}
                      className="py-1 px-1.5 border border-indigo-500/20 bg-indigo-600 text-white text-[9px] font-semibold rounded cursor-pointer select-none"
                    >
                      <span>锁定利润</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
        </div>
      )}

      </div>

    </div>
  );
}
