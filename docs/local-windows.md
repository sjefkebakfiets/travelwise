# Lokaal op Windows, zonder Docker

De webapp en backend draaien met Node.js 24 en losse PostgreSQL 17-bestanden. Er wordt geen Windows-service geïnstalleerd. Docker Desktop is niet nodig.

## Starten

Open PowerShell in V:\Vibecoding\Travelwise en voer uit:

    node scripts/local-development.mjs

Open daarna http://127.0.0.1:3006. Het script initialiseert een afzonderlijke lokale database, past migraties toe en start Next.js alleen op localhost. Ctrl+C stopt de webserver en de database die het script zelf heeft gestart. Lokale gegevens blijven bewaard.

De database gebruikt poort 54327. Gegevens staan in .local/development/postgres; het willekeurige databasewachtwoord staat in .local/development/database.json. Deze map is uitgesloten van Git en Docker. Dit is uitsluitend voor lokale ontwikkeling; TrueNAS gebruikt de afzonderlijke Docker-configuratie.

## Vereisten

Node.js 24 is aanwezig. Dependencies zijn geïnstalleerd in node_modules. Bij herinstallatie: node .tools/package/bin/npm-cli.js ci. PostgreSQL-binaries staan in .tools/pgsql. Op een nieuwe machine: download de officiële Windows ZIP van https://www.enterprisedb.com/download-postgresql-binaries en pak pgsql/bin, pgsql/lib en pgsql/share onder .tools uit. Deze hulpmiddelen staan niet in Git.

## Testen zonder Docker

    node scripts/test-local-database.mjs

Dit gebruikt een afzonderlijke cluster op localhost:54328 en maakt voor iedere run een nieuwe travelwise_test_*-database. Productie- en ontwikkelgegevens worden niet gewist. De testserver wordt na de run gestopt; testgegevens blijven onder .local/test staan.

## Administrator

De website heeft nog geen inlogscherm. De mobiele backend is geïmplementeerd. Voor een echt lokaal account: stel DATABASE_URL op basis van de lokale databaseconfiguratie en ADMIN_EMAIL / ADMIN_PASSWORD als tijdelijke procesvariabelen in en voer node apps/web/scripts/init-admin.ts uit. Kies zelf het wachtwoord; de initializer maakt geen standaardaccount. Zie docs/backend.md.

## Status

Android-tracking, Room, synchronisatie en web-login moeten nog worden aangesloten. Voor een Android-APK blijven Android Studio, Java en de Android SDK vereist.

## Starten via PowerShell

Vanuit de projectmap kan ook .\Start-Travelwise.ps1 worden uitgevoerd. Dit script vindt Node.js via PATH of de aanwezige Codex-runtime. Het wijzigt geen systeeminstellingen.

De gebouwde HTTP-API kan zonder Docker worden getest met node scripts/smoke-local-http.mjs, nadat de productiebuild is gemaakt. Dit gebruikt een nieuwe testdatabase en localhost:3106.

## Je eigen lokale account aanmaken

Laat Start-Travelwise.ps1 draaien. Open een tweede PowerShell in de projectmap en voer .\Initialize-TravelwiseAdmin.ps1 uit. Je kiest zelf je e-mailadres en wachtwoord; het wachtwoord wordt verborgen ingevoerd en niet in een bestand bewaard. De initializer werkt uitsluitend met de lokale ontwikkelconfiguratie en weigert een tweede eerste account. Het web-inlogscherm moet nog worden gebouwd.
