import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';



// Ensure config only runs if variables exist
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEYS,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log("GET /api/upload/manuscript:",);
    
    return NextResponse.json(books || [], { status: 200 });
  } catch (error) {
    console.error("Critical API Error (GET):",);
    return NextResponse.json({ 
      error: "Database Connection Failed", 
      details: error.message 
    }, { status: 500 });
  } 
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    const title = data.get('title') ;
    const author = data.get('author') ;
    const category = data.get('category') ;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: "auto",
          folder: "manuscript",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:",);
            reject(error);
          } else resolve(result );
        }
      ).end(buffer);
    }) ;

    // Save metadata to MongoDB using Prisma
    try {
      const newBook = await prisma.book.create({
        data: {
          title: title || file.name.replace(/\.[^/.]+$/, ""),
          author: author || "Unknown",
          category: category || "General",
          pdfUrl: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
        },
      });
      return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
    console.error("Critical API Error (POST):");
    
    // Check if error is Prisma specific or Cloudinary specific
    const errorMessage = error.code ? "Database Save Error" : "Cloudinary Upload Failed";
    
    return NextResponse.json({ 
      error: errorMessage, 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
  } catch (error) {
    console.error("Critical API Error (POST):",);
    return NextResponse.json({ 
      error: "Upload process failed", 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
