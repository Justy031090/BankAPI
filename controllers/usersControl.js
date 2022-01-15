import fs from 'fs';
import { v4 as uniq } from 'uuid';
const data = fs.promises;

//helpers

const loadUsers = async function () {
    try {
        const dataBuffer = await data.readFile('users.json');
        return JSON.parse(dataBuffer.toString());
    } catch (e) {
        return [];
    }
};
const savedUsers = function (users) {
    const dataJSON = JSON.stringify(users);
    data.writeFile('users.json', dataJSON);
};

//exports

export const getUsers = async (req, res) => {
    const users = await loadUsers();
    res.status(200).send(users);
};
export const getUser = async (req, res) => {
    const users = await loadUsers();
    const { id } = req.params;
    const requestedUser = users.find((user) => user.id === id);
    res.send(requestedUser);
};
export const addUser = async (req, res) => {
    const users = await loadUsers();
    const newUser = req.body;
    users.push({ ...newUser, id: uniq() });
    savedUsers(users);
    res.status(200).send(users);
};
export const deleteUser = async (req, res) => {
    let users = await loadUsers();
    const { id } = req.params;
    users = users.filter((user) => user.id !== id);
    savedUsers(users);
    res.send(users);
};
export const updateUser = async (req, res) => {
    let users = await loadUsers();
    const { id } = req.params;
    const { cash, credit } = req.body;
    const updateUser = users.find((user) => user.id === id);
    if (cash) updateUser.cash = cash;
    if (credit) updateUser.credit = credit;
    savedUsers(users);
    res.send(updateUser);
};
