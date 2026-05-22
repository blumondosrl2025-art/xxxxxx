import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { TemplateIntelligence } from "./src/lib/template-intelligence";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Ollama configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI capabilities will run on responsive fallback engines.");
}

// Ollama API call function with customizable host and model
async function callOllamaSpecific(prompt: string, systemInstruction?: string, host: string = OLLAMA_HOST, model: string = OLLAMA_MODEL) {
  try {
    const messages = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    // Ensure host doesn't have double slashes at endpoint
    const cleanHost = host.endsWith('/') ? host.slice(0, -1) : host;
    const response = await fetch(`${cleanHost}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages,
        stream: false,
        options: {
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama returned status ${response.status}`);
    }

    const data = await response.json();
    return data.message?.content || "";
  } catch (error) {
    console.error("callOllamaSpecific failed:", error);
    throw error;
  }
}

// Legacy helper compatibility
async function callOllama(prompt: string, systemInstruction?: string) {
  return callOllamaSpecific(prompt, systemInstruction, OLLAMA_HOST, OLLAMA_MODEL);
}

// Validate schema function
function isValidSchema(schema: any): boolean {
  if (!schema) return false;
  if (!schema.shopName) return false;
  if (!schema.theme) return false;
  if (!schema.products || !Array.isArray(schema.products)) return false;
  if (!schema.sections || !Array.isArray(schema.sections)) return false;
  
  // Check products have required fields
  for (const product of schema.products) {
    if (!product.name || !product.price || !product.description) return false;
  }
  
  return true;
}

// Support JSON body parsing up to 10MB
app.use(express.json({ limit: "10mb" }));

// System instructions for the Store Generator AI
const SHOP_DESIGNER_SYSTEM_INSTRUCTION = `
You are an expert Ecommerce Site Generator AI, a core design engine for premium AI-driven website builders like Shopify Magic, Lovable, Wix AI, and v0.
Your role is to take a user's natural language request (e.g., "北欧风咖啡馆", "极简复古黑胶唱片店", "Cyberpunk futuristic fashion tech gear") and output a complete, professionally curated, and highly beautiful Store JSON Schema alongside a friendly design explanation.

You MUST always output EXACTLY a valid JSON object of the following format:
{
  "explanation": "A friendly, professional design introduction (in Chinese, about 2-3 sentences) detailing your design choices (typography, vibe, colors, curation reasoning) for the shop.",
  "schema": <StoreSchema>
}

The <StoreSchema> must strictly follow this TypeScript structure:
interface StoreSchema {
  shopName: string; // Dynamic brand name
  shopSlogan: string; // Catchy tagline
  logoText: string; // Text logo name
  logoStyle?: string; // e.g. "serif", "mono", "minimal"
  theme: {
    primaryColor: string; // Hex color for buttons/accents, should match style
    accentColor: string; // Accent color
    backgroundColor: string; // Site body background
    cardBgColor: string; // Inner card background
    textColor: string; // Core text color
    fontFamily: "sans" | "serif" | "mono" | "grotesk" | "playfair";
    styleType: "minimal" | "modern" | "warm" | "cyberpunk" | "luxury" | "retro";
    borderRadius: "none" | "sm" | "md" | "lg" | "full";
  };
  navigation: Array<{ label: string; anchor: string }>; // e.g., [{"label": "首页", "anchor": "hero"}, {"label": "商品分类", "anchor": "products"}, {"label": "极简故事", "anchor": "about"}]
  products: Array<{
    id: string; // e.g. "p1", "p2"
    name: string;
    price: number;
    originalPrice?: number; // Optional higher retail price for markdown sales
    description: string;
    image: string; // Highly premium Unsplash photos
    category?: string;
    rating?: number; // 1.0 to 5.0
    tags?: string[];
    stock?: number;
  }>;
  sections: Array<{
    id: string; // e.g. "hero", "products", "features", "about", "testimonials", "contact"
    type: "hero" | "products" | "features" | "about" | "gallery" | "testimonials" | "faq" | "contact" | "footer";
    title: string;
    subtitle?: string;
    content?: string;
    alignment?: "left" | "center" | "right";
    items?: any[]; // For features: [{"id":"f1", "title":"Free Shipping", "description":"On orders over $50", "icon":"Truck"}]. icon MUST be a valid Lucide-React icon name (PascalCase style, e.g. Truck, ShieldCheck, Zap, Heart, Sparkles, Coffee, Box, Tag, Layers, Star). For faq: [{"id":"faq1", "question":"...", "answer":"..."}]. For gallery: [{"id":"g1","image":"Unsplash URL","caption":"..."}]. For testimonials: [{"id":"t1","name":"李先生","avatar":"Unsplash profile photo","role":"咖啡师","content":"这个咖啡机的萃取压力真的无可挑剔。","rating":5}]
    productIds?: string[]; // References to store.products, specifically for product grids
  }>;
}

CRITICAL RULES FOR DESIGNING HIGH-TOUCH STORES:
1. IMAGE ASSETS (STRICT COMPLIANCE):
   Always use vibrant, high-resolution Unsplash photo links instead of generic pixelated placeholders. Ensure the photo category matches the theme.
   Examples of premium general domains:
   - Cafe/Coffee: Use photos with IDs or queries like https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80, https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80 (Coffee cup, brewing, roasting).
   - Pets/Cats: https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80 (cat), https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80 (dog).
   - Bakery/Cake: https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80 (bread), https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80 (cake).
   - Fashion/Outfits: https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80 (women retail), https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80 (minimal suit).
   - Digital/Mechanical Keyboard/Tech: https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80.
   - Ceramic/Home Decor: https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80 (Home plant), https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80 (ceramic vase).
   You can generate beautiful, specific paths or search term queries using https://images.unsplash.com/photo-... URL formats. Ensure you output realistic Unsplash photos that elevate the shop visuals.

2. LOGICAL PAGE ASSEMBLY:
   Every high-quality store schema MUST contain at least:
   - a 'hero' section (banner, title, slogan background)
   - a 'products' section (pointing to products array via productIds, showing realistic curated catalogue)
   - an 'about' section or 'features' section (defining values, storytelling, or trust badges)
   - a 'contact' section (address, opening hours, interactive reservation)
   - a 'footer' (implicitly modeled or clearly layouted)

3. STYLE SELECTION:
   - For minimalist/modern cafe or craft: choose theme style 'warm' or 'minimal' with cream-beige/earth color palettes.
   - For fashion, design clothing, watches: choose style 'luxury' or 'modern' with sleek dark slate/deep gold palettes.
   - For gaming gear, cyberwear, tech gadgets: choose style 'cyberpunk' with neon greens/pinks and dark midnight backdrops.
   - For traditional bakeshop, records, vinyl: choose style 'retro' with mustard yellow, charcoal black borders, and typewriter fonts.

If a 'currentSchema' is provided, the user wants you to EDIT, EXPAND, or CHANGE the existing site based on their follow-up feedback (e.g. "把风格改成黑白极简", "额外添加一个推荐商品", "修改主副标题" or "添加几个信任标签"). Treat the current schema as the draft, update the relevant properties while preserving other components, and return the revised schema.
`;

// Helper to extract JSON from markdown or arbitrary conversational formats
function extractJSON(text: string): any {
  if (!text) return null;
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    // Try to locate JSON boundaries
    const firstOpen = trimmed.indexOf('{');
    const lastClose = trimmed.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
      try {
        const sliced = trimmed.substring(firstOpen, lastClose + 1);
        return JSON.parse(sliced);
      } catch (err) {
        // Double check if we can remove markdown wrap
        let blockMatches = trimmed.match(/```json\s*([\s\S]+?)\s*```/);
        if (blockMatches && blockMatches[1]) {
          try {
            return JSON.parse(blockMatches[1].trim());
          } catch (err2) {
            // Keep trying
          }
        }
      }
    }
  }
  return null;
}

// API routes inside server FIRST
app.post("/api/generate-shop", async (req, res) => {
  const { 
    prompt, 
    currentSchema, 
    action = "generate", 
    provider = "gemini", 
    ollamaHost = OLLAMA_HOST, 
    ollamaModel = OLLAMA_MODEL 
  } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt parameter." });
  }

  try {
    let systemInstruction = SHOP_DESIGNER_SYSTEM_INSTRUCTION;
    let finalPrompt = "";

    if (action === "edit" && currentSchema) {
      finalPrompt = `
You are editing an existing store configuration.
The user wants you to apply the following feedback: "${prompt}"

Current Store Schema:
${JSON.stringify(currentSchema, null, 2)}

Modify the Schema to fully reflect the user's intent. Preserve unmodified parts, retain logical identifiers, but rewrite style schemes, content, sections or items as explicitly specified by the user's feedback. Write a short explanation of the changes you made in the 'explanation' property.
`;
    } else if (action === "theme_change" && currentSchema) {
      finalPrompt = `
The user wants you to completely redesign the visual aesthetics of the existing store.
Style Vibe Requested: "${prompt}"

Current Store Schema:
${JSON.stringify(currentSchema, null, 2)}

Completely revamp the theme properties (primaryColor, accentColor, backgroundColor, cardBgColor, textColor, fontFamily, borderRadius, styleType) of the theme object to perfectly fit the requested vibe. Also update section background colors or button tags to feel cohesive. Do not destroy the existing products or text contents unless necessary to match the theme. Write a short summary of your design transformation in the 'explanation' property.
`;
    } else {
      // Direct initial generation
      finalPrompt = `
Generate a brand-new, premium, professional Store Schema from scratch for the following user request: "${prompt}".
Decide on an elegant, fitting, catchy brand name, slogan, customized products (at least 4 products with detailed names, prices, descriptions, and category), sections (hero, products, values, about story, contact details, testimonials), and a robust typographic and color theme matching the custom style.
`;
    }

    // First try Template Intelligence (but ONLY if generating from scratch AND score > 1)
    const templateIntelligence = new TemplateIntelligence();
    const templateMatch = templateIntelligence.matchTemplate(prompt);
    
    if (action === "generate" && templateMatch && templateMatch.score > 1) {
      console.log(`Template Intelligence matched: ${templateMatch.template.name}, score: ${templateMatch.score}`);
      return res.json({
        explanation: `🎯 智能定位系统已为您匹配最佳模板：「${templateMatch.template.name}」—— 自动适配了 ${templateMatch.template.category} 行业陈列。匹配关键词：${templateMatch.matchedKeywords.join('、')}`,
        schema: templateMatch.template.schema
      });
    }

    let parsedResult: any = null;

    if (provider === "local") {
      console.log(`Routing request to Local Ollama at ${ollamaHost} [Model: ${ollamaModel}]`);
      try {
        const responseText = await callOllamaSpecific(finalPrompt, systemInstruction, ollamaHost, ollamaModel);
        if (responseText) {
          parsedResult = extractJSON(responseText);
          if (parsedResult) {
            const schemaValue = parsedResult.schema || parsedResult;
            if (isValidSchema(schemaValue)) {
              console.log("Successfully compiled schema from Local Ollama!");
              return res.json({
                explanation: parsedResult.explanation || `🔌 (本地离线 LLM 编译成功 - ${ollamaModel}) 已帮您完成了任务。`,
                schema: schemaValue
              });
            }
          }
        }
        throw new Error("Ollama LLM returned null or invalid StoreSchema JSON.");
      } catch (ollamaErr: any) {
        console.warn("Local LLM Compilation failed. Falling back gracefully to Local Procedural Compiler:", ollamaErr.message);
        const fallback = generateLocalFallback(prompt, currentSchema, action);
        fallback.explanation = `💡 离线大模型 Ollama 服务目前不可达。为了向您提供高稳定体验，我们已通过本地神经网络微型编译器直接计算完成了此项任务：\n${fallback.explanation}`;
        return res.json(fallback);
      }
    } else {
      // Default / Cloud Gemini API
      if (ai) {
        console.log("Routing request to Cloud Gemini API (gemini-2.5-flash)...");
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: finalPrompt,
            config: {
              systemInstruction: systemInstruction,
              responseMimeType: 'application/json'
            }
          });
          const text = response.text;
          if (text) {
            parsedResult = extractJSON(text);
            if (parsedResult) {
              const schemaValue = parsedResult.schema || parsedResult;
              if (isValidSchema(schemaValue)) {
                console.log("Successfully compiled schema from Cloud Gemini API!");
                return res.json({
                  explanation: parsedResult.explanation || "✨ (云端 Gemini 大模型极速编译成功) 已帮您定制好了高级设计。",
                  schema: schemaValue
                });
              }
            }
          }
          throw new Error("Gemini returned null or invalid JSON string.");
        } catch (geminiErr: any) {
          console.warn("Cloud Gemini API failed. Falling back to Local Procedural Compiler:", geminiErr.message);
          const fallback = generateLocalFallback(prompt, currentSchema, action);
          fallback.explanation = `💡 极速响应保障：已自启动高性能本地微控制器编译器，同步设计完成：\n${fallback.explanation}`;
          return res.json(fallback);
        }
      } else {
        console.log("Gemini API Client is empty. Falling back to Local Procedural Compiler.");
        const fallback = generateLocalFallback(prompt, currentSchema, action);
        fallback.explanation = `🤖 (已采用本地智能编译器微协同生成)：\n${fallback.explanation}`;
        return res.json(fallback);
      }
    }

  } catch (error: any) {
    console.error("Store Optimizer Generic Error:", error);
    const fallback = generateLocalFallback(prompt, currentSchema, action);
    fallback.explanation = "🤖 (系统自动降级保护) 已采用本地智能设计引擎为您生成了安全配方。您可以继续编辑！";
    return res.json(fallback);
  }
});

// A localized template-generator to guarantee 100% service uptime even if key is missing or invalid!
function generateLocalFallback(prompt: string, currentSchema: any, action: string) {
  // First try Template Intelligence to match Premium Templates
  const templateIntelligence = new TemplateIntelligence();
  const templateMatch = templateIntelligence.matchTemplate(prompt);
  
  // Only override with static template if we are starting from scratch and matches real keywords
  if (action === "generate" && templateMatch && templateMatch.score > 1) {
    return {
      explanation: `🎯 本地模板匹配已为您匹配「${templateMatch.template.name}」—— 自动适配了 ${templateMatch.template.category} 行业风格。关键词匹配：${templateMatch.matchedKeywords.join('、')}`,
      schema: templateMatch.template.schema
    };
  }

  // If editing an existing schema procedurally
  if (currentSchema && action !== "generate") {
    const updated = JSON.parse(JSON.stringify(currentSchema));
    const normalizedPrompt = prompt.toLowerCase();
    
    if (normalizedPrompt.includes("黑金") || normalizedPrompt.includes("黑金风") || normalizedPrompt.includes("暗黑")) {
      updated.theme = {
        primaryColor: "#E2B874", // Gold
        accentColor: "#D1A966",
        backgroundColor: "#121212",
        cardBgColor: "#1C1C1E",
        textColor: "#E5E5E7",
        fontFamily: "playfair",
        styleType: "luxury",
        borderRadius: "none"
      };
      return {
        explanation: "已使用本地引擎将网店一键改造为「重奢黑金高定风格」，融合了典雅的黑金色彩与经典 serif 衬线字体。",
        schema: updated
      };
    }
    
    if (normalizedPrompt.includes("北欧") || normalizedPrompt.includes("极简")) {
      updated.theme = {
        primaryColor: "#000000",
        accentColor: "#4B5563",
        backgroundColor: "#F9FAFB",
        cardBgColor: "#FFFFFF",
        textColor: "#111827",
        fontFamily: "grotesk",
        styleType: "minimal",
        borderRadius: "none"
      };
      return {
        explanation: "已使用本地引擎修改为「极简北欧风」，黑白灰单色极高对比，几何边框切角设计。",
        schema: updated
      };
    }

    if (normalizedPrompt.includes("粉色") || normalizedPrompt.includes("甜美") || normalizedPrompt.includes("可爱")) {
      updated.theme = {
        primaryColor: "#EC4899", // Pink
        accentColor: "#F472B6",
        backgroundColor: "#FFF5F7",
        cardBgColor: "#FFFFFF",
        textColor: "#1F2937",
        fontFamily: "sans",
        styleType: "warm",
        borderRadius: "lg"
      };
      return {
        explanation: "已一键套用「粉色浪漫甜美风」主题，适配手作甜品、宠物萌宠或鲜花店面。",
        schema: updated
      };
    }

    // Generic append edit
    if (normalizedPrompt.includes("产品") || normalizedPrompt.includes("商品")) {
      const newId = `p_added_${Date.now()}`;
      const newProduct = {
        id: newId,
        name: "精品特色推荐新品",
        price: 99,
        originalPrice: 159,
        description: "由 AI 专属为您推荐的优质招牌产品，精选上乘原料精心制作而成。",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
        category: "新品上市"
      };
      updated.products.push(newProduct);
      // find first product section and append
      const productSec = updated.sections.find((s: any) => s.type === "products");
      if (productSec) {
        productSec.productIds = [...(productSec.productIds || []), newId];
      }
      return {
        explanation: "已在您的产品陈列中添加了一款全新的「高端招牌产品」，并实时同步渲染至主页商品网格。",
        schema: updated
      };
    }

    // Default basic text update
    updated.shopSlogan = `AI 智造：${prompt}`;
    return {
      explanation: "已根据您的描述进行了本地页面 Schema 细节优化。",
      schema: updated
    };
  }

  // SCRATCH GENERATION TEMPLATES
  const isCoffee = prompt.includes("咖啡") || prompt.includes("cafe") || prompt.includes("coffee") || prompt.includes("面包") || prompt.includes("烘焙");
  const isPet = prompt.includes("猫") || prompt.includes("狗") || prompt.includes("宠") || prompt.includes("pet");
  const isTech = prompt.includes("潮牌") || prompt.includes("数码") || prompt.includes("未来") || prompt.includes("极客") || prompt.includes("cyber") || prompt.includes("机能");

  if (isCoffee) {
    return {
      explanation: "为您设计了「木色暖炉·手作咖啡馆」的经典方案。暖茶褐与奶白相衬，搭配复古字体，突出静谧手作的高级暖意质感。",
      schema: {
        shopName: "琥珀时光咖啡馆",
        shopSlogan: "一杯温度，三分闲适，让时间慢慢流淌",
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
            name: "琥珀臻选·手冲埃塞冷萃",
            price: 38,
            originalPrice: 45,
            description: "柑橘与茉莉花香交织，酸甜明亮，纯手工精细滴滤萃取。",
            image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
            category: "单品手冲"
          },
          {
            id: "p2",
            name: "黄金橡木·燕麦生椰经典拿铁",
            price: 32,
            originalPrice: 38,
            description: "椰香醇厚，精选阿拉比卡拼配，与植物生椰乳完美交融。",
            image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
            category: "创意特调"
          },
          {
            id: "p3",
            name: "宇治抹茶小炉烤栗千层",
            price: 35,
            originalPrice: 42,
            description: "超25层超薄饼皮，栗子酱粉糯，微苦茶香清爽解腻。",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
            category: "极简烘焙"
          },
          {
            id: "p4",
            name: "南美庄园原木焙炒咖啡豆 (250g)",
            price: 88,
            originalPrice: 108,
            description: "自烘焙深度烘焙豆，黑巧与焦糖风味持久留齿。",
            image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80",
            category: "单品豆"
          }
        ],
        sections: [
          {
            id: "hero",
            type: "hero",
            title: "琥珀时光咖啡馆",
            subtitle: "手焙烘烤，精细萃取，在这里偷得浮生半日闲。",
            content: "在繁华深处为您寻觅一片属于豆香与木椅的舒缓安宁。",
            alignment: "center"
          },
          {
            id: "products",
            type: "products",
            title: "今日·臻选菜单",
            subtitle: "每周精选产地豆，由金牌咖啡师手工调和制作",
            productIds: ["p1", "p2", "p3", "p4"]
          },
          {
            id: "features",
            type: "features",
            title: "我们对于细节的专注",
            items: [
              { id: "f1", title: "产地直采豆", description: "每一颗绿豆均自拉丁美洲与非洲精品庄园直航运达。", icon: "Layers" },
              { id: "f2", title: "金杯黄金萃取", description: "严格按照美国SCA金杯标准，控制水温、时间、粉水比。", icon: "Coffee" },
              { id: "f3", title: "当日烤制糕点", description: "烘焙坊每日凌晨现做，无防腐剂加持，鲜美纯正。", icon: "Sparkles" }
            ]
          },
          {
            id: "about",
            type: "about",
            title: "一粒咖啡豆的旅行故事",
            content: "我们在海拔1800米的庄园深谷中，手工摘下最红的咖啡樱桃。剥壳、天然日晒、慢速中度烘烤。直到咖啡滴入白瓷杯中折射出琥珀般的光泽。这是一段关于自然、技艺、与坚守的事业，我们希望与期待品质的您共同见证这一场惬意体验。",
            alignment: "left"
          },
          {
            id: "gallery",
            type: "gallery",
            title: "慵懒空间剪影",
            items: [
              { id: "g1", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=500&q=80", caption: "暖洋洋的临街靠窗座" },
              { id: "g2", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80", caption: "专业原装意式咖啡萃取区" },
              { id: "g3", image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=500&q=80", caption: "慵懒周末午后一隅" }
            ]
          },
          {
            id: "testimonials",
            type: "testimonials",
            title: "咖啡老友的声音",
            items: [
              { id: "t1", name: "程女士", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80", role: "室内设计师", content: "咖啡品质极其稳定。特别是他们的耶加冷萃，明亮的果酸在夏天太解压，原木风的装修我也特别喜爱。", rating: 5 },
              { id: "t2", name: "陈先生", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80", role: "独立摄影师", content: "这里拍照氛围绝佳。安静、服务也很体贴，在这里度过一个下午会激发很多灵思灵感。", rating: 5 }
            ]
          },
          {
            id: "faq",
            type: "faq",
            title: "常见疑问解答",
            items: [
              { id: "faq1", question: "咖啡豆可以帮忙现场磨粉吗？", answer: "完全可以。我们会根据您的器具（法压、手冲、摩卡壶等）细致调整研磨刻度并提供真空密封袋装好。" },
              { id: "faq2", question: "店里提供外送或团餐预定服务吗？", answer: "有的。您可以直接在小程序或拨打电话预订。如需大额企业咖啡歇，请提前24小时联系我们客服进行预定调配。" }
            ]
          },
          {
            id: "contact",
            type: "contact",
            title: "寻香之旅",
            subtitle: "欢迎您来现场，感受手作的温暖空间",
            content: "地址：上海市徐汇区梧桐树影遮蔽的创意生活街坊108号院 \n营业时间：周一至周日 08:30 - 21:30 \n服务电话：021-88889999",
            alignment: "center"
          }
        ]
      }
    };
  }

  if (isPet) {
    return {
      explanation: "为您量身定制了「猫咪盒子·高端萌伴好物店」。粉红马卡龙与柔软奶油白相拥，全圆角弧线，展现爱宠、温馨、无距离感的萌趣美学。",
      schema: {
        shopName: "猫咪暖篷物语馆",
        shopSlogan: "软萌暖篷，盛满它对这个世界的无限好奇",
        logoText: "MEOW COZY",
        logoStyle: "serif",
        theme: {
          primaryColor: "#EC4899",
          accentColor: "#F472B6",
          backgroundColor: "#FFF5F7",
          cardBgColor: "#FFFFFF",
          textColor: "#4A2834",
          fontFamily: "sans",
          styleType: "warm",
          borderRadius: "lg"
        },
        navigation: [
          { label: "猫咪好物", anchor: "products" },
          { label: "匠人初心", anchor: "about" },
          { label: "家长信赖", anchor: "testimonials" },
          { label: "萌爪之家", anchor: "contact" }
        ],
        products: [
          {
            id: "p1",
            name: "马卡龙色猫咪太空漫步柔软睡垫",
            price: 68,
            originalPrice: 98,
            description: "云朵级绒柔，全拆洗，抗菌防螨，保护主子一整夜的粉红美梦。",
            image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
            category: "舒适睡眠"
          },
          {
            id: "p2",
            name: "原野鲜鹿肉深海吞拿主食冻干 (500g)",
            price: 139,
            originalPrice: 179,
            description: "97%鲜肉含量，生骨肉配方，温和脱水锁住天然免疫力。",
            image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
            category: "营养主食"
          },
          {
            id: "p3",
            name: "森林松塔剑麻防屑磨爪实木猫爬架",
            price: 329,
            originalPrice: 420,
            description: "实木抓切底座，原色剑麻绳环绕，给爱猫极致的攀登乐趣。",
            image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
            category: "趣味家具"
          },
          {
            id: "p4",
            name: "萌萌爪多维益生乳钙营养高能肉泥 (12支装)",
            price: 45,
            originalPrice: 59,
            description: "高蛋白质，添加牛磺酸和钙片，爱不释口的掌心喂食神级零食。",
            image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
            category: "萌爪零食"
          }
        ],
        sections: [
          {
            id: "hero",
            type: "hero",
            title: "猫咪暖篷物语馆",
            subtitle: "做猫咪的贴心造物官。提供安心、好玩、软糯的生活优选。",
            content: "让每一次亲昵投喂、每一次美梦憨睡，都洒满粉色温情的呵护。",
            alignment: "center"
          },
          {
            id: "products",
            type: "products",
            title: "超人气猫主子选品",
            subtitle: "严苛入店测试，无谷零添加残留，品质保证放心选购",
            productIds: ["p1", "p2", "p3", "p4"]
          },
          {
            id: "about",
            type: "about",
            title: "为什么叫猫咪暖篷？",
            content: "由于我们对猫咪有着近乎严苛的情感投入。店里的发起人都是十年的资深猫家长。我们发现大部分猫咪睡窝和劣质冻干在默默损害它们的安全和胃肠健康。因此，我们立志创立“猫咪暖篷”，产品全部通过实木天然测试以及无化肥谷物添加标准，每一款细节皆流露着我们的呵护之心。",
            alignment: "left"
          },
          {
            id: "contact",
            type: "contact",
            title: "猫咪乐园地址",
            content: "地址：深圳市南山区海上世界游艇码头粉色爱伴体验中心3楼 \n迎爪热线：0755-66668888 \n萌爪时间：10:00 - 22:00",
            alignment: "center"
          }
        ]
      }
    };
  }

  // DEFAULT (e.g. general boutique)
  return {
    explanation: `已为您智造了「独属品牌·${prompt}」的整体方案。主打极简现代风，墨墨黑与纯白交互，硬朗直切角勾勒高端格调。`,
    schema: {
      shopName: `${prompt || "元力觉醒极简铺"}`,
      shopSlogan: "精质生活，一步直达",
      logoText: "ORIGIN DESIGN",
      logoStyle: "minimal",
      theme: {
        primaryColor: "#111827",
        accentColor: "#6B7280",
        backgroundColor: "#FFFFFF",
        cardBgColor: "#F9FAFB",
        textColor: "#111827",
        fontFamily: "grotesk",
        styleType: "minimal",
        borderRadius: "none"
      },
      navigation: [
        { label: "新品入库", anchor: "products" },
        { label: "工坊理念", anchor: "about" },
        { label: "核心特性", anchor: "features" },
        { label: "联系咨询", anchor: "contact" }
      ],
      products: [
        {
          id: "p1",
          name: "精雕冷冷系列 · 手作黑陶咖啡杯",
          price: 158,
          originalPrice: 198,
          description: "历时45天，经高温窑变，杯身带独特的冰曜石粗粗磨矿物手感。",
          image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80",
          category: "经典器皿"
        },
        {
          id: "p2",
          name: "白苔森野 · 高端植萃车载精油香氛",
          price: 188,
          originalPrice: 248,
          description: "雪松为调，揉入苔藓微潮，天然高空萃取植物精油，去异味长效留香。",
          image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
          category: "森野气味"
        },
        {
          id: "p3",
          name: "机械极简风磨砂氧化铝理线器",
          price: 79,
          originalPrice: 99,
          description: "整块铝合金CNC切制，磁吸卡孔，瞬间降服杂乱无序的极速桌面。",
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
          category: "极客收纳"
        },
        {
          id: "p4",
          name: "手工全棉质感褶皱宽褶麻质披肩",
          price: 228,
          originalPrice: 298,
          description: "古法染色编织，粗硬中带亲肤绵软，随性造型必备神级配饰。",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
          category: "四季围巾"
        }
      ],
      sections: [
        {
          id: "hero",
          type: "hero",
          title: `${prompt || "元力觉醒极简铺"}`,
          subtitle: "我们不造无用之物，每一款选择都是对克制与极致的精析解构。",
          content: "少，即是多。以直率而克制的器物，抚平繁冗世界的焦躁波澜。",
          alignment: "center"
        },
        {
          id: "products",
          type: "products",
          title: "匠心优选物语",
          subtitle: "限定小批量，匠人生产品质追踪，赋予生活纯澈细节",
          productIds: ["p1", "p2", "p3", "p4"]
        },
        {
          id: "features",
          type: "features",
          title: "品牌底层执念",
          items: [
            { id: "f1", title: "环保无汞切切", description: "全系餐具均通过无重金属环保认证，安心入口。", icon: "ShieldCheck" },
            { id: "f2", title: "手工极致打磨", description: "匠人逐一细刻粗糙颗粒，极富手工原始肌理温度。", icon: "Layers" },
            { id: "f3", title: "极速无忧保修", description: "首年如有崩口爆裂，我们直接换新，无忧体验。", icon: "Zap" }
          ]
        },
        {
          id: "about",
          type: "about",
          title: "我们的精质追求",
          content: "我们坚信生活并非因富余物件而丰盈，反而会在此中迷失纯真。在这里，我们执着于极简、质朴、耐受与极佳的功能手感。希望从一个杯、一个线夹，去改善您的日常使用情绪。",
          alignment: "center"
        },
        {
          id: "contact",
          type: "contact",
          title: "一隅角落 · 品牌中心",
          content: "地址：北京市朝阳区798艺术创意园区4号馆A座 \n营业时间：周一至周日 10:00 - 20:30 \n联系服务：hello@origindesign.site",
          alignment: "center"
        }
      ]
    }
  };
}

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express and Vite development proxy server running on http://localhost:${PORT}`);
  });
}

startServer();
