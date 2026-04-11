import requests
import os
from dotenv import load_dotenv

load_dotenv()


def scan_ip(ip):
    try:
        token = os.getenv("IPINFO_TOKEN")
        url = f"https://ipinfo.io/{ip}?token={token}"

        response = requests.get(url)
        data = response.json()

        return {
            "summary": {
                "ip": ip,
                "country": data.get("country"),
                "city": data.get("city"),
                "org": data.get("org")
            },
            "raw": data
        }

    except Exception as e:
        return {
            "error": "Failed to fetch IP details",
            "details": str(e)
        }


def scan_domain(domain):
    try:
        url = f"https://www.virustotal.com/api/v3/domains/{domain}"

        headers = {
            "x-apikey": os.getenv("VIRUSTOTAL_API_KEY")
        }

        response = requests.get(url, headers=headers)
        data = response.json()

    except Exception as e:
        return {
            "error": "Failed to fetch domain details",
            "details": str(e)
        }

    stats = data["data"]["attributes"]["last_analysis_stats"]

    return {
        "malicious": stats.get("malicious"),
        "suspicious": stats.get("suspicious"),
        "harmless": stats.get("harmless"),
        "undetected": stats.get("undetected")
    }


def scan_email(email):
    if "test" in email or "123" in email:
        return {
            "breached": True,
            "breaches": ["ExampleLeak", "DemoBreach"],
            "risk_score": 70
        }
    else:
        return {
            "breached": False,
            "breaches": [],
            "risk_score": 10
        }