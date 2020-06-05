function errorHandler(req, res, next) {
    let { id, firstName, lastName } = req.body;
    let paramID = req.params.movie_ID;

    if( !id ) {
        res.statusMessage = "ID is missing in the body of the request";
        return res.status(406).end();
    }

    if( id !== paramID ) {
        res.statusMessage = "ID and movie_ID do not match";
        return res.status(409).end();
    }

    if( !firstName || !lastName ) {
        res.statusMessage = "You need to send both firstName and lastName of the actor to remove from the movie list";
        return res.status(403).end();
    }
    
    next();
}

module.exports = errorHandler;