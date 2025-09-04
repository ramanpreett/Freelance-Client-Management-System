import React, { useState } from "react";
import axios from "axios";

const AutomationPanel = ({ onClientCreated }) => {
  const [activeTab, setActiveTab] = useState('linkedin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = process.env.REACT_APP_API_URL + "/api/automation";

  const [formData, setFormData] = useState({
    linkedinUrl: "",
    upworkUrl: "",
    fiverrUrl: "",
    emailContent: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (source) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let endpoint = "";
      let data = {};

      switch (source) {
        case 'linkedin':
          endpoint = '/linkedin';
          data = { linkedinUrl: formData.linkedinUrl };
          break;
        case 'upwork':
          endpoint = '/upwork';
          data = { upworkUrl: formData.upworkUrl };
          break;
        case 'fiverr':
          endpoint = '/fiverr';
          data = { fiverrUrl: formData.fiverrUrl };
          break;
        case 'email':
          endpoint = '/email';
          data = { emailContent: formData.emailContent };
          break;
        default:
          throw new Error('Invalid source');
      }

      const response = await axios.post(`${API_URL}${endpoint}`, data, {
        headers: { Authorization: localStorage.getItem("token") }
      });

      setSuccess(`Client profile created successfully from ${source}!`);
      setFormData(prev => ({ ...prev, [source + 'Url']: "", emailContent: "" }));
      
      if (onClientCreated) {
        onClientCreated(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'linkedin', label: 'LinkedIn', icon: '🔗' },
    { id: 'upwork', label: 'Upwork', icon: '💼' },
    { id: 'fiverr', label: 'Fiverr', icon: '🎯' },
    { id: 'email', label: 'Email Parser', icon: '📧' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🤖 Client Automation</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* LinkedIn Tab */}
      {activeTab === 'linkedin' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">LinkedIn Profile Extraction</h3>
            <p className="text-gray-600 mb-4">
              Paste a LinkedIn profile URL to automatically extract client information and create a profile.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              placeholder="https://www.linkedin.com/in/john-doe"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => handleSubmit('linkedin')}
            disabled={loading || !formData.linkedinUrl}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Extracting...' : 'Extract & Create Client'}
          </button>
        </div>
      )}

      {/* Upwork Tab */}
      {activeTab === 'upwork' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Upwork Profile Extraction</h3>
            <p className="text-gray-600 mb-4">
              Paste an Upwork profile URL to automatically extract client information.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upwork Profile URL
            </label>
            <input
              type="url"
              value={formData.upworkUrl}
              onChange={(e) => handleInputChange('upworkUrl', e.target.value)}
              placeholder="https://www.upwork.com/freelancers/~0123456789"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => handleSubmit('upwork')}
            disabled={loading || !formData.upworkUrl}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Extracting...' : 'Extract & Create Client'}
          </button>
        </div>
      )}

      {/* Fiverr Tab */}
      {activeTab === 'fiverr' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Fiverr Profile Extraction</h3>
            <p className="text-gray-600 mb-4">
              Paste a Fiverr profile URL to automatically extract client information.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiverr Profile URL
            </label>
            <input
              type="url"
              value={formData.fiverrUrl}
              onChange={(e) => handleInputChange('fiverrUrl', e.target.value)}
              placeholder="https://www.fiverr.com/username"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => handleSubmit('fiverr')}
            disabled={loading || !formData.fiverrUrl}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Extracting...' : 'Extract & Create Client'}
          </button>
        </div>
      )}

      {/* Email Parser Tab */}
      {activeTab === 'email' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Email Content Parser</h3>
            <p className="text-gray-600 mb-4">
              Paste email content to automatically extract client information and create a profile.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Content
            </label>
            <textarea
              value={formData.emailContent}
              onChange={(e) => handleInputChange('emailContent', e.target.value)}
              placeholder="Paste the email content here..."
              rows="6"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => handleSubmit('email')}
            disabled={loading || !formData.emailContent}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Parsing...' : 'Parse & Create Client'}
          </button>
        </div>
      )}

      {/* Webhook Information */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">🔗 Webhook Integration</h4>
        <p className="text-sm text-gray-600 mb-3">
          Use this webhook URL to integrate with external forms and automation tools:
        </p>
        <div className="bg-gray-100 p-3 rounded border">
          <code className="text-sm text-gray-800 break-all">
            {process.env.REACT_APP_API_URL}/api/webhook/client
          </code>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Send POST requests with client data to automatically create profiles.
        </p>
      </div>
    </div>
  );
};

export default AutomationPanel;


