import pandas as pd
from pymongo import MongoClient
import json

def connect_to_mongodb():
    client = MongoClient("mongodb://bmblx999:indra999@ac-aitzldg-shard-00-00.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-01.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-02.uoyd2xl.mongodb.net:27017/ompunet?replicaSet=atlas-vrw4js-shard-0&ssl=true&authSource=admin")
    db = client['ompunet']
    collection = db['raw']
    return collection

def save_to_mongodb(collection, data):
    if isinstance(data, list):
        collection.insert_many(data)
    else:
        collection.insert_one(data)
    print("Data berhasil disimpan ke MongoDB.")

def load_csv_data(file_path):
    try:
        data = pd.read_csv(file_path)
        data_json = json.loads(data.to_json(orient='records'))
        print("Data CSV berhasil diambil.")
        return data_json
    except Exception as e:
        print("Terjadi kesalahan saat mengambil data dari CSV:", e)
        return None

def run_data_ingestion():
    collection = connect_to_mongodb()
    
    csv_data = load_csv_data('company_data.csv')
    if csv_data:
        save_to_mongodb(collection, csv_data)

if __name__ == '__main__':
    run_data_ingestion()
