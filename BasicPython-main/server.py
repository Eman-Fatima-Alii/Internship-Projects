#!/usr/bin/env python3
"""
BasicPython Interactive Suite - Local Web Server Launcher
Run this script to start the local web server and open the interactive suite in your default browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable caching headers and CORS for local testing
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    # Ensure current working directory is the project directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    url = f"http://localhost:{PORT}"
    print("=" * 60)
    print(" 🐍 BasicPython Interactive Suite")
    print(f" Server running at: {url}")
    print(f" Serving directory: {script_dir}")
    print(" Press Ctrl+C to stop the server.")
    print("=" * 60)

    # Open the browser
    webbrowser.open(url)

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped. Goodbye!")
            sys.exit(0)

if __name__ == "__main__":
    main()
