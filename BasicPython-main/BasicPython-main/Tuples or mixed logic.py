identity = ("35202-1234567-8", "01-01-2005")

print(identity)

# Tuples are immutable.
# This line will cause an error.

identity[0] = "35202-1111111-1"

# TypeError: 'tuple' object does not support item assignment