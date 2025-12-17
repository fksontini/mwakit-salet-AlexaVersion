/**
 * Service de gestion des invocations (Duaa) pour les prières
 */

/**
 * Collection des invocations avant et après les prières
 */
const DUAA_COLLECTION = {
    beforePrayer: {
        adhan: {
            arabic: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ، أَشْهَدُ أَنَّ مُحَمَّداً رَسُولُ اللَّهِ',
            transliteration: 'Allahu Akbar Allahu Akbar, Ashhadu an la ilaha illallah, Ashhadu anna Muhammadan Rasulullah',
            translation: {
                ar: 'الله أكبر الله أكبر، أشهد أن لا إله إلا الله، أشهد أن محمداً رسول الله',
                fr: 'Allah est le Plus Grand (2x), J\'atteste qu\'il n\'y a de divinité qu\'Allah, J\'atteste que Muhammad est le Messager d\'Allah',
                en: 'Allah is the Greatest (2x), I bear witness that there is no god but Allah, I bear witness that Muhammad is the Messenger of Allah'
            },
            audio: 'duaa-adhan.mp3'
        },
        afterAdhan: {
            arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلاَةِ الْقَائِمَةِ، آتِ مُحَمَّداً الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَاماً مَحْمُوداً الَّذِي وَعَدْتَهُ',
            transliteration: 'Allahumma Rabba hadhihid-da\'watit-tammah, was-salatil-qa\'imah, ati Muhammadan al-wasilata wal-fadilah, wab\'athu maqaman mahmudan alladhi wa\'adtah',
            translation: {
                ar: 'اللهم رب هذه الدعوة التامة والصلاة القائمة آت محمداً الوسيلة والفضيلة وابعثه مقاماً محموداً الذي وعدته',
                fr: 'Ô Allah, Seigneur de cet appel parfait et de cette prière établie, accorde à Muhammad le Wasila et la prééminence, et ressuscite-le dans la position louable que Tu lui as promise',
                en: 'O Allah, Lord of this perfect call and established prayer, grant Muhammad the Wasila and excellence, and raise him to the praised position You have promised him'
            },
            reward: {
                ar: 'حلت له شفاعتي يوم القيامة',
                fr: 'Mon intercession lui sera garantie le Jour de la Résurrection',
                en: 'My intercession will be guaranteed for him on the Day of Resurrection'
            },
            audio: 'duaa-after-adhan.mp3'
        },
        enteringMosque: {
            arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
            transliteration: 'Allahumma aftah li abwaba rahmatik',
            translation: {
                ar: 'اللهم افتح لي أبواب رحمتك',
                fr: 'Ô Allah, ouvre-moi les portes de Ta miséricorde',
                en: 'O Allah, open for me the gates of Your mercy'
            },
            audio: 'duaa-entering-mosque.mp3'
        }
    },

    afterPrayer: {
        general: {
            arabic: 'أَسْتَغْفِرُ اللهَ (ثلاثاً)، اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
            transliteration: 'Astaghfirullah (3x), Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram',
            translation: {
                ar: 'أستغفر الله (ثلاثاً)، اللهم أنت السلام ومنك السلام، تباركت يا ذا الجلال والإكرام',
                fr: 'Je demande pardon à Allah (3x), Ô Allah, Tu es la Paix et de Toi vient la paix, Tu es béni, Ô Majestueux et Généreux',
                en: 'I seek forgiveness from Allah (3x), O Allah, You are Peace and from You comes peace, blessed are You, O Possessor of Majesty and Honor'
            },
            audio: 'duaa-after-prayer.mp3'
        },
        tasbih: {
            arabic: 'سُبْحَانَ اللهِ (33)، الْحَمْدُ لِلَّهِ (33)، اللهُ أَكْبَرُ (33)، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            transliteration: 'SubhanAllah (33x), Alhamdulillah (33x), Allahu Akbar (33x), La ilaha illallahu wahdahu la sharika lah...',
            translation: {
                ar: 'سبحان الله (33)، الحمد لله (33)، الله أكبر (33)، لا إله إلا الله وحده لا شريك له...',
                fr: 'Gloire à Allah (33x), Louange à Allah (33x), Allah est le Plus Grand (33x), Il n\'y a de divinité qu\'Allah...',
                en: 'Glory be to Allah (33x), Praise be to Allah (33x), Allah is the Greatest (33x), There is no god but Allah...'
            },
            count: 100,
            audio: 'duaa-tasbih.mp3'
        },
        ayatKursi: {
            arabic: 'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ...',
            transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum...',
            translation: {
                ar: 'الله لا إله إلا هو الحي القيوم...',
                fr: 'Allah, point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même...',
                en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer...'
            },
            reward: {
                ar: 'من قرأها دبر كل صلاة لم يمنعه من دخول الجنة إلا أن يموت',
                fr: 'Celui qui la récite après chaque prière, rien ne l\'empêchera d\'entrer au Paradis sauf la mort',
                en: 'Whoever recites it after each prayer, nothing will prevent him from entering Paradise except death'
            },
            audio: 'ayat-kursi.mp3'
        }
    },

    specific: {
        fajr: {
            arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
            transliteration: 'Asbahna wa asbahal-mulku lillah, walhamdulillah, la ilaha illallahu wahdahu la sharika lah',
            translation: {
                ar: 'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له',
                fr: 'Nous voilà au matin et le règne appartient à Allah, louange à Allah, il n\'y a de divinité qu\'Allah, Unique, sans associé',
                en: 'We have entered morning and the kingdom belongs to Allah, praise be to Allah, there is no god but Allah alone, without partner'
            },
            audio: 'duaa-fajr.mp3'
        },
        maghrib: {
            arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
            transliteration: 'Amsayna wa amsal-mulku lillah, walhamdulillah, la ilaha illallahu wahdahu la sharika lah',
            translation: {
                ar: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له',
                fr: 'Nous voilà au soir et le règne appartient à Allah, louange à Allah, il n\'y a de divinité qu\'Allah, Unique, sans associé',
                en: 'We have entered evening and the kingdom belongs to Allah, praise be to Allah, there is no god but Allah alone, without partner'
            },
            audio: 'duaa-maghrib.mp3'
        }
    }
};

/**
 * Obtient le Duaa pour une prière spécifique
 * @param {string} prayerName - Nom de la prière (fajr, dhuhr, asr, maghrib, isha)
 * @param {string} timing - Moment (before, after)
 * @returns {Object} Duaa correspondant
 */
function getDuaaForPrayer(prayerName, timing = 'after') {
    const prayer = prayerName.toLowerCase();

    if (timing === 'before') {
        return DUAA_COLLECTION.beforePrayer.afterAdhan;
    }

    // Duaa spécifiques
    if (DUAA_COLLECTION.specific[prayer]) {
        return DUAA_COLLECTION.specific[prayer];
    }

    // Duaa général après la prière
    return DUAA_COLLECTION.afterPrayer.general;
}

/**
 * Obtient tous les Duaa après la prière
 * @returns {Array} Liste des Duaa
 */
function getAllAfterPrayerDuaa() {
    return Object.values(DUAA_COLLECTION.afterPrayer);
}

/**
 * Formate un message vocal pour le Duaa
 * @param {Object} duaa - Objet Duaa
 * @param {string} locale - Langue (ar-SA, fr-FR, en-US)
 * @returns {string} Message formaté avec SSML
 */
function formatDuaaMessage(duaa, locale = 'ar-SA') {
    const lang = locale.split('-')[0];
    const langMap = { 'ar': 'ar', 'fr': 'fr', 'en': 'en' };
    const l = langMap[lang] || 'ar';

    let message = `<speak>`;

    if (duaa.audio) {
        message += `<audio src="https://your-s3-bucket.s3.amazonaws.com/audio/${duaa.audio}"/>`;
        message += `<break time="500ms"/>`;
    }

    message += `${duaa.arabic}`;
    message += `<break time="1s"/>`;
    message += `${duaa.translation[l]}`;

    if (duaa.reward) {
        message += `<break time="1s"/>`;
        message += `${duaa.reward[l]}`;
    }

    message += `</speak>`;

    return message;
}

/**
 * Génère des données APL pour afficher le Duaa
 * @param {Object} duaa - Objet Duaa
 * @param {string} prayerName - Nom de la prière
 * @param {string} locale - Langue
 * @returns {Object} Données pour le template APL
 */
function generateDuaaAPLData(duaa, prayerName, locale = 'ar-SA') {
    const lang = locale.split('-')[0];
    const langMap = { 'ar': 'ar', 'fr': 'fr', 'en': 'en' };
    const l = langMap[lang] || 'ar';

    return {
        duaaData: {
            type: 'object',
            properties: {
                prayerName: prayerName,
                arabic: duaa.arabic,
                transliteration: duaa.transliteration,
                translation: duaa.translation[l],
                reward: duaa.reward ? duaa.reward[l] : '',
                count: duaa.count || 1,
                hasAudio: !!duaa.audio
            }
        }
    };
}

/**
 * Obtient une séquence complète de Duaa après la prière
 * @returns {Array} Séquence ordonnée de Duaa
 */
function getAfterPrayerSequence() {
    return [
        { step: 1, name: 'Istighfar', duaa: DUAA_COLLECTION.afterPrayer.general },
        { step: 2, name: 'Tasbih', duaa: DUAA_COLLECTION.afterPrayer.tasbih },
        { step: 3, name: 'Ayat al-Kursi', duaa: DUAA_COLLECTION.afterPrayer.ayatKursi }
    ];
}

/**
 * Crée un rappel audio pour le Duaa avant la prière
 * @param {string} prayerName - Nom de la prière
 * @param {string} locale - Langue
 * @returns {string} Message SSML complet
 */
function createPrayerReminderWithDuaa(prayerName, locale = 'ar-SA') {
    const duaa = getDuaaForPrayer(prayerName, 'before');
    const lang = locale.split('-')[0];

    const prayerNames = {
        'ar': { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' },
        'fr': { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' },
        'en': { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' }
    };

    const messages = {
        'ar': `<speak>
            <audio src="https://your-s3-bucket.s3.amazonaws.com/audio/athan-makkah.mp3"/>
            <break time="1s"/>
            حان الآن موعد صلاة ${prayerNames.ar[prayerName]}.
            <break time="1s"/>
            ${duaa.arabic}
            <break time="1s"/>
            حافظ على الصلاة في أوقاتها.
        </speak>`,
        'fr': `<speak>
            <audio src="https://your-s3-bucket.s3.amazonaws.com/audio/athan-makkah.mp3"/>
            <break time="1s"/>
            C'est l'heure de la prière ${prayerNames.fr[prayerName]}.
            <break time="1s"/>
            ${duaa.translation.fr}
            <break time="1s"/>
            Maintenez la prière à ses heures.
        </speak>`,
        'en': `<speak>
            <audio src="https://your-s3-bucket.s3.amazonaws.com/audio/athan-makkah.mp3"/>
            <break time="1s"/>
            It's time for ${prayerNames.en[prayerName]} prayer.
            <break time="1s"/>
            ${duaa.translation.en}
            <break time="1s"/>
            Maintain prayer at its prescribed times.
        </speak>`
    };

    return messages[lang] || messages['ar'];
}

module.exports = {
    DUAA_COLLECTION,
    getDuaaForPrayer,
    getAllAfterPrayerDuaa,
    formatDuaaMessage,
    generateDuaaAPLData,
    getAfterPrayerSequence,
    createPrayerReminderWithDuaa
};
