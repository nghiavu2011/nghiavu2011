import React, { useState } from 'react';
import { X, Heart, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-800 relative z-10 bg-slate-900">
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                Ủng hộ tác giả <Heart className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
            </h3>
            <p className="text-slate-400 text-sm">
                Sự ủng hộ của bạn giúp chúng tôi duy trì và phát triển các tính năng mới. Cảm ơn sự đóng góp của bạn!
            </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
            
            {/* Bank Name */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ngân hàng</label>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-white font-bold text-sm md:text-base leading-relaxed shadow-inner">
                    NGÂN HÀNG STANDARD CHARTERED - CHI NHÁNH LÊ ĐẠI HÀNH
                </div>
            </div>

            {/* Account Name */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Chủ tài khoản</label>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center justify-between group hover:border-amber-500/50 transition-colors">
                    <span className="text-white font-bold text-lg tracking-wide pl-1">VU TRONG NGHIA</span>
                    <button 
                        onClick={() => handleCopy('VU TRONG NGHIA', 'name')}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs transition-all"
                    >
                        {copiedField === 'name' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copiedField === 'name' ? 'Đã chép' : 'Sao chép'}
                    </button>
                </div>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Số tài khoản</label>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center justify-between group hover:border-amber-500/50 transition-colors">
                    <span className="text-amber-400 font-mono text-xl font-bold tracking-wider pl-1">66295869466</span>
                    <button 
                        onClick={() => handleCopy('66295869466', 'number')}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs transition-all"
                    >
                        {copiedField === 'number' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copiedField === 'number' ? 'Đã chép' : 'Sao chép'}
                    </button>
                </div>
            </div>

        </div>

        {/* Footer Action */}
        <div className="p-6 pt-2 bg-slate-900 sticky bottom-0 z-10">
            <button 
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-900/20 transition-all transform active:scale-[0.98]"
            >
                Đóng
            </button>
        </div>

      </div>
    </div>
  );
};

export default DonationModal;