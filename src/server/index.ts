import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import generate from './routes/generate'

const app = new Hono().basePath('/api')

app.route('/', generate)

app.get('/hello', (c) => {
    return c.json({
        message: 'Hello from Hono!'
    })
})

export default app
