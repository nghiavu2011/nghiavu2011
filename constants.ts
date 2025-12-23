import { Location, PackageType, PackagePrice, FoundationOption, RoofOption, WallType, ElevatorType, StairType, ProjectType, PackageSpecCategory, FacadeType, HandoverMode, HandoverOption } from './types';

// Pricing baselines (2024/2025 Vietnam market) - CONSTRUCTION ONLY
export const BASE_PRICES: Record<PackageType, number> = {
  [PackageType.Rough]: 3600000,
  [PackageType.FullMedium]: 5100000,
  [PackageType.FullGood]: 6200000,
  [PackageType.FullPremium]: 7800000,
};

// Furniture/Interior Prices per m2 of FLOOR AREA (Additive Surcharge)
// Updated logic to match Total Investment Targets:
// G1 (Total ~7.2M Built-in): Base 5.1 + Add 2.1
// G2 (Total ~9.5M Built-in): Base 6.2 + Add 3.3
// G3 (Total ~13.8M Built-in): Base 7.8 + Add 6.0
export const FURNITURE_PRICES: Record<PackageType, Record<HandoverMode, number>> = {
    [PackageType.Rough]: {
        [HandoverMode.ModeA]: 0,
        [HandoverMode.ModeB]: 0,
        [HandoverMode.ModeC]: 0,
    },
    [PackageType.FullMedium]: {
        [HandoverMode.ModeA]: 0, 
        [HandoverMode.ModeB]: 2100000, // Total ~7.2M/m2
        [HandoverMode.ModeC]: 3800000, // Total ~8.9M/m2
    },
    [PackageType.FullGood]: {
        [HandoverMode.ModeA]: 0,
        [HandoverMode.ModeB]: 3300000, // Total ~9.5M/m2 (Market range 8.5-10.5)
        [HandoverMode.ModeC]: 6300000, // Total ~12.5M/m2 (Market range 11-13.5)
    },
    [PackageType.FullPremium]: {
        [HandoverMode.ModeA]: 0,
        [HandoverMode.ModeB]: 6000000, // Total ~13.8M/m2 (Market range 12-15)
        [HandoverMode.ModeC]: 10200000, // Total ~18.0M/m2 (Market range 16-20)
    }
};

export const HANDOVER_OPTIONS: HandoverOption[] = [
    {
        id: HandoverMode.ModeA,
        name: 'MODE A - Cơ bản (Basic)',
        description: 'Phù hợp khách mua nhà tự sắm nội thất sau.',
        features: ['Kết cấu & Xây tô', 'Sơn nước, Thạch cao', 'Sàn gạch/Gỗ, Cửa', 'Thiết bị vệ sinh', 'Điện nước âm tường'],
        excludes: ['Tủ bếp, Tủ áo', 'Nội thất rời', 'Thiết bị điện tử']
    },
    {
        id: HandoverMode.ModeB,
        name: 'MODE B - Liền tường (Built-in)',
        description: 'Dọn vào ở ngay - Chỉ cần mua thêm đồ rời.',
        features: ['Gồm tất cả Mode A', 'Tủ bếp (Trên/Dưới) + Bếp/Hút mùi', 'Tủ quần áo âm tường', 'Tủ TV, Bàn học/làm việc'],
        excludes: ['Sofa, Bàn ăn', 'Giường, Nệm', 'TV, Tủ lạnh, Máy giặt']
    },
    {
        id: HandoverMode.ModeC,
        name: 'MODE C - Trọn gói (Full)',
        description: 'Chìa khóa trao tay - Chỉ xách vali vào ở.',
        features: ['Gồm tất cả Mode B', 'Sofa, Bàn trà, Rèm', 'Bàn ăn, Ghế ăn', 'Giường ngủ, Nệm'],
        excludes: ['TV, Tủ lạnh', 'Máy giặt, Máy rửa chén', 'Đồ Decor cá nhân']
    }
];

// Labor cost ratio estimation
export const LABOR_RATIO = 0.25; 
export const ROUGH_MATERIAL_RATIO = 0.45;

export const LOCATION_MODIFIERS: Record<Location, number> = {
  [Location.Hanoi]: 1.05,
  [Location.HoChiMinh]: 1.05,
  [Location.DaNang]: 0.98,
  [Location.Other]: 0.95
};

// Project Type Modifiers (Complexity factor)
export const PROJECT_TYPE_MODIFIERS: Record<ProjectType, number> = {
  [ProjectType.Townhouse]: 1.0,   // Standard
  [ProjectType.Villa]: 1.25,      // Higher detail, complex structure
  [ProjectType.Shophouse]: 1.15,  // Higher ceilings, commercial standards
  [ProjectType.Office]: 1.1       // Heavy load structure, fire safety reqs
};

// Granular Condition Modifiers (Additive percentages)
export const CONDITION_COSTS = {
  SMALL_ALLEY: 0.05,       // +5% for manual transport / small trucks
  TRUCK_BAN: 0.03,         // +3% for night delivery / transfer fees
  RESTRICTED_HOURS: 0.05,  // +5% labor inefficiency (night work/short shifts)
  NO_ELEVATOR_HIGH_RISE: 0.03 // +3% labor for manual carry if > 3 floors & no hoist
};

// --- NEW: EXTRA COSTS & NORMS ---
export const EXTRA_COSTS = {
  DEMOLITION_PER_M2: 250000, // Phá dỡ + Vận chuyển xà bần
  PILE_DRIVING_PER_M: 280000, // Ép cọc (Vật tư + Nhân công) - Cọc 250x250
  PILE_PER_COLUMN: 4, // Estimate avg piles per column/footing
  
  FACADE_MODERN_SURCHARGE: 500000, // Per m2 of Facade Area
  FACADE_NEOCLASSIC_SURCHARGE: 1500000, // Per m2 of Facade Area

  AC_PIPING_PER_ROOM: 3000000, // Ống đồng Thái + Dây + Gen (tb 15m/phòng)
  SOLAR_WATER_SYSTEM: 15000000, // Máy NLMT + Ống PPR nóng

  GATE_FENCE_LUMPSUM: 25000000, // Cổng sắt + Rào cơ bản (Nhà phố 5m)
  
  PERMIT_SERVICE: 15000000, // Xin phép + Hoàn công (Tham khảo)
  DESIGN_FEE_PER_M2: 180000, // Thiết kế kiến trúc + kết cấu + điện nước
};

export const PACKAGE_OPTIONS: PackagePrice[] = [
  { 
    id: PackageType.Rough, 
    name: 'G0 - Xây thô (Basic)', 
    price: BASE_PRICES[PackageType.Rough],
    description: 'Khung xương vững chắc. Gia chủ tự lo hoàn thiện. Phù hợp người rành vật liệu.'
  },
  { 
    id: PackageType.FullMedium, 
    name: 'G1 - Trọn gói Trung bình', 
    price: BASE_PRICES[PackageType.FullMedium],
    description: 'Tiết kiệm, đạt chuẩn cơ bản. Phù hợp nhà cho thuê, kinh doanh, ngân sách hẹp.'
  },
  { 
    id: PackageType.FullGood, 
    name: 'G2 - Trọn gói Khá', 
    price: BASE_PRICES[PackageType.FullGood],
    description: 'Cân bằng giá & chất lượng. Vật tư thương hiệu tốt. Gói phổ biến nhất.'
  },
  { 
    id: PackageType.FullPremium, 
    name: 'G3 - Trọn gói Cao cấp', 
    price: BASE_PRICES[PackageType.FullPremium],
    description: 'Chuẩn biệt thự/khách sạn. Vật tư nhập khẩu/Top-tier. Kỹ thuật thi công tỉ mỉ.'
  },
];

export const FOUNDATION_OPTIONS: FoundationOption[] = [
  { id: 'don', name: 'Móng đơn (Đất tốt)', defaultPercent: 30 },
  { id: 'bang', name: 'Móng băng (Đất thường)', defaultPercent: 50 },
  { id: 'coc', name: 'Móng cọc (Đất yếu)', defaultPercent: 40 }, // Chưa gồm ép cọc
  { id: 'be', name: 'Móng bè (Hầm)', defaultPercent: 80 },
];

export const ROOF_OPTIONS: RoofOption[] = [
  { id: 'tole', name: 'Mái Tôn (Kèo sắt)', defaultPercent: 30 },
  { id: 'btct', name: 'Mái BTCT (Sân thượng)', defaultPercent: 50 },
  { id: 'ngoi_keo', name: 'Mái Ngói (Kèo thép nhẹ)', defaultPercent: 70 },
  { id: 'ngoi_btct', name: 'Mái Ngói (Đổ BTCT dán)', defaultPercent: 100 },
];

export const CHART_COLORS = {
  foundation: '#3b82f6', // blue-500
  floors: '#10b981',     // emerald-500
  roof: '#f59e0b',       // amber-500
  basement: '#8b5cf6',   // violet-500
  terrace: '#ec4899',    // pink-500
  extra: '#f43f5e',      // rose-500
};

// --- SURCHARGE CONSTANTS ---
export const STAIR_ZICZAC_SURCHARGE_PER_FLOOR = 15000000; 
export const ELEVATOR_SHAFT_CONSTRUCTION_COST = 40000000; 

export const ELEVATOR_EQUIPMENT_PRICES: Record<ElevatorType, number> = {
    [ElevatorType.None]: 0,
    [ElevatorType.E350]: 350000000, 
    [ElevatorType.E450]: 420000000, 
    [ElevatorType.E630]: 550000000, 
};

// --- MATERIAL ESTIMATION NORMS ---
export const MATERIAL_NORMS = {
  steel: 35, // kg/m2 (Increased for safety margin)
  cement: 380, // kg/m2
  sand: 1.0, // m3/m2
  stone: 0.9, // m3/m2
  bricks_wall10: 70, 
  bricks_wall20: 130, 
  paint: 7.0, 
};

export const WALL_DENSITY_COEFFICIENT = 2.5;

// --- DETAILED PACKAGE SPECS (REAL-WORLD DATA INJECTION) ---
export const PACKAGE_SPECS: PackageSpecCategory[] = [
    {
        id: 'structure',
        name: 'PHẦN THÔ (KẾT CẤU)',
        specs: [
            {
                title: 'Bê tông (Móng/Dầm/Sàn)',
                items: {
                    [PackageType.Rough]: 'PCB30/40. Trộn thủ công 1:2:3. Cát vàng thường, đá 1x2 thường. Không phụ gia.',
                    [PackageType.FullMedium]: 'PCB40 (Hà Tiên/Nghi Sơn). Cát vàng rửa. Đá 1x2 loại 1. Phụ gia dẻo R7/Plastiment.',
                    [PackageType.FullGood]: 'PCB40 ổn định. Kiểm soát độ sụt. Ưu tiên Bê tông tươi nếu hẻm cho phép. Mác 250.',
                    [PackageType.FullPremium]: 'Bê tông thương phẩm Mác 300+. Phụ gia siêu dẻo ViscoCrete. Bảo dưỡng ẩm 14 ngày.',
                }
            },
            {
                title: 'Thép xây dựng',
                items: {
                    [PackageType.Rough]: 'CB300 (Việt Nhật/Pomina). Buộc tay.',
                    [PackageType.FullMedium]: 'CB400 (Hòa Phát/Việt Nhật). Kê thép/cover chuẩn.',
                    [PackageType.FullGood]: 'CB400-CB500. Quản lý nối thép đúng tiêu chuẩn (30D-40D). Con kê bê tông đúc sẵn.',
                    [PackageType.FullPremium]: 'CB500. Nghiệm thu checklist (lớp bảo vệ, thép chờ MEP) trước khi đổ.',
                }
            },
            {
                title: 'Xây tường & Tô trát',
                items: {
                    [PackageType.Rough]: 'Gạch Tuynel. Vữa 1:5. Cát thường.',
                    [PackageType.FullMedium]: 'Gạch Tuynel tốt. Vữa 1:4.5. Cát sàng kỹ.',
                    [PackageType.FullGood]: 'Kiểm soát thẳng đứng (Lazer). Tô bù tường lồi lõm. Vữa 1:4.',
                    [PackageType.FullPremium]: 'Đóng lưới chống nứt toàn bộ tiếp giáp Cột-Tường. Xử lý mạch ngừng kỹ.',
                }
            }
        ]
    },
    {
        id: 'waterproofing',
        name: 'CHỐNG THẤM (BẢO HÀNH)',
        specs: [
            {
                title: 'Vật liệu & Quy trình',
                items: {
                    [PackageType.Rough]: 'Xi măng tinh + Nước (Hồ dầu). Quét 2 lớp.',
                    [PackageType.FullMedium]: 'Xi măng Polymer (Sika TopSeal/Kova). 2-3 lớp. Lưới góc chân tường.',
                    [PackageType.FullGood]: 'Hệ Polymer cao cấp. Test ngâm nước 24-48h trước khi lát sàn.',
                    [PackageType.FullPremium]: 'Hệ PU/Màng chuyên dụng cho mái. Xử lý chi tiết cổ ống, khe co giãn chuẩn.',
                }
            }
        ]
    },
    {
        id: 'finishing',
        name: 'HOÀN THIỆN (THẨM MỸ)',
        specs: [
            {
                title: 'Gạch ốp lát',
                items: {
                    [PackageType.Rough]: 'Nhân công lát (Vật tư Chủ nhà lo).',
                    [PackageType.FullMedium]: 'Gạch 600x600 (Granite phổ thông). Keo dán gạch tiêu chuẩn.',
                    [PackageType.FullGood]: 'Gạch 800x800. Ron chống nấm mốc. Xử lý chống thấm sàn trước lát kỹ.',
                    [PackageType.FullPremium]: 'Đá/Gạch Premium (Eurotile/Nhập). Keo dán + Ron cao cấp. Nghiệm thu độ phẳng/rỗng.',
                }
            },
            {
                title: 'Sơn nước',
                items: {
                    [PackageType.Rough]: 'Nhân công sơn (Vật tư Chủ nhà lo).',
                    [PackageType.FullMedium]: 'Bả 1-2 lớp. Sơn trung cấp (Maxilite/Jotun Jotaplast).',
                    [PackageType.FullGood]: 'Bả phẳng tốt. Sơn lau chùi hiệu quả (Dulux EasyClean/Jotun Essence).',
                    [PackageType.FullPremium]: 'Hệ sơn cao cấp (Dulux 5in1/Majestic). Quy trình xả nhám - soi đèn kiểm lỗi.',
                }
            },
            {
                title: 'Cửa & Nhôm kính',
                items: {
                    [PackageType.Rough]: 'Nhân công lắp (Vật tư Chủ nhà lo).',
                    [PackageType.FullMedium]: 'Nhôm hệ 700/1000 hoặc Xingfa VN. Kính cường lực 8mm.',
                    [PackageType.FullGood]: 'Nhôm Xingfa Quảng Đông (Tem đỏ). Phụ kiện Kinlong. Gioăng kép EPDM.',
                    [PackageType.FullPremium]: 'Nhôm cầu cách nhiệt / Gỗ tự nhiên. Kính hộp / Low-E. Phụ kiện Cmech/Roto.',
                }
            }
        ]
    },
    {
        id: 'mep',
        name: 'HỆ THỐNG M.E.P (ĐIỆN NƯỚC)',
        specs: [
            {
                title: 'Điện (Dây & Thiết bị)',
                items: {
                    [PackageType.Rough]: 'Dây Cadivi. Ống ruột gà. Đế âm Sino.',
                    [PackageType.FullMedium]: 'Dây Cadivi. Ống cứng PVC (Sino/Vanlock). Thiết bị Sino/Panasonic Basic.',
                    [PackageType.FullGood]: 'Dây Cadivi/LS. Ống cứng chống cháy. Thiết bị Panasonic Wide/Schneider.',
                    [PackageType.FullPremium]: 'Hệ thống điện thông minh (Option). Thiết bị Legrand/Panasonic cao cấp.',
                }
            },
            {
                title: 'Nước (Cấp & Thoát)',
                items: {
                    [PackageType.Rough]: 'Ống Bình Minh thường.',
                    [PackageType.FullMedium]: 'Ống Bình Minh tiêu chuẩn.',
                    [PackageType.FullGood]: 'Ống Bình Minh/Tiền Phong dày. Phụ kiện chính hãng. Test áp lực kỹ.',
                    [PackageType.FullPremium]: 'Ống PPR chịu nhiệt (Vesbo) hàn nhiệt. Ống thoát giảm âm (nếu cần).',
                }
            }
        ]
    }
];

export const FINISHING_SPECS: Record<PackageType, Record<string, string>> = {
  [PackageType.Rough]: { 
      'Gạch ốp lát': 'Chủ nhà cung cấp', 
      'Sơn nước': 'Chủ nhà cung cấp', 
      'Thiết bị VS': 'Chủ nhà cung cấp',
      'Dây điện': 'Cadivi (Đi sẵn)',
      'Ống nước': 'Bình Minh (Đi sẵn)',
      'Công tắc/Ổ cắm': 'Chủ nhà cung cấp',
      'Đèn chiếu sáng': 'Chủ nhà cung cấp',
      'Bồn nước': 'Chủ nhà cung cấp',
      'Dây mạng/TV': 'Sino (Đi sẵn ống)',
      'Bể phốt': 'Xây gạch thẻ/đúc BTCT'
  },
  [PackageType.FullMedium]: { 
      'Gạch ốp lát': '60x60 (Catalan/Prime)', 
      'Sơn nước': 'Maxilite (Nội thất)', 
      'Thiết bị VS': 'Viglacera/Inax (Basic)',
      'Dây điện': 'Cadivi (Tiêu chuẩn)',
      'Ống nước': 'Bình Minh (PVC)',
      'Công tắc/Ổ cắm': 'Sino Vanlock / Panasonic',
      'Đèn chiếu sáng': 'Rạng Đông / MPE',
      'Bồn nước': 'Inox Tân Á / Đại Thành',
      'Dây mạng/TV': 'Sino / AMP Cat5e',
      'Bể phốt': 'Bể tự hoại đúc sẵn (Nhựa)'
  },
  [PackageType.FullGood]: { 
      'Gạch ốp lát': '80x80 (Đá bóng kính)', 
      'Sơn nước': 'Dulux EasyClean', 
      'Thiết bị VS': 'Toto / Inax (Trung cấp)',
      'Dây điện': 'Cadivi (Loại 1)',
      'Ống nước': 'Bình Minh (Dày) + PPR',
      'Công tắc/Ổ cắm': 'Panasonic Wide',
      'Đèn chiếu sáng': 'Panasonic / Philips',
      'Bồn nước': 'Sơn Hà / Đại Thành (SUS304)',
      'Dây mạng/TV': 'AMP / Commscope Cat6',
      'Bể phốt': 'Bể tự hoại cải tiến (Bastaf)'
  },
  [PackageType.FullPremium]: { 
      'Gạch ốp lát': 'Eurotile / Nhập khẩu', 
      'Sơn nước': 'Dulux 5in1 / Jotun', 
      'Thiết bị VS': 'Toto / Grohe / Kohler',
      'Dây điện': 'Cadivi / LS Vina',
      'Ống nước': 'PPR Vesbo / Tiền Phong (Hàn nhiệt)',
      'Công tắc/Ổ cắm': 'Schneider / Legrand',
      'Đèn chiếu sáng': 'Philips / Đèn Ray nam châm',
      'Bồn nước': 'Sơn Hà (SUS304) + Bơm tăng áp',
      'Dây mạng/TV': 'Commscope Cat6 + WiFi Mesh',
      'Bể phốt': 'Bể tự hoại thông minh'
  }
};