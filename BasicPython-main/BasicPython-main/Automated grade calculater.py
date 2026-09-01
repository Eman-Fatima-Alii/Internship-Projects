def calculate_grade(marks):
    if marks > 90:
        return "A"
    elif marks > 80:
        return "B"
    else:
        return "C"

marks = int(input("Enter marks: "))

grade = calculate_grade(marks)

print("Grade:", grade)