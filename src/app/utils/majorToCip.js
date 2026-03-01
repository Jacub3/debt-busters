// Utility to get CIP code for a given major (very basic, extend as needed)
export function getCipCodeForMajor(major) {
  const map = {
    'Computer Science': '11.0701',
    'Business Administration': '52.0201',
    'Nursing': '51.3801',
    'Psychology': '42.0101',
    'Mechanical Engineering': '14.1901',
    // Add more mappings as needed
  };
  return map[major] || '';
}
