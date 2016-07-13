module.exports = {
  mongodbUrl: (process.env.OPENSHIFT_MONGODB_DB_URL || 'localhost/')+(process.env.OPENSHIFT_APP_NAME || 'mvjsa')
}