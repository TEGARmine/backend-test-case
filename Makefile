migratefreshandseed:
	npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
testpinjambuku:
	npx jest --testPathPattern test/pinjamBuku.test.js
testpengembalianbuku:
	npx jest --testPathPattern test/pengembalianBuku.test.js

.PHONY : migratefreshandseed testpinjambuku testpengembalianbuku