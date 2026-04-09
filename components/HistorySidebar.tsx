import React from 'react';
import { ScriptData } from '../types';
import { HistoryIcon, CloseIcon } from './Icons';

interface HistorySidebarProps {
  history: ScriptData[];
  onSelectHistory: (id: string) => void;
  activeHistoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelectHistory, activeHistoryId, isOpen, onClose }) => {
  return (
    <aside className={`fixed top-0 left-0 h-full z-50 bg-white shadow-2xl flex flex-col w-full max-w-[280px] sm:max-w-xs transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <HistoryIcon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">LỊCH SỬ</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 transition-colors text-slate-400">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-y-auto flex-grow p-4 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 opacity-40">
            <HistoryIcon className="w-12 h-12 text-slate-300" />
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Chưa có kịch bản nào được lưu lại</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHistory(item.id)}
                className={`w-full group text-left p-4 rounded-[1.5rem] transition-all duration-300 border ${
                  activeHistoryId === item.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' 
                    : 'bg-white border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.imagePreview && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 bg-white">
                      <img src={item.imagePreview} className="w-full h-full object-cover" alt="Thumb" />
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <p className={`font-black text-[13px] truncate uppercase tracking-tight ${activeHistoryId === item.id ? 'text-white' : 'text-slate-900'}`}>
                      {item.productName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${activeHistoryId === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {item.industry}
                      </span>
                    </div>
                    <p className={`text-[9px] font-medium mt-2 opacity-60 ${activeHistoryId === item.id ? 'text-white' : 'text-slate-400'}`}>
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/30">
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] text-center">Thuc AI © 2024</p>
      </div>
    </aside>
  );
};

export default HistorySidebar;