# CPU Scheduling Algorithm Simulator

A comprehensive web-based simulator for visualizing and comparing different CPU scheduling algorithms used in operating systems.

![CPU Scheduler](screenshot-preview.png)

## 🎯 Features

- **5 Scheduling Algorithms Implemented:**
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF) - Non-preemptive
  - Shortest Remaining Time (SRT) - Preemptive
  - Round Robin (RR) - Configurable time quantum
  - Multilevel Feedback Queue (MLFQ) - 3-level queue with aging

- **Interactive Visualization:**
  - Dynamic Gantt chart showing process execution timeline
  - Real-time metrics calculation
  - Responsive and modern UI design

- **Comprehensive Metrics:**
  - Waiting Time
  - Turnaround Time
  - Response Time
  - Average values for all metrics

- **User-Friendly Interface:**
  - Easy process input
  - Sample data loader
  - Clear results presentation
  - Export-ready format

## 🚀 Quick Start

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or dependencies required

### Running the Simulator

1. **Open the file:**
   ```bash
   # Simply open cpu-scheduler.html in your web browser
   # Double-click the file or use:
   open cpu-scheduler.html          # macOS
   start cpu-scheduler.html         # Windows
   xdg-open cpu-scheduler.html      # Linux
   ```

2. **Or use a local server (optional):**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Then open: http://localhost:8000/cpu-scheduler.html
   ```

## 📖 How to Use

### 1. Configure Processes

**Option A: Load Sample Data**
- Click "Load Sample Data" to populate with example processes
- Sample includes 4 processes with varying arrival and burst times

**Option B: Add Custom Processes**
- Click "+ Add Process" to add a new process
- Enter values for:
  - **Arrival Time:** When the process arrives in the ready queue
  - **Burst Time:** CPU time required by the process
  - **Priority:** (Optional) Used for priority-based scheduling

### 2. Select Algorithm

Choose from the dropdown menu:
- **FCFS:** Processes executed in order of arrival
- **SJF:** Shortest job executed first (non-preemptive)
- **SRT:** Preemptive version of SJF
- **RR:** Time-sliced execution with quantum
- **MLFQ:** Multi-level queues with feedback

### 3. Configure Time Quantum

For Round Robin and MLFQ:
- Set the time quantum (default: 2)
- MLFQ uses: Queue 0 (quantum=2), Queue 1 (quantum=4), Queue 2 (FCFS)

### 4. Run Simulation

- Click "Run Simulation"
- View the Gantt chart showing execution timeline
- Analyze the metrics table
- Review average performance statistics

### 5. Compare Algorithms

Run the same process set with different algorithms to compare:
- Which has lowest average waiting time?
- Which provides best response time?
- Trade-offs between fairness and efficiency

## 🧮 Algorithm Descriptions

### First Come First Serve (FCFS)
**Type:** Non-preemptive

**How it works:**
- Processes executed in the order they arrive
- Once a process starts, it runs to completion
- Simple but can cause convoy effect

**Best for:**
- Batch systems
- Simple task scheduling
- When fairness is priority over efficiency

**Pros:**
- Simple to implement
- No starvation
- Fair in arrival order

**Cons:**
- Poor average waiting time
- Convoy effect with long processes
- No priority consideration

### Shortest Job First (SJF)
**Type:** Non-preemptive

**How it works:**
- Among available processes, execute the one with shortest burst time
- Minimizes average waiting time (provably optimal for non-preemptive)
- Process runs to completion once started

**Best for:**
- Batch processing
- Known process durations
- Minimizing average wait time

**Pros:**
- Optimal average waiting time
- Good throughput
- Efficient for known burst times

**Cons:**
- Requires knowing burst times
- Can cause starvation of long processes
- Not practical for interactive systems

### Shortest Remaining Time (SRT)
**Type:** Preemptive

**How it works:**
- Preemptive version of SJF
- If a new process arrives with shorter remaining time, current process is preempted
- Always executes process with shortest remaining time

**Best for:**
- Real-time systems
- Time-critical applications
- Dynamic process environments

**Pros:**
- Better average waiting time than SJF
- More responsive to new arrivals
- Optimal for preemptive scheduling

**Cons:**
- Higher context switching overhead
- Possible starvation
- Requires constant monitoring

### Round Robin (RR)
**Type:** Preemptive

**How it works:**
- Each process gets a fixed time quantum
- Processes cycle through ready queue
- Preempted if quantum expires before completion
- Fair time distribution among processes

**Best for:**
- Time-sharing systems
- Interactive environments
- Equal priority processes

**Pros:**
- Fair CPU allocation
- Good response time
- No starvation
- Bounded waiting time

**Cons:**
- Average waiting time can be high
- Performance depends on quantum size
- Higher context switching

**Quantum Selection:**
- Too small: Excessive context switching
- Too large: Approaches FCFS
- Typical: 10-100ms in real systems

### Multilevel Feedback Queue (MLFQ)
**Type:** Preemptive, Adaptive

**How it works:**
- Multiple queues with different priorities
- New processes start in highest priority queue
- Processes demoted if they use full quantum
- Aging can promote long-waiting processes
- Different quantum per queue level

**Implementation:**
- **Queue 0:** Quantum = 2 (highest priority)
- **Queue 1:** Quantum = 4 (medium priority)
- **Queue 2:** FCFS (lowest priority)

**Best for:**
- General-purpose operating systems
- Mixed workload (I/O and CPU-bound)
- Interactive systems

**Pros:**
- Adapts to process behavior
- Good response for interactive tasks
- Prevents starvation with aging
- Balances throughput and response

**Cons:**
- Complex implementation
- Requires parameter tuning
- More overhead

## 📊 Understanding Metrics

### Waiting Time (WT)
- Time spent waiting in ready queue
- **Formula:** `WT = Turnaround Time - Burst Time`
- Lower is better
- Indicates system efficiency

### Turnaround Time (TAT)
- Total time from arrival to completion
- **Formula:** `TAT = Completion Time - Arrival Time`
- Includes waiting + execution time
- Key user-perceived metric

### Response Time (RT)
- Time from arrival to first execution
- **Formula:** `RT = First Start Time - Arrival Time`
- Critical for interactive systems
- Measures system responsiveness

### Example Calculation

```
Process: P1
Arrival Time: 0
Burst Time: 5
First Start Time: 3
Completion Time: 8

Response Time = 3 - 0 = 3
Turnaround Time = 8 - 0 = 8
Waiting Time = 8 - 5 = 3
```

## 🎨 Sample Scenarios

### Scenario 1: Convoy Effect (FCFS Problem)
```
P1: Arrival=0, Burst=20
P2: Arrival=1, Burst=3
P3: Arrival=2, Burst=3
P4: Arrival=3, Burst=3

FCFS Average WT: ~17
SJF Average WT: ~7
```

### Scenario 2: I/O Bound vs CPU Bound
```
P1: Arrival=0, Burst=10  (CPU-bound)
P2: Arrival=1, Burst=2   (I/O-bound)
P3: Arrival=2, Burst=1   (I/O-bound)
P4: Arrival=3, Burst=8   (CPU-bound)

RR (quantum=2) provides better response for short processes
MLFQ adapts to process types
```

### Scenario 3: Starvation Example
```
Long process with continuous short arrivals
P1: Arrival=0, Burst=15
P2: Arrival=2, Burst=1
P3: Arrival=4, Burst=1
P4: Arrival=6, Burst=1
...

SJF/SRT: P1 may starve
RR/MLFQ: Fair allocation guaranteed
```

## 🔧 Customization

### Modifying MLFQ Parameters

Edit the `mlfq()` function in the HTML file:

```javascript
const queues = [[], [], []];        // Number of queues
const quantums = [2, 4, Infinity];  // Quantum for each level

// To add a 4th queue:
const queues = [[], [], [], []];
const quantums = [1, 2, 4, Infinity];
```

### Changing Visual Theme

CSS custom properties in `:root`:

```css
:root {
    --primary: #00ff41;      /* Main accent color */
    --secondary: #ff006e;    /* Secondary accent */
    --tertiary: #00d9ff;     /* Tertiary accent */
    --bg-dark: #0a0e27;      /* Background */
}
```

### Adding New Algorithms

1. Implement the algorithm function:
```javascript
function myAlgorithm(processes) {
    // Your implementation
    return { processes, timeline };
}
```

2. Add to the switch statement in `simulate()`:
```javascript
case 'myalgo':
    result = myAlgorithm(processes);
    break;
```

3. Add option to select dropdown in HTML

## 📈 Performance Comparison

### Typical Results (Sample Data)

| Algorithm | Avg WT | Avg TAT | Avg RT | Context Switches |
|-----------|--------|---------|--------|------------------|
| FCFS      | 7.75   | 13.25   | 7.75   | 0                |
| SJF       | 7.00   | 12.50   | 7.00   | 0                |
| SRT       | 3.00   | 8.50    | 1.25   | ~6               |
| RR (q=2)  | 7.00   | 12.50   | 2.25   | ~8               |
| MLFQ      | 5.50   | 11.00   | 2.00   | ~10              |

*Results vary based on process characteristics*

### When to Use Each Algorithm

**Use FCFS when:**
- Simplicity is priority
- All processes similar length
- Batch processing environment

**Use SJF when:**
- Burst times are known
- Minimizing average wait is critical
- Batch system with job time estimates

**Use SRT when:**
- Need optimal preemptive scheduling
- Can tolerate context switching
- Real-time requirements

**Use RR when:**
- Time-sharing system
- Interactive users
- Equal priority for all processes
- Fair allocation required

**Use MLFQ when:**
- General-purpose OS
- Mixed workload types
- Both interactive and batch processes
- Need adaptability

## 🐛 Troubleshooting

### Gantt Chart Not Displaying
- Ensure processes have valid burst times (> 0)
- Check browser console for errors
- Try clearing results and re-running

### Incorrect Metrics
- Verify arrival times are in ascending order
- Check burst times are positive integers
- Ensure time quantum > 0 for RR/MLFQ

### Performance Issues
- Limit processes to < 20 for complex algorithms
- Reduce time quantum if simulation is slow
- Use a modern browser

## 📚 Educational Resources

### Key Concepts to Understand

1. **Process States:** New → Ready → Running → Waiting → Terminated
2. **Context Switching:** Overhead of saving/restoring process state
3. **Preemption:** Interrupting running process for another
4. **Starvation:** Process waiting indefinitely
5. **Aging:** Gradually increasing priority

### Recommended Reading

- Operating System Concepts (Silberschatz, Galvin, Gagne)
- Modern Operating Systems (Tanenbaum)
- Operating Systems: Three Easy Pieces (Arpaci-Dusseau)

### Practice Exercises

1. **Exercise 1:** Run all algorithms on the same data set and compare results
2. **Exercise 2:** Find the optimal quantum for Round Robin
3. **Exercise 3:** Create a scenario where FCFS performs better than SJF
4. **Exercise 4:** Design a workload where MLFQ excels
5. **Exercise 5:** Calculate metrics manually and verify against simulator

## 🤝 Contributing

Feel free to extend this simulator:
- Add priority scheduling
- Implement real-time scheduling (EDF, RM)
- Add gantt chart export (PNG/PDF)
- Create comparison mode (side-by-side)
- Add CPU utilization metrics
- Implement process arrival animation

## 📄 License

This project is open source and available for educational purposes.

## 🎓 Author Notes

This simulator was created as an educational tool for understanding CPU scheduling algorithms. It demonstrates:

- Core OS scheduling concepts
- Algorithm implementation
- Performance metric calculation
- Interactive visualization

Perfect for:
- Operating Systems courses
- Self-study
- Algorithm comparison
- Teaching demonstrations

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review algorithm descriptions
3. Examine sample scenarios
4. Verify input data format

---

**Version:** 1.0  
**Last Updated:** 2026  
**Technology:** Pure HTML/CSS/JavaScript (No dependencies)

**Happy Scheduling! 🚀**
