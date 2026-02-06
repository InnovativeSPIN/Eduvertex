import User from '../models/User.model.js';
import colors from 'colors';

const seedSuperAdmin = async () => {
    try {
        const superAdminEmail = 'vasanthi@gmail.com';
        const exists = await User.findOne({ email: superAdminEmail });

        if (!exists) {
            console.log('Creating initial Super Admin...'.yellow);
            await User.create({
                admin_id: '01',
                admin_name: 'vasanth',
                name: 'vasanth', // Fallback for standard name field
                email: superAdminEmail,
                pwd: '123',
                role: 'super-admin',
                admintype: 'super-admin',
                isActive: true
            });
            console.log('Super Admin "vasanth" created successfully.'.green.bold);
        } else {
            console.log('Super Admin already exists.'.blue);
        }
    } catch (error) {
        console.error(`Error seeding Super Admin: ${error.message}`.red);
    }
};

export default seedSuperAdmin;
