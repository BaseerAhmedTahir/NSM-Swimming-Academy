
export type Student = any;
export type Coach = any;
export type Schedule = any;

export const frozenStudents = [
  {
    id: "NSM-DXB-F01",
    name: "Ziad Ahmed",
    branch: "Dubai",
    membership: "Silver",
    freezeDate: "2026-03-01",
    expectedResumeDate: "2026-04-01",
    comment: "Medical leave due to injury",
    phone: "+971501234567"
  },
  {
    id: "NSM-SHJ-F02",
    name: "Layla Hassan",
    branch: "Sharjah",
    membership: "Gold",
    freezeDate: "2026-02-15",
    expectedResumeDate: "2026-03-15",
    comment: "Traveling for a month",
    phone: "+971509876543"
  }
];

export const cancelledStudents = [
  {
    id: "NSM-DXB-C01",
    name: "Omar Ali",
    branch: "Dubai",
    membership: "Basic",
    cancelDate: "2026-02-28",
    reason: "Relocating to another city",
    phone: "+971505554444"
  },
  {
    id: "NSM-AUH-C02",
    name: "Sara John",
    branch: "Abu Dhabi",
    membership: "Platinum",
    cancelDate: "2026-03-05",
    reason: "Schedule conflict",
    phone: "+971502223333"
  }
];

export const expiredPackages = [
  {
    studentId: "NSM-DXB-001",
    packageName: "Silver Package",
    classesUsed: 2,
    totalClasses: 10,
    expiryDate: "2025-04-15",
    status: "Expired"
  }
];

export const students = [
  {
    "id": "NSM-DXB-001",
    "name": "Ahmed",
    "age": 35,
    "gender": "Male",
    "level": "A1",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Silver",
    "email": "parent1@email.com",
    "phone": "+971505565690",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 2,
      "pending": 18,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-002",
    "name": "Sara",
    "age": 30,
    "gender": "Male",
    "level": "A1",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Gold",
    "email": "parent2@email.com",
    "phone": "+971509273575",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 5,
      "pending": 15,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-003",
    "name": "John",
    "age": 9,
    "gender": "Female",
    "level": "K4",
    "category": "Kids",
    "branch": "Dubai",
    "membership": "Gold",
    "email": "parent3@email.com",
    "phone": "+971504084491",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 5,
      "pending": 15,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-004",
    "name": "Zara",
    "age": 26,
    "gender": "Male",
    "level": "A3",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Basic",
    "email": "parent4@email.com",
    "phone": "+971506082596",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 11,
      "pending": 9,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-005",
    "name": "Ali",
    "age": 9,
    "gender": "Male",
    "level": "K8",
    "category": "Kids",
    "branch": "Dubai",
    "membership": "Individual",
    "email": "parent5@email.com",
    "phone": "+971507670594",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 0,
      "pending": 20,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 500,
      "paidDate": null,
      "paymentMode": "Card",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-006",
    "name": "Omar",
    "age": 20,
    "gender": "Male",
    "level": "A6",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Gold",
    "email": "parent6@email.com",
    "phone": "+971505375026",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 14,
      "pending": 6,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-007",
    "name": "Reem",
    "age": 11,
    "gender": "Male",
    "level": "K7",
    "category": "Kids",
    "branch": "Dubai",
    "membership": "Gold",
    "email": "parent7@email.com",
    "phone": "+971509807877",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 13,
      "pending": 7,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-008",
    "name": "Yousef",
    "age": 30,
    "gender": "Female",
    "level": "A1",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Gold",
    "email": "parent8@email.com",
    "phone": "+971501068258",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 6,
      "pending": 14,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Card",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": null,
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-009",
    "name": "Maria",
    "age": 31,
    "gender": "Male",
    "level": "A5",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Platinum",
    "email": "parent9@email.com",
    "phone": "+971503731895",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 11,
      "pending": 9,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-010",
    "name": "Sami",
    "age": 31,
    "gender": "Male",
    "level": "A6",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Platinum",
    "email": "parent10@email.com",
    "phone": "+971505560782",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 4,
      "pending": 16,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-011",
    "name": "Leila",
    "age": 25,
    "gender": "Male",
    "level": "A3",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Basic",
    "email": "parent11@email.com",
    "phone": "+971504506163",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 2,
      "pending": 18,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Online",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-012",
    "name": "Tariq",
    "age": 18,
    "gender": "Male",
    "level": "A8",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Silver",
    "email": "parent12@email.com",
    "phone": "+971505730952",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 1,
      "pending": 19,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-013",
    "name": "Nour",
    "age": 31,
    "gender": "Female",
    "level": "A3",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Silver",
    "email": "parent13@email.com",
    "phone": "+971503359428",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 7,
      "pending": 13,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-014",
    "name": "Rami",
    "age": 19,
    "gender": "Male",
    "level": "A8",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Platinum",
    "email": "parent14@email.com",
    "phone": "+971502933786",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 1,
      "pending": 19,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-015",
    "name": "Hana",
    "age": 37,
    "gender": "Female",
    "level": "A5",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Gold",
    "email": "parent15@email.com",
    "phone": "+971506706266",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 8,
      "pending": 12,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-016",
    "name": "Jad",
    "age": 18,
    "gender": "Female",
    "level": "A8",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Gold",
    "email": "parent16@email.com",
    "phone": "+971502940109",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 1,
      "pending": 19,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-017",
    "name": "Lina",
    "age": 32,
    "gender": "Female",
    "level": "A6",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Basic",
    "email": "parent17@email.com",
    "phone": "+971509329069",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 11,
      "pending": 9,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-018",
    "name": "Faris",
    "age": 3,
    "gender": "Female",
    "level": "T1",
    "category": "Toddler",
    "branch": "Dubai",
    "membership": "Gold",
    "email": "parent18@email.com",
    "phone": "+971503977064",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 5,
      "pending": 15,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-019",
    "name": "Mona",
    "age": 9,
    "gender": "Male",
    "level": "K5",
    "category": "Kids",
    "branch": "Dubai",
    "membership": "Basic",
    "email": "parent19@email.com",
    "phone": "+971508544099",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 13,
      "pending": 7,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-020",
    "name": "Zaid",
    "age": 6,
    "gender": "Male",
    "level": "K6",
    "category": "Kids",
    "branch": "Dubai",
    "membership": "Gold",
    "email": "parent20@email.com",
    "phone": "+971508627221",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 13,
      "pending": 7,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-021",
    "name": "Salma",
    "age": 8,
    "gender": "Female",
    "level": "K1",
    "category": "Kids",
    "branch": "Dubai",
    "membership": "Basic",
    "email": "parent21@email.com",
    "phone": "+971505887925",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 4,
      "pending": 16,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-DXB-022",
    "name": "Kareem",
    "age": 32,
    "gender": "Female",
    "level": "A5",
    "category": "Adult",
    "branch": "Dubai",
    "membership": "Platinum",
    "email": "parent22@email.com",
    "phone": "+971501566050",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 13,
      "pending": 7,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-023",
    "name": "Aya",
    "age": 34,
    "gender": "Female",
    "level": "A4",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Basic",
    "email": "parent23@email.com",
    "phone": "+971504364632",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 5,
      "pending": 15,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-024",
    "name": "Yassin",
    "age": 20,
    "gender": "Male",
    "level": "A8",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Individual",
    "email": "parent24@email.com",
    "phone": "+971502694225",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 5,
      "pending": 15,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-025",
    "name": "Dina",
    "age": 9,
    "gender": "Male",
    "level": "K8",
    "category": "Kids",
    "branch": "Sharjah",
    "membership": "Gold",
    "email": "parent25@email.com",
    "phone": "+971509443938",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 8,
      "pending": 12,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Card",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-026",
    "name": "Nader",
    "age": 19,
    "gender": "Male",
    "level": "A7",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Basic",
    "email": "parent26@email.com",
    "phone": "+971507203664",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 14,
      "pending": 6,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-027",
    "name": "Rania",
    "age": 20,
    "gender": "Male",
    "level": "A5",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Basic",
    "email": "parent27@email.com",
    "phone": "+971503180447",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 10,
      "pending": 10,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-028",
    "name": "Amir",
    "age": 13,
    "gender": "Male",
    "level": "K3",
    "category": "Kids",
    "branch": "Sharjah",
    "membership": "Individual",
    "email": "parent28@email.com",
    "phone": "+971508620168",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 10,
      "pending": 10,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 500,
      "paidDate": null,
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-029",
    "name": "Waleed",
    "age": 18,
    "gender": "Female",
    "level": "A7",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Platinum",
    "email": "parent29@email.com",
    "phone": "+971507003413",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 7,
      "pending": 13,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-030",
    "name": "Maya",
    "age": 26,
    "gender": "Female",
    "level": "A4",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Platinum",
    "email": "parent30@email.com",
    "phone": "+971508804158",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 14,
      "pending": 6,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-031",
    "name": "Saeed",
    "age": 24,
    "gender": "Male",
    "level": "A1",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Individual",
    "email": "parent31@email.com",
    "phone": "+971503802148",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 1,
      "pending": 19,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-032",
    "name": "Huda",
    "age": 25,
    "gender": "Male",
    "level": "A6",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Basic",
    "email": "parent32@email.com",
    "phone": "+971508397930",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 0,
      "pending": 20,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-033",
    "name": "Marwan",
    "age": 29,
    "gender": "Male",
    "level": "A4",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Silver",
    "email": "parent33@email.com",
    "phone": "+971508619277",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 13,
      "pending": 7,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-034",
    "name": "Nadia",
    "age": 25,
    "gender": "Male",
    "level": "A1",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Individual",
    "email": "parent34@email.com",
    "phone": "+971502423987",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 5,
      "pending": 15,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-035",
    "name": "Karim",
    "age": 17,
    "gender": "Male",
    "level": "A1",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Silver",
    "email": "parent35@email.com",
    "phone": "+971506291029",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 7,
      "pending": 13,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-036",
    "name": "Yasmine",
    "age": 10,
    "gender": "Female",
    "level": "K6",
    "category": "Kids",
    "branch": "Sharjah",
    "membership": "Gold",
    "email": "parent36@email.com",
    "phone": "+971507629973",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 0,
      "pending": 20,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-037",
    "name": "Faisal",
    "age": 35,
    "gender": "Female",
    "level": "A7",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Platinum",
    "email": "parent37@email.com",
    "phone": "+971508170463",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 5,
      "pending": 15,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-SHJ-038",
    "name": "Samira",
    "age": 17,
    "gender": "Female",
    "level": "A5",
    "category": "Adult",
    "branch": "Sharjah",
    "membership": "Gold",
    "email": "parent38@email.com",
    "phone": "+971505918327",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 6,
      "pending": 14,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-039",
    "name": "Basel",
    "age": 30,
    "gender": "Female",
    "level": "A3",
    "category": "Adult",
    "branch": "Abu Dhabi",
    "membership": "Individual",
    "email": "parent39@email.com",
    "phone": "+971505317885",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 1,
      "pending": 19,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-040",
    "name": "Jana",
    "age": 3,
    "gender": "Male",
    "level": "T3",
    "category": "Toddler",
    "branch": "Abu Dhabi",
    "membership": "Basic",
    "email": "parent40@email.com",
    "phone": "+971508026423",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 11,
      "pending": 9,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-041",
    "name": "Tamer",
    "age": 12,
    "gender": "Female",
    "level": "K5",
    "category": "Kids",
    "branch": "Abu Dhabi",
    "membership": "Silver",
    "email": "parent41@email.com",
    "phone": "+971505669204",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 5,
      "pending": 15,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-042",
    "name": "Laila",
    "age": 11,
    "gender": "Female",
    "level": "K1",
    "category": "Kids",
    "branch": "Abu Dhabi",
    "membership": "Gold",
    "email": "parent42@email.com",
    "phone": "+971503417115",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 5,
      "pending": 15,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 1500,
      "paidDate": null,
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-043",
    "name": "Majed",
    "age": 13,
    "gender": "Male",
    "level": "K5",
    "category": "Kids",
    "branch": "Abu Dhabi",
    "membership": "Individual",
    "email": "parent43@email.com",
    "phone": "+971505622301",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 14,
      "pending": 6,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-044",
    "name": "Safa",
    "age": 28,
    "gender": "Female",
    "level": "A3",
    "category": "Adult",
    "branch": "Abu Dhabi",
    "membership": "Silver",
    "email": "parent44@email.com",
    "phone": "+971502581762",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 1,
      "pending": 19,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-045",
    "name": "Adel",
    "age": 17,
    "gender": "Female",
    "level": "A7",
    "category": "Adult",
    "branch": "Abu Dhabi",
    "membership": "Basic",
    "email": "parent45@email.com",
    "phone": "+971502419067",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 13,
      "pending": 7,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-046",
    "name": "Hassan",
    "age": 27,
    "gender": "Male",
    "level": "A2",
    "category": "Adult",
    "branch": "Abu Dhabi",
    "membership": "Individual",
    "email": "parent46@email.com",
    "phone": "+971501905240",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 1,
      "pending": 19,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Pending",
      "amount": 500,
      "paidDate": null,
      "paymentMode": "Online",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 500
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-047",
    "name": "Riba",
    "age": 19,
    "gender": "Female",
    "level": "A4",
    "category": "Adult",
    "branch": "Abu Dhabi",
    "membership": "Platinum",
    "email": "parent47@email.com",
    "phone": "+971509686570",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 4,
      "pending": 16,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-048",
    "name": "Ibrahim",
    "age": 12,
    "gender": "Female",
    "level": "K1",
    "category": "Kids",
    "branch": "Abu Dhabi",
    "membership": "Individual",
    "email": "parent48@email.com",
    "phone": "+971507935666",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 11,
      "pending": 9,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": null,
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-049",
    "name": "Shatha",
    "age": 29,
    "gender": "Male",
    "level": "A6",
    "category": "Adult",
    "branch": "Abu Dhabi",
    "membership": "Platinum",
    "email": "parent49@email.com",
    "phone": "+971501873348",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 3,
      "pending": 17,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-050",
    "name": "Naira",
    "age": 33,
    "gender": "Male",
    "level": "A5",
    "category": "Adult",
    "branch": "Abu Dhabi",
    "membership": "Basic",
    "email": "parent50@email.com",
    "phone": "+971509592249",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 9,
      "pending": 11,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-051",
    "name": "Ahmed",
    "age": 17,
    "gender": "Male",
    "level": "A2",
    "category": "Adult",
    "branch": "Abu Dhabi",
    "membership": "Gold",
    "email": "parent51@email.com",
    "phone": "+971503265993",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 10,
      "pending": 10,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 2,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-052",
    "name": "Sara",
    "age": 11,
    "gender": "Female",
    "level": "K3",
    "category": "Kids",
    "branch": "Abu Dhabi",
    "membership": "Silver",
    "email": "parent52@email.com",
    "phone": "+971501289976",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 10,
      "pending": 10,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Card",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-053",
    "name": "John",
    "age": 6,
    "gender": "Male",
    "level": "K3",
    "category": "Kids",
    "branch": "Abu Dhabi",
    "membership": "Platinum",
    "email": "parent53@email.com",
    "phone": "+971509495659",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 5,
      "pending": 15,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 1500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 0,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 0,
    "registrationDate": "2024-06-01"
  },
  {
    "id": "NSM-AUH-054",
    "name": "Zara",
    "age": 24,
    "gender": "Female",
    "level": "A5",
    "category": "Adult",
    "branch": "Abu Dhabi",
    "membership": "Individual",
    "email": "parent54@email.com",
    "phone": "+971506905826",
    "schedule": {
      "days": [
        "Sunday",
        "Tuesday"
      ],
      "time": "5:00 PM"
    },
    "attendance": {
      "totalClasses": 20,
      "attended": 0,
      "pending": 20,
      "startDate": "2025-01-15",
      "expiryDate": "2025-04-15",
      "attendedDates": [
        "2025-01-15",
        "2025-01-22"
      ],
      "absentDates": [
        "2025-01-17"
      ]
    },
    "fee": {
      "status": "Paid",
      "amount": 500,
      "paidDate": "2025-01-15",
      "paymentMode": "Cash",
      "discount": 100,
      "vat": 75,
      "pendingAmount": 0
    },
    "assessmentPassDate": "2025-03-01",
    "renewalCount": 1,
    "registrationDate": "2024-06-01"
  }
];
export const coaches = [
  {
    "id": "COACH-DXB-001",
    "name": "Coach Ahmed",
    "phone": "+971509876541",
    "email": "ahmed@nsm.com",
    "branch": "Dubai",
    "assignedStudents": [
      "NSM-DXB-015",
      "NSM-DXB-020",
      "NSM-DXB-007",
      "NSM-DXB-001",
      "NSM-DXB-004"
    ]
  },
  {
    "id": "COACH-DXB-002",
    "name": "Coach Fatima",
    "phone": "+971509876542",
    "email": "fatima@nsm.com",
    "branch": "Dubai",
    "assignedStudents": [
      "NSM-DXB-014",
      "NSM-DXB-016",
      "NSM-DXB-021",
      "NSM-DXB-007",
      "NSM-DXB-009"
    ]
  },
  {
    "id": "COACH-DXB-003",
    "name": "Coach Tariq",
    "phone": "+971509876543",
    "email": "tariq@nsm.com",
    "branch": "Dubai",
    "assignedStudents": [
      "NSM-DXB-002",
      "NSM-DXB-015",
      "NSM-DXB-009",
      "NSM-DXB-003",
      "NSM-DXB-003"
    ]
  },
  {
    "id": "COACH-DXB-004",
    "name": "Coach Sarah",
    "phone": "+971509876544",
    "email": "sarah@nsm.com",
    "branch": "Dubai",
    "assignedStudents": [
      "NSM-DXB-022",
      "NSM-DXB-015",
      "NSM-DXB-022",
      "NSM-DXB-019",
      "NSM-DXB-015"
    ]
  },
  {
    "id": "COACH-SHJ-001",
    "name": "Coach Omar",
    "phone": "+971509876551",
    "email": "omar@nsm.com",
    "branch": "Sharjah",
    "assignedStudents": [
      "NSM-SHJ-027",
      "NSM-SHJ-035",
      "NSM-SHJ-028",
      "NSM-SHJ-026",
      "NSM-SHJ-029"
    ]
  },
  {
    "id": "COACH-SHJ-002",
    "name": "Coach Aisha",
    "phone": "+971509876552",
    "email": "aisha@nsm.com",
    "branch": "Sharjah",
    "assignedStudents": [
      "NSM-SHJ-023",
      "NSM-SHJ-036",
      "NSM-SHJ-036",
      "NSM-SHJ-034",
      "NSM-SHJ-030"
    ]
  },
  {
    "id": "COACH-SHJ-003",
    "name": "Coach Bilal",
    "phone": "+971509876553",
    "email": "bilal@nsm.com",
    "branch": "Sharjah",
    "assignedStudents": [
      "NSM-SHJ-031",
      "NSM-SHJ-036",
      "NSM-SHJ-032",
      "NSM-SHJ-033",
      "NSM-SHJ-028"
    ]
  },
  {
    "id": "COACH-AUH-001",
    "name": "Coach Hassan",
    "phone": "+971509876561",
    "email": "hassan@nsm.com",
    "branch": "Abu Dhabi",
    "assignedStudents": [
      "NSM-AUH-050",
      "NSM-AUH-040",
      "NSM-AUH-040",
      "NSM-AUH-047",
      "NSM-AUH-042"
    ]
  },
  {
    "id": "COACH-AUH-002",
    "name": "Coach Zainab",
    "phone": "+971509876562",
    "email": "zainab@nsm.com",
    "branch": "Abu Dhabi",
    "assignedStudents": [
      "NSM-AUH-053",
      "NSM-AUH-045",
      "NSM-AUH-044",
      "NSM-AUH-052",
      "NSM-AUH-052"
    ]
  },
  {
    "id": "COACH-AUH-003",
    "name": "Coach Karim",
    "phone": "+971509876563",
    "email": "karim@nsm.com",
    "branch": "Abu Dhabi",
    "assignedStudents": [
      "NSM-AUH-044",
      "NSM-AUH-052",
      "NSM-AUH-039",
      "NSM-AUH-044",
      "NSM-AUH-045"
    ]
  },
  {
    "id": "COACH-AUH-004",
    "name": "Coach Laila",
    "phone": "+971509876564",
    "email": "laila@nsm.com",
    "branch": "Abu Dhabi",
    "assignedStudents": [
      "NSM-AUH-046",
      "NSM-AUH-050",
      "NSM-AUH-052",
      "NSM-AUH-054",
      "NSM-AUH-052"
    ]
  }
];
export const scheduleData = {
  "2026-02-23": {
    "Dubai": {
      "coaches": {
        "Coach Ahmed": {
          "4:00 PM": [
            "Maria31A5",
            "Reem11K7",
            "Kareem32A5",
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Omar20A6",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Kareem32A5",
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Faris3T1",
            "Omar20A6",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "John9K4",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Fatima": {
          "4:00 PM": [
            "Lina32A6",
            "Hana37A5",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Zara26A3",
            "Rami19A8",
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Mona9K5",
            "Zaid6K6",
            "Lina32A6",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Lina32A6",
            "Salma8K1",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Ali9K8",
            "Nour31A3",
            "Jad18A8",
            "Lina32A6",
            null,
            null
          ]
        },
        "Coach Tariq": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Hana37A5",
            "Zaid6K6",
            "Yousef30A1",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Kareem32A5",
            "Kareem32A5",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Sarah": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "John9K4",
            "Maria31A5",
            "Zaid6K6",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Hana37A5",
            "Mona9K5",
            "Ahmed35A1",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Rami19A8",
            "John9K4",
            "Ahmed35A1",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Sara30A1",
            "John9K4",
            "Hana37A5",
            null,
            null,
            null
          ]
        }
      }
    },
    "Sharjah": {
      "coaches": {
        "Coach Omar": {
          "4:00 PM": [
            "Yassin20A8",
            "Saeed24A1",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Faisal35A7",
            "Nader19A7",
            "Yassin20A8",
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Amir13K3",
            "Huda25A6",
            "Faisal35A7",
            "Marwan29A4",
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Aisha": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Huda25A6",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Aya34A4",
            "Yasmine10K6",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Faisal35A7",
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Bilal": {
          "4:00 PM": [
            "Nadia25A1",
            "Faisal35A7",
            "Saeed24A1",
            "Huda25A6",
            null,
            null
          ],
          "5:00 PM": [
            "Marwan29A4",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Nadia25A1",
            "Maya26A4",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    },
    "Abu Dhabi": {
      "coaches": {
        "Coach Hassan": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Ahmed17A2",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Jana3T3",
            "Tamer12K5",
            "Adel17A7",
            "John6K3",
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Zainab": {
          "4:00 PM": [
            "Majed13K5",
            "Jana3T3",
            "Hassan27A2",
            "Laila11K1",
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Safa28A3",
            "Sara11K3",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Basel30A3",
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Shatha29A6",
            "Basel30A3",
            "Shatha29A6",
            null,
            null,
            null
          ]
        },
        "Coach Karim": {
          "4:00 PM": [
            "Sara11K3",
            "Ahmed17A2",
            "Shatha29A6",
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Tamer12K5",
            "Adel17A7",
            "Jana3T3",
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Ibrahim12K1",
            "Majed13K5",
            "Zara24A5",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Laila11K1",
            "John6K3",
            "Safa28A3",
            null,
            null,
            null
          ]
        },
        "Coach Laila": {
          "4:00 PM": [
            "Zara24A5",
            "Adel17A7",
            "Majed13K5",
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Laila11K1",
            "Naira33A5",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Ahmed17A2",
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    },

  "2026-02-24": {
    "Dubai": {
      "coaches": {
        "Coach Ahmed": {
          "4:00 PM": [
            "Sami31A6",
            "Tariq18A8",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Lina32A6",
            "Rami19A8",
            "Maria31A5",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Maria31A5",
            "Tariq18A8",
            null,
            null,
            null,
            null
          ]
        },
        "Coach Fatima": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "John9K4",
            "Omar20A6",
            "Nour31A3",
            "Kareem32A5",
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Tariq": {
          "4:00 PM": [
            "Rami19A8",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Yousef30A1",
            "Maria31A5",
            "Ahmed35A1",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Tariq18A8",
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Sami31A6",
            "Ali9K8",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Rami19A8",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Sarah": {
          "4:00 PM": [
            "John9K4",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Sami31A6",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Maria31A5",
            "Leila25A3",
            "Mona9K5",
            "Salma8K1",
            null,
            null
          ],
          "7:00 PM": [
            "Hana37A5",
            "Maria31A5",
            "Faris3T1",
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    },
    "Sharjah": {
      "coaches": {
        "Coach Omar": {
          "4:00 PM": [
            "Aya34A4",
            "Maya26A4",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Amir13K3",
            "Dina9K8",
            "Dina9K8",
            "Karim17A1",
            null,
            null
          ],
          "6:00 PM": [
            "Samira17A5",
            "Saeed24A1",
            "Yassin20A8",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Waleed18A7",
            "Nader19A7",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Huda25A6",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Aisha": {
          "4:00 PM": [
            "Dina9K8",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Marwan29A4",
            "Samira17A5",
            "Nader19A7",
            "Dina9K8",
            null,
            null
          ],
          "8:00 PM": [
            "Aya34A4",
            "Huda25A6",
            null,
            null,
            null,
            null
          ]
        },
        "Coach Bilal": {
          "4:00 PM": [
            "Waleed18A7",
            "Amir13K3",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Marwan29A4",
            "Amir13K3",
            "Faisal35A7",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Maya26A4",
            "Waleed18A7",
            "Yassin20A8",
            "Waleed18A7",
            null,
            null
          ],
          "7:00 PM": [
            "Yasmine10K6",
            "Samira17A5",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Faisal35A7",
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    },
    "Abu Dhabi": {
      "coaches": {
        "Coach Hassan": {
          "4:00 PM": [
            "Basel30A3",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Ahmed17A2",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Jana3T3",
            "Shatha29A6",
            "Shatha29A6",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Basel30A3",
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Ahmed17A2",
            "Laila11K1",
            "Basel30A3",
            null,
            null,
            null
          ]
        },
        "Coach Zainab": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Riba19A4",
            "Adel17A7",
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "John6K3",
            "Sara11K3",
            "Laila11K1",
            "John6K3",
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "John6K3",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Karim": {
          "4:00 PM": [
            "Naira33A5",
            "Safa28A3",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "John6K3",
            "Riba19A4",
            "Adel17A7",
            "Riba19A4",
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Jana3T3",
            "Basel30A3",
            "Adel17A7",
            "Tamer12K5",
            null,
            null
          ],
          "8:00 PM": [
            "Tamer12K5",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Laila": {
          "4:00 PM": [
            "Tamer12K5",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "John6K3",
            "Naira33A5",
            "Laila11K1",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Shatha29A6",
            "Naira33A5",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Hassan27A2",
            "Ibrahim12K1",
            "Naira33A5",
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    }
  },
  "2026-02-25": {
    "Dubai": {
      "coaches": {
        "Coach Ahmed": {
          "4:00 PM": [
            "Salma8K1",
            "Sara30A1",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "John9K4",
            "Lina32A6",
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Zaid6K6",
            "Omar20A6",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Ahmed35A1",
            "Ali9K8",
            "John9K4",
            "Nour31A3",
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Fatima": {
          "4:00 PM": [
            "Hana37A5",
            "Maria31A5",
            "Kareem32A5",
            "Ahmed35A1",
            null,
            null
          ],
          "5:00 PM": [
            "Zaid6K6",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Jad18A8",
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Sara30A1",
            "Ali9K8",
            null,
            null,
            null,
            null
          ]
        },
        "Coach Tariq": {
          "4:00 PM": [
            "Maria31A5",
            "Leila25A3",
            "Ali9K8",
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Maria31A5",
            "Hana37A5",
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Faris3T1",
            "Kareem32A5",
            "Leila25A3",
            "Kareem32A5",
            null,
            null
          ],
          "7:00 PM": [
            "Leila25A3",
            "Yousef30A1",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Rami19A8",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Sarah": {
          "4:00 PM": [
            "Leila25A3",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Ali9K8",
            "Nour31A3",
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Omar20A6",
            "Salma8K1",
            "Leila25A3",
            "Tariq18A8",
            null,
            null
          ]
        }
      }
    },
    "Sharjah": {
      "coaches": {
        "Coach Omar": {
          "4:00 PM": [
            "Maya26A4",
            "Maya26A4",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Yassin20A8",
            "Yassin20A8",
            "Karim17A1",
            "Yasmine10K6",
            null,
            null
          ],
          "7:00 PM": [
            "Waleed18A7",
            "Marwan29A4",
            "Maya26A4",
            "Nader19A7",
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Aisha": {
          "4:00 PM": [
            "Aya34A4",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Dina9K8",
            "Faisal35A7",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Karim17A1",
            "Yasmine10K6",
            "Amir13K3",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Nadia25A1",
            "Nadia25A1",
            "Dina9K8",
            null,
            null,
            null
          ]
        },
        "Coach Bilal": {
          "4:00 PM": [
            "Dina9K8",
            "Nader19A7",
            "Rania20A5",
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Amir13K3",
            "Karim17A1",
            "Aya34A4",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Yassin20A8",
            "Waleed18A7",
            "Faisal35A7",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Aya34A4",
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    },
    "Abu Dhabi": {
      "coaches": {
        "Coach Hassan": {
          "4:00 PM": [
            "Riba19A4",
            "Ibrahim12K1",
            "Riba19A4",
            "Safa28A3",
            null,
            null
          ],
          "5:00 PM": [
            "Adel17A7",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Jana3T3",
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Tamer12K5",
            "Sara11K3",
            "Ahmed17A2",
            "Safa28A3",
            null,
            null
          ],
          "8:00 PM": [
            "Laila11K1",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Zainab": {
          "4:00 PM": [
            "Adel17A7",
            "Safa28A3",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Ibrahim12K1",
            "Basel30A3",
            "Hassan27A2",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Majed13K5",
            "Jana3T3",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Ibrahim12K1",
            "Safa28A3",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Hassan27A2",
            "Naira33A5",
            "Ahmed17A2",
            null,
            null,
            null
          ]
        },
        "Coach Karim": {
          "4:00 PM": [
            "Naira33A5",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Shatha29A6",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Shatha29A6",
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Basel30A3",
            "Adel17A7",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Sara11K3",
            "Basel30A3",
            null,
            null,
            null,
            null
          ]
        },
        "Coach Laila": {
          "4:00 PM": [
            "Safa28A3",
            "Riba19A4",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Laila11K1",
            "Hassan27A2",
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Majed13K5",
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    }
  },
  "2026-02-26": {
    "Dubai": {
      "coaches": {
        "Coach Ahmed": {
          "4:00 PM": [
            "Lina32A6",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Omar20A6",
            "Rami19A8",
            "Faris3T1",
            "Yousef30A1",
            null,
            null
          ],
          "6:00 PM": [
            "Reem11K7",
            "Reem11K7",
            "Sara30A1",
            "Nour31A3",
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Omar20A6",
            "Faris3T1",
            "Kareem32A5",
            "Zaid6K6",
            null,
            null
          ]
        },
        "Coach Fatima": {
          "4:00 PM": [
            "Salma8K1",
            "Omar20A6",
            "Nour31A3",
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Maria31A5",
            "Omar20A6",
            "Reem11K7",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Zara26A3",
            "Salma8K1",
            "Zara26A3",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Tariq18A8",
            "John9K4",
            "Jad18A8",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Zara26A3",
            "Faris3T1",
            "Ali9K8",
            "Leila25A3",
            null,
            null
          ]
        },
        "Coach Tariq": {
          "4:00 PM": [
            "Yousef30A1",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Yousef30A1",
            "Kareem32A5",
            "John9K4",
            "Rami19A8",
            null,
            null
          ],
          "6:00 PM": [
            "Maria31A5",
            "Jad18A8",
            "Yousef30A1",
            "Lina32A6",
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Sarah": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "John9K4",
            "Reem11K7",
            "Yousef30A1",
            null,
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    },
    "Sharjah": {
      "coaches": {
        "Coach Omar": {
          "4:00 PM": [
            "Faisal35A7",
            "Huda25A6",
            "Aya34A4",
            "Rania20A5",
            null,
            null
          ],
          "5:00 PM": [
            "Waleed18A7",
            "Rania20A5",
            "Yassin20A8",
            "Samira17A5",
            null,
            null
          ],
          "6:00 PM": [
            "Huda25A6",
            "Marwan29A4",
            "Yasmine10K6",
            "Aya34A4",
            null,
            null
          ],
          "7:00 PM": [
            "Karim17A1",
            "Yassin20A8",
            "Karim17A1",
            "Amir13K3",
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Aisha": {
          "4:00 PM": [
            "Huda25A6",
            "Marwan29A4",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Dina9K8",
            "Yasmine10K6",
            "Dina9K8",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Dina9K8",
            "Rania20A5",
            "Yasmine10K6",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Yasmine10K6",
            "Maya26A4",
            "Rania20A5",
            "Samira17A5",
            null,
            null
          ]
        },
        "Coach Bilal": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Nadia25A1",
            "Nader19A7",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Faisal35A7",
            "Nader19A7",
            "Aya34A4",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Nadia25A1",
            "Marwan29A4",
            "Yassin20A8",
            "Aya34A4",
            null,
            null
          ]
        }
      }
    },
    "Abu Dhabi": {
      "coaches": {
        "Coach Hassan": {
          "4:00 PM": [
            "Basel30A3",
            "Laila11K1",
            "Safa28A3",
            "Shatha29A6",
            null,
            null
          ],
          "5:00 PM": [
            "Shatha29A6",
            "Shatha29A6",
            "Majed13K5",
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Adel17A7",
            "Ahmed17A2",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Zara24A5",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Zainab": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Shatha29A6",
            "Adel17A7",
            "Adel17A7",
            "Riba19A4",
            null,
            null
          ],
          "6:00 PM": [
            "Safa28A3",
            "Jana3T3",
            "Safa28A3",
            null,
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Adel17A7",
            "Basel30A3",
            "Ahmed17A2",
            "Ahmed17A2",
            null,
            null
          ]
        },
        "Coach Karim": {
          "4:00 PM": [
            "Majed13K5",
            "Adel17A7",
            "Ibrahim12K1",
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Ibrahim12K1",
            "Zara24A5",
            "Laila11K1",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Hassan27A2",
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Sara11K3",
            "Tamer12K5",
            "Riba19A4",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Adel17A7",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Laila": {
          "4:00 PM": [
            "Laila11K1",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Basel30A3",
            "Naira33A5",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Zara24A5",
            "Jana3T3",
            "Sara11K3",
            "Adel17A7",
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    }
  },
  "2026-02-29": {
    "Dubai": {
      "coaches": {
        "Coach Ahmed": {
          "4:00 PM": [
            "Ahmed35A1",
            "Rami19A8",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Zaid6K6",
            "Lina32A6",
            "Zaid6K6",
            "Salma8K1",
            null,
            null
          ],
          "7:00 PM": [
            "John9K4",
            "Rami19A8",
            "Maria31A5",
            "Nour31A3",
            null,
            null
          ],
          "8:00 PM": [
            "Sami31A6",
            "Sara30A1",
            "Lina32A6",
            "Rami19A8",
            null,
            null
          ]
        },
        "Coach Fatima": {
          "4:00 PM": [
            "Kareem32A5",
            "Tariq18A8",
            "Hana37A5",
            "Hana37A5",
            null,
            null
          ],
          "5:00 PM": [
            "Hana37A5",
            "Kareem32A5",
            "Faris3T1",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Hana37A5",
            "Zaid6K6",
            "Sami31A6",
            "Yousef30A1",
            null,
            null
          ],
          "7:00 PM": [
            "Leila25A3",
            "Sami31A6",
            "Yousef30A1",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Maria31A5",
            "Tariq18A8",
            "Salma8K1",
            null,
            null,
            null
          ]
        },
        "Coach Tariq": {
          "4:00 PM": [
            "Leila25A3",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Maria31A5",
            "Hana37A5",
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Mona9K5",
            "Sami31A6",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Ali9K8",
            "Maria31A5",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Sami31A6",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Sarah": {
          "4:00 PM": [
            "Salma8K1",
            "Lina32A6",
            "Sara30A1",
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Lina32A6",
            "Nour31A3",
            "Nour31A3",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Kareem32A5",
            "Nour31A3",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Mona9K5",
            "Kareem32A5",
            null,
            null,
            null,
            null
          ]
        }
      }
    },
    "Sharjah": {
      "coaches": {
        "Coach Omar": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Karim17A1",
            "Amir13K3",
            "Huda25A6",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Saeed24A1",
            "Amir13K3",
            "Nader19A7",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Karim17A1",
            "Nader19A7",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Maya26A4",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Aisha": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Yassin20A8",
            "Amir13K3",
            "Rania20A5",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Maya26A4",
            "Nadia25A1",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Waleed18A7",
            "Amir13K3",
            null,
            null,
            null,
            null
          ]
        },
        "Coach Bilal": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Yasmine10K6",
            "Nadia25A1",
            "Samira17A5",
            "Amir13K3",
            null,
            null
          ],
          "6:00 PM": [
            "Amir13K3",
            "Marwan29A4",
            "Waleed18A7",
            null,
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Karim17A1",
            "Waleed18A7",
            null,
            null,
            null,
            null
          ]
        }
      }
    },
    "Abu Dhabi": {
      "coaches": {
        "Coach Hassan": {
          "4:00 PM": [
            "Sara11K3",
            "Riba19A4",
            "Zara24A5",
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Laila11K1",
            "John6K3",
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "John6K3",
            "Tamer12K5",
            "Zara24A5",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Jana3T3",
            "Laila11K1",
            "John6K3",
            "Riba19A4",
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Zainab": {
          "4:00 PM": [
            "Hassan27A2",
            "Safa28A3",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Laila11K1",
            "Basel30A3",
            "Riba19A4",
            "Sara11K3",
            null,
            null
          ],
          "6:00 PM": [
            "Adel17A7",
            "Hassan27A2",
            "Basel30A3",
            "Naira33A5",
            null,
            null
          ],
          "7:00 PM": [
            "Safa28A3",
            "Safa28A3",
            "Safa28A3",
            "Tamer12K5",
            null,
            null
          ],
          "8:00 PM": [
            "Ahmed17A2",
            "Naira33A5",
            null,
            null,
            null,
            null
          ]
        },
        "Coach Karim": {
          "4:00 PM": [
            "Jana3T3",
            "Riba19A4",
            "Sara11K3",
            "Naira33A5",
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Tamer12K5",
            "Majed13K5",
            "Riba19A4",
            "Majed13K5",
            null,
            null
          ],
          "8:00 PM": [
            "Adel17A7",
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Laila": {
          "4:00 PM": [
            "Adel17A7",
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Jana3T3",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Ibrahim12K1",
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Jana3T3",
            "Safa28A3",
            "Adel17A7",
            null,
            null,
            null
          ]
        }
      }
    }
  },
  "2026-03-01": {
    "Dubai": {
      "coaches": {
        "Coach Ahmed": {
          "4:00 PM": [
            "Tariq18A8",
            "Ahmed35A1",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Ali9K8",
            "Reem11K7",
            "Hana37A5",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Hana37A5",
            "Zara26A3",
            "Yousef30A1",
            "Tariq18A8",
            null,
            null
          ]
        },
        "Coach Fatima": {
          "4:00 PM": [
            "Leila25A3",
            "Ahmed35A1",
            "Leila25A3",
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Zara26A3",
            "Leila25A3",
            "Leila25A3",
            "Jad18A8",
            null,
            null
          ],
          "6:00 PM": [
            "Reem11K7",
            "John9K4",
            "Ahmed35A1",
            "John9K4",
            null,
            null
          ],
          "7:00 PM": [
            "Rami19A8",
            "Sami31A6",
            "Tariq18A8",
            null,
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Tariq": {
          "4:00 PM": [
            "Zaid6K6",
            "Ahmed35A1",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Sara30A1",
            "Omar20A6",
            "John9K4",
            "Zaid6K6",
            null,
            null
          ],
          "6:00 PM": [
            "Rami19A8",
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Zara26A3",
            "Maria31A5",
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Tariq18A8",
            "Faris3T1",
            "Reem11K7",
            null,
            null,
            null
          ]
        },
        "Coach Sarah": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Zaid6K6",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Sami31A6",
            "Faris3T1",
            "Sami31A6",
            "Kareem32A5",
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Hana37A5",
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    },
    "Sharjah": {
      "coaches": {
        "Coach Omar": {
          "4:00 PM": [
            "Yassin20A8",
            "Huda25A6",
            "Yassin20A8",
            "Maya26A4",
            null,
            null
          ],
          "5:00 PM": [
            "Nadia25A1",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Huda25A6",
            "Nader19A7",
            "Nader19A7",
            "Amir13K3",
            null,
            null
          ],
          "7:00 PM": [
            "Huda25A6",
            "Faisal35A7",
            "Yassin20A8",
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Maya26A4",
            "Marwan29A4",
            "Faisal35A7",
            null,
            null,
            null
          ]
        },
        "Coach Aisha": {
          "4:00 PM": [
            "Waleed18A7",
            "Yasmine10K6",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Amir13K3",
            "Nadia25A1",
            "Yassin20A8",
            "Nadia25A1",
            null,
            null
          ],
          "6:00 PM": [
            "Nader19A7",
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Faisal35A7",
            "Waleed18A7",
            "Yasmine10K6",
            "Waleed18A7",
            null,
            null
          ],
          "8:00 PM": [
            "Faisal35A7",
            "Maya26A4",
            "Saeed24A1",
            "Saeed24A1",
            null,
            null
          ]
        },
        "Coach Bilal": {
          "4:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Amir13K3",
            "Waleed18A7",
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Yasmine10K6",
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Saeed24A1",
            "Nadia25A1",
            "Amir13K3",
            "Yasmine10K6",
            null,
            null
          ],
          "8:00 PM": [
            "Faisal35A7",
            null,
            null,
            null,
            null,
            null
          ]
        }
      }
    },
    "Abu Dhabi": {
      "coaches": {
        "Coach Hassan": {
          "4:00 PM": [
            "Adel17A7",
            "Basel30A3",
            "Naira33A5",
            "Zara24A5",
            null,
            null
          ],
          "5:00 PM": [
            "John6K3",
            "Zara24A5",
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Riba19A4",
            null,
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Naira33A5",
            "Basel30A3",
            "Basel30A3",
            "Laila11K1",
            null,
            null
          ],
          "8:00 PM": [
            "Laila11K1",
            "Ibrahim12K1",
            null,
            null,
            null,
            null
          ]
        },
        "Coach Zainab": {
          "4:00 PM": [
            "Zara24A5",
            "Safa28A3",
            "Basel30A3",
            null,
            null,
            null
          ],
          "5:00 PM": [
            "John6K3",
            "Safa28A3",
            "Shatha29A6",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Safa28A3",
            "Ibrahim12K1",
            null,
            null,
            null,
            null
          ],
          "7:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Majed13K5",
            "Shatha29A6",
            "Ahmed17A2",
            null,
            null,
            null
          ]
        },
        "Coach Karim": {
          "4:00 PM": [
            "John6K3",
            "Basel30A3",
            null,
            null,
            null,
            null
          ],
          "5:00 PM": [
            "Sara11K3",
            "Ibrahim12K1",
            "Safa28A3",
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Naira33A5",
            "Laila11K1",
            "Jana3T3",
            "Jana3T3",
            null,
            null
          ],
          "7:00 PM": [
            "Basel30A3",
            "Ahmed17A2",
            "Zara24A5",
            "John6K3",
            null,
            null
          ],
          "8:00 PM": [
            null,
            null,
            null,
            null,
            null,
            null
          ]
        },
        "Coach Laila": {
          "4:00 PM": [
            "Safa28A3",
            "Shatha29A6",
            "Majed13K5",
            "Ibrahim12K1",
            null,
            null
          ],
          "5:00 PM": [
            "Ahmed17A2",
            null,
            null,
            null,
            null,
            null
          ],
          "6:00 PM": [
            "Ibrahim12K1",
            "Ibrahim12K1",
            "Jana3T3",
            null,
            null,
            null
          ],
          "7:00 PM": [
            "Basel30A3",
            null,
            null,
            null,
            null,
            null
          ],
          "8:00 PM": [
            "Jana3T3",
            "Basel30A3",
            null,
            null,
            null,
            null
          ]
        }
        }
      }
    }
  }
};

export const notifications = [
  {
    "id": 1,
    "type": "holiday",
    "title": "Holiday Notice",
    "message": "Academy closed on 1st Dec for National Day",
    "date": "2026-02-20T10:00:00Z",
    "read": false
  },
  {
    "id": 2,
    "type": "class",
    "title": "Class Update",
    "message": "Your Tuesday class moved to 6 PM",
    "date": "2026-02-21T10:00:00Z",
    "read": true
  },
  {
    "id": 3,
    "type": "offer",
    "title": "Special Offer",
    "message": "Refer a friend and get 10% off!",
    "date": "2026-02-22T10:00:00Z",
    "read": false
  },
  {
    "id": 4,
    "type": "fee",
    "title": "Fee Reminder",
    "message": "Your payment of AED 500 is pending",
    "date": "2026-02-23T10:00:00Z",
    "read": false
  },
  {
    "id": 5,
    "type": "assessment",
    "title": "Congratulations!",
    "message": "You passed K3 assessment!",
    "date": "2026-02-24T10:00:00Z",
    "read": true
  },
  {
    "id": 6,
    "type": "holiday",
    "title": "Eid Holidays",
    "message": "Academy will be closed for Eid next week.",
    "date": "2026-02-15T10:00:00Z",
    "read": true
  },
  {
    "id": 7,
    "type": "class",
    "title": "Pool Maintenance",
    "message": "Thursday classes will be in the indoor pool.",
    "date": "2026-02-18T10:00:00Z",
    "read": true
  },
  {
    "id": 8,
    "type": "offer",
    "title": "Summer Camp Registration",
    "message": "Early bird discount for summer camp ends soon.",
    "date": "2026-02-19T10:00:00Z",
    "read": true
  },
  {
    "id": 9,
    "type": "fee",
    "title": "Receipt Available",
    "message": "Your receipt for your recent payment is ready to download.",
    "date": "2026-02-25T10:00:00Z",
    "read": false
  },
  {
    "id": 10,
    "type": "assessment",
    "title": "Assessment Next Week",
    "message": "Get ready for your K4 assessment next week!",
    "date": "2026-02-26T10:00:00Z",
    "read": false
  }
];

export const payments = [
  {
    "id": "INV-2026-1001",
    "date": "2026-02-22",
    "studentName": "Ahmed",
    "amount": 1071,
    "mode": "Card",
    "status": "Paid",
    "discount": 0,
    "vat": 53
  },
  {
    "id": "INV-2026-1002",
    "date": "2026-02-14",
    "studentName": "Sara",
    "amount": 1382,
    "mode": "Card",
    "status": "Paid",
    "discount": 0,
    "vat": 69
  },
  {
    "id": "INV-2026-1003",
    "date": "2026-02-04",
    "studentName": "John",
    "amount": 1488,
    "mode": "Card",
    "status": "Paid",
    "discount": 0,
    "vat": 74
  },
  {
    "id": "INV-2026-1004",
    "date": "2026-02-03",
    "studentName": "Zara",
    "amount": 817,
    "mode": "Online",
    "status": "Pending",
    "discount": 100,
    "vat": 35
  },
  {
    "id": "INV-2026-1005",
    "date": "2026-02-03",
    "studentName": "Ali",
    "amount": 1135,
    "mode": "Card",
    "status": "Pending",
    "discount": 0,
    "vat": 56
  },
  {
    "id": "INV-2026-1006",
    "date": "2026-02-23",
    "studentName": "Omar",
    "amount": 641,
    "mode": "Cash",
    "status": "Paid",
    "discount": 0,
    "vat": 32
  },
  {
    "id": "INV-2026-1007",
    "date": "2026-02-20",
    "studentName": "Reem",
    "amount": 854,
    "mode": "Cash",
    "status": "Paid",
    "discount": 0,
    "vat": 42
  },
  {
    "id": "INV-2026-1008",
    "date": "2026-02-27",
    "studentName": "Yousef",
    "amount": 1479,
    "mode": "Online",
    "status": "Pending",
    "discount": 0,
    "vat": 73
  },
  {
    "id": "INV-2026-1009",
    "date": "2026-02-23",
    "studentName": "Maria",
    "amount": 1284,
    "mode": "Card",
    "status": "Paid",
    "discount": 0,
    "vat": 64
  },
  {
    "id": "INV-2026-1010",
    "date": "2026-02-27",
    "studentName": "Sami",
    "amount": 1060,
    "mode": "Online",
    "status": "Pending",
    "discount": 0,
    "vat": 53
  },
  {
    "id": "INV-2026-1011",
    "date": "2026-02-05",
    "studentName": "Leila",
    "amount": 1234,
    "mode": "Online",
    "status": "Paid",
    "discount": 0,
    "vat": 61
  },
  {
    "id": "INV-2026-1012",
    "date": "2026-02-14",
    "studentName": "Tariq",
    "amount": 1032,
    "mode": "Online",
    "status": "Paid",
    "discount": 0,
    "vat": 51
  },
  {
    "id": "INV-2026-1013",
    "date": "2026-02-09",
    "studentName": "Nour",
    "amount": 671,
    "mode": "Card",
    "status": "Paid",
    "discount": 0,
    "vat": 33
  },
  {
    "id": "INV-2026-1014",
    "date": "2026-02-14",
    "studentName": "Rami",
    "amount": 1129,
    "mode": "Cash",
    "status": "Paid",
    "discount": 0,
    "vat": 56
  },
  {
    "id": "INV-2026-1015",
    "date": "2026-02-13",
    "studentName": "Hana",
    "amount": 795,
    "mode": "Cash",
    "status": "Paid",
    "discount": 0,
    "vat": 39
  },
  {
    "id": "INV-2026-1016",
    "date": "2026-02-04",
    "studentName": "Jad",
    "amount": 501,
    "mode": "Card",
    "status": "Pending",
    "discount": 0,
    "vat": 25
  },
  {
    "id": "INV-2026-1017",
    "date": "2026-02-23",
    "studentName": "Lina",
    "amount": 980,
    "mode": "Cash",
    "status": "Paid",
    "discount": 0,
    "vat": 49
  },
  {
    "id": "INV-2026-1018",
    "date": "2026-02-11",
    "studentName": "Faris",
    "amount": 814,
    "mode": "Cash",
    "status": "Paid",
    "discount": 0,
    "vat": 40
  },
  {
    "id": "INV-2026-1019",
    "date": "2026-02-28",
    "studentName": "Mona",
    "amount": 642,
    "mode": "Online",
    "status": "Paid",
    "discount": 100,
    "vat": 27
  },
  {
    "id": "INV-2026-1020",
    "date": "2026-02-01",
    "studentName": "Zaid",
    "amount": 548,
    "mode": "Cash",
    "status": "Paid",
    "discount": 0,
    "vat": 27
  }
];
