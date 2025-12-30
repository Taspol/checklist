import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'tables.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET - Retrieve all tables
export async function GET() {
  try {
    await ensureDataDir();
    
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      return NextResponse.json(JSON.parse(data), { headers: corsHeaders });
    } catch {
      // If file doesn't exist, return empty array
      return NextResponse.json([], { headers: corsHeaders });
    }
  } catch (error) {
    console.error('Error reading tables:', error);
    return NextResponse.json({ error: 'Failed to read tables' }, { status: 500, headers: corsHeaders });
  }
}

// POST - Save all tables
export async function POST(request: Request) {
  try {
    await ensureDataDir();
    const tables = await request.json();
    await fs.writeFile(DATA_FILE, JSON.stringify(tables, null, 2));
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error saving tables:', error);
    return NextResponse.json({ error: 'Failed to save tables' }, { status: 500, headers: corsHeaders });
  }
}
