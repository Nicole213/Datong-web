// 巷道管理页面脚本

// 模拟数据
let aislesData = [
    {
        id: 1,
        code: 'XD-001',
        name: '1号巷道',
        structure: '双深',
        boundStations: ['库台A1', '库台A2', '库台B1'],
        boundRows: [1, 2],
        status: '启用',
        remark: '主巷道，负责1-2排库位',
        createTime: '2024-01-15 10:30:00'
    },
    {
        id: 2,
        code: 'XD-002',
        name: '2号巷道',
        structure: '单深',
        boundStations: ['库台C1', '库台C2', '库台C3', '库台D1'],
        boundRows: [3, 4],
        status: '启用',
        remark: '负责3-4排库位',
        createTime: '2024-01-15 10:35:00'
    },
    {
        id: 3,
        code: 'XD-003',
        name: '3号巷道',
        structure: '单深',
        boundStations: [],
        boundRows: [],
        status: '禁用',
        remark: '备用巷道',
        createTime: '2024-02-20 14:20:00'
    }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...aislesData];
let editingAisleId = null;
let bindingAisleId = null;
let bindingType = null; // 'station' or 'row'

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('aisleTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(aisle => `
        <tr>
            <td>${aisle.code}</td>
            <td>${aisle.name}</td>
            <td>
                <span class="structure-badge ${aisle.structure === '单深' ? 'single' : 'double'}">
                    ${aisle.structure}
                </span>
            </td>
            <td>
                ${aisle.boundStations.length > 0 
                    ? `<div class="tags">
                        ${aisle.boundStations.map(station => 
                            `<span class="tag">${station}</span>`
                        ).join('')}
                       </div>`
                    : '<span style="color: #999;">未绑定</span>'
                }
            </td>
            <td>
                ${aisle.boundRows.length > 0 
                    ? `<div class="tags">
                        ${aisle.boundRows.map(row => 
                            `<span class="tag">${row}排</span>`
                        ).join('')}
                       </div>`
                    : '<span style="color: #999;">未绑定</span>'
                }
            </td>
            <td>
                <span class="status-badge ${aisle.status === '启用' ? 'enabled' : 'disabled'}">
                    ${aisle.status}
                </span>
            </td>
            <td>${aisle.remark || '-'}</td>
            <td>${aisle.createTime}</td>
            <td>
                <div class="action-btns">
                    <button class="bind-station-btn" onclick="openBindStationModal(${aisle.id})">绑定库台</button>
                    <button class="bind-row-btn" onclick="openBindRowModal(${aisle.id})">绑定库排</button>
                    <button class="edit-btn" onclick="editAisle(${aisle.id})">编辑</button>
                    <button class="delete-btn" onclick="deleteAisle(${aisle.id})">删除</button>
                    ${aisle.status === '启用' 
                        ? `<button class="disable-btn" onclick="toggleStatus(${aisle.id})">禁用</button>`
                        : `<button class="enable-btn" onclick="toggleStatus(${aisle.id})">启用</button>`
                    }
                </div>
            </td>
        </tr>
    `).join('');

    updatePagination();
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
    // 查询按钮
    document.getElementById('searchBtn').addEventListener('click', searchAisles);
    
    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', resetSearch);
    
    // 新增按钮
    document.getElementById('addBtn').addEventListener('click', openAddModal);
    
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
        btn.addEventListener('click', closeAllModals);
    });
    
    // 保存按钮
    document.getElementById('saveBtn').addEventListener('click', saveAisle);
    document.getElementById('cancelBtn').addEventListener('click', closeAllModals);
    
    // 绑定库台
    document.getElementById('bindStationClose').addEventListener('click', closeBindStationModal);
    document.getElementById('bindStationSaveBtn').addEventListener('click', saveBindStations);
    document.getElementById('bindStationCancelBtn').addEventListener('click', closeBindStationModal);
    
    // 绑定库排
    document.getElementById('bindRowClose').addEventListener('click', closeBindRowModal);
    document.getElementById('bindRowSaveBtn').addEventListener('click', saveBindRows);
    document.getElementById('bindRowCancelBtn').addEventListener('click', closeBindRowModal);
    
    // 点击弹窗外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
}

// 查询巷道
function searchAisles() {
    const code = document.getElementById('searchCode').value.trim().toLowerCase();
    const name = document.getElementById('searchName').value.trim().toLowerCase();
    
    filteredData = aislesData.filter(aisle => {
        const matchCode = !code || aisle.code.toLowerCase().includes(code);
        const matchName = !name || aisle.name.toLowerCase().includes(name);
        return matchCode && matchName;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchCode').value = '';
    document.getElementById('searchName').value = '';
    filteredData = [...aislesData];
    currentPage = 1;
    renderTable();
}

// 打开新增弹窗
function openAddModal() {
    editingAisleId = null;
    document.getElementById('modalTitle').textContent = '新增巷道';
    document.getElementById('aisleForm').reset();
    document.getElementById('aisleModal').classList.add('active');
}

// 编辑巷道
function editAisle(id) {
    const aisle = aislesData.find(a => a.id === id);
    if (!aisle) return;
    
    editingAisleId = id;
    document.getElementById('modalTitle').textContent = '编辑巷道';
    document.getElementById('aisleCode').value = aisle.code;
    document.getElementById('aisleName').value = aisle.name;
    document.getElementById('aisleStructure').value = aisle.structure;
    document.getElementById('aisleRemark').value = aisle.remark || '';
    document.getElementById('aisleModal').classList.add('active');
}

// 保存巷道
function saveAisle() {
    const code = document.getElementById('aisleCode').value.trim();
    const name = document.getElementById('aisleName').value.trim();
    const structure = document.getElementById('aisleStructure').value;
    const remark = document.getElementById('aisleRemark').value.trim();
    
    if (!code || !name || !structure) {
        alert('请填写所有必填项！');
        return;
    }
    
    // 检查编码唯一性
    const existingAisle = aislesData.find(a => 
        a.code === code && a.id !== editingAisleId
    );
    
    if (existingAisle) {
        alert('巷道编码已存在，请使用其他编码！');
        return;
    }
    
    if (editingAisleId) {
        // 编辑
        const aisle = aislesData.find(a => a.id === editingAisleId);
        if (aisle) {
            aisle.code = code;
            aisle.name = name;
            aisle.structure = structure;
            aisle.remark = remark;
        }
        alert('巷道信息已更新！');
    } else {
        // 新增
        const now = new Date();
        const createTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        const newAisle = {
            id: aislesData.length + 1,
            code,
            name,
            structure,
            boundStations: [],
            boundRows: [],
            status: '启用',
            remark,
            createTime
        };
        aislesData.push(newAisle);
        alert('巷道添加成功！');
    }
    
    closeAllModals();
    searchAisles();
}

// 删除巷道
function deleteAisle(id) {
    const aisle = aislesData.find(a => a.id === id);
    if (!aisle) return;
    
    if (confirm(`确定要删除巷道"${aisle.name}"吗？`)) {
        aislesData = aislesData.filter(a => a.id !== id);
        alert('巷道已删除！');
        searchAisles();
    }
}

// 切换状态
function toggleStatus(id) {
    const aisle = aislesData.find(a => a.id === id);
    if (!aisle) return;
    
    const newStatus = aisle.status === '启用' ? '禁用' : '启用';
    const action = newStatus === '禁用' ? '禁用' : '启用';
    
    if (confirm(`确定要${action}巷道"${aisle.name}"吗？`)) {
        aisle.status = newStatus;
        alert(`巷道已${action}！`);
        renderTable();
    }
}

// 打开绑定库台弹窗
function openBindStationModal(id) {
    bindingAisleId = id;
    bindingType = 'station';
    const aisle = aislesData.find(a => a.id === id);
    if (!aisle) return;
    
    document.getElementById('bindAisleName').textContent = aisle.name;
    
    // 重置所有复选框
    document.querySelectorAll('.station-checkbox').forEach(checkbox => {
        checkbox.checked = aisle.boundStations.includes(checkbox.value);
    });
    
    document.getElementById('bindStationModal').classList.add('active');
}

// 保存绑定的库台
function saveBindStations() {
    const aisle = aislesData.find(a => a.id === bindingAisleId);
    if (!aisle) return;
    
    const selectedStations = Array.from(
        document.querySelectorAll('.station-checkbox:checked')
    ).map(cb => cb.value);
    
    aisle.boundStations = selectedStations;
    
    alert(`已为巷道"${aisle.name}"绑定 ${selectedStations.length} 个库台！`);
    closeBindStationModal();
    renderTable();
}

// 关闭绑定库台弹窗
function closeBindStationModal() {
    document.getElementById('bindStationModal').classList.remove('active');
    bindingAisleId = null;
    bindingType = null;
}

// 打开绑定库排弹窗
function openBindRowModal(id) {
    bindingAisleId = id;
    bindingType = 'row';
    const aisle = aislesData.find(a => a.id === id);
    if (!aisle) return;
    
    document.getElementById('bindRowAisleName').textContent = aisle.name;
    
    // 重置所有复选框
    document.querySelectorAll('.row-checkbox').forEach(checkbox => {
        checkbox.checked = aisle.boundRows.includes(parseInt(checkbox.value));
    });
    
    document.getElementById('bindRowModal').classList.add('active');
}

// 保存绑定的库排
function saveBindRows() {
    const aisle = aislesData.find(a => a.id === bindingAisleId);
    if (!aisle) return;
    
    const selectedRows = Array.from(
        document.querySelectorAll('.row-checkbox:checked')
    ).map(cb => parseInt(cb.value));
    
    aisle.boundRows = selectedRows;
    
    alert(`已为巷道"${aisle.name}"绑定 ${selectedRows.length} 个库排！`);
    closeBindRowModal();
    renderTable();
}

// 关闭绑定库排弹窗
function closeBindRowModal() {
    document.getElementById('bindRowModal').classList.remove('active');
    bindingAisleId = null;
    bindingType = null;
}

// 关闭所有弹窗
function closeAllModals() {
    document.getElementById('aisleModal').classList.remove('active');
    document.getElementById('bindStationModal').classList.remove('active');
    document.getElementById('bindRowModal').classList.remove('active');
    editingAisleId = null;
    bindingAisleId = null;
    bindingType = null;
}
