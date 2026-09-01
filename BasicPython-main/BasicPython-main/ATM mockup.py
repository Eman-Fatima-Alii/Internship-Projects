balance = 10000

withdraw = int(input("Enter withdraw amount: "))

if withdraw <= balance:
    print("Success")
else:
    print("Insufficient Balance")