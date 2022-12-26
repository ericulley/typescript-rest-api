import express from 'express';
const app = express()
import config from 'config';
import connect from '../utils/connect';

const port = config.get<number>('port');

app.listen(port, async () => {
    console.log("App is running on port ", port);
    await connect();
})