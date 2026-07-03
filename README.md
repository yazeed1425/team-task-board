# Team Task Board

A simple task board UI for testing the Dev Team Tracker Discord bot.

## Webhook setup

1. Run `python run_api.py` and `ngrok http 127.0.0.1:8000` in the parent project
2. Add webhook on this repo:
   - **URL:** `https://<ngrok-url>/webhooks/github`
   - **Secret:** `dev-tracker-webhook-secret-2026` (must match `.env`)
   - **Events:** `push`, `pull_request`
3. In Discord: `/register_github yazeed1425`

## Test

Edit any file, commit, and push — the bot will capture your changes for the daily summary.
