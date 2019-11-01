"use strict"

require('./env')()

const app = require('../src/server')

app.listen(3100, function(err) {
  if (err) {
    console.log('failed to start server!!!')
    console.log(err)
  } else {
    console.log('------------------------------------------------------------')
    console.log('- @realmjs/account-restapi server is running at port 3100')
    console.log('------------------------------------------------------------')
  }
})
