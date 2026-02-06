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

    function mlfq(processes) {
        const timeline = [];
        const procs = JSON.parse(JSON.stringify(processes));
        const queues = [[], [], []]; 
        const quantums = [2, 4, Infinity];
        const AGING_THRESHOLD = 20;
        
        let currentTime = 0;
        const arrived = new Set();
        const queueLevel = {}; 

        procs.sort((a, b) => a.arrival - b.arrival);
        procs.forEach(p => {
            p.remaining = p.burst;
            p.age = 0;
            queueLevel[p.id] = 0;
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
        if (arrived.size === 0 && procs.length > 0) {
            currentTime = procs[0].arrival;
            checkArrivals(currentTime);
        }

        while (procs.some(p => p.remaining > 0)) {
            let currentQueue = -1;
            for (let i = 0; i < 3; i++) {
                if (queues[i].length > 0) {
                    currentQueue = i;
                    break;
                }
            }

            if (currentQueue === -1) {
                currentTime++;
                checkArrivals(currentTime);
                continue;
            }

            const proc = queues[currentQueue].shift();
            
            if (proc.startTime === undefined) {
                 proc.startTime = currentTime;
                 proc.responseTime = currentTime - proc.arrival;
            }

            const quantum = quantums[currentQueue];
            const execTime = Math.min(quantum, proc.remaining);
            
            timeline.push({
                process: proc.id,
                start: currentTime,
                duration: execTime,
                colorIndex: (proc.id - 1) % 8
            });

            proc.remaining -= execTime;
            proc.age = 0; 
            
            for(let qIdx = 0; qIdx < 3; qIdx++) {
                queues[qIdx].forEach(p => p.age += execTime);
            }
            
            currentTime += execTime;
            checkArrivals(currentTime);

            for (let i = 1; i < 3; i++) {
                for (let j = queues[i].length - 1; j >= 0; j--) {
                    if (queues[i][j].age >= AGING_THRESHOLD) {
                        const p = queues[i].splice(j, 1)[0];
                        p.age = 0;
                        const newLevel = i - 1;
                        queues[newLevel].push(p);
                        queueLevel[p.id] = newLevel;
                    }
                }
            }

            if (proc.remaining > 0) {
                let nextQueue = currentQueue;
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
        }

        return { processes: procs, timeline };
    }

    return { fcfs, sjf, srt, rr, mlfq };
})();
