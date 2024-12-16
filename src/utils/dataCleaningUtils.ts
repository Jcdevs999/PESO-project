import _ from 'lodash';
import fs from 'fs/promises';
import path from 'path';
import similarity from 'string-similarity';

// Correct spellings locked for specific fields
const fieldCorrections: { [key: string]: string[] } = {
  SkillsAcquired: 
  [
"Academic Skills",
"Accounting Skills",
"Administrative Skills",
"Advanced Computer Skills",
"Agricultural Skills",
"Airport Operations Manager",
"Analytical Skills",
"Assembly Skills",
"Assessment and Evaluation",
"Automotive Repair Skills",
"Automotive Skills",
"Baking Skills",
"Beauty and Personal Care Skills",
"Biology Skills",
"Business Skills",
"Career Development Skills",
"Carpentry",
"Chemical Engineering Skills",
"Child Development Skills",
"Classroom Management",
"Clerical",
"Communication Skills",
"Community Development Skills",
"Compliance Skills",
"Computer Aided Design Skills",
"Computer Literacy",
"Computer-Aided Design Skills",
"Construction Management",
"Construction Skills",
"Cosmetic and Personal Care Skills",
"Counselling Skills",
"Craftmanship",
"Creative Design",
"Creative Skills",
"Culinary Production Skills",
"Culinary Skills",
"Customer Service Skills",
"Data Management",
"Design Skills",
"Digital Marketing",
"Digital Media Skills",
"Educational Skills",
"Electrical Skills",
"Electronics Repair Skills",
"Engineering Skills",
"Entrepreneurial Skills",
"Environmental Skills",
"Equipment Operation",
"Event Management Skills",
"Facility Maintenance Skills",
"Field Work",
"Financial Skills",
"Food & Beverage Skills",
"Food Safety",
"General Assistance",
"General Training Skills",
"Graphic Design Skills",
"Health and Emergency Medical Skills",
"Health and Safety Skills",
"Health and Wellness Skills",
"Health provider",
"Healthcare Service",
"Healthcare Skills",
"Heavy Equipment Operation",
"Hospitality Skills",
"Housekeeping",
"Human Resources",
"HVAC Skills",
"Interpersonal Skills",
"Inventory Management",
"Laborer",
"Landscape Artist",
"Laundry",
"Leadership Skills",
"Leadman",
"Learning Skills",
"Legal",
"Logistics",
"Machine Operation",
"Maintenance Skills",
"Management Skills",
"Manual Labor Skills",
"Manufacturing and Production Skills",
"Marine Engineering",
"Maritime Skills",
"Marketing Skills",
"Mason",
"Massage Therapist",
"Materials Engineer",
"Mathematical Skills",
"Meat Cutting and Processing",
"Mechanical Engineering",
"Mechanical Skills",
"Medical Technology",
"No Skill",
"Operator",
"Organizational Skills",
"Paint Mixing",
"Painter",
"Performance Arts",
"Performing Arts",
"Pipeline Engineer",
"Poultry Husbandry",
"Presentation Skills",
"Product Knowledge",
"Production Knowledge",
"Production",
"Project Management",
"Public Health",
"Public Service",
"Quality Control",
"Regulatory Knowledge",
"Research Skills",
"Retail Skills",
"Risk Assessment",
"Safety",
"Safety and Emergency Response Skills",
"Seafaring Skills",
"Security Skills",
"Social Services",
"Soft Skills",
"Sports Skills",
"Statistician",
"Stenography Skills",
"Strategic Skills",
"Surveying",
"System Analytical Skills",
"Teaching Skills",
"Technical Skills",
"Technical Staff",
"Technical Support",
"Technician",
"Telecommunications",
"Therapeutical Skills",
"Tool and Equipment Knowledge",
"Trade Skills",
"Transportation Skills",
"Vocational Skills",
"Welding",

"Driving",
"Web Design",
"Graphic Design",
"Data Analysis",
"Carpenter",
"Athlete",
"Computer Literate",
"Event Manager",
"Janitorial",
"Carpenter Literate",
// Add skills here, if needed.


  ],
  HighestLevel: ['Elementary Level', 'Elementary Graduate', 'Junior High School Level', 'Junior High School Graduate', 
    'Senior High School Level', 'Senior High School Graduate', 'Vocational Level', 'Vocational Graduate', 
     'College Level','College Graduate','High School'],
};

// Correct spelling for a specific field based on locked correct spellings
const correctFieldSpelling = (field: string, text: string): string => {
  const correctValues = fieldCorrections[field];

  // Handle SkillsAcquired with fuzzy matching
  if (field === 'SkillsAcquired' && correctValues) {
    const matches = similarity.findBestMatch(text, correctValues);
    if (matches.bestMatch.rating >= 0.7) {
      return matches.bestMatch.target; // Return the best match if above threshold
    }
  }

  // Fuzzy matching for other fields
  if (correctValues) {
    const matches = similarity.findBestMatch(text, correctValues);
    if (matches.bestMatch.rating >= 0.7) {
      return matches.bestMatch.target; // Return the best match if above threshold
    }
  }

  // Check for any specific common spelling mistakes and correct them
  const commonMistakes: { [key: string]: string } = {
    // Add more common misspellings here
  };

  return commonMistakes[text] || text; // Return corrected value or original text
};

// Data structure
export interface DataRow {
  [key: string]: any;
}

// Clean data by trimming and correcting spelling for each specified field independently
export const cleanData = (data: DataRow[]): DataRow[] => {
  return data.map((row, index) => {
    const cleanedRow: DataRow = { ...row };
    for (const key in cleanedRow) {
      if (typeof cleanedRow[key] === 'string') {
        const originalText = cleanedRow[key];
        cleanedRow[key] = correctFieldSpelling(key, originalText).trim();
        console.log(`Row ${index}, Key: ${key}, Original: ${originalText}, Cleaned: ${cleanedRow[key]}`);
      }
    }
    return cleanedRow;
  });
};

// Remove duplicates based on unique keys
export const removeDuplicates = (data: DataRow[], uniqueKeys: string[] = ['ClientId']): DataRow[] => {
  return _.uniqBy(data, (row) => uniqueKeys.map((key) => row[key]).join('|'));
};

// import _ from 'lodash';
// import Hunspell from 'hunspell-spellchecker';
// import fs from 'fs/promises'; // Use promises for async file handling
// import path from 'path';

// // Initialize Hunspell
// const hunspell = new Hunspell();

// // Load dictionary files asynchronously
// const dictionaryPath = path.join(process.cwd(), 'src/utils/dictionary');
// console.log('Loading dictionary files from:', dictionaryPath); // Log the dictionary path

// const loadDictionary = async () => {
//   try {
//     const affData = await fs.readFile(path.join(dictionaryPath, 'en_US.aff'), 'utf8');
//     const dicData = await fs.readFile(path.join(dictionaryPath, 'en_US.dic'), 'utf8');

//     // Use the dictionary with Hunspell
//     hunspell.use({ aff: affData, dic: dicData });
//     console.log('Dictionary loaded successfully.');
//   } catch (error) {
//     console.error('Error loading dictionary files:', error);
//   }
// };

// loadDictionary(); // Call the function to load the dictionary

// // Define the structure of your data
// export interface DataRow {
//   [key: string]: any; // Consider defining known properties for type safety
// }

// // Cache for spelling correction
// const spellingCache: { [key: string]: string } = {};

// // Common misspellings dictionary
// const commonMisspellings: { [key: string]: string } = {
//   "Computer Litercy": "Computer Literacy",
//   "Graphic Desin": "Graphic Design",
//   // Add more common misspellings and their corrections here
// };

// // Correct spelling for a given text with caching
// export const correctSpelling = (text: string): string => {
//   if (spellingCache[text]) {
//     return spellingCache[text]; // Return cached result if available
//   }

//   try {
//     // Check for common misspellings first
//     if (commonMisspellings[text]) {
//       const correctedText = commonMisspellings[text];
//       spellingCache[text] = correctedText; // Cache the corrected result
//       return correctedText;
//     }

//     const checked = hunspell.check(text);
//     const correctedText = checked ? text : hunspell.suggest(text)[0] || text;
//     spellingCache[text] = correctedText; // Cache the corrected result
//     return correctedText;
//   } catch (error) {
//     console.error('Error in spelling correction:', error);
//     return text; // Return original text on error
//   }
// };

// // Clean data by trimming and correcting spelling for string fields
// export const cleanData = (data: DataRow[]): DataRow[] => {
//   return data.map((row, index) => {
//     const cleanedRow: DataRow = { ...row };
//     for (const key in cleanedRow) {
//       if (typeof cleanedRow[key] === 'string') {
//         const originalText = cleanedRow[key];
//         cleanedRow[key] = correctSpelling(cleanedRow[key]).trim(); // Clean the text
//         console.log(`Row ${index}, Key: ${key}, Original: ${originalText}, Cleaned: ${cleanedRow[key]}`);
//       }
//     }
//     console.log(`Cleaned row ${index}:`, cleanedRow); // Log cleaned row for debugging
//     return cleanedRow; // Return the cleaned row
//   });
// };

// // Remove duplicates based on unique keys
// export const removeDuplicates = (data: DataRow[], uniqueKeys: string[] = ['ClientId']): DataRow[] => {
//   return _.uniqBy(data, (row) => uniqueKeys.map((key) => row[key]).join('|'));
// };

// import _ from 'lodash';
// import Hunspell from 'hunspell-spellchecker';
// import fs from 'fs/promises'; // Use promises for async file handling
// import path from 'path';

// // Initialize Hunspell
// const hunspell = new Hunspell();

// // Load dictionary files asynchronously
// const dictionaryPath = path.join(process.cwd(), 'src/utils/dictionary');
// console.log('Loading dictionary files from:', dictionaryPath); // Log the dictionary path

// const loadDictionary = async () => {
//   try {
//     const affData = await fs.readFile(path.join(dictionaryPath, 'en_US.aff'), 'utf8');
//     const dicData = await fs.readFile(path.join(dictionaryPath, 'en_US.dic'), 'utf8');

//     // Use the dictionary with Hunspell
//     hunspell.use({ aff: affData, dic: dicData });
//     console.log('Dictionary loaded successfully.');
//   } catch (error) {
//     console.error('Error loading dictionary files:', error);
//   }
// };

// loadDictionary(); // Call the function to load the dictionary

// // Define the structure of your data
// export interface DataRow {
//   [key: string]: any; // Consider defining known properties for type safety
// }

// // Cache for spelling correction
// const spellingCache: { [key: string]: string } = {};

// // Correct spelling for a given text with caching
// export const correctSpelling = (text: string): string => {
//   if (spellingCache[text]) {
//     return spellingCache[text]; // Return cached result if available
//   }

//   try {
//     const checked = hunspell.check(text);
//     const correctedText = checked ? text : hunspell.suggest(text)[0] || text;
//     spellingCache[text] = correctedText; // Cache the corrected result
//     return correctedText;
//   } catch (error) {
//     console.error('Error in spelling correction:', error);
//     return text; // Return original text on error
//   }
// };

// // Clean data by trimming and correcting spelling for string fields
// export const cleanData = (data: DataRow[]): DataRow[] => {
//   return data.map((row, index) => {
//     const cleanedRow: DataRow = { ...row };
//     for (const key in cleanedRow) {
//       if (typeof cleanedRow[key] === 'string') {
//         const originalText = cleanedRow[key];
//         cleanedRow[key] = correctSpelling(cleanedRow[key]).trim(); // Clean the text
//         console.log(`Row ${index}, Key: ${key}, Original: ${originalText}, Cleaned: ${cleanedRow[key]}`);
//       }
//     }
//     console.log(`Cleaned row ${index}:`, cleanedRow); // Log cleaned row for debugging
//     return cleanedRow; // Return the cleaned row
//   });
// };

// // Remove duplicates based on unique keys
// export const removeDuplicates = (data: DataRow[], uniqueKeys: string[] = ['ClientId']): DataRow[] => {
//   return _.uniqBy(data, (row) => uniqueKeys.map((key) => row[key]).join('|'));
// };



// import _ from 'lodash';
// import Hunspell from 'hunspell-spellchecker';
// import fs from 'fs';
// import path from 'path';

// // Initialize Hunspell
// const hunspell = new Hunspell();

// // Load dictionary files
// const dictionaryPath = path.join(process.cwd(), 'src/utils/dictionary');

// try {
//   const affData = fs.readFileSync(path.join(dictionaryPath, 'en_US.aff'), 'utf8');
//   const dicData = fs.readFileSync(path.join(dictionaryPath, 'en_US.dic'), 'utf8');

//   // Create the dictionary object
//   const dictionary: { aff: string; dic: string } = {
//     aff: affData,
//     dic: dicData,
//   };

//   // Use the dictionary with Hunspell
//   hunspell.use(dictionary);
// } catch (error) {
//   console.error('Error loading dictionary files:', error);
// }

// // Define the structure of your data
// export interface DataRow {
//   [key: string]: any; // Consider defining known properties for type safety
// }

// // Remove duplicates based on unique keys
// export const removeDuplicates = (data: DataRow[], uniqueKeys: string[] = ['ClientId']): DataRow[] => {
//   return _.uniqBy(data, (row) => uniqueKeys.map((key) => row[key]).join('|'));
// };

// // Correct spelling for a given text
// export const correctSpelling = (text: string): string => {
//   try {
//     const checked = hunspell.check(text);
//     if (checked) {
//       return text; // Return original if correct
//     } else {
//       const suggestions = hunspell.suggest(text);
//       return suggestions.length > 0 ? suggestions[0] : text; // Return first suggestion or original
//     }
//   } catch (error) {
//     console.error('Error in spelling correction:', error);
//     return text; // Return original text on error
//   }
// };

// // Clean data by trimming and correcting spelling for string fields
// export const cleanData = (data: DataRow[]): DataRow[] => {
//   return data.map((row, index) => {
//     const cleanedRow: DataRow = { ...row };
//     for (const key in cleanedRow) {
//       if (typeof cleanedRow[key] === 'string') {
//         const originalText = cleanedRow[key];
//         cleanedRow[key] = correctSpelling(cleanedRow[key]).trim(); // Clean the text
//         console.log(`Row ${index}, Key: ${key}, Original: ${originalText}, Cleaned: ${cleanedRow[key]}`);
//       }
//     }
//     console.log(`Cleaned row ${index}:`, cleanedRow); // Log cleaned row for debugging
//     return cleanedRow; // Return the cleaned row
//   });
// };


// // import _ from 'lodash';
// // import Hunspell from 'hunspell-spellchecker';
// // import fs from 'fs';
// // import path from 'path';

// // // Initialize Hunspell
// // const hunspell = new Hunspell();

// // // Load dictionary files
// // const dictionaryPath = path.join(process.cwd(), 'src/utils/dictionary'); // Changed to process.cwd() for compatibility
// // console.log('Loading dictionary files from:', dictionaryPath); // Log the dictionary path

// // try {
// //   const affData = fs.readFileSync(path.join(dictionaryPath, 'en_US.aff'), 'utf8');
// //   const dicData = fs.readFileSync(path.join(dictionaryPath, 'en_US.dic'), 'utf8');
  
// //   // Create the dictionary object with the correct type
// //   const dictionary: { aff: string; dic: string } = {
// //     aff: affData,
// //     dic: dicData,
// //   };

// //   // Use the dictionary with Hunspell
// //   hunspell.use(dictionary);
// // } catch (error) {
// //   console.error('Error loading dictionary files:', error);
// // }

// // // Define the structure of your data
// // interface DataRow {
// //   [key: string]: any; // Consider defining known properties for type safety
// // }

// // // Remove duplicates based on unique keys
// // export const removeDuplicates = (data: DataRow[], uniqueKeys: string[] = ['ClientId']): DataRow[] => {
// //   return _.uniqBy(data, (row) => uniqueKeys.map((key) => row[key]).join('|'));
// // };

// // // Correct spelling for a given text
// // export const correctSpelling = (text: string): string => {
// //   try {
// //     const checked = hunspell.check(text);
// //     if (checked) {
// //       return text; // Return original if correct
// //     } else {
// //       const suggestions = hunspell.suggest(text);
// //       return suggestions.length > 0 ? suggestions[0] : text; // Return first suggestion or original
// //     }
// //   } catch (error) {
// //     console.error('Error in spelling correction:', error);
// //     return text; // Return original text on error
// //   }
// // };

// // // Clean data by trimming and correcting spelling for string fields
// // export const cleanData = (data: DataRow[]): DataRow[] => {
// //   return data.map((row, index) => {
// //     const cleanedRow: DataRow = { ...row };
// //     for (const key in cleanedRow) {
// //       if (typeof cleanedRow[key] === 'string') {
// //         const originalText = cleanedRow[key];
// //         cleanedRow[key] = correctSpelling(cleanedRow[key]).trim(); // Clean the text
// //         console.log(`Row ${index}, Key: ${key}, Original: ${originalText}, Cleaned: ${cleanedRow[key]}`);
// //       }
// //     }
// //     console.log(`Cleaned row ${index}:`, cleanedRow); // Log cleaned row for debugging
// //     return cleanedRow; // Return the cleaned row
// //   });
// // };
