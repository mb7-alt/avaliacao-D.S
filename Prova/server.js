import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.get('/v1/status', (req, res) => {
    const stats = {
        cpu: Math.floor(Math.random() * 100),
        temp: Math.floor(Math.random() * (90 - 30 + 1)) + 30,
        ram: (Math.random() * (16 - 1) + 1).toFixed(1)
    };
    
    console.log("Dados enviados para SkyNode Dashboard:", stats);
    res.json(stats);
});

app.listen(port, () => {
    console.log(`🚀 Servidor SkyNode rodando em http://localhost:${port}`);
});