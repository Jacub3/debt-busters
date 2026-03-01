// Simple Express backend to proxy College Scorecard API requests for top jobs/salaries by major
import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const CAREERONESTOP_API_KEY = process.env.CAREERONESTOP_API_KEY;
const CAREERONESTOP_USERID = process.env.CAREERONESTOP_USERID || "debtbustersdemo"; // You can set your own userId

app.use(cors());

// Simple mapping: major/cip to SOC code (expand as needed)
// Source for CIP codes: https://nces.ed.gov/ipeds/cipcode/Default.aspx?y=56
// Source for SOC codes: https://www.bls.gov/soc/
const cipToSoc = {
  // Computer Science
  "11.0701": "15-1252", // Software Developers
  // Engineering (General Engineering)
  "14.0101": "17-2071", // Electrical Engineers (example, could use 17-2000 for all engineers)
  // Business Administration
  "52.0201": "11-1021", // General and Operations Managers
  // Nursing
  "51.3801": "29-1141", // Registered Nurses
  // Education
  "13.0101": "25-2021", // Elementary School Teachers (could use 25-2000 for all teachers)
  // Math
  "27.0101": "15-2021", // Mathematicians
  // English Language and Literature
  "23.0101": "25-1123", // English Language and Literature Teachers, Postsecondary
  // Economics
  "45.0601": "19-3011", // Economists
  // Political Science
  "45.1001": "19-3094", // Political Scientists
  // Criminal Justice
  "43.0104": "33-3051", // Police and Sheriff's Patrol Officers
  // Design (Graphic Design)
  "50.0409": "27-1024", // Graphic Designers
  // Other (General Occupation, fallback to Customer Service)
  "00.0000": "43-4051", // Customer Service Representatives
};

// Example: GET /api/salary?cip=11.0701

app.get('/api/salary', async (req, res) => {
  const { cip } = req.query;
  if (!cip) return res.status(400).json({ error: 'Missing cip parameter' });
  const soc = cipToSoc[cip];
  if (!soc) return res.json({ results: [], message: 'No SOC mapping for this major.' });
  if (!CAREERONESTOP_API_KEY) return res.status(500).json({ error: 'CareerOneStop API key not set' });

  try {
    // CareerOneStop Wage and Employment Trends API
    // Docs: https://www.careeronestop.org/Developers/WebAPI/OccupationDetails/OccupationDetails.aspx
    // Example: https://api.careeronestop.org/v1/comparesalaries/{userId}/{socCode}/US
    const url = `https://api.careeronestop.org/v1/comparesalaries/${CAREERONESTOP_USERID}/${soc}/US`;
    const headers = { 'Authorization': 'Bearer ' + CAREERONESTOP_API_KEY };
    console.log('CareerOneStop API URL:', url);
    console.log('CareerOneStop API Headers:', headers);
    const response = await axios.get(url, { headers });
    let results = [];
    if (response.data && response.data.SalaryData && response.data.SalaryData.length > 0) {
      // We'll use the Median value for the most recent year
      const salary = response.data.SalaryData.find(s => s.RateType === 'Annual' && s.Percentile === '50');
      if (salary) {
        results.push({
          occupation: response.data.OccupationTitle,
          soc,
          year: salary.Year,
          annual_median_wage: salary.Average || salary.Value
        });
      }
    }
    if (!results.length) {
      return res.json({ results: [], message: 'No salary data available for this occupation.' });
    }
    res.json({ results });
  } catch (err) {
    console.error('Error fetching CareerOneStop salary data:', err.message);
    if (err.response) {
      console.error('CareerOneStop API response:', err.response.data);
    }
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Salary proxy backend running on port ${PORT}`);
});
