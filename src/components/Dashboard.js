import React, { useState, useEffect } from "react";
import axios from "axios";
import QuickStats from "./dashboard/QuickStats";
import RecentActivity from "./dashboard/RecentActivity";
import TaskList from "./dashboard/TaskList";
import CalendarWidget from "./dashboard/CalendarWidget";
import FinancialSnapshot from "./dashboard/FinancialSnapshot";
import PlatformInsights from "./dashboard/PlatformInsights";
import QuickActions from "./dashboard/QuickActions";
import AIInsights from "./dashboard/AIInsights";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalClients: 0,
      activeProjects: 0,
      pendingInvoices: 0,
      upcomingMeetings: 0
    },
    recentActivity: [],
    tasks: [],
    meetings: [],
    clients: [],
    invoices: [],
    financialData: {
      monthlyIncome: 0,
      pendingPayments: 0,
      recurringRevenue: 0,
      revenueByClient: [],
      revenueByPlatform: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: token };

      // Fetch all data in parallel
      const [clientsRes, invoicesRes, meetingsRes] = await Promise.all([
        axios.get(`${API_URL}/clients`, { headers }),
        axios.get(`${API_URL}/invoices`, { headers }),
        axios.get(`${API_URL}/meetings`, { headers })
      ]);

      const clients = clientsRes.data;
      const invoices = invoicesRes.data;
      const meetings = meetingsRes.data;

      // Calculate stats
      const stats = {
        totalClients: clients.length,
        activeProjects: clients.filter(c => c.tags?.includes('ongoing')).length,
        pendingInvoices: invoices.filter(i => i.status === 'Unpaid').length,
        upcomingMeetings: meetings.filter(m => new Date(m.date) > new Date()).length
      };

      // Generate recent activity
      const recentActivity = generateRecentActivity(clients, invoices, meetings);

      // Generate tasks
      const tasks = generateTasks(invoices, meetings, clients);

      // Calculate financial data
      const financialData = calculateFinancialData(invoices, clients);

      setDashboardData({
        stats,
        recentActivity,
        tasks,
        meetings,
        clients,
        invoices,
        financialData
      });

      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (clients, invoices, meetings) => {
    const activities = [];
    
    // Add recent client activities
    clients.slice(0, 5).forEach(client => {
      activities.push({
        id: `client-${client._id}`,
        type: 'client',
        title: `New client added: ${client.name}`,
        description: `Client from ${client.source || 'Manual'} source`,
        date: new Date(client.createdAt || Date.now()),
        icon: '👤',
        color: 'blue'
      });
    });

    // Add recent invoice activities
    invoices.slice(0, 5).forEach(invoice => {
      const client = clients.find(c => c._id === invoice.client);
      activities.push({
        id: `invoice-${invoice._id}`,
        type: 'invoice',
        title: `Invoice ${invoice.status === 'Paid' ? 'paid' : 'created'}: $${invoice.amount}`,
        description: `For ${client?.name || 'Unknown client'}`,
        date: new Date(invoice.createdAt || Date.now()),
        icon: invoice.status === 'Paid' ? '💰' : '📄',
        color: invoice.status === 'Paid' ? 'green' : 'orange'
      });
    });

    // Add recent meeting activities
    meetings.slice(0, 3).forEach(meeting => {
      const client = clients.find(c => c._id === meeting.client);
      activities.push({
        id: `meeting-${meeting._id}`,
        type: 'meeting',
        title: `Meeting scheduled with ${client?.name || 'Unknown client'}`,
        description: meeting.notes || 'No notes',
        date: new Date(meeting.date),
        icon: '📅',
        color: 'purple'
      });
    });

    // Sort by date and return top 10
    return activities
      .sort((a, b) => b.date - a.date)
      .slice(0, 10);
  };

  const generateTasks = (invoices, meetings, clients) => {
    const tasks = [];

    // Overdue invoices
    const overdueInvoices = invoices.filter(invoice => {
      if (invoice.status === 'Paid') return false;
      const dueDate = new Date(invoice.dueDate);
      return dueDate < new Date();
    });

    overdueInvoices.forEach(invoice => {
      const client = clients.find(c => c._id === invoice.client);
      tasks.push({
        id: `overdue-${invoice._id}`,
        title: `Follow up on overdue invoice`,
        description: `Invoice #${invoice._id.slice(-8)} for ${client?.name || 'Unknown client'} - $${invoice.amount}`,
        priority: 'high',
        dueDate: new Date(invoice.dueDate),
        type: 'invoice',
        action: 'follow-up'
      });
    });

    // Upcoming meetings
    const upcomingMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      const now = new Date();
      const diffHours = (meetingDate - now) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 24; // Next 24 hours
    });

    upcomingMeetings.forEach(meeting => {
      const client = clients.find(c => c._id === meeting.client);
      tasks.push({
        id: `meeting-${meeting._id}`,
        title: `Prepare for meeting`,
        description: `Meeting with ${client?.name || 'Unknown client'} at ${new Date(meeting.date).toLocaleTimeString()}`,
        priority: 'medium',
        dueDate: new Date(meeting.date),
        type: 'meeting',
        action: 'prepare'
      });
    });

    // Client follow-ups (mock data)
    const inactiveClients = clients.filter(client => {
      const lastActivity = new Date(client.createdAt || Date.now());
      const daysSinceActivity = (new Date() - lastActivity) / (1000 * 60 * 60 * 24);
      return daysSinceActivity > 30;
    });

    inactiveClients.slice(0, 3).forEach(client => {
      tasks.push({
        id: `followup-${client._id}`,
        title: `Follow up with inactive client`,
        description: `Reach out to ${client.name} - no activity in 30+ days`,
        priority: 'low',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        type: 'client',
        action: 'follow-up'
      });
    });

    return tasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const calculateFinancialData = (invoices, clients) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Monthly income (paid invoices this month)
    const monthlyIncome = invoices
      .filter(invoice => 
        invoice.status === 'Paid' && 
        new Date(invoice.createdAt || Date.now()) >= thisMonth
      )
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    // Pending payments
    const pendingPayments = invoices
      .filter(invoice => invoice.status === 'Unpaid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    // Revenue by client
    const revenueByClient = clients.map(client => {
      const clientInvoices = invoices.filter(invoice => 
        invoice.client === client._id && invoice.status === 'Paid'
      );
      const totalRevenue = clientInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
      return {
        name: client.name,
        revenue: totalRevenue,
        invoices: clientInvoices.length
      };
    }).filter(item => item.revenue > 0).sort((a, b) => b.revenue - a.revenue);

    // Revenue by platform
    const platformRevenue = {};
    clients.forEach(client => {
      const source = client.source || 'Direct';
      const clientInvoices = invoices.filter(invoice => 
        invoice.client === client._id && invoice.status === 'Paid'
      );
      const revenue = clientInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
      platformRevenue[source] = (platformRevenue[source] || 0) + revenue;
    });

    const revenueByPlatform = Object.entries(platformRevenue).map(([platform, revenue]) => ({
      platform,
      revenue
    }));

    return {
      monthlyIncome,
      pendingPayments,
      recurringRevenue: 0, // Would need subscription data
      revenueByClient,
      revenueByPlatform
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={dashboardData.stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Snapshot */}
          <FinancialSnapshot data={dashboardData.financialData} />
          
          {/* Platform Insights */}
          <PlatformInsights 
            clients={dashboardData.clients}
            revenueByPlatform={dashboardData.financialData.revenueByPlatform}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* AI Insights */}
          <AIInsights 
            clients={dashboardData.clients}
            invoices={dashboardData.invoices}
            tasks={dashboardData.tasks}
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <RecentActivity activities={dashboardData.recentActivity} />
        
        {/* Tasks */}
        <TaskList tasks={dashboardData.tasks} onTaskUpdate={fetchDashboardData} />
      </div>

      {/* Calendar Widget */}
      <CalendarWidget meetings={dashboardData.meetings} clients={dashboardData.clients} />
    </div>
  );
};

export default Dashboard;
