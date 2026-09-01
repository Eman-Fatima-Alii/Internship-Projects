/**
 * BasicPython Suite - Modules Database & Exact Logic Handlers
 * Contains all 42 modules with original code, input configurations, 
 * and exact logic execution mirroring the Python scripts.
 */

const MODULES_DATA = [
  // ==========================================
  // 1. CONDITIONALS & CONTROL FLOW
  // ==========================================
  {
    id: "atm-mockup",
    title: "ATM Mockup",
    filename: "ATM mockup.py",
    category: "conditionals",
    tags: ["Conditionals", "Finance", "Input/Output"],
    icon: "💳",
    description: "Simulates an automated teller machine withdrawal by checking available account balance against requested amount.",
    code: `balance = 10000

withdraw = int(input("Enter withdraw amount: "))

if withdraw <= balance:
    print("Success")
else:
    print("Insufficient Balance")`,
    inputs: [
      { name: "balance", label: "Current Balance ($)", type: "number", default: 10000, min: 0, step: 100, help: "Initial account balance" },
      { name: "withdraw", label: "Withdraw Amount ($)", type: "number", default: 3500, min: 1, step: 100, help: "Amount you wish to withdraw" }
    ],
    visualType: "atm",
    run: (args) => {
      const balance = Number(args.balance ?? 10000);
      const withdraw = Number(args.withdraw ?? 0);
      let isSuccess = withdraw <= balance;
      let remaining = isSuccess ? balance - withdraw : balance;
      let output = isSuccess ? "Success" : "Insufficient Balance";
      return {
        output: output + `\n[Account State: Requested $${withdraw}, Balance $${balance}${isSuccess ? `, Remaining: $${remaining}` : ''}]`,
        visualData: {
          status: isSuccess ? "success" : "failed",
          balance,
          withdraw,
          remaining,
          message: isSuccess ? "Transaction Approved! Please collect cash." : "Transaction Declined: Insufficient Funds."
        }
      };
    }
  },
  {
    id: "traffic-light",
    title: "Traffic Light Controller",
    filename: "Trafic light controller.py",
    category: "conditionals",
    tags: ["Conditionals", "Control Flow", "Strings"],
    icon: "🚦",
    description: "Evaluates the traffic signal color to command drivers whether to Stop, Slow Down, or Go.",
    code: `color = input("Enter traffic light color (Red, Yellow, Green): ")

if color == "Red":
    print("Stop")
elif color == "Yellow":
    print("Slow Down")
elif color == "Green":
    print("Go")
else:
    print("Invalid Color")`,
    inputs: [
      { 
        name: "color", 
        label: "Signal Color", 
        type: "select", 
        options: ["Red", "Yellow", "Green", "Blue", "Purple"], 
        default: "Green",
        help: "Current traffic light phase" 
      }
    ],
    visualType: "traffic-light",
    run: (args) => {
      const color = args.color;
      let action = "Invalid Color";
      if (color === "Red") action = "Stop";
      else if (color === "Yellow") action = "Slow Down";
      else if (color === "Green") action = "Go";
      
      return {
        output: action,
        visualData: {
          activeColor: color.toLowerCase(),
          action: action,
          isValid: ["red", "yellow", "green"].includes(color.toLowerCase())
        }
      };
    }
  },
  {
    id: "smart-doorbell",
    title: "Smart Home Doorbell",
    filename: "Smart home door bell.py",
    category: "conditionals",
    tags: ["Conditionals", "IoT", "Comparison"],
    icon: "🔔",
    description: "Switches the smart doorbell between Silent Mode and Ring Loud based on the 24-hour current time.",
    code: `time = int(input("Enter time (24-hour format): "))

if time > 10:
    print("Silent Mode On")
else:
    print("Ring Loud")`,
    inputs: [
      { name: "time", label: "Time (24-Hour Format: 0-23)", type: "number", default: 14, min: 0, max: 23, step: 1, help: "Hour of day (e.g. 14 for 2:00 PM)" }
    ],
    visualType: "doorbell",
    run: (args) => {
      const time = Number(args.time ?? 0);
      const isSilent = time > 10;
      const output = isSilent ? "Silent Mode On" : "Ring Loud";
      return {
        output: output,
        visualData: {
          time,
          isSilent,
          modeText: output,
          formattedTime: `${time.toString().padStart(2, '0')}:00`
        }
      };
    }
  },
  {
    id: "smart-grading",
    title: "Smart Grading System",
    filename: "smart grading.py",
    category: "conditionals",
    tags: ["Conditionals", "Grading", "Branching"],
    icon: "🎓",
    description: "Evaluates academic marks into grades A, B, or C using multiple threshold conditions.",
    code: `marks = int(input("Enter marks: "))

if marks >= 90:
    print("Grade A")
elif marks >= 80:
    print("Grade B")
else:
    print("Grade C")`,
    inputs: [
      { name: "marks", label: "Student Marks (0 - 100)", type: "number", default: 85, min: 0, max: 100, step: 1, help: "Score obtained by the student" }
    ],
    visualType: "grade",
    run: (args) => {
      const marks = Number(args.marks ?? 0);
      let grade = "Grade C";
      let badgeClass = "badge-c";
      if (marks >= 90) {
        grade = "Grade A";
        badgeClass = "badge-a";
      } else if (marks >= 80) {
        grade = "Grade B";
        badgeClass = "badge-b";
      }
      return {
        output: grade,
        visualData: { marks, grade, badgeClass, percentage: Math.min(100, Math.max(0, marks)) }
      };
    }
  },
  {
    id: "logic-voting",
    title: "Voting Eligibility Checker",
    filename: "Logic aur Conditionals (If-Else).py",
    category: "conditionals",
    tags: ["Conditionals", "If-Else", "Verification"],
    icon: "🗳️",
    description: "Determines citizen voting eligibility based on the legal age requirement (18+).",
    code: `age = int(input("Enter your age: "))

if age >= 18:
    print("Eligible to Vote")
else:
    print("Not Eligible")`,
    inputs: [
      { name: "age", label: "Citizen Age", type: "number", default: 19, min: 1, max: 120, step: 1, help: "Enter age in years" }
    ],
    visualType: "general",
    run: (args) => {
      const age = Number(args.age ?? 0);
      const eligible = age >= 18;
      const output = eligible ? "Eligible to Vote" : "Not Eligible";
      return {
        output: output,
        visualData: {
          title: "Voter Status",
          badge: eligible ? "ELIGIBLE" : "RESTRICTED",
          status: eligible ? "success" : "warning",
          detail: eligible ? `Age ${age} meets requirement (>= 18)` : `Age ${age} is below requirement (18)`
        }
      };
    }
  },
  {
    id: "number-tester",
    title: "Number Sign Tester",
    filename: "number tester.py",
    category: "conditionals",
    tags: ["Conditionals", "Math", "Number Classification"],
    icon: "🔢",
    description: "Analyzes an integer to determine whether it is strictly Positive, Negative, or Zero.",
    code: `number = int(input("Enter a number: "))

if number > 0:
    print("Positive")
elif number < 0:
    print("Negative")
else:
    print("Zero")`,
    inputs: [
      { name: "number", label: "Input Number", type: "number", default: -15, step: 1, help: "Any integer number" }
    ],
    visualType: "general",
    run: (args) => {
      const num = Number(args.number ?? 0);
      let classification = "Zero";
      let status = "neutral";
      if (num > 0) {
        classification = "Positive";
        status = "success";
      } else if (num < 0) {
        classification = "Negative";
        status = "error";
      }
      return {
        output: classification,
        visualData: {
          title: "Sign Evaluation",
          badge: classification.toUpperCase(),
          status,
          detail: `Value ${num} is classified as ${classification}`
        }
      };
    }
  },
  {
    id: "password-check",
    title: "Password Authenticator",
    filename: "Password chck.py",
    category: "conditionals",
    tags: ["Security", "Strings", "Authentication"],
    icon: "🔐",
    description: "Verifies user entered credentials against the stored master password.",
    code: `stored_password = "python123"

password = input("Enter password: ")

if password == stored_password:
    print("Password Matched")
else:
    print("Incorrect Password")`,
    inputs: [
      { name: "password", label: "Enter Password", type: "text", default: "python123", placeholder: "Try python123 or wrong pass", help: "Stored system password is 'python123'" }
    ],
    visualType: "general",
    run: (args) => {
      const stored = "python123";
      const pass = String(args.password ?? "");
      const matched = pass === stored;
      const output = matched ? "Password Matched" : "Incorrect Password";
      return {
        output: output,
        visualData: {
          title: "Access Authentication",
          badge: matched ? "ACCESS GRANTED" : "ACCESS DENIED",
          status: matched ? "success" : "error",
          detail: matched ? "Credentials successfully verified." : "Supplied password does not match system credentials."
        }
      };
    }
  },

  // ==========================================
  // 2. LOOPS & SEQUENCES
  // ==========================================
  {
    id: "rocket-countdown",
    title: "Space Rocket Countdown",
    filename: "Space rocket Coundown.py",
    category: "loops",
    tags: ["While Loop", "Space", "Simulation"],
    icon: "🚀",
    description: "Performs a while-loop countdown sequence from an initial value down to zero for rocket launch.",
    code: `number = int(input("Enter a number: "))

while number >= 0:
    print(number)
    number -= 1`,
    inputs: [
      { name: "number", label: "Starting Countdown", type: "number", default: 5, min: 1, max: 20, step: 1, help: "Number of countdown seconds (1-20)" }
    ],
    visualType: "rocket",
    run: (args) => {
      let n = Math.min(30, Math.max(1, Number(args.number ?? 5)));
      const steps = [];
      const lines = [];
      while (n >= 0) {
        lines.push(n.toString());
        steps.push(n);
        n--;
      }
      return {
        output: lines.join("\n") + "\n🚀 Blastoff!",
        visualData: {
          start: Number(args.number ?? 5),
          steps: steps
        }
      };
    }
  },
  {
    id: "server-ping",
    title: "Server Ping Diagnostic",
    filename: "Server Ping test.py",
    category: "loops",
    tags: ["For Loop", "DevOps", "Networking"],
    icon: "🌐",
    description: "Iterates through server nodes sending automated ping requests to test infrastructure responsiveness.",
    code: `for server in range(1, 6):
    print(f"Pinging Server {server}...")`,
    inputs: [
      { name: "serverCount", label: "Number of Servers", type: "number", default: 5, min: 1, max: 10, step: 1, help: "Total servers in cluster" }
    ],
    visualType: "ping",
    run: (args) => {
      const count = Math.min(10, Math.max(1, Number(args.serverCount ?? 5)));
      const lines = [];
      const servers = [];
      for (let s = 1; s <= count; s++) {
        lines.push(`Pinging Server ${s}...`);
        servers.push({ id: s, name: `Node-0${s}.datacenter.internal`, latency: Math.floor(12 + Math.random() * 25) });
      }
      return {
        output: lines.join("\n"),
        visualData: {
          servers: servers
        }
      };
    }
  },
  {
    id: "odd-even-batching",
    title: "Odd / Even ID Batching",
    filename: "Odd even ID bactching.py",
    category: "loops",
    tags: ["While Loop", "Modulo", "Batch Processing"],
    icon: "🗂️",
    description: "Divides sequential IDs into Batch A (even) and Batch B (odd) using modulo arithmetic in a while loop.",
    code: `id = 1

while id <= 20:
    if id % 2 == 0:
        print(id, "- Process Batch A")
    else:
        print(id, "- Process Batch B")
    id += 1`,
    inputs: [
      { name: "maxId", label: "Process IDs up to", type: "number", default: 10, min: 2, max: 30, step: 1, help: "End range of job IDs" }
    ],
    visualType: "general",
    run: (args) => {
      const maxId = Math.min(30, Math.max(1, Number(args.maxId ?? 10)));
      let id = 1;
      const lines = [];
      const batchA = [];
      const batchB = [];
      while (id <= maxId) {
        if (id % 2 === 0) {
          lines.push(`${id} - Process Batch A`);
          batchA.push(id);
        } else {
          lines.push(`${id} - Process Batch B`);
          batchB.push(id);
        }
        id++;
      }
      return {
        output: lines.join("\n"),
        visualData: {
          title: "Batch Routing Distribution",
          badge: `${maxId} JOBS PROCESSED`,
          status: "info",
          detail: `Batch A (Even): [${batchA.join(", ")}]\nBatch B (Odd): [${batchB.join(", ")}]`
        }
      };
    }
  },
  {
    id: "notification-skipper",
    title: "Notification Skipper",
    filename: "Notifcation skipper.py",
    category: "loops",
    tags: ["For Loop", "Control Flow", "Continue Statement"],
    icon: "⏭️",
    description: "Dispatches alerts across user IDs while demonstrating the 'continue' keyword to skip a specific user ID.",
    code: `for user_id in range(1, 11):

    if user_id == 5:
        continue

    print("Notification sent to User", user_id)`,
    inputs: [
      { name: "totalUsers", label: "Total Users", type: "number", default: 10, min: 3, max: 20, step: 1, help: "Total users to broadcast to" },
      { name: "skipUser", label: "User ID to Skip", type: "number", default: 5, min: 1, max: 20, step: 1, help: "User who opted out" }
    ],
    visualType: "general",
    run: (args) => {
      const total = Number(args.totalUsers ?? 10);
      const skip = Number(args.skipUser ?? 5);
      const lines = [];
      const sent = [];
      for (let i = 1; i <= total; i++) {
        if (i === skip) {
          continue;
        }
        lines.push(`Notification sent to User ${i}`);
        sent.push(i);
      }
      return {
        output: lines.join("\n"),
        visualData: {
          title: "Dispatch Summary",
          badge: `${sent.length} DELIVERED (1 SKIPPED)`,
          status: "success",
          detail: `Skipped User ID: ${skip}\nDelivered User IDs: ${sent.join(", ")}`
        }
      };
    }
  },
  {
    id: "security-login-report",
    title: "Security Login Attempt Limiter",
    filename: "Security login report.py",
    category: "loops",
    tags: ["While Loop", "Security", "Rate Limiting"],
    icon: "🛡️",
    description: "Simulates consecutive failed login attempts before triggering an automated system lockout.",
    code: `attempt = 1

while attempt <= 3:
    print("Login Attempt", attempt)
    attempt += 1

print("System Locked")`,
    inputs: [
      { name: "maxAttempts", label: "Max Allowed Attempts", type: "number", default: 3, min: 1, max: 8, step: 1, help: "Lockout threshold" }
    ],
    visualType: "general",
    run: (args) => {
      const maxAttempts = Number(args.maxAttempts ?? 3);
      let attempt = 1;
      const lines = [];
      while (attempt <= maxAttempts) {
        lines.push(`Login Attempt ${attempt}`);
        attempt++;
      }
      lines.push("System Locked");
      return {
        output: lines.join("\n"),
        visualData: {
          title: "Lockout Protocol Triggered",
          badge: "SYSTEM LOCKED",
          status: "error",
          detail: `Exceeded ${maxAttempts} consecutive failed attempts. System security protocol engaged.`
        }
      };
    }
  },

  // ==========================================
  // 3. FUNCTIONS & MATH ALGORITHMS
  // ==========================================
  {
    id: "tweet-analyzer",
    title: "Tweet Text Analyzer",
    filename: "Tweet text analyzer.py",
    category: "functions-math",
    tags: ["Functions", "Strings", "NLP"],
    icon: "📊",
    description: "Analyzes social media posts or strings to count total vowels and consonants.",
    code: `def analyze_text(text):
    vowels = 0
    consonants = 0

    for char in text:
        if char.isalpha():
            if char.lower() in "aeiou":
                vowels += 1
            else:
                consonants += 1

    return vowels, consonants


tweet = input("Enter text: ")

vowels, consonants = analyze_text(tweet)

print("Vowels:", vowels)
print("Consonants:", consonants)`,
    inputs: [
      { name: "text", label: "Input Text / Tweet", type: "text", default: "Hello World! Learning Python is super awesome.", placeholder: "Type any sentence...", help: "Text to analyze" }
    ],
    visualType: "tweet",
    run: (args) => {
      const text = String(args.text ?? "");
      let vowels = 0;
      let consonants = 0;
      let letters = 0;
      let other = 0;
      for (const char of text) {
        if (/[a-zA-Z]/.test(char)) {
          letters++;
          if (/[aeiouAEIOU]/.test(char)) {
            vowels++;
          } else {
            consonants++;
          }
        } else {
          other++;
        }
      }
      return {
        output: `Vowels: ${vowels}\nConsonants: ${consonants}`,
        visualData: {
          totalChars: text.length,
          letters,
          vowels,
          consonants,
          other,
          text
        }
      };
    }
  },
  {
    id: "automated-grade-calculator",
    title: "Automated Grade Calculator",
    filename: "Automated grade calculater.py",
    category: "functions-math",
    tags: ["Functions", "Grading", "Return Values"],
    icon: "📝",
    description: "Encapsulates grading rules inside a reusable Python function `calculate_grade(marks)`.",
    code: `def calculate_grade(marks):
    if marks > 90:
        return "A"
    elif marks > 80:
        return "B"
    else:
        return "C"

marks = int(input("Enter marks: "))

grade = calculate_grade(marks)

print("Grade:", grade)`,
    inputs: [
      { name: "marks", label: "Student Score", type: "number", default: 94, min: 0, max: 100, step: 1, help: "Score for function calculation" }
    ],
    visualType: "grade",
    run: (args) => {
      const marks = Number(args.marks ?? 0);
      let grade = "C";
      let badgeClass = "badge-c";
      if (marks > 90) {
        grade = "A";
        badgeClass = "badge-a";
      } else if (marks > 80) {
        grade = "B";
        badgeClass = "badge-b";
      }
      return {
        output: `Grade: ${grade}`,
        visualData: { marks, grade: `Grade ${grade}`, badgeClass, percentage: marks }
      };
    }
  },
  {
    id: "automated-tax-billing",
    title: "Automated Tax Billing",
    filename: "Automated tax billing.py",
    category: "functions-math",
    tags: ["Functions", "Default Arguments", "Finances"],
    icon: "🧾",
    description: "Calculates invoice totals using Python default argument values (`tax=5`) versus custom override rates.",
    code: `def calculate_bill(price, tax=5):
    total = price + tax
    return total

# Function call with default tax
print("Bill with default tax:", calculate_bill(100))

# Function call with custom tax
print("Bill with custom tax:", calculate_bill(100, 10))`,
    inputs: [
      { name: "price", label: "Base Price ($)", type: "number", default: 100, min: 0, step: 5, help: "Product/Service base price" },
      { name: "customTax", label: "Custom Tax Amount ($)", type: "number", default: 10, min: 0, step: 1, help: "Custom tax for second call" }
    ],
    visualType: "general",
    run: (args) => {
      const price = Number(args.price ?? 100);
      const customTax = Number(args.customTax ?? 10);
      const defaultTax = 5;
      const billDefault = price + defaultTax;
      const billCustom = price + customTax;
      const output = `Bill with default tax: ${billDefault}\nBill with custom tax: ${billCustom}`;
      return {
        output: output,
        visualData: {
          title: "Billing Invoice Calculation",
          badge: `$${billCustom} (CUSTOM) / $${billDefault} (DEFAULT)`,
          status: "info",
          detail: `Base Price: $${price}\n• Default Tax (+$${defaultTax}): $${billDefault}\n• Custom Tax (+$${customTax}): $${billCustom}`
        }
      };
    }
  },
  {
    id: "automated-welcome-email",
    title: "Automated Welcome Email",
    filename: "Automated wellcome email.py",
    category: "functions-math",
    tags: ["Functions", "F-Strings", "Automation"],
    icon: "✉️",
    description: "Generates onboarding confirmation emails utilizing formatted strings within a dedicated function.",
    code: `def send_welcome(name):
    print(f"Welcome {name}! Your account has been created successfully.")

send_welcome("Ali")`,
    inputs: [
      { name: "name", label: "Account Holder Name", type: "text", default: "Ali", placeholder: "e.g. Sarah Connor", help: "Recipient name" }
    ],
    visualType: "general",
    run: (args) => {
      const name = String(args.name || "Ali");
      const message = `Welcome ${name}! Your account has been created successfully.`;
      return {
        output: message,
        visualData: {
          title: "Welcome Email Dispatch",
          badge: "SENT",
          status: "success",
          detail: `To: ${name.toLowerCase().replace(/\s+/g, '')}@domain.com\nMessage: "${message}"`
        }
      };
    }
  },
  {
    id: "simple-interest",
    title: "Simple Interest Calculator",
    filename: "simple interest.py",
    category: "functions-math",
    tags: ["Math", "Finance", "Formulas"],
    icon: "💰",
    description: "Computes financial interest using the formula: Simple Interest = (Principal * Rate * Time) / 100.",
    code: `principal = 10000
rate = 5
time = 2

simple_interest = (principal * rate * time) / 100

print("Simple Interest =", simple_interest)`,
    inputs: [
      { name: "principal", label: "Principal Amount ($)", type: "number", default: 10000, min: 100, step: 500, help: "Initial deposit" },
      { name: "rate", label: "Annual Interest Rate (%)", type: "number", default: 5, min: 0.1, step: 0.5, help: "Annual percentage" },
      { name: "time", label: "Time Duration (Years)", type: "number", default: 2, min: 1, max: 30, step: 1, help: "Investment period" }
    ],
    visualType: "general",
    run: (args) => {
      const p = Number(args.principal ?? 10000);
      const r = Number(args.rate ?? 5);
      const t = Number(args.time ?? 2);
      const si = (p * r * t) / 100;
      const total = p + si;
      return {
        output: `Simple Interest = ${si}`,
        visualData: {
          title: "Interest Computation Breakdown",
          badge: `INTEREST: $${si.toFixed(2)}`,
          status: "success",
          detail: `Principal: $${p.toLocaleString()}\nRate: ${r}% / yr\nDuration: ${t} yr(s)\nTotal Maturity Value: $${total.toLocaleString()}`
        }
      };
    }
  },
  {
    id: "circle-area",
    title: "Circle Area Calculator",
    filename: "Circle area.py",
    category: "functions-math",
    tags: ["Math", "Geometry", "Formulas"],
    icon: "⭕",
    description: "Derives circle radius from diameter and calculates total surface area using π * r².",
    code: `diameter = float(input("Enter diameter: "))

radius = diameter / 2
area = 3.14 * (radius ** 2)

print("Area of circle:", area)`,
    inputs: [
      { name: "diameter", label: "Diameter (units)", type: "number", default: 10, min: 0.1, step: 0.5, help: "Circle full diameter" }
    ],
    visualType: "general",
    run: (args) => {
      const d = Number(args.diameter ?? 10);
      const radius = d / 2;
      const area = 3.14 * Math.pow(radius, 2);
      return {
        output: `Area of circle: ${area}`,
        visualData: {
          title: "Geometric Area Results",
          badge: `AREA: ${area.toFixed(2)} sq units`,
          status: "info",
          detail: `Diameter: ${d}\nRadius: ${radius}\nFormula: 3.14 × (${radius})² = ${area}`
        }
      };
    }
  },
  {
    id: "temperature-converter",
    title: "Temperature Converter (C to F)",
    filename: "Temperature converter.py",
    category: "functions-math",
    tags: ["Math", "Science", "Unit Conversion"],
    icon: "🌡️",
    description: "Converts temperature from Celsius scale to Fahrenheit using formula (C * 9/5) + 32.",
    code: `celsius = 30

fahrenheit = (celsius * 9/5) + 32

print("Temperature in Fahrenheit:", fahrenheit)`,
    inputs: [
      { name: "celsius", label: "Temperature in Celsius (°C)", type: "number", default: 30, step: 1, help: "Celsius temperature" }
    ],
    visualType: "general",
    run: (args) => {
      const c = Number(args.celsius ?? 30);
      const f = (c * 9 / 5) + 32;
      return {
        output: `Temperature in Fahrenheit: ${f}`,
        visualData: {
          title: "Thermal Scale Conversion",
          badge: `${f.toFixed(1)} °F`,
          status: "info",
          detail: `${c} °C corresponds to ${f} °F`
        }
      };
    }
  },
  {
    id: "discount-calculator",
    title: "Discount Calculator",
    filename: "Discount Caculater.py",
    category: "functions-math",
    tags: ["Math", "E-Commerce", "Discounts"],
    icon: "🏷️",
    description: "Applies a standard 10% promotional discount to any product price to compute final payable total.",
    code: `price = int(input("Enter product price: "))

discount = price * 10 / 100
final_price = price - discount

print("Final Price:", final_price)`,
    inputs: [
      { name: "price", label: "Original Product Price ($)", type: "number", default: 250, min: 1, step: 10, help: "Item retail price" }
    ],
    visualType: "general",
    run: (args) => {
      const price = Number(args.price ?? 250);
      const discount = (price * 10) / 100;
      const finalPrice = price - discount;
      return {
        output: `Final Price: ${finalPrice}`,
        visualData: {
          title: "Promotional Pricing Breakdown",
          badge: `$${finalPrice.toFixed(2)} (SAVE 10%)`,
          status: "success",
          detail: `Original Price: $${price}\n10% Discount: -$${discount}\nFinal Payable: $${finalPrice}`
        }
      };
    }
  },

  // ==========================================
  // 4. LISTS & ARRAYS OPERATIONS
  // ==========================================
  {
    id: "leaderboard-analytics",
    title: "Leaderboard Score Analytics",
    filename: "Leader board analytics.py",
    category: "lists",
    tags: ["Lists", "Min/Max", "Data Analysis"],
    icon: "🏆",
    description: "Computes statistical extremes (Highest Score and Lowest Score) from game leaderboard scores.",
    code: `scores = [85, 92, 76, 99, 88]

print("Highest Score:", max(scores))
print("Lowest Score:", min(scores))`,
    inputs: [
      { name: "scores", label: "Scores List (comma separated)", type: "text", default: "85, 92, 76, 99, 88", help: "List of player scores" }
    ],
    visualType: "leaderboard",
    run: (args) => {
      const list = String(args.scores || "85, 92, 76, 99, 88").split(",").map(s => Number(s.trim())).filter(n => !isNaN(n));
      const highest = list.length ? Math.max(...list) : 0;
      const lowest = list.length ? Math.min(...list) : 0;
      return {
        output: `Highest Score: ${highest}\nLowest Score: ${lowest}`,
        visualData: {
          items: list,
          highest,
          lowest
        }
      };
    }
  },
  {
    id: "leaderboard-analysis",
    title: "Student Marks Leaderboard",
    filename: "Leaderboard analysis.py",
    category: "lists",
    tags: ["Lists", "Min/Max", "Academics"],
    icon: "📈",
    description: "Finds the top performing and lowest marks across an exam cohort using Python's max() and min() functions.",
    code: `marks = [78, 92, 65, 88, 99]

print("Highest Marks:", max(marks))
print("Lowest Marks:", min(marks))`,
    inputs: [
      { name: "marks", label: "Cohort Marks (comma separated)", type: "text", default: "78, 92, 65, 88, 99", help: "Student exam scores" }
    ],
    visualType: "leaderboard",
    run: (args) => {
      const list = String(args.marks || "78, 92, 65, 88, 99").split(",").map(s => Number(s.trim())).filter(n => !isNaN(n));
      const highest = list.length ? Math.max(...list) : 0;
      const lowest = list.length ? Math.min(...list) : 0;
      return {
        output: `Highest Marks: ${highest}\nLowest Marks: ${lowest}`,
        visualData: {
          items: list,
          highest,
          lowest
        }
      };
    }
  },
  {
    id: "shopping-cart-init",
    title: "Shopping Cart Initialization",
    filename: "Shopping card initialization.py",
    category: "lists",
    tags: ["Lists", "Append", "Data Structures"],
    icon: "🛒",
    description: "Initializes an empty list and dynamically populates it with items using the `.append()` method.",
    code: `cart = []

cart.append("Milk")
cart.append("Eggs")
cart.append("Bread")

print(cart)`,
    inputs: [
      { name: "item1", label: "Item 1", type: "text", default: "Milk" },
      { name: "item2", label: "Item 2", type: "text", default: "Eggs" },
      { name: "item3", label: "Item 3", type: "text", default: "Bread" }
    ],
    visualType: "cart",
    run: (args) => {
      const cart = [];
      if (args.item1) cart.push(args.item1);
      if (args.item2) cart.push(args.item2);
      if (args.item3) cart.push(args.item3);
      return {
        output: `['${cart.join("', '")}']`,
        visualData: {
          cart: cart
        }
      };
    }
  },
  {
    id: "lists-mutability",
    title: "Grocery Mutability & Append",
    filename: "Lists aur Mutability (Intermediate).py",
    category: "lists",
    tags: ["Lists", "Mutability", "Append"],
    icon: "🥑",
    description: "Demonstrates Python list mutability by appending user-specified 4th item to a grocery list.",
    code: `grocery = ["Milk", "Bread", "Eggs"]

item = input("Enter 4th item: ")

grocery.append(item)

print(grocery)`,
    inputs: [
      { name: "item", label: "Enter 4th Item", type: "text", default: "Butter", placeholder: "e.g. Cheese" }
    ],
    visualType: "cart",
    run: (args) => {
      const grocery = ["Milk", "Bread", "Eggs"];
      const item = args.item || "Butter";
      grocery.push(item);
      return {
        output: `['${grocery.join("', '")}']`,
        visualData: {
          cart: grocery
        }
      };
    }
  },
  {
    id: "priority-task",
    title: "Priority Task Insertion",
    filename: "Priority task.py",
    category: "lists",
    tags: ["Lists", "Insert", "Queue"],
    icon: "⚡",
    description: "Demonstrates inserting high-priority items at index 0 using `.insert(0, item)`.",
    code: `tasks = ["Homework", "Assignment", "Shopping"]

tasks.insert(0, "Urgent Task")

print(tasks)`,
    inputs: [
      { name: "urgentTask", label: "Urgent Task Name", type: "text", default: "Urgent Task" }
    ],
    visualType: "general",
    run: (args) => {
      const tasks = ["Homework", "Assignment", "Shopping"];
      const urgent = args.urgentTask || "Urgent Task";
      tasks.unshift(urgent);
      return {
        output: `['${tasks.join("', '")}']`,
        visualData: {
          title: "Priority Queue State",
          badge: `${tasks.length} ACTIVE TASKS`,
          status: "warning",
          detail: tasks.map((t, idx) => `${idx === 0 ? '🚨 [PRIORITY 1]' : `  • [Slot ${idx+1}]`} ${t}`).join("\n")
        }
      };
    }
  },
  {
    id: "pop-task",
    title: "Stack Pop Operation",
    filename: "pop task.py",
    category: "lists",
    tags: ["Lists", "Pop", "Stack"],
    icon: "📤",
    description: "Removes and returns the last element from a list using `.pop()`.",
    code: `items = ["Pen", "Book", "Bag", "Bottle"]

removed_item = items.pop()

print("Removed Item:", removed_item)
print(items)`,
    inputs: [
      { name: "items", label: "Initial Items (comma separated)", type: "text", default: "Pen, Book, Bag, Bottle" }
    ],
    visualType: "general",
    run: (args) => {
      const list = String(args.items || "Pen, Book, Bag, Bottle").split(",").map(s => s.trim()).filter(Boolean);
      const removed = list.pop();
      return {
        output: `Removed Item: ${removed}\n['${list.join("', '")}']`,
        visualData: {
          title: "LIFO Pop Result",
          badge: `POPPED: "${removed}"`,
          status: "info",
          detail: `Removed: ${removed}\nRemaining Items in Stack: [${list.map(i => `"${i}"`).join(", ")}]`
        }
      };
    }
  },
  {
    id: "remove-item",
    title: "Remove Specific Item",
    filename: "Remove item.py",
    category: "lists",
    tags: ["Lists", "Remove", "Filtering"],
    icon: "🗑️",
    description: "Removes the first occurrence of a specific value from a list using `.remove()`.",
    code: `products = ["Laptop", "Mouse", "Keyboard", "Monitor"]

products.remove("Mouse")

print(products)`,
    inputs: [
      { 
        name: "target", 
        label: "Item to Remove", 
        type: "select", 
        options: ["Mouse", "Laptop", "Keyboard", "Monitor"], 
        default: "Mouse" 
      }
    ],
    visualType: "general",
    run: (args) => {
      let products = ["Laptop", "Mouse", "Keyboard", "Monitor"];
      const target = args.target || "Mouse";
      const idx = products.indexOf(target);
      if (idx !== -1) {
        products.splice(idx, 1);
      }
      return {
        output: `['${products.join("', '")}']`,
        visualData: {
          title: "Inventory State",
          badge: `REMOVED "${target}"`,
          status: "info",
          detail: `Remaining Products: ${products.join(", ")}`
        }
      };
    }
  },
  {
    id: "data-correction",
    title: "In-Place List Mutation",
    filename: "Data Correction.py",
    category: "lists",
    tags: ["Lists", "Indexing", "Mutation"],
    icon: "✏️",
    description: "Updates an item at a specific index (`numbers[2] = 35`) directly in memory.",
    code: `numbers = [10, 20, 30, 40, 50]

numbers[2] = 35

print(numbers)`,
    inputs: [
      { name: "newValue", label: "New Value for Index 2", type: "number", default: 35, step: 1 }
    ],
    visualType: "general",
    run: (args) => {
      const numbers = [10, 20, 30, 40, 50];
      const val = Number(args.newValue ?? 35);
      numbers[2] = val;
      return {
        output: `[${numbers.join(", ")}]`,
        visualData: {
          title: "Index Replacement (Index 2)",
          badge: `UPDATED [2] = ${val}`,
          status: "success",
          detail: `Before: [10, 20, 30, 40, 50]\nAfter:  [${numbers.join(", ")}]`
        }
      };
    }
  },
  {
    id: "length-check",
    title: "List Length Check",
    filename: "Length check.py",
    category: "lists",
    tags: ["Lists", "Builtins", "Length"],
    icon: "📏",
    description: "Measures total elements in a collection using Python's built-in `len()` function.",
    code: `numbers = [10, 20, 30, 40, 50]

print("Total items:", len(numbers))`,
    inputs: [
      { name: "items", label: "Array Items (comma separated)", type: "text", default: "10, 20, 30, 40, 50" }
    ],
    visualType: "general",
    run: (args) => {
      const arr = String(args.items || "").split(",").map(s => s.trim()).filter(Boolean);
      return {
        output: `Total items: ${arr.length}`,
        visualData: {
          title: "Collection Inspection",
          badge: `${arr.length} ITEMS`,
          status: "info",
          detail: `Calculated length for array: [${arr.join(", ")}]`
        }
      };
    }
  },
  {
    id: "upnext-playlist",
    title: "Up Next Playlist Slicing",
    filename: "Upnext playlist.py",
    category: "lists",
    tags: ["Lists", "Slicing", "Media"],
    icon: "🎵",
    description: "Extracts a subset playlist queue using list slicing syntax `songs[1:4]`.",
    code: `songs = ["Song1", "Song2", "Song3", "Song4", "Song5"]

up_next = songs[1:4]

print("Up Next:", up_next)`,
    inputs: [
      { name: "start", label: "Start Index", type: "number", default: 1, min: 0, max: 4, step: 1 },
      { name: "end", label: "End Index", type: "number", default: 4, min: 1, max: 5, step: 1 }
    ],
    visualType: "general",
    run: (args) => {
      const songs = ["Song1", "Song2", "Song3", "Song4", "Song5"];
      const start = Number(args.start ?? 1);
      const end = Number(args.end ?? 4);
      const upNext = songs.slice(start, end);
      return {
        output: `Up Next: ['${upNext.join("', '")}']`,
        visualData: {
          title: "Playlist Slice Window",
          badge: `${upNext.length} TRACKS QUEUED`,
          status: "info",
          detail: `Original: [${songs.join(", ")}]\nSlice [${start}:${end}]: [${upNext.join(", ")}]`
        }
      };
    }
  },
  {
    id: "slicing-expert",
    title: "Slicing Expert Playground",
    filename: "Slicing expert.py",
    category: "lists",
    tags: ["Lists", "Slicing", "Advanced"],
    icon: "🔪",
    description: "Interactive exploration of Python slice indexing [start:stop:step] on lists and sequences.",
    code: `letters = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf']

# Slicing syntax: list[start:stop:step]
sliced_data = letters[1:6:2]

print("Original:", letters)
print("Sliced:", sliced_data)`,
    inputs: [
      { name: "start", label: "Start Index", type: "number", default: 1, min: 0, max: 6, step: 1 },
      { name: "stop", label: "Stop Index", type: "number", default: 6, min: 1, max: 7, step: 1 },
      { name: "step", label: "Step Increment", type: "number", default: 2, min: 1, max: 3, step: 1 }
    ],
    visualType: "general",
    run: (args) => {
      const letters = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf'];
      const start = Number(args.start ?? 1);
      const stop = Number(args.stop ?? 6);
      const step = Number(args.step ?? 2);
      const res = [];
      for (let i = start; i < Math.min(stop, letters.length); i += step) {
        res.push(letters[i]);
      }
      return {
        output: `Original: ['${letters.join("', '")}']\nSliced: ['${res.join("', '")}']`,
        visualData: {
          title: `Slice [${start}:${stop}:${step}]`,
          badge: `${res.length} MATCHING ELEMENTS`,
          status: "info",
          detail: `Extracted: [${res.map(s => `"${s}"`).join(", ")}]`
        }
      };
    }
  },

  // ==========================================
  // 5. TUPLES & SETS
  // ==========================================
  {
    id: "blog-tags-filter",
    title: "Blog Tags Deduplication",
    filename: "Blog tags filters.py",
    category: "tuples-sets",
    tags: ["Sets", "Deduplication", "Data Cleaning"],
    icon: "🏷️",
    description: "Filters duplicate blog article tags by converting a list into a Python `set`.",
    code: `tags = ["tech", "python", "tech"]

unique_tags = set(tags)

print(unique_tags)`,
    inputs: [
      { name: "tags", label: "Tags (comma separated with duplicates)", type: "text", default: "tech, python, tech, web, python, ai" }
    ],
    visualType: "tags",
    run: (args) => {
      const raw = String(args.tags || "tech, python, tech").split(",").map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
      const unique = Array.from(new Set(raw));
      return {
        output: `{${unique.map(t => `'${t}'`).join(", ")}}`,
        visualData: {
          originalCount: raw.length,
          uniqueCount: unique.length,
          tags: unique
        }
      };
    }
  },
  {
    id: "customer-data-cleaner",
    title: "Customer Email Cleaner",
    filename: "Customer data cleaner.py",
    category: "tuples-sets",
    tags: ["Sets", "Data Cleaning", "Deduplication"],
    icon: "🧹",
    description: "Deduplicates subscriber email lists using sets and dynamically adds newly registered addresses.",
    code: `emails = ["ali@gmail.com", "ahmad@gmail.com", "ali@gmail.com"]

# Convert list to set (remove duplicates)
emails = set(emails)

# Add a new email
emails.add("usman@gmail.com")

print(emails)`,
    inputs: [
      { name: "newEmail", label: "New Email to Add", type: "text", default: "usman@gmail.com" }
    ],
    visualType: "tags",
    run: (args) => {
      const emailsSet = new Set(["ali@gmail.com", "ahmad@gmail.com", "ali@gmail.com"]);
      if (args.newEmail) emailsSet.add(args.newEmail);
      const list = Array.from(emailsSet);
      return {
        output: `{${list.map(e => `'${e}'`).join(", ")}}`,
        visualData: {
          originalCount: 4,
          uniqueCount: list.length,
          tags: list
        }
      };
    }
  },
  {
    id: "immutable-credentials",
    title: "Immutable Credentials Tuple",
    filename: "Immutable Credentials.py",
    category: "tuples-sets",
    tags: ["Tuples", "Immutability", "Configuration"],
    icon: "🔒",
    description: "Stores database host & port inside an immutable tuple to prevent accidental configuration mutation.",
    code: `credentials = ("localhost", 3306)

print(credentials)

# Tuples are immutable.
# Uncomment the line below to see the error.

# credentials[0] = "127.0.0.1"`,
    inputs: [
      { name: "host", label: "Host Address", type: "text", default: "localhost" },
      { name: "port", label: "Port Number", type: "number", default: 3306, step: 1 }
    ],
    visualType: "general",
    run: (args) => {
      const host = args.host || "localhost";
      const port = Number(args.port ?? 3306);
      return {
        output: `('${host}', ${port})`,
        visualData: {
          title: "Immutable Tuple Record",
          badge: "READ-ONLY TUPLE",
          status: "info",
          detail: `Type: <class 'tuple'>\nContent: ('${host}', ${port})\nNote: Cannot be modified at runtime.`
        }
      };
    }
  },
  {
    id: "single-element-tuple",
    title: "Single Element Tuple Syntax",
    filename: "Single element tuple.py",
    category: "tuples-sets",
    tags: ["Tuples", "Syntax", "Type System"],
    icon: "🎯",
    description: "Illustrates Python's trailing comma requirement `('Python',)` for single-element tuples.",
    code: `language = ("Python",)

print(language)
print(type(language))`,
    inputs: [
      { name: "item", label: "Tuple Element Value", type: "text", default: "Python" }
    ],
    visualType: "general",
    run: (args) => {
      const item = args.item || "Python";
      return {
        output: `('${item}',)\n<class 'tuple'>`,
        visualData: {
          title: "Tuple Trailing Comma Verification",
          badge: "<class 'tuple'>",
          status: "success",
          detail: `Expression: ("${item}",)\nEvaluated Type: tuple (singleton sequence)`
        }
      };
    }
  },
  {
    id: "tuples-mixed-logic",
    title: "Tuple Immutability Demo",
    filename: "Tuples or mixed logic.py",
    category: "tuples-sets",
    tags: ["Tuples", "Exceptions", "Immutability"],
    icon: "🛡️",
    description: "Demonstrates that assigning values to tuple elements throws TypeError: 'tuple' object does not support item assignment.",
    code: `identity = ("35202-1234567-8", "01-01-2005")

print(identity)

# Tuples are immutable.
# This line will cause an error.

# identity[0] = "35202-1111111-1"
# TypeError: 'tuple' object does not support item assignment`,
    inputs: [
      { name: "idNumber", label: "National ID Number", type: "text", default: "35202-1234567-8" },
      { name: "dob", label: "Date of Birth", type: "text", default: "01-01-2005" }
    ],
    visualType: "general",
    run: (args) => {
      const id = args.idNumber || "35202-1234567-8";
      const dob = args.dob || "01-01-2005";
      return {
        output: `('${id}', '${dob}')`,
        visualData: {
          title: "Identity Tuple Record",
          badge: "IMMUTABLE STRUCTURE",
          status: "info",
          detail: `CNIC/ID: ${id}\nDOB: ${dob}\nAttempting identity[0] = '...' raises TypeError.`
        }
      };
    }
  },

  // ==========================================
  // 6. DICTIONARIES & DATA STRUCTURES
  // ==========================================
  {
    id: "contact-dictionary",
    title: "Contact Directory Manager",
    filename: "Contact dictionary.py",
    category: "dictionaries",
    tags: ["Dictionaries", "Hash Maps", "Key-Value"],
    icon: "📖",
    description: "Manages phonebook entries by updating key-value pairs in a Python dictionary.",
    code: `contact = {
    "Ali": "03001234567"
}

contact["Ali"] = "03111234567"

print(contact)`,
    inputs: [
      { name: "name", label: "Contact Name", type: "text", default: "Ali" },
      { name: "oldPhone", label: "Initial Phone", type: "text", default: "03001234567" },
      { name: "newPhone", label: "Updated Phone", type: "text", default: "03111234567" }
    ],
    visualType: "dictionary",
    run: (args) => {
      const name = args.name || "Ali";
      const newPhone = args.newPhone || "03111234567";
      const dict = { [name]: newPhone };
      return {
        output: `{'${name}': '${newPhone}'}`,
        visualData: {
          data: dict
        }
      };
    }
  },
  {
    id: "student-result-privacy",
    title: "Student Result Privacy Redactor",
    filename: "Student Result privacy.py",
    category: "dictionaries",
    tags: ["Dictionaries", "Privacy", "Pop Method"],
    icon: "🔏",
    description: "Removes sensitive performance metrics ('marks') from student records using `student.pop('marks')`.",
    code: `student = {
    "name": "Ali",
    "roll_no": 101,
    "marks": 90
}

# Remove marks
student.pop("marks")

print(student)`,
    inputs: [
      { name: "name", label: "Student Name", type: "text", default: "Ali" },
      { name: "rollNo", label: "Roll Number", type: "number", default: 101, step: 1 },
      { name: "marks", label: "Private Marks (to be removed)", type: "number", default: 90, step: 1 }
    ],
    visualType: "dictionary",
    run: (args) => {
      const student = {
        name: args.name || "Ali",
        roll_no: Number(args.rollNo ?? 101)
      };
      return {
        output: `{'name': '${student.name}', 'roll_no': ${student.roll_no}}`,
        visualData: {
          data: student,
          redactedKey: "marks",
          redactedValue: Number(args.marks ?? 90)
        }
      };
    }
  },
  {
    id: "user-registration",
    title: "User Registration System",
    filename: "User registration system.py",
    category: "dictionaries",
    tags: ["Input/Output", "F-Strings", "Registration"],
    icon: "👤",
    description: "Captures user demographic fields (name, age, city) and generates a formatted welcome banner.",
    code: `name = input("Enter your name: ")
age = input("Enter your age: ")
city = input("Enter your city: ")

print(f"Welcome {name} from {city}.")`,
    inputs: [
      { name: "name", label: "Full Name", type: "text", default: "Zainab" },
      { name: "age", label: "Age", type: "number", default: 22, min: 1, max: 120, step: 1 },
      { name: "city", label: "City", type: "text", default: "Lahore" }
    ],
    visualType: "general",
    run: (args) => {
      const name = args.name || "Zainab";
      const age = args.age || 22;
      const city = args.city || "Lahore";
      return {
        output: `Welcome ${name} from ${city}.`,
        visualData: {
          title: "User Profile Created",
          badge: "PROFILE ACTIVE",
          status: "success",
          detail: `Name: ${name}\nAge: ${age}\nLocation: ${city}\nStatus: Active Account`
        }
      };
    }
  },
  {
    id: "basic-variables",
    title: "Basic Variables Profile Formatter",
    filename: "Basic variables.py",
    category: "dictionaries",
    tags: ["Variables", "Strings", "Basics"],
    icon: "🔤",
    description: "Declares string and integer variables to format and print a structured personal bio.",
    code: `nam = input("Enter your name ")
ag = int(input("Enter your age "))
cty = input("Enter your City ")
print(f"My name is {nam},My age is {ag},My city is {cty}")`,
    inputs: [
      { name: "nam", label: "Name", type: "text", default: "Ahmad" },
      { name: "ag", label: "Age", type: "number", default: 24, step: 1 },
      { name: "cty", label: "City", type: "text", default: "Islamabad" }
    ],
    visualType: "general",
    run: (args) => {
      const nam = args.nam || "Ahmad";
      const ag = args.ag || 24;
      const cty = args.cty || "Islamabad";
      return {
        output: `My name is ${nam},My age is ${ag},My city is ${cty}`,
        visualData: {
          title: "Formatted Bio Output",
          badge: "STRING FORMATTED",
          status: "info",
          detail: `Name: ${nam} | Age: ${ag} | City: ${cty}`
        }
      };
    }
  },
  {
    id: "multiline-print",
    title: "Multi-line Address Formatter",
    filename: "multi line print.py",
    category: "dictionaries",
    tags: ["Strings", "Escape Sequences", "Formatting"],
    icon: "🏠",
    description: "Renders multi-line structured postal addresses using newline `\\n` escape sequences.",
    code: `print("House #123\\nStreet #5\\nModel Town\\nLahore\\nPakistan")`,
    inputs: [
      { name: "house", label: "House #", type: "text", default: "House #123" },
      { name: "street", label: "Street #", type: "text", default: "Street #5" },
      { name: "area", label: "Area / Colony", type: "text", default: "Model Town" },
      { name: "city", label: "City", type: "text", default: "Lahore" },
      { name: "country", label: "Country", type: "text", default: "Pakistan" }
    ],
    visualType: "general",
    run: (args) => {
      const h = args.house || "House #123";
      const s = args.street || "Street #5";
      const a = args.area || "Model Town";
      const c = args.city || "Lahore";
      const co = args.country || "Pakistan";
      const output = `${h}\n${s}\n${a}\n${c}\n${co}`;
      return {
        output: output,
        visualData: {
          title: "Structured Postal Address",
          badge: "5 LINES",
          status: "info",
          detail: output
        }
      };
    }
  }
];

// Category Definitions
const CATEGORIES = [
  { id: "all", label: "All Modules", icon: "✨" },
  { id: "conditionals", label: "Conditionals & Control", icon: "🚦" },
  { id: "loops", label: "Loops & Iterations", icon: "🔁" },
  { id: "functions-math", label: "Functions & Math", icon: "⚡" },
  { id: "lists", label: "Lists & Arrays", icon: "📋" },
  { id: "tuples-sets", label: "Tuples & Sets", icon: "🛡️" },
  { id: "dictionaries", label: "Dictionaries & Data", icon: "🗄️" }
];
