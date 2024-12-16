import { NextResponse } from "next/server";
import connectDB from '@/db/config';
import mongoose from 'mongoose';

export async function GET() {
  await connectDB();
  console.log('Connected to MongoDB');

  try {
    const db = mongoose.connection;

    // Fetch unemployment rate data from labor_data collection
    const rawLaborData = await db.collection('labor_data').find({}).toArray();

    if (!rawLaborData.length) {
      console.log('No labor data found.');
      return NextResponse.json({ message: 'No labor data found' });
    }

    // Extract relevant unemployment rate data
    const unemploymentRates = rawLaborData.map(item => ({
      id: item._id,
      year: item.Year,
      unemploymentRate: item.unemploy_Rate,
    }));

    return NextResponse.json(unemploymentRates);
  } catch (error) {
    console.error('Error fetching labor data:', error);
    return NextResponse.json({ error: 'Failed to fetch labor data' }, { status: 500 });
  }
}
