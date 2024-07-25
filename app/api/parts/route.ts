import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const {
    name,
    previousPartId,
    nextPartId,
    lessonName,
    previousLessonId,
    nextLessonId,
    soloName,
    previousSoloId,
    nextSoloId,
    soloLevel, 
    mixName,
    previousMixId,
    nextMixId,
    mixLevel, 
    trackName,
    previousTrackId,
    nextTrackId,
    currentTrack,
    trackLevelName,
    bpm,
    instruments,
  } = await request.json();

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
