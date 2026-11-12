/**
 * Script xử lý điền thông tin Áo Lớp, live preview và gửi dữ liệu
 */

const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwYOUR_SCRIPT_ID/exec";
let appsScriptUrl = localStorage.getItem("ao_lop_apps_script_url") || DEFAULT_APPS_SCRIPT_URL;

// DOM Elements
const form = document.getElementById("orderForm");
const inputFullName = document.getElementById("fullName");
const inputJerseyNumber = document.getElementById("jerseyNumber");
const inputPrintedName = document.getElementById("printedName");
const inputOrderNote = document.getElementById("orderNote");
const btnContinue = document.getElementById("btnContinue");

// Preview Elements
const svgPrintedName = document.getElementById("svgPrintedName");
const svgJerseyNumber = document.getElementById("svgJerseyNumber");
const pillSize = document.getElementById("pillSize");
const pillNumber = document.getElementById("pillNumber");
const pillName = document.getElementById("pillName");

// Modal Elements
const confirmModal = document.getElementById("confirmModal");
const btnModalBack = document.getElementById("btnModalBack");
const btnModalSubmit = document.getElementById("btnModalSubmit");
const submitBtnText = document.getElementById("submitBtnText");
const submitSpinner = document.getElementById("submitSpinner");

const modalFullName = document.getElementById("modalFullName");
const modalJerseyNumber = document.getElementById("modalJerseyNumber");
const modalPrintedName = document.getElementById("modalPrintedName");
const modalSize = document.getElementById("modalSize");
const modalNoteRow = document.getElementById("modalNoteRow");
const modalNote = document.getElementById("modalNote");

// Size Guide Modal
const sizeGuideModal = document.getElementById("sizeGuideModal");
const btnOpenSizeGuide = document.getElementById("btnOpenSizeGuide");
const btnHelpSize = document.getElementById("btnHelpSize");
const btnCloseSizeGuide = document.getElementById("btnCloseSizeGuide");
const btnUnderstandSize = document.getElementById("btnUnderstandSize");

// Success Modal
const successModal = document.getElementById("successModal");
const btnRegisterAnother = document.getElementById("btnRegisterAnother");
const sucName = document.getElementById("sucName");
const sucShirt = document.getElementById("sucShirt");
const sucSize = document.getElementById("sucSize");
const sucId = document.getElementById("sucId");

// --- 1. LIVE PREVIEW UPDATE ---

function getSelectedSize() {
  const checked = document.querySelector('input[name="size"]:checked');
  return checked ? checked.value : "M";
}

function updateLivePreview() {
  const num = inputJerseyNumber.value.trim() || "10";
  const name = inputPrintedName.value.trim().toUpperCase() || "TÊN BẠN";
  const size = getSelectedSize();

  // Update SVG Number (Hỗ trợ 0 - 999)
  svgJerseyNumber.textContent = num;
  if (num.length >= 3) {
    svgJerseyNumber.setAttribute("font-size", "76");
    svgJerseyNumber.setAttribute("y", "265");
  } else {
    svgJerseyNumber.setAttribute("font-size", "110");
    svgJerseyNumber.setAttribute("y", "275");
  }

  // Update SVG Name
  svgPrintedName.textContent = name;
  if (name.length > 13) {
    svgPrintedName.setAttribute("font-size", "16");
  } else if (name.length > 9) {
    svgPrintedName.setAttribute("font-size", "18");
  } else if (name.length > 6) {
    svgPrintedName.setAttribute("font-size", "20");
  } else {
    svgPrintedName.setAttribute("font-size", "22");
  }

  // Update pills
  if (pillNumber) pillNumber.textContent = '#' + num;
  if (pillName) pillName.textContent = name;
  if (pillSize) pillSize.textContent = 'Size ' + size;
}

// Lắng nghe sự kiện gõ phím
inputJerseyNumber.addEventListener("input", function() {
  // Cho phép nhập số từ 0 - 999
  this.value = this.value.replace(/[^0-9]/g, "").slice(0, 3);
  updateLivePreview();
});

inputPrintedName.addEventListener("input", function() {
  updateLivePreview();
});

// Chọn size
document.querySelectorAll('input[name="size"]').forEach(radio => {
  radio.addEventListener("change", updateLivePreview);
});

// --- 2. MOBILE TAB SWITCHER ---
const tabBtnForm = document.getElementById("tabBtnForm");
const tabBtnPreview = document.getElementById("tabBtnPreview");

if (tabBtnForm && tabBtnPreview) {
  tabBtnForm.addEventListener("click", () => {
    document.body.classList.remove("show-preview");
    tabBtnForm.classList.add("active");
    tabBtnPreview.classList.remove("active");
  });

  tabBtnPreview.addEventListener("click", () => {
    document.body.classList.add("show-preview");
    tabBtnPreview.classList.add("active");
    tabBtnForm.classList.remove("active");
  });
}

// --- 3. MODAL BẢNG SIZE ---
function openSizeGuide() { sizeGuideModal.classList.add("open"); }
function closeSizeGuide() { sizeGuideModal.classList.remove("open"); }

if (btnOpenSizeGuide) btnOpenSizeGuide.addEventListener("click", openSizeGuide);
if (btnHelpSize) btnHelpSize.addEventListener("click", openSizeGuide);
if (btnCloseSizeGuide) btnCloseSizeGuide.addEventListener("click", closeSizeGuide);
if (btnUnderstandSize) btnUnderstandSize.addEventListener("click", closeSizeGuide);

// --- 4. MODAL XÁC NHẬN THÔNG TIN ---

btnContinue.addEventListener("click", function() {
  const fullName = inputFullName.value.trim();
  const jerseyNumber = inputJerseyNumber.value.trim();
  const printedName = inputPrintedName.value.trim();
  const size = getSelectedSize();
  const note = inputOrderNote.value.trim();

  // Validate 4 trường cốt lõi
  if (!fullName) {
    alert("Vui lòng điền Họ và tên của bạn nhé!");
    inputFullName.focus();
    return;
  }
  if (!jerseyNumber) {
    alert("Vui lòng điền Số áo mong muốn (từ 0 đến 999)!");
    inputJerseyNumber.focus();
    return;
  }
  if (!printedName) {
    alert("Vui lòng nhập Tên in trên áo!");
    inputPrintedName.focus();
    return;
  }

  // Đổ dữ liệu vào Modal xác nhận
  modalFullName.textContent = fullName;
  modalJerseyNumber.textContent = '#' + jerseyNumber;
  modalPrintedName.textContent = printedName.toUpperCase();
  modalSize.textContent = 'Size ' + size;

  if (note) {
    modalNote.textContent = note;
    modalNoteRow.style.display = "flex";
  } else {
    modalNoteRow.style.display = "none";
  }

  confirmModal.classList.add("open");
});

btnModalBack.addEventListener("click", function() {
  confirmModal.classList.remove("open");
});

// --- 5. GỬI DỮ LIỆU ---

btnModalSubmit.addEventListener("click", async function() {
  const fullName = inputFullName.value.trim();
  const jerseyNumber = inputJerseyNumber.value.trim();
  const printedName = inputPrintedName.value.trim().toUpperCase();
  const size = getSelectedSize();
  const note = inputOrderNote.value.trim();
  const orderId = "AL-" + ("" + Date.now()).slice(-6);

  const payload = {
    id: orderId,
    fullName: fullName,
    jerseyNumber: jerseyNumber,
    printedName: printedName,
    size: size,
    note: note
  };

  btnModalSubmit.disabled = true;
  submitBtnText.textContent = "Đang gửi...";
  submitSpinner.style.display = "inline-block";

  try {
    if (appsScriptUrl && !appsScriptUrl.includes("YOUR_SCRIPT_ID")) {
      await fetch(appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await new Promise(r => setTimeout(r, 600));
    }

    confirmModal.classList.remove("open");
    
    sucName.textContent = fullName;
    sucShirt.textContent = '#' + jerseyNumber + ' - ' + printedName;
    sucSize.textContent = 'Size ' + size;
    sucId.textContent = orderId;
    
    successModal.classList.add("open");

  } catch (error) {
    console.error("Lỗi gửi dữ liệu:", error);
    alert("Đã xảy ra sự cố khi gửi. Vui lòng thử lại!");
  } finally {
    btnModalSubmit.disabled = false;
    submitBtnText.textContent = "Chắc Chắn & Gửi Đi";
    submitSpinner.style.display = "none";
  }
});

btnRegisterAnother.addEventListener("click", function() {
  form.reset();
  updateLivePreview();
  successModal.classList.remove("open");
  if (tabBtnForm) tabBtnForm.click();
});

// Khởi tạo ban đầu
updateLivePreview();
