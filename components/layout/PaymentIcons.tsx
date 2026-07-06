/**
 * Brand-colored payment & shipping chips, rendered as small SVG badges.
 * Each sits on a white rounded card so it reads on the dark footer.
 * These are stylized brand marks (not official logos) — good enough to
 * look professional and recognizable without shipping copyrighted art.
 */

type ChipProps = { children: React.ReactNode };

function Chip({ children }: ChipProps) {
  return (
    <span className="flex h-8 min-w-[52px] items-center justify-center rounded-md bg-white px-2 shadow-sm">
      {children}
    </span>
  );
}

export function Bkash() {
  return (
    <Chip>
      <span className="text-sm font-extrabold italic tracking-tight">
        <span className="text-[#e2136e]">bKash</span>
      </span>
    </Chip>
  );
}

export function Nagad() {
  return (
    <Chip>
      <span className="text-sm font-extrabold italic">
        <span className="text-[#ec1c24]">Na</span>
        <span className="text-[#f6921e]">gad</span>
      </span>
    </Chip>
  );
}

export function Rocket() {
  return (
    <Chip>
      <span className="text-sm font-extrabold italic text-[#8c2f8e]">Rocket</span>
    </Chip>
  );
}

export function Visa() {
  return (
    <Chip>
      <span className="font-serif text-base font-bold italic tracking-tight text-[#1a1f71]">VISA</span>
    </Chip>
  );
}

export function Mastercard() {
  return (
    <Chip>
      <span className="relative flex items-center">
        <span className="h-5 w-5 rounded-full bg-[#eb001b]" />
        <span className="-ml-2 h-5 w-5 rounded-full bg-[#f79e1b]/90" />
      </span>
    </Chip>
  );
}

export function Amex() {
  return (
    <Chip>
      <span className="rounded bg-[#006fcf] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
        AMEX
      </span>
    </Chip>
  );
}

export function CashOnDelivery() {
  return (
    <Chip>
      <span className="text-[10px] font-bold uppercase leading-tight text-brand-700">
        Cash on
        <br />
        Delivery
      </span>
    </Chip>
  );
}

export const PAYMENT_METHODS = [
  CashOnDelivery,
  Bkash,
  Nagad,
  Rocket,
  Visa,
  Mastercard,
  Amex,
] as const;

/* ---- courier / shipping partners ---- */

export function SteadFast() {
  return (
    <Chip>
      <span className="text-sm font-extrabold tracking-tight">
        <span className="text-[#1a7a3c]">Steed</span>
        <span className="text-[#0e2e6e]">Fast</span>
      </span>
    </Chip>
  );
}

export function RedX() {
  return (
    <Chip>
      <span className="text-sm font-extrabold uppercase">
        <span className="text-[#e30613]">Red</span>
        <span className="text-ink-900">X</span>
      </span>
    </Chip>
  );
}

export function Sundarban() {
  return (
    <Chip>
      <span className="rounded-sm bg-[#f6921e] px-1.5 py-0.5 text-[10px] font-extrabold uppercase leading-none text-white">
        Sundarban
      </span>
    </Chip>
  );
}

export function ECourier() {
  return (
    <Chip>
      <span className="text-sm font-extrabold lowercase">
        <span className="text-[#16a34a]">e</span>
        <span className="text-ink-900">Courier</span>
      </span>
    </Chip>
  );
}

export function DeliveryTiger() {
  return (
    <Chip>
      <span className="text-[11px] font-extrabold leading-none">
        <span className="text-[#f6921e]">Delivery</span>
        <span className="text-ink-900"> Tiger</span>
      </span>
    </Chip>
  );
}

export function Pathao() {
  return (
    <Chip>
      <span className="text-sm font-extrabold lowercase text-[#e30613]">pathao</span>
    </Chip>
  );
}

export function CarryBee() {
  return (
    <Chip>
      <span className="text-sm font-extrabold">
        <span className="text-[#f5b301]">Carry</span>
        <span className="text-ink-900">Bee</span>
      </span>
    </Chip>
  );
}

export const SHIPPING_PARTNERS = [
  SteadFast,
  RedX,
  Sundarban,
  ECourier,
  DeliveryTiger,
  Pathao,
  CarryBee,
] as const;
