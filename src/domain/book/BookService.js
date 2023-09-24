const BookRepository = require('./BookRepository');
const db = require("../../models");
const { Sequelize } = require('sequelize');

const Book = db.book;
const Member = db.member;
const Peminjam = db.peminjaman;

class BookService {
  async pinjamBuku(memberCode, bookCode, dateNow = new Date()) {
    try {
      const pinjam = await BookRepository.pinjamBuku(memberCode, bookCode, dateNow);
      if(pinjam) {
        return pinjam
      }
    } catch (error) {
      throw error;
    }
  }

  async pengembalianBuku(memberCode, bookCode, dateReturn = new Date()) {
    try {
      const pengembalian = await BookRepository.pengembalianBuku(memberCode, bookCode, dateReturn);
      return pengembalian
    } catch (error) {
      throw error;
    }
  }

  async getAllBook() {
    try {
      const books = Book.findAll();
      return books;
    } catch (error) {
      throw error
    }
  }

  async getReadyBook() {
    try {
      const books = Book.findAll({ where: { stock: 1 } });
      return books;
    } catch (error) {
      throw error
    }
  }

  async countBookMember() {
    try {
      const result = await Peminjam.findAll({
        attributes: [
          'memberId', // Kolom yang akan dihitung
          [Sequelize.fn('COUNT', Sequelize.col('memberId')), 'count'] // Menggunakan COUNT untuk menghitung
        ],
        group: ['memberId'] // Mengelompokkan hasil berdasarkan memberId
      });
  
      const members = await Member.findAll();
      const datas = members.map(member => {
        const row = result.find(row => row.dataValues.memberId == member.dataValues.id);
        return {
          id: member.dataValues.id,
          code: member.dataValues.code,
          name: member.dataValues.name,
          book_borrowed: row ? row.dataValues.count : 0
        }
      });
  
      return datas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BookService();