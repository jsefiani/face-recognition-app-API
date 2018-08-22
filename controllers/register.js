const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;

    // Form validation
    if(!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    //Store password
    const hash = bcrypt.hashSync(password);
    // You create a transaction when you have to do 2 or more things
    // Update login table
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                // Insert the user in the table users and return all the columns
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Enable to register')) // Don't return error instead return a message
    // This was just to create a lookalike DB
    //database.users.push(new Person(name, email, password));
}

module.exports = {
    handleRegister: handleRegister
};