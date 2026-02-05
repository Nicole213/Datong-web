// 库口管理页面脚本

// 模拟数据
let portsData = [
    {
        id: 1,
        code: 'KK-001',
        name: '1号入库口',
        type: '入库口',
        boundStations: ['库台A1', '库台A2'],
        isBound: true
    },
    {
        id: 2,
        code: 'KK-002',
        name: '2号入库口',
        type: '入库口',
        boundStations: ['库台B1'],
        isBound: true
    },
    {
        id: 3,
        code: 'KK-003',
        name: '1号出库口',
        type: '出库口',
        boundStations: ['库台C1', '库台C2', '库台C3'],
        isBound: true
    },
    {
        id: 4,
        code: 'KK-004',
        name: '2号出库口',
        type: '出库口',
        boundStations: [],
        isBound: false
    },
    {
        id: 5,
        code: 'KK-005',
        name: '1号出入库口',
        type: '出入库口',
        boundStations: ['库台D1'],
        isBound: true
    },
    {
        id: 6,
        code: 'KK-006',
        name: '2号出入库口',
        type: '出入库口',
        boundStations: [],
        isBound: false
    }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...portsData];
let editingPortId = null;
let bindingPortId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('portTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(port => `
        <tr>
            <td>${port.code}</td>
            <td>${port.name}</td>
            <td>
                <span class="type-badge ${getTypeClass(port.type)}">
                    ${port.type}
                </span>
            </td>
            <td>
                ${port.boundStations.length > 0 
                    ? `<div class="station-tags">
                        ${port.boundStations.map(station => 
                            `<span class="station-tag">${station}</span>`
                        ).join('')}
                       </div>`
                    : '<span style="color: #999;">未绑定</span>'
                }
            </td>
            <td>
                <div class="action-btns">
                    <button class="bind-btn" onclick="openBindStationModal(${port.id})">绑定库台</button>
                    <button class="edit-btn" onclick="editPort(${port.id})">编辑</button>
                    <button class="delete-btn" onclick="deletePort(${port.id})">删除</button>
                </div>
            </td>
        </tr>
    `).join('');

    updatePagination();
}

// 获取类型样式类
function getTypeClass(type) {
    const typeMap = {
        '入库口': 'inbound',
        '出库口': 'outbound',
        '出入库口': 'both'
    };
    return typeMap[type] || 'inbound';
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
    document.getElementById('searchBtn').addEventListener('click', searchPorts);
    
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
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // 保存按钮
    document.getElementById('saveBtn').addEventListener('click', savePort);
    
    // 取消按钮
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    
    // 绑定库台相关
    document.getElementById('bindClose').addEventListener('click', closeBindModal);
    document.getElementById('bindSaveBtn').addEventListener('click', saveBindStations);
    document.getElementById('bindCancelBtn').addEventListener('click', closeBindModal);
    
    // 点击弹窗外部关闭
    document.getElementById('portModal').addEventListener('click', (e) => {
        if (e.target.id === 'portModal') {
            closeModal();
        }
    });
    
    document.getElementById('bindStationModal').addEventListener('click', (e) => {
        if (e.target.id === 'bindStationModal') {
            closeBindModal();
        }
    });
}

// 查询库口
function searchPorts() {
    const code = document.getElementById('searchCode').value.trim().toLowerCase();
    const name = document.getElementById('searchName').value.trim().toLowerCase();
    const type = document.getElementById('searchType').value;
    
    filteredData = portsData.filter(port => {
        const matchCode = !code || port.code.toLowerCase().includes(code);
        const matchName = !name || port.name.toLowerCase().includes(name);
        const matchType = !type || port.type === type;
        return matchCode && matchName && matchType;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchCode').value = '';
    document.getElementById('searchName').value = '';
    document.getElementById('searchType').value = '';
    filteredData = [...portsData];
    currentPage = 1;
    renderTable();
}

// 打开新增弹窗
function openAddModal() {
    editingPortId = null;
    document.getElementById('modalTitle').textContent = '新增库口';
    document.getElementById('portForm').reset();
    document.getElementById('portModal').classList.add('active');
}

// 编辑库口
function editPort(id) {
    const port = portsData.find(p => p.id === id);
    if (!port) return;
    
    editingPortId = id;
    document.getElementById('modalTitle').textContent = '编辑库口';
    document.getElementById('portCode').value = port.code;
    document.getElementById('portName').value = port.name;
    document.getElementById('portType').value = port.type;
    document.getElementById('portModal').classList.add('active');
}

// 保存库口
function savePort() {
    const code = document.getElementById('portCode').value.trim();
    const name = document.getElementById('portName').value.trim();
    const type = document.getElementById('portType').value;
    
    if (!code || !name || !type) {
        alert('请填写所有必填项！');
        return;
    }
    
    // 检查编码唯一性
    const existingPort = portsData.find(p => 
        p.code === code && p.id !== editingPortId
    );
    
    if (existingPort) {
        alert('库口编码已存在，请使用其他编码！');
        return;
    }
    
    if (editingPortId) {
        // 编辑
        const port = portsData.find(p => p.id === editingPortId);
        if (port) {
            port.code = code;
            port.name = name;
            port.type = type;
        }
        alert('库口信息已更新！');
    } else {
        // 新增
        const newPort = {
            id: portsData.length + 1,
            code,
            name,
            type,
            boundStations: [],
            isBound: false
        };
        portsData.push(newPort);
        alert('库口添加成功！');
    }
    
    closeModal();
    searchPorts();
}

// 删除库口
function deletePort(id) {
    const port = portsData.find(p => p.id === id);
    if (!port) return;
    
    if (port.isBound && port.boundStations.length > 0) {
        alert('已被库台绑定的库口需先解绑再删除！\n\n当前绑定库台：' + port.boundStations.join('、'));
        return;
    }
    
    if (confirm(`确定要删除库口"${port.name}"吗？\n\n删除后不可恢复！`)) {
        portsData = portsData.filter(p => p.id !== id);
        alert('库口已删除！');
        searchPorts();
    }
}

// 打开绑定库台弹窗
function openBindStationModal(id) {
    bindingPortId = id;
    const port = portsData.find(p => p.id === id);
    if (!port) return;
    
    document.getElementById('bindPortName').textContent = port.name;
    
    // 重置所有复选框
    document.querySelectorAll('.station-checkbox').forEach(checkbox => {
        checkbox.checked = port.boundStations.includes(checkbox.value);
    });
    
    document.getElementById('bindStationModal').classList.add('active');
}

// 保存绑定的库台
function saveBindStations() {
    const port = portsData.find(p => p.id === bindingPortId);
    if (!port) return;
    
    const selectedStations = Array.from(
        document.querySelectorAll('.station-checkbox:checked')
    ).map(cb => cb.value);
    
    port.boundStations = selectedStations;
    port.isBound = selectedStations.length > 0;
    
    alert(`已为库口"${port.name}"绑定 ${selectedStations.length} 个库台！`);
    closeBindModal();
    renderTable();
}

// 关闭绑定库台弹窗
function closeBindModal() {
    document.getElementById('bindStationModal').classList.remove('active');
    bindingPortId = null;
}

// 关闭弹窗
function closeModal() {
    document.getElementById('portModal').classList.remove('active');
    editingPortId = null;
}
