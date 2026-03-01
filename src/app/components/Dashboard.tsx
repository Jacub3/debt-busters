// Get lifestyle sub-categories for breakdown
function getLifestyleSubCategories(budgetData?: any) {
  if (!budgetData) return [];
  return [
    { name: 'Entertainment', value: Number(budgetData.entertainment) || 0, color: '#F59E0B' },
    { name: 'Miscellaneous', value: Number(budgetData.miscellaneousExpenses) || 0, color: '#FBBF24' },
  ].filter(item => item.value > 0);
}
// Simple CustomTooltip for recharts
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow text-xs">
        <span className="font-semibold">{label}</span>
        <br />
        {payload.map((entry: any, idx: number) => (
          <span key={idx} style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
            <br />
          </span>
        ))}
      </div>
    );
  }
  return null;
}
import { useState, useEffect } from "react";
import { getCipCodeForMajor } from "../utils/majorToCip";
import { Link, useNavigate } from "react-router";
import { 
  PiggyBank, 
  PieChart as PieChartIcon,
  Wallet,
  Edit,
  Home as HomeIcon,
  Car,
  GraduationCap,
  Briefcase,
  MoreHorizontal,
  Utensils,
  ShoppingBag,
  Lightbulb,
  TrendingDown,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Recommendations } from "./Recommendations";
import { EditCategoryModal } from "./EditCategoryModal";
interface SalaryResult {
  'school.name'?: string;
  'latest.programs.cip_4_digit.earnings.1_yr.overall_median_earnings'?: string | number;
}
interface BudgetData {
  year: string;
  livingSituation: string;
  housingCost: string;
  whoPaysHousing: string;
  mealPlanCost: string;
  hasCar: string;
  carExpenses: string;
  hasJob: string;
  monthlyIncome: string;
  hourlyWage: string;
  hoursPerWeek: string;
  careerField: string;
  miscellaneousExpenses: string;
  textbooksSupplies: string;
  groceries: string;
  diningOut: string;
  entertainment: string;
  primaryGoal: string;
  savingsTarget: string;
  tuitionCost: string; // per year
  whoPaystuition: string;
  yearlyInterest?: string; // new field, optional for backward compatibility
}

const COLORS = {
  // Main categories
  school: '#7C3AED',
  housing: '#4F46E5',
  transportation: '#EC4899',
  food: '#10B981',
  lifestyle: '#F59E0B',
  
  // School sub-categories
  tuition: '#7C3AED',
  mealPlan: '#9333EA',
  textbooks: '#A855F7',
  
  // Food sub-categories
  groceries: '#059669',
  diningOut: '#34D399',
  
  // Lifestyle sub-categories
  entertainment: '#F59E0B',
  miscellaneous: '#FBBF24',
};

export function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'charts' | 'finance' | 'recommendations' | 'loan'>('charts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

  // Get budget data from localStorage
  const getBudgetData = (): BudgetData | null => {
    const data = localStorage.getItem('budgetData');
    return data ? JSON.parse(data) : null;
  };

   const budgetData = getBudgetData();

  if (!budgetData) {
    navigate('/questionnaire');
    return null;
  }


  // State for salary data
const [salaryData, setSalaryData] = useState<SalaryResult[] | null>(null);

  // Get major from budgetData (fallback to Computer Science)
  const selectedMajor = budgetData?.careerField || 'Computer Science';
  const cipCode = getCipCodeForMajor(selectedMajor);

  useEffect(() => {
    if (!cipCode) return;
    fetch(`http://localhost:4000/api/salary?cip=${cipCode}`)
      .then(res => res.json())
      .then(data => setSalaryData(data.results || []))
      .catch(() => setSalaryData(null));
  }, [cipCode]);

  // Helper: Project salary growth for a job over 30 years
  function getSalaryGrowthData(startSalary: number, growthRate = 0.03) {
    // Assume 3% annual growth by default
    const years = 30;
    let salary = startSalary;
    const data = [];
    for (let year = 1; year <= years; year++) {
      data.push({ year, salary: Math.round(salary) });
      salary *= 1 + growthRate;
    }
    return data;
  }
    // Multi-year loan accumulation calculation
    const getLoanAccumulationData = () => {
      const tuitionPerYear = Number(budgetData.tuitionCost) || 0;
      const yearlyInterest = Number(budgetData.yearlyInterest) || 0;
      const years = 30;
      let balance = 0;
      const data = [];
      for (let year = 1; year <= years; year++) {
        balance = (balance + tuitionPerYear) * (1 + yearlyInterest / 100);
        data.push({ year, balance: Math.round(balance) });
      }
      return data;
    }; 

  // Calculate main category totals
    // Separate monthly and yearly calculations and arrays
    const mainCategoriesMonthly = (() => {
      const tuitionYearly = Number(budgetData.tuitionCost) || 0;
      const tuitionMonthly = tuitionYearly / 12;
      const mealPlanMonthly = Number(budgetData.mealPlanCost) || 0;
      const textbooksMonthly = Number(budgetData.textbooksSupplies) || 0;
      const schoolTotal = tuitionMonthly + mealPlanMonthly + textbooksMonthly;
      const housing = Number(budgetData.housingCost) || 0;
      const transportation = Number(budgetData.carExpenses) || 0;
      const food = (Number(budgetData.groceries) || 0) + (Number(budgetData.diningOut) || 0);
      const lifestyle = (Number(budgetData.entertainment) || 0) + (Number(budgetData.miscellaneousExpenses) || 0);
      return [
        { name: 'School', value: schoolTotal, color: COLORS.school, icon: GraduationCap },
        { name: 'Housing', value: housing, color: COLORS.housing, icon: HomeIcon },
        { name: 'Transportation', value: transportation, color: COLORS.transportation, icon: Car },
        { name: 'Food', value: food, color: COLORS.food, icon: Utensils },
        { name: 'Lifestyle', value: lifestyle, color: COLORS.lifestyle, icon: ShoppingBag },
      ].filter(cat => cat.value > 0);
    })();

    const mainCategoriesYearly = (() => {
      const tuitionYearly = Number(budgetData.tuitionCost) || 0;
      const mealPlanYearly = (Number(budgetData.mealPlanCost) || 0) * 12;
      const textbooksYearly = (Number(budgetData.textbooksSupplies) || 0) * 12;
      const schoolTotal = tuitionYearly + mealPlanYearly + textbooksYearly;
      const housing = (Number(budgetData.housingCost) || 0) * 12;
      const transportation = (Number(budgetData.carExpenses) || 0) * 12;
      const food = ((Number(budgetData.groceries) || 0) + (Number(budgetData.diningOut) || 0)) * 12;
      const lifestyle = ((Number(budgetData.entertainment) || 0) + (Number(budgetData.miscellaneousExpenses) || 0)) * 12;
      return [
        { name: 'School', value: schoolTotal, color: COLORS.school, icon: GraduationCap },
        { name: 'Housing', value: housing, color: COLORS.housing, icon: HomeIcon },
        { name: 'Transportation', value: transportation, color: COLORS.transportation, icon: Car },
        { name: 'Food', value: food, color: COLORS.food, icon: Utensils },
        { name: 'Lifestyle', value: lifestyle, color: COLORS.lifestyle, icon: ShoppingBag },
      ].filter(cat => cat.value > 0);
    })();

    const totalExpensesMonthly = mainCategoriesMonthly.reduce((sum, cat) => sum + cat.value, 0);
    const totalExpensesYearly = mainCategoriesYearly.reduce((sum, cat) => sum + cat.value, 0);
    const monthlyIncome = Number(budgetData.monthlyIncome) || 0;
    const yearlyIncome = monthlyIncome * 12;
    const remainingMonthly = monthlyIncome - totalExpensesMonthly;
    const remainingYearly = yearlyIncome - totalExpensesYearly;

    // Use values based on viewMode
    const mainCategories = viewMode === 'monthly' ? mainCategoriesMonthly : mainCategoriesYearly;
    const totalExpenses = viewMode === 'monthly' ? totalExpensesMonthly : totalExpensesYearly;
    const income = viewMode === 'monthly' ? monthlyIncome : yearlyIncome;
    const remaining = viewMode === 'monthly' ? remainingMonthly : remainingYearly;

  // Get sub-category data for each main category
  const getSchoolSubCategories = () => {
    // Tuition is per year, so adjust for monthly view
    const tuitionYearly = Number(budgetData.tuitionCost) || 0;
    const tuitionMonthly = tuitionYearly / 12;
    const mealPlanMonthly = Number(budgetData.mealPlanCost) || 0;
    const textbooksMonthly = Number(budgetData.textbooksSupplies) || 0;
    if (viewMode === 'monthly') {
      return [
        { name: 'Tuition', value: tuitionMonthly, color: COLORS.tuition },
        { name: 'Meal Plan', value: mealPlanMonthly, color: COLORS.mealPlan },
        { name: 'Textbooks & Supplies', value: textbooksMonthly, color: COLORS.textbooks },
      ].filter(item => item.value > 0);
    } else {
      return [
        { name: 'Tuition', value: tuitionYearly, color: COLORS.tuition },
        { name: 'Meal Plan', value: mealPlanMonthly * 12, color: COLORS.mealPlan },
        { name: 'Textbooks & Supplies', value: textbooksMonthly * 12, color: COLORS.textbooks },
      ].filter(item => item.value > 0);
    }
  };

  const getFoodSubCategories = () => {
    return [
      { name: 'Groceries', value: Number(budgetData.groceries) || 0, color: COLORS.groceries },
      { name: 'Dining Out', value: Number(budgetData.diningOut) || 0, color: COLORS.diningOut },
    ].filter(item => item.value > 0);
  };

  // (No longer needed: getMainCategories)

  // Move renderSubChart outside of Dashboard's main return
  function renderSubChart(title: string, data: any[], icon: any) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const Icon = icon;
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="ml-auto text-xl font-bold text-gray-900">
            ${total.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Pie Chart */}
          <div className="flex-shrink-0">
            <PieChart width={200} height={200}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </div>
          {/* Breakdown */}
          <div className="flex-1 space-y-3">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        ${item.value.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <PiggyBank className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Debt Busters</h1>
                <p className="text-sm text-gray-600">Your Financial Dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Budget
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Toggle */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-l-md focus:z-10 focus:ring-2 focus:ring-indigo-500 ${viewMode === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setViewMode('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-r-md focus:z-10 focus:ring-2 focus:ring-indigo-500 ${viewMode === 'yearly' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setViewMode('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{viewMode === 'monthly' ? 'Monthly Income' : 'Yearly Income'}</span>
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${income.toLocaleString()}
            </div>
            {viewMode === 'monthly' && budgetData.hourlyWage && (
              <p className="text-sm text-gray-500 mt-1">
                ${budgetData.hourlyWage}/hr × {budgetData.hoursPerWeek} hrs/week
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{viewMode === 'monthly' ? 'Total Expenses' : 'Total Expenses (Year)'}</span>
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Across {mainCategories.length} categories
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Remaining</span>
              <PiggyBank className="w-5 h-5 text-indigo-600" />
            </div>
            <div className={`text-3xl font-bold ${remaining >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              ${Math.abs(remaining).toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {remaining >= 0 ? 'Available to save' : 'Over budget'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('charts')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'charts'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <PieChartIcon className="w-5 h-5" />
                My Charts
              </button>
              <button
                onClick={() => setActiveTab('finance')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'finance'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Wallet className="w-5 h-5" />
                Finance
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'recommendations'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lightbulb className="w-5 h-5" />
                Recommendations
              </button>
              <button
                onClick={() => setActiveTab('loan')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'loan'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                Loan Growth
              </button>
            </div>
          </div>
            {/* Multi-Year Loan Accumulation Tab */}
            {activeTab === 'loan' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Accumulation & Job Salary Growth Over 30 Years</h2>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={getLoanAccumulationData()} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
                      <YAxis tickFormatter={v => `$${v.toLocaleString()}`} label={{ value: 'Balance', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} dot={false} name="Loan Balance" />
                      {/* Plot salary growth for each job */}
                      {Array.isArray(salaryData) && salaryData.slice(0, 5).map((job, idx) => {
                        // Try to get a starting salary from the API result
                        const startSalary = Number(job['latest.programs.cip_4_digit.earnings.1_yr.overall_median_earnings']) || 0;
                        if (!startSalary) return null;
                        const colorList = ['#22c55e', '#f59e42', '#3b82f6', '#e11d48', '#a21caf'];
                        return (
                          <Line
                            key={job['school.name'] || idx}
                            type="monotone"
                            data={getSalaryGrowthData(startSalary)}
                            dataKey="salary"
                            stroke={colorList[idx % colorList.length]}
                            strokeWidth={2}
                            dot={false}
                            name={job['school.name'] ? `Salary: ${job['school.name']}` : `Job ${idx + 1}`}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-gray-600 text-sm">
                    <p>This graph shows how your loan balance grows each year for up to 30 years, based on your yearly tuition and interest rate.</p>
                    <p className="mt-2">Colored lines show projected average salary growth for the top 5 jobs/institutions from your major (assuming 3% annual increase).</p>
                  </div>
                </div>
                {/* Render the 5 jobs below the chart */}
                {Array.isArray(salaryData) && salaryData.length > 0 ? (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Top 5 Jobs/Institutions by Median Salary</h3>
                    <ul className="grid md:grid-cols-2 gap-4">
                      {salaryData.slice(0, 5).map((job, idx) => (
                        <li key={job['school.name'] || idx} className="bg-gray-50 rounded-lg p-4 border border-indigo-100">
                          <div className="font-bold text-indigo-700">{job['school.name'] || `Job ${idx + 1}`}</div>
                          <div className="text-gray-700">Median 1yr Salary: <span className="font-semibold">{job['latest.programs.cip_4_digit.earnings.1_yr.overall_median_earnings'] ? `$${Number(job['latest.programs.cip_4_digit.earnings.1_yr.overall_median_earnings']).toLocaleString()}` : 'N/A'}</span></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-8 text-center text-gray-500">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No salary/job data available for this major.</h3>
                    <p>Try selecting a different major or check back later for updated data.</p>
                  </div>
                )}
              </div>
            )}

          <div className="p-8">
            {/* My Charts Tab */}
            {activeTab === 'charts' && (
              <div className="space-y-8">
                {/* Overall Breakdown */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Budget Breakdown</h2>
                  
                  {mainCategories.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                      {/* Main Pie Chart */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Monthly Spending</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={mainCategories}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {mainCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Category Summary */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Category Summary</h3>
                        {mainCategories.map((category, index) => {
                          const percentage = ((category.value / totalExpenses) * 100).toFixed(1);
                          const Icon = category.icon;
                          return (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  />
                                  <Icon className="w-4 h-4 text-gray-600" />
                                  <span className="font-semibold text-gray-900">{category.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">
                                  ${category.value.toLocaleString()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full transition-all"
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: category.color
                                  }}
                                />
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {percentage}% of total expenses
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <PieChartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No expense data available</p>
                      <Link 
                        to="/questionnaire"
                        className="inline-block mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
                      >
                        Add your expenses
                      </Link>
                    </div>
                  )}
                </div>

                {/* Category Breakdowns */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Breakdowns</h2>
                  <div className="grid gap-6">
                    {/* School Sub-Chart */}
                    {renderSubChart('School Expenses', getSchoolSubCategories(), GraduationCap)}
                    
                    {/* Housing Sub-Chart */}
                    {budgetData.housingCost && Number(budgetData.housingCost) > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <HomeIcon className="w-5 h-5 text-indigo-600" />
                          <h3 className="text-lg font-semibold text-gray-900">Housing</h3>
                          <span className="ml-auto text-xl font-bold text-gray-900">
                            ${Number(budgetData.housingCost).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">{budgetData.livingSituation}</p>
                          <p className="text-xs text-gray-500">Paid by: {budgetData.whoPaysHousing}</p>
                        </div>
                      </div>
                    )}

                    {/* Transportation Sub-Chart */}
                    {budgetData.hasCar === 'Yes' && budgetData.carExpenses && Number(budgetData.carExpenses) > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Car className="w-5 h-5 text-indigo-600" />
                          <h3 className="text-lg font-semibold text-gray-900">Transportation</h3>
                          <span className="ml-auto text-xl font-bold text-gray-900">
                            ${Number(budgetData.carExpenses).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Car expenses including gas, insurance, and maintenance</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Food Sub-Chart */}
                    {renderSubChart('Food Expenses', getFoodSubCategories(), Utensils)}
                    
                    {/* Lifestyle Sub-Chart */}
                    {renderSubChart('Lifestyle & Other', getLifestyleSubCategories(budgetData), ShoppingBag)}
                  </div>
                </div>

                {/* Income vs Expenses */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Monthly Income</span>
                        <span className="font-bold text-green-600">${monthlyIncome.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-green-500"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Total Expenses</span>
                        <span className="font-bold text-purple-600">${totalExpenses.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-purple-500"
                          style={{ width: `${Math.min((totalExpenses / monthlyIncome) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-300">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Net</span>
                        <span className={`font-bold text-xl ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {remaining >= 0 ? '+' : '-'}${Math.abs(remaining).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Finance Tab */}
            {activeTab === 'finance' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget Overview</h2>
                  
                  {/* Income Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-green-600" />
                      Income
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Monthly Income</div>
                          <div className="text-3xl font-bold text-green-600">
                            ${monthlyIncome.toLocaleString()}
                          </div>
                        </div>
                        {budgetData.hasJob === 'Yes' && (
                          <>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Hourly Wage</div>
                              <div className="text-2xl font-bold text-gray-900">
                                ${budgetData.hourlyWage}/hr
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Hours per Week</div>
                              <div className="text-2xl font-bold text-gray-900">
                                {budgetData.hoursPerWeek} hours
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Career Field</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {budgetData.careerField || 'Not specified'}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expenses Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Wallet className="w-6 h-6 text-purple-600" />
                      Expenses
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Tuition */}
                      {budgetData.tuitionCost && Number(budgetData.tuitionCost) > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="bg-purple-100 p-2 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Tuition</h4>
                                <p className="text-sm text-gray-600">College tuition fees</p>
                                <p className="text-xs text-gray-500 mt-1">Paid by: {budgetData.whoPaystuition}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${Number(budgetData.tuitionCost).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">per month</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Housing */}
                      {budgetData.housingCost && Number(budgetData.housingCost) > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="bg-indigo-100 p-2 rounded-lg">
                                <HomeIcon className="w-6 h-6 text-indigo-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Housing</h4>
                                <p className="text-sm text-gray-600">{budgetData.livingSituation}</p>
                                <p className="text-xs text-gray-500 mt-1">Paid by: {budgetData.whoPaysHousing}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${Number(budgetData.housingCost).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">per month</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Meal Plan */}
                      {budgetData.mealPlanCost && Number(budgetData.mealPlanCost) > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="bg-purple-100 p-2 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Meal Plan</h4>
                                <p className="text-sm text-gray-600">College meal plan</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${Number(budgetData.mealPlanCost).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">per month</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Car */}
                      {budgetData.hasCar === 'Yes' && budgetData.carExpenses && Number(budgetData.carExpenses) > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="bg-pink-100 p-2 rounded-lg">
                                <Car className="w-6 h-6 text-pink-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Car Expenses</h4>
                                <p className="text-sm text-gray-600">Gas, insurance, maintenance</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${Number(budgetData.carExpenses).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">per month</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Other Expenses */}
                      {budgetData.textbooksSupplies && Number(budgetData.textbooksSupplies) > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="bg-amber-100 p-2 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-amber-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Textbooks & Supplies</h4>
                                <p className="text-sm text-gray-600">Academic materials</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${Number(budgetData.textbooksSupplies).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">per month</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {budgetData.groceries && Number(budgetData.groceries) > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Groceries</h4>
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              ${Number(budgetData.groceries).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}

                      {budgetData.diningOut && Number(budgetData.diningOut) > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Dining Out</h4>
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              ${Number(budgetData.diningOut).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}

                      {budgetData.entertainment && Number(budgetData.entertainment) > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Entertainment</h4>
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              ${Number(budgetData.entertainment).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}

                      {budgetData.miscellaneousExpenses && Number(budgetData.miscellaneousExpenses) > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="bg-gray-100 p-2 rounded-lg">
                                <MoreHorizontal className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Miscellaneous</h4>
                                <p className="text-sm text-gray-600">Other expenses</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${Number(budgetData.miscellaneousExpenses).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">per month</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 mt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Total Monthly Expenses</div>
                          <div className="text-3xl font-bold text-purple-600">
                            ${totalExpenses.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Net Cash Flow</div>
                          <div className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {remaining >= 0 ? '+' : '-'}${Math.abs(remaining).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Goals */}
                  {budgetData.primaryGoal && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <PiggyBank className="w-6 h-6 text-indigo-600" />
                        Financial Goals
                      </h3>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Primary Goal</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {budgetData.primaryGoal}
                            </div>
                          </div>
                          {budgetData.savingsTarget && (
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Savings Target</div>
                              <div className="text-2xl font-bold text-indigo-600">
                                ${Number(budgetData.savingsTarget).toLocaleString()}
                              </div>
                              {remaining > 0 && (
                                <div className="text-sm text-gray-600 mt-1">
                                  {Math.ceil(Number(budgetData.savingsTarget) / remaining)} months to reach goal
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <Recommendations 
                budgetData={budgetData}
                monthlyIncome={monthlyIncome}
                totalExpenses={totalExpenses}
                remaining={remaining}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Category Modal */}
      {showEditModal && <EditCategoryModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
}