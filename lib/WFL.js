import xlsx from 'xlsx';

function getWflData(filePath){

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const jsonData = xlsx.utils.sheet_to_json(sheet);

  const weightForLength = jsonData.map(row => ({
  length: row['Length'], 
  median: row['SD0'], 
  sd3neg: row['SD3neg'], 
  sd2neg: row['SD2neg'], 
  sd1neg: row['SD1neg'], 
  sd1: row['SD1'],       
  sd2: row['SD2'],       
  sd3: row['SD3']        
  }));

  return weightForLength
}

function getZScoreWeightForLength(length, weight, Data) {
  let closest = Data.reduce((prev, curr) => 
    Math.abs(curr.length - length) < Math.abs(prev.length - length) ? curr : prev
  );

  if (length !== closest.length) {
    let nextIndex = Data.findIndex(d => d.length > length);
    if (nextIndex === -1) {
      nextIndex = Data.length - 1;
    }
    let prevIndex = nextIndex - 1;

    if (prevIndex < 0) {
      prevIndex = 0;
    }

    const prev = Data[prevIndex];
    const next = Data[nextIndex];

    const fraction = (length - prev.length) / (next.length - prev.length);

    closest = {
      length: length,
      median: prev.median + (next.median - prev.median) * fraction,
      sd3neg: prev.sd3neg + (next.sd3neg - prev.sd3neg) * fraction,
      sd2neg: prev.sd2neg + (next.sd2neg - prev.sd2neg) * fraction,
      sd1neg: prev.sd1neg + (next.sd1neg - prev.sd1neg) * fraction,
      sd1: prev.sd1 + (next.sd1 - prev.sd1) * fraction,
      sd2: prev.sd2 + (next.sd2 - prev.sd2) * fraction,
      sd3: prev.sd3 + (next.sd3 - prev.sd3) * fraction,
    };
  }

  const { median, sd3neg, sd2neg, sd1neg, sd1, sd2, sd3 } = closest;

  if (weight == sd3neg ) return -3
  if (weight == sd2neg ) return -2
  if (weight == sd1neg ) return -1

  if (weight == median ) return 0

  if (weight == sd3 ) return 3
  if (weight == sd2 ) return 2
  if (weight == sd1 ) return 1

  if (weight < sd3neg) return -3 - (weight - sd2neg) / (sd3neg - sd2neg);
  if (weight < sd2neg) return -2 - (weight - sd2neg) / (sd3neg - sd2neg);
  if (weight < sd1neg) return -1 - (weight - sd1neg) / (sd2neg - sd1neg);

  if (weight < median) return -1 * (weight - median) / (sd1neg - median);

  if (weight < sd1) return 1 * (weight - median) / (sd1 - median);
  if (weight < sd2) return 2 + (weight - sd2) / (sd2 - sd1);
  if (weight < sd3) return 3 + (weight - sd3) / (sd3 - sd2);

  return 3;
}

const filePath1 = '../data/wfl/boy/wfl_boys_0-to-2-years_zscores.xlsx';
const filePath2 = '../data/wfl/boy/wfl_boys_2-to-5-years_zscores.xlsx';
const filePath3 = '../data/wfl/girl/wfl_girls_0-to-2-years_zscores.xlsx';
const filePath4 = '../data/wfl/girl/wfl_girls_2-to-5-years_zscores.xlsx';

const dataWFLBoys02 = getWflData(filePath1)
const dataWFLBoys25 = getWflData(filePath2)
const dataWFLGirls02 = getWflData(filePath3)
const dataWFLGirls25 = getWflData(filePath4)
  
let length = 75 ; 
let weight =  11.30
console.log(`Z-Score: ${getZScoreWeightForLength(length, weight, dataWFLBoys02)}`);
console.log(`Z-Score: ${getZScoreWeightForLength(length, weight, dataWFLBoys25)}`);
console.log(`Z-Score: ${getZScoreWeightForLength(length, weight, dataWFLGirls02)}`);
console.log(`Z-Score: ${getZScoreWeightForLength(length, weight, dataWFLGirls25)}`);
