# Installatie met kant-en-klare images

Deze Compose gebruikt GHCR-images in plaats van een lokale broncodebuild. De images moeten eerst met de handmatige workflow Publish Docker images worden gepubliceerd, met publish=true en tag=0.2.0. Er is geen automatische image-publicatie op push.

Bestanden: kopieer compose.images.yaml als compose.yaml naar je Dockge-stackmap en zet de privé .env ernaast. source is dan niet nodig.

Imageverwijzingen:

- ghcr.io/sjefkebakfiets/travelwise:0.2.0
- ghcr.io/sjefkebakfiets/travelwise-migrations:0.2.0

Nieuwe GHCR-packages zijn standaard privé. Voor ophalen moet de Docker-CLI waarmee Dockge werkt, zijn aangemeld bij ghcr.io. Gebruik een GitHub personal access token (classic) met read:packages via docker login ghcr.io -u sjefkebakfiets. Voer de token uitsluitend in bij de wachtwoordprompt; zet de token niet in Compose, .env of Git. Een login in een ander gebruikersprofiel of een andere container kan buiten Dockge vallen.

Na publicatie en registry-aanmelding: docker compose pull en docker compose up -d. De database blijft op de bestaande persistente paden en de hostpoort is 3006. Houd het bestaande databasewachtwoord als al een PostgreSQL-datamap bestaat.

Het publiceren van images of het wijzigen van packagezichtbaarheid is een aparte actie. Deze bestanden voeren op zichzelf geen publicatie of TrueNAS-deployment uit.

GitHub-documentatie: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
