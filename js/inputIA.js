function InputAPIIA(entrada) {
    return "FuckU"
    //colocar aqui a funcao de API do RAGCHAT
}




function enviodeinput() {
	let textInput = (document.getElementById("inputtext")).value
    

    if (textInput !== "") {
        let textResposta = document.getElementById("RespostaIA")
        textResposta.textContent = InputAPIIA(textInput)
    }
    


}