const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const UserModel = require('./Models/User.js');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const PlaceModel = require('./models/Place.js');
const imageDownloader = require("image-downloader");
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));



//kSb2tMNnlt5oCldH

//console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL);

app.get('/test',(req,res)=>{
    res.json('test ok');
});

app.post('/register', async (req,res)=>{

    const {name, email, password} = req.body;
    
    try{
        const userDoc = await UserModel.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    }
    catch(e){
        res.status(422).json(e);
    }
    

    
});


app.post('/login', async (req,res)=>{

    const {email, password} = req.body;

    try{
        const userDoc = await UserModel.findOne({
            email
        });
        if(userDoc){
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if(passOk){
                jwt.sign({
                    email:userDoc.email,
                    id: userDoc._id
                },jwtSecret,
                {},
                (error, token)=>{
                    if(error) throw error;

                    res.cookie('token',token).json(userDoc)
                }
                );
            }
            else{
                res.status(422).json('pass not ok');
            }
        }
        else{
            res.json('not found');
        }
    }
    catch(e){
        res.status(433).json(e);
    }
    

    
});


app.get('/profile', (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {name,email,_id} = await UserModel.findById(userData.id);
        res.json({name,email,_id});
      });
    } else {
      res.json(null);
    }
  });


  app.post('/upload-by-link', async (req,res) => {
    console.log(__dirname);
    const {link} = req.body;
    const newName =  'Photo' + Date.now() + '.jpg';
    
    await imageDownloader.image({
      url: link,
      dest: __dirname +'/uploads/' + newName,
    });
    //const url = await uploadToS3('/tmp/' +newName, newName, mime.lookup('/tmp/' +newName));
    res.json(newName);
  });

  const photosMiddleware = multer({dest:'uploads'});
  app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
     const uploadedFiles = [];
    // for (let i = 0; i < req.files.length; i++) {
    //   const {path,originalname,mimetype} = req.files[i];
    //   const url = await uploadToS3(path, originalname, mimetype);
    //   uploadedFiles.push(url);
    // }

    for (let index = 0; index < req.files.length; index++) {
      const {path,originalname} = req.files[index];
      const parts = originalname.split('.');
      const ext = parts[parts.length-1];
      const newPath = path + '.' + ext;
      fs.renameSync(path,newPath);
      uploadedFiles.push(newPath.replace('uploads',''));
    }
    res.json(uploadedFiles);
  });

  
  app.post('/places', (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {
      title,address,addedPhotos,description,price,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await PlaceModel.create({
        owner:userData.id,price,
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,
      });
      res.json(placeDoc);
    });
  });

  app.get('/user-places', (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      const {id} = userData;
      res.json( await PlaceModel.find({owner:id}) );
    });
  });

  app.get('/places/:id', async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {id} = req.params;
    res.json(await PlaceModel.findById(id));
  });


  app.put('/places', async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {
      id, title,address,addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await PlaceModel.findById(id);
      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title,address,photos:addedPhotos,description,
          perks,extraInfo,checkIn,checkOut,maxGuests,price,
        });
        await placeDoc.save();
        res.json('ok');
      }
    });
  });


  app.get('/places', async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    res.json( await PlaceModel.find() );
  });

  app.post('/logout', async (req,res)=>{
    res.cookie('token', '').json(true);    
  });


app.listen(4000);