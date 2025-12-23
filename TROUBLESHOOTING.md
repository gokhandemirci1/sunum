# Sorun Giderme Kılavuzu

## "Application error: a server-side exception has occurred" Hatası

Bu hata genellikle şu nedenlerden kaynaklanır:

### 1. Database Connection Sorunu

**Kontrol:**
- Vercel Dashboard → Project → Settings → Environment Variables
- `DATABASE_URL` environment variable'ının doğru olduğundan emin olun
- Database'in aktif olduğunu kontrol edin (Vercel Dashboard → Storage)

**Test:**
- `/api/health` endpoint'ini açın: `https://your-app.vercel.app/api/health`
- Database bağlantısını kontrol eder

**Çözüm:**
```bash
# Local'de test edin:
DATABASE_URL="your-connection-string" npm run dev
```

### 2. NEXTAUTH_SECRET Eksik

**Kontrol:**
- Vercel Dashboard → Environment Variables
- `NEXTAUTH_SECRET` tanımlı olmalı

**Çözüm:**
- Yeni bir secret oluşturun: https://generate-secret.vercel.app/32
- Environment variable olarak ekleyin

### 3. Prisma Client Generate Edilmemiş

**Kontrol:**
- Build loglarında `prisma generate` hatası var mı?

**Çözüm:**
- `vercel.json`'da build command doğru olmalı:
  ```json
  {
    "buildCommand": "prisma generate && prisma db push && next build"
  }
  ```

### 4. Database Schema Push Edilmemiş

**Kontrol:**
- Database tabloları oluşturulmuş mu?

**Çözüm:**
- İlk deployment için `prisma db push` kullanılır (migration yerine)
- Migration dosyaları varsa `prisma migrate deploy` kullanılabilir

### 5. Environment Variables Eksik

**Gerekli Environment Variables:**
- `DATABASE_URL` (Vercel Postgres otomatik ekler)
- `NEXTAUTH_SECRET` (Manuel eklemelisiniz)
- `NEXTAUTH_URL` (Production için otomatik)

**Kontrol:**
- Vercel Dashboard → Settings → Environment Variables
- Tüm environment'lar için (Production, Preview, Development) eklenmiş olmalı

## Debug Adımları

### 1. Health Check Endpoint

```bash
curl https://your-app.vercel.app/api/health
```

Yanıt:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-01-XX..."
}
```

### 2. Vercel Logları

1. Vercel Dashboard → Project → Deployments
2. Son deployment'a tıklayın
3. "View Function Logs" butonuna tıklayın
4. Hata mesajlarını kontrol edin

### 3. Build Logları

1. Vercel Dashboard → Project → Deployments
2. Son deployment'a tıklayın
3. "Build Logs" sekmesini açın
4. Prisma ve build hatalarını kontrol edin

## Yaygın Hatalar ve Çözümleri

### Error: P1001: Can't reach database server

**Sebep:** Database connection string yanlış veya database kapalı

**Çözüm:**
- Database'in aktif olduğundan emin olun
- Connection string'i kontrol edin
- Database region'ının doğru olduğundan emin olun

### Error: NEXTAUTH_SECRET is not defined

**Sebep:** Environment variable eksik

**Çözüm:**
- Vercel Dashboard → Environment Variables → Add
- `NEXTAUTH_SECRET` ekleyin

### Error: Prisma Client not generated

**Sebep:** Build sırasında `prisma generate` çalışmamış

**Çözüm:**
- `vercel.json` dosyasını kontrol edin
- Build command'de `prisma generate` olmalı

### Error: Table does not exist

**Sebep:** Database schema push edilmemiş

**Çözüm:**
- `prisma db push` çalıştırılmalı (build command'de)
- İlk deployment için `prisma migrate deploy` yerine `prisma db push` kullanın

## Hızlı Fix Checklist

- [ ] `DATABASE_URL` environment variable var mı?
- [ ] `NEXTAUTH_SECRET` environment variable var mı?
- [ ] Database aktif mi? (Vercel Dashboard → Storage)
- [ ] Build loglarında hata var mı?
- [ ] `/api/health` endpoint çalışıyor mu?
- [ ] Prisma client generate edildi mi?
- [ ] Database schema push edildi mi?

## Daha Fazla Yardım

Eğer sorun devam ederse:
1. Vercel Function Logs'u kontrol edin
2. Build Logs'u kontrol edin
3. Health check endpoint'ini test edin
4. Environment variables'ları doğrulayın

