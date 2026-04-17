import { adminLogin } from './src/modules/auth/auth.service';

async function test() {
    try {
        console.log('Attempting login for superadmin@nsm.com...');
        const result = await adminLogin({
            username: 'superadmin@nsm.com',
            password: 'admin123'
        });
        console.log('SUCCESS:', result);
    } catch (e: any) {
        console.log('FAILED:', e.message);
        if (e.details) console.log('Details:', e.details);
    }
}

test();
