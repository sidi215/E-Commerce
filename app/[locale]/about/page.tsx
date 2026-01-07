import Card from '@/components/Card';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            À propos d'AgriMauritanie
          </h1>
          <p className="text-xl text-gray-600">
            Connectant les villages agricoles aux marchés urbains
          </p>
        </div>

        <Card className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            AgriMauritanie est une plateforme numérique innovante conçue spécifiquement pour les agriculteurs mauritaniens. 
            Notre objectif est de connecter les villages agricoles aux marchés des villes, en utilisant la technologie 
            pour améliorer les revenus et la qualité de vie des agriculteurs.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nous croyons que chaque agriculteur mérite d'avoir accès aux outils modernes et aux marchés pour 
            maximiser le potentiel de ses récoltes.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Nos Objectifs</h3>
            <ul className="space-y-3 text-gray-700">
              <li>• Connecter les villages aux marchés urbains</li>
              <li>• Identifier les maladies avec l'IA (85-90% de précision)</li>
              <li>• Fournir des conseils météo adaptés</li>
              <li>• Créer un marché numérique efficace</li>
              <li>• Améliorer les revenus des agriculteurs</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">👥 Nos Utilisateurs</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Agriculteurs</h4>
                <p className="text-gray-700 text-sm">
                  Régions : Guidimaka, Gorgol, Brakna, Tarza<br />
                  Cultures : dattes, tomates, pommes de terre, oignons, melons...
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Acheteurs</h4>
                <p className="text-gray-700 text-sm">
                  Commerçants de Nouakchott, Nouadhibou, Kiffa...<br />
                  Épiceries, marchés locaux, restaurants et hôtels
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">📅 Plan de Déploiement</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Phase 1 - Lancement (3 mois)</h4>
              <ul className="text-gray-700 space-y-2 ml-4">
                <li>• Services gratuits pour tous</li>
                <li>• 10-15 maladies de plantes reconnues</li>
                <li>• Météo locale avec conseils</li>
                <li>• 50 agriculteurs actifs minimum</li>
                <li>• Aucune commission sur les transactions</li>
                <li>• Objectif : Construire communauté et confiance</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Phase 2 - Croissance (à partir du 4ème mois)</h4>
              <ul className="text-gray-700 space-y-2 ml-4">
                <li>• Commissions modérées sur les ventes</li>
                <li>• Abonnements Premium disponibles</li>
                <li>• Assistant vocal en dialectes locaux</li>
                <li>• Chat intelligent pour conseils</li>
                <li>• Recommandations personnalisées</li>
                <li>• Diagnostics plus précis</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="mt-8 bg-green-50">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">🤝 Rejoignez-nous</h3>
          <p className="text-gray-700 mb-4">
            Que vous soyez agriculteur ou acheteur, AgriMauritanie vous offre les outils nécessaires 
            pour réussir dans le marché agricole mauritanien.
          </p>
          <div className="flex gap-4">
            <a href="/register" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Créer un compte
            </a>
            <a href="/contact" className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
              Nous contacter
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

