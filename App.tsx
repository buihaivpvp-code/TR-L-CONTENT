
import React, { useState, useEffect } from 'react';
import HistorySidebar from './components/HistorySidebar';
import ProductInput from './components/ProductInput';
import HookGenerator from './components/HookGenerator';
import ScriptDisplay from './components/ScriptDisplay';
import DonateModal from './components/DonateModal';
import IntroPopup from './components/IntroPopup';
import { generateScript, cloneScript } from './services/geminiService';
import { ScriptType, ScriptData, SingleScript, Gender, Industry, ScriptGoal, HookType, GenerationMode, TargetAudience, ContentStyle, AppMode, ProductInfo, ViralHookSubject, AgeGroup, SellingFactor } from './types';
import { MenuIcon, ThucAILogo, HeartIcon, MagicIcon } from './components/Icons';

interface LastRequest {
    mode: GenerationMode;
    imageFile: File | null;
    originalContent: string;
    scriptType: ScriptType;
    productName: string;
    idea: string;
    duration: number;
    gender?: Gender;
    industry?: Industry;
    scriptGoal?: ScriptGoal;
    hookType?: HookType;
    targetAudience?: TargetAudience;
    contentStyle?: ContentStyle;
    userSuggestions?: string;
}

const MAX_HISTORY_ITEMS = 15; // Tăng lên một chút vì chúng ta có cơ chế nén ảnh

const App: React.FC = () => {
  const [history, setHistory] = useState<ScriptData[]>([]);
  const [activeScript, setActiveScript] = useState<ScriptData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [lastRequest, setLastRequest] = useState<LastRequest | null>(null);
  const [appMode, setAppMode] = useState<AppMode>(AppMode.PRODUCT_INPUT);
  
  // Workflow state
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [selectedHook, setSelectedHook] = useState<ViralHookSubject | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(AgeGroup.GEN_Z);
  const [sellingFactor, setSellingFactor] = useState<SellingFactor>(SellingFactor.SALES);
  const [specificDetails, setSpecificDetails] = useState<string>('');
  const [duration, setDuration] = useState<number>(45);
  const [generatedHooks, setGeneratedHooks] = useState<ViralHookSubject[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('scriptHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi đọc lịch sử:", e);
        setHistory([]);
      }
    }
  }, []);

  const saveHistory = (newHistory: ScriptData[]) => {
    let currentHistory = [...newHistory].slice(0, MAX_HISTORY_ITEMS);
    
    const trySave = (data: ScriptData[]): boolean => {
      try {
        localStorage.setItem('scriptHistory', JSON.stringify(data));
        return true;
      } catch (e) {
        return false;
      }
    };

    // Bước 1: Thử lưu bình thường
    if (trySave(currentHistory)) {
      setHistory(currentHistory);
      return;
    }

    // Bước 2: Nếu lỗi, tối ưu bằng cách xóa ảnh của tất cả các kịch bản cũ (chỉ giữ ảnh của mục mới nhất)
    console.warn("Bộ nhớ localStorage đầy, đang tối ưu hóa dung lượng...");
    currentHistory = currentHistory.map((item, index) => 
      index === 0 ? item : { ...item, imagePreview: undefined }
    );

    if (trySave(currentHistory)) {
      setHistory(currentHistory);
      return;
    }

    // Bước 3: Nếu vẫn lỗi, xóa dần các mục cũ nhất cho đến khi lưu được
    while (currentHistory.length > 1) {
      currentHistory.pop(); // Xóa mục cuối cùng (cũ nhất)
      if (trySave(currentHistory)) {
        setHistory(currentHistory);
        return;
      }
    }

    // Bước cuối cùng: Nếu chỉ còn 1 mục mà vẫn không lưu nổi (thường do ảnh quá nặng), xóa luôn ảnh của mục đó
    if (currentHistory.length > 0) {
      currentHistory[0].imagePreview = undefined;
      trySave(currentHistory);
      setHistory(currentHistory);
    }
  }

  const handleProductInputNext = (info: ProductInfo) => {
    setProductInfo(info);
    setAppMode(AppMode.HOOK_GENERATOR);
  };

  const handleHookGeneratorNext = (selected: ViralHookSubject, age: AgeGroup, factor: SellingFactor, details: string, videoDuration: number) => {
    setSelectedHook(selected);
    setAgeGroup(age);
    setSellingFactor(factor);
    setSpecificDetails(details);
    setDuration(videoDuration);
    
    // Auto-trigger script generation
    handleGenerate(
      GenerationMode.IMAGE, 
      productInfo?.image || null, 
      '', 
      ScriptType.REVIEW, 
      productInfo?.name || '', 
      selected.subject, 
      videoDuration, 
      Gender.MALE, 
      productInfo?.industry, 
      ScriptGoal.SALES, 
      HookType.AUTO, 
      productInfo?.targetAudience, 
      ContentStyle.SALES, 
      `Hook: ${selected.hook}. Độ tuổi: ${age}. Yếu tố bán hàng: ${factor}. Chi tiết: ${details}.`
    );
    setAppMode(AppMode.SCRIPT_GENERATOR);
  };

  const handleGenerate = async (
      mode: GenerationMode, imageFile: File | null, originalContent: string, scriptType: ScriptType, 
      productName: string, idea: string, duration: number, gender?: Gender, industry?: Industry, 
      scriptGoal?: ScriptGoal, hookType?: HookType, targetAudience?: TargetAudience, contentStyle?: ContentStyle,
      userSuggestions?: string,
      refinementInstruction?: string
    ) => {
    setIsLoading(true);
    setError(null);
    setLastRequest({ mode, imageFile, originalContent, scriptType, productName, idea, duration, gender, industry, scriptGoal, hookType, targetAudience, contentStyle, userSuggestions });

    try {
      let scripts: SingleScript[] = [];
      let imagePreview = productInfo?.imagePreview || '';

      if (mode === GenerationMode.IMAGE && imageFile) {
          scripts = await generateScript(imageFile, scriptType, productName, idea, duration, gender, industry, scriptGoal, hookType, refinementInstruction, targetAudience, contentStyle, userSuggestions);
          if (!imagePreview) {
            imagePreview = await new Promise((res) => {
              const reader = new FileReader();
              reader.onloadend = () => res(reader.result as string);
              reader.readAsDataURL(imageFile);
            });
          }
      } else {
          scripts = await cloneScript(originalContent, scriptType, productName, duration, gender, industry, refinementInstruction, targetAudience, contentStyle, userSuggestions);
      }
      
      const newScriptData: ScriptData = {
        id: `script-${Date.now()}`,
        productName, idea, scripts, imagePreview, scriptType, duration, gender, industry, scriptGoal, hookType, targetAudience, contentStyle,
        timestamp: new Date().toLocaleString('vi-VN'),
        generationMode: mode,
        originalContent
      };

      saveHistory([newScriptData, ...history]);
      setActiveScript(newScriptData);
      setActiveHistoryId(newScriptData.id);
    } catch (e: any) {
      setError(e.message || 'Hệ thống AI đang bận, vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = (refinement?: string) => {
    if (lastRequest) handleGenerate(lastRequest.mode, lastRequest.imageFile, lastRequest.originalContent, lastRequest.scriptType, lastRequest.productName, lastRequest.idea, lastRequest.duration, lastRequest.gender, lastRequest.industry, lastRequest.scriptGoal, lastRequest.hookType, lastRequest.targetAudience, lastRequest.contentStyle, lastRequest.userSuggestions, refinement);
  };

  const handleSelectHistory = (id: string) => {
    const selected = history.find(item => item.id === id);
    if (selected) {
      setActiveScript(selected);
      setActiveHistoryId(id);
      setIsSidebarOpen(false);
      setAppMode(AppMode.SCRIPT_GENERATOR);
    }
  };

  const handleViralize = (subject: string) => {
    // This is now handled by the workflow, but we keep it for legacy history items if needed
    setAppMode(AppMode.HOOK_GENERATOR);
  };

  const renderContent = () => {
    if (activeScript && appMode === AppMode.SCRIPT_GENERATOR) {
      return (
        <ScriptDisplay 
          scriptData={activeScript} 
          onRegenerate={handleRegenerate} 
          onBack={() => {
            setActiveScript(null);
            setAppMode(AppMode.HOOK_GENERATOR);
          }} 
          isLoading={isLoading} 
          onViralize={handleViralize}
        />
      );
    }

    switch (appMode) {
      case AppMode.PRODUCT_INPUT:
        return <ProductInput onNext={handleProductInputNext} />;
      case AppMode.HOOK_GENERATOR:
        return productInfo ? (
          <HookGenerator 
            productInfo={productInfo} 
            hooks={generatedHooks}
            setHooks={setGeneratedHooks}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
            sellingFactor={sellingFactor}
            setSellingFactor={setSellingFactor}
            specificDetails={specificDetails}
            setSpecificDetails={setSpecificDetails}
            duration={duration}
            setDuration={setDuration}
            onNext={handleHookGeneratorNext} 
            onBack={() => setAppMode(AppMode.PRODUCT_INPUT)} 
          />
        ) : <ProductInput onNext={handleProductInputNext} />;
      case AppMode.SCRIPT_GENERATOR:
        return isLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center space-y-8 p-10">
            <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">ĐANG TẠO KỊCH BẢN BÁN HÀNG...</h3>
              <p className="text-slate-500 font-medium">AI đang phân tích Hook và sản phẩm để viết lời thoại tối ưu nhất</p>
            </div>
          </div>
        ) : null;
      default:
        return <ProductInput onNext={handleProductInputNext} />;
    }
  };

  return (
    <div className="h-screen bg-[#F1F3F9] flex flex-col overflow-hidden">
      <IntroPopup />
      <HistorySidebar history={history} onSelectHistory={handleSelectHistory} activeHistoryId={activeHistoryId} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 z-30 backdrop-blur-sm transition-all duration-500"></div>}
      
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />

      <header className="flex-shrink-0 w-full glass border-b border-slate-200/60 px-4 md:px-6 py-2 md:py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 md:p-3 rounded-xl md:rounded-2xl hover:bg-slate-100 transition-colors text-slate-600"><MenuIcon className="w-4 h-4 md:w-5 md:h-5"/></button>
            <div className="ml-2 md:ml-4 flex items-center gap-2 md:gap-3">
                <ThucAILogo className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
                <h1 className="text-sm md:text-lg font-black text-slate-900 tracking-tighter uppercase">Trợ lý content Hải</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => {
                  setActiveScript(null);
                  setGeneratedHooks([]);
                  setAppMode(AppMode.PRODUCT_INPUT);
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold tracking-widest hover:bg-indigo-600 transition-all"
              >
                <MagicIcon className="w-3 h-3" />
                TẠO MỚI
              </button>
              <button 
                onClick={() => setIsDonateOpen(true)} 
                className="flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black tracking-widest hover:shadow-lg hover:shadow-pink-200 transition-all hover:-translate-y-0.5"
              >
                <HeartIcon className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">ỦNG HỘ TÁC GIẢ</span>
                <span className="sm:hidden">DONATE</span>
              </button>
              <span className="hidden md:flex text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">Pro Edition</span>
          </div>
      </header>
      
      <main className="flex-grow flex flex-col overflow-y-auto">
        {error && !isLoading && <div className="bg-red-50 text-red-700 px-4 py-3 m-4 md:m-6 rounded-2xl border border-red-100 text-[10px] md:text-xs font-bold animate-fadeIn shadow-sm flex items-center gap-2"><span>⚠️</span> {error}</div>}
        <div className="flex-grow flex flex-col">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
