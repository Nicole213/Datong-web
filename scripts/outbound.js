// 出库单管理页面脚本

// 模拟数据
let outboundOrdersData = [
    {
        id: 1,
        orderNo: 'CK-2024-0001',
        source: '客户WMS同步',
        upstreamNo: 'WMS-OUT-20240115-001',
        type: '生产领料',
        materials: [
            { code: 'WL-2024-001', name: '电子元件A型', plannedQty: 80, outboundQty: 80, allocatedQty: 80 }
        ],
        status: '已完成',
        allocationStatus: '已分配',
        interfaceSyncStatus: '是',
        createTime: '2024-01-15 10:30:00',
        canEdit: false,
        canDelete: false,
        palletAllocationRecords: [
            {
                materialCode: 'WL-2024-001',
                materialName: '电子元件A型',
                containerCode: 'TP-001',
                locationCode: '1-1-5-1',
                allocatedQty: 80,
                allocator: '系统自动分配',
                allocateTime: '2024-01-15 10:35:00',
                status: '已出库',
                assignedPort: '出库口1',
                outboundTime: '2024-01-15 11:10:00'
            }
        ]
    },
    {
        id: 2,
        orderNo: 'CK-2024-0002',
        source: '手工创建',
        upstreamNo: '',
        type: '销售出库',
        materials: [
            { code: 'WL-2024-002', name: '机械零件B型', plannedQty: 40, outboundQty: 20, allocatedQty: 40 }
        ],
        status: '出库中',
        allocationStatus: '已分配',
        createTime: '2024-01-16 11:15:00',
        canEdit: false,
        canDelete: false,
        palletAllocationRecords: [
            {
                materialCode: 'WL-2024-002',
                materialName: '机械零件B型',
                containerCode: 'TP-003',
                locationCode: '1-3-8-1',
                allocatedQty: 20,
                allocator: '系统自动分配',
                allocateTime: '2024-01-16 11:20:00',
                status: '已出库',
                assignedPort: '出库口1',
                outboundTime: '2024-01-16 12:00:00'
            },
            {
                materialCode: 'WL-2024-002',
                materialName: '机械零件B型',
                containerCode: 'TP-002',
                locationCode: '1-2-5-1',
                allocatedQty: 20,
                allocator: '系统自动分配',
                allocateTime: '2024-01-16 11:20:00',
                status: '待出库',
                assignedPort: '出库口1'
            }
        ]
    },
    {
        id: 3,
        orderNo: 'CK-2024-0003',
        source: '手工创建',
        upstreamNo: 'SO-2024-003',
        type: '其他',
        materials: [
            { code: 'WL-2024-003', name: '塑料配件C型', plannedQty: 60, outboundQty: 0, allocatedQty: 0 }
        ],
        status: '待出库',
        allocationStatus: '待分配',
        createTime: '2024-01-17 15:20:00',
        canEdit: true,
        canDelete: true
    },
    {
        id: 4,
        orderNo: 'CK-2024-0004',
        source: '客户WMS同步',
        upstreamNo: 'WMS-OUT-20240118-002',
        type: '销售出库',
        materials: [
            { code: 'WL-2024-004', name: '长物料钢材D型', plannedQty: 25, outboundQty: 0, allocatedQty: 0 }
        ],
        status: '待出库',
        allocationStatus: '待分配',
        createTime: '2024-01-18 09:40:00',
        canEdit: false,
        canDelete: false
    },
    {
        id: 5,
        orderNo: 'CK-2024-0005',
        source: '手工创建',
        upstreamNo: 'SO-2024-005',
        type: '销售出库',
        materials: [
            { code: 'WL-2024-001', name: '电子元件A型', plannedQty: 20, outboundQty: 0, allocatedQty: 20 },
            { code: 'WL-2024-002', name: '机械零件B型', plannedQty: 8, outboundQty: 0, allocatedQty: 8 }
        ],
        status: '待出库',
        allocationStatus: '已分配',
        createTime: '2024-01-18 16:30:00',
        canEdit: false,
        canDelete: false,
        palletAllocationRecords: [
            {
                materialCode: 'WL-2024-001',
                materialName: '电子元件A型',
                containerCode: 'TP-001',
                locationCode: '1-1-5-1',
                allocatedQty: 20,
                allocator: '系统自动分配',
                allocateTime: '2024-01-18 16:35:00',
                status: '待出库',
                assignedPort: '出库口1'
            },
            {
                materialCode: 'WL-2024-002',
                materialName: '机械零件B型',
                containerCode: 'TP-001',
                locationCode: '1-1-5-1',
                allocatedQty: 8,
                allocator: '系统自动分配',
                allocateTime: '2024-01-18 16:35:00',
                status: '待出库',
                assignedPort: '出库口1'
            }
        ]
    },
    {
        id: 6,
        orderNo: 'CK-2024-0006',
        source: '手工创建',
        upstreamNo: 'SO-2024-006',
        type: '销售出库',
        materials: [
            { code: 'WL-2024-002', name: '机械零件B型', plannedQty: 10, outboundQty: 0, allocatedQty: 10 },
            { code: 'WL-2024-005', name: '金属材料E型', plannedQty: 12, outboundQty: 0, allocatedQty: 12 }
        ],
        status: '出库中',
        allocationStatus: '已分配',
        createTime: '2024-01-18 17:10:00',
        canEdit: false,
        canDelete: false,
        palletAllocationRecords: [
            {
                materialCode: 'WL-2024-002',
                materialName: '机械零件B型',
                containerCode: 'TP-002',
                locationCode: '1-2-5-1',
                allocatedQty: 10,
                allocator: '系统自动分配',
                allocateTime: '2024-01-18 17:15:00',
                status: '出库中',
                assignedPort: '出库口1',
                outboundTime: '2024-01-18 17:20:00'
            },
            {
                materialCode: 'WL-2024-005',
                materialName: '金属材料E型',
                containerCode: 'TP-002',
                locationCode: '1-2-5-1',
                allocatedQty: 12,
                allocator: '系统自动分配',
                allocateTime: '2024-01-18 17:15:00',
                status: '出库中',
                assignedPort: '出库口1',
                outboundTime: '2024-01-18 17:20:00'
            }
        ]
    }
];

// 系统物料数据（包含库存数量）
const systemMaterials = [
    { code: 'WL-2024-001', name: '电子元件A型', stockQty: 150 },
    { code: 'WL-2024-002', name: '机械零件B型', stockQty: 80 },
    { code: 'WL-2024-003', name: '塑料配件C型', stockQty: 200 },
    { code: 'WL-2024-004', name: '长物料钢材D型', stockQty: 45 },
    { code: 'WL-2024-005', name: '金属材料E型', stockQty: 120 }
];

const materialImageThemes = {
    'WL-2024-001': { background: '#eef2ff', accent: '#4f46e5', secondary: '#c7d2fe' },
    'WL-2024-002': { background: '#ecfeff', accent: '#0891b2', secondary: '#a5f3fc' },
    'WL-2024-003': { background: '#f0fdf4', accent: '#16a34a', secondary: '#bbf7d0' },
    'WL-2024-004': { background: '#fff7ed', accent: '#ea580c', secondary: '#fed7aa' },
    'WL-2024-005': { background: '#fef2f2', accent: '#dc2626', secondary: '#fecaca' }
};

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...outboundOrdersData];
let editingOrderId = null;
let materialCounter = 0;
let detailOrderId = null;
let forceCompleteOrderId = null;
let manualAllocatingOrderId = null;
let autoAllocatingOrderId = null;
let palletOutboundOrderId = null;
let currentAllocatingMaterial = null;
let allocationResults = [];
let selectedLocations = new Set();
let selectedOrders = new Set();
let batchAllocatingOrders = [];
let batchPalletOutboundOrders = [];
let batchSelectedMaterials = [];
let batchAllocatingPort = '';
let batchAllocationResults = [];

// 模拟库位数据（包含物料库存）
const locationInventory = [
    { locationCode: '1-1-5-1', containerCode: 'TP-001', materialCode: 'WL-2024-001', availableQty: 30, row: 1, col: 1, level: 5, depth: 1 },
    { locationCode: '1-2-5-1', containerCode: 'TP-002', materialCode: 'WL-2024-001', availableQty: 25, row: 1, col: 2, level: 5, depth: 1 },
    { locationCode: '1-3-8-1', containerCode: 'TP-003', materialCode: 'WL-2024-002', availableQty: 20, row: 1, col: 3, level: 8, depth: 1 },
    { locationCode: '2-1-6-1', containerCode: 'TP-004', materialCode: 'WL-2024-002', availableQty: 15, row: 2, col: 1, level: 6, depth: 1 },
    { locationCode: '2-5-10-1', containerCode: 'TP-005', materialCode: 'WL-2024-003', availableQty: 50, row: 2, col: 5, level: 10, depth: 1 },
    { locationCode: '3-2-7-1', containerCode: 'TP-006', materialCode: 'WL-2024-003', availableQty: 40, row: 3, col: 2, level: 7, depth: 1 },
    { locationCode: '1-8-12-2', containerCode: 'TP-007', materialCode: 'WL-2024-001', availableQty: 20, row: 1, col: 8, level: 12, depth: 2 },
    { locationCode: '2-4-9-1', containerCode: 'TP-008', materialCode: 'WL-2024-002', availableQty: 18, row: 2, col: 4, level: 9, depth: 1 },
    { locationCode: '4-2-6-1', containerCode: 'TP-009', materialCode: 'WL-2024-004', availableQty: 15, row: 4, col: 2, level: 6, depth: 1 },
    { locationCode: '4-3-6-1', containerCode: 'TP-010', materialCode: 'WL-2024-004', availableQty: 20, row: 4, col: 3, level: 6, depth: 1 },
    { locationCode: '5-1-4-1', containerCode: 'TP-011', materialCode: 'WL-2024-005', availableQty: 35, row: 5, col: 1, level: 4, depth: 1 }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('outboundTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(order => {
        const material = order.materials[0];
        const allocationStatus = getAllocationStatus(order);
        const interfaceSyncStatus = getInterfaceSyncStatus(order);
        const canAllocate = canAllocateOrder(order);
        const canTriggerPalletOutbound = canPalletOutbound(order);
        const canSelectForBatch = canAllocate || canBatchPalletOutboundOrder(order);
        const canVoid = order.source === '客户WMS同步' &&
                        allocationStatus === '待分配' &&
                        order.status === '待出库';
        
        return `
        <tr>
            <td><input type="checkbox" class="order-checkbox" value="${order.id}" ${canSelectForBatch ? '' : 'disabled'}></td>
            <td>${order.orderNo}</td>
            <td>
                <span class="source-badge ${order.source === '客户WMS同步' ? 'sync' : 'manual'}">
                    ${order.source}
                </span>
            </td>
            <td>${order.upstreamNo || '-'}</td>
            <td>${order.type}</td>
            <td>${material.code}</td>
            <td>${material.name}</td>
            <td>${material.plannedQty}</td>
            <td>${material.outboundQty}</td>
            <td>
                <span class="allocation-badge ${getAllocationStatusClass(allocationStatus)}">
                    ${allocationStatus}
                </span>
            </td>
            <td>
                <span class="status-badge ${getStatusClass(order.status)}">
                    ${order.status}
                </span>
            </td>
            <td>
                <span class="sync-status-badge ${getInterfaceSyncStatusClass(interfaceSyncStatus)}">
                    ${interfaceSyncStatus}
                </span>
            </td>
            <td>${order.createTime}</td>
            <td>
                <div class="action-btns">
                    ${canAllocate ? `<button class="detail-btn" onclick="openManualAllocate(${order.id})">手工分配</button>` : ''}
                    ${canAllocate ? `<button class="detail-btn" onclick="openAutoAllocate(${order.id})">自动分配</button>` : ''}
                    ${canTriggerPalletOutbound ? `<button class="outbound-btn" onclick="openPalletOutboundModal(${order.id})">托盘出库</button>` : ''}
                    <button class="detail-btn" onclick="showDetail(${order.id})">详情</button>
                    ${canEditOrder(order) ? `<button class="edit-btn" onclick="editOrder(${order.id})">编辑</button>` : ''}
                    ${order.canDelete ? `<button class="delete-btn" onclick="deleteOrder(${order.id})">删除</button>` : ''}
                    ${canVoid ? `<button class="void-btn" onclick="voidOrder(${order.id})">作废</button>` : ''}
                    ${isOutboundOrderActive(order) ? `<button class="force-btn" onclick="forceComplete(${order.id})">强制完成</button>` : ''}
                </div>
            </td>
        </tr>
    `}).join('');

    // 绑定复选框事件
    tbody.querySelectorAll('.order-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
            const id = parseInt(this.value);
            if (this.checked) {
                selectedOrders.add(id);
            } else {
                selectedOrders.delete(id);
            }
            updateSelectAllOrders();
        });
    });

    updatePagination();
}

// 获取状态样式类
function getStatusClass(status) {
    const statusMap = {
        '待出库': 'pending',
        '出库中': 'processing',
        '已完成': 'completed',
        '已作废': 'cancelled'
    };
    return statusMap[status] || 'pending';
}

function getAllocationStatus(order) {
    const hasAllocated = order.materials.some(m => (m.allocatedQty || 0) > 0);
    return order.allocationStatus || (hasAllocated ? '已分配' : '待分配');
}

function canEditOrder(order) {
    return !!order && getAllocationStatus(order) === '待分配';
}

function getAllocationStatusClass(status) {
    return status === '已分配' ? 'completed' : 'pending';
}

function getInterfaceSyncStatus(order) {
    if (order.status !== '已完成') {
        return '否';
    }

    return order.interfaceSyncStatus || '否';
}

function getInterfaceSyncStatusClass(status) {
    return status === '是' ? 'synced' : 'unsynced';
}

function getDetailInterfaceSyncStatus(order, taskRecord) {
    if (taskRecord?.status !== '已完成') {
        return '否';
    }

    if (order.status !== '已完成') {
        return '否';
    }

    return order.interfaceSyncStatus || '否';
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getMaterialImageTheme(materialCode) {
    return materialImageThemes[materialCode] || {
        background: '#f8fafc',
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
            <circle cx="254" cy="68" r="34" fill="${theme.secondary}"/>
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

function renderMaterialImageCell(materialCode, materialName) {
    if (!materialCode || materialCode === '-') {
        return '<span class="material-image-empty">-</span>';
    }

    const imageUrl = getMaterialImageUrl(materialCode, materialName);
    const imageAlt = escapeHtml(`${materialName || materialCode}物料图片`);

    return `
        <button
            type="button"
            class="material-image-trigger"
            data-material-code="${escapeHtml(materialCode)}"
            data-material-name="${escapeHtml(materialName || materialCode)}"
            title="点击查看大图"
        >
            <img class="material-image-thumb" src="${imageUrl}" alt="${imageAlt}">
        </button>
    `;
}

function openMaterialImagePreview(materialCode, materialName) {
    if (!materialCode || materialCode === '-') return;

    const viewer = document.getElementById('materialImageViewer');
    const viewerTitle = document.getElementById('materialImageViewerTitle');
    const viewerImg = document.getElementById('materialImageViewerImg');
    const title = materialName || materialCode;

    viewerTitle.textContent = `${title} 物料图片`;
    viewerImg.src = getMaterialImageUrl(materialCode, materialName);
    viewerImg.alt = `${title}物料图片`;
    viewer.classList.add('active');
}

function closeMaterialImagePreview() {
    const viewer = document.getElementById('materialImageViewer');
    const viewerImg = document.getElementById('materialImageViewerImg');

    viewer.classList.remove('active');
    viewerImg.src = '';
}

function normalizeOutboundPort(portName) {
    const normalized = String(portName || '').replace(/\s+/g, '').trim();

    if (!normalized) return '';
    if (normalized === '出库口1' || normalized === '1号出库口') return '出库口1';
    if (normalized === '出库口2' || normalized === '2号出库口') return '出库口2';

    return '';
}

function formatOutboundPortLabel(portName) {
    const normalized = normalizeOutboundPort(portName);

    if (normalized === '出库口1') return '1号出库口';
    if (normalized === '出库口2') return '2号出库口';

    return portName || '-';
}

function getPortMaterialCodes(port) {
    return normalizeOutboundPort(port) === '出库口1'
        ? ['WL-2024-001', 'WL-2024-002']
        : ['WL-2024-003', 'WL-2024-004', 'WL-2024-005'];
}

function getMaterialDefaultOutboundPort(materialCode) {
    return getPortMaterialCodes('出库口1').includes(materialCode) ? '出库口1' : '出库口2';
}

function isOutboundOrderActive(order) {
    return !!order && (order.status === '待出库' || order.status === '出库中');
}

function canAllocateOrder(order) {
    return isOutboundOrderActive(order) && getAllocationStatus(order) === '待分配';
}

function canPalletOutbound(order) {
    return isOutboundOrderActive(order) && getAllocationStatus(order) === '已分配';
}

function canBatchPalletOutboundOrder(order) {
    return !!order &&
        getAllocationStatus(order) === '已分配' &&
        ['待出库', '出库中', '已完成'].includes(order.status);
}

function getCurrentAllocateTime() {
    return new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\//g, '-');
}

function createAutoAllocationPlan(orders) {
    const inventoryState = locationInventory.map(loc => ({
        ...loc,
        remainingQty: Number(loc.availableQty || 0)
    }));
    const allocateTime = getCurrentAllocateTime();
    const plans = [];
    let totalAllocated = 0;
    let allocationCount = 0;

    orders.forEach(order => {
        const pendingMaterials = (order.materials || []).filter(material => {
            const pendingQty = Number(material.plannedQty || 0) - Number(material.allocatedQty || 0);
            return pendingQty > 0;
        });
        const materialAllocations = new Map();
        const allocations = [];
        let orderTotalAllocated = 0;
        let orderAllocationCount = 0;

        pendingMaterials.forEach(material => {
            let remaining = Number(material.plannedQty || 0) - Number(material.allocatedQty || 0);
            const assignedPort = getMaterialDefaultOutboundPort(material.code);

            inventoryState
                .filter(loc => loc.materialCode === material.code && loc.remainingQty > 0)
                .forEach(loc => {
                    if (remaining <= 0) return;

                    const allocateQty = Math.min(remaining, loc.remainingQty);
                    if (allocateQty <= 0) return;

                    loc.remainingQty -= allocateQty;
                    remaining -= allocateQty;
                    orderTotalAllocated += allocateQty;
                    orderAllocationCount += 1;
                    totalAllocated += allocateQty;
                    allocationCount += 1;
                    materialAllocations.set(
                        material.code,
                        (materialAllocations.get(material.code) || 0) + allocateQty
                    );

                    allocations.push({
                        materialCode: material.code,
                        materialName: material.name,
                        containerCode: loc.containerCode,
                        locationCode: loc.locationCode,
                        allocatedQty: allocateQty,
                        allocator: '系统自动分配',
                        allocateTime,
                        status: '待出库',
                        assignedPort
                    });
                });
        });

        plans.push({
            order,
            pendingMaterials,
            materialAllocations,
            allocations,
            orderTotalAllocated,
            orderAllocationCount
        });
    });

    return {
        plans,
        totalAllocated,
        allocationCount
    };
}

function applyAutoAllocationPlan(plan) {
    plan.plans.forEach(item => {
        if (item.orderTotalAllocated <= 0) {
            return;
        }

        item.materialAllocations.forEach((allocatedQty, materialCode) => {
            const material = item.order.materials.find(m => m.code === materialCode);
            if (material) {
                material.allocatedQty = (material.allocatedQty || 0) + allocatedQty;
            }
        });

        item.order.palletAllocationRecords = item.allocations;
        item.order.allocationStatus = '已分配';
        selectedOrders.delete(item.order.id);
    });
}

function createDefaultPalletAllocationRecords(order) {
    let fallbackIndex = 1;

    return (order.materials || []).flatMap((material, materialIndex) => {
        const allocatedQty = Number(material.allocatedQty || 0);
        const outboundQty = Math.min(Number(material.outboundQty || 0), allocatedQty);

        if (allocatedQty <= 0) {
            return [];
        }

        const assignedPort = getMaterialDefaultOutboundPort(material.code);
        const locationCandidates = locationInventory.filter(loc => loc.materialCode === material.code);
        const allocator = ['张三', '李四', '王五'][materialIndex % 3];
        const records = [];

        const buildRecord = (qty, status, candidateIndex) => {
            const candidate = locationCandidates[candidateIndex] || {};

            return {
                materialCode: material.code,
                materialName: material.name,
                containerCode: candidate.containerCode || `TP-${String(fallbackIndex++).padStart(3, '0')}`,
                locationCode: candidate.locationCode || '-',
                allocatedQty: qty,
                allocator,
                allocateTime: order.createTime,
                status,
                assignedPort
            };
        };

        if (outboundQty > 0) {
            records.push(buildRecord(outboundQty, '已出库', 0));
        }

        const pendingQty = allocatedQty - outboundQty;
        if (pendingQty > 0) {
            records.push(buildRecord(pendingQty, '待出库', 1));
        }

        return records;
    });
}

function ensurePalletAllocationRecords(order) {
    if (!Array.isArray(order.palletAllocationRecords)) {
        order.palletAllocationRecords = createDefaultPalletAllocationRecords(order);
    }

    return order.palletAllocationRecords;
}

function getPendingPalletOutboundRecords(order, port = '') {
    const targetPort = normalizeOutboundPort(port);

    return ensurePalletAllocationRecords(order).filter(record =>
        record.status === '待出库' &&
        (!targetPort || normalizeOutboundPort(record.assignedPort) === targetPort)
    );
}

function getExecutingSharedPallets(order) {
    const currentRecords = ensurePalletAllocationRecords(order);
    const currentContainerCodes = [...new Set(currentRecords
        .map(record => record.containerCode)
        .filter(Boolean))];

    return currentContainerCodes.filter(containerCode => {
        const relatedRecords = outboundOrdersData.flatMap(item =>
            ensurePalletAllocationRecords(item)
                .filter(record => record.containerCode === containerCode)
                .map(record => ({
                    orderId: item.id,
                    status: record.status
                }))
        );

        const isSharedPallet = new Set(relatedRecords.map(record => record.orderId)).size > 1;
        if (!isSharedPallet) {
            return false;
        }

        return relatedRecords.some(record => record.status === '出库中');
    });
}

function buildOutboundTaskRecords(order) {
    return ensurePalletAllocationRecords(order).map((record, index) => ({
        taskNo: `TASK-${order.orderNo}-${String(index + 1).padStart(3, '0')}`,
        orderNo: order.orderNo,
        containerCode: record.containerCode,
        materialText: `${record.materialCode} - ${record.materialName} × ${record.allocatedQty}`,
        materialCode: record.materialCode,
        materialName: record.materialName,
        pickLocation: record.locationCode,
        dropLocation: '-',
        pickPort: '-',
        dropPort: formatOutboundPortLabel(record.assignedPort),
        status: record.status === '已出库' ? '已完成' : record.status === '出库中' ? '执行中' : '待执行',
        statusClass: record.status === '已出库' ? 'completed' : record.status === '出库中' ? 'processing' : 'pending',
        createTime: record.allocateTime || order.createTime,
        startTime: record.allocateTime || order.createTime,
        finishTime: record.status === '已出库' ? (record.outboundTime || record.allocateTime || order.createTime) : '-'
    }));
}

// 更新分页
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages || 1;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

// 初始化事件监听
function initEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', searchOrders);
    document.getElementById('resetBtn').addEventListener('click', resetSearch);
    document.getElementById('addBtn').addEventListener('click', openAddModal);
    document.getElementById('batchAllocateBtn').addEventListener('click', openBatchAllocate);
    document.getElementById('selectAllOrders').addEventListener('change', toggleSelectAllOrders);
    
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    document.getElementById('saveBtn').addEventListener('click', saveOrder);
    document.getElementById('cancelBtn').addEventListener('click', closeAllModals);
    document.getElementById('addMaterialBtn').addEventListener('click', addMaterialItem);
    document.getElementById('detailClose').addEventListener('click', closeDetailModal);
    document.getElementById('detailCloseBtn').addEventListener('click', closeDetailModal);
    document.getElementById('detailModal').addEventListener('click', (e) => {
        const trigger = e.target.closest('.material-image-trigger');
        if (!trigger) return;

        openMaterialImagePreview(trigger.dataset.materialCode, trigger.dataset.materialName);
    });
    document.getElementById('materialImageViewerClose').addEventListener('click', closeMaterialImagePreview);
    document.getElementById('materialImageViewer').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeMaterialImagePreview();
        }
    });
    document.getElementById('forceClose').addEventListener('click', closeForceModal);
    document.getElementById('forceSaveBtn').addEventListener('click', saveForceComplete);
    document.getElementById('forceCancelBtn').addEventListener('click', closeForceModal);

    // 托盘出库
    document.getElementById('palletOutboundClose').addEventListener('click', closePalletOutboundModal);
    document.getElementById('palletOutboundConfirmBtn').addEventListener('click', confirmPalletOutbound);
    document.getElementById('palletOutboundCancelBtn').addEventListener('click', closePalletOutboundModal);
    document.getElementById('palletOutboundPort').addEventListener('change', () => handlePalletOutboundPortChange(true));

    // 批量托盘出库
    document.getElementById('batchPalletOutboundBtn').addEventListener('click', openBatchPalletOutboundModal);
    document.getElementById('batchPalletOutboundClose').addEventListener('click', closeBatchPalletOutboundModal);
    document.getElementById('confirmBatchPalletOutboundBtn').addEventListener('click', confirmBatchPalletOutbound);
    document.getElementById('batchPalletOutboundCancelBtn').addEventListener('click', closeBatchPalletOutboundModal);
    document.getElementById('batchPalletOutboundPort').addEventListener('change', () => handleBatchPalletOutboundPortChange(true));
    
    // 手工分配
    document.getElementById('manualAllocateClose').addEventListener('click', closeManualAllocateModal);
    document.getElementById('confirmManualAllocateBtn').addEventListener('click', confirmManualAllocate);
    document.getElementById('manualAllocateCancelBtn').addEventListener('click', closeManualAllocateModal);
    
    // 库位分配
    document.getElementById('locationAllocateClose').addEventListener('click', closeLocationAllocateModal);
    document.getElementById('confirmLocationAllocateBtn').addEventListener('click', confirmLocationAllocate);
    document.getElementById('locationAllocateCancelBtn').addEventListener('click', closeLocationAllocateModal);
    document.getElementById('searchLocationBtn').addEventListener('click', searchLocations);
    document.getElementById('resetLocationBtn').addEventListener('click', resetLocationSearch);
    document.getElementById('selectAllLocations').addEventListener('change', toggleSelectAllLocations);
    
    // 自动分配出库口选择
    document.getElementById('autoAllocatePortClose').addEventListener('click', closeAutoAllocatePortModal);
    document.getElementById('confirmAutoAllocateBtn').addEventListener('click', confirmAutoAllocate);
    document.getElementById('autoAllocatePortCancelBtn').addEventListener('click', closeAutoAllocatePortModal);

    // 批量自动分配确认
    document.getElementById('batchAutoAllocateClose').addEventListener('click', closeBatchAutoAllocateModal);
    document.getElementById('confirmBatchAutoAllocateBtn').addEventListener('click', confirmBatchAutoAllocate);
    document.getElementById('batchAutoAllocateCancelBtn').addEventListener('click', closeBatchAutoAllocateModal);
    
    // 合并订单确认
    document.getElementById('mergeOrderClose').addEventListener('click', closeMergeOrderModal);
    document.getElementById('confirmMergeOrderBtn').addEventListener('click', confirmMergeOrder);
    document.getElementById('mergeOrderCancelBtn').addEventListener('click', closeMergeOrderModal);
    document.getElementById('mergeOrderPort').addEventListener('change', renderMergeOrderMaterials);
    document.getElementById('selectAllMergeMaterials').addEventListener('change', toggleSelectAllMergeMaterials);
    
    // 批量分配
    document.getElementById('batchAllocateClose').addEventListener('click', closeBatchAllocateModal);
    document.getElementById('confirmBatchAllocateBtn').addEventListener('click', confirmBatchAllocate);
    document.getElementById('batchAllocateCancelBtn').addEventListener('click', closeBatchAllocateModal);
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
}

// 查询出库单
function searchOrders() {
    const orderNo = document.getElementById('searchOrderNo').value.trim().toLowerCase();
    const upstreamNo = document.getElementById('searchUpstreamNo').value.trim().toLowerCase();
    const materialCode = document.getElementById('searchMaterialCode').value.trim().toLowerCase();
    const status = document.getElementById('searchStatus').value;
    const source = document.getElementById('searchSource').value;
    const type = document.getElementById('searchType').value;
    const startDate = document.getElementById('searchStartDate').value;
    const endDate = document.getElementById('searchEndDate').value;
    
    filteredData = outboundOrdersData.filter(order => {
        const matchOrderNo = !orderNo || order.orderNo.toLowerCase().includes(orderNo);
        const matchUpstreamNo = !upstreamNo || order.upstreamNo.toLowerCase().includes(upstreamNo);
        const matchMaterialCode = !materialCode || order.materials.some(m => m.code.toLowerCase().includes(materialCode));
        const matchStatus = !status || order.status === status;
        const matchSource = !source || order.source === source;
        const matchType = !type || order.type === type;
        
        let matchDate = true;
        if (startDate || endDate) {
            const orderDate = order.createTime.split(' ')[0];
            if (startDate && orderDate < startDate) matchDate = false;
            if (endDate && orderDate > endDate) matchDate = false;
        }
        
        return matchOrderNo && matchUpstreamNo && matchMaterialCode && matchStatus && 
               matchSource && matchType && matchDate;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchOrderNo').value = '';
    document.getElementById('searchUpstreamNo').value = '';
    document.getElementById('searchMaterialCode').value = '';
    document.getElementById('searchStatus').value = '';
    document.getElementById('searchSource').value = '';
    document.getElementById('searchType').value = '';
    document.getElementById('searchStartDate').value = '';
    document.getElementById('searchEndDate').value = '';
    filteredData = [...outboundOrdersData];
    currentPage = 1;
    renderTable();
}

// 打开新增弹窗
function openAddModal() {
    editingOrderId = null;
    materialCounter = 0;
    document.getElementById('modalTitle').textContent = '新增出库单';
    document.getElementById('outboundForm').reset();
    
    const orderNo = generateOrderNo();
    document.getElementById('orderNo').value = orderNo;
    document.getElementById('materialList').innerHTML = '';
    
    document.getElementById('outboundModal').classList.add('active');
}

// 生成出库单号
function generateOrderNo() {
    const now = new Date();
    const year = now.getFullYear();
    const seq = String(outboundOrdersData.length + 1).padStart(4, '0');
    return `CK-${year}-${seq}`;
}

// 添加物料项
function addMaterialItem() {
    materialCounter++;
    const materialList = document.getElementById('materialList');
    const materialItem = document.createElement('div');
    materialItem.className = 'material-item';
    materialItem.dataset.id = materialCounter;
    
    materialItem.innerHTML = `
        <div class="material-item-header">
            <span class="material-item-title">物料 ${materialCounter}</span>
            <button type="button" class="remove-material-btn" onclick="removeMaterialItem(${materialCounter})">删除</button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="required">物料编码：</label>
                <div class="autocomplete-wrapper">
                    <input type="text" class="form-input material-code-search" required placeholder="请搜索物料编码" autocomplete="off">
                    <input type="hidden" class="material-code-value">
                    <div class="autocomplete-dropdown"></div>
                </div>
            </div>
            <div class="form-group">
                <label class="required">物料名称：</label>
                <div class="autocomplete-wrapper">
                    <input type="text" class="form-input material-name-search" required placeholder="请搜索物料名称" autocomplete="off">
                    <input type="hidden" class="material-name-value">
                    <div class="autocomplete-dropdown"></div>
                </div>
            </div>
            <div class="form-group">
                <label>当前库存数量：</label>
                <input type="text" class="form-input material-stock-qty" readonly placeholder="-" style="background: #f5f5f5;">
            </div>
            <div class="form-group">
                <label class="required">计划出库数量：</label>
                <input type="number" class="form-input material-qty" min="1" required placeholder="请输入数量">
            </div>
        </div>
    `;
    
    materialList.appendChild(materialItem);
    initMaterialAutocomplete(materialItem);
}

// 删除物料项
function removeMaterialItem(id) {
    const item = document.querySelector(`.material-item[data-id="${id}"]`);
    if (item) {
        item.remove();
    }
}

// 初始化物料自动完成
function initMaterialAutocomplete(materialItem) {
    const codeSearch = materialItem.querySelector('.material-code-search');
    const codeValue = materialItem.querySelector('.material-code-value');
    const codeDropdown = codeSearch.nextElementSibling.nextElementSibling;
    
    const nameSearch = materialItem.querySelector('.material-name-search');
    const nameValue = materialItem.querySelector('.material-name-value');
    const nameDropdown = nameSearch.nextElementSibling.nextElementSibling;
    
    const stockQtyInput = materialItem.querySelector('.material-stock-qty');
    
    codeSearch.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        if (!searchText) {
            codeDropdown.style.display = 'none';
            return;
        }
        
        const filtered = systemMaterials.filter(m => 
            m.code.toLowerCase().includes(searchText)
        );
        
        if (filtered.length > 0) {
            codeDropdown.innerHTML = filtered.map(m => 
                `<div class="autocomplete-item" data-code="${m.code}" data-name="${m.name}" data-stock="${m.stockQty}">
                    ${m.code} - ${m.name}
                </div>`
            ).join('');
            codeDropdown.style.display = 'block';
            
            codeDropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', function() {
                    const code = this.dataset.code;
                    const name = this.dataset.name;
                    const stock = this.dataset.stock;
                    
                    codeSearch.value = code;
                    codeValue.value = code;
                    nameSearch.value = name;
                    nameValue.value = name;
                    stockQtyInput.value = stock;
                    
                    codeDropdown.style.display = 'none';
                    nameDropdown.style.display = 'none';
                });
            });
        } else {
            codeDropdown.style.display = 'none';
        }
    });
    
    nameSearch.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        if (!searchText) {
            nameDropdown.style.display = 'none';
            return;
        }
        
        const filtered = systemMaterials.filter(m => 
            m.name.toLowerCase().includes(searchText)
        );
        
        if (filtered.length > 0) {
            nameDropdown.innerHTML = filtered.map(m => 
                `<div class="autocomplete-item" data-code="${m.code}" data-name="${m.name}" data-stock="${m.stockQty}">
                    ${m.code} - ${m.name}
                </div>`
            ).join('');
            nameDropdown.style.display = 'block';
            
            nameDropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', function() {
                    const code = this.dataset.code;
                    const name = this.dataset.name;
                    const stock = this.dataset.stock;
                    
                    codeSearch.value = code;
                    codeValue.value = code;
                    nameSearch.value = name;
                    nameValue.value = name;
                    stockQtyInput.value = stock;
                    
                    codeDropdown.style.display = 'none';
                    nameDropdown.style.display = 'none';
                });
            });
        } else {
            nameDropdown.style.display = 'none';
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!codeSearch.contains(e.target) && !codeDropdown.contains(e.target)) {
            codeDropdown.style.display = 'none';
        }
        if (!nameSearch.contains(e.target) && !nameDropdown.contains(e.target)) {
            nameDropdown.style.display = 'none';
        }
    });
}

// 编辑出库单
function editOrder(id) {
    const order = outboundOrdersData.find(o => o.id === id);
    if (!order) return;

    if (!canEditOrder(order)) {
        alert('仅待分配状态的出库单支持编辑！');
        return;
    }
    
    editingOrderId = id;
    materialCounter = 0;
    document.getElementById('modalTitle').textContent = '编辑出库单';
    document.getElementById('orderNo').value = order.orderNo;
    document.getElementById('orderType').value = order.type;
    document.getElementById('upstreamNo').value = order.upstreamNo || '';
    document.getElementById('orderRemark').value = order.remark || '';
    
    document.getElementById('materialList').innerHTML = '';
    order.materials.forEach(material => {
        addMaterialItem();
        const items = document.querySelectorAll('.material-item');
        const lastItem = items[items.length - 1];
        lastItem.querySelector('.material-code-search').value = material.code;
        lastItem.querySelector('.material-code-value').value = material.code;
        lastItem.querySelector('.material-name-search').value = material.name;
        lastItem.querySelector('.material-name-value').value = material.name;
        lastItem.querySelector('.material-qty').value = material.plannedQty;
        
        // 填充库存数量
        const materialData = systemMaterials.find(m => m.code === material.code);
        if (materialData) {
            lastItem.querySelector('.material-stock-qty').value = materialData.stockQty;
        }
    });
    
    document.getElementById('outboundModal').classList.add('active');
}

// 保存出库单
function saveOrder() {
    const orderNo = document.getElementById('orderNo').value.trim();
    const orderType = document.getElementById('orderType').value;
    const upstreamNo = document.getElementById('upstreamNo').value.trim();
    const orderRemark = document.getElementById('orderRemark').value.trim();
    
    if (!orderNo || !orderType) {
        alert('请填写所有必填项！');
        return;
    }
    
    const materialItems = document.querySelectorAll('.material-item');
    if (materialItems.length === 0) {
        alert('请至少添加一条物料明细！');
        return;
    }
    
    const materials = [];
    for (let item of materialItems) {
        const code = item.querySelector('.material-code-value').value.trim();
        const name = item.querySelector('.material-name-value').value.trim();
        const qty = parseInt(item.querySelector('.material-qty').value);
        
        if (!code || !name || !qty) {
            alert('请填写所有物料明细的必填项！');
            return;
        }
        
        materials.push({
            code,
            name,
            plannedQty: qty,
            outboundQty: 0,
            allocatedQty: 0
        });
    }
    
    if (editingOrderId) {
        const order = outboundOrdersData.find(o => o.id === editingOrderId);
        if (order) {
            order.type = orderType;
            order.upstreamNo = upstreamNo;
            order.remark = orderRemark;
            order.materials = materials;
            order.allocationStatus = order.allocationStatus || '待分配';
            order.interfaceSyncStatus = order.interfaceSyncStatus || '否';
        }
        alert('出库单已更新！');
    } else {
        const now = new Date();
        const createTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        const newOrder = {
            id: outboundOrdersData.length + 1,
            orderNo,
            source: '手工创建',
            upstreamNo,
            type: orderType,
            materials,
            status: '待出库',
            allocationStatus: '待分配',
            interfaceSyncStatus: '否',
            createTime,
            remark: orderRemark,
            canEdit: true,
            canDelete: true
        };
        outboundOrdersData.push(newOrder);
        alert('出库单添加成功！');
    }
    
    closeAllModals();
    searchOrders();
}

// 删除出库单
function deleteOrder(id) {
    const order = outboundOrdersData.find(o => o.id === id);
    if (!order) return;
    
    if (!order.canDelete) {
        alert('该出库单不可删除！');
        return;
    }
    
    if (confirm(`确定要删除出库单"${order.orderNo}"吗？`)) {
        outboundOrdersData = outboundOrdersData.filter(o => o.id !== id);
        selectedOrders.delete(id);
        alert('出库单已删除！');
        searchOrders();
    }
}

function voidOrder(id) {
    const order = outboundOrdersData.find(o => o.id === id);
    if (!order) return;

    const allocationStatus = getAllocationStatus(order);
    const canVoid = order.source === '客户WMS同步' &&
                    allocationStatus === '待分配' &&
                    order.status === '待出库';

    if (!canVoid) {
        alert('该出库单当前不可作废！');
        return;
    }

    if (confirm(`确定要作废出库单"${order.orderNo}"吗？`)) {
        order.status = '已作废';
        order.canEdit = false;
        order.canDelete = false;
        selectedOrders.delete(id);
        alert('出库单已作废！');
        searchOrders();
    }
}

// 显示详情
function showDetail(id) {
    detailOrderId = id;
    const order = outboundOrdersData.find(o => o.id === id);
    if (!order) return;
    const allocationRecords = ensurePalletAllocationRecords(order);
    const taskRecords = buildOutboundTaskRecords(order);
    const primaryMaterial = order.materials[0] || null;
    const primaryMaterialCode = primaryMaterial ? primaryMaterial.code : '-';
    const primaryMaterialName = primaryMaterial ? primaryMaterial.name : '-';
    const primaryMaterialText = primaryMaterial
        ? `${primaryMaterial.code} - ${primaryMaterial.name}`
        : '空物料';
    
    document.getElementById('detailOrderNo').textContent = order.orderNo;
    document.getElementById('detailSource').textContent = order.source;
    document.getElementById('detailType').textContent = order.type;
    document.getElementById('detailStatus').innerHTML = `<span class="status-badge ${getStatusClass(order.status)}">${order.status}</span>`;
    
    const materialBody = document.getElementById('detailMaterialBody');
    materialBody.innerHTML = order.materials.map(m => `
        <tr>
            <td>${m.code}</td>
            <td>${m.name}</td>
            <td>${m.plannedQty}</td>
            <td>${m.allocatedQty || 0}</td>
            <td>${m.outboundQty || 0}</td>
        </tr>
    `).join('');
    
    const allocationBody = document.getElementById('detailAllocationBody');
    allocationBody.innerHTML = allocationRecords.length > 0
        ? allocationRecords.map(record => `
            <tr>
                <td>${record.materialCode}</td>
                <td>${record.materialName}</td>
                <td>${renderMaterialImageCell(record.materialCode, record.materialName)}</td>
                <td>${record.containerCode}</td>
                <td>${record.locationCode}</td>
                <td>${record.allocatedQty}</td>
                <td>${record.allocator || '-'}</td>
                <td>${record.allocateTime || '-'}</td>
                <td><span class="status-badge ${record.status === '已出库' ? 'completed' : record.status === '出库中' ? 'processing' : 'pending'}">${record.status}</span></td>
            </tr>
        `).join('')
        : `
            <tr class="detail-empty-row">
                <td colspan="9">暂无分配明细</td>
            </tr>
        `;

    const taskBody = document.getElementById('detailTaskBody');
    taskBody.innerHTML = taskRecords.length > 0
        ? taskRecords.map(task => `
            <tr>
                <td>${task.taskNo}</td>
                <td>${task.orderNo}</td>
                <td><span class="command-badge outbound">出库</span></td>
                <td><span class="task-type-badge">普通出库</span></td>
                <td>${task.containerCode}</td>
                <td>${task.materialText}</td>
                <td>${task.pickLocation}</td>
                <td>${task.dropLocation}</td>
                <td>${task.pickPort}</td>
                <td>${task.dropPort}</td>
                <td><span class="status-badge ${task.statusClass}">${task.status}</span></td>
                <td>${task.createTime}</td>
                <td>${task.startTime}</td>
                <td>${task.finishTime}</td>
            </tr>
        `).join('')
        : `
            <tr class="detail-empty-row">
                <td colspan="14">暂无出库任务</td>
            </tr>
        `;

    const interfaceSyncBody = document.getElementById('detailInterfaceSyncBody');
    const interfaceSyncRecords = taskRecords.map((task, index) => ({
        rowId: index + 1,
        materialCode: task.materialCode,
        materialName: task.materialName,
        palletCode: task.containerCode,
        outboundLocation: task.pickLocation,
        interfaceSyncStatus: getDetailInterfaceSyncStatus(order, task)
    }));
    interfaceSyncBody.innerHTML = interfaceSyncRecords.length > 0
        ? interfaceSyncRecords.map(record => `
            <tr>
                <td>${record.rowId}</td>
                <td>${record.materialCode}</td>
                <td>${record.materialName}</td>
                <td>${record.palletCode}</td>
                <td>${record.outboundLocation}</td>
                <td>
                    <span class="sync-status-badge ${getInterfaceSyncStatusClass(record.interfaceSyncStatus)}">
                        ${record.interfaceSyncStatus}
                    </span>
                </td>
            </tr>
        `).join('')
        : `
            <tr class="detail-empty-row">
                <td colspan="6">暂无接口同步明细</td>
            </tr>
        `;
    
    document.getElementById('detailModal').classList.add('active');
}

// 强制完成
function forceComplete(id) {
    forceCompleteOrderId = id;
    document.getElementById('forceReason').value = '';
    document.getElementById('forceCompleteModal').classList.add('active');
}

// 保存强制完成
function saveForceComplete() {
    const reason = document.getElementById('forceReason').value.trim();
    
    if (!reason) {
        alert('请填写完成原因！');
        return;
    }
    
    const order = outboundOrdersData.find(o => o.id === forceCompleteOrderId);
    if (order) {
        order.status = '已完成';
        order.canEdit = false;
        order.canDelete = false;
        order.interfaceSyncStatus = order.interfaceSyncStatus || '否';
        order.forceCompleteReason = reason;
        alert('出库单已强制完成！');
        closeForceModal();
        renderTable();
    }
}

// 关闭详情弹窗
function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
    closeMaterialImagePreview();
    detailOrderId = null;
}

// 关闭强制完成弹窗
function closeForceModal() {
    document.getElementById('forceCompleteModal').classList.remove('active');
    forceCompleteOrderId = null;
}

function setPalletOutboundTip(message, type = 'default') {
    const tip = document.getElementById('palletOutboundTip');
    tip.className = 'port-outbound-tip';

    if (type === 'warning' || type === 'success') {
        tip.classList.add(type);
    }

    tip.textContent = message;
}

function resetPalletOutboundForm() {
    document.getElementById('palletOutboundOrderNo').textContent = '-';
    document.getElementById('palletOutboundPort').value = '';
    setPalletOutboundTip('请选择出库口后确认需要出库的托盘');
}

function setBatchPalletOutboundTip(message, type = 'default') {
    const tip = document.getElementById('batchPalletOutboundTip');
    tip.className = 'port-outbound-tip';

    if (type === 'warning' || type === 'success') {
        tip.classList.add(type);
    }

    tip.textContent = message;
}

function resetBatchPalletOutboundForm() {
    document.getElementById('batchPalletOutboundOrderText').textContent = '-';
    document.getElementById('batchPalletOutboundPort').value = '';
    document.getElementById('batchSharedPalletHead').innerHTML = '<th>容器编码</th>';
    document.getElementById('batchSharedPalletBody').innerHTML = '';
    setBatchPalletOutboundTip('请选择出库口后确认需要出库的托盘');
}

function openPalletOutboundModal(id) {
    const order = outboundOrdersData.find(o => o.id === id);
    if (!order) return;

    if (!canPalletOutbound(order)) {
        alert('该出库单当前不可进行托盘出库！');
        return;
    }

    const executingSharedPallets = getExecutingSharedPallets(order);
    if (executingSharedPallets.length > 0) {
        alert(`该出库单存在托盘${executingSharedPallets.join('、')}正在执行任务，无法进行托盘出库操作，请稍后再试。`);
        return;
    }

    palletOutboundOrderId = id;
    const allocationRecords = ensurePalletAllocationRecords(order);
    const relatedPorts = [...new Set(allocationRecords
        .map(record => normalizeOutboundPort(record.assignedPort))
        .filter(Boolean))];

    document.getElementById('palletOutboundOrderNo').textContent = order.orderNo;
    document.getElementById('palletOutboundPort').value = relatedPorts.length === 1 ? relatedPorts[0] : '';
    handlePalletOutboundPortChange(false);
    document.getElementById('palletOutboundModal').classList.add('active');
}

function handlePalletOutboundPortChange(showAlert = true) {
    const port = normalizeOutboundPort(document.getElementById('palletOutboundPort').value);
    const order = outboundOrdersData.find(o => o.id === palletOutboundOrderId);

    if (!port) {
        setPalletOutboundTip('请选择出库口后确认需要出库的托盘');
        return;
    }

    if (!order) {
        setPalletOutboundTip('未找到对应的出库单信息，请重新选择。', 'warning');
        return;
    }

    const pendingRecords = getPendingPalletOutboundRecords(order, port);
    if (pendingRecords.length === 0) {
        setPalletOutboundTip('该出库口没有需要出库的托盘。', 'warning');

        if (showAlert) {
            alert('该出库口没有需要出库的托盘。');
        }
        return;
    }

    setPalletOutboundTip(`该出库口待出库托盘数：${pendingRecords.length}`, 'success');
}

function renderBatchPalletOutboundOrderList() {
    const orderText = document.getElementById('batchPalletOutboundOrderText');
    orderText.textContent = batchPalletOutboundOrders.map(order => order.orderNo).join('、') || '-';
}

function getBatchPalletPendingRecords(port = '') {
    return batchPalletOutboundOrders.flatMap(order =>
        getPendingPalletOutboundRecords(order, port).map(record => ({
            record,
            orderId: order.id,
            orderNo: order.orderNo,
            containerCode: record.containerCode
        }))
    );
}

function getUniqueContainerCount(records) {
    return new Set(records.map(record => record.containerCode).filter(Boolean)).size;
}

function getSharedPalletGroups(orders, port = '') {
    const targetPort = normalizeOutboundPort(port);
    const palletMap = new Map();

    orders.forEach(order => {
        ensurePalletAllocationRecords(order)
            .filter(record => !targetPort || normalizeOutboundPort(record.assignedPort) === targetPort)
            .forEach(record => {
                if (!record.containerCode) return;

                if (!palletMap.has(record.containerCode)) {
                    palletMap.set(record.containerCode, {
                        containerCode: record.containerCode,
                        orderNos: new Set(),
                        orderMaterials: new Map()
                    });
                }

                const group = palletMap.get(record.containerCode);
                group.orderNos.add(order.orderNo);
                if (!group.orderMaterials.has(order.orderNo)) {
                    group.orderMaterials.set(order.orderNo, new Set());
                }
                group.orderMaterials.get(order.orderNo).add(`${record.materialName} × ${record.allocatedQty}`);
            });
    });

    return Array.from(palletMap.values())
        .filter(group => group.orderNos.size > 1)
        .map(group => ({
            containerCode: group.containerCode,
            orderNos: Array.from(group.orderNos),
            orderMaterials: Object.fromEntries(
                Array.from(group.orderMaterials.entries()).map(([orderNo, materials]) => [
                    orderNo,
                    Array.from(materials)
                ])
            )
        }));
}

function renderBatchSharedPalletInfo(port = '') {
    const head = document.getElementById('batchSharedPalletHead');
    const body = document.getElementById('batchSharedPalletBody');
    const groups = getSharedPalletGroups(batchPalletOutboundOrders, port);
    const relatedOrderNos = Array.from(new Set(groups.flatMap(group => group.orderNos)));

    head.innerHTML = `
        <th>容器编码</th>
        ${relatedOrderNos.map(orderNo => `<th>${escapeHtml(orderNo)}</th>`).join('')}
    `;

    if (groups.length === 0 || relatedOrderNos.length === 0) {
        head.innerHTML = '<th>容器编码</th>';
        body.innerHTML = `
            <tr class="detail-empty-row">
                <td class="shared-pallet-empty-text" colspan="1">当前所选出库单不存在共用托盘，或所选出库口下没有共用托盘。</td>
            </tr>
        `;
        return;
    }

    body.innerHTML = groups.map(group => `
        <tr>
            <td>${escapeHtml(group.containerCode)}</td>
            ${relatedOrderNos.map(orderNo => `
                <td>
                    ${group.orderMaterials[orderNo]
                        ? `<div class="shared-pallet-cell">${group.orderMaterials[orderNo]
                            .map(material => `<div class="shared-pallet-material-line">${escapeHtml(material)}</div>`)
                            .join('')}</div>`
                        : '-'}
                </td>
            `).join('')}
        </tr>
    `).join('');
}

function openBatchPalletOutboundModal() {
    if (selectedOrders.size === 0) {
        alert('请至少选择一个出库单！');
        return;
    }

    const orders = outboundOrdersData.filter(order => selectedOrders.has(order.id));
    const invalidOrders = orders.filter(order => !canBatchPalletOutboundOrder(order));

    if (invalidOrders.length > 0) {
        alert('所选订单中包含不满足条件的订单！\n请确保所选订单分配状态为"已分配"，且状态为"待出库"、"出库中"或"已完成"。');
        return;
    }

    batchPalletOutboundOrders = orders;
    renderBatchPalletOutboundOrderList();
    document.getElementById('batchPalletOutboundPort').value = '';
    renderBatchSharedPalletInfo();
    setBatchPalletOutboundTip('请选择出库口后确认需要出库的托盘');
    document.getElementById('batchPalletOutboundModal').classList.add('active');
}

function handleBatchPalletOutboundPortChange(showAlert = true) {
    const port = normalizeOutboundPort(document.getElementById('batchPalletOutboundPort').value);

    if (!port) {
        renderBatchSharedPalletInfo();
        setBatchPalletOutboundTip('请选择出库口后确认需要出库的托盘');
        return;
    }

    const pendingRecords = getBatchPalletPendingRecords(port);
    renderBatchSharedPalletInfo(port);

    if (pendingRecords.length === 0) {
        setBatchPalletOutboundTip('该出库口没有需要出库的托盘。', 'warning');

        if (showAlert) {
            alert('该出库口没有需要出库的托盘。');
        }
        return;
    }

    setBatchPalletOutboundTip(`该出库口待出库托盘数：${getUniqueContainerCount(pendingRecords)}`, 'success');
}

function confirmBatchPalletOutbound() {
    const port = normalizeOutboundPort(document.getElementById('batchPalletOutboundPort').value);

    if (!port) {
        alert('请选择出库口！');
        return;
    }

    if (batchPalletOutboundOrders.length === 0) {
        alert('请至少选择一个出库单！');
        return;
    }

    const pendingRecords = getBatchPalletPendingRecords(port);
    if (pendingRecords.length === 0) {
        setBatchPalletOutboundTip('该出库口没有需要出库的托盘。', 'warning');
        alert('该出库口没有需要出库的托盘。');
        return;
    }

    const triggeredOrderIds = new Set(pendingRecords.map(record => record.orderId));
    const now = getCurrentAllocateTime();
    pendingRecords.forEach(record => {
        record.record.status = '出库中';
        record.record.outboundTime = now;
    });

    batchPalletOutboundOrders.forEach(order => {
        if (triggeredOrderIds.has(order.id) && order.status === '待出库') {
            order.status = '出库中';
        }
        selectedOrders.delete(order.id);
    });

    alert(`批量托盘出库已成功触发！\n\n出库单数：${triggeredOrderIds.size}\n出库口：${port}\n托盘数量：${getUniqueContainerCount(pendingRecords)}`);

    closeBatchPalletOutboundModal();
    searchOrders();
}

function confirmPalletOutbound() {
    const port = normalizeOutboundPort(document.getElementById('palletOutboundPort').value);

    if (!port) {
        alert('请选择出库口！');
        return;
    }

    const order = outboundOrdersData.find(o => o.id === palletOutboundOrderId);
    if (!order) return;

    const pendingRecords = getPendingPalletOutboundRecords(order, port);
    if (pendingRecords.length === 0) {
        setPalletOutboundTip('该出库口没有需要出库的托盘。', 'warning');
        alert('该出库口没有需要出库的托盘。');
        return;
    }

    const now = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\//g, '-');

    pendingRecords.forEach(record => {
        record.status = '出库中';
        record.outboundTime = now;
    });

    if (order.status === '待出库') {
        order.status = '出库中';
    }

    selectedOrders.delete(order.id);

    alert(`托盘出库已成功触发！\n\n出库单号：${order.orderNo}\n出库口：${port}\n托盘数量：${pendingRecords.length}`);

    closePalletOutboundModal();
    searchOrders();
}

function closePalletOutboundModal() {
    document.getElementById('palletOutboundModal').classList.remove('active');
    palletOutboundOrderId = null;
    resetPalletOutboundForm();
}

function closeBatchPalletOutboundModal() {
    document.getElementById('batchPalletOutboundModal').classList.remove('active');
    batchPalletOutboundOrders = [];
    resetBatchPalletOutboundForm();
}

// 关闭所有弹窗
function closeAllModals() {
    document.getElementById('outboundModal').classList.remove('active');
    document.getElementById('detailModal').classList.remove('active');
    document.getElementById('forceCompleteModal').classList.remove('active');
    document.getElementById('manualAllocateModal').classList.remove('active');
    document.getElementById('locationAllocateModal').classList.remove('active');
    document.getElementById('autoAllocatePortModal').classList.remove('active');
    document.getElementById('batchAutoAllocateModal').classList.remove('active');
    document.getElementById('palletOutboundModal').classList.remove('active');
    document.getElementById('batchPalletOutboundModal').classList.remove('active');
    document.getElementById('mergeOrderModal').classList.remove('active');
    document.getElementById('batchAllocateModal').classList.remove('active');
    resetPalletOutboundForm();
    resetBatchPalletOutboundForm();
    closeMaterialImagePreview();
    editingOrderId = null;
    detailOrderId = null;
    forceCompleteOrderId = null;
    manualAllocatingOrderId = null;
    autoAllocatingOrderId = null;
    palletOutboundOrderId = null;
    currentAllocatingMaterial = null;
    allocationResults = [];
    selectedLocations.clear();
    batchAllocatingOrders = [];
    batchPalletOutboundOrders = [];
    batchSelectedMaterials = [];
    batchAllocatingPort = '';
    batchAllocationResults = [];
}

// 打开手工分配弹窗
function openManualAllocate(id) {
    const order = outboundOrdersData.find(o => o.id === id);
    if (!order) return;

    if (!canAllocateOrder(order)) {
        alert('该出库单当前不可进行手工分配！');
        return;
    }

    manualAllocatingOrderId = id;
    allocationResults = [];
    
    document.getElementById('manualAllocateOrderNo').textContent = order.orderNo;
    document.getElementById('manualResultBody').innerHTML = '';
    renderManualDemand();

    document.getElementById('manualAllocateModal').classList.add('active');
}

// 渲染订单需求列表
function renderManualDemand() {
    const order = outboundOrdersData.find(o => o.id === manualAllocatingOrderId);
    if (!order) {
        document.getElementById('manualDemandBody').innerHTML = '';
        return;
    }

    const filteredMaterials = order.materials.filter(m => {
        const pendingQty = Number(m.plannedQty || 0) - Number(m.outboundQty || 0);
        return pendingQty > 0;
    });
    
    const tbody = document.getElementById('manualDemandBody');

    if (filteredMaterials.length === 0) {
        tbody.innerHTML = `
            <tr class="detail-empty-row">
                <td colspan="7">暂无待分配物料</td>
            </tr>
        `;
        renderAllocationResults();
        return;
    }

    tbody.innerHTML = filteredMaterials.map(m => {
        const pendingQty = m.plannedQty - (m.outboundQty || 0);
        return `
        <tr>
            <td>${m.code}</td>
            <td>${m.name}</td>
            <td>${m.plannedQty}</td>
            <td>${m.outboundQty || 0}</td>
            <td>${pendingQty}</td>
            <td>${m.allocatedQty || 0}</td>
            <td>
                <button class="detail-btn" onclick="openLocationAllocate('${m.code}', '${m.name}', ${pendingQty})">库位分配</button>
            </td>
        </tr>
    `}).join('');
    
    renderAllocationResults();
}

// 渲染分配结果列表
function renderAllocationResults() {
    const tbody = document.getElementById('manualResultBody');
    tbody.innerHTML = allocationResults.map((result, index) => `
        <tr>
            <td>${result.materialCode}</td>
            <td>${result.materialName}</td>
            <td>${result.containerCode}</td>
            <td>${result.allocatedQty}</td>
            <td>
                <button class="delete-btn" onclick="removeAllocationResult(${index})">取消分配</button>
            </td>
        </tr>
    `).join('');
}

// 移除分配结果
function removeAllocationResult(index) {
    allocationResults.splice(index, 1);
    renderAllocationResults();
}

// 打开库位分配弹窗
function openLocationAllocate(materialCode, materialName, pendingQty) {
    currentAllocatingMaterial = { code: materialCode, name: materialName, pendingQty: pendingQty };
    selectedLocations.clear();
    
    document.getElementById('locationMaterialCode').textContent = materialCode;
    document.getElementById('locationMaterialName').textContent = materialName;
    document.getElementById('locationPendingQty').textContent = pendingQty;
    
    // 重置搜索条件
    document.getElementById('searchRow').value = '';
    document.getElementById('searchCol').value = '';
    document.getElementById('searchLevel').value = '';
    document.getElementById('searchDepth').value = '';
    
    renderLocationList();
    document.getElementById('locationAllocateModal').classList.add('active');
}

// 渲染库位列表
function renderLocationList() {
    if (!currentAllocatingMaterial) return;
    
    const row = document.getElementById('searchRow').value.trim();
    const col = document.getElementById('searchCol').value.trim();
    const level = document.getElementById('searchLevel').value.trim();
    const depth = document.getElementById('searchDepth').value.trim();
    
    // 筛选符合条件的库位
    let filtered = locationInventory.filter(loc => 
        loc.materialCode === currentAllocatingMaterial.code
    );
    
    if (row) filtered = filtered.filter(loc => loc.row === parseInt(row));
    if (col) filtered = filtered.filter(loc => loc.col === parseInt(col));
    if (level) filtered = filtered.filter(loc => loc.level === parseInt(level));
    if (depth) filtered = filtered.filter(loc => loc.depth === parseInt(depth));
    
    // 计算最大可分配数量（取库位可用数量和待出数量的较小值）
    const pendingQty = currentAllocatingMaterial.pendingQty || 0;
    
    const tbody = document.getElementById('locationListBody');
    tbody.innerHTML = filtered.map(loc => {
        const maxQty = Math.min(loc.availableQty, pendingQty);
        return `
            <tr>
                <td><input type="checkbox" class="location-checkbox" value="${loc.locationCode}" data-container="${loc.containerCode}" data-qty="${loc.availableQty}"></td>
                <td>${loc.locationCode}</td>
                <td>${loc.containerCode}</td>
                <td>${loc.availableQty}</td>
                <td><input type="number" class="form-input allocate-qty-input" data-location="${loc.locationCode}" data-max="${maxQty}" min="1" max="${maxQty}" placeholder="请输入数量" style="width: 100px;"></td>
            </tr>
        `;
    }).join('');
    
    // 绑定复选框事件
    tbody.querySelectorAll('.location-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
            if (this.checked) {
                selectedLocations.add(this.value);
            } else {
                selectedLocations.delete(this.value);
            }
            updateSelectAllLocations();
        });
    });
    
    // 绑定数量输入框验证事件
    tbody.querySelectorAll('.allocate-qty-input').forEach(input => {
        input.addEventListener('input', function() {
            const maxQty = parseInt(this.getAttribute('data-max')) || 0;
            const value = parseInt(this.value) || 0;
            
            if (value > maxQty) {
                this.value = maxQty;
                alert(`分配数量不能超过 ${maxQty}（待出数量限制）`);
            }
            if (value < 0) {
                this.value = 1;
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value && parseInt(this.value) < 1) {
                this.value = 1;
            }
        });
    });
}

// 搜索库位
function searchLocations() {
    renderLocationList();
}

// 重置库位搜索
function resetLocationSearch() {
    document.getElementById('searchRow').value = '';
    document.getElementById('searchCol').value = '';
    document.getElementById('searchLevel').value = '';
    document.getElementById('searchDepth').value = '';
    renderLocationList();
}

// 全选库位
function toggleSelectAllLocations(e) {
    document.querySelectorAll('#locationListBody .location-checkbox').forEach(cb => {
        cb.checked = e.target.checked;
        if (e.target.checked) {
            selectedLocations.add(cb.value);
        } else {
            selectedLocations.delete(cb.value);
        }
    });
}

// 更新全选状态
function updateSelectAllLocations() {
    const checkboxes = document.querySelectorAll('#locationListBody .location-checkbox');
    const checkedCount = document.querySelectorAll('#locationListBody .location-checkbox:checked').length;
    const selectAll = document.getElementById('selectAllLocations');
    
    selectAll.checked = checkboxes.length > 0 && checkedCount === checkboxes.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
}

// 确认库位分配
function confirmLocationAllocate() {
    if (selectedLocations.size === 0) {
        alert('请至少选择一个库位！');
        return;
    }
    
    const tbody = document.getElementById('locationListBody');
    let totalAllocated = 0;
    const pendingQty = currentAllocatingMaterial.pendingQty || 0;
    
    selectedLocations.forEach(locationCode => {
        const row = tbody.querySelector(`input[value="${locationCode}"]`).closest('tr');
        const qtyInput = row.querySelector('.allocate-qty-input');
        const qty = parseInt(qtyInput.value) || 0;
        
        if (qty > 0) {
            const containerCode = row.querySelector('.location-checkbox').dataset.container;
            
            const result = {
                materialCode: currentAllocatingMaterial.code,
                materialName: currentAllocatingMaterial.name,
                containerCode: containerCode,
                locationCode: locationCode,
                allocatedQty: qty
            };
            
            // 判断是手工分配还是批量分配
            if (document.getElementById('batchAllocateModal').classList.contains('active')) {
                batchAllocationResults.push(result);
            } else {
                allocationResults.push(result);
            }
            
            totalAllocated += qty;
        }
    });
    
    if (totalAllocated === 0) {
        alert('请为选中的库位填写分配数量！');
        return;
    }
    
    // 验证总分配数量不超过待出数量
    if (totalAllocated > pendingQty) {
        alert(`分配数量不能超过待出数量！\n当前分配：${totalAllocated}\n待出数量：${pendingQty}`);
        return;
    }
    
    alert(`库位分配成功！共分配 ${totalAllocated} 件`);
    closeLocationAllocateModal();
    
    // 根据上下文更新不同的结果列表
    if (document.getElementById('batchAllocateModal').classList.contains('active')) {
        renderBatchDemand();
        renderBatchAllocationResults();
    } else {
        renderAllocationResults();
    }
}

// 确认手工分配
function confirmManualAllocate() {
    if (allocationResults.length === 0) {
        alert('请先进行库位分配！');
        return;
    }

    const order = outboundOrdersData.find(o => o.id === manualAllocatingOrderId);
    if (!order) return;

    if (!canAllocateOrder(order)) {
        alert('该出库单当前不可进行手工分配！');
        return;
    }

    const allocateTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\//g, '-');
    
    // 更新物料的已分配数量
    allocationResults.forEach(result => {
        const material = order.materials.find(m => m.code === result.materialCode);
        if (material) {
            material.allocatedQty = (material.allocatedQty || 0) + result.allocatedQty;
        }
    });

    order.palletAllocationRecords = allocationResults.map(result => ({
        materialCode: result.materialCode,
        materialName: result.materialName,
        containerCode: result.containerCode,
        locationCode: result.locationCode,
        allocatedQty: result.allocatedQty,
        allocator: '当前用户',
        allocateTime,
        status: '待出库',
        assignedPort: getMaterialDefaultOutboundPort(result.materialCode)
    }));
    order.allocationStatus = '已分配';
    selectedOrders.delete(order.id);
    
    alert(`手工分配成功！\n已分配托盘数：${allocationResults.length}\n本次分配数量：${allocationResults.reduce((sum, r) => sum + r.allocatedQty, 0)}`);
    
    closeManualAllocateModal();
    searchOrders();
}

// 打开自动分配确认弹窗
function openAutoAllocate(id) {
    const order = outboundOrdersData.find(o => o.id === id);
    if (!order) return;

    if (!canAllocateOrder(order)) {
        alert('该出库单当前不可进行自动分配！');
        return;
    }

    autoAllocatingOrderId = id;
    
    document.getElementById('autoAllocateOrderNo').textContent = order.orderNo;
    
    document.getElementById('autoAllocatePortModal').classList.add('active');
}

// 确认自动分配
function confirmAutoAllocate() {
    const order = outboundOrdersData.find(o => o.id === autoAllocatingOrderId);
    if (!order) return;

    if (!canAllocateOrder(order)) {
        alert('该出库单当前不可进行自动分配！');
        return;
    }
    
    const plan = createAutoAllocationPlan([order]);
    const orderPlan = plan.plans[0];

    if (!orderPlan || orderPlan.pendingMaterials.length === 0) {
        alert('该出库单没有可分配的物料！');
        return;
    }

    if (plan.totalAllocated === 0) {
        alert('没有可用的库位进行自动分配！');
        return;
    }
    
    applyAutoAllocationPlan(plan);
    
    alert(`自动分配成功！\n已分配托盘数：${plan.allocationCount}\n本次分配数量：${plan.totalAllocated}`);
    
    closeAutoAllocatePortModal();
    searchOrders();
}

// 关闭自动分配确认弹窗
function closeAutoAllocatePortModal() {
    document.getElementById('autoAllocatePortModal').classList.remove('active');
    autoAllocatingOrderId = null;
}

function renderBatchAutoAllocateOrderList() {
    const orderText = document.getElementById('batchAutoAllocateOrderText');
    orderText.textContent = batchAllocatingOrders.map(order => order.orderNo).join('、') || '-';
}

function closeBatchAutoAllocateModal() {
    document.getElementById('batchAutoAllocateModal').classList.remove('active');
    document.getElementById('batchAutoAllocateOrderText').textContent = '-';
    batchAllocatingOrders = [];
}

// 关闭手工分配弹窗
function closeManualAllocateModal() {
    document.getElementById('manualAllocateModal').classList.remove('active');
    manualAllocatingOrderId = null;
    allocationResults = [];
}

// 关闭库位分配弹窗
function closeLocationAllocateModal() {
    document.getElementById('locationAllocateModal').classList.remove('active');
    currentAllocatingMaterial = null;
    selectedLocations.clear();
}

// 全选订单
function toggleSelectAllOrders(e) {
    document.querySelectorAll('.order-checkbox:not(:disabled)').forEach(cb => {
        cb.checked = e.target.checked;
        const id = parseInt(cb.value);
        if (e.target.checked) {
            selectedOrders.add(id);
        } else {
            selectedOrders.delete(id);
        }
    });
}

// 更新全选订单状态
function updateSelectAllOrders() {
    const checkboxes = document.querySelectorAll('.order-checkbox:not(:disabled)');
    const checkedCount = document.querySelectorAll('.order-checkbox:checked').length;
    const selectAll = document.getElementById('selectAllOrders');
    
    if (checkboxes.length > 0) {
        selectAll.checked = checkedCount === checkboxes.length;
        selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
    }
}

// 打开批量分配
function openBatchAllocate() {
    if (selectedOrders.size === 0) {
        alert('请至少选择一个出库单！');
        return;
    }
    
    // 验证所选订单是否满足条件
    const orders = outboundOrdersData.filter(o => selectedOrders.has(o.id));
    const invalidOrders = orders.filter(o => !canAllocateOrder(o));
    
    if (invalidOrders.length > 0) {
        alert('所选订单中包含不满足条件的订单！\n请确保所选订单状态为"待出库"或"出库中"，且分配状态为"待分配"。');
        return;
    }
    
    batchAllocatingOrders = orders;
    renderBatchAutoAllocateOrderList();
    document.getElementById('batchAutoAllocateModal').classList.add('active');
}

function confirmBatchAutoAllocate() {
    if (batchAllocatingOrders.length === 0) {
        alert('请至少选择一个出库单！');
        return;
    }

    const invalidOrders = batchAllocatingOrders.filter(order => !canAllocateOrder(order));
    if (invalidOrders.length > 0) {
        alert('所选订单中包含不满足条件的订单！\n请确保所选订单状态为"待出库"或"出库中"，且分配状态为"待分配"。');
        return;
    }

    const plan = createAutoAllocationPlan(batchAllocatingOrders);
    const ordersWithoutPendingMaterials = plan.plans.filter(item => item.pendingMaterials.length === 0);

    if (ordersWithoutPendingMaterials.length === batchAllocatingOrders.length) {
        alert('所选出库单没有可分配的物料！');
        return;
    }

    if (plan.totalAllocated === 0) {
        alert('没有可用的库位进行自动分配！');
        return;
    }

    applyAutoAllocationPlan(plan);
    const successOrderCount = plan.plans.filter(item => item.orderTotalAllocated > 0).length;

    alert(`批量自动分配成功！\n成功分配出库单数：${successOrderCount}\n已分配托盘数：${plan.allocationCount}\n本次分配数量：${plan.totalAllocated}`);

    closeBatchAutoAllocateModal();
    searchOrders();
}

// 渲染合并订单物料明细
function renderMergeOrderMaterials() {
    const port = document.getElementById('mergeOrderPort').value;
    const table = document.getElementById('mergeOrderMaterialTable');
    const thead = table.querySelector('thead tr');
    const tbody = document.getElementById('mergeOrderMaterialBody');
    
    if (!port) {
        tbody.innerHTML = '';
        // 重置表头
        thead.innerHTML = `
            <th width="50"><input type="checkbox" id="selectAllMergeMaterials"></th>
            <th>物料编码</th>
            <th>物料名称</th>
            <th>订单待出库合计数</th>
            <th>库存数</th>
        `;
        return;
    }
    
    // 根据出库口筛选物料
    const portMaterials = port === '出库口1' ? 
        ['WL-2024-001', 'WL-2024-002'] : 
        ['WL-2024-003', 'WL-2024-004', 'WL-2024-005'];
    
    // 合并所有订单的物料，并记录每个订单的数量
    const materialMap = new Map();
    const orderNos = batchAllocatingOrders.map(o => o.orderNo);
    
    batchAllocatingOrders.forEach(order => {
        order.materials.forEach(m => {
            if (!portMaterials.includes(m.code)) return;
            
            const pendingQty = m.plannedQty - (m.allocatedQty || 0);
            
            if (!materialMap.has(m.code)) {
                materialMap.set(m.code, {
                    code: m.code,
                    name: m.name,
                    totalPending: 0,
                    orderQuantities: {} // 存储每个订单的数量
                });
            }
            
            const material = materialMap.get(m.code);
            if (pendingQty > 0) {
                material.totalPending += pendingQty;
                material.orderQuantities[order.orderNo] = pendingQty;
            }
        });
    });
    
    // 动态生成表头，包含所有订单列
    thead.innerHTML = `
        <th width="50"><input type="checkbox" id="selectAllMergeMaterials"></th>
        <th>物料编码</th>
        <th>物料名称</th>
        <th>订单待出库合计数</th>
        ${orderNos.map(orderNo => `<th>${orderNo}</th>`).join('')}
        <th>库存数</th>
    `;
    
    // 重新绑定全选事件
    document.getElementById('selectAllMergeMaterials').addEventListener('change', toggleSelectAllMergeMaterials);
    
    // 生成表格内容（只显示订单待出库合计数大于0的物料）
    tbody.innerHTML = Array.from(materialMap.values())
        .filter(m => m.totalPending > 0) // 过滤掉合计数为0的物料
        .map(m => {
            const materialData = systemMaterials.find(sm => sm.code === m.code);
            const stockQty = materialData ? materialData.stockQty : 0;
            
            // 为每个订单生成对应的数量列，如果该订单没有此物料则显示0
            const orderColumns = orderNos.map(orderNo => {
                const qty = m.orderQuantities[orderNo] || 0;
                return `<td>${qty}</td>`;
            }).join('');
            
            return `
            <tr>
                <td><input type="checkbox" class="merge-material-checkbox" value="${m.code}" data-total="${m.totalPending}" data-stock="${stockQty}"></td>
                <td>${m.code}</td>
                <td>${m.name}</td>
                <td>${m.totalPending}</td>
                ${orderColumns}
                <td>${stockQty}</td>
            </tr>
        `}).join('');
}

// 全选合并物料
function toggleSelectAllMergeMaterials(e) {
    document.querySelectorAll('.merge-material-checkbox').forEach(cb => {
        cb.checked = e.target.checked;
    });
}

// 确认合并订单
function confirmMergeOrder() {
    const port = document.getElementById('mergeOrderPort').value;
    if (!port) {
        alert('请选择出库口！');
        return;
    }
    
    const selectedMaterials = [];
    document.querySelectorAll('.merge-material-checkbox:checked').forEach(cb => {
        selectedMaterials.push({
            code: cb.value,
            totalPending: parseInt(cb.dataset.total),
            stockQty: parseInt(cb.dataset.stock)
        });
    });
    
    if (selectedMaterials.length === 0) {
        alert('请至少选择一个物料！');
        return;
    }
    
    // 验证库存
    const insufficientMaterials = selectedMaterials.filter(m => m.totalPending > m.stockQty);
    if (insufficientMaterials.length > 0) {
        const materialCodes = insufficientMaterials.map(m => m.code).join('、');
        alert(`以下物料库存不足，请重新勾选：\n${materialCodes}`);
        return;
    }
    
    // 保存选择的数据
    batchSelectedMaterials = selectedMaterials;
    batchAllocatingPort = port;
    batchAllocationResults = [];
    
    // 关闭合并订单弹窗（不清理数据）
    document.getElementById('mergeOrderModal').classList.remove('active');
    
    // 打开批量分配页面
    openBatchAllocateModal();
}

// 打开批量分配页面
function openBatchAllocateModal() {
    document.getElementById('batchAllocatePort').textContent = batchAllocatingPort;
    renderBatchDemand();
    renderBatchAllocationResults();
    document.getElementById('batchAllocateModal').classList.add('active');
}

// 渲染批量分配订单需求
function renderBatchDemand() {
    const portMaterials = batchAllocatingPort === '出库口1' ? 
        ['WL-2024-001', 'WL-2024-002'] : 
        ['WL-2024-003', 'WL-2024-004', 'WL-2024-005'];
    
    const table = document.getElementById('batchDemandTable');
    const thead = table.querySelector('thead tr');
    const tbody = document.getElementById('batchDemandBody');
    const orderNos = batchAllocatingOrders.map(o => o.orderNo);
    
    // 只显示在合并订单确认页面中勾选的物料
    const materialMap = new Map();
    
    // 初始化所有勾选的物料
    batchSelectedMaterials.forEach(sm => {
        materialMap.set(sm.code, {
            code: sm.code,
            name: '', // 将从订单中获取
            totalPending: 0,
            orderQuantities: {},
            allocatedQty: 0
        });
    });
    
    // 填充各订单的物料数量
    batchAllocatingOrders.forEach(order => {
        order.materials.forEach(m => {
            if (!materialMap.has(m.code)) return; // 只处理勾选的物料
            
            const pendingQty = m.plannedQty - (m.allocatedQty || 0);
            const material = materialMap.get(m.code);
            
            // 设置物料名称
            if (!material.name) {
                material.name = m.name;
            }
            
            if (pendingQty > 0) {
                material.totalPending += pendingQty;
                material.orderQuantities[order.orderNo] = pendingQty;
            }
        });
    });
    
    // 动态生成表头，包含所有订单列
    thead.innerHTML = `
        <th>物料编码</th>
        <th>物料名称</th>
        <th>订单待出库合计数</th>
        ${orderNos.map(orderNo => `<th>${orderNo}</th>`).join('')}
        <th>已分配数量</th>
        <th width="100">操作</th>
    `;
    
    // 生成表格内容（只显示勾选的物料）
    tbody.innerHTML = Array.from(materialMap.values())
        .filter(m => m.totalPending > 0) // 只显示有待出库数量的物料
        .map(m => {
            const allocated = batchAllocationResults
                .filter(r => r.materialCode === m.code)
                .reduce((sum, r) => sum + r.allocatedQty, 0);
            
            // 为每个订单生成对应的数量列，如果该订单没有此物料则显示0
            const orderColumns = orderNos.map(orderNo => {
                const qty = m.orderQuantities[orderNo] || 0;
                return `<td>${qty}</td>`;
            }).join('');
            
            return `
            <tr>
                <td>${m.code}</td>
                <td>${m.name}</td>
                <td>${m.totalPending}</td>
                ${orderColumns}
                <td>${allocated}</td>
                <td>
                    <button class="detail-btn" onclick="openBatchLocationAllocate('${m.code}', '${m.name}', ${m.totalPending})">库位分配</button>
                </td>
            </tr>
        `}).join('');
}

// 打开批量库位分配
function openBatchLocationAllocate(materialCode, materialName, pendingQty) {
    currentAllocatingMaterial = { code: materialCode, name: materialName, pendingQty: pendingQty };
    selectedLocations.clear();
    
    document.getElementById('locationMaterialCode').textContent = materialCode;
    document.getElementById('locationMaterialName').textContent = materialName;
    document.getElementById('locationPendingQty').textContent = pendingQty;
    
    document.getElementById('searchRow').value = '';
    document.getElementById('searchCol').value = '';
    document.getElementById('searchLevel').value = '';
    document.getElementById('searchDepth').value = '';
    
    renderLocationList();
    document.getElementById('locationAllocateModal').classList.add('active');
}

// 渲染批量分配结果
function renderBatchAllocationResults() {
    const tbody = document.getElementById('batchResultBody');
    tbody.innerHTML = batchAllocationResults.map((result, index) => `
        <tr>
            <td>${result.materialCode}</td>
            <td>${result.materialName}</td>
            <td>${result.containerCode}</td>
            <td>${result.allocatedQty}</td>
            <td>
                <button class="delete-btn" onclick="removeBatchAllocationResult(${index})">取消分配</button>
            </td>
        </tr>
    `).join('');
}

// 移除批量分配结果
function removeBatchAllocationResult(index) {
    batchAllocationResults.splice(index, 1);
    renderBatchDemand();
    renderBatchAllocationResults();
}

// 确认批量分配
function confirmBatchAllocate() {
    if (batchAllocationResults.length === 0) {
        alert('请先进行库位分配！');
        return;
    }
    
    // 按物料汇总已分配数量
    const materialAllocations = new Map();
    batchAllocationResults.forEach(result => {
        if (!materialAllocations.has(result.materialCode)) {
            materialAllocations.set(result.materialCode, 0);
        }
        materialAllocations.set(result.materialCode, 
            materialAllocations.get(result.materialCode) + result.allocatedQty);
    });
    
    // 按比例分配给各订单
    batchAllocatingOrders.forEach(order => {
        order.materials.forEach(material => {
            const totalAllocated = materialAllocations.get(material.code) || 0;
            if (totalAllocated === 0) return;
            
            const pendingQty = material.plannedQty - (material.allocatedQty || 0);
            if (pendingQty <= 0) return;
            
            // 计算该订单在此物料中的占比
            let totalPending = 0;
            batchAllocatingOrders.forEach(o => {
                const m = o.materials.find(mat => mat.code === material.code);
                if (m) {
                    const pending = m.plannedQty - (m.allocatedQty || 0);
                    if (pending > 0) totalPending += pending;
                }
            });
            
            // 按比例分配
            if (totalPending > 0) {
                const allocatedForThisOrder = Math.floor((pendingQty / totalPending) * totalAllocated);
                material.allocatedQty = (material.allocatedQty || 0) + allocatedForThisOrder;
            }
        });

        order.allocationStatus = '已分配';
    });
    selectedOrders.clear();
    
    alert(`批量分配成功！\n已分配托盘数：${batchAllocationResults.length}\n本次分配数量：${batchAllocationResults.reduce((sum, r) => sum + r.allocatedQty, 0)}`);
    
    // 成功分配后完全关闭所有相关弹窗
    document.getElementById('batchAllocateModal').classList.remove('active');
    document.getElementById('mergeOrderModal').classList.remove('active');
    batchAllocatingOrders = [];
    batchSelectedMaterials = [];
    batchAllocatingPort = '';
    batchAllocationResults = [];
    selectedOrders.clear();
    renderTable();
}

// 关闭合并订单弹窗
function closeMergeOrderModal() {
    document.getElementById('mergeOrderModal').classList.remove('active');
    // 如果从合并订单弹窗取消，清理所有批量分配相关数据
    batchAllocatingOrders = [];
    batchSelectedMaterials = [];
    batchAllocatingPort = '';
    batchAllocationResults = [];
}

// 关闭批量分配弹窗（返回到合并订单确认弹窗）
function closeBatchAllocateModal() {
    document.getElementById('batchAllocateModal').classList.remove('active');
    batchAllocationResults = [];
    // 返回到合并订单确认弹窗
    document.getElementById('mergeOrderModal').classList.add('active');
}
