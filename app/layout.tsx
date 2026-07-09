import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shop.practicalkhata.pro.bd"),
  title: "Practical Khata — SSC & HSC হাতে লেখা প্র্যাকটিক্যাল খাতা",
  description:
    "Professional হ্যান্ডরাইটিং, perfect ফিগার ও ডায়াগ্রাম — SSC ও HSC প্র্যাকটিক্যাল খাতা সারাদেশে ২-৩ দিনে ডেলিভারি। প্রতি খাতা ৳২৯০ থেকে।",
  verification: {
    google: "3GtpPga3VWgafYVR_UbB6WJ7ccAU8ivIlPciGnVCyRM",
  },
  openGraph: {
    title: "Practical Khata — SSC & HSC হাতে লেখা প্র্যাকটিক্যাল খাতা",
    description:
      "Professional হ্যান্ডরাইটিং, perfect ফিগার ও ডায়াগ্রাম — SSC ও HSC প্র্যাকটিক্যাল খাতা সারাদেশে ২-৩ দিনে ডেলিভারি। প্রতি খাতা ৳২৯০ থেকে।",
    url: "https://shop.practicalkhata.pro.bd",
    siteName: "Practical Khata",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
