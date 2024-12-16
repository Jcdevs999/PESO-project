import { NextResponse } from 'next/server';
import connectDB from '@/db/config';
import dataModelo from '@/models/dataModels';

export async function GET() {
  await connectDB();
  console.log('Connected to MongoDB');

  try {
    // console.log('Attempting to fetch data from DB');
    const data = await dataModelo.find({});  //.limit(1000)
    // console.log('Fetched Data from DB:', data); // Log to check the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
  }
}
