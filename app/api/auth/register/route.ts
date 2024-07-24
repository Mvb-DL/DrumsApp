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
  const { firstName, lastName, email, password, role, phoneNumber } = await request.json();

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    let user;
    if (role === 'teacher') {
      user = await prisma.teacher.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });
    } else if (role === 'customer') {
      user = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phoneNumber,
        },
      });
    }

    if (user) {
      const token = jwt.sign({ id: user.id, role: role, email: user.email }, secret, {
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
        role: role, 
        token,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }, {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
        },
      });
    } else {
      return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Registration failed', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
