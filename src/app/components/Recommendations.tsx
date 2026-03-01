import { 
  Lightbulb,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Utensils,
  ShoppingBag,
  Car,
  GraduationCap,
  PieChart as PieChartIcon
} from "lucide-react";

interface RecommendationsProps {
  budgetData: any;
  monthlyIncome: number;
  totalExpenses: number;
  remaining: number;
}

export function Recommendations({ budgetData, monthlyIncome, totalExpenses, remaining }: RecommendationsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget Recommendations</h2>
        <p className="text-gray-600 mb-6">Personalized insights to help you optimize your spending</p>

        {/* Budget Health Score */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Budget Health Score</h3>
            <div className="text-right">
              {remaining >= 0 ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">Good</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-600">Needs Attention</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-700">
            {remaining >= 0 
              ? `You're saving $${remaining.toLocaleString()} per month. Great job staying within budget!`
              : `You're spending $${Math.abs(remaining).toLocaleString()} more than you earn each month. Let's find ways to reduce expenses or increase income.`
            }
          </p>
        </div>

        {/* Spending Analysis */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-indigo-600" />
            Where You Can Save
          </h3>
          
          <div className="space-y-4">
            {/* Food Recommendations */}
            {(() => {
              const foodTotal = (Number(budgetData.groceries) || 0) + (Number(budgetData.diningOut) || 0);
              const diningOut = Number(budgetData.diningOut) || 0;
              const foodPercentage = monthlyIncome > 0 ? (foodTotal / monthlyIncome) * 100 : 0;
              
              if (foodTotal > 0) {
                return (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Utensils className="w-5 h-5 text-green-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Food & Dining</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Current: ${foodTotal.toLocaleString()}/month ({foodPercentage.toFixed(0)}% of income)
                        </p>
                        
                        {diningOut > foodTotal * 0.5 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                            <p className="text-sm text-gray-700 mb-2">
                              💡 <strong>Tip:</strong> You're spending ${diningOut.toLocaleString()} on dining out. 
                              Reducing this by 30% could save you ${Math.round(diningOut * 0.3).toLocaleString()}/month.
                            </p>
                          </div>
                        )}
                        
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Cook at home 3-4 times a week instead of eating out</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Use your meal plan fully if you have one</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Buy groceries in bulk and meal prep on weekends</span>
                          </li>
                        </ul>
                        
                        {diningOut > 100 && (
                          <div className="mt-3 text-sm font-semibold text-green-700">
                            Potential monthly savings: ${Math.round(diningOut * 0.3).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Entertainment Recommendations */}
            {(() => {
              const entertainment = Number(budgetData.entertainment) || 0;
              const entertainmentPercentage = monthlyIncome > 0 ? (entertainment / monthlyIncome) * 100 : 0;
              
              if (entertainment > 0) {
                return (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <ShoppingBag className="w-5 h-5 text-amber-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Entertainment & Social</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Current: ${entertainment.toLocaleString()}/month ({entertainmentPercentage.toFixed(0)}% of income)
                        </p>
                        
                        {entertainmentPercentage > 15 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                            <p className="text-sm text-gray-700">
                              💡 <strong>Tip:</strong> Recommended entertainment budget is 10-15% of income (${Math.round(monthlyIncome * 0.15).toLocaleString()}). 
                              You could save ${entertainment - Math.round(monthlyIncome * 0.15)}/month.
                            </p>
                          </div>
                        )}
                        
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Look for free campus events and activities</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Use student discounts for movies, concerts, and subscriptions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Share streaming services with roommates</span>
                          </li>
                        </ul>
                        
                        {entertainmentPercentage > 15 && (
                          <div className="mt-3 text-sm font-semibold text-green-700">
                            Potential monthly savings: ${entertainment - Math.round(monthlyIncome * 0.15)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Transportation Recommendations */}
            {budgetData.hasCar === 'Yes' && Number(budgetData.carExpenses) > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Car className="w-5 h-5 text-pink-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Transportation</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Current: ${budgetData.carExpenses}/month
                    </p>
                    
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Use campus parking instead of off-campus lots when possible</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Carpool with classmates to split gas costs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Use bike or public transit for short trips</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Compare car insurance rates annually for better deals</span>
                      </li>
                    </ul>
                    
                    <div className="mt-3 text-sm font-semibold text-green-700">
                      Potential monthly savings: ${Math.round(Number(budgetData.carExpenses) * 0.2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Textbooks Recommendations */}
            {Number(budgetData.textbooksSupplies) > 100 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <GraduationCap className="w-5 h-5 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Textbooks & Supplies</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Current: ${budgetData.textbooksSupplies}/month
                    </p>
                    
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Rent textbooks instead of buying new</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Buy used books or digital versions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Check library reserves before purchasing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Sell back books at end of semester</span>
                      </li>
                    </ul>
                    
                    <div className="mt-3 text-sm font-semibold text-green-700">
                      Potential monthly savings: ${Math.round(Number(budgetData.textbooksSupplies) * 0.4)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Income Opportunities */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Increase Your Income
          </h3>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-700 mb-4">
              {budgetData.hasJob === 'Yes' 
                ? "You're already working - great! Here are ways to boost your earnings:"
                : "Consider these opportunities to earn extra income:"}
            </p>
            
            <ul className="space-y-3 text-sm text-gray-700">
              {budgetData.hasJob === 'Yes' ? (
                <>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Ask about additional hours or overtime opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Freelance in your field during breaks or weekends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tutor in subjects you excel at (often $20-40/hr)</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Part-time on-campus job (10-15 hours/week, ~$600-900/month)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tutoring fellow students ($20-40/hr)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Freelance work related to your major</span>
                  </li>
                </>
              )}
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Apply for scholarships and grants (free money!)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Sell unused items online (textbooks, electronics, clothes)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Participate in paid research studies on campus</span>
              </li>
            </ul>
          </div>

          {/* Major-Specific Job Opportunities */}
          {budgetData.major && budgetData.major !== 'Undecided' && (
            <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 mt-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-600" />
                Jobs Perfect for {budgetData.major} Majors
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Based on your major, these roles can help you earn money while building relevant experience:
              </p>
              
              {(() => {
                const majorJobs: Record<string, { jobs: Array<{ title: string; pay: string; description: string }> }> = {
                  'Computer Science': {
                    jobs: [
                      { title: 'Web Development Freelance', pay: '$30-75/hr', description: 'Build websites for local businesses or startups' },
                      { title: 'CS Tutoring', pay: '$25-50/hr', description: 'Tutor intro programming courses (Python, Java, etc.)' },
                      { title: 'Tech Support/IT Help Desk', pay: '$15-22/hr', description: 'On-campus or remote tech support positions' },
                      { title: 'App Development Projects', pay: '$500-5,000/project', description: 'Freelance mobile or web app development' },
                    ]
                  },
                  'Engineering': {
                    jobs: [
                      { title: 'Engineering Tutor', pay: '$25-45/hr', description: 'Tutor calculus, physics, or engineering courses' },
                      { title: 'CAD Design Freelance', pay: '$20-40/hr', description: 'Create 3D models or technical drawings' },
                      { title: 'Lab Assistant', pay: '$12-18/hr', description: 'Help professors with research or lab setup' },
                      { title: 'Engineering Internship', pay: '$18-30/hr', description: 'Part-time co-op or internship positions' },
                    ]
                  },
                  'Business': {
                    jobs: [
                      { title: 'Social Media Manager', pay: '$15-35/hr', description: 'Manage social accounts for small businesses' },
                      { title: 'Market Research Assistant', pay: '$16-25/hr', description: 'Conduct surveys and analyze data for companies' },
                      { title: 'Sales Associate', pay: '$12-20/hr + commission', description: 'Retail or B2B sales with commission' },
                      { title: 'Virtual Assistant', pay: '$15-30/hr', description: 'Remote admin support for entrepreneurs' },
                    ]
                  },
                  'Nursing': {
                    jobs: [
                      { title: 'Certified Nursing Assistant (CNA)', pay: '$14-20/hr', description: 'Work in hospitals or care facilities' },
                      { title: 'Patient Care Technician', pay: '$13-18/hr', description: 'Assist with basic patient care' },
                      { title: 'Medical Scribe', pay: '$12-16/hr', description: 'Document patient encounters for physicians' },
                      { title: 'Health Tutor', pay: '$20-35/hr', description: 'Tutor anatomy, physiology, or nursing courses' },
                    ]
                  },
                  'Education': {
                    jobs: [
                      { title: 'Private Tutoring', pay: '$20-40/hr', description: 'Tutor K-12 students in various subjects' },
                      { title: 'After-School Program Leader', pay: '$13-18/hr', description: 'Lead activities at youth centers' },
                      { title: 'Teaching Assistant', pay: '$12-17/hr', description: 'Help teachers in classrooms' },
                      { title: 'Test Prep Instructor', pay: '$25-50/hr', description: 'Teach SAT/ACT prep courses' },
                    ]
                  },
                  'Design': {
                    jobs: [
                      { title: 'Graphic Design Freelance', pay: '$25-60/hr', description: 'Create logos, flyers, social media graphics' },
                      { title: 'UI/UX Design Projects', pay: '$30-70/hr', description: 'Design interfaces for apps and websites' },
                      { title: 'Print-on-Demand Shop', pay: 'Varies', description: 'Sell your designs on Redbubble, Society6, etc.' },
                      { title: 'Photography/Videography', pay: '$50-200/event', description: 'Shoot events or create content for brands' },
                    ]
                  },
                  'Communications': {
                    jobs: [
                      { title: 'Content Writer', pay: '$15-40/hr', description: 'Write blog posts, articles, or copy for businesses' },
                      { title: 'Social Media Coordinator', pay: '$15-30/hr', description: 'Create and schedule social media content' },
                      { title: 'Campus News Reporter', pay: '$12-18/hr', description: 'Write for student newspaper or local media' },
                      { title: 'Podcast Editor', pay: '$20-40/hr', description: 'Edit audio for podcasters and content creators' },
                    ]
                  },
                  'Psychology': {
                    jobs: [
                      { title: 'Research Assistant', pay: '$12-18/hr', description: 'Help professors with psychology research' },
                      { title: 'Peer Counselor', pay: '$13-17/hr', description: 'Provide support at campus counseling center' },
                      { title: 'Behavior Technician', pay: '$15-22/hr', description: 'Work with children with autism or behavioral needs' },
                      { title: 'Crisis Hotline Volunteer→Paid', pay: '$14-20/hr', description: 'Start volunteer, transition to paid positions' },
                    ]
                  },
                  'Biology': {
                    jobs: [
                      { title: 'Lab Research Assistant', pay: '$12-18/hr', description: 'Assist with scientific research on campus' },
                      { title: 'Science Tutor', pay: '$20-40/hr', description: 'Tutor biology, chemistry, or general science' },
                      { title: 'Phlebotomist', pay: '$15-20/hr', description: 'Draw blood (requires certification)' },
                      { title: 'Veterinary Assistant', pay: '$12-16/hr', description: 'Help at animal clinics or shelters' },
                    ]
                  },
                  'Math': {
                    jobs: [
                      { title: 'Math Tutor', pay: '$25-50/hr', description: 'High demand for calculus and statistics tutoring' },
                      { title: 'Data Entry Specialist', pay: '$14-20/hr', description: 'Remote data analysis and entry' },
                      { title: 'Actuarial Intern', pay: '$20-30/hr', description: 'Part-time work at insurance companies' },
                      { title: 'Test Prep (SAT/ACT Math)', pay: '$30-60/hr', description: 'Teach standardized test math sections' },
                    ]
                  },
                  'English': {
                    jobs: [
                      { title: 'Freelance Writing', pay: '$20-50/hr', description: 'Write articles, essays, or creative content' },
                      { title: 'Copy Editing/Proofreading', pay: '$18-35/hr', description: 'Edit papers, books, or web content' },
                      { title: 'Writing Tutor', pay: '$20-40/hr', description: 'Help students with essays and writing skills' },
                      { title: 'Publishing Intern', pay: '$12-18/hr', description: 'Work at publishing houses or literary magazines' },
                    ]
                  },
                  'Economics': {
                    jobs: [
                      { title: 'Economics Tutor', pay: '$25-45/hr', description: 'Tutor micro/macroeconomics courses' },
                      { title: 'Financial Analyst Intern', pay: '$18-28/hr', description: 'Part-time analysis work' },
                      { title: 'Data Analyst Assistant', pay: '$16-25/hr', description: 'Help with economic data analysis' },
                      { title: 'Tax Preparation', pay: '$15-25/hr', description: 'Seasonal work during tax season (get certified)' },
                    ]
                  },
                  'Political Science': {
                    jobs: [
                      { title: 'Campaign Worker', pay: '$15-20/hr', description: 'Work on political campaigns (seasonal)' },
                      { title: 'Legislative Intern', pay: '$12-18/hr', description: 'Intern at government offices' },
                      { title: 'Research Assistant', pay: '$13-18/hr', description: 'Help with political science research' },
                      { title: 'Policy Writing Freelance', pay: '$20-40/hr', description: 'Write policy briefs or analysis' },
                    ]
                  },
                  'Criminal Justice': {
                    jobs: [
                      { title: 'Campus Security', pay: '$13-18/hr', description: 'Work at campus police department' },
                      { title: 'Legal Assistant', pay: '$15-22/hr', description: 'Help at law firms or legal aid offices' },
                      { title: 'Court Clerk', pay: '$14-20/hr', description: 'Part-time work at courthouses' },
                      { title: 'Private Investigator Assistant', pay: '$14-20/hr', description: 'Help licensed investigators' },
                    ]
                  },
                  'Other': {
                    jobs: [
                      { title: 'General Tutoring', pay: '$20-35/hr', description: 'Tutor subjects you excel at' },
                      { title: 'Campus Tour Guide', pay: '$12-16/hr', description: 'Give tours to prospective students' },
                      { title: 'Resident Assistant (RA)', pay: 'Free housing + stipend', description: 'Live in dorms and support students' },
                      { title: 'Freelance Consulting', pay: '$25-50/hr', description: 'Offer your specialized skills online' },
                    ]
                  }
                };

                const jobs = majorJobs[budgetData.major] || majorJobs['Other'];
                
                return (
                  <div className="space-y-3">
                    {jobs.jobs.map((job, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-gray-900">{job.title}</h5>
                          <span className="text-green-700 font-bold text-sm bg-green-100 px-2 py-1 rounded">{job.pay}</span>
                        </div>
                        <p className="text-sm text-gray-600">{job.description}</p>
                      </div>
                    ))}
                    <div className="bg-white rounded-lg p-4 border-2 border-green-300 mt-4">
                      <p className="text-sm text-gray-700">
                        💡 <strong>Pro Tip:</strong> Even earning an extra ${(() => {
                          const avgPay = budgetData.major === 'Computer Science' ? 40 : 
                                       budgetData.major === 'Design' ? 35 :
                                       budgetData.major === 'Math' ? 35 : 20;
                          return avgPay * 10;
                        })()}/month (10 hrs at avg. rate) could cover your {(() => {
                          const groceries = Number(budgetData.groceries) || 0;
                          const entertainment = Number(budgetData.entertainment) || 0;
                          if (groceries > entertainment) return 'groceries';
                          return 'entertainment';
                        })()} expenses!
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Recommended Budget Allocation */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-6 h-6 text-indigo-600" />
            Recommended Budget Allocation
          </h3>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
            <p className="text-gray-700 mb-6">
              Based on your ${monthlyIncome.toLocaleString()} monthly income, here's a recommended budget:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Essential Expenses (50-60%)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Housing & Utilities</span>
                    <span className="font-semibold">${Math.round(monthlyIncome * 0.30).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Food & Groceries</span>
                    <span className="font-semibold">${Math.round(monthlyIncome * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transportation</span>
                    <span className="font-semibold">${Math.round(monthlyIncome * 0.10).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-semibold">Subtotal</span>
                    <span className="font-bold">${Math.round(monthlyIncome * 0.55).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Discretionary (25-30%)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entertainment</span>
                    <span className="font-semibold">${Math.round(monthlyIncome * 0.10).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dining Out</span>
                    <span className="font-semibold">${Math.round(monthlyIncome * 0.08).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Miscellaneous</span>
                    <span className="font-semibold">${Math.round(monthlyIncome * 0.07).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-semibold">Subtotal</span>
                    <span className="font-bold">${Math.round(monthlyIncome * 0.25).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3">Savings & Goals (20%)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Fund</span>
                    <span className="font-semibold">${Math.round(monthlyIncome * 0.10).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal: {budgetData.primaryGoal || 'Future goals'}</span>
                    <span className="font-semibold">${Math.round(monthlyIncome * 0.10).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-semibold">Subtotal</span>
                    <span className="font-bold text-green-600">${Math.round(monthlyIncome * 0.20).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-indigo-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Your Current Allocation</span>
                <span className={`text-xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {remaining >= 0 
                    ? `Saving ${((remaining / monthlyIncome) * 100).toFixed(0)}%`
                    : `${((Math.abs(remaining) / monthlyIncome) * 100).toFixed(0)}% over budget`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-indigo-600 text-white rounded-xl p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Your Action Plan</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-white text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
              <p className="text-indigo-50">Review your expenses and identify your top 3 spending categories</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
              <p className="text-indigo-50">Implement at least 2 cost-saving tips from the recommendations above</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
              <p className="text-indigo-50">Set up automatic transfers to savings (even $25/month makes a difference!)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">4</div>
              <p className="text-indigo-50">Update your budget monthly using the "Edit Budget" button</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
