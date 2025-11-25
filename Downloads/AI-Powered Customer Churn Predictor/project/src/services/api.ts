import { supabase } from '../lib/supabase';
import type { Customer, Prediction, PredictionResult, Statistics } from '../types';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/churn-predictor`;

export async function getAllCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPredictionsForCustomer(customerId: string): Promise<Prediction[]> {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('customer_id', customerId)
    .order('prediction_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllPredictions(): Promise<Prediction[]> {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .order('prediction_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function predictChurn(customerId: string, features: Record<string, unknown>): Promise<PredictionResult> {
  const response = await fetch(`${EDGE_FUNCTION_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      customer_id: customerId,
      features,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to predict churn');
  }

  return await response.json();
}

export async function batchPredict(customers: Array<{ id: string; features: Record<string, unknown> }>): Promise<{ predictions: Array<{ customer_id: string } & PredictionResult> }> {
  const response = await fetch(`${EDGE_FUNCTION_URL}/batch-predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ customers }),
  });

  if (!response.ok) {
    throw new Error('Failed to batch predict');
  }

  return await response.json();
}

export async function getStatistics(): Promise<Statistics> {
  const response = await fetch(`${EDGE_FUNCTION_URL}/statistics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }

  return await response.json();
}
