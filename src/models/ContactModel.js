const mongoose = require('mongoose')
const validator = require('validator')

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: false, deafult: ''},
  email: { type: String, required: false, deafult: ''},
  phone: { type: String, required: false, deafult: ''},
  createAt: { type: Date, require: false, default: Date.now },
})

const ContactModel = mongoose.model('Contact', ContactSchema)

class Contact {
  constructor(body) {
    this.body = body
    this.errors = []
    this.contact = null
  }

  async register() {
    this.valida()
    if (this.errors.length > 0) return

    this.contact = await ContactModel.create(this.body)
  }

  valida() {
    this.clean()

    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')
    if (!this.body.name) this.errors.push('Nome é um campo obrigatório')
    if (!this.body.phone && !this.body.email) this.errors.push('Enviar ao menos e-mail ou telefone')
  }

  clean() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = ''
      }
    }

    this.body = {
      name: this.body.name,
      lastName: this.body.lastName,
      email: this.body.email,
      phone: this.body.phone
    }
  }

  static async findId(id) {
    try{
      const user = await ContactModel.findById(id)
      return user
    } catch (e) {
      console.log(e);
      return
    }
  }

  async edit(id) {
    if (typeof id !== 'string') return
    this.valida()
    if (this.errors.length > 0) return
    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true })
  }

  static async findAll() {
    try{
      const contacts = await ContactModel.find()
        .sort({ createAt: -1 })
      return contacts
    }catch (e) {
      console(e)
      return
    }
  }

  static async delete(id) {
    if (typeof id !== 'string') return
    try{
      const contact = await ContactModel.findByIdAndRemove(id)
      return contact
    }catch (e) {
      console(e)
      return
    }
  }
}

module.exports = Contact
