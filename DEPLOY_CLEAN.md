# 🚀 Guide de Déploiement Propre - Clean Deployment Guide

## Prérequis

- ✅ ASK CLI v2 installé et configuré
- ✅ AWS CLI configuré avec les credentials
- ✅ Permissions IAM nécessaires:
  - CloudFormation
  - Lambda
  - S3
  - DynamoDB
  - CloudWatch Logs
  - IAM

## Étape 1: Vérifier les Credentials AWS

```bash
# Vérifier le profil AWS
cat ~/.aws/credentials

# Devrait contenir:
[ask_cli_default]
aws_access_key_id = YOUR_KEY
aws_secret_access_key = YOUR_SECRET
```

## Étape 2: Vérifier la Configuration ASK CLI

```bash
# Vérifier qu'il n'y a pas de configuration résiduelle
ls -la .ask/
# Doit être vide ou ne pas exister
```

## Étape 3: Déployer le Skill

```bash
# Déploiement complet
ask deploy

# Alternative: Déployer seulement l'infrastructure
ask deploy --target skill-infrastructure

# Alternative: Déployer seulement le skill metadata
ask deploy --target skill-metadata
```

## Étape 4: Vérifier le Déploiement

```bash
# Voir l'ID du skill créé
ask util show-skill-id

# Lister les skills
ask smapi list-skills-for-vendor
```

## Étape 5: Configurer les Permissions

1. Allez sur: https://developer.amazon.com/alexa/console/ask
2. Sélectionnez votre skill: **أوقات الصلاة**
3. Allez dans **Build** → **Permissions**
4. Activez:
   - ✅ Device Address (Country & Postal Code)
   - ✅ Geolocation
   - ✅ Reminders

## Étape 6: Tester le Skill

```bash
# Tester en mode développement
ask dialog --locale ar-SA
```

Ou testez dans la console Alexa:
1. Allez dans **Test**
2. Activez: **Development**
3. Dites: "افتحي أوقات الصلاة"

## Troubleshooting

### Erreur: Lambda Trigger Invalid

Si vous voyez:
```
The trigger setting for the Lambda ... is invalid
```

**Solution:**
1. Allez dans AWS Lambda Console
2. Sélectionnez la fonction `ask-PrayerTimes-*`
3. Cliquez **Add trigger**
4. Choisissez: **Alexa Skills Kit**
5. Skill ID: (copiez depuis Alexa Developer Console)
6. Cliquez **Add**

### Erreur: Skill Not Found

**Solution:**
```bash
# Supprimer la configuration locale
rm -rf .ask/

# Redéployer
ask deploy
```

### Erreur: S3 Permissions

**Solution:**
Ajoutez la policy `AmazonS3FullAccess` à l'utilisateur IAM.

## Vérification Post-Déploiement

### CloudFormation Stack
```bash
aws cloudformation describe-stacks \
  --region us-east-1 \
  --stack-name ask-PrayerTimes-default-skillStack-*
```

### Lambda Function
```bash
aws lambda get-function \
  --region us-east-1 \
  --function-name ask-PrayerTimes-*
```

### DynamoDB Table
```bash
aws dynamodb describe-table \
  --region us-east-1 \
  --table-name PrayerTimesUsers
```

## Prochaines Étapes

1. ✅ Tester le skill sur un Echo Show
2. ✅ Configurer les fichiers Athan sur S3
3. ✅ Mettre à jour les URLs dans `notificationService.js`
4. ✅ Ajouter privacy policy et terms of use
5. ✅ Soumettre pour certification

## Ressources

- ASK CLI Docs: https://developer.amazon.com/docs/smapi/ask-cli-intro.html
- CloudFormation Deployer: https://github.com/alexa/ask-cli/tree/master/packages/cfn-deployer
- Alexa Developer Console: https://developer.amazon.com/alexa/console/ask
