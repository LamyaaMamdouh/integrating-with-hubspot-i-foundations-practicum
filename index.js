require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ضيفي التوكن هنا في ملف .env وليكن PRIVATE_APP_ACCESS=xxx
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// حطي الـ object ID بتاع ال hobbies custom object
const CUSTOM_OBJECT_ID = '2-194157684'; // غيّريها حسب الـ ID بتاعك

// ROUTE 1 - Homepage showing hobbies
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=name,nickname,favorite_color`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(url, { headers });
        const hobbies = resp.data.results;
        res.render('homepage', { title: 'Hobbies List | HubSpot Practicum', hobbies });
    } catch (error) {
        console.error('Error fetching records:', error.message);
        res.send('حدث خطأ أثناء جلب البيانات. تأكدي من صحة الـ token أو البيانات.');
    }
});

// ROUTE 2 - Form to add new hobby
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Add New Hobby | HubSpot Practicum' });
});

// ROUTE 3 - Handle form submission
app.post('/update-cobj', async (req, res) => {
    const data = {
        properties: {
            name: req.body.name,
            nickname: req.body.nickname,
            favorite_color: req.body.favorite_color
        }
    };

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, data, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating record:', error.message);
        res.send('حدث خطأ أثناء إنشاء الـ hobby. تأكدي من الخصائص أو الـ token.');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));