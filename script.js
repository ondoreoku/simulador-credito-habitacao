let myChart;

function calcularCredito() {
    const capital = parseFloat(document.getElementById('capital').value) || 0;
    const prazoAnos = parseInt(document.getElementById('prazo').value) || 0;
    const taxaAnual = (parseFloat(document.getElementById('taxa').value) || 0) / 100;
    const extra = parseFloat(document.getElementById('extra').value) || 0;

    if (capital <= 0 || prazoAnos <= 0) return;

    const n = prazoAnos * 12;
    const i = taxaAnual / 12;

    // Prestação Mensal (Fórmula Francesa)
    const prestacao = capital * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const jurosTotais = (prestacao * n) - capital;

    document.getElementById('results').style.display = 'block';
    document.getElementById('out-prestacao').innerText = `€${prestacao.toFixed(2)}`;
    document.getElementById('out-juros').innerText = `€${jurosTotais.toFixed(2)}`;

    if (extra > 0) {
        const novoCapital = capital - extra;
        const novaPrestacao = novoCapital * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
        const poupancaMensal = prestacao - novaPrestacao;
        const poupancaJuros = (prestacao * n) - (novaPrestacao * n) - extra;

        document.getElementById('amortization-info').innerHTML = 
            `Amortização de €${extra.toLocaleString()}:<br>Nova Prestação: €${novaPrestacao.toFixed(2)} (-€${poupancaMensal.toFixed(2)}/mês)<br>Poupança total de juros: <strong>€${poupancaJuros.toFixed(2)}</strong>`;
    } else {
        document.getElementById('amortization-info').innerHTML = "Introduza um valor de amortização extra para ver a poupança.";
    }

    updateChart(capital, jurosTotais);
}

function updateChart(cap, jur) {
    const ctx = document.getElementById('savingsChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Capital', 'Juros'],
            datasets: [{ data: [cap, jur], backgroundColor: ['#059669', '#ef4444'] }]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
    });
}
