const dotenv = require('dotenv');
dotenv.config();

const getMicroserviceUrls = () => ({
    idp: process.env.IDP_URL || "http://localhost:3001",
    videoProvider: process.env.VIDEO_PROVIDER_URL || "http://localhost:3002",
});

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGO_URI,
    microserviceUrls: getMicroserviceUrls(),
};
