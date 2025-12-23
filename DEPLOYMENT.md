# Vercel Deployment Kılavuzu

Bu proje Vercel'e deploy edilmek için hazırlanmıştır.

## Hızlı Başlangıç

### 1. Vercel Hesabı Oluşturun

1. https://vercel.com adresine gidin
2. "Sign Up" → GitHub ile giriş yapın

### 2. Vercel Postgres Database Oluşturun

1. Vercel Dashboard → Storage → Create Database
2. **Postgres** seçin
3. Database adını girin: `budgettracker`
4. Region seçin (örneğin: `Europe` - Frankfurt)
5. "Create" butonuna tıklayın

### 3. Database Connection String'i Alma ve Ayarlama

#### 🖥️ Local Development İçin (.env.local)

**Adım 1:** Vercel Dashboard'da database'i oluşturduktan sonra:
- Storage → Database'inize tıklayın
- **.env.local** tab'ına gidin
- Veya **Settings** → **Environment Variables** bölümüne gidin

**Adım 2:** Connection String'i kopyalayın
- `DATABASE_URL` environment variable'ını bulun
- Value'yu kopyalayın (şuna benzer: `postgres://default:xxx@xxx.aws.neon.tech:5432/verceldb?sslmode=require`)

**Adım 3:** Local'de `.env.local` dosyası oluşturun
```bash
# BudgetTracker-vercel klasöründe .env.local dosyası oluşturun
```

**Adım 4:** `.env.local` dosyasına ekleyin:
```env
DATABASE_URL="postgresql://default:xxx@xxx.aws.neon.tech:5432/verceldb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
```

**Önemli:** `.env.local` dosyası `.gitignore`'da olduğu için Git'e push edilmeyecektir.

#### ☁️ Production (Vercel) İçin

Vercel, database oluşturduktan sonra **otomatik olarak** `DATABASE_URL` environment variable'ını projenize ekler. Ek bir işlem gerekmez!

Eğer manuel eklemek isterseniz:
1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**
2. **Add New** butonuna tıklayın
3. **Name**: `DATABASE_URL`
4. **Value**: Connection string'i yapıştırın
5. **Environment**: Production, Preview, Development seçin
6. **Save** butonuna tıklayın

### 4. GitHub Repository'yi Bağlayın

1. Vercel Dashboard → Add New... → Project
2. GitHub repository'nizi seçin: `gokhandemirci1/sunum`
3. Root Directory: Boş bırakın (proje root'ta ise) veya `BudgetTracker-vercel` yazın (alt klasörde ise)
4. Framework Preset: **Next.js** (otomatik algılanacak)

### 5. Environment Variables (Vercel Dashboard)

Vercel dashboard'da "Environment Variables" bölümünde şunları ekleyin:

#### DATABASE_URL
- **✅ Otomatik:** Vercel Postgres oluşturulduktan sonra otomatik eklenir
- Eğer yoksa: Storage → Database → `.env.local` tab'dan veya Settings'ten alın

#### NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Production Value**: `https://your-app.vercel.app` (deploy'dan sonra gerçek URL)
- **Preview Value**: Otomatik olarak `VERCEL_URL` environment variable'ı kullanılır (ayrıca eklemenize gerek yok)
- **Development Value**: `http://localhost:3000`
- **Environment**: Production (production URL), Preview (otomatik), Development (http://localhost:3000)

**Not:** Preview environment'lar için Vercel otomatik olarak `VERCEL_URL` sağlar. Bu yüzden preview için eklemenize gerek yok.

#### NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: Random bir secret key oluşturun:
  ```bash
  openssl rand -base64 32
  ```
  veya online: https://generate-secret.vercel.app/32
- **Environment**: Production, Preview, Development (hepsinde aynı kullanabilirsiniz)

**Örnek Secret:**
```
aBcD1234eFgH5678iJkL9012mNoP3456qRsT7890uVwX=
```

### 6. Build Settings

Vercel otomatik olarak algılayacak ama kontrol edin:

- **Build Command**: `prisma generate && prisma migrate deploy && next build`
- **Output Directory**: `.next` (otomatik)
- **Install Command**: `npm install`

Veya `vercel.json` dosyası otomatik olarak kullanılacaktır.

### 7. Deploy

1. "Deploy" butonuna tıklayın
2. Build işlemi başlar (birkaç dakika sürebilir)
3. İlk deploy'da Prisma migration'ları otomatik çalışacaktır
4. Deploy tamamlandığında URL alırsınız: `https://your-app.vercel.app`

## 📝 Local Development Setup

### 1. Repository'yi Clone Edin
```bash
git clone https://github.com/gokhandemirci1/sunum.git
cd sunum
```

### 2. Dependencies Yükleyin
```bash
npm install
```

### 3. Environment Variables

`.env.local` dosyası oluşturun (yukarıdaki adımları takip edin):
```env
DATABASE_URL="postgresql://default:xxx@xxx.aws.neon.tech:5432/verceldb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="aBcD1234eFgH5678iJkL9012mNoP3456qRsT7890uVwX="
```

### 4. Prisma Setup
```bash
# Prisma Client'ı generate edin
npx prisma generate

# Database schema'yı push edin (ilk kurulum için)
npx prisma db push
```

### 5. Development Server
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## İlk Kullanım

1. Uygulamanızı açın
2. "Kayıt Ol" butonuna tıklayın
3. Kullanıcı adı ve şifre oluşturun
4. Giriş yapın
5. İlk kategoriyi oluşturun
6. İlk harcamanızı ekleyin

## Sorun Giderme

### Database Connection Hatası

**Local Development:**
- `.env.local` dosyasının doğru konumda olduğundan emin olun (`BudgetTracker-vercel/.env.local`)
- Connection string'in tam olarak kopyalandığından emin olun (tırnak işaretleri dahil)
- Database'in aktif olduğunu kontrol edin (Vercel Dashboard → Storage)

**Production:**
- Vercel Dashboard → Project → Settings → Environment Variables
- `DATABASE_URL`'in doğru olduğundan emin olun
- Database'in aynı Vercel projesine bağlı olduğundan emin olun
- Database'in aktif olduğunu kontrol edin

### Prisma Migration Hatası

Vercel build loglarını kontrol edin. Eğer migration hatası alırsanız:

1. Local'de migration oluşturun:
   ```bash
   npx prisma migrate dev --name init
   ```

2. Migration dosyalarını commit edin ve push edin

3. Vercel tekrar deploy edecektir

**Alternatif:** İlk kurulum için `prisma db push` kullanabilirsiniz (production'da `prisma migrate deploy` kullanılır).

### NextAuth Hatası

- `NEXTAUTH_SECRET`'in tüm environment'larda tanımlı olduğundan emin olun
- `NEXTAUTH_URL`'in doğru olduğundan emin olun
- Production'da `https://` kullanıldığından emin olun

### Build Hatası

- Node.js versiyonu: Vercel otomatik olarak 18.x kullanır
- `package.json`'da tüm dependencies'lerin doğru olduğundan emin olun
- Build loglarını kontrol edin: Vercel Dashboard → Deployments → Build Logs

## Production Checklist

- ✅ Database bağlantısı çalışıyor (`.env.local` veya Vercel Environment Variables)
- ✅ Environment variables ayarlandı
- ✅ Prisma migration'ları çalıştı
- ✅ Authentication çalışıyor
- ✅ API endpoints çalışıyor
- ✅ Sayfalar yükleniyor
- ✅ SSL sertifikası aktif (Vercel otomatik sağlar)

## Otomatik Deploy

Her GitHub push'unda Vercel otomatik olarak yeni bir deploy oluşturacaktır.

## Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Custom domain ekleyin
3. DNS ayarlarını yapın
4. SSL otomatik olarak sağlanacaktır

## Monitoring

Vercel Dashboard'da:
- Deployment history
- Analytics
- Logs
- Function logs

görüntüleyebilirsiniz.
