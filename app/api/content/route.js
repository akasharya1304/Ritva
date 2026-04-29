import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Extracting fields from the payload
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

    // Basic validation
    if (!title_en || !slug || !category || !sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: "Missing required fields or invalid sections" }, { status: 400 });
    }

    // Format sections to ensure they match the Prisma ContentBlock type
    const formattedSections = sections.map(section => ({
      type: section.type || "paragraph",
      content_en: section.content_en || "", // required
      content_hi: section.content_hi || null,
      author: section.author || null,
      imageUrl: section.imageUrl || null,
      caption_en: section.type === 'image' ? section.content_en : null, // Store as caption specifically for image, though content_en is still required
      caption_hi: section.type === 'image' ? section.content_hi : null,
    }));

    // Save to Database
    const newContent = await prisma.yogaContent.create({
      data: {
        title_en,
        title_hi: title_hi || null,
        slug,
        category,
        thumbnailUrl: thumbnailUrl || null,
        order: order || 1,
        estimatedReadTime: estimatedReadTime || 5,
        sections: formattedSections
      }
    });

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error("Critical API Error (POST /api/content):", error);
    
    // Check for unique constraint violation (like slug)
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: "A content module with this slug already exists. Please generate a unique slug." 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: "Failed to save content", 
      details: error.message || "Unknown Database Error" 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const contents = await prisma.yogaContent.findMany({
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json(contents || [], { status: 200 });
  } catch (error) {
    console.error("Critical API Error (GET /api/content):", error);
    return NextResponse.json({ 
      error: "Database Connection Failed", 
      details: error.message 
    }, { status: 500 });
  } 
}
