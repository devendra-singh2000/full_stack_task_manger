"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  assignee: { name: string } | null;
};

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("TODO");

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchTasks();
  }, [status, projectId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status: taskStatus, projectId })
      });
      if (res.ok) {
        setShowCreate(false);
        setTitle("");
        setDescription("");
        setTaskStatus("TODO");
        fetchTasks();
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

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'TODO': return 'badge-todo';
      case 'IN_PROGRESS': return 'badge-inprogress';
      case 'DONE': return 'badge-done';
      default: return 'badge-todo';
    }
  };

  return (
    <>
      <Navbar />
      <div className="container animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Project Tasks</h1>
          <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? "Cancel" : "Add Task"}
          </button>
        </div>

        {showCreate && (
          <div className="glass-panel mb-4">
            <h2 style={{ marginBottom: '16px' }}>New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" value={taskStatus} onChange={e => setTaskStatus(e.target.value)}>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Save Task</button>
            </form>
          </div>
        )}

        <div className="dashboard-grid">
          {tasks.length === 0 ? (
            <p className="text-secondary">No tasks found.</p>
          ) : (
            tasks.map(task => (
              <div className="glass-card" key={task.id}>
                <div className="flex justify-between items-center mb-4">
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{task.title}</h3>
                  <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '16px' }}>{task.description || "No description"}</p>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Assignee: {task.assignee ? task.assignee.name : "Unassigned"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
