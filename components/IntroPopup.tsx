
import React, { useEffect, useState } from 'react';
import { CloseIcon, ThucAILogo } from './Icons';

const IntroPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Luôn hiển thị popup sau khi load trang (F5)
    const timer = setTimeout(() => setIsOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-fadeIn">
      <div onClick={handleClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"></div>
      
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-slideUp">
        <button 
          onClick={handleClose} 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all active:scale-90"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
              <ThucAILogo className="w-10 h-10" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Trợ lý Content Đa Ngành</h2>
            
            <div className="space-y-4 text-sm md:text-[15px] text-slate-600 font-medium leading-relaxed">
              <p>
                Chào mừng bạn đến với <span className="text-indigo-600 font-bold">Trợ lý content Hải</span>. Phiên bản này đã được nâng cấp để hỗ trợ sáng tạo nội dung cho <span className="font-bold">mọi ngành nghề</span>.
              </p>
              
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-indigo-700 text-xs md:text-sm text-left">
                <span className="font-bold">Sức mạnh AI:</span> Hệ thống có khả năng phân tích sản phẩm, thấu hiểu tâm lý khách hàng và tạo kịch bản viral cho TikTok, Reels, Shorts chỉ trong vài giây.
              </div>

              <p>
                Từ Thời trang, Mỹ phẩm đến Công nghệ hay Giáo dục - Chỉ cần nhập thông tin, AI sẽ lo phần còn lại.
              </p>
            </div>

            <div className="pt-6 flex flex-col gap-3">
              <button 
                onClick={handleClose}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
              >
                TÔI ĐÃ HIỂU & TRẢI NGHIỆM
              </button>
              
              <a 
                href="https://zalo.me/0981429564"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest"
              >
                Liên hệ Trợ lý content Hải để nhận bản riêng →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPopup;
