// 库位管理页面脚本

// 模拟库区数据
const areasData = [
    { id: 1, code: 'KQ-001', name: '小金属框存放区A' },
    { id: 2, code: 'KQ-002', name: '小金属框存放区B' },
    { id: 3, code: 'KQ-003', name: '大金属塑料长物料存放区A' },
    { id: 4, code: 'KQ-005', name: '大金属塑料长物料存放区B' }
];

// 模拟库位数据
let locationsData = [
    {
        id: 1,
        code: 'KW-1-1-12-1',
        areaId: 1,
        areaName: '小金属框存放区A',
        aisle: '1',
        row: 1,
        col: 1,
        level: 12,
        depth: 1,
        containerTypes: ['小金属框'],
        currentStatus: '有货',
        lockStatus: '正常',
        enableStatus: '启用',
        containerCode: 'TP-001',
        hasTransactions: true
    },
    {
        id: 2,
        code: 'KW-1-2-12-1',
        areaId: 1,
        areaName: '小金属框存放区A',
        aisle: '1',
        row: 1,
        col: 2,
        level: 12,
        depth: 1,
        containerTypes: ['小金属框'],
        currentStatus: '空库位',
        lockStatus: '正常',
        enableStatus: '启用',
        containerCode: '',
        hasTransactions: false
    },
    {
        id: 3,
        code: 'KW-1-3-12-1',
        areaId: 1,
        areaName: '小金属框存放区A',
        aisle: '1',
        row: 1,
        col: 3,
        level: 12,
        depth: 1,
        containerTypes: ['小金属框'],
        currentStatus: '空托',
        lockStatus: '正常',
        enableStatus: '启用',
        containerCode: 'TP-015',
        hasTransactions: true
    },
    {
        id: 4,
        code: 'KW-1-4-12-1',
        areaId: 1,
        areaName: '小金属框存放区A',
        aisle: '1',
        row: 1,
        col: 4,
        level: 12,
        depth: 1,
        containerTypes: ['小金属框'],
        currentStatus: '已分配',
        lockStatus: '锁定',
        enableStatus: '启用',
        containerCode: '',
        hasTransactions: false
    },
    {
        id: 5,
        code: 'KW-2-1-10-1',
        areaId: 2,
        areaName: '小金属框存放区B',
        aisle: '1',
        row: 2,
        col: 1,
        level: 10,
        depth: 1,
        containerTypes: ['小金属框'],
        currentStatus: '有货',
        lockStatus: '正常',
        enableStatus: '启用',
        containerCode: 'TP-025',
        hasTransactions: true
    },
    {
        id: 6,
        code: 'KW-3-1-8-1',
        areaId: 3,
        areaName: '大金属塑料长物料存放区A',
        aisle: '2',
        row: 3,
        col: 1,
        level: 8,
        depth: 1,
        containerTypes: ['大金属框', '塑料托盘', '长物料钢托盘'],
        currentStatus: '空库位',
        lockStatus: '正常',
        enableStatus: '启用',
        containerCode: '',
        hasTransactions: false
    },
    {
        id: 7,
        code: 'KW-4-1-6-1',
        areaId: 4,
        areaName: '大金属塑料长物料存放区B',
        aisle: '2',
        row: 4,
        col: 1,
        level: 6,
        depth: 1,
        containerTypes: ['大金属框', '塑料托盘'],
        currentStatus: '空库位',
        lockStatus: '正常',
        enableStatus: '禁用',
        containerCode: '',
        hasTransactions: false
    }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...locationsData];
let editingLocationId = null;
let selectedLocations = new Set();

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initAreaSelects();
    renderTable();
    initEventListeners();
    initMultiSelect();
});

// 初始化库区下拉框
function initAreaSelects() {
    const searchArea = document.getElementById('searchArea');
    const bindAreaSelect = document.getElementById('bindAreaSelect');
    
    areasData.forEach(area => {
        searchArea.innerHTML += `<option value="${area.id}">${area.name}</option>`;
        bindAreaSelect.innerHTML += `<option value="${area.id}">${area.name}</option>`;
    });
}

// 初始化多选下拉框
function initMultiSelect() {
    const dropdown = document.getElementById('containerTypeFilter');
    const display = dropdown.querySelector('.multi-select-display');
    
    display.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
        dropdown.classList.remove('active');
    });
    
    dropdown.querySelector('.multi-select-options').addEventListener('click', (e) => {
        e.stopPropagation();
        updateMultiSelectDisplay();
    });
}

// 更新多选显示
function updateMultiSelectDisplay() {
    const dropdown = document.getElementById('containerTypeFilter');
    const display = dropdown.querySelector('.multi-select-display');
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) {
        display.textContent = '请选择';
    } else {
        const values = Array.from(checkboxes).map(cb => cb.value);
        display.textContent = values.join('、');
    }
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('locationTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(location => `
        <tr>
            <td><input type="checkbox" class="row-checkbox" value="${location.id}" ${selectedLocations.has(location.id) ? 'checked' : ''}></td>
            <td>${location.code}</td>
            <td>${location.areaName}</td>
            <td>${location.aisle}号巷道</td>
            <td>${location.row}</td>
            <td>${location.col}</td>
            <td>${location.level}</td>
            <td>${location.containerTypes.join('、')}</td>
            <td>
                <span class="status-badge ${getStatusClass(location.currentStatus)}">
                    ${location.currentStatus}
                </span>
            </td>
            <td>
                <span class="status-badge ${location.lockStatus === '锁定' ? 'locked' : 'normal'}">
                    ${location.lockStatus}
                </span>
            </td>
            <td>
                <span class="status-badge ${location.enableStatus === '启用' ? 'enabled' : 'disabled'}">
                    ${location.enableStatus}
                </span>
            </td>
            <td>${location.containerCode || '-'}</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editLocation(${location.id})">编辑</button>
                    <button class="delete-btn" onclick="deleteLocation(${location.id})">删除</button>
                    ${location.enableStatus === '启用' 
                        ? `<button class="disable-btn" onclick="toggleEnable(${location.id})">禁用</button>`
                        : `<button class="enable-btn" onclick="toggleEnable(${location.id})">启用</button>`
                    }
                </div>
            </td>
        </tr>
    `).join('');

    updatePagination();
    updateCheckboxListeners();
    updateBatchButtons();
}

// 获取状态样式类
function getStatusClass(status) {
    const statusMap = {
        '空库位': 'empty',
        '有货': 'occupied',
        '已分配': 'assigned',
        '空托': 'empty-pallet'
    };
    return statusMap[status] || 'empty';
}

// 更新复选框监听
function updateCheckboxListeners() {
    document.querySelectorAll('.row-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = parseInt(e.target.value);
            if (e.target.checked) {
                selectedLocations.add(id);
            } else {
                selectedLocations.delete(id);
            }
            updateSelectAll();
            updateBatchButtons();
        });
    });
}

// 更新全选状态
function updateSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
    
    selectAll.checked = checkboxes.length > 0 && checkedCount === checkboxes.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
}

// 更新批量操作按钮状态
function updateBatchButtons() {
    const lockBtn = document.getElementById('lockBtn');
    const unlockBtn = document.getElementById('unlockBtn');
    
    const selectedCount = selectedLocations.size;
    lockBtn.disabled = selectedCount === 0;
    unlockBtn.disabled = selectedCount === 0;
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
    // 全选
    document.getElementById('selectAll').addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = e.target.checked;
            const id = parseInt(cb.value);
            if (e.target.checked) {
                selectedLocations.add(id);
            } else {
                selectedLocations.delete(id);
            }
        });
        updateBatchButtons();
    });
    
    // 查询按钮
    document.getElementById('searchBtn').addEventListener('click', searchLocations);
    
    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', resetSearch);
    
    // 新增按钮
    document.getElementById('addBtn').addEventListener('click', openAddModal);
    
    // 批量新增按钮
    document.getElementById('batchAddBtn').addEventListener('click', openBatchAddModal);
    
    // 锁定/解锁按钮
    document.getElementById('lockBtn').addEventListener('click', () => batchLock(true));
    document.getElementById('unlockBtn').addEventListener('click', () => batchLock(false));
    
    // 绑定库区按钮
    document.getElementById('bindAreaBtn').addEventListener('click', openBindAreaModal);
    
    // 分页按钮
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
    
    // 弹窗关闭按钮
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // 保存按钮
    document.getElementById('saveBtn').addEventListener('click', saveLocation);
    document.getElementById('cancelBtn').addEventListener('click', closeModals);
    
    // 批量新增
    document.getElementById('batchClose').addEventListener('click', closeBatchModal);
    document.getElementById('batchSaveBtn').addEventListener('click', saveBatchLocations);
    document.getElementById('batchCancelBtn').addEventListener('click', closeBatchModal);
    
    // 绑定库区
    document.getElementById('bindClose').addEventListener('click', closeBindModal);
    document.getElementById('bindSaveBtn').addEventListener('click', saveBindArea);
    document.getElementById('bindCancelBtn').addEventListener('click', closeBindModal);
    
    // 点击弹窗外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModals();
            }
        });
    });
}

// 查询库位
function searchLocations() {
    const code = document.getElementById('searchCode').value.trim().toLowerCase();
    const areaId = document.getElementById('searchArea').value;
    const aisle = document.getElementById('searchAisle').value;
    const row = document.getElementById('searchRow').value;
    const col = document.getElementById('searchCol').value;
    const level = document.getElementById('searchLevel').value;
    const currentStatus = document.getElementById('searchCurrentStatus').value;
    const lockStatus = document.getElementById('searchLockStatus').value;
    const enableStatus = document.getElementById('searchEnableStatus').value;
    
    // 获取选中的容器类型
    const containerTypes = Array.from(
        document.querySelectorAll('#containerTypeFilter input[type="checkbox"]:checked')
    ).map(cb => cb.value);
    
    filteredData = locationsData.filter(location => {
        const matchCode = !code || location.code.toLowerCase().includes(code);
        const matchArea = !areaId || location.areaId === parseInt(areaId);
        const matchAisle = !aisle || location.aisle === aisle;
        const matchRow = !row || location.row === parseInt(row);
        const matchCol = !col || location.col === parseInt(col);
        const matchLevel = !level || location.level === parseInt(level);
        const matchCurrentStatus = !currentStatus || location.currentStatus === currentStatus;
        const matchLockStatus = !lockStatus || location.lockStatus === lockStatus;
        const matchEnableStatus = !enableStatus || location.enableStatus === enableStatus;
        const matchContainerTypes = containerTypes.length === 0 || 
            containerTypes.some(type => location.containerTypes.includes(type));
        
        return matchCode && matchArea && matchAisle && matchRow && matchCol && matchLevel &&
               matchCurrentStatus && matchLockStatus && matchEnableStatus && matchContainerTypes;
    });
    
    currentPage = 1;
    selectedLocations.clear();
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchCode').value = '';
    document.getElementById('searchArea').value = '';
    document.getElementById('searchAisle').value = '';
    document.getElementById('searchRow').value = '';
    document.getElementById('searchCol').value = '';
    document.getElementById('searchLevel').value = '';
    document.getElementById('searchCurrentStatus').value = '';
    document.getElementById('searchLockStatus').value = '';
    document.getElementById('searchEnableStatus').value = '';
    
    // 重置容器类型多选
    document.querySelectorAll('#containerTypeFilter input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    updateMultiSelectDisplay();
    
    filteredData = [...locationsData];
    currentPage = 1;
    selectedLocations.clear();
    renderTable();
}

// 打开新增弹窗
function openAddModal() {
    editingLocationId = null;
    document.getElementById('modalTitle').textContent = '新增库位';
    document.getElementById('locationForm').reset();
    document.querySelectorAll('input[name="containerType"]').forEach(cb => cb.checked = false);
    document.getElementById('locationModal').classList.add('active');
}

// 编辑库位
function editLocation(id) {
    const location = locationsData.find(l => l.id === id);
    if (!location) return;
    
    editingLocationId = id;
    document.getElementById('modalTitle').textContent = '编辑库位';
    document.getElementById('locationRow').value = location.row;
    document.getElementById('locationCol').value = location.col;
    document.getElementById('locationLevel').value = location.level;
    document.getElementById('locationDepth').value = location.depth;
    
    // 设置容器类型
    document.querySelectorAll('input[name="containerType"]').forEach(checkbox => {
        checkbox.checked = location.containerTypes.includes(checkbox.value);
    });
    
    document.getElementById('locationModal').classList.add('active');
}

// 保存库位
function saveLocation() {
    const row = parseInt(document.getElementById('locationRow').value);
    const col = parseInt(document.getElementById('locationCol').value);
    const level = parseInt(document.getElementById('locationLevel').value);
    const depth = parseInt(document.getElementById('locationDepth').value);
    
    const containerTypes = Array.from(document.querySelectorAll('input[name="containerType"]:checked'))
        .map(cb => cb.value);
    
    if (!row || !col || !level || !depth || containerTypes.length === 0) {
        alert('请填写所有必填项！至少选择一种容器类型。');
        return;
    }
    
    const code = `KW-${row}-${col}-${level}-${depth}`;
    
    if (editingLocationId) {
        // 编辑
        const location = locationsData.find(l => l.id === editingLocationId);
        if (location) {
            location.code = code;
            location.row = row;
            location.col = col;
            location.level = level;
            location.depth = depth;
            location.containerTypes = containerTypes;
        }
        alert('库位信息已更新！');
    } else {
        // 新增
        const newLocation = {
            id: locationsData.length + 1,
            code,
            areaId: 1,
            areaName: '小金属框存放区A',
            aisle: '1',
            row,
            col,
            level,
            depth,
            containerTypes,
            currentStatus: '空库位',
            lockStatus: '正常',
            enableStatus: '启用',
            containerCode: '',
            hasTransactions: false
        };
        locationsData.push(newLocation);
        alert('库位添加成功！');
    }
    
    closeModals();
    searchLocations();
}

// 打开批量新增弹窗
function openBatchAddModal() {
    document.getElementById('batchForm').reset();
    document.querySelectorAll('input[name="batchContainerType"]').forEach(cb => cb.checked = false);
    document.getElementById('batchAddModal').classList.add('active');
}

// 保存批量新增
function saveBatchLocations() {
    const startRow = parseInt(document.getElementById('batchStartRow').value);
    const endRow = parseInt(document.getElementById('batchEndRow').value);
    const startCol = parseInt(document.getElementById('batchStartCol').value);
    const endCol = parseInt(document.getElementById('batchEndCol').value);
    const startLevel = parseInt(document.getElementById('batchStartLevel').value);
    const endLevel = parseInt(document.getElementById('batchEndLevel').value);
    const startDepth = parseInt(document.getElementById('batchStartDepth').value);
    const endDepth = parseInt(document.getElementById('batchEndDepth').value);
    
    const containerTypes = Array.from(document.querySelectorAll('input[name="batchContainerType"]:checked'))
        .map(cb => cb.value);
    
    if (!startRow || !endRow || !startCol || !endCol || !startLevel || !endLevel || 
        !startDepth || !endDepth || containerTypes.length === 0) {
        alert('请填写所有必填项！至少选择一种容器类型。');
        return;
    }
    
    if (startRow > endRow || startCol > endCol || startLevel > endLevel || startDepth > endDepth) {
        alert('起始值不能大于终止值！');
        return;
    }
    
    let count = 0;
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            for (let level = startLevel; level <= endLevel; level++) {
                for (let depth = startDepth; depth <= endDepth; depth++) {
                    const code = `KW-${row}-${col}-${level}-${depth}`;
                    
                    // 检查是否已存在
                    if (locationsData.some(l => l.code === code)) {
                        continue;
                    }
                    
                    const newLocation = {
                        id: locationsData.length + 1,
                        code,
                        areaId: 1,
                        areaName: '小金属框存放区A',
                        aisle: '1',
                        row,
                        col,
                        level,
                        depth,
                        containerTypes: [...containerTypes],
                        currentStatus: '空库位',
                        lockStatus: '正常',
                        enableStatus: '启用',
                        containerCode: '',
                        hasTransactions: false
                    };
                    locationsData.push(newLocation);
                    count++;
                }
            }
        }
    }
    
    alert(`批量新增成功！共添加 ${count} 个库位。`);
    closeBatchModal();
    searchLocations();
}

// 删除库位
function deleteLocation(id) {
    const location = locationsData.find(l => l.id === id);
    if (!location) return;
    
    if (location.hasTransactions) {
        alert('该库位已发生业务，不可删除！');
        return;
    }
    
    if (confirm(`确定要删除库位"${location.code}"吗？`)) {
        locationsData = locationsData.filter(l => l.id !== id);
        alert('库位已删除！');
        searchLocations();
    }
}

// 切换启用状态
function toggleEnable(id) {
    const location = locationsData.find(l => l.id === id);
    if (!location) return;
    
    const newStatus = location.enableStatus === '启用' ? '禁用' : '启用';
    const action = newStatus === '禁用' ? '禁用' : '启用';
    
    if (confirm(`确定要${action}库位"${location.code}"吗？`)) {
        location.enableStatus = newStatus;
        alert(`库位已${action}！`);
        renderTable();
    }
}

// 批量锁定/解锁
function batchLock(lock) {
    if (selectedLocations.size === 0) {
        alert('请先选择库位！');
        return;
    }
    
    const action = lock ? '锁定' : '解锁';
    if (confirm(`确定要${action}选中的 ${selectedLocations.size} 个库位吗？`)) {
        selectedLocations.forEach(id => {
            const location = locationsData.find(l => l.id === id);
            if (location) {
                location.lockStatus = lock ? '锁定' : '正常';
            }
        });
        alert(`已${action} ${selectedLocations.size} 个库位！`);
        selectedLocations.clear();
        renderTable();
    }
}

// 打开绑定库区弹窗
function openBindAreaModal() {
    document.getElementById('bindForm').reset();
    document.getElementById('bindAreaModal').classList.add('active');
}

// 保存绑定库区
function saveBindArea() {
    const areaId = parseInt(document.getElementById('bindAreaSelect').value);
    const startRow = parseInt(document.getElementById('bindStartRow').value);
    const endRow = parseInt(document.getElementById('bindEndRow').value);
    const startCol = parseInt(document.getElementById('bindStartCol').value);
    const endCol = parseInt(document.getElementById('bindEndCol').value);
    const startLevel = parseInt(document.getElementById('bindStartLevel').value);
    const endLevel = parseInt(document.getElementById('bindEndLevel').value);
    const startDepth = parseInt(document.getElementById('bindStartDepth').value);
    const endDepth = parseInt(document.getElementById('bindEndDepth').value);
    
    if (!areaId || !startRow || !endRow || !startCol || !endCol || 
        !startLevel || !endLevel || !startDepth || !endDepth) {
        alert('请填写所有必填项！');
        return;
    }
    
    const area = areasData.find(a => a.id === areaId);
    if (!area) {
        alert('所选库区不存在！');
        return;
    }
    
    if (startRow > endRow || startCol > endCol || startLevel > endLevel || startDepth > endDepth) {
        alert('起始值不能大于终止值！');
        return;
    }
    
    let count = 0;
    locationsData.forEach(location => {
        if (location.row >= startRow && location.row <= endRow &&
            location.col >= startCol && location.col <= endCol &&
            location.level >= startLevel && location.level <= endLevel &&
            location.depth >= startDepth && location.depth <= endDepth) {
            location.areaId = areaId;
            location.areaName = area.name;
            count++;
        }
    });
    
    alert(`已将 ${count} 个库位绑定到库区"${area.name}"！`);
    closeBindModal();
    searchLocations();
}

// 关闭弹窗
function closeModals() {
    document.getElementById('locationModal').classList.remove('active');
    editingLocationId = null;
}

function closeBatchModal() {
    document.getElementById('batchAddModal').classList.remove('active');
}

function closeBindModal() {
    document.getElementById('bindAreaModal').classList.remove('active');
}
