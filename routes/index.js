const express = require('express');
const router = express.Router();


const urlDB = 'mongodb+srv://admin:admin@cluster0.wqgvx.mongodb.net/DB_Demo?retryWrites=true&w=majority'
const mongoose = require('mongoose');
mongoose.connect(urlDB,{useNewUrlParser: true, useUnifiedTopology:  true});
const  db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error: '));
db.once('open', function (){
    console.log('connected success!')
})

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()); // giữ tên file như tên trong máy tính
    }
})

const upload = multer({ storage: storage});

const  User = new mongoose.Schema({
    idUser: String,
    name: String,
    address: String,
    age: String,
    phoneNumber: String,
    avatar: String
})

const connectUsers = db.model('users',User,'User'); // ket noi voi colection ten la User

/* Get list page*/
router.get('/list',function (req,res,next){

    connectUsers.find({}, function (error,users){
        if (error){
            res.render('list',{title: 'Express Loi!'})
        }else {
            res.render('list',{title: 'Express',User: users})
        }
        // res.send(users);
    });
})

/*Get Home Page*/
router.get('/',((req, res) => {
    res.render('Home');
}))

/*Get Sign Up*/
router.get('/signUp',((req, res) => {
    res.render('signUp');
}))

/*Get Sign In*/
router.get('/signIn',((req, res) => {
    res.render('signIn');
}))

router.get('/insertUser',((req, res) => {
    res.render('addUser')
}))
router.get('/updateUser',((req, res) => {
    res.render('updateUser')
}))
router.get('/removeUser',((req, res) => {
    res.render('removeUser')
}))

router.get('/getUsers',function (req,res){
    const baseJson = {
        errorCode: undefined,
        errorMessage: undefined,
        data: undefined,
    };
    connectUsers.find({},
        function (error,users){
            if (error){
                baseJson.errorCode = 404
                baseJson.errorMessage = error
            }else {
                baseJson.errorCode = 200
                baseJson.errorMessage = 'Ok'
                baseJson.data = users
            }
            res.send(users)
        })
});

router.post('/insertUser',upload.single('avatar'),function (req,res){
    console.log(req.body);

    connectUsers({ // add User
        idUser: req.body.idUser,
        name: req.body.name,
        address: req.body.address,
        age: req.body.age,
        phoneNumber: req.body.phoneNumber,
        avatar:  req.file.filename +'.jpg'
    }).save(function (error){
        if (error) {
            res.render('addUser', {title: 'Express Loi!!!!'});
        } else {
            res.render('addUser', {title: 'Express Save Thanh Cong'});
        }
    })
});

router.post('/updateUser',upload.single('avatar'),((req, res) => {
    connectUsers.findOneAndUpdate({// update User
        idUser: req.body.idUser
    }, {$set: {name: req.body.name, address: req.body.address, age: req.body.age,
        phoneNumber: req.body.phoneNumber}},{
        returnNewDocument: true
    },function(err, users){
            if (err){
                res.render('updateUser',{title: 'Lỗi'})
            } else {
                console.log(users)
                res.render('updateUser',{title: 'Update Success'})
            }
    })
}))
router.post('/removeUser',upload.single('avatar'),((req, res) => {
    connectUsers.deleteOne({idUser: req.body.idUser},function (err){ // remove User
        if (!err){
            res.render('removeUser',{title: 'Remove Success'})
        }else {
            res.render('removeUser',{title: 'Loi!!'})
        }
    })
}))
module.exports = router;