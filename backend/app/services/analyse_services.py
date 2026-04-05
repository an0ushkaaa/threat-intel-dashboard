def detect_type(input_str):
    if '@' in input_str:
        return "email"
    
    parts = input_str.split(".")
    if len(parts) == 4 and all(part.isdigit() for part in parts):
        return "ip"
    
    return "domain"
    
