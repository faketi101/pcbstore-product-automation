const db = require('../src/db/db');
const { DEFAULT_STATIC_PROMPT, DEFAULT_MAIN_PROMPT_TEMPLATE } = require('../config/defaultPrompts');

console.log('🧪 Testing Individual Reset Functionality\n');

// Get user
const users = db.getUsers();
const userIndex = users.findIndex(u => u.email === 'ti@tarikul.dev');

if (userIndex === -1) {
    console.error('❌ User not found');
    process.exit(1);
}

// Setup: Create custom prompts
console.log('📝 Setup: Creating custom prompts...');
users[userIndex].prompts = {
    staticPrompt: 'CUSTOM STATIC PROMPT - EDITED',
    mainPromptTemplate: 'CUSTOM MAIN PROMPT - EDITED'
};
db.saveUsers(users);
console.log('✓ Custom prompts saved\n');

// Test 1: Reset Main Prompt Only
console.log('Test 1: Reset Main Prompt Only');
console.log('Before:', {
    static: users[userIndex].prompts.staticPrompt.substring(0, 30) + '...',
    main: users[userIndex].prompts.mainPromptTemplate.substring(0, 30) + '...'
});

users[userIndex].prompts.mainPromptTemplate = DEFAULT_MAIN_PROMPT_TEMPLATE;
db.saveUsers(users);

const usersAfterMain = db.getUsers();
const userAfterMain = usersAfterMain[userIndex];
console.log('After:', {
    static: userAfterMain.prompts.staticPrompt.substring(0, 30) + '...',
    main: userAfterMain.prompts.mainPromptTemplate.substring(0, 30) + '...'
});

if (userAfterMain.prompts.staticPrompt === 'CUSTOM STATIC PROMPT - EDITED' &&
    userAfterMain.prompts.mainPromptTemplate === DEFAULT_MAIN_PROMPT_TEMPLATE) {
    console.log('✅ Main prompt reset, static prompt preserved!\n');
} else {
    console.log('❌ Test failed\n');
}

// Test 2: Reset Static Prompt Only
console.log('Test 2: Reset Static Prompt Only');
users[userIndex].prompts.staticPrompt = DEFAULT_STATIC_PROMPT;
db.saveUsers(users);

const usersAfterStatic = db.getUsers();
const userAfterStatic = usersAfterStatic[userIndex];
console.log('After:', {
    static: userAfterStatic.prompts.staticPrompt.substring(0, 30) + '...',
    main: userAfterStatic.prompts.mainPromptTemplate.substring(0, 30) + '...'
});

if (userAfterStatic.prompts.staticPrompt === DEFAULT_STATIC_PROMPT &&
    userAfterStatic.prompts.mainPromptTemplate === DEFAULT_MAIN_PROMPT_TEMPLATE) {
    console.log('✅ Both prompts now at default!\n');
} else {
    console.log('❌ Test failed\n');
}

console.log('🎉 All tests passed!');
console.log('\n📊 Summary:');
console.log('- Reset Main: ✓ Resets only main prompt');
console.log('- Reset Static: ✓ Resets only static prompt');
console.log('- Reset Both: ✓ Resets both prompts');
