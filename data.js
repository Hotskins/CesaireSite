const companies = [
            {
                id: 1,
                name: "LilleTech Solutions",
                sector: "IT",
                metro: "Gare Lille Flandres",
                address: "12 Rue de Paris, 59000 Lille",
                description: "Petite entreprise IT spécialisée en développement web et applications mobiles.",
                duration: "1-2 semaines",
                email: "contact@lilletech.fr",
                phone: "03 20 12 34 56",
                tasks: [
                    "Découverte des métiers du numérique",
                    "Assistance à l'équipe de développement",
                    "Participation aux réunions de projet",
                    "Observation du processus de création d'applications"
                ],
                requirements: [
                    "Curiosité pour les nouvelles technologies",
                    "Aucune compétence technique requise",
                    "Motivation et sérieux"
                ],
                schedule: "Lundi à vendredi, 9h-17h"
            },
            {
                id: 2,
                name: "Pharmacie du Centre",
                sector: "Médecine",
                metro: "République – Beaux-Arts",
                address: "5 Place de la République, 59000 Lille",
                description: "Pharmacie moderne au cœur de Lille, accueillant des stagiaires pour découvrir le métier.",
                duration: "1 semaine",
                email: "pharmacie.centre@exemple.fr",
                phone: "03 20 55 66 77",
                tasks: [
                    "Observation du travail quotidien du pharmacien",
                    "Aide à l'organisation des stocks",
                    "Accueil des clients (sous supervision)",
                    "Découverte de la gestion d'une officine"
                ],
                requirements: [
                    "Intérêt pour le secteur de la santé",
                    "Discrétion et respect de la confidentialité",
                    "Bonne présentation"
                ],
                schedule: "Lundi à samedi, 9h-13h"
            },
            {
                id: 3,
                name: "AutoService Lille",
                sector: "Automobile",
                metro: "Porte des Postes",
                address: "40 Rue d'Arras, 59000 Lille",
                description: "Garage automobile avec une équipe de mécaniciens expérimentés.",
                duration: "1-2 semaines",
                email: "autoservice.lille@exemple.fr",
                phone: "03 20 88 99 00",
                tasks: [
                    "Observation des réparations mécaniques",
                    "Aide au diagnostic véhicule",
                    "Découverte des outils professionnels",
                    "Participation aux tests de routine"
                ],
                requirements: [
                    "Intérêt pour la mécanique",
                    "Tenue appropriée fournie",
                    "Respect des consignes de sécurité"
                ],
                schedule: "Lundi à vendredi, 8h30-17h"
            },
            {
                id: 4,
                name: "Bureau d'Architecture Moderne",
                sector: "Architecture",
                metro: "Rihour",
                address: "18 Rue Nationale, 59000 Lille",
                description: "Cabinet d'architecture spécialisé en rénovation de bâtiments historiques.",
                duration: "2 semaines",
                email: "contact@archi-moderne.fr",
                phone: "03 20 11 22 33",
                tasks: [
                    "Découverte du processus de conception",
                    "Participation aux visites de chantier",
                    "Aide à la préparation de maquettes",
                    "Utilisation des logiciels de dessin (initiation)"
                ],
                requirements: [
                    "Intérêt pour l'architecture et le design",
                    "Créativité et sens de l'observation",
                    "Travail en équipe"
                ],
                schedule: "Lundi à vendredi, 9h-18h"
            },
            {
                id: 5,
                name: "La Boutique du Vieux-Lille",
                sector: "Commerce",
                metro: "Rihour",
                address: "25 Rue de la Monnaie, 59000 Lille",
                description: "Boutique de décoration et d'artisanat local dans le Vieux-Lille.",
                duration: "1-2 semaines",
                email: "boutique.vieuxlille@exemple.fr",
                phone: "03 20 44 55 66",
                tasks: [
                    "Accueil et conseil client",
                    "Gestion de l'encaissement",
                    "Mise en rayon et merchandising",
                    "Découverte de la gestion de stock"
                ],
                requirements: [
                    "Bon relationnel",
                    "Présentation soignée",
                    "Ponctualité et fiabilité"
                ],
                schedule: "Mardi à samedi, 10h-19h"
            },
            {
                id: 6,
                name: "Cabinet Juridique Delcourt",
                sector: "Administration",
                metro: "République – Beaux-Arts",
                address: "30 Boulevard de la Liberté, 59000 Lille",
                description: "Cabinet d'avocats spécialisé en droit des affaires et droit du travail.",
                duration: "1 semaine",
                email: "cabinet.delcourt@exemple.fr",
                phone: "03 20 77 88 99",
                tasks: [
                    "Découverte du métier d'avocat",
                    "Aide à la recherche documentaire",
                    "Observation d'audiences (si possible)",
                    "Classement et archivage de dossiers"
                ],
                requirements: [
                    "Intérêt pour le droit",
                    "Discrétion absolue",
                    "Capacité de concentration"
                ],
                schedule: "Lundi à vendredi, 9h-17h"
            },
            {
                id: 7,
                name: "Restaurant Le Comptoir",
                sector: "Restauration",
                metro: "Gambetta",
                address: "8 Avenue du Peuple Belge, 59000 Lille",
                description: "Restaurant traditionnel français avec une cuisine maison.",
                duration: "1 semaine",
                email: "lecomptoir.lille@exemple.fr",
                phone: "03 20 33 44 55",
                tasks: [
                    "Découverte du métier de cuisinier",
                    "Aide à la préparation des ingrédients",
                    "Observation du service en salle",
                    "Apprentissage des règles d'hygiène"
                ],
                requirements: [
                    "Motivation et dynamisme",
                    "Respect des normes d'hygiène",
                    "Capacité à travailler debout"
                ],
                schedule: "Du mardi au samedi, 10h-15h ou 18h-22h"
            },
            {
                id: 8,
                name: "Graphik Design Studio",
                sector: "IT",
                metro: "Wazemmes",
                address: "15 Rue des Sarrazins, 59000 Lille",
                description: "Studio de design graphique et communication visuelle.",
                duration: "2 semaines",
                email: "hello@graphikdesign.fr",
                phone: "03 20 66 77 88",
                tasks: [
                    "Découverte des métiers du design",
                    "Initiation aux logiciels créatifs",
                    "Participation aux brainstormings",
                    "Création de moodboards"
                ],
                requirements: [
                    "Sensibilité artistique",
                    "Curiosité créative",
                    "Maîtrise basique de l'ordinateur"
                ],
                schedule: "Lundi à vendredi, 9h30-17h30"
            },
            {
                id: 9,
                name: "Laboratoire BioPharma",
                sector: "Médecine",
                metro: "Mairie de Lille",
                address: "50 Rue du Molinel, 59000 Lille",
                description: "Laboratoire d'analyses médicales moderne.",
                duration: "1-2 semaines",
                email: "contact@biopharma-lille.fr",
                phone: "03 20 99 00 11",
                tasks: [
                    "Observation des analyses en laboratoire",
                    "Découverte du matériel médical",
                    "Accueil des patients",
                    "Initiation aux procédures d'hygiène"
                ],
                requirements: [
                    "Intérêt pour les sciences",
                    "Rigueur et précision",
                    "Respect des protocoles"
                ],
                schedule: "Lundi à vendredi, 8h-16h"
            },
            {
                id: 10,
                name: "Mairie de Lille - Service Jeunesse",
                sector: "Administration",
                metro: "Mairie de Lille",
                address: "Place Augustin Laurent, 59000 Lille",
                description: "Service municipal dédié aux activités et projets pour la jeunesse.",
                duration: "2 semaines",
                email: "jeunesse@mairie-lille.fr",
                phone: "03 20 49 50 00",
                tasks: [
                    "Découverte du fonctionnement municipal",
                    "Aide à l'organisation d'événements",
                    "Accueil du public",
                    "Participation aux projets jeunesse"
                ],
                requirements: [
                    "Intérêt pour le service public",
                    "Bon contact avec le public",
                    "Esprit d'équipe"
                ],
                schedule: "Lundi à vendredi, 9h-17h"
            },
            {
                id: 11,
                name: "Librairie Pages & Compagnie",
                sector: "Commerce",
                metro: "Gambetta",
                address: "22 Rue Solférino, 59000 Lille",
                description: "Librairie indépendante avec un large choix de livres et BD.",
                duration: "1-2 semaines",
                email: "pages.compagnie@exemple.fr",
                phone: "03 20 22 33 44",
                tasks: [
                    "Accueil et conseil aux clients",
                    "Gestion des stocks de livres",
                    "Mise en place des nouveautés",
                    "Participation aux animations littéraires"
                ],
                requirements: [
                    "Passion pour la lecture",
                    "Bon sens du service",
                    "Organisation et méthode"
                ],
                schedule: "Mardi à samedi, 10h-19h"
            },
            {
                id: 12,
                name: "Atelier Vélo Solidaire",
                sector: "Automobile",
                metro: "Wazemmes",
                address: "35 Rue de Wazemmes, 59000 Lille",
                description: "Atelier associatif de réparation et d'entretien de vélos.",
                duration: "1 semaine",
                email: "contact@velo-solidaire.fr",
                phone: "03 20 55 66 77",
                tasks: [
                    "Apprentissage de la mécanique vélo",
                    "Réparations simples (crevaisons, freins)",
                    "Accueil des bénéficiaires",
                    "Sensibilisation à l'éco-mobilité"
                ],
                requirements: [
                    "Intérêt pour le vélo",
                    "Esprit associatif",
                    "Envie d'apprendre"
                ],
                schedule: "Mercredi et samedi, 14h-18h"
            }
        ];

const sectorOptions = ["IT","Médecine","Automobile","Commerce","Administration","Restauration","Architecture"];
const metroOptions = ["Gare Lille Flandres","République – Beaux-Arts","Porte des Postes","Rihour","Gambetta","Mairie de Lille","Wazemmes"];
