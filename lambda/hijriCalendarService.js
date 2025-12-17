/**
 * Service de gestion du calendrier islamique (Hijri)
 * Intègre les dates hijri et les événements islamiques importants
 */

const axios = require('axios');
const moment = require('moment');

const ALADHAN_API_BASE = 'http://api.aladhan.com/v1';

/**
 * Noms des mois hijri en différentes langues
 */
const HIJRI_MONTHS = {
    ar: [
        'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
        'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ],
    fr: [
        'Mouharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Joumada al-Oula', 'Joumada al-Akhira',
        'Rajab', 'Chaaban', 'Ramadan', 'Chawwal', 'Dhou al-Qi\'da', 'Dhou al-Hijja'
    ],
    en: [
        'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah',
        'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ]
};

/**
 * Événements islamiques importants
 */
const ISLAMIC_EVENTS = {
    '1-1': {
        ar: 'رأس السنة الهجرية',
        fr: 'Nouvel An Islamique',
        en: 'Islamic New Year',
        type: 'holiday'
    },
    '1-10': {
        ar: 'عاشوراء',
        fr: 'Achoura',
        en: 'Ashura',
        type: 'important'
    },
    '3-12': {
        ar: 'المولد النبوي الشريف',
        fr: 'Mawlid (Naissance du Prophète)',
        en: 'Mawlid (Prophet\'s Birthday)',
        type: 'celebration'
    },
    '7-27': {
        ar: 'الإسراء والمعراج',
        fr: 'Isra et Mi\'raj',
        en: 'Isra and Mi\'raj',
        type: 'important'
    },
    '8-15': {
        ar: 'نصف شعبان',
        fr: 'Mi-Sha\'ban',
        en: 'Mid-Sha\'ban',
        type: 'important'
    },
    '9-1': {
        ar: 'أول رمضان',
        fr: 'Premier jour de Ramadan',
        en: 'First Day of Ramadan',
        type: 'ramadan'
    },
    '9-21': {
        ar: 'ليلة القدر المحتملة',
        fr: 'Laylat al-Qadr (probable)',
        en: 'Laylat al-Qadr (probable)',
        type: 'ramadan'
    },
    '9-27': {
        ar: 'ليلة القدر',
        fr: 'Nuit du Destin',
        en: 'Night of Decree',
        type: 'ramadan'
    },
    '10-1': {
        ar: 'عيد الفطر',
        fr: 'Aïd al-Fitr',
        en: 'Eid al-Fitr',
        type: 'eid'
    },
    '12-8': {
        ar: 'يوم عرفة',
        fr: 'Jour d\'Arafat',
        en: 'Day of Arafat',
        type: 'important'
    },
    '12-9': {
        ar: 'وقفة عرفات',
        fr: 'Veille d\'Arafat',
        en: 'Standing at Arafat',
        type: 'hajj'
    },
    '12-10': {
        ar: 'عيد الأضحى',
        fr: 'Aïd al-Adha',
        en: 'Eid al-Adha',
        type: 'eid'
    }
};

/**
 * Convertit une date grégorienne en date hijri
 * @param {string} date - Date grégorienne (YYYY-MM-DD)
 * @returns {Promise<Object>} Date hijri
 */
async function convertToHijri(date = null) {
    try {
        const targetDate = date || moment().format('DD-MM-YYYY');
        const response = await axios.get(`${ALADHAN_API_BASE}/gToH/${targetDate}`);

        if (response.data && response.data.data) {
            const hijriData = response.data.data.hijri;
            return {
                day: hijriData.day,
                month: {
                    number: parseInt(hijriData.month.number),
                    ar: hijriData.month.ar,
                    en: hijriData.month.en
                },
                year: hijriData.year,
                weekday: hijriData.weekday,
                designation: hijriData.designation,
                holidays: hijriData.holidays || []
            };
        }
        throw new Error('Invalid API response');
    } catch (error) {
        console.error('Error converting to Hijri:', error);
        return null;
    }
}

/**
 * Obtient la date hijri actuelle
 * @returns {Promise<Object>} Date hijri d'aujourd'hui
 */
async function getCurrentHijriDate() {
    return await convertToHijri();
}

/**
 * Formate une date hijri en texte
 * @param {Object} hijriDate - Objet date hijri
 * @param {string} locale - Langue (ar, fr, en)
 * @returns {string} Date formatée
 */
function formatHijriDate(hijriDate, locale = 'ar') {
    if (!hijriDate) return '';

    const monthName = HIJRI_MONTHS[locale][hijriDate.month.number - 1];

    const templates = {
        ar: `${hijriDate.day} ${monthName} ${hijriDate.year} هـ`,
        fr: `${hijriDate.day} ${monthName} ${hijriDate.year} H`,
        en: `${monthName} ${hijriDate.day}, ${hijriDate.year} AH`
    };

    return templates[locale] || templates['ar'];
}

/**
 * Vérifie si une date hijri est un événement spécial
 * @param {Object} hijriDate - Date hijri
 * @returns {Object|null} Événement s'il existe
 */
function getIslamicEvent(hijriDate) {
    if (!hijriDate) return null;

    const eventKey = `${hijriDate.month.number}-${hijriDate.day}`;
    return ISLAMIC_EVENTS[eventKey] || null;
}

/**
 * Obtient tous les événements d'un mois hijri
 * @param {number} monthNumber - Numéro du mois (1-12)
 * @returns {Array} Liste des événements du mois
 */
function getMonthEvents(monthNumber) {
    const events = [];

    Object.keys(ISLAMIC_EVENTS).forEach(key => {
        const [month, day] = key.split('-').map(Number);
        if (month === monthNumber) {
            events.push({
                day,
                ...ISLAMIC_EVENTS[key]
            });
        }
    });

    return events.sort((a, b) => a.day - b.day);
}

/**
 * Obtient les prochains événements islamiques
 * @param {number} count - Nombre d'événements à retourner
 * @returns {Promise<Array>} Liste des prochains événements
 */
async function getUpcomingEvents(count = 5) {
    const today = await getCurrentHijriDate();
    if (!today) return [];

    const upcoming = [];
    const currentMonth = today.month.number;
    const currentDay = today.day;

    // Parcourir les 12 prochains mois
    for (let i = 0; i < 12; i++) {
        const month = ((currentMonth + i - 1) % 12) + 1;
        const events = getMonthEvents(month);

        events.forEach(event => {
            // Ajouter seulement les événements futurs
            if (month === currentMonth && event.day <= currentDay) {
                return; // Skip past events in current month
            }

            upcoming.push({
                ...event,
                month,
                monthName: HIJRI_MONTHS.ar[month - 1]
            });
        });

        if (upcoming.length >= count) break;
    }

    return upcoming.slice(0, count);
}

/**
 * Vérifie si nous sommes dans le mois de Ramadan
 * @returns {Promise<boolean>} True si Ramadan
 */
async function isRamadan() {
    const hijriDate = await getCurrentHijriDate();
    return hijriDate && hijriDate.month.number === 9;
}

/**
 * Obtient les horaires mensuels avec dates hijri
 * @param {string} city - Ville
 * @param {string} country - Pays
 * @param {number} month - Mois grégorien
 * @param {number} year - Année grégorienne
 * @returns {Promise<Array>} Horaires mensuels avec dates hijri
 */
async function getMonthlyScheduleWithHijri(city, country, month, year) {
    try {
        const response = await axios.get(`${ALADHAN_API_BASE}/calendarByCity`, {
            params: {
                city,
                country,
                month,
                year,
                method: 4
            }
        });

        if (response.data && response.data.data) {
            return response.data.data.map(day => ({
                gregorian: {
                    date: day.date.gregorian.date,
                    day: day.date.gregorian.day,
                    weekday: day.date.gregorian.weekday.en,
                    month: day.date.gregorian.month.en,
                    year: day.date.gregorian.year
                },
                hijri: {
                    date: day.date.hijri.date,
                    day: day.date.hijri.day,
                    weekday: day.date.hijri.weekday.ar,
                    month: day.date.hijri.month.ar,
                    monthNumber: day.date.hijri.month.number,
                    year: day.date.hijri.year,
                    holidays: day.date.hijri.holidays || []
                },
                timings: day.timings,
                event: getIslamicEvent({
                    month: { number: parseInt(day.date.hijri.month.number) },
                    day: parseInt(day.date.hijri.day)
                })
            }));
        }

        throw new Error('Invalid API response');
    } catch (error) {
        console.error('Error fetching monthly schedule:', error);
        throw error;
    }
}

/**
 * Formate un message pour annoncer la date hijri et les événements
 * @param {Object} hijriDate - Date hijri
 * @param {string} locale - Langue
 * @returns {string} Message formaté
 */
function formatHijriAnnouncement(hijriDate, locale = 'ar-SA') {
    if (!hijriDate) return '';

    const lang = locale.split('-')[0];
    const dateText = formatHijriDate(hijriDate, lang);
    const event = getIslamicEvent(hijriDate);

    if (event) {
        const messages = {
            ar: `اليوم ${dateText}، ${event.ar}`,
            fr: `Aujourd'hui ${dateText}, ${event.fr}`,
            en: `Today is ${dateText}, ${event.en}`
        };
        return messages[lang] || messages['ar'];
    }

    const messages = {
        ar: `اليوم ${dateText}`,
        fr: `Aujourd'hui ${dateText}`,
        en: `Today is ${dateText}`
    };

    return messages[lang] || messages['ar'];
}

module.exports = {
    HIJRI_MONTHS,
    ISLAMIC_EVENTS,
    convertToHijri,
    getCurrentHijriDate,
    formatHijriDate,
    getIslamicEvent,
    getMonthEvents,
    getUpcomingEvents,
    isRamadan,
    getMonthlyScheduleWithHijri,
    formatHijriAnnouncement
};
