import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { Customer } from '../types';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel?: () => void;
}

export function CustomerForm({ onSubmit, onCancel }: CustomerFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    age: 30,
    gender: 'Male',
    tenure_months: 12,
    monthly_charges: 50,
    total_charges: 600,
    contract_type: 'Month-to-month',
    payment_method: 'Electronic check',
    internet_service: 'Fiber optic',
    online_security: false,
    tech_support: false,
    engagement_score: 50,
    support_tickets: 0,
    actual_churned: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        customer_name: '',
        email: '',
        age: 30,
        gender: 'Male',
        tenure_months: 12,
        monthly_charges: 50,
        total_charges: 600,
        contract_type: 'Month-to-month',
        payment_method: 'Electronic check',
        internet_service: 'Fiber optic',
        online_security: false,
        tech_support: false,
        engagement_score: 50,
        support_tickets: 0,
        actual_churned: false,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Add New Customer</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            required
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            required
            min="18"
            max="100"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tenure (months)
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.tenure_months}
            onChange={(e) => setFormData({ ...formData, tenure_months: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Charges ($)
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.monthly_charges}
            onChange={(e) => setFormData({ ...formData, monthly_charges: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Charges ($)
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.total_charges}
            onChange={(e) => setFormData({ ...formData, total_charges: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contract Type
          </label>
          <select
            value={formData.contract_type}
            onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Month-to-month">Month-to-month</option>
            <option value="One year">One year</option>
            <option value="Two year">Two year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Electronic check">Electronic check</option>
            <option value="Mailed check">Mailed check</option>
            <option value="Bank transfer">Bank transfer</option>
            <option value="Credit card">Credit card</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Internet Service
          </label>
          <select
            value={formData.internet_service}
            onChange={(e) => setFormData({ ...formData, internet_service: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="No">No</option>
            <option value="DSL">DSL</option>
            <option value="Fiber optic">Fiber optic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Engagement Score (0-100)
          </label>
          <input
            type="number"
            required
            min="0"
            max="100"
            value={formData.engagement_score}
            onChange={(e) => setFormData({ ...formData, engagement_score: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Support Tickets
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.support_tickets}
            onChange={(e) => setFormData({ ...formData, support_tickets: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.online_security}
              onChange={(e) => setFormData({ ...formData, online_security: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Online Security</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.tech_support}
              onChange={(e) => setFormData({ ...formData, tech_support: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Tech Support</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Adding...' : 'Add Customer'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
