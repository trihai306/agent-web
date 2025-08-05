# Hệ thống API Quản lý Giao dịch và Người dùng

Đây là một dự án API được xây dựng bằng Laravel, cung cấp các chức năng cốt lõi để quản lý người dùng, xác thực và thực hiện các giao dịch tài chính như nạp và rút tiền.

## Tính năng chính

-   **Xác thực người dùng:** Đăng ký, đăng nhập, và đăng xuất qua API token (sử dụng Laravel Sanctum).
-   **Quản lý người dùng:** Lưu trữ thông tin chi tiết của người dùng (họ, tên, email, số điện thoại).
-   **Quản lý tài khoản:** Mỗi người dùng có một số dư tài khoản.
-   **Quản lý giao dịch:** Ghi lại lịch sử các giao dịch nạp và rút tiền.
-   **Bảo mật:** Các endpoint quan trọng được bảo vệ, chỉ cho phép người dùng đã xác thực truy cập.

---

## Yêu cầu hệ thống

-   PHP >= 8.2
-   Composer
-   Một cơ sở dữ liệu (ví dụ: MySQL, PostgreSQL)
-   Node.js & NPM (tùy chọn, nếu cần tùy chỉnh frontend)

---

## Hướng dẫn cài đặt

1.  **Clone repository:**
    ```bash
    git clone https://your-repository-url.git
    cd project-folder
    ```

2.  **Cài đặt các gói PHP:**
    ```bash
    composer install
    ```

3.  **Tạo file môi trường:**
    Sao chép tệp `.env.example` thành `.env`.
    ```bash
    cp .env.example .env
    ```

4.  **Tạo khóa ứng dụng:**
    ```bash
    php artisan key:generate
    ```

5.  **Cấu hình cơ sở dữ liệu:**
    Mở tệp `.env` và cập nhật các thông tin kết nối cơ sở dữ liệu của bạn.
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_user
    DB_PASSWORD=your_database_password
    ```

6.  **Chạy migrations:**
    Lệnh này sẽ tạo các bảng cần thiết trong cơ sở dữ liệu của bạn.
    ```bash
    php artisan migrate
    ```

7.  **Chạy server:**
    ```bash
    php artisan serve
    ```
    API của bạn sẽ có sẵn tại `http://localhost:8000`.

---

## Tài liệu API

Tài liệu chi tiết cho các API endpoint đã được chia thành các phần riêng biệt để dễ dàng tra cứu.

-   [**API Xác thực**](./docs/api/authentication.md): Bao gồm đăng ký, đăng nhập, đăng xuất.
-   [**API Người dùng & Giao dịch**](./docs/api/transactions.md): Bao gồm lấy thông tin người dùng, nạp tiền, và rút tiền.
