import { NextResponse } from "next/server";
import connectDB from '@/db/config';
import dataModelo from '@/models/dataModels';

export async function GET() {
  await connectDB();
  console.log('Connected to MongoDB');
  try {
    const years = [2018, 2019, 2020, 2021, 2022, 2023];

    const results = await dataModelo.aggregate([
      {
        $match: {
          DateAdded: { $exists: true }
        }
      },
      {
        $project: {
          year: { $year: { $toDate: "$DateAdded" } }
        }
      },
      {
        $match: {
          year: { $in: years }
        }
      },
      {
        $group: {
          _id: "$year",
          totalUnemployed: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // console.log('Aggregation Result:', results);

    const yearData = results.reduce((acc, result) => {
      acc.years.push(result._id);
      acc.unemployed.push(result.totalUnemployed);
      return acc;
    }, { years: [], unemployed: [] });

    console.log('Year Data:', yearData);

    return NextResponse.json(yearData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
  }
};
