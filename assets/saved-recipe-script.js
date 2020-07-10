$(document).ready(function(){

    //get mySavedRecipes from local storage and account for it not existing and initialize an empty array
    var mySavedObject = JSON.parse(localStorage.getItem("mySavedRecipes") || "[]");

    //call the onLoad() function
    onLoad();

    function onLoad() {
        //if there are no objects in the array then leave the html text
        if (mySavedObject.length > 0) {
            //clear the savedRecipes class
            $("#ifNoSavedRecipes").empty();
        }

        //for each object in the array
        $.each(mySavedObject, function(index) {
            //set variables to shorten the code
            var i = index;
            var d = mySavedObject[i];

            //build the html code using the data from local storage to appear in a "card" format 
            var recipeCardDiv = $("<div>").attr("class", "col s12 m7").attr("id", "recipeCardDiv" + i);
            recipeCardDiv.appendTo(".savedRecipes");

            var nameDiv = $("<h5>").attr("class", "header").attr("id", "nameDiv" + i).attr("value", d.RecipeName).text(d.RecipeName);
            nameDiv.appendTo("#recipeCardDiv" + i);

            var cardDiv = $("<div>").attr("class", "card horizontal").attr("id", "cardDiv" + i);
            cardDiv.appendTo("#recipeCardDiv" + i);

            var imgDiv = $("<div>").attr("class", "card-image").attr("id", "imgDiv" + i);
            imgDiv.appendTo("#cardDiv" + i);

            var imgTag = $("<img>").attr("src", d.RecipeImageLink).attr("id", "imgTag" + i).attr("value", d.RecipeImageLink);
            imgTag.appendTo("#imgDiv" + i);

            var cardStartDiv = $("<div>").attr("class", "card-stacked").attr("id", "cardStartDiv" + i);
            cardStartDiv.appendTo("#cardDiv" + i);

            var cardContentDiv = $("<div>").attr("class", "card-content").attr("id", "cardContentDiv" + i);
            cardContentDiv.appendTo("#cardStartDiv" + i);

            var recipeContentLine1 = $("<h5>").attr("id", "recipeContentLine1" + i).attr("value", d.NumOfServings).text("Number of Servings: " + d.NumOfServings);
            recipeContentLine1.appendTo("#cardContentDiv" + i);

            var recipeContentLine2 = $("<h5>").attr("id", "recipeContentLine2" + i).attr("value", d.CaloriesPerServing).text("Calories per Serving: " + d.CaloriesPerServing);
            recipeContentLine2.appendTo("#cardContentDiv" + i);

            var recipeContentLine3 = $("<h5>").attr("id", "recipeContentLine3" + i).attr("value", d.NumOfIngredients).text("Number of Ingredients: " + d.NumOfIngredients);
            recipeContentLine3.appendTo("#cardContentDiv" + i);

            var recipeContentLine4 = $("<h5>").attr("id", "recipeContentLine4" + i).attr("value", d.TimeToCook).text("Time to Cook: " + d.TimeToCook);
            recipeContentLine4.appendTo("#cardContentDiv" + i);

            var recipeContentLine5 = $("<h6>").attr("id", "recipeContentLine5" + i).attr("value", d.DateSaved).text("Date Recipe Saved: " + d.DateSaved);
            recipeContentLine5.appendTo("#cardContentDiv" + i);

            var cardActionDiv = $("<div>").attr("class", "card-action").attr("id", "cardActionDiv" + i);
            cardActionDiv.appendTo("#cardStartDiv" + i);

            var recipeLink = $("<a>").attr("href", d.RecipeURL).attr("target", "_blank").attr("id", "recipeLink" + i).attr("value", d.RecipeURL).text("Ma! Where's the " + d.RecipeName + "?");
            recipeLink.appendTo("#cardActionDiv" + i);

            var clearRecipe = $("<a>").attr("href", "#").attr("id", "clearRecipe" + i).attr("class", "clearRecipe").text("Remove this recipe");
            clearRecipe.appendTo("#cardActionDiv" + i);

        });

        //on click event for the clear recipe link
        $(".clearRecipe").on("click", function(event){
            event.preventDefault();
            //the id of 'this' is "clearRecipe" plus the initial index, set a variable of i to the i value from the id
            var i = this.id[this.id.length - 1];

            //remove the object from the array
            mySavedObject.splice(i, 1);
            //set the local storage item with the new object
            localStorage.setItem("mySavedRecipes", JSON.stringify(mySavedObject));
            //reload the page
            location.reload();
            
        });
    }
});