import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const [content, total] = await Promise.all([
      prisma.asanaContent.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asanaContent.count(),
    ]);

    return NextResponse.json({
      data: content,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }, { status: 200 });
  } catch (error) {
    console.error("GET /api/asana-content error:", error);
    return NextResponse.json({ error: "Failed to fetch", details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, summary, details } = body;

    const newContent = await prisma.asanaContent.create({
      data: {
        title,
        summary,
        details: details.map(d => ({
          heading: d.heading,
          description: d.description
        }))
      }
    });

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error("POST /api/asana-content error:", error);
    return NextResponse.json({ error: "Failed to create Asana Content", details: error.message }, { status: 500 });
  }
}
