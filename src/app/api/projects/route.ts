import { NextResponse } from 'next/server';
import projectsData from '@/database/projects.json';

export async function GET() {
  try {
    return NextResponse.json(projectsData);
  } catch (error) {
    console.error('Error loading projects:', error);
    return NextResponse.json({ projects: [] }, { status: 500 });
  }
}