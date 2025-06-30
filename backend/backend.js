// backend.js (Node.js e Express)
const express = require('express');
const bodyParser = require('body-parser'); // Para analisar JSON do frontend
const cors = require('cors'); // Para permitir requisições de origens diferentes (CORS)
const session = require('express-session'); // Para gerenciar sessões e cookies

const app = express();
const port = 3000;

// Configurar CORS para permitir requisições do seu frontend (ex: http://127.0.0.1:5500 ou file://)
// Em um ambiente de produção, substitua '*' pela URL exata do seu frontend.
app.use(cors({
    origin: 'https://webdev.pedro.pa.vms.ufsc.br/js/login.js', // Ou a URL do seu servidor de desenvolvimento, ex: http://localhost:8080
    credentials: true // Importante para enviar e receber cookies
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
        secure: false, // Em desenvolvimento pode ser 'false', em produção DEVE SER 'true' (exige HTTPS)
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

// Exemplo de rota protegida (requer login)
app.get('/dashboard', (req, res) => {
    if (req.session.userId) {
        return res.status(200).json({ message: `Bem-vindo ao dashboard, ${req.session.username}!` });
    } else {
        return res.status(401).json({ message: 'Não autorizado. Por favor, faça login.' });
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

app.listen(port, () => {
    console.log(`Servidor backend rodando em http://webdev.pedro.pa.vms.br:${port}`);
    console.log('Lembre-se de usar HTTPS em produção e um store de sessão persistente!');
});