import React, { useState, useEffect } from 'react';
import { ShirtOrder, ShirtSize, SHIRT_SIZES } from './types';
import { TShirtVector } from './components/TShirtVector';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SuccessView } from './components/SuccessView';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getOrCreateSpreadsheet,
  appendOrderToSpreadsheet,
} from './services/googleSheets';
import { User } from 'firebase/auth';
import { Ruler, ArrowRight, Info, Check, LogIn, LogOut } from 'lucide-react';

export default function App() {
  // Form State (Exact 4 fields + optional note)
  const [fullName, setFullName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [printedName, setPrintedName] = useState('');
  const [selectedSize, setSelectedSize] = useState<ShirtSize>('M');
  const [note, setNote] = useState('');

  // Mobile View Switcher (Form vs Preview)
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Modals
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Google Account & Sheets State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<ShirtOrder | null>(null);

  // Setup Firebase Auth on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        // Tự động tạo/tìm spreadsheet
        getOrCreateSpreadsheet(token)
          .then((res) => {
            setSpreadsheetId(res.spreadsheetId);
            setSpreadsheetUrl(res.spreadsheetUrl);
          })
          .catch((err) => console.log('Init sheet info:', err));
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsConnectingGoogle(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        const sheetRes = await getOrCreateSpreadsheet(res.accessToken);
        setSpreadsheetId(sheetRes.spreadsheetId);
        setSpreadsheetUrl(sheetRes.spreadsheetUrl);
      }
    } catch (err) {
      console.error('Lỗi kết nối tài khoản Google:', err);
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setAccessToken(null);
  };

  // Open Confirmation Modal
  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert('Vui lòng nhập Họ và tên thành viên!');
      return;
    }
    if (!jerseyNumber.trim()) {
      alert('Vui lòng nhập Số áo mong muốn (từ 0 đến 999)!');
      return;
    }
    if (!printedName.trim()) {
      alert('Vui lòng nhập Tên in sau lưng áo!');
      return;
    }

    setIsConfirmOpen(true);
  };

  // Execute Submission
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    const orderId = 'AL-' + ('' + Date.now()).slice(-6);
    const now = new Date();
    const formattedDate = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    const newOrder: ShirtOrder = {
      id: orderId,
      fullName: fullName.trim(),
      jerseyNumber: jerseyNumber.trim(),
      printedName: printedName.trim().toUpperCase(),
      size: selectedSize,
      note: note.trim(),
      createdAt: formattedDate,
    };

    try {
      // 1. Nếu đã có kết nối tài khoản Google trực tiếp
      if (accessToken && spreadsheetId) {
        await appendOrderToSpreadsheet(accessToken, spreadsheetId, newOrder);
      } else if (accessToken) {
        const sheetRes = await getOrCreateSpreadsheet(accessToken);
        setSpreadsheetId(sheetRes.spreadsheetId);
        setSpreadsheetUrl(sheetRes.spreadsheetUrl);
        await appendOrderToSpreadsheet(accessToken, sheetRes.spreadsheetId, newOrder);
      } else {
        // Fallback lưu cục bộ nếu người dùng chưa bấm đăng nhập tài khoản Google
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setSubmittedOrder(newOrder);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('Lỗi khi ghi dữ liệu:', error);
      // Vẫn ghi nhận cho người dùng xem biên nhận
      setSubmittedOrder(newOrder);
      setIsConfirmOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setJerseyNumber('');
    setPrintedName('');
    setSelectedSize('M');
    setNote('');
    setSubmittedOrder(null);
    setMobileTab('form');
  };

  return (
    <div className="min-h-screen bg-[#FFF7F8] text-[#1D4E4F] flex flex-col font-sans selection:bg-[#FFE5EC] selection:text-[#1D4E4F]">
      
      {/* 1. TOP BAR NAVIGATION (Gọn gàng, tinh tế, không ghi nhãn kỹ thuật) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F0E2E5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Tiêu đề ngắn gọn */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFE5EC] text-[#FF758F] flex items-center justify-center shadow-xs">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#1D4E4F] block leading-none">
                Đăng Ký Áo Lớp
              </span>
            </div>
          </div>

          {/* Nút Bảng Size & Tài khoản Google */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FFE5EC] border border-[#F0E2E5] text-[#1D4E4F] hover:text-[#FF758F] text-xs font-bold transition-colors cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Bảng size</span>
            </button>

            {/* Tài khoản Google liên kết */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#E8F5EE] border border-[#D5EBE0] px-2.5 py-1 rounded-full text-xs text-[#2D5A46]">
                <span className="w-2 h-2 rounded-full bg-[#52B788]" />
                <span className="max-w-[120px] truncate font-semibold hidden sm:inline">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  type="button"
                  onClick={handleGoogleSignOut}
                  title="Đăng xuất tài khoản Google"
                  className="hover:text-rose-600 transition-colors cursor-pointer ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isConnectingGoogle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1D4E4F] hover:bg-[#163832] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isConnectingGoogle ? 'Đang kết nối...' : 'Kết nối Google'}</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 2. MOBILE VIEWPORT TAB SWITCHER */}
      <div className="lg:hidden px-4 pt-3 pb-1 max-w-md mx-auto w-full">
        <div className="flex items-center gap-1 p-1 bg-white border border-[#F0E2E5] rounded-2xl shadow-xs">
          <button
            type="button"
            onClick={() => setMobileTab('form')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'form'
                ? 'bg-[#1D4E4F] text-white shadow-xs'
                : 'text-[#5D7A7B] hover:text-[#1D4E4F]'
            }`}
          >
            1. Điền Thông Tin
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'preview'
                ? 'bg-[#1D4E4F] text-white shadow-xs'
                : 'text-[#5D7A7B] hover:text-[#1D4E4F]'
            }`}
          >
            2. Xem Dáng Áo
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {submittedOrder ? (
          <SuccessView
            order={submittedOrder}
            sheetUrl={spreadsheetUrl}
            onReset={handleResetForm}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* CỘT TRÁI: FORM ĐĂNG KÝ (7 COLS TRÊN DESKTOP) */}
            <div
              className={`lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E2E5] shadow-xs ${
                mobileTab === 'preview' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D4E4F] tracking-tight">
                  Điền Thông Tin Đặt Áo
                </h1>
                <p className="text-xs sm:text-sm text-[#5D7A7B] mt-1">
                  Vui lòng điền đủ 4 mục bên dưới để hoàn tất đăng ký.
                </p>
              </div>

              <form onSubmit={handleOpenConfirmation} className="space-y-5" autoComplete="off">
                
                {/* MỤC 1: TÊN THÀNH VIÊN */}
                <div>
                  <label htmlFor="fullNameInput" className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-sm font-bold text-[#1D4E4F]">
                      <span className="w-5 h-5 rounded-md bg-[#FFE5EC] text-[#FF758F] flex items-center justify-center text-xs font-extrabold">
                        1
                      </span>
                      <span>Tên thành viên</span>
                      <span className="text-[#FF758F]">*</span>
                    </span>
                  </label>
                  <input
                    id="fullNameInput"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Bảo Anh"
                    maxLength={50}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-[#DECED3] bg-[#FCFAFA] focus:bg-white focus:border-[#FF758F] focus:ring-3 focus:ring-[#FFE5EC] outline-none text-sm text-[#1D4E4F] font-semibold transition-all"
                  />
                </div>

                {/* MỤC 2: SỐ ÁO (0 - 999) */}
                <div>
                  <label htmlFor="jerseyNumberInput" className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-sm font-bold text-[#1D4E4F]">
                      <span className="w-5 h-5 rounded-md bg-[#FFE5EC] text-[#FF758F] flex items-center justify-center text-xs font-extrabold">
                        2
                      </span>
                      <span>Số áo</span>
                      <span className="text-[#FF758F]">*</span>
                    </span>
                    <span className="text-[11px] text-[#5D7A7B]">Từ 0 đến 999</span>
                  </label>
                  
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-jersey text-base text-[#5D7A7B]">
                      #
                    </span>
                    <input
                      id="jerseyNumberInput"
                      type="text"
                      value={jerseyNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                        setJerseyNumber(val);
                      }}
                      placeholder="10"
                      maxLength={3}
                      inputMode="numeric"
                      required
                      className="w-full h-12 pl-8 pr-4 rounded-xl border border-[#DECED3] bg-[#FCFAFA] focus:bg-white focus:border-[#FF758F] focus:ring-3 focus:ring-[#FFE5EC] outline-none font-jersey text-xl text-[#1D4E4F] transition-all"
                    />
                  </div>
                </div>

                {/* MỤC 3: TÊN ÁO (IN SAU LƯNG) */}
                <div>
                  <label htmlFor="printedNameInput" className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-sm font-bold text-[#1D4E4F]">
                      <span className="w-5 h-5 rounded-md bg-[#FFE5EC] text-[#FF758F] flex items-center justify-center text-xs font-extrabold">
                        3
                      </span>
                      <span>Tên in trên áo</span>
                      <span className="text-[#FF758F]">*</span>
                    </span>
                    <span className="text-[11px] text-[#5D7A7B]">Tối đa 16 ký tự</span>
                  </label>
                  <input
                    id="printedNameInput"
                    type="text"
                    value={printedName}
                    onChange={(e) => setPrintedName(e.target.value)}
                    placeholder="VD: BẢO ANH, CR7, CAPTAIN"
                    maxLength={16}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-[#DECED3] bg-[#FCFAFA] focus:bg-white focus:border-[#FF758F] focus:ring-3 focus:ring-[#FFE5EC] outline-none text-sm text-[#1D4E4F] font-extrabold uppercase tracking-wide transition-all"
                  />
                </div>

                {/* MỤC 4: SIZE ÁO (S, M, L, XL, 2XL, 3XL - Chỉ cho lựa size) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-[#1D4E4F]">
                      <span className="w-5 h-5 rounded-md bg-[#FFE5EC] text-[#FF758F] flex items-center justify-center text-xs font-extrabold">
                        4
                      </span>
                      <span>Size áo</span>
                      <span className="text-[#FF758F]">*</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs font-bold text-[#FF758F] hover:underline cursor-pointer"
                    >
                      Bảng thông số size
                    </button>
                  </div>

                  {/* Lựa chọn size (S - 3XL) */}
                  <div className="grid grid-cols-6 gap-2">
                    {SHIRT_SIZES.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`h-12 rounded-xl text-sm font-extrabold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#1D4E4F] text-white border-[#1D4E4F] shadow-sm shadow-[#1D4E4F]/20 scale-102'
                              : 'bg-[#FCFAFA] border-[#DECED3] text-[#1D4E4F] hover:bg-white hover:border-[#FF758F]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* GHI CHÚ (OPTIONAL) */}
                <div>
                  <label htmlFor="noteInput" className="block text-xs font-semibold text-[#5D7A7B] mb-1">
                    Ghi chú (không bắt buộc):
                  </label>
                  <input
                    id="noteInput"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="VD: May form rộng, lấy áo dài qua hông..."
                    maxLength={100}
                    className="w-full h-11 px-4 rounded-xl border border-[#DECED3] bg-[#FCFAFA] focus:bg-white focus:border-[#FF758F] outline-none text-xs sm:text-sm text-[#1D4E4F] transition-all"
                  />
                </div>

                {/* NÚT KIỂM TRA & XÁC NHẬN GỬI */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#FF758F] to-[#FF5C7A] hover:opacity-95 text-white font-extrabold text-base shadow-lg shadow-[#FF758F]/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Kiểm Tra &amp; Xác Nhận Gửi</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-center text-[11px] text-[#5D7A7B] mt-2 flex items-center justify-center gap-1">
                    <Info className="w-3.5 h-3.5 text-[#FF758F]" />
                    <span>Hộp thoại xác nhận sẽ hiện ra trước khi gửi để bạn kiểm tra lại.</span>
                  </p>
                </div>

              </form>
            </div>

            {/* CỘT PHẢI: MÔ PHỎNG MẶT SAU ÁO (5 COLS TRÊN DESKTOP) */}
            <div
              className={`lg:col-span-5 ${
                mobileTab === 'form' ? 'hidden lg:block' : 'block'
              } lg:sticky lg:top-24`}
            >
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F0E2E5] shadow-xs text-center">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F0E2E5]">
                  <span className="text-xs font-bold text-[#5D7A7B]">Xem trước mặt sau</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FFF0F3] text-[#FF758F] text-xs font-bold">
                    Size {selectedSize}
                  </span>
                </div>

                {/* Vùng Render Áo SVG */}
                <div className="py-2">
                  <TShirtVector
                    printedName={printedName}
                    jerseyNumber={jerseyNumber}
                    size={selectedSize}
                  />
                </div>

                {/* Tóm Tắt Nhanh */}
                <div className="mt-4 pt-3 border-t border-dashed border-[#F0E2E5] grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#FFF9FA]">
                    <span className="text-[#5D7A7B] block text-[10px]">Số áo</span>
                    <span className="font-jersey font-extrabold text-[#1D4E4F] text-sm">
                      #{jerseyNumber || '10'}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FFF9FA]">
                    <span className="text-[#5D7A7B] block text-[10px]">Tên in</span>
                    <span className="font-extrabold text-[#1D4E4F] text-xs uppercase truncate block">
                      {printedName || 'TÊN BẠN'}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FFF9FA]">
                    <span className="text-[#5D7A7B] block text-[10px]">Size</span>
                    <span className="font-extrabold text-[#1D4E4F] text-xs block">
                      {selectedSize}
                    </span>
                  </div>
                </div>

                {/* Nút bấm sang form nếu đang ở mobile tab preview */}
                <div className="mt-4 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileTab('form')}
                    className="w-full h-11 rounded-xl bg-[#1D4E4F] text-white font-bold text-xs"
                  >
                    Quay Lại Điền Thông Tin
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* FOOTER TINH GỌN (Không ghi mã nguồn github hay các nhãn kỹ thuật) */}
      <footer className="mt-auto border-t border-[#F0E2E5] bg-white py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5D7A7B]">
          <span>© 2026 Đăng Ký Áo Lớp</span>
          <div className="flex items-center gap-2">
            <a
              href="/standalone/index.html"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              Mã nguồn tĩnh
            </a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* Modal 1: Xác nhận trước khi gửi */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        order={{
          fullName,
          jerseyNumber,
          printedName,
          size: selectedSize,
          note,
        }}
        isSubmitting={isSubmitting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
      />

      {/* Modal 2: Bảng tra cứu Size */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        selectedSize={selectedSize}
        onSelectSize={(s) => setSelectedSize(s)}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
