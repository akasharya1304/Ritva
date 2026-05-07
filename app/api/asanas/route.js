import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEYS,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const [poses, total] = await Promise.all([
      prisma.yogaPose.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.yogaPose.count(),
    ]);

    return NextResponse.json({
      data: poses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }, { status: 200 });
  } catch (error) {
    console.error("GET /api/asanas error:", error);
    return NextResponse.json({ error: "Failed to fetch", details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();
    
    const category = data.get('category');
    const asanaName = data.get('asanaName');
    const group = data.get('group');
    const type = data.get('type');
    
    // details JSON string
    const detailsRaw = data.get('details');
    const details = detailsRaw ? JSON.parse(detailsRaw) : {};

    // Files
    const files = data.getAll('pic');
    const picUrls = [...(details.pic || [])]; // retain any existing URLs passed in

    for (const file of files) {
      if (file && typeof file !== 'string') {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const cloudinaryResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              resource_type: "auto",
              folder: "yogaPose",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        picUrls.push(cloudinaryResult.secure_url);
      }
    }

    details.pic = picUrls;

    const newPose = await prisma.yogaPose.create({
      data: {
        category,
        asanaName,
        group,
        type,
        details: {
          pic: details.pic,
          steps: details.steps || [],
          stage: details.stage || [],
          breathing: details.breathing || null,
          awareness: details.awareness || null,
          benefits: details.benefits || null,
          contraindications: details.contraindications || null,
          practiceNote: details.practiceNote || null,
          variation: details.variation || null,
          sequence: details.sequence || null,
          duration: details.duration || null,
        }
      }
    });

    return NextResponse.json(newPose, { status: 201 });
  } catch (error) {
    console.error("POST /api/asanas error:", error);
    return NextResponse.json({ error: "Failed to create Yoga Pose", details: error.message }, { status: 500 });
  }
}
