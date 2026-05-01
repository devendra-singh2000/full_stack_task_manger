import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const tasks = await prisma.task.findMany({
    where: {
      ...(projectId ? { projectId } : {}),
      // If member, only see tasks assigned to them OR tasks in their projects? 
      // Let's say members can see all tasks in projects they belong to.
      project: session.user.role === "ADMIN" 
        ? undefined
        : { members: { some: { userId: session.user.id } } }
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, status, dueDate, projectId, assigneeId } = await req.json();

    if (!title || !projectId) {
      return NextResponse.json({ message: "Title and projectId are required" }, { status: 400 });
    }

    // Verify user has access to this project
    if (session.user.role !== "ADMIN") {
      const isMember = await prisma.projectMember.findFirst({
        where: { projectId, userId: session.user.id }
      });
      if (!isMember) {
        return NextResponse.json({ message: "Unauthorized for this project" }, { status: 403 });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "TODO",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Task creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
