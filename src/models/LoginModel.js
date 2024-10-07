const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
  constructor(body) {
    this.body = body
    this.errors = []
    this.user = null
  }

  async login() {
    this.valida()
    if (this.errors.length > 0) return

    this.user = await LoginModel.findOne({email: this.body.email})
    if (!this.user) {
      this.errors.push('Usuário inválido')
      return
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida')
      return
    }
  }

  async register() {
    this.valida()
    if (this.errors.length > 0) return

    await this.userExist()
    if (this.errors.length > 0) return

    const salt = bcryptjs.genSaltSync()
    this.body.password = bcryptjs.hashSync(this.body.password, salt)

    try{
      this.user = await LoginModel.create(this.body)
    } catch (e) {
      console.log('Erro in LoginModel/register')
      console.log(e)
    }
  }

  async userExist() {
    const user = await LoginModel.findOne({email: this.body.email})
    if (user) this.errors.push('Usário já existe.')
  }

  valida() {
    this.clean()

    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')

    if (this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('Senha precisa ter entre 3 e 50 caracteres')
  }

  clean() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = ''
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login
