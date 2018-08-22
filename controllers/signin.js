const handleSignin = (req, res, db, bcrypt) => {
    
    // Destructuring 
    const { email, password } = req.body;

    // Form validation
    if (!email || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Username or password are wrong, please try again.');
            }
        })
        .catch(err => res.status(400).json('Username or password are wrong'))

    // Was used for lookalike DB
    // if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    //     res.json(database.users[0]);
    // } else {
    //     res.status(400).json('Error logging in');
    // }
};

module.exports = {
    handleSignin: handleSignin
}