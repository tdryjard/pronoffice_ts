const Subscriber = require('../../models/subscriber/subscriber.model')

exports.create = (request, response) => {

    const {
        email,
        name,
        user_id,
        customer_id
    } = request.body;

    // Creer un utilisateur
    const subscriber = new Subscriber({
        email: email || null,
        name : name || null,
        user_id : user_id || null,
        customer_id : customer_id || null,
    });

    if (!request.body) {
        return response.status(400).send({
            message: 'Content can not be empty!'
        });
    }

    return Subscriber.create(subscriber, (error, data) => {
        if (error) {
            console.log(error)
            return response.status(500).send({
                message:
                    error.message || 'Some error occurred while creating the category.'
            })
        }

        return response.status(201).send(data);
    })
}