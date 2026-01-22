import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import reportService from "../../services/reportService";

const DailyReportView = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dailyReport, setDailyReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Daily Report - PCB Automation";
  }, []);

  const fetchDailyReport = async () => {
    setLoading(true);
    try {
      const response = await reportService.getDailyReport(selectedDate);
      setDailyReport(response.report);
    } catch (error) {
      console.error("Error fetching daily report:", error);
      if (error.response?.status === 404) {
        setDailyReport(null);
        toast.error("No reports found for this date");
      } else {
        toast.error("Failed to fetch daily report");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  useEffect(() => {
    fetchDailyReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchDailyReport}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {dailyReport ? (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Report - {dailyReport.date}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Based on {dailyReport.hourlyReportsCount} hourly report(s)
            </p>
          </div>

          <div className="bg-gray-50 rounded-md p-4 mb-4 border border-gray-200">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {dailyReport.formattedText}
            </pre>
          </div>

          <button
            onClick={() => copyToClipboard(dailyReport.formattedText)}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow"
          >
            Copy for WhatsApp
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No reports found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No reports found for {selectedDate}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Create hourly reports to generate daily summaries
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyReportView;
