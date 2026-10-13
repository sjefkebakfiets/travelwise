# Installatie en verificatie

## Windows

Gebruik uitsluitend V:\Vibecoding\Travelwise als projectroot. Node.js 24 is beschikbaar. npm is lokaal onder .tools/package/bin/npm-cli.js geplaatst indien de download slaagt: node .tools/package/bin/npm-cli.js install. Dit hulpmiddel wordt niet gecommit.

## Android

Installeer Android Studio, JDK 17, Android SDK 36 en Gradle 8.13. Open apps/android. Genereer de wrapper met gradle wrapper --gradle-version 8.13. Daarna .\gradlew.bat assembleDebug of assembleRelease. Release moet later met eigen signingconfig worden ondertekend; sla keys buiten Git op. Er is nog geen APK gebouwd.

## Docker / Dockge

Docker-engine moet actief zijn. Compose ligt in infrastructure/docker/compose.yaml. Kopieer .env.example naar .env, vul sterke POSTGRES_PASSWORD en AUTH_SECRET in. Gebruik een URL-veilig databasewachtwoord in deze eerste Compose-configuratie. Configcontrole: docker compose --env-file .env -f infrastructure/docker/compose.yaml config. De app gebruikt hostpoort 3006. PostgreSQL heeft geen hostpoort. Upload- en databasemappen gebruiken de opgegeven TrueNAS-paden. Geen deployment uitvoeren voordat database-migraties, authenticatie en integratietests gereed zijn. Healthcheck controleert uitsluitend het webproces. Dockerbuild gebruikt npm ci met de gegenereerde lockfile.

## Testplan voor Fase 1

Automatisch: contractvalidatie, ownership, tokens, idempotente GPS-inname, Room-persistence, netwerkherstel en retries. Op een fysiek toestel: scherm vergrendeld, vliegtuigmodus, internetherstel, GPS uit/aan, urenlange tracking, batterijbesparing, app-herstart en telefoonherstart. HyperOS: controleer precieze locatie, notificaties, batterijrestricties en beschikbare autostartopties. Geen garantie na force-stop of uitschakelen. Deze fysieke tests zijn niet uitgevoerd.

## Latere productie-inrichting

Configureer Android API-base-URL via buildconfig en vereis HTTPS in release. Buiten huis: Tailscale of HTTPS reverse proxy. Back-up database met pg_dump en uploadvolume samen; test herstel in een afzonderlijke database vóór updates. Volumes zijn geen back-up.

## NAS-installatie

De share weigert symlinks. Daarom staan de webdependencies in de rootpackage zonder npm-workspaces en is bin-links=false ingesteld. Rootscripts roepen CLI-bestanden rechtstreeks via Node aan. De monorepo-mapstructuur blijft behouden.
