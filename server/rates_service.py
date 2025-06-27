# server/rates_service.py
import requests
from typing import List, Dict, Optional

BASE_URL = "https://open.er-api.com/v6/latest"

def fetch_live_rates(
    base: str = "EUR",
    symbols: Optional[List[str]] = None
) -> Dict[str, float]:
    """
    Fetch live exchange rates from open.er-api.com (no API key needed).
    """
    # e.g. https://open.er-api.com/v6/latest/EUR
    resp = requests.get(f"{BASE_URL}/{base}", timeout=5)
    resp.raise_for_status()
    data = resp.json()

    # The API returns {"result":"success", "rates":{...}}
    if data.get("result") != "success" or "rates" not in data:
        raise RuntimeError(f"Error from exchange API: {data}")

    rates = data["rates"]  # all rates relative to `base`

    # If the caller asked for specific symbols, filter down
    if symbols:
        rates = { cur: rates[cur] for cur in symbols if cur in rates }

    return rates
