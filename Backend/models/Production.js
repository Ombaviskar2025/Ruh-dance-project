const mongoose = require('mongoose');
const productionSchema = new mongoose.Schema({
    year: String,
    title: String,
    subtitle: String,
    image: String
});

module.exports = mongoose.model('Production', productionSchema, 'productions');