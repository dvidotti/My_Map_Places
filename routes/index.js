const express = require('express');
const router  = express.Router();
const mongoose     = require('mongoose');
const Place = require('../models/Places')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/api', (req, res, next) => {
  Place.find()
    .then(places => {
      res.status(200).json({ places });
    })
    .catch(error => console.log(error))
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
