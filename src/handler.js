const { nanoid } = require('nanoid');
const books = require('./books');

// Add Book Hanlder
const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const id = nanoid(16);
    const finished = readPage === pageCount;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // validate input
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h
            .response({
                status: 'fail',
                message:
                    'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
    }

    // Fill Data
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    // Store Data
    books.push(newBook);

    // check data
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    // Response if success
    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
    }

    // Response if fail
    return h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    }).code(500);
};

const getAllBookHandler = (request, h) => {
    // Get Query
    const { name, reading, finished } = request.query;

    if (name === undefined && reading === undefined && finished === undefined) {
        return h
            .response({
                status: 'success',
                data: {
                    books: books.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            })
            .code(200);
    }

    // Filter
    let filteredBooks = books;

    if (name !== undefined) {
        filteredBooks = filteredBooks.filter(
            (book) => book.name.toLowerCase().includes(name.toLowerCase()),
        );
    }

    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter(
            (book) => Number(book.reading) === Number(reading),
        );
    }

    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter(
            (book) => Number(book.finished) === Number(finished),
        );
    }

    if (filteredBooks.length === 0) {
        return h
            .response({
                status: 'fail',
                message: 'Buku tidak ditemukan',
            })
            .code(404);
    }

    return h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
};

// Get Book By Id
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        return h.response({
            status: 'success',
            data: {
                book,
            },
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
};

// Update Book
const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if (!name) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            })
            .code(400);
    }

    if (readPage > pageCount) {
        return h
            .response({
                status: 'fail',
                message:
                    'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
    }

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
    };

    return h
        .response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        })
        .code(200);
};

// Delete Book
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        return h
            .response({
                status: 'success',
                message: 'Buku berhasil dihapus',
            })
            .code(200);
    }

    return h
        .response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
};

module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler,
};
