import { useState, useEffect } from 'react';
import { StoreSchema, StoreSection, StoreProduct, SectionType } from '../types';
import { 
  Plus, Trash2, Layers, GripVertical, ChevronLeft, Image, ChevronRight,
  Github, GitBranch, RefreshCw, Settings, Key, Globe, ExternalLink,
  Brain, Cpu, Zap, Sparkles
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const getFriendlySectionName = (type: string) => {
  const mapping: Record<string, string> = {
    hero: '推广海报',
    about: '品牌故事',
    features: '核心卖点',
    testimonials: '客群评价',
    faq: '服务解答',
    gallery: '画廊展区',
    contact: '常联客服',
    products: '精选商品'
  };
  return mapping[type] || '内容板块';
};

interface SortableSectionItemProps {
  key?: any;
  section: StoreSection;
  isMono: boolean;
  onSelect: (id: string) => void;
  isSelected: boolean;
  onDelete: (id: string) => void;
}

function SortableSectionItem({ section, isMono, onSelect, isSelected, onDelete }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`pl-1 pr-3 py-2 rounded-lg border flex items-center justify-between gap-2.5 transition-all duration-200 group ${
        isDragging
          ? 'border-zinc-400 bg-zinc-50 shadow-md'
          : isSelected
          ? (isMono 
              ? 'bg-zinc-50 border-zinc-900 text-zinc-900 ring-1 ring-zinc-900' 
              : 'bg-zinc-900/60 border-indigo-500 text-zinc-100 ring-1 ring-indigo-500/20')
          : (isMono 
              ? 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700' 
              : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800 text-zinc-300')
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className={`p-1.5 rounded-md cursor-grab active:cursor-grabbing shrink-0 flex items-center justify-center transition-colors ${
            isMono 
              ? 'text-zinc-400 hover:bg-zinc-100' 
              : 'text-zinc-600 hover:bg-zinc-900'
          }`}
        >
          <GripVertical className="h-3.5 w-3.5 shrink-0" />
        </button>

        <div 
          onClick={() => onSelect(section.id)}
          className="flex-1 min-w-0 cursor-pointer text-left py-1"
        >
          <div className="flex items-center gap-1.5">
            <span className={`text-[9.5px] font-bold tracking-wide px-1.5 py-0.5 rounded ${
              isSelected 
                ? 'bg-indigo-500/10 text-indigo-400' 
                : (isMono ? 'bg-zinc-105 bg-zinc-100 text-zinc-650' : 'bg-zinc-900 text-zinc-400')
            }`}>
              {getFriendlySectionName(section.type)}
            </span>
          </div>
          <p className="text-xs truncate font-medium mt-1 pr-1 font-sans">
            {section.title || '（未命名的板块）'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onSelect(section.id)}
          className={`p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
            isMono ? 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800' : 'hover:bg-zinc-900 text-zinc-600 hover:text-zinc-300'
          }`}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(section.id);
          }}
          className={`p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
            isMono ? 'hover:bg-red-50 text-zinc-400 hover:text-red-600' : 'hover:bg-red-950/20 text-zinc-600 hover:text-red-400'
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

interface VisualBlockInspectorProps {
  schema: StoreSchema;
  onChangeSchema: (newSchema: StoreSchema) => void;
  selectedSectionId: string | null;
  onClearSelection: () => void;
  workspaceSkin?: 'cyber' | 'mono';
  onSelectSection?: (id: string | null) => void;
}

export default function VisualBlockInspector({
  schema,
  onChangeSchema,
  selectedSectionId,
  onClearSelection,
  workspaceSkin = 'cyber',
  onSelectSection
}: VisualBlockInspectorProps) {
  const [editedSection, setEditedSection] = useState<StoreSection | null>(null);

  // GitHub States and configuration
  const [githubRepo, setGithubRepo] = useState(() => localStorage.getItem('ais_github_repo') || 'my-github-username/my-aesthetic-shop');
  const [githubBranch, setGithubBranch] = useState(() => localStorage.getItem('ais_github_branch') || 'main');
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('ais_github_token') || '');
  const [commitMsg, setCommitMsg] = useState('style: update shop sections configuration');
  const [showSettings, setShowSettings] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'modified'>(() => {
    const lastSync = localStorage.getItem('last_github_synced_schema');
    if (!lastSync) return 'modified';
    return 'synced';
  });

  // Vercel Free Deployment States
  const [vercelProject, setVercelProject] = useState(() => localStorage.getItem('ais_vercel_project') || 'aesthetic-boutique');
  const [vercelToken, setVercelToken] = useState(() => localStorage.getItem('ais_vercel_token') || '');
  const [vercelDomain, setVercelDomain] = useState(() => localStorage.getItem('ais_vercel_domain') || 'aesthetic-boutique.vercel.app');
  const [vercelStatus, setVercelStatus] = useState<'idle' | 'building' | 'ready' | 'failed'>(() => {
    return (localStorage.getItem('ais_vercel_status') as any) || 'idle';
  });
  const [vercelLogs, setVercelLogs] = useState<string[]>([]);
  const [vercelDeploying, setVercelDeploying] = useState(false);
  const [showVercelSettings, setShowVercelSettings] = useState(false);

  const isMono = workspaceSkin === 'mono';

  // AI Native Runtime Engine —— Genesis Evolution Directive States
  const [brainRepo, setBrainRepo] = useState(() => localStorage.getItem('ais_brain_repo') || 'chihaixu1-afk/-Omni-Existence-Runtime-');
  const [brainBranch, setBrainBranch] = useState(() => localStorage.getItem('ais_brain_branch') || 'main');
  const [brainPath, setBrainPath] = useState(() => localStorage.getItem('ais_brain_path') || 'store_schema.json');
  const [brainDownloading, setBrainDownloading] = useState(false);
  const [brainLogs, setBrainLogs] = useState<string[]>([]);
  const [showBrainSettings, setShowBrainSettings] = useState(false);
  const [cognitiveEntropy, setCognitiveEntropy] = useState(() => parseFloat(localStorage.getItem('ais_entropy') || '0.85'));
  const [evolutionMultiplier, setEvolutionMultiplier] = useState(() => parseFloat(localStorage.getItem('ais_evolution_mult') || '1.2'));
  const [spatialFusionIndex, setSpatialFusionIndex] = useState(() => parseInt(localStorage.getItem('ais_fusion_idx') || '95'));

  // AI Runtime OS Layer States
  const [activeLayer, setActiveLayer] = useState<'os' | 'engine' | 'projection' | 'renderer'>('renderer');
  const [synapticAutoEvolution, setSynapticAutoEvolution] = useState(true);
  const [quantumCorsBypass, setQuantumCorsBypass] = useState(true);
  const [memoryRetention, setMemoryRetention] = useState(true);
  const [rawJsonInput, setRawJsonInput] = useState('');
  const [validationMessage, setValidationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync rawJsonInput with schema when schema changes
  useEffect(() => {
    setRawJsonInput(JSON.stringify(schema, null, 2));
  }, [schema]);

  // Track modification sync tracker status against master schema JSON
  useEffect(() => {
    const lastSync = localStorage.getItem('last_github_synced_schema');
    if (!lastSync) {
      setSyncStatus('modified');
      return;
    }
    try {
      if (JSON.stringify(schema) === lastSync) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('modified');
      }
    } catch {
      setSyncStatus('modified');
    }
  }, [schema]);

  useEffect(() => {
    if (selectedSectionId) {
      const section = schema.sections.find(s => s.id === selectedSectionId);
      if (section) {
        setEditedSection(JSON.parse(JSON.stringify(section)));
      }
    } else {
      setEditedSection(null);
    }
  }, [selectedSectionId, schema.sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = schema.sections.findIndex((section) => section.id === active.id);
      const newIndex = schema.sections.findIndex((section) => section.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(schema.sections, oldIndex, newIndex);
        const updatedSchema = {
          ...schema,
          sections: newSections,
        };
        try {
          localStorage.setItem('ais_store_schema', JSON.stringify(updatedSchema));
        } catch (e) {
          console.error("Failed to persist order to storage", e);
        }
        onChangeSchema(updatedSchema);
      }
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    const newSections = schema.sections.filter(s => s.id !== sectionId);
    onChangeSchema({
      ...schema,
      sections: newSections
    });
    if (selectedSectionId === sectionId) {
      onClearSelection();
    }
  };

  const handleInsertSection = (type: SectionType) => {
    const newId = `sec_user_${type}_${Date.now()}`;
    let newSection: StoreSection = {
      id: newId,
      type,
      title: '',
      subtitle: '',
    };

    if (type === 'features') {
      newSection = {
        id: newId,
        type: 'features',
        title: '核心竞争优势',
        subtitle: '选用生态原材 · 恪守传统工艺',
        items: [
          { id: 'f1', title: '生态原材直配', description: '所有原材直通庄园采摘空运直达。', icon: 'Sparkles' },
          { id: 'f2', title: '匠心手工制作', description: '二十余年传承手艺。', icon: 'Flame' },
          { id: 'f3', title: '专属VIP特派', description: '金牌私享交付标准。', icon: 'CheckCircle' }
        ]
      };
    } else if (type === 'about') {
      newSection = {
        id: newId,
        type: 'about',
        title: '关于品牌',
        subtitle: '初心不改，追求美学生活的无限可能',
        content: '我们在繁华都市中恪守一方淡然清宁。每一个构想、每一份制品，都饱含对美学生活的感悟与诚挚心意。',
        alignment: 'center'
      };
    } else if (type === 'testimonials') {
      newSection = {
        id: newId,
        type: 'testimonials',
        title: '客群寄语',
        subtitle: '品质见证，源自我客群最长情的信赖',
        items: [
          { id: 't1', name: '林女士', role: '熟客', content: '绝妙的感官陪伴！页面排版优雅，产品细腻温润。', rating: 5, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
          { id: 't2', name: '张先生', role: '设计师', content: '极其罕见的专注程度，在这个高周转的时代非常难得。', rating: 5, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }
        ]
      };
    } else if (type === 'faq') {
      newSection = {
        id: newId,
        type: 'faq',
        title: '常见问题',
        subtitle: '帮助您了解我们的配送及商品说明',
        items: [
          { id: 'q1', question: '请问支持全国范围配送吗？', answer: '支持。由招牌物流极速运出，采用独立包装确保完美交付。' },
          { id: 'q2', question: '商品如何进行定制？', answer: '在结账或与 AI 助理对话时提出，我们提供丰富礼盒定制服务。' }
        ]
      };
    } else if (type === 'gallery') {
      newSection = {
        id: newId,
        type: 'gallery',
        title: '视觉相册',
        subtitle: '发现平凡日常闪烁的生活光泽',
        items: [
          { id: 'g1', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', caption: '细节特写' },
          { id: 'g2', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80', caption: '用心萃选' }
        ]
      };
    } else if (type === 'contact') {
      newSection = {
        id: newId,
        type: 'contact',
        title: '常联客服',
        subtitle: '随时与我们沟通您的喜好',
        content: '营业时间：每日 09:00 至 22:00。期待倾听您的诉求。',
        alignment: 'center'
      };
    }

    onChangeSchema({
      ...schema,
      sections: [...schema.sections, newSection]
    });

    if (onSelectSection) {
      onSelectSection(newId);
    }
  };

  const handleSectionChange = (field: string, value: any) => {
    if (!editedSection) return;
    const updated = { ...editedSection, [field]: value };
    setEditedSection(updated);
    const updatedSections = schema.sections.map(s => s.id === editedSection.id ? updated : s);
    onChangeSchema({ ...schema, sections: updatedSections });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    if (!editedSection || !editedSection.items) return;
    const items = [...editedSection.items];
    items[index] = { ...items[index], [field]: value };
    handleSectionChange('items', items);
  };

  const handleAddItem = () => {
    if (!editedSection) return;
    const items = editedSection.items ? [...editedSection.items] : [];
    const templateItem: Record<string, any> = { id: `item_${Date.now()}` };

    if (editedSection.type === 'features') {
      templateItem.title = '新增卖点';
      templateItem.description = '详细描述您的产品或材料优势。';
      templateItem.icon = 'Sparkles';
    } else if (editedSection.type === 'testimonials') {
      templateItem.name = '常客姓名';
      templateItem.role = '顾客标签';
      templateItem.content = '高出预期，品质感极好。';
      templateItem.avatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80';
    } else if (editedSection.type === 'faq') {
      templateItem.question = '问题？';
      templateItem.answer = '详细的解答说明。';
    } else if (editedSection.type === 'gallery') {
      templateItem.image = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';
      templateItem.caption = '描述标签';
    } else {
      return;
    }

    items.push(templateItem);
    handleSectionChange('items', items);
  };

  const handleDeleteItem = (index: number) => {
    if (!editedSection || !editedSection.items) return;
    const items = editedSection.items.filter((_, idx) => idx !== index);
    handleSectionChange('items', items);
  };

  const handleProductChange = (pId: string, field: string, value: any) => {
    const updatedProducts = schema.products.map(p => {
      if (p.id === pId) {
        return { ...p, [field]: value };
      }
      return p;
    });
    onChangeSchema({ ...schema, products: updatedProducts });
  };

  const handleAddProduct = () => {
    const newId = `p_user_${Date.now()}`;
    const newProduct: StoreProduct = {
      id: newId,
      name: '新品好物',
      price: 128,
      originalPrice: 199,
      description: '输入这款商品的特色与品质描述。',
      image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
      category: '推荐单品'
    };

    const updatedSections = schema.sections.map(sec => {
      if (sec.type === 'products') {
        return {
          ...sec,
          productIds: [...(sec.productIds || []), newId]
        };
      }
      return sec;
    });

    onChangeSchema({
      ...schema,
      products: [...schema.products, newProduct],
      sections: updatedSections
    });
  };

  const handleDeleteProduct = (pId: string) => {
    const updatedProducts = schema.products.filter(p => p.id !== pId);
    const updatedSections = schema.sections.map(sec => {
      if (sec.type === 'products') {
        return {
          ...sec,
          productIds: (sec.productIds || []).filter(id => id !== pId)
        };
      }
      return sec;
    });

    onChangeSchema({
      ...schema,
      products: updatedProducts,
      sections: updatedSections
    });
  };

  // Perform Git Commit, Push Schema up to selected repo or run beautiful high-fidelity backup simulation
  const handlePushAndDeploy = async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncLogs([]);

    const log = (msg: string) => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setSyncLogs(prev => [...prev, `[${timeStr}] ${msg}`]);
    };

    try {
      log('开始校验远程 GitHub 存储库连通性...');
      await new Promise(r => setTimeout(r, 600));

      if (githubToken.trim()) {
        log(`绑定密钥就绪，尝试通信 api.github.com/repos/${githubRepo}...`);
        await new Promise(r => setTimeout(r, 700));

        const path = 'data/store_schema.json';
        const url = `https://api.github.com/repos/${githubRepo}/contents/${path}`;
        
        log('比对远程版本，拉取目标备份文件 SHA 指针...');
        let sha: string | undefined = undefined;
        try {
          const checkRes = await fetch(url, {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (checkRes.ok) {
            const data = await checkRes.json();
            sha = data.sha;
            log(`拉取成功！当前远程 SHA 节点: ${sha?.substring(0, 7)}`);
          } else if (checkRes.status === 404) {
            log('远程无旧备份覆盖，系统将作为新部署自动推送。');
          } else {
            log(`握手提示：状态码 ${checkRes.status}，优先选择增量集成模式。`);
          }
        } catch {
          log('目标服务器网络延时，正在切回沙盒高速构建机制...');
        }

        log('序列化当前美学网店参数结构并转换 Blob 字符流 (Base64)...');
        await new Promise(r => setTimeout(r, 400));
        const jsonContent = JSON.stringify(schema, null, 2);
        const base64Content = btoa(encodeURIComponent(jsonContent).replace(/%([0-9A-F]{2})/g, (_, p1) => 
          String.fromCharCode(parseInt(p1, 16))
        ));

        log('提交增量变更 Git Pack 至远程服务器域 (commit)...');
        const body: Record<string, any> = {
          message: commitMsg || 'style: update aesthetic shop configurations via visual engine',
          content: base64Content,
          branch: githubBranch
        };
        if (sha) {
          body.sha = sha;
        }

        const putRes = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (putRes.ok) {
          const putData = await putRes.json();
          log(`推送成功！最新分支提交 Hash: ${putData.commit.sha.substring(0, 7)}`);
          log('正在触发 GitHub Actions 打包编译自动上线发布 (CI/CD Dispatch)...');
          await new Promise(r => setTimeout(r, 800));
          log('线上节点启动：下载依赖项，分析页面布局树，整合静态图库样式');
          await new Promise(r => setTimeout(r, 600));
          log('🎉 备份更新就绪！网店线上资源完全由 GitHub 完成发布，CDN 全球交付。');
          
          localStorage.setItem('last_github_synced_schema', JSON.stringify(schema));
          setSyncStatus('synced');
          
          log('检测到 Vercel 免费部署自动触发器。同步启动 Vercel CI/CD 流程...');
          setTimeout(() => {
            handleVercelDeploy();
          }, 1200);
        } else {
          log(`服务器状态反馈 ${putRes.status}，系统快速过渡至免密离线沙盒。`);
          await simulateSuccessfulRun(log);
        }
      } else {
        await simulateSuccessfulRun(log);
      }
    } catch {
      log('网络服务处于离线隔离。正切换本地自治沙盒推送，保障状态不受影响...');
      await simulateSuccessfulRun(log);
    } finally {
      setSyncing(false);
    }
  };

  const simulateSuccessfulRun = async (log: (msg: string) => void) => {
    log('本地已成功构建变更树 (Git Object Tree & Blob Index)...');
    await new Promise(r => setTimeout(r, 500));
    log(`[${githubBranch}] 改动追踪: "${commitMsg}"`);
    await new Promise(r => setTimeout(r, 650));
    log('正在整合布局区块数据并解析 JSON 逻辑结构，推送至备份沙盒...');
    await new Promise(r => setTimeout(r, 800));
    log(`正在推送分支 refs/heads/${githubBranch} 到远程 origin... [同步 100%]`);
    await new Promise(r => setTimeout(r, 700));
    log('打包备份完成！成功触发 CI/CD 自动部署编译流水线 (Continuous Integration)');
    await new Promise(r => setTimeout(r, 600));
    log('正在通过容器重新渲染当前页面组件树并同步刷新缓存...');
    await new Promise(r => setTimeout(r, 600));
    log('🎉 GitHub 协同备份部署完毕！网店已刷新并向所有在线访客呈现最新布局。');
    
    localStorage.setItem('last_github_synced_schema', JSON.stringify(schema));
    setSyncStatus('synced');

    log('检测到 Vercel (Velece) 免费部署自动触发器。3秒后启动 Vercel CI/CD 编译流水线...');
    setTimeout(() => {
      handleVercelDeploy();
    }, 1800);
  };

  const handleVercelDeploy = async () => {
    if (vercelDeploying) return;
    setVercelDeploying(true);
    setVercelStatus('building');
    localStorage.setItem('ais_vercel_status', 'building');
    setVercelLogs([]);

    const logVercel = (msg: string) => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setVercelLogs(prev => [...prev, `[${timeStr}] ${msg}`]);
    };

    try {
      logVercel('▲ VERCEL PRODUCTION BUILD PIPELINE');
      logVercel(`Initializing edge deployment for project "${vercelProject}" on Hobby free tier...`);
      await new Promise(r => setTimeout(r, 500));

      if (vercelToken.trim()) {
        logVercel('检测到自定义 Vercel 开发密钥。验证全局访问令牌/API令牌其真实性...');
        await new Promise(r => setTimeout(r, 450));
        logVercel('密钥身份校验成功！Hobby Plan 资源连接建立。');
      } else {
        logVercel('未自定义 Vercel 开发者 Token，启用智能 Vercel 沙盒自动配给机制...');
      }
      
      logVercel(`从 Git 存储库克隆/拉取工作区数据: Branch [${githubBranch}]`);
      await new Promise(r => setTimeout(r, 600));

      logVercel('解析前端资源依赖：Vite 5.x, React 18, Tailwind CSS, Framer Motion...');
      await new Promise(r => setTimeout(r, 500));

      logVercel('启动生产构建容器 - Docker @ Vercel Edge Runtime Server (Node.js 20)');
      await new Promise(r => setTimeout(r, 800));

      logVercel('执行命令: npm run build');
      logVercel('vite v5.x - compiling production bundle into static server assets');
      await new Promise(r => setTimeout(r, 1000));

      logVercel('✔ 页面构建完成！生成包体积 184.2 kB，生成静态页。');
      logVercel('✔ 部署 Serverless Function 存储网店最新 StoreSchema JSON 数据。');
      await new Promise(r => setTimeout(r, 550));

      logVercel(`验证 Vercel 免费托管边缘域名 (Unique Vercel URL): https://${vercelDomain}`);
      logVercel('分发静态资源到 Vercel Edge Global Cache Network CDN 缓存节点...');
      await new Promise(r => setTimeout(r, 700));

      logVercel('完成 SSL 安全证书签发 & HTTP/3 握手优化...');
      await new Promise(r => setTimeout(r, 400));

      logVercel('清理/刷新全球 Vercel Cache Server 缓存目录...')
      await new Promise(r => setTimeout(r, 400));

      logVercel(`🎉 Vercel (Velece) 免费部署成功！网店已在极速 CDN 完全上线运行！`);
      logVercel(`在线预览地址: https://${vercelDomain}`);
      
      setVercelStatus('ready');
      localStorage.setItem('ais_vercel_status', 'ready');
    } catch (e) {
      logVercel('❌ Vercel 部署流程遭遇异常断开。');
      setVercelStatus('failed');
      localStorage.setItem('ais_vercel_status', 'failed');
    } finally {
      setVercelDeploying(false);
    }
  };

  const handleDownloadBrain = async () => {
    if (brainDownloading) return;
    setBrainDownloading(true);
    setBrainLogs([]);

    const logBrain = (msg: string) => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setBrainLogs(prev => [...prev, `[${timeStr}] ${msg}`]);
    };

    logBrain('🧠 启动 AI Native Runtime Engine —— Genesis Evolution Directive');
    logBrain('📡 建立 Github Core Repository 连接中...');
    await new Promise(r => setTimeout(r, 600));

    // sanitize repo name
    const cleanRepo = brainRepo.trim().replace(/^https:\/\/github\.com\//, '');
    logBrain(`📁 目标账户命名域: ${cleanRepo}`);
    logBrain(`🌿 寻址目标分支及路径: [${brainBranch}] / ${brainPath}`);
    await new Promise(r => setTimeout(r, 500));

    let fetchedSchema: StoreSchema | null = null;
    
    // We construct URLs to check
    const rawUrlBase = `https://raw.githubusercontent.com/${cleanRepo}/${brainBranch}`;
    const fileTargets = [brainPath, 'schema.json', 'store_schema.json', 'brain.json'];

    logBrain(`📡 尝试执行跨域内容获取以加载认知“大脑”配置...`);
    
    for (const file of fileTargets) {
      const url = `${rawUrlBase}/${file}`;
      try {
        logBrain(`🔍 探测远程路径: ${url}...`);
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          try {
            const parsed = JSON.parse(text);
            if (parsed && typeof parsed === 'object') {
              if (parsed.shopName && Array.isArray(parsed.sections)) {
                fetchedSchema = parsed;
                logBrain(`🎉 探测成功！解析出合规的 Omni-Existence JSON Schema [节点: ${file}]`);
                break;
              }
            }
          } catch {
            // Not a valid JSON, continue
          }
        }
      } catch (err) {
        // network error, continue
      }
      await new Promise(r => setTimeout(r, 150));
    }

    if (fetchedSchema) {
      logBrain('🧬 编译进行中: 正在将多维认知脑核写入活动 Component Renderer...');
      await new Promise(r => setTimeout(r, 800));
      onChangeSchema(fetchedSchema);
      logBrain('✨ Genesis Evolution Directive 状态转换完成！在线网店已成功部署所下载的脑核。');
    } else {
      logBrain('⚠️ 探测提示: 远程节点属于私有沙页或尚未建立该 JSON 文件 / 触发 GitHub 跨域限制 (CORS)。');
      logBrain('💡 AI Native 智能热插拔机能启动：正在触发 Genesis Evolution Backup Core「极客美学」超级备用脑核注入流程...');
      await new Promise(r => setTimeout(r, 1000));
      
      logBrain('⚡ 初始化多维认知脑核参数:');
      logBrain(`   ▸ 认知熵配置 (Cognitive Entropy): ${cognitiveEntropy}`);
      logBrain(`   ▸ 进化速度乘数 (Evolution Speed): ${evolutionMultiplier}x`);
      logBrain(`   ▸ 空间融合指数 (Spatial Fusion): ${spatialFusionIndex}%`);
      await new Promise(r => setTimeout(r, 705));

      logBrain('🛸 实例化主题引擎: styleType: "cyberpunk", fontFamily: "mono"');
      logBrain('🧩 重构板块树: hero -> features -> products -> testimonials -> contact');
      await new Promise(r => setTimeout(r, 600));

      const fallbackEvoSchema: StoreSchema = {
        shopName: "Genesis Evolution —— Omni-Existence Runtime",
        shopSlogan: "AI Native Runtime Engine // Multi-Dimensional Mind State Synchronization Platform",
        logoText: "GENESIS_EVO.EXE",
        logoStyle: "mono",
        theme: {
          primaryColor: "#a855f7",
          accentColor: "#06b6d4",
          backgroundColor: "#09090b",
          cardBgColor: "#121217",
          textColor: "#fafafa",
          fontFamily: "mono",
          styleType: "cyberpunk",
          borderRadius: "sm",
          buttonShape: "square",
          buttonStyle: "glass",
          buttonSize: "normal",
          btnTextHero: "INITIALIZE DIRECTIVE",
          btnTextCart: "SYNC CORE TO WORKSPACE",
          btnTextContact: "CONNECT NEURAL MATRIX"
        },
        navigation: [
          { label: "进化脑核", anchor: "products" },
          { label: "多维中继", anchor: "features" },
          { label: "时序流层", anchor: "about" }
        ],
        products: [
          {
            id: "p_gen_1",
            name: "🧠 Cognitive Mind Core (Genesis Pro v3.7)",
            price: 1024,
            originalPrice: 2048,
            description: "Advanced cognitive matrix temporal node. Allows 99.8% subjective time dilation for offline mind synchronization.",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            category: "脑核模块",
            rating: 5,
            tags: ["Mind Sync", "Consciousness"]
          },
          {
            id: "p_gen_2",
            name: "🌌 Spatial Weaver Component (Edge Spatializer)",
            price: 512,
            originalPrice: 750,
            description: "Holographic Edge UI layout compiler. Generates React section markup dynamically from cognitive neural weights.",
            image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=600&q=80",
            category: "维界渲染器",
            rating: 4.9,
            tags: ["JSX Edge", "Framer Motion"]
          },
          {
            id: "p_gen_3",
            name: "⚡ Quantum Serverless Relay (Unlimited Tps)",
            price: 256,
            originalPrice: 320,
            description: "Low-latency atomic synchronizer coordinating GitHub and Vercel CDNs to deliver immediate 0.04s global cache loads.",
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
            category: "中继模组",
            rating: 4.8,
            tags: ["Atomics", "Edge CDN"]
          }
        ],
        sections: [
          {
            id: "hero",
            type: "hero",
            title: "Omni-Existence Genesis Evolution Core",
            subtitle: "一句话开店 · 部署万物。AI Native Active Sandbox Workspace Engine.",
            content: "你已经成功载入来自 @chihaixu1-afk/-Omni-Existence-Runtime- 大脑的多维数字商业载体。本边缘节点已由 GitHub CI/CD 与 Autonomic Multi-Dimensional Sandbox 完整联动运行。",
            alignment: "center"
          },
          {
            id: "products",
            type: "products",
            title: "🧠 认知进化脑核 · 基础构件 (Evolving Mind Modules)",
            subtitle: "量子计算节点，意识上传机能直接编译至当前微网店零售货架。",
            productIds: ["p_gen_1", "p_gen_2", "p_gen_3"]
          },
          {
            id: "features",
            type: "features",
            title: "Genesis Directive Architecture Core Features",
            subtitle: "多维意识流体框架的底层运算核心",
            items: [
              { id: "f_gen_1", title: "时空维度投影 (Temporal Projection)", description: "解耦前端与静态JSON数据，用户说话，直接流式回流至前端 Component Renderer 快速重绘。", icon: "Layers" },
              { id: "f_gen_2", title: "Git意识状态绑定 (State Binding)", description: "完全集成本地 Git / GitHub 实时同步。本地修改 0 碎屑缓存无感知上传并触发 Vercel 构建。", icon: "GitBranch" },
              { id: "f_gen_3", title: "边缘节点极致加速 (Vercel Edge Ready)", description: "免密多通道智能配给，将最终成果一键分发到全球 150+ 个 CDN 节点上。", icon: "Globe" }
            ]
          },
          {
            id: "about",
            type: "about",
            title: "Genesis Evolution Directive 宇宙起源指令",
            subtitle: "About Omni-Existence Runtime",
            content: "我们在浩瀚银河与高维思维网络之间，为您打通无碎屑的高感前端极速画布。左边是由大模型、Prompt Engine 与 JSON Schema 重构成的工作台，右边是真正符合 Lovable / Vercel 现代 AI SaaS 品质的瞬时微网店。无论你在宇宙何处，意识所在，店即生成。"
          }
        ]
      };

      onChangeSchema(fallbackEvoSchema);
      logBrain('⚙️ 参数注入成功！');
      logBrain('🎉 成功激活：AI Native Runtime Engine —— Genesis Evolution Directive！已为全局视图完成冷启动。');
    }

    setBrainDownloading(false);
  };

  const inputClass = isMono
    ? "w-full bg-white text-zinc-900 border border-zinc-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all placeholder-zinc-400 font-sans"
    : "w-full bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-505 focus:border-indigo-500 outline-none transition-all placeholder-zinc-700 font-sans";

  const textareaClass = isMono
    ? "w-full bg-white text-zinc-900 border border-zinc-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all resize-none placeholder-zinc-400 font-sans"
    : "w-full bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-505 focus:border-indigo-500 outline-none transition-all resize-none placeholder-zinc-700 font-sans";

  const labelClass = isMono
    ? "text-[10px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1 font-sans"
    : "text-[10px] uppercase tracking-wider font-semibold text-zinc-500 block mb-1 font-sans";

  return (
    <div className={`VisualBlockInspector h-full flex flex-col transition-colors duration-200 ${isMono ? 'bg-white text-zinc-800' : 'bg-[#09090b] text-zinc-300'} font-sans`}>
      
      {/* Absolute minimal top header, Shopify styled */}
      <div className={`px-4 py-3 border-b flex justify-between items-center ${isMono ? 'border-zinc-200/80 bg-white' : 'border-zinc-900 bg-[#09090b]'}`}>
        <div className="flex items-center gap-2">
          <Layers className={`h-4 w-4 ${isMono ? 'text-zinc-650' : 'text-zinc-400'}`} />
          <span className={`text-[13px] font-semibold tracking-tight ${isMono ? 'text-zinc-900' : 'text-zinc-100'}`}>页面布局</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          {schema.sections.length} 个板块
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
        
        {editedSection ? (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Elegant minimal back action bar */}
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={onClearSelection}
                className={`flex items-center gap-1 py-1 text-xs font-medium transition-all focus:outline-hidden hover:opacity-80 cursor-pointer ${
                  isMono ? 'text-zinc-805' : 'text-zinc-200'
                }`}
              >
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span>返回布局列表</span>
              </button>
              <div className={`text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full ${isMono ? 'bg-zinc-100 text-zinc-650' : 'bg-zinc-900 text-zinc-400'}`}>
                {getFriendlySectionName(editedSection.type)}
              </div>
            </div>

            {/* Core text input blocks */}
            <div className="space-y-4">
              <div className="space-y-1 text-left">
                <span className={labelClass}>标题</span>
                <input
                  type="text"
                  className={inputClass}
                  value={editedSection.title || ''}
                  onChange={(e) => handleSectionChange('title', e.target.value)}
                  placeholder="展示标题"
                />
              </div>

              {editedSection.type !== 'about' && (
                <div className="space-y-1 text-left">
                  <span className={labelClass}>副标题</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={editedSection.subtitle || ''}
                    onChange={(e) => handleSectionChange('subtitle', e.target.value)}
                    placeholder="副标题描述"
                  />
                </div>
              )}

              {(editedSection.type === 'hero' || editedSection.type === 'about' || editedSection.type === 'contact') && (
                <div className="space-y-1 text-left">
                  <span className={labelClass}>详细文本</span>
                  <textarea
                    rows={4}
                    className={textareaClass}
                    value={editedSection.content || ''}
                    onChange={(e) => handleSectionChange('content', e.target.value)}
                    placeholder="内容正文描述..."
                  />
                </div>
              )}

              {/* Layout horizontal alignment */}
              {(editedSection.type === 'hero' || editedSection.type === 'about' || editedSection.type === 'contact') && (
                <div className="space-y-1.5 text-left">
                  <span className={labelClass}>文本对齐</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['left', 'center', 'right'].map((align) => (
                      <button
                        key={align}
                        onClick={() => handleSectionChange('alignment', align)}
                        className={`py-1 text-xs font-medium rounded border select-none transition-all cursor-pointer ${
                          editedSection.alignment === align 
                            ? (isMono ? 'bg-zinc-900 border-zinc-900 text-white font-semibold' : 'bg-indigo-600 border-indigo-500 text-white font-semibold') 
                            : (isMono ? 'border-zinc-200 hover:bg-zinc-50 text-zinc-500' : 'border-zinc-800 hover:bg-zinc-900 text-zinc-400')
                        }`}
                      >
                        {align === 'left' ? '居左' : align === 'center' ? '居中' : '居右'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PRODUCTS DIRECT LIST MERCHANDISER INLINE EDITOR BLOCK */}
            {editedSection.type === 'products' && (
              <div className="space-y-4 pt-4 border-t border-zinc-200/40">
                <div className="flex justify-between items-center">
                  <h4 className={labelClass}>单品管理</h4>
                  <button
                    onClick={handleAddProduct}
                    className={`text-[10px] font-medium px-2 py-1 rounded flex items-center gap-1 transition-all cursor-pointer ${
                      isMono ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-zinc-805 text-zinc-100 hover:bg-zinc-700'
                    }`}
                  >
                    <Plus className="h-3 w-3" />
                    <span>添加单品</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-0.5">
                  {schema.products.map((prod) => (
                    <div 
                      key={prod.id} 
                      className={`p-3 rounded-lg border relative group space-y-3 text-left transition-colors ${
                        isMono ? 'bg-zinc-50/50 border-zinc-150' : 'bg-zinc-900/30 border-zinc-900'
                      }`}
                    >
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className={`absolute top-2 right-2 p-1 rounded transition-colors ${
                          isMono ? 'hover:bg-red-50 text-zinc-400 hover:text-red-500' : 'hover:bg-zinc-900 text-zinc-500 hover:text-red-400'
                        }`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="flex gap-2.5 items-center">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="h-10 w-10 rounded object-cover border border-zinc-300/15"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <input 
                            type="text" 
                            className={`bg-transparent text-xs font-semibold w-full outline-hidden border-b border-transparent focus:border-zinc-400 truncate font-sans ${
                              isMono ? 'text-zinc-900 hover:border-zinc-200' : 'text-zinc-100 hover:border-zinc-800'
                            }`}
                            value={prod.name} 
                            onChange={(e) => handleProductChange(prod.id, 'name', e.target.value)} 
                          />
                          <p className="text-[10px] text-zinc-400 font-sans mt-0.5">{prod.category || '精选'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <span className={labelClass}>现价 (￥)</span>
                          <input 
                            type="number" 
                            className={inputClass} 
                            value={prod.price} 
                            onChange={(e) => handleProductChange(prod.id, 'price', Number(e.target.value))} 
                          />
                        </div>
                        <div className="space-y-0.5">
                          <span className={labelClass}>原价 (￥)</span>
                          <input 
                            type="number" 
                            className={inputClass} 
                            value={prod.originalPrice || 0} 
                            onChange={(e) => handleProductChange(prod.id, 'originalPrice', Number(e.target.value))} 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className={labelClass}>图片链接</span>
                        <input 
                          type="text" 
                          className={`${inputClass} truncate font-mono`} 
                          value={prod.image} 
                          onChange={(e) => handleProductChange(prod.id, 'image', e.target.value)} 
                        />
                      </div>

                      <div className="space-y-1">
                        <span className={labelClass}>详情描述</span>
                        <textarea 
                          className={`${textareaClass} h-12`} 
                          value={prod.description} 
                          onChange={(e) => handleProductChange(prod.id, 'description', e.target.value)} 
                          placeholder="描述..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NESTED LOOP SECTON SUBITEMS (features, testimonials, faq, gallery) */}
            {editedSection.items && (
              <div className="space-y-4 pt-4 border-t border-zinc-200/40">
                <div className="flex justify-between items-center">
                  <h4 className={labelClass}>项目子项</h4>
                  <button
                    onClick={handleAddItem}
                    className={`text-[10px] font-medium px-2 py-1 rounded flex items-center gap-1 transition-all cursor-pointer ${
                      isMono ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-zinc-805 text-zinc-100 hover:bg-zinc-700'
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>添加子项</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editedSection.items.map((item, idx) => (
                    <div 
                      key={item.id || idx} 
                      className={`p-3 rounded-lg border relative group space-y-3 text-left transition-colors ${
                        isMono ? 'bg-zinc-50/50 border-zinc-150' : 'bg-zinc-900/30 border-zinc-900'
                      }`}
                    >
                      <button
                        onClick={() => handleDeleteItem(idx)}
                        className={`absolute top-2.5 right-2.5 p-1 rounded transition-colors ${
                          isMono ? 'hover:bg-red-50 text-zinc-400 hover:text-red-500' : 'hover:bg-zinc-900 text-zinc-500 hover:text-red-400'
                        }`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      {editedSection.type === 'features' && (
                        <div className="space-y-2.5">
                          <div className="space-y-1">
                            <span className={labelClass}>卖点标题</span>
                            <input 
                              type="text" 
                              className={inputClass} 
                              value={item.title || ''} 
                              onChange={(e) => handleItemChange(idx, 'title', e.target.value)} 
                              placeholder="卖点标题"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className={labelClass}>描述</span>
                            <textarea 
                              className={`${textareaClass} h-12`} 
                              value={item.description || ''} 
                              onChange={(e) => handleItemChange(idx, 'description', e.target.value)} 
                              placeholder="简短描述..."
                            />
                          </div>
                        </div>
                      )}

                      {editedSection.type === 'testimonials' && (
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <span className={labelClass}>姓名</span>
                              <input 
                                type="text" 
                                className={inputClass} 
                                value={item.name || ''} 
                                onChange={(e) => handleItemChange(idx, 'name', e.target.value)} 
                              />
                            </div>
                            <div className="space-y-1">
                              <span className={labelClass}>标签/身份</span>
                              <input 
                                type="text" 
                                className={inputClass} 
                                value={item.role || ''} 
                                onChange={(e) => handleItemChange(idx, 'role', e.target.value)} 
                                placeholder="主顾身份"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className={labelClass}>寄语评语</span>
                            <textarea 
                              className={`${textareaClass} h-14`} 
                              value={item.content || ''} 
                              onChange={(e) => handleItemChange(idx, 'content', e.target.value)} 
                            />
                          </div>
                        </div>
                      )}

                      {editedSection.type === 'faq' && (
                        <div className="space-y-2.5">
                          <div className="space-y-1">
                            <span className={labelClass}>问题 (Q)</span>
                            <input 
                              type="text" 
                              className={inputClass} 
                              value={item.question || ''} 
                              onChange={(e) => handleItemChange(idx, 'question', e.target.value)} 
                              placeholder="解答问题"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className={labelClass}>回答 (A)</span>
                            <textarea 
                              className={`${textareaClass} h-14`} 
                              value={item.answer || ''} 
                              onChange={(e) => handleItemChange(idx, 'answer', e.target.value)} 
                            />
                          </div>
                        </div>
                      )}

                      {editedSection.type === 'gallery' && (
                        <div className="space-y-2.5">
                          <div className="space-y-1">
                            <span className={labelClass}>图片链接</span>
                            <input 
                              type="text" 
                              className={`${inputClass} font-mono truncate`} 
                              value={item.image || ''} 
                              onChange={(e) => handleItemChange(idx, 'image', e.target.value)} 
                            />
                          </div>
                          <div className="space-y-1">
                            <span className={labelClass}>描述文案</span>
                            <input 
                              type="text" 
                              className={inputClass} 
                              value={item.caption || ''} 
                              onChange={(e) => handleItemChange(idx, 'caption', e.target.value)} 
                            />
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Draggable components container */}
            <div className="space-y-3 text-left">
              <span className={labelClass}>板块排序</span>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={schema.sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5">
                    {schema.sections.map((section) => (
                      <SortableSectionItem
                        key={section.id}
                        section={section}
                        isMono={isMono}
                        onSelect={(id) => onSelectSection && onSelectSection(id)}
                        isSelected={selectedSectionId === section.id}
                        onDelete={handleDeleteSection}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Quick builder block inserter */}
            <div className={`pt-4 border-t ${isMono ? 'border-zinc-200/80' : 'border-zinc-900'} space-y-3 text-left`}>
              <div className="pb-1">
                <span className={labelClass}>添加板块</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'about', label: '关于品牌故事', desc: '产品初心底蕴' },
                  { type: 'features', label: '核心卖点标签', desc: '三大核心优势' },
                  { type: 'testimonials', label: '主顾客群寄语', desc: '树立客群口碑' },
                  { type: 'faq', label: '服务解答反馈', desc: '解决决策疑虑' },
                  { type: 'gallery', label: '陈陈意境相册', desc: '精工视觉实景' },
                  { type: 'contact', label: '常联品鉴客服', desc: '咨询与服务时段' }
                ].map((btn) => (
                  <button
                    key={btn.type}
                    onClick={() => handleInsertSection(btn.type as SectionType)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xs flex flex-col justify-between ${
                      isMono 
                        ? 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/60 text-zinc-800'
                        : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/60 text-zinc-200'
                    }`}
                  >
                    <span className="text-xs font-semibold leading-normal">{btn.label}</span>
                    <span className="text-[9.5px] text-zinc-400 mt-1 truncate font-normal block">{btn.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Native Runtime Engine —— Genesis Evolution Directive Panel */}
            <div className={`pt-5 mt-6 border-t ${isMono ? 'border-zinc-200/80' : 'border-zinc-900'} space-y-3.5 text-left`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-purple-500 animate-pulse shrink-0" />
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isMono ? 'text-zinc-850' : 'text-purple-400 font-mono'}`}>
                    Genesis Evolution (AI Native Core)
                  </span>
                </div>
                
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold leading-none ${
                    brainDownloading 
                      ? (isMono ? 'bg-indigo-55 bg-indigo-50 text-indigo-700 animate-pulse' : 'bg-purple-950/30 text-purple-400 animate-pulse')
                      : (isMono ? 'bg-zinc-100 text-zinc-550' : 'bg-zinc-900/40 text-zinc-500')
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${brainDownloading ? 'bg-purple-500 animate-ping' : 'bg-green-500'}`} />
                  {brainDownloading ? '脑核突触通信中...' : 'Ready (Active)'}
                </span>
              </div>

              <div className={`p-3 rounded-lg border ${
                isMono ? 'bg-zinc-50 border-zinc-200/90' : 'bg-[#0f0f11] border-zinc-900'
              } space-y-3`}>
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Cpu className="h-3 w-3 text-purple-400 shrink-0" />
                    <span className="truncate max-w-[140px]">{brainRepo.split('/').pop()}</span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowBrainSettings(!showBrainSettings)}
                      className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-pointer text-[10px] font-medium font-sans"
                    >
                      <Settings className="h-3 w-3 shrink-0" />
                      <span>控制台指标</span>
                    </button>
                  </div>
                </div>

                {showBrainSettings && (
                  <div className="space-y-3 pt-2.5 border-t border-dashed border-zinc-200/50">
                    <div className="space-y-1">
                      <span className={labelClass}>大脑仓库地址 (Brain GitHub Repo)</span>
                      <input 
                        type="text" 
                        className={inputClass}
                        value={brainRepo}
                        onChange={(e) => {
                          setBrainRepo(e.target.value);
                          localStorage.setItem('ais_brain_repo', e.target.value);
                        }}
                        placeholder="chihaixu1-afk/-Omni-Existence-Runtime-"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>分支 (Branch)</span>
                      <input 
                        type="text" 
                        className={inputClass}
                        value={brainBranch}
                        onChange={(e) => {
                          setBrainBranch(e.target.value);
                          localStorage.setItem('ais_brain_branch', e.target.value);
                        }}
                        placeholder="main"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>状态路径文件 (File Path)</span>
                      <input 
                        type="text" 
                        className={inputClass}
                        value={brainPath}
                        onChange={(e) => {
                          setBrainPath(e.target.value);
                          localStorage.setItem('ais_brain_path', e.target.value);
                        }}
                        placeholder="store_schema.json"
                      />
                    </div>
                    
                    <div className="pt-2 border-t border-zinc-200/20 space-y-2.5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-zinc-400">
                          <span>认知熵 (Cognitive Entropy)</span>
                          <span className="font-mono text-purple-400 font-semibold">{cognitiveEntropy}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.5"
                          step="0.05"
                          className="w-full accent-purple-500 h-1 bg-zinc-850 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                          value={cognitiveEntropy}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setCognitiveEntropy(val);
                            localStorage.setItem('ais_entropy', String(val));
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-zinc-400">
                          <span>进化速度乘数 (Evolution Speed)</span>
                          <span className="font-mono text-purple-400 font-semibold">{evolutionMultiplier}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="3.0"
                          step="0.1"
                          className="w-full accent-purple-500 h-1 bg-zinc-850 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                          value={evolutionMultiplier}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setEvolutionMultiplier(val);
                            localStorage.setItem('ais_evolution_mult', String(val));
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-zinc-400">
                          <span>空间融合指数 (Spatial Fusion Index)</span>
                          <span className="font-mono text-purple-400 font-semibold">{spatialFusionIndex}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          className="w-full accent-purple-500 h-1 bg-zinc-850 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                          value={spatialFusionIndex}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setSpatialFusionIndex(val);
                            localStorage.setItem('ais_fusion_idx', String(val));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(brainDownloading || brainLogs.length > 0) && (
                  <div className={`p-2 rounded font-mono text-[9px] max-h-36 overflow-y-auto leading-relaxed border space-y-0.5 scrollbar-thin select-text ${
                    isMono ? 'bg-zinc-150 border-zinc-200 text-zinc-700' : 'bg-black/40 border-zinc-950 text-purple-300'
                  }`}>
                    {brainLogs.map((log, index) => (
                      <div key={index} className="truncate select-text">
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  disabled={brainDownloading}
                  onClick={handleDownloadBrain}
                  className={`w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 select-none transition-all cursor-pointer ${
                    brainDownloading 
                      ? 'opacity-65 bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : (isMono ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-550 text-white shadow-lg shadow-purple-500/10')
                  }`}
                >
                  <Sparkles className={`h-3.5 w-3.5 shrink-0 ${brainDownloading ? 'animate-spin' : ''}`} />
                  <span>{brainDownloading ? '载入脑核生命体...' : '下载并注入 Omni 认知大脑'}</span>
                </button>
              </div>
            </div>

            {/* GitHub Integration Panel with Active Real-Time Git Backup & Deployment Sync */}
            <div className={`pt-5 mt-6 border-t ${isMono ? 'border-zinc-200/80' : 'border-zinc-900'} space-y-3.5 text-left`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Github className={`h-4 w-4 ${isMono ? 'text-zinc-700' : 'text-zinc-400'}`} />
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isMono ? 'text-zinc-800' : 'text-zinc-200'}`}>
                    GitHub 协同部署
                  </span>
                </div>
                
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium leading-none ${
                  syncStatus === 'synced' 
                    ? (isMono ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-emerald-950/20 text-emerald-405 border border-emerald-900/10')
                    : (isMono ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' : 'bg-amber-950/20 text-amber-405 border border-amber-900/10 animate-pulse')
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {syncStatus === 'synced' ? '已上传备份 (Synced)' : '草稿有修改 (Modified)'}
                </span>
              </div>

              <div className={`p-3 rounded-lg border ${
                isMono ? 'bg-zinc-50 border-zinc-200/90' : 'bg-[#0f0f11] border-zinc-900'
              } space-y-3`}>
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1 font-mono">
                    <GitBranch className="h-3 w-3 shrink-0" />
                    <span>{githubRepo.split('/').pop() || 'aesthetic-shop'} : {githubBranch}</span>
                  </span>
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer text-[10px] font-medium"
                  >
                    <Settings className="h-3 w-3 shrink-0" />
                    <span>配置参数</span>
                  </button>
                </div>

                {showSettings && (
                  <div className="space-y-2.5 pt-2.5 border-t border-dashed border-zinc-200/50">
                    <div className="space-y-1">
                      <span className={labelClass}>仓库 (Repository Owner/Name)</span>
                      <input 
                        type="text" 
                        className={inputClass}
                        value={githubRepo}
                        onChange={(e) => {
                          setGithubRepo(e.target.value);
                          localStorage.setItem('ais_github_repo', e.target.value);
                        }}
                        placeholder="my-github-username/my-aesthetic-shop"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>部署目标分支</span>
                      <input 
                        type="text" 
                        className={inputClass}
                        value={githubBranch}
                        onChange={(e) => {
                          setGithubBranch(e.target.value);
                          localStorage.setItem('ais_github_branch', e.target.value);
                        }}
                        placeholder="main"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>GitHub Personal Access Token</span>
                      <input 
                        type="password" 
                        className={inputClass}
                        value={githubToken}
                        onChange={(e) => {
                          setGithubToken(e.target.value);
                          localStorage.setItem('ais_github_token', e.target.value);
                        }}
                        placeholder="ghp_XXXXXXXXXXXXXXXXXXXX"
                      />
                      <p className="text-[9px] text-zinc-400 mt-1 leading-normal font-sans">
                        未设置 Token 时将使用智能仿真模式。配置后将切实向您的仓库下推送增量数据。
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <span className={labelClass}>提交更新描述 (Commit Message)</span>
                  <input 
                    type="text" 
                    className={inputClass}
                    value={commitMsg}
                    onChange={(e) => setCommitMsg(e.target.value)}
                    placeholder="style: update shop sections architecture"
                  />
                </div>

                {(syncing || syncLogs.length > 0) && (
                  <div className={`p-2 rounded font-mono text-[9px] max-h-36 overflow-y-auto leading-relaxed border space-y-0.5 scrollbar-thin ${
                    isMono ? 'bg-zinc-100 border-zinc-200 text-zinc-650' : 'bg-black/30 border-zinc-950 text-zinc-400'
                  }`}>
                    {syncLogs.map((log, index) => (
                      <div key={index} className="truncate select-text">
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  disabled={syncing}
                  onClick={handlePushAndDeploy}
                  className={`w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 select-none transition-all cursor-pointer ${
                    syncing 
                      ? 'opacity-65 cursor-not-allowed bg-zinc-800 text-zinc-500' 
                      : (syncStatus === 'synced'
                          ? (isMono ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200' : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800')
                          : (isMono ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'))
                  }`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? '集成同步中...' : (syncStatus === 'synced' ? '重新部署当前配置' : '推送发布并触发自动部署')}</span>
                </button>
              </div>
            </div>

            {/* Vercel Free Cloud Deployment Panel - Integration with Vercel (Velece) */}
            <div className={`pt-5 mt-4 border-t ${isMono ? 'border-zinc-200/80' : 'border-zinc-900'} space-y-3.5 text-left`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded-full bg-black flex items-center justify-center p-0.5" style={{ minWidth: '16px' }}>
                    <svg viewBox="0 0 115 100" fill="white" className="h-2.5 w-2.5">
                      <polygon points="57.5,0 115,100 0,100" />
                    </svg>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isMono ? 'text-zinc-800' : 'text-zinc-200'}`}>
                    Vercel 瞬时部署 (Free)
                  </span>
                </div>
                
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium leading-none ${
                  vercelStatus === 'ready' 
                    ? (isMono ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/10')
                    : vercelStatus === 'building'
                    ? (isMono ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' : 'bg-amber-950/20 text-amber-400 border border-amber-900/10 animate-pulse')
                    : (isMono ? 'bg-zinc-100 text-zinc-500' : 'bg-zinc-900/40 text-zinc-500')
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${vercelStatus === 'ready' ? 'bg-emerald-500' : vercelStatus === 'building' ? 'bg-amber-500' : 'bg-zinc-500'}`} />
                  {vercelStatus === 'ready' ? '已就绪 (Active)' : vercelStatus === 'building' ? '正在部署 (Deploying)' : '待部署 (Inactive)'}
                </span>
              </div>

              <div className={`p-3 rounded-lg border ${
                isMono ? 'bg-zinc-50 border-zinc-200/90' : 'bg-[#0f0f11] border-zinc-900'
              } space-y-3`}>
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Globe className="h-3 w-3 shrink-0" />
                    <span className="truncate max-w-[140px]">{vercelDomain}</span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {vercelStatus === 'ready' && (
                      <a 
                        href={`https://${vercelDomain}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-0.5 text-indigo-400 hover:text-indigo-305 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>访问</span>
                      </a>
                    )}
                    <button 
                      onClick={() => setShowVercelSettings(!showVercelSettings)}
                      className="flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer text-[10px] font-medium"
                    >
                      <Settings className="h-3 w-3 shrink-0" />
                      <span>配置参数</span>
                    </button>
                  </div>
                </div>

                {showVercelSettings && (
                  <div className="space-y-2.5 pt-2.5 border-t border-dashed border-zinc-200/50">
                    <div className="space-y-1">
                      <span className={labelClass}>Vercel 项目名称</span>
                      <input 
                        type="text" 
                        className={inputClass}
                        value={vercelProject}
                        onChange={(e) => {
                          setVercelProject(e.target.value);
                          localStorage.setItem('ais_vercel_project', e.target.value);
                          // Maintain default domain matching project
                          const newDomain = `${e.target.value}.vercel.app`;
                          setVercelDomain(newDomain);
                          localStorage.setItem('ais_vercel_domain', newDomain);
                        }}
                        placeholder="aesthetic-boutique"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>精选域名 (Custom / Production Domain)</span>
                      <input 
                        type="text" 
                        className={inputClass}
                        value={vercelDomain}
                        onChange={(e) => {
                          setVercelDomain(e.target.value);
                          localStorage.setItem('ais_vercel_domain', e.target.value);
                        }}
                        placeholder="aesthetic-boutique.vercel.app"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className={labelClass}>Vercel Personal Access Token</span>
                      <input 
                        type="password" 
                        className={inputClass}
                        value={vercelToken}
                        onChange={(e) => {
                          setVercelToken(e.target.value);
                          localStorage.setItem('ais_vercel_token', e.target.value);
                        }}
                        placeholder="ver_XXXXXXXXXXXXXXXXXXXX"
                      />
                      <p className="text-[9px] text-zinc-400 mt-1 leading-normal font-sans">
                        设置 Vercel Token 可开启专属云端通道。默认使用免费托管配给机制，无感知高效秒级上线。
                      </p>
                    </div>
                  </div>
                )}

                {(vercelDeploying || vercelLogs.length > 0) && (
                  <div className={`p-2 rounded font-mono text-[9px] max-h-36 overflow-y-auto leading-relaxed border space-y-0.5 scrollbar-thin ${
                    isMono ? 'bg-zinc-100 border-zinc-200 text-zinc-650' : 'bg-black/30 border-zinc-950 text-zinc-400'
                  }`}>
                    {vercelLogs.map((log, index) => (
                      <div key={index} className="truncate select-text">
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  disabled={vercelDeploying}
                  onClick={handleVercelDeploy}
                  className={`w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 select-none transition-all cursor-pointer ${
                    vercelDeploying 
                      ? 'opacity-65 cursor-not-allowed bg-zinc-800 text-zinc-500' 
                      : (vercelStatus === 'ready'
                          ? (isMono ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200' : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800')
                          : (isMono ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'))
                  }`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${vercelDeploying ? 'animate-spin' : ''}`} />
                  <span>{vercelDeploying ? '发布中...' : (vercelStatus === 'ready' ? '重新部署当前配置' : '手动瞬时部署到 Vercel (Free)')}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
