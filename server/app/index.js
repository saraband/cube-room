require('dotenv').config()

import app, { serverPath } from '@app/server'

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`\n\nServer ready localhost:4000${serverPath}\n\n`)
})