import csv
import pymongo
import os

client = pymongo.MongoClient("mongodb://bmblx999:indra999@ac-aitzldg-shard-00-00.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-01.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-02.uoyd2xl.mongodb.net:27017/rawData?replicaSet=atlas-vrw4js-shard-0&ssl=true&authSource=admin")
db = client["rawData"]
collection = db["raw_data"]

def generate_company_csv(filename='company_data_2.csv'):
    data = [
        ["header", "title", "description"],  
    ]
    for i in range(50):  
        data.append([
            f"Company Report",
            f"Transaction {i+10}",
            f"This is a description for transaction {i+10} for Company XYZ."
        ])

    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(data)
    print(f"Dummy company CSV data generated in {filename}.")

def insert_unique_data_from_csv(filename='company_data.csv'):
    if not os.path.exists(filename):
        generate_company_csv(filename)
    with open(filename, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            
            exists = collection.find_one({
                "header": row["header"],
                "title": row["title"],
                "description": row["description"]
            })
            if not exists:
                collection.insert_one(row)
                print(f"Inserted: {row['header']}")
            else:
                print(f"Skipped (duplicate): {row['header']}")

def main():
    generate_company_csv()
    insert_unique_data_from_csv()
    
if __name__ == "__main__":
    main()
