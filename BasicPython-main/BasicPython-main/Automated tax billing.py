def calculate_bill(price, tax=5):
    total = price + tax
    return total

# Function call with default tax
print("Bill with default tax:", calculate_bill(100))

# Function call with custom tax
print("Bill with custom tax:", calculate_bill(100, 10))