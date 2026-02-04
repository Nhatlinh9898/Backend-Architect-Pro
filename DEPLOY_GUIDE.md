# 🚀 Hướng dẫn Triển khai AI Backend lên Google Cloud Run

Tài liệu này cung cấp quy trình "Step-by-Step" để đưa ứng dụng FastAPI tích hợp Gemini của bạn lên môi trường Production.

---

## 🟢 Bước 1: Mục tiêu Hệ thống
1. **Frontend/Client**: Gửi Prompt.
2. **Backend (Cloud Run)**: Tiếp nhận -> Gọi Gemini -> Trả kết quả.
3. **Database (SQLite)**: Lưu lịch sử ngay trong container (Lưu ý: Dữ liệu này sẽ mất khi container restart - Xem mục mở rộng để dùng Cloud SQL).
4. **Scale**: Tự động scale từ 0 lên hàng ngàn instance.

---

## 🟢 Bước 2: Chuẩn bị Môi trường
Cài đặt [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) và thực hiện các lệnh sau:

```bash
# Đăng nhập vào tài khoản Google
gcloud auth login

# Thiết lập Project ID (Thay YOUR_PROJECT_ID bằng ID thực tế của bạn)
gcloud config set project YOUR_PROJECT_ID

# Bật các API cần thiết
gcloud services enable run.googleapis.com \
                       cloudbuild.googleapis.com \
                       artifactregistry.googleapis.com
```

---

## 🟢 Bước 3: Build & Push Image lên Artifact Registry

Chúng ta sẽ sử dụng **Cloud Build** để đóng gói ứng dụng. Việc này giúp bạn không cần cài đặt Docker ở máy local.

```bash
# 1. Tạo Repository lưu trữ image tại khu vực asia-east1 (Đài Loan)
gcloud artifacts repositories create ai-backend \
    --repository-format=docker \
    --location=asia-east1 \
    --description="Docker repository cho AI Service"

# 2. Build và Push image lên Registry
# Cấu trúc: [LOCATION]-docker.pkg.dev/[PROJECT_ID]/[REPO_NAME]/[IMAGE_NAME]
gcloud builds submit --tag asia-east1-docker.pkg.dev/YOUR_PROJECT_ID/ai-backend/ai-service
```

---

## 🟢 Bước 4: Triển khai lên Google Cloud Run

Đây là bước quan trọng nhất để đưa ứng dụng online.

```bash
gcloud run deploy ai-service \
  --image asia-east1-docker.pkg.dev/YOUR_PROJECT_ID/ai-backend/ai-service \
  --region asia-east1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXX"
```

**Tham số giải thích:**
- `--allow-unauthenticated`: Cho phép API public (không cần token GCP để gọi).
- `--set-env-vars`: Truyền API Key của Gemini vào biến môi trường một cách an toàn.

---

## 🟢 Bước 5: Kiểm thử API (Live Test)

Sau khi thành công, bạn sẽ nhận được một URL có dạng: `https://ai-service-xxxxx-de.a.run.app`.

Hãy thử gọi API bằng `curl`:
```bash
curl -X POST "https://YOUR_CLOUD_RUN_URL/ai/generate" \
     -H "Content-Type: application/json" \
     -d '{"user_input":"Viết chương trình Python tính tổng từ 1 đến 100"}'
```

---

## 🟢 Bước 6: Gợi ý Mở rộng (Production Grade)

Để hệ thống chuyên nghiệp hơn, hãy cân nhắc:
1. **Dữ liệu bền vững**: Thay SQLite bằng **Google Cloud SQL (PostgreSQL)**. 
2. **Bảo mật**: Sử dụng **Secret Manager** để lưu `GOOGLE_API_KEY` thay vì truyền trực tiếp qua biến môi trường.
3. **Tên miền riêng**: Ánh xạ URL Cloud Run vào domain của bạn (ví dụ: `api.yourdomain.com`).
4. **Authentication**: Thêm lớp bảo mật JWT để chỉ những user hợp lệ mới có thể gọi AI (tránh tốn tiền API key vô tội vạ).
