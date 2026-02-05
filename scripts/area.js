// 库区管理页面脚本

// 模拟数据
let areasData = [
    {
        id: 1,
        code: 'KQ-001',
        name: '小金属框存放区A',
        containerTypes: ['小金属框'],
        totalLocations: 256,
        usedLocations: 180,
        freeLocations: 76,
        status: '启用',
        materialCount: 45,
        remark: '主要存放小型电子元件',
        boundMaterials: [1, 2, 3],
        hasTransactions: true
    },
    {
        id: 2,
        code: 'KQ-002',
        name: '小金属框存放区B',
        containerTypes: ['小金属框'],
        totalLocations: 256,
        usedLocations: 120,
        freeLocations: 136,
        status: '启用',
        materialCount: 32,
        remark: '备用存放区',
        boundMaterials: [2, 5],
        hasTransactions: true
    },
    {
        id: 3,
        code: 'KQ-003',
        name: '大金属塑料长物料存放区A',
        containerTypes: ['大金属框', '塑料托盘', '长物料钢托盘'],
        totalLocations: 192,
        usedLocations: 150,
        freeLocations: 42,
        status: '启用',
        materialCount: 28,
        remark: '存放大型物料和长物料',
        boundMaterials: [4],
        hasTransactions: true
    },
    {
        id: 4,
        code: 'KQ-004',
        name: '小金属框存放区C',
        containerTypes: ['小金属框'],
        totalLocations: 128,
        usedLocations: 0,
        freeLocations: 128,
        status: '禁用',
        materialCount: 0,
        remark: '维护中',
        boundMaterials: [],
        hasTransactions: false
    },
    {
        id: 5,
        code: 'KQ-005',
        name: '大金属塑料长物料存放区B',
        containerTypes: ['大金属框', '塑料托盘', '长物料钢托盘'],
        totalLocations: 192,
        usedLocations: 88,
        freeLocations: 104,
        status: '启用',
        materialCount: 18,
        remark: '新建库区',
        boundMaterials: [3, 4, 5],
        hasTransactions: true
    }
];

// 物料数据（用于绑定）
const materialsData = [
    { id: 1, code: 'WL-2024-001', name: '电子元件A型' },
    { id: 2, code: 'WL-2024-002', name: '机械零件B型' },
    { id: 3, code: 'WL-2024-003', name: '塑料配件C型' },
    { id: 4, code: 'WL-2024-004', name: '长物料钢材D型' },
    { id: 5, code: 'WL-2024-005', name: '金属材料E型' }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...areasData];
let editingAreaId = null;
let bindingAreaId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('areaTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(area => `
        <tr>
            <td>${area.code}</td>
            <td>${area.name}</td>
            <td>${area.containerTypes.join('、')}</td>
            <td>${area.totalLocations}</td>
            <td>${area.usedLocations}</td>
            <td>${area.freeLocations}</td>
            <td>
                <span class="status-badge ${area.status === '启用' ? 'enabled' : 'disabled'}">
                    ${area.status}
                </span>
            </td>
            <td>${area.materialCount}</td>
            <td>${area.remark || '-'}</td>
            <td>
                <div class="action-btns">
                    <button class="bind-btn" onclick="openBindModal(${area.id})">绑定物料</button>
                    <button class="edit-btn" onclick="editArea(${area.id})">编辑</button>
                    <button class="delete-btn" onclick="deleteArea(${area.id})">删除</button>
                    ${area.status === '启用' 
                        ? `<button class="disable-btn" onclick="toggleStatus(${area.id})">禁用</button>`
                        : `<button class="enable-btn" onclick="toggleStatus(${area.id})">启用</button>`
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
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

// 初始化事件监听
function initEventListeners() {
    // 查询按钮
    document.getElementById('searchBtn').addEventListener('click', searchAreas);
    
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
        btn.addEventListener('click', closeModals);
    });
    
    // 保存按钮
    document.getElementById('saveBtn').addEventListener('click', saveArea);
    
    // 取消按钮
    document.getElementById('cancelBtn').addEventListener('click', closeModals);
    
    // 绑定物料相关
    document.getElementById('bindClose').addEventListener('click', closeBindModal);
    document.getElementById('bindSaveBtn').addEventListener('click', saveBoundMaterials);
    document.getElementById('bindCancelBtn').addEventListener('click', closeBindModal);
    document.getElementById('materialSearchBtn').addEventListener('click', searchMaterials);
    
    // 点击弹窗外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModals();
            }
        });
    });
}

// 查询库区
function searchAreas() {
    const code = document.getElementById('searchCode').value.trim().toLowerCase();
    const name = document.getElementById('searchName').value.trim().toLowerCase();
    const status = document.getElementById('areaStatus').value;
    
    filteredData = areasData.filter(area => {
        const matchCode = !code || area.code.toLowerCase().includes(code);
        const matchName = !name || area.name.toLowerCase().includes(name);
        const matchStatus = !status || area.status === status;
        return matchCode && matchName && matchStatus;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchCode').value = '';
    document.getElementById('searchName').value = '';
    document.getElementById('areaStatus').value = '';
    filteredData = [...areasData];
    currentPage = 1;
    renderTable();
}

// 打开新增弹窗
function openAddModal() {
    editingAreaId = null;
    document.getElementById('modalTitle').textContent = '新增库区';
    document.getElementById('areaForm').reset();
    document.getElementById('areaModal').classList.add('active');
}

// 编辑库区
function editArea(id) {
    const area = areasData.find(a => a.id === id);
    if (!area) return;
    
    editingAreaId = id;
    document.getElementById('modalTitle').textContent = '编辑库区';
    document.getElementById('areaCode').value = area.code;
    document.getElementById('areaName').value = area.name;
    
    // 设置容器类型多选框
    document.querySelectorAll('input[name="containerType"]').forEach(checkbox => {
        checkbox.checked = area.containerTypes.includes(checkbox.value);
    });
    
    document.getElementById('areaRemark').value = area.remark || '';
    document.getElementById('areaModal').classList.add('active');
}

// 保存库区
function saveArea() {
    const code = document.getElementById('areaCode').value.trim();
    const name = document.getElementById('areaName').value.trim();
    const remark = document.getElementById('areaRemark').value.trim();
    
    // 获取选中的容器类型
    const containerTypes = Array.from(document.querySelectorAll('input[name="containerType"]:checked'))
        .map(cb => cb.value);
    
    if (!code || !name || containerTypes.length === 0) {
        alert('请填写所有必填项！至少选择一种容器类型。');
        return;
    }
    
    if (editingAreaId) {
        // 编辑
        const area = areasData.find(a => a.id === editingAreaId);
        if (area) {
            area.code = code;
            area.name = name;
            area.containerTypes = containerTypes;
            area.remark = remark;
        }
        alert('库区信息已更新！');
    } else {
        // 新增
        const newArea = {
            id: areasData.length + 1,
            code,
            name,
            containerTypes,
            totalLocations: 256, // 默认值
            usedLocations: 0,
            freeLocations: 256,
            status: '启用',
            materialCount: 0,
            remark,
            boundMaterials: [],
            hasTransactions: false
        };
        areasData.push(newArea);
        alert('库区添加成功！');
    }
    
    closeModals();
    searchAreas();
}

// 删除库区
function deleteArea(id) {
    const area = areasData.find(a => a.id === id);
    if (!area) return;
    
    if (area.hasTransactions) {
        alert('该库区已发生业务，不可删除！');
        return;
    }
    
    if (confirm(`确定要删除库区"${area.name}"吗？`)) {
        areasData = areasData.filter(a => a.id !== id);
        alert('库区已删除！');
        searchAreas();
    }
}

// 切换状态
function toggleStatus(id) {
    const area = areasData.find(a => a.id === id);
    if (!area) return;
    
    const newStatus = area.status === '启用' ? '禁用' : '启用';
    const action = newStatus === '禁用' ? '禁用' : '启用';
    
    if (confirm(`确定要${action}库区"${area.name}"吗？`)) {
        area.status = newStatus;
        alert(`库区已${action}！`);
        renderTable();
    }
}

// 打开绑定物料弹窗
function openBindModal(id) {
    bindingAreaId = id;
    const area = areasData.find(a => a.id === id);
    if (!area) return;
    
    document.getElementById('bindAreaName').textContent = area.name;
    
    // 渲染物料列表
    renderMaterialList(area.boundMaterials);
    
    document.getElementById('bindMaterialModal').classList.add('active');
}

// 渲染物料列表
function renderMaterialList(boundMaterials = []) {
    const materialList = document.querySelector('.material-list');
    materialList.innerHTML = materialsData.map(material => `
        <div class="material-item">
            <label class="checkbox-label">
                <input type="checkbox" 
                    value="${material.id}" 
                    data-code="${material.code}" 
                    data-name="${material.name}"
                    ${boundMaterials.includes(material.id) ? 'checked' : ''}>
                <span>${material.code} - ${material.name}</span>
            </label>
        </div>
    `).join('');
}

// 搜索物料
function searchMaterials() {
    const searchText = document.getElementById('materialSearch').value.trim().toLowerCase();
    const area = areasData.find(a => a.id === bindingAreaId);
    
    const filtered = materialsData.filter(m => 
        m.code.toLowerCase().includes(searchText) || 
        m.name.toLowerCase().includes(searchText)
    );
    
    const materialList = document.querySelector('.material-list');
    materialList.innerHTML = filtered.map(material => `
        <div class="material-item">
            <label class="checkbox-label">
                <input type="checkbox" 
                    value="${material.id}" 
                    data-code="${material.code}" 
                    data-name="${material.name}"
                    ${area && area.boundMaterials.includes(material.id) ? 'checked' : ''}>
                <span>${material.code} - ${material.name}</span>
            </label>
        </div>
    `).join('');
}

// 保存绑定的物料
function saveBoundMaterials() {
    const area = areasData.find(a => a.id === bindingAreaId);
    if (!area) return;
    
    const checkboxes = document.querySelectorAll('.material-list input[type="checkbox"]:checked');
    area.boundMaterials = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    alert(`已为库区"${area.name}"绑定 ${area.boundMaterials.length} 种物料！`);
    closeBindModal();
}

// 关闭绑定物料弹窗
function closeBindModal() {
    document.getElementById('bindMaterialModal').classList.remove('active');
    document.getElementById('materialSearch').value = '';
    bindingAreaId = null;
}

// 关闭所有弹窗
function closeModals() {
    document.getElementById('areaModal').classList.remove('active');
    document.getElementById('bindMaterialModal').classList.remove('active');
    editingAreaId = null;
    bindingAreaId = null;
}
