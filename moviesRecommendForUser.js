let data = require('./data.json');
let person1

(function main(){
    let args = process.argv.splice(2)
    //testing for if args was passed and is a number
    if(args.length > 0 && !isNaN(args[0])){
        //testing that number is in the range of users
        if(Number(args[0]) > 0 && Number(args[0]) < 611) {
            for(let d of data) {
                //finds the user from the command prompt
                if(d.userId === Number(args[0])) {
                    person1 = d
                }
            }
            predictRatings()
        }
        else {
            console.log('Number must be between 1-610')
        }
    }
    else {
        console.log('Must enter in a Number ex.(node moviesRecommendForUser 123)')
    }
})()

function predictRatings() {
    let nearest = findNearestNeighbors(person1)
    let unratedMovies = []
  
    findUnratedMovies(nearest['1'], unratedMovies)
    findUnratedMovies(nearest['2'], unratedMovies)
    findUnratedMovies(nearest['3'], unratedMovies)
    findUnratedMovies(nearest['4'], unratedMovies)
    findUnratedMovies(nearest['5'], unratedMovies)
    findUnratedMovies(nearest['6'], unratedMovies)
    findUnratedMovies(nearest['7'], unratedMovies)
    findUnratedMovies(nearest['8'], unratedMovies)
    findUnratedMovies(nearest['9'], unratedMovies)
    findUnratedMovies(nearest['10'], unratedMovies)
    
    //this is setting the array of movie ratings from the users, to the average of the array.
    for(let movie of Object.keys(unratedMovies)) {
        let sum = 0

        //will only count arrays with 3 or more votes on it and get their average.
        // without this it will give me the first movies of just 5's
        if(unratedMovies[movie].length > 2) {
            for(let rating of unratedMovies[movie]) {
                sum += rating
            }
        }
        else {
            unratedMovies[movie] = 0
        }
        unratedMovies[movie] = sum/unratedMovies[movie].length
    }
    getHighestRecommended(unratedMovies)
}

function findNearestNeighbors(user) {
    let name = user.userId
    let similarityScores = {
        1: {similarity: 1}, 
        2: {similarity: 1}, 
        3: {similarity: 1}, 
        4: {similarity: 1}, 
        5: {similarity: 1},
        6: {similarity: 1},
        7: {similarity: 1},
        8: {similarity: 1},
        9: {similarity: 1},
        10: {similarity: 1},
    }

    for(let i =0;i<data.length;i++) {
        let other = data[i]

        //goes through my data and finds the euclidean similarity of the user compared
        //to everyone else and saves the 10 most similar in an object with the other user and the similarity.
        if(other.userId != name) {
            let similarity = euclideanSimilarity(person1, other)

            if(similarityScores[1].similarity > similarity) {
                similarityScores[1] = {other: other, similarity: similarity}
            }
            else if(similarityScores[2].similarity > similarity) {
                similarityScores[2] = {other: other, similarity: similarity}
            }
            else if(similarityScores[3].similarity > similarity) {
                similarityScores[3] = {other: other, similarity: similarity}
            }
            else if(similarityScores[4].similarity > similarity) {
                similarityScores[4] = {other: other, similarity: similarity}
            }
            else if(similarityScores[5].similarity > similarity) {
                similarityScores[5] = {other: other, similarity: similarity}
            }
            else if(similarityScores[6].similarity > similarity) {
                similarityScores[6] = {other: other, similarity: similarity}
            }
            else if(similarityScores[7].similarity > similarity) {
                similarityScores[7] = {other: other, similarity: similarity}
            }
            else if(similarityScores[8].similarity > similarity) {
                similarityScores[8] = {other: other, similarity: similarity}
            }
            else if(similarityScores[9].similarity > similarity) {
                similarityScores[9] = {other: other, similarity: similarity}
            }
            else if(similarityScores[10].similarity > similarity) {
                similarityScores[10] = {other: other, similarity: similarity}
            }
        }
    }
    return similarityScores
}

function euclideanSimilarity(personSim1, personSim2) {
    //these are to keep it constant becuase we always need the small one to be
    //looped through or else we will run into errors and the ratings need to be 
    //dependent on that also
    let titles = personSim1.movieId.length > personSim2.movieId.length?personSim2.movieId:personSim1.movieId
    let titles2 = personSim1.movieId.length < personSim2.movieId.length?personSim2.movieId:personSim1.movieId
    let ratings1 = personSim1.movieId.length > personSim2.movieId.length?personSim2.rating:personSim1.rating
    let ratings2 = personSim1.movieId.length < personSim2.movieId.length?personSim2.rating:personSim1.rating
    let sumSquares = 0

    for(let i =0; i<titles.length; i++) {
        let title = titles[i]
        let rating1 = ratings1[i]

        if(titles2.indexOf(title) !== -1) {
            let rating2 = ratings2[titles2.indexOf(title)]
            let diff = rating1 - rating2
            sumSquares += diff * diff
        }  
    }
    let distance = Math.sqrt(sumSquares)
    //like in coding train to handle 0's and make it smaller number mor similar
    return 1/(1+distance)
}

function findUnratedMovies(neighbor, unratedMovies) {
    // these for loops get all the nearest neighbor movies titles the user
    // has not seen and place them in unratedMovies indexed by their title
    for(let movie1 of neighbor.other.movieId) {
        if(!person1.movieId.includes(movie1)) {
            //my ratings and movieId line up in their own seperate arrays for each user
            // that is why I have to find the index of where the movie is to get the rating.
            let index = neighbor.other.movieId.indexOf(movie1)
            // if is so that it will push the rating onto the array otherwise it
            // will make a new array for the movie and push it on.
            if(unratedMovies[movie1]){
                unratedMovies[movie1].push(neighbor.other.rating[index])
            }
            else {
                unratedMovies[movie1] = []
                unratedMovies[movie1].push(neighbor.other.rating[index])
            }
        }
    }

    return unratedMovies
}

function getHighestRecommended(unratedMovies) {
    let highestRecommended = [
        {movie: '', rating: 0},
        {movie: '', rating: 0},
        {movie: '', rating: 0},
        {movie: '', rating: 0},
        {movie: '', rating: 0},
        {movie: '', rating: 0},
        {movie: '', rating: 0},
        {movie: '', rating: 0},
        {movie: '', rating: 0},
        {movie: '', rating: 0}
    ]

    //goes through unrated movies and sees the highest ratings and saves them to highestRecommended
    for(let movie of Object.keys(unratedMovies)) {
        if(unratedMovies[movie] > highestRecommended[0].rating) {
            highestRecommended[0].movie = movie
            highestRecommended[0].rating = unratedMovies[movie]
        }
        else if(unratedMovies[movie] > highestRecommended[1].rating) {
            highestRecommended[1].movie = movie
            highestRecommended[1].rating = unratedMovies[movie]
        }
        else if(unratedMovies[movie] > highestRecommended[2].rating) {
            highestRecommended[2].movie = movie
            highestRecommended[2].rating = unratedMovies[movie]
        }
        else if(unratedMovies[movie] > highestRecommended[3].rating) {
            highestRecommended[3].movie = movie
            highestRecommended[3].rating = unratedMovies[movie]
        }
        else if(unratedMovies[movie] > highestRecommended[4].rating) {
            highestRecommended[4].movie = movie
            highestRecommended[4].rating = unratedMovies[movie]
        }
        else if(unratedMovies[movie] > highestRecommended[5].rating) {
            highestRecommended[5].movie = movie
            highestRecommended[5].rating = unratedMovies[movie]
        }
        else if(unratedMovies[movie] > highestRecommended[6].rating) {
            highestRecommended[6].movie = movie
            highestRecommended[6].rating = unratedMovies[movie]
        }
        else if(unratedMovies[movie] > highestRecommended[7].rating) {
            highestRecommended[7].movie = movie
            highestRecommended[7].rating = unratedMovies[movie]
        }
        else if(unratedMovies[movie] > highestRecommended[8].rating) {
            highestRecommended[8].movie = movie
            highestRecommended[8].rating = unratedMovies[movie]
        }
        else if(unratedMovies[movie] > highestRecommended[9].rating) {
            highestRecommended[9].movie = movie
            highestRecommended[9].rating = unratedMovies[movie]
        }
    }
   
    for(let movie of highestRecommended) {
        
        console.log(`${movie['movie']}: ${movie['rating'].toFixed(1)}`)
    }
}
