import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-green-100 to-green-50 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            🌾 Bienvenue sur <span className="text-green-600">AgriMauritanie</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Connectez vos villages agricoles aux marchés des villes mauritaniennes
            avec des outils intelligents pour améliorer vos revenus
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
                <Button size="lg" variant="primary" className="transform hover:scale-105">
                Commencer maintenant
              </Button>
            </Link>
            <Link href="/about">
                <Button size="lg" variant="outline" className="transform hover:scale-105">
                En savoir plus
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 animate-fade-in">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">🤖</div>
              <h3 className="text-2xl font-semibold mb-3">Diagnostic IA</h3>
              <p className="text-gray-600 mb-4">
                Identifiez les maladies de vos plantes en quelques secondes avec notre modèle d'intelligence artificielle. 
                Précision de 85-90%.
              </p>
              <Link href="/diagnostic">
                <Button variant="primary" fullWidth>
                  Essayer maintenant
                </Button>
              </Link>
            </Card>

            <Card hover className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">🛒</div>
              <h3 className="text-2xl font-semibold mb-3">Marché Numérique</h3>
              <p className="text-gray-600 mb-4">
                Vendez vos produits directement aux commerçants des villes. 
                Connectez-vous aux marchés de Nouakchott, Nouadhibou, Kiffa et plus encore.
              </p>
              <Link href="/marketplace">
                <Button variant="primary" fullWidth>
                  Voir le marché
                </Button>
              </Link>
            </Card>

            <Card hover className="text-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">🌤️</div>
              <h3 className="text-2xl font-semibold mb-3">Conseils Météo</h3>
              <p className="text-gray-600 mb-4">
                Recevez des conseils météorologiques adaptés au climat mauritanien 
                pour optimiser vos récoltes et protéger vos cultures.
              </p>
              <Link href="/dashboard">
                <Button variant="primary" fullWidth>
                  Voir les prévisions
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-700">Agriculteurs actifs</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-700">Maladies détectables</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">90%</div>
              <div className="text-gray-700">Précision IA</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">4</div>
              <div className="text-gray-700">Régions couvertes</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Inscrivez-vous</h3>
              <p className="text-gray-600">
                Créez votre compte gratuitement en quelques minutes
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Ajoutez vos plantes</h3>
              <p className="text-gray-600">
                Enregistrez vos cultures et suivez leur santé
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Diagnostiquez</h3>
              <p className="text-gray-600">
                Utilisez l'IA pour identifier les maladies rapidement
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Vendez</h3>
              <p className="text-gray-600">
                Mettez vos produits sur le marché numérique
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à améliorer vos revenus agricoles ?
          </h2>
          <p className="text-xl mb-8 text-green-50">
            Rejoignez des centaines d'agriculteurs mauritaniens qui utilisent déjà notre plateforme
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Créer un compte gratuit
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
