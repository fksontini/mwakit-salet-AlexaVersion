/**
 * Service de calcul de la direction de la Qibla
 * Utilise les coordonnées GPS pour calculer la direction vers la Kaaba à La Mecque
 */

// Coordonnées de la Kaaba à La Mecque
const KAABA_COORDINATES = {
    latitude: 21.4225,
    longitude: 39.8262
};

/**
 * Convertit des degrés en radians
 * @param {number} degrees - Angle en degrés
 * @returns {number} Angle en radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convertit des radians en degrés
 * @param {number} radians - Angle en radians
 * @returns {number} Angle en degrés
 */
function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Calcule la direction de la Qibla depuis une position donnée
 * @param {number} latitude - Latitude de la position actuelle
 * @param {number} longitude - Longitude de la position actuelle
 * @returns {Object} Direction de la Qibla avec angle et direction cardinale
 */
function calculateQiblaDirection(latitude, longitude) {
    const lat1 = toRadians(latitude);
    const lon1 = toRadians(longitude);
    const lat2 = toRadians(KAABA_COORDINATES.latitude);
    const lon2 = toRadians(KAABA_COORDINATES.longitude);

    // Formule de calcul de l'azimut
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let bearing = Math.atan2(y, x);
    bearing = toDegrees(bearing);
    bearing = (bearing + 360) % 360;

    return {
        degrees: Math.round(bearing * 100) / 100,
        cardinalDirection: getCardinalDirection(bearing),
        distance: calculateDistance(latitude, longitude, KAABA_COORDINATES.latitude, KAABA_COORDINATES.longitude)
    };
}

/**
 * Calcule la distance entre deux points GPS (formule de Haversine)
 * @param {number} lat1 - Latitude du point 1
 * @param {number} lon1 - Longitude du point 1
 * @param {number} lat2 - Latitude du point 2
 * @param {number} lon2 - Longitude du point 2
 * @returns {number} Distance en kilomètres
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance);
}

/**
 * Convertit un angle en direction cardinale
 * @param {number} degrees - Angle en degrés
 * @returns {Object} Direction cardinale en différentes langues
 */
function getCardinalDirection(degrees) {
    const directions = [
        { ar: 'شمال', fr: 'Nord', en: 'North', abbr: 'N' },
        { ar: 'شمال شرق', fr: 'Nord-Est', en: 'North-East', abbr: 'NE' },
        { ar: 'شرق', fr: 'Est', en: 'East', abbr: 'E' },
        { ar: 'جنوب شرق', fr: 'Sud-Est', en: 'South-East', abbr: 'SE' },
        { ar: 'جنوب', fr: 'Sud', en: 'South', abbr: 'S' },
        { ar: 'جنوب غرب', fr: 'Sud-Ouest', en: 'South-West', abbr: 'SW' },
        { ar: 'غرب', fr: 'Ouest', en: 'West', abbr: 'W' },
        { ar: 'شمال غرب', fr: 'Nord-Ouest', en: 'North-West', abbr: 'NW' }
    ];

    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

/**
 * Obtient la direction de la Qibla depuis une ville
 * @param {string} city - Nom de la ville
 * @param {string} country - Nom du pays
 * @returns {Promise<Object>} Direction de la Qibla
 */
async function getQiblaDirectionByCity(city, country) {
    // Cette fonction nécessiterait une API de géocodage pour convertir ville -> coordonnées
    // Pour simplifier, on retourne un exemple
    // En production, utilisez Google Maps API ou similaire

    // Coordonnées d'exemple (Paris)
    const coordinates = {
        'Paris': { lat: 48.8566, lon: 2.3522 },
        'Riyadh': { lat: 24.7136, lon: 46.6753 },
        'Dubai': { lat: 25.2048, lon: 55.2708 },
        'Cairo': { lat: 30.0444, lon: 31.2357 },
        'Istanbul': { lat: 41.0082, lon: 28.9784 },
        'London': { lat: 51.5074, lon: -0.1278 },
        'New York': { lat: 40.7128, lon: -74.0060 }
    };

    const coords = coordinates[city] || { lat: 48.8566, lon: 2.3522 };
    return calculateQiblaDirection(coords.lat, coords.lon);
}

/**
 * Génère un message vocal pour annoncer la direction de la Qibla
 * @param {Object} qiblaData - Données de la Qibla
 * @param {string} locale - Langue (ar-SA, fr-FR, en-US)
 * @returns {string} Message formaté
 */
function formatQiblaMessage(qiblaData, locale = 'ar-SA') {
    const messages = {
        'ar-SA': `اتجاه القبلة هو ${qiblaData.cardinalDirection.ar}، بزاوية ${qiblaData.degrees} درجة. المسافة إلى الكعبة المشرفة حوالي ${qiblaData.distance} كيلومتر.`,
        'fr-FR': `La direction de la Qibla est ${qiblaData.cardinalDirection.fr}, à ${qiblaData.degrees} degrés. La distance jusqu'à la Kaaba est d'environ ${qiblaData.distance} kilomètres.`,
        'en-US': `The Qibla direction is ${qiblaData.cardinalDirection.en}, at ${qiblaData.degrees} degrees. The distance to the Kaaba is approximately ${qiblaData.distance} kilometers.`
    };

    return messages[locale] || messages['ar-SA'];
}

/**
 * Génère des données APL pour afficher la boussole de la Qibla
 * @param {Object} qiblaData - Données de la Qibla
 * @param {string} city - Nom de la ville
 * @returns {Object} Données pour le template APL
 */
function generateQiblaAPLData(qiblaData, city) {
    return {
        qiblaData: {
            type: 'object',
            properties: {
                city: city,
                degrees: qiblaData.degrees,
                direction: qiblaData.cardinalDirection.ar,
                directionEn: qiblaData.cardinalDirection.en,
                directionFr: qiblaData.cardinalDirection.fr,
                distance: qiblaData.distance,
                kaabaLat: KAABA_COORDINATES.latitude,
                kaabaLon: KAABA_COORDINATES.longitude,
                compassRotation: qiblaData.degrees
            }
        }
    };
}

module.exports = {
    calculateQiblaDirection,
    calculateDistance,
    getCardinalDirection,
    getQiblaDirectionByCity,
    formatQiblaMessage,
    generateQiblaAPLData,
    KAABA_COORDINATES
};
