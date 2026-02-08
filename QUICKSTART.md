# Quick Start Guide - CPU Scheduling Simulator

## 🚀 Get Started in 30 Seconds

### Step 1: Open the Simulator
Double-click `index.html` or open it in any web browser.

### Step 2: Load Sample Data
Click the **"Sample"** button to populate 4 example processes.

### Step 3: Run Simulation
Click **"Run Simulation"** to see results with the default FCFS algorithm.

That's it! 🎉

---

## 📊 Understanding the Results

After running a simulation, you'll see:

1. **Gantt Chart** - Visual timeline showing when each process runs
   - Hover over blocks for detailed information
   - Time ruler shows the timeline
2. **Metrics Cards** - Average statistics at a glance
3. **Detailed Table** - Complete data for each process

### Key Metrics Explained

**Waiting Time** - How long the process waited in the queue
- Lower is better
- Indicates system efficiency

**Turnaround Time** - Total time from arrival to completion
- Lower is better  
- User-perceived performance

**Response Time** - Time from arrival to first execution
- Lower is better
- Critical for interactive systems

---

## 🎮 Try Different Algorithms

### Change Algorithm
Use the dropdown menu to select:

1. **FCFS** - Simple, first-come first-served
2. **SJF** - Runs shortest jobs first
3. **SRT** - Preemptive shortest remaining time
4. **Round Robin** - Fair time slicing (set quantum)
5. **MLFQ** - Multi-level adaptive queues with aging

### Adjust Time Quantum
For Round Robin and MLFQ:
- Lower quantum (1-2): More responsive, more overhead
- Higher quantum (4-10): Less overhead, approaches FCFS

---

## 🌓 Theme Options

Click the **sun/moon** button in the top right of the sidebar to toggle between:
- **Dark Mode** - Easy on the eyes, default
- **Light Mode** - Better for bright environments

---

## 📥 Import Your Own Data

### Import from File
Click **"Import"** and select a JSON or CSV file.

**JSON Format:**
```json
[
    { "arrival": 0, "burst": 5 },
    { "arrival": 2, "burst": 3 }
]
```

**CSV Format:**
```csv
Arrival,Burst
0,5
2,3
```

---

## ➕ Adding Custom Processes

Enter values and click the **+** button:

- **Arrival Time**: When process enters system (start at 0)
- **Burst Time**: How long it needs CPU (must be > 0)

### Example Process Set
```
Process 1: Arrival=0, Burst=5
Process 2: Arrival=1, Burst=3
Process 3: Arrival=2, Burst=8
Process 4: Arrival=3, Burst=6
```

---

## 🎨 Reading the Gantt Chart

Each colored block represents a process running:
- **Process ID** - Shown inside (P1, P2, etc.)
- **Duration** - Badge showing time units (e.g., "5u")
- **Time Markers** - Start/end times below blocks
- **Hover** - Shows detailed tooltip

### Time Ruler
The ruler below the chart shows:
- Tick marks at regular intervals
- Current time scale

---

## 📤 Export Results

After running a simulation:
1. Click **"Export CSV"** button
2. Save the file with all process metrics
3. Open in Excel or any spreadsheet app

---

## 🧪 Experiment Ideas

### Experiment 1: Compare All Algorithms
1. Load sample data
2. Run each algorithm
3. Compare average waiting times
4. Which performs best?

### Experiment 2: Find Optimal Quantum
1. Select Round Robin
2. Try quantum values: 1, 2, 4, 8
3. Compare context switches vs performance

### Experiment 3: Convoy Effect
Create this scenario:
```
P1: Arrival=0, Burst=20
P2: Arrival=1, Burst=3
P3: Arrival=2, Burst=3
P4: Arrival=3, Burst=3
```
4. Compare FCFS vs SRT - see the difference!

### Experiment 4: The Ultimate Showdown 🏆
1. Load "Sample" data.
2. Click the **Comparison Chart** icon (next to Run).
3. Instantly see which algorithm wins for Waiting Time.
4. Note how SRT often wins, but check the Context Switches!

### Experiment 5: Visualize Execution ⏯️
1. Click **Reset** in the timeline header.
2. Click **Step (⏭)** repeatedly to see decisions made tick-by-tick.
3. Or click **Play (▶)** to watch the OS schedule processes in real-time.


---

## ❓ Troubleshooting

**Problem: Results not showing**
- Make sure you have at least 1 process
- Check that burst times are greater than 0
- Try clicking "Clear All" then re-add processes

**Problem: Unexpected results**  
- Verify arrival times are correct
- Check burst times are positive
- Try sample data to confirm simulator works

---

## 🎓 Learning Tips

1. **Start Simple** - Use 3-4 processes initially
2. **Compare Algorithms** - Run the same data through all algorithms
3. **Vary Parameters** - Change quantum, arrival times, burst times
4. **Check Metrics** - Focus on one metric at a time
5. **Read the Report** - See COMPARISON-REPORT.md for detailed analysis

---

## 📚 Next Steps

After mastering the basics:

1. Read **README.md** for comprehensive documentation
2. Study **COMPARISON-REPORT.md** for algorithm analysis
3. Try scenarios from **sample-data.json**
4. Experiment with your own process sets

---

## 🎯 Common Questions

**Q: Which algorithm is best?**
A: Depends on your needs! MLFQ for general use, SRT for minimal waiting time, RR for fairness.

**Q: Why does FCFS sometimes match SJF?**
A: When processes arrive in shortest-burst order, they perform identically.

**Q: What's a good quantum for Round Robin?**
A: Start with 2-4. Too small = overhead, too large = unfair.

**Q: Can processes starve?**
A: SJF and SRT can starve long processes. FCFS, RR, and MLFQ (with aging) cannot.

---

**Happy Learning! 🎓**
