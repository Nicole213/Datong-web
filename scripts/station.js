// 库台管理页面脚本

// 模拟数据
let stationsData = [
    {
        id: 1,
        code: '库台A1',
        name: 'A区1号取货台',
        type: '取货台',
        row: 1,
        col: 1,
        level: 1,
        aisle: '1号巷道',
        remark: '主要用于小件物料取货',
        isBoundToPort: true
    },
    {
        id: 2,
        code: '库台A2',
        name: 'A区2号取货台',
        type: '取货台',
        row: 1,
        col: 5,
        level: 1,
        aisle: '1号巷道',
        remark: '',
        isBoundToPort: true
    },
    {
        id: 3,
        code: '库台B1',
        name: 'B区1号放货台',
        type: '放货台',
        row: 2,
        col: 1,
        level: 1,
        aisle: '1号巷道',
        remark: '用于入库作业',
        isBoundToPort: true
    },
    {
        id: 4,
        code: '库台B2',
        name: 'B区2号放货台',
        type: '放货台',
        row: 2,
        col: 10,
        level: 1,
        aisle: '1号巷道',
        remark: '',
        isBoundToPort: false
    },
    {
        id: 5,
        code: '库台C1',
        name: 'C区1号取货台',
        type: '取货台',
        row: 3,
        col: 1,
        level: 1,
        aisle: '2号巷道',
        remark: '大件物料取货',
        isBoundToPort: true
    },
    {
        id: 6,
        code: '库台C2',
        name: 'C区2号取货台',
        type: '取货台',
        row: 3,
        col: 8,
        level: 1,
        aisle: '2号巷道',
        remark: '',
        isBoundToPort: true
    },
    {
        id: 7,
        code: '库台C3',
        name: 'C区3号取货台',
        type: '取货台',
        row: 3,
        col: 15,
        level: 1,
        aisle: '2号巷道',
        remark: '',
        isBoundToPort: true
    },
    {
        id: 8,
        code: '库台D1',
        name: 'D区1号取放货台',
        type: '取放货台',
        row: 4,
        col: 1,
        level: 1,
        aisle: '2号巷道',
        remark: '多功能库台',
        isBoundToPort: true
    },
    {
        id: 9,
        code: '库台D2',
        name: 'D区2号取放货台',
        type: '取放货台',
        row: 4,
        col: 12,
        level: 1,
        aisle: '2号巷道',
        remark: '',
        isBoundToPort: false
    },
    {
        id: 10,
        code: '库台E1',
        name: 'E区1号取放货台',
        type: '取放货台',
        row: 1,
        col: 20,
        level: 1,
        aisle: '1号巷道',
        remark: '备用库台',
        isBoundToPort: false
    }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...stationsData];
let editingStationId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('stationTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(station => `
        <tr>
            <td>${station.code}</td>
            <td>${station.name}</td>
            <td>
                <span class="type-badge ${getTypeClass(station.type)}">
                    ${station.type}
                </span>
            </td>
            <td>${station.row}-${station.col}-${station.level}</td>
            <td>${station.aisle}</td>
            <td>${station.remark || '-'}</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editStation(${station.id})">编辑</button>
                    <button class="delete-btn" onclick="deleteStation(${station.id})">删除</button>
                </div>
            </td>
        </tr>
    `).join('');

    updatePagination();
}

// 获取类型样式类
function getTypeClass(type) {
    const typeMap = {
        '取货台': 'pickup',
        '放货台': 'putdown',
        '取放货台': 'both'
    };
    return typeMap[type] || 'pickup';
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
    document.getElementById('searchBtn').addEventListener('click', searchStations);
    
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
    document.getElementById('saveBtn').addEventListener('click', saveStation);
    
    // 取消按钮
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    
    // 点击弹窗外部关闭
    document.getElementById('stationModal').addEventListener('click', (e) => {
        if (e.target.id === 'stationModal') {
            closeModal();
        }
    });
}

// 查询库台
function searchStations() {
    const code = document.getElementById('searchCode').value.trim().toLowerCase();
    const name = document.getElementById('searchName').value.trim().toLowerCase();
    const type = document.getElementById('searchType').value;
    
    filteredData = stationsData.filter(station => {
        const matchCode = !code || station.code.toLowerCase().includes(code);
        const matchName = !name || station.name.toLowerCase().includes(name);
        const matchType = !type || station.type === type;
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
    filteredData = [...stationsData];
    currentPage = 1;
    renderTable();
}

// 打开新增弹窗
function openAddModal() {
    editingStationId = null;
    document.getElementById('modalTitle').textContent = '新增库台';
    document.getElementById('stationForm').reset();
    document.getElementById('stationModal').classList.add('active');
}

// 编辑库台
function editStation(id) {
    const station = stationsData.find(s => s.id === id);
    if (!station) return;
    
    editingStationId = id;
    document.getElementById('modalTitle').textContent = '编辑库台';
    document.getElementById('stationCode').value = station.code;
    document.getElementById('stationName').value = station.name;
    document.getElementById('stationType').value = station.type;
    document.getElementById('stationRow').value = station.row;
    document.getElementById('stationCol').value = station.col;
    document.getElementById('stationLevel').value = station.level;
    document.getElementById('stationRemark').value = station.remark || '';
    document.getElementById('stationModal').classList.add('active');
}

// 保存库台
function saveStation() {
    const code = document.getElementById('stationCode').value.trim();
    const name = document.getElementById('stationName').value.trim();
    const type = document.getElementById('stationType').value;
    const row = parseInt(document.getElementById('stationRow').value);
    const col = parseInt(document.getElementById('stationCol').value);
    const level = parseInt(document.getElementById('stationLevel').value);
    const remark = document.getElementById('stationRemark').value.trim();
    
    if (!code || !name || !type || !row || !col || !level) {
        alert('请填写所有必填项！');
        return;
    }
    
    // 检查编码唯一性
    const existingStation = stationsData.find(s => 
        s.code === code && s.id !== editingStationId
    );
    
    if (existingStation) {
        alert('库台编码已存在，请使用其他编码！');
        return;
    }
    
    // 根据排号确定巷道
    const aisle = row <= 2 ? '1号巷道' : '2号巷道';
    
    if (editingStationId) {
        // 编辑
        const station = stationsData.find(s => s.id === editingStationId);
        if (station) {
            station.code = code;
            station.name = name;
            station.type = type;
            station.row = row;
            station.col = col;
            station.level = level;
            station.aisle = aisle;
            station.remark = remark;
        }
        alert('库台信息已更新！');
    } else {
        // 新增
        const newStation = {
            id: stationsData.length + 1,
            code,
            name,
            type,
            row,
            col,
            level,
            aisle,
            remark,
            isBoundToPort: false
        };
        stationsData.push(newStation);
        alert('库台添加成功！');
    }
    
    closeModal();
    searchStations();
}

// 删除库台
function deleteStation(id) {
    const station = stationsData.find(s => s.id === id);
    if (!station) return;
    
    if (station.isBoundToPort) {
        alert('该库台已被库口绑定，无法删除！\n\n请先在库口管理中解除绑定。');
        return;
    }
    
    if (confirm(`确定要删除库台"${station.name}"吗？`)) {
        stationsData = stationsData.filter(s => s.id !== id);
        alert('库台已删除！');
        searchStations();
    }
}

// 关闭弹窗
function closeModal() {
    document.getElementById('stationModal').classList.remove('active');
    editingStationId = null;
}
