import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { utilService } from './services/util.service.js'
const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        severity: +req.query.severity || '',
        labels: req.query.labels || ''
    }

    const sortBy = {
        type: req.query.type || '',
        dir: +req.query.dir || 1
    }

    if (req.query.pageIdx) filterBy.pageIdx = req.query.pageIdx


    bugService.query(filterBy, sortBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.post('/api/bug', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)

    if (!loggedInUser) return res.status(401).send('Cannot add car')

    const bugToSave = req.body
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.put('/api/bug', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)

    if (loggedInUser._id !== req.body.creator._id) return res.status(401).send('You are not authorized to update this bug')

    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { visitedBugs = [] } = req.cookies

    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
        else visitedBugs.push(bugId)
    }
    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 70 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    const loggedInUser = userService.validateToken(req.cookies.loginToken)

    bugService.getById(bugId)
        .then(bug => {
            if (loggedInUser._id !== bug.creator._id) return res.status(401).send('You are not authorized to delete this bug')
            console.log('delete....');
            bugService.remove(bug._id)
                .then(() => {
                    loggerService.info(`Bug ${bug._id} removed`)
                    res.send('removed')
                })
                .catch((err) => {
                    loggerService.error('Cannot remove bug', err)
                    res.status(400).send('Cannot remove bug')
                })
        })
})

// user
app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.listen(3030, () => console.log('`Server listening on port http://127.0.0.1:3030/'))
// const PORT = 3030
// app.listen(PORT, () =>
// loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
// )