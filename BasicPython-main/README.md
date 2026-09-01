# 🐍 BasicPython Suite & Interactive Playground

A modern, professional interactive web application and developer playground for 40+ fundamental Python programming exercises, algorithms, data structures, and logic modules.

---

## ✨ Features

- **🎨 Modern Dark & Light Mode UI**: Glassmorphic styling, glowing gradients, responsive layout, and typography.
- **⚡ 40+ Interactive Modules**:
  - **Conditionals & Control Flow**: ATM Mockup, Traffic Light Controller, Smart Doorbell, Smart Grading, Voting Eligibility, Number Sign Tester, Password Check.
  - **Loops & Sequences**: Space Rocket Countdown, Server Ping Test, Odd/Even ID Batching, Notification Skipper, Security Login Attempt Limiter.
  - **Functions & Math Algorithms**: Tweet Text Analyzer, Automated Grade Calculator, Automated Tax Billing, Automated Welcome Email, Simple Interest, Circle Area, Temperature Converter, Discount Calculator.
  - **Lists & Arrays Operations**: Shopping Cart Initialization, Grocery Mutability, Priority Task Insertion, Stack Pop, Remove Item, In-Place Mutation, Slicing Expert, Up Next Playlist, Length Check.
  - **Tuples & Sets**: Blog Tag Deduplication, Customer Email Cleaner, Immutable Credentials, Single Element Tuple, Tuple Immutability.
  - **Dictionaries & Data Structures**: Contact Directory, Student Privacy Redactor, User Registration, Multi-line Formatter, Basic Variables.
- **📊 Real-time Visualizers**: Specialized visual mockups including 3D Traffic Signals, Holographic ATM Cards, Animated Rocket Launch, Tweet Vowel/Consonant Distribution Meters, and Live Status Cards.
- **💻 Console Terminal Simulator**: Exact CLI-accurate `print()` terminal mirroring Python standard output.
- **📜 Code Inspector & WASM Runner**: View original source code, one-click copy, and in-browser Python execution powered by Pyodide.

---

## 🚀 Getting Started

### Option 1: Quick Web App Launch (Recommended)
Run the built-in server launcher with Python:
```bash
python server.py
```
This starts the local web server at `http://localhost:8000` and automatically opens your default web browser.

Alternatively, you can open `index.html` directly in any modern browser—no dependencies or installations required!

### Option 2: Running Individual Python Scripts via CLI
All original Python scripts in `BasicPython-main/` remain standalone and can be executed with standard Python:
```bash
cd BasicPython-main
python "ATM mockup.py"
python "Tweet text analyzer.py"
python "Trafic light controller.py"
```

---

## 📁 Project Structure

```
BasicPython-main/
├── index.html                 # Main Single-Page Application
├── server.py                  # Local Python server launcher
├── css/
│   └── style.css              # Design system, glassmorphism, visualizer styles
├── js/
│   ├── modules-data.js        # Dataset of 40+ Python modules with exact logic
│   └── app.js                 # Application controller & WASM integration
└── BasicPython-main/          # Standalone original Python script collection
    ├── ATM mockup.py
    ├── Automated grade calculater.py
    ├── Tweet text analyzer.py
    └── ... (40+ scripts)
```
