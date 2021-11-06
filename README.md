# Movie Recommender Command Line App
<h2>Start with running</h2> <br>

``` node convertCsv2Json ``` <br>

<h2>Then Add yourself into data.json that is created. </h2><br>

``` {
    "userId": 611,
    "movieId": [
      "Toy Story (1995)",
      "Grumpier Old Men (1995)",
      "Heat (1995)",
      "Seven (a.k.a. Se7en) (1995)",
      "Usual Suspects, The (1995)",
      "From Dusk Till Dawn (1996)",
      "Bottle Rocket (1996)",
      "Braveheart (1995)"
      ],
     "rating": [
       5,
       3,
       2,
       1,
       4,
       1,
       4
     ]
   }
   ``` 
   
  <h2>Remember your userId and run the command(this example the userId is 611): </h2> <br>
  
   ``` node moviesRecommendForUser <userId> ``` <br>
   
   <h2>Then your recommendations should come up like the following.</h2>
   
   ```
    Life Is Beautiful (La Vita è bella) (1997): 5.0
    Green Mile, The (1999): 5.0
    Beautiful Mind, A (2001): 5.0
    Eyes Wide Shut (1999): 5.0
    WALL·E (2008): 4.8
    Intouchables (2011): 4.8
    Prisoners (2013): 4.8
    Inglourious Basterds (2009): 4.6
    Wolf of Wall Street, The (2013): 4.6
    Inception (2010): 4.5```
