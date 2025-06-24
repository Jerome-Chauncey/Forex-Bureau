import os
import requests
from typing import List, Dict, Optional  # Added necessary imports

API_KEY = os.getenv("EXCHANGE_RATE_API_KEY")
BASE_URL = "https://data.fixer.io/api/"

def fetch_live_rates(
    base: str = "EUR",
    symbols: Optional[List[str]] = None  # Changed to List[str]
) -> Dict[str, float]:  # Changed to Dict[str, float]
    """
    Fetch live exchange rates from Fixer.io.
    
    Args:
      base:       The base currency (Free plan only supports EUR)
      symbols:    List of quote currencies to return (e.g. ["USD","KES"])
    
    Returns:
      Mapping of currency code → rate relative to `base`.
    """
    # Construct request URL & params
    endpoint = BASE_URL + "latest"
    params = {
        "access_key": API_KEY,
        "base": base,  # note: free plan defaults to EUR regardless of this param
    }
    if symbols:
        params["symbols"] = ",".join(symbols)

    # Make the HTTP request
    resp = requests.get(endpoint, params=params, timeout=5)
    resp.raise_for_status()
    data = resp.json()

    # Ensure the API call succeeded
    if not data.get("success", False):
        error_info = data.get("error", {})
        raise RuntimeError(f"Fixer API error: {error_info}")

    # Return only the rates mapping
    return data["rates"]

# Example usage:
if __name__ == "__main__":
    rates = fetch_live_rates(symbols=["USD", "KES", "GBP"])
    print("Live rates:", rates)