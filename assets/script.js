$(document).ready(function(){

    $('.modal').modal();
    $('select').formSelect();
    displayData();

    var keywordSearch;

    //on click event for the search button on the index.html page
    $("#searchBtn").on("click", function(event){
        event.preventDefault();
        //set variable to value from text box
        keywordSearch = $("#keyword-search").val().trim();

        //call the searchFunction that will make the api call using the keyword only
        searchFunction(keywordSearch, "");
        //call the saveSearch function that will save the keywordSearch text in local storage
        saveSearch(keywordSearch);
    });

    //on click event for the search button in the modal (additional search criteria)
    $("#modal-search").on("click", function(event) {
        event.preventDefault();

        //create variables that will hold values from search
        var prepTime;
        var calories; 
        var ingredients;
        var dietType;

        //set variables based on values provided/selected
        keywordSearch = $("#keyword-search").val().trim();
        prepTime = $("#time-search").val().trim();
        calories = $("#calories").val().trim();
        ingredients = $("#num-ingredients").val().trim();
        dietType = $("#diet-type option:selected").text();

        //initialize the variable that will store the additional search criteria for the url for the api call
        var appendToQueryURL = "";

        //check to see if the user provided a value and if so, add the appropriate text to the appendToQueryURL variable for the api call
        if (prepTime) {
            appendToQueryURL = appendToQueryURL + "&time=" + prepTime;
        }
        
        if (calories) {
            calories = calories * 1000;
            appendToQueryURL = appendToQueryURL + "&calories=" + calories;
        }

        if (ingredients) {
            appendToQueryURL = appendToQueryURL + "&ingr=" + ingredients;
        }

        //choose your option is the default value for the drop-down box so it will never be null like the text boxes
        if (dietType != "Choose your option") {
            dietType = dietType.toLowerCase();
            appendToQueryURL = appendToQueryURL + "&diet=" + dietType;
        }

        //call the searchFunction that will make the api call using the keyword and the appendToQueryURL
        searchFunction(keywordSearch, appendToQueryURL);
        //call the saveSearch function that will save the keywordSearch text in local storage
        saveSearch(keywordSearch);

    });

    function saveSearch(keywordSearch) {
        //initialize the localStorage key with an empty array value
        var getSavedKeywords = [];
        //set the variable equal to the localStorage item
        getSavedKeywords = JSON.parse(localStorage.getItem("keywordSearches"));

        //if there were values in the local storage AND those values don't include the current search word 
        //then add the value to the beginning of the array variable
        if (getSavedKeywords && !getSavedKeywords.includes(keywordSearch)) {
            getSavedKeywords = keywordSearch + "," + getSavedKeywords;
        } else 
        //otherwise, just set the variable to the search word
        if (!getSavedKeywords) {
            getSavedKeywords = keywordSearch;
        }

        //set the local storage item to the array variable
        localStorage.setItem("keywordSearches", JSON.stringify(getSavedKeywords));

        //empty the div with the id of recent-searches
        $("#recent-searches").empty();
        //call the displayData function to populate the recent-searches div with the returned data from the search
        displayData();
    }

    function displayData() {

        //get recipes from local storage and add to #recent-searches div
        var searchButtons = JSON.parse(localStorage.getItem("keywordSearches"));

        //if there was a local storage item with data, split the data by a comma
        if (searchButtons) {
            searchButtons = searchButtons.split(",");
        }
        
        //loop through the array and create a button for each item in the searchButtons array
        $.each(searchButtons, function(j) {
            var newButton = $("<button>").attr("class", "waves-effect waves-light btn search-buttons").attr("id", searchButtons[j]).html(searchButtons[j]);
            newButton.appendTo("#recent-searches");
        });

        //add an on click event to the buttons
        $(".search-buttons").on("click", function(event){
            event.preventDefault();
            //on click of the button, call the searchFunction function and pass the text of the button (the search term)
            searchFunction(this.id, "");
            //set the search box to the button value in case the user wants to add additional criteria using the selected keyword
            $("#keyword-search").val(this.id);
        });
    }

    //the searchFunction calls the api and works with the results
    function searchFunction(keyword, additionalCriteria) {
        //declare variables to make the api call
        var appId = "820ec0b8";
        var appKey = "04c431218d56d654849a5ee10439cbba";
        var queryURL = `https://cors-anywhere.herokuapp.com/api.edamam.com/search?app_id=${appId}&app_key=${appKey}&q=${keyword}${additionalCriteria}`;
        //var queryURL = `https://api.edamam.com/search?app_id=${appId}&app_key=${appKey}&q=${keyword}${additionalCriteria}`;
        console.log(queryURL);
        //make the GET api call
        $.ajax({
            url: queryURL,
            method: "GET" 
        })
        //wait and then process the response
        .then(function (response) {

            //clear the recipeResults class
            $(".recipeResults").empty();
            //set a variable to shortcut the response
            var recipeResults = response.hits;
            //for each recipeResult, process the data from the api call
            $.each(recipeResults, function(index) {
                //set i = the index value as a shorter variable name
                var i = index;
                //set variables from the output of the api call to be displayed on the screen
                var recipeName = recipeResults[i].recipe.label; 
                var numIngredients = recipeResults[i].recipe.ingredientLines.length;
                var numServings = recipeResults[i].recipe.yield;
                var caloriesPerServing = Math.round(recipeResults[i].recipe.calories);
                var timeToCook = recipeResults[i].recipe.totalTime; 
                var recipeURL = recipeResults[i].recipe.url;
                var recipeImage = recipeResults[i].recipe.image;

                //console log the results to ensure accurate data is being displayed
                console.log(recipeName)
                console.log(numIngredients)
                console.log(numServings)
                console.log(caloriesPerServing)
                console.log(timeToCook)
                console.log(recipeURL)
                console.log(recipeImage)
                console.log("......")

                //build the html code using recipe info to appear in a "card" format 
                var recipeCardDiv = $("<div>").attr("class", "col s12 m7").attr("id", "recipeCardDiv" + i);
                recipeCardDiv.appendTo(".recipeResults");

                var nameDiv = $("<h5>").attr("class", "header").attr("id", "nameDiv" + i).attr("value", recipeName).text(recipeName);
                nameDiv.appendTo("#recipeCardDiv" + i);

                var cardDiv = $("<div>").attr("class", "card horizontal").attr("id", "cardDiv" + i);
                cardDiv.appendTo("#recipeCardDiv" + i);

                var imgDiv = $("<div>").attr("class", "card-image").attr("id", "imgDiv" + i);
                imgDiv.appendTo("#cardDiv" + i);

                var imgTag = $("<img>").attr("src", recipeImage).attr("id", "imgTag" + i).attr("value", recipeImage);
                imgTag.appendTo("#imgDiv" + i);

                var cardStartDiv = $("<div>").attr("class", "card-stacked").attr("id", "cardStartDiv" + i);
                cardStartDiv.appendTo("#cardDiv" + i);

                var cardContentDiv = $("<div>").attr("class", "card-content").attr("id", "cardContentDiv" + i);
                cardContentDiv.appendTo("#cardStartDiv" + i);

                var recipeContentLine1 = $("<h5>").attr("id", "recipeContentLine1" + i).attr("value", numServings).text("Number of Servings: " + numServings);
                recipeContentLine1.appendTo("#cardContentDiv" + i);

                var recipeContentLine2 = $("<h5>").attr("id", "recipeContentLine2" + i).attr("value", caloriesPerServing).text("KCalories: " + caloriesPerServing);
                recipeContentLine2.appendTo("#cardContentDiv" + i);

                var recipeContentLine3 = $("<h5>").attr("id", "recipeContentLine3" + i).attr("value", numIngredients).text("Number of Ingredients: " + numIngredients);
                recipeContentLine3.appendTo("#cardContentDiv" + i);

                var recipeContentLine4 = $("<h5>").attr("id", "recipeContentLine4" + i).attr("value", timeToCook).text("Time to Cook: " + timeToCook);
                recipeContentLine4.appendTo("#cardContentDiv" + i);

                var cardActionDiv = $("<div>").attr("class", "card-action").attr("id", "cardActionDiv" + i);
                cardActionDiv.appendTo("#cardStartDiv" + i);

                var recipeLink = $("<a>").attr("href", recipeURL).attr("target", "_blank").attr("id", "recipeLink" + i).attr("value", recipeURL).text("Ma! Where's the " + recipeName + "?");
                recipeLink.appendTo("#cardActionDiv" + i);

                var saveRecipe = $("<a>").attr("href", "#").attr("id", "saveRecipe" + i).attr("class", "saveRecipe").text("Save this recipe");
                saveRecipe.appendTo("#cardActionDiv" + i);

            });

            //add an event to the 'save this recipe' link to store the recipe in local storage to be displayed on the saved recipes page
            $(".saveRecipe").on("click", function(event){
                event.preventDefault();
                //the id of 'this' is "saveRecipe" plus the initial index, set a variable of index to the i value from the id
                var index = this.id[this.id.length-1];
                //initialize an array variable to hold the saved recipes
                var myObject = JSON.parse(localStorage.getItem("mySavedRecipes") || "[]");
                //create and format a dateSaved variable to display with the recipe on the saved recipe page
                var dateSaved = dateFns.format(new Date(), "MM/DD/YYYY");
                //add all of the keys and values for the single recipe to an object to be stored in the local storage array
                var myNewObject = {
                    "RecipeName": $("#nameDiv" + index).attr("value"),
                    "NumOfIngredients": $("#recipeContentLine3" + index).attr("value"),
                    "NumOfServings": $("#recipeContentLine1" + index).attr("value"),
                    "CaloriesPerServing": $("#recipeContentLine2" + index).attr("value"),
                    "TimeToCook": $("#recipeContentLine4" + index).attr("value"),
                    "RecipeURL": $("#recipeLink" + index).attr("value"),
                    "RecipeImageLink": $("#imgTag" + index).attr("value"),
                    "DateSaved": dateSaved
                }
                //add the new object to the existing object array from local storage
                myObject.push(myNewObject);
                //set the local storage item with the new object added
                localStorage.setItem("mySavedRecipes", JSON.stringify(myObject));
                
            });
            //console log the full response
            console.log(response)
            
        });
    }
})