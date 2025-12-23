import React from 'react';
import { CalculationResult, PackageType } from '../types';
import { FINISHING_SPECS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, Hammer, HardHat, PaintBucket, Grid3x3, Droplets, Lightbulb, DoorOpen, ArrowUpDown, Zap, Wifi, Cylinder, ToggleLeft, Container, FileCheck, Sofa, Shovel } from 'lucide-react';

interface Props {
  result: CalculationResult;
  packageType: PackageType;
}

export const CostEstimate: React.FC<Props> = ({ result, packageType }) => {
  const costData = [
    { name: 'Vật tư Thô', value: result.costStructure.roughMaterialCost, color: '#f59e0b' },
    { name: 'Nhân công', value: result.costStructure.laborCost, color: '#3b82f6' },
    { name: 'Hoàn thiện', value: result.costStructure.finishingCost, color: '#10b981' },
    { name: 'Thiết bị & XD Khác', value: result.costStructure.equipmentCost, color: '#f43f5e' }, // Lifts, Piles
    { name: 'Nội thất & Tiện ích', value: result.costStructure.furnitureCost, color: '#8b5cf6' }, // Kitchen, Facade
    { name: 'Pháp lý & Thiết kế', value: result.costStructure.softCost, color: '#d946ef' },
    { name: 'Dự phòng (5%)', value: result.costStructure.contingency, color: '#64748b' }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-xs">
          <p className="text-white font-bold">{payload[0].name}</p>
          <p className="text-blue-400">{payload[0].value.toLocaleString('vi-VN')} đ</p>
          <p className="text-slate-500">{((payload[0].value / result.totalInvestment) * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const finishingSpecs = FINISHING_SPECS[packageType];
  const isRoughPackage = packageType === PackageType.Rough;

  const getIconForSpec = (key: string) => {
    // Categories matching keys in FINISHING_SPECS
    if (key.includes('Gạch')) return <Grid3x3 className="w-4 h-4 text-emerald-400" />;
    if (key.includes('Thiết bị VS')) return <Droplets className="w-4 h-4 text-cyan-400" />;
    if (key.includes('Sơn')) return <PaintBucket className="w-4 h-4 text-pink-400" />;
    if (key.includes('Cửa')) return <DoorOpen className="w-4 h-4 text-amber-400" />;
    if (key.includes('Dây điện')) return <Zap className="w-4 h-4 text-yellow-400" />;
    if (key.includes('Ống nước')) return <Container className="w-4 h-4 text-blue-500" />;
    if (key.includes('Công tắc')) return <ToggleLeft className="w-4 h-4 text-slate-300" />;
    if (key.includes('Đèn')) return <Lightbulb className="w-4 h-4 text-yellow-200" />;
    if (key.includes('Bồn nước') || key.includes('Bể phốt')) return <Cylinder className="w-4 h-4 text-indigo-400" />;
    if (key.includes('Mạng')) return <Wifi className="w-4 h-4 text-sky-400" />;
    
    return <Hammer className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Top Summary Card */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Tổng Mức Đầu Tư Dự Kiến</h3>
        <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 relative z-10 tracking-tight">
            {result.totalInvestment.toLocaleString('vi-VN')} <span className="text-blue-500 text-2xl align-top">đ</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400 relative z-10 mt-3">
            <span className="bg-slate-900/50 px-2 py-1 rounded border border-slate-700">CP Xây dựng: <b className="text-white">{result.totalCost.toLocaleString('vi-VN')} đ</b></span>
            <span className="bg-slate-900/50 px-2 py-1 rounded border border-slate-700">DT Quy đổi: <b className="text-white">{result.totalConvertedArea.toLocaleString('vi-VN')} m²</b></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart Visualization */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col justify-center items-center min-h-[250px]">
            <h4 className="text-xs text-slate-400 uppercase font-bold mb-2 w-full text-left">Phân bổ ngân sách</h4>
            <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={costData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {costData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            iconSize={8} 
                            layout="vertical" 
                            verticalAlign="middle" 
                            align="right"
                            wrapperStyle={{fontSize: '10px'}} 
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* List Breakdown - Condensed */}
        <div className="flex flex-col gap-2 justify-center">
            {[
                { label: 'Vật tư thô', val: result.costStructure.roughMaterialCost, icon: Hammer, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { label: 'Nhân công', val: result.costStructure.laborCost, icon: HardHat, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Hoàn thiện', val: result.costStructure.finishingCost, icon: PaintBucket, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Thiết bị & Cọc', val: result.costStructure.equipmentCost, icon: Shovel, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                { label: 'Nội thất & Tiện ích', val: result.costStructure.furnitureCost, icon: Sofa, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { label: 'Pháp lý & Thiết kế', val: result.costStructure.softCost, icon: FileCheck, color: 'text-pink-500', bg: 'bg-pink-500/10' },
            ].map((item, idx) => (
                item.val > 0 && (
                    <div key={idx} className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-md ${item.bg}`}>
                                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                            </div>
                            <span className="text-xs text-slate-300">{item.label}</span>
                        </div>
                        <span className="text-xs font-bold text-white">{item.val.toLocaleString('vi-VN')}</span>
                    </div>
                )
            ))}
             <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-slate-700">
                        <Container className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="text-xs text-slate-400">Dự phòng phí (5%)</span>
                </div>
                <span className="text-xs font-bold text-slate-400">{result.costStructure.contingency.toLocaleString('vi-VN')}</span>
            </div>
        </div>
      </div>

      {/* Finishing Materials Specs */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
                <Grid3x3 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Chi tiết Vật tư Hoàn thiện & M.E.P</h3>
            </div>
            <span className={`text-xs px-2 py-1 rounded font-medium ${
                isRoughPackage ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-400'
            }`}>
                Gói: {packageType}
            </span>
        </div>

        {isRoughPackage && (
            <div className="mb-4 p-3 bg-amber-900/20 border border-amber-900/30 rounded-lg text-xs text-amber-200">
                Lưu ý: Với gói Xây thô, các hạng mục Hoàn thiện bề mặt (Gạch, Sơn, TBVS) do Chủ đầu tư cung cấp. Nhà thầu thi công phần âm tường (Dây điện, Ống nước) và nhân công lắp đặt.
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(finishingSpecs).map(([key, value]) => (
                <div key={key} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                    <div className="mt-0.5 p-1.5 bg-slate-800 rounded-md border border-slate-700 shrink-0">
                        {getIconForSpec(key)}
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-400 mb-0.5 truncate">{key}</div>
                        <div className={`text-sm font-medium leading-tight ${
                             (isRoughPackage && (value as string).includes('Chủ nhà')) ? 'text-slate-500 italic' : 'text-white'
                        }`}>
                            {value as string}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex-1 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-bold text-white">Bảng tính chi tiết (Khối lượng & Đơn giá)</h3>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
                <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-2 text-left font-medium">Hạng Mục</th>
                        <th className="py-2 text-right font-medium">Khối lượng</th>
                        <th className="py-2 text-right font-medium text-white">Thành tiền (VNĐ)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                    {/* Core Construction */}
                    {result.breakdown.filter(i => !i.isExtra).map((item, index) => (
                        <tr key={`core-${index}`} className="hover:bg-slate-700/20 transition-colors">
                            <td className="py-2 text-slate-300">
                                {item.name} 
                                <span className="text-slate-500 block text-[10px] sm:inline sm:text-xs sm:ml-2">{item.description}</span>
                            </td>
                            <td className="py-2 text-right text-slate-400">
                                {item.convertedArea.toFixed(1)} m²
                            </td>
                            <td className="py-2 text-right font-medium text-slate-200">
                                {(item.convertedArea * result.unitPrice).toLocaleString('vi-VN')}
                            </td>
                        </tr>
                    ))}
                    
                    {/* Extras */}
                    {result.breakdown.filter(i => i.isExtra).length > 0 && (
                        <tr className="bg-slate-700/30">
                            <td colSpan={3} className="py-2 pl-2 text-xs font-bold text-amber-500 uppercase tracking-wide">
                                Hạng mục phát sinh & Tiện ích
                            </td>
                        </tr>
                    )}
                    {result.breakdown.filter(i => i.isExtra).map((item, index) => (
                        <tr key={`extra-${index}`} className="hover:bg-slate-700/20 transition-colors">
                            <td className="py-2 text-slate-300 pl-4 border-l-2 border-amber-500/50">
                                {item.name}
                                <span className="text-slate-500 block text-[10px] sm:inline sm:text-xs sm:ml-2">{item.description}</span>
                            </td>
                            <td className="py-2 text-right text-slate-400 italic">Theo gói</td>
                            <td className="py-2 text-right font-medium text-white">
                                {(item.cost || 0).toLocaleString('vi-VN')}
                            </td>
                        </tr>
                    ))}

                    <tr className="bg-slate-700/50 font-bold text-sm">
                        <td className="py-3 text-white pl-2">TỔNG CỘNG</td>
                        <td className="py-3 text-right text-slate-400 italic">Chưa gồm VAT</td>
                        <td className="py-3 text-right text-emerald-400 pr-2">
                            {result.totalInvestment.toLocaleString('vi-VN')}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};