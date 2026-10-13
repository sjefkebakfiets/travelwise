# Docker en GitHub-distributie

Repository: https://github.com/sjefkebakfiets/travelwise

Docker is de distributievorm voor TrueNAS SCALE / Dockge. De Windows-startbestanden zijn uitsluitend een alternatieve lokale ontwikkelroute.

## Voorbereiding

Clone de repository als Travelwise-projectmap. Kopieer .env.example naar .env in de repositoryroot. Vul POSTGRES_PASSWORD en AUTH_SECRET met zelfgegenereerde, sterke waarden. Gebruik voor dit databasewachtwoord hexadecimale tekens zodat de samengestelde database-URL veilig blijft. .env is uitgesloten van Git en de Docker-buildcontext.

De uploadmap en PostgreSQL-map staan op de opgegeven TrueNAS-paden. De hostpoort is standaard 3006 en kan met TRAVELWISE_PORT worden aangepast. PostgreSQL heeft geen hostpoort.

## Eerste database-migratie

Vanuit de repositoryroot, met Docker-engine beschikbaar:

    docker compose --env-file .env -f infrastructure/docker/compose.yaml -f infrastructure/docker/compose.migrations.yaml run --build --rm travelwise-migrate

Dit start de database en voert uitsluitend migrate deploy uit. Het wijzigt geen bestaande database via reset. Maak vóór latere migraties een back-up. De migratiecontainer wordt na afloop verwijderd; de databasegegevens blijven op het persistente volume.

## Administrator

Stel ADMIN_EMAIL en ADMIN_PASSWORD tijdelijk als procesvariabelen in. Voer daarna uit:

    docker compose --env-file .env -f infrastructure/docker/compose.yaml -f infrastructure/docker/compose.migrations.yaml run --rm -e ADMIN_EMAIL -e ADMIN_PASSWORD travelwise-migrate node apps/web/scripts/init-admin.ts

De initialisatie weigert als er al een account is. Verwijder daarna de wachtwoordvariabele. Er is geen standaardwachtwoord en geen publieke registratie.

## App starten

    docker compose --env-file .env -f infrastructure/docker/compose.yaml up -d --build

Deze commandostappen worden alleen handmatig uitgevoerd. Er is geen automatische TrueNAS-deployment. In Dockge moeten de stackbestanden en buildcontext naar deze checkout verwijzen; neem de app-buildcontext en migrations-overlay over uit infrastructure/docker.

Na starten: http://192.168.178.252:3006. De readinesscheck controleert de database en het schema. Gebruik voor mobiele toegang buiten het eigen netwerk HTTPS of een passende privé-VPN met veilige TLS-configuratie.

## GitHub Actions

Iedere push/PR voert contracttests, PostgreSQL 17-integratietests, TypeScript, Prisma, Next.js-build en een Docker-imagebuild uit. De workflow pusht geen image naar GHCR en deployt niet naar TrueNAS. Docker-images publiceren is een afzonderlijke vervolgstap.

## Huidige mijlpaal

De mobiele backendketen is geïmplementeerd. Web-login, MapLibre, native tracking, Room en Android-synchronisatie ontbreken nog. Fase 1 is niet compleet en fysieke toesteltests zijn niet uitgevoerd.

Prisma Docker-vereisten: https://www.prisma.io/docs/guides/deployment/docker

De Docker-distributietest bouwt app- en migratieimages, past de migratie toe, initialiseert een testaccount en controleert HTTP, CSS-assets en gegevensbehoud na herstart van de app en database. Alle containers/netwerken zijn nieuw aangemaakte testresources en worden na afloop opgeruimd. Er worden geen productievolumes gebruikt.
