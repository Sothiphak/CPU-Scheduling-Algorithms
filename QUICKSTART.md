# Quick Start Guide - CPU Scheduling Simulator

## 🚀 Get Started in 30 Seconds

### Step 1: Open the Simulator
Double-click `cpu-scheduler.html` or open it in any web browser.

### Step 2: Load Sample Data
Click the **"Load Sample Data"** button to populate 4 example processes.

### Step 3: Run Simulation
Click **"Run Simulation"** to see results with the default FCFS algorithm.

That's it! 🎉

---

## 📊 Understanding the Results

After running a simulation, you'll see:

1. **Gantt Chart** - Visual timeline showing when each process runs
2. **Metrics Table** - Detailed statistics for each process
3. **Average Values** - Overall performance metrics

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
5. **MLFQ** - Multi-level adaptive queues

### Adjust Time Quantum
For Round Robin and MLFQ:
- Lower quantum (1-2): More responsive, more overhead
- Higher quantum (4-10): Less overhead, approaches FCFS

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
Compare FCFS vs SRT - see the difference!

---

## ➕ Adding Custom Processes

Click **"+ Add Process"** and enter:

- **Arrival Time**: When process enters system (start at 0)
- **Burst Time**: How long it needs CPU (must be > 0)
- **Priority**: Optional, for future features

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
- **Width** = How long it ran
- **Color** = Unique per process
- **Label** = Process ID (P1, P2, etc.)
- **Numbers** = Time points

### Example
```
[P1][P2][P1][P3]
0   2  5  7  15
```
This means:
- P1 ran from 0→2 (2 units)
- P2 ran from 2→5 (3 units)
- P1 ran from 5→7 (2 units)
- P3 ran from 7→15 (8 units)

---

## 📖 Sample Scenarios

### Scenario 1: Basic Test
Good for first-time users
```
P1: Arrival=0, Burst=5
P2: Arrival=1, Burst=3
P3: Arrival=2, Burst=8
P4: Arrival=3, Burst=6
```

### Scenario 2: Convoy Effect
Shows FCFS weakness
```
P1: Arrival=0, Burst=20
P2: Arrival=1, Burst=3
P3: Arrival=2, Burst=3
P4: Arrival=3, Burst=3
```

### Scenario 3: Mixed Workload
I/O vs CPU bound processes
```
P1: Arrival=0, Burst=10
P2: Arrival=1, Burst=2
P3: Arrival=2, Burst=1
P4: Arrival=3, Burst=8
P5: Arrival=4, Burst=2
```

---

## ❓ Troubleshooting

**Problem: Results not showing**
- Make sure you have at least 1 process
- Check that burst times are greater than 0
- Try clicking "Clear" then re-run

**Problem: Unexpected results**  
- Verify arrival times are correct
- Check burst times are positive
- Try sample data to confirm simulator works

**Problem: Gantt chart looks wrong**
- Clear browser cache
- Refresh the page
- Try a different browser

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
5. Compare results with operating systems theory

---

## 💡 Tips for Best Learning

**For Students:**
- Run each algorithm on the same data
- Calculate metrics manually to verify
- Create worst-case scenarios
- Compare with textbook examples

**For Teachers:**
- Use for live demonstrations
- Assign comparison exercises
- Show convoy effect visually
- Discuss trade-offs

**For Enthusiasts:**
- Modify the code to add features
- Test with real-world workloads
- Compare with actual OS behavior
- Build understanding of OS internals

---

## 🎯 Common Questions

**Q: Which algorithm is best?**
A: Depends on your needs! MLFQ for general use, SRT for minimal waiting time, RR for fairness.

**Q: Why does FCFS sometimes match SJF?**
A: When processes arrive in shortest-burst order, they perform identically.

**Q: What's a good quantum for Round Robin?**
A: Start with 2-4. Too small = overhead, too large = unfair.

**Q: Can processes starve?**
A: SJF and SRT can starve long processes. FCFS, RR, and MLFQ cannot.

**Q: How realistic is this simulator?**
A: Very! These algorithms are used in real operating systems. The simulator accurately implements their core logic.

---

## 🚀 Challenge Yourself

### Challenge 1: Perfect Score
Create a scenario where all algorithms produce identical results.

### Challenge 2: Maximum Difference
Create a scenario where FCFS and SRT differ by the most.

### Challenge 3: Fairness Test
Which algorithm treats all processes most fairly? Design a test!

### Challenge 4: Real-World Simulation
Model a web server handling different request types.

---

**Happy Learning! 🎓**

For detailed information, see the full README.md
For algorithm analysis, see COMPARISON-REPORT.md
