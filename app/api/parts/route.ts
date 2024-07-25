import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';

  const formData = await request.formData();
  const selectedPartId = formData.get('selectedPartId') ? Number(formData.get('selectedPartId')) : null;
  const name = formData.get('name') as string;

  let imageUrl = null;
  const file = formData.get('image') as File;

  if (file) {
    const data = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);
    fs.writeFileSync(filePath, data);
    imageUrl = `/uploads/${fileName}`;
  }

  if (!selectedPartId) {
    // Creating a new part if no part is selected
    try {
      const existingParts = await prisma.part.findMany();
      if (existingParts.length >= 6) {
        throw new Error('Maximum number of parts reached');
      }

      const newPart = await prisma.part.create({
        data: {
          name,
          imageUrl,
        },
      });

      return NextResponse.json(newPart);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    // Adding information to an existing part
    try {
      const part = await prisma.part.findUnique({ where: { id: selectedPartId } });

      if (!part) {
        throw new Error('Selected part does not exist');
      }

      const lessonName = formData.get('lessonName') as string;
      const soloName = formData.get('soloName') as string;
      const soloLevel = formData.get('soloLevel') ? Number(formData.get('soloLevel')) : 0;
      const mixName = formData.get('mixName') as string;
      const mixLevel = formData.get('mixLevel') ? Number(formData.get('mixLevel')) : 0;
      const trackName = formData.get('trackName') as string;
      const currentTrack = formData.get('currentTrack') as string;
      const trackLevelName = formData.get('trackLevelName') as string;
      const bpm = formData.get('bpm') ? Number(formData.get('bpm')) : 0;
      const instruments = formData.get('instruments') as string;

      const lesson = await prisma.lesson.create({
        data: {
          name: lessonName,
          partId: part.id,
        },
      });

      const solo = await prisma.solo.create({
        data: {
          name: soloName,
          lessonId: lesson.id,
          level: soloLevel,
        },
      });

      const mix = await prisma.mix.create({
        data: {
          name: mixName,
          soloId: solo.id,
          level: mixLevel,
        },
      });

      const trackLevel = await prisma.trackLevel.create({
        data: {
          level: trackLevelName,
          bpm,
          instruments,
        },
      });

      const track = await prisma.track.create({
        data: {
          name: trackName,
          currentTrack,
          mixId: mix.id,
          trackLevelId: trackLevel.id,
        },
      });

      return NextResponse.json({
        part,
        lesson,
        solo,
        mix,
        track,
        trackLevel,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to create part and related entities' }, { status: 500 });
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const parts = await prisma.part.findMany({
      include: {
        lessons: {
          include: {
            solos: {
              include: {
                mixes: {
                  include: {
                    tracks: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(parts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}
