const fs = require('fs');

const branches = ['Dubai', 'Sharjah', 'Abu Dhabi'];
const levels = {
    Toddler: ['T1', 'T2', 'T3'],
    Kids: ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8'],
    Adult: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8']
};
const memberships = ['Basic', 'Silver', 'Gold', 'Platinum', 'Individual'];

const coaches = [
    { id: "COACH-DXB-001", name: "Coach Ahmed", phone: "+971509876541", email: "ahmed@nsm.com", branch: "Dubai" },
    { id: "COACH-DXB-002", name: "Coach Fatima", phone: "+971509876542", email: "fatima@nsm.com", branch: "Dubai" },
    { id: "COACH-DXB-003", name: "Coach Tariq", phone: "+971509876543", email: "tariq@nsm.com", branch: "Dubai" },
    { id: "COACH-DXB-004", name: "Coach Sarah", phone: "+971509876544", email: "sarah@nsm.com", branch: "Dubai" },
    { id: "COACH-SHJ-001", name: "Coach Omar", phone: "+971509876551", email: "omar@nsm.com", branch: "Sharjah" },
    { id: "COACH-SHJ-002", name: "Coach Aisha", phone: "+971509876552", email: "aisha@nsm.com", branch: "Sharjah" },
    { id: "COACH-SHJ-003", name: "Coach Bilal", phone: "+971509876553", email: "bilal@nsm.com", branch: "Sharjah" },
    { id: "COACH-AUH-001", name: "Coach Hassan", phone: "+971509876561", email: "hassan@nsm.com", branch: "Abu Dhabi" },
    { id: "COACH-AUH-002", name: "Coach Zainab", phone: "+971509876562", email: "zainab@nsm.com", branch: "Abu Dhabi" },
    { id: "COACH-AUH-003", name: "Coach Karim", phone: "+971509876563", email: "karim@nsm.com", branch: "Abu Dhabi" },
    { id: "COACH-AUH-004", name: "Coach Laila", phone: "+971509876564", email: "laila@nsm.com", branch: "Abu Dhabi" },
];

const names = ['Naira', 'Ahmed', 'Sara', 'John', 'Zara', 'Ali', 'Omar', 'Reem', 'Yousef', 'Maria', 'Sami', 'Leila', 'Tariq', 'Nour', 'Rami', 'Hana', 'Jad', 'Lina', 'Faris', 'Mona', 'Zaid', 'Salma', 'Kareem', 'Aya', 'Yassin', 'Dina', 'Nader', 'Rania', 'Amir', 'Waleed', 'Maya', 'Saeed', 'Huda', 'Marwan', 'Nadia', 'Karim', 'Yasmine', 'Faisal', 'Samira', 'Basel', 'Jana', 'Tamer', 'Laila', 'Majed', 'Safa', 'Adel', 'Hassan', 'Riba', 'Ibrahim', 'Shatha'];

const students = [];
let studentCounter = 1;

branches.forEach(branch => {
    const count = branch === 'Dubai' ? 22 : 16;
    const branchPrefix = branch === 'Dubai' ? 'DXB' : branch === 'Sharjah' ? 'SHJ' : 'AUH';

    for (let i = 0; i < count; i++) {
        const age = Math.floor(Math.random() * 35) + 3; // 3 to 37
        let category = 'Kids';
        if (age <= 4) category = 'Toddler';
        if (age >= 16) category = 'Adult';

        const levelArr = levels[category];
        const level = levelArr[Math.floor(Math.random() * levelArr.length)];
        const membership = memberships[Math.floor(Math.random() * memberships.length)];
        const status = Math.random() > 0.2 ? 'Paid' : 'Pending';
        const totalClasses = 20;
        const attended = Math.floor(Math.random() * 15);
        const pending = totalClasses - attended;

        // Distribute students to coaches in this branch
        const branchCoaches = coaches.filter(c => c.branch === branch);

        students.push({
            id: `NSM-${branchPrefix}-${studentCounter.toString().padStart(3, '0')}`,
            name: names[studentCounter % names.length],
            age,
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            level,
            category,
            branch,
            membership,
            email: `parent${studentCounter}@email.com`,
            phone: `+97150${Math.floor(1000000 + Math.random() * 9000000)}`,
            schedule: { days: ['Sunday', 'Tuesday'], time: "5:00 PM" },
            attendance: {
                totalClasses,
                attended,
                pending,
                startDate: "2025-01-15",
                expiryDate: "2025-04-15",
                attendedDates: ["2025-01-15", "2025-01-22"], // simplified
                absentDates: ["2025-01-17"]
            },
            fee: {
                status,
                amount: membership === 'Individual' ? 500 : 1500,
                paidDate: status === 'Paid' ? "2025-01-15" : null,
                paymentMode: ['Card', 'Cash', 'Online'][Math.floor(Math.random() * 3)],
                discount: Math.random() > 0.8 ? 100 : 0,
                vat: 75,
                pendingAmount: status === 'Pending' ? 500 : 0
            },
            assessmentPassDate: Math.random() > 0.5 ? "2025-03-01" : null,
            renewalCount: Math.floor(Math.random() * 3),
            registrationDate: "2024-06-01"
        });
        studentCounter++;
    }
});

// Assign students to coaches
coaches.forEach(coach => {
    const branchStudents = students.filter(s => s.branch === coach.branch);
    coach.assignedStudents = [];
    for (let i = 0; i < 5; i++) {
        if (branchStudents.length > 0) {
            const idx = Math.floor(Math.random() * branchStudents.length);
            coach.assignedStudents.push(branchStudents[idx].id);
        }
    }
});

const scheduleData = {};
const dates = ["2026-02-23", "2026-02-24", "2026-02-25", "2026-02-26", "2026-02-29", "2026-03-01"];
const times = ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];

dates.forEach(date => {
    scheduleData[date] = {};
    branches.forEach(branch => {
        scheduleData[date][branch] = { coaches: {} };
        const branchCoaches = coaches.filter(c => c.branch === branch);
        const branchStudents = students.filter(s => s.branch === branch);

        branchCoaches.forEach(coach => {
            scheduleData[date][branch].coaches[coach.name] = {};
            times.forEach(time => {
                // 6 slots per time slot
                const slots = [null, null, null, null, null, null];
                // randomly fill 1-4 slots
                const slotsToFill = Math.floor(Math.random() * 5);
                for (let i = 0; i < slotsToFill; i++) {
                    const student = branchStudents[Math.floor(Math.random() * branchStudents.length)];
                    const identifier = `${student.name}${student.age}${student.level}`;
                    slots[i] = identifier;
                }
                scheduleData[date][branch].coaches[coach.name][time] = slots;
            });
        });
    });
});

const notifications = [
    { id: 1, type: "holiday", title: "Holiday Notice", message: "Academy closed on 1st Dec for National Day", date: "2026-02-20T10:00:00Z", read: false },
    { id: 2, type: "class", title: "Class Update", message: "Your Tuesday class moved to 6 PM", date: "2026-02-21T10:00:00Z", read: true },
    { id: 3, type: "offer", title: "Special Offer", message: "Refer a friend and get 10% off!", date: "2026-02-22T10:00:00Z", read: false },
    { id: 4, type: "fee", title: "Fee Reminder", message: "Your payment of AED 500 is pending", date: "2026-02-23T10:00:00Z", read: false },
    { id: 5, type: "assessment", title: "Congratulations!", message: "You passed K3 assessment!", date: "2026-02-24T10:00:00Z", read: true },
    { id: 6, type: "holiday", title: "Eid Holidays", message: "Academy will be closed for Eid next week.", date: "2026-02-15T10:00:00Z", read: true },
    { id: 7, type: "class", title: "Pool Maintenance", message: "Thursday classes will be in the indoor pool.", date: "2026-02-18T10:00:00Z", read: true },
    { id: 8, type: "offer", title: "Summer Camp Registration", message: "Early bird discount for summer camp ends soon.", date: "2026-02-19T10:00:00Z", read: true },
    { id: 9, type: "fee", title: "Receipt Available", message: "Your receipt for your recent payment is ready to download.", date: "2026-02-25T10:00:00Z", read: false },
    { id: 10, type: "assessment", title: "Assessment Next Week", message: "Get ready for your K4 assessment next week!", date: "2026-02-26T10:00:00Z", read: false },
];

const payments = [];
for (let i = 1; i <= 20; i++) {
    const status = Math.random() > 0.3 ? 'Paid' : 'Pending';
    const mode = ['Card', 'Cash', 'Online'][Math.floor(Math.random() * 3)];
    const amount = Math.floor(Math.random() * 1000) + 500;
    const discount = Math.random() > 0.8 ? 100 : 0;
    payments.push({
        id: `INV-2026-${1000 + i}`,
        date: `2026-02-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
        studentName: names[i % names.length],
        amount,
        mode,
        status,
        discount,
        vat: Math.floor((amount - discount) * 0.05)
    });
}

const mockDataContentTS = `
export type Student = any;
export type Coach = any;
export type Schedule = any;

export const students = ${JSON.stringify(students, null, 2)};
export const coaches = ${JSON.stringify(coaches, null, 2)};
export const scheduleData = ${JSON.stringify(scheduleData, null, 2)};
export const notifications = ${JSON.stringify(notifications, null, 2)};
export const payments = ${JSON.stringify(payments, null, 2)};
`;

const mockDataContentJS = `
export const students = ${JSON.stringify(students, null, 2)};
export const coaches = ${JSON.stringify(coaches, null, 2)};
export const scheduleData = ${JSON.stringify(scheduleData, null, 2)};
export const notifications = ${JSON.stringify(notifications, null, 2)};
export const payments = ${JSON.stringify(payments, null, 2)};
`;

fs.writeFileSync('C:/Users/Mustafavi/Desktop/Mehboob client/nsm-swimming-academy/admin-panel/src/lib/mockData.ts', mockDataContentTS);
fs.writeFileSync('C:/Users/Mustafavi/Desktop/Mehboob client/nsm-swimming-academy/mobile-app/data/mockData.js', mockDataContentJS);

console.log('Mock data generated successfully!');
