// No imports needed, using global window.Algorithm

// State
let processes = [];
let nextId = 1;
let lastResults = null;

// DOM Elements
const els = {
    algoSelect: document.getElementById('algoSelect'),
    quantumInput: document.getElementById('quantumInput'),
    quantum: document.getElementById('quantum'),
    newArr: document.getElementById('newArr'),
    newBurst: document.getElementById('newBurst'),
    addProcBtn: document.getElementById('addProcBtn'),
    processListBody: document.getElementById('processListBody'),
    runBtn: document.getElementById('runBtn'),
    clearProcsBtn: document.getElementById('clearProcsBtn'),
    importBtn: document.getElementById('importBtn'),
    fileInput: document.getElementById('fileInput'),
    sampleBtn: document.getElementById('sampleBtn'),
    welcomeMessage: document.getElementById('welcomeMessage'),
    resultsArea: document.getElementById('resultsArea'),
    ganttChart: document.getElementById('ganttChart'),
    resultsBody: document.getElementById('resultsBody'),
    avgWait: document.getElementById('avgWait'),
    avgTurnaround: document.getElementById('avgTurnaround'),
    avgResponse: document.getElementById('avgResponse'),
    totalTimeDisplay: document.getElementById('totalTimeDisplay'),
    exportBtn: document.getElementById('exportBtn'),
    themeToggle: document.getElementById('themeToggle'),
    compareBtn: document.getElementById('compareBtn'),
    comparisonModal: document.getElementById('comparisonModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    comparisonGrid: document.getElementById('comparisonGrid'),
    comparisonSummary: document.getElementById('comparisonSummary'),
    animResetBtn: document.getElementById('animResetBtn'),
    animPlayBtn: document.getElementById('animPlayBtn'),
    animStepBtn: document.getElementById('animStepBtn')
};

// Animation State
let animState = {
    timer: null,
    isPlaying: false,
    currentIndex: 0,
    totalBlocks: 0
};

// Initialization
function init() {
    loadSampleData();
    setupEventListeners();
    updateAnimationUI();
}

function setupEventListeners() {
    // Theme Toggle
    els.themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const sunIcon = els.themeToggle.querySelector('.icon-sun');
        const moonIcon = els.themeToggle.querySelector('.icon-moon');
        if (document.body.classList.contains('light-mode')) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    });
    
    // Input Handling
    els.addProcBtn.addEventListener('click', addProcessFromInput);
    els.clearProcsBtn.addEventListener('click', () => {
        processes = [];
        nextId = 1;
        renderProcessList();
        resetResults();
    });

    // File I/O
    els.importBtn.addEventListener('click', () => els.fileInput.click());
    els.fileInput.addEventListener('change', handleFileUpload);
    els.sampleBtn.addEventListener('click', loadSampleData);
    els.exportBtn.addEventListener('click', exportResults);

    // Simulation
    els.runBtn.addEventListener('click', runSimulation);
    
    // UI Toggles
    els.algoSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'rr' || val === 'mlfq') {
            els.quantumInput.classList.remove('hidden');
        } else {
            els.quantumInput.classList.add('hidden');
        }
    });

    // Comparison Dashboard
    els.compareBtn.addEventListener('click', compareAlgorithms);
    els.closeModalBtn.addEventListener('click', closeComparisonModal);
    els.comparisonModal.addEventListener('click', (e) => {
        if (e.target === els.comparisonModal) closeComparisonModal();
    });

    // Animation Controls
    els.animResetBtn.addEventListener('click', resetAnimation);
    els.animPlayBtn.addEventListener('click', toggleAnimation);
    els.animStepBtn.addEventListener('click', stepAnimation);
}

// Process Management
function addProcess(arrival, burst) {
    processes.push({
        id: nextId++,
        arrival: parseInt(arrival),
        burst: parseInt(burst)
    });
    renderProcessList();
}

function addProcessFromInput() {
    const arr = els.newArr.value;
    const burst = els.newBurst.value;

    if (arr === '' || burst === '' || burst <= 0) {
        alert('Please enter valid arrival and burst times.');
        return;
    }

    addProcess(arr, burst);
    els.newArr.value = '';
    els.newBurst.value = '';
    els.newArr.focus();
}

function removeProcess(id) {
    processes = processes.filter(p => p.id !== id);
    renderProcessList();
}

function renderProcessList() {
    els.processListBody.innerHTML = '';
    processes.forEach(p => {
        const item = document.createElement('div');
        item.className = 'process-item';
        item.innerHTML = `
            <span class="process-id">P${p.id}</span>
            <span>${p.arrival}</span>
            <span>${p.burst}</span>
            <button class="delete-btn" data-id="${p.id}">×</button>
        `;
        item.querySelector('.delete-btn').addEventListener('click', () => removeProcess(p.id));
        els.processListBody.appendChild(item);
    });
}

const sampleScenarios = [
    {
        name: "Teacher's Example",
        data: [
            { id: 1, arrival: 0, burst: 5 },
            { id: 2, arrival: 1, burst: 3 },
            { id: 3, arrival: 2, burst: 8 },
            { id: 4, arrival: 3, burst: 6 }
        ]
    },
    {
        name: "Short Tasks (SJF Demo)",
        data: [
            { id: 1, arrival: 0, burst: 2 },
            { id: 2, arrival: 2, burst: 1 },
            { id: 3, arrival: 4, burst: 3 },
            { id: 4, arrival: 5, burst: 2 },
            { id: 5, arrival: 7, burst: 1 }
        ]
    },
    {
        name: "Long Bursts (FCFS vs RR)",
        data: [
            { id: 1, arrival: 0, burst: 20 },
            { id: 2, arrival: 1, burst: 4 },
            { id: 3, arrival: 2, burst: 2 },
            { id: 4, arrival: 3, burst: 3 }
        ]
    },
    {
        name: "Arrival Pattern",
        data: [
            { id: 1, arrival: 0, burst: 6 },
            { id: 2, arrival: 5, burst: 4 },
            { id: 3, arrival: 10, burst: 8 },
            { id: 4, arrival: 15, burst: 3 }
        ]
    }
];

function loadSampleData() {
    // Pick a random scenario
    const randomIndex = Math.floor(Math.random() * sampleScenarios.length);
    const scenario = sampleScenarios[randomIndex];
    
    // Clone data to avoid reference issues
    processes = JSON.parse(JSON.stringify(scenario.data));
    nextId = processes.length + 1;
    
    // showToast(`Loaded: ${scenario.name}`);
    renderProcessList();
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300); // Wait for transition
    }, 3000);
}

// File I/O
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const content = event.target.result;
            let newProcs = [];
            
            if (file.name.endsWith('.json')) {
                const data = JSON.parse(content);
                if (Array.isArray(data)) {
                    data.forEach(p => {
                        if (p.arrival != null && p.burst != null) {
                            newProcs.push({
                                arrival: parseInt(p.arrival),
                                burst: parseInt(p.burst)
                            });
                        }
                    });
                }
            } else if (file.name.endsWith('.csv')) {
                const lines = content.trim().split('\n');
                const startIndex = lines[0].toLowerCase().includes('arrival') ? 1 : 0;
                for(let i=startIndex; i<lines.length; i++) {
                    const [arr, burst] = lines[i].split(',').map(v => v.trim());
                    if (arr && burst) {
                        newProcs.push({
                             arrival: parseInt(arr),
                             burst: parseInt(burst)
                        });
                    }
                }
            }

            if (newProcs.length > 0) {
                processes = []; 
                nextId = 1;
                newProcs.forEach(p => {
                    p.id = nextId++;
                    processes.push(p);
                });
                renderProcessList();
            } else {
                alert('No valid processes found.');
            }
        } catch (err) {
            alert('Error parsing file: ' + err.message);
        }
        e.target.value = '';
    };
    reader.readAsText(file);
}

function exportResults() {
    if (!lastResults) return;
    
    const headers = ['Process ID', 'Arrival', 'Burst', 'Start Time', 'Completion Time', 'Waiting Time', 'Turnaround Time', 'Response Time'];
    const rows = lastResults.processes.map(p => [
        p.id, p.arrival, p.burst, p.startTime, p.completionTime, p.waitingTime, p.turnaroundTime, p.responseTime
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'scheduler_results.csv';
    link.click();
}

// Simulation Logic
function runSimulation() {
    if (processes.length === 0) {
        alert('Add some processes first!');
        return;
    }
    
    stopAnimation(); // Stop any running animation

    const algo = els.algoSelect.value;
    const quantum = parseInt(els.quantum.value) || 2;
    let result = null;

    // Use window.Algorithm
    switch(algo) {
        case 'fcfs': result = window.Algorithm.fcfs(processes); break;
        case 'sjf': result = window.Algorithm.sjf(processes); break;
        case 'srt': result = window.Algorithm.srt(processes); break;
        case 'rr': result = window.Algorithm.rr(processes, quantum); break;
        case 'mlfq': result = window.Algorithm.mlfq(processes); break;
    }

    lastResults = result;
    renderResults(result);
}

function renderResults(res) {
    els.welcomeMessage.classList.add('hidden');
    els.resultsArea.classList.remove('hidden');

    // Stats
    const totalWait = res.processes.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTurn = res.processes.reduce((sum, p) => sum + p.turnaroundTime, 0);
    const totalResp = res.processes.reduce((sum, p) => sum + p.responseTime, 0);
    const count = res.processes.length;

    els.avgWait.textContent = (totalWait / count).toFixed(2);
    els.avgTurnaround.textContent = (totalTurn / count).toFixed(2);
    els.avgResponse.textContent = (totalResp / count).toFixed(2);

    // Timeline Rendering
    renderGantt(res.timeline);

    // Table Rendering
    renderResultsTable(res.processes);
}

function renderGantt(timeline) {
    els.ganttChart.innerHTML = '';
    if (timeline.length === 0) return;

    const finalTime = timeline[timeline.length - 1].start + timeline[timeline.length - 1].duration;
    els.totalTimeDisplay.textContent = `Total: ${finalTime} units`;

    // Create gantt wrapper structure
    const ganttInner = document.createElement('div');
    ganttInner.className = 'gantt-inner';
    
    // Create the blocks container
    const blocksContainer = document.createElement('div');
    blocksContainer.className = 'gantt-blocks';
    
    timeline.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = `gantt-block c-${item.colorIndex}`;
        const widthPercent = (item.duration / finalTime) * 100;
        el.style.width = `${widthPercent}%`;
        el.style.left = `${(item.start / finalTime) * 100}%`;
        el.style.position = 'absolute'; // Use absolute positioning for accuracy
        
        // Tooltip
        el.setAttribute('data-tooltip', `Duration: ${item.duration}`);
        
        // Block content with process ID and duration
        el.innerHTML = `
            <span class="gantt-pid">P${item.process}</span>
            <span class="gantt-duration">${item.duration}u</span>
        `;
        
        blocksContainer.appendChild(el);
    });
    
    ganttInner.appendChild(blocksContainer);
    
    // Create detailed time markers row
    const timeMarkers = document.createElement('div');
    timeMarkers.className = 'gantt-time-markers';
    
    timeline.forEach((item, index) => {
        const markerGroup = document.createElement('div');
        markerGroup.className = 'gantt-marker-group';
        const widthPercent = (item.duration / finalTime) * 100;
        markerGroup.style.width = `${widthPercent}%`;
        
        const startMarker = document.createElement('span');
        startMarker.className = 'gantt-marker-start';
        startMarker.textContent = item.start;
        markerGroup.appendChild(startMarker);
        
        // Show end marker on last block
        if (index === timeline.length - 1) {
            const endMarker = document.createElement('span');
            endMarker.className = 'gantt-marker-end';
            endMarker.textContent = item.start + item.duration;
            markerGroup.appendChild(endMarker);
        }
        
        timeMarkers.appendChild(markerGroup);
    });
    
    ganttInner.appendChild(timeMarkers);
    
    // Create time ruler with every unit
    const ruler = document.createElement('div');
    ruler.className = 'gantt-ruler';
    
    // Always show every unit for clarity (up to 30), then switch to every 2 units
    let tickInterval = 1;
    if (finalTime > 50) tickInterval = 5;
    else if (finalTime > 30) tickInterval = 2;
    
    for (let t = 0; t <= finalTime; t += tickInterval) {
        const tick = document.createElement('div');
        tick.className = 'gantt-tick';
        tick.style.left = `${(t / finalTime) * 100}%`;
        
        const tickLabel = document.createElement('span');
        tickLabel.className = 'gantt-tick-label';
        tickLabel.textContent = t;
        tick.appendChild(tickLabel);
        
        ruler.appendChild(tick);
    }
    
    ganttInner.appendChild(ruler);
    els.ganttChart.appendChild(ganttInner);
    
    // Update Animation State
    animState.totalBlocks = timeline.length;
    animState.currentIndex = timeline.length;
}

function renderResultsTable(procs) {
    els.resultsBody.innerHTML = '';
    const sorted = [...procs].sort((a,b) => a.id - b.id);
    
    sorted.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>P${p.id}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>${p.startTime}</td>
            <td>${p.completionTime}</td>
            <td><strong style="color:var(--accent)">${p.waitingTime}</strong></td>
            <td>${p.turnaroundTime}</td>
            <td>${p.responseTime}</td>
        `;
        els.resultsBody.appendChild(tr);
    });
}

function resetResults() {
    els.welcomeMessage.classList.remove('hidden');
    els.resultsArea.classList.add('hidden');
    lastResults = null;
}

// Start
init();

// Comparison Logic
function compareAlgorithms() {
    if (processes.length === 0) {
        alert('Add some processes first!');
        return;
    }

    const quantum = parseInt(els.quantum.value) || 2;
    const algos = [
        { id: 'fcfs', name: 'First Come First Serve', func: window.Algorithm.fcfs },
        { id: 'sjf', name: 'Shortest Job First', func: window.Algorithm.sjf },
        { id: 'srt', name: 'Shortest Remaining Time', func: window.Algorithm.srt },
        { id: 'rr', name: 'Round Robin (Q=' + quantum + ')', func: (p) => window.Algorithm.rr(p, quantum) },
        { id: 'mlfq', name: 'Multi-Level Feedback Queue', func: window.Algorithm.mlfq }
    ];

    const results = algos.map(algo => {
        // Deep copy processes to avoid mutation issues between runs if any reside in objects
        const procCopy = JSON.parse(JSON.stringify(processes));
        const res = algo.func(procCopy);
        
        const totalWait = res.processes.reduce((sum, p) => sum + p.waitingTime, 0);
        const totalTurn = res.processes.reduce((sum, p) => sum + p.turnaroundTime, 0);
        const count = res.processes.length;

        return {
            name: algo.name,
            avgWait: (totalWait / count).toFixed(2),
            avgTurn: (totalTurn / count).toFixed(2)
        };
    });

    renderComparison(results);
    openComparisonModal();
}

function renderComparison(results) {
    els.comparisonGrid.innerHTML = '';
    
    // Find winner (lowest avg wait time)
    let minWait = Infinity;
    let winnerIndex = -1;
    
    results.forEach((r, i) => {
        const wait = parseFloat(r.avgWait);
        if (wait < minWait) {
            minWait = wait;
            winnerIndex = i;
        }
    });

    results.forEach((r, i) => {
        const isWinner = i === winnerIndex;
        const card = document.createElement('div');
        card.className = `algo-card ${isWinner ? 'winner' : ''}`;
        
        card.innerHTML = `
            <div class="algo-name">${r.name}</div>
            <div class="algo-metric">
                <span>Avg Waiting Time:</span>
                <span class="algo-value">${r.avgWait}</span>
            </div>
            <div class="algo-metric">
                <span>Avg Turnaround:</span>
                <span class="algo-value">${r.avgTurn}</span>
            </div>
        `;
        els.comparisonGrid.appendChild(card);
    });

    const winner = results[winnerIndex];
    els.comparisonSummary.innerHTML = `
        <h4>🏆 Recommendation</h4>
        <p>Based on the current workload, <strong>${winner.name}</strong> is the most efficient algorithm with the lowest average waiting time of <strong>${winner.avgWait}</strong> units.</p>
    `;
}

function openComparisonModal() {
    els.comparisonModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeComparisonModal() {
    els.comparisonModal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Animation System
function resetAnimation() {
    stopAnimation();
    const blocks = document.querySelectorAll('.gantt-block');
    blocks.forEach(b => b.classList.add('anim-hidden'));
    
    const markers = document.querySelectorAll('.gantt-marker-group');
    markers.forEach(m => m.style.opacity = '0');
    
    animState.currentIndex = 0;
    animState.totalBlocks = blocks.length;
}

function stopAnimation() {
    if (animState.timer) clearInterval(animState.timer);
    animState.timer = null;
    animState.isPlaying = false;
    updateAnimationUI();
}

function toggleAnimation() {
    if (animState.isPlaying) {
        stopAnimation();
    } else {
        const blocks = document.querySelectorAll('.gantt-block');
        // If we are at the end, reset first
        if (animState.currentIndex >= blocks.length) {
            resetAnimation();
        }
        
        animState.isPlaying = true;
        updateAnimationUI();
        
        animState.timer = setInterval(() => {
            const finished = stepAnimation();
            if (finished) stopAnimation();
        }, 500); // 500ms per step
    }
}

function stepAnimation() {
    const blocks = document.querySelectorAll('.gantt-block');
    const markers = document.querySelectorAll('.gantt-marker-group');
    
    // If getting started and no blocks are hidden, it implies we need to reset first
    // Check if at least one block is visible? No, assume state is correct.
    // Actually, if user clicks Step on a full chart, we should properly reset.
    // But for now let's assume user hits Reset first or we handle start.
    
    if (animState.currentIndex >= blocks.length) return true; // Finished
    
    const block = blocks[animState.currentIndex];
    if (block) block.classList.remove('anim-hidden');
    
    const marker = markers[animState.currentIndex];
    if (marker) marker.style.opacity = '1';
    
    animState.currentIndex++;
    
    return animState.currentIndex >= blocks.length;
}

function updateAnimationUI() {
    if (animState.isPlaying) {
        els.animPlayBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
    } else {
        els.animPlayBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    }
}
