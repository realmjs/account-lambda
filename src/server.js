"use strict"

// get api
const api = require("@realmjs/account-restapi")

// link Database driver to helpers
const DatabaseHelper = require('@realmjs/dynamodb-helper')
const dbh = new DatabaseHelper({ region: process.env.REGION, endpoint: process.env.ENDPOINT })
dbh.addTable('USERS', {indexes: ['LOGIN']})
api.helpers({ Database: dbh.drivers})

// assign alert function to helpers
api.helpers({ alert : msg => console.log(msg) })

// assign sendEmail to helpers
const templates = {
  verifyemail: {"charset":"UTF-8","subject":"Verify your email registered at {{service}}","body":"\n<html>\n<head></head>\n<body>\n<p>Dear {{customer}},</p>\n<p>Your email is registered to use services provided by <b> {{service}} </b> </p>\n<p>To verify that you are the owner of this email, please go to the following URL</p>\n<a href='{{endpoint}}?email={{email}}&t={{token}}' > {{endpoint}}?email={{email}}&t={{token}} </a>\n<p> This link expires 24 hours after your original request </p>\n<p style=\"color: red\"> Notes: If you did not register this email at our service, please DO NOT click on the link. We are sorry for the inconvenience </p>\n<p> This email is auto-generated. Please <b>do not reply</b> this email.</p>\n<p> Sincerely, </p>\n<p> {{signature}} </p>\n</body>\n</html>"},
  resetemail: {"charset":"UTF-8","subject":"Reset Password link generated","body":"\n<html>\n<head></head>\n<body>\n<p>Dear {{customer}},</p>\n<p>We have received a request to reset your password at <b> {{service}} </b> </p>\n<p>If you requested this, please go to the following URL to enter your new password</p>\n<a href='{{endpoint}}&t={{token}}' > {{endpoint}}&t={{token}} </a>\n<p> This link expires 24 hours after your original request </p>\n<p> If you did NOT request to reset password, please do not click on the link. We are sorry for the inconvenience </p>\n<p> This email is auto-generated. Please <b>do not reply</b> this email.</p>\n<p> Sincerely, </p>\n<p> {{signature}} </p>\n</body>\n</html>"}
}
const aws = require('aws-sdk')
const lambda = new aws.Lambda()
api.helpers({ sendEmail: ({recipient, template, data}) => {
  const receiver = recipient[0] // currently, only one recipient
  data.service = process.env.SERVICE_NAME
  data.signature = process.env.SIGNATURE
  const event = {
    sender: {name: process.env.SENDER_NAME, address: process.env.SENDER_ADDRESS},
    recipient: receiver,
    template: templates[template],
    data
  }
  return new Promise( (resolve, reject) => {
    lambda.invoke( {
      FunctionName: 'sendEmailFn',
      InvocationType: "Event",
      Payload: JSON.stringify(event, null, 2)
    }, function(err) {
        if (err) { reject(err) }
        else { resolve() }
    })
  })
}})

/* create express server */
const express = require('express')
const app = express()
app.use('/', api.generate())


module.exports = app
