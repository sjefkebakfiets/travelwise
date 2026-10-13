# Mijlpaal 2: mobiele backend en distributie

## Implementatie

Administratorinitialisatie, scrypt-wachtwoorden, mobiele access/refresh-tokens, rotatie, hergebruikdetectie, apparaatintrekking, privé trip-CRUD, transactionele GPS-batches, GPS-paginatie en route-GeoJSON. Inclusief eerste migratie, OpenAPI-contract, readinesscheck, lokale Windows-startbestanden en Docker-migratiecontainer.

## Uitgevoerde controles

- 8 GPS-contracttests geslaagd.
- 11 inhoudelijke PostgreSQL 17-integratietests geslaagd (Node rapporteert 12 tests inclusief de bovenliggende test).
- TypeScript strict en Prisma-schema gevalideerd.
- Next.js-productiebuild geslaagd.
- Productie-HTTP-keten met PostgreSQL geslaagd zonder Docker.
- Compose-configuratie inclusief migratie-overlay valideert.
- PowerShell-start- en initialisatiescripts zijn op syntaxis gecontroleerd; de interactieve accountinvoer is niet uitgevoerd.

## Docker en GitHub

Broncode wordt gepubliceerd naar https://github.com/sjefkebakfiets/travelwise. GitHub Actions bouwt en test de echte Docker-distributie, inclusief gegevensbehoud na containerherstarts. De lokale Docker-engine kon niet starten. Docker-runtimevalidatie is wel succesvol uitgevoerd op GitHub Actions: app- en migratieimages, administratorinitialisatie, HTTP-API, CSS-assets en gegevensbehoud na herstarts van app en PostgreSQL. Er is geen automatische TrueNAS-deployment of GHCR-publicatie.

## Resterend

Auth.js-web-login, MapLibre-weergave en native Android-login, GPS-service, Room en synchronisatie zijn nog niet aangesloten. Geen Android-build of fysieke toesteltest uitgevoerd; Fase 1 is niet voltooid.

## Volgende stap

De native Android-login en offline GPS-keten aansluiten op deze beveiligde API.

## Geverifieerde GitHub-run

https://github.com/sjefkebakfiets/travelwise/actions/runs/38440522347

Alle controles geslaagd op commit 0b1682b. Deze documentatie-update wijzigt geen uitvoerbare code.
