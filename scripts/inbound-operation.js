// 入库作业页面脚本

// 模拟当前终端配置
const currentPort = '入库口 1';

// 模拟入库单数据
const currentInboundOrder = {
    orderNo: 'RK-2024-0003',
    materials: [
        { code: 'WL-2024-001', name: '电子元件A型', plannedQty: 80, inboundQty: 0 },
        { code: 'WL-2024-003', name: '塑料配件C型', plannedQty: 60, inboundQty: 0 },
        { code: 'WL-2024-005', name: '金属材料E型', plannedQty: 40, inboundQty: 0 }
    ]
};

// 模拟待组盘列表
let pendingPallets = [
    {
        id: 1,
        containerCode: 'TP-001',
        currentMaterials: '电子元件A型 × 30',
        recommendMaterials: [
            { code: 'WL-2024-001', name: '电子元件A型', qty: 20 },
            { code: 'WL-2024-003', name: '塑料配件C型', qty: 15 }
        ],
        status: 'processing' // processing, pending, completed
    },
    {
        id: 2,
        containerCode: 'TP-002',
        currentMaterials: '空托盘',
        recommendMaterials: [
            { code: 'WL-2024-003', name: '塑料配件C型', qty: 50 }
        ],
        status: 'pending'
    },
    {
        id: 3,
        containerCode: 'TP-003',
        currentMaterials: '机械零件B型 × 15、塑料配件C型 × 10',
        recommendMaterials: [
            { code: 'WL-2024-005', name: '金属材料E型', qty: 25 },
            { code: 'WL-2024-001', name: '电子元件A型', qty: 10 },
            { code: 'WL-2024-003', name: '塑料配件C型', qty: 5 }
        ],
        status: 'pending'
    }
];

// 当前操作的托盘
let currentPallet = null;
let actualMaterials = []; // 实际扫描的物料列表

// 模拟可用库位
const availableLocations = [
    { code: '1-5-12-1', area: '库区A', status: '空库位' },
    { code: '1-6-12-1', area: '库区A', status: '空库位' },
    { code: '1-7-12-1', area: '库区A', status: '空库位' },
    { code: '2-5-12-1', area: '库区B', status: '空库位' },
    { code: '2-6-12-1', area: '库区B', status: '空库位' }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    initEventListeners();
});

// 初始化页面
function initPage() {
    // 设置入库口标识
    document.getElementById('portBadge').textContent = currentPort;
    
    // 显示预览入库单信息
    showPreviewInfo();
    
    // 渲染待组盘列表
    renderPendingPallets();
}

// 显示预览入库单信息
function showPreviewInfo() {
    const totalPlanned = currentInboundOrder.materials.reduce((sum, m) => sum + m.plannedQty, 0);
    const totalInbound = currentInboundOrder.materials.reduce((sum, m) => sum + m.inboundQty, 0);
    
    document.getElementById('previewOrderNo').textContent = currentInboundOrder.orderNo;
    document.getElementById('previewPlannedQty').textContent = totalPlanned;
    document.getElementById('previewInboundQty').textContent = totalInbound;
    document.getElementById('previewPendingQty').textContent = totalPlanned - totalInbound;
}

// 加载下一个待组盘的托盘
function loadNextPallet() {
    // 找到第一个待处理或处理中的托盘
    currentPallet = pendingPallets.find(p => p.status === 'processing' || p.status === 'pending');
    
    if (currentPallet) {
        // 更新状态为处理中
        currentPallet.status = 'processing';
        
        // 加载托盘信息
        loadPalletInfo();
    } else {
        alert('所有托盘已组盘完成！');
        resetToScanState();
    }
}

// 渲染推荐物料列表
function renderRecommendMaterials() {
    const tbody = document.getElementById('recommendMaterialBody');
    
    if (!currentPallet || !currentPallet.recommendMaterials || currentPallet.recommendMaterials.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">暂无推荐物料</td></tr>';
        return;
    }
    
    tbody.innerHTML = currentPallet.recommendMaterials.map(m => `
        <tr>
            <td>${m.code}</td>
            <td>${m.name}</td>
            <td>${m.qty}</td>
        </tr>
    `).join('');
}

// 清空当前托盘信息
function clearCurrentPallet() {
    document.getElementById('currentOrderNo').textContent = '-';
    document.getElementById('currentPlannedQty').textContent = '-';
    document.getElementById('currentInboundQty').textContent = '-';
    document.getElementById('currentPendingQty').textContent = '-';
    document.getElementById('currentContainerCode').textContent = '-';
    document.getElementById('recommendMaterialBody').innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">暂无推荐物料</td></tr>';
    clearActualInfo();
}

// 清空实际存储信息
function clearActualInfo() {
    document.getElementById('scanMaterialCode').value = '';
    document.getElementById('actualQty').value = '';
    document.getElementById('fullPalletCheck').checked = false;
    actualMaterials = [];
    renderActualMaterials();
}

// 渲染实际物料列表
function renderActualMaterials() {
    const tbody = document.getElementById('actualMaterialBody');
    
    if (actualMaterials.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="4" style="text-align: center; color: #999;">暂无数据，请扫描物料</td></tr>';
        return;
    }
    
    tbody.innerHTML = actualMaterials.map((m, index) => `
        <tr>
            <td>${m.code}</td>
            <td>${m.name}</td>
            <td>
                <input type="number" class="editable-qty" value="${m.qty}" min="1" 
                    onchange="updateMaterialQty(${index}, this.value)">
            </td>
            <td>
                <button class="delete-btn" onclick="removeMaterial(${index})">删除</button>
            </td>
        </tr>
    `).join('');
}

// 渲染待组盘列表
function renderPendingPallets() {
    const tbody = document.getElementById('pendingPalletBody');
    
    tbody.innerHTML = pendingPallets.map(pallet => {
        const rowClass = pallet.status === 'processing' ? 'current-row' : '';
        const recommendText = pallet.recommendMaterials.map(m => `${m.code}(${m.qty})`).join('、');
        return `
        <tr class="${rowClass}">
            <td>${pallet.containerCode}</td>
            <td>${pallet.currentMaterials}</td>
            <td>${recommendText}</td>
            <td>${pallet.recommendMaterials.reduce((sum, m) => sum + m.qty, 0)}</td>
            <td>
                <span class="status-badge ${pallet.status}">
                    ${getStatusText(pallet.status)}
                </span>
            </td>
        </tr>
    `}).join('');
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'pending': '待组盘',
        'processing': '组盘中',
        'completed': '已完成'
    };
    return statusMap[status] || '未知';
}

// 初始化事件监听
function initEventListeners() {
    // 扫描容器按钮
    document.getElementById('scanContainerBtn').addEventListener('click', scanContainer);
    
    // 扫描容器编码 - 支持回车键
    document.getElementById('scanContainerCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            scanContainer();
        }
    });
    
    // 扫码容器按钮（重新扫描）
    document.getElementById('scanNewContainerBtn').addEventListener('click', function() {
        if (actualMaterials.length > 0) {
            if (confirm('确定要重新扫描容器吗？当前容器的组盘进度将不会保存。')) {
                resetToScanState();
            }
        } else {
            resetToScanState();
        }
    });
    
    // 添加物料按钮
    document.getElementById('addMaterialBtn').addEventListener('click', addMaterial);
    
    // 扫描物料编码 - 支持回车键
    document.getElementById('scanMaterialCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addMaterial();
        }
    });
    
    // 实际数量输入 - 支持回车键
    document.getElementById('actualQty').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addMaterial();
        }
    });
    
    // 确认组盘
    document.getElementById('confirmPalletBtn').addEventListener('click', confirmPallet);
    
    // 取消组盘
    document.getElementById('cancelPalletBtn').addEventListener('click', cancelPallet);
    
    // 选择库位弹窗
    document.getElementById('locationClose').addEventListener('click', closeLocationModal);
    document.getElementById('cancelLocationBtn').addEventListener('click', closeLocationModal);
    document.getElementById('confirmLocationBtn').addEventListener('click', confirmInbound);
    
    // 点击弹窗外部关闭
    document.getElementById('locationModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLocationModal();
        }
    });
}

// 扫描容器
function scanContainer() {
    const containerCode = document.getElementById('scanContainerCode').value.trim();
    
    if (!containerCode) {
        alert('请输入容器编码！');
        return;
    }
    
    // 查找容器
    const pallet = pendingPallets.find(p => p.containerCode === containerCode);
    
    if (!pallet) {
        alert('容器编码不存在或未到达入库口！');
        document.getElementById('scanContainerCode').value = '';
        return;
    }
    
    if (pallet.status === 'completed') {
        alert('该容器已完成组盘！');
        document.getElementById('scanContainerCode').value = '';
        return;
    }
    
    // 设置当前托盘
    currentPallet = pallet;
    currentPallet.status = 'processing';
    
    // 隐藏扫描区域，显示组盘信息区域
    document.getElementById('scanContainerSection').style.display = 'none';
    document.getElementById('currentPalletSection').style.display = 'block';
    
    // 加载托盘信息
    loadPalletInfo();
    
    // 聚焦到物料扫描框
    document.getElementById('scanMaterialCode').focus();
}

// 加载托盘信息
function loadPalletInfo() {
    // 显示入库单信息
    const totalPlanned = currentInboundOrder.materials.reduce((sum, m) => sum + m.plannedQty, 0);
    const totalInbound = currentInboundOrder.materials.reduce((sum, m) => sum + m.inboundQty, 0);
    
    document.getElementById('currentOrderNo').textContent = currentInboundOrder.orderNo;
    document.getElementById('currentPlannedQty').textContent = totalPlanned;
    document.getElementById('currentInboundQty').textContent = totalInbound;
    document.getElementById('currentPendingQty').textContent = totalPlanned - totalInbound;
    
    // 显示容器信息
    document.getElementById('currentContainerCode').textContent = currentPallet.containerCode;
    
    // 渲染推荐物料列表
    renderRecommendMaterials();
    
    // 清空实际存储信息
    clearActualInfo();
    
    // 渲染待组盘列表
    renderPendingPallets();
}

// 重置到扫描状态
function resetToScanState() {
    // 重置当前托盘状态
    if (currentPallet) {
        currentPallet.status = 'pending';
        currentPallet = null;
    }
    
    // 清空实际物料
    actualMaterials = [];
    
    // 隐藏组盘信息区域，显示扫描区域
    document.getElementById('currentPalletSection').style.display = 'none';
    document.getElementById('scanContainerSection').style.display = 'block';
    
    // 清空扫描输入框
    document.getElementById('scanContainerCode').value = '';
    document.getElementById('scanContainerCode').focus();
    
    // 更新预览信息
    showPreviewInfo();
    
    // 重新渲染待组盘列表
    renderPendingPallets();
}

// 添加物料
function addMaterial() {
    const materialCode = document.getElementById('scanMaterialCode').value.trim();
    const qty = parseInt(document.getElementById('actualQty').value);
    
    if (!materialCode) {
        alert('请扫描物料编码！');
        return;
    }
    
    if (!qty || qty <= 0) {
        alert('请输入有效的入库数量！');
        return;
    }
    
    // 查找物料
    const material = currentInboundOrder.materials.find(m => m.code === materialCode);
    
    if (!material) {
        alert('物料编码不存在或不属于当前入库单！');
        document.getElementById('scanMaterialCode').value = '';
        return;
    }
    
    // 验证数量不超过待入库数量
    const pending = material.plannedQty - material.inboundQty;
    if (qty > pending) {
        alert(`入库数量不能超过待入库数量 ${pending}！`);
        return;
    }
    
    // 检查是否已添加该物料
    const existingIndex = actualMaterials.findIndex(m => m.code === materialCode);
    if (existingIndex >= 0) {
        // 更新数量
        actualMaterials[existingIndex].qty += qty;
    } else {
        // 添加新物料
        actualMaterials.push({
            code: material.code,
            name: material.name,
            qty: qty,
            materialRef: material
        });
    }
    
    // 清空输入框
    document.getElementById('scanMaterialCode').value = '';
    document.getElementById('actualQty').value = '';
    
    // 重新渲染列表
    renderActualMaterials();
    
    // 聚焦到扫描框
    document.getElementById('scanMaterialCode').focus();
}

// 更新物料数量
function updateMaterialQty(index, newQty) {
    const qty = parseInt(newQty);
    
    if (!qty || qty <= 0) {
        alert('数量必须大于0！');
        renderActualMaterials();
        return;
    }
    
    const material = actualMaterials[index];
    const pending = material.materialRef.plannedQty - material.materialRef.inboundQty;
    
    if (qty > pending) {
        alert(`入库数量不能超过待入库数量 ${pending}！`);
        renderActualMaterials();
        return;
    }
    
    material.qty = qty;
    renderActualMaterials();
}

// 删除物料
function removeMaterial(index) {
    if (confirm('确定要删除该物料吗？')) {
        actualMaterials.splice(index, 1);
        renderActualMaterials();
    }
}

// 确认组盘
function confirmPallet() {
    if (!currentPallet) {
        alert('没有待组盘的托盘！');
        return;
    }
    
    // 验证是否已添加物料
    if (actualMaterials.length === 0) {
        alert('请至少添加一种物料！');
        return;
    }
    
    // 保存组盘数据
    currentPallet.actualMaterials = actualMaterials;
    currentPallet.isFull = document.getElementById('fullPalletCheck').checked;
    
    // 打开选择库位弹窗
    openLocationModal();
}

// 取消组盘
function cancelPallet() {
    if (actualMaterials.length === 0) {
        return;
    }
    
    if (confirm('确定要取消当前组盘操作吗？')) {
        clearActualInfo();
    }
}

// 打开选择库位弹窗
function openLocationModal() {
    // 显示容器信息
    document.getElementById('modalContainerCode').textContent = currentPallet.containerCode;
    
    // 显示物料信息
    const materialText = actualMaterials.map(m => `${m.code} - ${m.name} × ${m.qty}`).join('、');
    document.getElementById('modalMaterial').textContent = materialText;
    
    // 显示总数量
    const totalQty = actualMaterials.reduce((sum, m) => sum + m.qty, 0);
    document.getElementById('modalQty').textContent = totalQty;
    
    // 填充库位选项
    const locationSelect = document.getElementById('locationSelect');
    locationSelect.innerHTML = '<option value="">请选择库位</option>' + 
        availableLocations.map(loc => 
            `<option value="${loc.code}">${loc.code} (${loc.area})</option>`
        ).join('');
    
    // 自动选择第一个库位
    if (availableLocations.length > 0) {
        locationSelect.value = availableLocations[0].code;
    }
    
    document.getElementById('locationModal').classList.add('active');
}

// 关闭选择库位弹窗
function closeLocationModal() {
    document.getElementById('locationModal').classList.remove('active');
}

// 确认入库
function confirmInbound() {
    const location = document.getElementById('locationSelect').value;
    
    if (!location) {
        alert('请选择入库库位！');
        return;
    }
    
    // 更新各物料的入库数量
    actualMaterials.forEach(m => {
        m.materialRef.inboundQty += m.qty;
    });
    
    // 更新托盘状态
    currentPallet.status = 'completed';
    currentPallet.location = location;
    
    // 构建成功提示信息
    const materialInfo = actualMaterials.map(m => `  - ${m.code} - ${m.name} × ${m.qty}`).join('\n');
    const totalQty = actualMaterials.reduce((sum, m) => sum + m.qty, 0);
    
    alert(`入库成功！\n\n容器编码：${currentPallet.containerCode}\n物料信息：\n${materialInfo}\n总数量：${totalQty}\n库位：${location}`);
    
    // 关闭弹窗
    closeLocationModal();
    
    // 重置到扫描状态
    currentPallet = null;
    resetToScanState();
}
