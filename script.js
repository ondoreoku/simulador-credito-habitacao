// Função auxiliar para formatar valores em Euros (pt-PT)
function formatarMoeda(valor) {
    return parseFloat(valor).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}

// Função stub para evitar erros no console devido ao oninput do HTML
// (Podes remover o oninput do HTML se preferires, ou manter esta função vazia)
function updateFinanciamento() {
    // Lógica opcional de atualização em tempo real, se desejado no futuro
}

async function calcularCredito() {
    // 1. Capturar Inputs (IDs EXATOS do teu HTML)
    const valorImovel = parseFloat(document.getElementById('valorImovel').value) || 0;
    const entrada = parseFloat(document.getElementById('entrada').value) || 0;
    const prazoAnos = parseInt(document.getElementById('prazo').value) || 30; // ID no HTML é 'prazo'
    const spread = parseFloat(document.getElementById('spread').value) || 0;
    const euribor = parseFloat(document.getElementById('euribor').value) || 0;

    // Validação básica
    if (valorImovel <= 0 || prazoAnos <= 0) {
        alert("Por favor, preenche o valor do imóvel e o prazo corretamente.");
        return;
    }

    // 2. Preparar UI para "Loading"
    const btn = document.querySelector('.btn-main');
    const resultsDiv = document.getElementById('results');
    const textoOriginal = btn ? btn.innerText : 'Calcular Prestação';

    if (btn) {
        btn.disabled = true;
        btn.innerText = 'A processar no servidor...';
    }
    if (resultsDiv) resultsDiv.style.display = 'none';

    // 3. Construir Payload (Mapeando IDs do HTML para os nomes que a API/Python espera)
    const payload = {
        valor_imovel: valorImovel,
        entrada: entrada,
        prazo_anos: prazoAnos,      // O Python espera 'prazo_anos'
        spread: spread,
        euribor: euribor
    };

    // 4. Enviar para a API no Render
    try {
        const response = await fetch('https://calculadoras-portugal.onrender.com/api/credito', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Erro do servidor: ${response.status}`);
        }

        const data = await response.json();

        // 5. Atualizar o Ecrã com os resultados EXATOS do Python (credito.py)
        const elPrestacao = document.getElementById('out-prestacao');
        const elFinanciado = document.getElementById('out-financiado');
        const elMtic = document.getElementById('out-mtic');

        if (elPrestacao) elPrestacao.innerText = formatarMoeda(data.prestacao_mensal);
        if (elFinanciado) elFinanciado.innerText = formatarMoeda(data.montante_financiado);
        if (elMtic) elMtic.innerText = formatarMoeda(data.mtic);

        // Mostrar resultados e fazer scroll suave
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

    } catch (error) {
        console.error("Erro ao simular crédito:", error);
        alert("Ocorreu um erro ao contactar o servidor. Verifica a tua ligação e tenta novamente.");
    } finally {
        // 6. Restaurar o botão ao estado original
        if (btn) {
            btn.disabled = false;
            btn.innerText = textoOriginal;
        }
    }
}