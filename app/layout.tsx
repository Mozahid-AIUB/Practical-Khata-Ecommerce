import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Practical Khata — SSC & HSC হাতে লেখা প্র্যাকটিক্যাল খাতা",
  description:
    "Professional হ্যান্ডরাইটিং, perfect ফিগার ও ডায়াগ্রাম — SSC ও HSC প্র্যাকটিক্যাল খাতা সারাদেশে ২-৩ দিনে ডেলিভারি। প্রতি খাতা ৳২৯০ থেকে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
