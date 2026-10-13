# Architectuur

Next.js beheert web en REST API. Android spreekt OpenAPI-contracten; Kotlin importeert geen TypeScript. PostgreSQL 17 bewaart gebruikers, trips en originele GPS-punten. Foto's gaan later naar een beschermd uploadvolume.

## Beveiligingsontwerp

Auth.js voor websessies; mobiele access tokens met korte levensduur, gehashte refresh tokens, rotation families en apparaatintrekking. Publieke registratie uitgeschakeld. Eigenaar en apparaat worden uit de serveridentiteit afgeleid. Iedere tripquery controleert ownership. GPS-batches worden transactioneel verwerkt; conflicterende hergebruikte punt-ID's zijn fouten. Deze beveiliging is nog niet geïmplementeerd; er bestaat geen onbeveiligde schrijf-API.

## GPS

Android foreground service verzamelt zichtbare tracking, Room bewaart punten vóór verzending, WorkManager verzorgt retries met exponential backoff. Alleen bevestigde punten worden als gesynchroniseerd gemarkeerd. Pauze/resume krijgt een nieuw segment-ID. Routefilters wijzigen nooit de originele records. User-ID is via trip en device afleidbaar; backend moet overeenkomende eigenaren afdwingen.

## Databaseschema

Prisma bevat de 13 vereiste modellen. Dit is een eerste ontwerp, zonder uitgevoerde migratie. Vervolg: database-checkconstraints voor coördinaten en accuracy, relationele eigenaarcontrole, migratie en integratietests. GPS-verwijdering is restrictief totdat een expliciete transactionele tripverwijdering bestaat.

## Bronnen

Prisma 7 generator: https://www.prisma.io/docs/orm/v7/prisma-schema/overview/generators
Android foreground services: https://developer.android.com/develop/background-work/services/fgs/service-types#location
