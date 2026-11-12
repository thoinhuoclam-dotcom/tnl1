import React from 'react';
import { SIZE_GUIDE_DATA, ShirtSize } from '../types';
import { X, Check, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  selectedSize: ShirtSize;
  onSelectSize: (size: ShirtSize) => void;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  selectedSize,
  onSelectSize,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1D4E4F]/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-[#F0E2E5] text-left animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        role="dialog"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E2E5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFE5EC] text-[#FF758F] flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#1D4E4F]">Bảng Size Áo Chuẩn</h3>
              <p className="text-xs text-[#5D7A7B]">Thông số chi tiết: Ngang áo, Dài áo, Cân nặng và Chiều cao</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F0E2E5] text-[#5D7A7B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bảng Size Chuẩn Được Tái Hiện Theo Đúng Ảnh */}
        <div className="my-4 overflow-x-auto rounded-2xl border border-[#FF758F]/30 shadow-xs">
          <table className="w-full text-center border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF4081] to-[#F50057] text-white font-extrabold">
                <th className="py-3 px-3 border-r border-white/20 text-left font-black text-sm">Size</th>
                {SIZE_GUIDE_DATA.map((col) => (
                  <th key={col.size} className="py-3 px-3 border-r border-white/20 text-base font-black">
                    {col.size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E2E5] text-[#1D4E4F] font-semibold">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 bg-slate-50 font-bold text-left text-slate-700">Ngang áo</td>
                {SIZE_GUIDE_DATA.map((col) => (
                  <td key={col.size} className="py-2.5 px-3">
                    {col.width}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 bg-slate-50 font-bold text-left text-slate-700">Dài áo</td>
                {SIZE_GUIDE_DATA.map((col) => (
                  <td key={col.size} className="py-2.5 px-3">
                    {col.length}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 bg-slate-50 font-bold text-left text-slate-700">Cân nặng</td>
                {SIZE_GUIDE_DATA.map((col) => (
                  <td key={col.size} className="py-2.5 px-3 font-bold text-[#FF4081]">
                    {col.weight}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 bg-slate-50 font-bold text-left text-slate-700">Chiều cao</td>
                {SIZE_GUIDE_DATA.map((col) => (
                  <td key={col.size} className="py-2.5 px-3 font-bold text-[#1D4E4F]">
                    {col.height}
                  </td>
                ))}
              </tr>
              <tr className="bg-[#FFF5F7]">
                <td className="py-2.5 px-3 bg-[#FFE5EC] font-bold text-left text-[#FF4081]">Thao tác</td>
                {SIZE_GUIDE_DATA.map((col) => {
                  const isSelected = selectedSize === col.size;
                  return (
                    <td key={col.size} className="py-2.5 px-3">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSize(col.size);
                          onClose();
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1D4E4F] text-white shadow-xs'
                            : 'bg-white border border-[#FF758F] text-[#FF4081] hover:bg-[#FF4081] hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ Đang chọn' : 'Chọn'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ảnh Bảng Size Gốc */}
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-xs font-bold text-slate-600 mb-2">Ảnh bảng size gốc:</p>
          <img
            src="/assets/aistudio/image_21c11973.png"
            alt="Bảng size chuẩn"
            className="w-full rounded-xl border border-slate-200 shadow-xs"
          />
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#1D4E4F] hover:bg-[#163B3C] text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
};
