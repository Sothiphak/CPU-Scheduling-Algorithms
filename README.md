# CPU Scheduling Algorithm Simulator

A comprehensive web-based simulator for visualizing and comparing different CPU scheduling algorithms used in operating systems.

## 🎯 Features

- **5 Scheduling Algorithms Implemented:**
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF) - Non-preemptive
  - Shortest Remaining Time (SRT) - Preemptive
  - Round Robin (RR) - Configurable time quantum
  - Multilevel Feedback Queue (MLFQ) - 3-level queue with aging

- **Interactive Visualization:**
  - Dynamic Gantt chart with detailed timing information
  - Hover tooltips showing process details
  - Time ruler with tick marks
  - Real-time metrics calculation

- **Comprehensive Metrics:**
  - Waiting Time
  - Turnaround Time
  - Response Time
  - Average values for all metrics

- **Modern UI:**
  - Dark/Light theme toggle
  - Fully responsive (mobile-friendly)
  - SVG icons throughout
  - Smooth animations and transitions

- **Import/Export:**
  - Import processes from JSON or CSV files
  - Export simulation results to CSV

## 📁 Project Structure

```
CPU Scheduling Project/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styling (themes, responsive, components)
├── js/
│   ├── algorithm.js    # Scheduling algorithm implementations
│   └── app.js          # UI logic and event handling
├── sample-data.json    # Sample test scenarios
├── test_sample.json    # Simple test data (JSON)
├── test_sample.csv     # Simple test data (CSV)
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or dependencies required

### Running the Simulator

1. **Open the file:**
   ```bash
   # Simply open index.html in your web browser
   # Double-click the file or use:
   open index.html          # macOS
   start index.html         # Windows
   xdg-open index.html      # Linux
   ```

2. **Or use a local server (optional):**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Then open: http://localhost:8000
   ```

## 📖 How to Use

### 1. Configure Processes

**Option A: Load Sample Data**
- Click "Sample" to populate with example processes

**Option B: Import from File**
- Click "Import" to load processes from JSON or CSV

**Option C: Add Custom Processes**
- Enter Arrival and Burst times
- Click the + button to add

### 2. Select Algorithm

Choose from the dropdown menu:
- **FCFS:** Processes executed in order of arrival
- **SJF:** Shortest job executed first (non-preemptive)
- **SRT:** Preemptive version of SJF
- **RR:** Time-sliced execution with quantum
- **MLFQ:** Multi-level queues with feedback and aging

### 3. Configure Time Quantum

For Round Robin and MLFQ:
- Set the time quantum (default: 2)
- MLFQ uses: Queue 0 (quantum=2), Queue 1 (quantum=4), Queue 2 (FCFS)

### 4. Run Simulation

- Click "Run Simulation"
- View the enhanced Gantt chart showing:
  - Process IDs and durations
  - Start/End times
  - Hover for detailed tooltips
  - Time ruler below
- Analyze the metrics cards and detailed table
- Export results to CSV if needed

## 🧮 Algorithm Descriptions

### First Come First Serve (FCFS)
**Type:** Non-preemptive

Processes executed in arrival order. Simple but can cause convoy effect.

### Shortest Job First (SJF)
**Type:** Non-preemptive

Among available processes, execute shortest burst time first. Optimal average waiting time.

### Shortest Remaining Time (SRT)
**Type:** Preemptive

Preemptive SJF. New arrivals with shorter remaining time preempt current process.

### Round Robin (RR)
**Type:** Preemptive

Each process gets fixed time quantum. Fair CPU allocation, good response time.

### Multilevel Feedback Queue (MLFQ)
**Type:** Preemptive, Adaptive

- **Queue 0:** Quantum = 2 (highest priority)
- **Queue 1:** Quantum = 4 (medium priority)
- **Queue 2:** FCFS (lowest priority)
- Processes demoted after using full quantum
- Aging prevents starvation (promote after waiting 10 time units)

## 📊 Understanding Metrics

| Metric | Formula | Description |
|--------|---------|-------------|
| **Waiting Time** | TAT - Burst | Time spent waiting in ready queue |
| **Turnaround Time** | Completion - Arrival | Total time from arrival to completion |
| **Response Time** | First Start - Arrival | Time from arrival to first execution |

## 📥 Import File Formats

### JSON Format
```json
[
    { "arrival": 0, "burst": 5 },
    { "arrival": 2, "burst": 3 },
    { "arrival": 4, "burst": 8 }
]
```

### CSV Format
```csv
Arrival,Burst
0,5
2,3
4,8
```

## 🎨 Theme Support

Toggle between Dark and Light modes using the sun/moon button in the sidebar header.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (sidebar + main content layout)
- Tablet (stacked layout)
- Mobile (compact layout with optimized touch targets)

## 🔧 Customization

### Modifying MLFQ Parameters

Edit `js/algorithm.js`:
```javascript
const quantums = [2, 4, Infinity];  // Quantum for each level
const AGING_THRESHOLD = 10;         // Time before promotion
```

### Changing Visual Theme

Edit CSS variables in `css/style.css`:
```css
:root {
    --accent: #6366f1;      /* Main accent color */
    --bg-primary: #0f172a;  /* Background */
}
```

## 📈 Performance Comparison

| Algorithm | Avg WT | Avg TAT | Best For |
|-----------|--------|---------|----------|
| FCFS | High | High | Simple batch systems |
| SJF | Optimal | Good | Known burst times |
| SRT | Best | Best | Real-time systems |
| RR | Medium | Medium | Time-sharing, interactive |
| MLFQ | Good | Good | General-purpose OS |

## 🎓 Educational Use

Perfect for:
- Operating Systems courses
- Self-study
- Algorithm comparison
- Teaching demonstrations

## 📄 License

This project is open source and available for educational purposes.

---

**Technology:** HTML, CSS, JavaScript (No dependencies)  
**Author:** Sopheap Sothiphak

**Happy Scheduling! 🚀**
