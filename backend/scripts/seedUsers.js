const bcrypt = require('bcryptjs');
const db = require('../src/db/db');

const seedUsers = async () => {
    const users = db.getUsers();

    const email = 'ti@tarikul.dev';
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        console.log(`User ${email} already exists.`);
        return;
    }

    const password = 'password123'; // Default password
    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = {
        id: 1, // Simple ID since it's the first user
        name: 'TARIKUL ISLAM',
        email: email,
        password: hashedPassword,
        role: 'product_manager'
    };

    users.push(newUser);

    if (db.saveUsers(users)) {
        console.log(`User ${email} created successfully with password: ${password}`);
    } else {
        console.error('Failed to create user.');
    }
};

seedUsers();
