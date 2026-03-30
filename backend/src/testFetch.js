const fs = require('fs');

async function test() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/v1/auth/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin1', password: 'admin123', branchId: '3ddc258a-2393-4165-8a7f-5e4efb8c98f3' })
        });
        const loginData = await loginRes.json();
        
        if (!loginData.success) {
            console.error("LOGIN FAILED:", loginData);
            return;
        }

        const token = loginData.data.accessToken;
        
        const res = await fetch('http://localhost:5000/api/v1/students', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        
        const branches = (data.data?.results || data.data || []).map(s => s.branchId);
        console.log(JSON.stringify({
            role_in_token: JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).role,
            branch_in_token: JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).branchId,
            returnedResultsCount: branches.length,
            uniqueReturnedBranches: [...new Set(branches)]
        }, null, 2));

    } catch (e) {
        console.error("ERR:", e.message);
    }
}
test();
