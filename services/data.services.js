//import 
const jwt = require('jsonwebtoken')

const db = require('./db')

//database 
database = {
  1000: { acno: 1000, uname: "sasi", password: 1000, balance: 1000, transaction: [] },
  1001: { acno: 1001, uname: "soman", password: 1001, balance: 2000, transaction: [] },
  1002: { acno: 1002, uname: "sapi", password: 1002, balance: 3000, transaction: [] },

}

//register -
const register = (uname, acno, password) => {

  return db.User.findOne({ acno })
    .then(user => {
      console.log(user);

      if (user) {
        //already exist 
        return {
          statuscode: 401,
          status: false,
          message: "account alreadt exist...."
        }
      }
      else {
        const newUser = new db.User({
          uname,
          acno,
          password,
          balance: 0,
          transaction: []


        })
        newUser.save()

        return {
          statuscode: 200,
          status: true,
          message: "successfully registered.... please login"
        }
      }
    })
}

//login
const login = (acno, pswd) => {
  // user acno n pswd
  return db.User.findOne({ acno, password: pswd })
    .then(user => {
      if (user) {
        currentUser = user.uname
        currentAcno = acno
        //token generate
        const token = jwt.sign({
          currentAcno: acno
        }, 'secret')

        return {
          statuscode: 200,
          status: true,
          message: "Login successfully.. ",
          token,
          currentAcno,
          currentUser,
          token
        }

      } else {
        return {
          statuscode: 401,
          status: false,
          message: "invalid creditials!!"
        }
      }
    })
}

//deposit 
const deposit = (req, acno, pswd, amt) => {

  var amount = parseInt(amt)

  return db.User.findOne({ acno, password: pswd })
    .then(user => {
      if (req.currentAcno != acno) {
        return {
          statuscode: 422,
          status: false,
          message: "operation denied"
        }
      }

      if (user) {
        user.balance += amount
        user.transaction.push({
          type: "CREDITED",
          amount: amount
        })
        user.save()
        return {
          statuscode: 200,
          status: true,
          message: amount + "..deposited successfully.... And new balace is:" + user.balance
        }
      } else {
        return {
          statuscode: 401,
          status: false,
          message: "invalid creditials!!"
        }
      }
    })
}


//withdraw
const withdraw = (req, acno, pswd, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({ acno, password: pswd })
    .then(user => {
      if (req.currentAcno != acno) {
        return {
          statuscode: 422,
          status: false,
          message: "operation denied"
        }
      }

      if (user) {

        if (user.balance >= amount) {
          user.balance -= amount
          user.transaction.push({
            type: "DEBITED",
            amount: amount
          })
          user.save()
          return {
            statuscode: 200,
            status: true,
            message: amount + "withdrawed successfully.. And new balance is:" + user.balance
          }

        } else {
          return {
            statuscode: 401,
            status: false,
            message: "insufficient balance!!"
          }
        }
      } else {
        return {
          statuscode: 401,
          status: false,
          message: "invalid creditials!!"
        }
      }
    })
}


//transaction
const transaction = (acno) => {
  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statuscode: 200,
          status: true,
          transaction: user.transaction
        }
      } else {
        return {
          statuscode: 401,
          status: false,
          message: "user doesnot exist!!"
        }
      }
    })
}

//deleteAcc
const deleteAcc = (acno) => {
  return db.User.deleteOne({ acno })
    .then(user => {
      if (!user) {
        return {
          statuscode: 401,
          status: false,
          message: "operation failed!!"
        }
      }
      else {
        return {
          statuscode: 200,
          status: true,
          message: "Account Number" + acno + "deleted successfully...."
        }
      }
    })
}

//export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  transaction,
  deleteAcc

}