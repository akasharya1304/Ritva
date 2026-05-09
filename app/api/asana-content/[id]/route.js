import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const content = await prisma.asanaContent.findUnique({
      where: { id }
    });
    if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 });
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch", details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, summary, details } = body;

    const updatedContent = await prisma.asanaContent.update({
      where: { id },
      data: {
        title,
        summary,
        details: details.map(d => ({
          heading: d.heading,
          description: d.description
        }))
      }
    });

    return NextResponse.json(updatedContent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.asanaContent.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete", details: error.message }, { status: 500 });
  }
}
