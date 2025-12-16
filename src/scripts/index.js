import { 
  loginUser, 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote,
  initAuth,
  isLoggedIn,
  getCurrentUser,
  logout
} from "../services/api.js";

// ==================== INITIALIZE AUTH ====================

initAuth();

// ==================== DOM ELEMENTS ====================

// Store notes as objects with ID for easier lookup
const notesMap = new Map(); // Map<noteId, {content, index}>
const idea = document.getElementById("idea");
const ideasAsLights = document.getElementById("ideas-as-lights");
const form = document.querySelector("form");
const ideasEnteredNumber = document.getElementById("ideas-entered");
const incrementButton = document.getElementById("increment-btn");
const saveButton = document.getElementById("save-btn");
const resetButton = document.getElementById("reset-btn");
const trashButton = document.getElementById("trash-btn");
const loadingOverlay = document.getElementById("loading-overlay");
const loadingText = loadingOverlay ? loadingOverlay.querySelector('.loading-text') : null;

let currentNoteId = null;

// ==================== LOADING SPINNER ====================

function showLoading(message = 'Loading...') {
  if (loadingOverlay && loadingText) {
    loadingText.textContent = message;
    loadingOverlay.classList.add('show');
  }
}

function hideLoading() {
  if (loadingOverlay) {
    loadingOverlay.classList.remove('show');
  }
}

const motivationalQuotes = [
  "It is better to light a candle than to curse the darkness. - William Lonsdale Watkinson",
  "Be less curious about people and more curious about ideas. - Marie Curie",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Write it. Shoot it. Publish it. Crochet it. Sauté it. Whatever. Make. - Joss Whedon",
  "You can't use up creativity. The more you use, the more you have. - Maya Angelou",
  "Ideas are like rabbits. You get a couple and learn how to handle them, and pretty soon you have a dozen. - John Steinbeck",
  "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The secret of getting ahead is getting started. - Mark Twain",
  "What you do today can improve all your tomorrows. - Ralph Marston",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Act as if what you do makes a difference. It does. - William James",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Everything you've ever wanted is on the other side of fear. - George Addair",
  "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine. - Roy T. Bennett",
  "I learned that courage was not the absence of fear, but the triumph over it. - Nelson Mandela",
  "Creativity is intelligence having fun. - Albert Einstein",
  "Imagination is more important than knowledge. - Albert Einstein",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Do what you can, with what you have, where you are. - Theodore Roosevelt",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
  "Whether you think you can or you think you can't, you're right. - Henry Ford",
  "The only impossible journey is the one you never begin. - Tony Robbins",
  "In the middle of difficulty lies opportunity. - Albert Einstein",
  "Don't limit yourself. Many people limit themselves to what they think they can do. - Mary Kay Ash",
  "Quality is not an act, it is a habit. - Aristotle",
  "The best revenge is massive success. - Frank Sinatra",
  "An unexamined life is not worth living. - Socrates",
  "We write to taste life twice, in the moment and in retrospect. - Anaïs Nin",
  "Writing is thinking. To write well is to think clearly. - David McCullough",
  "Ideas won't keep. Something must be done about them. - Alfred North Whitehead",
  "Fill your paper with the breathings of your heart. - William Wordsworth",
  "Start where you are. Use what you have. Do what you can. - Arthur Ashe",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Go confidently in the direction of your dreams. Live the life you have imagined. - Henry David Thoreau",
  "When you have a dream, you've got to grab it and never let go. - Carol Burnett",
  "Nothing is impossible. The word itself says 'I'm possible!' - Audrey Hepburn",
  "There is nothing impossible to they who will try. - Alexander the Great",
  "The bad news is time flies. The good news is you're the pilot. - Michael Altshuler",
  "Life has got all those twists and turns. You've got to hold on tight and off you go. - Nicole Kidman",
  "Keep your face always toward the sunshine, and shadows will fall behind you. - Walt Whitman",
  "Be yourself; everyone else is already taken. - Oscar Wilde",
  "In three words I can sum up everything I've learned about life: It goes on. - Robert Frost",
  "If you want to lift yourself up, lift up someone else. - Booker T. Washington",
  "I have not failed. I've just found 10,000 ways that won't work. - Thomas Edison",
  "A person who never made a mistake never tried anything new. - Albert Einstein",
  "The person who says it cannot be done should not interrupt the person who is doing it. - Chinese Proverb",
];

function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

function updatePlaceholder() {
  idea.placeholder = getRandomQuote();
}

function getRandomLight() {
  const lights = [
    { type: 'image', src: 'public/lightBulb-Icon.png' },
    { type: 'emoji', src: '⚡️' },
    { type: 'emoji', src: '💡' },
    { type: 'emoji', src: '🕯' },
    { type: 'emoji', src: '🔥' },
    { type: 'emoji', src: '✨' },
    { type: 'emoji', src: '🔦' },
    { type: 'emoji', src: '🎄' },
    { type: 'emoji', src: '☀️' },
    { type: 'emoji', src: '🌈' },
    { type: 'emoji', src: '🌟' },
  ];
  return lights[Math.floor(Math.random() * lights.length)];
}

function createLightElement(noteId, isGuest = false) {
  const light = getRandomLight();
  
  if (light.type === 'image') {
    const img = document.createElement('img');
    img.src = light.src;
    img.alt = 'Light representing idea';
    img.style.width = '30px';
    img.style.height = '30px';
    img.style.margin = '5px';
    img.style.cursor = 'pointer';
    img.style.display = 'inline-block';
    img.dataset.noteId = noteId;
    if (isGuest) img.dataset.isGuest = 'true';
    return img;
  } else {
    const div = document.createElement('div');
    div.textContent = light.src;
    div.style.fontSize = '30px';
    div.style.margin = '5px';
    div.style.cursor = 'pointer';
    div.style.display = 'inline-block';
    div.style.lineHeight = '30px';
    div.style.width = '30px';
    div.style.height = '30px';
    div.style.textAlign = 'center';
    div.dataset.noteId = noteId;
    if (isGuest) div.dataset.isGuest = 'true';
    
    div.addEventListener('mouseenter', () => {
      div.style.transform = 'scale(1.3)';
      div.style.filter = 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))';
    });
    div.addEventListener('mouseleave', () => {
      div.style.transform = 'scale(1)';
      div.style.filter = 'none';
    });
    
    return div;
  }
}

// ==================== GUEST MODE ====================

let guestNotes = [];
let guestNoteIdCounter = 1;

function createGuestNote(content) {
  const newNote = {
    id: guestNoteIdCounter++,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  guestNotes.push(newNote);
  console.log('📝 Guest note created (temporary):', newNote);
  return newNote;
}

function updateGuestNote(id, content) {
  const noteIndex = guestNotes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) {
    throw new Error('Note not found');
  }
  
  guestNotes[noteIndex] = {
    ...guestNotes[noteIndex],
    content,
    updatedAt: new Date().toISOString(),
  };
  
  console.log('📝 Guest note updated (temporary):', guestNotes[noteIndex]);
  return guestNotes[noteIndex];
}

function deleteGuestNote(id) {
  const noteIndex = guestNotes.findIndex(note => note.id === id);
  if (noteIndex !== -1) {
    guestNotes.splice(noteIndex, 1);
    console.log('🗑 Guest note deleted (temporary)');
  }
}

// ==================== AUTH UI ====================

function updateAuthUI() {
  const userStatus = document.getElementById('user-status');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const settingsLink = document.getElementById('settings-link');
  const logoutBtn = document.getElementById('logout-btn');
  
  if (isLoggedIn()) {
    const user = getCurrentUser();
    
    let displayName;
    if (user?.firstName && user?.lastName) {
      displayName = `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      displayName = user.firstName;
    } else {
      displayName = user?.email || 'User';
    }
    
    userStatus.textContent = `Hi ${displayName}`;
    userStatus.classList.add('logged-in');
    
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (settingsLink) settingsLink.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  } else {
    userStatus.textContent = 'Guest Mode - Notes are temporary! Sign up to keep them forever';
    userStatus.classList.remove('logged-in');
    
    if (loginLink) loginLink.style.display = 'inline-block';
    if (registerLink) registerLink.style.display = 'inline-block';
    if (settingsLink) settingsLink.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

// ==================== BUTTON VISIBILITY ====================

function resetText() {
  idea.value = "";
  showIncrementButtonOnly();
}

function showSaveResetAndTrashButtons() {
  incrementButton.style.display = "none";
  saveButton.style.display = "block";
  resetButton.style.display = "block";
  trashButton.style.display = "block";
}

function showIncrementButtonOnly() {
  incrementButton.style.display = "block";
  saveButton.style.display = "none";
  resetButton.style.display = "none";
  trashButton.style.display = "none";
}

// ==================== UPDATE COUNT ====================

function updateNotesCount() {
  ideasEnteredNumber.textContent = notesMap.size;
}

function getNotePosition(noteId) {
  let position = 1;
  for (let [id] of notesMap) {
    if (id === noteId) {
      return position;
    }
    position++;
  }
  return 0;
}

// ==================== CREATE NOTE ====================

async function increment() {
  const content = idea.value.trim();

  if (!content) {
    alert('Please write something first!');
    return;
  }

  if (!isLoggedIn()) {
    // GUEST MODE
    try {
      console.log("💾 Saving to memory (Guest Mode - TEMPORARY)...");
      const newNote = createGuestNote(content);
      console.log("⚠️ Note is temporary! Will be lost on refresh.");

      // Store in map
      notesMap.set(newNote.id, { content: newNote.content, id: newNote.id });

      const lightBulb = createLightElement(newNote.id, true);
      const anchorIdea = document.createElement("a");
      anchorIdea.href = "#";
      anchorIdea.appendChild(lightBulb);
      anchorIdea.dataset.noteId = newNote.id;

      anchorIdea.addEventListener("click", (e) => {
        e.preventDefault();
        const noteData = notesMap.get(newNote.id);
        if (noteData) {
          idea.value = noteData.content;
          ideasEnteredNumber.textContent = getNotePosition(newNote.id);
          currentNoteId = newNote.id;
          showSaveResetAndTrashButtons();
        }
      });

      form.style.background = "orange";
      setTimeout(() => {
        form.style.background = "#111";
      }, 10);

      ideasAsLights.append(anchorIdea);
      updateNotesCount();
      idea.value = "";
      updatePlaceholder();
    } catch (error) {
      console.error('❌ Error saving guest note:', error);
    }
    return;
  }

  // AUTHENTICATED MODE
  try {
    console.log("💾 Saving to backend (PERMANENT)...");
    showLoading('Saving note...');
    const newNote = await createNote(content);
    hideLoading();
    console.log("✅ Saved permanently! Note ID:", newNote.id);

    // Store in map
    notesMap.set(newNote.id, { content: newNote.content, id: newNote.id });

    const lightBulb = createLightElement(newNote.id, false);
    const anchorIdea = document.createElement("a");
    anchorIdea.href = "#";
    anchorIdea.appendChild(lightBulb);
    anchorIdea.dataset.noteId = newNote.id;

    anchorIdea.addEventListener("click", (e) => {
      e.preventDefault();
      const noteData = notesMap.get(newNote.id);
      if (noteData) {
        idea.value = noteData.content;
        ideasEnteredNumber.textContent = getNotePosition(newNote.id);
        currentNoteId = newNote.id;
        showSaveResetAndTrashButtons();
      }
    });

    form.style.background = "blue";
    setTimeout(() => {
      form.style.background = "#111";
    }, 10);

    ideasAsLights.append(anchorIdea);
    updateNotesCount();
    idea.value = "";
    updatePlaceholder();
  } catch (error) {
    hideLoading();
    console.error('❌ Error saving note:', error);
    console.error('Error details:', error.message);

    if (error.message.includes('Please login')) {
      alert('Session expired. Please login again.');
      window.location.href = 'login.html';
    } else {
      alert('Failed to save note! Please check console for details.');
    }
  }
}

// ==================== UPDATE NOTE ====================

function clearIdeasNumberTemporarily() {
  return ideasEnteredNumber.textContent = "";
}

async function saveMeansUpdate() {
  const content = idea.value.trim();

  if (currentNoteId === null) {
    alert('No note selected to update!');
    return;
  }

  if (!isLoggedIn()) {
    // GUEST MODE
    try {
      console.log('📝 Updating guest note ID:', currentNoteId);
      updateGuestNote(currentNoteId, content);
      
      // Update in map
      if (notesMap.has(currentNoteId)) {
        notesMap.set(currentNoteId, { 
          content: content, 
          id: currentNoteId 
        });
      }
      
      console.log('✅ Guest note updated (temporary)!');

      resetText();
      clearIdeasNumberTemporarily();
      currentNoteId = null;

      alert('Note updated (temporary)! 💾');
    } catch (error) {
      console.error('❌ Error updating guest note:', error);
      alert('Failed to update note!');
    }
    return;
  }

  // AUTHENTICATED MODE
  try {
    console.log('📝 Updating note ID:', currentNoteId);
    showLoading('Updating note...');
    await updateNote(currentNoteId, content);
    hideLoading();

    // Update in map
    if (notesMap.has(currentNoteId)) {
      notesMap.set(currentNoteId, {
        content: content,
        id: currentNoteId
      });
    }

    console.log('✅ Note updated permanently!');

    resetText();
    clearIdeasNumberTemporarily();
    currentNoteId = null;

    alert('Note updated successfully! 💾');
  } catch (error) {
    hideLoading();
    console.error('❌ Error updating note:', error);

    if (error.message.includes('Please login')) {
      alert('Session expired. Please login again.');
      window.location.href = 'login.html';
    } else {
      alert('Failed to update note! ' + error.message);
    }
  }
}

// ==================== RESET ====================

function resetMeansStartOver() {
  idea.value = "";
  ideasEnteredNumber.textContent = "";
  showIncrementButtonOnly();
  currentNoteId = null;
}

// ==================== DELETE NOTE ====================

async function trashMeansDelete() {
  if (currentNoteId === null) {
    alert('No note selected to delete!');
    return;
  }

  const confirmDelete = confirm('Delete this idea forever? This cannot be undone! ⚠️');
  if (!confirmDelete) {
    return;
  }

  if (!isLoggedIn()) {
    // GUEST MODE
    try {
      console.log('🗑 Deleting guest note ID:', currentNoteId);
      deleteGuestNote(currentNoteId);
      
      // Remove from map
      notesMap.delete(currentNoteId);
      
      console.log('✅ Guest note deleted!');

      // Remove lightbulb from UI
      const lightbulbs = ideasAsLights.querySelectorAll('a');
      lightbulbs.forEach(anchor => {
        if (parseInt(anchor.dataset.noteId) === currentNoteId) {
          anchor.remove();
        }
      });

      idea.value = "";
      ideasEnteredNumber.textContent = "";
      showIncrementButtonOnly();
      updateNotesCount();
      currentNoteId = null;

      alert('Note deleted! 🗑');
    } catch (error) {
      console.error('❌ Error deleting guest note:', error);
      alert('Failed to delete note!');
    }
    return;
  }

  // AUTHENTICATED MODE
  try {
    console.log('🗑 Deleting note ID:', currentNoteId);
    showLoading('Deleting note...');
    await deleteNote(currentNoteId);
    hideLoading();

    // Remove from map
    notesMap.delete(currentNoteId);

    console.log('✅ Note deleted from backend!');

    // Remove lightbulb from UI
    const lightbulbs = ideasAsLights.querySelectorAll('a');
    lightbulbs.forEach(anchor => {
      if (parseInt(anchor.dataset.noteId) === currentNoteId) {
        anchor.remove();
      }
    });

    idea.value = "";
    ideasEnteredNumber.textContent = "";
    showIncrementButtonOnly();
    updateNotesCount();
    currentNoteId = null;

    alert('Note deleted! 🗑');
  } catch (error) {
    hideLoading();
    console.error('❌ Error deleting note:', error);

    if (error.message.includes('Please login')) {
      alert('Session expired. Please login again.');
      window.location.href = 'login.html';
    } else {
      alert('Failed to delete note! ' + error.message);
    }
  }
}

// ==================== LOAD NOTES ON PAGE LOAD ====================

window.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing app...');

  // Check if user had a token that expired
  const hadToken = localStorage.getItem('accessToken');
  const isExpired = !isLoggedIn(); // This will auto-logout if expired

  if (hadToken && isExpired) {
    alert('Your session has expired. Please log in again.');
  }

  updatePlaceholder();
  updateAuthUI();
  
  // Setup logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        logout();
        location.reload();
      }
    });
  }
  
  // PREVENT FORM SUBMISSION
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submit prevented');
  });

  // SETUP BUTTON CLICK HANDLERS
  incrementButton.addEventListener('click', async (e) => {
    e.preventDefault();
    await increment();
  });

  saveButton.addEventListener('click', async (e) => {
    e.preventDefault();
    await saveMeansUpdate();
  });

  resetButton.addEventListener('click', (e) => {
    e.preventDefault();
    resetMeansStartOver();
  });

  trashButton.addEventListener('click', async (e) => {
    e.preventDefault();
    await trashMeansDelete();
  });
  
  if (!isLoggedIn()) {
    console.log('👻 Guest mode - no saved notes (temporary session)');
    console.log('⚠️ Guest notes will be lost on refresh!');
    return;
  }
  
  // AUTHENTICATED MODE - Load from backend
  console.log('⏳ Loading notes from backend...');
  showLoading('Loading your notes...');
  try {
    const notes = await getNotes();
    console.log(`✅ Loaded ${notes.length} notes from backend!`);

    notes.forEach((note) => {
      // Store in map
      notesMap.set(note.id, { content: note.content, id: note.id });

      const lightBulb = createLightElement(note.id, false);

      const anchorIdea = document.createElement("a");
      anchorIdea.href = "#";
      anchorIdea.appendChild(lightBulb);
      anchorIdea.dataset.noteId = note.id;

      anchorIdea.addEventListener("click", (e) => {
        e.preventDefault();
        const noteData = notesMap.get(note.id);
        if (noteData) {
          idea.value = noteData.content;
          ideasEnteredNumber.textContent = getNotePosition(note.id);
          currentNoteId = note.id;
          showSaveResetAndTrashButtons();
        }
      });

      ideasAsLights.appendChild(anchorIdea);
    });

    updateNotesCount();
    hideLoading();

  } catch (error) {
    hideLoading();
    console.error('❌ Error loading notes:', error);

    if (error.message.includes('Please login')) {
      alert('Session expired. Please login again.');
      window.location.href = 'login.html';
    }
  }
});

// ==================== NEON EFFECTS ====================

const neonColors = [
  '#00d9ff', '#ffffff', '#39ff14', '#ff006e', '#bd00ff', 
  '#ff3131', '#ff9500', '#ffff00', '#00fff0', '#ff1493'
];

const userStatus = document.getElementById('user-status');
if (userStatus) {
  userStatus.addEventListener('mouseenter', () => {
    const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)];
    userStatus.style.color = randomColor;
  });
  
  userStatus.addEventListener('mouseleave', () => {
    userStatus.style.color = '';
  });
}

function initializeNeonSign() {
  const neonSignText = document.getElementById('neon-sign-text');
  
  if (!neonSignText) return;
  
  const text = neonSignText.textContent;
  neonSignText.innerHTML = '';
  
  text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.className = 'letter';
    span.style.setProperty('--delay', Math.random() * 10);
    neonSignText.appendChild(span);
  });
}

// Initialize neon sign
initializeNeonSign();