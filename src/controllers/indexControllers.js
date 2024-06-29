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

export default controller