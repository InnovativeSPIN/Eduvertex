import dotenv from 'dotenv';
dotenv.config();
import { models } from '../models/index.js';
const { LeaveBalance } = models;

const checkBalance = async () => {
    try {
        const balances = await LeaveBalance.findAll({
            where: { userId: 406 }
        });
        console.log(JSON.stringify(balances, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkBalance();
