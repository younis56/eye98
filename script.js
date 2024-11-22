let currentID = 1;
let editIndex = null;

// تعيين الزيارة المقبلة بناءً على أيام محددة
function setNextVisit(days) {
  const today = new Date();
  today.setDate(today.getDate() + days);
  document.getElementById("next-visit").value = today.toISOString().split("T")[0];
}

// حفظ البيانات
function saveData() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const age = document.getElementById("age").value.trim();
  const gender = document.getElementById("gender").value;
  const date = document.getElementById("date").value;
  const nextVisit = document.getElementById("next-visit").value || "لا يوجد";
  const rightSpherical = document.getElementById("right-spherical").value || "لا يوجد";
  const rightAstigmatism = document.getElementById("right-astigmatism").value || "لا يوجد";
  const rightAxis = document.getElementById("right-axis").value || "لا يوجد";
  const leftSpherical = document.getElementById("left-spherical").value || "لا يوجد";
  const leftAstigmatism = document.getElementById("left-astigmatism").value || "لا يوجد";
  const leftAxis = document.getElementById("left-axis").value || "لا يوجد";
  const notes = document.getElementById("notes").value.trim() || "لا توجد ملاحظات";

  // التحقق من الحقول المطلوبة
  if (!name || !phone || !age || !date) {
    alert("يرجى ملء الحقول المطلوبة");
    return;
  }

  const table = document.getElementById("data-table").querySelector("tbody");
  const remainingDays = calculateRemainingDays(nextVisit);

  if (editIndex !== null) {
    // تعديل البيانات
    const row = table.rows[editIndex];
    row.innerHTML = generateRowHTML(
      currentID,
      name,
      phone,
      age,
      gender,
      date,
      rightSpherical,
      rightAstigmatism,
      rightAxis,
      leftSpherical,
      leftAstigmatism,
      leftAxis,
      nextVisit,
      remainingDays,
      notes
    );
    editIndex = null;
  } else {
    // إضافة بيانات جديدة
    const row = document.createElement("tr");
    row.innerHTML = generateRowHTML(
      currentID,
      name,
      phone,
      age,
      gender,
      date,
      rightSpherical,
      rightAstigmatism,
      rightAxis,
      leftSpherical,
      leftAstigmatism,
      leftAxis,
      nextVisit,
      remainingDays,
      notes
    );
    table.appendChild(row);
    currentID++;
  }

  document.getElementById("eye-form").reset();
}

// توليد HTML للصفوف
function generateRowHTML(
  id,
  name,
  phone,
  age,
  gender,
  date,
  rightSpherical,
  rightAstigmatism,
  rightAxis,
  leftSpherical,
  leftAstigmatism,
  leftAxis,
  nextVisit,
  remainingDays,
  notes
) {
  return `
    <td>${id}</td>
    <td>${name}</td>
    <td>${phone}</td>
    <td>${age}</td>
    <td>${gender}</td>
    <td>${date}</td>
    <td>${rightSpherical} / ${rightAstigmatism} / ${rightAxis}</td>
    <td>${leftSpherical} / ${leftAstigmatism} / ${leftAxis}</td>
    <td>${nextVisit}</td>
    <td>${remainingDays}</td>
    <td>${notes}</td>
    <td>
      <button onclick="editData(this)">تعديل</button>
      <button onclick="deleteRow(this)">حذف</button>
      <button onclick="sendMessage('${phone}', '${nextVisit}')">إرسال رسالة</button>
    </td>
  `;
}

// حساب الأيام المتبقية
function calculateRemainingDays(nextVisit) {
  if (!nextVisit || nextVisit === "لا يوجد") return "لا يوجد";
  const nextDate = new Date(nextVisit);
  const today = new Date();
  const diffTime = nextDate - today;
  return diffTime > 0
    ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + " يوم"
    : "متأخرة";
}

// تعديل البيانات
function editData(button) {
  const row = button.parentElement.parentElement;
  const cells = row.cells;

  document.getElementById("name").value = cells[1].innerText;
  document.getElementById("phone").value = cells[2].innerText;
  document.getElementById("age").value = cells[3].innerText;
  document.getElementById("gender").value = cells[4].innerText;
  document.getElementById("date").value = cells[5].innerText.split(" ")[0];
  document.getElementById("next-visit").value =
    cells[8].innerText === "لا يوجد" ? "" : cells[8].innerText;

  editIndex = row.rowIndex - 1; // حفظ الفهرس للتعديل
}

// حذف صف
function deleteRow(button) {
  if (confirm("هل تريد بالتأكيد حذف هذا الصف؟")) {
    button.parentElement.parentElement.remove();
  }
}

// إرسال رسالة
function sendMessage(phone, nextVisit) {
  const message = `مرحبًا! نود تذكيرك بموعد زيارتك المقبلة في ${nextVisit}. شكراً لثقتك في عوينات سامراء الطبية.`;
  if (confirm("إرسال الرسالة عبر WhatsApp؟")) {
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  } else {
    alert("ميزة SMS قيد التطوير.");
  }
}

// تصدير البيانات إلى Excel
function exportToExcel() {
  const table = document.getElementById("data-table");
  const workbook = XLSX.utils.table_to_book(table, { sheet: "بيانات المرضى" });
  XLSX.writeFile(workbook, "بيانات_المرضى.xlsx");
}

// طباعة البيانات
function printData() {
  window.print();
}

// مشاركة البيانات
function shareData() {
  alert("ميزة مشاركة البيانات قيد التطوير.");
}

// البحث في البيانات
function searchData() {
  const input = document.getElementById("search").value.toLowerCase().trim();
  const rows = document.querySelectorAll("#data-table tbody tr");

  rows.forEach((row) => {
    const name = row.cells[1].innerText.toLowerCase();
    const date = row.cells[5].innerText.toLowerCase();
    const match = name.includes(input) || date.includes(input);
    row.style.display = match ? "" : "none";
  });
}