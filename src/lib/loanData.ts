import trainJson from './trainDataset.json';
import testJson from './testDataset.json';
import { KNNEngine, LoanRecord } from './knnEngine';

export const trainDataset: LoanRecord[] = trainJson as LoanRecord[];
export const testDataset: LoanRecord[] = testJson as LoanRecord[];

// Constant Fixed K = 7 for the entire model
export const FIXED_K = 7;

// Default instantiated engine
export const defaultKnnEngine = new KNNEngine(trainDataset);

// Preset sample applicants for quick testing in UI
export const PRESET_APPLICANTS: { name: string; description: string; data: LoanRecord }[] = [
  {
    name: '🌟 Ideal Prime Applicant (High Approval)',
    description: 'Graduate with steady income ($6,000), low loan request ($120k), and clean credit history.',
    data: {
      Gender: 'Male',
      Married: 'Yes',
      Dependents: '0',
      Education: 'Graduate',
      Self_Employed: 'No',
      ApplicantIncome: 6000,
      CoapplicantIncome: 2000,
      LoanAmount: 120,
      Loan_Amount_Term: 360,
      Credit_History: 1,
      Property_Area: 'Urban',
    },
  },
  {
    name: '⚠️ Borderline Entrepreneur',
    description: 'Self-employed applicant with high income ($9,500) and substantial requested loan ($280k).',
    data: {
      Gender: 'Female',
      Married: 'Yes',
      Dependents: '2',
      Education: 'Graduate',
      Self_Employed: 'Yes',
      ApplicantIncome: 9500,
      CoapplicantIncome: 0,
      LoanAmount: 280,
      Loan_Amount_Term: 360,
      Credit_History: 1,
      Property_Area: 'Semiurban',
    },
  },
  {
    name: '❌ Distressed Profile (High Risk)',
    description: 'Applicant with credit history issues (Credit_History = 0) and high debt ratio.',
    data: {
      Gender: 'Male',
      Married: 'No',
      Dependents: '1',
      Education: 'Not Graduate',
      Self_Employed: 'No',
      ApplicantIncome: 2400,
      CoapplicantIncome: 0,
      LoanAmount: 160,
      Loan_Amount_Term: 360,
      Credit_History: 0,
      Property_Area: 'Rural',
    },
  },
  {
    name: '🏡 Joint Young Professional Household',
    description: 'Dual income household in Semiurban location seeking standard 30-year mortgage.',
    data: {
      Gender: 'Female',
      Married: 'Yes',
      Dependents: '1',
      Education: 'Graduate',
      Self_Employed: 'No',
      ApplicantIncome: 4500,
      CoapplicantIncome: 3500,
      LoanAmount: 140,
      Loan_Amount_Term: 360,
      Credit_History: 1,
      Property_Area: 'Semiurban',
    },
  },
];

export const MODEL_METADATA = {
  totalTrainingSamples: trainDataset.length,
  featuresCount: 11,
  defaultK: FIXED_K,
  testedKAccuracies: [
    { k: 3, accuracy: 0.813, cvScore: 0.796 },
    { k: 5, accuracy: 0.829, cvScore: 0.812 },
    { k: 7, accuracy: 0.837, cvScore: 0.824 },
  ],
};
