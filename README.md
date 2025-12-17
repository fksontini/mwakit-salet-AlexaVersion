# 🕌 أوقات الصلاة - Application Alexa Show

<div dir="rtl">

## نظرة عامة

تطبيق شامل لأجهزة Alexa Show يعرض أوقات الصلاة الخمسة اليومية مع إمكانية الاختيار بين أنواع مختلفة من الأذان والمواقع الجغرافية. يتميز التطبيق بواجهة مرئية جميلة وتنبيهات صوتية بالأذان عند حلول وقت كل صلاة.

## المميزات الرئيسية

### 📱 واجهة مرئية متقدمة
- عرض جميع أوقات الصلاة الخمسة في ويدجت دائم على الشاشة
- تصميم عربي أنيق مع أيقونات توضيحية لكل صلاة
- تحديث تلقائي للواجهة مع تمييز الصلاة القادمة
- عرض التاريخ الميلادي والهجري

### 🔔 تنبيهات ذكية
- تنبيه تلقائي عند حلول وقت كل صلاة
- اختيار من بين 5 أنواع مختلفة من الأذان:
  - أذان الحرم المكي
  - أذان الحرم المدني
  - الأذان المصري
  - أذان المسجد الأقصى
  - أذان الشيخ عبد الباسط عبد الصمد

### 🌍 دعم المواقع
- تحديد الموقع الجغرافي بدقة (مدينة أو إحداثيات GPS)
- دعم جميع المدن حول العالم
- حساب دقيق للأوقات حسب الموقع
- خيار لتغيير الموقع في أي وقت

### ⚙️ إعدادات قابلة للتخصيص
- اختيار طريقة حساب الأوقات (أم القرى، الرابطة الإسلامية، إلخ)
- تفعيل/إيقاف التنبيهات
- حفظ جميع التفضيلات تلقائياً

## الأوامر الصوتية

### فتح التطبيق
```
"أليكسا، افتحي أوقات الصلاة"
```

### الاستعلام عن الأوقات
```
"أليكسا، اسألي أوقات الصلاة ما هي أوقات الصلاة اليوم"
"أليكسا، اسألي أوقات الصلاة متى صلاة الظهر"
"أليكسا، اسألي أوقات الصلاة متى الصلاة القادمة"
```

### تغيير الإعدادات
```
"أليكسا، قولي لأوقات الصلاة غير موقعي إلى الرياض"
"أليكسا، قولي لأوقات الصلاة غير الأذان إلى أذان مكة"
"أليكسا، قولي لأوقات الصلاة فعل التنبيهات"
```

### الاستعلام عن الإعدادات
```
"أليكسا، اسألي أوقات الصلاة عن الإعدادات الحالية"
```

</div>

---

## 🚀 Installation et Déploiement

### Prérequis

- Compte développeur Amazon Alexa
- AWS Account avec accès à Lambda et DynamoDB
- Node.js v18+ installé localement
- ASK CLI (Alexa Skills Kit Command Line Interface)

### Étape 1: Installation des dépendances

```bash
cd lambda
npm install
```

### Étape 2: Configuration

1. **Modifier skill.json** : Remplacez `YOUR_ACCOUNT_ID` par votre ID de compte AWS

2. **Héberger les fichiers audio d'athan** :
   - Téléchargez ou enregistrez les fichiers audio d'athan au format MP3
   - Hébergez-les sur Amazon S3 ou un CDN
   - Mettez à jour les URLs dans `lambda/notificationService.js`

3. **Configurer DynamoDB** :
   - La table sera créée automatiquement par l'adaptateur de persistance
   - Nom de la table : `PrayerTimesUserData`

### Étape 3: Déploiement avec ASK CLI

```bash
# Initialiser le projet
ask init

# Déployer la skill
ask deploy

# Ou déployer uniquement la Lambda
ask deploy --target lambda

# Ou déployer uniquement le modèle
ask deploy --target skill
```

### Étape 4: Configuration des permissions

Dans la console développeur Alexa :
1. Allez dans "Permissions"
2. Activez :
   - Device Address (Country & Postal Code)
   - Reminders
   - Geolocation

### Étape 5: Test

```bash
# Tester localement
ask dialog --locale ar-SA

# Ou tester dans le simulateur Alexa
```

## 📁 Structure du Projet

```
mwakit-salet-AlexaVersion/
├── skill-package/
│   ├── skill.json                          # Manifest de la skill
│   └── interactionModels/
│       └── custom/
│           └── ar-SA.json                  # Modèle d'interaction en arabe
├── lambda/
│   ├── index.js                            # Point d'entrée principal
│   ├── prayerTimesService.js              # Service de calcul des horaires
│   ├── notificationService.js             # Service de notifications
│   ├── package.json                        # Dépendances Node.js
│   └── apl/
│       └── prayerTimesWidget.json         # Template APL pour l'affichage
└── README.md                               # Documentation
```

## 🛠️ Technologies Utilisées

- **Alexa Skills Kit (ASK)** : Framework de développement Alexa
- **Node.js** : Runtime du backend
- **AWS Lambda** : Hébergement serverless
- **DynamoDB** : Base de données pour les préférences utilisateur
- **APL (Alexa Presentation Language)** : Affichage visuel sur Alexa Show
- **Aladhan API** : Calcul précis des horaires de prière
- **Moment.js** : Gestion des dates et fuseaux horaires

## 🔧 Configuration Avancée

### Méthodes de Calcul des Horaires

Le service supporte plusieurs méthodes de calcul :

- **4** : Umm Al-Qura University, Makkah (par défaut)
- **1** : University of Islamic Sciences, Karachi
- **2** : Islamic Society of North America
- **3** : Muslim World League
- **5** : Egyptian General Authority of Survey
- Et plus...

Pour changer la méthode, modifiez le paramètre `method` dans `prayerTimesService.js`.

### Personnalisation de l'Interface APL

Le widget est entièrement personnalisable dans `lambda/apl/prayerTimesWidget.json` :

- Couleurs du thème
- Tailles de police
- Disposition des éléments
- Animations

## 📊 API Utilisée

Cette application utilise l'API Aladhan (https://aladhan.com/prayer-times-api) qui fournit :
- Horaires de prière précis basés sur plusieurs méthodes de calcul
- Dates du calendrier islamique (Hijri)
- Support de géolocalisation mondiale
- Mise à jour quotidienne automatique

## 🔐 Sécurité et Confidentialité

- Les données utilisateur sont stockées de manière sécurisée dans DynamoDB
- Aucune donnée personnelle n'est partagée avec des tiers
- L'accès à la localisation est utilisé uniquement pour le calcul des horaires
- Conformité avec les politiques de confidentialité d'Amazon

## 🐛 Débogage

Pour activer les logs détaillés :

```javascript
// Dans lambda/index.js
console.log('Debug info:', JSON.stringify(handlerInput, null, 2));
```

Consultez CloudWatch Logs dans AWS pour voir les journaux d'exécution.

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 TODO / Améliorations Futures

- [ ] Ajouter le support de plusieurs langues (français, anglais, etc.)
- [ ] Intégrer la direction de la Qibla
- [ ] Ajouter des rappels Dhikr quotidiens
- [ ] Afficher les horaires du mois complet
- [ ] Intégration avec le calendrier islamique
- [ ] Widget pour Echo Show 15 avec mode paysage
- [ ] Support des invocations (Duaa) avant chaque prière
- [ ] Statistiques de prières accomplies

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

Développé avec ❤️ pour la communauté musulmane

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter via [email]

---

<div dir="rtl">

## الدعم الفني

إذا واجهتك أي مشاكل أو لديك استفسارات:
- افتح issue على GitHub
- تواصل معنا عبر البريد الإلكتروني

جزاكم الله خيراً على استخدام التطبيق!

</div>

---

**ملاحظة هامة**: تأكد من تحديث URLs الأذان في ملف `notificationService.js` قبل النشر للعامة.

**Note importante**: Assurez-vous de mettre à jour les URLs des fichiers audio d'athan dans `notificationService.js` avant de publier l'application.
