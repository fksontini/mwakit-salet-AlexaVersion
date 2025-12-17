# 📦 Guide de Déploiement Complet

## Déploiement en Production

### Étape 1 : Préparation

#### 1.1 Vérifier les Prérequis

```bash
# Vérifier Node.js
node --version  # Doit être >= 18.x

# Vérifier ASK CLI
ask --version

# Vérifier AWS CLI
aws --version

# Vérifier la configuration AWS
aws sts get-caller-identity
```

#### 1.2 Configuration des Variables d'Environnement

Créer un fichier `.env` dans le dossier `lambda/` :

```bash
# API Configuration
PRAYER_API_BASE=http://api.aladhan.com/v1
PRAYER_API_TIMEOUT=5000

# AWS Configuration
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=PrayerTimesUserData

# S3 Bucket for Audio Files
ATHAN_AUDIO_BUCKET=your-athan-audio-bucket

# Logging Level
LOG_LEVEL=info
```

### Étape 2 : Préparer les Fichiers Audio

#### 2.1 Sources Recommandées pour les Athans

Vous pouvez obtenir des fichiers audio d'athan de :
- Sites islamiques avec licences libres
- Enregistrements personnels
- Bibliothèques audio libres de droits

#### 2.2 Format des Fichiers

**Spécifications requises** :
- Format : MP3
- Bitrate : 128-192 kbps
- Sampling : 44.1 kHz
- Mono ou Stéréo
- Durée : 2-4 minutes

#### 2.3 Upload vers S3

```bash
# Créer le bucket
aws s3 mb s3://prayer-times-athan-audio --region us-east-1

# Copier les fichiers
aws s3 cp ./audio/ s3://prayer-times-athan-audio/audio/ --recursive

# Définir les permissions publiques
aws s3api put-bucket-policy --bucket prayer-times-athan-audio --policy file://s3-bucket-policy.json
```

Créer `s3-bucket-policy.json` :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::prayer-times-athan-audio/audio/*"
    }
  ]
}
```

### Étape 3 : Configuration AWS

#### 3.1 Créer la Table DynamoDB

```bash
aws dynamodb create-table \
    --table-name PrayerTimesUserData \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

#### 3.2 Créer le Rôle IAM pour Lambda

Créer `lambda-execution-role.json` :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/PrayerTimesUserData"
    }
  ]
}
```

Créer le rôle :

```bash
aws iam create-role \
    --role-name PrayerTimesLambdaRole \
    --assume-role-policy-document file://trust-policy.json

aws iam put-role-policy \
    --role-name PrayerTimesLambdaRole \
    --policy-name PrayerTimesLambdaPolicy \
    --policy-document file://lambda-execution-role.json
```

### Étape 4 : Déploiement de la Skill

#### 4.1 Mettre à jour la Configuration

Éditer `skill-package/skill.json` :

```json
{
  "manifest": {
    "apis": {
      "custom": {
        "endpoint": {
          "uri": "arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:PrayerTimesSkill"
        }
      }
    }
  }
}
```

Remplacer `YOUR_ACCOUNT_ID` par votre ID AWS.

#### 4.2 Build et Test Local

```bash
# Installer les dépendances
cd lambda
npm install --production
npm run test  # Si vous avez des tests

# Créer le package de déploiement
cd ..
zip -r lambda-deployment.zip lambda/ -x "*.git*" "node_modules/.bin/*"
```

#### 4.3 Déployer avec ASK CLI

```bash
# Déployer tout (skill manifest + lambda)
ask deploy

# OU déployer séparément

# 1. Déployer le modèle d'interaction
ask deploy --target skill-metadata

# 2. Déployer la Lambda
ask deploy --target lambda

# 3. Déployer le modèle d'interaction
ask deploy --target model
```

#### 4.4 Vérifier le Déploiement

```bash
# Obtenir l'ID de la skill
ask api list-skills

# Obtenir le statut
ask api get-skill-status -s YOUR_SKILL_ID

# Tester la Lambda directement
aws lambda invoke \
    --function-name PrayerTimesSkill \
    --payload file://test-event.json \
    response.json

cat response.json
```

### Étape 5 : Configuration des Permissions

#### 5.1 Dans la Console Alexa Developer

1. Aller sur https://developer.amazon.com/alexa/console/ask
2. Sélectionner votre skill
3. Build > Permissions
4. Activer :
   - Device Address (Country & Postal Code)
   - Reminders
   - Geolocation

#### 5.2 Configuration des Événements Proactifs (Optionnel)

Pour les notifications push :

1. Build > Permissions
2. Activer "Alexa Events"
3. Sélectionner "SKILL_PROACTIVE_SUBSCRIPTION_CHANGED"

### Étape 6 : Tests

#### 6.1 Test dans le Simulateur

```bash
# Utiliser le dialogue interactif
ask dialog --locale ar-SA

# Tester des utterances spécifiques
ask simulate -l ar-SA -t "افتحي أوقات الصلاة"
```

#### 6.2 Test sur Appareil Réel

1. Ouvrir l'app Alexa
2. Plus > Skills et Jeux > Vos Skills > Dev
3. Activer la skill "أوقات الصلاة"
4. Tester avec votre Echo Show

#### 6.3 Tests Fonctionnels

- [ ] Launch request fonctionne
- [ ] Affichage APL sur Echo Show
- [ ] Récupération des horaires de prière
- [ ] Changement de localisation
- [ ] Changement de type d'athan
- [ ] Activation des notifications
- [ ] Persistance des préférences

### Étape 7 : Monitoring et Logs

#### 7.1 CloudWatch Logs

```bash
# Voir les logs en temps réel
aws logs tail /aws/lambda/PrayerTimesSkill --follow

# Filtrer par erreurs
aws logs filter-log-events \
    --log-group-name /aws/lambda/PrayerTimesSkill \
    --filter-pattern "ERROR"
```

#### 7.2 Métriques DynamoDB

```bash
# Voir les métriques de la table
aws cloudwatch get-metric-statistics \
    --namespace AWS/DynamoDB \
    --metric-name ConsumedReadCapacityUnits \
    --dimensions Name=TableName,Value=PrayerTimesUserData \
    --start-time 2024-01-01T00:00:00Z \
    --end-time 2024-01-02T00:00:00Z \
    --period 3600 \
    --statistics Sum
```

### Étape 8 : Certification et Publication

#### 8.1 Préparer pour la Certification

1. **Privacy Policy** : Créer une politique de confidentialité
2. **Terms of Use** : Créer les conditions d'utilisation
3. **Icons** : Préparer les icônes (108x108 et 512x512)
4. **Description** : Rédiger une description détaillée

#### 8.2 Soumettre pour Certification

1. Distribution > Availability
2. Remplir toutes les informations requises
3. Submit for Certification

#### 8.3 Checklist de Certification

- [ ] Tous les intents fonctionnent correctement
- [ ] L'aide contextuelle est claire
- [ ] Les messages d'erreur sont explicites
- [ ] L'APL s'affiche correctement sur tous les appareils
- [ ] Les permissions sont justifiées dans la description
- [ ] Privacy Policy et Terms of Use sont hébergés
- [ ] Icons de bonne qualité
- [ ] Aucun contenu offensant

### Étape 9 : Maintenance

#### 9.1 Mise à Jour de la Skill

```bash
# Modifier le code
# ...

# Redéployer
ask deploy --target lambda

# Soumettre la nouvelle version pour certification
```

#### 9.2 Mise à Jour des Horaires

L'API Aladhan se met à jour automatiquement. Aucune action requise.

#### 9.3 Backup des Données

```bash
# Exporter la table DynamoDB
aws dynamodb scan --table-name PrayerTimesUserData > backup.json

# Ou utiliser AWS Backup pour automatiser
```

---

## 🚨 Rollback en Cas de Problème

```bash
# Revenir à une version précédente
ask deploy --target lambda --revision PREVIOUS_REVISION_ID

# Désactiver temporairement la skill
ask api disable-skill -s YOUR_SKILL_ID
```

---

## 📊 Métriques de Performance

Surveiller :
- Temps de réponse moyen : < 1000ms
- Taux d'erreur : < 1%
- Utilisations quotidiennes
- Rétention des utilisateurs

---

## ✅ Checklist de Déploiement

- [ ] Fichiers audio hébergés sur S3
- [ ] URLs mises à jour dans le code
- [ ] Table DynamoDB créée
- [ ] Rôle IAM configuré
- [ ] Skill déployée
- [ ] Permissions activées
- [ ] Tests passés
- [ ] Monitoring configuré
- [ ] Documentation à jour
- [ ] Privacy Policy hébergée

---

**Déploiement réussi ! 🎉**
