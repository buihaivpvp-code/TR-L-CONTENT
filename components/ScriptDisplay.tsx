
import React, { useState } from 'react';
import { ScriptData } from '../types';
import { HeartIcon, RegenerateIcon } from './Icons';
import DonateModal from './DonateModal';

interface ScriptDisplayProps {
  scriptData: ScriptData;
  onRegenerate: (refinementInstruction?: string) => void;
  onBack: () => void;
  isLoading: boolean;
  onViralize: (subject: string) => void; // Keep for prop compatibility in App.tsx but hide button
}

const SceneTable: React.FC<{ content: string }> = ({ content }) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    const tableLines = lines.filter(l => l.trim().startsWith('|') && l.includes('|'));
    
    if (tableLines.length === 0) return <div className="text-slate-500 italic text-sm leading-relaxed">{content}</div>;

    const parseRow = (line: string) => line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
    
    const headerRow = parseRow(tableLines[0]);
    const bodyRows = tableLines.slice(1).filter(l => !l.includes('---')).map(l => parseRow(l));

    return (
        <div className="overflow-x-auto my-4 md:my-6 rounded-xl md:rounded-2xl border border-slate-200 bg-white table-shadow">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        {headerRow.map((cell, i) => (
                            <th key={i} className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left whitespace-nowrap">{cell}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {bodyRows.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            {row.map((cell, j) => (
                                <td key={j} className="px-4 md:px-6 py-4 md:py-5 text-[12px] md:text-[14px] font-normal text-slate-600 leading-relaxed align-top">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ScriptCard: React.FC<{ script: any, index: number }> = ({ script, index }) => {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = () => {
        const text = `KỊCH BẢN ${index + 1}: ${script.title}\n\nLỜI THOẠI:\n${script.voiceOver}\n\nCẢNH QUAY:\n${script.shotsTable}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-200 space-y-6 md:space-y-10 group animate-slideUp">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 md:pb-8">
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg md:text-xl font-bold shadow-sm">
                        {index + 1}
                    </div>
                    <div>
                        <h3 className="text-lg md:text-2xl font-bold text-slate-900 leading-tight mb-1">{script.title}</h3>
                        <div className="flex gap-3">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">TikTok Affiliate</span>
                            <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">High conversion</span>
                        </div>
                    </div>
                </div>
                <button onClick={copyToClipboard} className={`w-full md:w-auto px-5 md:px-7 py-2.5 md:py-3 rounded-lg text-[10px] font-bold tracking-wider transition-all border ${copied ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {copied ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP KỊCH BẢN'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="p-5 md:p-8 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 md:mb-5 flex items-center gap-2">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                        Lời thoại Voice-over
                    </h4>
                    <p className="text-[14px] md:text-[16px] text-slate-700 font-normal leading-relaxed md:leading-loose">
                        {script.voiceOver}
                    </p>
                </div>
                <div className="space-y-4 md:space-y-6">
                    <div className="p-5 md:p-6 bg-amber-50/40 rounded-xl border border-amber-100/50">
                        <h4 className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-2">Chữ hiện màn hình</h4>
                        <p className="text-[13px] md:text-[15px] text-slate-800 font-medium italic">"{script.textOverlays}"</p>
                    </div>
                    <div className="p-5 md:p-6 bg-slate-50 rounded-xl border border-slate-100">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Âm nhạc & Mood</h4>
                        <p className="text-[13px] md:text-[15px] text-slate-700 font-medium">{script.musicVibe}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 md:space-y-5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest ml-1">Kế hoạch quay chi tiết</h4>
                <SceneTable content={script.shotsTable} />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                {script.hashtags.map((h: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded-md border border-slate-200">#{h.replace('#', '')}</span>
                ))}
            </div>
        </div>
    );
};

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ scriptData, onRegenerate, onBack, isLoading, onViralize }) => {
    const [refinement, setRefinement] = useState('');
    const [isDonateOpen, setIsDonateOpen] = useState(false);

    const handleViralize = () => {
        const subject = `Sản phẩm: ${scriptData.productName}. Ý tưởng: ${scriptData.idea}. Ngành: ${scriptData.industry}.`;
        onViralize(subject);
    };

    return (
        <div className="flex-grow w-full max-w-6xl mx-auto p-4 md:p-10 animate-fadeIn">
            <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
            
            <div className="flex flex-col lg:flex-row justify-between items-center mb-8 md:mb-12 gap-5 md:gap-10">
                <button onClick={onBack} className="w-full lg:w-auto flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
                    <div className="bg-white p-2 md:p-3 rounded-lg shadow-sm border border-slate-200 transition-transform">←</div>
                    <span className="text-[11px] font-bold uppercase tracking-widest">QUAY LẠI</span>
                </button>

                <div className="flex-grow max-w-2xl w-full flex bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                    <input 
                        value={refinement} 
                        onChange={(e) => setRefinement(e.target.value)} 
                        placeholder="Yêu cầu điều chỉnh kịch bản (VD: Làm hài hước hơn)..." 
                        className="flex-grow bg-transparent px-4 md:px-6 text-[13px] font-normal outline-none text-slate-700 placeholder:text-slate-400" 
                    />
                    <button 
                        onClick={() => onRegenerate(refinement)} 
                        disabled={isLoading || !refinement.trim()} 
                        className="px-6 md:px-8 py-2.5 md:py-3 bg-slate-900 text-white rounded-lg text-[10px] font-bold tracking-widest disabled:opacity-30 transition-all hover:bg-indigo-600"
                    >
                        {isLoading ? 'ĐANG GỬI...' : 'CẬP NHẬT'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12">
                <div className="xl:col-span-4 space-y-4 md:space-y-8">
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 lg:sticky lg:top-32">
                        <div className="space-y-6">
                            {scriptData.imagePreview && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group overflow-hidden rounded-xl border border-slate-100 shadow-sm w-32 h-32">
                                        <img src={scriptData.imagePreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Product" />
                                    </div>
                                    <button 
                                        onClick={() => onRegenerate()}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-[10px] tracking-widest hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <RegenerateIcon className="w-4 h-4" />
                                        )}
                                        {isLoading ? 'ĐANG TẠO...' : 'TẠO KỊCH BẢN KHÁC'}
                                    </button>
                                </div>
                            )}
                            <div className="space-y-2 text-center md:text-left">
                                <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{scriptData.productName}</h2>
                                <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider">{scriptData.industry}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Thời lượng</p>
                                    <p className="text-lg font-bold text-slate-800">{scriptData.duration}s</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Mục tiêu</p>
                                    <p className="text-[11px] font-bold text-slate-800 uppercase truncate">{scriptData.scriptGoal}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-8 space-y-10 md:space-y-14 pb-24 md:pb-32">
                    {scriptData.scripts.map((script, idx) => (
                        <ScriptCard key={idx} script={script} index={idx} />
                    ))}

                    <div className="bg-white rounded-2xl p-8 md:p-12 text-center border-2 border-indigo-100 shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <HeartIcon className="w-48 h-48" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 relative z-10">Bạn hài lòng với kết quả chứ?</h4>
                        <p className="text-slate-500 text-sm md:text-base font-normal mb-8 max-w-md mx-auto relative z-10 leading-relaxed">Để ủng hộ đội ngũ phát triển duy trì hệ thống AI, hãy mời chúng tôi một ly cafe nhé!</p>
                        <button 
                            onClick={() => setIsDonateOpen(true)}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-[13px] tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 relative z-10"
                        >
                            MỜI CAFE TÁC GIẢ ☕
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScriptDisplay;
