import React from 'react';
import { X, Table, MapPin, Tag } from 'lucide-react';
import { LOCATION_MODIFIERS, PACKAGE_OPTIONS } from '../constants';
import { Location } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-400" />
            Bảng Đơn Giá & Hệ Số
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Base Prices Section */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                1. Đơn Giá Cơ Sở (Tham khảo 2024-2025)
            </h3>
            <div className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-700/50 text-slate-300">
                        <tr>
                            <th className="py-3 px-4 text-left">Gói Thầu</th>
                            <th className="py-3 px-4 text-right">Đơn giá (VNĐ/m²)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {PACKAGE_OPTIONS.map((pkg) => (
                            <tr key={pkg.id} className="hover:bg-slate-700/20">
                                <td className="py-3 px-4 text-slate-300 font-medium">{pkg.name}</td>
                                <td className="py-3 px-4 text-right text-emerald-400 font-mono">
                                    {pkg.price.toLocaleString('vi-VN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-slate-500 mt-2 italic">
                * Đơn giá chưa bao gồm thuế VAT và chi phí cọc khoan nhồi (nếu có).
            </p>
          </section>

          {/* Location Modifiers Section */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                2. Hệ Số Điều Chỉnh Khu Vực
            </h3>
            <div className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-700/50 text-slate-300">
                        <tr>
                            <th className="py-3 px-4 text-left">Khu Vực</th>
                            <th className="py-3 px-4 text-right">Hệ Số</th>
                            <th className="py-3 px-4 text-right">Giải trình</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {(Object.entries(LOCATION_MODIFIERS) as [Location, number][]).map(([loc, mod]) => (
                            <tr key={loc} className="hover:bg-slate-700/20">
                                <td className="py-3 px-4 text-slate-300 font-medium">{loc}</td>
                                <td className="py-3 px-4 text-right text-amber-400 font-mono">
                                    x {mod}
                                </td>
                                <td className="py-3 px-4 text-right text-slate-500 text-xs">
                                    {mod >= 1.05 ? 'Giá cao (nhân công/vận chuyển)' : mod < 1 ? 'Giá thấp hơn trung bình' : 'Giá tiêu chuẩn'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </section>

          {/* Formula Section */}
          <section className="bg-blue-900/20 p-4 rounded-xl border border-blue-900/30">
              <h3 className="text-sm font-bold text-blue-100 mb-2">Công thức tính toán:</h3>
              <p className="text-sm text-blue-200/80 font-mono">
                  Đơn giá thực tế = Đơn giá gói thầu (1) x Hệ số khu vực (2)
              </p>
          </section>

        </div>
        
        <div className="p-4 border-t border-slate-700 bg-slate-800 rounded-b-2xl">
            <button 
                onClick={onClose}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
            >
                Đóng
            </button>
        </div>

      </div>
    </div>
  );
};