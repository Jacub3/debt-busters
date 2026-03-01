import { useNavigate } from "react-router";
import { 
  GraduationCap, 
  Home, 
  Car, 
  Utensils, 
  ShoppingBag,
  Briefcase,
  DollarSign,
  X
} from "lucide-react";

interface EditCategoryModalProps {
  onClose: () => void;
}

export function EditCategoryModal({ onClose }: EditCategoryModalProps) {
  const navigate = useNavigate();

  const categories = [
    { 
      name: "Personal Info & Major",
      icon: GraduationCap,
      color: "bg-purple-100 text-purple-600",
      step: 1,
      description: "Year, living situation, major"
    },
    { 
      name: "School & Housing",
      icon: Home,
      color: "bg-indigo-100 text-indigo-600",
      step: 2,
      description: "Tuition, meal plan, housing costs"
    },
    { 
      name: "Transportation",
      icon: Car,
      color: "bg-pink-100 text-pink-600",
      step: 3,
      description: "Car expenses and commute"
    },
    { 
      name: "Work & Income",
      icon: Briefcase,
      color: "bg-green-100 text-green-600",
      step: 4,
      description: "Job details, wage, hours"
    },
    { 
      name: "Food & Lifestyle",
      icon: Utensils,
      color: "bg-amber-100 text-amber-600",
      step: 5,
      description: "Groceries, dining, entertainment, misc."
    },
    { 
      name: "Financial Goals",
      icon: DollarSign,
      color: "bg-teal-100 text-teal-600",
      step: 6,
      description: "Savings goals and priorities"
    }
  ];

  const handleCategoryClick = (step: number) => {
    // Store the step to navigate to
    localStorage.setItem('editStep', step.toString());
    localStorage.setItem('returnToDashboard', 'true');
    navigate('/questionnaire');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Your Budget</h2>
            <p className="text-sm text-gray-600 mt-1">Which category would you like to update?</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Categories */}
        <div className="p-6 grid md:grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.step)}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-600 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${category.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
