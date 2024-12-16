import { NextResponse } from 'next/server';
import connectDB from '@/db/config';
import dataModelo from '@/models/dataModels';

export async function GET() {
  await connectDB();
  console.log('Connected to MongoDB');

  try {
    // Use MongoDB distinct method to get unique 'SkillsAcquired'
    const skills = await dataModelo.distinct('Age');

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
  }
}
