import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATABASE_DIR = path.join(process.cwd(), 'src/database');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 });
    }

    const filePath = path.join(DATABASE_DIR, `${type}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Database file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const body = await request.json();

    if (!type) {
      return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 });
    }

    const filePath = path.join(DATABASE_DIR, `${type}.json`);
    
    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
