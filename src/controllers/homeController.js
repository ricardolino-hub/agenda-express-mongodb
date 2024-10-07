const { async } = require('regenerator-runtime')
const Contact = require('../models/ContactModel')

exports.index = async (req, res) => {
  try {
    const contacts = await Contact.findAll()
    res.render('index', { contacts })
  } catch (e) {
    console.log(e)
    res.render('404')
  }
}
