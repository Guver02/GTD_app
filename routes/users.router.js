const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {

    res.json({
        id: 1,
        user: 'random'
    })
})

router.post('/sing-in', () => {

})

module.exports = router
