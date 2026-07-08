# Practical Khata — Backend

Laravel API + Filament admin panel for the [Practical Khata](../) storefront.
See [`docs/backend-architecture.md`](../docs/backend-architecture.md) in the
repo root for the full architecture plan. Implemented so far: phase 1
(categories, products, product images + admin CRUD), phase 2 (cart), and
phase 3 (checkout, orders, payments, order tracking).

## Setup — Option A: Docker (recommended if PHP/Composer aren't installed)

Requires only [Docker Desktop](https://www.docker.com/products/docker-desktop/).
This runs PHP 8.3, MySQL 8, and Redis for you — nothing else to install.

```bash
cd backend
docker compose up -d --build

# first run only:
docker compose exec app cp .env.example .env
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
docker compose exec app php artisan storage:link
docker compose exec app php artisan db:seed   # loads the same catalogue as lib/mock-data.ts
```

API is now live at `http://localhost:8000` — the frontend's `NEXT_PUBLIC_API_URL`
already defaults to `http://localhost:8000/api/v1`, so no frontend config needed.

Common commands:

```bash
docker compose logs -f app          # tail the Laravel log
docker compose exec app php artisan tinker
docker compose exec app php artisan migrate:fresh --seed   # reset the DB
docker compose down                 # stop everything
docker compose down -v              # stop and wipe the MySQL volume too
```

## Setup — Option B: PHP installed locally

- PHP 8.2+
- Composer
- MySQL 8
- Redis (queue/cache — optional for phase 1, required from phase 4 onward)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# create the `practical_khata` database in MySQL first, then:
php artisan migrate
php artisan storage:link
php artisan db:seed          # loads the same catalogue as the frontend's lib/mock-data.ts

php artisan serve            # http://localhost:8000
```

Create an admin user to log into the panel at `http://localhost:8000/admin`
(prefix with `docker compose exec app` instead of running `php` directly if
you're on the Docker setup):

```bash
php artisan tinker
>>> \App\Models\User::create(['name' => 'Admin', 'phone' => '01700000000', 'email' => 'admin@example.com', 'password' => bcrypt('password'), 'role' => 'admin']);
```

## What's implemented

**Phase 1 — catalogue**

- `categories`, `products`, `product_images` migrations
- `Category`, `Product`, `ProductImage`, `User` Eloquent models
- Filament admin resources for Category and Product (with an image relation
  manager for uploading cover photos)
- Public read API under `/api/v1`:
  - `GET /api/v1/categories`
  - `GET /api/v1/categories/{slug}/products`
  - `GET /api/v1/products?subject=&level=&paper=&category=&best_seller=`
  - `GET /api/v1/products/{slug}`
  - `GET /api/v1/products/top-sellers`
- `CatalogueSeeder` — seeds the exact same products currently hardcoded in
  the frontend's `lib/mock-data.ts`, so nothing in the storefront's catalogue
  changes when it switches from static data to this API.

**Phase 2 — cart**

- `carts`, `cart_items` migrations (guest carts identified by a
  `cart_session` cookie; logged-in users get a cart tied to their `user_id`)
- `Cart`, `CartItem` Eloquent models — `Cart::addItem()` snapshots the
  current `price_min` onto the cart item so later price changes don't
  retroactively change what's already in someone's cart
- `GET /api/v1/cart` — fetch the current cart (sets the `cart_session`
  cookie on first call for guests)
- `POST /api/v1/cart/items` — `{product_id, quantity?}`, rejects `sold_out`
  products with a 422
- `PATCH /api/v1/cart/items/{item}` — `{quantity}`
- `DELETE /api/v1/cart/items/{item}` — remove a line item

Frontend integration note: the Next.js app must call these with
`credentials: 'include'` so the `cart_session` cookie round-trips.

**Phase 3 — checkout, orders, payments**

- `orders`, `order_items`, `payments`, `coupons`, `order_number_sequences`
  migrations
- `Order`, `OrderItem`, `Payment`, `Coupon` Eloquent models
- `Order::generateOrderNumber()` — human-friendly `PK-YYYYMMDD-0001` numbers,
  race-safe under concurrent checkouts via a locked per-day sequence row
- `App\Actions\PlaceOrderFromCart` — the checkout transaction: re-validates
  `sold_out` on every cart item, snapshots product name/price onto
  `order_items`, applies a coupon if valid, creates the initial `Payment`
  row, and empties the cart. Never trusts client-sent prices.
- `POST /api/v1/orders` — checkout. Body:
  ```json
  {
    "cart_id": 1,
    "payment_method": "bkash",
    "shipping": { "name": "", "phone": "", "district": "", "upazila": "", "address": "" },
    "customer_note": "",
    "coupon_code": null,
    "delivery_fee": 0,
    "payment": { "transaction_id": "8N7XXXXX", "sender_number": "017XXXXXXXX" }
  }
  ```
  `payment.transaction_id` is required when `payment_method` is
  `bkash`/`nagad`/`rocket` (not required for `cod`).
- `GET /api/v1/orders/track?order_number=&phone=` — public order tracking,
  no login required (matches the storefront's "অর্ডার ট্র্যাক" page)
- Filament `OrderResource` — list/filter by status & payment_status, edit
  status/payment_status/admin_note, with relation managers for line items
  (read-only) and payments (with Verify/Reject actions — verifying flips
  the order's `payment_status` to `paid`)

## Not yet implemented (later phases, see docs/backend-architecture.md)

- Custom order requests (file upload)
- Sanctum auth for customer accounts (register/login, `/me/orders`, `/me/addresses`)
- Coupons admin CRUD, contact messages, WhatsApp leads, admin dashboard summary
- Order/payment notifications (SMS/WhatsApp/email jobs)
