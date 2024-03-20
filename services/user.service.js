import fs from 'fs'
import { utilService } from './util.service.js'

const users = utilService.readJsonFile('data/user.json')

export const userService = {
    save,
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

