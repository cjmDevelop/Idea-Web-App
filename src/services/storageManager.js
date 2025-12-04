/**
 * Storage Manager handles note storage
 * localStorage for non-authenticated users 
 * API for authenticated users
 */

import {
    isAuthenticated,
    getNotes as apiGetNotes,
    createNote as apiCreateNote,
    updateNote as apiUpdateNote,
    deleteNote as apiDeleteNote
} from './api.js';


// ============================ LOCAL STORAGE (GUEST MODE) ===================================
const LOCAL_STORAGE_KEY = 'guest_notes';
const MAX_GUEST_NOTES = 5; // Guest users limited to 5 notes

/**
 * Get notes from localStorage for non authenticated users.
 */
const getLocalNotes = () => {
    try {
        const notesStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        return notesStr ? JSON.parse(notesStr) : [];
    } catch(error) {
        console.error("Error reading local notes:", error);
        return [];
    }
};


/**
 * Save notes to localStorage
 */
const saveLocalNotes = (notes) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
        console.error("Error saving local notes:", error);
    }
}

/**
 * Create a local note in guest mode
 * Guest user will be limited to 5 notes, encouraging guest to sign-up for unlimited
 */
const createLocalNote = (content) => {
    const notes = getLocalNotes();

    //check if guest limit is reached
    if(notes.length >= MAX_GUEST_NOTES) {
        throw new Error(`GUEST_LIMIT_REACHED:Guest users can only save ${MAX_GUEST_NOTES} notes. Sign up for unlimited notes!`)
    }

    const newNote = {
        id : Date.now(), // ID for local storage
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    notes.push(newNote);
    saveLocalNotes(notes);
    return newNote;
}

/**
 * Update a local note
 */
const updateLocalNote = (id, content) => {
    const notes = getLocalNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    if(noteIndex === -1) {
        throw new Error('Note not found');
    }
    notes[noteIndex] = {
        ...notes[noteIndex],
        content,
        updatedAt: new Date().toISOString(),
    };

    saveLocalNotes(notes);
    return notes[noteIndex];
}

/**
 * Delete a local note
 */
const deleteLocalNote = (id) => {
    const notes = getLocalNotes();
    const filteredNotes = notes.filter(note => note.id !== id); //creating new array and filtering out the deleted note by note-id.
    saveLocalNotes(filteredNotes);
}


// ================ Unified Storage Interface ==============================

/**
 * Get all notes from API if authenticated, or from localStorage if not authenticated.
 */
export const getAllNotes = async () => {
    if(isAuthenticated()) {
        try {
            return await apiGetNotes();
        } catch(error) {
            console.error("Error fetching notes from API:", error);
            throw error;
        }
    } else {
        return getLocalNotes(); 
    }
};

/**
 * Create a note if Authenticated, localStorage if not authenticated
 */
export const createNote = async (content) => {
    if(isAuthenticated()) {
        try {
            return await apiCreateNote(content);
        } catch(error) {
            console.error("Error creating note via API:", error);
            throw error;
        }
    } else {
        return createLocalNote(content);
    }
}


/**
 * Update a note by API if authenticated or by localstorage if not a registered user
 */
export const updateNote = async (id, content) => {
    if(isAuthenticated()) {
        try{
            return await apiUpdateNote(id, content);
        } catch(error) {
            console.error("Error updating note via API:", error);
            throw error;
        }
    } else {
        return updateLocalNote(id, content);
    }
}


/**
 * Delete a note by API if registered, localstorage if a guest user
 */
export const deleteNote = async (id) => {
    if(isAuthenticated()) {
        try {
            await apiDeleteNote(id);
        } catch(error) {
            console.error("Error deleting note via API:", error);
            throw error;
        }
    } else {
        deleteLocalNote(id);
    }
}


/**
 * Migrate local notes to backend after user registers an account, 
 * this will allow users to keep their guest notes after signing up.
 */
export const migrateLocalNotesToBackend = async () => {
    const localNotes = getLocalNotes();

    if(localNotes.length === 0) {
        return { migrated: 0, errors: [] };
    }

    const results = {
        migrated: 0,
        errors: [],
    };

    for(const note of localNotes) {
        try {
            await apiCreateNote(note.content);
            results.migrated++;
        } catch(error) {
            console.error("Error migrating note:", error);
            results.errors.push({note, error: error.message})
        }
    }

    //Clearing local notes after successful migration
    if(results.migrated > 0 && results.errors.length === 0) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    return results;
};

/**
 * Clear all local notes when switching to authenticated user mode
 */
export const clearLocalNotes = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

/**
 * Get the maximum number of notes allowed fot guest users
 */
export const getMaxGuestNotes = () => {
    return MAX_GUEST_NOTES;
}

/**
 * Get current guest note count
 */
export const getGuestNoteCount = () => {
    return getLocalNotes().length;
};

export { MAX_GUEST_NOTES };