# Integratietests

Gebruik uitsluitend een nieuwe, aparte database met naam travelwise_test_*. Zet DATABASE_URL en TRAVELWISE_INTEGRATION=1, voer npm run db:migrate uit en daarna npm run test:integration. De test maakt eigen accounts en trips aan, verwijdert uitsluitend de eigen testtrip en wist geen database. Administratorinitialisatie vereist een lege testdatabase.
