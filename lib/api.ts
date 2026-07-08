import type { Category, Product } from "./mock-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type ApiLocalized = { en: string; bn: string };

type ApiCategory = {
  id: number;
  slug: string;
  name: ApiLocalized;
  sort_order: number;
};

type ApiProduct = {
  id: number;
  slug: string;
  name: ApiLocalized;
  category: string | null;
  subject: Product["subject"];
  level: Product["level"];
  paper: Product["paper"];
  price_min: number;
  price_max: number | null;
  original_price: number | null;
  discount_percent: number | null;
  best_seller: boolean;
  sold_out: boolean;
  cover_url: string | null;
};

/** maps the Laravel API's snake_case shape onto the frontend's existing Product type */
function toProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    priceMin: p.price_min,
    priceMax: p.price_max,
    originalPrice: p.original_price,
    subject: p.subject,
    level: p.level,
    paper: p.paper,
    bestSeller: p.best_seller,
    soldOut: p.sold_out,
    category: p.category ?? "",
  };
}

function toCategory(c: ApiCategory): Category {
  return {
    id: String(c.id),
    name: c.name,
    slug: c.slug,
  };
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    // the guest cart is tracked via a cart_session cookie — must round-trip
    // on every request, including cross-origin ones in local dev
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let message = `API request failed: ${init?.method ?? "GET"} ${path} → ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new Error(message);
  }

  return res.json();
}

// catalogue data changes rarely; revalidate periodically rather than refetching every request
const CATALOGUE_CACHE: RequestInit = { next: { revalidate: 60 } };

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiFetch<{ data: ApiCategory[] }>("/categories", CATALOGUE_CACHE);
  return data.map(toCategory);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const { data } = await apiFetch<{ data: ApiProduct[] }>(`/categories/${categorySlug}/products`, CATALOGUE_CACHE);
  return data.map(toProduct);
}

export async function getTopSellers(): Promise<Product[]> {
  const { data } = await apiFetch<{ data: ApiProduct[] }>("/products/top-sellers", CATALOGUE_CACHE);
  return data.map(toProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  const { data } = await apiFetch<{ data: ApiProduct[] }>("/products", CATALOGUE_CACHE);
  return data.map(toProduct);
}

// --- Cart ---

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Cart = {
  id: number;
  items: CartItem[];
  totalPrice: number;
};

type ApiCartItem = {
  id: number;
  product: ApiProduct;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type ApiCart = {
  id: number;
  session_token: string | null;
  items: ApiCartItem[];
  total_price: number;
};

function toCart(c: ApiCart): Cart {
  return {
    id: c.id,
    items: c.items.map((item) => ({
      id: item.id,
      product: toProduct(item.product),
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.line_total,
    })),
    totalPrice: c.total_price,
  };
}

/** never cached — the cart must always reflect the latest server state */
const NO_CACHE: RequestInit = { cache: "no-store" };

export async function getCart(): Promise<Cart> {
  const { data } = await apiFetch<{ data: ApiCart }>("/cart", NO_CACHE);
  return toCart(data);
}

export async function addCartItem(productId: string, quantity = 1): Promise<Cart> {
  const { data } = await apiFetch<{ data: ApiCart }>("/cart/items", {
    ...NO_CACHE,
    method: "POST",
    body: JSON.stringify({ product_id: Number(productId), quantity }),
  });
  return toCart(data);
}

export async function updateCartItem(itemId: number, quantity: number): Promise<Cart> {
  const { data } = await apiFetch<{ data: ApiCart }>(`/cart/items/${itemId}`, {
    ...NO_CACHE,
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
  return toCart(data);
}

export async function removeCartItem(itemId: number): Promise<Cart> {
  const { data } = await apiFetch<{ data: ApiCart }>(`/cart/items/${itemId}`, {
    ...NO_CACHE,
    method: "DELETE",
  });
  return toCart(data);
}
