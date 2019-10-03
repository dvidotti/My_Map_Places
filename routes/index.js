const express = require('express');
const router  = express.Router();
const Place = require('../models/Places');
const User = require('../models/User')
const bcrypt = require('bcrypt')
let bcryptSalt = 10;

/* GET home page */



router.get('/signup', (req, res, next) => {
  res.render('signup');
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
            res.redirect('/login')
          })
          .catch(error => console.log(error))
      }
    })
    .catch(err => console.log(err))
});


router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  
  if (username === '' || password === '') {
    res.render('login', { message: "Username or Password empty" });
    return;
  }

  User.findOne({username})
    .then(user => {
      console.log('--------->', user)
      if (!user) {
        res.render('login', { message: " Wrong username or password" });
        return;
      } 

        if (bcrypt.compareSync(password, user.password)) {
          console.log('--aaaa------->', user)

        req.session.currentUser = user._id;
        res.redirect('/places')
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
  Place.find()
    .then(places => {
      res.status(200).json({ places });
    })
    .catch(error => console.log(error))
});


router.use((req, res, next) => {
  if(req.session.currentUser) {
    next();
  } else {
    res.redirect('/login')
  }
})


router.get('/', (req, res, next) => {
  res.render('index');
});


router.post('/add-place', (req, res, next) => {
  const {name, type} = req.body;
  let location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
    };
  if(name === '' || type === '' || location ==='') {
    res.render('/index', {error: 'Fill the form'})
    return;
  }
  Place.findOne({name})
  .then(place => {
    if (place !== null) {
      res.render('index', {error: 'The place already exists'});
      return;
    }
  Place.create({name, type, location})
  .then(place => {
    res.render('index', {message: `${place.name} saved`})
  })
  })
})

router.get('/places', (req, res, next) => {
  Place.find()
  .then(place => {
    res.render('places', { place })
  })
})

router.get('/delete/:id', (req, res, next) => {
  const placeId = req.params.id;
  Place.findByIdAndDelete(placeId)
  .then(place => {
    res.redirect('/places')
  })
})

router.get('/edit/:id', (req, res, next) => {
  const placeId = req.params.id;
  Place.findById(placeId)
  .then(place => {
    console.log(place.location.coordinates);
    res.render('edit-place', place)
  })
})

router.post('/edit/:place', (req, res, next) => {
  const id = req.params.place;
  const { name, type } = req.body;
  Place.findByIdAndUpdate(id, {name: name, type: type})
  .then(place => {
    res.redirect('/places')
  })
})



module.exports = router;
