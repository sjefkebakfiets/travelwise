# TrueNAS / Dockge — GitHub-images

Plaats compose.yaml en de privé .env naast elkaar in de Dockge-stackmap travelwise. Er is geen source-map of lokale build nodig. Compose haalt de app en migratiecontainer automatisch op uit GitHub Container Registry wanneer de stack wordt gestart.

Images:

- ghcr.io/sjefkebakfiets/travelwise:latest
- ghcr.io/sjefkebakfiets/travelwise-migrations:latest

De tag is instelbaar met TRAVELWISE_IMAGE_TAG in .env. pull_policy: always haalt de geconfigureerde tag op bij starten; dit is geen achtergrond-updater. De migratie wordt vóór de app uitgevoerd. PostgreSQL en uploads blijven op de opgegeven TrueNAS-paden. Hostpoort: 3006.

## Eenmalige registry-aanmelding

De images zijn privé. Meld de Docker-CLI die Dockge gebruikt eenmaal aan:

    docker login ghcr.io -u sjefkebakfiets

Gebruik als wachtwoord een GitHub personal access token (classic) met read:packages en toegang tot de package. Voer deze uitsluitend in bij de wachtwoordprompt. Zet de token niet in Compose, .env of Git. De aanmelding moet in het gebruikersprofiel / de container van Dockge plaatsvinden; een login in een ander profiel wordt niet vanzelf gedeeld.

## Installeren

    docker compose pull
    docker compose up -d

In Dockge kun je na de registry-aanmelding de stack starten. Het adres is http://192.168.178.252:3006. Er wordt niets automatisch vanuit Codex naar TrueNAS gedeployd.

Gebruik bij een bestaande PostgreSQL-datamap het bestaande databasewachtwoord. De gegenereerde .env is alleen lokaal aanwezig en is uitgesloten van Git.

## Eerste account

Stel tijdelijk ADMIN_EMAIL en ADMIN_PASSWORD in de serverterminal in en voer uit:

    docker compose run --rm -e ADMIN_EMAIL -e ADMIN_PASSWORD travelwise-migrate node apps/web/scripts/init-admin.ts

Verwijder daarna de wachtwoordvariabele. De initializer weigert als een account bestaat. Web-login en Android-tracking zijn nog niet aangesloten.

## Updates en lokale build

Maak vóór updates/migraties een back-up. Het oorspronkelijke broncode-buildbestand is bewaard als compose.build.yaml. Dat alternatief vereist wel een checkout in source. Kant-en-klare images worden uitsluitend gepubliceerd via de handmatig goedgekeurde workflow Publish Docker images.

## Versiekeuze

Travelwise-app en migratiecontainer gebruiken standaard latest en worden dankzij pull_policy: always bij het starten van de stack opgehaald. PostgreSQL blijft postgres:17-alpine en heeft geen always-pullbeleid. Zet TRAVELWISE_IMAGE_TAG=latest in .env als daar nog een andere tag staat. Dit start geen achtergrond-updater en verandert de PostgreSQL-hoofdversie niet.
