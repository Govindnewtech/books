const mongoose = require('mongoose');
// const url = "mongodb://localhost:27017/stationery";


// const url = 'mongodb+srv://aakash:akki8817@pushtak.pyht9.mongodb.net/Pushtak?retryWrites=true&w=majority';
const url = 'mongodb+srv://govind_kewat:8ndbaL1uxYHWTDJy@cluster0.qegpu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// const url = 'mongodb+srv://Pushtak:lkc9CeUYpBElTZMj@cluster0.6eadk.mongodb.net/?retryWrites=true&w=majority';


mongoose.connect(url, {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => {
    console.log("connection sucessfull");
}).catch((e) => {
    console.log("no connection");
});
