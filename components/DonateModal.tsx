
import React, { useState } from 'react';
import { CloseIcon, HeartIcon } from './Icons';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const accountNumber = "1022531897";
  const amount = "50000";
  const message = "Ung Ho Tro Ly Content Hai";
  
  const qrUrl = `https://img.vietqr.io/image/VCB-1022531897-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(message)}&accountName=BUI%20DUC%20HAI`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fadeIn">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"></div>
      
      <div className="relative w-full max-w-[340px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-scaleIn">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 active:scale-90 transition-all z-20 border border-slate-100"
          aria-label="Đóng"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 bg-pink-50 rounded-full mb-3 shadow-inner">
            <HeartIcon className="w-6 h-6 text-pink-500 animate-pulse" />
          </div>
          
          <h2 className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-tight italic">Mời mình ly cafe nhen!</h2>
          <p className="text-[11px] text-slate-500 font-medium mb-5 px-4 leading-relaxed">Sự ủng hộ của bạn là động lực rất lớn để mình hoàn thiện app này đó.</p>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
            <div className="bg-white rounded-xl p-2 shadow-sm mb-3 inline-block border border-slate-100">
                <img 
                    src={qrUrl} 
                    alt="Donate QR Code" 
                    className="w-32 h-32 mx-auto"
                />
            </div>
            
            <div className="space-y-0.5">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">CHỦ TÀI KHOẢN</p>
                <p className="text-sm font-bold text-slate-800 uppercase">BUI DUC HAI</p>
                <p className="text-[11px] font-semibold text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded-full mt-1">VIETCOMBANK - 1022531897</p>
                <div className="mt-2 pt-2 border-t border-slate-200/50">
                    <p className="text-[9px] text-slate-400 font-medium">NỘI DUNG CK:</p>
                    <p className="text-[10px] text-slate-600 font-bold italic lowercase">{message}</p>
                </div>
            </div>
          </div>

          <button 
            onClick={handleCopy}
            className={`w-full py-3.5 rounded-xl font-bold text-[11px] tracking-widest transition-all active:scale-95 shadow-sm ${copied ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
          >
            {copied ? 'ĐÃ SAO CHÉP STK RỒI NHA' : `SAO CHÉP SỐ TÀI KHOẢN`}
          </button>
          
          <p className="mt-4 text-[10px] font-medium text-slate-400 italic">"Cảm ơn bạn đã đồng hành cùng mình!"</p>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;
