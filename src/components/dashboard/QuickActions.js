import React from "react";

const QuickActions = () => {
  const actions = [
    {
      title: "Add New Client",
      description: "Create a new client profile",
      icon: "👤",
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        // Navigate to clients page with form open
        window.location.hash = '#clients';
      }
    },
    {
      title: "Create Invoice",
      description: "Generate a new invoice",
      icon: "📄",
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        // Navigate to invoices page with form open
        window.location.hash = '#invoices';
      }
    },
    {
      title: "Schedule Meeting",
      description: "Book a client meeting",
      icon: "📅",
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => {
        // Navigate to meetings page with form open
        window.location.hash = '#meetings';
      }
    },
    {
      title: "Upload Document",
      description: "Add files to client records",
      icon: "📎",
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => {
        // Open file upload modal
        console.log("Open file upload");
      }
    },
    {
      title: "Send Email",
      description: "Compose a client message",
      icon: "📧",
      color: "bg-indigo-500 hover:bg-indigo-600",
      action: () => {
        // Open email composer
        console.log("Open email composer");
      }
    },
    {
      title: "Generate Report",
      description: "Create financial reports",
      icon: "📊",
      color: "bg-teal-500 hover:bg-teal-600",
      action: () => {
        // Open report generator
        console.log("Open report generator");
      }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
        <span className="text-sm text-gray-500">Shortcuts</span>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-3`}
          >
            <span className="text-2xl">{action.icon}</span>
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-sm opacity-90">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Recent Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Recent Actions</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Invoice #1234 created</span>
            <span className="text-xs text-gray-400">2h ago</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Meeting with John Doe scheduled</span>
            <span className="text-xs text-gray-400">4h ago</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>New client added: Jane Smith</span>
            <span className="text-xs text-gray-400">1d ago</span>
          </div>
        </div>
      </div>
      
      {/* Keyboard Shortcuts */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Keyboard Shortcuts</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Add Client:</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + N</kbd>
          </div>
          <div className="flex justify-between">
            <span>Create Invoice:</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + I</kbd>
          </div>
          <div className="flex justify-between">
            <span>Schedule Meeting:</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + M</kbd>
          </div>
          <div className="flex justify-between">
            <span>Search:</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + K</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;


