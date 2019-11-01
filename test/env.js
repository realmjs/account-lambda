"use strict"

const fs = require('fs')
const path = require('path')

module.exports = function env(location) {
  const root = location || __dirname
  try {
    const env = fs.readFileSync(path.join(root, '../', '.env'), {encoding: 'utf-8'})
    const envList = env.split('\n')
                      .map( item => item.trim().replace(/\/$/, '') )
                      .filter( item => item.length > 0 && !/^#/.test(item))
    envList.forEach(ev => {
      const [key, value] = ev.split('=').map(i => i.trim().replace(/(^"|"$)/g,''))
      process.env[key] = value
    })
  } catch (err) {
    console.warn("WARNING: No local environment imported")
  }

}
