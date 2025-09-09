import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ROLES_FILE = path.join(process.cwd(), 'src/database/roles.json');

export async function GET() {
  try {
    const data = await fs.readFile(ROLES_FILE, 'utf-8');
    const roles = JSON.parse(data);
    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error reading roles:', error);
    return NextResponse.json({ error: 'Failed to load roles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, role } = body;

    // Read current roles
    let roles = [];
    try {
      const data = await fs.readFile(ROLES_FILE, 'utf-8');
      roles = JSON.parse(data);
    } catch {
      // File doesn't exist yet, start with empty array
      roles = [];
    }

    if (action === 'add') {
      // Check if role already exists
      if (roles.some((r: any) => r.id === role.id)) {
        return NextResponse.json({ error: 'Role already exists' }, { status: 400 });
      }

      // Add new role
      roles.push({
        id: role.id,
        name: role.name,
        category: role.category || 'additional',
        description: role.description || '',
        order: role.order || roles.length + 1
      });

    } else if (action === 'update') {
      // Find and update role
      const index = roles.findIndex((r: any) => r.id === role.id);
      if (index === -1) {
        return NextResponse.json({ error: 'Role not found' }, { status: 404 });
      }

      roles[index] = {
        ...roles[index],
        name: role.name,
        category: role.category,
        description: role.description,
        order: role.order
      };

    } else if (action === 'delete') {
      // Remove role
      roles = roles.filter((r: any) => r.id !== role.id);
    }

    // Write back to file
    await fs.writeFile(ROLES_FILE, JSON.stringify(roles, null, 2));

    return NextResponse.json({ success: true, roles });
  } catch (error) {
    console.error('Error updating roles:', error);
    return NextResponse.json({ error: 'Failed to update roles' }, { status: 500 });
  }
}
