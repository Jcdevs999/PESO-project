import { NextResponse } from "next/server";
import connectDB from '@/db/config';
import dataModelo from '@/models/dataModels';

export async function GET() {
  await connectDB();
  console.log('Connected to MongoDB');
  try {
    const years = [2018, 2019, 2020, 2021, 2022, 2023]; // Define historical years

    const results = await dataModelo.aggregate([
      {
        $match: {
          DateAdded: { $exists: true } // Only include entries with DateAdded
        }
      },
      {
        $project: {
          year: { $year: { $toDate: "$DateAdded" } }, // Extract year from DateAdded
          isMale: {
            $cond: [
              { $eq: ["$isMale", "Male"] },
              true,
              { $cond: [{ $eq: ["$isMale", "Female"] }, false, null] } // Handle "Male", "Female", and other cases
            ]
          }
        }
      },
      {
        $match: {
          year: { $in: years }, // Filter for relevant years
          isMale: { $in: [true, false] } // Ensure gender data is valid
        }
      },
      {
        $group: {
          _id: { year: "$year", isMale: "$isMale" },
          totalUnemployed: { $sum: 1 } // Count entries per gender per year
        }
      },
      {
        $group: {
          _id: "$_id.year",
          maleUnemployed: {
            $sum: {
              $cond: [{ $eq: ["$_id.isMale", true] }, "$totalUnemployed", 0]
            }
          },
          femaleUnemployed: {
            $sum: {
              $cond: [{ $eq: ["$_id.isMale", false] }, "$totalUnemployed", 0]
            }
          }
        }
      },
      {
        $project: {
          year: "$_id",
          maleUnemployed: { $ifNull: ["$maleUnemployed", 0] },
          femaleUnemployed: { $ifNull: ["$femaleUnemployed", 0] },
          _id: 0
        }
      },
      {
        $sort: { year: 1 }
      }
    ]);

    // Ensure each year is represented in the results
    const filledResults = years.map(year => {
      const yearData = results.find(r => r.year === year);
      return yearData || { year, maleUnemployed: 0, femaleUnemployed: 0 };
    });

    console.log('Gender Data by Year:', filledResults);

    return NextResponse.json(filledResults);
  } catch (error) {
    console.error('Error fetching gender data:', error);
    return NextResponse.json({ message: 'Error fetching gender data', error }, { status: 500 });
  }
};


// import { NextResponse } from "next/server";
// import connectDB from '@/db/config';
// import dataModelo from '@/models/dataModels';

// export async function GET() {
//   await connectDB();
//   console.log('Connected to MongoDB');
//   try {
//     const results = await dataModelo.aggregate([
//       {
//         $match: {
//           DateAdded: {
//             $gte: new Date("2024-01-01T00:00:00.000Z"),
//             $lt: new Date("2025-01-01T00:00:00.000Z")
//           }
//         }
//       },
//       {
//         $group: {
//           _id: "$isMale", 
//           totalUnemployed: { $sum: 1 } // Count total unemployed for each gender in 2024
//         }
//       },
//       {
//         $project: {
//           isMale: "$_id",
//           totalUnemployed: 1,
//           _id: 0 // Exclude the default _id field
//         }
//       }
//     ]);
    

//     console.log('Gender Data:', results);

//     return NextResponse.json(results);
//   } catch (error) {
//     console.error('Error fetching gender data:', error);
//     return NextResponse.json({ message: 'Error fetching gender data', error }, { status: 500 });
//   }
// };
