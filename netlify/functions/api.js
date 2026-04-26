const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(cors());
app.use(express.json());

// ============= MOCK DATA =============
let user = {
  id: 1,
  name: 'Vipul Rastogi',
  email: 'rastogivipul148@email.com',
  avatar: 'http://static.photos/people/200x200/42',
  totalSpent: 1247.50,
  billsSplit: 23,
  groupsCount: 8,
  monthlySpending: 1247.50,
  monthlyChange: 12,
  youOwe: 85.00,
  owedToYou: 142.50,
  currency: 'USD ($)'
};

let friends = [
  { id: 1, name: 'Sarah Miller', email: 'sarah@email.com', avatar: 'http://static.photos/people/200x200/1', isFavorite: true, balance: -42.50 },
  { id: 2, name: 'Mike Chen', email: 'mike@email.com', avatar: 'http://static.photos/people/200x200/2', isFavorite: true, balance: 28.00 },
  { id: 3, name: 'Emma Wilson', email: 'emma@email.com', avatar: 'http://static.photos/people/200x200/3', isFavorite: true, balance: -15.00 },
  { id: 4, name: 'James Brown', email: 'james@email.com', avatar: 'http://static.photos/people/200x200/4', isFavorite: true, balance: 0 },
  { id: 5, name: 'Lisa Park', email: 'lisa@email.com', avatar: 'http://static.photos/people/200x200/5', isFavorite: false, balance: 35.00 },
  { id: 6, name: 'David Kim', email: 'david@email.com', avatar: 'http://static.photos/people/200x200/6', isFavorite: false, balance: -22.50 },
  { id: 7, name: 'Olivia Davis', email: 'olivia@email.com', avatar: 'http://static.photos/people/200x200/7', isFavorite: false, balance: 0 },
  { id: 8, name: 'Ryan Taylor', email: 'ryan@email.com', avatar: 'http://static.photos/people/200x200/8', isFavorite: false, balance: 12.00 },
  { id: 9, name: 'Sophie Martinez', email: 'sophie@email.com', avatar: 'http://static.photos/people/200x200/9', isFavorite: false, balance: 0 },
  { id: 10, name: 'Chris Lee', email: 'chris@email.com', avatar: 'http://static.photos/people/200x200/10', isFavorite: false, balance: -8.00 },
  { id: 11, name: 'Amy White', email: 'amy@email.com', avatar: 'http://static.photos/people/200x200/11', isFavorite: false, balance: 0 },
  { id: 12, name: 'Tom Garcia', email: 'tom@email.com', avatar: 'http://static.photos/people/200x200/12', isFavorite: false, balance: 18.00 }
];

let bills = [
  { id: 'b1', name: 'Dinner at Mario\'s', amount: 156.80, date: '2025-06-15', category: 'food', status: 'pending', paidBy: 'You', splitWith: [1, 2, 3], perPerson: 39.20 },
  { id: 'b2', name: 'Uber to Beach', amount: 45.00, date: '2025-06-14', category: 'travel', status: 'settled', paidBy: 'Mike Chen', splitWith: [0, 2], perPerson: 15.00 },
  { id: 'b3', name: 'Grocery Run', amount: 89.50, date: '2025-06-13', category: 'food', status: 'pending', paidBy: 'You', splitWith: [1, 4], perPerson: 29.83 },
  { id: 'b4', name: 'Movie Night', amount: 62.00, date: '2025-06-12', category: 'other', status: 'settled', paidBy: 'Sarah Miller', splitWith: [0, 2, 3], perPerson: 15.50 },
  { id: 'b5', name: 'Bar Tab', amount: 210.40, date: '2025-06-10', category: 'drinks', status: 'pending', paidBy: 'You', splitWith: [1, 2, 3, 4, 5], perPerson: 35.07 },
  { id: 'b6', name: 'Airbnb Split', amount: 480.00, date: '2025-06-08', category: 'travel', status: 'settled', paidBy: 'You', splitWith: [1, 2, 3], perPerson: 120.00 },
  { id: 'b7', name: 'Pizza Delivery', amount: 38.90, date: '2025-06-05', category: 'food', status: 'settled', paidBy: 'Emma Wilson', splitWith: [0, 1], perPerson: 12.97 },
  { id: 'b8', name: 'Coffee Shop', amount: 24.50, date: '2025-06-03', category: 'drinks', status: 'settled', paidBy: 'You', splitWith: [2], perPerson: 12.25 }
];

let groups = [
  { id: 'g1', name: 'Weekend Squad', category: 'friends', members: [0, 1, 2, 3], totalSpent: 324.30, bills: 3 },
  { id: 'g2', name: 'Beach Trip 2025', category: 'travel', members: [0, 1, 2, 3, 4, 5], totalSpent: 525.40, bills: 2 },
  { id: 'g3', name: 'Apartment 4B', category: 'roommates', members: [0, 6, 7], totalSpent: 189.50, bills: 4 },
  { id: 'g4', name: 'Office Lunch', category: 'office', members: [0, 4, 8, 9], totalSpent: 156.90, bills: 5 }
];

let notifications = [
  { id: 'n1', text: 'Sarah Miller paid you $39.20 for "Dinner at Mario\'s"', time: '2 min ago', read: false, icon: 'check-circle' },
  { id: 'n2', text: 'Reminder: David Kim owes you $22.50', time: '1 hour ago', read: false, icon: 'clock' },
  { id: 'n3', text: 'Mike Chen settled "Uber to Beach" bill', time: '3 hours ago', read: false, icon: 'receipt' }
];

// ============= ROUTES =============

// GET /api/data - Returns all initial data
app.get('/api/data', (req, res) => {
  res.json({
    user,
    friends,
    bills,
    groups,
    notifications
  });
});

// POST /api/bills - Add a new bill
app.post('/api/bills', (req, res) => {
  const { name, amount, category, paidBy, splitWith, perPerson } = req.body;
  
  if (!name || !amount) {
    return res.status(400).json({ error: 'Name and amount are required' });
  }
  
  const newBill = {
    id: 'b' + Date.now(),
    name,
    amount: parseFloat(amount),
    date: new Date().toISOString().split('T')[0],
    category: category || 'other',
    status: 'pending',
    paidBy: paidBy || 'You',
    splitWith: splitWith || [],
    perPerson: parseFloat(perPerson) || amount / (splitWith?.length || 1)
  };
  
  bills.unshift(newBill);
  res.status(201).json(newBill);
});

// POST /api/friends - Add a new friend
app.post('/api/friends', (req, res) => {
  const { name, email, phone } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const newFriend = {
    id: Date.now(),
    name,
    email: email || '',
    phone: phone || '',
    avatar: `http://static.photos/people/200x200/${Math.floor(Math.random() * 999) + 1}`,
    isFavorite: false,
    balance: 0
  };
  
  friends.push(newFriend);
  res.status(201).json(newFriend);
});

// POST /api/groups - Create a new group
app.post('/api/groups', (req, res) => {
  const { name, category, members } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const newGroup = {
    id: 'g' + Date.now(),
    name,
    category: category || 'friends',
    members: members || [0],
    totalSpent: 0,
    bills: 0
  };
  
  groups.unshift(newGroup);
  res.status(201).json(newGroup);
});

// POST /api/friends/:id/favorite - Toggle friend favorite status
app.post('/api/friends/:id/favorite', (req, res) => {
  const id = parseInt(req.params.id);
  const friend = friends.find(f => f.id === id);
  
  if (!friend) {
    return res.status(404).json({ error: 'Friend not found' });
  }
  
  friend.isFavorite = !friend.isFavorite;
  res.json(friend);
});

// GET /api/friends - Get all friends
app.get('/api/friends', (req, res) => {
  res.json(friends);
});

// GET /api/bills - Get all bills
app.get('/api/bills', (req, res) => {
  res.json(bills);
});

// GET /api/groups - Get all groups
app.get('/api/groups', (req, res) => {
  res.json(groups);
});

// ============= HEALTH CHECK =============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export for Netlify Functions
module.exports = app;
module.exports.handler = serverless(app);
