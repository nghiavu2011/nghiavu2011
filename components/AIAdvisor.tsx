import React, { useState } from 'react';
import { Sparkles, Loader2, Info, BrainCircuit } from 'lucide-react';
import { analyzeEstimate } from '../services/geminiService';
import { CalculationResult, ConstructionInput } from '../types';
import ReactMarkdown from 'react-markdown';

interface Props {
  inputs: ConstructionInput;
  result: CalculationResult;
}

export const AIAdvisor: React.FC<Props> = ({ inputs, result }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAdvice(null);
    try {
      const response = await analyzeEstimate(inputs, result);
      setAdvice(response);
    } catch (err) {
      setAdvice("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg relative overflow-hidden flex flex-col h-full min-h-[300px]">
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 text-blue-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-lg">Tư vấn AI & Thẩm định giá</h3>
        </div>
        <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
            <span>{loading ? 'Đang xử lý...' : 'Phân tích ngay'}</span>
        </button>
      </div>

      <div className="flex-1 bg-slate-900/50 rounded-lg border border-slate-700/50 p-5 relative z-10 overflow-hidden flex flex-col">
        {!advice && !loading && (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center py-6 animate-in fade-in zoom-in duration-500">
                <div className="bg-slate-800 p-4 rounded-full mb-4 shadow-inner">
                    <BrainCircuit className="w-10 h-10 text-slate-600" />
                </div>
                <h4 className="text-slate-300 font-medium mb-1">Chưa có dữ liệu phân tích</h4>
                <p className="text-sm max-w-xs leading-relaxed text-slate-500">
                    Bấm nút <span className="text-blue-400 font-semibold">"Phân tích ngay"</span> để Gemini AI kiểm tra đơn giá thị trường tại {inputs.location} và đưa ra lời khuyên tối ưu chi phí.
                </p>
             </div>
        )}

        {loading && (
             <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-6 animate-in fade-in duration-300">
                <div className="relative">
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-ping"></div>
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-30 animate-pulse delay-75"></div>
                    
                    {/* Center Spinner */}
                    <div className="relative z-10 bg-slate-900 p-4 rounded-full border border-blue-500/30 shadow-xl shadow-blue-500/10">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                </div>
                
                <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-blue-300 animate-pulse">Đang kết nối chuyên gia AI...</p>
                    <div className="flex gap-1 justify-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-0"></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300"></span>
                    </div>
                    <p className="text-xs text-slate-500">Đang tra cứu đơn giá & phân tích dự toán</p>
                </div>
             </div>
        )}

        {advice && (
            <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-white prose-strong:text-amber-400 prose-ul:my-2 prose-li:my-0.5 animate-in slide-in-from-bottom-2 duration-500 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
                <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
        )}
      </div>
    </div>
  );
};
