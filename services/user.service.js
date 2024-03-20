import fs from 'fs'
import Cryptr from 'cryptr'
import { utilService } from './util.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-aviya-unpredictable')
const users = utilService.readJsonFile('data/user.json')

export const userService = {
    save,
    getLoginToken,
    checkLogin,
    validateToken
}


function save(user) {
    user = {
        username: '',
        password: '',
        fullname: '',
        isAdmin: false,
    }
    user._id = utilService.makeId()
    users.push(user)
    return _saveUsersToFile().then(() => user)

}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const usersStr = JSON.stringify(users, null, 4)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}

function checkLogin({ username, password }) {
    var user = users.find(user => user.username === 'user1')   //later//
    if (user) {
        user = {
            _id : user._id,
            fullname : user.fullname,
            isAdmin : user.isAdmin,
        }
    }
    return Promise.resolve(user)
}

function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    const str = cryptr.decrypt(token)
    const user = JSON.parse(str)
    return user
}
