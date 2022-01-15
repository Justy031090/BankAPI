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
    try {
        const users = await loadUsers();
        if (users.length) return res.status(200).send(users);
        else
            return res
                .status(200)
                .send('There are no clients yet. Feel free to Add some.');
    } catch (e) {
        res.status(500).send(e.message);
    }
};
export const getUser = async (req, res) => {
    try {
        const users = await loadUsers();
        const { id } = req.params;
        if (id.length === 36) {
            users.find((user) => {
                if (user.id === id) return res.status(200).send(user);
                else
                    return res
                        .status(404)
                        .send(`Cannot find a user with ID ${id}`);
            });
        } else
            return res
                .status(404)
                .send('Provided user ID is Invalid. Please try Again');
    } catch (e) {
        res.status(400).send(e.message);
    }
};
export const addUser = async (req, res) => {
    try {
        const users = await loadUsers();
        const newUser = req.body;
        //it is more optimal to use here regex for validation
        if (!newUser.name || newUser.name.length < 2)
            res.status(400).send('Please enter a valid name');
        users.push({ ...newUser, id: uniq(), cash: 0, credit: 0 });
        savedUsers(users);
        res.status(201).send(users);
    } catch (e) {
        res.status(404).send(e.message);
    }
};
export const deleteUser = async (req, res) => {
    try {
        let users = await loadUsers();
        const { id } = req.params;
        if (id.length === 36) {
            let initialLength = users.length;
            users = users.filter((user) => user.id !== id);
            if (users.length === initialLength) {
                res.status(400).send(
                    'Failed to delete a user, Please check the ID is correct'
                );
            } else {
                savedUsers(users);
                res.status(200).send(`Successfully deleted user ${id}`);
            }
        } else
            return res
                .status(404)
                .send('Provided user ID is Invalid. Please try Again');
    } catch (e) {
        res.send.status(400).send(e.message);
    }
};
export const updateUser = async (req, res) => {
    try {
        let users = await loadUsers();
        const { id } = req.params;
        const { cash, credit } = req.body;
        const updateUser = users.find((user) => user.id === id);
        if (updateUser) {
            if (cash) {
                if (Number(cash) >= 0) updateUser.cash = cash;
                else return res.send('Cash must have a positive value');
            }
            if (credit) {
                if (Number(credit) >= 0) updateUser.credit = credit;
                else return res.send('Credit must have a positive value');
            }
            if (!cash && !credit)
                return res.send('Cash or Credit values are required.');
            savedUsers(users);
            res.send(updateUser);
        } else
            return res
                .status(404)
                .send('Provided user ID is Invalid. Please try Again');
    } catch (e) {
        res.status(400).send(e.message);
    }
};
