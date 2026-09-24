/**
 * Edibility and Food Safety Validator
 * Ensures Food Decode strictly accepts and processes EDIBLE foods, snacks, and beverages,
 * rejecting non-edible items (like electronics, phones, plastics, cleaning chemicals,
 * hardware, apparel, cosmetics, furniture, tools, etc.) across both Scanning and Search.
 */

export interface EdibilityCheckResult {
  isNonEdible: boolean;
  reason?: string;
  matchedCategory?: string;
  suggestedAction?: string;
}

// Structured taxonomy of non-edible categories and terms
export const NON_EDIBLE_CATEGORIES: Array<{
  category: string;
  description: string;
  exactTerms: string[];
  singleWordKeywords: string[];
}> = [
  {
    category: 'Electronics, Devices & Gadgets',
    description: 'Electronic hardware, communication devices, screens, and tech accessories',
    exactTerms: [
      'cell phone', 'mobile phone', 'smart phone', 'smartphone', 'flip phone',
      'apple iphone', 'iphone', 'android phone', 'google pixel', 'samsung galaxy',
      'telephone', 'apple watch', 'smart watch', 'smartwatch', 'fitbit',
      'laptop', 'macbook', 'notebook computer', 'desktop pc', 'computer monitor',
      'tablet computer', 'ipad', 'kindle', 'ereader', 'e-reader',
      'usb cable', 'hdmi cable', 'charging cable', 'phone charger', 'wall charger',
      'power bank', 'portable charger', 'lithium battery', 'aa battery', 'aaa battery',
      'airpods', 'airpod', 'earbuds', 'earphones', 'headphones', 'bluetooth speaker',
      'soundbar', 'webcam', 'digital camera', 'dslr camera', 'gopro',
      'remote control', 'tv remote', 'television', 'flat screen', 'smart tv',
      'playstation', 'ps4', 'ps5', 'xbox', 'nintendo switch', 'game console',
      'graphics card', 'motherboard', 'hard drive', 'ssd drive', 'flash drive',
      'usb drive', 'thumb drive', 'sim card', 'sd card', 'computer mouse',
      'mechanical keyboard', 'laser printer', 'flatbed scanner', 'wifi router',
      'modem', 'drone', 'calculator', 'walkie talkie'
    ],
    singleWordKeywords: [
      'phone', 'phones', 'iphone', 'iphones', 'cellphone', 'cellphones', 'smartphone', 'smartphones',
      'telephone', 'telephones', 'mobile', 'mobiles', 'laptop', 'laptops', 'macbook', 'macbooks',
      'computer', 'computers', 'pc', 'pcs', 'monitor', 'monitors', 'keyboard', 'keyboards',
      'mouse', 'mice', 'webcam', 'webcams', 'charger', 'chargers', 'cable', 'cables',
      'battery', 'batteries', 'powerbank', 'powerbanks', 'headphone', 'headphones',
      'earphone', 'earphones', 'airpod', 'airpods', 'earbud', 'earbuds', 'headset', 'headsets',
      'speaker', 'speakers', 'soundbar', 'soundbars', 'tv', 'tvs', 'television', 'televisions',
      'smartwatch', 'smartwatches', 'fitbit', 'ipad', 'ipads', 'tablet', 'tablets',
      'playstation', 'xbox', 'nintendo', 'console', 'consoles', 'microchip', 'processor',
      'printer', 'printers', 'scanner', 'scanners', 'projector', 'projectors', 'router', 'routers',
      'modem', 'modems', 'calculator', 'calculators', 'drone', 'drones'
    ]
  },
  {
    category: 'Plastics, Synthetic Polymers & Non-Food Containers',
    description: 'Synthetic plastics, resins, wrappers, and artificial polymer materials',
    exactTerms: [
      'plastic bottle', 'plastic bottles', 'plastic cup', 'plastic cups',
      'plastic bag', 'plastic bags', 'plastic container', 'plastic containers',
      'plastic box', 'plastic boxes', 'plastic chair', 'plastic table', 'plastic toy',
      'plastic wrap', 'bubble wrap', 'cling wrap', 'saran wrap', 'plastic straw',
      'plastic plate', 'plastic fork', 'plastic spoon', 'plastic knife', 'plastic cutlery',
      'plastic tube', 'plastic pellet', 'plastic beads', 'micro plastic', 'microplastics',
      'styrofoam cup', 'foam container', 'pvc pipe'
    ],
    singleWordKeywords: [
      'plastic', 'plastics', 'styrofoam', 'polystyrene', 'polyethylene', 'polypropylene',
      'polyurethane', 'pvc', 'vinyl', 'nylon', 'polyester', 'acrylic', 'silicone',
      'rubber', 'rubbers', 'latex', 'teflon', 'fiberglass', 'microplastic', 'microplastics'
    ]
  },
  {
    category: 'Cleaning, Household Chemicals & Industrial Fluids',
    description: 'Chemical cleaners, disinfectants, detergents, fuels, and industrial solvents',
    exactTerms: [
      'laundry detergent', 'dish soap', 'dishwashing liquid', 'dishwasher pod', 'dishwasher pods',
      'all purpose cleaner', 'toilet bowl cleaner', 'toilet cleaner', 'glass cleaner',
      'floor cleaner', 'carpet cleaner', 'drain cleaner', 'drano', 'hand sanitizer',
      'sanitizing spray', 'disinfectant spray', 'disinfecting wipes', 'bleach spray',
      'motor oil', 'engine oil', 'transmission fluid', 'brake fluid', 'power steering fluid',
      'wd-40', 'spray paint', 'paint thinner', 'super glue', 'gorilla glue', 'wood glue',
      'epoxy resin', 'silicone sealant', 'bug spray', 'weed killer', 'rat poison',
      'battery acid', 'lighter fluid', 'lighter gas', 'lighter refill', 'charcoal fluid'
    ],
    singleWordKeywords: [
      'bleach', 'bleaches', 'detergent', 'detergents', 'disinfectant', 'disinfectants',
      'cleaner', 'cleaners', 'sanitizer', 'sanitizers', 'windex', 'lysol', 'clorox',
      'gasoline', 'petrol', 'diesel', 'kerosene', 'propane', 'butane', 'antifreeze',
      'lubricant', 'lubricants', 'paint', 'paints', 'varnish', 'varnishes', 'lacquer',
      'turpentine', 'solvent', 'solvents', 'glue', 'glues', 'epoxy', 'epoxies',
      'adhesive', 'adhesives', 'sealant', 'caulk', 'cement', 'concrete', 'mortar',
      'pesticide', 'pesticides', 'insecticide', 'insecticides', 'herbicide', 'herbicides',
      'fertilizer', 'fertilizers', 'poison', 'poisons', 'toxin', 'toxins'
    ]
  },
  {
    category: 'Personal Care, Hygiene & Cosmetics',
    description: 'Hygiene goods, body lotions, cosmetics, haircare, and beauty supplies',
    exactTerms: [
      'body wash', 'hand soap', 'bar soap', 'soap bar', 'bath soap', 'liquid soap',
      'hair shampoo', 'hair conditioner', 'body lotion', 'face cream', 'eye cream',
      'face wash', 'facial cleanser', 'sunscreen lotion', 'sunblock spray',
      'lip gloss', 'lip liner', 'lipstick tube', 'nail polish', 'nail polish remover',
      'makeup remover', 'liquid foundation', 'setting powder', 'dry shampoo',
      'shaving cream', 'aftershave lotion', 'cotton swab', 'cotton swabs', 'q-tips',
      'cotton pads', 'cotton balls', 'toilet paper', 'paper towel', 'paper towels',
      'wet wipes', 'baby wipes', 'sanitary pads', 'tampon box', 'baby diapers'
    ],
    singleWordKeywords: [
      'shampoo', 'shampoos', 'conditioner', 'conditioners', 'soap', 'soaps',
      'toothpaste', 'toothpastes', 'toothbrush', 'toothbrushes', 'mouthwash', 'mouthwashes',
      'floss', 'deodorant', 'deodorants', 'antiperspirant', 'antiperspirants',
      'perfume', 'perfumes', 'cologne', 'colognes', 'fragrance', 'fragrances',
      'lotion', 'lotions', 'moisturizer', 'moisturizers', 'sunscreen', 'sunscreens', 'sunblock',
      'mascara', 'eyeliner', 'eyeshadow', 'lipstick', 'lipsticks', 'acetone',
      'tampon', 'tampons', 'diaper', 'diapers', 'razor', 'razors'
    ]
  },
  {
    category: 'Apparel, Footwear & Accessories',
    description: 'Clothing, footwear, wearable textiles, jewelry, and luggage',
    exactTerms: [
      'running shoes', 'tennis shoes', 'leather shoes', 'flip flops', 'hiking boots',
      't shirt', 't-shirt', 'tee shirt', 'sweat shirt', 'sweatshirt', 'winter coat',
      'blue jeans', 'denim jeans', 'leather jacket', 'baseball cap', 'winter hat',
      'winter gloves', 'wrist watch', 'wristwatch', 'leather wallet', 'leather belt',
      'duffle bag', 'tote bag', 'shoulder bag', 'luggage suitcase', 'sunglasses frame'
    ],
    singleWordKeywords: [
      'shoe', 'shoes', 'sneaker', 'sneakers', 'boot', 'boots', 'sandal', 'sandals',
      'slipper', 'slippers', 'heel', 'heels', 'sock', 'socks', 'shirt', 'shirts',
      'tshirt', 'tshirts', 'pants', 'trousers', 'jeans', 'denim', 'shorts', 'leggings',
      'skirt', 'skirts', 'dress', 'dresses', 'jacket', 'jackets', 'coat', 'coats',
      'hoodie', 'hoodies', 'sweater', 'sweaters', 'cardigan', 'blazer', 'suit', 'suits',
      'underwear', 'bra', 'bras', 'panties', 'boxers', 'briefs', 'glove', 'gloves',
      'scarf', 'scarves', 'hat', 'hats', 'cap', 'caps', 'beanie', 'beanies', 'helmet', 'helmets',
      'belt', 'belts', 'tie', 'ties', 'wallet', 'wallets', 'purse', 'purses',
      'backpack', 'backpacks', 'suitcase', 'suitcases', 'luggage', 'umbrella', 'umbrellas',
      'sunglasses', 'glasses', 'spectacles', 'jewelry', 'necklace', 'bracelet', 'earring', 'earrings'
    ]
  },
  {
    category: 'Household Goods, Furniture & Hardware',
    description: 'Furniture, tools, building supplies, home decor, and appliances',
    exactTerms: [
      'office chair', 'dining chair', 'dining table', 'coffee table', 'computer desk',
      'living room sofa', 'couch pillow', 'bed mattress', 'bed sheet', 'bed sheets',
      'ceiling fan', 'desk lamp', 'light bulb', 'led bulb', 'scented candle',
      'vacuum cleaner', 'washing machine', 'clothes dryer', 'microwave oven',
      'claw hammer', 'screws and bolts', 'nails and screws', 'tape measure',
      'cardboard box', 'cardboard boxes', 'ceramic tile', 'wood plank'
    ],
    singleWordKeywords: [
      'chair', 'chairs', 'table', 'tables', 'desk', 'desks', 'sofa', 'sofas', 'couch', 'couches',
      'bed', 'beds', 'mattress', 'mattresses', 'pillow', 'pillows', 'blanket', 'blankets',
      'curtain', 'curtains', 'carpet', 'carpets', 'rug', 'rugs', 'furniture',
      'cabinet', 'cabinets', 'cupboard', 'shelf', 'shelves', 'wardrobe', 'drawer', 'drawers',
      'mirror', 'mirrors', 'clock', 'clocks', 'lamp', 'lamps', 'candle', 'candles',
      'hammer', 'hammers', 'screwdriver', 'screwdrivers', 'wrench', 'wrenches',
      'pliers', 'saw', 'saws', 'drill', 'drills', 'nail', 'nails', 'screw', 'screws',
      'bolt', 'bolts', 'wood', 'lumber', 'timber', 'plywood', 'brick', 'bricks',
      'metal', 'steel', 'aluminum', 'copper', 'iron', 'cardboard'
    ]
  },
  {
    category: 'Office, Paper Goods & Stationery',
    description: 'Paper stationery, writing utensils, books, and office supplies',
    exactTerms: [
      'ballpoint pen', 'gel pen', 'fountain pen', 'wooden pencil', 'mechanical pencil',
      'spiral notebook', 'composition notebook', 'loose paper', 'printer paper',
      'copy paper', 'hardcover book', 'paperback book', 'comic book', 'glossy magazine',
      'daily newspaper', 'scotch tape', 'masking tape', 'duct tape', 'packing tape',
      'paper clips', 'binder clips', 'file folder'
    ],
    singleWordKeywords: [
      'pen', 'pens', 'pencil', 'pencils', 'eraser', 'erasers', 'sharpener', 'sharpeners',
      'marker', 'markers', 'highlighter', 'highlighters', 'crayon', 'crayons',
      'notebook', 'notebooks', 'notepad', 'notepads', 'book', 'books', 'magazine', 'magazines',
      'newspaper', 'newspapers', 'stapler', 'staplers', 'staple', 'staples', 'paperclip',
      'folder', 'folders', 'envelope', 'envelopes'
    ]
  },
  {
    category: 'Vehicles, Automotive & Sporting Equipment',
    description: 'Motor vehicles, transport parts, bicycles, and outdoor/sports gear',
    exactTerms: [
      'motor vehicle', 'passenger car', 'pickup truck', 'mountain bike', 'road bicycle',
      'motor cycle', 'motorcycle', 'electric scooter', 'car tire', 'car tyre',
      'steering wheel', 'car battery', 'football helmet', 'soccer ball', 'tennis racket',
      'baseball bat', 'golf club', 'bowling ball', 'skateboard deck', 'roller skates',
      'camping tent', 'sleeping bag'
    ],
    singleWordKeywords: [
      'car', 'cars', 'truck', 'trucks', 'vehicle', 'vehicles', 'automobile', 'automobiles',
      'motorcycle', 'motorcycles', 'bicycle', 'bicycles', 'bike', 'bikes', 'scooter', 'scooters',
      'skateboard', 'skateboards', 'tire', 'tires', 'tyre', 'tyres', 'wheel', 'wheels',
      'boat', 'boats', 'plane', 'planes', 'airplane', 'airplanes', 'tent', 'tents'
    ]
  },
  {
    category: 'Toys, Pet Goods & Non-Food Health',
    description: 'Toys, pet supplies, veterinary items, and non-food medical apparatus',
    exactTerms: [
      'lego set', 'lego bricks', 'barbie doll', 'action figure', 'teddy bear',
      'stuffed animal', 'fidget spinner', 'board game', 'playing cards', 'jigsaw puzzle',
      'dog food', 'cat food', 'bird seed', 'fish flakes', 'cat litter', 'dog leash',
      'dog collar', 'pet toy', 'dog toy', 'cat toy', 'bandage strip', 'medical tape',
      'surgical mask', 'n95 mask', 'latex gloves', 'medical thermometer', 'blood pressure monitor'
    ],
    singleWordKeywords: [
      'toy', 'toys', 'lego', 'legos', 'doll', 'dolls', 'barbie', 'puzzle', 'puzzles',
      'syringe', 'syringes', 'needle', 'needles', 'bandage', 'bandages', 'stethoscope',
      'thermometer', 'crutches', 'wheelchair'
    ]
  }
];

// Food exceptions where terms may overlap with words that sound technical or ambiguous
const EDIBLE_EXCEPTION_PHRASES = new Set([
  'potato chips', 'tortilla chips', 'corn chips', 'chocolate chips', 'chips', 'crisps', 'banana chips',
  'peanut butter', 'almond butter', 'cocoa butter', 'apple butter', 'butter', 'sunflower butter',
  'olive oil', 'vegetable oil', 'canola oil', 'coconut oil', 'sunflower oil', 'sesame oil', 'avocado oil', 'corn oil',
  'tea', 'green tea', 'black tea', 'iced tea', 'tea bag', 'tea leaves', 'herbal tea', 'matcha tea',
  'apple', 'apples', 'green apple', 'red apple', 'apple pie', 'apple juice', 'apple sauce', 'apple cider',
  'orange', 'oranges', 'orange juice', 'orange marmalade', 'orange soda',
  'lemon', 'lime', 'grape', 'peach', 'cherry', 'banana', 'strawberry', 'blueberry', 'mango',
  'cake', 'cookies', 'cookie', 'bread', 'pasta', 'rice', 'cereal', 'oats', 'oatmeal',
  'milk', 'cheese', 'yogurt', 'curry', 'soup', 'salad', 'pizza', 'burger', 'sandwich',
  'fanta', 'fanta drink', 'coca cola', 'coke', 'pepsi', 'sprite', 'mountain dew', 'dr pepper',
  'doritos', 'cheetos', 'lays', 'pringles', 'oreo', 'snickers', 'kit kat', 'twix', 'nutella'
]);

/**
 * Checks if a string (query, title, or label name) refers to a non-edible item.
 */
export function checkIsNonEdible(rawQuery: string): EdibilityCheckResult {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return { isNonEdible: false };
  }

  const trimmed = rawQuery.trim().toLowerCase();
  if (trimmed.length === 0) {
    return { isNonEdible: false };
  }

  // Exact phrase food exception check
  if (EDIBLE_EXCEPTION_PHRASES.has(trimmed)) {
    return { isNonEdible: false };
  }

  // Normalize punctuation and spacing
  const normalized = trimmed.replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = normalized.split(/[\s-]+/).filter(Boolean);

  // Check 1: Multi-word exact non-edible terms
  for (const group of NON_EDIBLE_CATEGORIES) {
    for (const term of group.exactTerms) {
      if (
        normalized === term ||
        normalized.startsWith(term + ' ') ||
        normalized.endsWith(' ' + term) ||
        normalized.includes(' ' + term + ' ')
      ) {
        return {
          isNonEdible: true,
          matchedCategory: group.category,
          reason: `"${rawQuery}" is classified under ${group.category} (${group.description}). Food Decode is strictly engineered to scan and search edible packaged foods, snacks, groceries, and beverages. Prefer scan over search term for physical food packages.`,
          suggestedAction: 'Please scan or search for an edible food, beverage, or packaged grocery item.'
        };
      }
    }
  }

  // Check 2: Single-word keywords matching any word in the query
  for (const group of NON_EDIBLE_CATEGORIES) {
    for (const kw of group.singleWordKeywords) {
      // Do not flag food words like "chips" if the phrase is an edible food context
      if (kw === 'chips' || kw === 'chip') {
        const isSnackChip = words.some(w => ['potato', 'tortilla', 'corn', 'chocolate', 'banana', 'pita'].includes(w));
        if (isSnackChip || normalized === 'chips' || normalized === 'chip') {
          continue; // Allow snack chips
        }
      }

      // Check exact word match or plural match
      for (const word of words) {
        if (word === kw) {
          return {
            isNonEdible: true,
            matchedCategory: group.category,
            reason: `"${rawQuery}" was identified as a non-edible item (${group.category}). Food Decode does not scan or search non-food objects like ${kw}.`,
            suggestedAction: 'Please search for edible foods, packaged snacks, or beverages.'
          };
        }

        // Check if word singularized matches keyword
        if (word.endsWith('s') && word.slice(0, -1) === kw) {
          return {
            isNonEdible: true,
            matchedCategory: group.category,
            reason: `"${rawQuery}" was identified as a non-edible item (${group.category}). Food Decode does not scan or search non-food items.`,
            suggestedAction: 'Please search for edible foods, packaged snacks, or beverages.'
          };
        }
        if (word.endsWith('es') && word.slice(0, -2) === kw) {
          return {
            isNonEdible: true,
            matchedCategory: group.category,
            reason: `"${rawQuery}" was identified as a non-edible item (${group.category}). Food Decode does not scan or search non-food items.`,
            suggestedAction: 'Please search for edible foods, packaged snacks, or beverages.'
          };
        }
      }
    }
  }

  // Check 3: Compound phrases like "apple iphone", "phone case", "dog shampoo", "chocolate scented candle"
  const nonEdibleCompounds = [
    { pattern: /\b(phone|iphone|android|mobile|cellphone)\b/i, category: 'Electronics & Phones' },
    { pattern: /\b(laptop|macbook|computer|pc|monitor|keyboard|mouse)\b/i, category: 'Computers & Tech' },
    { pattern: /\b(plastic|polyester|polyethylene|pvc|silicone|rubber)\b/i, category: 'Plastics & Polymers' },
    { pattern: /\b(shampoo|soap|lotion|conditioner|perfume|cologne|makeup|lipstick|deodorant)\b/i, category: 'Personal Care & Cosmetics' },
    { pattern: /\b(detergent|bleach|disinfectant|sanitizer|motor\s*oil|pesticide|glue)\b/i, category: 'Household Chemicals' },
    { pattern: /\b(shoe|shoes|sneaker|sneakers|boot|boots|shirt|tshirt|pants|jeans|jacket|sock|socks)\b/i, category: 'Apparel & Footwear' },
    { pattern: /\b(chair|table|desk|sofa|couch|bed|mattress|pillow|blanket|lamp|candle)\b/i, category: 'Household Goods' },
    { pattern: /\b(hammer|screwdriver|wrench|pliers|drill|saw|nail|screw|bolt)\b/i, category: 'Tools & Hardware' },
    { pattern: /\b(pen|pencil|paper|notebook|book|magazine|newspaper)\b/i, category: 'Paper Goods & Stationery' },
    { pattern: /\b(car|truck|motorcycle|bicycle|bike|tire|tyre)\b/i, category: 'Vehicles & Automotive' },
    { pattern: /\b(toy|toys|lego|doll|action\s*figure|puzzle)\b/i, category: 'Toys & Games' },
    { pattern: /\b(dog\s*food|cat\s*food|pet\s*food|cat\s*litter)\b/i, category: 'Pet Products' }
  ];

  for (const comp of nonEdibleCompounds) {
    if (comp.pattern.test(normalized)) {
      return {
        isNonEdible: true,
        matchedCategory: comp.category,
        reason: `"${rawQuery}" contains non-edible terms (${comp.category}). Food Decode is strictly reserved for edible foods, snacks, beverages, and grocery nutrition panels.`,
        suggestedAction: 'Please search for edible foods or beverages.'
      };
    }
  }

  return { isNonEdible: false };
}

/**
 * Positive verification check if a query or product represents a known edible grocery food or drink.
 */
export function isLikelyEdibleFood(query: string): boolean {
  if (!query) return false;
  if (checkIsNonEdible(query).isNonEdible) return false;

  const q = query.toLowerCase().trim();
  const edibleKeywords = [
    'food', 'snack', 'drink', 'beverage', 'juice', 'soda', 'cereal', 'oat', 'oatmeal',
    'cookie', 'cookies', 'biscuit', 'cracker', 'chips', 'crisps', 'chocolate', 'candy',
    'gummy', 'gummies', 'yogurt', 'milk', 'cheese', 'butter', 'bread', 'toast', 'bagel',
    'pasta', 'rice', 'noodles', 'soup', 'sauce', 'spices', 'sugar', 'salt', 'protein',
    'shake', 'smoothie', 'water', 'tea', 'coffee', 'fanta', 'cola', 'coke', 'pepsi',
    'sprite', 'doritos', 'cheetos', 'oreo', 'lays', 'pringles', 'nutella', 'chobani',
    'nestle', 'kellogg', 'quaker', 'barilla', 'heinz', 'kraft', 'campbell', 'fruit',
    'vegetable', 'apple', 'banana', 'orange', 'berry', 'chicken', 'beef', 'fish', 'egg'
  ];

  return edibleKeywords.some(kw => q.includes(kw));
}
