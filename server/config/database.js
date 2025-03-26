const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(`MongoDB connected with HOST: ${con.connection.host}`);
    }).catch(err => {
        console.error('MongoDB connection error:', err);
    });
};

module.exports = connectDatabase;