import {app} from './app.js';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './utils/db.js';

//create server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});

