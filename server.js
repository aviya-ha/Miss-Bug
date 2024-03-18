import express from 'express'
import { bugService } from './services/bug.service.js'

const app = express()

app.get('/', (req, res) => res.send('Aviya!!'))


app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            // loggerService.error('Cannot get cars', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description,
        _id: req.query._id,
        createdAt: req.query.createdAt
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            // loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})
app.get('/api/bug/:bugId', (req, res) => { })
app.get('/api/bug/:bugId/remove', (req, res) => { })


app.listen(3030, () => console.log('Server ready at port 3030'))