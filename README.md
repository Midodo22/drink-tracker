# Diabetes Progress Tracker
## drink tracker
NYCU 2025 動態網頁程式設計 Final Project－手搖飲紀錄系統
112550124, 112550151, 112550198

# Setup
## Create database
1. Directory setup
    Put load_data.py and drink_db.sql under the same directory, make sure the folder data is downloaded and contains csv files
2. MySQL settings
    Go to load_data.py and change the host, username, and password settings to your own. Please not that there are 3 functions and all 3 have to be modified.
3. Execution
    Execute `pip install mysql-connector-python` if mysql-connector isn't installed,  and run load_data.py. If execution fails, please delete the database and try again after resolving the issue.
