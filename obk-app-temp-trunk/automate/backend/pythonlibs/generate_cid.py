import random

def generate_random_id():
    random_num = random.randint(100000000000, 999999999999)
    temp = random_num
    sum_num = 0
    for i in range(1,13):
        sum_num += (i+1) * (random_num % 10)
        random_num = random_num // 10
    sum_num = sum_num % 11
    checksum = (11 - (sum_num % 11)) % 10
    result = (temp * 10) + checksum
    result = str((temp * 10) + checksum)
    return    result
