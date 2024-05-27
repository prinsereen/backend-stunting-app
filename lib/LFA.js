import xlsx from 'xlsx';

function getLFAData(filePath){

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const jsonData = xlsx.utils.sheet_to_json(sheet);

  const LengthForAge = jsonData.map(row => ({
  month: row['Month'], 
  median: row['SD0'], 
  sd3neg: row['SD3neg'], 
  sd2neg: row['SD2neg'], 
  sd1neg: row['SD1neg'], 
  sd1: row['SD1'],       
  sd2: row['SD2'],       
  sd3: row['SD3']        
  }));

  return LengthForAge
}

export function getZScoreLengthForAge(month, length, Data) {
  let closest = Data.reduce((prev, curr) => 
    Math.abs(curr.month - month) < Math.abs(prev.month - month) ? curr : prev
  );

  if (month !== closest.month) {
    let nextIndex = Data.findIndex(d => d.month > month);
    if (nextIndex === -1) {
      nextIndex = Data.month - 1;
    }
    let prevIndex = nextIndex - 1;

    if (prevIndex < 0) {
      prevIndex = 0;
    }

    const prev = Data[prevIndex];
    const next = Data[nextIndex];

    const fraction = (month - prev.month) / (next.month - prev.month);

    closest = {
      month: month,
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

  if (length == sd3neg ) return -3
  if (length == sd2neg ) return -2
  if (length == sd1neg ) return -1

  if (length == median ) return 0

  if (length == sd3 ) return 3
  if (length == sd2 ) return 2
  if (length == sd1 ) return 1

  if (length < sd3neg) return -3 - (length - sd2neg) / (sd3neg - sd2neg);
  if (length < sd2neg) return -2 - (length - sd2neg) / (sd3neg - sd2neg);
  if (length < sd1neg) return -1 - (length - sd1neg) / (sd2neg - sd1neg);

  if (length < median) return -1 * (length - median) / (sd1neg - median);

  if (length < sd1) return 1 * (length - median) / (sd1 - median);
  if (length < sd2) return 2 + (length - sd2) / (sd2 - sd1);
  if (length < sd3) return 3 + (length - sd3) / (sd3 - sd2);

  return 3;
}

const filePath1 = './data/lhfa/boy/lhfa_boys_0-to-2-years_zscores.xlsx';
const filePath2 = './data/lhfa/boy/lhfa_boys_2-to-5-years_zscores.xlsx';
const filePath3 = './data/lhfa/girl/lhfa_girls_0-to-2-years_zscores.xlsx';
const filePath4 = './data/lhfa/girl/lhfa_girls_2-to-5-years_zscores.xlsx';

export const dataLFABoys02 = getLFAData(filePath1)
export const dataLFABoys25 = getLFAData(filePath2)
export const dataLFAGirls02 = getLFAData(filePath3)
export const dataLFAGirls25 = getLFAData(filePath4)
  
//let month = 75 ; 
//let length =  11.30

/* console.log(`Z-Score: ${getZScoreLengthForAge(1, 56.8, dataLFABoys02)}`);
console.log(`Z-Score: ${getZScoreLengthForAge(25, 91.2, dataLFABoys25)}`);
console.log(`Z-Score: ${getZScoreLengthForAge(1, 55.7, dataLFAGirls02)}`);
console.log(`Z-Score: ${getZScoreLengthForAge(25, 90, dataLFAGirls25)}`); */
