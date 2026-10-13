# TrueNAS / Dockge — rechtstreeks uit GitHub

Alle broncode staat in de openbare repository https://github.com/sjefkebakfiets/travelwise. Plaats compose.yaml en jouw bestaande .env naast elkaar in de Dockge-stackmap.

Deze Compose gebruikt GitHub zelf als buildcontext. Docker haalt de actuele main-branch automatisch op en bouwt de app- en migratiecontainer op TrueNAS. Er is geen source-map, GitHub-token of registry-aanmelding nodig. PostgreSQL blijft postgres:17-alpine. Reisgegevens blijven op de bestaande TrueNAS-paden en de webpoort is 3006.

## Starten

Gebruik in Dockge Deploy/Start. Of voer vanuit de stackmap uit:

    docker compose up -d --build

Alleen Pull bouwt geen images: de app en migraties kunnen bij Pull als skipped verschijnen. Dat is normaal voor deze configuratie. Bij starten worden ze vanuit GitHub gebouwd. De eerste build kan enkele minuten duren. pull_policy: build zorgt voor een build bij een volgende start, waarbij Docker bestaande buildlagen kan hergebruiken.

Gebruik voor updates dezelfde start-/buildactie. Er draait geen automatische achtergrond-updater. Maak vóór databasewijzigingen een back-up.

## Eerste account

Stel ADMIN_EMAIL en ADMIN_PASSWORD tijdelijk in en voer uit:

    docker compose run --rm -e ADMIN_EMAIL -e ADMIN_PASSWORD travelwise-migrate node apps/web/scripts/init-admin.ts

Verwijder daarna de wachtwoordvariabele. De initializer weigert als er al een account bestaat. Web-login en Android-tracking moeten nog worden aangesloten.

## Andere bestanden

compose.github.yaml is dezelfde GitHub-buildconfiguratie. compose.images.yaml bevat de eerder gepubliceerde GHCR-imagevariant; die vereist toegang tot beide containerpackages. compose.build.yaml gebruikt een lokale checkout in source.

Docker-documentatie: https://docs.docker.com/reference/compose-file/build/
