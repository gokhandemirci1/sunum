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
6. Database oluşturulduktan sonra `.env.local` dosyasına connection string ekleyebilirsiniz

### 3. GitHub Repository'yi Bağlayın

1. Vercel Dashboard → Add New... → Project
2. GitHub repository'nizi seçin: `gokhandemirci1/group14`
3. Root Directory: `BudgetTracker-vercel` seçin (veya projeyi direkt root'ta push edin)
4. Framework Preset: **Next.js** (otomatik algılanacak)

### 4. Environment Variables

Vercel dashboard'da "Environment Variables" bölümünde şunları ekleyin:

#### DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Vercel Postgres'den otomatik olarak eklenecektir (veya manuel ekleyebilirsiniz)
- **Environment**: Production, Preview, Development

#### NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: Production için `https://your-app.vercel.app`, Preview için otomatik `VERCEL_URL` kullanılır
- **Environment**: Production (production URL), Preview (otomatik), Development (http://localhost:3000)

#### NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: Random bir secret key oluşturun:
  ```bash
  openssl rand -base64 32
  ```
  veya online: https://generate-secret.vercel.app/32
- **Environment**: Production, Preview, Development

### 5. Build Settings

Vercel otomatik olarak algılayacak ama kontrol edin:

- **Build Command**: `prisma generate && prisma migrate deploy && next build`
- **Output Directory**: `.next` (otomatik)
- **Install Command**: `npm install`

Veya `vercel.json` dosyası otomatik olarak kullanılacaktır.

### 6. Deploy

1. "Deploy" butonuna tıklayın
2. Build işlemi başlar (birkaç dakika sürebilir)
3. İlk deploy'da Prisma migration'ları otomatik çalışacaktır
4. Deploy tamamlandığında URL alırsınız: `https://your-app.vercel.app`

## İlk Kullanım

1. Uygulamanızı açın
2. "Kayıt Ol" butonuna tıklayın
3. Kullanıcı adı ve şifre oluşturun
4. Giriş yapın
5. İlk kategoriyi oluşturun
6. İlk harcamanızı ekleyin

## Sorun Giderme

### Database Connection Hatası

- `DATABASE_URL` environment variable'ının doğru olduğundan emin olun
- Vercel Postgres'in aktif olduğunu kontrol edin
- Database'in aynı region'da olduğundan emin olun

### Prisma Migration Hatası

Vercel build loglarını kontrol edin. Eğer migration hatası alırsanız:

1. Local'de migration oluşturun:
   ```bash
   npx prisma migrate dev --name init
   ```

2. Migration dosyalarını commit edin

3. Vercel tekrar deploy edecektir

### NextAuth Hatası

- `NEXTAUTH_SECRET`'in tüm environment'larda tanımlı olduğundan emin olun
- `NEXTAUTH_URL`'in doğru olduğundan emin olun

### Build Hatası

- Node.js versiyonu: Vercel otomatik olarak 18.x kullanır
- `package.json`'da tüm dependencies'lerin doğru olduğundan emin olun

## Production Checklist

- ✅ Database bağlantısı çalışıyor
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

