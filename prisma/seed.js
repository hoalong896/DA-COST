const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.nguoi_dung.createMany({
    data: [
      {
        ho_ten: "Admin 1",
        email: "admin1@gmail.com",
        mat_khau: passwordHash,
        vai_tro: "Admin",
      },
      {
        ho_ten: "Admin 2",
        email: "admin2@gmail.com",
        mat_khau: passwordHash,
        vai_tro: "Admin",
      },
    ],
  });

  console.log(" Đã thêm 2 admin!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
