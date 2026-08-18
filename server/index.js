import express from 'express';
import router from './routes/routes.js';
import cors from 'cors';
import DBConnection, { initPool } from './database/db.js';
import { initS3Config } from './utils/upload.js';
import dotenv from 'dotenv';
import AWS from "aws-sdk";

dotenv.config();


const ssm = new AWS.SSM();

async function getSecret(name) {
    try {
        const params = {
            Name: name,
            WithDecryption: true
        };
        const res =  await ssm.getParameter(params).promise();
        return res.Parameter.Value;
    } catch(error) {
        console.error("Error while fetching secret ",error)
        throw error;
    }
}

const region = await getSecret("/uf/aws_region");
const port = await getSecret("/uf/port");
const host = await getSecret("/uf/db/host");
const dbName = await getSecret("/uf/db/name");
const password = await getSecret("/uf/db/password");
const userName = await getSecret("/uf/db/username");
const aws_access_key_id = await getSecret("/uf/aws_access_key_id");
const aws_secret_access_key = await getSecret("/uf/aws_secret_access_key");
const bucket_name = await getSecret("/uf/aws_bucket_name");

AWS.config.update({
    accessKeyId: aws_access_key_id,
    secretAccessKey: aws_secret_access_key,
    region: region
});

initS3Config({
    region: region,
    accessKeyId: aws_access_key_id,
    secretAccessKey: aws_secret_access_key,
    bucketName: bucket_name
});

const dbConfig = {
    host: host,
    user: userName,
    password: password,
    database: dbName,
    port: 5432,
    ssl: false
}

const app = express();
app.use(cors());
app.use('/',router)

initPool(dbConfig);
await DBConnection();
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})