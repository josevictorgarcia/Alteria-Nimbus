const controller = {}

controller.uploadProfilePicture = (req, res) => {
    console.log("hola")
    //Hay que usar multer para subir la imagen al servidor
    //https://es.stackoverflow.com/questions/588165/node-no-consigo-recibir-un-array-de-im%C3%A1genes-en-mi-back-proveniente-de-un-post
    res.end()
}

export default controller