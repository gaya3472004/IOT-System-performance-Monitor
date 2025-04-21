import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface MetricData {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  battery: number;
}

export function Export() {
  const [exportData, setExportData] = useState<MetricData[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 20; // Number of rows per page

  // Fetch data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports');
        setExportData(response.data);
      } catch (error) {
        console.error('Error fetching export data:', error);
      }
    };

    fetchData();
  }, []);

  // Calculate paginated data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = exportData.slice(indexOfFirstRow, indexOfLastRow);

  // Function to download data as Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'export.xlsx');
  };

  // Handle page navigation
  const totalPages = Math.ceil(exportData.length / rowsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Export Data</h2>
          <p className="mt-1 text-sm text-gray-500">View and download system metrics data</p>
        </div>
        <div>
          <button
            onClick={downloadExcel}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Excel
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disk (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery (%)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available.
                </td>
              </tr>
            ) : (
              currentRows.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(row.timestamp).toISOString().slice(0, 19).replace('T', ' ')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.cpu}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.memory}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.disk}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.battery}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}