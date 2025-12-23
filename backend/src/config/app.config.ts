export default () => ({
    port: parseInt(process.env.PORT, 10) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/file-storage?authSource=admin',
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 107374182400, // 100GB
        path: process.env.UPLOAD_PATH || './uploads',
    },
    app: {
        url: process.env.APP_URL || 'http://localhost:3001',
    },
});
