# Boulder Score - Frontend Vue.js

Frontend Vue 3 + TypeScript per l'applicazione Boulder Score, un sistema di gestione punteggi per competizioni di arrampicata boulder.

## 🎯 Caratteristiche

- ✅ **Autenticazione atleti** con Laravel Sanctum (Bearer token)
- ✅ **Gestione blocchi** con toggle completamento in tempo reale
- ✅ **Visualizzazione punteggio** con dettaglio per blocco
- ✅ **Classifica dinamica** con posizione atleta
- ✅ **Reset progressi** (blocchi e totale)
- ✅ **Responsive design** per desktop e mobile
- ✅ **Gestione errori** completa (401, 404, 422, 429)
- ✅ **Type-safe** con TypeScript

## 📋 Prerequisiti

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Backend Laravel** in esecuzione su `http://localhost:8000`

## 🚀 Setup Iniziale

### 1. Installazione dipendenze

```bash
cd frontend-vue
npm install
```

### 2. Verifica backend

Assicurati che il backend Laravel sia attivo e configurato:

```bash
# Dal backend Laravel
php artisan migrate:fresh --seed
php artisan serve
```

Il backend deve essere raggiungibile su `http://localhost:8000`.

### 3. Avvia il frontend

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`.

## 🧪 Test Manuale

### Dati di test (dopo seed del backend)

Dopo aver eseguito `php artisan migrate:fresh --seed` nel backend, usa:

- **Event Code**: `BOULDER2025`
- **Nome atleta**: `Marco Rossi` (o qualsiasi altro nome)
- **Pettorale**: `101` (opzionale)

### Flusso di test completo

1. **Login**
   - Accedi a `http://localhost:5173/login`
   - Inserisci le credenziali sopra
   - Verifica reindirizzamento a `/blocks`

2. **Visualizza blocchi**
   - Verifica che vengano mostrati i blocchi dell'evento
   - Controlla che ogni blocco mostri: numero, difficoltà (con colore), punteggio, completamenti

3. **Toggle completamento**
   - Clicca su "Segna come completato" su un blocco
   - Verifica che il blocco cambi stato e mostri data completamento
   - Controlla che il punteggio si aggiorni
   - Clicca su "Rimuovi completamento" per toglierlo

4. **Visualizza punteggio**
   - Vai a `/score`
   - Verifica il punteggio totale in alto
   - Controlla la tabella dettagli con tutti i blocchi

5. **Visualizza classifica**
   - Vai a `/leaderboard`
   - Verifica la tua posizione
   - Controlla che la tua riga sia evidenziata
   - Verifica che i primi 3 abbiano medaglie

6. **Impostazioni**
   - Vai a `/settings`
   - Prova "Reset Blocchi" (rimuove completamenti)
   - Prova "Logout"

7. **Persistenza sessione**
   - Fai login
   - Ricarica la pagina
   - Verifica che tu sia ancora autenticato

## 🏗️ Struttura Progetto

```
frontend-vue/
├── src/
│   ├── api/              # Client API e endpoints
│   │   ├── client.ts     # Axios client con interceptors
│   │   └── endpoints.ts  # Definizione endpoint API
│   ├── components/       # Componenti riutilizzabili
│   │   ├── AppNav.vue
│   │   ├── BlockCard.vue
│   │   ├── ErrorBanner.vue
│   │   └── LoadingOverlay.vue
│   ├── pages/           # Pagine dell'applicazione
│   │   ├── LoginPage.vue
│   │   ├── BlocksPage.vue
│   │   ├── ScorePage.vue
│   │   ├── LeaderboardPage.vue
│   │   └── SettingsPage.vue
│   ├── stores/          # Pinia stores
│   │   ├── auth.ts
│   │   ├── blocks.ts
│   │   ├── score.ts
│   │   └── leaderboard.ts
│   ├── types/           # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/           # Utilities
│   │   ├── mappers.ts   # DTO → Model mappers
│   │   └── format.ts    # Formatters
│   ├── router/          # Vue Router
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔌 Configurazione API

### Proxy Vite

Il proxy è configurato in [vite.config.ts](vite.config.ts) per evitare problemi CORS:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true
    }
  }
}
```

Tutte le chiamate a `/api/*` vengono inoltrate a `http://localhost:8000/api/*`.

### Autenticazione

L'app usa **Laravel Sanctum** con Bearer token:

1. Login genera un token (`POST /api/auth/login`)
2. Token salvato in `localStorage`
3. Ogni richiesta include `Authorization: Bearer {token}`
4. 401 → logout automatico

## 📡 Endpoint API Utilizzati

### Auth
- `POST /api/auth/login` - Login atleta
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Validazione sessione

### Blocks
- `GET /api/blocks` - Lista blocchi
- `POST /api/blocks/{id}/complete` - Toggle completamento
- `POST /api/blocks/reset` - Reset blocchi atleta

### Score
- `GET /api/score` - Punteggio summary
- `GET /api/score/details` - Dettagli punteggio per blocco
- `GET /api/score/leaderboard` - Classifica

### Dev
- `POST /api/reset` - Reset totale (dev-only)

## 🎨 Note sul Design

### Difficoltà blocchi

I colori delle difficoltà sono sincronizzati con il backend:

```typescript
easy:   { label: 'Easy',   color: '#9BE7A7' }  // Verde chiaro
medium: { label: 'Medium', color: '#FFE082' }  // Giallo
hard:   { label: 'Hard',   color: '#FFB74D' }  // Arancione
elite:  { label: 'Elite',  color: '#E57373' }  // Rosso
```

### Punteggi dinamici

⚠️ **IMPORTANTE**: I punteggi sono **dinamici** e possono cambiare nel tempo.

Formula: `blockScore = baseScore / completedCount`

Se un altro atleta completa un blocco che hai già completato, il tuo punteggio per quel blocco diminuisce. Per questo motivo:

- Non c'è caching aggressivo dei punteggi
- Score e leaderboard vengono ricaricati dopo ogni azione
- Il pulsante "Ricarica" è sempre disponibile

## 🔧 Gestione Errori

### Rate Limits

L'app gestisce correttamente i rate limits del backend:

- `POST /blocks/{id}/complete`: 60/min
- `POST /blocks/reset`: 10/min
- `POST /reset`: 5/min

In caso di 429, viene mostrato: _"Troppe richieste. Riprova tra qualche istante."_

### Altri errori HTTP

- **401**: Logout automatico + redirect a login
- **422**: Messaggio validazione dal backend
- **404**: Messaggio "risorsa non trovata"
- **Network error**: Messaggio "impossibile contattare il server"

## 📦 Build per Produzione

```bash
npm run build
```

I file ottimizzati saranno generati in `dist/`.

### Preview build

```bash
npm run preview
```

## 🧩 Stack Tecnologico

- **Vue 3** - Framework frontend
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Vue Router** - Routing SPA
- **Pinia** - State management
- **Axios** - HTTP client

## ✅ Acceptance Criteria

- [x] Login funziona con evento seed `BOULDER2025`
- [x] Token salvato e riusato correttamente
- [x] `/blocks` mostra elenco e toggle aggiorna lo stato
- [x] UI mostra `current_score` e `completed_count` aggiornati dopo toggle
- [x] `/score` e `/score/details` riflettono i cambiamenti
- [x] `/score/leaderboard` mostra classifica e rank atleta
- [x] Gestione errori: 401, 404, 422, 429 con messaggi chiari
- [x] Nessuna chiamata a endpoint inesistenti
- [x] README con istruzioni per avviare backend+frontend

## 🐛 Troubleshooting

### Backend non raggiungibile

```
Errore: Impossibile contattare il server
```

**Soluzione**: Verifica che il backend Laravel sia attivo su `http://localhost:8000`:

```bash
cd ../backend
php artisan serve
```

### CORS errors

Se vedi errori CORS nel browser, verifica che:

1. Il proxy Vite sia configurato correttamente ([vite.config.ts](vite.config.ts))
2. Stai usando il baseURL relativo `/api` (non `http://localhost:8000/api`)

### 401 Unauthorized loop

Se vieni continuamente reindirizzato a login:

1. Controlla che il backend sia seeded: `php artisan migrate:fresh --seed`
2. Verifica che il token sia salvato in localStorage (DevTools → Application → Local Storage)
3. Prova a fare logout e login di nuovo

### Blocchi non si aggiornano

1. Verifica che il backend restituisca l'array aggiornato dopo `POST /blocks/{id}/complete`
2. Controlla la console per errori
3. Ricarica manualmente con il pulsante "🔄 Ricarica"

## 📚 Riferimenti

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Axios Documentation](https://axios-http.com/)
- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)

## 📝 Note per lo Sviluppo

### Contratto API

Il frontend rispetta **al 100%** il contratto API del backend:

- Formato response: `{ success, data, message }`
- Chiavi miste (camelCase e snake_case) normalizzate tramite mappers
- Bearer token in header `Authorization`
- Nessuna modifica al backend necessaria

### Type Safety

Tutti i DTO del backend hanno interfacce TypeScript corrispondenti in [src/types/index.ts](src/types/index.ts).

I mapper in [src/utils/mappers.ts](src/utils/mappers.ts) convertono i DTO (snake_case) in modelli frontend (camelCase).

### Testing

Per testare il frontend:

1. Backend deve essere seeded
2. Usa i dati demo forniti
3. Testa tutti i flussi nella sezione "Test Manuale"
4. Verifica la persistenza della sessione ricaricando la pagina

---

**Sviluppato con ❤️ per Boulder Score**
