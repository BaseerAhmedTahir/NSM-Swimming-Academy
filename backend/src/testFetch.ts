import axios from 'axios';

async function testFetch() {
    try {
        // 1. Get branch ID for Sharjah (admin1's branch)
        // Since I know admin1 is Sharjah from my JSON dump: 3ddc258a-2393-4165-8a7f-5e4efb8c98f3
        
        console.log("Logging in as admin1...");
        const loginRes = await axios.post('http://localhost:5000/api/v1/auth/admin/login', {
            username: 'admin1',
            password: 'password',
            branchId: '3ddc258a-2393-4165-8a7f-5e4efb8c98f3' 
        });
        
        const token = loginRes.data.data.accessToken;
        console.log("Token acquired.");
        
        console.log("Fetching students without passing branchId in params...");
        const studentsRes = await axios.get('http://localhost:5000/api/v1/students', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Students fetched. Total: ", studentsRes.data.meta?.total || studentsRes.data.data?.length);
        
        // Let's see the branches of the first 5 students
        const students = (studentsRes.data.data.results || studentsRes.data.data).slice(0, 5);
        students.forEach((s: any) => {
            console.log(`Student: ${s.name}, Branch: ${s.branch?.name || s.branchId}`);
        });

    } catch (e: any) {
        console.error("Test failed: ", e.response?.data || e.message);
    }
}
testFetch();
