import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '@/firebase-applet-config.json';
import { ShirtOrder } from '../types';

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Không thể lấy Access Token từ Google');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Đăng nhập Google thất bại:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

const SPREADSHEET_ID_STORAGE_KEY = 'ao_lop_google_sheet_id';

/**
 * Lấy hoặc tự động tạo một trang tính mới trong Google Drive của người dùng
 */
export const getOrCreateSpreadsheet = async (
  accessToken: string,
  title: string = 'Danh Sách Đăng Ký Áo Lớp'
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const existingId = localStorage.getItem(SPREADSHEET_ID_STORAGE_KEY);
  if (existingId) {
    // Thử kiểm tra xem sheet có tồn tại không
    try {
      const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${existingId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (checkRes.ok) {
        const data = await checkRes.json();
        return {
          spreadsheetId: existingId,
          spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${existingId}`,
        };
      }
    } catch {
      // Bỏ qua lỗi và tạo mới bên dưới
    }
  }

  // Tạo spreadsheet mới
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        {
          properties: {
            title: 'Danh Sách',
            gridProperties: { rowCount: 100, columnCount: 7, frozenRowCount: 1 },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    throw new Error('Không thể tạo Google Sheet mới');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  localStorage.setItem(SPREADSHEET_ID_STORAGE_KEY, spreadsheetId);

  // Thêm hàng tiêu đề (Header row)
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Danh Sách!A1:G1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [
          [
            'Thời gian',
            'Họ và tên thành viên',
            'Số áo',
            'Tên in sau lưng áo',
            'Size áo',
            'Ghi chú',
            'Mã đơn',
          ],
        ],
      }),
    }
  );

  return {
    spreadsheetId,
    spreadsheetUrl: sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
  };
};

/**
 * Ghi thông tin đăng ký áo lớp vào Google Sheets
 */
export const appendOrderToSpreadsheet = async (
  accessToken: string,
  spreadsheetId: string,
  order: ShirtOrder
): Promise<void> => {
  const rowValues = [
    order.createdAt,
    order.fullName,
    `'${order.jerseyNumber}`, // Thêm dấu ' để giữ nguyên dạng số 07, 00, 10
    order.printedName,
    order.size,
    order.note || '',
    order.id,
  ];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Danh Sách!A:G:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    }
  );

  if (!appendRes.ok) {
    const errorBody = await appendRes.text();
    console.error('Lỗi append Google Sheets:', errorBody);
    throw new Error('Không thể thêm dòng vào Google Sheet');
  }
};
