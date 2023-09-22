import bcrypt from 'bcryptjs';

export const users= [
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: true,
    },
    {
        name: 'Sifat Rahman',
        email: 'sifat@gmail.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: false,
    },
    {
        name: 'Rasel Ahmed',
        email: 'rasel@gmail.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: false,
    }

]

