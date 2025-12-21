# 🚀 Guide de Déploiement Rapide

## ⚠️ Prérequis

1. **Node.js 18+** installé
2. **ASK CLI** installé et configuré : `npm install -g ask-cli`
3. **AWS CLI** configuré avec vos credentials
4. **Compte développeur Amazon Alexa**

## 📋 Étapes de Déploiement

### 1️⃣ Installer les Dépendances

```bash
cd lambda
npm install
cd ..
```

### 2️⃣ Configurer ASK CLI (Si pas déjà fait)

```bash
ask configure
```

Suivez les instructions pour lier votre compte Amazon Developer.

### 3️⃣ Déployer la Skill

```bash
ask deploy
```

Cette commande va :
- ✅ Créer la skill sur Amazon Developer Console
- ✅ Déployer la fonction Lambda sur AWS
- ✅ Créer la table DynamoDB
- ✅ Configurer tous les rôles IAM
- ✅ Lier la Lambda à la skill

### 4️⃣ Activer les Permissions (Important!)

Après le déploiement, allez sur [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) :

1. Sélectionnez votre skill **"أوقات الصلاة"**
2. Allez dans **Build > Permissions**
3. Activez :
   - ✅ **Device Address** (Country & Postal Code)
   - ✅ **Reminders**
   - ✅ **Geolocation**

### 5️⃣ Tester la Skill

**Option A : Dans le Simulateur**
```bash
ask dialog --locale ar-SA
```

Puis tapez :
```
افتحي أوقات الصلاة
```

**Option B : Sur un appareil réel**

1. Ouvrez l'app Alexa sur votre téléphone
2. Allez dans **Skills & Games > Your Skills > Dev**
3. Activez **"أوقات الصلاة"**
4. Dites : "Alexa, افتحي أوقات الصلاة"

---

## 🔧 Configuration Optionnelle

### Héberger les Fichiers Audio d'Athan

Les fichiers audio ne sont pas inclus dans le repository. Vous devez :

1. **Télécharger des fichiers MP3 d'athan** (libres de droits)
2. **Les héberger sur S3** :

```bash
# Créer un bucket
aws s3 mb s3://your-prayer-times-audio --region us-east-1

# Uploader les fichiers
aws s3 cp athan-makkah.mp3 s3://your-prayer-times-audio/audio/
aws s3 cp athan-madinah.mp3 s3://your-prayer-times-audio/audio/
# ... autres athans

# Rendre publics
aws s3api put-bucket-policy --bucket your-prayer-times-audio --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicRead",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-prayer-times-audio/audio/*"
  }]
}'
```

3. **Mettre à jour les URLs** dans `lambda/notificationService.js` :

```javascript
const ATHAN_AUDIO_URLS = {
    'مكة': {
        url: 'https://your-prayer-times-audio.s3.amazonaws.com/audio/athan-makkah.mp3',
        // ...
    },
    // ...
};
```

4. **Redéployer** :
```bash
ask deploy --target lambda
```

---

## 🐛 Résolution des Problèmes

### Erreur : "The trigger setting for the Lambda is invalid"

**Solution** : Le fichier `skill.json` a été corrigé pour utiliser `sourceDir` au lieu de `uri`. Essayez à nouveau :
```bash
ask deploy
```

### Erreur : "Missing required property: uri"

**Solution** : Assurez-vous que `skill-package/skill.json` utilise :
```json
"endpoint": {
  "sourceDir": "lambda"
}
```

### La skill se déploie mais ne répond pas

**Vérifiez** :
1. Les permissions sont activées (voir étape 4)
2. Les logs CloudWatch : `aws logs tail /aws/lambda/ask-PrayerTimesSkill-default-AlexaSkillFunction --follow`

### Erreur de dépendances npm

```bash
cd lambda
rm -rf node_modules package-lock.json
npm install
cd ..
ask deploy
```

---

## 📊 Vérifier le Déploiement

### Voir la Skill sur AWS

**Lambda Function** :
```bash
aws lambda list-functions | grep PrayerTimes
```

**Table DynamoDB** :
```bash
aws dynamodb list-tables | grep PrayerTimes
```

**Stack CloudFormation** :
```bash
aws cloudformation describe-stacks --stack-name ask-PrayerTimesSkill-default
```

---

## 🔄 Mettre à Jour la Skill

Après des modifications du code :

**Mettre à jour uniquement la Lambda** :
```bash
ask deploy --target lambda
```

**Mettre à jour uniquement le modèle d'interaction** :
```bash
ask deploy --target skill-metadata
```

**Mettre à jour tout** :
```bash
ask deploy
```

---

## 📝 Structure après Déploiement

```
AWS Resources créées:
├── Lambda Function
│   └── ask-PrayerTimesSkill-default-AlexaSkillFunction
├── DynamoDB Table
│   └── PrayerTimesUserData
├── IAM Roles
│   ├── PrayerTimesAlexaSkillRole
│   └── CloudFormation-ExecutionRole
└── CloudFormation Stack
    └── ask-PrayerTimesSkill-default
```

---

## ✅ Checklist Post-Déploiement

- [ ] La skill est créée sur Developer Console
- [ ] Lambda déployée sur AWS
- [ ] Table DynamoDB créée
- [ ] Permissions activées (Device Address, Reminders, Geolocation)
- [ ] Test dans le simulateur réussi
- [ ] Test sur appareil réel réussi
- [ ] (Optionnel) Fichiers audio hébergés sur S3

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** :
   ```bash
   ask dialog --locale ar-SA --debug
   ```

2. **Consultez CloudWatch** :
   ```bash
   aws logs tail /aws/lambda/ask-PrayerTimesSkill-default-AlexaSkillFunction --follow
   ```

3. **Ouvrez une issue** sur GitHub

---

## 🎯 Commandes Rapides

```bash
# Déployer
ask deploy

# Tester
ask dialog --locale ar-SA

# Voir les logs
aws logs tail /aws/lambda/ask-PrayerTimesSkill-default-AlexaSkillFunction --follow

# Mettre à jour seulement Lambda
ask deploy --target lambda

# Supprimer la skill (ATTENTION!)
ask smapi delete-skill -s <SKILL_ID>
```

---

**Bon déploiement ! جزاك الله خيراً** 🚀
