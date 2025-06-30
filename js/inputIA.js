import { InferenceClient } from "https://esm.sh/@huggingface/inference";


async function InputAPIIA(entrada) {
    let prompt = `Você é um assistente especializado em língua portuguesa. Sua função é ensinar português, corrigindo textos, ortografia, concordância, pontuação e estilo.

Responda individualmente cada prompt pedido, mantendo clareza, educação e foco no aprendizado da língua portuguesa.

Quando o usuário enviar um texto, corrija e explique os erros com naturalidade.

Sempre responda no estilo de um professor paciente e cordial, sem formalidades excessivas.

RESPONDA SEMPRE EM PORTUGUÊS

`; 
     
    prompt = prompt + '\n' + "Texto: " + entrada

    // IMPORTANT: HUGGINGFACE_API_KEY is defined in .env
    const client = new InferenceClient(HUGGINGFACE_API_KEY); 


    try {
        // Use the 'text-generation' task
        const response = await client.textGeneration({
            model: "meta-llama/Llama-3.1-8B", 
            inputs: prompt,
            parameters: {
                max_new_tokens: 384,
                temperature: 0.5, // Controls randomness (higher = more random)
                do_sample: true, // Enables sampling (necessary for temperature)
                num_return_sequences: 1, //number of responses
                top_p: 0.9
            }
        });
        console.log("Generated Text:", response.generated_text);
        console.log(prompt)
        return response.generated_text;

    } catch (error) {
        console.error("Error during text generation:", error);
        return "Failed to generate text.";
    }
};


async function enviodeinput() { // Make enviodeinput async
	let textInput = (document.getElementById("inputtext")).value;
    let textResposta = document.getElementById("RespostaIA");

    // 1. Verificar o status de autenticação com o backend
    try {
        const authCheckResponse = await fetch('http://localhost:3000/auth-status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // IMPORTANTE: Para enviar cookies de sessão
        });

        const authData = await authCheckResponse.json();

        if (!authData.loggedIn) {
            // Usuário não está logado
            textResposta.textContent = "Você precisa estar logado para enviar texto para a IA.";
            textResposta.style.color = "red"; // Apenas para feedback visual
            return; // Interrompe a função se não estiver logado
        }

        // Se o usuário estiver logado, continua com o envio para a IA
        if (textInput.trim() !== "") { // Usar trim() para verificar se não é só espaço em branco
            textResposta.textContent = "Processando..."; // Feedback para o usuário
            textResposta.style.color = "black"; // Volta para cor padrão
            textResposta.textContent = await InputAPIIA(textInput);
        } else {
            textResposta.textContent = "Por favor, digite algum texto para a IA.";
            textResposta.style.color = "orange";
        }

    } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error);
        textResposta.textContent = "Erro ao verificar seu status de login. Tente novamente mais tarde.";
        textResposta.style.color = "red";
    }
}
    




window.enviodeinput = enviodeinput; // Expose to global scope for onClick

function limparconversa() {
    let textResposta = document.getElementById("RespostaIA")
    textResposta.textContent = ""
}

window.limparconversa = limparconversa; // Expose to global scope for onClick
// Add this line for salvarconversa if it's in this file too
// window.salvarconversa = salvarconversa;