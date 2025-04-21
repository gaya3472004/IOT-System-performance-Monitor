import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trends data
        const trendsResponse = await axios.get('http://localhost:5000/api/analytics/trends');
        console.log('Trends Data:', trendsResponse.data);
        setAnalyticsData(trendsResponse.data);

        // Fetch summary data
        const summaryResponse = await axios.get('http://localhost:5000/api/analytics/summary');
        console.log('Summary Data:', summaryResponse.data);
        setSummary(summaryResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to fetch analytics data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debugging: Log the state of analyticsData and summary
  console.log('Analytics Data State:', analyticsData);
  console.log('Summary Data State:', summary);

  // Prepare data for charts
  const labels = analyticsData.map((item) => new Date(item.time_interval).toLocaleTimeString());

  const cpuChartData = {
    labels,
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: analyticsData.map((item) => parseFloat(item.avg_cpu)),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const memoryChartData = {
    labels,
    datasets: [
      {
        label: 'Memory Usage (%)',
        data: analyticsData.map((item) => parseFloat(item.avg_memory)),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const diskChartData = {
    labels,
    datasets: [
      {
        label: 'Disk Usage (%)',
        data: analyticsData.map((item) => parseFloat(item.avg_disk)),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
      },
    ],
  };

  const batteryChartData = {
    labels,
    datasets: [
      {
        label: 'Battery Usage (%)',
        data: analyticsData.map((item) => parseFloat(item.avg_battery)),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Usage (%)',
        },
      },
    },
  };

  // Handle loading state
  if (loading) {
    return <div className="skeleton-loader">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Handle empty data
  if (!analyticsData.length) {
    return <div>No analytics data available.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU Card */}
          <div className="bg-white shadow-sm rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900">CPU</h3>
            <p className="text-sm text-gray-700">Min: {summary.cpu.min}%</p>
            <p className="text-sm text-gray-700">Max: {summary.cpu.max}%</p>
            <p className="text-sm text-gray-700">Avg: {parseFloat(summary.cpu.avg).toFixed(2)}%</p>
          </div>

          {/* Memory Card */}
          <div className="bg-white shadow-sm rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900">Memory</h3>
            <p className="text-sm text-gray-700">Min: {summary.memory.min}%</p>
            <p className="text-sm text-gray-700">Max: {summary.memory.max}%</p>
            <p className="text-sm text-gray-700">Avg: {parseFloat(summary.memory.avg).toFixed(2)}%</p>
          </div>

          {/* Disk Card */}
          <div className="bg-white shadow-sm rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900">Disk</h3>
            <p className="text-sm text-gray-700">Min: {summary.disk.min}%</p>
            <p className="text-sm text-gray-700">Max: {summary.disk.max}%</p>
            <p className="text-sm text-gray-700">Avg: {parseFloat(summary.disk.avg).toFixed(2)}%</p>
          </div>

          {/* Battery Card */}
          <div className="bg-white shadow-sm rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900">Battery</h3>
            <p className="text-sm text-gray-700">Min: {summary.battery.min}%</p>
            <p className="text-sm text-gray-700">Max: {summary.battery.max}%</p>
            <p className="text-sm text-gray-700">Avg: {parseFloat(summary.battery.avg).toFixed(2)}%</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900">CPU Usage</h3>
        <Line data={cpuChartData} options={chartOptions} />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900">Memory Usage</h3>
        <Line data={memoryChartData} options={chartOptions} />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900">Disk Usage</h3>
        <Line data={diskChartData} options={chartOptions} />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900">Battery Usage</h3>
        <Line data={batteryChartData} options={chartOptions} />
      </div>
    </div>
  );
}