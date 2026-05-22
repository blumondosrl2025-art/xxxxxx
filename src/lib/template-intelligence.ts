import { PREMIUM_TEMPLATES } from '../data/templates';

export interface TemplateMatch {
  template: typeof PREMIUM_TEMPLATES[0];
  score: number;
  matchedKeywords: string[];
}

export class TemplateIntelligence {
  private keywordGroups = {
    minimal: {
      keywords: ['极简', '简约', '素白', '北欧', '简约主义', '素色', '无印', 'muji', 'minimal', 'simple', 'pure', 'clean', 'white', 'gray'],
      templates: ['minimalist-linen-store', 'helsinki-nordic-chair', 'bento-tech-deck']
    },
    luxury: {
      keywords: ['奢华', '高级', '黑金', '暗黑', 'luxury', 'black-gold', 'noir', 'luxe', '奢选', '极致'],
      templates: ['luxury-gold-motor', 'swiss-horology', 'truffle-bistro']
    },
    cyberpunk: {
      keywords: ['未来', '赛博', '赛博朋克', '朋克', '科技', 'cyber', 'hacker', '极客', 'geek', '未来主义', '霓虹'],
      templates: ['cyberpunk-hacker', 'stardust-fandom']
    },
    warm: {
      keywords: ['咖啡', 'cafe', '咖啡馆', '茶', 'te', '餐厅', 'restaurant', '暖', 'warm', 'cozy', '烘焙', 'bakery', '面包'],
      templates: ['amber-coffee', 'retro-vinyl-lounge', 'wild-flora']
    },
    fashion: {
      keywords: ['服装', '时装', 'fashion', '服装', '服装批发', '服装品牌', '设计服装'],
      templates: ['sicilian-leather', 'swiss-horology']
    },
    tokyo: {
      keywords: ['东京', '原宿', '潮牌', '涉谷', 'tokyo', '涩谷', '时尚'],
      templates: ['tokyo-matcha', 'sicilian-leather']
    },
    industrial: {
      keywords: ['机械', 'industrial', '暗黑机械', '重工业', '工厂', ''],
      templates: ['luxury-gold-motor', 'cyberpunk-hacker']
    },
    nature: {
      keywords: ['植物', '绿植', '多肉', '园艺', 'garden', 'natural', '自然', '森系'],
      templates: ['wild-flora', 'eco-nurseries']
    },
    pet: {
      keywords: ['宠物', '猫', '狗', '宠物', 'pet', '猫咪', '狗狗', ''],
      templates: ['cat-bakery']
    }
  };

  public matchTemplate(prompt: string): TemplateMatch {
    const lowerPrompt = prompt.toLowerCase();
    let bestMatch: TemplateMatch = {
      template: PREMIUM_TEMPLATES[0],
      score: 0,
      matchedKeywords: []
    };

    for (const [group, config] of Object.entries(this.keywordGroups)) {
      let groupScore = 0;
      const matchedKeywords = [];

      for (const keyword of config.keywords) {
        if (lowerPrompt.includes(keyword)) {
          groupScore += 10;
          matchedKeywords.push(keyword);
        }
      }

      if (groupScore > bestMatch.score) {
        const template = PREMIUM_TEMPLATES.find(t => config.templates.includes(t.id));
        if (template) {
          bestMatch = {
            template,
            score: groupScore,
            matchedKeywords
          };
        }
        continue;
      }
    }

    if (bestMatch.score === 0) {
      const randomIndex = Math.floor(Math.random() * PREMIUM_TEMPLATES.length);
      bestMatch = {
        template: PREMIUM_TEMPLATES[randomIndex],
        score: 1,
        matchedKeywords: ['（智能推荐）']
      };
    }

    return bestMatch;
  }

  public getTemplateById(id: string) {
    return PREMIUM_TEMPLATES.find(t => t.id === id);
  }
}
