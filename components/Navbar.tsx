'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // À connecter avec l'état d'authentification

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌾</span>
            </div>
            <span className="text-xl font-bold text-green-700">AgriMauritanie</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Accueil
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
              À propos
            </Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-green-600 transition-colors">
              Marché
            </Link>
            <Link href="/diagnostic" className="text-gray-700 hover:text-green-600 transition-colors">
              Diagnostic
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
                  Tableau de bord
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-green-600 transition-colors">
                  Profil
                </Link>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-gray-700 hover:text-green-600 transition-colors">
                  Connexion
                </Link>
                <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link href="/" className="block text-gray-700 hover:text-green-600">Accueil</Link>
            <Link href="/about" className="block text-gray-700 hover:text-green-600">À propos</Link>
            <Link href="/marketplace" className="block text-gray-700 hover:text-green-600">Marché</Link>
            <Link href="/diagnostic" className="block text-gray-700 hover:text-green-600">Diagnostic</Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="block text-gray-700 hover:text-green-600">Tableau de bord</Link>
                <Link href="/profile" className="block text-gray-700 hover:text-green-600">Profil</Link>
                <button className="block w-full text-left text-red-500">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-gray-700 hover:text-green-600">Connexion</Link>
                <Link href="/register" className="block bg-green-600 text-white px-4 py-2 rounded-lg text-center">Inscription</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

