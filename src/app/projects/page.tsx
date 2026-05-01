"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

type Project = {
  id: string;
  name: string;
  description: string;
  owner: { name: string };
  _count: { tasks: number, members: number };
};

export default function Projects() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create project form state
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchProjects();
  }, [status]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) {
        setShowCreate(false);
        setName("");
        setDescription("");
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading" || loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (status === "unauthenticated") {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Projects</h1>
          {session?.user?.role === "ADMIN" && (
            <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? "Cancel" : "New Project"}
            </button>
          )}
        </div>

        {showCreate && (
          <div className="glass-panel mb-4">
            <h2 style={{ marginBottom: '16px' }}>Create New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              </div>
              <button type="submit" className="btn btn-primary">Create</button>
            </form>
          </div>
        )}

        <div className="dashboard-grid">
          {projects.length === 0 ? (
            <p className="text-secondary">No projects found.</p>
          ) : (
            projects.map(project => (
              <Link href={`/projects/${project.id}`} key={project.id}>
                <div className="glass-card">
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{project.name}</h3>
                  <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '16px' }}>{project.description || "No description"}</p>
                  <div className="flex justify-between items-center" style={{ fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Owner: {project.owner?.name}</span>
                    <div className="flex gap-2">
                      <span className="badge badge-todo">{project._count?.tasks} Tasks</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
