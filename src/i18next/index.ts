import i18n from 'i18next';
import Backend from 'i18next-chained-backend';
import XHRBackEnd from 'i18next-xhr-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// import  { EnAdmin, EnAgroperu, EnApromalpi} from './locale/en';
// import { EsAdmin, EsAgroperu, EsApromalpi} from './locale/es';

// const resources = {
//   en: {
//     admin: EnAdmin,
//     agroperu: EnAgroperu,
//     apromalpi: EnApromalpi,
//   },
//   es: {
//     admin: EsAdmin,
//     agroperu: EsAgroperu,
//     apromalpi: EsApromalpi,
//   }
// };

const isDevelopmentEnv = process.env.NODE_ENV === 'development';
const backEnds = isDevelopmentEnv ? [XHRBackEnd] : [LocalStorageBackend, XHRBackEnd];
const loadPath = () => '/locales/{{lng}}/{{ns}}.json';

const backEndOptions = isDevelopmentEnv
  ? [{ loadPath }]
  : [{ prefix: 'app_name_', versions: { en: 'v1', es: 'v1' } }, { loadPath }];

const i18init: any = i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ['admin'],
    defaultNS: 'admin',
    fallbackLng: 'es',
    debug: false,
    load: 'languageOnly',
    returnObjects: true,
    joinArrays: true,
    cleanCode: true,
    interpolation: {
      escapeValue: false
    },
    react: {
      wait: true,
      useSuspense: false
    },
    backend: {
      backends: backEnds,
      backendOptions: backEndOptions
    }
  });

export default i18init;
