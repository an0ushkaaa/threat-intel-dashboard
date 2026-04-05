def scan_ip(ip):
    risk_score=20
    country="India"
    is_malicious=False
    return {"risk_score": risk_score,
            "country": country,
            "is_malicious": is_malicious
            }

def scan_domain(domain):
    risk_score = 10
    registrar = "GoDaddy"
    is_malicious = False

    return {
        "risk_score": risk_score,
        "registrar": registrar,
        "is_malicious": is_malicious
    }

def scan_email(email):
    breached = False
    risk_score = 30

    return {
        "breached": breached,
        "risk_score": risk_score
    }