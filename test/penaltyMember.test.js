const { exec } = require('child_process');
const request = require('supertest');
const app = require('../app');

describe('member telat mengembalikan lebih dari 7 hari', () => {
  test('penalty member', async () => {
    const response = await request(app)
      .post('/api/v1/pinjam-buku')
      .send({
        member_code: 'M001',
        book_code: 'JK-45'
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("sukses meminjam buku");

      const pengembalianResponse = await request(app)
      .put('/api/v1/pengembalian-buku')
      .send({
        member_code: 'M001',
        book_code: 'JK-45',
        date_return: '2023-10-02'
      });

      expect(pengembalianResponse.statusCode).toBe(200);
      expect(pengembalianResponse.body.message).toBe("sukses mengembalikan buku");

      const pinjamLagi = await request(app)
      .post('/api/v1/pinjam-buku')
      .send({
        member_code: 'M001',
        book_code: 'JK-45',
        date_now: '2023-09-26'
      });

      expect(pinjamLagi.statusCode).toBe(500);
      expect(pinjamLagi.body.message).toBe("Gagal membuat peminjaman buku");
  })

  exec('make migratefreshandseed', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Makefile: ${error}`);
      process.exit(1);
    }
  });
});