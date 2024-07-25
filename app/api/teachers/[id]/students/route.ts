import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }) {
  const { id } = params;

  try {
    const teacherId = parseInt(id, 10); // Konvertiere id in einen Integer

    if (isNaN(teacherId)) {
      return NextResponse.json({ error: 'Invalid teacher ID' }, { status: 400 });
    }

    const students = await prisma.student.findMany({
      where: { teacherId },
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch students', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
