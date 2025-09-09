import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATABASES = {
  projects: path.join(process.cwd(), 'src/database/projects.json'),
  people: path.join(process.cwd(), 'src/database/people.json'),
  facilities: path.join(process.cwd(), 'src/data/facilities.ts'),
  news: path.join(process.cwd(), 'src/data/news.ts')
};

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${timestamp}`;

    const backupData: any = {};

    // Backup all databases
    for (const [dbName, dbPath] of Object.entries(DATABASES)) {
      if (fs.existsSync(dbPath)) {
        if (dbName === 'facilities' || dbName === 'news') {
          // TypeScript files
          backupData[dbName] = fs.readFileSync(dbPath, 'utf-8');
        } else {
          // JSON files
          backupData[dbName] = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        }
      }
    }

    // Save backup
    const backupPath = path.join(BACKUP_DIR, `${backupName}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Backup created successfully',
      backupName,
      path: backupPath
    });

  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const stats = fs.statSync(path.join(BACKUP_DIR, file));
        return {
          name: file.replace('.json', ''),
          date: stats.mtime.toISOString(),
          size: stats.size
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(backups);

  } catch (error) {
    console.error('List backups error:', error);
    return NextResponse.json({ error: 'Failed to list backups' }, { status: 500 });
  }
}
