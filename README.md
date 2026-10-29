# 🎡 MS.TRANG ENGLISH CLASS - Lucky Student Wheel

Ứng dụng Vòng quay may mắn dành riêng cho lớp học tiếng Anh tiểu học của cô Trang, giao diện **CUTE 3D COLORFUL** phong cách hoạt hình thân thiện, chữ to, sắc nét tối ưu cho màn hình máy chiếu lớp học.

---

## 🌟 Tính Năng Nổi Bật

1. **Quản Lý Nhiều Lớp Học**:
   - Thêm, sửa, xóa lớp học linh hoạt.
   - Mỗi lớp có ID riêng biệt, lưu trữ an toàn. Đổi tên lớp không làm ảnh hưởng liên kết dữ liệu.
   - Dán danh sách học sinh theo từng dòng nhanh chóng. Tự động loại bỏ dòng trống.
   - **Cảnh báo tên trùng**: Tự động phát hiện và cảnh báo giáo viên nếu có tên học sinh bị trùng lặp.
   - Không tự động sinh dữ liệu giả (mock data).

2. **Vòng Quay Chuẩn Xác 100%**:
   - Tự động chia đều các phần (segments) theo số lượng học sinh.
   - Phối màu 3D sinh động, tương phản cao, các ô kề nhau không bị trùng màu.
   - **Độ chính xác tuyệt đối**: Kim chỉ trên đỉnh vòng quay trỏ chính xác vào đúng học sinh trúng giải.
   - Khóa nút quay và khóa chuyển lớp trong khi vòng quay đang chạy để chống race condition.
   - Hiệu ứng âm thanh cơ học (tick) khi đi qua từng ô và âm thanh vinh danh (fanfare) khi trúng thưởng (tổng hợp qua Web Audio API, không phụ thuộc file ngoài).
   - Pháo hoa chúc mừng (Confetti) và bảng vinh danh học sinh trúng thưởng to rõ.

3. **Nút Xem Hình Ảnh Lớp Đang Chọn**:
   - Hiển thị nút `🖼️ Xem hình lớp [Tên Lớp]` (Ví dụ: `🖼️ Xem hình lớp 5.2`).
   - Mở an toàn trong tab mới với `rel="noopener noreferrer"`.
   - Tự động đồng bộ ngay khi chuyển lớp.
   - Tự động chuyển sang trạng thái vô hiệu hóa kèm nhãn `Chưa thêm hình lớp` nếu lớp chưa có link ảnh.
   - Xác thực chặt chẽ URL `http://` hoặc `https://`.

4. **Lưu Trữ Bền Vững (Local Storage)**:
   - Lưu trữ toàn bộ danh sách lớp, học sinh, đường dẫn ảnh và lớp đang chọn.
   - Tải lại trang (F5) khôi phục 100% trạng thái làm việc trước đó.
   - Cơ chế di chuyển dữ liệu cũ an toàn, không làm mất dữ liệu.
   - Bắt lỗi bộ nhớ đầy (QuotaExceededError) kèm thông báo thân thiện.

5. **Giao Diện Máy Chiếu Thân Thiện**:
   - Font chữ tròn trịa, vui nhộn (`Fredoka`, `Baloo 2`, `Quicksand`).
   - Nút bấm dạng 3D khối nổi bật dễ bấm, có nút bật/tắt âm thanh tiện lợi.

---

## 🚀 Hướng Dẫn Chạy Ứng Dụng

### Cách 1: Chạy Chế Độ Phát Triển (Dev Server)
```bash
npm run dev
```
Truy cập: `http://localhost:3000`

### Cách 2: Xem Bản Build Sẵn
```bash
npm run preview
```

### Cách 3: Sử Dụng Trực Tiếp Bản Tĩnh
Mở trực tiếp file `dist/index.html` trên bất kỳ trình duyệt web hiện đại nào (Chrome, Edge, Safari, Firefox).
