'use client';

import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t, i18n } = useTranslation('common');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
        {t('welcome')}
      </h1>

      <p style={{ fontSize: '1.25rem', maxWidth: '600px', textAlign: 'center' }}>
        {t('description')}
      </p>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button
          onClick={toggleLanguage}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          {i18n.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        </button>

        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '0.5rem',
            maxWidth: '600px',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            RTL Test / اختبار RTL
          </h2>
          <ul style={{ paddingInlineStart: '2rem', lineHeight: '1.8' }}>
            <li>هذا نص عربي لاختبار التخطيط من اليمين إلى اليسار</li>
            <li>This is English text to test left-to-right layout</li>
            <li>الأرقام: ١٢٣٤٥٦٧٨٩٠</li>
            <li>Numbers: 1234567890</li>
          </ul>
        </div>

        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#e8f4f8',
            borderRadius: '0.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Current Language: <strong>{i18n.language}</strong> | Direction:{' '}
            <strong>{i18n.language === 'ar' ? 'RTL' : 'LTR'}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
