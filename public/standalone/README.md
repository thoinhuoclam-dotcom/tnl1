# Trang Đăng Ký Áo Lớp - Sẵn Sàng Cho GitHub Pages

Trang web thu thập thông tin đặt áo lớp thanh lịch, tối ưu di động với 4 trường dữ liệu chuẩn xác:
1. **Tên thành viên**
2. **Số áo**
3. **Tên in sau lưng áo**
4. **Size áo**

---

## 🚀 Hướng Dẫn Đăng Tải Lên GitHub Pages Trong 3 Bước

### Bước 1: Tạo Repository mới trên GitHub
1. Đăng nhập [GitHub.com](https://github.com).
2. Bấm nút **New Repository**, đặt tên (ví dụ: `ao-lop-2026`).
3. Chọn chế độ **Public** và bấm **Create repository**.

### Bước 2: Tải code lên
1. Bạn có thể kéo thả 3 file: `index.html`, `style.css`, `script.js` lên GitHub.
2. Bấm **Commit changes**.

### Bước 3: Bật GitHub Pages
1. Vào tab **Settings** của repository > Chọn mục **Pages** ở cột bên trái.
2. Tại phần **Build and deployment > Branch**: Chọn nhánh `main` (hoặc `master`), thư mục `/(root)` và bấm **Save**.
3. Sau 30 giây, GitHub sẽ cung cấp cho bạn link trang web:
   `https://<ten-user>.github.io/<ten-repo>/`
4. Gửi link này vào nhóm Zalo/Messenger của lớp để các bạn vào điền!

---

## 📊 Hướng Dẫn Kết Nối Với Google Sheets

1. Tạo một trang tính Google Sheets mới trên Google Drive (ví dụ đặt tên là: *Danh Sách Đặt Áo Lớp 12A1*).
2. Chọn menu **Tiện ích mở rộng** (Extensions) > **Apps Script**.
3. Mở file `Code.gs`, xóa hết nội dung cũ và dán toàn bộ nội dung từ file `Code.gs` này vào.
4. Bấm biểu tượng **Lưu** (Ctrl + S), sau đó bấm nút **Triển khai** (Deploy) ở góc trên bên phải > chọn **Tùy chọn triển khai mới** (New deployment).
5. Thiết lập:
   - **Loại triển khai**: Chọn biểu tượng bánh răng ⚙️ > **Web app**.
   - **Mô tả**: *API Áo Lớp*.
   - **Thực thi dưới dạng**: *Tôi* (tài khoản của bạn).
   - **Ai có quyền truy cập**: **Bất kỳ ai** (*Anyone*).
6. Bấm **Triển khai**, cấp quyền cho Google Sheets (bấm Advanced > Đi tới dự án).
7. Sao chép **URL ứng dụng web** (Web app URL có dạng `https://script.google.com/macros/s/.../exec`).
8. Mở file `script.js`, thay thế dòng:
   ```javascript
   const DEFAULT_APPS_SCRIPT_URL = "DÁN_URL_WEB_APP_CỦA_BẠN_VÀO_ĐÂY";
   ```
   Commit lại lên GitHub là xong! Mọi thông tin gửi sẽ tự động ghi vào Google Sheets.
