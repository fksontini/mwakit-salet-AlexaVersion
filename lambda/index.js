const Alexa = require('ask-sdk-core');
const axios = require('axios');
const moment = require('moment-timezone');

// Configuration de l'API de prière (Aladhan API)
const PRAYER_API_BASE = 'http://api.aladhan.com/v1';

// URLs des fichiers audio d'athan
const ATHAN_URLS = {
    'مكة': 'https://example.com/audio/athan-makkah.mp3',
    'المدينة': 'https://example.com/audio/athan-madinah.mp3',
    'مصر': 'https://example.com/audio/athan-egypt.mp3',
    'الأقصى': 'https://example.com/audio/athan-aqsa.mp3',
    'عبدالباسط': 'https://example.com/audio/athan-abdulbasit.mp3'
};

// Noms des prières en arabe
const PRAYER_NAMES = {
    'Fajr': 'الفجر',
    'Dhuhr': 'الظهر',
    'Asr': 'العصر',
    'Maghrib': 'المغرب',
    'Isha': 'العشاء'
};

// ============================================
// Handler pour le lancement de l'application
// ============================================
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();

        // Récupérer les paramètres de l'utilisateur
        const userCity = persistentAttributes.city || 'مكة المكرمة';
        const userCountry = persistentAttributes.country || 'السعودية';

        const speakOutput = `مرحباً بك في تطبيق أوقات الصلاة. موقعك الحالي هو ${userCity}. يمكنك أن تسأليني عن أوقات الصلاة أو تغيير الإعدادات.`;

        // Si l'appareil supporte APL, afficher le widget
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            const prayerTimes = await getPrayerTimes(userCity, userCountry);
            const aplDocument = require('./apl/prayerTimesWidget.json');
            const aplDataSource = generateAPLDataSource(prayerTimes, userCity);

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('كيف يمكنني مساعدتك؟')
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: 'prayerTimesToken',
                    document: aplDocument,
                    datasources: aplDataSource
                })
                .getResponse();
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('كيف يمكنني مساعدتك؟')
            .getResponse();
    }
};

// ============================================
// Handler pour obtenir tous les horaires
// ============================================
const GetPrayerTimesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetPrayerTimesIntent';
    },
    async handle(handlerInput) {
        const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        const userCity = persistentAttributes.city || 'مكة المكرمة';
        const userCountry = persistentAttributes.country || 'السعودية';

        try {
            const prayerTimes = await getPrayerTimes(userCity, userCountry);

            const speakOutput = `أوقات الصلاة اليوم في ${userCity}:
                الفجر ${prayerTimes.Fajr}،
                الظهر ${prayerTimes.Dhuhr}،
                العصر ${prayerTimes.Asr}،
                المغرب ${prayerTimes.Maghrib}،
                العشاء ${prayerTimes.Isha}`;

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                const aplDocument = require('./apl/prayerTimesWidget.json');
                const aplDataSource = generateAPLDataSource(prayerTimes, userCity);

                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .addDirective({
                        type: 'Alexa.Presentation.APL.RenderDocument',
                        token: 'prayerTimesToken',
                        document: aplDocument,
                        datasources: aplDataSource
                    })
                    .getResponse();
            }

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();

        } catch (error) {
            console.error('Error fetching prayer times:', error);
            return handlerInput.responseBuilder
                .speak('عذراً، حدث خطأ في الحصول على أوقات الصلاة. يرجى المحاولة مرة أخرى.')
                .getResponse();
        }
    }
};

// ============================================
// Handler pour la prochaine prière
// ============================================
const GetNextPrayerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetNextPrayerIntent';
    },
    async handle(handlerInput) {
        const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        const userCity = persistentAttributes.city || 'مكة المكرمة';
        const userCountry = persistentAttributes.country || 'السعودية';

        try {
            const prayerTimes = await getPrayerTimes(userCity, userCountry);
            const nextPrayer = getNextPrayer(prayerTimes);

            const speakOutput = `الصلاة القادمة هي ${nextPrayer.nameAr} في الساعة ${nextPrayer.time}`;

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();

        } catch (error) {
            console.error('Error getting next prayer:', error);
            return handlerInput.responseBuilder
                .speak('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.')
                .getResponse();
        }
    }
};

// ============================================
// Handler pour une prière spécifique
// ============================================
const GetSpecificPrayerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetSpecificPrayerIntent';
    },
    async handle(handlerInput) {
        const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        const userCity = persistentAttributes.city || 'مكة المكرمة';
        const userCountry = persistentAttributes.country || 'السعودية';

        const prayerName = Alexa.getSlotValue(handlerInput.requestEnvelope, 'prayerName');

        try {
            const prayerTimes = await getPrayerTimes(userCity, userCountry);
            const prayerKey = getPrayerKeyFromArabic(prayerName);

            if (prayerKey && prayerTimes[prayerKey]) {
                const speakOutput = `موعد صلاة ${prayerName} هو ${prayerTimes[prayerKey]}`;
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            } else {
                return handlerInput.responseBuilder
                    .speak('عذراً، لم أفهم اسم الصلاة. يرجى المحاولة مرة أخرى.')
                    .getResponse();
            }

        } catch (error) {
            console.error('Error getting specific prayer:', error);
            return handlerInput.responseBuilder
                .speak('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.')
                .getResponse();
        }
    }
};

// ============================================
// Handler pour définir le lieu
// ============================================
const SetLocationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetLocationIntent';
    },
    async handle(handlerInput) {
        const city = Alexa.getSlotValue(handlerInput.requestEnvelope, 'city');
        const country = Alexa.getSlotValue(handlerInput.requestEnvelope, 'country') || 'السعودية';

        if (city) {
            const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
            persistentAttributes.city = city;
            persistentAttributes.country = country;
            handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
            await handlerInput.attributesManager.savePersistentAttributes();

            const speakOutput = `تم تحديث موقعك إلى ${city}. يمكنك الآن السؤال عن أوقات الصلاة.`;

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak('يرجى تحديد المدينة التي تريد ضبطها.')
                .reprompt('ما هي المدينة؟')
                .getResponse();
        }
    }
};

// ============================================
// Handler pour définir le type d'athan
// ============================================
const SetAthanIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetAthanIntent';
    },
    async handle(handlerInput) {
        const athanType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'athanType');

        if (athanType && ATHAN_URLS[athanType]) {
            const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
            persistentAttributes.athanType = athanType;
            handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
            await handlerInput.attributesManager.savePersistentAttributes();

            const speakOutput = `تم تغيير الأذان إلى أذان ${athanType}. سيتم استخدام هذا الأذان في التنبيهات.`;

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak('يرجى اختيار نوع أذان صحيح: مكة، المدينة، مصر، الأقصى، أو عبدالباسط.')
                .reprompt('أي نوع أذان تريد؟')
                .getResponse();
        }
    }
};

// ============================================
// Handler pour activer les notifications
// ============================================
const EnableNotificationsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EnableNotificationsIntent';
    },
    async handle(handlerInput) {
        const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        persistentAttributes.notificationsEnabled = true;
        handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
        await handlerInput.attributesManager.savePersistentAttributes();

        const userCity = persistentAttributes.city || 'مكة المكرمة';
        const userCountry = persistentAttributes.country || 'السعودية';

        try {
            // Créer des rappels pour chaque prière
            await setupPrayerReminders(handlerInput, userCity, userCountry);

            const speakOutput = 'تم تفعيل التنبيهات. سوف يتم تذكيرك بالأذان عند كل صلاة.';

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } catch (error) {
            console.error('Error enabling notifications:', error);
            return handlerInput.responseBuilder
                .speak('عذراً، حدث خطأ في تفعيل التنبيهات. يرجى التأكد من منح الأذونات اللازمة في تطبيق Alexa.')
                .getResponse();
        }
    }
};

// ============================================
// Handler pour désactiver les notifications
// ============================================
const DisableNotificationsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DisableNotificationsIntent';
    },
    async handle(handlerInput) {
        const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        persistentAttributes.notificationsEnabled = false;
        handlerInput.attributesManager.setPersistentAttributes(persistentAttributes);
        await handlerInput.attributesManager.savePersistentAttributes();

        const speakOutput = 'تم إيقاف التنبيهات.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// ============================================
// Handler pour les paramètres
// ============================================
const GetSettingsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetSettingsIntent';
    },
    async handle(handlerInput) {
        const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        const userCity = persistentAttributes.city || 'غير محدد';
        const athanType = persistentAttributes.athanType || 'مكة';
        const notificationsEnabled = persistentAttributes.notificationsEnabled ? 'مفعلة' : 'غير مفعلة';

        const speakOutput = `إعداداتك الحالية: الموقع ${userCity}، نوع الأذان ${athanType}، التنبيهات ${notificationsEnabled}.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// ============================================
// Handlers standard Alexa
// ============================================
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'يمكنك أن تسأليني عن أوقات الصلاة، أو تغيير موقعك، أو اختيار نوع الأذان، أو تفعيل التنبيهات. كيف يمكنني مساعدتك؟';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'السلام عليكم';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// ============================================
// Fonctions utilitaires
// ============================================

/**
 * Récupère les horaires de prière depuis l'API
 */
async function getPrayerTimes(city, country) {
    try {
        const response = await axios.get(`${PRAYER_API_BASE}/timingsByCity`, {
            params: {
                city: city,
                country: country,
                method: 4 // Umm Al-Qura University, Makkah
            }
        });

        if (response.data && response.data.data && response.data.data.timings) {
            return response.data.data.timings;
        }
        throw new Error('Invalid API response');
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        throw error;
    }
}

/**
 * Trouve la prochaine prière
 */
function getNextPrayer(prayerTimes) {
    const now = moment();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const prayer of prayers) {
        const prayerTime = moment(prayerTimes[prayer], 'HH:mm');
        if (prayerTime.isAfter(now)) {
            return {
                name: prayer,
                nameAr: PRAYER_NAMES[prayer],
                time: prayerTimes[prayer]
            };
        }
    }

    // Si aucune prière n'est trouvée aujourd'hui, retourner Fajr de demain
    return {
        name: 'Fajr',
        nameAr: PRAYER_NAMES['Fajr'],
        time: prayerTimes['Fajr']
    };
}

/**
 * Convertit le nom arabe de la prière en clé anglaise
 */
function getPrayerKeyFromArabic(arabicName) {
    const mapping = {
        'الفجر': 'Fajr',
        'فجر': 'Fajr',
        'الظهر': 'Dhuhr',
        'ظهر': 'Dhuhr',
        'العصر': 'Asr',
        'عصر': 'Asr',
        'المغرب': 'Maghrib',
        'مغرب': 'Maghrib',
        'العشاء': 'Isha',
        'عشاء': 'Isha'
    };

    return mapping[arabicName];
}

/**
 * Configure les rappels pour les prières
 */
async function setupPrayerReminders(handlerInput, city, country) {
    const prayerTimes = await getPrayerTimes(city, country);
    const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
    const athanType = persistentAttributes.athanType || 'مكة';

    // Note: L'implémentation complète des rappels nécessite l'API Reminders d'Alexa
    // Ceci est un exemple simplifié
    console.log('Setting up prayer reminders for:', city);
    console.log('Prayer times:', prayerTimes);
    console.log('Athan type:', athanType);

    // Dans une implémentation réelle, vous créeriez des rappels avec l'API Reminders
    // en utilisant l'audio de l'athan sélectionné
}

/**
 * Génère les données pour le template APL
 */
function generateAPLDataSource(prayerTimes, city) {
    return {
        prayerTimesData: {
            type: 'object',
            properties: {
                city: city,
                date: moment().format('DD/MM/YYYY'),
                hijriDate: '', // Peut être récupéré de l'API
                prayers: [
                    {
                        name: 'الفجر',
                        time: prayerTimes.Fajr,
                        icon: '🌅'
                    },
                    {
                        name: 'الظهر',
                        time: prayerTimes.Dhuhr,
                        icon: '☀️'
                    },
                    {
                        name: 'العصر',
                        time: prayerTimes.Asr,
                        icon: '🌤️'
                    },
                    {
                        name: 'المغرب',
                        time: prayerTimes.Maghrib,
                        icon: '🌇'
                    },
                    {
                        name: 'العشاء',
                        time: prayerTimes.Isha,
                        icon: '🌙'
                    }
                ]
            }
        }
    };
}

// ============================================
// Configuration du Skill Builder
// ============================================
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetPrayerTimesIntentHandler,
        GetNextPrayerIntentHandler,
        GetSpecificPrayerIntentHandler,
        SetLocationIntentHandler,
        SetAthanIntentHandler,
        EnableNotificationsIntentHandler,
        DisableNotificationsIntentHandler,
        GetSettingsIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withPersistenceAdapter(
        new Alexa.DefaultPersistenceAdapter({
            tableName: 'PrayerTimesUserData',
            createTable: true
        })
    )
    .lambda();
