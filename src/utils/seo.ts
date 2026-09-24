import { LabelAnalysisResult } from '../types';

interface SEOUpdateOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  searchQuery?: string;
  product?: LabelAnalysisResult;
}

const DEFAULT_TITLE = "Food Decode – Food Nutrition, Ingredient & Label Scanner";
const DEFAULT_DESC = "Understand what's really in your food. Prefer scan over search term for 100% accurate food labels, instant nutrition breakdowns, ingredient safety analyses, allergen alerts, and harmful additive checks.";
const DEFAULT_KEYWORDS = [
  "food decode",
  "prefer scan over search term",
  "food label scanner",
  "packaged food search",
  "nutrition facts checker",
  "food additive safety",
  "harmful ingredients detector",
  "allergen warning scanner",
  "healthy food alternatives",
  "ultra-processed food identifier"
];

/**
 * Updates head meta tags, canonical links, OpenGraph, Twitter cards, and Schema.org structured data.
 */
export function updatePageSEO(options: SEOUpdateOptions): void {
  try {
    const title = options.title ? `${options.title} | Food Decode` : DEFAULT_TITLE;
    const description = options.description || DEFAULT_DESC;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fooddecode.app';
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    const canonical = options.canonicalUrl || `${origin}${path}${options.searchQuery ? `?q=${encodeURIComponent(options.searchQuery)}` : ''}`;

    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMeta = (attrName: string, attrVal: string, content: string) => {
      let elem = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!elem) {
        elem = document.createElement('meta');
        elem.setAttribute(attrName, attrVal);
        document.head.appendChild(elem);
      }
      elem.setAttribute('content', content);
    };

    // Standard Meta
    setMeta('name', 'description', description);
    const keywordsList = options.keywords ? [...options.keywords, ...DEFAULT_KEYWORDS] : DEFAULT_KEYWORDS;
    setMeta('name', 'keywords', keywordsList.join(', '));
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // OpenGraph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', options.product ? 'product' : 'website');
    setMeta('property', 'og:site_name', 'Food Decode');

    // Twitter
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:card', 'summary_large_image');

    // 3. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // 4. Update Schema.org JSON-LD
    updateStructuredData(options, canonical);
  } catch (err) {
    console.warn('Failed to update SEO tags:', err);
  }
}

/**
 * Injects or updates Schema.org JSON-LD script in <head>
 */
function updateStructuredData(options: SEOUpdateOptions, canonicalUrl: string): void {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fooddecode.app';
  let script = document.getElementById('food-decode-schema-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'food-decode-schema-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const schemas: any[] = [
    // WebSite with SearchAction for site search indexing
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Food Decode",
      "url": origin,
      "description": DEFAULT_DESC,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${origin}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    // WebApplication
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Food Decode",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All",
      "url": canonicalUrl,
      "description": DEFAULT_DESC,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ];

  // If a product is currently loaded, attach Schema.org Product & NutritionInformation
  if (options.product) {
    const p = options.product;
    const nutritionSchema: Record<string, string> = {
      "@type": "NutritionInformation"
    };

    if (p.nutrition?.calories?.value != null) nutritionSchema.calories = `${p.nutrition.calories.value} calories`;
    if (p.nutrition?.totalFat?.value != null) nutritionSchema.fatContent = `${p.nutrition.totalFat.value}g`;
    if (p.nutrition?.saturatedFat?.value != null) nutritionSchema.saturatedFatContent = `${p.nutrition.saturatedFat.value}g`;
    if (p.nutrition?.carbohydrates?.value != null) nutritionSchema.carbohydrateContent = `${p.nutrition.carbohydrates.value}g`;
    if (p.nutrition?.totalSugar?.value != null) nutritionSchema.sugarContent = `${p.nutrition.totalSugar.value}g`;
    if (p.nutrition?.protein?.value != null) nutritionSchema.proteinContent = `${p.nutrition.protein.value}g`;
    if (p.nutrition?.sodium?.value != null) nutritionSchema.sodiumContent = `${p.nutrition.sodium.value}mg`;

    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": p.productName,
      "brand": {
        "@type": "Brand",
        "name": p.brand || "Packaged Food"
      },
      "category": "Food",
      "description": p.simpleSummary || `${p.productName} by ${p.brand} nutrition breakdown and ingredient analysis on Food Decode.`,
      "nutrition": nutritionSchema
    });
  }

  // If searching a query
  if (options.searchQuery) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      "name": `Search Results for "${options.searchQuery}"`,
      "url": canonicalUrl,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": options.product?.productName || options.searchQuery
          }
        ]
      }
    });
  }

  script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
}
