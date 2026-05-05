import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEYS,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.formData();
    
    const category = data.get('category');
    const asanaName = data.get('asanaName');
    const group = data.get('group');
    const type = data.get('type');
    
    const detailsRaw = data.get('details');
    const details = detailsRaw ? JSON.parse(detailsRaw) : {};

    const files = data.getAll('pic');
    const picUrls = [...(details.pic || [])];

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

    const updatedPose = await prisma.yogaPose.update({
      where: { id },
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

    return NextResponse.json(updatedPose, { status: 200 });
  } catch (error) {
    console.error("PUT /api/asanas/[id] error:", error);
    return NextResponse.json({ error: "Failed to update Yoga Pose", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.yogaPose.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete", details: error.message }, { status: 500 });
  }
}
