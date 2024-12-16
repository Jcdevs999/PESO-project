import { NextResponse } from 'next/server'; 
import * as xlsx from 'xlsx';
import Papa from 'papaparse';
import connectDB from '@/db/config';
// import data from '@/models/dataModels'; 
import data from '@/models/testModels'; 
import { cleanData } from '@/utils/dataCleaningUtils'; 
import { cramers_v } from '@/utils/correlationUtils'; 

connectDB();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ msg: 'No files uploaded.' }, { status: 400 });
    }

    const allEncodedData: any[] = []; // Store all encoded data for correlation matrix
    const correlationMatrix: Record<string, Record<string, number>> = {};
    const categories = ['isMale', 'Age', 'SkillsAcquired', 'HighestLevel'];

    for (const file of files) {
      const fileBuffer = await file.arrayBuffer();  
      const fileExtension = file.name.split('.').pop();
      let parsedData: any[] = [];

      if (fileExtension === 'csv') {
        const text = new TextDecoder().decode(fileBuffer);
        parsedData = Papa.parse(text, { header: true }).data;
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        parsedData = xlsx.utils.sheet_to_json(worksheet);
      }

      const cleanedData = cleanData(parsedData);

      // Encoding categorical data for correlation
      const encodedData = cleanedData.map(item => ({
        isMale: item.isMale === "Male" ? 1 : 0, // Encoding 'isMale'
        Age: item.Age, // Age remains numerical
        SkillsAcquired: encodeSkills(item.SkillsAcquired), // Encoding SkillsAcquired
        HighestLevel: encodeEducationLevel(item.HighestLevel) // Encoding HighestLevel
      }));

      allEncodedData.push(...encodedData); // Add encoded data to the cumulative array

      console.log("Encoded data for correlation matrix:", encodedData);

      await data.insertMany(cleanedData);
    }

    // Calculate the correlation matrix after processing all files
    for (let i = 0; i < categories.length; i++) {
      for (let j = i; j < categories.length; j++) {
        const cat1 = categories[i];
        const cat2 = categories[j];
        correlationMatrix[cat1] = correlationMatrix[cat1] || {};
        correlationMatrix[cat2] = correlationMatrix[cat2] || {};
        const correlationValue = cramers_v(allEncodedData.map(item => item[cat1]), allEncodedData.map(item => item[cat2]));
        correlationMatrix[cat1][cat2] = correlationValue;
        correlationMatrix[cat2][cat1] = correlationValue; // Symmetric
      }
    }

    console.log("Correlation matrix:", correlationMatrix);
    return NextResponse.json({ msg: 'File(s) uploaded and cleaned successfully!', correlationMatrix }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ msg: 'Error processing request.' }, { status: 500 });
  }
}

// Helper function to encode skills
function encodeSkills(skill: string): number {
  const skillMap: Record<string, number> = {
    
      "Academic Skills": 1,
      "Accounting Skills": 2,
      "Administrative Skills": 3,
      "Advanced Computer Skills": 4,
      "Agricultural Skills": 5,
      "Airport Operations Manager": 6,
      "Analytical Skills": 7,
      "Assembly Skills": 8,
      "Assessment and Evaluation": 9,
      "Automotive Repair Skills": 10,
      "Automotive Skills": 11,
      "Baking Skills": 12,
      "Beauty and Personal Care Skills": 13,
      "Biology Skills": 14,
      "Business Skills": 15,
      "Career Development Skills": 16,
      "Carpentry": 17,
      "Chemical Engineering Skills": 18,
      "Child Development Skills": 19,
      "Classroom Management": 20,
      "Clerical": 21,
      "Communication Skills": 22,
      "Community Development Skills": 23,
      "Compliance Skills": 24,
      "Computer Aided Design Skills": 25,
      "Computer Literacy": 26,
      "Computer-Aided Design Skills": 27,
      "Construction Management": 28,
      "Construction Skills": 29,
      "Cosmetic and Personal Care Skills": 30,
      "Counselling Skills": 31,
      "Craftmanship": 32,
      "Creative Design": 33,
      "Creative Skills": 34,
      "Culinary Production Skills": 35,
      "Culinary Skills": 36,
      "Customer Service Skills": 37,
      "Data Management": 38,
      "Design Skills": 39,
      "Digital Marketing": 40,
      "Digital Media Skills": 41,
      "Educational Skills": 42,
      "Electrical Skills": 43,
      "Electronics Repair Skills": 44,
      "Engineering Skills": 45,
      "Entrepreneurial Skills": 46,
      "Environmental Skills": 47,
      "Equipment Operation": 48,
      "Event Management Skills": 49,
      "Facility Maintenance Skills": 50,
      "Field Work": 51,
      "Financial Skills": 52,
      "Food & Beverage Skills": 53,
      "Food Safety": 54,
      "General Assistance": 55,
      "General Training Skills": 56,
      "Graphic Design Skills": 57,
      "Health and Emergency Medical Skills": 58,
      "Health and Safety Skills": 59,
      "Health and Wellness Skills": 60,
      "Health provider": 61,
      "Healthcare Service": 62,
      "Healthcare Skills": 63,
      "Heavy Equipment Operation": 64,
      "Hospitality Skills": 65,
      "Human Resources": 66,
      "HVAC Skills": 67,
      "Interpersonal Skills": 68,
      "Inventory Management": 69,
      "Laborer": 70,
      "Landscape Artist": 71,
      "Laundry": 72,
      "Leadership Skills": 73,
      "Leadman": 74,
      "Learning Skills": 75,
      "Legal": 76,
      "Logistics": 77,
      "Machine Operation": 78,
      "Maintenance Skills": 79,
      "Management Skills": 80,
      "Manual Labor Skills": 81,
      "Manufacturing and Production Skills": 82,
      "Marine Engineering": 83,
      "Maritime Skills": 84,
      "Marketing Skills": 85,
      "Mason": 86,
      "Massage Therapist": 87,
      "Materials Engineer": 88,
      "Mathematical Skills": 89,
      "Meat Cutting and Processing": 90,
      "Mechanical Engineering": 91,
      "Mechanical Skills": 92,
      "Medical Technology": 93,
      "No Skill": 94,
      "Operator": 95,
      "Organizational Skills": 96,
      "Paint Mixing": 97,
      "Painter": 98,
      "Performance Arts": 99,
      "Performing Arts": 100,
      "Pipeline Engineer": 101,
      "Poultry Husbandry": 102,
      "Presentation Skills": 103,
      "Product Knowledge": 104,
      "Production Knowledge": 105,
      "Production": 106,
      "Project Management": 107,
      "Public Health": 108,
      "Public Service": 109,
      "Quality Control": 110,
      "Regulatory Knowledge": 111,
      "Research Skills": 112,
      "Retail Skills": 113,
      "Risk Assessment": 114,
      "Safety": 115,
      "Safety and Emergency Response Skills": 116,
      "Seafaring Skills": 117,
      "Security Skills": 118,
      "Social Services": 119,
      "Soft Skills": 120,
      "Sports Skills": 121,
      "Statistician": 122,
      "Stenography Skills": 123,
      "Strategic Skills": 124,
      "Surveying": 125,
      "System Analytical Skills": 126,
      "Teaching Skills": 127,
      "Technical Skills": 128,
      "Technical Staff": 129,
      "Technical Support": 130,
      "Technician": 131,
      "Telecommunications": 132,
      "Therapeutical Skills": 133,
      "Tool and Equipment Knowledge": 134,
      "Trade Skills": 135,
      "Transportation Skills": 136,
      "Vocational Skills": 137,
      "Welding": 138,
      "Housekeeping": 139
    // Add more skills as needed
  };
  return skillMap[skill] || 0; // Default to 0 for unknown skills
}

// Helper function to encode educational levels
function encodeEducationLevel(level: string): number {
  const levelMap: Record<string, number> = {
    "Elementary Level" : 1,
    "Elementary Graduate": 2,
    "Junior High School Level": 3,
    "Junior High School Graduate": 4,
    "Senior High School Level": 5,
    "Senior High School Graduate": 6,
    "Vocational Level": 7,
    "Vocational Graduate": 8,
    "College Level": 9,
    "College Graduate": 10,
    // Add more levels as needed
  };
  return levelMap[level] || 0; // Default to 0 for unknown levels
}


// import { NextResponse } from 'next/server'; 
// import * as xlsx from 'xlsx';
// import Papa from 'papaparse';
// import connectDB from '@/db/config';
// import data from '@/models/dataModels'
// // import data from '@/models/testModels'; 
// import { cleanData } from '@/utils/dataCleaningUtils'; // Import the cleaning utility

// // Ensure the MongoDB connection is established
// connectDB();

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const files = formData.getAll('files') as File[];

//     console.log("Files received:", files);  // Log received files

//     if (!files || files.length === 0) {
//       return NextResponse.json({ msg: 'No files uploaded.' }, { status: 400 });
//     }

//     for (const file of files) {
//       const fileBuffer = await file.arrayBuffer();  // Read the file as a buffer

//       // Check file extension
//       const fileExtension = file.name.split('.').pop();
//       console.log("Processing file:", file.name, "with extension:", fileExtension);

//       let parsedData: any[] = [];

//       if (fileExtension === 'csv') {
//         // Parse CSV file
//         const text = new TextDecoder().decode(fileBuffer);
//         parsedData = Papa.parse(text, { header: true }).data;
//         console.log("Parsed CSV data:", parsedData);  // Log parsed data
//       } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
//         // Parse Excel file
//         const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];
//         parsedData = xlsx.utils.sheet_to_json(worksheet);
//         console.log("Parsed Excel data:", parsedData);  // Log parsed data
//       }

//       // Clean parsed data
//       const cleanedData = cleanData(parsedData); // Clean the data
//       console.log("Cleaned data:", cleanedData); // Log cleaned data

//       // Insert cleaned data into the MongoDB database
//       try {
//         await data.insertMany(cleanedData);
//         console.log("Data successfully inserted into the database.");
//       } catch (err) {
//         console.error("Error saving data to the database:", err);
//         return NextResponse.json({ msg: 'Error saving data to the database.' }, { status: 500 });
//       }
//     }

//     return NextResponse.json({ msg: 'Files uploaded and processed successfully!' }, { status: 200 });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json({ msg: 'Error processing request.' }, { status: 500 });
//   }
// }
// // // Server-side handler in Next.js

// // import { NextResponse } from 'next/server';
// // import xlsx from 'xlsx';
// // import Papa from 'papaparse';
// // import connectDB from '@/db/config';
// // // import data from '@/models/dataModels'; // Adjust the import path
// // import data from '@/models/testModels'; 

// // // Ensure the MongoDB connection is established
// // connectDB();

// // export async function POST(req: Request) {
// //   try {
// //     const formData = await req.formData();
// //     const files = formData.getAll('files') as File[];

// //     console.log("Files received:", files);  // Log received files

// //     if (!files || files.length === 0) {
// //       return NextResponse.json({ msg: 'No files uploaded.' }, { status: 400 });
// //     }

// //     for (const file of files) {
// //       const fileBuffer = await file.arrayBuffer();  // Read the file as a buffer

// //       // Check file extension
// //       const fileExtension = file.name.split('.').pop();
// //       console.log("Processing file:", file.name, "with extension:", fileExtension);

// //       let parsedData: any[] = [];

// //       if (fileExtension === 'csv') {
// //         // Parse CSV file
// //         const text = new TextDecoder().decode(fileBuffer);
// //         parsedData = Papa.parse(text, { header: true }).data;
// //         console.log("Parsed CSV data:", parsedData);  // Log parsed data
// //       } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
// //         // Parse Excel file
// //         const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
// //         const firstSheetName = workbook.SheetNames[0];
// //         const worksheet = workbook.Sheets[firstSheetName];
// //         parsedData = xlsx.utils.sheet_to_json(worksheet);
// //         console.log("Parsed Excel data:", parsedData);  // Log parsed data
// //       }

// //       // Insert parsed data into the MongoDB database
// //       try {
// //         await data.insertMany(parsedData);
// //         console.log("Data successfully inserted into the database.");
// //       } catch (err) {
// //         console.error("Error saving data to the database:", err);
// //         return NextResponse.json({ msg: 'Error saving data to the database.' }, { status: 500 });
// //       }
// //     }

// //     return NextResponse.json({ msg: 'Files uploaded and processed successfully!' }, { status: 200 });
// //   } catch (error) {
// //     console.error("Error processing request:", error);
// //     return NextResponse.json({ msg: 'Error processing request.' }, { status: 500 });
// //   }
// // }


// // import { NextResponse } from 'next/server';
// // import * as xlsx from 'xlsx';
// // import Papa from 'papaparse';
// // import connectDB from '@/db/config';
// // import Test from '@/models/testModels'; 
// // import { cleanData } from '@/utils/dataCleaningUtils';

// // // Ensure MongoDB connection is established
// // connectDB();
// // console.log('Connected to MongoDB');

// // export async function POST(req: Request) {
// //   console.log("Received POST request");

// //   try {
// //     // Parse form data and extract files
// //     const formData = await req.formData();
// //     const files = formData.getAll('files') as File[];

// //     console.log("Files received:", files);

// //     if (!files || files.length === 0) {
// //       console.error("No files uploaded.");
// //       return NextResponse.json({ msg: 'No files uploaded.' }, { status: 400 });
// //     }

// //     const insertPromises: Promise<any>[] = []; // Store insertion promises

// //     for (const file of files) {
// //       const fileBuffer = await file.arrayBuffer();
// //       const fileExtension = file.name.split('.').pop()?.toLowerCase();
// //       console.log("Processing file:", file.name, "with extension:", fileExtension);

// //       let parsedData: any[] = [];

// //       // File parsing
// //       if (fileExtension === 'csv') {
// //         const text = new TextDecoder().decode(fileBuffer);
// //         parsedData = Papa.parse(text, { header: true }).data;
// //       } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
// //         const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
// //         const firstSheetName = workbook.SheetNames[0];
// //         const worksheet = workbook.Sheets[firstSheetName];
// //         parsedData = xlsx.utils.sheet_to_json(worksheet);
// //       } else {
// //         console.error(`Unsupported file type: ${fileExtension}`);
// //         return NextResponse.json({ msg: 'Unsupported file type.' }, { status: 400 });
// //       }

// //       // Clean the data
// //       // const cleanedData = cleanData(parsedData);
// //       const cleanedData = parsedData; // Directly use parsed data for testing
// //       console.log('Length of cleaned data:', cleanedData.length);

// //       // Check if any entries are missing the 'HighestLevel' field
// //       const missingFieldEntries = cleanedData.filter(item => !item.HighestLevel);
// //       if (missingFieldEntries.length > 0) {
// //         console.log("Entries missing HighestLevel:", missingFieldEntries);
// //         // Optionally, return an error response or handle missing fields here
// //       }

// //       // Insert cleaned data into MongoDB
// //       insertPromises.push(Test.insertMany(cleanedData));
// //     }

// //     await Promise.all(insertPromises);
// //     console.log("Data successfully inserted into the database.");
// //     return NextResponse.json({ msg: 'Files uploaded and processed successfully!' }, { status: 200 });

// //   } catch (error) {
// //     console.error("Error processing request:", error);
// //     return NextResponse.json({ msg: 'Error processing request.' }, { status: 500 });
// //   }
// // }
