
import React, { useState, useEffect } from 'react';
import { TargetAudience, Industry, ProductInfo } from '../types';
import { ThucAILogo } from './Icons';

interface ProductInputProps {
  onNext: (info: ProductInfo) => void;
}

const ProductInput: React.FC<ProductInputProps> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>(TargetAudience.GENERAL);
  const [industry, setIndustry] = useState<Industry>(Industry.FASHION);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) processFile(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onNext({ name, image, imagePreview, targetAudience, industry });
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 md:p-10 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-3xl mb-2">
            <ThucAILogo className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">BƯỚC 1: THÔNG TIN SẢN PHẨM</h2>
          <p className="text-slate-500 font-medium">Nhập thông tin cơ bản để AI hiểu về sản phẩm của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tên sản phẩm / Dịch vụ</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Kem chống nắng, Khóa học Tiếng Anh, Tai nghe Bluetooth..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ngành hàng</label>
                <select 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-600 transition-all cursor-pointer"
                >
                  {Object.values(Industry).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Đối tượng mục tiêu</label>
                <select 
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-600 transition-all cursor-pointer"
                >
                  {Object.values(TargetAudience).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ảnh sản phẩm (Tùy chọn)</label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full h-40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 bg-slate-50 group-hover:border-indigo-300'}`}>
                  {imagePreview ? (
                    <img src={imagePreview} className="h-full w-full object-contain p-4" alt="Preview" />
                  ) : (
                    <>
                      <span className="text-3xl mb-2">📸</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tải ảnh lên hoặc dán (Ctrl+V)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={!name.trim()}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-[13px] tracking-widest hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-30 shadow-xl shadow-slate-200"
          >
            TIẾP TỤC BƯỚC 2 →
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductInput;
