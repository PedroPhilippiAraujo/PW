const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const repeatInput = document.getElementById('repeatpassword');

loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;
        const repeatpassword = repeatInput.value;

        if (password === repeatpassword) {
            setTimeout(() => {
            window.confirm("Cadastro Realizado com sucesso")    
            window.location.href = './login.html';
        }, 2000);
        // funcao de registrar no db
        
        } else {
            window.confirm("Senhas não condizem")
        }

});