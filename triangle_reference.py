from itertools import permutations
from random import sample
from collections import Counter

# Reference single-use solution from candy box.

# from itertools import permutations

# for [a, b, c, x, y, z] in permutations([1, 3, 6, 7, 8, 9]):
    # if (4 + a + x + y) == (2 + b + x + z) == (5 + c + y + z):
        # print(f"A={a} B={b} C={c} X={x} Y={y} Z={z}")

def magic_triangle_solutions(puzzle):
    unused_numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9}.difference(set(puzzle))
    
    results = []
    for permutation in permutations(unused_numbers):
        triangle = Triangle(puzzle)
        triangle.fill_with(list(permutation))
        if triangle.is_solved():
            results.append(triangle.get_nums())
    
    return results

class Triangle: 
    def __init__(self, nums_list):
        self.nums = nums_list.copy()
        self.full = False
    
    def fill_with(self, nums_list):
        if self.is_full() or (not nums_list):
            return
        src_idx = 0
        for dst_idx, num in enumerate(self.nums):
            if num == 0:
                self.nums[dst_idx] = nums_list[src_idx]
                src_idx += 1
                if src_idx >= len(nums_list):
                    break
    
    def is_solved(self):
        side1 = sum(self.nums[0:4])
        side2 = sum(self.nums[3:7])
        side3 = sum(self.nums[6:]) + self.nums[0]
        return self.is_full() and side1 == side2 == side3
    
    def is_full(self):
        if not self.full:
            self.full = (0 not in self.nums)
        return self.full
    
    def get_nums(self):
        return self.nums

def list_equals(list1, list2):
    set1 = set(map(lambda x: "".join(map(str, x)), list1))
    set2 = set(map(lambda x: "".join(map(str, x)), list2))
    return set1 == set2
    

# sizes = []
# for _ in range(1000):
    # temp_list = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    # replace_vals = sample(range(1, 10), 3)
    # replace_idxs = sample(range(9), 3)
    # for i, v in zip(replace_idxs, replace_vals):
        # temp_list[i] = v
    # sizes.append(len(magic_triangle_solutions(temp_list)))
# print(Counter(sizes))


# list_equals([[9, 4, 3, 7, 2, 6, 8, 5, 1], [6, 4, 8, 3, 2, 7, 9, 5, 1], [8, 4, 6, 3, 2, 9, 7, 5, 1]], magic_triangle_solutions([0, 4, 0, 0, 2, 0, 0, 5, 0]))
# print(len(magic_triangle_solutions([0, 0, 0, 0, 0, 0, 0, 0, 0])))
print(magic_triangle_solutions([0, 0, 0, 0, 7, 5, 0, 0, 9]))


# Reference
# from itertools import permutations

# for [a, b, c, x, y, z] in permutations([1, 3, 6, 7, 8, 9]):
    # if (4 + a + x + y) == (2 + b + x + z) == (5 + c + y + z):
        # print(f"A={a} B={b} C={c} X={x} Y={y} Z={z}")