export interface ShirtOrder {
  id: string;
  fullName: string;
  jerseyNumber: string;
  printedName: string;
  size: ShirtSize;
  note: string;
  createdAt: string;
}

export type ShirtSize = 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';

export interface SizeRecommendation {
  size: ShirtSize;
  width: string;   // Ngang áo
  length: string;  // Dài áo
  weight: string;  // Cân nặng
  height: string;  // Chiều cao
}

export const SHIRT_SIZES: ShirtSize[] = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

// Bảng size chuẩn từ hình ảnh người dùng cung cấp
export const SIZE_GUIDE_DATA: SizeRecommendation[] = [
  { size: 'S',   width: '45 cm', length: '60 cm', weight: '< 40 kg',    height: '< 1m5' },
  { size: 'M',   width: '50 cm', length: '65 cm', weight: '< 50 kg',    height: '< 1m6' },
  { size: 'L',   width: '55 cm', length: '70 cm', weight: '< 62 kg',    height: '< 1m7' },
  { size: 'XL',  width: '60 cm', length: '75 cm', weight: '< 75 kg',    height: '< 1m75' },
  { size: '2XL', width: '65 cm', length: '80 cm', weight: '< 90 kg',    height: '< 1m85' },
  { size: '3XL', width: '70 cm', length: '85 cm', weight: '95 - 110 kg', height: '> 1m9' },
];
