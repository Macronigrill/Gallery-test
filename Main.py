#Import fastAPI to handle HTTP request
from fastapi import FastAPI, Form, UploadFile, File

#Import HTMLResponse to send out files properly
from fastapi.responses import HTMLResponse, FileResponse

#Import staticFiles to mount a file structure easily
from fastapi.staticfiles import StaticFiles

from pathlib import Path

#Import Json to handle json files
import json

#Import uvicorn to handle server
import uvicorn

#Creating the API for  the server to run
testAPI = FastAPI()

#Setting The filepath where the file containing comments and image data is found
commentPath = Path("variable/Json/comments.json")
imageDataPath = Path("variable/Json/imageData.json")

#Mounting the static filetree, to serve these files easily
testAPI.mount("/static", StaticFiles(directory="./static"),name="static")

#Defining the method to be called when an Empty GET request is made - might update this to reroute to static filetree if possible
@testAPI.get("/", response_class=HTMLResponse)
def home():
    file = open("index.html", "rb")
    return file.read()



@testAPI.get("/GetImageList")
def getImageList():
    with open(imageDataPath,"r") as imageDataFile:
        imageData = json.load(imageDataFile)
        print(imageData)
        return imageData
    
@testAPI.get("/GetImages/{title}")
def getImages(title : str):
    imagePath = "variable/images/{}.png".format(title)
    return FileResponse(imagePath, media_type="image/png")

imagePath = Path("variable/Json/imageData.json")

@testAPI.post("/uploadImage")
def uploadImage( user: str = Form(...),title: str = Form(...), description : str = Form(...), image: UploadFile = File(...) ):
   
    imageDataFile = open(imageDataPath,"r")
    imageData = json.load(imageDataFile)

    file = open(f"./variable/images/{title}.png", "wb")
    file.write(image.file.read())

    if imageData[title]:
        return "Error"
    
    imageData[title] = {"user": user, "description": description}

    imageDataFile = open(imageDataPath,"w")
    json.dump(imageData, imageDataFile)









    

#Hosting the actual server - might separate server and API scripts in the future
uvicorn.run(testAPI, host="192.168.5.141", port=5500, log_level= "info")

