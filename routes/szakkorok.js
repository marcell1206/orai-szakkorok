import pool from '../utils/db.js';
import express from 'express';

const szakkorokRouter = express.Router();

szakkorokRouter.get('/', async (req, res) => {
    const { nap } = req.query;
    const { vanHely } = req.query;

    let sql = 'SELECT id, nev, tanar, nap, max_letszam, COUNT(jelentkezesek.diak_id) AS jelentkezett, (max_letszam - COUNT(jelentkezesek.diak_id)) AS szabadHely FROM `szakkorok` LEFT JOIN jelentkezesek ON jelentkezesek.szakkor_id = szakkorok.id GROUP BY jelentkezesek.szakkor_id ORDER BY nap, nev;'

    const params = [];
    let szurok = [];

    if (nap) {
        sql = 'SELECT id, nev, tanar, nap, max_letszam, COUNT(jelentkezesek.diak_id) AS jelentkezett, (max_letszam - COUNT(jelentkezesek.diak_id)) AS szabadHely FROM `szakkorok` LEFT JOIN jelentkezesek ON jelentkezesek.szakkor_id = szakkorok.id WHERE nap = ? GROUP BY jelentkezesek.szakkor_id ORDER BY nap, nev;';
        params.push(nap);
    }

    if (vanHely) {
        sql = 'SELECT id, nev, tanar, nap, max_letszam, COUNT(jelentkezesek.diak_id) AS jelentkezett, (max_letszam - COUNT(jelentkezesek.diak_id)) AS szabadHely FROM `szakkorok` LEFT JOIN jelentkezesek ON jelentkezesek.szakkor_id = szakkorok.id GROUP BY jelentkezesek.szakkor_id HAVING (max_letszam - COUNT(jelentkezesek.diak_id)) > 0 ORDER BY nap, nev;'
        params.push(vanHely)
    }

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
});

szakkorokRouter.get('/:id', async (req, res) => {
    const { id } = req.params;

    /*if (!isNan(id)) {
        return res.status(400).json({ hiba: 'A megadott id nem szám!' });
    }*/

    try {
        const [szakkorRows] = await pool.execute('SELECT id, nev, tanar, nap, max_letszam, COUNT(jelentkezesek.diak_id) AS jelentkezett, (max_letszam - COUNT(jelentkezesek.diak_id)) AS szabadHely FROM `szakkorok` LEFT JOIN jelentkezesek ON jelentkezesek.szakkor_id = szakkorok.id WHERE id = ?', [id]);
        if (szakkorRows.length === 0) {
            return res.status(404).json({ hiba: 'A megadott szakkör nem található!' });
        }

        const szakkor = szakkorRows[0];
        const [diakokRows] = await pool.execute('SELECT d.id AS id, d.nev AS nev, d.osztaly AS osztaly, datum FROM `jelentkezesek` LEFT JOIN diakok d ON d.id = diak_id LEFT JOIN szakkorok sz ON sz.id = szakkor_id WHERE szakkor_id = ?;', [id]);
        szakkor.diakok = diakokRows;
        res.json(szakkor);
    } catch (error) {
        console.error(error)
        res.status(500).json({ hiba: 'Hiba történt az adatok lekérdezésekor.' });
    }
})

export default szakkorokRouter;