let records = JSON.parse(localStorage.getItem('dentalRecords')) || [];
let editIndex = -1;

function doGet(e) {
    var file = DriveApp.getFileById('your-file-id');
    var content = file.getBlob().getDataAsString();
    return ContentService.createTextOutput(content);
  }

function addRow() {
    const table = document.getElementById('treatmentTableBody');
    const newRow = table.insertRow();

    const cols = ['date', 'tooth', 'treatment', 'cost', 'paid', 'remaining', 'doctor'];
    cols.forEach(col => {
        const cell = newRow.insertCell();
        const input = document.createElement('input');
        input.type = (col === 'date') ? 'date' : 
        (col === 'cost' || col === 'paid' || col === 'remaining') ? 'number' : 'text';
        input.name = col;
        if (col === 'doctor') {
            input.value = 'My';
        }
        if (col === 'remaining') {
            input.readOnly = true;
        }
        cell.appendChild(input);
    });
}

document.getElementById('dentalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    let jsonData = {
        id: editIndex > -1 ? records[editIndex].id : new Date().getTime(),
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        dob: formData.get('dob'),
        visitDate: formData.get('visitDate'),
        appointment: formData.get('appointment'),
        plan: []
    };

    const rows = document.querySelectorAll('#treatmentTableBody tr');
    rows.forEach(row => {
        let planItem = {};
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            planItem[input.name] = input.value;
        });
    
        jsonData.plan.push(planItem);
    });

    if (editIndex > -1) {
        records[editIndex] = jsonData;
        editIndex = -1;
    } else {
        records.push(jsonData);
    }


    localStorage.setItem('dentalRecords', JSON.stringify(records));
    displayRecords();
    this.reset();
            
    const today = new Date().toISOString().split('T')[0];
    //document.getElementById('hamy').value = today;

    document.getElementById("visitDate").value = today;
    document.getElementById("appointment").value = today;
    //document.getElementById("dateBang").innerHTML = today;

});

function displayRecords() {
    const tableBody = document.getElementById('recordTableBody');
    document.getElementById('texxt').innerHTML = records.length
    tableBody.innerHTML = '';
    records.forEach((record, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = record.name;
        row.insertCell(2).textContent = record.phone;
        row.insertCell(3).textContent = record.address;
        row.insertCell(4).textContent = record.dob;
        row.insertCell(5).textContent = record.visitDate;
        row.insertCell(6).textContent = record.appointment;
        const actionCell = row.insertCell(7);
        const editButton = document.createElement('button');
        editButton.textContent = 'Sửa';
        editButton.onclick = () => editRecord(index);
        actionCell.appendChild(editButton);
       
    });
}

function editRecord(index) {
    editIndex = index;
    const record = records[index];

    document.getElementById('name').value = record.name;
    document.getElementById('phone').value = record.phone;
    document.getElementById('address').value = record.address;
    document.getElementById('dob').value = record.dob;
    document.getElementById('visitDate').value = record.visitDate;
    document.getElementById('appointment').value = record.appointment;

    const tableBody = document.getElementById('treatmentTableBody');
    tableBody.innerHTML = '';
    record.plan.forEach(planItem => {
        const newRow = tableBody.insertRow();
        const cols = ['date', 'tooth', 'treatment', 'cost', 'paid', 'remaining', 'doctor'];
        cols.forEach(col => {
            const cell = newRow.insertCell();
            const input = document.createElement('input');
            input.type = (col === 'date' || col === 'appointment') ? 'date' : (col === 'cost' || col === 'paid' || col === 'remaining') ? 'number' : 'text';
            input.name = col;
            input.value = planItem[col];
            cell.appendChild(input);
        });
    });

    document.getElementById('deleteButton').classList.remove('hidden');
}

function deleteRecord() {
    if (editIndex > -1) {
        records.splice(editIndex, 1);
        localStorage.setItem('dentalRecords', JSON.stringify(records));
        displayRecords();
        document.getElementById('dentalForm').reset();
        document.getElementById('deleteButton').classList.add('hidden');
        editIndex = -1;
    }
}

function addNew(){
    document.getElementById("searchPhone").value = "";
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    // document.getElementById("myInputField").value = "";
    // document.getElementById("myInputField").value = "";
    // document.getElementById("myInputField").value = "";

    var inputs = document.querySelectorAll("#treatmentTableBody input, #treatmentTableBody textarea");
    
    // Lặp qua từng input và textarea để xóa dữ liệu
    inputs.forEach(function(input) {
        if (input.type !== "submit" && input.type !== "button" && !input.hasAttribute('readonly')) {
            input.value = "";
        }
    });
}

function searchLichHen(){
    const lichhen = document.getElementById('lichhen').value;
    let filteredRecords = records.filter(record => record.appointment.toLowerCase().includes(lichhen));


    const tableBody = document.getElementById('recordTableBody');
    tableBody.innerHTML = '';
    filteredRecords.forEach((record, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = record.name;
        row.insertCell(2).textContent = record.phone;
        row.insertCell(3).textContent = record.address;
        row.insertCell(4).textContent = record.dob;
        row.insertCell(5).textContent = record.visitDate;
        row.insertCell(6).textContent = record.appointment;
        const actionCell = row.insertCell(7);
        const editButton = document.createElement('button');
        editButton.textContent = 'Sửa';
        editButton.onclick = () => editRecord(records.indexOf(record));
        actionCell.appendChild(editButton);
    });

}

function searchRecords() {
    const searchPhone = document.getElementById('searchPhone').value.toLowerCase();
    let filteredRecords = records.filter(record => record.phone.toLowerCase().includes(searchPhone));
    
    // Nếu không tìm thấy theo số điện thoại, tìm theo tên
    if (filteredRecords.length === 0) {
        filteredRecords = records.filter(record => record.name.toLowerCase().includes(searchPhone));
    }
    
    const tableBody = document.getElementById('recordTableBody');
    tableBody.innerHTML = '';
    filteredRecords.forEach((record, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = record.name;
        row.insertCell(2).textContent = record.phone;
        row.insertCell(3).textContent = record.address;
        row.insertCell(4).textContent = record.dob;
        row.insertCell(5).textContent = record.visitDate;
        row.insertCell(6).textContent = record.appointment;
        const actionCell = row.insertCell(6);
        const editButton = document.createElement('button');
        editButton.textContent = 'Sửa';
        editButton.onclick = () => editRecord(records.indexOf(record));
        actionCell.appendChild(editButton);
    });
}

function saveToFile() {

    const confirmation = confirm("Bạn có chắc chắn muốn lưu dữ liệu đầu tháng đến hiện tại?");

    if(confirmation){
        const today = new Date();

        function isInCurrentMonth(date) {
            const currentMonth = today.getMonth(); // Tháng hiện tại (0 - 11)
            const currentYear = today.getFullYear(); // Năm hiện tại

            return (date.getMonth() === currentMonth && date.getFullYear() === currentYear);
        }

        const filteredRecords = records.filter(record => {
            const recordDate = new Date(record.visitDate);
            return isInCurrentMonth(recordDate);
        });

        if (filteredRecords.length > 0) {
            const dataStr = JSON.stringify(filteredRecords, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `DucHanh-${getFormattedDate()}.json`; // Thay đổi đuôi file thành .json để phản ánh định dạng dữ liệu
            document.body.appendChild(a);

            a.click();
            // if (isLastDayOfMonth(today)) {
            //     a.click();
            // } else {
            //     alert('Chỉ ngày cuối tháng mới được lưu file nhé');
            // }

            document.body.removeChild(a);
        } else {
            alert('Không có dữ liệu để lưu trong tháng hiện tại.');
        }

        // localStorage.clear();
        // location.reload();
    }
   
}
function saveToFileChange(){
    const confirmation = confirm("Bạn có chắc chắn muốn lưu dữ liệu lên cloud và chuyển sang máy tính khác");

    if(confirmation){
        // const today = new Date();
        // const dataStr = JSON.stringify(records, null, 2);
        // const blob = new Blob([dataStr], { type: 'application/json' });
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = `DucHanh-${getFormattedDate()}.txt`;
        // document.body.appendChild(a);
        // // if(isLastDayOfMonth(today)){
        // //     a.click();
        // // }else{
        // //     alert('Chỉ ngày cuối tháng mới được lưu file nh')
        // // }
        // a.click();
        
       
        // document.body.removeChild(a);


        fetch('https://script.google.com/macros/s/AKfycbzjXxdGVStI7qLNEvMXZNqipkd9MC6IUtJ66KdFY69Va-iELCrx0FUit0fhMYky-NHx/exec', {
            method: 'POST',
            body: JSON.stringify(records, null, 2),
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Kết quả sau khi cập nhật file
            alert('Lưu dữ liệu lên cơ sở dữ liệu thành công')
            location.reload();
        });
    }
}


function saveToFileDelete() {

    const confirmation = confirm("Bạn có chắc chắn muốn lưu dữ liệu và xóa hết dữ liệu hiện có");

    if(confirmation){
        const today = new Date();
        const dataStr = JSON.stringify(records, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DucHanh-${getFormattedDate()}.txt`;
        document.body.appendChild(a);
        // if(isLastDayOfMonth(today)){
        //     a.click();
        // }else{
        //     alert('Chỉ ngày cuối tháng mới được lưu file nh')
        // }
        a.click();
        
       
        document.body.removeChild(a);

        localStorage.clear();
        location.reload();
    }
   
}

function loadFromFile() {
    document.getElementById('fileInput').click();
}

function loadFromFileThang(){
    document.getElementById('fileInputThang').click();
}

function handleFileUploadCloud() {
    fetch('https://script.google.com/macros/s/AKfycbzjXxdGVStI7qLNEvMXZNqipkd9MC6IUtJ66KdFY69Va-iELCrx0FUit0fhMYky-NHx/exec')
        .then(response => response.text())
        .then(data => {
            try {
                const records = JSON.parse(data);
                localStorage.setItem('dentalRecords', JSON.stringify(records));
                displayRecords();
                location.reload();
                alert('Tải dữ liệu từ cơ sở dữ liệu thành công')
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        })
        .catch(error => {
            console.error('Error fetching file:', error);
        });
}

function handleFileUpload(event) {

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        records = data;
        localStorage.setItem('dentalRecords', JSON.stringify(records));
        displayRecords();
    };
    reader.readAsText(file);
}

function handleFileUploadThang(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const datas = JSON.parse(e.target.result);
    
        const plans = datas.flatMap(data => data.plan);

        let totalCost = 0;
   let totalPaid = 0;
   let totalRemaining = 0;

   plans.forEach(plan => {
    if (plan.cost) totalCost += parseFloat(plan.cost);
    if (plan.paid) totalPaid += parseFloat(plan.paid);
    if (plan.remaining) totalRemaining += parseFloat(plan.remaining);
    });
    const dialog = document.getElementById('dialog');
    const totalsDiv = document.getElementById('totals');
    totalsDiv.innerHTML = `
        <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
        <p><strong>Total Paid:</strong> ${totalPaid.toFixed(2)}</p>
        <p><strong>Total Remaining:</strong> ${totalRemaining.toFixed(2)}</p>
    `;
    dialog.classList.add('active');
        
    };
    reader.readAsText(file);
}

function getFormattedDate() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 nên cần cộng thêm 1
    const year = date.getFullYear();

    // Thêm số 0 vào trước nếu ngày hoặc tháng chỉ có 1 chữ số
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    return `${day}-${month}-${year}`;
}

function isLastDayOfMonth(date) {
    const testDate = new Date(date);
    const nextDay = new Date(testDate);
    nextDay.setDate(testDate.getDate() + 1);

    return nextDay.getDate() === 1;
}

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('treatmentTableBody');

    // Lắng nghe sự kiện 'input' cho tất cả các trường trong bảng
    tableBody.addEventListener('input', (event) => {
        const input = event.target;

        // Kiểm tra nếu sự kiện là từ các trường 'cost' hoặc 'paid'
        if (input.name === 'cost' || input.name === 'paid') {
            updateRemaining(input);
        }
    });
});

function updateRemaining(input) {
    const row = input.closest('tr'); // Tìm hàng chứa trường input
    const costInput = row.querySelector('input[name="cost"]');
    const paidInput = row.querySelector('input[name="paid"]');
    const remainingInput = row.querySelector('input[name="remaining"]');

    // Lấy giá trị của các trường 'cost' và 'paid'
    const cost = parseFloat(costInput.value) || 0;
    const paid = parseFloat(paidInput.value) || 0;

    // Tính toán giá trị còn lại và cập nhật trường 'remaining'
    remainingInput.value = cost - paid;
}


// script.js
// document.addEventListener('DOMContentLoaded', () => {
//     const showBoxButton = document.getElementById('showBoxButton');
//     const infoBox = document.getElementById('infoBox');
//     const closeButton = document.getElementById('closeButton');

//     // Hiển thị hộp thoại khi nhấp vào nút
//     showBoxButton.addEventListener('click', () => {
//         infoBox.classList.remove('hidden');
//     });

//     // Ẩn hộp thoại khi nhấp vào nút đóng
//     closeButton.addEventListener('click', () => {
//         infoBox.classList.add('hidden');
//     });

//     // Ẩn hộp thoại khi nhấp ra ngoài hộp thoại
//     window.addEventListener('click', (event) => {
//         if (event.target === infoBox) {
//             infoBox.classList.add('hidden');
//         }
//     });
// });


function thongKeDoanhTheoThang(){

}

function closeDialog() {
    document.getElementById('dialog').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}





document.getElementById('exportButton').addEventListener('click', () => {
    const confirmation = confirm("Bạn có chắc chắn muốn thống kê doanh thu hiện tại?");

    if (confirmation) {

        const today = new Date(); // Lấy ngày hiện tại
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Lấy ngày 1 của tháng hiện tại

        const plans = records.flatMap(record => 
            record.plan.filter(plan => {
                const planDate = new Date(plan.date); // Giả định rằng plan.date có định dạng ngày hợp lệ
                return planDate >= firstOfMonth && planDate <= today; // Lọc các kế hoạch trong khoảng từ ngày 1 đến hiện tại
            })
        );

     
        let totalCost = 0;
        let totalPaid = 0;
        let totalRemaining = 0;
     
        plans.forEach(plan => {
         if (plan.cost) totalCost += parseFloat(plan.cost);
         if (plan.paid) totalPaid += parseFloat(plan.paid);
         if (plan.remaining) totalRemaining += parseFloat(plan.remaining);
         });
         const dialog = document.getElementById('dialog');
         const overlay = document.getElementById('overlay');
         const totalsDiv = document.getElementById('totals');
         totalsDiv.innerHTML = `
             <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
             <p><strong>Total Paid:</strong> ${totalPaid.toFixed(2)}</p>
             <p><strong>Total Remaining:</strong> ${totalRemaining.toFixed(2)}</p>
         `;
         dialog.classList.add('active');
         overlay.classList.add('active');
    }

   

});

function removeSearch(){
    displayRecords();
}

document.addEventListener('DOMContentLoaded', (event) => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visitDate').value = today;
    const dateInputs = document.querySelectorAll('input[type="date"]');
            dateInputs.forEach(input => {
                input.value = today;
            });
});

function updateClock() {
    const now = new Date();
   
    const today = formatDateToDDMMYYYY(now)

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${today} ${hours}:${minutes}:${seconds}`;
    
    document.getElementById('clock').textContent = timeString;
}

function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0'); // Ngày
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng (tháng bắt đầu từ 0)
    const year = date.getFullYear(); // Năm

    return `${day}-${month}-${year}`;
}
function formatDateToDDMMYYYYNew(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

setInterval(updateClock, 1000); // Cập nhật đồng hồ mỗi giây
updateClock(); 



function dowloadCloudData() {
    // Hiển thị popup loading
    const loadingPopup = document.getElementById('loadingPopup');
    loadingPopup.style.display = 'block';

    // Gọi hàm xử lý công việc
    handleFileUploadCloud().then(() => {
        // Tắt popup loading
        loadingPopup.style.display = 'none';
        // Hiển thị thông báo thành công
        alert('Tải dữ liệu từ cơ sở dữ liệu thành công')
    });
}

function uploadCloudData() {
    // Hiển thị popup loading
    const loadingPopup = document.getElementById('loadingPopup');
    loadingPopup.style.display = 'block';

    // Gọi hàm xử lý công việc
    saveToFileChange().then(() => {
        // Tắt popup loading
        loadingPopup.style.display = 'none';
        // Hiển thị thông báo thành công
    });
}

function checkPassword() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    const correctUsername = 'duchanh';
    const correctPassword = '123'; 

    if (password === correctPassword && username === correctUsername) {
        document.getElementById('passwordPopup').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    } else {
        document.getElementById('error').style.display = 'block';
    }
}

// Ngăn người dùng truy cập trang nếu không nhập mật khẩu đúng
window.onload = function() {
    document.getElementById('passwordPopup').style.display = 'block';
    document.getElementById('content').style.display = 'none';
};





// Khởi tạo hiển thị ban đầu
displayRecords();
