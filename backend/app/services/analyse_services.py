def detect_type(input_str):
    if '@' in input_str:
        return "email"
    elif '.' in input_str:
        return "ip"
    else:
        return "domain"
    
