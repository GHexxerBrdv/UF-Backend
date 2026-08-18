import express from 'express';
import router from './routes/routes.js';
import corse from 'cors';
import DBConnection from './database/db.js';

const app = express();
app.use(corse());
app.use('/',router)
const PORT = 8000;

DBConnection();
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})