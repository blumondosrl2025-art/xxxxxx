import React, { useState } from 'react';
import { StoreSchema, StoreSection, StoreProduct, SectionType, ShopTheme } from '../types';
import { 
  Truck, ShieldCheck, Zap, Heart, Sparkles, Coffee, Box, Tag, Layers, Star,
  MapPin, Phone, Clock, Mail, Check, ChevronDown, CheckCircle, Flame, Gift, ShoppingCart
} from 'lucide-react';

interface ComponentRendererProps {
  schema: StoreSchema;
  isEditorMode: boolean;
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onAddToCart: (product: StoreProduct) => void;
  searchTerm?: string;
  categoryFilter?: string;
}

// Icon helper mapping to prevent importing * and slowing down compilation
const resolveIcon = (name: string, colorClass: string = "text-amber-600") => {
  const iconMap: Record<string, any> = {
    Truck, ShieldCheck, Zap, Heart, Sparkles, Coffee, Box, Tag, Layers, Star,
    MapPin, Phone, Clock, Mail, Check, CheckCircle, Flame, Gift
  };
  // Normalize formatting (e.g. "ShieldCheck" or "shield-check")
  const formattedName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const normalizedKey = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
  const IconComponent = iconMap[normalizedKey] || Sparkles;
  return <IconComponent className={`h-6 w-6 ${colorClass}`} />;
};

export default function ComponentRenderer({
  schema,
  isEditorMode,
  selectedSectionId,
  onSelectSection,
  onAddToCart,
  searchTerm = '',
  categoryFilter = '全部'
}: ComponentRendererProps) {
  const { theme, products, sections } = schema;
  const [faqOpenState, setFaqOpenState] = useState<Record<string, boolean>>({});

  const toggleFaq = (id: string) => {
    setFaqOpenState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Border radius style mappings
  const radiusMap = {
    none: 'rounded-none',
    sm: 'rounded-xs',
    md: 'rounded-md',
    lg: 'rounded-2xl',
    full: 'rounded-full'
  };
  const activeRadius = radiusMap[theme.borderRadius] || 'rounded-md';

  // Apply visual stylings depending on Style Vibe
  const styleConfigs: Record<string, {
    sectionBg: string;
    cardBg: string;
    textTitle: string;
    textBody: string;
    btnClass: string;
    borderClass: string;
    tagClass: string;
  }> = {
    minimal: {
      sectionBg: 'bg-white border-b border-zinc-100',
      cardBg: 'bg-zinc-50 border border-zinc-200 shadow-none',
      textTitle: 'font-sans font-bold tracking-tight text-zinc-900',
      textBody: 'font-sans text-sm text-zinc-500 leading-relaxed',
      btnClass: 'bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-all active:scale-[0.98]',
      borderClass: 'border border-zinc-900',
      tagClass: 'bg-zinc-100 text-zinc-800 text-xs px-2 py-0.5 font-medium'
    },
    cyberpunk: {
      sectionBg: 'bg-zinc-950 border-b border-zinc-900 text-zinc-100',
      cardBg: 'bg-zinc-900 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.05)] text-zinc-100',
      textTitle: 'font-mono font-black tracking-widest text-pink-500 uppercase',
      textBody: 'font-mono text-xs text-zinc-400 leading-relaxed',
      btnClass: 'bg-pink-600 text-white font-mono text-xs px-5 py-2.5 hover:bg-pink-700 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all active:scale-[0.98]',
      borderClass: 'border-2 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.2)]',
      tagClass: 'bg-zinc-800 text-pink-400 font-mono text-xs px-2 py-0.5 border border-pink-500/30'
    },
    warm: {
      sectionBg: 'bg-[#FCF8F2] border-b border-[#EADFCB]',
      cardBg: 'bg-white border border-[#EADFCB] shadow-sm',
      textTitle: 'font-serif font-semibold text-[#5C3E21]',
      textBody: 'font-sans text-sm text-[#7D6652] leading-relaxed',
      btnClass: 'bg-[#895129] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#6D3F1E] transition-all active:scale-[0.98]',
      borderClass: 'border-2 border-[#895129]',
      tagClass: 'bg-[#F2E5D5] text-[#895129] text-xs px-2.5 py-1 rounded-full font-medium'
    },
    luxury: {
      sectionBg: 'bg-[#121212] border-b border-[#222] text-[#F9F9F9]',
      cardBg: 'bg-[#1A1A1A] border border-amber-900/40 text-neutral-300',
      textTitle: 'font-serif italic tracking-wide text-[#C5A880]',
      textBody: 'font-sans text-xs text-neutral-400 leading-relaxed',
      btnClass: 'bg-[#C5A880] text-[#121212] font-serif text-sm font-semibold px-6 py-3 hover:bg-[#D5B88E] transition-all active:scale-[0.98]',
      borderClass: 'border border-[#C5A880]',
      tagClass: 'bg-neutral-800 text-[#C5A880] text-xs border border-amber-500/20 px-2 py-0.5 font-sans'
    },
    retro: {
      sectionBg: 'bg-[#FAF4E8] border-b-2 border-black',
      cardBg: 'bg-[#FFF] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      textTitle: 'font-mono font-extrabold text-black uppercase',
      textBody: 'font-mono text-xs text-zinc-700 leading-relaxed',
      btnClass: 'bg-[#FBBF24] text-black font-semibold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-5 py-2.5 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-[0.98]',
      borderClass: 'border-2 border-black',
      tagClass: 'bg-stone-100 text-black border border-black text-xs px-2 py-0.5'
    },
    modern: {
      sectionBg: 'bg-neutral-50 border-b border-neutral-200',
      cardBg: 'bg-white shadow-lg shadow-neutral-100 border border-neutral-100',
      textTitle: 'font-sans font-semibold text-neutral-950',
      textBody: 'font-sans text-sm text-neutral-600 leading-relaxed',
      btnClass: 'bg-neutral-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition-all active:scale-[0.98]',
      borderClass: 'border border-neutral-100',
      tagClass: 'bg-neutral-100 text-neutral-700 text-xs px-2.5 py-1 font-medium'
    },
    bento: {
      sectionBg: 'bg-zinc-50 border-b border-zinc-200/50',
      cardBg: 'bg-white border border-zinc-200/80 shadow-xs transition-shadow duration-300 hover:shadow-xs',
      textTitle: 'font-sans font-bold tracking-tight text-zinc-900',
      textBody: 'font-sans text-sm text-zinc-500 leading-relaxed',
      btnClass: 'bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-[0.98]',
      borderClass: 'border border-zinc-200/80',
      tagClass: 'bg-indigo-50 text-indigo-600 text-[10px] px-2.5 py-1 font-bold rounded'
    }
  };

  const style = styleConfigs[theme.styleType] || styleConfigs.modern;

  const resolveButtonStyle = (purpose: 'hero' | 'cart' | 'submit') => {
    // Determine custom text
    const text = purpose === 'hero' 
      ? (theme.btnTextHero || "立即臻选好物") 
      : purpose === 'cart' 
        ? (theme.btnTextCart || "加购") 
        : (theme.btnTextContact || "提交预约");

    // Shape/Border Radius
    let radiusClass = "";
    const shape = theme.buttonShape;
    if (shape === 'square') {
      radiusClass = "rounded-none";
    } else if (shape === 'pill') {
      radiusClass = "rounded-full";
    } else if (shape === 'rounded') {
      radiusClass = "rounded-lg";
    } else {
      // Default fallback matching theme's borderRadius
      radiusClass = theme.borderRadius === 'full' 
        ? 'rounded-full' 
        : theme.borderRadius === 'none' 
          ? 'rounded-none' 
          : theme.borderRadius === 'lg' 
            ? 'rounded-xl' 
            : 'rounded-lg';
    }

    // Size / Padding
    let sizeClass = "";
    const bSize = theme.buttonSize;
    if (bSize === 'compact') {
      sizeClass = "px-3.5 py-1.5 text-xs font-semibold";
    } else if (bSize === 'large') {
      sizeClass = "px-8 py-3.5 text-base font-bold";
    } else {
      sizeClass = purpose === 'cart' ? "px-3.5 py-1.5 text-xs font-semibold" : "px-5 py-2.5 text-sm font-bold";
    }

    // Colors & Border Style
    const bStyle = theme.buttonStyle || 'solid';
    
    let styleAttr: React.CSSProperties = {};
    let customClass = "transition-all duration-200 active:scale-[0.98] select-none cursor-pointer flex items-center justify-center gap-1.5 text-center";

    // If neither styleType nor button properties are customized, we inherit the style preset defaults
    if (!theme.buttonStyle && !theme.buttonShape && !theme.buttonSize) {
      customClass += ` ${style.btnClass}`;
      if (theme.borderRadius === 'full') {
        styleAttr.borderRadius = '9999px';
      } else if (theme.borderRadius === 'none') {
        styleAttr.borderRadius = '0px';
      }
      if (purpose !== 'cart' && theme.styleType !== 'retro' && theme.styleType !== 'luxury') {
        styleAttr.backgroundColor = theme.primaryColor;
      }
    } else {
      // Custom overrides are defined
      if (bStyle === 'outline') {
        styleAttr = {
          borderColor: theme.primaryColor,
          color: theme.primaryColor,
          borderWidth: '1.5px',
          borderStyle: 'solid',
          backgroundColor: 'transparent'
        };
        customClass += " hover:bg-neutral-500/5 hover:-translate-y-0.5 shadow-xs";
      } else if (bStyle === 'glass') {
        styleAttr = {
          backgroundColor: `${theme.primaryColor}15`,
          color: theme.primaryColor,
          borderColor: `${theme.primaryColor}35`,
          borderWidth: '1px',
          borderStyle: 'solid',
          backdropFilter: 'blur(8px)'
        };
        customClass += " hover:brightness-110 hover:-translate-y-0.5 shadow-xs";
      } else {
        // solid
        styleAttr = {
          backgroundColor: theme.primaryColor,
          color: '#FFFFFF'
        };
        customClass += " text-white hover:brightness-110 hover:-translate-y-0.5 shadow-xs";
      }
    }

    return { className: `${customClass} ${radiusClass} ${sizeClass}`, style: styleAttr, text };
  };

  // Filter products based on search term and category filter
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.includes(searchTerm) || p.description.includes(searchTerm);
    if (categoryFilter === '全部') return matchSearch;
    return matchSearch && p.category === categoryFilter;
  });

  // Extract all categories
  const categories = ['全部', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <div id="shopview-viewport-root" className="w-full h-full select-none" style={{ backgroundColor: theme.backgroundColor }}>
      {sections.map((section: StoreSection, sIdx: number) => {
        const isSelected = selectedSectionId === section.id;
        
        return (
          <div
            key={section.id}
            id={`section-anchor-${section.id}`}
            onClick={() => isEditorMode && onSelectSection(section.id)}
            className={`
              relative group transition-all duration-200
              ${isEditorMode ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500' : ''}
              ${isSelected && isEditorMode ? 'ring-2 ring-indigo-500 bg-indigo-500/5' : ''}
              ${style.sectionBg}
              py-12 md:py-20 px-6 md:px-12
            `}
          >
            {/* Editor helper tags */}
            {isEditorMode && (
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow z-10 flex items-center gap-1">
                <span>组件: {section.type.toUpperCase()}</span>
                {isSelected && <span className="text-amber-300">• 正在编辑</span>}
              </div>
            )}

            <div className="max-w-5xl mx-auto">
              
              {/* RENDER HERO BILLBOARD */}
              {section.type === 'hero' && (
                <div className={`space-y-6 ${section.alignment === 'center' ? 'text-center' : section.alignment === 'right' ? 'text-right' : 'text-left'}`}>
                  {section.subtitle && (
                    <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 bg-neutral-100 inline-block text-zinc-800 rounded-full select-none" style={{ color: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` }}>
                      {section.subtitle}
                    </span>
                  )}
                  <h1 className={`text-3xl md:text-5xl lg:text-6xl font-black leading-tight ${style.textTitle}`}>
                    {section.title}
                  </h1>
                  {section.content && (
                    <p className={`max-w-2xl text-base md:text-lg mb-8 ${section.alignment === 'center' ? 'mx-auto' : ''} ${style.textBody}`}>
                      {section.content}
                    </p>
                  )}
                  <div className="pt-4">
                    {(() => {
                      const btnHero = resolveButtonStyle('hero');
                      return (
                        <button 
                          onClick={() => {
                            const productsSection = document.getElementById('section-anchor-products');
                            if (productsSection) {
                              productsSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className={btnHero.className}
                          style={btnHero.style}
                        >
                          {btnHero.text}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* RENDER PRODUCTS LIST */}
              {section.type === 'products' && (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className={`text-2xl md:text-3xl font-extrabold ${style.textTitle}`}>{section.title}</h2>
                    {section.subtitle && <p className={`${style.textBody}`}>{section.subtitle}</p>}
                  </div>

                  {/* Categories filtering bar */}
                  {!isEditorMode && categories.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-2 pb-4 border-b border-zinc-100">
                      {categories.map((cat, idx) => (
                        <button
                          key={idx}
                          onClick={() => {}} // Category handling is wired in local wrapper
                          style={{ 
                            borderRadius: '9999px',
                            backgroundColor: cat === categoryFilter ? theme.primaryColor : 'transparent',
                            color: cat === categoryFilter ? '#FFF' : theme.textColor,
                            borderColor: cat === categoryFilter ? theme.primaryColor : 'rgba(0,0,0,0.1)'
                          }}
                          className="px-3 py-1 text-xs border transition-all hover:scale-105"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={theme.styleType === 'bento' ? "grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
                    {filteredProducts.map((p, idx) => {
                      const isBentoFeatured = theme.styleType === 'bento' && idx === 0;
                      return (
                        <div 
                          key={p.id} 
                          className={`
                            flex overflow-hidden group transition-all duration-300
                            ${theme.styleType === 'bento' ? 'rounded-2xl border border-zinc-200/90 bg-white hover:shadow-md hover:border-zinc-300' : `${style.cardBg} ${activeRadius}`}
                            ${isBentoFeatured ? 'md:col-span-2 flex-col md:flex-row' : 'flex-col'}
                          `}
                        >
                          <div className={`relative overflow-hidden bg-zinc-50 ${isBentoFeatured ? 'md:w-1/2 aspect-square md:aspect-auto min-h-[250px]' : 'aspect-square'}`}>
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover transform scale-100 group-hover:scale-102 transition-transform duration-550"
                              referrerPolicy="no-referrer"
                            />
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span 
                                style={{ backgroundColor: theme.primaryColor }}
                                className="absolute top-3 left-3 text-[10px] text-white px-2 py-0.5 font-bold uppercase tracking-wider rounded-md shadow-xs"
                              >
                                特惠
                              </span>
                            )}
                          </div>

                          <div className={`flex-1 p-5 flex flex-col justify-between space-y-3 ${isBentoFeatured ? 'md:w-1/2' : ''}`}>
                            <div className="space-y-2">
                              {p.category && (
                                <span className={`
                                  uppercase border-none text-[9px] font-bold px-2 py-0.5 rounded-full w-fit block
                                  ${theme.styleType === 'bento' ? 'bg-indigo-50 text-indigo-600' : style.tagClass}
                                `}>
                                  {p.category}
                                </span>
                              )}
                              <h3 className="text-base font-bold text-zinc-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                              <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">{p.description}</p>
                            </div>

                            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-extrabold" style={{ color: theme.primaryColor }}>
                                  ¥{p.price}
                                </span>
                                {p.originalPrice && (
                                  <span className="text-xs text-zinc-400 line-through">
                                    ¥{p.originalPrice}
                                  </span>
                                )}
                              </div>

                              {(() => {
                                const btnCart = resolveButtonStyle('cart');
                                return (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddToCart(p);
                                    }}
                                    className={btnCart.className}
                                    style={btnCart.style}
                                  >
                                    <ShoppingCart className="h-3.5 w-3.5" />
                                    <span>{btnCart.text}</span>
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-sm text-zinc-400">没有找到匹配检索的臻选好物哦。</p>
                    </div>
                  )}
                </div>
              )}

              {/* RENDER FEATURES GRID */}
              {section.type === 'features' && section.items && (
                <div className="space-y-12">
                  <div className="text-center space-y-2">
                    <h2 className={`text-2xl md:text-3xl font-extrabold ${style.textTitle}`}>{section.title}</h2>
                    {section.subtitle && <p className={`${style.textBody}`}>{section.subtitle}</p>}
                  </div>

                  <div className={theme.styleType === 'bento' ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "grid grid-cols-1 md:grid-cols-3 gap-8"}>
                    {section.items.map((item, idx) => {
                      const isBentoLarge = theme.styleType === 'bento' && idx === 0;
                      return (
                        <div 
                          key={item.id || idx} 
                          className={`
                            p-6 flex flex-col justify-between transition-all duration-300
                            ${theme.styleType === 'bento' ? 'rounded-2xl border border-zinc-200 bg-white hover:shadow-xs' : `${style.cardBg} ${activeRadius}`}
                            ${isBentoLarge ? 'md:col-span-2' : ''}
                          `}
                        >
                          <div className="space-y-4">
                            <div className="p-3 inline-block rounded-xl bg-indigo-50 text-indigo-650 w-fit">
                              {resolveIcon(item.icon || 'Sparkles', `text-indigo-600`)}
                            </div>
                            <h3 className="text-base font-bold text-zinc-900">{item.title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed font-sans">{item.description}</p>
                          </div>
                          {isBentoLarge && (
                            <div className="mt-6 p-4 bg-zinc-50 rounded-xl border border-zinc-150 text-[10px] font-mono text-zinc-400 flex justify-between items-center select-none">
                              <span>METRIC COCKPIT STANDARD</span>
                              <span className="text-indigo-600 font-bold font-sans">100% QUALITY ASSIGN</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* RENDER GALLERY IMAGES */}
              {section.type === 'gallery' && section.items && (
                <div className="space-y-12">
                  <div className="text-center space-y-2">
                    <h2 className={`text-2xl md:text-3xl font-extrabold ${style.textTitle}`}>{section.title}</h2>
                    {section.subtitle && <p className={`${style.textBody}`}>{section.subtitle}</p>}
                  </div>

                  <div className={theme.styleType === 'bento' ? "grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}>
                    {section.items.map((item, idx) => {
                      let spanClass = "";
                      if (theme.styleType === 'bento') {
                        if (idx % 3 === 0) spanClass = "md:col-span-2 md:row-span-1 h-full";
                        else if (idx % 3 === 1) spanClass = "md:col-span-1 md:row-span-2 h-full";
                        else spanClass = "md:col-span-1 md:row-span-1 h-full";
                      }
                      return (
                        <div 
                          key={item.id || idx}
                          className={`
                            relative group overflow-hidden transition-all duration-300
                            ${theme.styleType === 'bento' ? 'rounded-2xl border border-zinc-200/80 bg-white hover:shadow-xs' : `${style.borderClass} ${activeRadius}`}
                            ${spanClass}
                          `}
                        >
                          <img
                            src={item.image}
                            alt={item.caption || "Gallery item"}
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-102 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          {item.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black/75 backdrop-blur-xs p-3.5 text-white text-xs text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-sans">
                              {item.caption}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* RENDER ABOUT STORY */}
              {section.type === 'about' && (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center`}>
                  <div className="space-y-6">
                    <h2 className={`text-2xl md:text-4xl font-extrabold ${style.textTitle}`}>{section.title}</h2>
                    <div className={`text-sm tracking-wide leading-relaxed space-y-4 text-zinc-700 whitespace-pre-line ${style.textBody}`}>
                      {section.content}
                    </div>
                  </div>
                  <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-lg border-none">
                    <img 
                      src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=800&q=80" 
                      alt="Brand focus details" 
                      className="w-full h-full object-cover filter brightness-95"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>
                </div>
              )}

              {/* RENDER TESTIMONIALS */}
              {section.type === 'testimonials' && section.items && (
                <div className="space-y-12">
                  <div className="text-center space-y-2">
                    <h2 className={`text-2xl md:text-3xl font-extrabold ${style.textTitle}`}>{section.title}</h2>
                    {section.subtitle && <p className={`${style.textBody}`}>{section.subtitle}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {section.items.map((item, idx) => (
                      <div 
                        key={item.id || idx} 
                        className={`p-6 space-y-4 flex flex-col justify-between ${style.cardBg} ${activeRadius}`}
                      >
                        <div className="space-y-3">
                          <div className="flex gap-1 text-amber-500">
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                          <p className={`italic ${style.textBody}`}>“ {item.content} ”</p>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-zinc-100/20">
                          {item.avatar && (
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-zinc-800">{item.name}</h4>
                            <p className="text-xs text-zinc-400">{item.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RENDER FAQS */}
              {section.type === 'faq' && section.items && (
                <div className="space-y-12">
                  <div className="text-center space-y-2">
                    <h2 className={`text-2xl md:text-3xl font-extrabold ${style.textTitle}`}>{section.title}</h2>
                    {section.subtitle && <p className={`${style.textBody}`}>{section.subtitle}</p>}
                  </div>

                  <div className="max-w-3xl mx-auto space-y-4">
                    {section.items.map((item, idx) => {
                      const isOpen = !!faqOpenState[item.id || idx];
                      return (
                        <div 
                          key={item.id || idx}
                          className={`border border-zinc-250 ${style.cardBg} ${activeRadius} overflow-hidden`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleFaq(item.id || idx)}
                            className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm hover:bg-neutral-500/5 transition-colors"
                          >
                            <span>{item.question}</span>
                            <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {isOpen && (
                            <div className="p-5 pt-0 border-t border-zinc-100/10">
                              <p className={`pt-4 ${style.textBody}`}>{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* RENDER CONTACT FORM / INFO */}
              {section.type === 'contact' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
                  <div className={`p-8 flex flex-col justify-between ${style.cardBg} ${activeRadius}`}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs uppercase font-bold tracking-widest text-[#999]" style={{ color: theme.primaryColor }}>
                          咨询联系
                        </span>
                        <h2 className={`text-2xl md:text-3xl font-extrabold ${style.textTitle}`}>{section.title}</h2>
                        {section.subtitle && <p className={`${style.textBody}`}>{section.subtitle}</p>}
                      </div>

                      <div className="space-y-4 text-xs">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-zinc-400 mt-1 flex-shrink-0" />
                          <div className="whitespace-pre-line leading-relaxed text-zinc-600">{section.content || "地址筹备中，敬请电话垂询"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-150/10 flex items-center gap-4 text-xs text-zinc-400">
                      <Clock className="h-4 w-4" />
                      <span>周一至周日全竭诚为您服务</span>
                    </div>
                  </div>

                  {/* Submission form */}
                  <div className={`p-8 border border-zinc-200 ${style.cardBg} ${activeRadius} space-y-4`}>
                    <h3 className="text-sm font-bold text-zinc-800">发送联络意向 / 预约</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-xs bg-transparent focus:outline-none focus:border-zinc-500"
                          placeholder="您的名称"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-xs bg-transparent focus:outline-none focus:border-zinc-500"
                          placeholder="电话热线"
                        />
                      </div>
                      <div>
                        <textarea
                          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-xs bg-transparent focus:outline-none focus:border-zinc-500 h-20"
                          placeholder="我想咨询/预订..."
                        />
                      </div>
                    </div>

                    {(() => {
                      const btnSubmit = resolveButtonStyle('submit');
                      return (
                        <button
                          type="button"
                          onClick={() => alert('意向提交成功！我们会尽快联系您。')}
                          className={`w-full ${btnSubmit.className}`}
                          style={btnSubmit.style}
                        >
                          {btnSubmit.text}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
}
