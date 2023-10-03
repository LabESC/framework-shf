import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

import home_en from "./translations/en/home.json";
import menu_en from "./translations/en/menu.json";
import common_en from './translations/en/common.json';
import guidelines_en from './translations/en/guidelines.json';
import view_feedback_en from './translations/en/view_feedback.json';
import sign_up_en from './translations/en/sign_up.json';
import sign_in_en from './translations/en/sign_in.json';

import home_pt_br from './translations/pt_br/home.json';
import menu_pt_br from './translations/pt_br/menu.json';
import common_pt_br from './translations/pt_br/common.json';
import guidelines_pt_br from './translations/pt_br/guidelines.json';
import view_feedback_pt_br from './translations/pt_br/view_feedback.json';
import sign_up_pt_br from './translations/pt_br/sign_up.json';
import sign_in_pt_br from './translations/pt_br/sign_in.json';

i18next.init({
  interpolation: { escapeValue: false }, 
  lng: 'pt_br',
  resources: {
    en: {
      home: home_en,
      menu: menu_en,
      common: common_en,
      guidelines: guidelines_en,
      view_feedback: view_feedback_en,
      sign_up: sign_up_en,
      sign_in: sign_in_en
    },
    pt_br: {
      home: home_pt_br,
      menu: menu_pt_br,
      common: common_pt_br,
      guidelines: guidelines_pt_br,
      view_feedback: view_feedback_pt_br,
      sign_up: sign_up_pt_br,
      sign_in: sign_in_pt_br
    },
  },
})


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
)
