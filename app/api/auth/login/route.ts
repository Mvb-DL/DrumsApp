// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const userTeacher = await prisma.teacher.findUnique({ where: { email } });
    const userCustomer = await prisma.customer.findUnique({ where: { email } });

    if (userTeacher && userTeacher.password === password) {
      return NextResponse.json({ role: 'Teacher' }, { status: 200 });
    } else if (userCustomer && userCustomer.password === password) {
      return NextResponse.json({ role: 'Customer' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
