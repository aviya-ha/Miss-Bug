
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'


_createBugs()

export const bugService = {
    query,
    getById,
    remove,
    save,
    getDefaultFilter,
    getEmptyBug,
    getFilterFromParams
}


function query(filterBy = getDefaultFilter()) {
    return axios.get(BASE_URL, { params: filterBy })
    .then(res => res.data)
    
}


function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err)
        })
}

function remove(bugId) {
    console.log(':asdss' )
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
   console.log('bug:', bug)
    if (bug._id) {
        return axios.put(BASE_URL, bug)
    } else {
        return axios.post(BASE_URL, bug)
    }
}

function getEmptyBug(title ='', description= '', severity= 5) {
    return { title, description, severity }
}

function getDefaultFilter() {
    return { txt: '', severity: ''}
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        txt: searchParams.get('txt') || defaultFilter.txt,
        severity: searchParams.get('severity') || defaultFilter.severity,
        // desc: searchParams.get('desc') || defaultFilter.desc
    }
}


function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                description: 'cant stop looking for what you are looking for',
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                description: 'cant find what you are looking for',
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                description: 'cant continue existing',
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                severity: 1,
                description: 'found something strange',
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }
}

