import React, { useState, useEffect } from 'react';
import { StoreSchema } from '../types';
import { 
  Cloud, Check, Loader, Rocket, Globe, Copy, Share2, Award, QrCode, Laptop, ExternalLink, RefreshCw 
} from 'lucide-react';
import { generateShareLinks } from '../lib/shareUtils';

interface DeploymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  schema: StoreSchema;
}

export default function DeploymentPopup({ isOpen, onClose, schema }: DeploymentPopupProps) {
  const [subdomain, setSubdomain] = useState('');
  const [deployStep, setDeployStep] = useState<'config' | 'deploying' | 'complete'>('config');
  const [activePopupTab, setActivePopupTab] = useState<'share' | 'deploy'>('share');
  const [pipelineIndex, setPipelineIndex] = useState(0);
  
  // Independent copy feedback states
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [copiedEdit, setCopiedEdit] = useState(false);

  // Initialize subdomain from shop name or logo text
  useEffect(() => {
    if (schema.shopName) {
      const normalized = schema.shopName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // remove special
        .replace(/\s+/g, '-'); // replace space with dashes
      setSubdomain(normalized || 'my-shop');
    }
  }, [schema]);

  if (!isOpen) return null;

  const pipelines = [
    '校验网店结构化 Schema 兼容性及数据完整性...',
    '自动优化并分拆各区域静态图片与 Unsplash 资源 CDN 权重...',
    '申请并锁定免费三级子域名规则及全球边缘路由解析...',
    '编译精简客户端单页渲染包，注入 React 与 Tailwind V4 引擎...',
    '配置 HTTPS SSL 多端泛解析安全防线与离线静态加速机制...',
    '正在冷启动 Cloud Run 云原生计算实例，完成发布部署并注入健康监察规则...'
  ];

  const handleStartDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomain) return;
    setDeployStep('deploying');
    setPipelineIndex(0);
  };

  // Run pipeline sequential intervals
  useEffect(() => {
    if (deployStep === 'deploying') {
      const interval = setInterval(() => {
        setPipelineIndex((prev) => {
          if (prev >= pipelines.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setDeployStep('complete');
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [deployStep, pipelines.length]);

  const shopUrl = `https://${subdomain || 'shop'}.aishop.site`;

  // Generate share links from current JSON state
  const { editUrl, previewUrl } = generateShareLinks(schema);

  const handleCopyText = (text: string, type: 'domain' | 'preview' | 'edit') => {
    navigator.clipboard.writeText(text);
    if (type === 'domain') {
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    } else if (type === 'preview') {
      setCopiedPreview(true);
      setTimeout(() => setCopiedPreview(false), 2000);
    } else if (type === 'edit') {
      setCopiedEdit(true);
      setTimeout(() => setCopiedEdit(false), 2000);
    }
  };

  // Generate QR code pointing to the real spectator preview URL
  // api.qrserver.com generates dynamic high-performance QR codes instantly
  const previewQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(previewUrl)}&color=15-23-42&bgcolor=255-255-255&margin=2`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-300 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Decorative ambient primary colored banner */}
        <div style={{ backgroundColor: schema.theme.primaryColor }} className="absolute inset-x-0 top-0 h-1.5 opacity-90 filter brightness-110" />

        {/* STEP 1: CONFIGURATION HEADER AND TAB SELECTION */}
        {deployStep === 'config' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-150">一键分享与部署中心</h3>
                <p className="text-xs text-zinc-500 mt-0.5">提供真机调试、多端协作与品牌独立域名托管方案。</p>
              </div>
            </div>

            {/* Custom Interactive Tab Headers */}
            <div className="flex border-b border-zinc-800 bg-zinc-950/40 p-1 rounded-lg border">
              <button
                type="button"
                onClick={() => setActivePopupTab('share')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 select-none ${
                  activePopupTab === 'share'
                    ? 'bg-zinc-800 text-indigo-400 font-bold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-350'
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>一键加密协同分享 (实时真机)</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePopupTab('deploy')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 select-none ${
                  activePopupTab === 'deploy'
                    ? 'bg-zinc-800 text-indigo-400 font-bold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-350'
                }`}
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>独立品牌域名部署 (静态托管)</span>
              </button>
            </div>

            {/* TAB CONTENT A —— SECURE URL ENCODED SHARING BLOCK */}
            {activePopupTab === 'share' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    💡 什么是「一键加密免签分享」？
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                    此方案将您的网店配置、商品货架及色彩数据<b>直接编码为轻量 URL 密钥</b>，不产生冗余数据碎片。任何人打开链接均能瞬间完成冷启动，还原完整的高保真交互场景！
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Option 1: Spectator view link */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-zinc-400 font-semibold">📱 顾客端真机预览链接 (Spectator / Mobile Mode)</span>
                      <span className="text-[10px] text-emerald-500 font-mono">秒速打开 纯净体验</span>
                    </div>
                    <div className="flex rounded-md border border-zinc-700 bg-zinc-950 overflow-hidden text-xs">
                      <input
                        readOnly
                        type="text"
                        className="flex-1 bg-transparent px-3 py-2 text-indigo-300 font-mono outline-hidden select-all"
                        value={previewUrl}
                        placeholder="正在生成加密密钥..."
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyText(previewUrl, 'preview')}
                        className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white px-3.5 border-l border-zinc-750 font-bold select-none flex items-center gap-1 transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>{copiedPreview ? '已复制' : '复制'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-605 text-zinc-500 leading-relaxed">
                      适合分享给微信好友、发朋友圈或用来真机实测。隐藏所有编辑器菜单与控制轨，全屏饱满展示品牌细节。
                    </p>
                  </div>

                  {/* Option 2: Active Co-edit link */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-zinc-400 font-semibold">👥 伴侣开发协同链接 (Co-edit Workspace Link)</span>
                      <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1 border border-zinc-750 rounded font-normal">连带 AI 助手</span>
                    </div>
                    <div className="flex rounded-md border border-zinc-700 bg-zinc-950 overflow-hidden text-xs">
                      <input
                        readOnly
                        type="text"
                        className="flex-1 bg-transparent px-3 py-2 text-indigo-405 text-zinc-300 font-mono outline-hidden select-all"
                        value={editUrl}
                        placeholder="正在生成加密密钥..."
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyText(editUrl, 'edit')}
                        className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white px-3.5 border-l border-zinc-750 font-bold select-none flex items-center gap-1 transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>{copiedEdit ? '已复制' : '复制'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      适合与设计伙伴开会对稿。对方点按将加载该网店配置，并同步唤醒左侧的 AI 对话窗口辅助进行二次调优！
                    </p>
                  </div>
                </div>

                {/* QR Code Segment */}
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl flex gap-4 items-center">
                  <div className="h-24 w-24 bg-white p-1.5 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 border border-zinc-200">
                    <img 
                      src={previewQrUrl} 
                      alt="真机预览二维码"
                      className="h-20 w-20"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                      <span>📱 真机秒变独立收银台</span>
                    </div>
                    <p className="text-[10.5px] text-zinc-450 text-zinc-500 leading-normal font-sans">
                      拿出您的 iPhone 或 Android 手机摄像头直接扫二维码，即可在掌心浏览器中实时加购物车、体验流畅的极简结算流程。多点触控布局瞬间就位。
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-32 rounded-lg bg-zinc-800 border border-zinc-750 text-zinc-300 py-2 text-xs font-semibold hover:bg-zinc-700 transition-colors select-none"
                  >
                    留在工作台
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT B —— DOMAIN HOSTING CONFIGURATION CONTAINER */}
            {activePopupTab === 'deploy' && (
              <form onSubmit={handleStartDeploy} className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
                  <div className="flex justify-between items-center text-xs text-zinc-500 pb-2 border-b border-zinc-900">
                    <span>网店品牌: <b>{schema.shopName}</b></span>
                    <span>货架规格: <b>{schema.products.length} 款优选</b></span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    部署后，系统的 Vercel / Cloud Run 云集成引擎会锁定该子域名，进行生产环境极度零依赖打包，分配专用的全球 HTTP 泛解析静态路由节点。
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-medium block">请输入您喜欢的专属商铺子域名 (Subdomain)</label>
                  <div className="flex rounded-md border border-zinc-755 border-zinc-700 bg-zinc-950 overflow-hidden text-sm">
                    <span className="bg-zinc-800 text-zinc-400 px-3 py-2 border-r border-zinc-700 flex items-center select-none">https://</span>
                    <input
                      required
                      type="text"
                      pattern="[a-z0-9-]+"
                      title="仅允许输入小写字母、数字及横杠 [a-z0-9-]"
                      placeholder="coffeelab"
                      className="flex-1 bg-transparent px-3 py-2 text-zinc-150 focus:outline-none focus:border-indigo-500"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().trim())}
                    />
                    <span className="bg-zinc-800 text-zinc-400 px-3 py-2 border-l border-zinc-700 flex items-center select-none">.aishop.site</span>
                  </div>
                  <p className="text-[10px] text-zinc-650 leading-relaxed">
                    提示：必须为独一无二的拼音或英文字母组合，例如 <i>coffeelab</i>, <i>haixiangshop</i>.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-md border border-zinc-800 py-2.5 text-xs font-semibold hover:bg-zinc-850 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: schema.theme.primaryColor }}
                    className="flex-2 rounded-md py-2.5 text-xs font-semibold text-white filter brightness-95 hover:brightness-105 transition-all outline-none"
                  >
                    立即打包部署上线
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* STEP 2: PIPELINE COMPILES */}
        {deployStep === 'deploying' && (
          <div className="space-y-6 py-4 flex-1 overflow-y-auto">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="relative">
                <div style={{ borderColor: `${schema.theme.primaryColor}30`, borderTopColor: schema.theme.primaryColor }} className="h-14 w-14 rounded-full border-4 border-solid animate-spin" />
                <Cloud className="h-6 w-6 text-zinc-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-200">正在打包编译您的 AI 专属网店...</h4>
                <p className="text-xs text-zinc-500 mt-1">云原生网点生成中，这可能需要花费 3 - 5 秒。</p>
              </div>
            </div>

            {/* Simulated steps */}
            <div className="space-y-2 max-w-sm mx-auto">
              {pipelines.map((step, idx) => {
                const isDone = pipelineIndex > idx;
                const isActive = pipelineIndex === idx;
                return (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-zinc-600 transition-colors duration-200">
                    <div className="mt-0.5 flex-shrink-0">
                      {isDone ? (
                        <div className="rounded-full bg-emerald-900/30 border border-emerald-500/20 p-0.5 flex items-center justify-center">
                          <Check className="h-3 w-3 text-emerald-400" />
                        </div>
                      ) : isActive ? (
                        <div className="rounded-full animate-pulse bg-indigo-900/40 p-0.5 flex items-center justify-center">
                          <Loader className="h-3 w-3 text-indigo-400 animate-spin" />
                        </div>
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-mono select-none">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <span className={`leading-relaxed ${isActive ? 'text-zinc-200 font-semibold' : isDone ? 'text-zinc-500' : 'text-zinc-700'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: PIPELINE SUCCESS */}
        {deployStep === 'complete' && (
          <div className="space-y-6 flex-1 overflow-y-auto pr-1">
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <div className="rounded-full bg-emerald-950 p-3 border border-emerald-900 animate-bounce">
                <Award className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-150">🎉 恭喜！网店已部署上市！</h3>
                <p className="text-xs text-zinc-500 mt-1">云渲染配置已固化，全球边缘 CDN 节点同步上线成功。</p>
              </div>
            </div>

            {/* Custom domain share links */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-zinc-505 text-zinc-500 font-bold uppercase tracking-wider">
                  <span>独立专属商铺域名 URL</span>
                  <span className="text-emerald-500 text-[9px]">主站解析成功</span>
                </div>
                <div className="flex rounded-md border border-zinc-800 bg-zinc-90 w bg-zinc-900 overflow-hidden text-xs">
                  <input
                    readOnly
                    type="text"
                    className="flex-1 bg-transparent px-3 py-1.5 text-emerald-400 font-mono outline-hidden select-all"
                    value={shopUrl}
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyText(shopUrl, 'domain')}
                    className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white px-3 border-l border-zinc-800 font-semibold select-none flex items-center gap-1 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedDomain ? '已复制' : '复制'}</span>
                  </button>
                </div>
              </div>

              {/* URL Encoded direct preview link as backup trigger */}
              <div className="space-y-1.5 pb-2 border-b border-zinc-900">
                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  <span>双向同步加密备用短链 (Spectator Preview URL)</span>
                  <span className="text-indigo-400 text-[9px]">免签实时访问</span>
                </div>
                <div className="flex rounded-md border border-zinc-805 border-zinc-800 bg-zinc-900 overflow-hidden text-xs">
                  <input
                    readOnly
                    type="text"
                    className="flex-1 bg-transparent px-3 py-1.5 text-indigo-300 font-mono outline-hidden select-all"
                    value={previewUrl}
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyText(previewUrl, 'preview')}
                    className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white px-3 border-l border-zinc-850 font-semibold select-none flex items-center gap-1 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedPreview ? '已复制' : '复制'}</span>
                  </button>
                </div>
              </div>

              {/* QR Code and Multi-terminal preview active integration */}
              <div className="flex gap-4 items-center pt-1">
                <div className="h-20 w-20 flex-shrink-0 bg-white p-1 rounded-lg flex items-center justify-center shadow-lg border border-zinc-200">
                  <img 
                    src={previewQrUrl} 
                    alt="实时高能真机预览" 
                    className="h-16 w-16 text-black"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1 font-sans">
                  <div className="text-xs font-bold text-zinc-300">📱 扫码即享真机手机加购交互</div>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    真正的无感流合一技术：使用微信、浏览器照相机扫码，即可将您当前工作台的临时设计快照瞬间同步加载到您的真正手持机型上运行。
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeployStep('config');
                  setActivePopupTab('share');
                }}
                className="flex-1 rounded-lg border border-zinc-800 py-2.5 text-xs font-semibold hover:bg-zinc-850 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
                <span>制作其他分享</span>
              </button>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: schema.theme.primaryColor }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold text-white filter brightness-95 hover:brightness-105 transition-all text-center select-none"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>访问线上网店</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
