from dbconn import MyDB_Handler
from fastapi import FastAPI, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import json
from bson import json_util
from fastapi.responses import FileResponse
import pandas as pd
import os



app = FastAPI()
dbHandler = MyDB_Handler()
Col = dbHandler.create_collection("Users")
Col_IE = dbHandler.create_collection("ImportExport")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return {"msg": "Backend running successfully...", "status": "OK"}


@app.post("/register")
async def register(photo: UploadFile, fname: str = Form(), lname: str = Form(), email: str = Form(), password: str = Form(), gender: str = Form()):
    data = {"fname": fname, "lname": lname, "email": email, "password": password, "gender": gender, "photo": photo.filename}
    with open("ProfilePhoto/"+photo.filename, 'wb') as f:
        content = photo.file.read() 
        f.write(content) 
    Col.insert_one(data)
    return {"msg": "Backend running successfully...", "status": "OK"}

@app.get("/get-data")
def get_data():
    data = list(Col.find())
    json_data_with_backslashes = json_util.dumps(data)
    json_data = json.loads(json_data_with_backslashes)

    return {"msg": "Backend running successfully...", "status": "OK", "data": json_data}

@app.get("/ProfilePhoto/{photo}")
def ProfilePhoto(photo):
    return FileResponse("ProfilePhoto/"+photo)


#################################
# : IMPORT AND EXPORT PROGRAM : #
#################################

@app.post("/import")
async def importFun(csvFile: UploadFile):
    with open(csvFile.filename, 'wb') as f:
        content = csvFile.file.read() 
        f.write(content) 

    # Make a data-frame and process it then insert to your database
    df = pd.read_csv(f"./{csvFile.filename}")

    # Once dataframe is ready please delete the file
    os.remove(csvFile.filename)

    processedData = []
    for i in range(len(df)):
        data = {}
        for k in list(df.keys()):
            if k == "age":
                val = int(df[i:i+1][k].values[0])
                # print(type(val), type(df[i:i+1][k].values[0]))
            else:
                val = df[i:i+1][k].values[0]
            data = {**data, k: val}
        processedData.append(data)
    Col_IE.insert_many(processedData)
    return {"msg": "Backend running successfully...", "status": "OK"} 


@app.get("/ie-user-data")
def ie_user_data():
    data = list(Col_IE.find())
    json_data_with_backslashes = json_util.dumps(data)
    json_data = json.loads(json_data_with_backslashes)

    return {"msg": "Backend running successfully...", "status": "OK", "data": json_data}

