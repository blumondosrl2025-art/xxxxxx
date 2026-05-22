import { StoreSchema } from '../types';

export const PREMIUM_TEMPLATES: { id: string; name: string; category: string; desc: string; previewColor: string; schema: StoreSchema }[] = [
  {
    id: "amber-coffee",
    name: "琥珀时光精品咖啡馆",
    category: "餐饮美食",
    desc: "暖木色调、香醇意境。适合手工烘焙、原木家居与慢生活咖啡屋。",
    previewColor: "#895129",
    schema: {
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
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "琥珀时光精品咖啡馆",
          subtitle: "手焙烘烤，精细萃取，在这里偷得浮生半日闲。",
          content: "我们在闹市深处为您寻觅一片属于烘焙豆香与木椅舒展的治愈空间。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "今日 · 臻选好物菜单",
          subtitle: "每周严选优质产地豆，由金牌咖啡师手工调和慢焙制作",
          productIds: ["p1", "p2", "p3"]
        },
        {
          id: "features",
          type: "features",
          title: "深植细节的品牌信念",
          items: [
            { id: "f1", title: "庄园直采生豆", description: "每一颗绿豆均自拉丁美洲与非洲精品庄园直航运达，成分纯正。", icon: "Layers" },
            { id: "f2", title: "凌晨手作烘焙", description: "专业烘焙坊每日凌晨现烤，绝不添加防腐辅料，口口鲜美。", icon: "Sparkles" }
          ]
        }
      ]
    }
  },
  {
    id: "tokyo-matcha",
    name: "京都宇治·古木古茶庄",
    category: "餐饮美食",
    desc: "静谧深森绿、温暖竹黄。适合高端国风茶道、日本抹茶及静心禅意空间。",
    previewColor: "#3B533E",
    schema: {
      shopName: "京都宇治·古木古茶庄",
      shopSlogan: "一盏苦尽，一嗅回甘，古木禅房茶烟细",
      logoText: "KYOTO MATCHA",
      logoStyle: "serif",
      theme: {
        primaryColor: "#3B533E",
        accentColor: "#A4996F",
        backgroundColor: "#F4F6F2",
        cardBgColor: "#FFFFFF",
        textColor: "#1C251D",
        fontFamily: "serif",
        styleType: "warm",
        borderRadius: "md"
      },
      navigation: [
        { label: "春分贡茶", anchor: "products" },
        { label: "古法制茶", anchor: "about" },
        { label: "老友品鉴", anchor: "testimonials" }
      ],
      products: [
        {
          id: "tm1",
          name: "手工石磨 · 特级宇治抹茶粉",
          price: 128,
          originalPrice: 158,
          description: "春季头采遮光玉露，古法花岗岩石磨，粉质极细腻，色泽翠绿。",
          image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
          category: "特级抹茶"
        },
        {
          id: "tm2",
          name: "日本手造 · 鸣野竹制茶筅",
          price: 58,
          originalPrice: 72,
          description: "传统工匠纯手工破竹劈丝，百本立规格，茶汤细腻击拂利器。",
          image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
          category: "茶道器具"
        },
        {
          id: "tm3",
          name: "古树沉香 · 御茶山岩骨大红袍",
          price: 260,
          originalPrice: 299,
          description: "武夷核心正岩，岩骨花香持久，浓醇果木炭焙焦香回味无极。",
          image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
          category: "高端散茶"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "一盏古色宇治茶，静心拂烦恼",
          subtitle: "慢下来，手捧古茶竹盏，体悟宋代点茶的静谧清澈。",
          content: "我们从京都百年有机茶田，将沾染朝露的初展嫩芽，虔诚打包，直送落座于喧嚣城市的您桌前。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "岁时臻选 · 茶中奇珍",
          productIds: ["tm1", "tm2", "tm3"]
        },
        {
          id: "testimonials",
          type: "testimonials",
          title: "茶客闲赋",
          items: [
            { id: "tt1", name: "苏曼女士", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", role: "茶艺专栏主笔", content: "茶粉非常翠绿，泡沫持久。点茶时香气瞬间溢出，是少有的好品质宇治。", rating: 5 }
          ]
        }
      ]
    }
  },
  {
    id: "luxury-gold-motor",
    name: "Noir Luxe 奢选极质机车馆",
    category: "出行运动",
    desc: "黑金奢华、玩味质感。适合豪车机车租赁展示、尊贵皮件与定制奢礼。",
    previewColor: "#C5A880",
    schema: {
      shopName: "Noir Luxe 奢选极质机车馆",
      shopSlogan: "唯极致，方自由。顶级野性与机械美学的黑金艺术。",
      logoText: "NOIR LUXE",
      logoStyle: "playfair",
      theme: {
        primaryColor: "#C5A880",
        accentColor: "#1C1C1E",
        backgroundColor: "#121212",
        cardBgColor: "#1C1C1E",
        textColor: "#E5E5E7",
        fontFamily: "playfair",
        styleType: "luxury",
        borderRadius: "none"
      },
      navigation: [
        { label: "奢华神兽", anchor: "products" },
        { label: "至尊定制", anchor: "about" },
        { label: "尊享会所", anchor: "contact" }
      ],
      products: [
        {
          id: "lm1",
          name: "Brough Superior · 顶级奢华纯手工重机",
          price: 52000,
          originalPrice: 65000,
          description: "航空级钛合金车架，全定制复古铆钉车身，全球限量珍藏纪念版。",
          image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
          category: "奢选神兽"
        },
        {
          id: "lm2",
          name: "阿根廷重磅植鞣革 · 骑士防摔战袍",
          price: 1880,
          originalPrice: 2280,
          description: "甄选4mm厚实天然重鞣牛皮，多重重压防摔碳纤护甲，尽显奢华光泽。",
          image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
          category: "皮件防摔"
        },
        {
          id: "lm3",
          name: "星空版全碳纤维防震降噪头盔",
          price: 980,
          originalPrice: 1200,
          description: "干式碳纤维编织车缝，超广角防起雾电镀金双镜盘，航天级风洞消音。",
          image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
          category: "安全护航"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "NOIR LUXE",
          subtitle: "黑金光影掠地，征服地平线的终极艺术。",
          content: "我们不提供工具，我们只为世界前1%的极致梦想注入令人血脉贲张的机械骨架。",
          alignment: "left"
        },
        {
          id: "products",
          type: "products",
          title: "极质列阵 · 唯快与重金属",
          productIds: ["lm1", "lm2", "lm3"]
        },
        {
          id: "about",
          type: "about",
          title: "骑士精神与百年手作执念",
          content: "每一台 Noir Luxe 出厂的精机，都要经历17位顶级英国工匠超过120小时的逐件调校、纯手工银丝拉光与发动机密合封装。我们将金属拉丝质感和古典黄金相碰撞，创造出这间将冷酷机械捧为极致权杖的先锋殿堂。",
          alignment: "right"
        }
      ]
    }
  },
  {
    id: "cyberpunk-hacker",
    name: "CYBER NET先锋黑客极客仓",
    category: "科技数码",
    desc: "未来霓虹、深色荧光。适合客制化键盘、数字潮玩与潮流黑客硬件配件。",
    previewColor: "#EC4899",
    schema: {
      shopName: "CYBER NET先锋黑客极客仓",
      shopSlogan: "CODE & NOISE // 黑客美学装备箱与未来硬件集成体",
      logoText: "CYBER_NET/",
      logoStyle: "mono",
      theme: {
        primaryColor: "#EC4899",
        accentColor: "#8B5CF6",
        backgroundColor: "#080B15",
        cardBgColor: "#111625",
        textColor: "#E2E8F0",
        fontFamily: "mono",
        styleType: "cyberpunk",
        borderRadius: "none"
      },
      navigation: [
        { label: "硬核外设", anchor: "products" },
        { label: "协议配置", anchor: "features" },
        { label: "暗网日志", anchor: "about" }
      ],
      products: [
        {
          id: "cb1",
          name: "NEON_84 客制化全铝发光磁轴键盘",
          price: 899,
          originalPrice: 1199,
          description: "CNC重铝阳极化外壳，0.1mm极速触发，霓虹混色背光，热插拔静音磁轴。",
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
          category: "硬核外设"
        },
        {
          id: "cb2",
          name: "CYBER_WATCH 塞伯腕戴掌上微型信息终端",
          price: 1599,
          originalPrice: 1999,
          description: "电子墨水副屏，搭载嵌入式Linux微系统，内置红外射频收发分析仪。",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
          category: "随身终端"
        },
        {
          id: "cb3",
          name: "暗黑几何 · 战术防辐射隐匿背包",
          price: 380,
          originalPrice: 480,
          description: "法拉第防盗追踪电磁屏蔽隔层，防水卡度拉高爆尼龙，磁吸特种快扣。",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
          category: "行装防护"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "CONNECTED // DECRYPTED",
          subtitle: "用荧光粉碎墨守成规。这是为您专门解开的先锋装备库。",
          content: "不要臣服于常规硅谷大厂的钝化设计。带上霓虹重装键盘，启动你的编译野心。",
          alignment: "left"
        },
        {
          id: "products",
          type: "products",
          title: "[ BATCH_LOAD / 今日首推 ]",
          productIds: ["cb1", "cb2", "cb3"]
        },
        {
          id: "features",
          type: "features",
          title: "SYSTEM_SPEC_SHEET",
          items: [
            { id: "cf1", title: "极速极客调试", description: "全系产品搭载开源系统固件，极易进行宏配置与定制固件刷机。", icon: "Cpu" },
            { id: "cf2", title: "暗黑防追踪外壳", description: "内置特有的抗强磁抗静电信号防护层，保护随时随地硬核信息安全。", icon: "Lock" }
          ]
        }
      ]
    }
  },
  {
    id: "bento-tech-deck",
    name: "CUBE 极简格子极核数码馆",
    category: "科技数码",
    desc: "Bento（高级格子）布局、高饱和 indigo 蓝白。适合极简设计控数码硬件与桌面美学。",
    previewColor: "#4F46E5",
    schema: {
      shopName: "CUBE 极简格子极核数码馆",
      shopSlogan: "用几何构建秩序。格子里的极简硬件美学。",
      logoText: "CUBE.STUDIO",
      logoStyle: "sans",
      theme: {
        primaryColor: "#4F46E5",
        accentColor: "#10B981",
        backgroundColor: "#F4F4F7",
        cardBgColor: "#FFFFFF",
        textColor: "#18181B",
        fontFamily: "grotesk",
        styleType: "bento",
        borderRadius: "lg"
      },
      navigation: [
        { label: "设计潮物", anchor: "products" },
        { label: "秩序信念", anchor: "features" },
        { label: "与我联系", anchor: "contact" }
      ],
      products: [
        {
          id: "bt1",
          name: "CUBE · 120W 氮化镓透明模块充电座",
          price: 199,
          originalPrice: 249,
          description: "可视化半透明玻璃PCB设计，多口智能分流屏显，仅拳头大小。",
          image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=600&q=80",
          category: "极客供能"
        },
        {
          id: "bt2",
          name: "不锈钢重力缓降静音卡片开箱器",
          price: 69,
          originalPrice: 89,
          description: "医用级钛金拉丝钢，特有重力双扣自锁滑动，可极简滑入钱包夹。",
          image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
          category: "随身好物"
        },
        {
          id: "bt3",
          name: "胡桃木磁吸桌面理线 Bento 收纳排",
          price: 120,
          originalPrice: 150,
          description: "北美严选FAS级黑胡桃，微磁强吸抗压槽理线，告别办公凌乱无序。",
          image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
          category: "桌面重整"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "几何积木，拼装未来",
          subtitle: "用秩序战胜凌乱。CUBE 为您搜寻世界极高美学系数的桌面玩物。",
          content: "我们抛弃一切繁冗的花边与装饰，尊崇包豪斯“功能即美”准则，打造让眼球绝对治愈的格子世界。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "桌面重整 · 核心陈列单品",
          productIds: ["bt1", "bt2", "bt3"]
        },
        {
          id: "features",
          type: "features",
          title: "极致规范保障",
          items: [
            { id: "bf1", title: "CNC严谨铣切", description: "全系几何极小金属表面均经历3小时机械冷切打磨，弧度和倒角极其贴手。", icon: "Activity" },
            { id: "bf2", title: "极质环保装配", description: "包装盒纯大豆油墨印刷可回收牛皮纸，对自然环境零负担无害。", icon: "Check" }
          ]
        }
      ]
    }
  },
  {
    id: "minimalist-linen-store",
    name: "素白简迹·麻织手工工坊",
    category: "服装配饰",
    desc: "极简素白、淡奶油灰色。适合高端设计师服饰、棉麻内衣、简朴家居美学。",
    previewColor: "#78716C",
    schema: {
      shopName: "素白简迹·麻织手工工坊",
      shopSlogan: "繁华落尽，回归布料最本质的温柔与呼吸",
      logoText: "SUBAI STUDIO",
      logoStyle: "sans",
      theme: {
        primaryColor: "#57534E",
        accentColor: "#D6D3D1",
        backgroundColor: "#FAF9F6",
        cardBgColor: "#FFFFFF",
        textColor: "#292524",
        fontFamily: "sans",
        styleType: "minimal",
        borderRadius: "sm"
      },
      navigation: [
        { label: "素织成衣", anchor: "products" },
        { label: "一针两线", anchor: "about" },
        { label: "素色足迹", anchor: "testimonials" }
      ],
      products: [
        {
          id: "sl1",
          name: "日式雨水灰手褶松紧带苎麻禅裤",
          price: 299,
          originalPrice: 388,
          description: "古法水洗100%老苎麻，舒适排汗，垂顺而带风，越洗越有风感质感。",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
          category: "夏日清凉"
        },
        {
          id: "sl2",
          name: "植物扎染 · 云雾蓝落肩中性开衫",
          price: 360,
          originalPrice: 450,
          description: "板蓝根野草古法发酵染缸，一衣一纹，手工一褶一褶染织起风骨。",
          image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80",
          category: "手染扎花"
        },
        {
          id: "sl3",
          name: "手工松木原木大号缝线双插针包针盒",
          price: 120,
          originalPrice: 160,
          description: "天然生漆涂抹松木收纳盒，内置多层大针插棉插，手缝制衣老友标配。",
          image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80",
          category: "手造工具"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "白素简迹",
          subtitle: "抚一抚麻布，聆听织女梭底的一声叹息。",
          content: "我们搜寻生长在江南溪水边的苎麻，古法晾干拧丝。它没有丝绸闪耀，却有着最体贴皮肤的骨相与空气感。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "大地肌理 · 原生衣服",
          productIds: ["sl1", "sl2", "sl3"]
        },
        {
          id: "about",
          type: "about",
          title: "我们为什么要穿麻布？",
          content: "在这个涤纶和化学面料横飞的产品泛滥时代，素织工坊始终坚持原产地木棉与苎麻采买。我们希望用温润的手染色和对地球无污染的回归，替每一位注重天然养生调和的主理人，打造能跟随着肌肤对话呼吸的第二层皮肤。",
          alignment: "left"
        }
      ]
    }
  },
  {
    id: "helsinki-nordic-chair",
    name: "Helsinki Vibe 北欧现代椅馆",
    category: "家居软装",
    desc: "斯堪的纳维亚冷白风、温暖爱马仕橙、极简大色块。适合建筑学硬核设计师家居。",
    previewColor: "#F97316",
    schema: {
      shopName: "Helsinki Vibe 北欧现代椅馆",
      shopSlogan: "家具不仅是坐姿，更是对空间尺度的谦逊测量",
      logoText: "H_VIBE",
      logoStyle: "sans",
      theme: {
        primaryColor: "#F97316",
        accentColor: "#1E293B",
        backgroundColor: "#F1F5F9",
        cardBgColor: "#FFFFFF",
        textColor: "#0F172A",
        fontFamily: "grotesk",
        styleType: "modern",
        borderRadius: "lg"
      },
      navigation: [
        { label: "设计椅集", anchor: "products" },
        { label: "空间哲学", anchor: "about" }
      ],
      products: [
        {
          id: "hc1",
          name: "FJORD · 弯曲胶合板大师极简手圈椅",
          price: 1899,
          originalPrice: 2400,
          description: "经典北欧水曲柳，千重高压曲木气弯工艺，符合人体脊柱黄金承托曲线。",
          image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80",
          category: "大师手作"
        },
        {
          id: "hc2",
          name: "Melted Glass 炫彩极光微缩茶几",
          price: 780,
          originalPrice: 990,
          description: "多色冷光炫彩钢化玻璃，随着自然日光转折折射出如北极天空般的多变色彩。",
          image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=600&q=80",
          category: "光感艺术"
        },
        {
          id: "hc3",
          name: "冰雪极光极白重力浇筑编织羊毛毯",
          price: 350,
          originalPrice: 420,
          description: "芬兰空运野生美利奴重磅粗毛，绝无化纤，冬日窝靠保暖绝配。",
          image: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=600&q=80",
          category: "羊毛软饰"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "Helsinki Vibe",
          subtitle: "在赫尔辛基的雪林，偷一抹柔光与沉思木轮廓。",
          content: "我们极尽克制抛去浮躁，用圆润弯折木和高饱和的色彩微粒暖场，照亮漫长的冬日，带给您真正的空间满足感。",
          alignment: "left"
        },
        {
          id: "products",
          type: "products",
          title: "今日陈设 · 空间主角",
          productIds: ["hc1", "hc2", "hc3"]
        }
      ]
    }
  },
  {
    id: "retro-vinyl-lounge",
    name: "银翼老派黑胶留声阁",
    category: "摄影影音",
    desc: "暖棕黄、原木褐。深色复古留声机、黑胶唱片与黑胶发烧友空间。",
    previewColor: "#D97706",
    schema: {
      shopName: "银翼老派黑胶留声阁",
      shopSlogan: "老唱机指针滑里的黄金时代与留声灰尘",
      logoText: "SILVER PIN",
      logoStyle: "mono",
      theme: {
        primaryColor: "#FBBF24",
        accentColor: "#78350F",
        backgroundColor: "#FAF4E8",
        cardBgColor: "#FFFFFF",
        textColor: "#1C1917",
        fontFamily: "mono",
        styleType: "retro",
        borderRadius: "none"
      },
      navigation: [
        { label: "绝版黑胶", anchor: "products" },
        { label: "声动故事", anchor: "about" }
      ],
      products: [
        {
          id: "rv1",
          name: "Retro-301 重力黄铜发烧级胆机唱片机",
          price: 3200,
          originalPrice: 3880,
          description: "定制手摇发条与真空电子二级管放大器，真正温暖原生态黑胶模拟空气声。",
          image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80",
          category: "老唱机"
        },
        {
          id: "rv2",
          name: "莫扎特 C大调安魂曲 限量初版翻造黑胶唱片",
          price: 180,
          originalPrice: 240,
          description: "维也纳古典爱乐乐团亲授权母盘压制，180克重磅纯黑色极高动态留声。",
          image: "https://images.unsplash.com/photo-1542208998-f6dbbb27a72f?auto=format&fit=crop&w=600&q=80",
          category: "金曲母带"
        },
        {
          id: "rv3",
          name: "日本手制抗静电纯马角黑胶防静电刷",
          price: 99,
          originalPrice: 130,
          description: "天然精选小马尾毛，防滑实木手柄，微尘彻底清扫，守护蓝宝石唱头。",
          image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80",
          category: "声能维护"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "旋转吧，沉寂的留声指针",
          subtitle: "在这个冰冷无损流媒体充斥的时代，我们怀念指尖触碰到粗粝盘沟时的战栗。",
          content: "老式真空管微光、马尾刷划过的静电呲呲响。指针和模拟胶盘，带您跨越时光直航上世纪黄金年代。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "昨日重现 · 旷世回响珍版",
          productIds: ["rv1", "rv2", "rv3"]
        }
      ]
    }
  },
  {
    id: "truffle-bistro",
    name: "TRUFFLE 黑松露法式小馆",
    category: "餐饮美食",
    desc: "极致哑光黑、深红葡萄酒醇、尊贵法式。适合法餐私厨、美酒庄园与米其林奢赏。",
    previewColor: "#1C1917",
    schema: {
      shopName: "TRUFFLE 黑松露法式小馆",
      shopSlogan: "盘中的每一滴奶油与松露，都是大自然最傲慢的叹息",
      logoText: "TRUFFLE.B",
      logoStyle: "serif",
      theme: {
        primaryColor: "#BE123C",
        accentColor: "#0F172A",
        backgroundColor: "#0C0A09",
        cardBgColor: "#1C1917",
        textColor: "#F5F5F4",
        fontFamily: "playfair",
        styleType: "luxury",
        borderRadius: "none"
      },
      navigation: [
        { label: "米其林臻奢", anchor: "products" },
        { label: "主厨私藏", anchor: "about" }
      ],
      products: [
        {
          id: "tf1",
          name: "顶级初熟 · 普罗旺斯野采新鲜黑松露",
          price: 1290,
          originalPrice: 1500,
          description: "主厨凌晨在南法橡树根部亲手刨挖，极高香气，干冰密封极速空运到厨房。",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
          category: "极品干货"
        },
        {
          id: "tf2",
          name: "Chateau Margaux 玛歌庄园经典2015干红",
          price: 6800,
          originalPrice: 8000,
          description: "波尔多五大名庄翘楚，馥郁紫罗兰花香与老烟草辛香，米其林品评至爱。",
          image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
          category: "年份名酿"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "La Casserole Chic",
          subtitle: "烛光冷艳，刀叉交响。我们在黑海般的奢华私密环境里，奉上普罗旺斯的野性松露。",
          content: "每一颗黑松露都像黑钻石般璀璨。由留法十年的金牌认证主厨亲手磨片，慢煲乳鸽，将黑奢风味诠释至极。",
          alignment: "left"
        },
        {
          id: "products",
          type: "products",
          title: "米其林大师 · 梦幻菜单",
          productIds: ["tf1", "tf2"]
        }
      ]
    }
  },
  {
    id: "wild-flora",
    name: "野趣森林·园艺温室",
    category: "园艺绿植",
    desc: "水洗泥土灰、天然苔藓绿。适合精品园艺绿植、苔藓微景观与生态多肉盆托。",
    previewColor: "#10B981",
    schema: {
      shopName: "野趣森林·园艺温室",
      shopSlogan: "泥土有温，草木多情，在石砖和苔藓里重构大自然的野性",
      logoText: "FLORA_WILD",
      logoStyle: "sans",
      theme: {
        primaryColor: "#047857",
        accentColor: "#D1FAE5",
        backgroundColor: "#F0F4F1",
        cardBgColor: "#FFFFFF",
        textColor: "#111827",
        fontFamily: "sans",
        styleType: "warm",
        borderRadius: "full"
      },
      navigation: [
        { label: "疗愈苔藓", anchor: "products" },
        { label: "温室日常", anchor: "about" }
      ],
      products: [
        {
          id: "wf1",
          name: "微观庭院 · 雨林古木高脚苔藓生态馆",
          price: 199,
          originalPrice: 240,
          description: "手造加粗进口高透玻璃，搭配白发藓、狼尾蕨与原生枯木，自建微生态圈。",
          image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=600&q=80",
          category: "生态瓶"
        },
        {
          id: "wf2",
          name: "园艺大师系列 · 铁制磨砂长嘴重力洒水壶",
          price: 110,
          originalPrice: 140,
          description: "不锈钢磨砂哑光墨绿漆面，超长22cm细嘴，浇灌多肉根部不伤枝叶。",
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
          category: "园艺工具"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "给水泥森林，还一片苔绿",
          subtitle: "用泥土和嫩植物亲手涂抹一片呼吸感桌角。这是大自然对您的温柔提醒。",
          content: "我们手刨肥沃的黑腐殖土，精选根系强壮的水培蕨类，把春天和松针香打包封入这方小气泡中。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "绿意萌芽 · 生机推荐",
          productIds: ["wf1", "wf2"]
        }
      ]
    }
  },
  {
    id: "stardust-fandom",
    name: "星尘太空科技未来仓",
    category: "科技数码",
    desc: "深邃太空蓝紫、星尘偏振、极客宇宙风。适合科幻周边、天文观测设备与独立设计师硬件。",
    previewColor: "#6366F1",
    schema: {
      shopName: "星尘太空科技未来仓",
      shopSlogan: "去太空，去繁星，用钛合金和暗色偏振丈量深不可测的静夜",
      logoText: "STARDUST",
      logoStyle: "mono",
      theme: {
        primaryColor: "#6366F1",
        accentColor: "#EC4899",
        backgroundColor: "#030014",
        cardBgColor: "#0C0728",
        textColor: "#E0E3FF",
        fontFamily: "mono",
        styleType: "cyberpunk",
        borderRadius: "lg"
      },
      navigation: [
        { label: "重装太空外设", anchor: "products" },
        { label: "航行协议", anchor: "about" }
      ],
      products: [
        {
          id: "sd1",
          name: "APOLLO · 航天钛合金磁阻无指针机械表",
          price: 4999,
          originalPrice: 5800,
          description: "陨石碎屑盘面，双磁悬浮圆钢滚珠代表时分交替，航天航空冷硬机身钛壳。",
          image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
          category: "星轨时计"
        },
        {
          id: "sd2",
          name: "月球表面 · 岩石质感折射光能磁吸小台灯",
          price: 320,
          originalPrice: 400,
          description: "纯天然火山浮石打磨陨坑，超柔呼吸昏暗浅橙偏振，模拟阿波罗登陆月壤微光。",
          image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
          category: "氛围灯饰"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "STARDUST APPARATUS",
          subtitle: "我们是星尘的一部分。这是一封寄给猎户座尾翼星云的钛合金硬派回书。",
          content: "打破乏味地球外设。带上带有陨石切片的机械装置，去黑夜深处丈量太空深度与引力涟漪。",
          alignment: "left"
        },
        {
          id: "products",
          type: "products",
          title: "太空深空 · 发射倒计时",
          productIds: ["sd1", "sd2"]
        }
      ]
    }
  },
  {
    id: "cat-bakery",
    name: "喵小烘·猫咪主题烘焙坊",
    category: "宠物生活",
    desc: "婴儿粉红、奶呼黄色、圆润倒角。适合猫狗主粮零食、爱宠手工糕点与少女风宠物沙龙。",
    previewColor: "#F43F5E",
    schema: {
      shopName: "喵小烘·猫咪主题烘焙坊",
      shopSlogan: "一口满嘴肉肉，爱宠摇尾赞美。手作无添加健康猫猫小面点",
      logoText: "MEOW BAKERY",
      logoStyle: "sans",
      theme: {
        primaryColor: "#F43F5E",
        accentColor: "#FCD34D",
        backgroundColor: "#FFF8F6",
        cardBgColor: "#FFFFFF",
        textColor: "#5C3E35",
        fontFamily: "sans",
        styleType: "warm",
        borderRadius: "full"
      },
      navigation: [
        { label: "鲜肉点心", anchor: "products" },
        { label: "猫咪评测", anchor: "testimonials" }
      ],
      products: [
        {
          id: "cbk1",
          name: "冻干兔肉草莓猫爪果子 (10只入)",
          price: 49,
          originalPrice: 65,
          description: "整只鲜兔肉打浆压指，灌注草莓麦草纤维粉，低温真冷冻干。萌宠爱到疯狂挠爪爪。",
          image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
          category: "手作冻干"
        },
        {
          id: "cbk2",
          name: "手工风干深海大西洋鲜鳕鱼小芝士卷",
          price: 58,
          originalPrice: 75,
          description: "纯正鲜鳕鱼低温长风干24小时，缠绕无乳糖高钙原味乳酪，高维高蛋白大餐。",
          image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80",
          category: "海鲜芝士"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "欢迎光临喵小烘甜甜温室！",
          subtitle: "我们坚信，宝贝猫猫狗狗和我们一样，值得拥有一份热烘烘无糖无防腐的纯鲜肉爪爪下午茶。",
          content: "大块去骨白肉、野生秋刀鱼、极高膳食叶绿素。用烘制人类宝宝的高档烤箱精心定温，让喵主子口口爆香满格元气！",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "汪喵口水直流 · 主推点心",
          productIds: ["cbk1", "cbk2"]
        }
      ]
    }
  },
  {
    id: "swiss-horology",
    name: "Independent Dial 独立制表大师馆",
    category: "服装配饰",
    desc: "极致古典白、宝蓝色细节、精密包豪斯轴格。适合瑞士奢表、精工机械与高端金属挂件。",
    previewColor: "#3B82F6",
    schema: {
      shopName: "Independent Dial 独立制表大师馆",
      shopSlogan: "不追逐浮夸。精钢与游丝交错的永恒微弱心跳声。",
      logoText: "CHRONO.SWISS",
      logoStyle: "serif",
      theme: {
        primaryColor: "#2563EB",
        accentColor: "#F8FAFC",
        backgroundColor: "#FFFFFF",
        cardBgColor: "#F1F5F9",
        textColor: "#0F172A",
        fontFamily: "serif",
        styleType: "minimal",
        borderRadius: "none"
      },
      navigation: [
        { label: "精工艺术机芯", anchor: "products" },
        { label: "时间工艺", anchor: "about" }
      ],
      products: [
        {
          id: "sw1",
          name: "Calibre-12 镂空微摆陀自绕弦精钢表",
          price: 18000,
          originalPrice: 22000,
          description: "18K白金偏心陀，桥型夹板细沙抛光，双向微幅擒纵，尊显内敛精密。",
          image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
          category: "陀飞轮"
        },
        {
          id: "sw2",
          name: "古典珐琅 · 宝蓝烧高热度淬火手工钢针表",
          price: 8500,
          originalPrice: 11000,
          description: "在800度高温炭烤中完美均匀淬火形成宝石级皇家宝蓝蓝钢双指针，复古优雅。",
          image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80",
          category: "正装珐琅"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "PRECISION AND SOUL",
          subtitle: "齿轮咬合、游丝微震。我们坚持最古老的三指夹板，拒绝嘈杂微芯片。",
          content: "两片蓝宝石玻璃，把跨越百年的重力齿轮魔法牢牢镶嵌在手腕内测。感受古老手工艺对无垠时间的精准捕杀。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "永动机芯 · 朝圣列阵",
          productIds: ["sw1", "sw2"]
        }
      ]
    }
  },
  {
    id: "sicilian-leather",
    name: "Sicilian Vesper 意式皮革工坊",
    category: "服装配饰",
    desc: "油亮马鞍棕黄色、深沉复古墨绿。适合高端手工定制皮鞋、手工包袋与奢饰鞍件。",
    previewColor: "#B45309",
    schema: {
      shopName: "Sicilian Vesper 意式皮革工坊",
      shopSlogan: "岁月的吻痕，皮包上的油脂与古老佛罗伦萨铜扣",
      logoText: "SICILY_LEATHER",
      logoStyle: "serif",
      theme: {
        primaryColor: "#92400E",
        accentColor: "#D97706",
        backgroundColor: "#FAF7F2",
        cardBgColor: "#FFFFFF",
        textColor: "#271B11",
        fontFamily: "serif",
        styleType: "warm",
        borderRadius: "sm"
      },
      navigation: [
        { label: "植鞣马鞍", anchor: "products" },
        { label: "擦色艺术", anchor: "about" }
      ],
      products: [
        {
          id: "slb1",
          name: "阿根廷重质植鞣牛皮托特旅行包",
          price: 1399,
          originalPrice: 1750,
          description: "整张4mm马鞍级牛皮纯乳黄蜡线双针手穿。天然油脂饱满，越用越温润发亮。",
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=605&q=80",
          category: "大容量托特"
        },
        {
          id: "slb2",
          name: "意大利古法老匠手工擦染撞色双扣僧侣鞋",
          price: 1850,
          originalPrice: 2200,
          description: "固特异手绱工艺，头层公牛胚皮由鞋匠师傅面刷六层咖啡撞色，流露时光质地。",
          image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80",
          category: "大师皮鞋"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "在西西里皮革作坊，听皮响锤落",
          subtitle: "我们拒绝机械冷冰冰裁剪流水线。每一张牛皮，都要经历数月栗壳野果汁液的天然鞣制与擦蜡保护。",
          content: "我们手捧蜂蜡，手工擦润每一条双拉针孔。当您带上它走过狂乱都市与四季，阳光和手温会吻出独一无二的焦糖色琥珀光泽。",
          alignment: "left"
        },
        {
          id: "products",
          type: "products",
          title: "匠心传承 · 回甘佳作",
          productIds: ["slb1", "slb2"]
        }
      ]
    }
  },
  {
    id: "eco-nurseries",
    name: "Verdant House 芬翠森系多肉绿洲",
    category: "园艺绿植",
    desc: "轻呼吸浅松石、柔和白。适合绿植微小森林、手作多肉、空气凤梨及慢活极简疗愈家。",
    previewColor: "#059669",
    schema: {
      shopName: "Verdant House 芬翠生态植圃",
      shopSlogan: "给浮躁的白领日常，赠送一颗不娇气的小仙人球和泥土香",
      logoText: "VERDANT_H",
      logoStyle: "sans",
      theme: {
        primaryColor: "#059669",
        accentColor: "#A7F3D0",
        backgroundColor: "#F7FAF8",
        cardBgColor: "#FFFFFF",
        textColor: "#1F2937",
        fontFamily: "sans",
        styleType: "minimal",
        borderRadius: "lg"
      },
      navigation: [
        { label: "空气凤梨", anchor: "products" },
        { label: "常客答疑", anchor: "faq" }
      ],
      products: [
        {
          id: "ec1",
          name: "巴西百年巨无霸高树形空气凤梨霸王",
          price: 258,
          originalPrice: 320,
          description: "无需土培，半月微喷细雾即可茁壮舒展。微曲冷灰绿叶，宛如荒原巨兽，高级感拉满。",
          image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
          category: "懒人植选"
        },
        {
          id: "ec2",
          name: "手工白砂陶重力质感红陶仙人球盆拼",
          price: 139,
          originalPrice: 180,
          description: "多孔呼气天然粗陶盆装，配火山碎屑砂吸水，高冷防刺观赏刺球，净化桌面重灾区。",
          image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80",
          category: "硬壳多肉"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "Verdant House",
          subtitle: "在这里，空气是香甜的。让我们用两株无需频繁照看的强壮蕨类，重新撑起办公室的小呼吸圈。",
          content: "我们极度爱惜泥土天然气孔，并附带最贴心的长嘴浇灌说明让每颗植物新手都能感受到养育春天的快乐。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "翠绿日常 · 一键养护",
          productIds: ["ec1", "ec2"]
        }
      ]
    }
  },
  {
    id: "streetwear-bold",
    name: "OUTSIDER 先锋无界街头服圈",
    category: "服装配饰",
    desc: "赛博霓虹粉、硬派极黑。适合重磅帽衫、先锋街潮配件、滑板装备等。",
    previewColor: "#F43F5E",
    schema: {
      shopName: "OUTSIDER 先锋无界街头服圈",
      shopSlogan: "不甘被定义的灵魂，重金属工业印染与不妥协的重磅棉衫",
      logoText: "OUT_SIDER",
      logoStyle: "mono",
      theme: {
        primaryColor: "#E11D48",
        accentColor: "#F43F5E",
        backgroundColor: "#0F172A",
        cardBgColor: "#1E293B",
        textColor: "#F8FAFC",
        fontFamily: "mono",
        styleType: "cyberpunk",
        borderRadius: "none"
      },
      navigation: [
        { label: "重磅版型", anchor: "products" },
        { label: "老派街区", anchor: "about" }
      ],
      products: [
        {
          id: "st1",
          name: "460g 重磅美式双股精梳棉落肩黑金卫衣",
          price: 320,
          originalPrice: 420,
          description: "超重克高密度机织布，硬挺抗变形，后幅手缝钢印朋克骷髅拉丝压胶，街潮炸街神器。",
          image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
          category: "重装卫衣"
        },
        {
          id: "st2",
          name: "先锋极黑发光磁力扣特种街头防水工装裤",
          price: 360,
          originalPrice: 480,
          description: "内置Fidlock德国磁扣战术，多功能三防面料防雨泥刮，暗黑几何剪裁极致修身。",
          image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
          category: "战术长裤"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "OUTSIDER STREET LAB",
          subtitle: "别废话。穿上重装，踩上滑板，像流星般去征服不属于任何规则的寂静柏油马路。",
          content: "摒弃温吞。我们从冷冰冰的暗色涂鸦和反叛机能结构中提炼精髓，创造专为今夜街头不服灵魂武装的极致铠甲。",
          alignment: "left"
        },
        {
          id: "products",
          type: "products",
          title: "狂野战备 · 尖叫首发",
          productIds: ["st1", "st2"]
        }
      ]
    }
  },
  {
    id: "gourmet-chocolatier",
    name: "CACAO ART 奢美黑巧烘热铺",
    category: "餐饮美食",
    desc: "奢贵可可深棕色、奶油香槟色金。适合手做巧克力拼盘、法式高端意式意境礼盒。",
    previewColor: "#7c2d12",
    schema: {
      shopName: "CACAO ART 奢美黑巧烘热铺",
      shopSlogan: "手作纯白可可，口中爆汁苦涩后的火山回甘奇遇记",
      logoText: "CACAO_ART",
      logoStyle: "serif",
      theme: {
        primaryColor: "#7c2d12",
        accentColor: "#fed7aa",
        backgroundColor: "#fffbeb",
        cardBgColor: "#ffffff",
        textColor: "#431407",
        fontFamily: "serif",
        styleType: "warm",
        borderRadius: "md"
      },
      navigation: [
        { label: "黑巧奇珍", anchor: "products" },
        { label: "巧匠密调", anchor: "about" }
      ],
      products: [
        {
          id: "ch1",
          name: "75%单源危地马拉炭烤海盐黑巧盘筒",
          price: 139,
          originalPrice: 180,
          description: "单产区庄园可可豆，橡木炭慢焙，点缀微咸手刨雨海盐。入口前苦中焦，优雅回甘溢乳。",
          image: "https://images.unsplash.com/photo-1549007994-cb92caeb54bd?auto=format&fit=crop&w=600&q=80",
          category: "单源黑巧"
        },
        {
          id: "ch2",
          name: "奢华金箔黑真菌辣味松露巧克力大礼盒",
          price: 299,
          originalPrice: 380,
          description: "创新微酸粉红辣椒分子与顶级牛肝菌汁揉入甘纳许夹心，顶覆手贴纯金箔叶。",
          image: "https://images.unsplash.com/photo-1548907040-4d42b52145ca?auto=format&fit=crop&w=600&q=80",
          category: "创意松露"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "让每一块巧克力，都落成诗篇",
          subtitle: "我们拒绝油脂代可可。纯正大块野生有机黑可可脂在37度人类舌尖巧融的丝滑魔法。",
          content: "我们深入南美丛林搜集长在石岩上的原产豆，采用48小时古石磨低速慢磨研，只为您那一口无可取代的奢华欢愉。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "可可拼盘 · 主力推荐",
          productIds: ["ch1", "ch2"]
        }
      ]
    }
  },
  {
    id: "premium-silver-jewellery",
    name: "Melted Silver 精雕白银金工坊",
    category: "服装配饰",
    desc: "液态银、哑光冷灰、重工肌理。适合重工纹锤白银、熔岩戒指及硬核原石项链手饰。",
    previewColor: "#6B7280",
    schema: {
      shopName: "Melted Silver 精雕白银金工坊",
      shopSlogan: "熔岩火里淬炼，液态流动的无界金工雕琢史",
      logoText: "MELTED_SI",
      logoStyle: "mono",
      theme: {
        primaryColor: "#4B5563",
        accentColor: "#F3F4F6",
        backgroundColor: "#030712",
        cardBgColor: "#111827",
        textColor: "#F9FAFB",
        fontFamily: "mono",
        styleType: "cyberpunk",
        borderRadius: "none"
      },
      navigation: [
        { label: "熔渣指环", anchor: "products" },
        { label: "捶打细节", anchor: "features" }
      ],
      products: [
        {
          id: "sj1",
          name: "S925 纯硬白银 · 陨落熔岩重度拉纹指环",
          price: 360,
          originalPrice: 450,
          description: "人工高温喷枪煅烧，液态淬冷形成独特熔融表面，一指成型，佩戴尽带古老冷俊美感。",
          image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
          category: "重质指环"
        },
        {
          id: "sj2",
          name: "古铜矿生原石陨铁电镀复古项链托重坠",
          price: 450,
          originalPrice: 580,
          description: "不拆解、不雕凿。精选原产火山铜钛晶簇原石以古银电镀包裹吊挂，粗野之美极致爆发。",
          image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
          category: "原石吊坠"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "熔融银汁，冷却骨气",
          subtitle: "我们不喜爱珠宝商整齐划一的平滑。坚持不修边幅的重金属原岩捶击打。让白银在熔炼火枪中爆发它原始的流火褶皱。",
          content: "老旧佛罗伦萨老作坊匠人纯手工，每一件金属氧化斑驳的背后均不可复制。在胸前在指尖，安放不言不语的粗犷重金属执念。",
          alignment: "left"
        },
        {
          id: "products",
          type: "products",
          title: "岩骨流星 · 先锋挂配",
          productIds: ["sj1", "sj2"]
        }
      ]
    }
  },
  {
    id: "artisanal-sake",
    name: "一念醉·古法酵母纯米吟酿馆",
    category: "餐饮美食",
    desc: "水稻金黄、静谧白青。适合高端清酒体验酒馆、高宿精米私藏、艺术国风佐酒器皿。",
    previewColor: "#D97706",
    schema: {
      shopName: "一念醉·古法酵母纯米吟酿馆",
      shopSlogan: "精米步合，长夜深井。用两百年酵母封藏江南晨秋宿雨",
      logoText: "SAKE_ONCE",
      logoStyle: "serif",
      theme: {
        primaryColor: "#0F172A",
        accentColor: "#E2E8F0",
        backgroundColor: "#FAF9F5",
        cardBgColor: "#FFFFFF",
        textColor: "#1E293B",
        fontFamily: "serif",
        styleType: "warm",
        borderRadius: "md"
      },
      navigation: [
        { label: "大吟酿藏", anchor: "products" },
        { label: "酒坊清泉", anchor: "about" }
      ],
      products: [
        {
          id: "sk1",
          name: "精米步合35% · 重磅手造纯米大吟酿 (720ml)",
          price: 680,
          originalPrice: 850,
          description: "严选“山田锦”米王心腹，深山冰川初雪冰融泉水慢酿。带清新苹果与白洋槐香蜜气。",
          image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
          category: "绝品大吟"
        },
        {
          id: "sk2",
          name: "锤目纹冰蓝渐变手工水晶清酒壶杯套组",
          price: 220,
          originalPrice: 280,
          description: "老匠铁槌千锤百打形成锤击水滴波光，凹陷冰蓝底承装冰镇烈清酒，光影极其夺目。",
          image: "https://images.unsplash.com/photo-1579006004550-51152a13ccac?auto=format&fit=crop&w=600&q=80",
          category: "佐膳酒器"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "一念倾心，半生宿微醺",
          subtitle: "我们坚守古法手工“槽绞”压滤工艺。一瓶清酒的诞生，要经历一百二十天寒冬长夜在杉木桶下的静谧磨砺发酵。",
          content: "摒弃工业二氧化碳气罐催发。大口滑下，清澈醇柔，微香清雅甜香如山间冰雨。邀上知己一二，共酌今宵星轨。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "深夜酒池 · 梦回大吟",
          productIds: ["sk1", "sk2"]
        }
      ]
    }
  },
  {
    id: "fine-scent",
    name: "本草微芒·植萃精油小铺",
    category: "美容美体",
    desc: "轻草本鼠尾草绿、云松灰土色。适合植物调合沙龙精油、奢香古龙香氛与高端养颜石膏块。",
    previewColor: "#10B981",
    schema: {
      shopName: "本草微芒·植萃精油小铺",
      shopSlogan: "揉碎一片罗勒叶，把整个微雨森林湿泥装入小棕滴管里",
      logoText: "HERBAL_DROP",
      logoStyle: "serif",
      theme: {
        primaryColor: "#059669",
        accentColor: "#E0F2FE",
        backgroundColor: "#FAFBF9",
        cardBgColor: "#FFFFFF",
        textColor: "#2B3C2A",
        fontFamily: "serif",
        styleType: "warm",
        borderRadius: "full"
      },
      navigation: [
        { label: "微滴秘炼", anchor: "products" },
        { label: "森林本息", anchor: "about" }
      ],
      products: [
        {
          id: "eo1",
          name: "野采大马士革重瓣冷凝熟金极燥玫瑰精油 (10ml)",
          price: 380,
          originalPrice: 480,
          description: "凌晨大马士革玫瑰手工采摘由超临界CO2冷榨，蕴载极高丰盈微分子，抚平每一丝干裂焦虑。",
          image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
          category: "有机单方"
        },
        {
          id: "eo2",
          name: "落雪松针与沉稳香根草混合助眠固体石膏藤条组",
          price: 139,
          originalPrice: 180,
          description: "北冰洋寒杉柏木与干燥橡苔中调泥香沉稳糅合，滴一管，让焦躁的大脑皮层十秒钟落入沉沉雪夜睡眠。",
          image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&q=80",
          category: "居家调香"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "揉捻植物叶心，让灵性归位",
          subtitle: "我们不添加一滴人工芳香酯与防腐。每一瓶本草精油都蕴藏真正长在肥沃土壤下的饱满生命张力与草本清芬。",
          content: "滴入藤条或超声微雾加湿器，微分子在暗处起舞。带上面对世界的从容与清凉，给奔波的您最轻柔的灵魂抚恤。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "原山珍草 · 精醇御滴",
          productIds: ["eo1", "eo2"]
        }
      ]
    }
  },
  {
    id: "gourmet-ceramics",
    name: "泥火之歌·高窑手造陶瓷舍",
    category: "家居软装",
    desc: "高古陶土偏黄赤陶、沙土灰。适合手作微糙餐具、枯山水咖啡大汤杯、高档窑变陈件。",
    previewColor: "#D97706",
    schema: {
      shopName: "泥火之歌·高窑手造陶瓷舍",
      shopSlogan: "微烫的窑变花纹，泥浆在指缝中缓慢变硬的粗放骨血温度",
      logoText: "CE_MUD",
      logoStyle: "serif",
      theme: {
        primaryColor: "#A16207",
        accentColor: "#FDE047",
        backgroundColor: "#FAF6F0",
        cardBgColor: "#FFFFFF",
        textColor: "#3F2C18",
        fontFamily: "serif",
        styleType: "warm",
        borderRadius: "md"
      },
      navigation: [
        { label: "窑变杯钵", anchor: "products" },
        { label: "烧窑常识", anchor: "faq" }
      ],
      products: [
        {
          id: "cm1",
          name: "柴烧高古拉纹古朴宽口意式拿铁陶泥大汤杯",
          price: 110,
          originalPrice: 150,
          description: "手拉胚塑型，1330度松木大火慢烧窑变三天。表面落灰自然融釉呈现粗犷金沙铜铁质感，杯口极其贴舌。",
          image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80",
          category: "窑变大杯"
        },
        {
          id: "cm2",
          name: "手工岩泥锤纹防烫粗陶防滑泡茶提梁壶",
          price: 240,
          originalPrice: 320,
          description: "内衬高窑白骨瓷胆完全不抢茶香，提梁处缠绕天然亚麻草绳防烫防磨，古老宁静手感。",
          image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
          category: "提梁泡壶"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: "揉捏天然泥尘，涅槃坚固骨肉",
          subtitle: "我们拒绝塑料和工业完美圆润胚具。每一只餐盘，都要承受木柴在火道中的任性落灰与天意窑变折射。",
          content: "温烫的水。指尖触摸过它粗糙古补带有小沙粒的天然外壁，仿佛手捧十万年前的肥沃山岭大树根泥土香。",
          alignment: "left"
        },
        {
          id: "products",
          type: "products",
          title: "粗砂炉灰 · 今日开窑",
          productIds: ["cm1", "cm2"]
        }
      ]
    }
  }
];
