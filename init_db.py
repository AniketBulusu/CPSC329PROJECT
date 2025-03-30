# import libraries
import sqlite3
from datetime import datetime as dt
from argon2 import PasswordHasher
ph = PasswordHasher()

# connect database
conn = sqlite3.connect('PASSWORDMANAGER.db')
conn.commit()
curr = conn.cursor()

## create tables
# user profile table
user_profile_sql = '''CREATE TABLE IF NOT EXISTS user_profile (user_id TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL, full_name TEXT NOT NULL, email TEXT NOT NULL, registration_date TIMESTAMP, PRIMARY KEY (user_id))'''
curr.execute(user_profile_sql)

## data population

try:  
    # add users
    hash = ph.hash("Howard@1")
    curr.execute("""INSERT INTO user_profile (user_id, username, password, full_name, email,registration_date) VALUES (?, ?, ?, ?, ?,?) """, ("1", "HowardLeong", hash, "Howard Leong", "howard@ucalgary.ca",dt.now()),)
    hash = ph.hash("Aniket@1")
    curr.execute("""INSERT INTO user_profile (user_id, username, password, full_name, email,registration_date) VALUES (?, ?, ?, ?, ?,?) """, ("2", "AniketBulusu", hash, "Aniket Bulusu", "aniket@ucalgary.ca",dt.now()),)
    hash = ph.hash("Shubhang@1")
    curr.execute("""INSERT INTO user_profile (user_id, username, password, full_name, email,registration_date) VALUES (?, ?, ?, ?, ?,?) """, ("3", "ShubhangPeri", hash , "Shubhang Peri", "shubhang@ucalgary.ca",dt.now()),)
    hash = ph.hash("Jon@12345")
    curr.execute("""INSERT INTO user_profile (user_id, username, password, full_name, email,registration_date) VALUES (?, ?, ?, ?, ?,?) """, ("4", "JonStewart", hash , "JonStewart", "jon@ucalgary.ca",dt.now()),)
    hash = ph.hash("Conan@12345")
    curr.execute("""INSERT INTO user_profile (user_id, username, password, full_name, email,registration_date) VALUES (?, ?, ?, ?, ?,?) """, ("5", "ConanOBrien", hash , "Conan OBrien", "conan@ucalgary.ca",  dt.now()),)
    hash = ph.hash("Sam@12345")
    curr.execute("""INSERT INTO user_profile (user_id, username, password, full_name, email,registration_date) VALUES (?, ?, ?, ?, ?,?) """, ("6", "SamHarris", hash , "Sam Harris", "sam@ucalgary.ca",  dt.now()),)
    hash = ph.hash("Bill@12345")
    curr.execute("""INSERT INTO user_profile (user_id, username, password, full_name, email,registration_date) VALUES (?, ?, ?, ?, ?,?) """, ("7", "BillMaher", hash, "Bill Maher", "bill@ucalgary.ca", dt.now()),)
    hash = ph.hash("Steven@12345")
    curr.execute("""INSERT INTO user_profile (user_id, username, password, full_name, email,registration_date) VALUES (?, ?, ?, ?, ?,?) """, ("8", "StevenBarlett", hash, "Steven Barlett", "steven@ucalgary.ca",  dt.now()),)
    hash = ph.hash("Asheesh@12345")
    curr.execute("""INSERT INTO user_profile (user_id, username, password, full_name, email,registration_date) VALUES (?, ?, ?, ?, ?,?) """, ("9", "AsheeshAdvani", hash, "Asheesh Advani", "asheesh@ucalgary.ca", dt.now()),)
    hash = ph.hash("Ray@12345")
    curr.execute("""INSERT INTO user_profile (user_id, username, password, full_name, email,registration_date) VALUES (?, ?, ?, ?, ?,?) """, ("10", "RayDalio", hash, "Ray Dalio", "ray@ucalgary.ca", dt.now()),)
except: 
    pass

conn.commit()
