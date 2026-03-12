const mongoose = require("mongoose");

const schema = new mongoose.Schema({
url:String,
used:{type:Boolean,default:false},
claimedBy:String,
claimedAt:Number
});

module.exports = mongoose.model("links",schema);
