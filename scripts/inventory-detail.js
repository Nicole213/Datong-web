// 库存明细页面脚本

// 模拟库存数据（物料+容器维度）
let inventoryData = [
    {
        id: 1,
        materialCode: 'WL-2024-001',
        materialName: '电子元件A型',
        containerCode: 'TP-001',
        containerType: '小金属框',
        locationCode: '1-1-5-1',
        area: '库区A',
        quantity: 30,
        palletTime: '2024-01-10 09:30:00',
        inboundTime: '2024-01-10 10:15:00',
        age: 25,
        status: '正常'
    },
    {
        id: 2,
        materialCode: 'WL-2024-002',
        materialName: '机械零件B型',
        containerCode: 'TP-001',
        containerType: '小金属框',
        locationCode: '1-1-5-1',
        area: '库区A',
        quantity: 20,
        palletTime: '2024-01-10 09:30:00',
        inboundTime: '2024-01-10 10:15:00',
        age: 25,
        status: '正常'
    },
    {
        id: 3,
        materialCode: 'WL-2024-001',
        materialName: '电子元件A型',
        containerCode: 'TP-002',
        containerType: '大金属框',
        locationCode: '1-2-5-1',
        area: '库区A',
        quantity: 50,
        palletTime: '2024-01-12 14:20:00',
        inboundTime: '2024-01-12 15:00:00',
        age: 23,
        status: '正常'
    },
    {
        id: 4,
        materialCode: 'WL-2024-003',
        materialName: '塑料配件C型',
        containerCode: 'TP-003',
        containerType: '塑料托盘',
        locationCode: '1-3-8-1',
        area: '库区A',
        quantity: 100,
        palletTime: '2024-01-15 10:00:00',
        inboundTime: '2024-01-15 11:30:00',
        age: 20,
        status: '锁定'
    },
    {
        id: 5,
        materialCode: 'WL-2024-002',
        materialName: '机械零件B型',
        containerCode: 'TP-004',
        containerType: '大金属框',
        locationCode: '2-1-6-1',
        area: '库区B',
        quantity: 40,
        palletTime: '2024-01-18 08:45:00',
        inboundTime: '2024-01-18 09:20:00',
        age: 17,
        status: '正常'
    },
    {
        id: 6,
        materialCode: 'WL-2024-004',
        materialName: '长物料钢材D型',
        containerCode: 'TP-005',
        containerType: '长物料钢托盘',
        locationCode: '2-5-10-1',
        area: '库区B',
        quantity: 15,
        palletTime: '2024-01-20 13:15:00',
        inboundTime: '2024-01-20 14:00:00',
        age: 15,
        status: '正常'
    },
    {
        id: 7,
        materialCode: 'WL-2024-005',
        materialName: '金属材料E型',
        containerCode: 'TP-006',
        containerType: '大金属框',
        locationCode: '3-2-7-1',
        area: '库区C',
        quantity: 35,
        palletTime: '2024-01-22 11:00:00',
        inboundTime: '2024-01-22 11:45:00',
        age: 13,
        status: '锁定'
    },
    {
        id: 8,
        materialCode: 'WL-2024-001',
        materialName: '电子元件A型',
        containerCode: 'TP-007',
        containerType: '小金属框',
        locationCode: '1-8-12-2',
        area: '库区A',
        quantity: 25,
        palletTime: '2024-01-25 15:30:00',
        inboundTime: '2024-01-25 16:10:00',
        age: 10,
        status: '正常'
    },
    {
        id: 9,
        materialCode: 'WL-2024-003',
        materialName: '塑料配件C型',
        containerCode: 'TP-008',
        containerType: '塑料托盘',
        locationCode: '2-4-9-1',
        area: '库区B',
        quantity: 80,
        palletTime: '2024-01-28 09:00:00',
        inboundTime: '2024-01-28 10:00:00',
        age: 7,
        status: '正常'
    },
    {
        id: 10,
        materialCode: 'WL-2024-002',
        materialName: '机械零件B型',
        containerCode: 'TP-009',
        containerType: '大金属框',
        locationCode: '1-5-11-1',
        area: '库区A',
        quantity: 45,
        palletTime: '2024-02-01 10:30:00',
        inboundTime: '2024-02-01 11:15:00',
        age: 3,
        status: '正常'
    }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...inventoryData];
let selectedItems = new Set();
let selectedManualContainers = new Set();
let selectedManualMaterials = new Set();
let generatedManualOutboundTasks = [];
let manualOutboundTaskSequence = 1;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('inventoryTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(item => {
        const ageClass = item.age > 30 ? 'age-danger' : item.age > 15 ? 'age-warning' : 'age-normal';
        const statusClass = item.status === '锁定' ? 'locked' : 'normal';
        
        return `
        <tr class="${selectedItems.has(item.id) ? 'selected' : ''}">
            <td><input type="checkbox" class="item-checkbox" value="${item.id}" ${selectedItems.has(item.id) ? 'checked' : ''}></td>
            <td>${item.materialCode}</td>
            <td>${item.materialName}</td>
            <td>${item.containerCode}</td>
            <td>${item.containerType}</td>
            <td>${item.locationCode}</td>
            <td>${item.area}</td>
            <td>${item.quantity}</td>
            <td>${item.palletTime}</td>
            <td>${item.inboundTime}</td>
            <td class="${ageClass}">${item.age}</td>
            <td><span class="status-badge ${statusClass}">${item.status}</span></td>
        </tr>
    `}).join('');

    // 绑定复选框事件
    tbody.querySelectorAll('.item-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
            const id = parseInt(this.value);
            const row = this.closest('tr');
            
            if (this.checked) {
                selectedItems.add(id);
                row.classList.add('selected');
            } else {
                selectedItems.delete(id);
                row.classList.remove('selected');
            }
            updateSelectAll();
        });
    });

    updatePagination();
    updateSelectAll();
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getAvailableManualOutboundItems() {
    return inventoryData.filter(item => item.status === '正常');
}

function getManualOutboundContainerData() {
    const containerMap = new Map();

    getAvailableManualOutboundItems().forEach(item => {
        if (!containerMap.has(item.containerCode)) {
            containerMap.set(item.containerCode, {
                containerCode: item.containerCode,
                containerType: item.containerType,
                area: item.area,
                locationCode: item.locationCode,
                palletTime: item.palletTime,
                materials: []
            });
        }

        containerMap.get(item.containerCode).materials.push({
            materialCode: item.materialCode,
            materialName: item.materialName,
            quantity: item.quantity,
            itemId: item.id
        });
    });

    return Array.from(containerMap.values()).sort((a, b) => a.containerCode.localeCompare(b.containerCode, 'zh-CN', { numeric: true }));
}

function getManualOutboundMaterialData() {
    return getAvailableManualOutboundItems().slice().sort((a, b) => {
        const materialCompare = a.materialCode.localeCompare(b.materialCode, 'zh-CN', { numeric: true });
        if (materialCompare !== 0) return materialCompare;
        return a.containerCode.localeCompare(b.containerCode, 'zh-CN', { numeric: true });
    });
}

function updateManualContainerSelectAll() {
    const checkboxes = document.querySelectorAll('#manualOutboundContainerBody .manual-container-checkbox');
    const checkedCount = document.querySelectorAll('#manualOutboundContainerBody .manual-container-checkbox:checked').length;
    const selectAll = document.getElementById('selectAllManualContainers');

    selectAll.checked = checkboxes.length > 0 && checkedCount === checkboxes.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
}

function updateManualMaterialSelectAll() {
    const checkboxes = document.querySelectorAll('#manualOutboundMaterialBody .manual-material-checkbox');
    const checkedCount = document.querySelectorAll('#manualOutboundMaterialBody .manual-material-checkbox:checked').length;
    const selectAll = document.getElementById('selectAllManualMaterials');

    selectAll.checked = checkboxes.length > 0 && checkedCount === checkboxes.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
}

function renderManualOutboundContainerTable() {
    const tbody = document.getElementById('manualOutboundContainerBody');
    const containerData = getManualOutboundContainerData();

    tbody.innerHTML = containerData.length > 0
        ? containerData.map(container => `
            <tr>
                <td><input type="checkbox" class="manual-container-checkbox" value="${escapeHtml(container.containerCode)}" ${selectedManualContainers.has(container.containerCode) ? 'checked' : ''}></td>
                <td>${container.containerCode}</td>
                <td>${container.containerType}</td>
                <td class="material-info-cell">${container.materials.map(material => `${escapeHtml(material.materialName)} × ${material.quantity}`).join('<br>')}</td>
                <td>${container.area}</td>
                <td>${container.locationCode}</td>
                <td>${container.palletTime}</td>
            </tr>
        `).join('')
        : `
            <tr class="table-empty-row">
                <td colspan="7">暂无可手动出库的容器数据</td>
            </tr>
        `;

    tbody.querySelectorAll('.manual-container-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
            if (this.checked) {
                selectedManualContainers.add(this.value);
            } else {
                selectedManualContainers.delete(this.value);
            }
            updateManualContainerSelectAll();
        });
    });

    updateManualContainerSelectAll();
}

function renderManualOutboundMaterialTable() {
    const tbody = document.getElementById('manualOutboundMaterialBody');
    const materialData = getManualOutboundMaterialData();

    tbody.innerHTML = materialData.length > 0
        ? materialData.map(item => `
            <tr>
                <td><input type="checkbox" class="manual-material-checkbox" value="${item.id}" ${selectedManualMaterials.has(item.id) ? 'checked' : ''}></td>
                <td>${item.materialCode}</td>
                <td>${item.materialName}</td>
                <td>${item.quantity}</td>
                <td>${item.containerCode}</td>
                <td>${item.containerType}</td>
                <td>${item.area}</td>
                <td>${item.locationCode}</td>
                <td>${item.palletTime}</td>
                <td>${item.inboundTime}</td>
                <td>${item.age}</td>
            </tr>
        `).join('')
        : `
            <tr class="table-empty-row">
                <td colspan="11">暂无可手动出库的物料数据</td>
            </tr>
        `;

    tbody.querySelectorAll('.manual-material-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
            const id = Number(this.value);
            if (this.checked) {
                selectedManualMaterials.add(id);
            } else {
                selectedManualMaterials.delete(id);
            }
            updateManualMaterialSelectAll();
        });
    });

    updateManualMaterialSelectAll();
}

function resetManualOutboundForm() {
    document.getElementById('manualOutboundDimension').value = '';
    document.getElementById('manualOutboundPort').value = '';
    document.getElementById('manualOutboundContainerSection').classList.add('hidden');
    document.getElementById('manualOutboundMaterialSection').classList.add('hidden');
    document.getElementById('manualOutboundContainerBody').innerHTML = '';
    document.getElementById('manualOutboundMaterialBody').innerHTML = '';
    document.getElementById('selectAllManualContainers').checked = false;
    document.getElementById('selectAllManualContainers').indeterminate = false;
    document.getElementById('selectAllManualMaterials').checked = false;
    document.getElementById('selectAllManualMaterials').indeterminate = false;
    selectedManualContainers.clear();
    selectedManualMaterials.clear();
}

function openManualOutboundModal() {
    resetManualOutboundForm();
    document.getElementById('manualOutboundModal').classList.add('active');
}

function closeManualOutboundModal() {
    document.getElementById('manualOutboundModal').classList.remove('active');
    resetManualOutboundForm();
}

function handleManualOutboundDimensionChange() {
    const dimension = document.getElementById('manualOutboundDimension').value;
    const containerSection = document.getElementById('manualOutboundContainerSection');
    const materialSection = document.getElementById('manualOutboundMaterialSection');

    selectedManualContainers.clear();
    selectedManualMaterials.clear();
    document.getElementById('selectAllManualContainers').checked = false;
    document.getElementById('selectAllManualContainers').indeterminate = false;
    document.getElementById('selectAllManualMaterials').checked = false;
    document.getElementById('selectAllManualMaterials').indeterminate = false;

    if (dimension === 'container') {
        containerSection.classList.remove('hidden');
        materialSection.classList.add('hidden');
        renderManualOutboundContainerTable();
        return;
    }

    if (dimension === 'material') {
        materialSection.classList.remove('hidden');
        containerSection.classList.add('hidden');
        renderManualOutboundMaterialTable();
        return;
    }

    containerSection.classList.add('hidden');
    materialSection.classList.add('hidden');
}

function generateManualOutboundTaskNo() {
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    return `TASK-SD-${datePart}-${String(manualOutboundTaskSequence++).padStart(3, '0')}`;
}

function executeManualOutbound() {
    const dimension = document.getElementById('manualOutboundDimension').value;
    const port = document.getElementById('manualOutboundPort').value;

    if (!dimension) {
        alert('请选择出库维度！');
        return;
    }

    if (!port) {
        alert('请选择出库口！');
        return;
    }

    let taskSummaries = [];

    if (dimension === 'container') {
        if (selectedManualContainers.size === 0) {
            alert('请至少勾选一个容器！');
            return;
        }

        const selectedContainerData = getManualOutboundContainerData().filter(container =>
            selectedManualContainers.has(container.containerCode)
        );

        if (selectedContainerData.length === 0) {
            alert('当前勾选容器已无可出库库存，请刷新后重试！');
            return;
        }

        selectedContainerData.forEach(container => {
            generatedManualOutboundTasks.push({
                taskNo: generateManualOutboundTaskNo(),
                dimension: '容器',
                port,
                containerCode: container.containerCode,
                materials: container.materials.map(material => ({
                    materialCode: material.materialCode,
                    materialName: material.materialName,
                    quantity: material.quantity
                }))
            });
        });

        inventoryData = inventoryData.filter(item =>
            !(selectedManualContainers.has(item.containerCode) && item.status === '正常')
        );
        taskSummaries = selectedContainerData.map(container => `${container.containerCode} -> ${port}`);
    } else {
        if (selectedManualMaterials.size === 0) {
            alert('请至少勾选一条物料明细！');
            return;
        }

        const selectedMaterialData = getManualOutboundMaterialData().filter(item =>
            selectedManualMaterials.has(item.id)
        );

        if (selectedMaterialData.length === 0) {
            alert('当前勾选物料已无可出库库存，请刷新后重试！');
            return;
        }

        selectedMaterialData.forEach(item => {
            generatedManualOutboundTasks.push({
                taskNo: generateManualOutboundTaskNo(),
                dimension: '物料',
                port,
                containerCode: item.containerCode,
                materialCode: item.materialCode,
                materialName: item.materialName,
                quantity: item.quantity
            });
        });

        inventoryData = inventoryData.filter(item => !selectedManualMaterials.has(item.id));
        taskSummaries = selectedMaterialData.map(item => `${item.materialCode}/${item.containerCode} -> ${port}`);
    }

    filteredData = [...inventoryData];
    selectedItems.clear();
    closeManualOutboundModal();
    searchInventory();

    alert(`手动出库任务已生成并执行！\n\n出库维度：${dimension === 'container' ? '容器' : '物料'}\n出库口：${port}\n任务数量：${taskSummaries.length}\n\n${taskSummaries.join('\n')}`);
}

// 更新分页
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages || 1;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

// 更新全选状态
function updateSelectAll() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const checkedCount = document.querySelectorAll('.item-checkbox:checked').length;
    const selectAll = document.getElementById('selectAll');
    
    if (checkboxes.length > 0) {
        selectAll.checked = checkedCount === checkboxes.length;
        selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
    } else {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    }
}

// 初始化事件监听
function initEventListeners() {
    // 查询按钮
    document.getElementById('searchBtn').addEventListener('click', searchInventory);
    
    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', resetSearch);
    
    // 全选
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = this.checked;
            const id = parseInt(cb.value);
            const row = cb.closest('tr');
            
            if (this.checked) {
                selectedItems.add(id);
                row.classList.add('selected');
            } else {
                selectedItems.delete(id);
                row.classList.remove('selected');
            }
        });
    });
    
    // 物料锁定
    document.getElementById('lockBtn').addEventListener('click', lockMaterials);
    
    // 物料解锁
    document.getElementById('unlockBtn').addEventListener('click', unlockMaterials);
    
    // 清空库存
    document.getElementById('clearBtn').addEventListener('click', clearInventory);
    
    // 导出
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('manualOutboundBtn').addEventListener('click', openManualOutboundModal);
    document.getElementById('manualOutboundClose').addEventListener('click', closeManualOutboundModal);
    document.getElementById('manualOutboundCancelBtn').addEventListener('click', closeManualOutboundModal);
    document.getElementById('manualOutboundConfirmBtn').addEventListener('click', executeManualOutbound);
    document.getElementById('manualOutboundDimension').addEventListener('change', handleManualOutboundDimensionChange);
    document.getElementById('selectAllManualContainers').addEventListener('change', function() {
        document.querySelectorAll('#manualOutboundContainerBody .manual-container-checkbox').forEach(cb => {
            cb.checked = this.checked;
            if (this.checked) {
                selectedManualContainers.add(cb.value);
            } else {
                selectedManualContainers.delete(cb.value);
            }
        });
        updateManualContainerSelectAll();
    });
    document.getElementById('selectAllManualMaterials').addEventListener('change', function() {
        document.querySelectorAll('#manualOutboundMaterialBody .manual-material-checkbox').forEach(cb => {
            cb.checked = this.checked;
            const id = Number(cb.value);
            if (this.checked) {
                selectedManualMaterials.add(id);
            } else {
                selectedManualMaterials.delete(id);
            }
        });
        updateManualMaterialSelectAll();
    });
    document.getElementById('manualOutboundModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeManualOutboundModal();
        }
    });
    
    // 分页按钮
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            selectedItems.clear();
            renderTable();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            selectedItems.clear();
            renderTable();
        }
    });
}

// 查询库存
function searchInventory() {
    const material = document.getElementById('searchMaterial').value.trim().toLowerCase();
    const container = document.getElementById('searchContainer').value.trim().toLowerCase();
    const status = document.getElementById('searchStatus').value;
    const row = document.getElementById('searchRow').value.trim();
    const col = document.getElementById('searchCol').value.trim();
    const level = document.getElementById('searchLevel').value.trim();
    const depth = document.getElementById('searchDepth').value.trim();
    
    filteredData = inventoryData.filter(item => {
        const matchMaterial = !material || 
            item.materialCode.toLowerCase().includes(material) || 
            item.materialName.toLowerCase().includes(material);
        const matchContainer = !container || item.containerCode.toLowerCase().includes(container);
        const matchStatus = !status || item.status === status;
        
        // 解析库位编码
        const locationParts = item.locationCode.split('-');
        const matchRow = !row || locationParts[0] === row;
        const matchCol = !col || locationParts[1] === col;
        const matchLevel = !level || locationParts[2] === level;
        const matchDepth = !depth || locationParts[3] === depth;
        
        return matchMaterial && matchContainer && matchStatus && 
               matchRow && matchCol && matchLevel && matchDepth;
    });
    
    currentPage = 1;
    selectedItems.clear();
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchMaterial').value = '';
    document.getElementById('searchContainer').value = '';
    document.getElementById('searchStatus').value = '';
    document.getElementById('searchRow').value = '';
    document.getElementById('searchCol').value = '';
    document.getElementById('searchLevel').value = '';
    document.getElementById('searchDepth').value = '';
    
    filteredData = [...inventoryData];
    currentPage = 1;
    selectedItems.clear();
    renderTable();
}

// 物料锁定
function lockMaterials() {
    if (selectedItems.size === 0) {
        alert('请至少选择一条库存记录！');
        return;
    }
    
    // 检查是否有已锁定的物料
    const selectedData = inventoryData.filter(item => selectedItems.has(item.id));
    const alreadyLocked = selectedData.filter(item => item.status === '锁定');
    
    if (alreadyLocked.length > 0) {
        alert(`选中的记录中有 ${alreadyLocked.length} 条已经是锁定状态！`);
        return;
    }
    
    if (confirm(`确定要锁定选中的 ${selectedItems.size} 条库存记录吗？\n\n锁定后，这些物料将不可出库。`)) {
        selectedItems.forEach(id => {
            const item = inventoryData.find(i => i.id === id);
            if (item) {
                item.status = '锁定';
            }
        });
        
        alert(`成功锁定 ${selectedItems.size} 条库存记录！`);
        selectedItems.clear();
        renderTable();
    }
}

// 物料解锁
function unlockMaterials() {
    if (selectedItems.size === 0) {
        alert('请至少选择一条库存记录！');
        return;
    }
    
    // 检查是否有正常状态的物料
    const selectedData = inventoryData.filter(item => selectedItems.has(item.id));
    const alreadyNormal = selectedData.filter(item => item.status === '正常');
    
    if (alreadyNormal.length > 0) {
        alert(`选中的记录中有 ${alreadyNormal.length} 条已经是正常状态！`);
        return;
    }
    
    if (confirm(`确定要解锁选中的 ${selectedItems.size} 条库存记录吗？\n\n解锁后，这些物料将可以正常出库。`)) {
        selectedItems.forEach(id => {
            const item = inventoryData.find(i => i.id === id);
            if (item) {
                item.status = '正常';
            }
        });
        
        alert(`成功解锁 ${selectedItems.size} 条库存记录！`);
        selectedItems.clear();
        renderTable();
    }
}

// 清空库存
function clearInventory() {
    if (selectedItems.size === 0) {
        alert('请至少选择一条库存记录！');
        return;
    }
    
    const selectedData = inventoryData.filter(item => selectedItems.has(item.id));
    const materialList = selectedData.map(item => 
        `${item.materialName}(${item.materialCode}) - 容器${item.containerCode} - 数量${item.quantity}`
    ).join('\n');
    
    if (confirm(`确定要清空选中的 ${selectedItems.size} 条库存记录吗？\n\n将清空以下物料：\n${materialList}\n\n此操作不可恢复！`)) {
        // 从数据中删除选中的记录
        inventoryData = inventoryData.filter(item => !selectedItems.has(item.id));
        filteredData = filteredData.filter(item => !selectedItems.has(item.id));
        
        alert(`成功清空 ${selectedItems.size} 条库存记录！`);
        selectedItems.clear();
        
        // 如果当前页没有数据了，返回上一页
        const totalPages = Math.ceil(filteredData.length / pageSize);
        if (currentPage > totalPages && currentPage > 1) {
            currentPage = totalPages;
        }
        
        renderTable();
    }
}

// 导出数据
function exportData() {
    if (filteredData.length === 0) {
        alert('没有可导出的数据！');
        return;
    }
    
    // 构建CSV内容
    const headers = [
        '物料编码', '物料名称', '容器编码', '容器类型', '库位编码', 
        '库区', '库存数量', '组盘时间', '入库时间', '库龄(天)', '库存状态'
    ];
    
    let csvContent = headers.join(',') + '\n';
    
    filteredData.forEach(item => {
        const row = [
            item.materialCode,
            item.materialName,
            item.containerCode,
            item.containerType,
            item.locationCode,
            item.area,
            item.quantity,
            item.palletTime,
            item.inboundTime,
            item.age,
            item.status
        ];
        csvContent += row.join(',') + '\n';
    });
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `库存明细_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`成功导出 ${filteredData.length} 条库存记录！`);
}
