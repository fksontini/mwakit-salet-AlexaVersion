/**
 * Service de gestion des Dhikr (invocations) quotidiens
 */

/**
 * Collection de Dhikr avec traductions
 */
const DHIKR_COLLECTION = [
    {
        id: 1,
        category: 'morning',
        arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
        transliteration: 'SubhanAllahi wa bihamdihi',
        translation: {
            ar: 'سبحان الله وبحمده',
            fr: 'Gloire et louange à Allah',
            en: 'Glory and praise be to Allah'
        },
        reward: {
            ar: 'من قالها مائة مرة حُطَّتْ خطاياه وإن كانت مثل زبد البحر',
            fr: 'Celui qui la récite 100 fois, ses péchés seront effacés même s\'ils sont comme l\'écume de la mer',
            en: 'Whoever says it 100 times, his sins will be forgiven even if they are like the foam of the sea'
        },
        count: 100,
        time: 'morning'
    },
    {
        id: 2,
        category: 'morning',
        arabic: 'سُبْحَانَ اللهِ وَالْحَمْدُ لِلَّهِ وَلاَ إِلَهَ إِلاَّ اللهُ وَاللهُ أَكْبَرُ',
        transliteration: 'SubhanAllah, walhamdulillah, wa la ilaha illallah, wallahu akbar',
        translation: {
            ar: 'سبحان الله والحمد لله ولا إله إلا الله والله أكبر',
            fr: 'Gloire à Allah, louange à Allah, il n\'y a de divinité qu\'Allah, Allah est le plus Grand',
            en: 'Glory be to Allah, praise be to Allah, there is no god but Allah, Allah is the Greatest'
        },
        reward: {
            ar: 'أحب الكلام إلى الله',
            fr: 'Les paroles les plus aimées d\'Allah',
            en: 'The most beloved words to Allah'
        },
        count: 33,
        time: 'after_prayer'
    },
    {
        id: 3,
        category: 'evening',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: 'A\'udhu bikalimatillahit-tammati min sharri ma khalaq',
        translation: {
            ar: 'أعوذ بكلمات الله التامات من شر ما خلق',
            fr: 'Je cherche refuge auprès des paroles parfaites d\'Allah contre le mal de ce qu\'Il a créé',
            en: 'I seek refuge in the perfect words of Allah from the evil of what He has created'
        },
        reward: {
            ar: 'من قالها لم يضره شيء',
            fr: 'Celui qui la dit ne sera pas touché par le mal',
            en: 'Whoever says it will not be harmed by anything'
        },
        count: 3,
        time: 'evening'
    },
    {
        id: 4,
        category: 'general',
        arabic: 'لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku walahul-hamdu wahuwa \'ala kulli shay\'in qadir',
        translation: {
            ar: 'لا إله إلا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير',
            fr: 'Il n\'y a de divinité qu\'Allah, Unique, sans associé. A Lui la royauté, à Lui la louange et Il est capable de toute chose',
            en: 'There is no god but Allah alone, without partner. His is the dominion and His is the praise, and He is capable of all things'
        },
        reward: {
            ar: 'من قالها عشر مرات كمن أعتق أربعة أنفس من ولد إسماعيل',
            fr: 'Celui qui la dit 10 fois, c\'est comme s\'il avait affranchi quatre esclaves des descendants d\'Ismaël',
            en: 'Whoever says it 10 times, it is as if he freed four slaves from the descendants of Ismail'
        },
        count: 10,
        time: 'anytime'
    },
    {
        id: 5,
        category: 'morning',
        arabic: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلاَئِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ',
        transliteration: 'Allahumma inni asbaḥtu ushhiduka wa ushhidu ḥamalata \'arshika wa mala\'ikataka wa jami\'a khalqika annaka antallahu la ilaha illa anta wa anna Muhammadan \'abduka wa rasuluk',
        translation: {
            ar: 'اللهم إني أصبحت أشهدك وأشهد حملة عرشك وملائكتك وجميع خلقك أنك أنت الله لا إله إلا أنت وأن محمداً عبدك ورسولك',
            fr: 'Ô Allah, je Te prends à témoin ainsi que les porteurs de Ton Trône, Tes anges et toutes Tes créatures que Tu es Allah, il n\'y a de divinité que Toi et que Muhammad est Ton serviteur et Ton messager',
            en: 'O Allah, I bear witness to You and I call to witness the bearers of Your Throne, Your angels and all Your creation that You are Allah, there is no god but You, and that Muhammad is Your servant and messenger'
        },
        reward: {
            ar: 'من قالها مرة أعتق الله ربعه من النار',
            fr: 'Celui qui la dit une fois, Allah affranchit un quart de lui du Feu',
            en: 'Whoever says it once, Allah will free a quarter of him from the Fire'
        },
        count: 4,
        time: 'morning'
    },
    {
        id: 6,
        category: 'before_sleep',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amutu wa ahya',
        translation: {
            ar: 'باسمك اللهم أموت وأحيا',
            fr: 'En Ton nom, Ô Allah, je meurs et je vis',
            en: 'In Your name, O Allah, I die and I live'
        },
        reward: {
            ar: 'دعاء قبل النوم',
            fr: 'Invocation avant de dormir',
            en: 'Supplication before sleep'
        },
        count: 1,
        time: 'before_sleep'
    },
    {
        id: 7,
        category: 'ayat_kursi',
        arabic: 'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ',
        transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta\'khudhuhu sinatun wala nawm, lahu ma fis-samawati wa ma fil-ard',
        translation: {
            ar: 'الله لا إله إلا هو الحي القيوم',
            fr: 'Allah, point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même',
            en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence'
        },
        reward: {
            ar: 'من قرأها في ليلة لم يزل عليه من الله حافظ',
            fr: 'Celui qui la récite la nuit, Allah le protégera',
            en: 'Whoever recites it at night, Allah will protect him'
        },
        count: 1,
        time: 'before_sleep'
    },
    {
        id: 8,
        category: 'istighfar',
        arabic: 'أَسْتَغْفِرُ اللهَ الَّذِي لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
        transliteration: 'Astaghfirullah alladhi la ilaha illa Huwal-Hayyul-Qayyum wa atubu ilayh',
        translation: {
            ar: 'أستغفر الله الذي لا إله إلا هو الحي القيوم وأتوب إليه',
            fr: 'Je demande pardon à Allah, il n\'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même, et je me repens à Lui',
            en: 'I seek forgiveness from Allah, there is no god but Him, the Ever-Living, the Sustainer, and I repent to Him'
        },
        reward: {
            ar: 'يغفر له وإن كان فر من الزحف',
            fr: 'Il lui sera pardonné même s\'il a fui le combat',
            en: 'He will be forgiven even if he fled from battle'
        },
        count: 100,
        time: 'anytime'
    }
];

/**
 * Obtient le Dhikr du jour
 * @param {string} category - Catégorie (morning, evening, general, etc.)
 * @returns {Object} Dhikr sélectionné
 */
function getDailyDhikr(category = 'general') {
    const filtered = DHIKR_COLLECTION.filter(d => d.category === category || d.time === category);
    const dhikrs = filtered.length > 0 ? filtered : DHIKR_COLLECTION;

    // Sélection basée sur le jour de l'année pour avoir un dhikr différent chaque jour
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % dhikrs.length;

    return dhikrs[index];
}

/**
 * Obtient un Dhikr aléatoire
 * @returns {Object} Dhikr aléatoire
 */
function getRandomDhikr() {
    const randomIndex = Math.floor(Math.random() * DHIKR_COLLECTION.length);
    return DHIKR_COLLECTION[randomIndex];
}

/**
 * Obtient des Dhikr par moment de la journée
 * @param {string} time - Moment (morning, evening, after_prayer, before_sleep, anytime)
 * @returns {Array} Liste de Dhikr
 */
function getDhikrByTime(time) {
    return DHIKR_COLLECTION.filter(d => d.time === time || d.time === 'anytime');
}

/**
 * Formate un message vocal pour le Dhikr
 * @param {Object} dhikr - Objet Dhikr
 * @param {string} locale - Langue (ar-SA, fr-FR, en-US)
 * @returns {string} Message formaté
 */
function formatDhikrMessage(dhikr, locale = 'ar-SA') {
    const lang = locale.split('-')[0];
    const langMap = { 'ar': 'ar', 'fr': 'fr', 'en': 'en' };
    const l = langMap[lang] || 'ar';

    const messages = {
        'ar': `ذكر اليوم: ${dhikr.arabic}. ${dhikr.translation.ar}. ${dhikr.reward.ar}. يُكرر ${dhikr.count} مرة.`,
        'fr': `Dhikr du jour: ${dhikr.arabic}. Traduction: ${dhikr.translation.fr}. Mérite: ${dhikr.reward.fr}. À répéter ${dhikr.count} fois.`,
        'en': `Daily Dhikr: ${dhikr.arabic}. Translation: ${dhikr.translation.en}. Reward: ${dhikr.reward.en}. Repeat ${dhikr.count} times.`
    };

    return messages[l];
}

/**
 * Génère des données APL pour afficher le Dhikr
 * @param {Object} dhikr - Objet Dhikr
 * @param {string} locale - Langue
 * @returns {Object} Données pour le template APL
 */
function generateDhikrAPLData(dhikr, locale = 'ar-SA') {
    const lang = locale.split('-')[0];
    const langMap = { 'ar': 'ar', 'fr': 'fr', 'en': 'en' };
    const l = langMap[lang] || 'ar';

    return {
        dhikrData: {
            type: 'object',
            properties: {
                arabic: dhikr.arabic,
                transliteration: dhikr.transliteration,
                translation: dhikr.translation[l],
                reward: dhikr.reward[l],
                count: dhikr.count,
                category: dhikr.category,
                time: dhikr.time
            }
        }
    };
}

/**
 * Planifie des rappels quotidiens de Dhikr
 * @param {string} time - Moment préféré (morning, evening)
 * @returns {Array} Liste des moments de rappel
 */
function scheduleDhikrReminders(time = 'morning') {
    const schedules = {
        'morning': [
            { time: '07:00', category: 'morning', name: 'Morning Dhikr' },
            { time: '09:00', category: 'general', name: 'General Dhikr' }
        ],
        'evening': [
            { time: '18:00', category: 'evening', name: 'Evening Dhikr' },
            { time: '21:00', category: 'before_sleep', name: 'Before Sleep Dhikr' }
        ],
        'both': [
            { time: '07:00', category: 'morning', name: 'Morning Dhikr' },
            { time: '18:00', category: 'evening', name: 'Evening Dhikr' },
            { time: '21:00', category: 'before_sleep', name: 'Before Sleep Dhikr' }
        ]
    };

    return schedules[time] || schedules['morning'];
}

module.exports = {
    DHIKR_COLLECTION,
    getDailyDhikr,
    getRandomDhikr,
    getDhikrByTime,
    formatDhikrMessage,
    generateDhikrAPLData,
    scheduleDhikrReminders
};
