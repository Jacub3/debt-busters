import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { 
  ChevronLeft, 
  ChevronRight,
  PiggyBank,
  Home,
  DollarSign,
  Car,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  MoreHorizontal
} from "lucide-react";

interface FormData {
  // Step 1: Personal Info
  year: string;
  livingSituation: string;
  major: string;
  
  // Step 2: Housing
  housingCost: string;
  whoPaysHousing: string;
  mealPlanCost: string;
  tuitionCost: string;
  whoPaystuition: string;
  
  // Step 3: Transportation
  hasCar: string;
  carExpenses: string;
  
  // Step 4: Work/Career
  hasJob: string;
  monthlyIncome: string;
  hourlyWage: string;
  hoursPerWeek: string;
  careerField: string;
  
  // Step 5: Other Expenses
  textbooksSupplies: string;
  groceries: string;
  diningOut: string;
  entertainment: string;
  miscellaneousExpenses: string;
  
  // Step 6: Financial Goals
  primaryGoal: string;
  savingsTarget: string;
}

export function Questionnaire() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    year: "",
    livingSituation: "",
    major: "",
    housingCost: "",
    whoPaysHousing: "",
    mealPlanCost: "",
    tuitionCost: "",
    whoPaystuition: "",
    hasCar: "",
    carExpenses: "",
    hasJob: "",
    monthlyIncome: "",
    hourlyWage: "",
    hoursPerWeek: "",
    careerField: "",
    textbooksSupplies: "",
    groceries: "",
    diningOut: "",
    entertainment: "",
    miscellaneousExpenses: "",
    primaryGoal: "",
    savingsTarget: "",
  });

  const totalSteps = 6;

  // Load existing data if editing
  useEffect(() => {
    const existingData = localStorage.getItem('budgetData');
    if (existingData) {
      setFormData(JSON.parse(existingData));
    }

    // Check if we should jump to a specific step
    const editStep = localStorage.getItem('editStep');
    if (editStep) {
      setCurrentStep(Number(editStep));
      localStorage.removeItem('editStep'); // Clean up
    }
  }, []);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-calculate monthly income from hourly wage
  useEffect(() => {
    if (formData.hourlyWage && formData.hoursPerWeek) {
      const hourly = Number(formData.hourlyWage);
      const hours = Number(formData.hoursPerWeek);
      const monthly = Math.round((hourly * hours * 52) / 12);
      setFormData(prev => ({ ...prev, monthlyIncome: monthly.toString() }));
    }
  }, [formData.hourlyWage, formData.hoursPerWeek]);

  const nextStep = () => {
    // Save data to localStorage on every step
    localStorage.setItem('budgetData', JSON.stringify(formData));
    
    // Check if we should return to dashboard (editing mode)
    const returnToDashboard = localStorage.getItem('returnToDashboard');
    
    if (returnToDashboard) {
      // Clean up and return to dashboard
      localStorage.removeItem('returnToDashboard');
      navigate('/dashboard');
    } else if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Completing the questionnaire for the first time
      navigate('/dashboard');
    }
  };

  const prevStep = () => {
    // Save data before going back
    localStorage.setItem('budgetData', JSON.stringify(formData));
    
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4">
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Questionnaire</h1>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    About You
                  </h2>
                </div>
                <p className="text-gray-600">Let's start with the basics</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What year are you in?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Freshman", "Sophomore", "Junior", "Senior", "Graduate"].map(year => (
                    <button
                      key={year}
                      onClick={() => updateFormData("year", year)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.year === year
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where do you live?
                </label>
                <div className="space-y-2">
                  {["On-campus dorm", "Off-campus apartment", "With parents/family", "Greek housing"].map(option => (
                    <button
                      key={option}
                      onClick={() => updateFormData("livingSituation", option)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.livingSituation === option
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your major?
                </label>
                <select
                  value={formData.major}
                  onChange={(e) => updateFormData("major", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                >
                  <option value="">Select your major</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business/Marketing</option>
                  <option value="Nursing">Nursing/Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Design">Design/Fine Arts</option>
                  <option value="Communications">Communications/Media</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Biology">Biology/Life Sciences</option>
                  <option value="Math">Mathematics/Statistics</option>
                  <option value="English">English/Literature</option>
                  <option value="Economics">Economics/Finance</option>
                  <option value="Political Science">Political Science</option>
                  <option value="Criminal Justice">Criminal Justice</option>
                  <option value="Undecided">Undecided</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Housing */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Home className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Housing & Meal Plan
                  </h2>
                </div>
                <p className="text-gray-600">Tell us about your living costs</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly housing cost (rent/dorm fees)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.housingCost}
                    onChange={(e) => updateFormData("housingCost", e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Enter 0 if living with parents/family</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who pays for your housing?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["I pay", "Parents/Family", "Scholarships/Aid", "Split"].map(option => (
                    <button
                      key={option}
                      onClick={() => updateFormData("whoPaysHousing", option)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.whoPaysHousing === option
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly meal plan cost
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.mealPlanCost}
                    onChange={(e) => updateFormData("mealPlanCost", e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">College meal plan or estimated food costs</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly tuition cost
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.tuitionCost}
                    onChange={(e) => updateFormData("tuitionCost", e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Divide semester/annual tuition by months</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who pays for your tuition?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["I pay", "Parents/Family", "Scholarships/Aid", "Student loans", "Split"].map(option => (
                    <button
                      key={option}
                      onClick={() => updateFormData("whoPaystuition", option)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.whoPaystuition === option
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Transportation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Car className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Transportation
                  </h2>
                </div>
                <p className="text-gray-600">Do you have a car?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you have a car on campus?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Yes", "No"].map(option => (
                    <button
                      key={option}
                      onClick={() => updateFormData("hasCar", option)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.hasCar === option
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {formData.hasCar === "Yes" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly car expenses
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.carExpenses}
                      onChange={(e) => updateFormData("carExpenses", e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Include gas, insurance, parking, maintenance
                  </p>
                </div>
              )}

              {formData.hasCar === "No" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    💡 Using public transit or biking? Great way to save money!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Work/Career */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Work & Income
                  </h2>
                </div>
                <p className="text-gray-600">Tell us about your job</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you have a job?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Yes", "No"].map(option => (
                    <button
                      key={option}
                      onClick={() => updateFormData("hasJob", option)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.hasJob === option
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {formData.hasJob === "Yes" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly wage
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.hourlyWage}
                        onChange={(e) => updateFormData("hourlyWage", e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours per week
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.hoursPerWeek}
                      onChange={(e) => updateFormData("hoursPerWeek", e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  {formData.monthlyIncome && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Estimated Monthly Income</div>
                      <div className="text-2xl font-bold text-green-600">
                        ${Number(formData.monthlyIncome).toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What field do you work in?
                    </label>
                    <input
                      type="text"
                      value={formData.careerField}
                      onChange={(e) => updateFormData("careerField", e.target.value)}
                      placeholder="e.g., Retail, Food Service, Tutoring, Internship"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 5: Other Expenses */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Other Monthly Expenses
                  </h2>
                </div>
                <p className="text-gray-600">Estimate your other monthly costs</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Textbooks & Supplies
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.textbooksSupplies}
                    onChange={(e) => updateFormData("textbooksSupplies", e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Groceries
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.groceries}
                    onChange={(e) => updateFormData("groceries", e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dining Out
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.diningOut}
                    onChange={(e) => updateFormData("diningOut", e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entertainment & Social
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.entertainment}
                    onChange={(e) => updateFormData("entertainment", e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miscellaneous
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.miscellaneousExpenses}
                    onChange={(e) => updateFormData("miscellaneousExpenses", e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Phone bill, subscriptions, personal care, etc.
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Financial Goals */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Financial Goals
                  </h2>
                </div>
                <p className="text-gray-600">What are you saving for?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your primary financial goal?
                </label>
                <div className="space-y-2">
                  {[
                    "Pay off student loans",
                    "Build emergency fund",
                    "Save for spring break/vacation",
                    "Study abroad",
                    "Buy a car",
                    "Graduate debt-free",
                    "Start investing",
                    "Just trying to make ends meet"
                  ].map(goal => (
                    <button
                      key={goal}
                      onClick={() => updateFormData("primaryGoal", goal)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.primaryGoal === goal
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How much are you aiming to save?
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.savingsTarget}
                    onChange={(e) => updateFormData("savingsTarget", e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
            )}
            
            <button
              onClick={nextStep}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors ml-auto"
            >
              {currentStep === totalSteps ? "View Dashboard" : "Next"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}