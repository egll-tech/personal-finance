import { prisma } from "@personal-finance/prisma"

async function main() {
    const user = await prisma.counter.create({
        data: {
            value: 1,
        },
    })
    console.log(user)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
