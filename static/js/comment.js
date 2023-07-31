
//This Script Handles the Receiving, Displaying, and storing data of comment section on the website

//~~~~~~~~~~~~[Part 1 - Getting Comments]~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//The first part of the script handles receiving the comments from the server, and Displaying them

//Explanation:
//The script sends a request to the server to GET the comments as a JSON file,
//it iterates over every element in the comments file, it creates a new list
//object and 2 paragraph object for each of them,
//then it adds the username and text of the comment to the 2 paragraph, appends these to the list object,
//then appends the list object to the ordered list containing the comments.

//~~~~~~~~~~~~[Part 2 - Makingg Comments]~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//The second part of the script handles packaging of data from the comment area, and sending it to the server to be stored

//Explanation:
//The script reads the text data from the Username and Comment fields, then adds it to a JSON object.
//this JSON object is then sent to the server with a simple POST request.

//~~~~~~~~~~~~[Script]~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//this function is called on load, it makes a fetch request for the comments from "/GetComments"
//It then uses the data response to determine the length of the comment list, and stores the data in a variable.
//After this it iterates over the comment list, and appends each comment to the ordered list.
function getComments() {

    //Make a fetch request to "/GetComments":
     fetch("/GetComments")
    
    //Parse the response as a JSON file:
     .then(response => response.json())

    //Handle the actual data:    
     .then(data => {
        //store the data in a variable, and create an array for the keywords in the JSON:
         var lengthArray = Object.keys(data);
         var comments = data;

        //Create reference for the ordered list the comments will be appended to
         var commentSection = document.getElementById("commentSection");

        //Clear comment section before adding comments
         commentSection.innerHTML = "";

        //Iterate over the list, creating a comment for each key:
         for (i = 1; i <= lengthArray.length; i++) {
          //Call the appenddComment function to create the elements and display the text:
           appendComment(comments[i]["User"], comments[i]["Text"],commentSection);
         }
     })
    
     //Throw an error if the request fails:
     .catch(error => {console.log("Error Getting comments:", error)})
}

//This function appends the comments to the ordered list
function appendComment(user,text, commentSection) {



    //Create the necessary elements:
     var commentElement = document.createElement("li");
     var userElement = document.createElement("p");
     var textElement = document.createElement("p");

    //Store the username and text within the elements: 
     userElement.innerText = user;
     textElement.innerText = text;

    //Append the elements to the list element, then to the comment section:
     commentElement.appendChild(userElement);
     commentElement.appendChild(textElement);
     commentSection.appendChild(commentElement);
}

//This function handles sending comments from the comment box to the server, when the button is clicked.
function makeComment() {
    
    //The Users Input is packaged into a JSON object:
    var Comment = generateData();

    //The JSON object is sent along to the server:
    fetch("/makeComment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Comment),
    })
    //An error is logged if the posting fails:
    .catch((error) => {console.log("Error making comment:", error)})

    //Update the comments to reflect the change:
    getComments();
}

//This function packages the Users Input the required format for the server
function generateData() {
    //Getting references for the text areas:
    var UsernameBox = document.getElementById("userBox")
    var CommentBox = document.getElementById("commentBox")

    //todo: check if text is actually present, send an error if its not
    if (UsernameBox.value == "" || CommentBox.value == "") {alert("Enter a comment first!")}

    //extracting input from the text areas:
    var Username = UsernameBox.value;
    var CommentText = CommentBox.value;

    //packaging the input into the correct format:
    var Comment = {"User" : Username, "Text" : CommentText};

    //clearing the comment box so the user can type a new comment easily:
    CommentBox.value = "";

    //sending the comment back to the code that called this function:
    return Comment
}