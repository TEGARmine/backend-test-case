migratefreshandseed:
	npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
test-pinjambuku:
	npx jest --testPathPattern test/pinjamBuku.test.js
test-pengembalianbuku:
	npx jest --testPathPattern test/pengembalianBuku.test.js
test-penaltymember:
	npx jest --testPathPattern test/penaltyMember.test.js
test-telatpengembalianbuku:
	npx jest --testPathPattern test/telatPengembalianBuku.test.js

.PHONY : migratefreshandseed test-pinjambuku test-pengembalianbuku test-penaltymember test-telatpengembalianbuku