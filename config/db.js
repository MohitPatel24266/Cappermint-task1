const mongoose = require('mongoose');
const url="mongodb://localhost:27017/userauth";

console.log('MongoDB URI:', url);
const connectDB = async () => {

    try {
        if(!url){
            throw new Error("MONGO_URL is not defined in environment variables");
        }
        await mongoose.connect(url,{
            dbName:"userauth",
        } ,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
