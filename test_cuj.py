from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)

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
    import json
    import base64
    import urllib.parse

    encoded = base64.b64encode(urllib.parse.quote(json.dumps(mock_data)).encode()).decode()

    page.goto(f"http://localhost:3000/card/{encoded}")
    page.wait_for_timeout(3000)

    page.screenshot(path="/home/jules/verification/screenshots/verification2.png")
    page.wait_for_timeout(2000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
