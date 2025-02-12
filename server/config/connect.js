const mongoose = require('mongoose');

const start = async () => {

    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to mongodb");

    }catch(e){
        console.log('error connecting to mongodb', e);
    }
};

module.exports = start;