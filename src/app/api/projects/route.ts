import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: session.user.role === "ADMIN" 
      ? {} // Admins can see all projects
      : { members: { some: { userId: session.user.id } } }, // Members only see projects they are part of
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { tasks: true, members: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized or insufficient permissions" }, { status: 403 });
  }

  try {
    const { name, description, memberIds } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Project name is required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: session.user.id,
        members: {
          create: [
            // Always add the creator (admin) to the project
            { userId: session.user.id, role: "ADMIN" },
            // Add other members if provided
            ...(memberIds ? (memberIds as string[]).map(id => ({ userId: id, role: "MEMBER" as any })) : [])
          ]
        }
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
