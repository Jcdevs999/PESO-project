import { NextResponse } from "next/server";
import connectDB from '@/db/config';
import mongoose from 'mongoose';
import gdpModelo from '@/models/gdpModels'; // Ensure correct import path

export async function GET() {
  await connectDB();
  console.log('Connected to MongoDB');
  
  try {
    const db = mongoose.connection;
    const rawGDPData = await db.collection('gdp_data').find({}).toArray(); // Use raw MongoDB query
    // console.log('Raw GDP Data:', rawGDPData);

    if (!rawGDPData.length) {
      console.log('No GDP data found.');
      return NextResponse.json({ message: 'No GDP data found' });
    }

    const gdpYears: string[] = [];
    const gdpValues: any[] = [];

    // Process the data to extract years and At_Constant_Prices values
    rawGDPData.forEach(item => {
      const currentPrices = item.At_Current_Prices || {};
      Object.keys(currentPrices).forEach(year => {
        if (!gdpYears.includes(year)) {
          gdpYears.push(year);
          gdpValues.push(currentPrices[year]);
        }
      });
    });

    // console.log('Processed GDP Years:', gdpYears);
    // console.log('Processed GDP Values:', gdpValues);

    return NextResponse.json({
      years: gdpYears,
      values: gdpValues,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
  }
}



// Testing

// export async function GET() {
//   await connectDB();
//   const db = mongoose.connection;
//   console.log('Connected to MongoDB');

//   try {
//     const rawGDPData = await db.collection('gdp_data').find({}).toArray(); // Use raw MongoDB query
//     console.log('Raw GDP Data:', rawGDPData);

//     if (!rawGDPData.length) {
//       console.log('No GDP data found.');
//       return NextResponse.json({ message: 'No GDP data found' });
//     }

//     return NextResponse.json(rawGDPData); // Return raw data for debugging
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
//   }
// }

