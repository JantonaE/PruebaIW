import os
import certifi
from pymongo import MongoClient
from urllib.parse import quote_plus
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


host = os.getenv('MONGO_HOST') 
user = os.getenv('MONGO_USERNAME')
password = os.getenv('MONGO_PASSWORD')


uri = "mongodb+srv://%s:%s@%s" % (
quote_plus(user), quote_plus(password), host)
    
conn = MongoClient(uri, tlsCAFile=certifi.where())