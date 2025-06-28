const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;


        //funcao para verificação de login
        if (username === 'usuario' && password === 'senha123') {
            setTimeout(() => {
            window.location.href = '../index.html'; // Substitua por sua página real
        }, 2000);
        } else {
            window.confirm("Erro na autenticação")
        }

});
