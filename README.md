# AUTHORS

thibaut.bonefont  
lucile.pelou  
marie.caze


# Note

Le socle de la séance 2 est conservé. Voici la liste des problèmes et corrections faites sur ce TP.

| Problème | Impact utilisateur | Vérification | Fix associé |
|----------|--------------------|--------------|-------------|
| Les champs "Nom" et "Adresse électronique" avaient un `<p>` à la place d'un `<label>` | Le lecteur d'écran lit un champ sans nom, cliquer sur le texte ne place pas le focus dans le champ | DevTools > Accessibility : Name = "Adresse électronique (obligatoire)", rôle `textbox`. Cliquer sur le libellé donne le focus au champ | Chaque champ doit avoir un libellé visible relié au champ, qui ne dépend pas d'un placeholder |
| Les choix "Standard" / "Étudiant" n'étaient pas groupés et n'avaient pas de nom de groupe | Le lecteur d'écran lit "Standard, bouton radio" sans dire de quoi il s'agit | Accessibility : le groupe s'appelle "Type de place (obligatoire)" et chaque radio a son nom | Un groupe de choix doit avoir un nom accessible, et chaque choix doit avoir son propre libellé |
| Les erreurs n'étaient visibles que par la bordure rouge et un message générique "Certains champs sont incorrects" | On ne sait pas quel champ corriger ni comment. Le message n'est pas annoncé | Envoyer le formulaire vide : un message précis s'affiche sous chaque champ | Une erreur doit dire quel champ corriger, ce qui ne va pas et le format attendu, près du champ concerné |
| Les messages d'aide et d'erreur n'étaient pas reliés aux champs, et rien n'indiquait l'état invalide | Le lecteur d'écran ne lit ni l'aide ni l'erreur en arrivant sur le champ | Accessibility : `aria-invalid="true"` et Description = aide + erreur | L'aide et l'erreur doivent être reliées au champ, et son état invalide doit être exposé aux technologies d'assistance |
| Après un envoi invalide, le focus restait sur le bouton, sans moyen de retrouver les erreurs | Au clavier ou au lecteur d'écran, on ne sait pas qu'il y a eu des erreurs | Envoyer vide : le focus arrive sur "3 erreurs empêchent la réservation". Chaque lien du résumé donne le focus au champ. La saisie déjà faite est conservée | Après un envoi invalide, le focus doit aller vers un résumé des erreurs qui permet de rejoindre chaque champ sans perdre la saisie |

# Tests

Lancer avec `npm test -- --run`.

Les `it.todo` de `Socle.test.tsx` ont été remplacés par des tests écrits dans `Reservation.test.tsx`, car ils portent sur le formulaire et non sur le socle de la séance 2.

| Test | Preuve | Limite |
|------|--------|--------|
| relie aide et erreur au champ invalide | Dans le DOM : le champ email référence deux ids (aide puis erreur) qui existent avec le bon texte | Ne prouve pas que le lecteur d'écran lit réellement la description |
| marque l'email invalide et donne le focus au résumé | `aria-invalid="true"` sur le champ, et le résumé "3 erreurs" a le focus après envoi vide | Ne teste qu'un premier envoi |
| conserve la saisie et rejoint le champ depuis le résumé | Un usage réel avec `user-event` : le lien du résumé donne le focus au champ email et le nom saisi est conservé | Ne teste pas le clavier seul (Tab / Entrée) |

