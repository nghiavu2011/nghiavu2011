import React, { useState, useMemo } from 'react';
import { ConstructionForm } from './components/ConstructionForm';
import { CostEstimate } from './components/CostEstimate';
import { AIAdvisor } from './components/AIAdvisor';
import { PricingModal } from './components/PricingModal';
import { MaterialBreakdown } from './components/MaterialBreakdown';
import Footer from './components/Footer';
import DonationModal from './components/DonationModal';
import { TechnicalSpecsModal } from './components/TechnicalSpecsModal';
import { 
  ConstructionInput, 
  Location, 
  PackageType, 
  CalculationResult, 
  WallType,
  StairType,
  ElevatorType,
  ProjectType,
  FacadeType,
  HandoverMode
} from './types';
import { calculateConstruction } from './utils/constructionMath';
import { Home, FileText, Menu, HardHat } from 'lucide-react';

const defaultInputs: ConstructionInput = {
  width: 5,
  length: 15,
  floors: 2,
  location: Location.HoChiMinh,
  projectType: ProjectType.Townhouse,
  foundationType: 'Móng đơn',
  foundationPercent: 30,
  roofType: 'Mái BTCT',
  roofPercent: 50,
  hasBasement: false,
  basementPercent: 150,
  hasTerrace: false,
  terracePercent: 50,
  packageType: PackageType.Rough,
  // Advanced Defaults
  wallType: WallType.Wall10,
  numBathrooms: 2,
  stairType: StairType.Ziczac,
  elevatorType: ElevatorType.None,
  // Conditions
  isSmallAlley: false,
  isTruckBan: false,
  isRestrictedHours: false,
  hasMaterialElevator: true,
  // Extended Scope Defaults
  hasDemolition: false,
  demolitionArea: 0,
  hasPileDriving: false,
  pileDepth: 15,
  // New Mode Default
  handoverMode: HandoverMode.ModeA,
  facadeType: FacadeType.Simple,
  includeGateFence: false,
  includeLandscaping: false,
  hasAcPiping: false,
  hasSolarWater: false,
  includePermits: false,
  includeDesign: false
};

function App() {
  const [inputs, setInputs] = useState<ConstructionInput>(defaultInputs);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isTechSpecsOpen, setIsTechSpecsOpen] = useState(false);

  // Moved calculation logic to utils/constructionMath.ts for separation of concerns
  const result: CalculationResult = useMemo(() => {
    return calculateConstruction(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200 flex flex-col">
      
      {/* Header - Rebranded */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-900/20">
                    <HardHat className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">
                        NGHĨA <span className="text-amber-500">CONSTRUCTION</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                        Kiến tạo không gian - Vững vàng ngân sách
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPricingModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs md:text-sm transition-all border border-slate-700 hover:border-slate-600 group"
                >
                  <FileText className="w-4 h-4 text-amber-500 group-hover:text-amber-400" />
                  <span className="hidden md:inline font-medium">Đơn giá 2025</span>
                </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
        {/* Decorative background elements */}
        <div className="fixed top-20 left-10 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            
            {/* Left Column: Input Form */}
            <div className="lg:col-span-4 h-fit lg:sticky lg:top-24 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
                    <ConstructionForm inputs={inputs} onChange={setInputs} />
                </div>
            </div>

            {/* Right Column: Results & AI */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <CostEstimate result={result} packageType={inputs.packageType} />
                <MaterialBreakdown result={result} onOpenTechSpecs={() => setIsTechSpecsOpen(true)} />
                <AIAdvisor inputs={inputs} result={result} />
            </div>
        </div>
      </main>

      <Footer onOpenDonationModal={() => setIsDonationModalOpen(true)} />

      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
      <TechnicalSpecsModal isOpen={isTechSpecsOpen} onClose={() => setIsTechSpecsOpen(false)} />

    </div>
  );
}

export default App;