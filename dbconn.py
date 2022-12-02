import pymongo
#Creating a pymongo client
client = pymongo.MongoClient('localhost', 27017)

class MyDB_Handler:
    def __init__(self):
        self.db = client['FastApi_DB']

    def create_collection(self, collection):
        obj = self.db[collection]
        print("Collection created....",collection)
        return obj