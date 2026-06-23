# Blog Management System

> **📋 Technical Assignment — Metier Thailand**
>
> โปรเจกต์นี้เป็น Technical Assignment ที่ได้รับมอบหมายจากบริษัท **Metier Thailand** 

---

## 📖 ภาพรวมโปรเจกต์

ระบบจัดการบล็อกที่ประกอบด้วย 2 ส่วนหลัก:

- **Public Blog Website** — หน้าเว็บสำหรับผู้อ่านทั่วไป แสดงบทความที่เผยแพร่แล้ว พร้อมระบบค้นหา Pagination และ Comment
- **Admin Panel** — แผงควบคุมสำหรับผู้ดูแลระบบ จัดการบทความ รูปภาพ และอนุมัติ/ปฏิเสธ Comment

---

## ✨ Features

### Public
- แสดงรายการบทความทั้งหมด (เฉพาะที่ Publish แล้ว) พร้อม Pagination (10 รายการ/หน้า)
- ค้นหาบทความจากชื่อเรื่อง (partial matching)
- หน้าบทความแบบ full detail พร้อม Image Slider (สูงสุด 6 รูป) และ View Count
- ระบบ Comment ที่ validate เฉพาะภาษาไทย ตัวเลข และ `/` เท่านั้น
- Comment ใหม่จะอยู่ในสถานะ PENDING รอการอนุมัติจาก Admin ก่อนแสดงผล

### Admin Panel (ต้อง Login)
- จัดการบทความ: Create, Read, Update, Delete
- Publish/Unpublish บทความ
- แก้ไข Slug
- อัปโหลด Cover Image และ Additional Images (สูงสุด 6 รูป) ผ่าน Cloudinary
- Moderate Comment: อนุมัติ/ปฏิเสธ (รองรับการสลับสถานะได้อิสระ)
- ระบบ Authentication ด้วย JWT

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.x | React Framework (App Router) |
| TypeScript | ^5.7.3 | Type Safety |
| shadcn/ui | CLI v4 | UI Component Library (New York style) |
| Tailwind CSS | v4 | Styling |
| TanStack Query | v5.101.0 | Server State Management |
| axios | 1.18.0 | HTTP Client |
| Zod | 4.4.3 | Schema Validation |
| React Hook Form | v7 | Form Management |
| @hookform/resolvers | 5.4.0 | Zod + RHF Integration |
| js-cookie | 3.0.8 | Cookie Management (Auth Token) |
| next-themes | latest | Dark/Light Mode |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| NestJS | 11.1.27 | Node.js Framework |
| TypeScript | ^5.7.3 | Type Safety |
| Prisma ORM | 7.8.0 | Database ORM |
| PostgreSQL | — | Relational Database |
| JWT + Passport | — | Authentication |
| bcrypt | ^6.0.0 | Password Hashing |
| Cloudinary SDK | ^2.10.0 | Image Storage |
| Multer | ^2.1.1 | File Upload Middleware |
| class-validator | ^0.15.1 | DTO Validation |
| @nestjs/swagger | ^11.4.4 | API Documentation |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend Hosting |
| Railway | Backend Hosting |
| Neon | PostgreSQL (Production) |
| Cloudinary | Image Storage |
| Docker | PostgreSQL (Local Development) |

---

## 📁 โครงสร้างโปรเจกต์

```
repo/
├── apps/
│   ├── frontend/          # Next.js App
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (public)/     # Public pages (/blogs, /blogs/[slug])
│   │   │   │   └── admin/        # Admin pages (login, blogs, comments)
│   │   │   ├── components/
│   │   │   ├── hooks/            # TanStack Query custom hooks
│   │   │   ├── lib/              # axios, auth-token, validations
│   │   │   └── types/            # TypeScript interfaces
│   │   └── package.json
│   │
│   └── backend/           # NestJS App
│       ├── src/
│       │   ├── auth/             # JWT Authentication
│       │   ├── blog/             # Blog CRUD + Publish
│       │   ├── comment/          # Comment + Moderation
│       │   ├── cloudinary/       # Image Upload Service
│       │   └── prisma/           # Prisma Service (Global)
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       └── package.json
│
├── docker-compose.yml     # PostgreSQL for local development (no need)
└── README.md
```

---

## 🗄️ Database Schema

```prisma
model Admin {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Blog {
  id            Int        @id @default(autoincrement())
  title         String
  slug          String     @unique
  excerpt       String
  content       String
  coverImageUrl String
  viewCount     Int        @default(0)
  status        BlogStatus @default(UNPUBLISHED)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  images        BlogImage[]
  comments      Comment[]
}

model BlogImage {
  id        Int      @id @default(autoincrement())
  imageUrl  String
  blogId    Int
  blog      Blog     @relation(fields: [blogId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model Comment {
  id         Int           @id @default(autoincrement())
  authorName String
  content    String
  status     CommentStatus @default(PENDING)
  createdAt  DateTime      @default(now())
  blogId     Int
  blog       Blog          @relation(fields: [blogId], references: [id], onDelete: Cascade)
}

enum BlogStatus    { PUBLISHED UNPUBLISHED }
enum CommentStatus { PENDING APPROVED REJECTED }
```

---

## 🚀 การติดตั้งและรัน (Local Development)

### Prerequisites
- Node.js >= 22.12.0
- Docker Desktop
- Cloudinary Account

### 1. Clone Repository

```bash
git clone <repository-url>
cd blog-management-system
```

### 2. ตั้งค่า Backend

```bash
cd apps/backend
npm install
```

สร้างไฟล์ `.env`:

```env
DATABASE_URL="postgresql://bloguser:blogpassword@localhost:5432/blogdb?schema=public"
JWT_SECRET="your-random-secret-here"
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
PORT=3001
```

Generate JWT Secret:
สามารถใช้ JWT Generator หรือ openssl ในการ generate secret ได้ครับ

### 3. ตั้งค่า Frontend

```bash
cd apps/frontend
npm install
```

สร้างไฟล์ `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:3000
```

> ⚠️ **Windows Users:** ใช้ `127.0.0.1` แทน `localhost` เพื่อป้องกันปัญหา IPv6 resolution delay

### 4. รัน PostgreSQL ด้วย Docker

```bash
# ที่ root ของ repo
docker compose up -d
```

### 5. รัน Database Migration และ Seed

```bash
cd apps/backend
npx prisma migrate dev
SEED_ADMIN_USERNAME=admin SEED_ADMIN_PASSWORD=YourPassword123 npx prisma db seed
```

Seed จะสร้าง:
- Admin account 1 คน
- ตัวอย่างบทความ 25 บทความ (20 Published, 5 Unpublished)

### 6. รัน Development Servers

```bash
# Terminal 1 — Backend
cd apps/backend
npm run start:dev

# Terminal 2 — Frontend
cd apps/frontend
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://127.0.0.1:3001 |
| Swagger Docs | http://127.0.0.1:3001/api/docs |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Admin Login |

### Public Blogs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/blogs` | รายการบทความ (รองรับ `?search=` และ `?page=`) |
| GET | `/blogs/:slug` | รายละเอียดบทความ + increment view count |
| POST | `/blogs/:slug/comments` | ส่ง Comment (validate ภาษาไทย) |

### Admin Blogs (ต้อง JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/blogs` | รายการบทความทั้งหมด |
| GET | `/admin/blogs/:id` | รายละเอียดบทความ |
| POST | `/admin/blogs` | สร้างบทความใหม่ |
| PATCH | `/admin/blogs/:id` | แก้ไขเนื้อหา |
| PATCH | `/admin/blogs/:id/slug` | แก้ไข Slug |
| PATCH | `/admin/blogs/:id/publish` | Publish บทความ |
| PATCH | `/admin/blogs/:id/unpublish` | Unpublish บทความ |
| DELETE | `/admin/blogs/:id` | ลบบทความ |
| POST | `/admin/blogs/:id/cover-image` | อัปโหลด Cover Image |
| POST | `/admin/blogs/:id/images` | เพิ่ม Additional Image |
| DELETE | `/admin/blogs/:id/images/:imageId` | ลบ Additional Image |

### Admin Comments (ต้อง JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/comments` | รายการ Comment (รองรับ `?status=`) |
| PATCH | `/admin/comments/:id/approve` | อนุมัติ Comment |
| PATCH | `/admin/comments/:id/reject` | ปฏิเสธ Comment |

---

## 🔐 Security Notes

- JWT Token เก็บใน Cookie (ไม่ใช่ localStorage) เพื่อความปลอดภัย[^1]
- Password ถูก Hash ด้วย bcrypt (salt rounds: 10)
- Comment Validation ใช้ Regex เดียวกันทั้ง Frontend และ Backend
- CORS ถูก configure ให้รับแค่จาก `FRONTEND_URL` ที่กำหนด
- Swagger UI ถูกปิดอัตโนมัติเมื่อ `NODE_ENV=production`

[^1]: ใช้แค่ JWT 



---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | `https://your-app.vercel.app` |
| Backend | Railway | `https://your-backend.up.railway.app` |
| Database | Neon PostgreSQL | — |
| Images | Cloudinary | — |

### Environment Variables (Production)

**Railway (Backend):**
```env
NODE_ENV=production
DATABASE_URL=<neon-connection-string>
JWT_SECRET=<random-secret>
JWT_EXPIRES_IN=86400
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
FRONTEND_URL=<vercel-url>
```

**Vercel (Frontend):**
```env
NEXT_PUBLIC_API_URL=<railway-backend-url>
```

---

## 💡 Key Design Decisions

1. **Server Component สำหรับ Public Pages** — หน้าบทความ public ใช้ Next.js Server Component fetch ข้อมูลตรงจาก backend เพื่อ SEO
2. **Client Component สำหรับ Admin Panel** — ใช้ TanStack Query จัดการ cache และ auto-refetch หลัง mutation
3. **Two-phase Blog Creation** — แก้ปัญหา `coverImageUrl` ต้องการ blog ID ก่อนโดยสร้าง blog ด้วย placeholder แล้วอัปโหลดรูปทันที
4. **Thai-only Comment Validation** — Regex ที่ทดสอบครอบคลุม 21+ edge cases รวมถึงการตัด `฿` (บาท) ออกเพราะไม่ใช่ตัวอักษรไทยจริง
5. **`onDelete: Cascade`** — ลบ Blog แล้ว BlogImage และ Comment จะถูกลบตามโดยอัตโนมัติ

---

## 👤 Author

**ภุมรินทร์ โรจนมาน**

พัฒนาเพื่อ Technical Assignment ของ **Metier Thailand**
