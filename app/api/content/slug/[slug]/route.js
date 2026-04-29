import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const content = await prisma.yogaContent.findUnique({
      where: { slug: slug },
    });
    
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error("Critical API Error (GET /api/content/slug/[slug]):", error);
    return NextResponse.json({ 
      error: "Failed to fetch content", 
      details: error.message 
    }, { status: 500 });
  } 
}
