import { login, getNotes, createNote } from './services/api.js';

/**
 * Test script to verify backend connection
 * Run this file to make sure API calls work
 */
async function testConnection() {
    console.log('Starting API Test...\n')

    try{
        console.log('Test 1: Login');
        console.log('Calling: POST /api/auth/login');

        const loginData = await login('jr87.dev+note@gmail.com', 'SecurePass123!');

        console.log('✅ Login successful!');
        console.log('User:', loginData.user);
        console.log('Token:', loginData.accessToken.substring(0, 20) + '...\n');

        const token = loginData.accessToken;

        //Test 2: Get Notes
        console.log('Test 2: Get Notes');
        console.log('Calling: GET /api/notes');

        const notes = await getNotes(token);

        console.log('✅ Notes fetched!')
        console.log(`Found ${notes.length} note(s):`);
        notes.forEach(note => {
            console.log(`- ID ${note.id}: "${note.content.substring(0, 50)}..."`);
        });
        console.log('');

        
        //Test 3: Create Note 
        console.log('Test 3: Create Note');
        console.log('Calling: POST /api/notes');

        const newNote = await createNote(token, 'Test note from frontend!⚡️');

        console.log('💡 Note Created')
        console.log('New note ID:', newNote.id)
        console.log('Content:', newNote.content)
        console.log('Created at:', newNote.createdAt);

        console.log('\n⚡️💡 ALL TESTS PASSED! Backend connection works!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
    }
}

testConnection();

//I tried it but got 404 not found
//Uncaught in promise type error: failed to fetch dynamically imported module http://localhost:3000/test-connection.js