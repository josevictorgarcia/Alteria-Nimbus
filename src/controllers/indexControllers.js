const controller = {}

controller.index = (req, res) => {
    res.render('index', {

    })
}

controller.getLoginPage = (req, res) => {
    let message = req.query.message
    res.render('login', {
        message : message
    })
}

controller.getRoomsPage = (req, res) => {
    res.render('rooms', {
        
    })
}

controller.getRandomPage = (req, res) => {
    res.render('random', {
        
    })
}

controller.getRankingPage = (req, res) => {
    res.render('ranking', {
        
    })
}

export default controller