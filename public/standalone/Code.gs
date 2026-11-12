/**
 * Google Apps Script - Xử lý lưu thông tin đặt Áo Lớp vào Google Sheets
 * 
 * Hướng dẫn 3 bước:
 * 1. Mở file Google Sheets mới trên Google Drive
 * 2. Chọn Tiện ích mở rộng (Extensions) > Apps Script
 * 3. Dán toàn bộ mã này vào file Code.gs, bấm Lưu và bấm "Triển khai" (Deploy) > "Tùy chọn triển khai mới" (New deployment)
 *    - Loại triển khai: Web app
 *    - Ai có quyền truy cập: Bất kỳ ai (Anyone)
 * 4. Sao chép URL Web App nhận được và dán vào trang web!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Tự động tạo tiêu đề cột nếu trang tính còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời gian gửi",
        "Họ và tên",
        "Số áo",
        "Tên in sau lưng áo",
        "Size áo",
        "Màu áo",
        "Ghi chú",
        "Mã đơn"
      ]);
      // Định dạng dòng tiêu đề
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground("#FFE5EC");
      headerRange.setFontColor("#1D4E4F");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // Đọc dữ liệu từ form gửi lên
    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    var timestamp = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    var fullName = data.fullName || "";
    var jerseyNumber = data.jerseyNumber || "";
    var printedName = data.printedName || "";
    var size = data.size || "";
    var shirtColor = data.shirtColor || "Trắng Kem";
    var note = data.note || "";
    var orderId = data.id || "AL-" + ("" + new Date().getTime()).slice(-6);
    
    // Ghi dòng mới vào Sheets
    sheet.appendRow([
      timestamp,
      fullName,
      "'" + jerseyNumber, // Dấu nháy đơn giữ định dạng số 07, 09
      printedName,
      size,
      shirtColor,
      note,
      orderId
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã lưu thông tin áo lớp thành công!",
      orderId: orderId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Google Apps Script Webhook Áo Lớp đang hoạt động tốt!"
  })).setMimeType(ContentService.MimeType.JSON);
}
