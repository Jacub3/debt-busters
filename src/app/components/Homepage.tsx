import { Link } from "react-router";
import { 
  PiggyBank, 
  TrendingUp, 
  Wallet, 
  DollarSign,
  ChevronRight,
  GraduationCap,
  Target,
  Shield
} from "lucide-react";

export function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <PiggyBank className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Debt Busters</h1>
              <p className="text-sm text-gray-600">Smart budgeting for college students</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Take Control of Your
            <span className="text-indigo-600"> College Budget</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized budgeting insights designed specifically for your college lifestyle. 
            Start with a quick 2-minute questionnaire.
          </p>
          <Link 
            to="/questionnaire"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Your Financial Journey
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Wallet className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Track Spending</h3>
            <p className="text-gray-600">
              Understand where your money goes each month and identify areas to save.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Build Wealth</h3>
            <p className="text-gray-600">
              Learn smart saving strategies that work with your student budget.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reach Goals</h3>
            <p className="text-gray-600">
              Set and achieve financial goals, from spring break to paying off loans.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">$2,800</div>
              <p className="text-gray-600">Average Monthly Student Expenses</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">63%</div>
              <p className="text-gray-600">Students Live Paycheck to Paycheck</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">$1,200</div>
              <p className="text-gray-600">Potential Annual Savings with Budgeting</p>
            </div>
          </div>
        </div>

        {/* Why Start Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">
              Why Start Budgeting in College?
            </h3>
            <p className="text-lg mb-8 text-indigo-100">
              Building good financial habits now sets you up for success after graduation. 
              Learn to manage student loans, part-time income, and living expenses while 
              still having fun with friends.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <div className="font-semibold mb-1">Avoid Debt</div>
                  <div className="text-sm text-indigo-100">Stay on top of expenses</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <div className="font-semibold mb-1">Save Money</div>
                  <div className="text-sm text-indigo-100">Build an emergency fund</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <div className="font-semibold mb-1">Future Success</div>
                  <div className="text-sm text-indigo-100">Develop lifelong skills</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">Ready to get started?</p>
          <Link 
            to="/questionnaire"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Begin Questionnaire
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2026 Debt Busters. Helping students build better financial futures.</p>
        </div>
      </footer>
    </div>
  );
}