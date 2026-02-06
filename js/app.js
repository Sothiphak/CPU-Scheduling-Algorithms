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
    themeToggle: document.getElementById('themeToggle')
};

// Initialization
function init() {
    loadSampleData();
    setupEventListeners();
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

function loadSampleData() {
    processes = [
        { id: 1, arrival: 0, burst: 5 },
        { id: 2, arrival: 1, burst: 3 },
        { id: 3, arrival: 2, burst: 8 },
        { id: 4, arrival: 3, burst: 6 }
    ];
    nextId = 5;
    renderProcessList();
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
        
        // Block content with process ID and duration
        el.innerHTML = `
            <span class="gantt-pid">P${item.process}</span>
            <span class="gantt-duration">${item.duration}u</span>
        `;
        
        // Tooltip with detailed info
        el.setAttribute('data-tooltip', `Process ${item.process}\nStart: ${item.start}\nEnd: ${item.start + item.duration}\nDuration: ${item.duration}`);
        
        // Time markers
        const startMarker = document.createElement('span');
        startMarker.className = 'gantt-time-start';
        startMarker.textContent = item.start;
        el.appendChild(startMarker);
        
        // End marker for all blocks
        const endMarker = document.createElement('span');
        endMarker.className = 'gantt-time-end';
        endMarker.textContent = item.start + item.duration;
        el.appendChild(endMarker);
        
        blocksContainer.appendChild(el);
    });
    
    ganttInner.appendChild(blocksContainer);
    
    // Create time ruler
    const ruler = document.createElement('div');
    ruler.className = 'gantt-ruler';
    
    // Determine tick interval based on total time
    let tickInterval = 1;
    if (finalTime > 50) tickInterval = 10;
    else if (finalTime > 20) tickInterval = 5;
    else if (finalTime > 10) tickInterval = 2;
    
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
