#Import fastAPI to handle HTTP request
from fastapi import FastAPI, Form, UploadFile, File

#Import HTMLResponse to send out files properly
from fastapi.responses import HTMLResponse, FileResponse

#Import staticFiles to mount a file structure easily
from fastapi.staticfiles import StaticFiles

from pathlib import Path

#Import Json to handle json files
import json

#importing os to remove files if necessary
import os

#Import uvicorn to handle server
import uvicorn

#Creating the API for  the server to run
testAPI = FastAPI()

#Setting The filepath where the file containing comments and image data is found
imageDataPath = Path("variable/Json/imageData.json")

#Mounting the static filetree, to serve these files easily
testAPI.mount("/static", StaticFiles(directory="./static"),name="static")

#Defining the method to be called when an Empty GET request is made - might update this to reroute to static filetree if possible
@testAPI.get("/", response_class=HTMLResponse)
def home():
    file = open("static/html/index.html", "rb")
    return file.read()



#This endpoint sends out the master JSON containing all image information
@testAPI.get("/GetImageList")
def getImageList():
    with open(imageDataPath,"r") as imageDataFile:
        imageData = json.load(imageDataFile)
        print(imageData)
        return imageData

#tis endpoint sends out a specific image   
@testAPI.get("/Images/get/{title}")
def getImages(title : str):
    imagePath = f"./variable/images/{title}.png"
    return FileResponse(imagePath, media_type="image/png")

#this endpoint is used to store an image sent by a user
@testAPI.post("/uploadImage")
def uploadImage( user: str = Form(...),title: str = Form(...), description : str = Form(...), image: UploadFile = File(...) ):
   
    #opening the master image data JSON
    imageDataFile = open(imageDataPath,"r")
    imageData = json.load(imageDataFile)

    #cleaning up the title to remove dots
    title.replace("."," ")
    
    #return error if an image with this title already exists
    if title in imageData:
        return "Error"

    #saving the image with the proper title
    file = open(f"./variable/images/{title}.png", "wb")
    file.write(image.file.read())
    
    #adding data about the new image to the master JSON
    imageData[title] = {"user": user, "description": description}

    #saving the changes to the master JSON
    imageDataFile = open(imageDataPath,"w")
    json.dump(imageData, imageDataFile)

#This endpoint deletes an image from storage
@testAPI.delete("/Images/delete/{title}")
def deleteImage(title:str):
    
    imagePath = f"./variable/images/{title}.png"
    
    imageDataFile = open(imageDataPath,"r")
    imageData = json.load(imageDataFile)

    if title in imageData:
        imagePath = f"./variable/images/{title}.png"
        os.remove(imagePath)

        del imageData[title]

        imageDataFile = open(imageDataPath,"w")
        json.dump(imageData, imageDataFile)
    else:
        return "error"










    

#Hosting the actual server - might separate server and API scripts in the future
uvicorn.run(testAPI, host="192.168.5.141", port=5500, log_level= "info")

