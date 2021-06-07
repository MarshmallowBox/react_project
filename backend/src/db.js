import pg from 'pg';
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();
const { PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT, ENV_LOAD } = process.env;

console.log(ENV_LOAD);


const pool = new Pool({
    user : PGUSER,
    host : PGHOST,
    database : PGDATABASE,
    password : PGPASSWORD,
    port : PGPORT,
});

export const query = async(q, data) => {
    return await pool.query(q, data);
};