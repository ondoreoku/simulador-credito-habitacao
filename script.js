// Função auxiliar para formatar moeda (pt-PT)
function formatarMoeda(valor) {
    return parseFloat(valor).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}

async function calcularCredito() {
    // 1. Capturar Inputs (⚠️ AJUSTA OS IDs AOS DO TEU HTML!)
    const valorImovel = parseFloat(document.getElementById('valorImovel').value) || 0;
    const entrada = parseFloat(document.getElementById('entrada').value) || 0;
    const prazoAnos = parseInt(document.getElementById('prazoAnos').value) || 30;
    const spread = parseFloat(document.getElementById('spread').value) || 0;
    const euribor = parseFloat(document.getElementById('euribor').value) || 0;

    // Validação básica
    if (valorImovel <= 0 || prazoAnos <= 0) {
        alert("Por favor, preenche o valor do imóvel e o prazo corretamente.");
        return;
    }

    // 2. UI Loading
    const btn = document.getElementById('btnCalcular'); // Ajusta o ID do teu botão
    const resultsDiv = document.getElementById('results'); // Ajusta o ID da div de resultados
    const textoOriginal = btn ? btn.innerHTML : 'Simular';

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A processar no servidor...';
    }
    if (resultsDiv) resultsDiv.style.display = 'none';

    // 3. Construir Payload
    const payload = {
        valor_imovel: valorImovel,
        entrada: entrada,
        prazo_anos: prazoAnos,
        spread: spread,
        euribor: euribor
    };

    // 4. Fetch à API
    try {
        const response = await fetch('https://calculadoras-portugal.onrender.com/api/credito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Erro do servidor: ${response.status}`);
        const data = await response.json();

        // 5. Atualizar o Ecrã (⚠️ AJUSTA OS IDs AOS DO TEU HTML!)
        // O teu HTML provavelmente tem IDs como 'outPrestacao', 'outMTIC', etc.
        // Substitui os IDs abaixo pelos que tens no teu index.html
        
        const elPrestacao = document.getElementById('outPrestacao');
        const elFinanciado = document.getElementById('outFinanciado');
        const elMTIC = document.getElementById('outMTIC');
        const elJuros = document.getElementById('outJuros');
        const elTaxa = document.getElementById('outTaxa');

        if (elPrestacao) elPrestacao.innerText = formatarMoeda(data.prestacao_mensal);
        if (elFinanciado) elFinanciado.innerText = formatarMoeda(data.montante_financiado);
        if (elMTIC) elMTIC.innerText = formatarMoeda(data.mtic);
        if (elJuros) elJuros.innerText = formatarMoeda(data.total_juros);
        if (elTaxa) elTaxa.innerText = `${data.taxa_anual}%`;

        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            window.scrollTo({ top: resultsDiv.offsetTop - 50, behavior: 'smooth' });
        }

    } catch (error) {
        console.error("Erro ao simular crédito:", error);
        alert("Erro ao contactar o servidor. Tenta novamente.");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = textoOriginal;
        }
    }
}