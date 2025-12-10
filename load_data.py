import mysql.connector as SQLC
import pandas as pd
import os

def create_db(db_name="drink_tracker"):
    DataBase = SQLC.connect(
        host="localhost",
        user="root",
        password=""
    )

    # Create a cursor object
    Cursor = DataBase.cursor()

    # Execute command to create the database
    Cursor.execute(f"CREATE DATABASE {db_name};")

    print(f"{db_name} database is created")

def create_tables():
    # Database connection
    # connection = mysql.connector.connect(
    #     host='localhost',         # Replace with your host
    #     user='root',     # Replace with your MySQL username
    #     password='', # Replace with your MySQL password
    #     database='drink_tracker'  # Replace with your database name
    # )

    # cursor = connection.cursor()

    directory = 'data'  # set directory path

    for entry in os.scandir(directory):  
        if entry.is_file():  # check if it's a file
            print(f"Loading data from {entry.path}")

        csv_file = entry  # Replace with the path to your CSV file
        data = pd.read_csv(csv_file)

        table_name = entry.name.split('.')[0]
        print(f"Table name: {table_name}")
        print(f"Data: {data}")
        # for index, row in data.iterrows():
        #     # cursor.execute(
        #     #     "INSERT INTO your_table_name (id, name, email) VALUES (%s, %s, %s)",
        #     #     (row['id'], row['name'], row['email'])
        #     # )
        #     print("INSERT INTO your_table_name (id, name, email) VALUES (%s, %s, %s)",
        #         (row['id'], row['name'], row['email']))

        # Commit the transaction
        # connection.commit()

        print("Data imported successfully!")

    # Close the connection
    # cursor.close()
    # connection.close()

if __name__ == "__main__":
    create_db()
    create_tables()
