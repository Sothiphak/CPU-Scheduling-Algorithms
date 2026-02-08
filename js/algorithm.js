/**
 * CPU Scheduling Algorithms
 * Attached to window.Algorithm to avoid ES Module requirements for local file opening.
 */

window.Algorithm = (function() {

    function fcfs(processes) {
        const timeline = [];
        const procs = JSON.parse(JSON.stringify(processes)).sort((a, b) => a.arrival - b.arrival);
        let currentTime = 0;

        procs.forEach(proc => {
            if (currentTime < proc.arrival) {
                currentTime = proc.arrival;
            }
            
            proc.startTime = currentTime;
            proc.responseTime = currentTime - proc.arrival;
            
            timeline.push({
                process: proc.id,
                start: currentTime,
                duration: proc.burst,
                colorIndex: (proc.id - 1) % 8
            });
            
            currentTime += proc.burst;
            proc.completionTime = currentTime;
            proc.turnaroundTime = proc.completionTime - proc.arrival;
            proc.waitingTime = proc.turnaroundTime - proc.burst;
        });

        return { processes: procs, timeline };
    }

    function sjf(processes) {
        const timeline = [];
        const procs = JSON.parse(JSON.stringify(processes));
        let currentTime = 0;
        const completed = [];
        const n = procs.length;

        const minArrival = Math.min(...procs.map(p => p.arrival));
        if (currentTime < minArrival) currentTime = minArrival;

        while (completed.length < n) {
            const available = procs.filter(p => 
                p.arrival <= currentTime && !completed.includes(p.id)
            );

            if (available.length === 0) {
                const uncompleted = procs.filter(p => !completed.includes(p.id));
                if (uncompleted.length > 0) {
                    currentTime = Math.min(...uncompleted.map(p => p.arrival));
                } else {
                     break; 
                }
                continue;
            }

            available.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);
            const proc = available[0];
            
            proc.startTime = currentTime;
            proc.responseTime = currentTime - proc.arrival;
            
            timeline.push({
                process: proc.id,
                start: currentTime,
                duration: proc.burst,
                colorIndex: (proc.id - 1) % 8
            });
            
            currentTime += proc.burst;
            proc.completionTime = currentTime;
            proc.turnaroundTime = proc.completionTime - proc.arrival;
            proc.waitingTime = proc.turnaroundTime - proc.burst;
            completed.push(proc.id);
        }

        return { processes: procs, timeline };
    }

    function srt(processes) {
        const timeline = [];
        const procs = JSON.parse(JSON.stringify(processes));
        let currentTime = 0;
        const completed = new Set();
        let lastProcess = null;

        procs.forEach(p => p.remaining = p.burst);

        const minArrival = Math.min(...procs.map(p => p.arrival));
        if (currentTime < minArrival) currentTime = minArrival;

        while (completed.size < procs.length) {
            const available = procs.filter(p => 
                p.arrival <= currentTime && !completed.has(p.id)
            );

            if (available.length === 0) {
                 const uncompleted = procs.filter(p => !completed.has(p.id));
                 if(uncompleted.length > 0) {
                     currentTime = Math.min(...uncompleted.map(p => p.arrival));
                 } else {
                     break;
                 }
                 continue;
            }

            available.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival);
            const proc = available[0];

            if (proc.startTime === undefined || proc.startTime === -1) {
                proc.startTime = currentTime;
                proc.responseTime = currentTime - proc.arrival;
            }

            if (lastProcess !== proc.id) {
                timeline.push({
                    process: proc.id,
                    start: currentTime,
                    duration: 0,
                    colorIndex: (proc.id - 1) % 8
                });
                lastProcess = proc.id;
            }

            timeline[timeline.length - 1].duration++;
            proc.remaining--;
            currentTime++;

            if (proc.remaining === 0) {
                proc.completionTime = currentTime;
                proc.turnaroundTime = proc.completionTime - proc.arrival;
                proc.waitingTime = proc.turnaroundTime - proc.burst;
                completed.add(proc.id);
            }
        }

        return { processes: procs, timeline };
    }

    function rr(processes, quantum) {
        const timeline = [];
        const procs = JSON.parse(JSON.stringify(processes));
        const queue = [];
        let currentTime = 0;
        const arrived = new Set();

        procs.forEach(p => p.remaining = p.burst);
        procs.sort((a, b) => a.arrival - b.arrival);

        // Initial check
        const checkArrivals = () => {
             procs.forEach(p => {
                if (p.arrival <= currentTime && !arrived.has(p.id)) {
                    queue.push(p);
                    arrived.add(p.id);
                }
            });
        };
        checkArrivals();
        
        // Jump if needed
        if (queue.length === 0 && procs.length > 0) {
            currentTime = procs[0].arrival;
            checkArrivals();
        }

        while (queue.length > 0) {
            const proc = queue.shift();
            
            if (proc.responseTime === undefined) {
                 proc.startTime = currentTime;
                 proc.responseTime = currentTime - proc.arrival;
            }

            const execTime = Math.min(quantum, proc.remaining);
            
            timeline.push({
                process: proc.id,
                start: currentTime,
                duration: execTime,
                colorIndex: (proc.id - 1) % 8
            });

            proc.remaining -= execTime;
            currentTime += execTime;

            // New arrivals
            checkArrivals();

            if (proc.remaining > 0) {
                queue.push(proc);
            } else {
                proc.completionTime = currentTime;
                proc.turnaroundTime = proc.completionTime - proc.arrival;
                proc.waitingTime = proc.turnaroundTime - proc.burst;
            }
            
            // If queue is empty but not everyone is done
            if (queue.length === 0 && arrived.size < procs.length) {
                const nextP = procs.find(p => !arrived.has(p.id));
                if (nextP) {
                    currentTime = nextP.arrival;
                    checkArrivals();
                }
            }
        }

        return { processes: procs, timeline };
    }

    function mlfq(processes, quantums = [2, 4, Infinity]) {
        const timeline = [];
        const snapshots = []; // For visualization
        const procs = JSON.parse(JSON.stringify(processes));
        // Ensure 3 quantums, fallback to defaults if not provided correctly
        const qLevels = [
            (quantums[0] !== undefined && !isNaN(quantums[0])) ? quantums[0] : 2,
            (quantums[1] !== undefined && !isNaN(quantums[1])) ? quantums[1] : 4,
            (quantums[2] !== undefined && !isNaN(quantums[2])) ? quantums[2] : Infinity
        ];
        
        const queues = [[], [], []]; 
        const AGING_THRESHOLD = 20;
        
        let currentTime = 0;
        const arrived = new Set();
        // Track which queue each process is currently in for visualization
        const queueLevel = {}; 

        procs.sort((a, b) => a.arrival - b.arrival);
        procs.forEach(p => {
            p.remaining = p.burst;
            p.age = 0;
            queueLevel[p.id] = 0; // Default starts at Q0
        });

        const checkArrivals = (time) => {
             procs.forEach(p => {
                if (p.arrival <= time && !arrived.has(p.id)) {
                    queues[0].push(p);
                    arrived.add(p.id);
                    queueLevel[p.id] = 0;
                }
            });
        }

        checkArrivals(currentTime);
        // Jump time if idle
        if (arrived.size === 0 && procs.length > 0) {
            // Add idle time to timeline if needed
            const nextArrival = procs[0].arrival;
            if (nextArrival > currentTime) {
                // Optional: record idle
                currentTime = nextArrival;
            }
            checkArrivals(currentTime);
        }

        // Snapshot Helper
        const recordSnapshot = (runningProcId = null) => {
            const snap = {
                time: currentTime,
                runningId: runningProcId,
                queues: [[], [], []]
            };
            
            // Record state of each queue
            for(let i=0; i<3; i++) {
                snap.queues[i] = queues[i].map(p => ({
                    id: p.id,
                    age: p.age,
                    burst: p.burst,
                    remaining: p.remaining
                }));
            }
            snapshots.push(snap);
        };

        // Initial snapshot
        recordSnapshot();

        while (procs.some(p => p.remaining > 0)) {
            let currentQueue = -1;
            for (let i = 0; i < 3; i++) {
                if (queues[i].length > 0) {
                    currentQueue = i;
                    break;
                }
            }

            if (currentQueue === -1) {
                // If idle, advance time
                currentTime++;
                checkArrivals(currentTime);
                recordSnapshot(null);
                continue;
            }

            const proc = queues[currentQueue].shift();
            
            if (proc.startTime === undefined) {
                 proc.startTime = currentTime;
                 proc.responseTime = currentTime - proc.arrival;
            }

            const quantum = qLevels[currentQueue];
            let execTime = 0;

            // Execute unit by unit to capture snapshots for animation (optional but smoother)
            // Or execute in chunks. For granular animation, let's step.
            // But to keep performance decent, we can execute the full slice but record frames?
            // "replay" usually steps through the Gantt blocks. 
            // The Gantt blocks are often > 1 unit. 
            // We should record snapshot at the START of this execution block.
            
            const timeToRun = Math.min(quantum, proc.remaining);
            
            timeline.push({
                process: proc.id,
                start: currentTime,
                duration: timeToRun,
                colorIndex: (proc.id - 1) % 8,
                snapshotIndex: snapshots.length // Link to a snapshot state
            });
            
            // Record snapshot implies "State BEFORE this block runs"
            // We already did recordSnapshot at loop start or previous end.
            
            execTime = timeToRun;
            proc.remaining -= execTime;
            
            // Age others
            // Only increment age for queues LOWER than current? 
            // Or all waiting processes? Usually all waiting in lower queues.
            // "queues[i][j].age += execTime" logic was:
            // "for(let qIdx = 0; qIdx < 3; qIdx++) queues[qIdx].forEach..."
            // But waiting in higher queue is not usually aging. Usually standard MLFQ ages from bottom up.
            // The existing code aged everyone. We keep that logic.
            
            for(let qIdx = 0; qIdx < 3; qIdx++) {
                queues[qIdx].forEach(p => p.age += execTime);
            }

            currentTime += execTime;
            checkArrivals(currentTime);
            proc.age = 0; // Reset age of running process

            // Aging Promotion Check
            let promoted = false;
            for (let i = 1; i < 3; i++) {
                for (let j = queues[i].length - 1; j >= 0; j--) {
                    if (queues[i][j].age >= AGING_THRESHOLD) {
                        const p = queues[i].splice(j, 1)[0];
                        p.age = 0;
                        const newLevel = i - 1;
                        queues[newLevel].push(p);
                        queueLevel[p.id] = newLevel;
                        promoted = true;
                    }
                }
            }

            // Re-queue current process
            if (proc.remaining > 0) {
                let nextQueue = currentQueue;
                // Demotion: If used full quantum AND not already at bottom AND didn't just get promoted (rare edge)
                if (execTime === quantum && currentQueue < 2) {
                    nextQueue = currentQueue + 1;
                }
                queues[nextQueue].push(proc);
                queueLevel[proc.id] = nextQueue;
            } else {
                proc.completionTime = currentTime;
                proc.turnaroundTime = proc.completionTime - proc.arrival;
                proc.waitingTime = proc.turnaroundTime - proc.burst;
            }
            
            // Record snapshot for NEXT step
            recordSnapshot(null);
        }

        return { processes: procs, timeline, snapshots };
    }

    return { fcfs, sjf, srt, rr, mlfq };
})();
