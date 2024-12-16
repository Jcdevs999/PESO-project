import { NextResponse } from "next/server";
import connectDB from '@/db/config';
import dataModelo from '@/models/dataModels';

export async function GET() {
    await connectDB();
    console.log('Connected to MongoDB');
    try {
        const years = [2018, 2019, 2020, 2021, 2022, 2023];

        // Aggregate query for demographic and education data
        const demographicEducationData = await dataModelo.aggregate([
            {
                $addFields: {
                    year: {
                        $year: {
                            $dateFromString: { 
                                dateString: "$DateAdded", 
                                format: "%m/%d/%Y" 
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    year: { $in: years }
                }
            },
            {
                $group: {
                    _id: "$year", // Group by year
                    totalSkills: { $sum: { $cond: [{ $ne: ["$SkillsAcquired", ""] }, 1, 0] } }, // Count non-empty SkillsAcquired
                    totalEducation: { $sum: { $cond: [{ $ne: ["$HighestLevel", ""] }, 1, 0] } }, // Count non-empty HighestLevel
                    totalGenderMale: { $sum: { $cond: [{ $eq: ["$isMale", "Male"] }, 1, 0] } }, // Count males
                    totalGenderFemale: { $sum: { $cond: [{ $eq: ["$isMale", "Female"] }, 1, 0] } }, // Count females
                    totalAgeGroup: { $sum: { $cond: [{ $ne: ["$Age", null] }, 1, 0] } } // Count non-null Age entries
                }
            },
            { $sort: { _id: 1 } } // Sort by year in ascending order
        ]);

        if (!demographicEducationData || demographicEducationData.length === 0) {
            return NextResponse.json({ message: 'No data found for the specified years' }, { status: 404 });
        }

        // Return the aggregated data
        return NextResponse.json(demographicEducationData, { status: 200 });
    } catch (error) {
        console.error("Error fetching demographic and education data:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
