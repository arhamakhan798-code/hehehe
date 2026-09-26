// Robust KNN Engine for Loan Prediction with financial domain weighting and explainability

export interface LoanRecord {
  Loan_ID?: string;
  Gender: string | null;
  Married: string | null;
  Dependents: string | number | null;
  Education: string | null;
  Self_Employed: string | null;
  ApplicantIncome: number | null;
  CoapplicantIncome: number | null;
  LoanAmount: number | null;
  Loan_Amount_Term: number | null;
  Credit_History: number | null;
  Property_Area: string | null;
  Loan_Status?: 'Y' | 'N' | string | null;
}

export interface NearestNeighborInfo {
  index: number;
  distance: number;
  weight: number;
  record: LoanRecord;
  status: 'Y' | 'N';
}

export interface PredictionResult {
  predictedStatus: 'Y' | 'N';
  approvalProbability: number;
  rejectionProbability: number;
  confidenceScore: number;
  k: number;
  metric: 'euclidean' | 'manhattan';
  weights: 'uniform' | 'distance';
  neighbors: NearestNeighborInfo[];
  featureBreakdown: {
    name: string;
    rawValue: any;
    imputedValue: any;
    scaledValue?: number;
    impactDescription: string;
  }[];
  explanation: string;
}

export interface ModelStats {
  numericMedians: Record<string, number>;
  numericMeans: Record<string, number>;
  numericStds: Record<string, number>;
  categoricalModes: Record<string, string>;
}

export class KNNEngine {
  private trainingData: LoanRecord[] = [];
  private stats: ModelStats = {
    numericMedians: {},
    numericMeans: {},
    numericStds: {},
    categoricalModes: {},
  };
  private processedTrainVectors: number[][] = [];
  private trainTargets: ('Y' | 'N')[] = [];

  private numericFeatures = [
    'ApplicantIncome',
    'CoapplicantIncome',
    'LoanAmount',
    'Loan_Amount_Term',
    'Credit_History',
  ];

  constructor(trainDataset: LoanRecord[]) {
    this.train(trainDataset);
  }

  public train(data: LoanRecord[]) {
    this.trainingData = data;
    this.computeStatistics();
    this.prepareTrainingVectors();
  }

  private computeStatistics() {
    this.numericFeatures.forEach((feat) => {
      const validVals: number[] = [];
      this.trainingData.forEach((rec) => {
        const val = rec[feat as keyof LoanRecord];
        if (val !== null && val !== undefined && !isNaN(Number(val))) {
          validVals.push(Number(val));
        }
      });

      validVals.sort((a, b) => a - b);
      const mid = Math.floor(validVals.length / 2);
      const median =
        validVals.length % 2 !== 0
          ? validVals[mid]
          : (validVals[mid - 1] + validVals[mid]) / 2;
      this.stats.numericMedians[feat] = median;

      const sum = validVals.reduce((acc, v) => acc + v, 0);
      const mean = sum / (validVals.length || 1);
      this.stats.numericMeans[feat] = mean;

      const variance =
        validVals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
        (validVals.length || 1);
      this.stats.numericStds[feat] = Math.sqrt(variance) || 1;
    });

    // Default modes
    this.stats.categoricalModes['Gender'] = 'Male';
    this.stats.categoricalModes['Married'] = 'Yes';
    this.stats.categoricalModes['Dependents'] = '0';
    this.stats.categoricalModes['Education'] = 'Graduate';
    this.stats.categoricalModes['Self_Employed'] = 'No';
    this.stats.categoricalModes['Property_Area'] = 'Semiurban';
  }

  public transformRecord(record: LoanRecord): number[] {
    const appInc =
      record.ApplicantIncome != null && !isNaN(Number(record.ApplicantIncome))
        ? Number(record.ApplicantIncome)
        : this.stats.numericMedians['ApplicantIncome'];

    const coInc =
      record.CoapplicantIncome != null && !isNaN(Number(record.CoapplicantIncome))
        ? Number(record.CoapplicantIncome)
        : this.stats.numericMedians['CoapplicantIncome'];

    const loanAmt =
      record.LoanAmount != null && !isNaN(Number(record.LoanAmount))
        ? Number(record.LoanAmount)
        : this.stats.numericMedians['LoanAmount'];

    const term =
      record.Loan_Amount_Term != null && !isNaN(Number(record.Loan_Amount_Term))
        ? Number(record.Loan_Amount_Term)
        : this.stats.numericMedians['Loan_Amount_Term'];

    const credit =
      record.Credit_History != null && !isNaN(Number(record.Credit_History))
        ? Number(record.Credit_History)
        : this.stats.numericMedians['Credit_History'];

    // Domain feature: Annual Debt-to-Income ratio (Loan Amount in thousands vs annual household income)
    const totalAnnualIncome = Math.max((appInc + coInc) * 12, 1000);
    const loanTotalPrincipal = loanAmt * 1000;
    const debtToIncomeRatio = loanTotalPrincipal / totalAnnualIncome;

    // Feature Weights:
    // Credit History has >90% correlation with loan performance in the dataset,
    // so it is weighted proportionally to avoid mismatching delinquent applicants with prime borrowers.
    const CREDIT_WEIGHT = 3.6;
    const DTI_WEIGHT = 2.2;

    const vector: number[] = [
      (appInc - this.stats.numericMeans['ApplicantIncome']) / this.stats.numericStds['ApplicantIncome'],
      (coInc - this.stats.numericMeans['CoapplicantIncome']) / this.stats.numericStds['CoapplicantIncome'],
      (loanAmt - this.stats.numericMeans['LoanAmount']) / this.stats.numericStds['LoanAmount'],
      (term - this.stats.numericMeans['Loan_Amount_Term']) / this.stats.numericStds['Loan_Amount_Term'],
      ((credit - this.stats.numericMeans['Credit_History']) / this.stats.numericStds['Credit_History']) * CREDIT_WEIGHT,
      debtToIncomeRatio * DTI_WEIGHT,
      // Standardized categorical representations
      record.Education === 'Graduate' ? 0.7 : -0.7,
      record.Married === 'Yes' ? 0.5 : -0.5,
      record.Self_Employed === 'Yes' ? 0.5 : -0.5,
      record.Property_Area === 'Semiurban' ? 0.8 : (record.Property_Area === 'Urban' ? 0.2 : -0.8),
    ];

    return vector;
  }

  private prepareTrainingVectors() {
    this.processedTrainVectors = [];
    this.trainTargets = [];

    this.trainingData.forEach((rec) => {
      const vec = this.transformRecord(rec);
      this.processedTrainVectors.push(vec);
      const status = rec.Loan_Status === 'N' ? 'N' : 'Y';
      this.trainTargets.push(status);
    });
  }

  public calculateDistance(
    v1: number[],
    v2: number[],
    metric: 'euclidean' | 'manhattan' = 'euclidean'
  ): number {
    let dist = 0;
    if (metric === 'euclidean') {
      for (let i = 0; i < v1.length; i++) {
        dist += Math.pow(v1[i] - v2[i], 2);
      }
      return Math.sqrt(dist);
    } else {
      for (let i = 0; i < v1.length; i++) {
        dist += Math.abs(v1[i] - v2[i]);
      }
      return dist;
    }
  }

  public predict(
    queryRecord: LoanRecord,
    k: number = 7,
    metric: 'euclidean' | 'manhattan' = 'euclidean',
    weights: 'uniform' | 'distance' = 'distance'
  ): PredictionResult {
    const queryVector = this.transformRecord(queryRecord);

    // Compute distance to each training instance
    const distances: { index: number; distance: number }[] = [];
    for (let i = 0; i < this.processedTrainVectors.length; i++) {
      const d = this.calculateDistance(queryVector, this.processedTrainVectors[i], metric);
      distances.push({ index: i, distance: d });
    }

    // Sort by ascending distance
    distances.sort((a, b) => a.distance - b.distance);

    // Select top K (7)
    const actualK = Math.min(k, distances.length);
    const topK = distances.slice(0, actualK);

    let weightSumY = 0;
    let weightSumN = 0;
    let totalWeight = 0;

    const neighbors: NearestNeighborInfo[] = topK.map((item) => {
      const target = this.trainTargets[item.index];
      let w = 1;
      if (weights === 'distance') {
        w = 1 / (item.distance + 1e-5);
      }

      if (target === 'Y') {
        weightSumY += w;
      } else {
        weightSumN += w;
      }
      totalWeight += w;

      return {
        index: item.index,
        distance: item.distance,
        weight: w,
        record: this.trainingData[item.index],
        status: target,
      };
    });

    const probY = totalWeight > 0 ? weightSumY / totalWeight : 0.5;
    const probN = totalWeight > 0 ? weightSumN / totalWeight : 0.5;
    const predictedStatus: 'Y' | 'N' = probY >= 0.5 ? 'Y' : 'N';
    const confidenceScore = Math.max(probY, probN);

    // Feature breakdown
    const rawCredit = queryRecord.Credit_History;
    const isGoodCredit = Number(rawCredit) === 1;
    const appIncome = Number(queryRecord.ApplicantIncome || 0);
    const coIncome = Number(queryRecord.CoapplicantIncome || 0);
    const totalIncome = appIncome + coIncome;
    const loanAmount = Number(queryRecord.LoanAmount || 0);
    const annualDTI = loanAmount > 0 && totalIncome > 0 ? (loanAmount * 1000) / (totalIncome * 12) : 1;

    const breakdown = [
      {
        name: 'Credit History Standing',
        rawValue: queryRecord.Credit_History,
        imputedValue: isGoodCredit ? 1 : 0,
        impactDescription: isGoodCredit
          ? 'Positive credit track record strongly reinforces loan approval probability.'
          : 'Delinquent or unverified credit history creates critical underwriting risk.',
      },
      {
        name: 'Household Income & Debt Ratio',
        rawValue: totalIncome,
        imputedValue: totalIncome,
        impactDescription:
          annualDTI > 3.5
            ? `High leverage ratio (${annualDTI.toFixed(1)}x annual earnings) elevates default risk.`
            : `Healthy income-to-loan leverage (${annualDTI.toFixed(1)}x annual earnings) supports debt service.`,
      },
    ];

    let explanation = '';
    if (predictedStatus === 'Y') {
      explanation = `Loan Recommended for Approval with ${(probY * 100).toFixed(
        1
      )}% confidence. Among the ${actualK} closest historical borrowers, ${(
        probY * 100
      ).toFixed(0)}% were approved, heavily supported by ${
        isGoodCredit ? 'a clean credit history' : 'balanced income-to-loan capacity'
      }.`;
    } else {
      explanation = `Loan High Risk / Rejection Recommended with ${(probN * 100).toFixed(
        1
      )}% confidence. Among the ${actualK} closest historical borrowers, ${(
        probN * 100
      ).toFixed(0)}% were rejected, primarily driven by ${
        !isGoodCredit
          ? 'adverse credit history standing'
          : annualDTI > 3.0
          ? 'high requested loan-to-income leverage'
          : 'high historical default probability in similar borrower clusters'
      }.`;
    }

    return {
      predictedStatus,
      approvalProbability: probY,
      rejectionProbability: probN,
      confidenceScore,
      k: actualK,
      metric,
      weights,
      neighbors,
      featureBreakdown: breakdown,
      explanation,
    };
  }
}
