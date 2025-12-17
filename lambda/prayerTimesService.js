/**
 * Service de gestion des horaires de prière
 * Utilise l'API Aladhan pour récupérer les horaires précis
 */

const axios = require('axios');
const moment = require('moment-timezone');

const PRAYER_API_BASE = 'http://api.aladhan.com/v1';

/**
 * Calcul des horaires de prière pour une ville donnée
 * @param {string} city - Nom de la ville
 * @param {string} country - Nom du pays
 * @param {number} method - Méthode de calcul (défaut: 4 = Umm Al-Qura, Makkah)
 * @returns {Promise<Object>} Horaires de prière
 */
async function getPrayerTimesByCity(city, country, method = 4) {
    try {
        const response = await axios.get(`${PRAYER_API_BASE}/timingsByCity`, {
            params: {
                city: city,
                country: country,
                method: method
            }
        });

        if (response.data && response.data.data) {
            return {
                timings: response.data.data.timings,
                date: response.data.data.date,
                meta: response.data.data.meta
            };
        }
        throw new Error('Invalid API response');
    } catch (error) {
        console.error('Error fetching prayer times by city:', error);
        throw error;
    }
}

/**
 * Calcul des horaires de prière par coordonnées GPS
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {number} method - Méthode de calcul
 * @returns {Promise<Object>} Horaires de prière
 */
async function getPrayerTimesByCoordinates(latitude, longitude, method = 4) {
    try {
        const response = await axios.get(`${PRAYER_API_BASE}/timings`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                method: method
            }
        });

        if (response.data && response.data.data) {
            return {
                timings: response.data.data.timings,
                date: response.data.data.date,
                meta: response.data.data.meta
            };
        }
        throw new Error('Invalid API response');
    } catch (error) {
        console.error('Error fetching prayer times by coordinates:', error);
        throw error;
    }
}

/**
 * Obtenir les horaires pour un mois complet
 * @param {string} city - Nom de la ville
 * @param {string} country - Nom du pays
 * @param {number} month - Mois (1-12)
 * @param {number} year - Année
 * @param {number} method - Méthode de calcul
 * @returns {Promise<Array>} Horaires de prière pour le mois
 */
async function getMonthlyPrayerTimes(city, country, month, year, method = 4) {
    try {
        const response = await axios.get(`${PRAYER_API_BASE}/calendarByCity`, {
            params: {
                city: city,
                country: country,
                month: month,
                year: year,
                method: method
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }
        throw new Error('Invalid API response');
    } catch (error) {
        console.error('Error fetching monthly prayer times:', error);
        throw error;
    }
}

/**
 * Détermine la prochaine prière
 * @param {Object} timings - Horaires de prière
 * @param {string} timezone - Fuseau horaire (optionnel)
 * @returns {Object} Prochaine prière avec nom et heure
 */
function getNextPrayer(timings, timezone = null) {
    const now = timezone ? moment.tz(timezone) : moment();
    const prayers = [
        { name: 'Fajr', nameAr: 'الفجر', time: timings.Fajr },
        { name: 'Dhuhr', nameAr: 'الظهر', time: timings.Dhuhr },
        { name: 'Asr', nameAr: 'العصر', time: timings.Asr },
        { name: 'Maghrib', nameAr: 'المغرب', time: timings.Maghrib },
        { name: 'Isha', nameAr: 'العشاء', time: timings.Isha }
    ];

    for (const prayer of prayers) {
        const prayerTime = moment(prayer.time, 'HH:mm');
        if (prayerTime.isAfter(now)) {
            const minutesUntil = prayerTime.diff(now, 'minutes');
            return {
                ...prayer,
                minutesUntil: minutesUntil,
                isNow: minutesUntil === 0
            };
        }
    }

    // Si aucune prière n'est trouvée aujourd'hui, retourner Fajr de demain
    const tomorrowFajr = moment(prayers[0].time, 'HH:mm').add(1, 'day');
    const minutesUntil = tomorrowFajr.diff(now, 'minutes');

    return {
        ...prayers[0],
        minutesUntil: minutesUntil,
        tomorrow: true
    };
}

/**
 * Formatte les horaires pour l'affichage en arabe
 * @param {Object} timings - Horaires de prière
 * @returns {Array} Tableau formaté des prières
 */
function formatPrayersForDisplay(timings) {
    return [
        {
            name: 'الفجر',
            nameEn: 'Fajr',
            time: timings.Fajr,
            icon: '🌅',
            description: 'صلاة الفجر'
        },
        {
            name: 'الشروق',
            nameEn: 'Sunrise',
            time: timings.Sunrise,
            icon: '☀️',
            description: 'وقت الشروق',
            isNotPrayer: true
        },
        {
            name: 'الظهر',
            nameEn: 'Dhuhr',
            time: timings.Dhuhr,
            icon: '☀️',
            description: 'صلاة الظهر'
        },
        {
            name: 'العصر',
            nameEn: 'Asr',
            time: timings.Asr,
            icon: '🌤️',
            description: 'صلاة العصر'
        },
        {
            name: 'المغرب',
            nameEn: 'Maghrib',
            time: timings.Maghrib,
            icon: '🌇',
            description: 'صلاة المغرب'
        },
        {
            name: 'العشاء',
            nameEn: 'Isha',
            time: timings.Isha,
            icon: '🌙',
            description: 'صلاة العشاء'
        }
    ];
}

/**
 * Calcule le temps restant jusqu'à la prochaine prière
 * @param {string} prayerTime - Heure de la prière (HH:mm)
 * @returns {string} Texte formaté en arabe
 */
function getTimeUntilPrayer(prayerTime) {
    const now = moment();
    const prayer = moment(prayerTime, 'HH:mm');

    if (prayer.isBefore(now)) {
        prayer.add(1, 'day');
    }

    const duration = moment.duration(prayer.diff(now));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    if (hours > 0) {
        return `بعد ${hours} ساعة و ${minutes} دقيقة`;
    } else if (minutes > 0) {
        return `بعد ${minutes} دقيقة`;
    } else {
        return 'الآن';
    }
}

/**
 * Méthodes de calcul disponibles
 */
const CALCULATION_METHODS = {
    1: { name: 'جامعة العلوم الإسلامية، كراتشي', nameEn: 'University of Islamic Sciences, Karachi' },
    2: { name: 'الرابطة الإسلامية لأمريكا الشمالية', nameEn: 'Islamic Society of North America' },
    3: { name: 'الرابطة الإسلامية العالمية', nameEn: 'Muslim World League' },
    4: { name: 'جامعة أم القرى، مكة المكرمة', nameEn: 'Umm Al-Qura University, Makkah' },
    5: { name: 'الهيئة العامة المصرية للمساحة', nameEn: 'Egyptian General Authority of Survey' },
    7: { name: 'معهد الجيوفيزياء، جامعة طهران', nameEn: 'Institute of Geophysics, University of Tehran' },
    8: { name: 'منطقة الخليج', nameEn: 'Gulf Region' },
    9: { name: 'الكويت', nameEn: 'Kuwait' },
    10: { name: 'قطر', nameEn: 'Qatar' },
    11: { name: 'مجلس أمناء سنغافورة', nameEn: 'Majlis Ugama Islam Singapura, Singapore' },
    12: { name: 'اتحاد المنظمات الإسلامية في فرنسا', nameEn: 'Union Organization Islamic de France' },
    13: { name: 'وزارة الأوقاف والشؤون الإسلامية، تركيا', nameEn: 'Diyanet İşleri Başkanlığı, Turkey' },
    14: { name: 'الهيئة العامة المصرية للمساحة (بس)', nameEn: 'Egyptian General Authority of Survey (Bis)' }
};

module.exports = {
    getPrayerTimesByCity,
    getPrayerTimesByCoordinates,
    getMonthlyPrayerTimes,
    getNextPrayer,
    formatPrayersForDisplay,
    getTimeUntilPrayer,
    CALCULATION_METHODS
};
