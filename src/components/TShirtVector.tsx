import React from 'react';

interface TShirtVectorProps {
  printedName: string;
  jerseyNumber: string;
  size: string;
  className?: string;
}

export const TShirtVector: React.FC<TShirtVectorProps> = ({
  printedName,
  jerseyNumber,
  size,
  className = '',
}) => {
  const displayNum = jerseyNumber.trim() || '10';
  const displayName = printedName.trim().toUpperCase() || 'TÊN BẠN';

  // Responsive font size calculation for the printed name
  let nameFontSize = 22;
  if (displayName.length > 13) {
    nameFontSize = 16;
  } else if (displayName.length > 9) {
    nameFontSize = 18;
  } else if (displayName.length > 6) {
    nameFontSize = 20;
  }

  // Responsive font size & position calculation for the jersey number (supports 0 - 999)
  let numberFontSize = 110;
  let numberY = 275;
  if (displayNum.length >= 3) {
    numberFontSize = 76;
    numberY = 265;
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[340px] drop-shadow-xl select-none transition-all duration-300"
      >
        <defs>
          <filter id="softShirtShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#1D4E4F" floodOpacity="0.09" />
          </filter>
          <linearGradient id="fabricShine" x1="120" y1="50" x2="280" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Thân áo thun (Mặt sau) */}
        <path
          d="M130 52 C150 72 250 72 270 52 L372 105 L336 182 L295 162 L295 402 C295 408 290 412 280 412 L120 412 C110 412 105 408 105 402 L105 162 L64 182 L28 105 Z"
          fill="#FFFDF9"
          stroke="#E5D9DC"
          strokeWidth="2.5"
          filter="url(#softShirtShadow)"
        />

        {/* Lớp ánh vải nhẹ nhàng */}
        <path
          d="M130 52 C150 72 250 72 270 52 L372 105 L336 182 L295 162 L295 402 C295 408 290 412 280 412 L120 412 C110 412 105 408 105 402 L105 162 L64 182 L28 105 Z"
          fill="url(#fabricShine)"
        />

        {/* Cổ áo viền phía sau */}
        <path
          d="M130 52 C160 68 240 68 270 52 C255 76 145 76 130 52 Z"
          fill="#F2EBED"
          stroke="#DECED3"
          strokeWidth="2"
        />

        {/* Đường may nách áo & gấu áo */}
        <path d="M105 162 L125 152" stroke="#DECED3" strokeWidth="2" strokeLinecap="round" />
        <path d="M295 162 L275 152" stroke="#DECED3" strokeWidth="2" strokeLinecap="round" />
        <path d="M118 398 L282 398" stroke="#DECED3" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* VÙNG IN: TÊN SAU LƯNG ÁO */}
        <g>
          <text
            x="200"
            y="152"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize={nameFontSize}
            fontWeight="800"
            fill="#1D4E4F"
            letterSpacing="2"
            style={{ textTransform: 'uppercase' }}
          >
            {displayName}
          </text>
        </g>

        {/* VÙNG IN: SỐ ÁO (0 - 999) */}
        <g>
          {/* Bóng đổ số áo */}
          <text
            x="200"
            y={numberY + 3}
            textAnchor="middle"
            className="font-jersey"
            fontSize={numberFontSize}
            fontWeight="900"
            fill="#1D4E4F"
            opacity="0.08"
          >
            {displayNum}
          </text>
          {/* Số áo chính */}
          <text
            x="200"
            y={numberY}
            textAnchor="middle"
            className="font-jersey"
            fontSize={numberFontSize}
            fontWeight="900"
            fill="#1D4E4F"
          >
            {displayNum}
          </text>
        </g>

        {/* Huy hiệu size góc gấu áo */}
        <g transform="translate(245, 368)">
          <rect width="28" height="16" rx="4" fill="#FFFFFF" opacity="0.9" stroke="#E5D9DC" strokeWidth="1" />
          <text
            x="14"
            y="12"
            fontSize="8.5"
            fontWeight="800"
            fill="#1D4E4F"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {size}
          </text>
        </g>
      </svg>
    </div>
  );
};
