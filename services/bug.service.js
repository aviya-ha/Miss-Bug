import fs from 'fs'

import { utilService } from './util.service.js'
export const bugService = {
    query,
    // getById,
    // remove,
    // save
}

const cars = utilService.readJsonFile('data/bugs.json')
function query() {
    return Promise.resolve(cars)
}

// function getById(id) {
//     const car = cars.find(car => car._id === id)
//     if (!car) return Promise.reject('Car does not exist!')
//     return Promise.resolve(car)
// }

// function remove(id) {
//     const carIdx = cars.findIndex(car => car._id === id)
//     cars.splice(carIdx, 1)
//     return _saveCarsToFile()

// }

// function save(car) {
//     if (car._id) {
//         const carIdx = cars.findIndex(_car => _car._id === car._id)
//         cars[carIdx] = car
//     } else {
//         car._id = utilService.makeId()
//         car.desc = utilService.makeLorem()
//         cars.unshift(car)
//     }
//     return _saveCarsToFile().then(() => car)
// }


// function _saveCarsToFile() {
//     return new Promise((resolve, reject) => {
//         const data = JSON.stringify(cars, null, 4)
//         fs.writeFile('data/car.json', data, (err) => {
//             if (err) {
//                 console.log(err)
//                 return reject(err)
//             }
//             resolve()
//         })
//     })
// }