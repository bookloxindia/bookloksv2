// State Management
let currentSubject = '';
let currentChapterData = null;
let currentScore = 0;

// Utility: Navigate between screens
function navigate(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.remove('hidden');
    document.getElementById(screenId).classList.add('active');
    
    // Play BG music on first interaction
    const bgMusic = document.getElementById('bg-music');
    if(bgMusic.paused) {
        bgMusic.volume = 0.05; // 5% volume for mobile as requested
        bgMusic.play().catch(e => console.log("Audio play blocked until interaction"));
    }
}

// Load Subjects
const subjects = [
    { id: 'maths', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'hindi', name: 'Hindi' },
    { id: 'computer', name: 'Computer / IT' }
];

function initSubjects() {
    const container = document.getElementById('subject-list');
    container.innerHTML = '';
    subjects.forEach(sub => {
        const btn = document.createElement('button');
        btn.className = 'subject-card';
        btn.innerText = sub.name;
        btn.onclick = () => loadChapters(sub.id, sub.name);
        container.appendChild(btn);
    });
}

// Fetch Chapter JSON dynamically
async function loadChapters(subjectId, subjectName) {
    currentSubject = subjectId;
    document.getElementById('current-subject-title').innerText = subjectName;
    
    try {
        // Example: Fetching computer chapter 1 JSON based on provided data structure
        const response = await fetch(`data/${subjectId}/ch01.json`); 
        const data = await response.json();
        
        const container = document.getElementById('chapter-list');
        container.innerHTML = `
            <div class="chapter-card">
                <h3>Chapter 1: ${data.chapter_title || 'Introduction'}</h3>
                <p>${data.chapter_summary || 'Learn the basics'}</p>
                <button class="btn-primary" onclick="startQuickCheck()">PLAY MISSION</button>
            </div>
        `;
        navigate('screen-chapters');
    } catch (error) {
        console.error("Error loading chapter data:", error);
        // Fallback UI for testing without server
        document.getElementById('chapter-list').innerHTML = `
            <div class="chapter-card">
                <h3>Chapter 1: Sample Chapter</h3>
                <p>Simple explanation of the chapter.</p>
                <button class="btn-primary" onclick="startQuickCheck()">PLAY MISSION</button>
            </div>
        `;
        navigate('screen-chapters');
    }
}

function startQuickCheck() {
    navigate('screen-quick-check');
    // Logic to render 6 cards (3 correct, 3 wrong) goes here
    // After 3 correct clicks -> show explanation -> Start Mission
}

function finishQuiz(score) {
    currentScore = score;
    navigate('screen-reward');
    
    if(score >= 4) {
        document.getElementById('reward-title').innerText = "TREASURE FOUND!";
        document.getElementById('success-sound').play();
        if(navigator.vibrate) navigator.vibrate([100, 50, 100]); // Celebration vibration
    } else {
        document.getElementById('reward-title').innerText = "NICE TRY!";
        document.getElementById('fail-sound').play();
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initSubjects();
});
