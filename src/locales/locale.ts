import { LocaleData } from "./locale_base.js";
import jaLocaleData from "./locale_ja.js";
import enLocaleData from "./locale_en.js";

function detectLanguage(): string {
  // Check system locale in Node.js environment
  const systemLocale = process.env.LANG || process.env.LANGUAGE || "en";

  // Extract language code (e.g., 'ja_JP.UTF-8' -> 'ja')
  const languageCode = systemLocale.split('_')[0].toLowerCase();

  return languageCode === 'ja' ? 'ja' : 'en';
}

function getLocaleData(): LocaleData {
  const language = detectLanguage();
  let localeData:LocaleData;
  switch (language) {
    case 'ja':
      localeData = jaLocaleData;
      break;
    default:
      localeData = enLocaleData;
      break;
  }
  return Object.assign({...jaLocaleData}, localeData);
}

// Locale data based on detected environment
export const localeData = getLocaleData();
export default localeData;
