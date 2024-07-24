import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET as string;

if (!secret) {
  throw new Error('JWT_SECRET is not defined');
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const userTeacher = await prisma.teacher.findUnique({ where: { email } });
    const userCustomer = await prisma.customer.findUnique({ where: { email } });

    if (userTeacher && userTeacher.password === password) {
      const token = jwt.sign({ id: userTeacher.id, role: userTeacher.role, email: userTeacher.email }, secret, {
        expiresIn: '1h',
      });
      console.log('Teacher login successful, token:', token); // Debug log
      return NextResponse.json({ role: 'Teacher', token }, {
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; HttpOnly; Path=/; SameSite=Strict`,
        },
      });
    } else if (userCustomer && userCustomer.password === password) {
      const token = jwt.sign({ id: userCustomer.id, role: userCustomer.role, email: userCustomer.email }, secret, {
        expiresIn: '1h',
      });
      console.log('Customer login successful, token:', token); // Debug log
      return NextResponse.json({ role: 'Customer', token }, {
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; HttpOnly; Path=/; SameSite=Strict`,
        },
      });
    } else {
      console.log('Invalid email or password'); // Debug log
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login failed', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
