import express from 'express';
import {
    getUsers,
    addUser,
    getUser,
    deleteUser,
    updateUser,
    usersTransfer,
} from '../controllers/usersControl.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);
export default router;
