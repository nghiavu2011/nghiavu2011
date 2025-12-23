export enum Location {
  Hanoi = 'Hà Nội',
  DaNang = 'Đà Nẵng',
  HoChiMinh = 'TP. Hồ Chí Minh',
  Other = 'Tỉnh thành khác'
}

export enum PackageType {
  Rough = 'G0 - Xây thô + Hoàn thiện cơ bản',
  FullMedium = 'G1 - Trọn gói Trung bình',
  FullGood = 'G2 - Trọn gói Khá',
  FullPremium = 'G3 - Trọn gói Cao cấp'
}

export enum ProjectType {
  Townhouse = 'Nhà phố / Nhà ống',
  Villa = 'Biệt thự (Villa)',
  Shophouse = 'Shophouse / Nhà thương mại',
  Office = 'Tòa nhà văn phòng'
}

export enum WallType {
  Wall10 = 'Tường 10 (110mm)',
  Wall20 = 'Tường 20 (220mm)'
}

export enum StairType {
  Ziczac = 'Ziczac (Xương cá)',
  Straight = 'Chạy thẳng',
  LShape = 'Chữ L (Đổi chiều 90°)',
  UShape = 'Chữ U (Đổi chiều 180°)'
}

export enum ElevatorType {
  None = 'Không lắp đặt',
  E350 = '350kg (Gia đình)',
  E450 = '450kg (Tiêu chuẩn)',
  E630 = '630kg (Lớn)'
}

export enum FacadeType {
  Simple = 'Sơn nước đơn giản',
  Modern = 'Hiện đại (Ốp gạch/Lam trang trí)',
  Neoclassic = 'Tân cổ điển (Phào chỉ/Phù điêu)'
}

// NEW: Handover Modes
export enum HandoverMode {
  ModeA = 'MODE A - Hoàn thiện cơ bản (Basic)',
  ModeB = 'MODE B - Nội thất liền tường (Built-in)',
  ModeC = 'MODE C - Full nội thất (Turnkey)'
}

export interface ConstructionInput {
  width: number;
  length: number;
  floors: number;
  location: Location;
  projectType: ProjectType;
  
  foundationType: string;
  foundationPercent: number;
  roofType: string;
  roofPercent: number;
  
  hasBasement: boolean;
  basementPercent: number;
  hasTerrace: boolean;
  terracePercent: number;
  
  packageType: PackageType;
  
  // Advanced Inputs
  wallType: WallType;
  numBathrooms: number;
  stairType: StairType;
  elevatorType: ElevatorType;
  
  // Detailed Construction Conditions
  isSmallAlley: boolean;     
  isTruckBan: boolean;       
  isRestrictedHours: boolean;
  hasMaterialElevator: boolean; 

  // --- EXTENDED SCOPE ---
  // 1. Site Prep & Foundation Extras
  hasDemolition: boolean; // Phá dỡ nhà cũ
  demolitionArea: number; // Diện tích phá dỡ (m2 sàn)
  hasPileDriving: boolean; // Ép cọc
  pileDepth: number; // Chiều sâu dự kiến (m)

  // 2. Handover Mode (Replaces individual furniture toggles)
  handoverMode: HandoverMode;

  // 3. Facade & Landscape
  facadeType: FacadeType;
  includeGateFence: boolean; // Cổng & Tường rào
  includeLandscaping: boolean; // Sân vườn
  
  // 4. MEP Extras
  hasAcPiping: boolean; // Ống đồng máy lạnh âm tường
  hasSolarWater: boolean; // Nước nóng năng lượng mặt trời + Đường ống PPR nóng

  // 5. Soft Costs
  includePermits: boolean; // Xin phép xây dựng + Hoàn công
  includeDesign: boolean; // Thiết kế kiến trúc/Nội thất
}

export interface CalculationItem {
  name: string;
  description: string;
  originalArea: number;
  coefficient: number;
  convertedArea: number;
  color: string;
  isExtra?: boolean; 
  cost?: number; 
}

export interface MaterialQuantities {
  bricks: number; 
  sand: number; 
  stone: number; 
  cement: number; 
  steel: number; 
  paint: number; 
}

export interface CostBreakdown {
  laborCost: number;
  roughMaterialCost: number;
  finishingCost: number;
  equipmentCost: number; 
  furnitureCost: number; 
  softCost: number; 
  contingency: number; 
}

export interface CalculationResult {
  totalConvertedArea: number;
  unitPrice: number;
  totalCost: number; 
  totalInvestment: number; 
  breakdown: CalculationItem[];
  materials: MaterialQuantities;
  costStructure: CostBreakdown;
  constructionTimeWeeks: number;
}

export interface PackagePrice {
  id: PackageType;
  name: string;
  price: number;
  description: string;
}

export interface FoundationOption {
  id: string;
  name: string;
  defaultPercent: number;
}

export interface RoofOption {
  id: string;
  name: string;
  defaultPercent: number;
}

export interface SpecDetail {
  title: string;
  items: Record<PackageType, string>;
}

export interface PackageSpecCategory {
  id: string;
  name: string;
  specs: SpecDetail[];
}

export interface HandoverOption {
  id: HandoverMode;
  name: string;
  description: string;
  features: string[];
  excludes: string[];
}