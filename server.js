let initialized = false
let app, server, wss
require('dotenv').config();
module.exports = (bot) => {
    const express = require('express')
    const http = require('http')
    const WebSocket = require('ws')
    const crypto = require('crypto')
    const bodyParser = require('body-parser')

    const PASSWORD = process.env['webpass']
    const PASSWORD_HASH = crypto.createHash('sha256').update(PASSWORD).digest('hex')

    if (!initialized) {
        initialized = true
        app = express()
        server = http.createServer(app)
        wss = new WebSocket.Server({ noServer: true })

        app.use(express.static('public'))
        app.use(bodyParser.json())

        const verifiedClients = new Set()

        app.post('/auth', (req, res) => {
            const { password } = req.body
            const hash = crypto.createHash('sha256').update(password).digest('hex')
            if (hash === PASSWORD_HASH) {
                const token = crypto.randomBytes(16).toString('hex')
                verifiedClients.add(token)
                setTimeout(() => verifiedClients.delete(token), 300000) // expires in 5 min
                res.json({ token })
            } else {
                res.status(403).json({ error: 'Invalid password' })
            }
        })

        server.on('upgrade', (req, socket, head) => {
            const url = new URL(req.url, `http://${req.headers.host}`)
            const token = url.searchParams.get('token')

            if (verifiedClients.has(token)) {
                wss.handleUpgrade(req, socket, head, ws => {
                    wss.emit('connection', ws, req)
                })
            } else {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
                socket.destroy()
            }
        })

        wss.on('connection', ws => {
            const interval = setInterval(() => {
                const messages = Object.values(bot.bots).map(b => ({
                    server: b.server.name,
                    TRUST: b.hash.trust,
                    ADMIN: b.hash.admin,
                    OWNER: b.hash.owner
                }))
                ws.send(JSON.stringify(messages))
            }, 300)

            ws.on('close', () => clearInterval(interval))
        })

        server.listen(3000)
    }
}
