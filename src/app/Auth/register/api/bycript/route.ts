// app/auth/register/api/bycript/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ message: 'Password is required' }, { status: 400 });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return NextResponse.json({ hashedPassword }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error encrypting password' }, { status: 500 });
  }
}