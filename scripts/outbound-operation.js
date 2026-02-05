// 出库作业页面脚本

// 模拟当前终端配置
const currentPort = '出库口 1';

// 模拟出库单数据（支持多个出库单）
let outboundOrders = [
    {
        orderNo: 'CK-2024-001',
        plannedQty: 100,
        outboundQty: 0,
        pendingQty: 100,
        materials: [
            { code: 'WL-2024-001', name: '电子元件A型', requiredQty: 50 },
            { code: 'WL-2024-002', name: '机械零件B型', requiredQty: 50 }
        ]
    },
    {
        orderNo: 'CK-2024-002',
        plannedQty: 80,
        outboundQty: 0,
        pendingQty: 80,
        materials: [
            { code: 'WL-2024-001', name: '电子元件A型', requiredQty: 30 },
            { code: 'WL-2024-003', name: '塑料配件C型', requiredQty: 50 }
        ]
    }
];

// 模拟容器数据
const containerData = {
    'TP-001': {
        code: 'TP-001',
        type: '塑料托盘',
        materials: [
            {
                code: 'WL-2024-001',
                name: '电子元件A型',
                image: '📦',
                currentQty: 100,
                outboundDetails: [
                    { orderNo: 'CK-2024-001', requiredQty: 50, actualQty: 0, confirmed: false },
                    { orderNo: 'CK-2024-002', requiredQty: 30, actualQty: 0, confirmed: false }
                ]
            },
            {
                code: 'WL-2024-002',
                name: '机械零件B型',
                image: '⚙️',
                currentQty: 60,
                outboundDetails: [
                    { orderNo: 'CK-2024-001', requiredQty: 50, actualQty: 0, confirmed: false }
                ]
            },
            {
                code: 'WL-2024-003',
                name: '塑料配件C型',
                image: '🔧',
                currentQty: 80,
                outboundDetails: [
                    { orderNo: 'CK-2024-002', requiredQty: 50, actualQty: 0, confirmed: false }
                ]
            },
            {
                code: 'WL-2024-004',
                name: '橡胶密封圈D型',
                image: '⭕',
                currentQty: 50,
                outboundDetails: [] // 无需出库的物料
            }
        ]
    },
    'TP-002': {
        code: 'TP-002',
        type: '小金属框',
        materials: [
            {
                code: 'WL-2024-001',
                name: '电子元件A型',
                image: '📦',
                currentQty: 50,
                outboundDetails: [
                    { orderNo: 'CK-2024-001', requiredQty: 20, actualQty: 0, confirmed: false }
                ]
            }
        ]
    }
};

// 当前操作的容器
let currentContainer = null;

// 模拟可用库位
const availableLocations = [
    { code: '1-5-12-1', area: '库区A', status: '空库位' },
    { code: '1-6-12-1', area: '库区A', status: '空库位' },
    { code: '1-7-12-1', area: '库区A', status: '空库位' },
    { code: '2-5-12-1', area: '库区B', status: '空库位' },
    { code: '2-6-12-1', area: '库区B', status: '空库位' }
];

// 当前确认出库的物料和订单
let currentOutboundItem = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    initEventListeners();
});

// 初始化页面
function initPage() {
    // 设置出库口标识
    document.getElementById('portBadge').textContent = currentPort;
    
    // 渲染预览出库单信息
    renderOrderListPreview();
}

// 渲染预览出库单列表（扫码前）
function renderOrderListPreview() {
    const container = document.getElementById('orderListPreview');
    
    container.innerHTML = outboundOrders.map(order => `
        <div class="order-item">
            <div class="order-item-header">
                <span class="order-no">${order.orderNo}</span>
                <span class="order-status ${order.pendingQty === 0 ? 'completed' : 'pending'}">
                    ${order.pendingQty === 0 ? '已完成' : '进行中'}
                </span>
            </div>
            <div class="order-item-stats">
                <div class="stat-item">
                    <span class="stat-label">计划：</span>
                    <span class="stat-value">${order.plannedQty}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">已出：</span>
                    <span class="stat-value success">${order.outboundQty}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">待出：</span>
                    <span class="stat-value warning">${order.pendingQty}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 渲染出库单列表（扫码后）
function renderOrderList() {
    const container = document.getElementById('orderList');
    
    container.innerHTML = outboundOrders.map(order => `
        <div class="order-item">
            <div class="order-item-header">
                <span class="order-no">${order.orderNo}</span>
                <span class="order-status ${order.pendingQty === 0 ? 'completed' : 'pending'}">
                    ${order.pendingQty === 0 ? '已完成' : '进行中'}
                </span>
            </div>
            <div class="order-item-stats">
                <div class="stat-item">
                    <span class="stat-label">计划：</span>
                    <span class="stat-value">${order.plannedQty}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">已出：</span>
                    <span class="stat-value success">${order.outboundQty}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">待出：</span>
                    <span class="stat-value warning">${order.pendingQty}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 显示容器信息
function displayContainerInfo() {
    document.getElementById('currentContainerCode').textContent = currentContainer.code;
    document.getElementById('currentContainerType').textContent = currentContainer.type;
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
    
    // 扫描物料按钮
    document.getElementById('scanMaterialBtn').addEventListener('click', scanMaterial);
    
    // 扫描物料编码 - 支持回车键
    document.getElementById('scanMaterialCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            scanMaterial();
        }
    });
    
    // 扫码容器按钮（重新扫描）
    document.getElementById('scanNewContainerBtn').addEventListener('click', function() {
        if (confirm('确定要重新扫描容器吗？当前容器的出库进度将不会保存。')) {
            // 返回扫描容器状态
            currentContainer = null;
            document.getElementById('currentOutboundSection').style.display = 'none';
            document.getElementById('scanContainerSection').style.display = 'block';
            document.getElementById('scanContainerCode').value = '';
            document.getElementById('scanContainerCode').focus();
            renderOrderListPreview();
        }
    });
    
    // 确认回库按钮
    document.getElementById('confirmReturnBtn').addEventListener('click', confirmReturn);
    
    // 取消回库按钮
    document.getElementById('cancelReturnBtn').addEventListener('click', function() {
        document.getElementById('returnLocationCard').style.display = 'none';
    });
    
    // 确认全部出库按钮
    document.getElementById('confirmAllOutboundBtn').addEventListener('click', confirmAllOutbound);
    
    // 取消按钮
    document.getElementById('cancelAllBtn').addEventListener('click', function() {
        if (confirm('确定要取消当前出库操作吗？')) {
            // 返回扫描容器状态
            currentContainer = null;
            document.getElementById('currentOutboundSection').style.display = 'none';
            document.getElementById('scanContainerSection').style.display = 'block';
            document.getElementById('scanContainerCode').value = '';
            document.getElementById('scanContainerCode').focus();
            renderOrderListPreview();
        }
    });
    
    // 确认出库弹窗
    document.getElementById('confirmModalClose').addEventListener('click', closeConfirmModal);
    document.getElementById('cancelOutboundBtn').addEventListener('click', closeConfirmModal);
    document.getElementById('confirmOutboundBtn').addEventListener('click', confirmOutbound);
    
    // 确认入库库位弹窗
    document.getElementById('locationModalClose').addEventListener('click', closeLocationModal);
    document.getElementById('cancelLocationBtn').addEventListener('click', closeLocationModal);
    document.getElementById('confirmLocationBtn').addEventListener('click', confirmLocation);
    
    // 未确认物料弹窗
    document.getElementById('unconfirmedModalClose').addEventListener('click', closeUnconfirmedModal);
    document.getElementById('closeUnconfirmedBtn').addEventListener('click', closeUnconfirmedModal);
    
    // 点击弹窗外部关闭
    document.getElementById('confirmOutboundModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeConfirmModal();
        }
    });
    
    document.getElementById('confirmLocationModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLocationModal();
        }
    });
    
    document.getElementById('unconfirmedModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeUnconfirmedModal();
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
    const container = containerData[containerCode];
    
    if (!container) {
        alert('容器编码不存在或未到达出库口！');
        document.getElementById('scanContainerCode').value = '';
        return;
    }
    
    // 设置当前容器（深拷贝）
    currentContainer = JSON.parse(JSON.stringify(container));
    
    // 隐藏扫描区域，显示出库信息区域
    document.getElementById('scanContainerSection').style.display = 'none';
    document.getElementById('currentOutboundSection').style.display = 'block';
    
    // 显示容器信息
    displayContainerInfo();
    
    // 渲染出库单信息
    renderOrderList();
    
    // 渲染物料明细
    renderMaterialTable();
    
    // 聚焦到物料扫描框
    document.getElementById('scanMaterialCode').focus();
}

// 渲染物料明细表格
function renderMaterialTable() {
    const tbody = document.getElementById('materialTableBody');
    
    if (!currentContainer || !currentContainer.materials || currentContainer.materials.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8" style="text-align: center; color: #999;">该容器无物料</td></tr>';
        return;
    }
    
    let html = '';
    
    currentContainer.materials.forEach((material, materialIndex) => {
        const hasOutbound = material.outboundDetails && material.outboundDetails.length > 0;
        const rowSpan = hasOutbound ? material.outboundDetails.length : 1;
        
        if (hasOutbound) {
            // 有出库需求的物料
            material.outboundDetails.forEach((detail, detailIndex) => {
                html += '<tr class="outbound-row">';
                
                if (detailIndex === 0) {
                    html += `
                        <td rowspan="${rowSpan}">${material.code}</td>
                        <td rowspan="${rowSpan}">${material.name}</td>
                        <td rowspan="${rowSpan}" style="text-align: center; font-size: 24px;">${material.image}</td>
                        <td rowspan="${rowSpan}">${material.currentQty}</td>
                    `;
                }
                
                const isConfirmed = detail.confirmed;
                
                html += `
                    <td>${detail.orderNo}</td>
                    <td>${detail.requiredQty}</td>
                    <td>
                        <input type="number" 
                            class="editable-qty ${isConfirmed ? 'completed' : ''}" 
                            value="${detail.actualQty}" 
                            min="0" 
                            max="${detail.requiredQty}"
                            data-material-index="${materialIndex}"
                            data-detail-index="${detailIndex}"
                            ${isConfirmed ? 'readonly' : ''}
                            onchange="updateActualQty(${materialIndex}, ${detailIndex}, this.value)">
                    </td>
                    <td>
                        ${isConfirmed ? 
                            '<span class="status-badge completed">已出库</span>' : 
                            `<button class="action-btn primary" onclick="openConfirmModal(${materialIndex}, ${detailIndex})">确认出库</button>`
                        }
                    </td>
                </tr>
                `;
            });
        } else {
            // 无需出库的物料
            html += `
                <tr class="no-outbound-row">
                    <td>${material.code}</td>
                    <td>${material.name}</td>
                    <td style="text-align: center; font-size: 24px;">${material.image}</td>
                    <td>${material.currentQty}</td>
                    <td colspan="4" style="text-align: center; color: #999;">无需出库</td>
                </tr>
            `;
        }
    });
    
    tbody.innerHTML = html;
}

// 扫描物料
function scanMaterial() {
    const materialCode = document.getElementById('scanMaterialCode').value.trim();
    
    if (!materialCode) {
        alert('请输入物料编码！');
        return;
    }
    
    if (!currentContainer) {
        alert('请先扫描容器编码！');
        return;
    }
    
    // 查找物料
    const material = currentContainer.materials.find(m => m.code === materialCode);
    
    if (!material) {
        alert('该物料不在当前容器中！');
        document.getElementById('scanMaterialCode').value = '';
        return;
    }
    
    // 检查是否需要出库
    if (!material.outboundDetails || material.outboundDetails.length === 0) {
        alert('该物料无需出库！');
        document.getElementById('scanMaterialCode').value = '';
        return;
    }
    
    // 高亮显示该物料行
    highlightMaterialRows(materialCode);
    
    // 清空扫描框
    document.getElementById('scanMaterialCode').value = '';
    
    alert(`物料 ${material.name} 已定位，请填写实际出库数量`);
}

// 高亮显示物料行
function highlightMaterialRows(materialCode) {
    const rows = document.querySelectorAll('#materialTableBody tr');
    rows.forEach(row => {
        row.classList.remove('highlight');
    });
    
    const material = currentContainer.materials.find(m => m.code === materialCode);
    if (material && material.outboundDetails) {
        const materialIndex = currentContainer.materials.indexOf(material);
        const targetRows = document.querySelectorAll(`#materialTableBody tr.outbound-row`);
        
        let rowIndex = 0;
        for (let i = 0; i < materialIndex; i++) {
            const mat = currentContainer.materials[i];
            if (mat.outboundDetails && mat.outboundDetails.length > 0) {
                rowIndex += mat.outboundDetails.length;
            } else {
                rowIndex += 1;
            }
        }
        
        for (let i = 0; i < material.outboundDetails.length; i++) {
            if (targetRows[rowIndex + i]) {
                targetRows[rowIndex + i].classList.add('highlight');
            }
        }
    }
}

// 更新实际出库数量
function updateActualQty(materialIndex, detailIndex, value) {
    const qty = parseInt(value) || 0;
    const material = currentContainer.materials[materialIndex];
    const detail = material.outboundDetails[detailIndex];
    
    if (qty < 0) {
        alert('数量不能小于0！');
        renderMaterialTable();
        return;
    }
    
    if (qty > detail.requiredQty) {
        alert(`实际出库数量不能超过需出库数量 ${detail.requiredQty}！`);
        renderMaterialTable();
        return;
    }
    
    if (qty > material.currentQty) {
        alert(`实际出库数量不能超过当前库存数量 ${material.currentQty}！`);
        renderMaterialTable();
        return;
    }
    
    detail.actualQty = qty;
}

// 打开确认出库弹窗
function openConfirmModal(materialIndex, detailIndex) {
    const material = currentContainer.materials[materialIndex];
    const detail = material.outboundDetails[detailIndex];
    
    if (detail.actualQty <= 0) {
        alert('请先填写实际出库数量！');
        return;
    }
    
    if (detail.actualQty > detail.requiredQty) {
        alert(`实际出库数量不能超过需出库数量 ${detail.requiredQty}！`);
        return;
    }
    
    // 保存当前确认的项目
    currentOutboundItem = {
        materialIndex: materialIndex,
        detailIndex: detailIndex,
        material: material,
        detail: detail
    };
    
    // 显示确认信息
    document.getElementById('modalOrderNo').textContent = detail.orderNo;
    document.getElementById('modalMaterialCode').textContent = material.code;
    document.getElementById('modalMaterialName').textContent = material.name;
    document.getElementById('modalRequiredQty').textContent = detail.requiredQty;
    document.getElementById('modalActualQty').textContent = detail.actualQty;
    
    // 显示弹窗
    document.getElementById('confirmOutboundModal').classList.add('active');
}

// 关闭确认出库弹窗
function closeConfirmModal() {
    document.getElementById('confirmOutboundModal').classList.remove('active');
    currentOutboundItem = null;
}

// 确认出库
function confirmOutbound() {
    if (!currentOutboundItem) {
        return;
    }
    
    const { material, detail } = currentOutboundItem;
    
    // 更新容器物料数量
    material.currentQty -= detail.actualQty;
    
    // 更新出库单数量
    const order = outboundOrders.find(o => o.orderNo === detail.orderNo);
    if (order) {
        order.outboundQty += detail.actualQty;
        order.pendingQty -= detail.actualQty;
    }
    
    // 标记为已确认
    detail.confirmed = true;
    
    // 关闭弹窗
    closeConfirmModal();
    
    // 重新渲染
    renderOrderList();
    renderMaterialTable();
    
    alert(`出库成功！\n出库单号：${detail.orderNo}\n物料：${material.name}\n数量：${detail.actualQty}`);
}

// 确认全部出库
function confirmAllOutbound() {
    if (!currentContainer) {
        alert('没有当前容器信息！');
        return;
    }
    
    // 检查是否所有需要出库的物料都已确认
    let allConfirmed = true;
    let unconfirmedList = [];
    
    for (const material of currentContainer.materials) {
        if (material.outboundDetails && material.outboundDetails.length > 0) {
            for (const detail of material.outboundDetails) {
                if (!detail.confirmed) {
                    allConfirmed = false;
                    unconfirmedList.push({
                        materialCode: material.code,
                        materialName: material.name,
                        orderNo: detail.orderNo,
                        requiredQty: detail.requiredQty,
                        actualQty: detail.actualQty
                    });
                }
            }
        }
    }
    
    if (!allConfirmed) {
        // 显示未确认物料弹窗
        showUnconfirmedModal(unconfirmedList);
        return;
    }
    
    // 打开选择入库库位弹窗
    openLocationModal();
}

// 显示未确认物料弹窗
function showUnconfirmedModal(unconfirmedList) {
    const listContainer = document.getElementById('unconfirmedList');
    
    listContainer.innerHTML = unconfirmedList.map(item => `
        <div class="unconfirmed-item">
            <div class="unconfirmed-item-header">
                <span class="material-code">${item.materialCode}</span>
                <span class="material-name">${item.materialName}</span>
            </div>
            <div class="unconfirmed-item-body">
                <span class="order-label">订单：${item.orderNo}</span>
                <span class="qty-label">需出库：${item.requiredQty}</span>
                <span class="qty-label ${item.actualQty > 0 ? 'has-qty' : ''}">
                    已填写：${item.actualQty > 0 ? item.actualQty : '未填写'}
                </span>
            </div>
        </div>
    `).join('');
    
    document.getElementById('unconfirmedModal').classList.add('active');
}

// 关闭未确认物料弹窗
function closeUnconfirmedModal() {
    document.getElementById('unconfirmedModal').classList.remove('active');
}

// 打开选择入库库位弹窗
function openLocationModal() {
    // 显示容器信息
    document.getElementById('modalContainerCode').textContent = currentContainer.code;
    document.getElementById('modalContainerType').textContent = currentContainer.type;
    
    // 填充库位选项
    const locationSelect = document.getElementById('modalLocationSelect');
    locationSelect.innerHTML = '<option value="">请选择库位</option>' + 
        availableLocations.map(loc => 
            `<option value="${loc.code}">${loc.code} (${loc.area})</option>`
        ).join('');
    
    // 自动选择第一个库位
    if (availableLocations.length > 0) {
        locationSelect.value = availableLocations[0].code;
    }
    
    // 显示弹窗
    document.getElementById('confirmLocationModal').classList.add('active');
}

// 关闭选择入库库位弹窗
function closeLocationModal() {
    document.getElementById('confirmLocationModal').classList.remove('active');
}

// 确认入库
function confirmLocation() {
    const location = document.getElementById('modalLocationSelect').value;
    
    if (!location) {
        alert('请选择入库库位！');
        return;
    }
    
    if (!currentContainer) {
        alert('没有当前容器信息！');
        return;
    }
    
    // 生成入库任务
    alert(`入库任务已生成！\n\n容器编码：${currentContainer.code}\n入库库位：${location}\n\n系统将自动调度堆垛机将容器回库至指定库位。`);
    
    // 关闭弹窗
    closeLocationModal();
    
    // 重置页面，返回扫描容器状态
    currentContainer = null;
    document.getElementById('currentOutboundSection').style.display = 'none';
    document.getElementById('scanContainerSection').style.display = 'block';
    document.getElementById('scanContainerCode').value = '';
    document.getElementById('scanContainerCode').focus();
    
    // 重新渲染预览出库单信息
    renderOrderListPreview();
}

// 确认回库（旧的回库按钮，保留兼容）
function confirmReturn() {
    const location = document.getElementById('returnLocationSelect').value;
    
    if (!location) {
        alert('请选择回库库位！');
        return;
    }
    
    if (!currentContainer) {
        alert('没有当前容器信息！');
        return;
    }
    
    // 生成入库任务
    alert(`入库任务已生成！\n\n容器编码：${currentContainer.code}\n入库库位：${location}\n\n系统将自动调度堆垛机将容器回库至指定库位。`);
    
    // 重置页面，返回扫描容器状态
    currentContainer = null;
    document.getElementById('currentOutboundSection').style.display = 'none';
    document.getElementById('scanContainerSection').style.display = 'block';
    document.getElementById('scanContainerCode').value = '';
    document.getElementById('scanContainerCode').focus();
    
    // 重新渲染预览出库单信息
    renderOrderListPreview();
}
