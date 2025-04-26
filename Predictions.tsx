import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export function Predictions() {
  const [file, setFile] = useState<File | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [months, setMonths] = useState<number>(3);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);

      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        const analyzeResponse = await axios.post('/api/analyze', formData);
        setAnalytics(analyzeResponse.data);

        const predictResponse = await axios.post('/api/predict', { data: analyzeResponse.data, months });
        setPredictions(predictResponse.data);
      } catch (error) {
        console.error('Error uploading or processing file:', error);
      }
    }
  };

  const handleMonthChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonths = Number(event.target.value);
    setMonths(selectedMonths);

    if (analytics) {
      try {
        const predictResponse = await axios.post('/api/predict', { data: analytics, months: selectedMonths });
        setPredictions(predictResponse.data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    }
  };

  const renderAnalyticsGraph = () => {
    if (!analytics) return null;

    const data = Object.keys(analytics).map((key) => ({
      name: key,
      mean: analytics[key].mean,
      std: analytics[key].std,
    }));

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Analytics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="mean" stroke="#8884d8" />
            <Line type="monotone" dataKey="std" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderPredictionCard = () => {
    if (predictions.length === 0) return null;

    const prediction = predictions[0]; // Assuming predictions are consolidated into a single object

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Predictions</h3>
        {Object.keys(prediction).map((key) => (
          key !== 'timestamp' && (
            <p key={key} className="text-sm text-gray-700">{key}: {prediction[key]}</p>
          )
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Performance Predictions</h2>
        <p className="mt-1 text-sm text-gray-500">Upload your dataset and get predictions</p>
      </div>
      <div>
        <input type="file" onChange={handleFileUpload} />
        <select value={months} onChange={handleMonthChange}>
          {[...Array(12).keys()].map(i => (
            <option key={i + 1} value={i + 1}>{i + 1} Months</option>
          ))}
        </select>
      </div>
      {analytics && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Analytics</h3>
          {renderAnalyticsGraph()}
        </div>
      )}
      {predictions.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {renderPredictionCard()}
        </div>
      )}
    </div>
  );
}
