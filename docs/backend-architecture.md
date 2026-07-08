# Practical Khata — Laravel Backend Architecture

Backend blueprint for the existing Next.js storefront (`practical-khata-ecommerce`).
The frontend currently reads static data from `lib/mock-data.ts`; this document
specifies the Laravel API that replaces it.

- **Laravel version:** 11.x
- **Auth:** Laravel Sanctum (SPA token/cookie auth for the Next.js frontend + admin panel)
- **DB:** MySQL 8
- **Queue:** Redis + Laravel Queues (order confirmation, WhatsApp/SMS notifications)
- **Storage:** local disk in dev, S3-compatible (e.g. DigitalOcean Spaces) in prod, for
  cover photos and customer-uploaded index/PDF files

---

## 1. Domain model

The storefront sells **practical notebooks** (khata) per subject/level/paper, plus
bundles and custom/handwritten assignments. Orders are COD-first with bKash/Nagad/
Rocket references, and customers can attach a PDF/index for custom orders.

### Entities

| Entity | Purpose |
|---|---|
| `Category` | SSC Khata / HSC Khata / Full Package & Assignments |
| `Product` | A sellable khata (subject + level + paper variant) or bundle/assignment |
| `ProductImage` | Cover photo(s) per product (real photos, replaces the frontend's static `/assets/covers/*`) |
| `User` | Customer (optional account) and staff/admin |
| `Address` | Shipping address, snapshotted onto orders |
| `Cart` / `CartItem` | Pre-checkout basket, guest or user-owned |
| `Order` / `OrderItem` | Placed order + line items, snapshotted price/name |
| `Payment` | Payment attempt/reference (bKash/Nagad/Rocket/COD) |
| `CustomOrderRequest` | Custom khata order with uploaded index/PDF (from `f3` in mock data) |
| `Coupon` | Discount codes (optional, future) |
| `ContactMessage` | "যোগাযোগ" / contact form submissions |
| `WhatsappLead` | Captured WhatsApp click-throughs / Khata Assistant widget submissions |

---

## 2. Database schema

```
categories
  id                  bigint pk
  name_en             varchar
  name_bn             varchar
  slug                varchar unique
  sort_order          int default 0
  timestamps

products
  id                  bigint pk
  category_id         fk -> categories
  name_en             varchar
  name_bn             varchar
  slug                varchar unique
  subject             enum(physics, chemistry, biology, math, ict, agriculture, bundle, assignment)
  level               enum(ssc, hsc) nullable
  paper               tinyint nullable        -- 1 or 2, null = single-paper subject
  price_min           decimal(10,2)
  price_max           decimal(10,2) nullable
  original_price      decimal(10,2) nullable  -- pre-discount price, drives % badge
  best_seller         boolean default false
  sold_out            boolean default false
  description_en      text nullable
  description_bn      text nullable
  meta                json nullable           -- future-proof: free-form attrs
  timestamps
  soft_deletes

product_images
  id                  bigint pk
  product_id          fk -> products
  disk_path           varchar        -- storage path/URL
  is_primary          boolean default false
  sort_order          int default 0
  timestamps

users
  id                  bigint pk
  name                varchar
  email               varchar unique nullable   -- optional, phone is primary identifier
  phone               varchar unique
  password            varchar nullable          -- guest checkout allowed, password optional
  role                enum(customer, admin, staff) default customer
  email_verified_at    timestamp nullable
  timestamps

addresses
  id                  bigint pk
  user_id             fk -> users nullable      -- null for guest, address lives on order instead
  label               varchar nullable          -- "Home", "School", etc.
  full_name           varchar
  phone               varchar
  district            varchar
  upazila             varchar nullable
  address_line        text
  is_default          boolean default false
  timestamps

carts
  id                  bigint pk
  user_id             fk -> users nullable
  session_token       varchar nullable          -- guest cart identifier (cookie/localStorage id)
  timestamps

cart_items
  id                  bigint pk
  cart_id             fk -> carts
  product_id          fk -> products
  quantity            int default 1
  unit_price          decimal(10,2)             -- snapshotted at add-time
  timestamps

orders
  id                  bigint pk
  order_number         varchar unique            -- human-facing e.g. PK-20260708-0001
  user_id             fk -> users nullable
  status              enum(pending, confirmed, processing, shipped, delivered, cancelled) default pending
  payment_method      enum(cod, bkash, nagad, rocket)
  payment_status      enum(unpaid, partial, paid) default unpaid
  subtotal            decimal(10,2)
  delivery_fee        decimal(10,2) default 0
  discount_total      decimal(10,2) default 0
  grand_total         decimal(10,2)
  coupon_id           fk -> coupons nullable
  shipping_name       varchar         -- snapshotted, not fk-joined to addresses
  shipping_phone      varchar
  shipping_district   varchar
  shipping_upazila    varchar nullable
  shipping_address    text
  customer_note       text nullable
  admin_note          text nullable
  placed_at           timestamp
  timestamps
  soft_deletes

order_items
  id                  bigint pk
  order_id            fk -> orders
  product_id          fk -> products nullable    -- nullable in case product later deleted
  product_name_en     varchar          -- snapshotted
  product_name_bn     varchar
  unit_price          decimal(10,2)
  quantity            int
  line_total          decimal(10,2)
  timestamps

payments
  id                  bigint pk
  order_id            fk -> orders
  method              enum(bkash, nagad, rocket, cod)
  transaction_id      varchar nullable   -- customer-provided TrxID for mobile banking
  sender_number        varchar nullable
  amount              decimal(10,2)
  status              enum(pending, verified, rejected) default pending
  verified_by         fk -> users nullable   -- admin who confirmed
  verified_at         timestamp nullable
  timestamps

custom_order_requests
  id                  bigint pk
  order_id            fk -> orders nullable   -- linked once converted to a real order
  name                varchar
  phone               varchar
  subject_notes       text                    -- what khata/subjects they want
  index_file_path     varchar nullable        -- uploaded index/PDF
  status              enum(new, contacted, quoted, converted, closed) default new
  timestamps

coupons
  id                  bigint pk
  code                varchar unique
  type                enum(percent, fixed)
  value               decimal(10,2)
  max_uses            int nullable
  used_count          int default 0
  expires_at          timestamp nullable
  active              boolean default true
  timestamps

contact_messages
  id                  bigint pk
  name                varchar
  phone               varchar nullable
  email               varchar nullable
  message             text
  status              enum(new, read, replied) default new
  timestamps

whatsapp_leads
  id                  bigint pk
  source              varchar       -- "header_icon", "khata_assistant_widget", etc.
  phone               varchar nullable
  note                text nullable
  timestamps
```

**Indexes:** `products(subject, level, paper)`, `products(category_id)`,
`orders(status)`, `orders(user_id)`, `cart_items(cart_id, product_id)` unique.

---

## 3. Eloquent models (high level)

```
Category      hasMany Product
Product       belongsTo Category, hasMany ProductImage, hasMany OrderItem, hasMany CartItem
              scopes: bestSellers(), bySubject(), byLevel(), inCategory()
              accessor: discount_percent (mirrors frontend's discountPercent())
User          hasMany Address, hasMany Order, hasOne Cart
Cart          belongsTo User (nullable), hasMany CartItem
              methods: addItem(), removeItem(), totalPrice(), toOrder()
Order         belongsTo User (nullable), hasMany OrderItem, hasMany Payment
              belongsTo Coupon (nullable)
              methods: markConfirmed(), markShipped(), recalculateTotals()
Payment       belongsTo Order
CustomOrderRequest  belongsTo Order (nullable)
Coupon        hasMany Order
```

Key business rule ported from `discountPercent()` in `lib/mock-data.ts`:

```php
public function getDiscountPercentAttribute(): ?int
{
    if (!$this->original_price || $this->original_price <= $this->price_min) {
        return null;
    }
    return (int) round((1 - $this->price_min / $this->original_price) * 100);
}
```

---

## 4. API routes (`routes/api.php`)

All prefixed `/api/v1`. JSON:API-ish response shape: `{ data, meta }`.

### Public (no auth)

```
GET    /categories                        list categories (bn/en names)
GET    /categories/{slug}/products        products in a category (mirrors getProductsByCategory)

GET    /products                          list + filter
                                           ?subject=chemistry&level=hsc&paper=1&category=hsc-khata&best_seller=1
GET    /products/{slug}                   product detail
GET    /products/top-sellers               mirrors getTopSellers() (curated ids or best_seller flag)

POST   /cart                              create/fetch guest cart (returns session_token cookie)
GET    /cart                              current cart (by session_token or authed user)
POST   /cart/items                        add item {product_id, quantity}
PATCH  /cart/items/{id}                   update quantity
DELETE /cart/items/{id}                   remove item

POST   /orders                            place order (guest or auth) — see checkout flow below
GET    /orders/track                      ?order_number=&phone=  (public order tracking page)

POST   /custom-orders                     submit custom order request (multipart: index file)
POST   /contact                           contact form submission
POST   /whatsapp-leads                    log a WhatsApp click / Khata Assistant lead

POST   /auth/register
POST   /auth/login
POST   /auth/logout                       (auth:sanctum)
GET    /auth/me                           (auth:sanctum)
```

### Authenticated customer (`auth:sanctum`)

```
GET    /me/orders                         order history
GET    /me/orders/{order_number}          order detail
GET    /me/addresses
POST   /me/addresses
PATCH  /me/addresses/{id}
DELETE /me/addresses/{id}
```

### Admin (`auth:sanctum` + `role:admin`)

```
GET|POST       /admin/products
GET|PATCH|DELETE /admin/products/{id}
POST           /admin/products/{id}/images

GET|POST       /admin/categories
PATCH|DELETE   /admin/categories/{id}

GET            /admin/orders                    ?status=&payment_status=&q=
GET            /admin/orders/{id}
PATCH          /admin/orders/{id}/status         {status}
PATCH          /admin/orders/{id}/payment        {payment_status, transaction_id?}

GET            /admin/custom-orders
PATCH          /admin/custom-orders/{id}         {status, admin_note}

GET            /admin/contact-messages
PATCH          /admin/contact-messages/{id}      {status}

GET            /admin/dashboard/summary          revenue, order counts, top products
```

---

## 5. Checkout / order flow

1. Frontend builds cart client-side (guest `session_token` in a cookie, or user-owned
   cart if logged in).
2. `POST /orders` accepts:
   ```json
   {
     "cart_id": 123,
     "payment_method": "bkash",
     "shipping": { "name": "", "phone": "", "district": "", "upazila": "", "address": "" },
     "customer_note": "",
     "payment": { "transaction_id": "8N7XXXXX", "sender_number": "017XXXXXXXX" }
   }
   ```
3. Server-side, inside a DB transaction:
   - Re-validate every cart item's `product.sold_out` and current price (never trust
     client-sent prices).
   - Snapshot `product_name_en/bn` and `unit_price` onto `order_items`.
   - Compute `subtotal`, apply `coupon` if present, compute `grand_total`.
   - Create `Order` (`status = pending`, `payment_status = unpaid` unless COD-verified
     instantly) and a `Payment` row (`status = pending` for bKash/Nagad/Rocket since
     they're manually verified by staff against the TrxID; `cod` orders skip straight
     to `payment_status = unpaid`, collected on delivery).
   - Clear the cart.
   - Dispatch `SendOrderConfirmationNotification` job (SMS/WhatsApp/email).
4. Order confirmation page/track page reads by `order_number` + `phone` (no login
   required, matching the existing "অর্ডার ট্র্যাক" page).
5. Admin manually verifies `bkash/nagad/rocket` payments against the TrxID in the
   admin panel, flips `payment_status`, and progresses `order.status` through
   confirmed → processing → shipped → delivered.

---

## 6. Auth strategy

- **Customers:** optional accounts. Guest checkout is fully supported (order tracked
  by `order_number` + `phone`). If they do register, Sanctum SPA cookie auth against
  the Next.js frontend (same-site, `withCredentials`).
- **Admin panel:** separate login (`role = admin`), Sanctum token or session, gated by
  a Laravel `Gate`/policy on every `/admin/*` route. Recommend building the admin UI
  as a Laravel Filament panel (fast to ship, handles CRUD + media + relations for
  products/orders out of the box) rather than a bespoke React admin.

---

## 7. File uploads

- `custom_order_requests.index_file_path` — customer-submitted PDF/photos of their
  index, per the marquee copy ("ইনডেক্স ও PDF পাঠালেই ... কপি করে দেবেন"). Store via
  `Storage::disk('s3')->putFile('custom-orders', $file)`, validate mime
  (`pdf,jpg,jpeg,png`), max 10MB.
- `product_images.disk_path` — admin-uploaded real cover photos, replacing the
  frontend's static `/public/assets/covers/*.jpg`. Serve via CDN/S3 URL; the
  `Product` API response includes a resolved `cover_url` accessor.

---

## 8. Notifications

Queued (Redis) jobs, each with an SMS/WhatsApp channel (e.g. via a local SMS gateway
provider) and optionally email:

- `OrderPlaced` → customer confirmation + admin alert
- `PaymentVerified` → customer confirmation
- `OrderStatusChanged` → customer update on shipped/delivered
- `CustomOrderReceived` → admin alert to follow up over WhatsApp (mirrors the
  "Khata Assistant" widget's promise of a human follow-up)

---

## 9. Mapping from current frontend types

| `lib/mock-data.ts` | Laravel equivalent |
|---|---|
| `Localized` (`{en, bn}`) | Two columns per field: `name_en` / `name_bn` (simpler for SQL filtering/sorting than JSON) |
| `Product.subject` | `products.subject` enum |
| `Product.level` | `products.level` enum, nullable |
| `Product.paper` | `products.paper` tinyint, nullable |
| `Product.bestSeller` | `products.best_seller` |
| `Product.soldOut` | `products.sold_out` |
| `discountPercent(p)` | `Product::getDiscountPercentAttribute()` |
| `getTopSellers()` | `GET /products/top-sellers` (filter `best_seller = true`, or curated list) |
| `getCategories()` | `GET /categories` |
| `getProductsByCategory(slug)` | `GET /categories/{slug}/products` |

The frontend should switch from importing `lib/mock-data.ts` to an API client
(e.g. `lib/api.ts` with `fetch` wrappers) once this backend exists, keeping the
same `Product`/`Category` TypeScript shapes so components don't need rewriting —
only the data source changes.

---

## 10. Suggested build order

1. `categories`, `products`, `product_images` + admin CRUD (Filament) — unblocks
   replacing the static catalogue.
2. Public `GET /products`, `GET /categories/*` — frontend can switch off mock data.
3. `carts`/`cart_items` + cart endpoints.
4. `orders`/`order_items`/`payments` + checkout flow + order tracking.
5. `custom_order_requests` + file upload.
6. Auth (Sanctum) + customer order history/addresses.
7. `coupons`, `contact_messages`, `whatsapp_leads`, admin dashboard summary.
