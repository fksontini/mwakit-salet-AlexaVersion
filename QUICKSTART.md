# 🚀 Guide de Démarrage Rapide

## Installation en 5 Minutes

### 1. Prérequis

Installez les outils nécessaires :

```bash
# Installer Node.js (si pas déjà installé)
# Télécharger depuis https://nodejs.org/

# Installer ASK CLI
npm install -g ask-cli

# Configurer ASK CLI avec votre compte Amazon
ask configure
```

### 2. Clone et Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/mwakit-salet-AlexaVersion.git
cd mwakit-salet-AlexaVersion

# Installer les dépendances
cd lambda
npm install
cd ..
```

### 3. Configuration

**Option A : Configuration Rapide (Recommandée)**

```bash
# Déployer directement avec ASK CLI
ask deploy
```

**Option B : Configuration Manuelle**

1. Ouvrir `skill-package/skill.json`
2. Remplacer `YOUR_ACCOUNT_ID` par votre ID AWS
3. Sauvegarder

```bash
ask deploy
```

### 4. Ajouter les Fichiers Audio d'Athan (Important!)

Les fichiers audio ne sont pas inclus. Vous devez :

1. **Télécharger les fichiers MP3 d'athan** depuis des sources libres de droits
2. **Les héberger sur Amazon S3** :

```bash
# Créer un bucket S3
aws s3 mb s3://votre-bucket-athan

# Uploader les fichiers
aws s3 cp athan-makkah.mp3 s3://votre-bucket-athan/audio/
aws s3 cp athan-madinah.mp3 s3://votre-bucket-athan/audio/
# ... etc pour tous les athans

# Rendre les fichiers publics
aws s3api put-object-acl --bucket votre-bucket-athan --key audio/athan-makkah.mp3 --acl public-read
```

3. **Mettre à jour les URLs** dans `lambda/notificationService.js` :

```javascript
const ATHAN_AUDIO_URLS = {
    'مكة': {
        name: 'أذان الحرم المكي',
        url: 'https://votre-bucket-athan.s3.amazonaws.com/audio/athan-makkah.mp3',
        duration: 180
    },
    // ... etc
};
```

### 5. Activer les Permissions

1. Aller sur https://developer.amazon.com/alexa/console/ask
2. Sélectionner votre skill "أوقات الصلاة"
3. Aller dans "Build" > "Permissions"
4. Activer :
   - ✅ Device Address (Country & Postal Code)
   - ✅ Reminders
   - ✅ Geolocation

### 6. Test

**Dans le simulateur Alexa** :

1. Aller dans "Test" tab
2. Activer le test en "Development"
3. Taper ou dire : "أليكسا افتحي أوقات الصلاة"

**Sur un appareil réel** :

1. Ouvrir l'app Alexa sur votre téléphone
2. Activer la skill en mode développement
3. Dire : "Alexa, افتحي أوقات الصلاة"

---

## 🎯 Commandes de Test Rapides

```
# Ouvrir l'app
"أليكسا، افتحي أوقات الصلاة"

# Voir les horaires
"أوقات الصلاة اليوم"

# Changer la localisation
"غير موقعي إلى الرياض"

# Changer l'athan
"غير الأذان إلى مكة"

# Activer les notifications
"فعل التنبيهات"
```

---

## ⚠️ Problèmes Courants

### ❌ Erreur : "Endpoint is not valid"

**Solution** : Vérifier que l'ARN de la Lambda est correct dans `skill.json`

### ❌ Les notifications ne fonctionnent pas

**Solution** :
1. Vérifier que les permissions "Reminders" sont activées
2. Les URLs des fichiers audio doivent être HTTPS
3. Les fichiers MP3 doivent être accessibles publiquement

### ❌ Les horaires ne s'affichent pas

**Solution** : Vérifier la connexion à l'API Aladhan dans les logs CloudWatch

### ❌ L'interface APL ne s'affiche pas

**Solution** :
- APL fonctionne uniquement sur les appareils avec écran (Echo Show)
- Tester avec le simulateur "Echo Show 10" dans la console

---

## 📚 Ressources Supplémentaires

- [Documentation Alexa Skills Kit](https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html)
- [APL Documentation](https://developer.amazon.com/docs/alexa-presentation-language/apl-overview.html)
- [Aladhan API Docs](https://aladhan.com/prayer-times-api)
- [ASK CLI Documentation](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html)

---

## 🆘 Besoin d'Aide ?

1. Consultez les logs dans AWS CloudWatch
2. Utilisez `ask dialog` pour tester en ligne de commande
3. Vérifiez le statut de la skill dans la console développeur
4. Ouvrez une issue sur GitHub

---

**Bon développement ! جزاك الله خيرا** 🌙
