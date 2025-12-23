import React from 'react';
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    FacebookIcon,
    InstagramIcon,
    TikTokIcon,
    HeartIcon,
} from './common/Icons';

interface FooterProps {
    onOpenDonationModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenDonationModal }) => {
    return (
        <footer className="bg-slate-900 text-slate-200 pt-12 pb-6 px-4 border-t border-slate-800">
            <div className="container mx-auto">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Disclaimer Section */}
                    <div className="mb-10 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-sm text-slate-400 text-center md:text-left backdrop-blur-sm">
                        <strong className="text-amber-500 block mb-1 uppercase text-xs tracking-wider">Miễn trừ trách nhiệm</strong>
                        <p>
                            Công cụ này sử dụng các hệ số và định mức trung bình của ngành xây dựng Việt Nam (Định mức 1776, Đơn giá địa phương). 
                            Kết quả chỉ mang tính chất tham khảo để lập kế hoạch ngân sách. 
                            Vui lòng tham vấn kỹ sư hoặc nhà thầu thực tế để có báo giá chính xác.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 text-sm">
                        {/* Column 1: Connect */}
                        <div>
                            <h4 className="font-bold text-base mb-4 text-amber-500 uppercase tracking-wide">Kết Nối Với Chúng Tôi</h4>
                            <div className="flex items-center flex-wrap gap-5">
                                <a href="https://zalo.me/0985578385" target="_blank" rel="noopener noreferrer" aria-label="Zalo" className="text-slate-400 hover:text-white hover:bg-blue-600/20 p-2 rounded-full transition-all">
                                    <PhoneIcon className="w-6 h-6" />
                                </a>
                                <a href="mailto:nmaiart2011@gmail.com" aria-label="Email" className="text-slate-400 hover:text-white hover:bg-red-500/20 p-2 rounded-full transition-all">
                                    <EnvelopeIcon className="w-6 h-6" />
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=100093268771639" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate-400 hover:text-white hover:bg-blue-700/20 p-2 rounded-full transition-all">
                                    <FacebookIcon className="w-6 h-6" />
                                </a>
                                <a href="https://www.instagram.com/nmai_art/?igsh=d3BidzgzNXYwazg4&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-400 hover:text-white hover:bg-pink-600/20 p-2 rounded-full transition-all">
                                    <InstagramIcon className="w-6 h-6" />
                                </a>
                                <a href="https://www.tiktok.com/@nghiavt2011" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-slate-400 hover:text-white hover:bg-black/50 p-2 rounded-full transition-all">
                                    <TikTokIcon className="w-6 h-6" />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Info & Support */}
                        <div>
                            <h4 className="font-bold text-base mb-4 text-amber-500 uppercase tracking-wide">Thông Tin & Hỗ Trợ</h4>
                             <div className="space-y-4">
                                <div className="flex items-center gap-3 group">
                                    <MapPinIcon className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                    <a href="https://maps.app.goo.gl/eSTFSqLGfVKPppJL6" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                        Xem địa chỉ trên bản đồ
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 group">
                                    <HeartIcon className="w-5 h-5 text-slate-500 group-hover:text-pink-500 transition-colors flex-shrink-0" />
                                    <button
                                        onClick={onOpenDonationModal}
                                        className="text-left text-slate-400 hover:text-white transition-colors"
                                        aria-label="Ủng hộ tác giả"
                                    >
                                        Ủng hộ để phát triển dự án
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
                    <p>
                        © 2025 Nghĩa Construction by{' '}
                        <a
                            href="https://www.facebook.com/nghiainterior"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-amber-500 hover:text-amber-400 transition-colors"
                        >
                            NM_AI_ART
                        </a>
                    </p>
                    <p className="mt-1 opacity-50">Designed for Vietnam Construction Standards</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;