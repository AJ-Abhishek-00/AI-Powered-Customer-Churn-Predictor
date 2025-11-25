import { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';
import type { Customer, PredictionResult } from '../types';
import { getAllCustomers, predictChurn } from '../services/api';

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [predictions, setPredictions] = useState<Map<string, PredictionResult>>(new Map());
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (customer: Customer) => {
    setPredicting(new Set(predicting).add(customer.id));
    try {
      const features = {
        age: customer.age,
        tenure_months: customer.tenure_months,
        monthly_charges: customer.monthly_charges,
        total_charges: customer.total_charges,
        contract_type: customer.contract_type,
        payment_method: customer.payment_method,
        internet_service: customer.internet_service,
        online_security: customer.online_security,
        tech_support: customer.tech_support,
        engagement_score: customer.engagement_score,
        support_tickets: customer.support_tickets,
      };

      const result = await predictChurn(customer.id, features);
      setPredictions(new Map(predictions).set(customer.id, result));
    } catch (error) {
      console.error('Error predicting churn:', error);
    } finally {
      setPredicting((prev) => {
        const next = new Set(prev);
        next.delete(customer.id);
        return next;
      });
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-amber-600 bg-amber-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Customers Yet</h3>
        <p className="text-gray-600">Add your first customer to start predicting churn.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charges
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prediction
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => {
              const prediction = predictions.get(customer.id);
              const isPredicting = predicting.has(customer.id);

              return (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{customer.contract_type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{customer.tenure_months} months</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      ${customer.monthly_charges.toFixed(2)}/mo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${customer.engagement_score}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">
                        {customer.engagement_score.toFixed(0)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prediction ? (
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(
                            prediction.churnRiskLevel
                          )}`}
                        >
                          {prediction.churnRiskLevel} Risk
                        </span>
                        <div className="text-xs text-gray-500">
                          {(prediction.churnProbability * 100).toFixed(1)}% probability
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not predicted</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handlePredict(customer)}
                      disabled={isPredicting}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isPredicting ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          Predicting...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4" />
                          Predict
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
