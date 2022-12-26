import mongoose from 'mongoose';
import config from 'config';

const connection = () => {
    const dbURI = config.get<string>('dbURI');
    return mongoose.connect(dbURI).then(() => {
        console.log('Connected to DB');
    }).catch((err) => {
        console.error('Could not connect to DB');
        console.error(err);
        process.exit(1);
    });
}

export default connection;
