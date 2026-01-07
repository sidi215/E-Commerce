import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Button from '@/components/Button';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('home');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="py-20 px-4 relative overflow-hidden min-h-[600px] flex items-center"
      >
        {/* Vidéo de fond */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: -1
          }}
        >
          <source src="/videos/19127743-uhd_3840_2160_30fps.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-farmer-watering-his-field-5158-large.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
        
        {/* Overlay pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Overlay vert supplémentaire pour l'harmonie des couleurs */}
        <div className="absolute inset-0 bg-green-900/30"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              🌾 {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-md">
              {t('subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/register`}>
                <Button size="lg" variant="primary" className="transform hover:scale-105 shadow-xl">
                  {t('getStarted')}
                </Button>
              </Link>
              <Link href={`/${locale}/about`}>
                <button className="px-6 py-3 text-lg font-semibold bg-white text-green-700 rounded-lg border-2 border-white transform hover:scale-105 shadow-xl hover:shadow-2xl transition-all duration-200 hover:bg-green-50 hover:border-green-200">
                  {t('learnMore')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 animate-fade-in">
            {t('services')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">🤖</div>
              <h3 className="text-2xl font-semibold mb-3">{t('aiDiagnostic')}</h3>
              <p className="text-gray-600 mb-4">
                {t('aiDiagnosticDesc')}
              </p>
              <Link href={`/${locale}/diagnostic/details`}>
                <Button variant="primary" fullWidth>
                  {t('seeMore')} →
                </Button>
              </Link>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">🛒</div>
              <h3 className="text-2xl font-semibold mb-3">{t('digitalMarket')}</h3>
              <p className="text-gray-600 mb-4">
                {t('digitalMarketDesc')}
              </p>
              <Link href={`/${locale}/marketplace`}>
                <Button variant="primary" fullWidth>
                  {t('viewMarket')}
                </Button>
              </Link>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">🌤️</div>
              <h3 className="text-2xl font-semibold mb-3">{t('weatherAdvice')}</h3>
              <p className="text-gray-600 mb-4">
                {t('weatherAdviceDesc')}
              </p>
              <Link href={`/${locale}/weather/details`}>
                <Button variant="primary" fullWidth>
                  {t('seeMore')} →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">50+</div>
              <p className="text-sm text-gray-600">{t('stats.activeFarmers')}</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">15+</div>
              <p className="text-sm text-gray-600">{t('stats.detectableDiseases')}</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">90%</div>
              <p className="text-sm text-gray-600">{t('stats.aiAccuracy')}</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">4</div>
              <p className="text-sm text-gray-600">{t('stats.regionsCovered')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            {t('howItWorks')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('step1')}</h3>
              <p className="text-gray-600">
                {t('step1Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('step2')}</h3>
              <p className="text-gray-600">
                {t('step2Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('step3')}</h3>
              <p className="text-gray-600">
                {t('step3Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('step4')}</h3>
              <p className="text-gray-600">
                {t('step4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-8 text-green-50">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/register`}>
              <Button size="lg" variant="secondary" className="bg-blue-600 text-white border-2 border-white hover:bg-blue-700 hover:text-white">
                {t('cta.button')}
              </Button>
            </Link>
            
          </div>
        </div>
      </section>
    </div>
  );
}