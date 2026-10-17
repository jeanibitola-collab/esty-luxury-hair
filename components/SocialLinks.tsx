"use client";

import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { site } from "../lib/site";

const socials = [
  { label: "Instagram", href: "https://instagram.com/", Icon: FaInstagram },
  { label: "TikTok", href: "https://www.tiktok.com/@big_esther1?_r=1&_t=ZS-9AdTvDRTSBI", Icon: FaTiktok },
  { label: "WhatsApp", href: "https://wa.me/+2347039096685", Icon: FaWhatsapp },
];

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {socials.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-petal/40 transition-colors hover:border-rosy hover:bg-rosy hover:text-white"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}