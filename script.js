function updateFinanciamento() {
    const valor = parseFloat(document.getElementById('valorImovel').value) || 0;
    const entrada = parseFloat(document.getElementById('entrada').value) || 0;
    const financiado = valor - entrada;
    document.getElementById('out-financiado').innerText = `€${financiado.toLocaleString('pt-PT')}`;
}

function calcularCredito() {
    const valorImovel = parseFloat(document.getElementById('valorImovel').value) || 0;
    const entrada = parseFloat(document.getElementById('entrada').value) || 0;
    const prazoAnos = parseFloat(document.getElementById('prazo').value) || 0;
    const spread = parseFloat(document.getElementById('spread').value) || 0;
    const euribor = parseFloat(document.getElementById('euribor').value) || 0;

    const montante = valorImovel - entrada;
    const taxaAnual = spread + euribor;
    const taxaMensal = (taxaAnual / 100) / 12;
    const numeroPrestacoes = prazoAnos * 12;

    if (montante > 0 && taxaMensal > 0 && numeroPrestacoes > 0) {
        // Fórmula de Sistema de Amortização Francês (Price)
        const prestacao = montante * (taxaMensal / (1 - Math.pow(1 + taxaMensal, -numeroPrestacoes)));
        const mtic = prestacao * numeroPrestacoes;

        document.getElementById('results').style.display = 'block';
        document.getElementById('out-prestacao').innerText = `€${prestacao.toFixed(2)}`;
        document.getElementById('out-financiado').innerText = `€${montante.toLocaleString('pt-PT')}`;
        document.getElementById('out-mtic').innerText = `€${mtic.toLocaleString('pt-PT', {minimumFractionDigits: 2})}`;
    } else if (taxaMensal === 0) {
        // Caso de taxa 0% (teórico)
        const prestacao = montante / numeroPrestacoes;
        document.getElementById('results').style.display = 'block';
        document.getElementById('out-prestacao').innerText = `€${prestacao.toFixed(2)}`;
    }
}

// Inicializar valor de financiamento ao carregar
window.onload = updateFinanciamento;
