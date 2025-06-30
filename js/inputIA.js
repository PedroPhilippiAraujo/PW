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
    const client = new InferenceClient(huggingFaceApiKey); 


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
	let textInput = (document.getElementById("inputtext")).value
    

    if (textInput !== "") {
        let textResposta = document.getElementById("RespostaIA")
        // Await the asynchronous InputAPIIA call
        textResposta.textContent = await InputAPIIA(textInput) 
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