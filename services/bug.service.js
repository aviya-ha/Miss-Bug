import fs from 'fs'

import { utilService } from './util.service.js'
let bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}
const PAGE_SIZE = 2


function query(filterBy = { txt: '', minSeverity: 0 },sortBy  = { type: '', desc: 1 }) {
    let bugsToReturn = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }

    if (filterBy.severity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.severity)
    }

    if (filterBy.labels) {
        const labelsToFilter = filterBy.labels
        bugsToReturn = bugsToReturn.filter(bug =>
            labelsToFilter.every(label => bug.labels.includes(label)))
    }

    if (sortBy.type === 'createdAt') {
        bugsToReturn.sort((b1, b2) => (+sortBy.dir) * (b1.createdAt - b2.createdAt))
    } else if(sortBy.type === 'severity'){
        bugsToReturn.sort((b1, b2) => (+sortBy.dir) * (b1.severity - b2.severity))
    }

    if (filterBy.pageIdx !== undefined) {
        // if (PAGE_SIZE <= 0) PAGE_SIZE = 1
        const startIdx = filterBy.pageIdx * PAGE_SIZE;
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(bugsToReturn)
}

function getById(id) {
    const bug = bugs.find(bug => bug._id === id)
    if (!bug) return Promise.reject('Bug does not exist!')
    return Promise.resolve(bug)
}

function remove(id) {
    console.log(':sad')
    const bugIdx = bugs.findIndex(bug => bug._id === id)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        // bug.description = bug.description ? bug.description : utilService.makeLorem()
        bug.createdAt = Date.now()
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}