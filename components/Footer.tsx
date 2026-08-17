import Link from 'next/link';
import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="mt-12 px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-ps-text-muted text-xs"
      style={{ backgroundColor: '#0A0A15' }}
    >
      <p>ParkSense AI © 2025</p>
      <div className="flex items-center gap-5">
        <Link href="/dashboard" className="hover:text-white ps-transition">Privacy Policy</Link>
        <Link href="/dashboard" className="hover:text-white ps-transition">Terms</Link>
        <Link href="/dashboard" className="hover:text-white ps-transition">Support</Link>
      </div>
      <p className="flex items-center gap-1.5">
        <Cpu size={13} /> Powered by Computer Vision &amp; AI
      </p>
    </footer>
  );
}
