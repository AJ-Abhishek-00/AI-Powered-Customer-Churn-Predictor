export interface Customer {
  id: string;
  customer_name: string;
  email: string;
  age: number;
  gender: string;
  tenure_months: number;
  monthly_charges: number;
  total_charges: number;
  contract_type: string;
  payment_method: string;
  internet_service: string;
  online_security: boolean;
  tech_support: boolean;
  engagement_score: number;
  support_tickets: number;
  actual_churned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  customer_id: string;
  churn_probability: number;
  churn_risk_level: string;
  predicted_churned: boolean;
  model_version: string;
  confidence_score: number;
  features_used: Record<string, unknown>;
  prediction_date: string;
  created_at: string;
}

export interface PredictionResult {
  churnProbability: number;
  predictedChurned: boolean;
  churnRiskLevel: string;
  confidenceScore: number;
}

export interface Statistics {
  totalCustomers: number;
  totalPredictions: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  averageChurnProbability: number;
}
