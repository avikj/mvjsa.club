module.exports = {
  mongodbUrl: (process.env.OPENSHIFT_MONGODB_DB_URL || 'localhost/')+(process.env.MONGODB_DATABASE || 'mvjsa')
}
