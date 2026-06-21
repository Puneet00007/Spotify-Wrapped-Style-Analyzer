from playwright.sync_api import sync_playwright
import time
import json
import base64
import urllib.parse

def generate():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # Screenshot 1: Landing Page
        print("Capturing Landing Page...")
        page.goto("http://localhost:3000")
        page.wait_for_timeout(2000)
        page.screenshot(path="public/screenshots/landing.png", full_page=True)

        # Generate Mock Data URL
        mock_data = {
          "p": "Jules",
          "a": "euphoric",
          "m": "Radiant",
          "ml": "Joyful & Electric",
          "mc": "#FFD700",
          "t": ["pop", "dance pop", "electropop"],
          "d": [{"name":"Pop","value":40,"color":"#FF66B2"},{"name":"Electronic/Dance","value":20,"color":"#33FFCC"}],
          "en": "Solar Vex",
          "ed": "A radiant wanderer navigating the spaces between pop, dance pop, electropop. You carry the energy of The Euphoric Escapist in your back pocket.",
          "n": 10,
          "e": 85,
          "g": 4
        }
        encoded = base64.b64encode(urllib.parse.quote(json.dumps(mock_data)).encode()).decode()

        # Screenshot 2: Shared Card Result
        print("Capturing Shared Result Card...")
        page.goto(f"http://localhost:3000/card/{encoded}")
        page.wait_for_timeout(3000)
        page.screenshot(path="public/screenshots/result-card.png", full_page=True)

        # Screenshot 3: Dark Mode Detail
        # Since /results requires session storage to be set on the client, we'll quickly inject it
        print("Capturing Full Results Dashboard...")
        page.goto("http://localhost:3000")
        page.evaluate(f"sessionStorage.setItem('soundself_data', JSON.stringify({json.dumps(mock_data)}))")

        # Now navigate to results which reads from sessionStorage
        page.goto("http://localhost:3000/results")
        page.wait_for_timeout(3000)
        page.screenshot(path="public/screenshots/dashboard.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    generate()
