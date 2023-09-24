const BookService = require('../domain/book/BookService');

exports.pinjamBuku = async (req, res) => {
    try {
        const pinjam = await BookService.pinjamBuku(req.body.member_code, req.body.book_code, req.body.date_now);
        if(pinjam) {
            return res.json({
                message: "sukses meminjam buku"
            })
        }
        return res.json({
            message: "member masih dalam penalty"
        })
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat peminjaman buku', error: error.message });
    }
};

exports.pengembalianBuku = async (req, res) => {
    try {
        const pengembalian = await BookService.pengembalianBuku(req.body.member_code, req.body.book_code, req.body.date_return);
        if(pengembalian) {
            res.json({
                message: "sukses mengembalikan buku"
            })
        }
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengembalikan pinjaman buku', error: error.message });
    }
};

exports.getAllBook = async (req, res) => {
    try {
        const books = await BookService.getAllBook();
        if(books) {
            res.json({
                message: "sukses mendapatkan book",
                data: books
            })
        }
    } catch (error) {
        res.status(500).json({ message: 'Gagal mendapatkan books', error: error.message });
    }
};

exports.getReadyBook = async (req, res) => {
    try {
        const books = await BookService.getReadyBook();
        if(books) {
            res.json({
                message: "sukses mendapatkan book",
                data: books
            })
        }
    } catch (error) {
        res.status(500).json({ message: 'Gagal mendapatkan books', error: error.message });
    }
};

exports.countBookMember = async (req, res) => {
    try {
        const member = await BookService.countBookMember();
        if(member) {
            res.json({
                message: "sukses mendapatkan jumlah peminjam",
                data: member
            })
        }
    } catch (error) {
        res.status(500).json({ message: 'Gagal mendapatkan jumlah peminjam', error: error.message });
    }
};