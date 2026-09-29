export const INITIAL_RECORDS = [
  {
    id: 101,
    date: '2026-09-28',
    meal_type: 'Lunch',
    department: 'Buffet Line',
    category: 'Prepared / Cooked Dishes',
    dish_name: 'Grilled Herb Chicken & Gravy',
    quantity_kg: 16.5,
    unit_cost: 12.00,
    total_cost: 198.00,
    reason: 'Overproduction / Excess Cooking',
    action_prevention: 'Reduce batch size by 20% on Tuesdays',
    recorded_by: 'Chef Marco',
    facility_type: 'Hotel Dining'
  },
  {
    id: 102,
    date: '2026-09-28',
    meal_type: 'Dinner',
    department: 'Plate Waste',
    category: 'Produce (Vegetables & Fruits)',
    dish_name: 'Mixed Caesar Salad Bowls',
    quantity_kg: 9.4,
    unit_cost: 4.50,
    total_cost: 42.30,
    reason: 'Plate Waste / Customer Leftovers',
    action_prevention: 'Decrease side portion sizing by 15%',
    recorded_by: 'Sarah Jenkins',
    facility_type: 'Hotel Dining'
  },
  {
    id: 103,
    date: '2026-09-27',
    meal_type: 'Breakfast',
    department: 'Bakery & Pastry',
    category: 'Bakery & Grains',
    dish_name: 'Assorted Butter Croissants',
    quantity_kg: 7.2,
    unit_cost: 5.50,
    total_cost: 39.60,
    reason: 'Expiration / Date Expired',
    action_prevention: 'Offer 50% discount item bundle at 10 AM',
    recorded_by: 'Chef Pierre',
    facility_type: 'Cafeteria'
  },
  {
    id: 104,
    date: '2026-09-27',
    meal_type: 'Lunch',
    department: 'Kitchen Prep',
    category: 'Produce (Vegetables & Fruits)',
    dish_name: 'Carrot & Potato Peels',
    quantity_kg: 21.0,
    unit_cost: 2.20,
    total_cost: 46.20,
    reason: 'Trim & Prep Loss',
    action_prevention: 'Train prep staff on precision peeling knife skills',
    recorded_by: 'Dave Miller',
    facility_type: 'Restaurant'
  },
  {
    id: 105,
    date: '2026-09-26',
    meal_type: 'Dinner',
    department: 'Cold Storage',
    category: 'Dairy & Eggs',
    dish_name: 'Whole Fresh Milk & Cream',
    quantity_kg: 14.0,
    unit_cost: 3.80,
    total_cost: 53.20,
    reason: 'Cold Chain / Temp Spikes',
    action_prevention: 'Re-calibrate chiller thermostat #2',
    recorded_by: 'Alex Vance',
    facility_type: 'Corporate Canteen'
  },
  {
    id: 106,
    date: '2026-09-25',
    meal_type: 'Lunch',
    department: 'Buffet Line',
    category: 'Seafood',
    dish_name: 'Pan-Seared Salmon Fillets',
    quantity_kg: 11.8,
    unit_cost: 18.50,
    total_cost: 218.30,
    reason: 'Overproduction / Excess Cooking',
    action_prevention: 'Implement cook-to-order station past 1:30 PM',
    recorded_by: 'Chef Marco',
    facility_type: 'Hotel Dining'
  },
  {
    id: 107,
    date: '2026-09-24',
    meal_type: 'Dinner',
    department: 'Kitchen Prep',
    category: 'Meat & Poultry',
    dish_name: 'Prime Beef Stew Trimmings',
    quantity_kg: 13.5,
    unit_cost: 14.00,
    total_cost: 189.00,
    reason: 'Cooking Error / Burnt',
    action_prevention: 'Ensure timer alert sounds on simmer kettles',
    recorded_by: 'Chef Elena',
    facility_type: 'Mess Hall'
  },
  {
    id: 108,
    date: '2026-09-23',
    meal_type: 'Breakfast',
    department: 'Buffet Line',
    category: 'Prepared / Cooked Dishes',
    dish_name: 'Scrambled Eggs & Hashbrowns',
    quantity_kg: 16.2,
    unit_cost: 6.20,
    total_cost: 100.44,
    reason: 'Overproduction / Excess Cooking',
    action_prevention: 'Use smaller 1/3 size hotel pans for final hour',
    recorded_by: 'Mark Anthony',
    facility_type: 'Hotel Dining'
  }
];

export const CATEGORIES = [
  'Produce (Vegetables & Fruits)',
  'Meat & Poultry',
  'Seafood',
  'Dairy & Eggs',
  'Bakery & Grains',
  'Prepared / Cooked Dishes',
  'Beverages & Liquids',
  'Condiments & Sauces'
];

export const DEPARTMENTS = [
  'Kitchen Prep',
  'Buffet Line',
  'Plate Waste',
  'Cold Storage',
  'Bakery & Pastry',
  'Banquet / Events',
  'Bar & Lounge'
];

export const WASTE_REASONS = [
  'Overproduction / Excess Cooking',
  'Expiration / Date Expired',
  'Spoilage / Quality Deterioration',
  'Plate Waste / Customer Leftovers',
  'Trim & Prep Loss',
  'Cooking Error / Burnt',
  'Cold Chain / Temp Spikes',
  'Cross-Contamination Rejection'
];

export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'All Day Prep'];

export const FACILITY_TYPES = [
  'Restaurant',
  'Hotel Dining & Banquets',
  'Corporate Canteen',
  'University Mess',
  'Hospital Cafeteria',
  'Catering Service'
];
