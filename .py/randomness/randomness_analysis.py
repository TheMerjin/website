import math


from collections import Counter
from itertools import permutations

computer_lists = [
    [56, 82, 6, 49, 56, 91, 90, 50, 24, 28, 37, 43, 63, 64, 18, 65, 81, 70, 72, 66],
    [37, 1, 98, 7, 53, 14, 50, 86, 57, 15, 45, 75, 85, 99, 47, 5, 69, 61, 36, 3],
]

human_lists = [
    [67, 23, 56, 41, 99, 76, 23, 49, 50, 11, 2, 39, 83, 40, 12, 49, 30, 89, 77, 59],
    [49, 83, 28, 82, 93, 18, 93, 40, 29, 39, 4, 38, 59, 19, 38, 59, 3, 57, 59, 83],
]


def permutation_test(data):
    # All six possible orderings
    patterns = list(permutations((0, 1, 2)))
    counts = Counter()

    for i in range(len(data) - 2):
        triple = data[i : i + 3]

        # indices that would sort the triple
        pattern = tuple(sorted(range(3), key=lambda j: triple[j]))
        counts[pattern] += 1

    print("Pattern frequencies")
    total = len(data) - 2

    for p in patterns:
        print(f"{p}: {counts[p]:2d} ({counts[p]/total:.3f})")

    expected = total / 6

    chi2 = sum((counts[p] - expected) ** 2 / expected for p in patterns)

    print(f"\nChi-square statistic = {chi2:.3f}")
    print()


print("Computer Lists")
for i, lst in enumerate(computer_lists, 1):
    print(f"\nList {i}")
    permutation_test(lst)

print("\nHuman Lists")
for i, lst in enumerate(human_lists, 1):
    print(f"\nList {i}")
    permutation_test(lst)
