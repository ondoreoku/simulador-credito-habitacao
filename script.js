let myChart;

function calcularCredito() {
    const capital = parseFloat(document.getElementById('capital').value) || 0;
    const prazoAnos = parseInt(document.getElementById('prazo').value) || 0;
    const taxaAnual = (parseFloat(document.getElementById('taxa').value) || 0) / 100;
    const extra = parseFloat(document.getElementById('extra').value) || 0;

    if (capital <= 0 || prazoAnos <= 0) return;

    const n = prazoAnos * 12;
    const i = taxaAnual / 12;

    const prestacao = capital * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const totalPagoOriginal = prestacao * n;
    const jurosOriginais = totalPagoOriginal - capital;

    document.getElementById('results').style.display = 'block';
    document.getElementById('out-prestacao').innerText = `€${prestacao.toFixed(2)}`;
    document.getElementById('out-juros').innerText = `€${jurosOriginais.toFixed(2)}`;

    if (extra > 0) {
        const novoCapital = capital - extra;
        const novaPrestacao = novoCapital * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
        const poupancaMensal = prestacao - novaPrestacao;
        const poupancaJuros = totalPagoOriginal - (novaPrestacao * n) - extra;

        document.getElementById('amortization-info').innerHTML = 
            `💰 <strong>Poupança Real:</strong> Ao amortizar €${extra.toLocaleString()}, a sua prestação baixa €${poupancaMensal.toFixed(2)} e poupa <strong>€${poupancaJuros.toFixed(2)}</strong> em juros!`;
    } else {
        document.getElementById('amortization-info').innerHTML = "Introduza um valor de amortização para ver o benefício.";
    }

    updateChart(capital, jurosOriginais);
}

function updateChart(cap, jur) {
    const ctx = document.getElementById('savingsChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Capital', 'Juros'],
            datasets: [{ data: [cap, jur], backgroundColor: ['#059669', '#ef4444'], hoverOffset: 4 }]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
    });
}
