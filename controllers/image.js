const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: "1eeb3f9c3a6a40728eb2bad5dc7c509c"
});

const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))
}

const incrementEntriesImage = (req, res, db) => {
    const { id, numberOfFaces} = req.body;
    db('users').where('id', '=', id)
        .increment('entries', parseInt(numberOfFaces))
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get entries'))

    // Used for lookalike DB
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     }
    // });
    // if (!found) {
    //     res.status(404).json("Not found");
    // }
}

module.exports = {
    incrementEntriesImage,
    handleApiCall
}