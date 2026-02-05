// 首页图表初始化
document.addEventListener('DOMContentLoaded', function() {
    // 趋势图数据
    const trendData = {
        7: {
            labels: ['1/25', '1/26', '1/27', '1/28', '1/29', '1/30', '1/31'],
            inbound: [120, 135, 142, 128, 156, 148, 156],
            outbound: [98, 105, 118, 112, 125, 120, 128]
        },
        30: {
            labels: ['1/2', '1/5', '1/8', '1/11', '1/14', '1/17', '1/20', '1/23', '1/26', '1/29', '1/31'],
            inbound: [110, 125, 132, 128, 145, 138, 142, 135, 148, 152, 156],
            outbound: [95, 102, 108, 115, 120, 118, 122, 125, 120, 124, 128]
        }
    };

    let currentPeriod = 7;
    let trendChart = null;

    // 初始化趋势图
    function initTrendChart(period) {
        const ctx = document.getElementById('trendChart').getContext('2d');
        const data = trendData[period];

        if (trendChart) {
            trendChart.destroy();
        }

        trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: '入库数量',
                        data: data.inbound,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: '出库数量',
                        data: data.outbound,
                        borderColor: '#f093fb',
                        backgroundColor: 'rgba(240, 147, 251, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    // 初始化饼图
    function initStatusChart() {
        const ctx = document.getElementById('statusChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['有货库位', '空库位', '空托库位'],
                datasets: [{
                    data: [856, 324, 100],
                    backgroundColor: [
                        '#667eea',
                        '#43e97b',
                        '#ffa502'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    // 初始化图表
    initTrendChart(currentPeriod);
    initStatusChart();

    // 趋势图切换按钮
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const period = parseInt(this.getAttribute('data-period'));
            currentPeriod = period;
            initTrendChart(period);
        });
    });
});
