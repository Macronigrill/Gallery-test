//This script allows the uploading of images with a username and a description on the server, and displays uploaded images on the website.

//Setting references for the elements of the website that are needed to collect the data for an upload and previewing the image to be uploaded
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const userInput = document.getElementById("userInput");
const titleInput = document.getElementById("titleInput");
const descriptionInput = document.getElementById("descriptionInput");
const gallery = document.getElementById("gallery");


//Displayin a preview when an file is place in the image upload input

//Adding an event listener to the image Input, to detect when a file is selected to be uploaded
imageInput.addEventListener("change", function(){
  //grabbing the image file from the image Input
  var file = imageInput.files[0];
  //Detecting if the input is a file or empty
  if (file) {
    //Declaring a FileReader that will convert the Data into a URL to display
    const reader = new FileReader();

    //Setting the image preview to the readers result
    reader.onload = function () {
      imagePreview.src = reader.result;
    };

    //Converting the data into a URL that can be used in an HTML script
    reader.readAsDataURL(file);
  } 
  //Setting the preview to not display an image, if no file is detected
  else {
    imagePreview.src = "#";
  }
});

//This function is called when the Upload button is clicked, sending the data to the server as Form data
function submitImage() {
  //Grabbin the data to be sent from the relevant fields on the website. The references to these have been declared earlier.
  const file = imageInput.files[0];
  const username = userInput.value;
  const title = titleInput.value;
  const description = descriptionInput.value;

  //Detecting if the inputs contain any data, throwing an error if they dont. Descriptions are not checked because theyre optional.
  if (!file) {
    alert("Select an image!");
  }
  if (username == "") {
    alert("Enter a username!");
  }
  if (title == "") {
    alert("Enter a title!");
  }

  //Declaring empty FormData to add the data to
  const formData = new FormData();

  //Adding the data from the website to the Form Data
  formData.append("image", file);
  formData.append("user", username);
  formData.append("title", title);
  formData.append("description", description);

  //Making a post request to send thhe data
  fetch("/uploadImage", { method: "POST", body: formData })
    //Logging a successfull upload
    .then((response) => {
      console.log("Image Posted Successfully");
    })
    //Logging an error when the upload fails
    .catch((error) => {
      console.error("Error Posting image:", error);
    });
    setTimeout(loadImages(), 2000);
}

//This function gets the images from the server and displays them on the website, with a username and description
function loadImages() {
    //Making a GET request for the list of images
    fetch("/GetImageList")
    //Declaring that the response is a json object
    .then(response => {return response.json()})
    //Using the image information json to display the data and request the actual images
    .then(data => {
        console.log(data);
        imageInfo = data;
        //Making an array of keys in the json (these keys are numbers, this is done so the number of images can be checked)
        imageKeysArray = Object.keys(imageInfo);
        //Running the append image function, for every image in the image Info
        for(let i = 0; i < imageKeysArray.length; i++) {
            //appending the images with the relevant data
            appendImages(i, imageKeysArray);
        }
    })
    
}

//This function is used to display an image on the website, after organizing it into the proper format. it takes an image id,the imageInfo json, and the array of keys in the json as arguments
function appendImages(i,imageKeysArray) {

    
    console.log(imageKeysArray[i])

    //creating the elements necessary to display the image on the website
    const galleryElement = document.createElement("li");
    const userElement = document.createElement("p");
    const titleElement = document.createElement("p");
    const descriptionElement = document.createElement("p");
    const linkElement = document.createElement("a");

    //modifying elements so the image can be clicked to be displayed directly
    linkElement.href = "/GetImages/" + imageKeysArray[i];
    galleryElement.id = "image" + i;

    //Modifying the elements class names so the proper style can be applied
    userElement.className = "userElement";
    descriptionElement.className = "descriptionElement";
    titleElement.className = "titleElement";

    //inserting the data from the image Info json into the HTML elements
    userElement.innerText = "Uploaded by " + imageKeysArray[i]["user"];
    titleElement.innerText = imageKeysArray[i];
    descriptionElement.innerText = imageKeysArray[i]["description"];


    //Constructing the element hierarchy to be displayed on the website
    galleryElement.appendChild(titleElement);
    titleElement.appendChild(descriptionElement);
    galleryElement.appendChild(linkElement);
    galleryElement.appendChild(userElement);

    //Making a GET request for the image in question
    fetch("/GetImages/" + imageKeysArray[i])
      //handling the response
      .then((response) => {
        //throwing an error if the response is faulty
        if (!response.ok) {
          console.error("Error getting image");
        }
        //return the response as a blob
        return response.blob();
      })
      //Creating an image element and adding the response data to it
      .then((blobData) => {
        
        //creating the image element and modifying it to include the image data
        var imgElement = document.createElement("img");
        imgElement.src = URL.createObjectURL(blobData);
        imgElement.className = "galleryImage";
        
        //adding the image to the element created before
        linkElement.appendChild(imgElement);
      })
      //throwing an error if the request fails
      .catch((error) => {
        console.error("Error getting image:", error);
      });
    
    //adding the constructed element to the gallery, displaying it on the website
    gallery.appendChild(galleryElement);
    
}
