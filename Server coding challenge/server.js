const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const mongoose = require( 'mongoose' );
const jsonParser = bodyParser.json();
const { DATABASE_URL, PORT } = require( './config' );

const app = express();

/* 
    Your code goes here 
*/

function createActor() {
    let actor = {
        firstName: "Iván",
        lastName: "Muñiz",
        actor_ID: 123
    };
    Actors.createActor( actor )
        .then( createdActor => {
            console.log(createdActor);
            let movie = {
                movie_ID: 321,
                movie_title: "Shrek",
                year: 2006,
                rating: 9.6,
                actors: [createdActor._id]
            }
        
            Movies.createMovie( movie )
                .then( createdMovie => {
                    console.log( createdMovie );
                })
                .catch( err => {
                    console.log( err );
                })

        })
        .catch( err => {
            console.log(err);
        })
}

const { Movies } = require( './models/movie-model' );
const { Actors } = require( './models/actor-model' );
const errorHandler = require( './middleware/errorHandler');

app.patch("/api/delete-movie-actor/:movie_ID", [jsonParser, errorHandler], (req, res) => {
    let { id, firstName, lastName } = req.body;
    let paramID = req.params.movie_ID;

    // createActor();
    Actors.getActorByName( firstName, lastName )
        .then( actor => {
            console.log(actor);
            if( !actor ) {
                res.statusMessage = "Actor not found.";
                return res.status(404).end();
            }
            Movies.findMovie( id )
                .then( movie => {
                    console.log(movie);
                    if( !movie ) {
                        res.statusMessage = "Movie not found.";
                        return res.status(404).end();
                    }
                    movie.actors.forEach( (act, i) => {
                        if( actor.actor_ID == act.actor_ID) {
                            movie.actors.splice(i, 1);
                            Movies.removeActorFromMovieList( id, movie )
                                .then( updatedMovie => {
                                    return res.status(201).json(updatedMovie);
                                })
                                .catch( err => {
                                    console.log(err);
                                })
                            return;
                        }
                    });
                })
                .catch( err => {
                    console.log(err);
                })
        })
        .catch( err => {
            console.log(err);
        });
});


app.listen( PORT, () => {
    console.log( "This server is running on port 8080" );
    new Promise( ( resolve, reject ) => {
        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});