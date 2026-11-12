import React, { useState } from 'react';
import { ShirtOrder } from '../types';
import { CheckCircle, Copy, Check, PlusCircle, Sparkles, ExternalLink } from 'lucide-react';

interface SuccessViewProps {
  order: ShirtOrder;
  sheetUrl?: string | null;
  onReset: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  order,
  sheetUrl,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const receiptText = `👕 XÁC NHẬN ĐĂNG KÝ ÁO LỚP:
- Mã đơn: ${order.id}
- Họ và tên: ${order.fullName}
- Số áo: #${order.jerseyNumber}
- Tên in lưng: ${order.printedName}
- Size áo: ${order.size}
${order.note ? `- Ghi chú: ${order.note}\n` : ''}- Thời gian: ${order.createdAt}`;

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#F0E2E5] text-center animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E8F5EE] text-[#52B788] flex items-center justify-center shadow-xs">
        <CheckCircle className="w-9 h-9 stroke-[2.2]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EC] text-[#FF758F] text-xs font-extrabold uppercase tracking-wider mb-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Ghi Nhận Thành Công</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-[#1D4E4F] tracking-tight mb-2">
        Đã Lưu Thông Tin!
      </h2>
      <p className="text-sm text-[#5D7A7B] mb-6">
        Thông tin áo của bạn đã được ghi nhận vào bảng tính danh sách.
      </p>

      {/* Phiếu biên nhận */}
      <div className="bg-[#FFF9FA] border border-[#F0E2E5] rounded-2xl p-5 mb-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-16 h-16 bg-[#FFE5EC] rounded-full opacity-40 pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#F0E2E5]">
          <span className="text-xs font-bold text-[#5D7A7B] uppercase tracking-wider">Phiếu Đặt Áo</span>
          <span className="font-mono text-xs font-bold text-[#FF758F] bg-white px-2.5 py-0.5 rounded-md border border-[#F0E2E5]">
            {order.id}
          </span>
        </div>

        <div className="space-y-2.5 py-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#5D7A7B] font-medium text-xs sm:text-sm">Họ và tên:</span>
            <span className="font-bold text-[#1D4E4F]">{order.fullName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#5D7A7B] font-medium text-xs sm:text-sm">Số áo &amp; Tên in:</span>
            <span className="font-bold text-[#1D4E4F] flex items-center gap-1.5">
              <span className="font-jersey text-[#FF758F] text-base">#{order.jerseyNumber}</span>
              <span>·</span>
              <span className="uppercase">{order.printedName}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#5D7A7B] font-medium text-xs sm:text-sm">Size áo:</span>
            <span className="px-2.5 py-0.5 bg-[#1D4E4F] text-white text-xs font-bold rounded-md">
              Size {order.size}
            </span>
          </div>

          {order.note && (
            <div className="flex items-start justify-between pt-1 border-t border-dashed border-[#F0E2E5]">
              <span className="text-[#5D7A7B] font-medium text-xs">Ghi chú:</span>
              <span className="text-xs text-[#1D4E4F] italic">{order.note}</span>
            </div>
          )}
        </div>

        <div className="pt-2.5 border-t border-dashed border-[#F0E2E5] text-[11px] text-[#5D7A7B] flex items-center justify-between">
          <span>Thời gian: {order.createdAt}</span>
          <span className="text-[#52B788] font-bold">✓ Đã lưu thành công</span>
        </div>
      </div>

      {/* Link xem Google Sheets nếu có */}
      {sheetUrl && (
        <div className="mb-4">
          <a
            href={sheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors"
          >
            <span>Mở xem bảng tính Google Sheets</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Nút thao tác */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleCopyReceipt}
          className="flex-1 h-12 rounded-xl border border-[#DECED3] bg-white hover:bg-slate-50 text-[#1D4E4F] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-[#52B788]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Đã sao chép!' : 'Sao Chép Phiếu'}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex-1 h-12 rounded-xl bg-[#1D4E4F] hover:bg-[#163B3C] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-[#1D4E4F]/20 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng Ký Cho Bạn Khác</span>
        </button>
      </div>
    </div>
  );
};
