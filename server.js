import express from 'express'
import cookieParser from 'cookie-parser'
import { loggerService } from './services/logger.service.js'

import { bugService } from './services/bug.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())


app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bug/save', (req, res) => {

    loggerService.debug('req.query', req.query)


    const bugToSave = {
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description,
        _id: req.query.bugId,
        createdAt: req.query.createdAt
    }
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

    console.log('visitedBugs', visitedBugs)
    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
        else visitedBugs.push(bugId)
    }

    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 70 })


    console.log('bugId:', bugId)
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    console.log('delete....');
    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)

            res.send(bugId)
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})


app.listen(3030, () => console.log('`Server listening on port http://127.0.0.1:3030/'))
// const PORT = 3030
// app.listen(PORT, () =>
    // loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
// )