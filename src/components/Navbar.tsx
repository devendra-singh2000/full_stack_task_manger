"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <nav style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
      <div className="container flex justify-between items-center">
        <Link href="/dashboard" style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-accent)' }}>
          TaskMaster
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" style={{ opacity: pathname === '/dashboard' ? 1 : 0.7 }}>
            Dashboard
          </Link>
          <Link href="/projects" style={{ opacity: pathname.startsWith('/projects') ? 1 : 0.7 }}>
            Projects
          </Link>
          
          <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>
              {session.user?.role}
            </span>
            <button className="btn btn-secondary" onClick={() => signOut()}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
