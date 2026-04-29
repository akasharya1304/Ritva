import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const content = await prisma.yogaContent.findUnique({
      where: { id: id },
    });
    
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error("Critical API Error (GET /api/content/[id]):", error);
    return NextResponse.json({ 
      error: "Failed to fetch content", 
      details: error.message 
    }, { status: 500 });
  } 
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const {
      title_en,
      title_hi,
      slug,
      category,
      thumbnailUrl,
      order,
      estimatedReadTime,
      sections
    } = data;

    // Format sections
    const formattedSections = Array.isArray(sections) ? sections.map(section => ({
      type: section.type || "paragraph",
      content_en: section.content_en || "",
      content_hi: section.content_hi || null,
      author: section.author || null,
      imageUrl: section.imageUrl || null,
      caption_en: section.type === 'image' ? section.content_en : null,
      caption_hi: section.type === 'image' ? section.content_hi : null,
    })) : undefined;

    // Save to Database
    const updatedContent = await prisma.yogaContent.update({
      where: { id: id },
      data: {
        title_en,
        title_hi: title_hi || null,
        slug,
        category,
        thumbnailUrl: thumbnailUrl || null,
        order: order || 1,
        estimatedReadTime: estimatedReadTime || 5,
        ...(formattedSections && { sections: formattedSections })
      }
    });

    return NextResponse.json(updatedContent, { status: 200 });
  } catch (error) {
    console.error("Critical API Error (PUT /api/content/[id]):", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Record to update not found." }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: "A content module with this slug already exists. Please generate a unique slug." 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: "Failed to update content", 
      details: error.message || "Unknown Database Error" 
    }, { status: 500 });
  }
}
