import React from 'react';
import { CalculationResult } from '../types';
import { Package, Truck, Hammer, CalendarClock, FileText } from 'lucide-react';

interface Props {
  result: CalculationResult;
  onOpenTechSpecs?: () => void;
}

export const MaterialBreakdown: React.FC<Props> = ({ result, onOpenTechSpecs }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
      
      {/* Schedule Banner */}
      <div className="flex items-center justify-between bg-blue-900/30 p-4 rounded-lg border border-blue-800/50 mb-6">
         <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-md">
                 <CalendarClock className="w-5 h-5 text-white" />
             </div>
             <div>
                 <div className="text-xs text-blue-200">Thời gian thi công dự kiến</div>
                 <div className="text-lg font-bold text-white">{result.constructionTimeWeeks} tuần (~{(result.constructionTimeWeeks/4).toFixed(1)} tháng)</div>
             </div>
         </div>
         <div className="text-right hidden sm:block">
             <div className="text-xs text-slate-400">Điều kiện tiêu chuẩn</div>
             <div className="text-xs text-slate-500">Chưa gồm thời gian xin GPXD</div>
         </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Dự trù vật tư chính (Ước tính)</h3>
        </div>
        {onOpenTechSpecs && (
            <button 
                onClick={onOpenTechSpecs}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs text-white rounded-lg transition-colors border border-slate-600 hover:border-slate-500 shadow-sm"
            >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Tiêu chuẩn Kỹ Thuật</span>
                <span className="sm:hidden">Tiêu chuẩn</span>
            </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 flex flex-col items-center text-center">
              <span className="text-slate-400 text-xs mb-1">Gạch xây (viên)</span>
              <span className="text-xl font-bold text-white">{result.materials.bricks.toLocaleString('vi-VN')}</span>
              <span className="text-[10px] text-slate-500">Tuynel 8x8x18</span>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 flex flex-col items-center text-center">
              <span className="text-slate-400 text-xs mb-1">Xi măng (tấn)</span>
              <span className="text-xl font-bold text-white">{(result.materials.cement / 1000).toFixed(1)}</span>
              <span className="text-[10px] text-slate-500">PCB30/PCB40</span>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 flex flex-col items-center text-center">
              <span className="text-slate-400 text-xs mb-1">Thép (tấn)</span>
              <span className="text-xl font-bold text-white">{(result.materials.steel / 1000).toFixed(2)}</span>
              <span className="text-[10px] text-slate-500">Hòa Phát/Việt Nhật</span>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 flex flex-col items-center text-center">
              <span className="text-slate-400 text-xs mb-1">Cát (m³)</span>
              <span className="text-xl font-bold text-white">{result.materials.sand}</span>
              <span className="text-[10px] text-slate-500">Bê tông + Xây trát</span>
          </div>
           <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 flex flex-col items-center text-center">
              <span className="text-slate-400 text-xs mb-1">Đá (m³)</span>
              <span className="text-xl font-bold text-white">{result.materials.stone}</span>
              <span className="text-[10px] text-slate-500">1x2</span>
          </div>
           <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 flex flex-col items-center text-center">
              <span className="text-slate-400 text-xs mb-1">Sơn nước (m²)</span>
              <span className="text-xl font-bold text-white">{result.materials.paint.toLocaleString('vi-VN')}</span>
              <span className="text-[10px] text-slate-500">Tường + Trần</span>
          </div>
      </div>
      
      <p className="text-xs text-slate-500 italic border-t border-slate-700 pt-3">
          * Lưu ý: Số lượng trên là ước tính dựa trên suất định mức chung. Thực tế có thể thay đổi ±10% tùy thuộc vào thiết kế kiến trúc, kết cấu cụ thể và hao hụt thi công.
      </p>
    </div>
  );
};