//skills api

import { NextResponse } from 'next/server';
import connectDB from '@/db/config';
import dataModelo from '@/models/dataModels';

export async function GET() {
  await connectDB();
  console.log('Connected to MongoDB');

  try {
    // Use MongoDB distinct method to get unique 'SkillsAcquired'
    const skills = await dataModelo.distinct('SkillsAcquired');

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
  }
}

// import { NextResponse } from 'next/server';
// import connectDB from '@/db/config';
// import dataModelo from '@/models/dataModels';

// export async function GET() {
//   await connectDB();
//   console.log('Connected to MongoDB');

//   try {
//     // MongoDB aggregation to get distinct 'skillsAcquired' and limit the results
//     const data = await dataModelo.aggregate([
//         { $group: { _id: "$SkillsAcquired" } },
//         { $limit: 10000 }
//     ]);
    
//     const data = await dataModelo.distinct('SkillsAcquired');

//     // Convert the result to a simple array of 'skillsAcquired'
//     const skills = data.map(item => item._id);
//     return NextResponse.json(skills);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
//     }

// }
