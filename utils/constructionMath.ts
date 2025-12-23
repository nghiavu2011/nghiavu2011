import { 
    ConstructionInput, 
    CalculationResult, 
    CalculationItem, 
    WallType,
    PackageType,
    StairType,
    ElevatorType,
    FacadeType,
    HandoverMode
} from '../types';
import { 
    BASE_PRICES, 
    LOCATION_MODIFIERS, 
    CONDITION_COSTS,
    PROJECT_TYPE_MODIFIERS,
    CHART_COLORS, 
    MATERIAL_NORMS, 
    WALL_DENSITY_COEFFICIENT,
    LABOR_RATIO,
    ROUGH_MATERIAL_RATIO,
    STAIR_ZICZAC_SURCHARGE_PER_FLOOR,
    ELEVATOR_SHAFT_CONSTRUCTION_COST,
    ELEVATOR_EQUIPMENT_PRICES,
    EXTRA_COSTS,
    FURNITURE_PRICES
} from '../constants';

export const calculateConstruction = (inputs: ConstructionInput): CalculationResult => {
    // Avoid floating point weirdness by fixing decimals early or operating on integers where possible
    const floorArea = parseFloat((inputs.width * inputs.length).toFixed(2));
    const items: CalculationItem[] = [];

    // 1. Area Breakdown Calculation
    
    // Foundation
    const foundationArea = parseFloat((floorArea * (inputs.foundationPercent / 100)).toFixed(2));
    items.push({
        name: 'Móng',
        description: `${inputs.foundationType} (${inputs.foundationPercent}%)`,
        originalArea: floorArea,
        coefficient: inputs.foundationPercent,
        convertedArea: foundationArea,
        color: CHART_COLORS.foundation
    });

    // Floors
    const totalFloorAreaRaw = parseFloat((floorArea * inputs.floors).toFixed(2));
    items.push({
        name: `Các tầng (x${inputs.floors})`,
        description: '100% diện tích sàn',
        originalArea: totalFloorAreaRaw,
        coefficient: 100,
        convertedArea: totalFloorAreaRaw,
        color: CHART_COLORS.floors
    });

    // Roof
    const roofAreaConverted = parseFloat((floorArea * (inputs.roofPercent / 100)).toFixed(2));
    items.push({
        name: 'Mái',
        description: `${inputs.roofType} (${inputs.roofPercent}%)`,
        originalArea: floorArea,
        coefficient: inputs.roofPercent,
        convertedArea: roofAreaConverted,
        color: CHART_COLORS.roof
    });

    // Basement
    if (inputs.hasBasement) {
        const basementAreaConverted = parseFloat((floorArea * (inputs.basementPercent / 100)).toFixed(2));
        items.push({
            name: 'Tầng Hầm',
            description: `Hệ số ${inputs.basementPercent}%`,
            originalArea: floorArea,
            coefficient: inputs.basementPercent,
            convertedArea: basementAreaConverted,
            color: CHART_COLORS.basement
        });
    }

    // Terrace
    if (inputs.hasTerrace) {
        const terraceAreaConverted = parseFloat((floorArea * (inputs.terracePercent / 100)).toFixed(2));
        items.push({
            name: 'Sân Thượng',
            description: `Hệ số ${inputs.terracePercent}%`,
            originalArea: floorArea,
            coefficient: inputs.terracePercent,
            convertedArea: terraceAreaConverted,
            color: CHART_COLORS.terrace
        });
    }

    // 2. Cost Calculation
    const basePrice = BASE_PRICES[inputs.packageType];
    const locationMod = LOCATION_MODIFIERS[inputs.location];
    const projectTypeMod = PROJECT_TYPE_MODIFIERS[inputs.projectType];
    
    // Calculate total Condition Modifier (Additive)
    let conditionMod = 1.0;
    if (inputs.isSmallAlley) conditionMod += CONDITION_COSTS.SMALL_ALLEY;
    if (inputs.isTruckBan) conditionMod += CONDITION_COSTS.TRUCK_BAN;
    if (inputs.isRestrictedHours) conditionMod += CONDITION_COSTS.RESTRICTED_HOURS;
    if (!inputs.hasMaterialElevator && inputs.floors > 3) conditionMod += CONDITION_COSTS.NO_ELEVATOR_HIGH_RISE;

    const unitPrice = basePrice * locationMod * projectTypeMod * conditionMod;

    // --- LOGIC: SPECIAL ITEMS & SURCHARGES ---
    let extraEquipmentCost = 0; // Purely equipment/construction surcharges (Lift, Stair)
    let extraFurnitureCost = 0; // Kitchen, Wardrobes, Facade
    let extraSoftCost = 0;      // Permits, Design
    let extraConstructionCost = 0; // Piles, Demolition

    // a. Stair Surcharge
    if (inputs.stairType === StairType.Ziczac) {
        const stairSurcharge = STAIR_ZICZAC_SURCHARGE_PER_FLOOR * Math.max(0, inputs.floors - 1);
        if (stairSurcharge > 0) {
            const equivalentArea = parseFloat((stairSurcharge / unitPrice).toFixed(2));
            items.push({
                name: 'Phát sinh Cầu thang',
                description: 'Cầu thang Ziczac',
                originalArea: 0,
                coefficient: 0,
                convertedArea: equivalentArea,
                color: CHART_COLORS.extra,
                cost: stairSurcharge
            });
        }
    }

    // b. Elevator Surcharge
    if (inputs.elevatorType !== ElevatorType.None) {
        let totalElevatorSurcharge = 0;
        let description = 'Hố thang + Lắp đặt';

        totalElevatorSurcharge += ELEVATOR_SHAFT_CONSTRUCTION_COST;

        if (inputs.packageType !== PackageType.Rough) {
            const equipCost = ELEVATOR_EQUIPMENT_PRICES[inputs.elevatorType];
            totalElevatorSurcharge += equipCost;
            extraEquipmentCost += equipCost;
            description += ' + Thiết bị';
        }

        const equivalentArea = parseFloat((totalElevatorSurcharge / unitPrice).toFixed(2));
        items.push({
            name: 'Hạng mục Thang máy',
            description: description,
            originalArea: 0,
            coefficient: 0,
            convertedArea: equivalentArea,
            color: CHART_COLORS.extra,
            cost: totalElevatorSurcharge
        });
    }

    // --- NEW: DETAILED SCOPE CALCULATIONS ---

    // 1. Demolition
    if (inputs.hasDemolition && inputs.demolitionArea > 0) {
        const demolitionCost = inputs.demolitionArea * inputs.floors * EXTRA_COSTS.DEMOLITION_PER_M2;
        extraConstructionCost += demolitionCost;
        items.push({
            name: 'Phá dỡ & Vận chuyển',
            description: `${inputs.demolitionArea}m2 x ${inputs.floors} tầng`,
            originalArea: 0,
            coefficient: 0,
            convertedArea: 0,
            color: '#ef4444',
            isExtra: true,
            cost: demolitionCost
        });
    }

    // 2. Pile Driving
    if (inputs.hasPileDriving) {
        // Heuristic: Foundation area / 20m2 per column * 4 piles * depth * price
        const estimatedColumns = Math.ceil(floorArea / 20) + 2; 
        const totalPileMeters = estimatedColumns * EXTRA_COSTS.PILE_PER_COLUMN * inputs.pileDepth;
        const pileCost = totalPileMeters * EXTRA_COSTS.PILE_DRIVING_PER_M;
        
        extraConstructionCost += pileCost;
        items.push({
            name: 'Ép cọc bê tông',
            description: `Dự toán: ${totalPileMeters.toLocaleString()} md`,
            originalArea: 0,
            coefficient: 0,
            convertedArea: 0,
            color: '#8b5cf6',
            isExtra: true,
            cost: pileCost
        });
    }

    // 3. Facade Extras
    if (inputs.facadeType !== FacadeType.Simple) {
        // Est facade area: Width * Total Height (Floors * 3.3m)
        const facadeArea = inputs.width * inputs.floors * 3.3;
        const surcharge = inputs.facadeType === FacadeType.Modern 
            ? EXTRA_COSTS.FACADE_MODERN_SURCHARGE 
            : EXTRA_COSTS.FACADE_NEOCLASSIC_SURCHARGE;
        const facadeCost = facadeArea * surcharge;
        
        extraFurnitureCost += facadeCost;
        items.push({
            name: 'Trang trí Mặt tiền',
            description: inputs.facadeType,
            originalArea: 0,
            coefficient: 0,
            convertedArea: 0,
            color: '#f97316',
            isExtra: true,
            cost: facadeCost
        });
    }

    // 4. FURNITURE & INTERIOR (MODES)
    // Mode A = 0 cost (Base).
    // Mode B & C = totalFloorArea * Rate (dependent on package)
    const furnitureRate = FURNITURE_PRICES[inputs.packageType][inputs.handoverMode];
    if (furnitureRate > 0) {
        // Apply furniture rate to USABLE FLOOR AREA (totalFloorAreaRaw), not converted area
        const furnitureTotal = totalFloorAreaRaw * furnitureRate;
        extraFurnitureCost += furnitureTotal;
        items.push({
            name: 'Gói Nội Thất',
            description: inputs.handoverMode === HandoverMode.ModeB ? 'Mode B: Liền tường' : 'Mode C: Full đồ',
            originalArea: totalFloorAreaRaw,
            coefficient: 0,
            convertedArea: 0,
            color: '#10b981',
            isExtra: true,
            cost: furnitureTotal
        });
    }

    // 5. MEP Extras
    if (inputs.hasAcPiping) {
        const rooms = Math.max(2, inputs.floors);
        const acCost = rooms * EXTRA_COSTS.AC_PIPING_PER_ROOM;
        extraEquipmentCost += acCost;
        items.push({
            name: 'Ống đồng máy lạnh',
            description: `${rooms} vị trí chờ`,
            originalArea: 0,
            coefficient: 0,
            convertedArea: 0,
            color: '#06b6d4',
            isExtra: true,
            cost: acCost
        });
    }

    if (inputs.hasSolarWater) {
        extraEquipmentCost += EXTRA_COSTS.SOLAR_WATER_SYSTEM;
        items.push({
            name: 'Máy nước nóng NLMT',
            description: 'Dàn năng lượng + Ống PPR nóng',
            originalArea: 0,
            coefficient: 0,
            convertedArea: 0,
            color: '#06b6d4',
            isExtra: true,
            cost: EXTRA_COSTS.SOLAR_WATER_SYSTEM
        });
    }

    if (inputs.includeGateFence) {
        extraFurnitureCost += EXTRA_COSTS.GATE_FENCE_LUMPSUM;
        items.push({
            name: 'Cổng & Tường rào',
            description: 'Cổng sắt hộp + Rào xây',
            originalArea: 0,
            coefficient: 0,
            convertedArea: 0,
            color: '#64748b',
            isExtra: true,
            cost: EXTRA_COSTS.GATE_FENCE_LUMPSUM
        });
    }

    // 6. Soft Costs
    if (inputs.includeDesign) {
        const totalAreaRaw = totalFloorAreaRaw + foundationArea + roofAreaConverted; // Approximate CFA
        const designCost = totalAreaRaw * EXTRA_COSTS.DESIGN_FEE_PER_M2;
        extraSoftCost += designCost;
        items.push({
            name: 'Thiết kế hồ sơ',
            description: 'Kiến trúc/Kết cấu/MEP',
            originalArea: 0,
            coefficient: 0,
            convertedArea: 0,
            color: '#d946ef',
            isExtra: true,
            cost: designCost
        });
    }

    if (inputs.includePermits) {
        extraSoftCost += EXTRA_COSTS.PERMIT_SERVICE;
        items.push({
            name: 'Pháp lý',
            description: 'Xin phép XD + Hoàn công',
            originalArea: 0,
            coefficient: 0,
            convertedArea: 0,
            color: '#d946ef',
            isExtra: true,
            cost: EXTRA_COSTS.PERMIT_SERVICE
        });
    }

    // --- FINAL SUMMATION ---

    const totalConvertedArea = parseFloat(items.filter(i => !i.isExtra).reduce((sum, item) => sum + item.convertedArea, 0).toFixed(2));
    
    // Core Construction Cost
    const coreItems = items.filter(i => !i.isExtra);
    const coreCost = Math.round(totalConvertedArea * unitPrice);
    
    const totalConstruction = coreCost + extraConstructionCost + extraEquipmentCost;
    const totalInvestment = totalConstruction + extraFurnitureCost + extraSoftCost;
    
    // Calculate Contingency (5% of Total Investment)
    const contingency = Math.round(totalInvestment * 0.05);

    // 3. Cost Structure Breakdown
    let laborCost = 0;
    let roughMaterialCost = 0;
    let finishingCost = 0;
    
    const baseConstructionForBreakdown = coreCost; 

    if (inputs.packageType === PackageType.Rough) {
        laborCost = Math.round(baseConstructionForBreakdown * 0.40); 
        roughMaterialCost = baseConstructionForBreakdown - laborCost;
        finishingCost = 0;
    } else {
        laborCost = Math.round(baseConstructionForBreakdown * LABOR_RATIO);
        roughMaterialCost = Math.round(baseConstructionForBreakdown * ROUGH_MATERIAL_RATIO);
        finishingCost = baseConstructionForBreakdown - laborCost - roughMaterialCost;
    }

    const effectiveWallArea = totalFloorAreaRaw * WALL_DENSITY_COEFFICIENT;
    const brickNorm = inputs.wallType === WallType.Wall20 ? MATERIAL_NORMS.bricks_wall20 : MATERIAL_NORMS.bricks_wall10;

    const materials = {
        bricks: Math.round(effectiveWallArea * brickNorm),
        sand: parseFloat((totalConvertedArea * MATERIAL_NORMS.sand).toFixed(1)),
        stone: parseFloat((totalConvertedArea * MATERIAL_NORMS.stone).toFixed(1)),
        cement: Math.round(totalConvertedArea * MATERIAL_NORMS.cement),
        steel: Math.round(totalConvertedArea * MATERIAL_NORMS.steel),
        paint: Math.round(totalFloorAreaRaw * MATERIAL_NORMS.paint)
    };

    let weeks = 2 + (inputs.floors * 3) + 2; 
    if (inputs.hasBasement) weeks += 4;
    if (inputs.packageType !== PackageType.Rough) weeks += 4;
    if (inputs.elevatorType !== ElevatorType.None) weeks += 2;
    if (inputs.isSmallAlley || inputs.isTruckBan) weeks += 2;
    if (inputs.hasPileDriving) weeks += 1;
    // Extra time for furniture
    if (inputs.handoverMode === HandoverMode.ModeB) weeks += 2;
    if (inputs.handoverMode === HandoverMode.ModeC) weeks += 3;

    return {
        totalConvertedArea,
        unitPrice: Math.round(unitPrice),
        totalCost: totalConstruction, 
        totalInvestment: totalInvestment + contingency,
        breakdown: items,
        materials,
        costStructure: {
            laborCost,
            roughMaterialCost,
            finishingCost,
            equipmentCost: extraEquipmentCost + extraConstructionCost,
            furnitureCost: extraFurnitureCost,
            softCost: extraSoftCost,
            contingency: contingency
        },
        constructionTimeWeeks: weeks
    };
};