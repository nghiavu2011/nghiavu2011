import React, { useState } from 'react';
import { X, ClipboardCheck, BookOpen, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PACKAGE_SPECS } from '../constants';
import { PackageType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalSpecsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'ratios' | 'packages'>('packages');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-[90rem] max-h-[95vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-900 flex justify-between items-center sticky top-0 z-20">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="w-6 h-6 text-amber-500" />
                <span className="hidden md:inline">Tiêu Chuẩn Kỹ Thuật & Vật Liệu</span>
                <span className="md:hidden">Tiêu Chuẩn Kỹ Thuật</span>
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-800/50 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('packages')}
                className={`px-4 md:px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'packages' ? 'text-amber-500 border-b-2 border-amber-500 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <ShieldCheck className="w-4 h-4" /> Bảng Spec (G0-G3)
            </button>
            <button 
                onClick={() => setActiveTab('materials')}
                className={`px-4 md:px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'materials' ? 'text-amber-500 border-b-2 border-amber-500 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <BookOpen className="w-4 h-4" /> Quy Chuẩn Vật Liệu
            </button>
            <button 
                onClick={() => setActiveTab('ratios')}
                className={`px-4 md:px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'ratios' ? 'text-amber-500 border-b-2 border-amber-500 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Layers className="w-4 h-4" /> Tỉ lệ trộn
            </button>
        </div>

        {/* Content */}
        <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-slate-900">
            
            {/* TAB 1: DETAILED SPECS COMPARISON (G0-G3) */}
            {activeTab === 'packages' && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                    <div className="sticky top-0 bg-slate-900/95 backdrop-blur z-10 p-3 border-b border-slate-700 shadow-md">
                        <p className="text-xs md:text-sm text-slate-400 text-center max-w-4xl mx-auto">
                            So sánh chi tiết kỹ thuật. <span className="text-blue-400 font-bold">G2 (Khá)</span> là lựa chọn cân bằng nhất. <span className="text-amber-400 font-bold">G3 (Cao cấp)</span> dành cho yêu cầu khắt khe về thẩm mỹ & độ bền.
                        </p>
                    </div>

                    <div className="p-4 md:p-6 pt-2">
                        {PACKAGE_SPECS.map((category) => (
                            <div key={category.id} className="mb-8">
                                <h3 className="text-base md:text-lg font-bold text-amber-500 mb-3 uppercase tracking-wide border-l-4 border-amber-500 pl-3 bg-amber-900/10 py-1 rounded-r">
                                    {category.name}
                                </h3>
                                <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-lg bg-slate-800">
                                    <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                                        <thead className="bg-slate-700 text-slate-200">
                                            <tr>
                                                <th className="p-3 border-r border-slate-600 w-[15%] min-w-[120px]">Hạng mục</th>
                                                <th className="p-3 border-r border-slate-600 w-[20%] min-w-[180px] text-slate-300">G0 - Xây Thô</th>
                                                <th className="p-3 border-r border-slate-600 w-[20%] min-w-[180px] text-white">G1 - Trung Bình</th>
                                                <th className="p-3 border-r border-slate-600 w-[22%] min-w-[200px] text-blue-300 bg-blue-900/20 border-b-2 border-b-blue-500">G2 - Khá (Khuyên dùng)</th>
                                                <th className="p-3 w-[23%] min-w-[200px] text-amber-400">G3 - Cao Cấp</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {category.specs.map((spec, idx) => (
                                                <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                                                    <td className="p-3 border-r border-slate-700 font-semibold text-slate-300 bg-slate-800/50 align-top">
                                                        {spec.title}
                                                    </td>
                                                    <td className="p-3 border-r border-slate-700 text-slate-400 text-xs leading-relaxed align-top">
                                                        {spec.items[PackageType.Rough]}
                                                    </td>
                                                    <td className="p-3 border-r border-slate-700 text-slate-300 text-xs leading-relaxed align-top">
                                                        {spec.items[PackageType.FullMedium]}
                                                    </td>
                                                    <td className="p-3 border-r border-slate-700 text-blue-100 bg-blue-900/5 text-xs leading-relaxed font-medium align-top border-l border-l-blue-900/30">
                                                        {spec.items[PackageType.FullGood]}
                                                    </td>
                                                    <td className="p-3 text-amber-100 text-xs leading-relaxed align-top">
                                                        {spec.items[PackageType.FullPremium]}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 2: MATERIALS */}
            {activeTab === 'materials' && (
                <div className="space-y-8 p-6 animate-in slide-in-from-right-4 duration-300">
                    <section>
                        <h3 className="text-lg font-bold text-blue-400 mb-4 uppercase tracking-wide">1. Cát Xây Dựng</h3>
                        <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-700/50 text-slate-300">
                                    <tr>
                                        <th className="p-3">Loại cát</th>
                                        <th className="p-3">Dùng cho</th>
                                        <th className="p-3">Yêu cầu kỹ thuật</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    <tr>
                                        <td className="p-3 font-medium text-white">Cát vàng bê tông</td>
                                        <td className="p-3">Đổ bê tông (Móng, Cột, Sàn)</td>
                                        <td className="p-3 text-slate-400">Hạt to, sạch, sắc cạnh, không lẫn bùn sét</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-medium text-white">Cát vàng xây tô</td>
                                        <td className="p-3">Xây tường</td>
                                        <td className="p-3 text-slate-400">Hạt vừa (module độ lớn &gt; 1.5)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-medium text-white">Cát đen (min)</td>
                                        <td className="p-3">Trát tường, cán nền</td>
                                        <td className="p-3 text-slate-400">Hạt mịn, đã sàng lọc tạp chất</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-rose-400 font-medium bg-rose-900/10 p-2 rounded border border-rose-900/20">
                            <AlertTriangle className="w-4 h-4" />
                            TUYỆT ĐỐI KHÔNG dùng cát nhiễm mặn, nhiễm phèn hoặc cát san lấp để đổ bê tông.
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-blue-400 mb-4 uppercase tracking-wide">2. Xi Măng & Cốt Liệu</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <h4 className="font-bold text-white mb-3">Xi Măng (PCB40)</h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex justify-between border-b border-slate-700 pb-1">
                                        <span>Hà Tiên / Insee</span>
                                        <span className="text-emerald-400 font-bold">Khuyên dùng</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-700 pb-1">
                                        <span>Nghi Sơn</span>
                                        <span className="text-emerald-400 font-bold">Khuyên dùng</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-700 pb-1">
                                        <span>Vicem / Chinfon</span>
                                        <span className="text-emerald-400 font-bold">Tốt</span>
                                    </li>
                                </ul>
                                <p className="text-xs text-slate-500 mt-2">
                                    * Ưu tiên PCB40 cho kết cấu chịu lực. Nội thất nhẹ có thể dùng PCB30.
                                </p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <h4 className="font-bold text-white mb-3">Đá & Sỏi</h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex justify-between border-b border-slate-700 pb-1">
                                        <span>Đá 1x2 (Xanh/Đen)</span>
                                        <span className="text-slate-400">Đổ bê tông kết cấu</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-700 pb-1">
                                        <span>Đá 4x6</span>
                                        <span className="text-slate-400">Lót móng, chèn hố</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-700 pb-1">
                                        <span>Đá mi / Bụi đá</span>
                                        <span className="text-slate-400">Cán nền chịu lực</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* TAB 3: RATIOS */}
            {activeTab === 'ratios' && (
                <div className="space-y-8 p-6 animate-in slide-in-from-right-4 duration-300">
                    <section>
                        <h3 className="text-lg font-bold text-amber-500 mb-4 uppercase tracking-wide">1. Bê Tông Kết Cấu (Mác 250)</h3>
                        <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
                            <div className="flex items-center justify-center gap-4 text-center mb-4">
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">1</div>
                                    <div className="text-xs text-slate-400 uppercase">Xi măng PCB40</div>
                                </div>
                                <div className="text-2xl text-slate-500 font-light">+</div>
                                <div>
                                    <div className="text-3xl font-bold text-amber-400 mb-1">2</div>
                                    <div className="text-xs text-slate-400 uppercase">Cát vàng</div>
                                </div>
                                <div className="text-2xl text-slate-500 font-light">+</div>
                                <div>
                                    <div className="text-3xl font-bold text-blue-400 mb-1">3</div>
                                    <div className="text-xs text-slate-400 uppercase">Đá 1x2</div>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded text-sm text-slate-300 text-center">
                                Nước sạch: 18-20 lít / 1 bao xi măng (Tùy độ ẩm cát)
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section>
                            <h3 className="text-lg font-bold text-amber-500 mb-4 uppercase tracking-wide">2. Vữa Xây Tô</h3>
                            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-700/50 text-slate-300">
                                        <tr>
                                            <th className="p-2 text-left">Hạng mục</th>
                                            <th className="p-2 text-right">Tỉ lệ (Xi : Cát)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        <tr>
                                            <td className="p-2 text-white">Xây tường bao</td>
                                            <td className="p-2 text-right font-mono text-amber-400">1 : 4 (Cát vàng)</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 text-white">Xây ngăn phòng</td>
                                            <td className="p-2 text-right font-mono text-amber-400">1 : 5 (Cát vàng)</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 text-white">Trát nội thất</td>
                                            <td className="p-2 text-right font-mono text-amber-400">1 : 4.5 (Cát đen)</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 text-white">Trát ngoại thất</td>
                                            <td className="p-2 text-right font-mono text-amber-400">1 : 3.5 (Cát vàng)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-amber-500 mb-4 uppercase tracking-wide">3. Cán Nền & Ốp Lát</h3>
                            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-700/50 text-slate-300">
                                        <tr>
                                            <th className="p-2 text-left">Hạng mục</th>
                                            <th className="p-2 text-right">Tỉ lệ / Vật liệu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        <tr>
                                            <td className="p-2 text-white">Cán nền thường</td>
                                            <td className="p-2 text-right font-mono text-amber-400">1 Xi : 3 Cát</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 text-white">Láng sàn gạch</td>
                                            <td className="p-2 text-right font-mono text-amber-400">1 Xi : 2.5 Cát</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 text-white">Dán gạch/đá</td>
                                            <td className="p-2 text-right text-emerald-400 font-bold">Keo dán chuyên dụng</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-2 text-[11px] text-slate-400 italic px-1">
                                * Khuyến nghị: Sử dụng keo dán gạch (Weber, Sika, Mapei) thay cho hồ dầu để tránh bong tróc.
                            </div>
                        </section>
                    </div>

                    <section className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/30">
                        <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Lưu ý quan trọng khi thi công:
                        </h4>
                        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                            <li>Bê tông phải được <strong>bảo dưỡng ẩm liên tục</strong> trong ít nhất 7 ngày đầu.</li>
                            <li>Tường xây nên tưới nước ẩm gạch trước khi xây để tăng độ kết dính.</li>
                            <li>Không trộn vữa quá nhiều cùng lúc, nên dùng hết trong vòng <strong>2 giờ</strong>.</li>
                            <li>Sử dụng lưới thủy tinh chống nứt tại các vị trí tiếp giáp (cột-tường, đà lanh tô).</li>
                        </ul>
                    </section>
                </div>
            )}
        </div>
        
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end sticky bottom-0 z-20">
             <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
            >
                Đóng
            </button>
        </div>
      </div>
    </div>
  );
};