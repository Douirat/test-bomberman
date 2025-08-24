from playwright.sync_api import sync_playwright
import os
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for console messages
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        page.goto("http://localhost:8000")

        # Wait for the store to be initialized
        try:
            page.wait_for_function("window.store && window.store.dispatch", timeout=5000) # shorter timeout
        except Exception as e:
            print(f"Failed to find window.store: {e}")
            browser.close()
            return

        # Mock game state
        mock_game_state = {
            "map": [
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2],
                [2, 0, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 0, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 2],
                [2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
            ],
            "players": [
                {"id": "player1", "x": 50, "y": 50, "lives": 3, "isAlive": True, "nickname": "Jules"}
            ],
            "bombs": [],
            "explosions": [],
            "powerUps": []
        }

        # Convert the mock state to a JSON string
        mock_game_state_json = json.dumps(mock_game_state)

        # Dispatch the START_GAME action
        page.evaluate(f"""
            window.store.dispatch({{ type: 'START_GAME', payload: {mock_game_state_json} }});
        """)

        # Give it a moment to render
        page.wait_for_timeout(1000)

        os.makedirs("jules-scratch/verification", exist_ok=True)
        page.screenshot(path="jules-scratch/verification/dot_grid_verification.png")
        browser.close()

run()
