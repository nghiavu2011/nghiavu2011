import React, { useState } from 'react';
import { ConstructionInput, Location, PackageType, WallType, StairType, ElevatorType, ProjectType, FacadeType, HandoverMode } from '../types';
import { FOUNDATION_OPTIONS, ROOF_OPTIONS, PACKAGE_OPTIONS, BASE_PRICES, LOCATION_MODIFIERS, PROJECT_TYPE_MODIFIERS, CONDITION_COSTS, HANDOVER_OPTIONS } from '../constants';
import { Layers, Settings, ChevronDown, ChevronUp, Plus, Minus, MapPin, AlignStartVertical, ArrowUpDown, Truck, Building2, Clock, Container, Briefcase, Shovel, Paintbrush, Zap, FileCheck, Check, X, Info } from 'lucide-react';

interface Props {
  inputs: ConstructionInput;
  onChange: (inputs: ConstructionInput) => void;
}

export const ConstructionForm: React.FC<Props> = ({ inputs, onChange }) => {
  const [activeSection, setActiveSection] = useState<'basic' | 'advanced' | 'scope'>('basic');

  const handleChange = (field: keyof ConstructionInput, value: any) => {
    if (typeof value === 'number' && value < 0) return;
    onChange({ ...inputs, [field]: value });
  };

  const adjustValue = (field: keyof ConstructionInput, delta: number) => {
    const currentValue = inputs[field] as number;
    const newValue = Math.max(0, parseFloat((currentValue + delta).toFixed(1)));
    handleChange(field, newValue);
  };

  const currentBasePrice = BASE_PRICES[inputs.packageType];
  const locationModifier = LOCATION_MODIFIERS[inputs.location];
  const projectModifier = PROJECT_TYPE_MODIFIERS[inputs.projectType];
  
  let conditionMod = 1.0;
  if (inputs.isSmallAlley) conditionMod += CONDITION_COSTS.SMALL_ALLEY;
  if (inputs.isTruckBan) conditionMod += CONDITION_COSTS.TRUCK_BAN;
  if (inputs.isRestrictedHours) conditionMod += CONDITION_COSTS.RESTRICTED_HOURS;
  if (!inputs.hasMaterialElevator && inputs.floors > 3) conditionMod += CONDITION_COSTS.NO_ELEVATOR_HIGH_RISE;

  const finalPrice = currentBasePrice * locationModifier * projectModifier * conditionMod;

  const renderPriceExplanation = () => {
    if (inputs.handoverMode === HandoverMode.ModeA || inputs.packageType === PackageType.Rough) return null;

    if (inputs.packageType === PackageType.FullGood && (inputs.handoverMode === HandoverMode.ModeB || inputs.handoverMode === HandoverMode.ModeC)) {
        return (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs space-y-2 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase">
                    <Info className="w-3.5 h-3.5" />
                    <span>Vì sao Nội thất Gói Khá (G2) &gt; 8.5tr/m²?</span>
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-1 marker:text-amber-500">
                    <li>Sử dụng <strong>MDF lõi xanh chống ẩm</strong> (không dùng ván thường).</li>
                    <li>Phụ kiện bản lề/ray giảm chấn chính hãng.</li>
                    <li>Mặt đá bếp Quartz cao cấp & kính ốp bếp.</li>
                    <li>Bao gồm trọn bộ thiết bị bếp (Bếp từ đôi + Hút mùi + Chậu vòi).</li>
                </ul>
                <div className="text-[10px] text-slate-400 italic pt-1 border-t border-amber-500/20">
                    * Giá thị trường hiện nay 8.5 - 10.5tr/m² cho nội thất đóng chuẩn là phổ biến.
                </div>
            </div>
        );
    }
    
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 h-full flex flex-col overflow-hidden">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-700 bg-slate-900/50">
          <button 
            onClick={() => setActiveSection('basic')}
            className={`flex-1 py-3 text-xs md:text-sm font-medium transition-colors border-b-2 ${activeSection === 'basic' ? 'text-blue-400 border-blue-500 bg-slate-800' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
          >
            Thông số chính
          </button>
          <button 
            onClick={() => setActiveSection('advanced')}
            className={`flex-1 py-3 text-xs md:text-sm font-medium transition-colors border-b-2 ${activeSection === 'advanced' ? 'text-blue-400 border-blue-500 bg-slate-800' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
          >
            Kỹ thuật
          </button>
          <button 
            onClick={() => setActiveSection('scope')}
            className={`flex-1 py-3 text-xs md:text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-1 ${activeSection === 'scope' ? 'text-amber-400 border-amber-500 bg-slate-800' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
          >
            <Briefcase className="w-3 h-3" /> Phạm vi & Bàn giao
          </button>
      </div>

      <div className="p-5 flex flex-col gap-5 overflow-y-auto custom-scrollbar flex-1">
        
        {/* SECTION 1: BASIC INPUTS */}
        {activeSection === 'basic' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
                {/* Project Type */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Loại công trình
                    </label>
                    <select
                        value={inputs.projectType}
                        onChange={(e) => handleChange('projectType', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    >
                        {Object.values(ProjectType).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Chiều rộng (m)</label>
                    <div className="relative flex items-center">
                        <button onClick={() => adjustValue('width', -0.5)} className="absolute left-1 p-1 text-slate-400 hover:text-white"><Minus className="w-3 h-3"/></button>
                        <input
                            type="number"
                            min={1}
                            step={0.1}
                            value={inputs.width}
                            onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-8 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        />
                        <button onClick={() => adjustValue('width', 0.5)} className="absolute right-1 p-1 text-slate-400 hover:text-white"><Plus className="w-3 h-3"/></button>
                    </div>
                    </div>
                    <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Chiều dài (m)</label>
                    <div className="relative flex items-center">
                        <button onClick={() => adjustValue('length', -0.5)} className="absolute left-1 p-1 text-slate-400 hover:text-white"><Minus className="w-3 h-3"/></button>
                        <input
                            type="number"
                            min={1}
                            step={0.1}
                            value={inputs.length}
                            onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-8 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        />
                        <button onClick={() => adjustValue('length', 0.5)} className="absolute right-1 p-1 text-slate-400 hover:text-white"><Plus className="w-3 h-3"/></button>
                    </div>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Địa điểm
                    </label>
                    <select
                        value={inputs.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        {Object.values(Location).map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Floors */}
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-400">Số tầng (bao gồm trệt)</label>
                        <div className="flex items-center gap-2">
                            <button onClick={() => adjustValue('floors', -1)} className="p-0.5 bg-slate-700 rounded hover:bg-slate-600"><Minus className="w-3 h-3"/></button>
                            <span className="text-blue-400 font-bold min-w-[20px] text-center">{inputs.floors}</span>
                            <button onClick={() => adjustValue('floors', 1)} className="p-0.5 bg-slate-700 rounded hover:bg-slate-600"><Plus className="w-3 h-3"/></button>
                        </div>
                    </div>
                    <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={inputs.floors}
                    onChange={(e) => handleChange('floors', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Foundation & Roof */}
                <div className="space-y-3">
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <label className="block text-xs font-medium text-slate-300 mb-1">Loại Móng</label>
                        <div className="flex gap-2">
                        <select
                            value={inputs.foundationType}
                            onChange={(e) => {
                                const opt = FOUNDATION_OPTIONS.find(o => o.name === e.target.value);
                                handleChange('foundationType', e.target.value);
                                if(opt) handleChange('foundationPercent', opt.defaultPercent);
                            }}
                            className="flex-1 bg-slate-800 border border-slate-600 rounded py-1.5 px-2 text-xs text-white focus:ring-1 focus:ring-blue-500"
                        >
                            {FOUNDATION_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.name}>{opt.name}</option>
                            ))}
                        </select>
                        <div className="relative w-16">
                            <input
                                type="number"
                                value={inputs.foundationPercent}
                                onChange={(e) => handleChange('foundationPercent', parseFloat(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-600 rounded py-1.5 px-1 text-xs text-right text-white"
                            />
                            <span className="absolute right-1 top-1.5 text-slate-400 text-[10px]">%</span>
                        </div>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <label className="block text-xs font-medium text-slate-300 mb-1">Loại Mái</label>
                        <div className="flex gap-2">
                        <select
                            value={inputs.roofType}
                            onChange={(e) => {
                                const opt = ROOF_OPTIONS.find(o => o.name === e.target.value);
                                handleChange('roofType', e.target.value);
                                if(opt) handleChange('roofPercent', opt.defaultPercent);
                            }}
                            className="flex-1 bg-slate-800 border border-slate-600 rounded py-1.5 px-2 text-xs text-white focus:ring-1 focus:ring-blue-500"
                        >
                            {ROOF_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.name}>{opt.name}</option>
                            ))}
                        </select>
                        <div className="relative w-16">
                            <input
                                type="number"
                                value={inputs.roofPercent}
                                onChange={(e) => handleChange('roofPercent', parseFloat(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-600 rounded py-1.5 px-1 text-xs text-right text-white"
                            />
                            <span className="absolute right-1 top-1.5 text-slate-400 text-[10px]">%</span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* SECTION 2: ADVANCED TECHNICAL */}
        {activeSection === 'advanced' && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 space-y-2">
                    <label className="block text-xs font-bold text-amber-500 mb-1 flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Điều kiện thi công (Ảnh hưởng đơn giá)
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 p-1 rounded transition-colors">
                        <input 
                            type="checkbox" 
                            checked={inputs.isSmallAlley}
                            onChange={(e) => handleChange('isSmallAlley', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-800 border-slate-600 focus:ring-amber-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-xs text-slate-300">Hẻm nhỏ {'<'} 3m (Xe ba gác)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 p-1 rounded transition-colors">
                        <input 
                            type="checkbox" 
                            checked={inputs.isTruckBan}
                            onChange={(e) => handleChange('isTruckBan', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-800 border-slate-600 focus:ring-amber-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-xs text-slate-300">Cấm tải / Không bãi tập kết</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 p-1 rounded transition-colors">
                        <input 
                            type="checkbox" 
                            checked={inputs.isRestrictedHours}
                            onChange={(e) => handleChange('isRestrictedHours', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-800 border-slate-600 focus:ring-amber-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-xs text-slate-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Giờ thi công hạn chế (Đêm/HC)
                        </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 p-1 rounded transition-colors">
                        <input 
                            type="checkbox" 
                            checked={inputs.hasMaterialElevator}
                            onChange={(e) => handleChange('hasMaterialElevator', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-blue-500 bg-slate-800 border-slate-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-xs text-slate-300 flex items-center gap-1">
                            <Container className="w-3 h-3" /> Có thang máy chuyển vật tư
                        </span>
                    </label>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Loại tường xây</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => handleChange('wallType', WallType.Wall10)}
                            className={`text-xs p-2 rounded border ${inputs.wallType === WallType.Wall10 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-300'}`}
                        >
                            Tường 10
                        </button>
                        <button 
                            onClick={() => handleChange('wallType', WallType.Wall20)}
                            className={`text-xs p-2 rounded border ${inputs.wallType === WallType.Wall20 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-300'}`}
                        >
                            Tường 20
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                            <AlignStartVertical className="w-3 h-3" /> Loại cầu thang
                        </label>
                        <select
                            value={inputs.stairType}
                            onChange={(e) => handleChange('stairType', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        >
                            {Object.values(StairType).map((stair) => (
                                <option key={stair} value={stair}>{stair}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                            <ArrowUpDown className="w-3 h-3" /> Thang máy (Thiết bị)
                        </label>
                        <select
                            value={inputs.elevatorType}
                            onChange={(e) => handleChange('elevatorType', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        >
                            {Object.values(ElevatorType).map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Số lượng WC</label>
                    <div className="flex items-center">
                        <button onClick={() => adjustValue('numBathrooms', -1)} className="p-2 bg-slate-700 rounded-l hover:bg-slate-600 border-r border-slate-600"><Minus className="w-3 h-3"/></button>
                        <input
                            type="number"
                            min={1}
                            value={inputs.numBathrooms}
                            onChange={(e) => handleChange('numBathrooms', parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border-y border-slate-700 py-1.5 px-3 text-white text-xs text-center"
                        />
                        <button onClick={() => adjustValue('numBathrooms', 1)} className="p-2 bg-slate-700 rounded-r hover:bg-slate-600 border-l border-slate-600"><Plus className="w-3 h-3"/></button>
                    </div>
                </div>

                {/* Basement/Terrace */}
                <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-900/50 p-2 rounded border border-slate-700/50 hover:bg-slate-800 transition-colors">
                        <input 
                            type="checkbox" 
                            checked={inputs.hasBasement}
                            onChange={(e) => handleChange('hasBasement', e.target.checked)}
                            className="w-3 h-3 rounded text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-xs text-slate-300 flex-1">Tầng Hầm</span>
                        {inputs.hasBasement && (
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={inputs.basementPercent}
                                    onChange={(e) => handleChange('basementPercent', parseFloat(e.target.value))}
                                    className="w-12 bg-slate-800 border border-slate-600 rounded py-0.5 px-1 text-[10px] text-center text-white"
                                />
                                <span className="text-xs text-slate-500 ml-1">%</span>
                            </div>
                        )}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-900/50 p-2 rounded border border-slate-700/50 hover:bg-slate-800 transition-colors">
                        <input 
                            type="checkbox" 
                            checked={inputs.hasTerrace}
                            onChange={(e) => handleChange('hasTerrace', e.target.checked)}
                            className="w-3 h-3 rounded text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-xs text-slate-300 flex-1">Sân Thượng</span>
                        {inputs.hasTerrace && (
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={inputs.terracePercent}
                                    onChange={(e) => handleChange('terracePercent', parseFloat(e.target.value))}
                                    className="w-12 bg-slate-800 border border-slate-600 rounded py-0.5 px-1 text-[10px] text-center text-white"
                                />
                                <span className="text-xs text-slate-500 ml-1">%</span>
                            </div>
                        )}
                    </label>
                </div>
             </div>
        )}

        {/* SECTION 3: EXTENDED SCOPE */}
        {activeSection === 'scope' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* 3 HANDOVER MODES SELECTION */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-amber-500 uppercase flex items-center gap-2">
                        <Briefcase className="w-3 h-3" /> Phạm vi bàn giao (Nội thất)
                    </h3>
                    <div className="space-y-3">
                        {HANDOVER_OPTIONS.map((mode) => (
                            <div 
                                key={mode.id}
                                onClick={() => handleChange('handoverMode', mode.id)}
                                className={`relative p-3 rounded-lg border cursor-pointer transition-all ${
                                    inputs.handoverMode === mode.id 
                                    ? 'bg-blue-600/10 border-blue-500 shadow-lg' 
                                    : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-sm font-bold ${inputs.handoverMode === mode.id ? 'text-blue-300' : 'text-slate-200'}`}>
                                        {mode.name}
                                    </span>
                                    {inputs.handoverMode === mode.id && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                                </div>
                                <p className="text-[11px] text-slate-400 italic mb-2">{mode.description}</p>
                                
                                {/* Mini features list */}
                                {inputs.handoverMode === mode.id && (
                                    <div className="mt-2 space-y-1 bg-slate-800/50 p-2 rounded text-[10px]">
                                        <div className="text-emerald-400 font-semibold mb-1">Bao gồm:</div>
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                            {mode.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-1 text-slate-300">
                                                    <Check className="w-2.5 h-2.5 text-emerald-500" /> {f}
                                                </div>
                                            ))}
                                        </div>
                                        {mode.excludes.length > 0 && (
                                            <>
                                                <div className="text-rose-400 font-semibold mt-2 mb-1">Không bao gồm:</div>
                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                                    {mode.excludes.map((f, i) => (
                                                        <div key={i} className="flex items-center gap-1 text-slate-400">
                                                            <X className="w-2.5 h-2.5 text-rose-500" /> {f}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 space-y-3">
                    <h3 className="text-xs font-bold text-amber-500 uppercase flex items-center gap-2">
                        <Shovel className="w-3 h-3" /> Chuẩn bị mặt bằng
                    </h3>
                    <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={inputs.hasDemolition}
                                onChange={(e) => handleChange('hasDemolition', e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-800 border-slate-600"
                            />
                            <span className="text-xs text-slate-300 flex-1">Phá dỡ công trình cũ</span>
                        </label>
                        {inputs.hasDemolition && (
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 ml-5">Diện tích sàn cũ:</span>
                                <input 
                                    type="number" 
                                    value={inputs.demolitionArea}
                                    onChange={(e) => handleChange('demolitionArea', parseFloat(e.target.value))}
                                    className="w-16 bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-xs text-center"
                                />
                                <span className="text-[10px] text-slate-500">m2</span>
                            </div>
                        )}
                        
                        <label className="flex items-center gap-2 cursor-pointer pt-2">
                            <input 
                                type="checkbox" 
                                checked={inputs.hasPileDriving}
                                onChange={(e) => handleChange('hasPileDriving', e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-800 border-slate-600"
                            />
                            <span className="text-xs text-slate-300 flex-1">Ép cọc bê tông (250x250)</span>
                        </label>
                        {inputs.hasPileDriving && (
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 ml-5">Sâu dự kiến:</span>
                                <input 
                                    type="number" 
                                    value={inputs.pileDepth}
                                    onChange={(e) => handleChange('pileDepth', parseFloat(e.target.value))}
                                    className="w-16 bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-xs text-center"
                                />
                                <span className="text-[10px] text-slate-500">m</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 space-y-3">
                    <h3 className="text-xs font-bold text-blue-400 uppercase flex items-center gap-2">
                        <Paintbrush className="w-3 h-3" /> Ngoại thất & Mặt tiền
                    </h3>
                    <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                        <div>
                            <label className="text-[10px] text-slate-500 mb-1 block">Phong cách Mặt tiền</label>
                            <select 
                                value={inputs.facadeType}
                                onChange={(e) => handleChange('facadeType', e.target.value as FacadeType)}
                                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                            >
                                {Object.values(FacadeType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={inputs.includeGateFence} onChange={(e) => handleChange('includeGateFence', e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-600" />
                            <span className="text-xs text-slate-300">Cổng & Tường rào</span>
                        </label>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 space-y-3">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-2">
                        <Zap className="w-3 h-3" /> MEP & Tiện ích
                    </h3>
                    <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={inputs.hasAcPiping} onChange={(e) => handleChange('hasAcPiping', e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-600" />
                            <span className="text-xs text-slate-300">Ống đồng máy lạnh âm tường</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={inputs.hasSolarWater} onChange={(e) => handleChange('hasSolarWater', e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-600" />
                            <span className="text-xs text-slate-300">Nước nóng NLMT + Ống nhiệt</span>
                        </label>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 space-y-3">
                    <h3 className="text-xs font-bold text-purple-400 uppercase flex items-center gap-2">
                        <FileCheck className="w-3 h-3" /> Pháp lý
                    </h3>
                    <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={inputs.includeDesign} onChange={(e) => handleChange('includeDesign', e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-600" />
                            <span className="text-xs text-slate-300">Thiết kế hồ sơ thi công</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={inputs.includePermits} onChange={(e) => handleChange('includePermits', e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-600" />
                            <span className="text-xs text-slate-300">Xin phép XD + Hoàn công</span>
                        </label>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* Package Selection */}
      <div className="mt-auto pt-4 p-5 bg-slate-800 border-t border-slate-700 z-10">
        <div className="flex justify-between items-end mb-3">
             <label className="text-sm font-semibold text-white">Gói Thầu</label>
             <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Đơn giá áp dụng</span>
                <span className="text-base font-bold text-blue-400">{finalPrice.toLocaleString('vi-VN')}</span>
             </div>
        </div>
        <div className="space-y-2">
            {PACKAGE_OPTIONS.map((pkg) => (
                <button
                    key={pkg.id}
                    onClick={() => handleChange('packageType', pkg.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                        inputs.packageType === pkg.id 
                        ? 'bg-blue-600/20 border-blue-500 shadow-md' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                    }`}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${inputs.packageType === pkg.id ? 'text-blue-100' : 'text-slate-300'}`}>{pkg.name}</span>
                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                             inputs.packageType === pkg.id ? 'border-blue-400' : 'border-slate-500'
                        }`}>
                            {inputs.packageType === pkg.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </div>
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{pkg.description}</div>
                </button>
            ))}
            
            {renderPriceExplanation()}
        </div>
      </div>
    </div>
  );
};