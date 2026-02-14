
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Manually load .env.local because we are running a standalone script
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        console.log(`Loading environment from ${envPath}`);
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["'](.*)["']$/, '$1'); // Remove quotes
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    } else {
        console.warn('.env.local not found, checking .env');
        const backupPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(backupPath)) {
            console.log(`Loading environment from ${backupPath}`);
            // ... simplified loading for backup
            const envConfig = fs.readFileSync(backupPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
                    if (!process.env[key]) process.env[key] = value;
                }
            });
        }
    }
}

loadEnv();

if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL not found in environment.");
    console.error("Please add DATABASE_URL to your .env.local file.");
    process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const amount = parseInt(process.argv[3] || '50', 10);

    if (!email) {
        console.log('No email provided. Listing recent users:');
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        console.table(users.map(u => ({ email: u.email, credits: u.credits, id: u.id, createdAt: u.createdAt })));
        console.log('\nUsage: node scripts/add-credits.js <email> [amount]');
        process.exit(0);
    }

    try {
        let user = await prisma.user.findFirst({
            where: { email: email }
        });

        if (!user) {
            // Try finding by ID if email check fails
            const userById = await prisma.user.findFirst({ where: { id: email } });
            if (userById) {
                user = userById;
            } else {
                console.log(`User ${email} not found.`);
                process.exit(1);
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { credits: { increment: amount } }
        });

        console.log(`Successfully added ${amount} credits to ${email}. New balance: ${updatedUser.credits}`);
    } catch (error) {
        console.error("Database connection error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
