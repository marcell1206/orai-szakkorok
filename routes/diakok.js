import pool from '../utils/db.js';
import express from 'express';

const diakokRouter = express.Router();

diakokRouter.get('/', async (req, res) => {
    const { osztaly } = req.query;

    const params = [];
    let szurok = [];


})