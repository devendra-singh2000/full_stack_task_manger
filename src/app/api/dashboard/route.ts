import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const role = session.user.role;

  try {
    const projectFilter = role === "ADMIN" 
      ? {} 
      : { project: { members: { some: { userId } } } };

    // Total tasks
    const totalTasks = await prisma.task.count({ where: projectFilter });

    // Completed tasks
    const completedTasks = await prisma.task.count({ 
      where: { ...projectFilter, status: "DONE" } 
    });

    // In Progress tasks
    const inProgressTasks = await prisma.task.count({ 
      where: { ...projectFilter, status: "IN_PROGRESS" } 
    });

    // Overdue tasks
    const overdueTasks = await prisma.task.count({
      where: {
        ...projectFilter,
        status: { not: "DONE" },
        dueDate: { lt: new Date() }
      }
    });

    // Total Projects
    const totalProjects = await prisma.project.count({
      where: role === "ADMIN" ? {} : { members: { some: { userId } } }
    });

    return NextResponse.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      totalProjects
    });

  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
