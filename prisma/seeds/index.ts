import { PrismaClient } from '@prisma/client';
import { createHmac } from 'crypto';

const prisma = new PrismaClient();

const CommonHelpers = {
    sha256(data: string, secret: string): string {
        return createHmac('sha256', secret).update(data).digest('hex');
    },
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    },
};

async function main() {
    const passwordKey = CommonHelpers.uuid();
    const hashedPassword = CommonHelpers.sha256('123456', passwordKey);

    const user = await prisma.user.create({
        data: {
            uuid: CommonHelpers.uuid(),
            isActive: true,
            email: 'admin@example.com',
            securePassword: passwordKey,
            password: hashedPassword,
            gender: 'UNKNOWN',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    console.log({ user });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
