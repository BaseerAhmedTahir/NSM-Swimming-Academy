import fs from 'fs';
async function testFetch() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/v1/auth/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin1', password: 'admin123', branchId: '3ddc258a-2393-4165-8a7f-5e4efb8c98f3' })
        });
        const loginData = await loginRes.json();
        const token = loginData.data?.accessToken;
        
        const studentsRes = await fetch('http://localhost:5000/api/v1/students', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const studentsData = await studentsRes.json();
        
        fs.writeFileSync('fetch_output.json', JSON.stringify({ 
            success: true, 
            total: studentsData.meta?.total || studentsData.data?.length,
            sample: (studentsData.data?.results || studentsData.data || []).slice(0, 5).map((s:any) => ({ name: s.name, branch: s.branch?.name }))
        }, null, 2));

    } catch (e: any) {
        fs.writeFileSync('fetch_output.json', JSON.stringify({ success: false, error: e.message }));
    }
}
testFetch();
