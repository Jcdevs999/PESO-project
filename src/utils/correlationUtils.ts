export function cramers_v(x: any[], y: any[]): number {
  const confusionMatrix = createConfusionMatrix(x, y);
  const chiSquared = calculateChiSquared(confusionMatrix);
  const n = x.length; // Total number of observations
  const phi = chiSquared / n;
  const r = confusionMatrix.length; // Number of rows
  const k = confusionMatrix[0].length; // Number of columns
  const minDim = Math.min(r - 1, k - 1);
  
  return parseFloat((Math.sqrt(phi / minDim)).toFixed(1)); // Cramér's V rounded to 1 decimal place
}

function createConfusionMatrix(x: any[], y: any[]): number[][] {
  const categoriesX = Array.from(new Set(x));
  const categoriesY = Array.from(new Set(y));
  
  const matrix = Array.from({ length: categoriesX.length }, () =>
    Array(categoriesY.length).fill(0)
  );

  x.forEach((valX, index) => {
    const valY = y[index];
    const rowIndex = categoriesX.indexOf(valX);
    const colIndex = categoriesY.indexOf(valY);
    matrix[rowIndex][colIndex]++;
  });

  return matrix;
}

function calculateChiSquared(matrix: number[][]): number {
  const total = matrix.flat().reduce((sum, val) => sum + val, 0);
  let chiSquared = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const observed = matrix[i][j];
      if (observed > 0) {
        const rowSum = matrix[i].reduce((sum, val) => sum + val, 0);
        const colSum = matrix.reduce((sum, row) => sum + row[j], 0);
        const expected = (rowSum * colSum) / total;
        chiSquared += Math.pow(observed - expected, 2) / expected;
      }
    }
  }

  return chiSquared;
}
