# NEXUS E-commerce Backend

FastAPI backend cho NEXUS e-commerce platform.

## 📋 Yêu cầu

- Python 3.12+
- PostgreSQL 16+
- pip hoặc poetry

## 🚀 Cách chạy Backend

### Option 1: Chạy với Docker Compose (Khuyến nghị)

#### Bước 1: Setup môi trường

```bash
cd backend/functions/product_manager

# Copy file .env.example thành .env
cp .env.example .env

# Chỉnh sửa .env với thông tin database của bạn
```

#### Bước 2: Chạy với Docker Compose

```bash
# Build và chạy tất cả services (API + PostgreSQL + Nginx)
docker-compose up --build

# Hoặc chạy ở background
docker-compose up -d
```

Backend sẽ chạy tại:
- API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- Nginx: `http://localhost:80`

#### Bước 3: Khởi tạo Database

```bash
# Vào container
docker exec -it product_manager-api-1 bash

# Chạy schema SQL
psql -U $POSTGRES_USER -d $POSTGRES_DB -f /app/../../database/schema.sql

# Hoặc nếu có Alembic migrations
alembic upgrade head
```

### Option 2: Chạy trực tiếp (Local Development)

#### Bước 1: Setup Virtual Environment

```bash
cd backend/functions/product_manager

# Tạo virtual environment
python3 -m venv venv

# Activate virtual environment
# Trên macOS/Linux:
source venv/bin/activate
# Trên Windows:
# venv\Scripts\activate
```

#### Bước 2: Cài đặt Dependencies

```bash
# Cài đặt packages
pip install -r requirements.txt
```

#### Bước 3: Setup Database

1. **Tạo PostgreSQL database:**

```bash
# Kết nối PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE nexus_ecommerce;

# Tạo user (optional)
CREATE USER nexus_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nexus_ecommerce TO nexus_user;
```

2. **Chạy schema SQL:**

```bash
# Từ thư mục backend
psql -U nexus_user -d nexus_ecommerce -f database/schema.sql
```

#### Bước 4: Cấu hình Environment Variables

Tạo file `.env` trong `backend/functions/product_manager/`:

```env
# Database Configuration
POSTGRES_ENGINE=postgresql+asyncpg
POSTGRES_DB=nexus_ecommerce
POSTGRES_USER=nexus_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Application
PROJECT_NAME=NEXUS E-commerce API
LOG_LEVEL=INFO
ENVIRONMENT=local

# Security
TOKEN_SECRET=your-secret-key-change-in-production
ALLOW_ORIGINS=http://localhost:3000,http://localhost:3001
ALLOW_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
ALLOW_HEADERS=*

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
```

#### Bước 5: Chạy Server

```bash
cd backend/functions/product_manager/app

# Chạy với uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Hoặc sử dụng script
../scripts/start-uvicorn.sh
```

Backend sẽ chạy tại:
- API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## 🧹 Xóa Môi Trường

Để xóa tất cả môi trường development (venv, cache, Docker containers):

```bash
# Chạy script cleanup
cd backend
./cleanup-env.sh

# Hoặc xóa thủ công:
# 1. Xóa virtual environments
rm -rf .venv
rm -rf functions/product_manager/app/venv

# 2. Xóa Python cache
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete

# 3. Xóa Docker containers và volumes
cd functions/product_manager
docker-compose down -v

# 4. Xóa CDK build artifacts
cd ../..
rm -rf cdk.out
```

## 📚 API Endpoints

### Product APIs
- `GET /api/v1/products` - List products
- `GET /api/v1/products/{slug}` - Get product detail

### Cart APIs
- `GET /api/v1/cart` - Get current cart
- `POST /api/v1/cart/items` - Add item to cart
- `PATCH /api/v1/cart/items/{itemId}` - Update cart item quantity
- `DELETE /api/v1/cart/items/{itemId}` - Remove cart item

### Auth APIs
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token

## 🗄️ Database Schema

Database schema được định nghĩa trong `backend/database/schema.sql`.

### Tables:
- `users` - User accounts
- `products` - Product catalog
- `product_variants` - Product variants với SKU
- `carts` - Shopping carts
- `cart_items` - Cart items
- `orders` - Customer orders
- `order_items` - Order items
- `access_token_log` - Access token tracking

## 🧪 Testing

```bash
# Chạy tests
pytest tests/ -vv

# Với coverage
pytest --cov --cov-report=html tests/
```

## 📝 Notes

- Backend sử dụng async SQLAlchemy với asyncpg
- CORS đã được cấu hình để cho phép frontend tại `http://localhost:3000`
- Authentication sử dụng JWT tokens
- Cart hỗ trợ cả guest (session_id) và authenticated users

## 🔧 Troubleshooting

### Lỗi kết nối database:
- Kiểm tra PostgreSQL đang chạy: `pg_isready`
- Kiểm tra credentials trong `.env`
- Kiểm tra database đã được tạo chưa

### Lỗi import modules:
- Đảm bảo đang ở đúng thư mục `backend/functions/product_manager/app`
- Kiểm tra virtual environment đã được activate
- Chạy `pip install -r requirements.txt` lại

### Port đã được sử dụng:
- Thay đổi port trong `.env` hoặc docker-compose.yaml
- Hoặc kill process đang sử dụng port: `lsof -ti:8000 | xargs kill`
