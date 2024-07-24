import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt';

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
    const userStudent = await prisma.student.findUnique({ where: { email } });

    let user = null;
    if (userTeacher && bcrypt.compareSync(password, userTeacher.password)) {
      user = { ...userTeacher, role: 'teacher' };
    } else if (userCustomer && bcrypt.compareSync(password, userCustomer.password)) {
      user = { ...userCustomer, role: 'customer' };
    } else if (userStudent && bcrypt.compareSync(password, userStudent.password)) {
      user = { ...userStudent, role: 'student' };
    }

    if (user) {
      const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, secret, {
        expiresIn: '1h',
      });

      const cookie = serialize('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60, // 1 hour
        sameSite: 'strict',
      });

      return NextResponse.json({ 
        id: user.id, 
        role: user.role, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token 
      }, {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login failed', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
