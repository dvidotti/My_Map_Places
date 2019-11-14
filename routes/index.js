const express = require('express');
const router  = express.Router();
const Place = require('../models/Places');
const User = require('../models/User')
const bcrypt = require('bcrypt')
let bcryptSalt = 10;
const multer       = require('multer');
const upload       = multer({dest: './public/uploads/'});
const Picture      = require('../models/Pictures')

/* GET home page */



router.get('/', (req, res, next) => {
  Picture.find()
    .then(pictures => {
      res.render('login', {pictures})
    })
    .catch(err => console.log(err));
});


router.get('/signup', (req, res, next) => {
  Picture.find()
    .then(pictures => {
      res.render('signup', {pictures})
    })
    .catch(err => console.log(err));
});

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body;

  if (username === '' || password === '') {
    res.render('signup', { message: "Username or Password empty" });
    return;
  }

  User.findOne({username})
    .then((user) => {
      if (user) {
        console.log('im here')
        res.render('signup', {message: 'The user already exist'})
        return;
      } else {
        let salt = bcrypt.genSaltSync(bcryptSalt)
        let hash = bcrypt.hashSync(password, salt)
        User.create({
          username,
          password: hash
        })
          .then(user => {
            console.log(user.username, 'Sucessfully Created')
            res.redirect('/')
          })
          .catch(error => console.log(error))
      }
    })
    .catch(err => console.log(err))
});


router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  
  if (username === '' || password === '') {
    res.render('login', { message: "Username or Password empty" });
    return;
  }

  User.findOne({username})
    .then(user => {
      if (!user) {
        res.render('login', { message: " Wrong username or password" });
        return;
      } 

        if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user._id;
        res.redirect('/feed')
      } else {
        res.render('login', { message: " Wrong username or password" });
        return;
      }
    })
    .catch(error => {
      next(error);
    })
});


router.get('/api', (req, res, next) => {
  User.findById(req.session.currentUser).populate({
    path:'myplaces',
    populate: {path: 'picture'}})
    .then(user => {
      res.status(200).json(user.myplaces);
    })
    .catch(error => console.log(error))
});

router.get('/api/places', (req, res, next) => {
  Place.find()
    .then(place => {
      console.log(place)
      res.status(200).json(place);
    })
    .catch(error => console.log(error))
});


// ----------------- AUTHENTICATION ---------------------//



router.use((req, res, next) => {
  if(req.session.currentUser) {
    next();
  } else {
    res.redirect('/login')
  }
});




router.get('/feed', (req, res, next) => {
  Place.find().populate('picture')
  .then(places => {
    res.render('all-places', { places })
  })
})

router.get('/upload', (req, res, next) => {
  res.render('myplace')
})


router.post('/upload/:id', upload.single('photo'), (req, res) => {

  const pic = {
    name: req.body.name,
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname
  };

  Picture.create(pic)
  .then(picture =>{
    Place.findByIdAndUpdate(req.params.id, {$set: {picture: picture}})
      .then(place => {
        res.redirect('/places')
      })
  })
  .catch(err => console.log(err))
})



router.post('/add-place', upload.single('photo'), (req, res, next) => {
  const {name, type} = req.body;
  let location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
    };
  if(name === '' || type === '' || location ==='') {
    res.render('index', {error: 'Fill the form'})
    return;
  }
  if(typeof name === Number ||  location ==='') {
    res.render('index', {error: 'Your name should use only letters'})
    return;
  }

  User.find({_id: req.session.currentUser}).populate('myplaces')
  .then(user => {
    let cityFilter = []
    user[0].myplaces.forEach(place => {
      console.log('PLACE NAME', place.name, '->>>>>', name)
      if(place.name === name) {
        cityFilter.push(place.name);
      }
      console.log('CITY FILTER', cityFilter)
    })
    if (cityFilter.length !== 0) {
      res.render('index', {error: 'The place already exists'});
      return;
    } else {
      if (!req.file) {
        Picture.create({
          name,
          path: `/uploads/0c2afc0545906ec0d6894c5bc5c3de04`,
          originalName: 'defaultPicture'
        })
        .then(picture => {
          const picId = picture._id;
            Place.create({name, type, location, picture: picId})
            .then(place => {
              User.findByIdAndUpdate(req.session.currentUser, {$push: {myplaces: place}})
                .then(user => console.log('sucess', user))
                .catch(err => console.log(err))
              res.render('index', {message: `${place.name} saved`})
            })
          })
        .catch(err => console.log(err))
      } else {
          Picture.create({
            name,
            path: `/uploads/${req.file.filename}`,
            originalName: req.file.originalname
          })
          .then(picture => {
            console.log('CLICK',picture)
            const picId = picture._id;
              Place.create({name, type, location, picture: picId})
              .then(place => {
                User.findByIdAndUpdate(req.session.currentUser, {$push: {myplaces: place}})
                  .then(user => console.log('sucess', user))
                  .catch(err => console.log(err))
                res.render('index', {message: `${place.name} saved`})
              })
            })
          .catch(err => console.log(err))
      }
    }
    })
  .catch(err => console.log(err))


  // Place.findOne({name})
  // .then(place => {
  //   if (place !== null) {
  //     res.render('index', {error: 'The place already exists'});
  //     return;
  //   }
  // })

})

router.get('/add-place', (req, res, next) => {
  res.render('add-place');
})

router.get('/places', (req, res, next) => {
  User.findById(req.session.currentUser).populate({
    path:'myplaces',
    populate: {path: 'picture'}
  })
    .then(user => {
      console.log('...............',user)
      res.render('places', { user })
    })
    .catch(err => console.log(err))
})


router.get('/galery', (req, res, next) => {
  User.findById(req.session.currentUser).populate({
    path:'myplaces',
    populate: {path: 'picture'}
  })
    .then(user => {
      
      res.render('galery', { user })
    })
    .catch(err => console.log(err))
})


router.get('/delete/:id', (req, res, next) => {
  const placeId = req.params.id;
  Place.findByIdAndDelete(placeId)
  .then(place => {
    res.redirect('/places')
  })
})

router.get('/edit/:id', upload.single('photo'), (req, res, next) => {
  const placeId = req.params.id;
  Place.findById(placeId).populate('picture')
  .then(place => {
    res.render('edit-place', place)
  })
})

router.post('/edit/:place', upload.single('photo'), (req, res, next) => {
  const id = req.params.place;
  const { name, type, latitude, longitude, rotate  } = req.body;
  let location = {
    type: 'Point',
    coordinates: [longitude, latitude]
    };

 

  Place.findByIdAndUpdate(id, {name: name, type: type, location: location}).populate('picture')
  .then(place => { 
    if(req.file === undefined) {
      console.log('NAME ---------------->', name)
        const pic = {
          name:name,
          rotate,
        };

        Picture.findByIdAndUpdate(place.picture._id, pic)
          .then(pic => {
            res.redirect('/places')
          })
          .catch(err => console.log(err))

    } else {
        const pic = {
          name: name,
          path: `/uploads/${req.file.filename}`,
          originalName: req.file.originalname,
          rotate,
        };

        Picture.findByIdAndUpdate(place.picture._id, pic)
          .then(pic => {
            res.redirect('/places')
          })
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
  })



module.exports = router;
