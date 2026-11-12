import React from 'react';
import { ShirtOrder } from '../types';
import { CheckCircle2, ArrowLeft, Send, Sparkles } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  order: Partial<ShirtOrder>;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  order,
  isSubmitting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D4E4F]/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#F0E2E5] text-center transform transition-all scale-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Icon & Heading */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#FFE5EC] text-[#FF758F] flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} />
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-[#1D4E4F] tracking-tight mb-1">
          Xác Nhận Đặt Áo
        </h3>
        <p className="text-sm text-[#5D7A7B] mb-5">
          Vui lòng kiểm tra lại thông tin in ấn dưới đây để đảm bảo chính xác nhé!
        </p>

        {/* Tóm tắt 4 mục thông tin */}
        <div className="bg-[#FFF9FA] border border-[#F0E2E5] rounded-2xl p-4 sm:p-5 mb-6 text-left space-y-3">
          {/* Mục 1: Họ tên */}
          <div className="flex items-center justify-between py-1.5 border-b border-dashed border-[#F0E2E5]">
            <span className="text-xs sm:text-sm font-semibold text-[#5D7A7B]">1. Tên thành viên</span>
            <span className="text-sm sm:text-base font-bold text-[#1D4E4F]">{order.fullName || '-'}</span>
          </div>

          {/* Mục 2: Số áo */}
          <div className="flex items-center justify-between py-1.5 border-b border-dashed border-[#F0E2E5]">
            <span className="text-xs sm:text-sm font-semibold text-[#5D7A7B]">2. Số áo</span>
            <span className="font-jersey text-xl font-black text-[#FF758F]">#{order.jerseyNumber || '-'}</span>
          </div>

          {/* Mục 3: Tên in áo */}
          <div className="flex items-center justify-between py-1.5 border-b border-dashed border-[#F0E2E5]">
            <span className="text-xs sm:text-sm font-semibold text-[#5D7A7B]">3. Tên in sau áo</span>
            <span className="text-sm sm:text-base font-extrabold text-[#1D4E4F] tracking-wide uppercase">
              {order.printedName || '-'}
            </span>
          </div>

          {/* Mục 4: Size áo */}
          <div className="flex items-center justify-between py-1.5 border-b border-dashed border-[#F0E2E5]">
            <span className="text-xs sm:text-sm font-semibold text-[#5D7A7B]">4. Size áo</span>
            <span className="px-3 py-1 bg-[#1D4E4F] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs">
              Size {order.size || '-'}
            </span>
          </div>

          {/* Ghi chú nếu có */}
          {order.note && (
            <div className="flex items-start justify-between pt-1">
              <span className="text-xs font-semibold text-[#5D7A7B]">Ghi chú:</span>
              <span className="text-xs text-[#1D4E4F] max-w-[200px] text-right italic font-medium">
                "{order.note}"
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-xl border border-[#F0E2E5] bg-white hover:bg-[#F8F5F6] text-[#5D7A7B] font-bold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sửa Lại</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-2 h-12 rounded-xl bg-gradient-to-r from-[#FF758F] to-[#FF5C7A] hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-[#FF758F]/30 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Đang gửi lưu...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Chắc Chắn & Gửi Đi</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] text-[#5D7A7B]">
          <Sparkles className="w-3 h-3 text-[#52B788]" />
          <span>Thông tin sẽ được lưu trực tiếp vào bảng tính</span>
        </div>
      </div>
    </div>
  );
};
