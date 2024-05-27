import xlsx from 'xlsx';

function getBMIData(filePath){

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const BMI = jsonData.map(row => ({
    Month: row['Month'], 
    median: row['SD0'], 
    sd3neg: row['SD3neg'], 
    sd2neg: row['SD2neg'], 
    sd1neg: row['SD1neg'], 
    sd1: row['SD1'],       
    sd2: row['SD2'],       
    sd3: row['SD3']        
    }));

    return BMI
}

export function getZScoreBMI(Month, height, weight, Data) {

    const BMI = getBMI(height, weight)

    let closest = Data.reduce((prev, curr) => 
      Math.abs(curr.Month - Month) < Math.abs(prev.Month - Month) ? curr : prev
    );
  
    if (Month !== closest.Month) {
      let nextIndex = Data.findIndex(d => d.Month > Month);
      if (nextIndex === -1) {
        nextIndex = Data.Month - 1;
      }
      let prevIndex = nextIndex - 1;
  
      if (prevIndex < 0) {
        prevIndex = 0;
      }
  
      const prev = Data[prevIndex];
      const next = Data[nextIndex];
  
      const fraction = (Month - prev.Month) / (next.Month - prev.Month);
  
      closest = {
        Month: Month,
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
  
    if (BMI == sd3neg ) return -3
    if (BMI == sd2neg ) return -2
    if (BMI == sd1neg ) return -1
  
    if (BMI == median ) return 0
  
    if (BMI == sd3 ) return 3
    if (BMI == sd2 ) return 2
    if (BMI == sd1 ) return 1
  
    if (BMI < sd3neg) return -3 - (BMI - sd2neg) / (sd3neg - sd2neg);
    if (BMI < sd2neg) return -2 - (BMI - sd2neg) / (sd3neg - sd2neg);
    if (BMI < sd1neg) return -1 - (BMI - sd1neg) / (sd2neg - sd1neg);
  
    if (BMI < median) return -1 * (BMI - median) / (sd1neg - median);
  
    if (BMI < sd1) return 1 * (BMI - median) / (sd1 - median);
    if (BMI < sd2) return 2 + (BMI - sd2) / (sd2 - sd1);
    if (BMI < sd3) return 3 + (BMI - sd3) / (sd3 - sd2);
  
    return 3;
}

function getBMI(height, weight){
    const heightNormalized = height/100
    return weight/(heightNormalized*heightNormalized)
}

const filePath1 = './data/bmi/boy/bmi_boys_0-to-2-years_zscores.xlsx';
const filePath2 = './data/bmi/boy/bmi_boys_2-to-5-years_zscores.xlsx';
const filePath3 = './data/bmi/girl/bmi_girls_0-to-2-years_zscores.xlsx';
const filePath4 = './data/bmi/girl/bmi_girls_2-to-5-years_zscores.xlsx';


export const dataBMIBoys02 = getBMIData(filePath1)
export const dataBMIBoys25 = getBMIData(filePath2)
export const dataBMIGirls02 = getBMIData(filePath3)
export const dataBMIGirls25 = getBMIData(filePath4)

/* let length = 65 ; 
let weight =  7

//console.log(getBMI(length,  weight))

console.log(`Z-Score: ${getZScoreBMI(1, length,  weight, dataBMIBoys02)}`);
console.log(`Z-Score: ${getZScoreBMI(25, length, weight, dataBMIBoys25)}`);
console.log(`Z-Score: ${getZScoreBMI(1, length, weight, dataBMIGirls02)}`);
console.log(`Z-Score: ${getZScoreBMI(25, length, weight, dataBMIGirls25)}`); */