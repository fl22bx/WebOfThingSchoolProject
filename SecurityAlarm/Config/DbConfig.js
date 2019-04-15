const mongoose = require('mongoose')

/**
 * Initierar databasen
 *
 * @class Database
 */
class Database {
  constructor () {
    this.ConnectionString = process.env.DB_CONNECTION_STRING
  }

  Initialize () {
    mongoose.connect(this.ConnectionString, { useNewUrlParser: true })
    mongoose.set('useCreateIndex', true)
    let db = mongoose.connection

    db.on('connected', () => {
      console.log('Database is running')
    })
  }
}

module.exports = Database
