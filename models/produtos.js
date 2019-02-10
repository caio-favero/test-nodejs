const mongoose = require('mongoose');
const { Schema } = mongoose;

const warehouseSchema = mongoose.Schema({
    "locality": String,
    "quantity": Number,
    "type": String,
}, { _id: false });

const inventorySchema = mongoose.Schema({
    warehouses: [warehouseSchema]
}, { _id: false });

const prodSchema = new Schema({
    sku: { type: Number, required: true },
    name: { type: String, required: true },
    inventory: inventorySchema,
})

mongoose.model('produtos', prodSchema);
