import express  from "express";
import { getAllUsers, getUser, signin, signup, updateUser } from "../controllers/users.js";

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);

export default router;