import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATABASES = {
  projects: path.join(process.cwd(), 'src/database/projects.json'),
  people: path.join(process.cwd(), 'src/database/people.json'),
  freelancers: path.join(process.cwd(), 'src/database/freelancers.json'),
  facilities: path.join(process.cwd(), 'src/database/facilities.json'),
  news: path.join(process.cwd(), 'src/database/news.json'),
  'credit-roles': path.join(process.cwd(), 'src/database/credit-roles.json'),
};

export async function GET(request: NextRequest, { params }: { params: { dbType: string } }) {
  const { dbType } = params;

  if (!DATABASES[dbType as keyof typeof DATABASES]) {
    return NextResponse.json({ error: 'Database not found' }, { status: 404 });
  }

  const dbPath = DATABASES[dbType as keyof typeof DATABASES];

  try {
    // All files are now JSON files
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json([]);
    }

    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Handle different JSON structures
    if (dbType === 'facilities') {
      return NextResponse.json(data.facilities || []);
    } else if (dbType === 'news') {
      return NextResponse.json(data.news || []);
    } else if (dbType === 'freelancers') {
      return NextResponse.json(data.freelancers || []);
    } else if (dbType === 'credit-roles') {
      return NextResponse.json(data.creditRoles || []);
    } else {
      return NextResponse.json(data[dbType] || []);
    }
  } catch (error) {
    console.error(`Error reading ${dbType} database:`, error);
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { dbType: string } }) {
  const { dbType } = params;

  if (!DATABASES[dbType as keyof typeof DATABASES]) {
    return NextResponse.json({ error: 'Database not found' }, { status: 404 });
  }

  const dbPath = DATABASES[dbType as keyof typeof DATABASES];

  try {
    const body = await request.json();
    const { action, item, id, updates } = body;

    // JSON files operations
    let data: any = { facilities: [], projects: [], people: [], freelancers: [], news: [], creditRoles: [] };
    if (fs.existsSync(dbPath)) {
      data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }

    const arrayKey = dbType as 'facilities' | 'projects' | 'people' | 'freelancers' | 'news' | 'credit-roles';
    let array = data[arrayKey] || [];

    // Handle different array keys
    if (dbType === 'freelancers') {
      array = data.freelancers || [];
    } else if (dbType === 'credit-roles') {
      array = data.creditRoles || [];
    }

    if (action === 'add') {
      const newItem = {
        ...item,
        id: item.id || Date.now().toString(),
      };
      array.push(newItem);
    } else if (action === 'update') {
      const index = array.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        array[index] = { ...array[index], ...item };
      }
    } else if (action === 'bulkUpdate') {
      // Handle bulk updates
      if (updates && Array.isArray(updates)) {
        updates.forEach((update: any) => {
          const index = array.findIndex((item: any) => item.id === update.id);
          if (index !== -1) {
            // Update only the specified field
            const fieldToUpdate = Object.keys(update).find(key => key !== 'id');
            if (fieldToUpdate) {
              array[index] = { ...array[index], [fieldToUpdate]: update[fieldToUpdate] };
            }
          }
        });
      }
    } else if (action === 'delete') {
      array = array.filter((item: any) => item.id !== id);
    }

    // Update and save
    if (dbType === 'facilities') {
      data.facilities = array;
    } else if (dbType === 'news') {
      data.news = array;
    } else if (dbType === 'freelancers') {
      data.freelancers = array;
    } else if (dbType === 'credit-roles') {
      data.creditRoles = array;
    } else {
      data[dbType] = array;
    }

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, data: array });
  } catch (error) {
    console.error(`Error updating ${dbType} database:`, error);
    return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { dbType: string } }) {
  const { dbType } = params;

  if (!DATABASES[dbType as keyof typeof DATABASES]) {
    return NextResponse.json({ error: 'Database not found' }, { status: 404 });
  }

  const dbPath = DATABASES[dbType as keyof typeof DATABASES];

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const ids = url.searchParams.get('ids')?.split(',') || [];

    if (!id && ids.length === 0) {
      return NextResponse.json({ error: 'ID or IDs parameter required' }, { status: 400 });
    }

    let data: any = { facilities: [], projects: [], people: [], freelancers: [], news: [], creditRoles: [] };
    if (fs.existsSync(dbPath)) {
      data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }

    const arrayKey = dbType as 'facilities' | 'projects' | 'people' | 'freelancers' | 'news' | 'credit-roles';
    let array = data[arrayKey] || [];

    // Handle different array keys
    if (dbType === 'freelancers') {
      array = data.freelancers || [];
    } else if (dbType === 'credit-roles') {
      array = data.creditRoles || [];
    }

    // Single delete
    if (id) {
      array = array.filter((item: any) => item.id !== id);
    }
    // Bulk delete
    else if (ids.length > 0) {
      array = array.filter((item: any) => !ids.includes(item.id));
    }

    // Update and save
    if (dbType === 'facilities') {
      data.facilities = array;
    } else if (dbType === 'news') {
      data.news = array;
    } else if (dbType === 'freelancers') {
      data.freelancers = array;
    } else if (dbType === 'credit-roles') {
      data.creditRoles = array;
    } else {
      data[dbType] = array;
    }

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: id ? 'Item deleted successfully' : `${ids.length} items deleted successfully`,
      data: array
    });
  } catch (error) {
    console.error(`Error deleting from ${dbType} database:`, error);
    return NextResponse.json({ error: 'Failed to delete from database' }, { status: 500 });
  }
}