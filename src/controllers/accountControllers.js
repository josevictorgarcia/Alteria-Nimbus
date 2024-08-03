import connection from '../database/connection.js'
import userModels from '../database/models/userModels.js'

const controller = {}

controller.uploadProfilePicture = async (req, res) => {
    //Hay que usar multer para subir la imagen al servidor
    //https://es.stackoverflow.com/questions/588165/node-no-consigo-recibir-un-array-de-im%C3%A1genes-en-mi-back-proveniente-de-un-post
    //console.log(req.file)
    //console.log(req.file.path)
    let { username } = req.body
    /*res.render('image', {
        image : req.file.path.slice(6)
    })*/

    if(req.file != undefined){
        await connection()
        await userModels.updateOne({ username : username }, { $set : {pfp : req.file.path.slice(7)} })
        res.render('infoMessage', {
            message : 'Profile picture changed successfully',
            username : username
        })
    } else {
        res.render('infoMessage', {
            message : 'Could not change profile picture. Press back and try again',
            username : username
        })
    }
}

export default controller