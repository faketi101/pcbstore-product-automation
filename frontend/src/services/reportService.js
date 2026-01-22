import axios from "axios";
import config from "../config/api.config";

const API_URL = `${config.API_URL}/reports`;

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

const reportService = {
  // Create new hourly report
  createHourlyReport: async (reportData) => {
    const response = await axios.post(`${API_URL}/hourly`, reportData);
    return response.data;
  },

  // Get hourly reports with optional filters
  getHourlyReports: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.date) params.append("date", filters.date);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await axios.get(`${API_URL}/hourly?${params.toString()}`);
    return response.data;
  },

  // Get aggregated daily report for a specific date
  getDailyReport: async (date) => {
    const response = await axios.get(`${API_URL}/daily/${date}`);
    return response.data;
  },

  // Get multiple daily reports with date range
  getDailyReports: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await axios.get(`${API_URL}/daily?${params.toString()}`);
    return response.data;
  },

  // Update existing hourly report
  updateHourlyReport: async (id, reportData) => {
    const response = await axios.put(`${API_URL}/hourly/${id}`, reportData);
    return response.data;
  },

  // Delete hourly report
  deleteHourlyReport: async (id) => {
    const response = await axios.delete(`${API_URL}/hourly/${id}`);
    return response.data;
  },
};

export default reportService;
