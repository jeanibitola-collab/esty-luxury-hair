import Link from "next/link";
import { site } from "../lib/site";
import CurrentYear from "./CurrentYear";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="mt-16 bg-plum text-petal">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
        {/* Brand + socials */}
        <div>
          <p className="font-display text-2xl text-white">{site.name}</p>
          <p className="mt-2 text-sm text-petal/80">{site.tagline}</p>
          <SocialLinks className="mt-5" />
        </div>

        {/* Contact */}
        <div className="md:text-right">
          <p className="font-display text-lg text-white">Visit Us</p>
          <p className="mt-3 text-sm">{site.address}</p>
          <p className="mt-1 text-sm">{site.phone}</p>
          <Link
            href="/book"
            className="mt-4 inline-block rounded-full bg-rosy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-berry"
          >
            Book Now
          </Link>
        </div>
      </div>

      <p className="border-t border-petal/20 py-4 text-center text-xs text-petal/60">
        © <CurrentYear /> {site.name}. All rights reserved.
      </p>
    </footer>
  );
}