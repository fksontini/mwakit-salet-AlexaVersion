/**
 * Service de gestion des notifications et rappels pour les horaires de prière
 */

const moment = require('moment-timezone');

/**
 * URLs des fichiers audio d'athan disponibles
 * Note: Ces URLs doivent pointer vers des fichiers MP3 hébergés sur S3 ou un CDN
 */
const ATHAN_AUDIO_URLS = {
    'مكة': {
        name: 'أذان الحرم المكي',
        url: 'https://your-s3-bucket.s3.amazonaws.com/audio/athan-makkah.mp3',
        duration: 180 // en secondes
    },
    'المدينة': {
        name: 'أذان الحرم المدني',
        url: 'https://your-s3-bucket.s3.amazonaws.com/audio/athan-madinah.mp3',
        duration: 180
    },
    'مصر': {
        name: 'الأذان المصري',
        url: 'https://your-s3-bucket.s3.amazonaws.com/audio/athan-egypt.mp3',
        duration: 180
    },
    'الأقصى': {
        name: 'أذان المسجد الأقصى',
        url: 'https://your-s3-bucket.s3.amazonaws.com/audio/athan-aqsa.mp3',
        duration: 180
    },
    'عبدالباسط': {
        name: 'أذان الشيخ عبد الباسط',
        url: 'https://your-s3-bucket.s3.amazonaws.com/audio/athan-abdulbasit.mp3',
        duration: 200
    }
};

/**
 * Crée un rappel pour une prière spécifique
 * @param {Object} reminderClient - Client API de rappels Alexa
 * @param {string} prayerName - Nom de la prière en arabe
 * @param {string} prayerTime - Heure de la prière (HH:mm)
 * @param {string} athanUrl - URL de l'audio d'athan
 * @param {string} timezone - Fuseau horaire
 * @returns {Promise<Object>} Réponse de l'API de rappels
 */
async function createPrayerReminder(reminderClient, prayerName, prayerTime, athanUrl, timezone = 'Asia/Riyadh') {
    try {
        const now = moment.tz(timezone);
        const reminderTime = moment.tz(prayerTime, 'HH:mm', timezone);

        // Si l'heure est déjà passée aujourd'hui, planifier pour demain
        if (reminderTime.isBefore(now)) {
            reminderTime.add(1, 'day');
        }

        const reminderRequest = {
            requestTime: now.toISOString(),
            trigger: {
                type: 'SCHEDULED_ABSOLUTE',
                scheduledTime: reminderTime.toISOString(),
                timeZoneId: timezone,
                recurrence: {
                    freq: 'DAILY'
                }
            },
            alertInfo: {
                spokenInfo: {
                    content: [{
                        locale: 'ar-SA',
                        text: `حان الآن موعد صلاة ${prayerName}`,
                        ssml: `<speak>
                            <audio src="${athanUrl}"/>
                            حان الآن موعد صلاة ${prayerName}. حافظ على الصلاة في أوقاتها.
                        </speak>`
                    }]
                }
            },
            pushNotification: {
                status: 'ENABLED'
            }
        };

        const response = await reminderClient.createReminder(reminderRequest);
        console.log(`Reminder created for ${prayerName} at ${prayerTime}:`, response);
        return response;

    } catch (error) {
        console.error(`Error creating reminder for ${prayerName}:`, error);
        throw error;
    }
}

/**
 * Crée tous les rappels de prière pour la journée
 * @param {Object} reminderClient - Client API de rappels Alexa
 * @param {Object} prayerTimings - Horaires de prière
 * @param {string} athanType - Type d'athan sélectionné
 * @param {string} timezone - Fuseau horaire
 * @returns {Promise<Array>} Tableau des rappels créés
 */
async function setupAllPrayerReminders(reminderClient, prayerTimings, athanType = 'مكة', timezone = 'Asia/Riyadh') {
    const prayers = [
        { name: 'الفجر', key: 'Fajr' },
        { name: 'الظهر', key: 'Dhuhr' },
        { name: 'العصر', key: 'Asr' },
        { name: 'المغرب', key: 'Maghrib' },
        { name: 'العشاء', key: 'Isha' }
    ];

    const athanUrl = ATHAN_AUDIO_URLS[athanType]?.url || ATHAN_AUDIO_URLS['مكة'].url;
    const reminders = [];

    for (const prayer of prayers) {
        try {
            const reminder = await createPrayerReminder(
                reminderClient,
                prayer.name,
                prayerTimings[prayer.key],
                athanUrl,
                timezone
            );
            reminders.push({
                prayer: prayer.name,
                time: prayerTimings[prayer.key],
                reminderId: reminder.alertToken,
                status: 'created'
            });
        } catch (error) {
            console.error(`Failed to create reminder for ${prayer.name}:`, error);
            reminders.push({
                prayer: prayer.name,
                time: prayerTimings[prayer.key],
                status: 'failed',
                error: error.message
            });
        }
    }

    return reminders;
}

/**
 * Supprime tous les rappels de prière existants
 * @param {Object} reminderClient - Client API de rappels Alexa
 * @returns {Promise<void>}
 */
async function deleteAllPrayerReminders(reminderClient) {
    try {
        // Récupérer tous les rappels
        const reminders = await reminderClient.getReminders();

        if (reminders && reminders.alerts) {
            for (const reminder of reminders.alerts) {
                await reminderClient.deleteReminder(reminder.alertToken);
                console.log(`Deleted reminder: ${reminder.alertToken}`);
            }
        }
    } catch (error) {
        console.error('Error deleting reminders:', error);
        throw error;
    }
}

/**
 * Met à jour les rappels de prière
 * @param {Object} reminderClient - Client API de rappels Alexa
 * @param {Object} prayerTimings - Nouveaux horaires de prière
 * @param {string} athanType - Type d'athan
 * @param {string} timezone - Fuseau horaire
 * @returns {Promise<Array>} Rappels mis à jour
 */
async function updatePrayerReminders(reminderClient, prayerTimings, athanType, timezone) {
    try {
        // Supprimer les anciens rappels
        await deleteAllPrayerReminders(reminderClient);

        // Créer de nouveaux rappels
        const reminders = await setupAllPrayerReminders(
            reminderClient,
            prayerTimings,
            athanType,
            timezone
        );

        return reminders;
    } catch (error) {
        console.error('Error updating reminders:', error);
        throw error;
    }
}

/**
 * Génère un message SSML avec l'athan
 * @param {string} prayerName - Nom de la prière
 * @param {string} athanType - Type d'athan
 * @returns {string} Message SSML formaté
 */
function generateAthanSSML(prayerName, athanType = 'مكة') {
    const athanAudio = ATHAN_AUDIO_URLS[athanType]?.url || ATHAN_AUDIO_URLS['مكة'].url;

    return `<speak>
        <audio src="${athanAudio}"/>
        <break time="1s"/>
        حان الآن موعد صلاة ${prayerName}.
        <break time="500ms"/>
        حافظ على الصلاة في أوقاتها.
        <break time="500ms"/>
        اللهم تقبل منا صلاتنا.
    </speak>`;
}

/**
 * Crée une notification proactive pour l'heure de la prière
 * @param {Object} proactiveEventsClient - Client d'événements proactifs Alexa
 * @param {string} prayerName - Nom de la prière
 * @param {string} prayerTime - Heure de la prière
 * @param {string} userId - ID de l'utilisateur Alexa
 * @returns {Promise<Object>} Réponse de l'API
 */
async function sendPrayerTimeNotification(proactiveEventsClient, prayerName, prayerTime, userId) {
    try {
        const event = {
            timestamp: new Date().toISOString(),
            referenceId: `prayer-${prayerName}-${Date.now()}`,
            expiryTime: moment().add(1, 'hour').toISOString(),
            event: {
                name: 'AMAZON.MessageAlert.Activated',
                payload: {
                    state: {
                        status: 'UNREAD',
                        freshness: 'NEW'
                    },
                    messageGroup: {
                        creator: {
                            name: 'أوقات الصلاة'
                        },
                        count: 1,
                        urgency: 'URGENT'
                    }
                }
            },
            localizedAttributes: [
                {
                    locale: 'ar-SA',
                    content: `حان موعد صلاة ${prayerName} - ${prayerTime}`
                }
            ],
            relevantAudience: {
                type: 'Unicast',
                payload: {
                    user: userId
                }
            }
        };

        const response = await proactiveEventsClient.createProactiveEvent(event);
        console.log('Proactive event created:', response);
        return response;

    } catch (error) {
        console.error('Error sending proactive notification:', error);
        throw error;
    }
}

module.exports = {
    ATHAN_AUDIO_URLS,
    createPrayerReminder,
    setupAllPrayerReminders,
    deleteAllPrayerReminders,
    updatePrayerReminders,
    generateAthanSSML,
    sendPrayerTimeNotification
};
