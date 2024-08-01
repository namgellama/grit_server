import prisma from "../prisma/client";
import bcrypt from "bcryptjs";

async function main() {
	await prisma.user.create({
		data: {
			name: "admin",
			email: "gritnp@gmail.com",
			password: bcrypt.hashSync("admin", 10),
			role: "Admin",
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
