const fs = require('fs')
const request = require('superagent')
const CsvReadableStream = require('csv-reader')
const file = fs.createWriteStream('ml-latest-small.zip')
const admZip = require('adm-zip')
const tar = require('tar')

// this request gets the file
request.get('http://files.grouplens.org/datasets/movielens/ml-latest-small.zip')
  .on('error', function(error) {
    console.log(error);
  })//then writes to zip file
  .pipe(file)
  .on('finish',function() {
    //this function extracts it from the zip
    let zip = new admZip('./ml-latest-small.zip')
    let data = []
    let userId = new Set()
    let finalData = []

    zip.extractAllTo('./', true)
    //after unzipped all I need is ratings and movies this let has to be after they are extracted
    let ratingsStream = fs.createReadStream('./ml-latest-small/ratings.csv', 'utf8')
    let moviesStream = fs.createReadStream('./ml-latest-small/movies.csv', 'utf8')

    //this reads from the ratings stream
    ratingsStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, skipHeader: true, trim: true }))
        .on('data', function(row) {
            userId.add(row[0])
            data.push({userId: row[0], movieId: row[1], rating: row[2]})
        })
        .on('end', function() {
            for(let u of userId) {
              finalData.push({userId: u, movieId: [], rating: []})
              for(let d of data) {
                if(d.userId === u) {
                  //finds the movie and ratings that correlate and adds them to the user
                  finalData.find(el =>{
                    if(el.userId === u){
                      el.movieId.push(d.movieId)
                      el.rating.push(d.rating)
                    }
                  })
                }
              }
            }
            let movieDic = []
            //here we are trying to get the movie ids to be actual names of movies.
            moviesStream.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, skipHeader: true, trim: true }))
            .on('data', function(row) {
                movieDic[`${row[0]}`] = row[1]
            })
            .on('end', function() {
              for(let d of finalData) {
                let arr =[]
                for(let movie of d.movieId) {
                  arr.push(movieDic[movie])
                }
                d.movieId = arr
              }
              //we json stringify the object and then writes it to json
              //and zip it and tarball it.
              finalData = JSON.stringify(finalData, null, 2)
              fs.writeFileSync('./data.json', finalData)
              let zipStream = fs.createWriteStream('./data.tgz')
              let zipData = new admZip() 
              zipData.addLocalFile('./data.json')
              zipData.writeZip('data.zip')
              tar.c(
                {
                  gzip: true
                },
                ['data.json']
              ).pipe(zipStream)
            })
        })
  })
  




