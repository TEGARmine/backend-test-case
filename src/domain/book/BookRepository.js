const db = require("../../models");

const Book = db.book;
const Member = db.member;
const Peminjaman = db.peminjaman;

class BookRepository {
  async pinjamBuku(memberCode, bookCode, dateNow = new Date()) {
    try {
        const member = await Member.findOne({ where: { code: memberCode } })
        const book = await Book.findOne({ where: { code: bookCode } });
        const { rows } = await Peminjaman.findAndCountAll({
          where: {
            memberId: member.dataValues.id
          },
        });
        const peminjam = [];
        rows.map((d) => {
          if(d.dataValues.deletedAt == null){
            peminjam.push(d.dataValues)
          }
        })

        const penalty = async () => {
          try {
            const pengembalian = await Peminjaman.findAll({
              where: { memberId: member.dataValues.id, bookId: book.dataValues.id },
              paranoid: false,
              order: [['createdAt', 'DESC']],
            });
        
            if (pengembalian.length > 0) {
              const latestPengembalian = pengembalian[0];
              if (latestPengembalian.dataValues.deletedAt != null) {
                const createdAt = new Date(latestPengembalian.dataValues.createdAt);
                const tglPinjam = createdAt.toISOString().split('T')[0];
                const tglPengembalian = latestPengembalian.dataValues.tanggalPengembalian;
                const checkTglPengembalian = new Date(tglPengembalian) - new Date(tglPinjam);
                const millisecondsInDay = 1000 * 60 * 60 * 24;
                const daysDifference = Math.floor(checkTglPengembalian / millisecondsInDay);
              
                if(7 < daysDifference) {
                  const member = await Member.findOne({ where: { code: memberCode } })
                  const penalty = await member.update({ penalty: true })
                  if(member.dataValues.penalty == true) {
                    return true
                  }
                }
              }
            }
          } catch (error) {
            throw error;
          }
        };

        await penalty()

        const memberUpdated = await Member.findOne({ where: { code: memberCode } })
        const resetPenalty = async() => {
          const penalizedAt = memberUpdated.dataValues.updatedAt;
          const currentDate = new Date(dateNow);
          const threeDaysAgo = new Date(penalizedAt);
          threeDaysAgo.setDate(threeDaysAgo.getDate() + 3);
      
          // Jika sudah 3 hari atau lebih berlalu dari waktu penalty, reset penalty
          if (currentDate >= threeDaysAgo) {
            await memberUpdated.update({ penalty: false });
          } else {
            return false
          }
        } 
        await resetPenalty()

        if(memberUpdated.dataValues.penalty == false && book.dataValues.stock != 0 && peminjam.length < 2) {
          const pinjam = await Peminjaman.create({
            bookId: book.dataValues.id,
            memberId: member.dataValues.id
          })
          if(pinjam){
            await book.update({ stock: (book.dataValues.stock - 1) })
          }
          return pinjam
        }

        return res.status(400)
    } catch (error) {
      throw error;
    }
  }

  async pengembalianBuku(memberCode, bookCode, dateReturn = new Date()) {
    const member = await Member.findOne({ where: { code: memberCode } })
    const book = await Book.findOne({ where: { code: bookCode } })
    const pinjamBuku = await Peminjaman.findOne({ where: { bookId: book.dataValues.id, memberId: member.dataValues.id } })

    if(pinjamBuku.dataValues.tanggalPengembalian == null) {
      if(member.dataValues.id == pinjamBuku.dataValues.memberId && book.dataValues.id == pinjamBuku.dataValues.bookId) {
        const result = await pinjamBuku.update({ tanggalPengembalian: new Date(dateReturn) })
        if(result) {
          await pinjamBuku.destroy({ where: { bookId: book.dataValues.id } })
          await book.update({ stock: (book.dataValues.stock + 1) })
        }

        return result
      }
    }
    return res.status(400)
  }
}

module.exports = new BookRepository();