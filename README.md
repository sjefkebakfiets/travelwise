# Travelwise

Privé reisplatform met Next.js, PostgreSQL en een native Android-app.

## Status: mijlpaal 2 — mobiele backend

Administratorinitialisatie, mobiele login, refresh-rotatie, apparaatintrekking, privé trip-CRUD en idempotente GPS-batchopslag zijn geïmplementeerd. Het web toont nog een startpagina; Android bevat nog een Compose-startscherm. Auth.js-websessies, native GPS-tracking, Room, synchronisatie en kaartweergave zijn nog niet aangesloten. Fase 1 is niet voltooid.

## Lokaal

Node.js 24 en npm vereist. Vanuit de projectroot: npm ci, npm run db:generate, npm test, npm run typecheck, npm run build, npm run dev. De NAS ondersteunt geen npm-workspace-symlinks; dependencies staan daarom in de root.

Backend: docs/backend.md. Met Docker: npm run test:db voor een volledig afzonderlijke PostgreSQL-testcontainer. Migraties: npm run db:migrate, met DATABASE_URL in het proces.

Docker-distributie: zie docs/docker.md. TrueNAS-deployment gebeurt uitsluitend handmatig.

Lokaal zonder Docker: Start-Travelwise.ps1. Handleiding: docs/local-windows.md.
