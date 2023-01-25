const express = require('express')
const app = express()
const port =  process.env.APP_PORT || 3000

const pg_host =  process.env.PG_HOST || "localhost"
const pg_port =  process.env.PG_PORT || 5432

const pg_username =  process.env.PG_USERNAME || "postgres"
const pg_password =  process.env.PG_PASSWORD || "12345678"
const pg_db =  process.env.PG_DB || "my_db"


app.listen(port, "0.0.0.0", () => {
  console.log(`App running on port ${port}.`)
})


const Pool = require('pg').Pool
const pool = new Pool({
  user: pg_username,
  host: pg_host,
  database: pg_db,
  password: pg_password,
  port: pg_port,
})


const writeIp = (request, response) => {
	var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress 
	console.log(`Req from ${ip}.`)
	pool.query('INSERT INTO applog (ip) VALUES ($1) RETURNING *', [ip], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(`IP added with data: ${results.rows[0].ip}`)
  })
}


app.get('/', writeIp)