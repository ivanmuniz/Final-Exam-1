const mongoose = require( 'mongoose' );

const moviesSchema = mongoose.Schema({
    movie_ID : {
        type : Number,
        unique : true,
        required : true
    },
    movie_title : {
        type : String,
        required : true
    },
    year :  {
        type : Number,
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    actors : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'actors',
        required : true
    }]
});

const moviesCollection = mongoose.model( 'movies', moviesSchema );

const Movies = {
    createMovie : function( newMovie ){
        return moviesCollection
                .create( newMovie )
                .then( createdMovie => {
                    return createdMovie;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    /*
        Your code goes here
    */
    findMovie : function( movie_ID ) {
        return moviesCollection
            .findOne( { movie_ID })
            .populate("actors", ["firstName", "lastName", "actor_ID",])
            .then( movie => {
                return movie;
            })
            .catch( err => {
                throw new Error( err );
            })
    },

    removeActorFromMovieList : function( movie_ID, movie ) {
        return moviesCollection
            .findOneAndUpdate( { movie_ID },{$set : movie }, { new: true } )
            .populate("actors", ["firstName", "lastName", "actor_ID",])
            .then( updatedMovie => {
                return updatedMovie;
            })
            .catch( err => {
                throw new Error( err );
            })
    }
}

module.exports = {
    Movies
};

