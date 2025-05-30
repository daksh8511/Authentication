import express from 'express'
import { Logout, Register, SignIn } from '../controller/UserController.js';

const UserRoutes = express.Router()

UserRoutes.post('/register', Register)
UserRoutes.post('/login', SignIn)
UserRoutes.post('/logout', Logout)

export default UserRoutes;