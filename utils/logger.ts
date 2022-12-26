import pino from 'pino';
import pretty from 'pino-pretty';

const log = pino(pretty({
    ignore: 'pid,hostname'
}));

export default log;

