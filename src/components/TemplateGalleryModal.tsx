import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  X, 
  Palette, 
  ChevronRight, 
  Maximize2, 
  Check, 
  Flame, 
  Compass, 
  Fingerprint,
  RotateCcw
} from 'lucide-react';
import { PREMIUM_TEMPLATES } from '../data/templates';
import { StoreSchema } from '../types';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (schema: StoreSchema, title: string) => void;
  activeSchema: StoreSchema;
}

export default function TemplateGalleryModal({
  isOpen,
  onClose,
  onSelectTemplate,
  activeSchema
}: TemplateGalleryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'全部' | '餐饮美食' | '科技数码' | '服装配饰' | '园艺绿植' | '其他'>('全部');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Group categories correctly matching data
  const categories = ['全部', '餐饮美食', '科技数码', '服装配饰', '园艺绿植', '其他'];

  const filteredTemplates = PREMIUM_TEMPLATES.filter(tpl => {
    const matchesSearch = tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tpl.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tpl.schema.shopSlogan.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === '全部') return matchesSearch;
    if (selectedCategory === '其他') {
      return matchesSearch && !['餐饮美食', '科技数码', '服装配饰', '园艺绿植'].includes(tpl.category);
    }
    return matchesSearch && tpl.category === selectedCategory;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* Backdrop glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020205]/85 backdrop-blur-xl"
        />

        {/* Core Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-6xl h-[85vh] bg-[#09090c] border border-zinc-900 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-zinc-300"
        >
          {/* Subtle decoration borders */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          
          {/* Main header block */}
          <div className="p-6 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1 px-2.5 rounded text-[10px] uppercase font-mono tracking-widest font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Visual Storefront Vault
                </div>
                <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  <Flame className="w-2.5 h-2.5 animate-pulse" />
                  HIGH RENDERING SPEED
                </span>
              </div>
              <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
                殿堂级 AI 概念店物料模板馆
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              </h2>
              <p className="text-xs text-zinc-500 max-w-2xl leading-relaxed">
                无需复杂提示词，一键调和由资深设计师预置好配色的20套高水准模板。色谱、倒角、字组及新品内容已精心拼装，可直接继承或通过 AI 聊天二次微调。
              </p>
            </div>

            {/* Close button with circular layout */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all shadow-md active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filtering Tools and Search bar */}
          <div className="px-6 py-4 border-b border-zinc-900 bg-[#0c0c10]/90 flex flex-col md:flex-row items-center justify-between gap-3 flex-shrink-0">
            {/* Horizontal tags filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <Compass className="w-3.5 h-3.5 text-zinc-650 mr-1 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer select-none transition-all duration-150 flex-shrink-0
                    ${selectedCategory === cat
                      ? 'bg-zinc-100 text-zinc-950 shadow font-bold'
                      : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border border-zinc-900 hover:bg-zinc-900'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Premium search bar with icon */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="搜索精工表、原木、抹茶、黑金..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 pl-9 pr-8 focus:outline-none focus:border-zinc-700 text-zinc-200 placeholder-zinc-600 transition-colors"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-[10px] font-mono text-zinc-600 hover:text-zinc-400 cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Core Tiles Grid */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#07070a]/40">
            {filteredTemplates.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-600">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-400 font-semibold text-sm">未能匹配到相关美学模本</p>
                  <p className="text-xs text-zinc-600 max-w-sm">
                    试试搜索其他关键词，或者点击“全部”查看由 AI 开店团队打造的 20 套完整品类模板。
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTemplates.map((tpl) => {
                  const isActive = activeSchema.shopName === tpl.schema.shopName;
                  const isHovered = hoveredId === tpl.id;
                  const sectionCount = tpl.schema.sections?.length || 0;
                  const productCount = tpl.schema.products?.length || 0;
                  const th = tpl.schema.theme;

                  return (
                    <motion.div
                      key={tpl.id}
                      onMouseEnter={() => setHoveredId(tpl.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`relative rounded-xl border p-5 flex flex-col justify-between h-[250px] transition-all bg-gradient-to-b from-[#111115] to-[#0d0d10] cursor-pointer group text-left
                        ${isActive 
                          ? 'border-indigo-500 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/20' 
                          : 'border-zinc-90 w border-zinc-900 hover:border-zinc-700 hover:bg-[#131317] shadow-sm'
                        }
                      `}
                      onClick={() => onSelectTemplate(tpl.schema, tpl.name)}
                    >
                      {/* Top ribbon: Title + Category */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono tracking-wider font-bold text-indigo-400 uppercase bg-indigo-505/10 bg-indigo-950/45 border border-indigo-900/30 px-2 py-0.5 rounded">
                            {tpl.category}
                          </span>
                          
                          {isActive && (
                            <span className="flex items-center gap-1 text-[9px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                              <Check className="w-2.5 h-2.5" />
                              ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Title & Slogan */}
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors font-sans flex items-center justify-between">
                            <span>{tpl.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
                          </h3>
                          <p className="text-[10px] font-mono text-zinc-500 font-semibold italic truncate">
                            “{tpl.schema.shopSlogan}”
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans line-clamp-2 pt-1">
                          {tpl.desc}
                        </p>
                      </div>

                      {/* Bottom Deck panel */}
                      <div className="pt-4 border-t border-zinc-900/50 flex items-center justify-between text-[11px] gap-2">
                        {/* Theme color story blocks */}
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5 bg-zinc-950 p-1 rounded-md border border-zinc-900">
                            <span className="w-4 h-4 rounded-full border border-zinc-950" style={{ backgroundColor: th.primaryColor }} title={`Primary: ${th.primaryColor}`} />
                            <span className="w-4 h-4 rounded-full border border-zinc-950" style={{ backgroundColor: th.accentColor }} title={`Accent: ${th.accentColor}`} />
                            <span className="w-4 h-4 rounded-full border border-zinc-950" style={{ backgroundColor: th.backgroundColor }} title={`Bg: ${th.backgroundColor}`} />
                            <span className="w-4 h-4 rounded-full border border-zinc-950" style={{ backgroundColor: th.cardBgColor }} title={`Card: ${th.cardBgColor}`} />
                          </div>
                          
                          {/* Font family label pill */}
                          <span className="text-[9px] font-mono font-bold bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded uppercase max-w-[65px] truncate">
                            {th.fontFamily}
                          </span>
                        </div>

                        {/* Stats indicator */}
                        <div className="text-right text-[10px] font-mono text-zinc-500 leading-tight">
                          <div>
                            <span className="text-zinc-300 font-bold">{sectionCount}</span> 个模块
                          </div>
                          <div>
                            <span className="text-zinc-300 font-bold">{productCount}</span> 款新品
                          </div>
                        </div>
                      </div>

                      {/* Extra card background hover effect glow */}
                      {isHovered && (
                        <div className="absolute inset-0 rounded-xl bg-indigo-500/[0.01] pointer-events-none border border-indigo-500/10 transition-all duration-300" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick instructions Footer banner */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-900 text-center flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 text-[11px] text-zinc-500 h-14 font-mono select-none">
            <span className="flex items-center gap-1.5 justify-center">
              <RotateCcw className="w-3 h-3 text-indigo-400 animate-pulse" />
              <span>注: 切换模板会自动产生一次时光机快照，支持直接回到过去任何版本草稿</span>
            </span>
            <span>20 PREMIUM TEMPLATES RETRIEVED · POWERED BY GEMINI PRO</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
