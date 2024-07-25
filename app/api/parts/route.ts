import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const previousPartId = formData.get('previousPartId') ? Number(formData.get('previousPartId')) : null;
  const nextPartId = formData.get('nextPartId') ? Number(formData.get('nextPartId')) : null;
  const lessonName = formData.get('lessonName') as string;
  const previousLessonId = formData.get('previousLessonId') ? Number(formData.get('previousLessonId')) : null;
  const nextLessonId = formData.get('nextLessonId') ? Number(formData.get('nextLessonId')) : null;
  const soloName = formData.get('soloName') as string;
  const previousSoloId = formData.get('previousSoloId') ? Number(formData.get('previousSoloId')) : null;
  const nextSoloId = formData.get('nextSoloId') ? Number(formData.get('nextSoloId')) : null;
  const soloLevel = formData.get('soloLevel') ? Number(formData.get('soloLevel')) : 0;
  const mixName = formData.get('mixName') as string;
  const previousMixId = formData.get('previousMixId') ? Number(formData.get('previousMixId')) : null;
  const nextMixId = formData.get('nextMixId') ? Number(formData.get('nextMixId')) : null;
  const mixLevel = formData.get('mixLevel') ? Number(formData.get('mixLevel')) : 0;
  const trackName = formData.get('trackName') as string;
  const previousTrackId = formData.get('previousTrackId') ? Number(formData.get('previousTrackId')) : null;
  const nextTrackId = formData.get('nextTrackId') ? Number(formData.get('nextTrackId')) : null;
  const currentTrack = formData.get('currentTrack') as string;
  const trackLevelName = formData.get('trackLevelName') as string;
  const bpm = formData.get('bpm') ? Number(formData.get('bpm')) : 0;
  const instruments = formData.get('instruments') as string;

  let imageUrl = null;
  const file = formData.get('image') as File;

  if (file) {
    const data = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);
    fs.writeFileSync(filePath, data);
    imageUrl = `/uploads/${fileName}`;
  }

  try {
    const previousPart = previousPartId ? await prisma.part.findUnique({ where: { id: previousPartId } }) : null;
    const nextPart = nextPartId ? await prisma.part.findUnique({ where: { id: nextPartId } }) : null;
    const previousLesson = previousLessonId ? await prisma.lesson.findUnique({ where: { id: previousLessonId } }) : null;
    const nextLesson = nextLessonId ? await prisma.lesson.findUnique({ where: { id: nextLessonId } }) : null;
    const previousSolo = previousSoloId ? await prisma.solo.findUnique({ where: { id: previousSoloId } }) : null;
    const nextSolo = nextSoloId ? await prisma.solo.findUnique({ where: { id: nextSoloId } }) : null;
    const previousMix = previousMixId ? await prisma.mix.findUnique({ where: { id: previousMixId } }) : null;
    const nextMix = nextMixId ? await prisma.mix.findUnique({ where: { id: nextMixId } }) : null;
    const previousTrack = previousTrackId ? await prisma.track.findUnique({ where: { id: previousTrackId } }) : null;
    const nextTrack = nextTrackId ? await prisma.track.findUnique({ where: { id: nextTrackId } }) : null;

    const part = await prisma.part.create({
      data: {
        name,
        previousPartId: previousPart ? previousPartId : null,
        nextPartId: nextPart ? nextPartId : null,
        imageUrl,
      },
    });

    const lesson = await prisma.lesson.create({
      data: {
        name: lessonName,
        partId: part.id,
        previousLessonId: previousLesson ? previousLessonId : null,
        nextLessonId: nextLesson ? nextLessonId : null,
      },
    });

    const solo = await prisma.solo.create({
      data: {
        name: soloName,
        lessonId: lesson.id,
        previousSoloId: previousSolo ? previousSoloId : null,
        nextSoloId: nextSolo ? nextSoloId : null,
        level: soloLevel,
      },
    });

    const mix = await prisma.mix.create({
      data: {
        name: mixName,
        soloId: solo.id,
        previousMixId: previousMix ? previousMixId : null,
        nextMixId: nextMix ? nextMixId : null,
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
        previousTrackId: previousTrack ? previousTrackId : null,
        nextTrackId: nextTrack ? nextTrackId : null,
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
