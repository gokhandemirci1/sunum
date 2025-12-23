# BudgetTracker - Vercel Versiyonu

Bu proje, ASP.NET Core MVC uygulamasının Next.js/React versiyonudur. Vercel'e deploy edilebilir.

## Teknolojiler

- **Next.js 14** (App Router)
- **TypeScript**
- **NextAuth.js** (Authentication)
- **Prisma** (Database ORM)
- **Vercel Postgres** (Database)
- **Chart.js** (Grafikler)
- **Bootstrap 5** (UI Framework)

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Environment Variables

`.env.local` dosyası oluşturun:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/budgettracker"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

`NEXTAUTH_SECRET` için:
```bash
openssl rand -base64 32
```

### 3. Database Setup

Prisma migration çalıştırın:

```bash
npx prisma generate
npx prisma db push
```

### 4. Development Server

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Vercel'e Deploy

### 1. Vercel Hesabı

- https://vercel.com adresine gidin
- GitHub hesabınızla giriş yapın

### 2. Yeni Proje

- "New Project" butonuna tıklayın
- GitHub repository'nizi seçin
- Framework Preset: **Next.js** (otomatik algılanacak)

### 3. Environment Variables

Vercel dashboard'da şu environment variable'ları ekleyin:

- `DATABASE_URL`: Vercel Postgres connection string
- `NEXTAUTH_URL`: Production URL (otomatik olarak `VERCEL_URL` kullanılır)
- `NEXTAUTH_SECRET`: Generate edilmiş secret key

### 4. Vercel Postgres

Vercel dashboard'dan:
- Storage → Create Database → Postgres
- Database oluşturulduktan sonra `DATABASE_URL` otomatik olarak environment variable olarak eklenecektir
- Prisma schema'yı deploy etmek için Vercel'in build sırasında otomatik olarak `prisma generate` ve `prisma migrate deploy` çalışacaktır

### 5. Deploy

"Deploy" butonuna tıklayın. Vercel otomatik olarak:
- Dependencies'leri yükler
- Prisma client'ı generate eder
- Database migration'ları çalıştırır
- Next.js uygulamasını build eder
- Deploy eder

## Özellikler

- ✅ Kullanıcı kaydı ve girişi
- ✅ Kategori yönetimi (CRUD)
- ✅ Harcama yönetimi (CRUD)
- ✅ Dashboard ile istatistikler
- ✅ Haftalık, aylık ve 6 aylık grafikler
- ✅ Kategori bazında harcama analizi
- ✅ Responsive tasarım

## Proje Yapısı

```
BudgetTracker-vercel/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── categories/      # Category endpoints
│   │   ├── expenses/        # Expense endpoints
│   │   └── dashboard/       # Dashboard endpoints
│   ├── account/             # Login/Register pages
│   ├── dashboard/           # Dashboard page
│   ├── expenses/            # Expense pages
│   ├── categories/          # Category pages
│   └── layout.tsx           # Root layout
├── components/              # React components
├── lib/                     # Utility functions
├── prisma/                  # Prisma schema
└── types/                   # TypeScript types
```

## Notlar

- SQLite yerine PostgreSQL kullanılmıştır (Vercel Postgres)
- Cookie authentication yerine JWT tabanlı NextAuth kullanılmıştır
- Aynı arayüz ve işlevsellik korunmuştur
- Bootstrap 5 aynı şekilde kullanılmıştır
- Chart.js ile aynı grafikler gösterilmektedir

