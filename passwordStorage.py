import PASSWORDMANAGER

def addPassword():
    PASSWORDMANAGER.clear_screen()

    print("="*100)
    print("ADD YOUR PASSWORDS".center(100))
    print("="*100)
    service = input("Service: ")
    username = input("Username: ")
    password = input("Password: ")
    # Add to database
    print(f"Added {service} credentials!")