
import React, { useState, useEffect } from 'react';
import { ProductInfo, AgeGroup, SellingFactor, ViralHookSubject } from '../types';
import { generateHooksAndSubjects } from '../services/geminiService';
import { MagicIcon, ThucAILogo } from './Icons';

interface HookGeneratorProps {
  productInfo: ProductInfo;
  hooks: ViralHookSubject[];
  setHooks: (hooks: ViralHookSubject[]) => void;
  ageGroup: AgeGroup;
  setAgeGroup: (age: AgeGroup) => void;
  sellingFactor: SellingFactor;
  setSellingFactor: (factor: SellingFactor) => void;
  specificDetails: string;
  setSpecificDetails: (details: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  onNext: (selected: ViralHookSubject, ageGroup: AgeGroup, sellingFactor: SellingFactor, specificDetails: string, duration: number) => void;
  onBack: () => void;
}

const HookGenerator: React.FC<HookGeneratorProps> = ({ 
  productInfo, 
  hooks, 
  setHooks, 
  ageGroup, 
  setAgeGroup, 
  sellingFactor, 
  setSellingFactor, 
  specificDetails, 
  setSpecificDetails, 
  duration, 
  setDuration, 
  onNext, 
  onBack 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateHooksAndSubjects(
        productInfo.name,
        productInfo.industry,
        productInfo.targetAudience,
        ageGroup,
        sellingFactor,
        specificDetails || productInfo.industry,
        productInfo.image
      );
      setHooks(result);
    } catch (e: any) {
      setError(e.message || 'Lỗi khi tạo Hook.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col p-4 md:p-10 animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <button onClick={onBack} className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">←</div>
            <span className="text-[11px] font-bold uppercase tracking-widest">QUAY LẠI BƯỚC 1</span>
          </button>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">BƯỚC 2: TẠO HOOK & CHỦ ĐỀ VIRAL</h2>
            <p className="text-slate-500 font-medium">Chọn các yếu tố để AI tạo ra những câu mở đầu thu hút nhất</p>
          </div>
          <div className="w-32 hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Độ tuổi mục tiêu</label>
                  <select 
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-600 transition-all cursor-pointer"
                  >
                    {Object.values(AgeGroup).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Yếu tố bán hàng chủ đạo</label>
                  <select 
                    value={sellingFactor}
                    onChange={(e) => setSellingFactor(e.target.value as SellingFactor)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-600 transition-all cursor-pointer"
                  >
                    {Object.values(SellingFactor).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Chi tiết / Đặc điểm nổi bật</label>
                  <input 
                    value={specificDetails}
                    onChange={(e) => setSpecificDetails(e.target.value)}
                    placeholder="Ví dụ: Chống nắng SPF 50+, Học 1 kèm 1, Pin 24h..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Thời lượng video (Giây)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[45, 60, 90].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`py-3 rounded-xl font-bold text-xs transition-all border ${
                          duration === d 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-300'
                        }`}
                      >
                        {d}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-[13px] tracking-widest hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-30 shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>ĐANG TẠO HOOK...</span>
                  </>
                ) : (
                  <>
                    <MagicIcon className="w-5 h-5" />
                    <span>TẠO 5 HOOK VIRAL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {error && (
              <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold text-sm animate-fadeIn">
                ⚠️ {error}
              </div>
            )}

            {hooks.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {hooks.map((h, i) => (
                  <div 
                    key={h.id} 
                    className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer animate-slideUp"
                    style={{ animationDelay: `${i * 0.1}s` }}
                    onClick={() => onNext(h, ageGroup, sellingFactor, specificDetails, duration)}
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">Hook #{i + 1}</span>
                          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{h.subject}</h3>
                        </div>
                        <p className="text-lg font-bold text-slate-700 leading-relaxed">"{h.hook}"</p>
                        <p className="text-sm text-slate-400 font-medium">{h.description}</p>
                      </div>
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 space-y-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MagicIcon className="w-10 h-10 text-slate-200" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Chưa có Hook nào được tạo</p>
                  <p className="text-slate-300 text-sm font-medium">Nhấn nút bên trái để bắt đầu sáng tạo nội dung viral</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HookGenerator;
