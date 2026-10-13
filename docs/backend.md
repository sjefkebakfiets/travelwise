# Backendmijlpaal

## Administratorinitialisatie

Geen publieke registratie of HTTP-bootstrapendpoint. Stel DATABASE_URL, ADMIN_EMAIL en ADMIN_PASSWORD tijdelijk als procesvariabelen in. Wachtwoord: minimaal 12 tekens, maximaal 256. Voer eerst npm run db:migrate uit op de bedoelde nieuwe database en daarna npm run admin:init. Verwijder de wachtwoordvariabele direct daarna. De initializer weigert wanneer al een account bestaat; een databaselock beschermt gelijktijdige initialisatie.

## Mobiele sessies

POST /api/auth/mobile/login ontvangt email, password en deviceName. Het antwoord bevat accessToken (15 minuten), refreshToken (30 dagen), tokenType, expiresIn en deviceId. Beide tokens zijn willekeurig; alleen SHA-256-hashes staan in PostgreSQL. Wachtwoorden gebruiken scrypt met random salt, N=32768, r=8, p=3. Geen secrets in logs. Gebruik HTTPS buiten localhost.

POST /api/auth/mobile/refresh ontvangt refreshToken. Bewaar de vervangen token direct en atomair op Android. Een gebruikte refresh-token opnieuw aanbieden trekt de gehele apparaatsessie in. Dit conservatieve beleid betekent dat een verloren refresh-antwoord opnieuw inloggen kan vereisen; retry niet blind met de oude refresh-token.

POST /api/auth/mobile/logout vereist een Bearer-token en trekt het apparaat in. GET /api/devices toont eigen apparaten; DELETE /api/devices/{id} trekt alleen een eigen apparaat in. Accountgebaseerde en globale databaselimieten beperken login/refresh; apparaatlimieten beschermen data-API's. Verlopen rate-limitrecords worden na een dag opgeruimd.

## Trips en GPS

GET/POST /api/trips en GET/PATCH/DELETE /api/trips/{id}. Trips zijn privé; userId wordt uit het token afgeleid. Tripvelden: title, description, status, timezone, startsAt, endsAt, countries. Countries zijn ISO-achtige tweeletttercodes; de landenlijst wordt later gekoppeld.

POST /api/gps/batch ontvangt tripId en maximaal 500 points, body maximaal 256 KiB. Verplichte puntvelden: id, segmentId, latitude, longitude, timestamp (UTC met Z), accuracy. Optioneel: altitude, speed, bearing. Een identieke herhaling wordt bevestigd; hetzelfde ID met andere waarden geeft 409. De gehele batch wordt teruggedraaid bij een conflict. Alleen acknowledgedIds mogen op Android als gesynchroniseerd worden gemarkeerd. Bronrecords blijven intact.

GET /api/trips/{id}/gps geeft originele punten, limit tot 500 en nextCursor. GET /api/trips/{id}/route geeft GeoJSON van gefilterde opgenomen segmenten. Het maximum is 10.000 ruwe punten per aanvraag; gebruik from/to UTC om grote routes per dag op te halen. Het antwoord bevat gemeten distanceMeters en rawPointCount. DELETE trip verwijdert GPS-data expliciet in één transactie; trips met foto's moeten eerst via de toekomstige foto-API worden opgeschoond.

## Migraties en herstel

De initiële migratie creëert alle tabellen en databasecontroles voor GPS en tripdatums. db:migrate gebruikt uitsluitend migrate deploy; geen db push of reset. Pas migraties alleen toe na back-up. Bij een mislukte productiemigratie: bewaar logs en back-up, onderzoek welke instructies zijn uitgevoerd en herstel gericht; gebruik geen reset.

Dockerfile-target migrations bevat de Prisma-CLI voor een handmatige, afzonderlijke migratiestap. Bouw dit target met docker build --target migrations -f infrastructure/docker/Dockerfile -t travelwise-migrations . en draai het met DATABASE_URL als omgevingsvariabele op het juiste Compose-netwerk. Daarna pas de app updaten. Dit voert geen automatische deployment uit.

## Tests

Met werkende Docker-engine: npm run test:db maakt een unieke PostgreSQL 17-container met willekeurig wachtwoord, past migraties toe en voert tests uit. Alleen deze testcontainer wordt vervolgens gestopt en verwijderd; geen volumes of bestaande databases worden aangeraakt. Voor een eigen testserver: zie apps/web/tests/README.md. CI voert dezelfde runner uit plus web- en Dockerbuild.

## Grenzen

Dit is een mobiele backendketen. Auth.js-websessies, web-login, MapLibre-weergave en native Android-login/tracking worden in volgende stappen aangesloten. Mobiele tokens worden nog niet door de Android-startapp gebruikt. Fysieke trackingtests zijn niet uitgevoerd.

## Technische bronnen

Prisma PostgreSQL-adapter: https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql
Scrypt: https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback

## Windows zonder Docker

Gebruik node scripts/test-local-database.mjs voor dezelfde integratietests op portable PostgreSQL 17. Start de webapp met Start-Travelwise.ps1. Zie docs/local-windows.md; Docker is alleen een afzonderlijke optie voor CI/TrueNAS.
