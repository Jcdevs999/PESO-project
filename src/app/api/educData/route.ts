import { NextResponse } from "next/server";
import connectDB from '@/db/config';
import dataModelo from '@/models/dataModels';

export async function GET() {
  await connectDB();
  console.log('Connected to MongoDB');
  try {
    const results = await dataModelo.aggregate([
      {
        $group: {
          _id: "$HighestLevel", // Group by educational attainment
          totalUnemployed: { $sum: 1 } // Count total unemployed
        }
      },
      {
        $project: {
          educationalAttainment: "$_id", // Rename _id to educationalAttainment
          totalUnemployed: 1,
          _id: 0 // Exclude the default _id field
        }
      }
    ]);

    console.log('Educational Attainment Data:', results);

    // Ensure missing categories are added with zero unemployment
    const categories = [
      "Elementary Level",
      "Elementary Graduate",
      "Junior High School Level",
      "Junior High School Graduate",
      "Senior High School Level",
      "Senior High School Graduate",
      "Vocational Level",
      "Vocational Graduate",
      "College Level",
      "College Graduate"
    ];

    const formattedResults = categories.map(category => {
      const match = results.find(item => item.educationalAttainment === category);
      return {
        educationalAttainment: category,
        totalUnemployed: match ? match.totalUnemployed : 0
      };
    });

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Error fetching educational attainment data:', error);
    return NextResponse.json({ message: 'Error fetching educational attainment data', error }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import connectDB from '@/db/config';
// import dataModelo from '@/models/dataModels';

// export async function GET() {
//   await connectDB();
//   console.log('Connected to MongoDB');
//   try {
//     const results = await dataModelo.aggregate([
//       {
//         $group: {
//           _id: "$HighestLevel", // Group by educational attainment
//           totalUnemployed: { $sum: 1 } // Count total unemployed
//         }
//       },
//       {
//         $project: {
//           educationalAttainment: "$_id", // Rename _id to educationalAttainment
//           totalUnemployed: 1,
//           _id: 0 // Exclude the default _id field
//         }
//       }
//     ]);

//     console.log('Educational Attainment Data:', results);

//     return NextResponse.json(results);
//   } catch (error) {
//     console.error('Error fetching educational attainment data:', error);
//     return NextResponse.json({ message: 'Error fetching educational attainment data', error }, { status: 500 });
//   }
// }
