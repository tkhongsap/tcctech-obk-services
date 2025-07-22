import uuid
import ulid

def generate_uuid():
    uuid_code = str(uuid.uuid4())
    return uuid_code

def generate_ulid():
    ulid_code = str(ulid.new())
    return ulid_code

def convert_2digit(number):
    number = str(round(number, 2))
    return number

def convert_float_to_comma(number):
    f_number = float(number)
    num = format(f_number, ',.2f');
    return num

def convert_2float(number):
    f_number = float(number)
    num = format(f_number, '.2f');
    return num