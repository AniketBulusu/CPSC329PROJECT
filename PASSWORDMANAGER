### LIBRARIES ###
import sqlite3
import init_db as db
from datetime import datetime as dt
from argon2 import PasswordHasher
ph = PasswordHasher()


### FUNCTIONS ###

# prints welcome window
def welcome():
    print("==========================================================================================================================")
    print("|                                      WELCOME TO YOUR PASSWORD MANAGER!!                                    |")
    print("|  YOU WILL BE CREATING AN ACCOUNT TO STORE ALL YOUR USERNAMES/PASSWORDS ASSOCIATED WITH THE REGULAR SERVICES YOU USE!  |")
    print("=======================================")
    print("Choose one of the following options: ")
    print("1. Login")
    print("2. Registration")
    print("3. Exit")


# prints directory window
def directory():
    print("======================================")
    print("|              Servies             |")
    print("======================================")
    print("1. Youtube")
    print("2. Twitter")
    print("3. Snapchat")
    print("4. Gmail")
    print("4. Exit")


## LOGIN / REGISTRATION

# user_id generation
# @return: new user_id
def user_id():

    # search for the maximum number of user_id in the user_profile table
    user_id = db.curr.execute("SELECT MAX(cast(user_id AS INTEGER)) FROM user_profile")
    user_id = db.curr.fetchone()

    # first user
    if user_id[0] is None:
        return 1

    # subsequent users
    else:
        return int(user_id[0]) + 1


# check username
# @param: username input by user
# @return: boolean True when there is such username in the user_profile table
def check_username(username):

    # search for username in user_profile table
    db.curr.execute("SELECT * FROM user_profile WHERE username=?", (username,))
    existing_user = db.curr.fetchone()

    return existing_user is not None


# check password
# @param: username and password input by user
# @return: boolean True when the password matches the username in the user_profile table
def check_password(username, password):

    # search for the username's password
    db.curr.execute("SELECT password FROM user_profile WHERE username=?", (username,))
    password_match = db.curr.fetchone()

    if password_match is None:
        return False
    try:
        return ph.verify(password_match[0], password)
    except:
        return False


# check email
# @param: email input by user
# @return: boolean True when there is such email in the user_profile table
def check_email(email):

    # search whether email is in the user_profile table
    db.curr.execute("SELECT * FROM user_profile WHERE email=?", (email,))
    existing_email = db.curr.fetchone()

    return existing_email is not None


# registration - adds new user to the user_profile table
# @param:
    # user_id: the new user_id 
    # username: username input by the user
    # password: password input by the user
    # full_name: full name input by the user
    # email: email input by the user
    
def new_user_entry(user_id, username, password, full_name, email):
    # generate registration date
    registration_date = dt.now()

    # add new user without profile image
    db.curr.execute("""
        INSERT INTO user_profile 
        (user_id, username, password, full_name, email, registration_date) 
        VALUES (?, ?, ?, ?, ?, ?) 
    """, (user_id, username, password, full_name, email, registration_date))

    db.conn.commit()


# login flow
# @return: user_id of the login
def login():

    # username input
    username = str(input("Username: "))

    # error handling when no username is entered
    while len(username) == 0:
        print("Error: Username must be at least one character.")
        username = str(input("Username: "))

    # password input
    password = str(input("Password: "))

    # error handling when no password is entered
    while len(password) == 0:
        print("Error: Password must be at least one character.")
        password = str(input("Enter Password again"))

    # check if password and username match the database
    username_match = check_username(username)
    password_match = check_password(username, password)

    # if login is successful, direct to the directory
    if username_match and password_match:
        print("Login successful!")

    # if login is not successful (password and username did not match), ask for login details again
    while not password_match or not username_match:
        print("Error: Username or password does not match. Please retry.")
        main()

    # get the user_id of the user logged in
    db.curr.execute("SELECT user_id FROM user_profile WHERE username=?", (username,))
    user_id = db.curr.fetchone()

    return user_id[0]


# password strength
# @return: boolean True if it is a strong password
def password_strength(password):

    special = "[@_!#$%^&*()<>?/|\+-~`=}{~:;.]"
    a, b, c, d = 0, 0, 0, 0

    # checks if the password contains at least 8 characters, lowercase, uppercase, digits, and special characters
    if (len(password) >= 8):
        for char in password:
            if (char.islower()):
                a += 1
            if (char.isupper()):
                b += 1
            if (char.isdigit()):
                c += 1
            if (char in special):
                d += 1

    if (a >= 1 and b >= 1 and c >= 1 and d >= 1 and a + b + c + d == len(password)):
        return True
    else:
        return False


# registration flow
# @return: new user_id generated
def registration():

    # username input
    username = str(input("Username: "))

    # error handling when no username is entered
    while len(username) == 0:
        print("Error: Username must be at least one character.")
        username = str(input("Username: "))

    # password input
    password = str(input("Password: "))

    # error handling when password is not strong
    while password_strength(password) == False:
        print("Error: Password must contain at least 8 characters, lowercase, uppercase, digits, and special characters.")
        password = str(input("Password: "))

    # hashing password
    hashed = ph.hash(password)

    # check if the user is an existing user
    username_match = check_username(username)

    # if an existing account is found, ask for login or registration again
    if username_match:
        print("Error: An existing account is found with the username. Please register again or login instead.")
        main()

    # if it is a new account being registered
    else:

        # full name prompt
        full_name = str(input("Full Name: "))
        while len(full_name) == 0:
            print("Error: Full name must be at least one character.")
            full_name = str(input("Full Name: "))

        # email prompt
        email = str(input("Email: "))
        while len(email) == 0:
            print("Error: Email must be at least one character.")
            email = str(input("Email: "))

        # check whether email exists
        while check_email(email):
            print("Error: The email is already associated with an account. Please use a different email.")
            email = str(input("Email: "))

        # generate new user id
        new_userid = user_id()

        # add this new user to the user_profiles table
        new_user_entry(new_userid, username, hashed, full_name, email)

        return new_userid


# main
def main():
    # connect to a new database
    conn = sqlite3.connect('PASSWORDMANAGER.db')
    curr = conn.cursor()

    # welcome option
    welcome()
    welcome_option = str(input("What would you like to do?: "))

    while welcome_option not in ["1", "2" , "3"]:
        print("Error: Invalid option. Please enter 1,2, or 3")
        welcome_option = str(input("What would you like to do?: "))

    # login
    if welcome_option == "1":
        new_userid = login()

    # registration
    if welcome_option == "2":
        new_userid = registration()
    
    elif welcome_option == "3":
        print("No changes were made to your usernames/passwords. Thank you and have a wonderful day! ")
        return
        

    while True:
        # print directory
        directory()

        # directory input
        directory_selection = str(input("What would you like to do?: "))

        # error handling
        while directory_selection not in ["1", "2", "3", "4"]: # #TBA with more services 
            print("Error: Please enter a correct directory number between 1 to 4.")
            directory_selection = str(input("What would you like to do?: "))

        # Add your directory option handling here
        if directory_selection == "4":
            print("Goodbye!")
            break


if __name__ == "__main__":
    main()
    db.conn.close()
