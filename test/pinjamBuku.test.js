const { exec } = require('child_process');
const request = require('supertest');
const app = require('../app');

describe('POST /api/v1/pinjam-buku', () => {
  exec('make migratefreshandseed', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Makefile: ${error}`);
      process.exit(1);
    }
  });
  
  test('pinjam buku', async () => {
    const response = await request(app)
      .post('/api/v1/pinjam-buku')
      .send({
        member_code: 'M001',
        book_code: 'JK-45'
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("sukses meminjam buku");
  })
});