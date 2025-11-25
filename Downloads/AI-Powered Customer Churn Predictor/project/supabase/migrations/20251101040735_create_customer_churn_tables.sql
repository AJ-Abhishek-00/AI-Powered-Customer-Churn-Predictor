/*
  # Customer Churn Predictor Database Schema

  ## Overview
  Creates tables for managing customer data and churn predictions in an AI-powered churn prediction system.

  ## New Tables
  
  ### `customers`
  Stores customer profile and behavioral data for churn analysis
  - `id` (uuid, primary key) - Unique customer identifier
  - `customer_name` (text) - Customer full name
  - `email` (text) - Customer email address
  - `age` (integer) - Customer age
  - `gender` (text) - Customer gender
  - `tenure_months` (integer) - Number of months as customer
  - `monthly_charges` (numeric) - Monthly service charges
  - `total_charges` (numeric) - Total lifetime charges
  - `contract_type` (text) - Contract type (month-to-month, one year, two year)
  - `payment_method` (text) - Payment method used
  - `internet_service` (text) - Type of internet service
  - `online_security` (boolean) - Has online security service
  - `tech_support` (boolean) - Has tech support service
  - `engagement_score` (numeric) - Customer engagement metric (0-100)
  - `support_tickets` (integer) - Number of support tickets raised
  - `actual_churned` (boolean) - Whether customer actually churned (for training data)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### `predictions`
  Stores churn prediction results and model outputs
  - `id` (uuid, primary key) - Unique prediction identifier
  - `customer_id` (uuid, foreign key) - Reference to customer
  - `churn_probability` (numeric) - Predicted probability of churn (0-1)
  - `churn_risk_level` (text) - Risk classification (low, medium, high)
  - `predicted_churned` (boolean) - Binary prediction result
  - `model_version` (text) - ML model version used
  - `confidence_score` (numeric) - Model confidence in prediction
  - `features_used` (jsonb) - Feature values used for prediction
  - `prediction_date` (timestamptz) - When prediction was made
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Authenticated users can read all customer data
  - Authenticated users can create and read predictions
  - Authenticated users can insert customer records for analysis
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  age integer CHECK (age >= 0 AND age <= 150),
  gender text CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
  tenure_months integer DEFAULT 0 CHECK (tenure_months >= 0),
  monthly_charges numeric(10, 2) DEFAULT 0 CHECK (monthly_charges >= 0),
  total_charges numeric(10, 2) DEFAULT 0 CHECK (total_charges >= 0),
  contract_type text DEFAULT 'Month-to-month' CHECK (contract_type IN ('Month-to-month', 'One year', 'Two year')),
  payment_method text,
  internet_service text,
  online_security boolean DEFAULT false,
  tech_support boolean DEFAULT false,
  engagement_score numeric(5, 2) DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 100),
  support_tickets integer DEFAULT 0 CHECK (support_tickets >= 0),
  actual_churned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  churn_probability numeric(5, 4) NOT NULL CHECK (churn_probability >= 0 AND churn_probability <= 1),
  churn_risk_level text NOT NULL CHECK (churn_risk_level IN ('Low', 'Medium', 'High')),
  predicted_churned boolean NOT NULL,
  model_version text DEFAULT 'v1.0',
  confidence_score numeric(5, 4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  features_used jsonb,
  prediction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_churn ON customers(actual_churned);
CREATE INDEX IF NOT EXISTS idx_predictions_customer_id ON predictions(customer_id);
CREATE INDEX IF NOT EXISTS idx_predictions_risk_level ON predictions(churn_risk_level);
CREATE INDEX IF NOT EXISTS idx_predictions_date ON predictions(prediction_date);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Public can view customers for demo"
  ON customers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert customers for demo"
  ON customers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can view predictions for demo"
  ON predictions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can create predictions for demo"
  ON predictions FOR INSERT
  TO anon
  WITH CHECK (true);