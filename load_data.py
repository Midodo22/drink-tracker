import mysql.connector as SQLC
import pandas as pd
import os
import numpy as np

def create_db(db_name="drink_tracker"):
    DataBase = SQLC.connect(
        host="localhost",
        user="root", # TODO: Replace with your MySQL username
        password="" # TODO: Replace with your MySQL password
    )

    # Create a cursor object
    cursor = DataBase.cursor()

    # Execute command to create the database
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name};")

    print(f"{db_name} database is created")
    cursor.close()
    DataBase.close()
    
def run_sql_file(sql_file_path):
    # Connect to MySQL
    connection = SQLC.connect(
        host="localhost",
        user="root", # TODO: Replace with your MySQL username
        password="", # TODO: Replace with your MySQL password
        database="drink_tracker"
    )
    cursor = connection.cursor()

    # Read .sql file
    with open(sql_file_path, "r", encoding="utf-8") as file:
        sql_script = file.read()

    # MySQL connector does NOT allow multi-statements by default
    for statement in sql_script.split(";"):
        stmt = statement.strip()
        if stmt:   # skip empty lines
            try:
                cursor.execute(stmt)
            except Exception as e:
                print(f"Error executing statement: {stmt}\n{e}")

    connection.commit()
    cursor.close()
    connection.close()
    print(f"Executed SQL file: {sql_file_path}")

def load_data():
    # Database connection
    connection = SQLC.connect(
        host='localhost',
        user='root', # TODO: Replace with your MySQL username
        password='', # TODO: Replace with your MySQL password
        database='drink_tracker'
    )

    cursor = connection.cursor()

    directory = 'data'  # set directory path

    for entry in os.scandir(directory):
        if not entry.is_file():
            continue

        print(f"Loading CSV: {entry.name}")

        # Load CSV into pandas
        df = pd.read_csv(entry.path)
        df = df.replace({np.nan: None})

        # Extract table name from filename
        table_name = entry.name.split('.')[0]

        # Get column names from first row
        columns = df.columns.tolist()
        
        insert_sql = f"""
            INSERT INTO `{table_name}` ({", ".join(['`'+c+'`' for c in columns])})
            VALUES ({", ".join(["%s"] * len(columns))});
        """

        for _, row in df.iterrows():
            cursor.execute(insert_sql, tuple(row[col] for col in columns))

        connection.commit()
        print("Data inserted successfully!")

    # Close the connection
    cursor.close()
    connection.close()

if __name__ == "__main__":
    create_db()
    run_sql_file("drink_db.sql")
    load_data()
