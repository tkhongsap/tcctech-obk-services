import base64

def jpg_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        base64_bytes = base64.b64encode(image_file.read())
    return base64_bytes

# Example usage
image_path = "example.jpg"  # Replace with your image file
base64_bytes = jpg_to_base64(image_path)
print(base64_bytes)  # Prints the Base64-encoded byte string
