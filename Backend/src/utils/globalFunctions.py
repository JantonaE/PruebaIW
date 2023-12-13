from datetime import datetime
from math import atan2, cos, radians, sin, sqrt
from bson import ObjectId
from dotenv import find_dotenv, load_dotenv
import requests
from ..config.db import conn
import os

load_dotenv(find_dotenv())

date_format = '%d/%m/%Y'
api_geo_key = os.getenv('API_GEO_KEY')
api_worldtime_key = os.getenv('API_NINJA')
api_co2_key = os.getenv('CO2INT_KEY')
url_co2_api = 'https://www.carboninterface.com/api/v1/estimates'
carbon_tax = 0.04685 # € / kg

# Function to calculate distance using Haversine formula
def calculate_distance(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    radius_of_earth = 6371  # Radius of the Earth in kilometers
    distance = radius_of_earth * c

    return distance # Distance in kilometers

def calculate_carbon_price(peso, distancia):
    headers_co2_api = {'Authorization': 'Bearer ' + api_co2_key, 'Content-Type': 'application/json'}

    response = requests.post(url_co2_api, headers=headers_co2_api, 
                             json={
                              "type": "shipping", 
                              "distance_unit": "km", 
                              "distance_value": distancia,
                              "weight_unit": "kg",
                              "weight_value": peso, 
                              "transport_method": "ship", 
                              })
    carbon_kg = response.json().get('data').get('attributes').get('carbon_kg')
    # DEBUG - print(carbon_tax * carbon_kg)
    return carbon_tax * carbon_kg

def actualTimeByCoords(lat, long):
    worldtime_api_url = f'https://api.api-ninjas.com/v1/worldtime?lat={lat}&lon={long}'
    response = requests.get(worldtime_api_url, headers={'X-Api-Key': api_worldtime_key})
    data = response.json()
    formatted_date = data['day'] + '/' + data['month'] + '/' + data['year']

    return formatted_date

def search_adress(lat,long):
    url_geo = f'https://api.opencagedata.com/geocode/v1/json?q={lat}+{long}&key={api_geo_key}'

    response = requests.get(url_geo)
    data = response.json()

    if data["status"]["code"] == 200:
        results = data["results"]
        if results:
            formatted_address = results[0]["formatted"]
            #location = formatted_address.split(',')
            #final_location = location[0]+", "+location[2]+", "+location[4]
            #print(formatted_address)
        else:
            print("No results found.")
    else:
        print(f"Error: {data['status']['message']}")
    
    return formatted_address 

def compare_dates(f1, f2):
    d1, m1, y1 = [int(x) for x in (f1).split('/')]
    d2, m2, y2 = [int(x) for x in (f2).split('/')] 
    date1 = datetime(y1, m1, d1)
    date2 = datetime(y2, m2, d2)
    return (date1 - date2).days

def highestBidForProduct(id):
    pujas = conn.elRastro.Puja.find({"producto": id})
    highest = conn.elRastro.Producto.find_one({"_id": ObjectId(id)})["precio"]
    for puja in pujas:
        if puja["cantidad"] > highest:
            highest = puja["cantidad"]
    return highest