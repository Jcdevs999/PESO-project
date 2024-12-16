import connectDB from '@/db/config'; // Adjust the import as needed
import labor from '@/models/laborModels'; // Adjust the import as needed
import data from '@/models/dataModels'; // Import the model for the "data" collection
import { NextResponse } from 'next/server';

interface LaborData {
  Year: number;
  lfp_Rate: number;
  employ_Rate: number;
  unemploy_Rate: number;
}

interface UnemployedData {
  _id: number;
  totalUnemployed: number;
}

export async function GET() {
  await connectDB();
  console.log('Connected to MongoDB');
  try {
    // Fetch all labor data
    const results = await labor.find({}).lean();
    // console.log('Labor Data:', results);

    // Type assertion to make TypeScript happy
    const laborData = results as unknown as LaborData[];
    // console.log('Typed Labor Data:', laborData);

    // Aggregate total unemployed data per year
    const years = [2018, 2019, 2020, 2021, 2022, 2023];
    const totalUnemployedPerYear: UnemployedData[] = await data.aggregate([
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

    // Convert the aggregated data into a map for easy lookup
    const unemployedMap: { [key: number]: number } = {};
    totalUnemployedPerYear.forEach(item => {
      unemployedMap[item._id] = item.totalUnemployed;
    });

    const total_population = 2960048;
    const responseData = laborData.map(item => {
      const year = item.Year;
      const lfpRate = item.lfp_Rate; // Labor Force Participation Rate
      const employRate = item.employ_Rate; // Employment Rate
      const totalUnemployed = unemployedMap[year] || 0; // Use the aggregated unemployed count for the year

      // Calculate total labor force based on LFPR and working age population
      const totalLaborForce = (lfpRate / 100) * total_population;
      const totalLF = Math.round(totalLaborForce);

      return {
        year,
        lfp_Rate: lfpRate,
        employ_Rate: employRate,
        unemploy_Rate: item.unemploy_Rate, // Use the existing unemployment rate from the item
        totalLF, // Absolute number of people in the labor force
        totalEmployed: totalLF - totalUnemployed, // Calculate total employed using the retrieved total unemployed
        totalUnemployed, // Total Unemployed Count for the year
      };
    });

    // console.log('Yearly Data:', responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching labor data:', error);
    return NextResponse.json({ message: 'Error fetching labor data', error }, { status: 500 });
  }
};
