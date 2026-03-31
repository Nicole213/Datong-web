const materialImageThemes = {
    'WL-2024-001': { background: '#eef2ff', accent: '#4f46e5', secondary: '#c7d2fe' },
    'WL-2024-002': { background: '#ecfeff', accent: '#0891b2', secondary: '#a5f3fc' },
    'WL-2024-003': { background: '#f0fdf4', accent: '#16a34a', secondary: '#bbf7d0' },
    'WL-2024-004': { background: '#fff7ed', accent: '#ea580c', secondary: '#fed7aa' },
    'WL-2024-005': { background: '#fef2f2', accent: '#dc2626', secondary: '#fecaca' },
    'WL-2024-006': { background: '#eff6ff', accent: '#2563eb', secondary: '#bfdbfe' }
};

const now = Date.now();

const boardState = {
    inbound: {
        port: '入库口 01',
        containerCode: 'TP-018',
        arrivalTime: '08:16:23',
        meta: [
            { label: '关联入库单', value: 'RK-2026-0142' },
            { label: '上游单号', value: 'WMS-IN-20260331-0142' },
            { label: '容器类型', value: '标准钢托盘' },
            { label: '推荐物料种数', value: '3 种' }
        ],
        recommendations: [
            {
                code: 'WL-2024-001',
                name: '电子元件A型',
                qty: 24,
                note: '优先补入 A 区缓存位，可与当前托盘剩余空间匹配。'
            },
            {
                code: 'WL-2024-003',
                name: '塑料配件C型',
                qty: 36,
                note: '推荐分配至高频物料策略组，适配半托存储。'
            },
            {
                code: 'WL-2024-005',
                name: '金属材料E型',
                qty: 12,
                note: '建议与现有同料容器合并存储，减少碎片库位占用。'
            }
        ]
    },
    outbound: {
        port: '出库口 02',
        containerCode: 'TP-032',
        taskNo: 'TASK-OUT-20260331-028',
        meta: [
            { label: '关联波次', value: 'WAVE-20260331-05' },
            { label: '容器类型', value: '塑料托盘' },
            { label: '关联出库单数', value: '3 张' },
            { label: '本次需出库行数', value: '5 行' }
        ],
        materials: [
            {
                code: 'WL-2024-001',
                name: '电子元件A型',
                currentQty: 26,
                orders: [
                    { orderNo: 'CK-2026-0081', qty: 10 },
                    { orderNo: 'CK-2026-0088', qty: 8 }
                ]
            },
            {
                code: 'WL-2024-002',
                name: '机械零件B型',
                currentQty: 12,
                orders: []
            },
            {
                code: 'WL-2024-003',
                name: '塑料配件C型',
                currentQty: 40,
                orders: [
                    { orderNo: 'CK-2026-0085', qty: 18 }
                ]
            },
            {
                code: 'WL-2024-006',
                name: '电子芯片F型',
                currentQty: 16,
                orders: [
                    { orderNo: 'CK-2026-0091', qty: 6 },
                    { orderNo: 'CK-2026-0094', qty: 4 }
                ]
            }
        ]
    },
    alarms: [
        {
            level: 'critical',
            levelText: '持续报警',
            title: '堆垛机入库取货失败',
            detail: '1号巷道堆垛机在入库口 01 取货超时，容器未能成功上机，请人工复核容器姿态与托盘状态。',
            location: '入库口 01 / 1号巷道',
            containerCode: 'TP-018',
            planNo: 'RK-2026-0142',
            startedAt: new Date(now - 38 * 60 * 1000).toISOString()
        },
        {
            level: 'critical',
            levelText: '持续报警',
            title: '堆垛机入库失败',
            detail: '容器已到目标库位前，但入库确认信号未返回，系统已暂停该容器后续任务并保持报警。',
            location: '入库口 02 / B区深位',
            containerCode: 'TP-021',
            planNo: 'RK-2026-0148',
            startedAt: new Date(now - 21 * 60 * 1000).toISOString()
        },
        {
            level: 'warning',
            levelText: '待解除',
            title: '入库信息同步失败',
            detail: '入库完成回传客户 WMS 时接口响应超时，当前单据已自动进入重试队列，异常未解除前持续展示。',
            location: '接口服务 / WMS-IN',
            containerCode: 'TP-021',
            planNo: 'RK-2026-0148',
            startedAt: new Date(now - 12 * 60 * 1000).toISOString()
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    renderAlarms();
    renderInboundPanel();
    renderOutboundPanel();
    updateClock();

    setInterval(updateClock, 1000);
    setInterval(updateAlarmDurations, 60 * 1000);
});

function renderAlarms() {
    const alarmGrid = document.getElementById('alarmGrid');
    const alarmCount = document.getElementById('alarmCount');

    alarmCount.textContent = boardState.alarms.length;

    alarmGrid.innerHTML = boardState.alarms.map(alarm => `
        <article class="alarm-card ${alarm.level}" data-started-at="${alarm.startedAt}">
            <div class="alarm-topline">
                <span class="alarm-level ${alarm.level}">${alarm.levelText}</span>
                <span class="alarm-duration">${formatDuration(alarm.startedAt)}</span>
            </div>
            <div class="alarm-title">${alarm.title}</div>
            <div class="alarm-detail">${alarm.detail}</div>
            <div class="alarm-meta">
                <div class="alarm-meta-item">
                    <div class="alarm-meta-label">异常位置</div>
                    <div class="alarm-meta-value">${alarm.location}</div>
                </div>
                <div class="alarm-meta-item">
                    <div class="alarm-meta-label">关联容器</div>
                    <div class="alarm-meta-value">${alarm.containerCode}</div>
                </div>
                <div class="alarm-meta-item">
                    <div class="alarm-meta-label">关联单号</div>
                    <div class="alarm-meta-value">${alarm.planNo}</div>
                </div>
                <div class="alarm-meta-item">
                    <div class="alarm-meta-label">持续时长</div>
                    <div class="alarm-meta-value">${formatDuration(alarm.startedAt)}</div>
                </div>
            </div>
        </article>
    `).join('');
}

function renderInboundPanel() {
    document.getElementById('inboundPort').textContent = boardState.inbound.port;
    document.getElementById('inboundArrivalTime').textContent = boardState.inbound.arrivalTime;
    document.getElementById('inboundContainerCode').textContent = boardState.inbound.containerCode;

    document.getElementById('inboundMetaGrid').innerHTML = boardState.inbound.meta.map(item => `
        <div class="hero-meta-item">
            <div class="hero-meta-name">${item.label}</div>
            <div class="hero-meta-value">${item.value}</div>
        </div>
    `).join('');

    document.getElementById('inboundRecommendationGrid').innerHTML = boardState.inbound.recommendations.map(material => `
        <article class="recommend-card">
            <img class="recommend-image" src="${getMaterialImageUrl(material.code, material.name)}" alt="${escapeHtml(material.name)} 物料图片">
            <div class="recommend-name">${material.name}</div>
            <div class="recommend-code">${material.code}</div>
            <div class="recommend-qty">
                <span class="recommend-qty-label">推荐存储数量</span>
                <strong class="recommend-qty-value">${material.qty}</strong>
            </div>
            <div class="recommend-note">${material.note}</div>
        </article>
    `).join('');
}

function renderOutboundPanel() {
    document.getElementById('outboundPort').textContent = boardState.outbound.port;
    document.getElementById('outboundTaskNo').textContent = boardState.outbound.taskNo;
    document.getElementById('outboundContainerCode').textContent = boardState.outbound.containerCode;

    document.getElementById('outboundMetaGrid').innerHTML = boardState.outbound.meta.map(item => `
        <div class="hero-meta-item">
            <div class="hero-meta-name">${item.label}</div>
            <div class="hero-meta-value">${item.value}</div>
        </div>
    `).join('');

    document.getElementById('outboundDetailBody').innerHTML = boardState.outbound.materials
        .map(material => renderOutboundMaterialRows(material))
        .join('');
}

function renderOutboundMaterialRows(material) {
    const orders = material.orders.length > 0 ? material.orders : [{ orderNo: '', qty: '' }];
    const rowspan = orders.length;

    return orders.map((order, index) => `
        <tr>
            ${index === 0 ? `
                <td rowspan="${rowspan}">
                    <img class="table-material-thumb" src="${getMaterialImageUrl(material.code, material.name)}" alt="${escapeHtml(material.name)} 物料图片">
                </td>
                <td rowspan="${rowspan}">${material.code}</td>
                <td rowspan="${rowspan}">${material.name}</td>
                <td rowspan="${rowspan}"><span class="current-qty">${material.currentQty}</span></td>
            ` : ''}
            <td>${order.orderNo ? `<span class="order-tag">${order.orderNo}</span>` : '<span class="cell-empty"></span>'}</td>
            <td>${order.qty ? `<span class="qty-badge">${order.qty}</span>` : '<span class="cell-empty"></span>'}</td>
        </tr>
    `).join('');
}

function updateClock() {
    const nowDate = new Date();
    document.getElementById('boardTime').textContent = nowDate.toLocaleTimeString('zh-CN', { hour12: false });
    document.getElementById('boardDate').textContent = nowDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long'
    }).replace(/\//g, '.');
}

function updateAlarmDurations() {
    document.querySelectorAll('.alarm-card').forEach(card => {
        const startedAt = card.getAttribute('data-started-at');
        const durationText = formatDuration(startedAt);

        const topDuration = card.querySelector('.alarm-duration');
        if (topDuration) {
            topDuration.textContent = durationText;
        }

        const durationMeta = Array.from(card.querySelectorAll('.alarm-meta-item')).find(item => {
            return item.querySelector('.alarm-meta-label')?.textContent === '持续时长';
        });

        if (durationMeta) {
            const valueNode = durationMeta.querySelector('.alarm-meta-value');
            if (valueNode) {
                valueNode.textContent = durationText;
            }
        }
    });
}

function formatDuration(startedAt) {
    const minutes = Math.max(1, Math.floor((Date.now() - new Date(startedAt).getTime()) / 60000));
    const hours = Math.floor(minutes / 60);
    const restMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}小时 ${restMinutes}分钟`;
    }

    return `${minutes}分钟`;
}

function getMaterialImageTheme(materialCode) {
    return materialImageThemes[materialCode] || {
        background: '#e2e8f0',
        accent: '#475569',
        secondary: '#cbd5e1'
    };
}

function buildMaterialImageSvg(materialCode, materialName) {
    const theme = getMaterialImageTheme(materialCode);
    const titleText = escapeHtml(materialName || '物料图片');
    const codeText = escapeHtml(materialCode || 'MATERIAL');

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
            <rect width="320" height="320" rx="36" fill="${theme.background}"/>
            <circle cx="252" cy="66" r="34" fill="${theme.secondary}"/>
            <rect x="42" y="62" width="132" height="132" rx="24" fill="${theme.accent}" opacity="0.92"/>
            <rect x="72" y="92" width="72" height="72" rx="16" fill="#ffffff" opacity="0.92"/>
            <path d="M104 92v72M72 128h72" stroke="${theme.accent}" stroke-width="10" stroke-linecap="round" opacity="0.28"/>
            <rect x="42" y="214" width="236" height="18" rx="9" fill="${theme.secondary}" opacity="0.72"/>
            <text x="42" y="262" fill="#0f172a" font-size="28" font-family="Arial, sans-serif" font-weight="700">${titleText}</text>
            <text x="42" y="294" fill="${theme.accent}" font-size="20" font-family="Arial, sans-serif" font-weight="600">${codeText}</text>
        </svg>
    `.trim();
}

function getMaterialImageUrl(materialCode, materialName) {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(buildMaterialImageSvg(materialCode, materialName))}`;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return entities[char] || char;
    });
}
