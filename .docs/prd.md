# 📄 Product Requirements Document (PRD) – Module Time-Timer

## I. Informations Générales

| **Champ**             | **Valeur**               |
| --------------------------- | ------------------------------ |
| **Nom du Projet**     | TempoKids – Module Time-Timer |
| **Version du PRD**    | 1.2                            |
| **Date**              | 20 décembre 2025              |
| **Statut**            | Spécification complète       |
| **Technologie Cible** | React PWA (Vite), Tailwind CSS |

## II. Objectif du Module

Fournir une représentation visuelle claire et intuitive du temps restant dans une session, basée sur des ronds d'horloge analogiques représentant chacun une heure.

## III. Exigences Fonctionnelles (EF)

| **ID**       | **Exigence Fonctionnelle**        | **Priorité** | **Description Détaillée**                                                                                                                                   |
| ------------------ | --------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **EF-TT.01** | **Unité de Base**                | Élevée            | Un seul indicateur visuel (le rond d'horloge) représente toujours**exactement 1 heure (60 minutes)**.                                                        |
| **EF-TT.02** | **Saisie de la Durée**           | Élevée            | L'utilisateur doit pouvoir paramétrer le temps total de la séance (en heures et minutes).                                                                         |
| **EF-TT.03** | **Représentation Multiple**      | Élevée            | Le nombre de ronds affichés correspond à la durée totale,**arrondie à l'heure supérieure**. Exemple : 2h30 → 3 ronds (2 pleins, 1 à 50%).              |
| **EF-TT.04** | **Défilement Visuel**            | Élevée            | Le remplissage coloré part de 12h dans le sens horaire et se retire dans le sens horaire. Exemple : 45 min = rempli de 12h à 9h, se vide progressivement vers 9h. |
| **EF-TT.05** | **Ordre de Consommation**         | Élevée            | Les ronds pleins se vident en premier, le rond partiel se vide en dernier.                                                                                          |
| **EF-TT.06** | **Gestion des Heures Complètes** | Élevée            | Lorsqu'un rond atteint 0 minute, il devient visuellement**vide (sans couleur)** mais reste affiché à l'écran.                                              |
| **EF-TT.07** | **Affichage Analogique**          | Moyenne             | La représentation doit toujours être celle d'un "rond d'horloge" pour la clarté.                                                                                 |
| **EF-TT.08** | **Contrôles**                    | Élevée            | L'utilisateur doit pouvoir**lancer**, **mettre en pause** et **réinitialiser** le défilement du temps.                                          |
| **EF-TT.09** | **Couleur du Remplissage**        | Élevée            | Le remplissage utilise le**rouge classique** (style Time-Timer original) pour une reconnaissance immédiate.                                                  |
| **EF-TT.10** | **Indicateur de Pause**           | Moyenne             | En pause, afficher une**icône pause** et une **pulsation douce** (opacité oscillante) sur le remplissage pour signaler l'état.                       |

## IV. Spécifications Utilisateur (*User Stories*)

| **ID**      | **En tant que...** | **Je veux...**                                        | **Afin de...**                                                              |
| ----------------- | ------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **US-TT.1** | Parent/Éducateur        | Définir une séance d'une durée précise (ex: 1h 45m)     | Que l'enfant sache exactement combien de temps l'activité va durer.              |
| **US-TT.2** | Enfant/Utilisateur       | Voir la couleur se retirer progressivement du rond en cours | Savoir combien de temps il me reste dans l'heure actuelle.                        |
| **US-TT.3** | Parent/Éducateur        | Voir un rond devenir vide mais rester affiché              | Marquer clairement les heures terminées pour garder une trace de la progression. |
| **US-TT.4** | Parent/Éducateur        | Mettre en pause et reprendre le timer                       | Gérer les interruptions sans perdre le temps écoulé.                           |
| **US-TT.5** | Enfant/Utilisateur       | Voir clairement quand le timer est en pause                 | Ne pas confondre pause et fin de session.                                         |

## V. Exemple de Fonctionnement : Séance de 2h30

| Étape                | Rond 1            | Rond 2            | Rond 3 (partiel)        |
| --------------------- | ----------------- | ----------------- | ----------------------- |
| **Départ**     | 🔴 Plein (60 min) | 🔴 Plein (60 min) | 🟡 30 min (12h → 6h)   |
| **Après 1h**   | ⚪ Vide           | 🔴 Plein (60 min) | 🟡 30 min               |
| **Après 2h**   | ⚪ Vide           | ⚪ Vide           | 🟡 30 min               |
| **Après 2h30** | ⚪ Vide           | ⚪ Vide           | ⚪ Vide →**Fin** |

## VI. Exigences Non Fonctionnelles

| **ID**     | **Exigence**       | **Priorité** | **Description**                                       |
| ---------------- | ------------------------ | ------------------- | ----------------------------------------------------------- |
| **ENF.01** | **Performance**    | Élevée            | Mise à jour fluide au moins à la seconde, sans décalage. |
| **ENF.02** | **Design Épuré** | Élevée            | Fond uni, pas d'illustrations superflues, clarté maximale. |
| **ENF.03** | **PWA**            | Élevée            | Fonctionne hors ligne, installable sur mobile.              |

## VII. Spécifications Techniques

| **Aspect**            | **Spécification**                              |
| --------------------------- | ----------------------------------------------------- |
| **Framework**         | React 18+                                             |
| **Build Tool**        | Vite                                                  |
| **Styling**           | Tailwind CSS                                          |
| **Animation Timer**   | CSS ou requestAnimationFrame pour fluidité           |
| **PWA**               | vite-plugin-pwa (service worker, manifest)            |
| **Persistance**       | localStorage (état du timer optionnel)               |
| **Rendu des Cercles** | SVG (arcs avec stroke-dasharray/dashoffset) ou Canvas |

## VIII. Hors Périmètre (v1)

- Synchronisation cloud / multi-appareils
- Notifications push
- Historique des sessions
- Mode sombre
