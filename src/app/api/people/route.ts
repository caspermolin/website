import { NextResponse } from 'next/server';
import peopleData from '@/database/people.json';

export async function GET() {
  try {
    return NextResponse.json(peopleData);
  } catch (error) {
    console.error('Error loading people:', error);
    return NextResponse.json({ people: [] }, { status: 500 });
  }
}
