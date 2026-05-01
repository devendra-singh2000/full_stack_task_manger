"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then(res => res.json())
        .then(data => {
          setMetrics(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch metrics", err);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <div className="text-secondary">Welcome back, {session?.user?.name}</div>
        </div>

        <div className="dashboard-grid">
          <div className="glass-card">
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Total Projects</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{metrics.totalProjects}</div>
          </div>
          <div className="glass-card">
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Total Tasks</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{metrics.totalTasks}</div>
          </div>
          <div className="glass-card" style={{ borderBottom: '4px solid var(--success)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Completed</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{metrics.completedTasks}</div>
          </div>
          <div className="glass-card" style={{ borderBottom: '4px solid var(--primary-accent)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>In Progress</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{metrics.inProgressTasks}</div>
          </div>
          <div className="glass-card" style={{ borderBottom: '4px solid var(--danger)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Overdue</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{metrics.overdueTasks}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Quick Actions</h2>
          <div className="flex gap-4">
            {session?.user?.role === "ADMIN" && (
              <button className="btn btn-primary" onClick={() => window.location.href = '/projects'}>
                Create New Project
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => window.location.href = '/projects'}>
              View All Projects
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
