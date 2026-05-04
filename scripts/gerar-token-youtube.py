#!/usr/bin/env python3
"""
Roda UMA VEZ localmente para gerar o YouTube OAuth refresh token.
O token gerado vai como secret YOUTUBE_REFRESH_TOKEN no GitHub.

Requisitos:
    pip install google-auth-oauthlib

Uso:
    python scripts/gerar-token-youtube.py
"""
from google_auth_oauthlib.flow import InstalledAppFlow

CLIENT_ID = input("YOUTUBE_CLIENT_ID: ").strip()
CLIENT_SECRET = input("YOUTUBE_CLIENT_SECRET: ").strip()

client_config = {
    "installed": {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"],
    }
}

flow = InstalledAppFlow.from_client_config(
    client_config,
    scopes=["https://www.googleapis.com/auth/youtube.upload"],
)
credentials = flow.run_local_server(port=0)

print("\n✅ Token gerado!")
print(f"\nRefresh Token:\n{credentials.refresh_token}")
print("\nAdicione como secret YOUTUBE_REFRESH_TOKEN em:")
print("GitHub → repo → Settings → Secrets and variables → Actions → New repository secret")
