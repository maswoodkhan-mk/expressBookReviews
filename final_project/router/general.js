const express = require('express');
const books = require('./booksdb.js');
const { users } = require('./auth_users.js');

const public_users = express.Router();

// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: 'User successfully registered'
    });
});

// Get all books
public_users.get('/', async (req, res) => {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to retrieve books' });
    }
});

// Get a book by its ISBN/key
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const book = books[req.params.isbn];

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to retrieve book' });
    }
});

// Search books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        const results = Object.entries(books)
            .filter(([, book]) => book.author.toLowerCase() === author)
            .map(([id, book]) => ({ id, ...book }));

        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to search by author' });
    }
});

// Search books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        const results = Object.entries(books)
            .filter(([, book]) => book.title.toLowerCase().includes(title))
            .map(([id, book]) => ({ id, ...book }));

        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to search by title' });
    }
});

// Get reviews for a book
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
