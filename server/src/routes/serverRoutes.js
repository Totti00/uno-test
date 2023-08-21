const express = require('express');
const serverController = require('../controllers/serverController');
const router = express.Router();

router.route('/')
    .get((req,res)=>{
        res.sendFile('index.html', { root: global.appRoot + '/www' })
    })

router.route('/cards')
    .get(serverController.getCards)

module.exports = router;