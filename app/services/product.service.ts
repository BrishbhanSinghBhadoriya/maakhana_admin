import api from '@/lib/axios';

// Mutable mock data store
let mockMenuData = {
  _id: { $oid: "mock_id_123" },
  breakfast: {
    items: {
      monday: { name: "Poha with Peanuts", quantity: "1 bowl", sides: ["Chutney"] },
      tuesday: { name: "Vegetable Dalia", quantity: "1 bowl", style: "Home style" },
      wednesday: { name: "Besan Chilla", quantity: "2 pcs", sides: ["Curd"] },
      thursday: { name: "Masala Oats", quantity: "1 bowl", style: "Spicy" },
      friday: { name: "Aloo Paratha", quantity: "1 pc", sides: ["Pickle", "Curd"] },
      saturday: { name: "Vegetable Sandwich", quantity: "2 pcs", sides: ["Ketchup"] },
      sunday: { name: "Paneer Paratha", quantity: "1 pc", sides: ["Curd"] }
    }
  },
  lunch: {
    items: {
      monday: { name: "Dal Makhani & Rice", main: "Dal Makhani", quantity: "1 bowl", carbs: ["Rice"], vegetables: ["Salad"] },
      tuesday: { name: "Rajma Chawal", main: "Rajma", quantity: "1 bowl", carbs: ["Rice"], vegetables: ["Salad"] },
      wednesday: { name: "Chole Bhature", main: "Chole", quantity: "1 bowl", carbs: ["Bhature"], vegetables: ["Onion"] },
      thursday: { name: "Kadhi Pakora", main: "Kadhi", quantity: "1 bowl", carbs: ["Rice"], vegetables: ["Salad"] },
      friday: { name: "Paneer Butter Masala", main: "Paneer", quantity: "1 bowl", carbs: ["Roti"], vegetables: ["Salad"] },
      saturday: { name: "Mix Veg", main: "Mix Veg", quantity: "1 bowl", carbs: ["Roti"], vegetables: ["Salad"] },
      sunday: { name: "Biryani", main: "Veg Biryani", quantity: "1 plate", sides: ["Raita"] }
    }
  },
  dinner: {
    items: {
      monday: { name: "Aloo Gobi", main: "Aloo Gobi", quantity: "1 bowl", carbs: ["Roti"] },
      tuesday: { name: "Bhindi Masala", main: "Bhindi", quantity: "1 bowl", carbs: ["Roti"] },
      wednesday: { name: "Dal Tadka", main: "Dal", quantity: "1 bowl", carbs: ["Rice"] },
      thursday: { name: "Jeera Aloo", main: "Jeera Aloo", quantity: "1 bowl", carbs: ["Roti"] },
      friday: { name: "Palak Paneer", main: "Palak Paneer", quantity: "1 bowl", carbs: ["Roti"] },
      saturday: { name: "Matar Paneer", main: "Matar Paneer", quantity: "1 bowl", carbs: ["Roti"] },
      sunday: { name: "Malai Kofta", main: "Malai Kofta", quantity: "1 bowl", carbs: ["Naan"] }
    }
  },
  gymBroPack: {
    breakfast: {
      protein: "Boiled Eggs",
      carbs: ["Oats"]
    },
    lunch: {
      veg: { main: "Paneer Bhurji", protein: ["Paneer"], carbs: ["Brown Rice"] },
      nonVeg: { main: "Grilled Chicken", quantity: "200g", sides: ["Broccoli"] }
    },
    dinner: {
      protein: ["Chicken Breast", "Fish"],
      carbs: ["Quinoa"],
      vegetables: ["Asparagus"]
    }
  }
};

// Helper to deep merge objects
function deepMerge(target: any, source: any) {
  if (typeof target !== 'object' || target === null) {
    return source;
  }
  
  for (const key in source) {
    if (source[key] instanceof Object && !Array.isArray(source[key]) && key in target) {
      deepMerge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }
  return target;
}

export const getProducts = async () => {
  // Return mock data immediately to bypass backend dependency
  return [JSON.parse(JSON.stringify(mockMenuData))]; // Return copy to prevent direct mutation issues
  
  // const { data } = await api.get('/menu/get-menu');
  // return data;
};

export const updateMenu = async (id: string, data: any) => {
  // Simulate successful update with in-memory persistence
  console.log("Updating menu with:", JSON.stringify(data, null, 2));
  
  try {
    // Deep merge the update data into mockMenuData
    deepMerge(mockMenuData, data);
    console.log("Updated mock data:", JSON.stringify(mockMenuData, null, 2));
    
    return { message: "Menu updated successfully", data };
  } catch (error) {
    console.error("Error updating mock data:", error);
    throw error;
  }
  
  // const response = await api.patch(`/menu/update-menu/${id}`, data);
  // return response.data;
};
