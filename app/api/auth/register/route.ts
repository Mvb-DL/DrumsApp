// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password, role, phoneNumber } = await request.json();

  try {
    // Überprüfen, ob der Benutzer bereits als Teacher oder Customer existiert
    const existingTeacher = await prisma.teacher.findUnique({ where: { email } });
    const existingCustomer = await prisma.customer.findUnique({ where: { email } });

    if (existingTeacher || existingCustomer) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Benutzer erstellen
    if (role === 'teacher') {
      await prisma.teacher.create({
        data: { firstName, lastName, email, password, role },
      });
    } else {
      await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          password,
          role,
          phoneNumber,
          address: undefined, // Address is set to null initially
        },
      });
    }
    return NextResponse.json({ message: 'User registered successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'User registration failed' }, { status: 500 });
  }
}
