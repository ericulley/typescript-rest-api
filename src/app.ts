import express from 'express';
import config from 'config';
import connect from '../utils/connect';
import log from '../utils/logger';
import routes from './routes';

const app = express();
app.use(express.json());

const scheme = config.get<number>('scheme');
const host = config.get<number>('host');
const port = config.get<number>('port');

app.listen(port, async () => {
    log.info(`App is running at ${scheme}://${host}:${port}`);
    
    await connect();

    routes(app);
})