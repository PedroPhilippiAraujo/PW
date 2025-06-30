// login.js
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const mensagemDiv = document.getElementById('mensagem');

loginForm.addEventListener('submit', async function(event) { // Adicionado 'async' aqui
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username.trim() === '' || password.trim() === '') {
        exibirMensagem('Por favor, preencha todos os campos.', 'error');
        return;
    }

    // 1. Prepara os dados para enviar
    const dadosLogin = {
        username: username,
        password: password
    };
    
    // 2. Faz a requisição para o backend usando a Fetch API
    try {
        const response = await fetch('http://webdev.pedro.pa.vms.ufsc.br:3000', {
            method: 'POST', // Define o método HTTP como POST
            headers: {
                'Content-Type': 'application/json' // Informa ao servidor que estamos enviando JSON
            },
            body: JSON.stringify(dadosLogin) // Converte o objeto JavaScript em uma string JSON
        });

        // 3. Processa a resposta do backend
        const data = await response.json(); // Tenta analisar a resposta como JSON

        if (response.ok) { // Verifica se o status HTTP da resposta indica sucesso (2xx)
            exibirMensagem(data.message || 'Login bem-sucedido!', 'success');
            // Redireciona apenas se o login foi realmente bem-sucedido pelo servidor
            setTimeout(() => {
                console.log("sucesso")
                window.location.href = 'dashboard.html'; // Sua página protegida
            }, 1500);
        } else {
            // Se o servidor retornou um erro (ex: 401 Unauthorized)
            exibirMensagem(data.message || 'Credenciais inválidas. Tente novamente.', 'error');
        }

    } catch (error) {
        // Captura erros de rede ou outros problemas com a requisição
        console.error('Erro ao conectar ao servidor:', error);
        exibirMensagem('Erro de conexão. O servidor está offline?', 'error');
    }
    
});

function exibirMensagem(texto, tipo) {
    mensagemDiv.textContent = texto;
    mensagemDiv.className = '';
    mensagemDiv.classList.add(tipo);
    mensagemDiv.style.display = 'block';
}