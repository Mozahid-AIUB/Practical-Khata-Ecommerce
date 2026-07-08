# Deployment Guide — Practical Khata (১০০% ফ্রি, শুধু Render + Vercel)

| অংশ | কোথায় (ফ্রি) |
|---|---|
| **Frontend** (Next.js) | **Vercel** Hobby plan — ফ্রি |
| **Backend** (Laravel API + Admin) | **Render.com** Free Web Service |
| **Database** | **Render.com** Free PostgreSQL |
| **Redis** (cache/queue) | **Render.com** Free Redis (Key Value) |

সব ব্যাকএন্ড জিনিস (API, DB, Redis) একই Render অ্যাকাউন্টে — আলাদা আলাদা প্ল্যাটফর্মে সাইন আপ করতে হবে না। ডোমেইন কেনার দরকার নেই, ফ্রি সাবডোমেইন (`yourapp.onrender.com`, `yourproject.vercel.app`) দিয়েই কাজ চলবে।

**সতর্কতা:** Render-এর ফ্রি Web Service ১৫ মিনিট নিষ্ক্রিয় থাকলে ঘুমিয়ে পড়ে, পরের রিকোয়েস্টে জাগতে ~৩০ সেকেন্ড লাগে। ফ্রি PostgreSQL ৯০ দিন পর মুছে যায় (Render নোটিফাই করে) — তখন নতুন ফ্রি ডাটাবেস বানিয়ে migrate/seed আবার চালাতে হবে। ছোট/personal প্রজেক্টের জন্য এগুলো কোনো সমস্যা না।

---

## ধাপ ১: Render-এ PostgreSQL বানান

1. [render.com](https://render.com) এ GitHub দিয়ে সাইন আপ করুন
2. **New → PostgreSQL**
3. নাম দিন (যেমন `practical-khata-db`), Region সিলেক্ট করুন, **Instance Type: Free**
4. তৈরি হলে **Connect** ট্যাব থেকে *Internal Database URL* কপি করে রাখুন (একই Render অ্যাকাউন্টের সার্ভিস থেকে কানেক্ট করলে এটাই ব্যবহার হবে, দ্রুত ও ফ্রি ব্যান্ডউইথ)

---

## ধাপ ২: Render-এ Redis (Key Value) বানান

1. **New → Key Value** (Render-এ Redis-কে এখন "Key Value" বলে)
2. নাম দিন, Region **একই রাখুন যেটা DB-তে দিয়েছেন** (কাছাকাছি হলে দ্রুত), **Instance Type: Free**
3. তৈরি হলে **Connect** থেকে Internal URL কপি করে রাখুন

---

## ধাপ ৩: ব্যাকএন্ড (Laravel) Web Service বানান

1. **New → Web Service** → এই GitHub রিপো সিলেক্ট করুন
2. সেটিংস:
   - **Root Directory:** `backend`
   - **Runtime:** Docker
   - **Region:** DB/Redis-এর সাথে একই
   - **Instance Type:** Free
3. **Environment** ট্যাবে ভ্যারিয়েবল বসান (Render-এর PostgreSQL/Key Value থেকে পাওয়া Internal URL থেকে host/port/user/pass আলাদা করে বসাতে হবে, অথবা `DATABASE_URL` সরাসরি ব্যবহার করা যায়):
   ```
   APP_NAME=Practical Khata
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=                      # ধাপ ৪-এ জেনারেট করে বসাবেন
   APP_URL=https://your-backend.onrender.com

   DB_CONNECTION=pgsql
   DATABASE_URL=<Render PostgreSQL Internal Database URL>

   REDIS_URL=<Render Key Value Internal URL>

   SESSION_DRIVER=database
   CACHE_STORE=redis
   QUEUE_CONNECTION=redis

   FRONTEND_URL=https://your-frontend.vercel.app
   SANCTUM_STATEFUL_DOMAINS=your-frontend.vercel.app
   ```
4. **Deploy** চাপুন — প্রথম বিল্ডে কয়েক মিনিট লাগবে

---

## ধাপ ৪: APP_KEY জেনারেট করুন

লোকাল মেশিনে (Docker চালু থাকা অবস্থায়):
```bash
cd backend
docker compose exec app php artisan key:generate --show
```
যে key আসবে সেটা Render-এর `APP_KEY` ভ্যারিয়েবলে বসিয়ে আবার Deploy করুন।

---

## ধাপ ৫: Database migrate + seed করুন

Render Web Service পেজে **Shell** ট্যাব থেকে (ফ্রি প্ল্যানেও আছে) ব্রাউজার থেকেই কমান্ড চালানো যায়:
```bash
php artisan migrate --force
php artisan storage:link
php artisan db:seed --force
```

Admin user বানাতে:
```bash
php artisan tinker --execute="\App\Models\User::create(['name' => 'Admin', 'phone' => '01700000000', 'email' => 'admin@example.com', 'password' => bcrypt('আপনার-পাসওয়ার্ড'), 'role' => 'admin']);"
```

Admin panel: `https://your-backend.onrender.com/admin`

---

## ধাপ ৬: ফ্রন্টএন্ড (Next.js) — Vercel এ ফ্রি হোস্ট

1. [vercel.com](https://vercel.com) এ GitHub দিয়ে সাইন আপ করুন
2. **Add New → Project** → এই রিপো সিলেক্ট করুন
3. **Root Directory** ফাঁকা রাখুন (frontend রুটেই আছে)
4. **Environment Variables**-এ যোগ করুন:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
   ```
5. **Deploy** চাপুন — ২-৩ মিনিটে লাইভ, URL পাবেন `your-project.vercel.app`

---

## Checklist — লাইভ করার আগে

- [ ] Backend-এ `APP_ENV=production`, `APP_DEBUG=false`
- [ ] `APP_KEY` বসানো ও redeploy করা হয়েছে
- [ ] Migrate + seed সফল হয়েছে (Shell-এ error নেই)
- [ ] Admin user বানিয়ে `/admin`-এ লগইন টেস্ট করা হয়েছে
- [ ] `FRONTEND_URL` ও `SANCTUM_STATEFUL_DOMAINS`-এ আসল Vercel URL বসানো (localhost না)
- [ ] Frontend-এর `NEXT_PUBLIC_API_URL` আসল Render backend URL-এ পয়েন্ট করছে
- [ ] হোমপেজ, শপ পেজ, cart, admin panel — ব্রাউজারে সরাসরি টেস্ট করা

---

## সংক্ষেপে

**সব একজায়গায়:** Render-এ backend + DB + Redis, Vercel-এ frontend — মাত্র দুটো প্ল্যাটফর্মে সাইন আপ, সবকিছু ফ্রি টায়ারে, ডোমেইন কেনা লাগে না। GitHub push করলেই দুটোই auto-redeploy হয়। ট্রাফিক বাড়লে পরে paid plan-এ upgrade করা যাবে, কোনো কোড change ছাড়াই।
