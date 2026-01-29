let myChart;

function calcularCredito() {
    const capital = parseFloat(document.getElementById('capital').value);
    const prazoAnos = parseInt(document.getElementById('prazo').value);
    const taxaAnual = parseFloat(document.getElementById('taxa').value) / 100;
    const extra = parseFloat(document.getElementById('extra').value) || 0;

    const n = prazoAnos * 12;
    const i = taxaAnual / 12;

    // Fórmula Francesa: PM = P * [i(1+i)^n] / [(1+i)^n - 1]
    const prestacao = capital * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const totalPagoSemExtra = prestacao * n;
    const jurosTotais = totalPagoSemExtra - capital;

    // Simulação com Amortização Extra (Simplificada para impacto imediato)
    const novoCapital = capital - extra;
    const novaPrestacao = novoCapital * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const poupancaMensal = prestacao - novaPrestacao;
    const poupancaJurosTotal = (prestacao * n) - (novaPrestacao * n) - extra;

    // Mostrar Resultados
    document.getElementById('results').style.display = 'block';
    document.getElementById('out-prestacao').innerText = `€${prestacao.toFixed(2)}`;
    document.getElementById('out-juros').innerText = `€${jurosTotais.toFixed(2)}`;

    if (extra > 0) {
        document.getElementById('amortization-info').innerHTML = 
            `Ao amortizar €${extra.toLocaleString()}, a sua prestação baixa <strong>€${poupancaMensal.toFixed(2)}</strong> por mês e poupa cerca de <strong>€${poupancaJurosTotal.toFixed(2)}</strong> em juros até ao fim do contrato!`;
    }

    renderChart(capital, jurosTotais);
}

function renderChart(capital, juros) {
    const ctx = document.getElementById('savingsChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Capital (Empréstimo)', 'Juros (Lucro do Banco)'],
            datasets: [{
                data: [capital, juros],
                backgroundColor: ['#059669', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Distribuição Total do Pagamento' }
            }
        }
    });
}
