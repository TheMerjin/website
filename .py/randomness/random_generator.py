import random

lists = [random.choices(range(1, 6), k=500) for _ in range(1)]

print(lists)
