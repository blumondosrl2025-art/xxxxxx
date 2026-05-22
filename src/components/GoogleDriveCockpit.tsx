import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, 
  CloudLightning, 
  CheckCircle, 
  Database, 
  Download, 
  UploadCloud, 
  RefreshCw, 
  Image as ImageIcon, 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  LogOut,
  Sparkles,
  Link2
} from 'lucide-react';
import { 
  googleSignIn, 
  logout, 
  initAuth, 
  listDriveFiles, 
  uploadBackupToDrive, 
  downloadBackupFromDrive, 
  DriveFile 
} from '../lib/googleDrive';
import { StoreSchema } from '../types';
import { User } from 'firebase/auth';

interface GoogleDriveCockpitProps {
  currentSchema: StoreSchema;
  onRestoreSchema: (schema: StoreSchema) => void;
  onApplyImage?: (imageUrl: string) => void;
  onAddChatMessage?: (message: string) => void;
  workspaceSkin?: 'cyber' | 'mono';
}

export default function GoogleDriveCockpit({ 
  currentSchema, 
  onRestoreSchema, 
  onApplyImage,
  onAddChatMessage,
  workspaceSkin = 'cyber'
}: GoogleDriveCockpitProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchText, setSearchText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [backingUp, setBackingUp] = useState(false);

  const isMono = workspaceSkin === 'mono';

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        fetchFiles(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchFiles = async (accessToken: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const driveFiles = await listDriveFiles(accessToken, searchText);
      setFiles(driveFiles);
    } catch (err: any) {
      setErrorMessage('无法加载谷歌云端硬盘文件列表。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        fetchFiles(result.accessToken);
        if (onAddChatMessage) {
          onAddChatMessage(`✅ 成功连接至 Google Drive！已为您同步谷歌云端硬盘数字资产素材库于右侧，我们现在可以将产品与首图直接绑定到您的云盘文件！`);
        }
      }
    } catch (err: any) {
      setErrorMessage('谷歌登录授权失败，请重试。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('确定要断开 Google Drive 连接并清除缓存身份吗？')) {
      await logout();
      setUser(null);
      setToken(null);
      setFiles([]);
    }
  };

  const handleBackup = async () => {
    if (!token) return;
    setBackingUp(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `shop_schema_${currentSchema.shopName.replace(/\s+/g, '_')}_${timestamp}.json`;
      
      await uploadBackupToDrive(token, currentSchema, filename);
      setSuccessMessage(`云端备份成功！已保存为 ${filename}`);
      fetchFiles(token);
    } catch (err: any) {
      setErrorMessage('云端备份失败，请检查网络权限。');
      console.error(err);
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestore = async (file: DriveFile) => {
    if (!token) return;
    const confirmed = window.confirm(
      `确定要将您的网店配置回改，并恢复到 Google Drive 中的备份『${file.name}』吗？此操作将覆盖您当前的本地草稿配置。`
    );
    if (!confirmed) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const restoredSchema = await downloadBackupFromDrive(token, file.id);
      if (restoredSchema && restoredSchema.shopName) {
        onRestoreSchema(restoredSchema);
        setSuccessMessage('成功从云端恢复店铺 Schema 结构！');
        if (onAddChatMessage) {
          onAddChatMessage(`⏱️ 已从 Google Drive 云备份恢复配置：为「${restoredSchema.shopName}」定制的版本！`);
        }
      } else {
        setErrorMessage('文件格式不正确，不是合法的多维店面 Schema。');
      }
    } catch (err: any) {
      setErrorMessage('无法从云端下载或解析备份。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyImageToField = (file: DriveFile) => {
    // Construct premium drive proxy thumbnail link or web view URL
    const directUrl = `https://lh3.googleusercontent.com/d/${file.id}`;
    if (onApplyImage) {
      onApplyImage(directUrl);
      setSuccessMessage(`已将云端图片「${file.name}」应用于正在编辑的模块中！`);
    } else {
      navigator.clipboard.writeText(directUrl);
    }
  };

  return (
    <div id="google-drive-cockpit-panel" className={`border rounded-2xl p-4 flex flex-col gap-4 transition-all duration-300 ${
      isMono 
        ? 'bg-white border-zinc-200 text-zinc-800 shadow-xs' 
        : 'bg-[#121215] border-zinc-900 text-zinc-300 shadow-xl'
    }`}>
      
      {/* Header and sync indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isMono ? 'bg-zinc-100 text-zinc-800' : 'bg-indigo-500/10 text-indigo-400'}`}>
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <h4 className={`text-xs font-bold font-sans tracking-wide flex items-center gap-1.5 ${isMono ? 'text-zinc-900' : 'text-zinc-100'}`}>
              Google Drive 资产库
              <Sparkles className={`w-3 h-3 animate-pulse ${isMono ? 'text-zinc-650' : 'text-indigo-400'}`} />
            </h4>
            <p className="text-[10px] font-mono text-zinc-500">CLOUD STORAGE SYNC</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {user ? (
            <span className={`flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${isMono ? 'bg-zinc-100 text-zinc-800 border-zinc-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              <span className={`w-1 h-1 rounded-full ${isMono ? 'bg-zinc-900' : 'bg-emerald-400 animate-ping'}`}></span>
              CONNECTED
            </span>
          ) : (
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${isMono ? 'bg-zinc-50 text-zinc-400 border-zinc-150' : 'bg-zinc-800 text-zinc-500 border-zinc-900'}`}>
              DISCONNECTED
            </span>
          )}
        </div>
      </div>

      {/* Connection State Panel */}
      {!user ? (
        <div className={`p-4 rounded-xl flex flex-col items-center justify-center text-center gap-3 border ${isMono ? 'bg-zinc-50 border-zinc-200/60' : 'bg-zinc-950/60 border-zinc-900'}`}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isMono ? 'bg-zinc-200/50' : 'bg-zinc-900'}`}>
            <CloudLightning className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="space-y-1">
            <p className={`text-xs font-bold ${isMono ? 'text-zinc-900' : 'text-zinc-200'}`}>连接您的谷歌云端硬盘</p>
            <p className="text-[10px] text-zinc-500 leading-relaxed max-w-xs px-2">
              一键保存店铺骨架备份，并在店铺中管理、调用和极速同步来自 Drive 云盘中保存的高清新品图片
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full mt-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all duration-150 active:scale-[0.98] cursor-pointer ${
              isMono
                ? 'bg-zinc-900 hover:bg-zinc-950 text-white'
                : 'bg-zinc-100 hover:bg-white text-zinc-950'
            }`}
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span>{loading ? '正在授权...' : '使用 Google 登录'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Active Profile HUD */}
          <div className={`flex items-center justify-between p-2.5 rounded-xl border ${isMono ? 'bg-zinc-50 border-zinc-150' : 'bg-zinc-950/40 border-zinc-900'}`}>
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-6.5 h-6.5 rounded-full border border-zinc-805" />
              ) : (
                <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold ${isMono ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-800 text-zinc-300'}`}>
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="leading-tight">
                <span className={`text-[11px] font-bold block max-w-[140px] truncate ${isMono ? 'text-zinc-900' : 'text-zinc-200'}`}>{user.displayName || 'Google Merchant'}</span>
                <span className="text-[9px] font-mono text-zinc-500 block truncate max-w-[145px]">{user.email}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-455 hover:bg-rose-500/5 transition-all cursor-pointer"
              title="登出"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Actions Panel */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleBackup}
              disabled={backingUp}
              className="flex items-center justify-center gap-1.5 p-2 bg-zinc-900 hover:bg-zinc-950 text-white border border-zinc-850 rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {backingUp ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5" />
              )}
              <span>备份 Schema</span>
            </button>

            <button
              onClick={() => fetchFiles(token!)}
              className={`flex items-center justify-center gap-1.5 p-2 border rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
                isMono
                  ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 shadow-xs'
                  : 'bg-zinc-90 w bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>刷新云端</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="搜索备份/图片..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchFiles(token!)}
              className={`w-full text-xs rounded-xl py-2 pl-8 pr-10 focus:outline-none transition-colors border ${
                isMono
                  ? 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 placeholder-zinc-400 shadow-xs'
                  : 'bg-zinc-950 border-zinc-900 focus:border-zinc-700 text-zinc-200 placeholder-zinc-650'
              }`}
            />
            {searchText && (
              <button 
                onClick={() => { setSearchText(''); setTimeout(() => fetchFiles(token!), 50); }}
                className="absolute right-2.5 top-2.5 text-[9px] font-mono hover:text-indigo-400 text-zinc-500 cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Messages alert banner */}
          {successMessage && (
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/30 rounded-xl text-[10px] text-emerald-400 flex items-start gap-1.5 animate-fade-in">
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}
          
          {errorMessage && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-900/30 rounded-xl text-[10px] text-rose-400 flex items-start gap-1.5 animate-fade-in">
              <Database className="w-3.5 h-3.5 flex-shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* File Lists */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
              云端文件 ({files.length})
            </span>
            
            <div className="max-h-56 overflow-y-auto pr-1 flex flex-col gap-1.5 custom-scrollbar text-xs">
              {loading && files.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-zinc-450" />
                  <span>列出您的云端素材...</span>
                </div>
              ) : files.length === 0 ? (
                <div className={`p-6 text-center text-zinc-500 border border-dashed rounded-xl ${isMono ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-850/80 bg-zinc-950/20'}`}>
                  没有找到符合的备份或图片。
                </div>
              ) : (
                files.map((file) => {
                  const isJson = file.mimeType === 'application/json';
                  return (
                    <div 
                      key={file.id}
                      className={`group p-2 rounded-xl flex items-center justify-between gap-2.5 transition-colors border ${
                        isMono 
                          ? 'bg-zinc-50/50 hover:bg-zinc-100/60 border-zinc-200' 
                          : 'bg-zinc-950/40 hover:bg-zinc-950 border-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate flex-1">
                        {isJson ? (
                          <div className="w-7 h-7 bg-amber-500/5 border border-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            {file.thumbnailLink ? (
                              <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5" />
                            )}
                          </div>
                        )}
                        <div className="truncate text-left leading-tight">
                          <span className={`text-[11px] font-medium block truncate group-hover:text-indigo-400 transition-colors ${isMono ? 'text-zinc-900' : 'text-zinc-200'}`}>
                            {file.name}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500 block">
                            {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'N/A'}{' '}
                            {file.size ? `· ${(parseInt(file.size) / 1024).toFixed(1)} KB` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Dynamic Action Trigger Button */}
                      {isJson ? (
                        <button
                          onClick={() => handleRestore(file)}
                          className="px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-indigo-400 font-bold hover:bg-amber-500 hover:text-zinc-950 text-[10px] rounded-lg cursor-pointer transition-all flex items-center gap-1 active:scale-95 text-xs shrink-0"
                          title="导入并应用当前结构备份"
                        >
                          <Download className="w-3 h-3" />
                          <span>还原</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyImageToField(file)}
                          className="px-2.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold hover:bg-indigo-600 hover:text-white text-[10px] rounded-lg cursor-pointer transition-all flex items-center gap-1 active:scale-95 text-xs shrink-0"
                          title="将图片链接填入活动组件"
                        >
                          <Link2 className="w-3 h-3" />
                          <span>连接</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Guide notes */}
            {user && (
              <p className="text-[9px] text-zinc-500 leading-relaxed pt-1.5 text-center px-1">
                💡 <b>提示:</b> 备份到 Google Drive 采用 <code>shop_schema_*.json</code> 文件名存储，列表内所有 <code>image/*</code> 格式的图片可通过点击“连接”快速填入您的活动组件中。
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
