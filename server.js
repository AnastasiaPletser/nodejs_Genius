const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const sqlite3 = require('sqlite3').verbose();

const dbName = 'tasks.db';
const port = 3000;

const db = new sqlite3.Database(dbName);

let tasks = [
    {
        id: 1,
        text : 'Go to shop',
    },
    {
        id: 2,
        text : 'Buy car',
    },
    {
        id: 3,
        text : 'Go for a run',
    },
    {
        id: 4,
        text : 'Read a book',
    },
    {
        id: 5,
        text : 'Call mom',
    },
]

app.use(bodyParser.json());

const checkExist = (task, res) => {
    if(!task) {
          return res.status(404).json({message: 'Завдання не знайдено'});  
    }
}


const serverError = (err, res) => {
    if(err) {
        return res.status(500).json({error: err.message});
    } 
}

app.get('/', (req, res) => {
   return res.send('Привіт, Express!');
});

app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        serverError(err, res);
        
        return res.status(200).json(rows);
    });
});

app.post('/tasks', (req, res) => {
    // отримувати дані з тіла запиту
    const newTask = req.body;

    //Виконуємо операцію створення
    // tasks.push(newTask);
    db.run('INSERT INTO tasks (text) VALUES (?)', [newTask.text], (err) => {
        serverError(err, res);

    //Відповідаємо повідомленням про успіх або новостворенною задачею

    return res.status(201).json({id: this.lastID});
    })
});

app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

      //Знаходимо завдання за отриманими індетифікаторами
    // const foundTask = tasks.find(task => task.id === taskId);

    db.get('SELECT * FROM tasks WHERE id = ?', taskId, (err, row) => {
        serverError(err, res);
        checkExist(row, res);
        return res.status(200).json(row);
    });
});


app.put('/tasks/:id', (req, res) => {
    // Отримуємо дані з тіла запиту
    const { text } = req.body;
    const taskId = parseInt(req.params.id);

    //Знаходимо завдання за отриманими індетифікаторами
    // const foundTask = tasks.find(task => task.id === taskId);
    // checkExist(foundTask, res);


    db.run('UPDATE tasks SET text = ? WHERE id = ?', [text, taskId], (err) => {
        serverError(err, res);

        return res.status(200).json({id: taskId, text});
    });
});

app.delete('/tasks/:id', (req, res) => {

    const taskId = parseInt(req.params.id);

 

    db.run('DELETE from tasks WHERE id = ?', taskId, (err)=> {
        serverError(err, res);
        //Відповісти повіідомленням про успіх
    return res.status(204).send();
    });
});

app.listen(port, () => {
    console.log(`Сервер запущено on http://localhost:${port}`)
});
