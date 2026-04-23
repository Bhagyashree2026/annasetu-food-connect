// Lightweight client-side i18n for AnnaSetu. Supports English + 5 Indian languages.
// Stored in localStorage so the choice persists between sessions, and broadcasts
// via window event so all components re-render on change.

import { useEffect, useState } from "react";

export type Lang = "en" | "ml" | "hi" | "mr" | "te" | "kn";

export const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

const KEY = "annasetu.lang";
const EVT = "annasetu:lang";

export function getLang(): Lang {
  try {
    const v = localStorage.getItem(KEY) as Lang | null;
    if (v && LANGS.some(l => l.code === v)) return v;
  } catch { /* ignore */ }
  return "en";
}

export function setLang(l: Lang) {
  try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
  window.dispatchEvent(new Event(EVT));
}

// Dictionary keys grouped by feature. Add new keys here as the app grows.
type Dict = Record<string, string>;

const en: Dict = {
  // tabs
  "tab.home": "Home",
  "tab.activity": "Activity",
  "tab.community": "Community",
  "tab.alerts": "Alerts",
  "tab.profile": "Profile",
  "tab.impact": "Impact",

  // common
  "common.back": "Back",
  "common.notifications": "Notifications",
  "common.language": "Language",

  // page subtitles (shown in header below title)
  "sub.impact": "Real-time impact",
  "sub.community": "Voices from the field",
  "sub.home": "Bridge food. Save lives.",
  "sub.activity": "Your donations",
  "sub.alerts": "Updates & pickups",
  "sub.profile": "Your account",
};

const ml: Dict = {
  "tab.home": "ഹോം",
  "tab.activity": "പ്രവർത്തനം",
  "tab.community": "കമ്മ്യൂണിറ്റി",
  "tab.alerts": "അലേർട്ടുകൾ",
  "tab.profile": "പ്രൊഫൈൽ",
  "tab.impact": "പ്രഭാവം",
  "common.back": "തിരികെ",
  "common.notifications": "അറിയിപ്പുകൾ",
  "common.language": "ഭാഷ",
  "sub.impact": "തത്സമയ പ്രഭാവം",
  "sub.community": "സമൂഹ ശബ്ദങ്ങൾ",
  "sub.home": "ഭക്ഷണം പങ്കിടാം. ജീവൻ രക്ഷിക്കാം.",
  "sub.activity": "നിങ്ങളുടെ ദാനങ്ങൾ",
  "sub.alerts": "അപ്ഡേറ്റുകൾ",
  "sub.profile": "നിങ്ങളുടെ അക്കൗണ്ട്",
};

const hi: Dict = {
  "tab.home": "होम",
  "tab.activity": "गतिविधि",
  "tab.community": "समुदाय",
  "tab.alerts": "सूचनाएँ",
  "tab.profile": "प्रोफ़ाइल",
  "tab.impact": "प्रभाव",
  "common.back": "वापस",
  "common.notifications": "सूचनाएँ",
  "common.language": "भाषा",
  "sub.impact": "वास्तविक समय प्रभाव",
  "sub.community": "क्षेत्र की आवाज़ें",
  "sub.home": "भोजन साझा करें। जीवन बचाएं।",
  "sub.activity": "आपके दान",
  "sub.alerts": "अपडेट और पिकअप",
  "sub.profile": "आपका खाता",
};

const mr: Dict = {
  "tab.home": "मुख्यपृष्ठ",
  "tab.activity": "क्रियाकलाप",
  "tab.community": "समुदाय",
  "tab.alerts": "सूचना",
  "tab.profile": "प्रोफाइल",
  "tab.impact": "प्रभाव",
  "common.back": "मागे",
  "common.notifications": "सूचना",
  "common.language": "भाषा",
  "sub.impact": "रिअल-टाइम प्रभाव",
  "sub.community": "क्षेत्रातील आवाज",
  "sub.home": "अन्न शेअर करा. जीव वाचवा.",
  "sub.activity": "तुमची देणगी",
  "sub.alerts": "अद्यतने आणि पिकअप",
  "sub.profile": "तुमचे खाते",
};

const te: Dict = {
  "tab.home": "హోమ్",
  "tab.activity": "కార్యకలాపం",
  "tab.community": "సమాజం",
  "tab.alerts": "హెచ్చరికలు",
  "tab.profile": "ప్రొఫైల్",
  "tab.impact": "ప్రభావం",
  "common.back": "వెనుకకు",
  "common.notifications": "నోటిఫికేషన్లు",
  "common.language": "భాష",
  "sub.impact": "రియల్-టైమ్ ప్రభావం",
  "sub.community": "క్షేత్ర గొంతులు",
  "sub.home": "ఆహారాన్ని పంచుకోండి. ప్రాణాలను కాపాడండి.",
  "sub.activity": "మీ విరాళాలు",
  "sub.alerts": "నవీకరణలు & పికప్‌లు",
  "sub.profile": "మీ ఖాతా",
};

const kn: Dict = {
  "tab.home": "ಮುಖಪುಟ",
  "tab.activity": "ಚಟುವಟಿಕೆ",
  "tab.community": "ಸಮುದಾಯ",
  "tab.alerts": "ಎಚ್ಚರಿಕೆಗಳು",
  "tab.profile": "ಪ್ರೊಫೈಲ್",
  "tab.impact": "ಪರಿಣಾಮ",
  "common.back": "ಹಿಂದೆ",
  "common.notifications": "ಅಧಿಸೂಚನೆಗಳು",
  "common.language": "ಭಾಷೆ",
  "sub.impact": "ನೈಜ-ಸಮಯದ ಪರಿಣಾಮ",
  "sub.community": "ಕ್ಷೇತ್ರದ ಧ್ವನಿಗಳು",
  "sub.home": "ಆಹಾರವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ. ಜೀವ ಉಳಿಸಿ.",
  "sub.activity": "ನಿಮ್ಮ ದಾನಗಳು",
  "sub.alerts": "ನವೀಕರಣಗಳು ಮತ್ತು ಪಿಕಪ್‌ಗಳು",
  "sub.profile": "ನಿಮ್ಮ ಖಾತೆ",
};

const DICTS: Record<Lang, Dict> = { en, ml, hi, mr, te, kn };

export function t(key: string, lang?: Lang): string {
  const l = lang ?? getLang();
  return DICTS[l]?.[key] ?? DICTS.en[key] ?? key;
}

/** React hook: returns the current language and a translator that re-renders on change. */
export function useT() {
  const [lang, setLangState] = useState<Lang>(() => getLang());
  useEffect(() => {
    const handler = () => setLangState(getLang());
    window.addEventListener(EVT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return {
    lang,
    setLang,
    t: (key: string) => t(key, lang),
  };
}
