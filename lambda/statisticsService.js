/**
 * Service de gestion des statistiques de prières
 */

const moment = require('moment-timezone');

/**
 * Enregistre une prière accomplie
 * @param {Object} attributesManager - Gestionnaire d'attributs persistants
 * @param {string} prayerName - Nom de la prière (fajr, dhuhr, asr, maghrib, isha)
 * @param {string} date - Date au format YYYY-MM-DD
 * @returns {Promise<Object>} Statistiques mises à jour
 */
async function recordPrayerCompleted(attributesManager, prayerName, date = null) {
    const attributes = await attributesManager.getPersistentAttributes();

    if (!attributes.prayerStats) {
        attributes.prayerStats = {
            total: 0,
            byPrayer: {
                fajr: 0,
                dhuhr: 0,
                asr: 0,
                maghrib: 0,
                isha: 0
            },
            byDate: {},
            streak: 0,
            longestStreak: 0,
            lastPrayerDate: null
        };
    }

    const stats = attributes.prayerStats;
    const today = date || moment().format('YYYY-MM-DD');

    // Incrémenter le total
    stats.total++;

    // Incrémenter par prière
    if (stats.byPrayer[prayerName] !== undefined) {
        stats.byPrayer[prayerName]++;
    }

    // Enregistrer par date
    if (!stats.byDate[today]) {
        stats.byDate[today] = {
            fajr: false,
            dhuhr: false,
            asr: false,
            maghrib: false,
            isha: false,
            count: 0
        };
    }

    stats.byDate[today][prayerName] = true;
    stats.byDate[today].count++;

    // Calculer la série (streak)
    updateStreak(stats, today);

    // Sauvegarder
    attributes.prayerStats = stats;
    attributesManager.setPersistentAttributes(attributes);
    await attributesManager.savePersistentAttributes();

    return stats;
}

/**
 * Met à jour la série de prières consécutives
 * @param {Object} stats - Statistiques de prières
 * @param {string} today - Date du jour
 */
function updateStreak(stats, today) {
    const todayDate = moment(today);
    const yesterday = todayDate.clone().subtract(1, 'days').format('YYYY-MM-DD');

    // Vérifier si toutes les prières d'hier sont faites
    const yesterdayComplete = stats.byDate[yesterday] &&
        stats.byDate[yesterday].fajr &&
        stats.byDate[yesterday].dhuhr &&
        stats.byDate[yesterday].asr &&
        stats.byDate[yesterday].maghrib &&
        stats.byDate[yesterday].isha;

    if (yesterdayComplete || !stats.lastPrayerDate) {
        stats.streak++;
        if (stats.streak > stats.longestStreak) {
            stats.longestStreak = stats.streak;
        }
    } else if (stats.lastPrayerDate !== today && stats.lastPrayerDate !== yesterday) {
        // Série interrompue
        stats.streak = 1;
    }

    stats.lastPrayerDate = today;
}

/**
 * Obtient les statistiques globales
 * @param {Object} attributesManager - Gestionnaire d'attributs persistants
 * @returns {Promise<Object>} Statistiques complètes
 */
async function getStatistics(attributesManager) {
    const attributes = await attributesManager.getPersistentAttributes();

    if (!attributes.prayerStats) {
        return {
            total: 0,
            byPrayer: {
                fajr: 0,
                dhuhr: 0,
                asr: 0,
                maghrib: 0,
                isha: 0
            },
            streak: 0,
            longestStreak: 0,
            todayProgress: {
                completed: 0,
                total: 5,
                percentage: 0
            }
        };
    }

    const stats = attributes.prayerStats;
    const today = moment().format('YYYY-MM-DD');
    const todayData = stats.byDate[today] || { count: 0 };

    return {
        total: stats.total,
        byPrayer: stats.byPrayer,
        streak: stats.streak,
        longestStreak: stats.longestStreak,
        todayProgress: {
            completed: todayData.count,
            total: 5,
            percentage: Math.round((todayData.count / 5) * 100)
        },
        thisWeek: getWeekStatistics(stats),
        thisMonth: getMonthStatistics(stats)
    };
}

/**
 * Obtient les statistiques de la semaine
 * @param {Object} stats - Statistiques de prières
 * @returns {Object} Statistiques hebdomadaires
 */
function getWeekStatistics(stats) {
    const startOfWeek = moment().startOf('week');
    const endOfWeek = moment().endOf('week');

    let completed = 0;
    let total = 0;

    for (let day = startOfWeek.clone(); day <= endOfWeek; day.add(1, 'day')) {
        const dateKey = day.format('YYYY-MM-DD');
        if (stats.byDate[dateKey]) {
            completed += stats.byDate[dateKey].count;
        }
        total += 5; // 5 prières par jour
    }

    return {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
}

/**
 * Obtient les statistiques du mois
 * @param {Object} stats - Statistiques de prières
 * @returns {Object} Statistiques mensuelles
 */
function getMonthStatistics(stats) {
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');

    let completed = 0;
    let total = 0;

    for (let day = startOfMonth.clone(); day <= endOfMonth; day.add(1, 'day')) {
        const dateKey = day.format('YYYY-MM-DD');
        if (stats.byDate[dateKey]) {
            completed += stats.byDate[dateKey].count;
        }
        total += 5;
    }

    return {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
}

/**
 * Obtient les statistiques d'une période spécifique
 * @param {Object} attributesManager - Gestionnaire d'attributs
 * @param {string} startDate - Date de début (YYYY-MM-DD)
 * @param {string} endDate - Date de fin (YYYY-MM-DD)
 * @returns {Promise<Object>} Statistiques de la période
 */
async function getStatisticsForPeriod(attributesManager, startDate, endDate) {
    const attributes = await attributesManager.getPersistentAttributes();
    const stats = attributes.prayerStats || { byDate: {} };

    const start = moment(startDate);
    const end = moment(endDate);

    let completed = 0;
    let total = 0;
    const dailyBreakdown = [];

    for (let day = start.clone(); day <= end; day.add(1, 'day')) {
        const dateKey = day.format('YYYY-MM-DD');
        const dayData = stats.byDate[dateKey] || { count: 0 };

        completed += dayData.count;
        total += 5;

        dailyBreakdown.push({
            date: dateKey,
            completed: dayData.count,
            prayers: dayData
        });
    }

    return {
        startDate,
        endDate,
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        dailyBreakdown
    };
}

/**
 * Formate un message vocal pour les statistiques
 * @param {Object} stats - Statistiques
 * @param {string} locale - Langue (ar-SA, fr-FR, en-US)
 * @returns {string} Message formaté
 */
function formatStatisticsMessage(stats, locale = 'ar-SA') {
    const messages = {
        'ar-SA': `إحصائياتك: أكملت ${stats.total} صلاة إجمالاً. اليوم أكملت ${stats.todayProgress.completed} من ${stats.todayProgress.total} صلوات. سلسلتك الحالية ${stats.streak} يوم، وأطول سلسلة كانت ${stats.longestStreak} يوم. ما شاء الله، استمر!`,
        'fr-FR': `Vos statistiques: Vous avez accompli ${stats.total} prières au total. Aujourd'hui, vous avez accompli ${stats.todayProgress.completed} prières sur ${stats.todayProgress.total}. Votre série actuelle est de ${stats.streak} jours, et votre plus longue série était de ${stats.longestStreak} jours. Continuez ainsi!`,
        'en-US': `Your statistics: You've completed ${stats.total} prayers in total. Today, you completed ${stats.todayProgress.completed} out of ${stats.todayProgress.total} prayers. Your current streak is ${stats.streak} days, and your longest streak was ${stats.longestStreak} days. Keep it up!`
    };

    return messages[locale] || messages['ar-SA'];
}

/**
 * Génère des données APL pour afficher les statistiques
 * @param {Object} stats - Statistiques
 * @param {string} locale - Langue
 * @returns {Object} Données pour le template APL
 */
function generateStatisticsAPLData(stats, locale = 'ar-SA') {
    return {
        statisticsData: {
            type: 'object',
            properties: {
                total: stats.total,
                todayCompleted: stats.todayProgress.completed,
                todayTotal: stats.todayProgress.total,
                todayPercentage: stats.todayProgress.percentage,
                streak: stats.streak,
                longestStreak: stats.longestStreak,
                weekCompleted: stats.thisWeek.completed,
                weekTotal: stats.thisWeek.total,
                weekPercentage: stats.thisWeek.percentage,
                monthCompleted: stats.thisMonth.completed,
                monthTotal: stats.thisMonth.total,
                monthPercentage: stats.thisMonth.percentage,
                byPrayer: [
                    { name: 'Fajr', nameAr: 'الفجر', count: stats.byPrayer.fajr },
                    { name: 'Dhuhr', nameAr: 'الظهر', count: stats.byPrayer.dhuhr },
                    { name: 'Asr', nameAr: 'العصر', count: stats.byPrayer.asr },
                    { name: 'Maghrib', nameAr: 'المغرب', count: stats.byPrayer.maghrib },
                    { name: 'Isha', nameAr: 'العشاء', count: stats.byPrayer.isha }
                ]
            }
        }
    };
}

/**
 * Réinitialise les statistiques
 * @param {Object} attributesManager - Gestionnaire d'attributs
 * @returns {Promise<void>}
 */
async function resetStatistics(attributesManager) {
    const attributes = await attributesManager.getPersistentAttributes();
    attributes.prayerStats = {
        total: 0,
        byPrayer: {
            fajr: 0,
            dhuhr: 0,
            asr: 0,
            maghrib: 0,
            isha: 0
        },
        byDate: {},
        streak: 0,
        longestStreak: 0,
        lastPrayerDate: null
    };

    attributesManager.setPersistentAttributes(attributes);
    await attributesManager.savePersistentAttributes();
}

/**
 * Exporte les statistiques au format JSON
 * @param {Object} attributesManager - Gestionnaire d'attributs
 * @returns {Promise<string>} Statistiques au format JSON
 */
async function exportStatistics(attributesManager) {
    const attributes = await attributesManager.getPersistentAttributes();
    return JSON.stringify(attributes.prayerStats || {}, null, 2);
}

module.exports = {
    recordPrayerCompleted,
    getStatistics,
    getStatisticsForPeriod,
    formatStatisticsMessage,
    generateStatisticsAPLData,
    resetStatistics,
    exportStatistics
};
