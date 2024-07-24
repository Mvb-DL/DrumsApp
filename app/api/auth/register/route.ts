// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET as string;

if (!secret) {
  throw new Error('JWT_SECRET is not defined');
}

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password, role, phoneNumber } = await request.json();

  try {
    const existingTeacher = await prisma.teacher.findUnique({ where: { email } });
    const existingCustomer = await prisma.customer.findUnique({ where: { email } });

    if (existingTeacher || existingCustomer) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    let user;
    if (role === 'teacher') {
      user = await prisma.teacher.create({
        data: { firstName, lastName, email, password, role },
      });
    } else {
      user = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          password,
          role,
          phoneNumber,
          address: undefined,
        },
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, secret, {
      expiresIn: '1h',
    });

    const response = NextResponse.json(
      { message: 'User registered successfully', token },
      {
        status: 200,
      }
    );

    response.cookies.set('token', token, { httpOnly: true, path: '/', sameSite: 'strict' });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'User registration failed' }, { status: 500 });
  }
}
