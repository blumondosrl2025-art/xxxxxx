import { useState } from 'react';
import { StoreSchema, StoreProduct } from '../types';
import { 
  Laptop, Tablet, Smartphone, Search, ShoppingBag, Rocket, RefreshCw, ZoomIn, ZoomOut, ToggleLeft, ToggleRight, Sparkles, Check, Info
} from 'lucide-react';
import ComponentRenderer from './ComponentRenderer';

interface LivePreviewFrameProps {
  schema: StoreSchema;
  isEditorMode: boolean;
  onChangeEditorMode: (mode: boolean) => void;
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onAddToCart: (product: StoreProduct) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenDeploy: () => void;
  onOpenTemplates?: () => void;
  workspaceSkin?: 'cyber' | 'mono';
  onChangeWorkspaceSkin?: (skin: 'cyber' | 'mono') => void;
}

type DeviceSize = 'desktop' | 'tablet' | 'mobile';

export default function LivePreviewFrame({
  schema,
  isEditorMode,
  onChangeEditorMode,
  selectedSectionId,
  onSelectSection,
  onAddToCart,
  cartCount,
  onOpenCart,
  onOpenDeploy,
  onOpenTemplates,
  workspaceSkin = 'cyber',
  onChangeWorkspaceSkin
}: LivePreviewFrameProps) {
  const [device, setDevice] = useState<DeviceSize>('desktop');
  const [scale, setScale] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [showJsonHud, setShowJsonHud] = useState(false);
  const [activeFrameTab, setActiveFrameTab] = useState<'storefront' | 'specs'>('storefront');

  const isMono = workspaceSkin === 'mono';

  // Device width settings mapping
  const deviceWidths: Record<DeviceSize, string> = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[95%] border-8 border-neutral-800 rounded-3xl shadow-xl bg-white p-1 overflow-y-auto',
    mobile: 'w-[375px] h-[85%] border-12 border-neutral-900 rounded-[40px] shadow-2xl bg-white p-1.5 overflow-y-auto relative'
  };

  const categories = ['全部', ...Array.from(new Set(schema.products.map(p => p.category).filter(Boolean)))];

  return (
    <div className={`h-full flex flex-col ${isMono ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-90 w bg-zinc-900 text-zinc-300'} font-sans`}>
      
      {/* Top Controller Bar */}
      <div className={`h-14 border-b px-4 flex items-center justify-between gap-4 flex-shrink-0 ${isMono ? 'border-zinc-200 bg-white' : 'border-zinc-850 bg-zinc-950'}`}>
        
        {/* Device select */}
        <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border ${isMono ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
          <button
            type="button"
            onClick={() => { setDevice('desktop'); setScale(1); }}
            className={`p-1.5 rounded transition-all select-none ${
              device === 'desktop' 
                ? (isMono ? 'bg-zinc-900 text-white' : 'bg-zinc-800 text-indigo-400') 
                : (isMono ? 'text-zinc-400 hover:text-zinc-600' : 'text-zinc-500 hover:text-zinc-300')
            }`}
            title="Desktop Size Preview"
          >
            <Laptop className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => { setDevice('tablet'); setScale(0.85); }}
            className={`p-1.5 rounded transition-all select-none ${
              device === 'tablet' 
                ? (isMono ? 'bg-zinc-900 text-white' : 'bg-zinc-800 text-indigo-400') 
                : (isMono ? 'text-zinc-400 hover:text-zinc-600' : 'text-zinc-500 hover:text-zinc-300')
            }`}
            title="Tablet Size Preview"
          >
            <Tablet className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => { setDevice('mobile'); setScale(0.75); }}
            className={`p-1.5 rounded transition-all select-none ${
              device === 'mobile' 
                ? (isMono ? 'bg-zinc-900 text-white' : 'bg-zinc-800 text-indigo-400') 
                : (isMono ? 'text-zinc-400 hover:text-zinc-600' : 'text-zinc-500 hover:text-zinc-300')
            }`}
            title="Mobile iPhone Shape Preview"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        {/* Zoom adjuster (only relevant for sized viewports) */}
        {device !== 'desktop' && (
          <div className={`hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-mono ${isMono ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-zinc-900 border-zinc-800 text-zinc-505 text-zinc-500'}`}>
            <button
              onClick={() => setScale(prev => Math.max(0.6, prev - 0.05))}
              className="hover:scale-105 active:scale-95 transition-all"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center select-none">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(prev => Math.min(1.2, prev + 0.05))}
              className="hover:scale-105 active:scale-95 transition-all"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Global Color Mode Switcher Toggle: Cyber vs B&W (Monochrome) */}
        {onChangeWorkspaceSkin && (
          <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg select-none ${isMono ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'}`}>
            <span className={`text-[11px] font-bold select-none ${isMono ? 'text-zinc-800' : 'text-indigo-400'}`}>
              {isMono ? '🔳 极简黑白模式' : '🔮 暗曜炫彩模式'}
            </span>
            <button
              onClick={() => onChangeWorkspaceSkin(isMono ? 'cyber' : 'mono')}
              className="transition-colors flex items-center p-0.5 rounded-full"
              title="一键切换工作台全局色彩(炫彩/黑白)"
            >
              {isMono ? (
                <ToggleRight className="h-5 w-5 text-zinc-900 stroke-[2]" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-indigo-500 stroke-[2]" />
              )}
            </button>
          </div>
        )}

        {/* Mode switcher tabs: Editor, Client view */}
        <div className={`flex items-center gap-1 p-1 rounded-lg border ${isMono ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-90 w bg-zinc-900 border-zinc-800'}`}>
          <button
            onClick={() => { onChangeEditorMode(true); }}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all select-none flex items-center gap-1 cursor-pointer ${
              isEditorMode
                ? (isMono ? 'bg-zinc-90 w bg-zinc-900 text-white' : 'bg-zinc-800 text-indigo-400')
                : (isMono ? 'text-zinc-500 hover:text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-200 font-semibold')
            }`}
          >
            <span>💻 编辑器</span>
          </button>
          <button
            onClick={() => { onChangeEditorMode(false); }}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all select-none flex items-center gap-1 cursor-pointer ${
              !isEditorMode
                ? (isMono ? 'bg-zinc-90 w bg-zinc-900 text-white' : 'bg-zinc-800 text-indigo-400')
                : (isMono ? 'text-zinc-500 hover:text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-200 font-semibold')
            }`}
          >
            <span>👀 预览</span>
          </button>
        </div>

        {/* Dynamic storefront context search (only active on user modes) */}
        {!isEditorMode && (
          <div className={`hidden lg:flex items-center gap-2 py-1 px-3 rounded-lg border text-xs w-48 ${isMono ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-90 w bg-zinc-900 border-zinc-800'}`}>
            <Search className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="搜索商品目录..."
              className={`bg-transparent w-full outline-hidden font-sans ${isMono ? 'text-zinc-950 placeholder-zinc-400' : 'text-zinc-300 placeholder-zinc-605 placeholder-zinc-600'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Action CTA points */}
        <div className="flex items-center gap-3">
          
          {/* 殿堂级概念店设计馆 button with modern aesthetic with a 20+ badge count */}
          <button
            type="button"
            onClick={onOpenTemplates}
            className={`rounded-lg font-bold text-xs py-1.5 px-3.5 active:scale-95 transition-all outline-none flex items-center gap-1.5 cursor-pointer select-none
              ${isMono 
                ? 'border border-zinc-350 bg-white text-zinc-850 hover:bg-zinc-100' 
                : 'border border-indigo-500/30 text-indigo-300 bg-indigo-950/20 hover:bg-indigo-950/50 hover:border-indigo-400'
              }
            `}
            title="一键调和 20+ 款资深画廊级精品概念店铺"
          >
            <Sparkles className={`h-3.5 w-3.5 animate-pulse ${isMono ? 'text-zinc-700' : 'text-indigo-400'}`} />
            <span className="hidden sm:inline">殿堂级模板馆</span>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${isMono ? 'bg-zinc-100 border-zinc-200 text-zinc-800' : 'bg-indigo-505 bg-indigo-500/20 border-indigo-500/25 text-indigo-350'}`}>20+ Style</span>
          </button>

          {/* Shopping cart trigger */}
          <button
            onClick={onOpenCart}
            style={{ borderColor: schema.theme.primaryColor }}
            className={`rounded-lg border px-3 py-1.5 justify-center flex items-center gap-2 text-xs cursor-pointer active:scale-95 transition-all outline-none
              ${isMono ? 'bg-white text-zinc-800 hover:bg-zinc-50 border-zinc-300' : 'bg-zinc-900 text-zinc-200 hover:bg-neutral-850'}
            `}
          >
            <ShoppingBag className="h-4 w-4 text-zinc-400" />
            <span className="font-semibold font-mono" style={{ color: schema.theme.primaryColor }}>
              {cartCount}
            </span>
            <span className="hidden sm:inline text-zinc-500 font-bold">购物车</span>
          </button>

          {/* Core publish pipeline deployer */}
          <button
            onClick={onOpenDeploy}
            style={{ backgroundColor: schema.theme.primaryColor }}
            className="rounded-lg text-white font-semibold text-xs py-2 px-4 shadow-lg flex items-center gap-2 filter brightness-95 hover:brightness-110 active:scale-95 transition-all outline-none select-none cursor-pointer"
          >
            <Rocket className="h-4 w-4" />
            <span>发布部署店面</span>
          </button>
        </div>

      </div>

      {/* Main Preview Sandbox stage */}
      <div className={`flex-1 flex items-center justify-center p-4 relative overflow-auto custom-scrollbar transition-all duration-350 ${isMono ? 'bg-zinc-200' : 'bg-[#16161a]'}`}>
        
        {/* Floating JSON schema inspector toggler */}
        <button
          onClick={() => setShowJsonHud(!showJsonHud)}
          className={`absolute bottom-4 right-4 z-20 px-3.5 py-2.5 rounded-full select-none cursor-pointer border shadow-lg flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold font-mono backdrop-blur-md hover:scale-102 active:scale-98
            ${showJsonHud 
              ? (isMono ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/20') 
              : (isMono ? 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-100 hover:text-black' : 'bg-zinc-950/90 text-zinc-300 border-zinc-805 border-zinc-800 hover:text-white')
            }
          `}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{showJsonHud ? '收起配置数据' : '查看配置数据'}</span>
        </button>

        {showJsonHud && (
          <div className={`absolute bottom-16 right-4 z-25 w-72 h-80 p-4 border rounded-xl shadow-2xl font-mono text-[10px] flex flex-col justify-between animate-fade-in backdrop-blur-md
            ${isMono ? 'bg-white/95 border-zinc-300 text-zinc-700' : 'bg-zinc-950/95 border-zinc-800 text-zinc-400'}
          `}>
            <div className={`flex items-center justify-between border-b pb-2 mb-2 ${isMono ? 'border-zinc-200' : 'border-zinc-800'}`}>
              <span className={`font-bold uppercase tracking-wider ${isMono ? 'text-zinc-900' : 'text-zinc-200'}`}>Storefront Schema</span>
              <span className="text-emerald-500 flex items-center gap-1 text-[9px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>SYNCED</span>
              </span>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar leading-relaxed">
              <pre className={isMono ? 'text-zinc-800' : 'text-zinc-400'}>{JSON.stringify(schema, null, 2)}</pre>
            </div>
            <div className={`border-t pt-2 mt-2 flex justify-between text-[9px] ${isMono ? 'border-zinc-200/50 text-zinc-400' : 'border-zinc-855/20 border-zinc-800/40 text-zinc-650'}`}>
              <span>SIZE: {(JSON.stringify(schema).length / 1024).toFixed(2)} KB</span>
              <span>LIVE RENDER</span>
            </div>
          </div>
        )}

        <>
          {/* Spectator/Guest custom workspace backlink to enable incredible viral cloning loop */}
          {!isEditorMode && (
            <button
              onClick={() => onChangeEditorMode(true)}
              className="absolute top-4 left-4 z-30 px-3.5 py-2 rounded-full border shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all text-xs font-bold cursor-pointer select-none bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white border-indigo-550 shadow-indigo-500/10 animate-fadeIn"
              title="一键加载并唤醒 AI 智能极速开店工作台"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-yellow-300" />
              <span>🎨 该网店由 AI 辅助设计 · 立即唤醒工作台</span>
              <span className="bg-white/20 text-[9.5px] px-2 py-0.5 rounded-full font-sans">CLONE & EDIT</span>
            </button>
          )}

          {/* Helper instructions for visualization double-click */}
          {isEditorMode && (
            <div className={`absolute top-2 left-4 z-15 border px-3 py-1.5 rounded-md text-[10px] flex items-center gap-2 shadow-lg max-w-sm pointer-events-none select-none backdrop-blur-xs font-sans
              ${isMono 
                ? 'bg-zinc-950 text-zinc-200 border-zinc-900 shadow-zinc-950/10' 
                : 'bg-indigo-950/90 border-indigo-805/40 border-indigo-800/40 text-indigo-300 shadow-lg'
              }
            `}>
              <Info className="h-3.5 w-3.5 flex-shrink-0" />
              <span><b>可视化模式已激活</b>：在右方点击任意页面区域即可选中。左侧会同步拉出该组件的可视化配置面板。</span>
            </div>
          )}

          {/* Viewport alignment sandbox */}
          <div 
            style={{ transform: device !== 'desktop' ? `scale(${scale})` : 'none', transformOrigin: 'center' }}
            className={`
              transition-all duration-300 flex items-center justify-center
              ${device === 'desktop' ? 'w-full h-full' : ''}
            `}
          >
            <div className={`${deviceWidths[device]} bg-[#FAF9F5] shadow-inner flex flex-col`}>
              
              {/* Embedded mockup mobile phone top speaker camera notch */}
              {device === 'mobile' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-6 bg-neutral-900 rounded-b-2xl z-25 flex items-center justify-center gap-1.5 select-none pointer-events-none">
                  <div className="w-12 h-1 bg-neutral-800 rounded-full" />
                  <div className="w-2 h-2 bg-neutral-800 rounded-full" />
                </div>
              )}

              {/* Simulated Storefront Header Navigation */}
              <div 
                style={{ backgroundColor: schema.theme.backgroundColor }}
                className="sticky top-0 z-20 py-4 px-6 md:px-12 flex justify-between items-center border-b border-zinc-100/5 select-none"
              >
                <div className="flex items-center gap-2">
                  <span 
                    style={{ color: schema.theme.primaryColor, fontFamily: schema.theme.fontFamily === 'playfair' ? '"Playfair Display", serif' : 'var(--theme-font)' }} 
                    className={`text-lg md:text-xl font-black ${schema.logoStyle === 'serif' ? 'font-serif' : schema.logoStyle === 'mono' ? 'font-mono' : 'font-sans'}`}
                  >
                    {schema.logoText || schema.shopName}
                  </span>
                </div>
                
                {/* Slogan details on right margin bar */}
                <div className="hidden md:block text-xs text-zinc-650 italic font-medium">
                  {schema.shopSlogan}
                </div>

                {/* Dynamic menu options */}
                <div className="flex items-center gap-4">
                  {schema.navigation.map((nav, nIdx) => (
                    <button
                      key={nIdx}
                      onClick={() => {
                        const target = document.getElementById(`section-anchor-${nav.anchor}`);
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      style={{ color: schema.theme.textColor }}
                      className="text-xs font-medium hover:opacity-80 transition-opacity"
                    >
                      {nav.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main scrollable body rendering components */}
              <div className="flex-1 overflow-y-auto">
                <ComponentRenderer
                  schema={schema}
                  isEditorMode={isEditorMode}
                  selectedSectionId={selectedSectionId}
                  onSelectSection={onSelectSection}
                  onAddToCart={onAddToCart}
                  searchTerm={searchTerm}
                  categoryFilter={categoryFilter}
                />
              </div>

              {/* Professional footer copyright bar */}
              <div 
                style={{ backgroundColor: schema.theme.backgroundColor, color: schema.theme.textColor }}
                className="py-6 px-6 border-t border-zinc-100/10 text-center text-[10px] text-zinc-500 font-sans tracking-wide space-y-2 select-none"
              >
                <div>© 2026 {schema.shopName || schema.logoText}. Powered by aishop.site cloud space. 所有权保留。</div>
                <div className="flex justify-center gap-3 text-zinc-650">
                  <span className="hover:text-zinc-400 cursor-pointer">服务自查条款</span>
                  <span>•</span>
                  <span className="hover:text-zinc-400 cursor-pointer">消费者权益保修</span>
                  <span>•</span>
                  <span className="hover:text-zinc-400 cursor-pointer">隐私合规审计</span>
                </div>
              </div>

            </div>
          </div>
        </>

      </div>

    </div>
  );
}
