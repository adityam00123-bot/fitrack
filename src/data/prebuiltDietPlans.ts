import { IndianDietPlan } from '../types/indianDiet';
import { INDIAN_FOOD_DATABASE } from './indianFoodDatabase';

const getFood = (id: string) => {
  const item = INDIAN_FOOD_DATABASE.find(f => f.id === id);
  if (!item) {
    throw new Error(`Food item ${id} not found`);
  }
  return item;
};

export const PREBUILT_DIET_PLANS: IndianDietPlan[] = [
  {
    id: 'plan-veg-high-protein',
    name: 'Desi High-Protein Vegetarian (135g Protein)',
    hindiName: 'शुद्ध शाकाहारी हाई प्रोटीन डाइट',
    tagline: '135g Protein without touching non-veg! Powered by Soya, Paneer, Dahi & Dal.',
    goal: 'muscle_gain',
    dietType: 'pure_veg',
    budgetLevel: 'standard',
    targetCalories: 2050,
    targetProtein: 136,
    targetCarbs: 215,
    targetFat: 68,
    description: 'Busts the myth that Indian vegetarians cannot build lean muscle. Strategically uses high-protein soy chunks, paneer, and sprouted legumes while keeping rotis and dals intact.',
    groceryList: [
      'Soya Chunks (1kg bag)',
      'Low-Fat or Malai Paneer (200g daily)',
      'Fresh Dahi / Curd',
      'Whole Wheat Atta & Oats',
      'Besan (Gram flour)',
      'Yellow Moong Dal & Sprouted Moong',
      'Roasted Chana (Snack)',
      'Whey Protein (1 scoop daily - optional but recommended)'
    ],
    tipsForSuccess: [
      'Soak soya chunks in warm salted water for 15 mins, squeeze excess water out thoroughly, then saute with spices.',
      'Drink 3-4 liters of water to support increased fiber and protein digestion.',
      'Have curd with your lunch to keep gut flora thriving.'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'High Protein Besan Chilla + Curd',
        hindiTitle: 'बेसन का चीला और ताजी दही',
        suggestedTime: '8:30 AM',
        desiProTip: 'Add grated paneer inside the chilla like a wrap for extra taste & 10g extra protein!',
        items: [
          { foodItem: getFood('food-besan-chilla'), quantity: 2, preparationNote: 'Cooked with onions, green chilies, and light mustard oil' },
          { foodItem: getFood('food-paneer-raw'), quantity: 0.5, preparationNote: 'Grated over chilla' },
          { foodItem: getFood('food-dahi'), quantity: 1, preparationNote: 'Sprinkle roasted jeera and black salt' }
        ],
        totalCalories: 490,
        totalProtein: 28.5,
        totalCarbs: 45,
        totalFat: 23
      },
      {
        mealType: 'lunch',
        title: 'Soya Matar Sabzi + Phulkas + Dal',
        hindiTitle: 'सोया चंक्स सब्जी, 2 रोटी और मूंग दाल',
        suggestedTime: '1:30 PM',
        desiProTip: 'Soya chunks absorb flavors like a sponge. Cook with rich tomato-onion-garlic masala.',
        items: [
          { foodItem: getFood('food-soya-chunks'), quantity: 1, preparationNote: 'Boiled, squeezed, cooked in masala' },
          { foodItem: getFood('food-roti-phulka'), quantity: 2, preparationNote: 'Hot puffed rotis without ghee' },
          { foodItem: getFood('food-moong-dal-boiled'), quantity: 1, preparationNote: 'Light tadka with hing and jeera' },
          { foodItem: getFood('food-chaas'), quantity: 1, preparationNote: 'Chilled mint buttermilk' }
        ],
        totalCalories: 535,
        totalProtein: 44.5,
        totalCarbs: 78,
        totalFat: 7.5
      },
      {
        mealType: 'evening_snack',
        title: 'Desi Pehlwan Pre-Workout Fuel',
        hindiTitle: 'भुना चना और सत्तू / केला',
        suggestedTime: '5:30 PM',
        desiProTip: 'Roasted chana provides sustained steady energy without stomach heaviness during lifts.',
        items: [
          { foodItem: getFood('food-roasted-chana'), quantity: 1, preparationNote: 'Crunchy dry snack' },
          { foodItem: getFood('food-sattu'), quantity: 1, preparationNote: 'Mixed in cold water with lemon and black salt' }
        ],
        totalCalories: 345,
        totalProtein: 20.0,
        totalCarbs: 54,
        totalFat: 4.7
      },
      {
        mealType: 'dinner',
        title: 'Palak Paneer + Multigrain Roti',
        hindiTitle: 'पालक पनीर और मल्टीग्रेन रोटी',
        suggestedTime: '8:45 PM',
        desiProTip: 'Paneer casein protein sustains muscle protein synthesis through your 8 hours of sleep.',
        items: [
          { foodItem: getFood('food-palak-paneer'), quantity: 1, preparationNote: 'Blanched spinach pureed with paneer cubes' },
          { foodItem: getFood('food-multigrain-roti'), quantity: 2, preparationNote: 'Atta mixed with chana flour' }
        ],
        totalCalories: 410,
        totalProtein: 21.0,
        totalCarbs: 42,
        totalFat: 16.6
      },
      {
        mealType: 'post_workout',
        title: 'Whey Protein Shake or Sattu Boost',
        hindiTitle: 'व्हे प्रोटीन शेक',
        suggestedTime: 'Within 45 min of workout',
        desiProTip: 'Mix with cold water for fastest absorption.',
        items: [
          { foodItem: getFood('food-whey-protein'), quantity: 1, preparationNote: 'Shaken with 250ml water' }
        ],
        totalCalories: 125,
        totalProtein: 24.5,
        totalCarbs: 2.2,
        totalFat: 1.5
      }
    ]
  },
  {
    id: 'plan-desi-fat-loss',
    name: 'Desi Fat Loss & Cutting Plan (1650 kcal)',
    hindiName: 'देसी फैट लॉस और कटिंग डाइट',
    tagline: 'High volume, zero starving! Retain muscle while shedding belly fat.',
    goal: 'fat_loss',
    dietType: 'eggetarian',
    budgetLevel: 'standard',
    targetCalories: 1620,
    targetProtein: 130,
    targetCarbs: 155,
    targetFat: 48,
    description: 'Designed specifically to eliminate stubborn belly fat while keeping traditional Indian food habits intact. Emphasizes egg whites, low-fat paneer, sprouted salads, and portion-controlled rotis.',
    groceryList: [
      'Eggs (30 tray)',
      'Low-Fat Paneer (200g)',
      'Sprouted Moong & Kala Chana',
      'Cucumber, Tomato, Lemon & Green Chillies for huge volume salads',
      'Whole Wheat Atta',
      'Yellow Moong Dal',
      'Roasted Makhana'
    ],
    tipsForSuccess: [
      'Eat a big bowl of cucumber and tomato salad 10 minutes BEFORE lunch and dinner to reduce portion size naturally.',
      'Cut down cooking oil to strictly 1 teaspoon per person per meal.',
      'No sugary chai or soft drinks; switch to black coffee or spiced Jeera Chaas.'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Egg White Scramble + 1 Whole Egg + Brown Bread / Roti',
        hindiTitle: 'अंडा भुर्जी (4 अंडे का सफेद + 1 साबुत)',
        suggestedTime: '8:30 AM',
        desiProTip: 'Whisk egg whites with chopped green chilies, onions, and turmeric for vibrant taste with almost zero fat.',
        items: [
          { foodItem: getFood('food-egg-white'), quantity: 4, preparationNote: 'High protein volume base' },
          { foodItem: getFood('food-egg-boiled-whole'), quantity: 1, preparationNote: 'Provides fat-soluble vitamins' },
          { foodItem: getFood('food-roti-phulka'), quantity: 1, preparationNote: '1 plain phulka without ghee' }
        ],
        totalCalories: 232,
        totalProtein: 24.6,
        totalCarbs: 19.2,
        totalFat: 5.9
      },
      {
        mealType: 'lunch',
        title: 'Dal Tadka + Sprouted Moong Salad + 1 Roti',
        hindiTitle: 'दाल, अंकुरित मूंग सलाद और 1 रोटी',
        suggestedTime: '1:15 PM',
        desiProTip: 'Raw sprouted moong takes longer to chew, triggering fullness signals in the brain.',
        items: [
          { foodItem: getFood('food-moong-dal-boiled'), quantity: 1, preparationNote: 'Light aromatic dal' },
          { foodItem: getFood('food-sprouted-moong'), quantity: 1.5, preparationNote: 'Tossed with chaat masala, lemon, onions' },
          { foodItem: getFood('food-roti-phulka'), quantity: 1, preparationNote: 'Plain warm phulka' },
          { foodItem: getFood('food-chaas'), quantity: 1, preparationNote: 'Chilled buttermilk' }
        ],
        totalCalories: 422,
        totalProtein: 23.3,
        totalCarbs: 67.0,
        totalFat: 5.5
      },
      {
        mealType: 'evening_snack',
        title: 'Roasted Makhana + Green Tea',
        hindiTitle: 'रोस्टेड मखाना और ग्रीन टी',
        suggestedTime: '5:00 PM',
        desiProTip: 'Crunchy low calorie volume food to combat 5 PM office / college hunger.',
        items: [
          { foodItem: getFood('food-makhana-roasted'), quantity: 1.2, preparationNote: 'Roasted in non-stick pan with pinch of rock salt' }
        ],
        totalCalories: 150,
        totalProtein: 3.6,
        totalCarbs: 25.2,
        totalFat: 3.6
      },
      {
        mealType: 'dinner',
        title: 'Low-Fat Paneer Bhurji / Grilled Tandoori + 1 Roti',
        hindiTitle: 'लो-फैट पनीर भुर्जी और 1 रोटी',
        suggestedTime: '8:30 PM',
        desiProTip: 'Low-fat paneer delivers 25g protein for under 160 calories.',
        items: [
          { foodItem: getFood('food-paneer-lowfat'), quantity: 1.5, preparationNote: '150g Low fat paneer scrambled with capsicum' },
          { foodItem: getFood('food-roti-phulka'), quantity: 1, preparationNote: 'Whole wheat roti' },
          { foodItem: getFood('food-mix-veg'), quantity: 0.8, preparationNote: 'Steam cooked green vegetables' }
        ],
        totalCalories: 410,
        totalProtein: 43.4,
        totalCarbs: 36.8,
        totalFat: 9.7
      },
      {
        mealType: 'post_workout',
        title: 'Whey Protein Isolate or 4 Boiled Egg Whites',
        hindiTitle: 'पोस्ट-वर्कआउट प्रोटीन',
        suggestedTime: 'Right after gym',
        desiProTip: 'Fast amino acid delivery halts muscle catabolism.',
        items: [
          { foodItem: getFood('food-whey-protein'), quantity: 1, preparationNote: 'With ice cold water' }
        ],
        totalCalories: 125,
        totalProtein: 24.5,
        totalCarbs: 2.2,
        totalFat: 1.5
      }
    ]
  },
  {
    id: 'plan-student-budget-hostel',
    name: 'Hostel & Student Budget Diet (₹120/Day, 120g Protein)',
    hindiName: 'स्टूडेंट और हॉस्टल बजट डाइट (₹120/दिन)',
    tagline: 'Maximum gains on minimum budget! No fancy supplements required.',
    goal: 'muscle_gain',
    dietType: 'eggetarian',
    budgetLevel: 'student_budget',
    targetCalories: 2200,
    targetProtein: 125,
    targetCarbs: 275,
    targetFat: 65,
    description: 'Specially created for college students and hostelers on a pocket money budget. Built around cheap, unadulterated protein champions: Eggs, Soya Chunks, Sattu, Roasted Chana, and Peanuts.',
    groceryList: [
      'Eggs (Buy 30 crate from wholesale mandi: ~₹180-210)',
      'Soya Chunks 1kg pack (~₹110)',
      'Roasted Chana 1kg (~₹130)',
      'Chana Sattu (~₹120/kg)',
      'Raw Peanuts for homemade peanut butter (~₹140/kg)',
      'Bananas (Dozen ~₹40-50)'
    ],
    tipsForSuccess: [
      'Keep an electric kettle in your hostel room — you can boil eggs and hydrate soya chunks inside it!',
      'Make a quick Sattu drink in a shaker bottle before your morning college lectures.',
      'Buy eggs by the crate of 30 from local poultry shops to save 30% money.'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Hostel Pehlwan Sattu Shake + 2 Boiled Eggs',
        hindiTitle: 'देसी सत्तू ड्रिंक और 2 उबले अंडे',
        suggestedTime: '8:00 AM',
        desiProTip: 'Mix 60g Sattu with chilled water, lemon juice, green chili, and roasted jeera. Takes 60 seconds!',
        items: [
          { foodItem: getFood('food-sattu'), quantity: 1.2, preparationNote: '60g Sattu stirred in water' },
          { foodItem: getFood('food-egg-boiled-whole'), quantity: 2, preparationNote: 'Boiled eggs' }
        ],
        totalCalories: 382,
        totalProtein: 26.4,
        totalCarbs: 39.2,
        totalFat: 13.0
      },
      {
        mealType: 'lunch',
        title: 'Mess Dal Rice + Soya Chunks Booster',
        hindiTitle: 'मेस का दाल-चावल + 50g सोया चंक्स',
        suggestedTime: '1:30 PM',
        desiProTip: 'Boil 50g soya chunks in your hostel kettle and mix them directly into your mess dal!',
        items: [
          { foodItem: getFood('food-soya-chunks'), quantity: 1, preparationNote: '50g dry soya chunks added to dal' },
          { foodItem: getFood('food-basmati-rice-cooked'), quantity: 1.5, preparationNote: 'Mess cooked white rice' },
          { foodItem: getFood('food-dal-tadka'), quantity: 1, preparationNote: 'Standard mess dal' }
        ],
        totalCalories: 604,
        totalProtein: 39.3,
        totalCarbs: 102.7,
        totalFat: 4.0
      },
      {
        mealType: 'evening_snack',
        title: 'Roasted Chana + Handful Roasted Peanuts',
        hindiTitle: 'भुना चना और मूंगफली',
        suggestedTime: '5:00 PM',
        desiProTip: 'Zero cooking required! Keep a jar on your study desk.',
        items: [
          { foodItem: getFood('food-roasted-chana'), quantity: 1, preparationNote: '40g Bhuna Chana' },
          { foodItem: getFood('food-peanuts-roasted'), quantity: 1, preparationNote: '30g Roasted peanuts' }
        ],
        totalCalories: 325,
        totalProtein: 16.3,
        totalCarbs: 26.5,
        totalFat: 16.7
      },
      {
        mealType: 'dinner',
        title: 'Mess Rotis + 4 Egg Bhurji / Mess Sabzi',
        hindiTitle: 'मेस की 3 रोटी + 4 अंडों की भुर्जी',
        suggestedTime: '8:45 PM',
        desiProTip: 'Ask the street vendor or hostel canteen to make bhurji with 4 eggs, onions, and light oil.',
        items: [
          { foodItem: getFood('food-roti-phulka'), quantity: 3, preparationNote: '3 mess rotis' },
          { foodItem: getFood('food-egg-boiled-whole'), quantity: 2, preparationNote: '2 whole eggs' },
          { foodItem: getFood('food-egg-white'), quantity: 2, preparationNote: '2 egg whites' },
          { foodItem: getFood('food-dahi'), quantity: 0.8, preparationNote: 'Small bowl curd' }
        ],
        totalCalories: 526,
        totalProtein: 34.6,
        totalCarbs: 64.0,
        totalFat: 14.5
      }
    ]
  },
  {
    id: 'plan-lean-bulk-nonveg',
    name: 'Lean Bulk Non-Veg Machine (160g Protein, 2600 kcal)',
    hindiName: 'लीन बल्क नॉन-वेज मशीन (160g प्रोटीन)',
    tagline: 'Explosive gym strength & rapid muscle hypertrophy with chicken, eggs & rice.',
    goal: 'desi_bulk',
    dietType: 'non_veg',
    budgetLevel: 'standard',
    targetCalories: 2620,
    targetProtein: 162,
    targetCarbs: 310,
    targetFat: 78,
    description: 'The classic Indian bodybuilding stack. Combines lean chicken breast, whole eggs, aromatic basmati rice, curd, and natural peanut butter for peak power and clean mass.',
    groceryList: [
      'Chicken Breast (500g daily)',
      'Eggs (4-5 daily)',
      'Basmati Rice & Whole Wheat Atta',
      'Desi Ghee',
      'Natural Peanut Butter',
      'Bananas & Toned Milk',
      'Whey Protein'
    ],
    tipsForSuccess: [
      'Marinate chicken breast with hung curd, lemon, ginger-garlic, turmeric, and tandoori masala for soft, juicy texture without grease.',
      'Add 1 teaspoon of pure desi ghee to your post-workout rice for better nutrient absorption and hormonal support.',
      'Progressive overload in the gym is mandatory when on this surplus diet.'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Masala Oats with Milk + 3 Whole Boiled Eggs',
        hindiTitle: 'दूध ओट्स और 3 उबले अंडे',
        suggestedTime: '8:30 AM',
        desiProTip: 'Cook oats in toned milk with sliced banana and cinnamon.',
        items: [
          { foodItem: getFood('food-oats-masala'), quantity: 1, preparationNote: 'Oats with milk' },
          { foodItem: getFood('food-cow-milk'), quantity: 1, preparationNote: '1 glass cow milk' },
          { foodItem: getFood('food-egg-boiled-whole'), quantity: 3, preparationNote: '3 fresh boiled eggs' }
        ],
        totalCalories: 582,
        totalProtein: 34.4,
        totalCarbs: 48.2,
        totalFat: 27.0
      },
      {
        mealType: 'lunch',
        title: 'Chicken Breast Curry + Basmati Rice + Curd',
        hindiTitle: '200g चिकन करी, बासमती चावल और दही',
        suggestedTime: '1:30 PM',
        desiProTip: 'Eat chicken with basmati rice for instant glycogen restoration and heavy afternoon pump.',
        items: [
          { foodItem: getFood('food-chicken-curry-home'), quantity: 1, preparationNote: '200g chicken breast pieces in home gravy' },
          { foodItem: getFood('food-basmati-rice-cooked'), quantity: 1.5, preparationNote: 'Cooked white basmati rice' },
          { foodItem: getFood('food-dahi'), quantity: 1, preparationNote: 'Fresh cool curd' }
        ],
        totalCalories: 642,
        totalProtein: 40.1,
        totalCarbs: 72.0,
        totalFat: 21.0
      },
      {
        mealType: 'evening_snack',
        title: 'Peanut Butter Banana Toast / Roti',
        hindiTitle: 'पीनट बटर रोटी / टोस्ट',
        suggestedTime: '5:30 PM',
        desiProTip: 'Spread 2 tablespoons of 100% natural peanut butter on warm roti and roll it like a roll.',
        items: [
          { foodItem: getFood('food-roti-phulka'), quantity: 2, preparationNote: '2 phulkas' },
          { foodItem: getFood('food-peanut-butter'), quantity: 1, preparationNote: 'Pure peanut butter' }
        ],
        totalCalories: 375,
        totalProtein: 14.2,
        totalCarbs: 42.0,
        totalFat: 17.0
      },
      {
        mealType: 'dinner',
        title: 'Tandoori Chicken Breast + 2 Phulkas + Green Salad',
        hindiTitle: 'तंदूरी चिकन और 2 रोटी',
        suggestedTime: '8:45 PM',
        desiProTip: 'Tandoori preparation gives 32g protein with minimal cooking oil.',
        items: [
          { foodItem: getFood('food-tandoori-chicken'), quantity: 1.2, preparationNote: 'Pan-seared / baked tandoori chicken' },
          { foodItem: getFood('food-roti-phulka'), quantity: 2, preparationNote: 'Fresh puffed phulkas' },
          { foodItem: getFood('food-mix-veg'), quantity: 0.8, preparationNote: 'Steamed green salad' }
        ],
        totalCalories: 532,
        totalProtein: 48.0,
        totalCarbs: 48.2,
        totalFat: 13.5
      },
      {
        mealType: 'post_workout',
        title: 'Whey Protein + 1 Banana',
        hindiTitle: 'व्हे प्रोटीन शेक',
        suggestedTime: 'Post workout',
        desiProTip: 'Fast acting whey protein triggers anabolic mTOR signaling immediately after training.',
        items: [
          { foodItem: getFood('food-whey-protein'), quantity: 1.2, preparationNote: '1.2 scoops whey' }
        ],
        totalCalories: 150,
        totalProtein: 29.4,
        totalCarbs: 2.6,
        totalFat: 1.8
      }
    ]
  }
];
