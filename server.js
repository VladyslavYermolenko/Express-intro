const express = require('express');
const app = express();
debugger;
function logRequest ({method, url}, res, next) {
    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
    next();
}

app.use(express.json()); 
app.use(logRequest);

const increment = (init = 0) => () => ++init;
const primaryKey = increment();
const tasks = [
    { id: primaryKey (), name: 'Get tasks', done: true },
    { id: primaryKey (), name: 'Create task', done: true }
];

const createTask = data => {
    return {
        id: primaryKey (),
        name: data[Object.keys(data)],
        done: false
    }
}

app.get('/api/todoitem', (req, res) => res.json(tasks)); 

app.post('/api/todoitem', (req, res) => {
    const task = createTask(req.body);
    tasks.push(task);
    res.json(task);
});

app.patch('/api/todoitem/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(tsk => tsk.id === taskId);
    if (task) {
        Object.assign(task, req.body);
        res.json(task);
    }
    else {
        res.status(404).json({ error: 'Task not found' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`[~] Server started at localhost:${port}.`);
});