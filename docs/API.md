## API contract — AgriMauritanie

Ce document décrit les endpoints attendus par le frontend Next.js, les schémas JSON (request/response), et des notes pour implémenter l'API backend en Django avec une base MySQL.

Objectifs
- Fournir des spécifications claires pour les routes essentielles utilisées par l'interface (produits, agriculteurs, commandes, utilisateurs, messagerie).
- Exemples de requêtes/réponses JSON et codes HTTP attendus.
- Conseils d'intégration Django + MySQL (migrations, configuration, champs importants).

Environnement / variables
- `NEXT_PUBLIC_API_URL` (frontend) — URL publique vers l'API, ex. `https://api.agri.example.com` ou `http://localhost:8000`.
- Backend Django: variables typiques — `DATABASE_URL` / `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`, `SECRET_KEY`, `ALLOWED_HOSTS`.

Authentification
- Pour les premiers tests on peut exposer l'API sans auth (ou avec un simple token). Production: utiliser token-based (JWT) ou session (Django + cookie) / NextAuth.
- Endpoints d'auth recommandés (exemples REST):
  - `POST /api/auth/register/` — Créer un utilisateur
  - `POST /api/auth/login/` — Retourne token ou configure la session
  - `POST /api/auth/logout/` — Termine la session

Principes généraux
- Toutes les réponses JSON doivent utiliser un en-tête `Content-Type: application/json`.
- Erreurs: renvoyer un body {"detail": "message"} et un code HTTP approprié (400/401/403/404/500).
- Pagination: pour les listes, préférer `GET /api/products/?page=1&page_size=20` et renvoyer { results: [], count: X, next, previous }.
- CORS: autoriser l'origine du frontend et méthodes `GET,POST,PUT,PATCH,DELETE`.

Schemas (Types)

1) Product

TypeScript interface (référence)

```ts
export interface Product {
  id: number | string;
  name: string;
  description?: string;
  price: number; // monnaie locale (MRU)
  unit?: string; // "kg", "pièce", ...
  image_url?: string; // URL publique
  farmer: number | string; // farmer id
  farmer_name?: string;
  region?: string;
  category?: string;
  created_at?: string; // ISO
}
```

2) Farmer

```ts
export interface Farmer {
  id: number | string;
  name: string;
  location?: string; // ville/localité
  region?: string;
  lat?: number;
  lng?: number;
  phone?: string;
  email?: string;
  products?: string[]; // liste de noms (optionnel)
  hasProducts?: boolean; // computed
}
```

3) Order / Commande

```ts
export interface OrderItem {
  product_id: number | string;
  name?: string;
  qty: number;
  price_each?: number;
  unit?: string;
}

export interface Order {
  id: number | string;
  user: number | string; // buyer id
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at?: string;
  farmer?: string; // optional summary
}
```

4) User (minimal)

```ts
export interface User {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  role?: 'farmer' | 'buyer' | 'admin';
}
```


Endpoints recommandés

Note: préfixer toutes les routes par `/api/`.

1) Produits

- GET /api/products/
  - Description: liste de produits (paginated)
  - Query params: `page`, `page_size`, `search` (name or farmer), `region`, `category`
  - Réponse 200:
    ```json
    {
      "count": 123,
      "next": "...",
      "previous": null,
      "results": [ { Product }, { Product }, ... ]
    }
    ```

- GET /api/products/{id}/
  - Description: détail d'un produit
  - Réponse 200: `{ Product }`

- POST /api/products/
  - (Pour agriculteurs) créer un produit — auth requise
  - Body: { name, description, price, unit, image_url (ou multipart upload), region, category }
  - Réponse 201: `{ Product }`

2) Agriculteurs

- GET /api/farmers/
  - Params: `search`, `region`
  - Réponse: pagination avec objets Farmer

- GET /api/farmers/{id}/
  - Détail agriculteur

3) Commandes (Orders)

- POST /api/orders/
  - Créer une commande (buyer) — auth requise
  - Body example:
    ```json
    {
      "user": 12,
      "items": [ { "product_id": 1, "qty": 3 }, {"product_id": 5, "qty": 2 } ],
      "notes": "Livrer chez ..."
    }
    ```
  - Response 201: `{ order }` (with computed `total`, `status: pending`)

- GET /api/orders/?user={id}
  - Lister commandes pour un utilisateur (buyer)

- GET /api/orders/{id}/
  - Détail commande

4) Auth (basic / recommended)

- POST /api/auth/register/
  - Body: { name, email, phone, password, role }
  - Response 201: `{ id, name, email, role }` (optionally token)

- POST /api/auth/login/
  - Body: { email_or_phone, password }
  - Response 200: `{ token, user: { ... } }` or set session cookie

5) Messagerie (optionnel/simple)

- GET /api/messages/?user={id}
- POST /api/messages/
  - Body: { from, to, text }
  - Response 201: `{ message }`


Exemples de réponses

GET /api/products/ (200)

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Tomates fraîches",
      "description": "Tomates biologiques",
      "price": 150,
      "unit": "kg",
      "image_url": "https://cdn.example.com/images/1.jpg",
      "farmer": 10,
      "farmer_name": "Amadou Diallo",
      "region": "Guidimaka",
      "category": "Légumes",
      "created_at": "2025-12-01T10:00:00Z"
    }
  ]
}
```

POST /api/orders/ (request)

```json
{
  "user": 42,
  "items": [
    { "product_id": 1, "qty": 5 },
    { "product_id": 3, "qty": 2 }
  ],
  "notes": "Livrer à l'adresse X"
}
```

POST /api/orders/ (response 201)

```json
{
  "id": 101,
  "user": 42,
  "items": [ { "product_id": 1, "qty": 5, "price_each": 150 }, ... ],
  "total": 1050,
  "status": "pending",
  "created_at": "2026-01-03T12:00:00Z"
}
```


Notes MySQL / Django
- Django `settings.py` (extrait) pour MySQL :

```py
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.mysql',
    'NAME': os.environ.get('DB_NAME', 'agri_db'),
    'USER': os.environ.get('DB_USER', 'agri'),
    'PASSWORD': os.environ.get('DB_PASS', 'secret'),
    'HOST': os.environ.get('DB_HOST', 'localhost'),
    'PORT': os.environ.get('DB_PORT', '3306'),
    'OPTIONS': {
      'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
    }
  }
}
```

- Modèles Django recommandés (extraits simplifiés) :

```py
class Farmer(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    region = models.CharField(max_length=100, blank=True)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50, default='kg')
    image_url = models.URLField(blank=True)
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='products')
    region = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100, blank=True)

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='pending')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    qty = models.IntegerField()
    price_each = models.DecimalField(max_digits=10, decimal_places=2)
```

- Migrations: `python manage.py makemigrations` puis `python manage.py migrate`.
- Indexer les champs souvent filtrés (ex: `region`, `category`, `farmer`).

Fichiers media / images
- Option 1: stocker `image_url` pointant vers un CDN ou stockage S3.
- Option 2: proposer upload (multipart) et servir via `MEDIA_URL` (Django) ou un service externe.

Performance & mise en production
- Utiliser `gunicorn` + `nginx` devant Django, connexion à MySQL en production.
- Mettre en place caching et pagination pour les listes (Redis si besoin).

Websocket / Messagerie en temps réel (optionnel)
- Pour messagerie réelle, envisager Channels (Django Channels + Redis) ou utiliser Supabase/Realtime.
- Alternativement, une solution simple: stocker messages via REST et utiliser polling / BroadcastChannel côté frontend pour dev.

Sécurité
- Protéger les endpoints d'actions (création commande, modification produit) par auth + permissions.
- Valider côté serveur quantité et disponibilité des produits avant acceptation d'une commande.
- Éviter d'exposer des données sensibles dans responses.

Checklist pour le backend (Django + MySQL)
- [ ] Créer les modèles et migrations
- [ ] Implémenter serializers (Django REST Framework) pour Product/Farmer/Order/User
- [ ] Ajouter endpoints REST conformes ci-dessus
- [ ] Activer CORS pour l'URL frontend
- [ ] Renseigner `NEXT_PUBLIC_API_URL` dans l'app Next.js
- [ ] Tester avec `curl` / Postman / playwright

Exemples `curl`

Lister produits:
```bash
curl "${NEXT_PUBLIC_API_URL:-http://localhost:8000}/api/products/"
```

Créer commande (auth via token):
```bash
curl -X POST "${NEXT_PUBLIC_API_URL:-http://localhost:8000}/api/orders/" \
  -H "Authorization: Token <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"user":42, "items":[{"product_id":1,"qty":2}] }'
```

---

Si vous voulez, je peux maintenant:
- générer les fichiers TypeScript `types/*.ts` côté frontend à partir de ces schémas,
- implémenter `lib/api.ts` pour centraliser les appels à `NEXT_PUBLIC_API_URL`, ou
- créer des serializers Django + views d'exemple (boilerplate) si vous voulez un squelette backend.

Dites-moi quelle(s) action(s) vous souhaitez que je réalise ensuite.
