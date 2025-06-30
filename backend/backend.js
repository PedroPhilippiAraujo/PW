// backend.js (Node.js e Express)
const express = require('express');
const bodyParser = require('body-parser'); // Para analisar JSON do frontend
const cors = require('cors'); // Para permitir requisições de origens diferentes (CORS)
const session = require('express-session'); // Para gerenciar sessões e cookies
const https = require('https'); // NEW: Require the https module
const fs = require('fs');


require('dotenv').config(); // Load environment variables from .env


const app = express();
const port = 3000;

const privateKey = fs.readFileSync('certs/localhost+1-key.pem', 'utf8'); // Assuming in same directory or adjust path
const certificate = fs.readFileSync('certs/localhost+1.pem', 'utf8');   // Assuming in same directory or adjust path
const credentials = { key: privateKey, cert: certificate };

//API key declarada no .env
//const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

//const { InferenceClient } = require('@huggingface/inference');

//const hf = new InferenceClient(HUGGINGFACE_API_KEY);

const allowedOrigins = [
    'http://webdev.pedro.pa.vms.ufsc.br', //http
    'https://webdev.pedro.pa.vms.ufsc.br', // https Your production/staging domain
    'http://localhost:5500',              // Common for VS Code Live Server
    'http://127.0.0.1:5500',              // Also common for Live Server
    'http://localhost:8080',
    'https://localhost:3000', 
    'https://127.0.0.1:3000'           
    // Add any other specific origins where you might be serving your frontend
];

 //Configurar CORS para permitir requisições do seu frontend (ex: http://127.0.0.1:5500 ou file://)
 //Em um ambiente de produção, substitua '*' pela URL exata do seu frontend.
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));


// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());

// Configurar o middleware de sessão
// ATENÇÃO: Em produção, 'secret' deve ser uma string longa e aleatória
// e você deve usar um store de sessão persistente (ex: Connect-Redis, Connect-Mongo)
app.use(session({
    secret: 'lhegarantonnireifazernadacomseuscorposqvcssearrependam', // MUITO IMPORTANTE! Use uma string forte e aleatória
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Impedir acesso via JavaScript no frontend
        secure: true, // Em desenvolvimento pode ser 'false', em produção DEVE SER 'true' (exige HTTPS)
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
        sameSite: 'Lax' // Proteção CSRF
    }
}));

// Rota de Login (recebe os dados do frontend)
app.post('/login', (req, res) => {
    // AQUI VOCÊ OBTÉM OS DADOS DO FORMULÁRIO DO HTML!
    // Eles vêm no corpo da requisição, acessíveis via req.body
    const { username, password } = req.body;

    console.log(`Tentativa de login: Usuário: ${username}, Senha: ${password}`);

    // Simulação de verificação de credenciais no backend
    if (username === 'usuario' && password === 'senha123') {
        // Login bem-sucedido: Armazenar informações na sessão do usuário
        req.session.userId = 1;
        req.session.username = username;
        
        // Envia uma resposta de sucesso para o frontend
        return res.status(200).json({ message: 'Login bem-sucedido!' });
    } else {
        // Login falhou: Envia uma resposta de erro para o frontend
        return res.status(401).json({ message: 'Nome de usuário ou senha incorretos.' });
    }
});


// Exemplo de rota de logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao fazer logout.' });
        }
        res.clearCookie('connect.sid'); // Limpa o cookie de sessão padrão do express-session
        res.status(200).json({ message: 'Logout bem-sucedido.' });
    });
});

 // verificação de login
app.get('/auth-status', (req, res) => {
    if (req.session.userId) { // Verifica se há um userId na sessão
        // Se houver, o usuário está logado
        return res.status(200).json({ loggedIn: true, username: req.session.username });
    } else {
        // Se não houver, o usuário não está logado
        return res.status(200).json({ loggedIn: false });
    }
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000, () => {
    console.log(`Servidor backend HTTPS rodando em https://localhost:3000`);
    console.log('Lembre-se de usar um store de sessão persistente em produção!');
});


app.listen(port, () => {
    console.log(`Servidor backend rodando em http://webdev.pedro.pa.vms.br:${port}`);
    console.log('Lembre-se de usar HTTPS em produção e um store de sessão persistente!');
});