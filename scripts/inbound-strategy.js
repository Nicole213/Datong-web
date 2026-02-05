// 入库策略页面脚本

// 模拟物料数据（从系统物料管理中获取）
const materialList = [
    { code: 'MAT-001', name: '电子元件A型', spec: '规格：10×5×3cm', category: '电子元件' },
    { code: 'MAT-002', name: '机械零件B型', spec: '规格：20×10×5cm', category: '机械零件' },
    { code: 'MAT-003', name: '塑料配件C型', spec: '规格：15×8×4cm', category: '塑料配件' },
    { code: 'MAT-004', name: '长物料钢材D型', spec: '规格：200×10×5cm', category: '钢材' },
    { code: 'MAT-005', name: '金属材料E型', spec: '规格：30×20×10cm', category: '金属材料' },
    { code: 'MAT-006', name: '电子元件F型', spec: '规格：8×4×2cm', category: '电子元件' },
    { code: 'MAT-007', name: '机械零件G型', spec: '规格：25×15×8cm', category: '机械零件' },
    { code: 'MAT-008', name: '塑料配件H型', spec: '规格：12×6×3cm', category: '塑料配件' }
];

let selectedMaterial = null;

// 模拟策略数据
let strategyData = [
    {
        id: 1,
        name: '全局默认入库策略',
        dimension: '全局',
        area: '-',
        materialCode: '-',
        materialName: '-',
        remark: '系统默认的全局入库策略',
        createTime: '2024-01-10 10:00:00',
        updateTime: '2024-01-15 14:30:00',
        updater: '张三',
        rules: [
            { priority: 1, rule: '高度匹配', ignoreOnFail: '否' },
            { priority: 2, rule: '库台就近', ignoreOnFail: '否' },
            { priority: 3, rule: '排升序', ignoreOnFail: '是' }
        ]
    },
    {
        id: 2,
        name: 'A区入库策略',
        dimension: '库区',
        area: 'A区',
        materialCode: '-',
        materialName: '-',
        remark: 'A区专用入库策略，优先使用低层库位',
        createTime: '2024-01-12 09:00:00',
        updateTime: '2024-01-18 16:20:00',
        updater: '李四',
        rules: [
            { priority: 1, rule: '层升序', ignoreOnFail: '否' },
            { priority: 2, rule: '列升序', ignoreOnFail: '是' }
        ]
    },
    {
        id: 3,
        name: '电子元件入库策略',
        dimension: '物料',
        area: '-',
        materialCode: 'MAT-001',
        materialName: '电子元件A型',
        remark: '电子元件专用策略，优先高层存放',
        createTime: '2024-01-14 11:30:00',
        updateTime: '2024-01-20 10:15:00',
        updater: '王五',
        rules: [
            { priority: 1, rule: '层降序', ignoreOnFail: '否' },
            { priority: 2, rule: '双深通用规则', ignoreOnFail: '是' }
        ]
    }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...strategyData];
let editingStrategyId = null;
let currentRules = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('strategyTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(strategy => {
        const dimensionClass = getDimensionClass(strategy.dimension);
        
        return `
        <tr>
            <td>${strategy.name}</td>
            <td><span class="dimension-badge ${dimensionClass}">${strategy.dimension}</span></td>
            <td>${strategy.area}</td>
            <td>${strategy.materialCode}</td>
            <td>${strategy.materialName}</td>
            <td>${strategy.remark || '-'}</td>
            <td>${strategy.createTime}</td>
            <td>${strategy.updateTime}</td>
            <td>${strategy.updater}</td>
            <td>
                <div class="action-btns">
                    <button class="detail-btn" onclick="viewDetail(${strategy.id})">详情</button>
                    <button class="edit-btn" onclick="editStrategy(${strategy.id})">编辑</button>
                    <button class="delete-btn" onclick="deleteStrategy(${strategy.id})">删除</button>
                </div>
            </td>
        </tr>
    `}).join('');

    updatePagination();
}

// 获取维度样式类
function getDimensionClass(dimension) {
    const dimensionMap = {
        '全局': 'global',
        '库区': 'area',
        '物料': 'material'
    };
    return dimensionMap[dimension] || 'global';
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
    document.getElementById('searchBtn').addEventListener('click', searchStrategies);
    
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
    
    // 弹窗关闭
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('saveBtn').addEventListener('click', saveStrategy);
    
    // 详情弹窗关闭
    document.getElementById('detailClose').addEventListener('click', closeDetailModal);
    document.getElementById('detailCloseBtn').addEventListener('click', closeDetailModal);
    
    // 管理维度变化
    document.getElementById('managementDimension').addEventListener('change', onDimensionChange);
    
    // 添加规则按钮
    document.getElementById('addRuleBtn').addEventListener('click', addRule);
    
    // 物料名称输入框事件
    const materialInput = document.getElementById('materialName');
    materialInput.addEventListener('input', onMaterialInput);
    materialInput.addEventListener('focus', onMaterialFocus);
    
    // 点击文档其他地方关闭下拉框
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('materialDropdown');
        const input = document.getElementById('materialName');
        if (e.target !== input && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // 点击弹窗外部关闭
    document.getElementById('strategyModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    document.getElementById('detailModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDetailModal();
        }
    });
}

// 查询策略
function searchStrategies() {
    const area = document.getElementById('searchArea').value;
    const material = document.getElementById('searchMaterial').value.trim().toLowerCase();
    
    filteredData = strategyData.filter(strategy => {
        const matchArea = !area || strategy.area === area;
        const matchMaterial = !material || 
            strategy.materialCode.toLowerCase().includes(material) ||
            strategy.materialName.toLowerCase().includes(material);
        
        return matchArea && matchMaterial;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchArea').value = '';
    document.getElementById('searchMaterial').value = '';
    
    filteredData = [...strategyData];
    currentPage = 1;
    renderTable();
}

// 打开新增弹窗
function openAddModal() {
    editingStrategyId = null;
    document.getElementById('modalTitle').textContent = '新增入库策略';
    
    // 清空表单
    document.getElementById('strategyName').value = '';
    document.getElementById('managementDimension').value = '';
    document.getElementById('areaSelect').value = '';
    document.getElementById('areaSelect').disabled = true;
    document.getElementById('materialName').value = '';
    document.getElementById('materialName').disabled = true;
    document.getElementById('materialCode').value = '';
    document.getElementById('remark').value = '';
    selectedMaterial = null;
    
    // 清空规则
    currentRules = [];
    renderRulesTable();
    
    document.getElementById('strategyModal').classList.add('active');
}

// 管理维度变化
function onDimensionChange() {
    const dimension = document.getElementById('managementDimension').value;
    const areaSelect = document.getElementById('areaSelect');
    const materialName = document.getElementById('materialName');
    const areaLabel = document.getElementById('areaLabel');
    const materialLabel = document.getElementById('materialLabel');
    const dropdown = document.getElementById('materialDropdown');
    
    if (dimension === '库区') {
        areaSelect.disabled = false;
        areaLabel.classList.add('required');
        materialName.disabled = true;
        materialLabel.classList.remove('required');
        materialName.value = '';
        document.getElementById('materialCode').value = '';
        selectedMaterial = null;
        dropdown.classList.remove('active');
    } else if (dimension === '物料') {
        areaSelect.disabled = true;
        areaLabel.classList.remove('required');
        areaSelect.value = '';
        materialName.disabled = false;
        materialLabel.classList.add('required');
    } else {
        areaSelect.disabled = true;
        areaLabel.classList.remove('required');
        areaSelect.value = '';
        materialName.disabled = true;
        materialLabel.classList.remove('required');
        materialName.value = '';
        document.getElementById('materialCode').value = '';
        selectedMaterial = null;
        dropdown.classList.remove('active');
    }
}

// 物料输入框输入事件
function onMaterialInput(e) {
    const keyword = e.target.value.trim().toLowerCase();
    const dropdown = document.getElementById('materialDropdown');
    
    if (!keyword) {
        dropdown.classList.remove('active');
        selectedMaterial = null;
        document.getElementById('materialCode').value = '';
        return;
    }
    
    // 模糊搜索物料
    const matches = materialList.filter(material => 
        material.code.toLowerCase().includes(keyword) ||
        material.name.toLowerCase().includes(keyword) ||
        material.category.toLowerCase().includes(keyword)
    );
    
    if (matches.length > 0) {
        dropdown.innerHTML = matches.map(material => `
            <div class="autocomplete-item" onclick="selectMaterial('${material.code}')">
                <div class="autocomplete-item-code">${material.code}</div>
                <div class="autocomplete-item-name">${material.name}</div>
                <div class="autocomplete-item-spec">${material.spec} | ${material.category}</div>
            </div>
        `).join('');
        dropdown.classList.add('active');
    } else {
        dropdown.innerHTML = '<div class="autocomplete-empty">未找到匹配的物料</div>';
        dropdown.classList.add('active');
    }
}

// 物料输入框获得焦点事件
function onMaterialFocus(e) {
    const keyword = e.target.value.trim().toLowerCase();
    if (keyword) {
        onMaterialInput(e);
    }
}

// 选择物料
function selectMaterial(code) {
    const material = materialList.find(m => m.code === code);
    if (material) {
        selectedMaterial = material;
        document.getElementById('materialName').value = material.name;
        document.getElementById('materialCode').value = material.code;
        document.getElementById('materialDropdown').classList.remove('active');
    }
}

// 添加规则
function addRule() {
    const newRule = {
        priority: currentRules.length + 1,
        rule: '高度匹配',
        ignoreOnFail: '否'
    };
    currentRules.push(newRule);
    renderRulesTable();
}

// 渲染规则表格
function renderRulesTable() {
    const tbody = document.getElementById('rulesTableBody');
    
    if (currentRules.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-rules">暂无规则，请点击"添加规则"按钮添加</td></tr>';
        return;
    }
    
    tbody.innerHTML = currentRules.map((rule, index) => `
        <tr>
            <td>${rule.priority}</td>
            <td>
                <select class="rule-select" onchange="updateRule(${index}, 'rule', this.value)">
                    <option value="高度匹配" ${rule.rule === '高度匹配' ? 'selected' : ''}>高度匹配</option>
                    <option value="库台就近" ${rule.rule === '库台就近' ? 'selected' : ''}>库台就近</option>
                    <option value="排升序" ${rule.rule === '排升序' ? 'selected' : ''}>排升序</option>
                    <option value="排降序" ${rule.rule === '排降序' ? 'selected' : ''}>排降序</option>
                    <option value="列升序" ${rule.rule === '列升序' ? 'selected' : ''}>列升序</option>
                    <option value="列降序" ${rule.rule === '列降序' ? 'selected' : ''}>列降序</option>
                    <option value="层升序" ${rule.rule === '层升序' ? 'selected' : ''}>层升序</option>
                    <option value="层降序" ${rule.rule === '层降序' ? 'selected' : ''}>层降序</option>
                    <option value="双深通用规则" ${rule.rule === '双深通用规则' ? 'selected' : ''}>双深通用规则</option>
                </select>
            </td>
            <td>
                <select class="rule-select" onchange="updateRule(${index}, 'ignoreOnFail', this.value)">
                    <option value="是" ${rule.ignoreOnFail === '是' ? 'selected' : ''}>是</option>
                    <option value="否" ${rule.ignoreOnFail === '否' ? 'selected' : ''}>否</option>
                </select>
            </td>
            <td>
                <button class="remove-rule-btn" onclick="removeRule(${index})">删除</button>
            </td>
        </tr>
    `).join('');
}

// 更新规则
function updateRule(index, field, value) {
    currentRules[index][field] = value;
}

// 删除规则
function removeRule(index) {
    if (confirm('确定要删除这条规则吗？')) {
        currentRules.splice(index, 1);
        // 重新设置优先级
        currentRules.forEach((rule, idx) => {
            rule.priority = idx + 1;
        });
        renderRulesTable();
    }
}

// 保存策略
function saveStrategy() {
    const name = document.getElementById('strategyName').value.trim();
    const dimension = document.getElementById('managementDimension').value;
    const area = document.getElementById('areaSelect').value;
    const materialName = document.getElementById('materialName').value.trim();
    const remark = document.getElementById('remark').value.trim();
    
    // 验证
    if (!name) {
        alert('请输入策略名称！');
        return;
    }
    
    if (!dimension) {
        alert('请选择管理维度！');
        return;
    }
    
    if (dimension === '库区' && !area) {
        alert('请选择库区！');
        return;
    }
    
    if (dimension === '物料') {
        if (!materialName) {
            alert('请输入物料名称！');
            return;
        }
        if (!selectedMaterial) {
            alert('请从下拉列表中选择有效的物料！');
            return;
        }
    }
    
    if (currentRules.length === 0) {
        alert('请至少添加一条库位分配规则！');
        return;
    }
    
    const now = getCurrentTime();
    
    if (editingStrategyId) {
        // 编辑
        const strategy = strategyData.find(s => s.id === editingStrategyId);
        if (strategy) {
            strategy.name = name;
            strategy.dimension = dimension;
            strategy.area = dimension === '库区' ? area : '-';
            strategy.materialCode = dimension === '物料' ? selectedMaterial.code : '-';
            strategy.materialName = dimension === '物料' ? selectedMaterial.name : '-';
            strategy.remark = remark;
            strategy.updateTime = now;
            strategy.updater = '管理员';
            strategy.rules = JSON.parse(JSON.stringify(currentRules));
            
            alert('策略更新成功！');
        }
    } else {
        // 新增
        const newStrategy = {
            id: strategyData.length > 0 ? Math.max(...strategyData.map(s => s.id)) + 1 : 1,
            name: name,
            dimension: dimension,
            area: dimension === '库区' ? area : '-',
            materialCode: dimension === '物料' ? selectedMaterial.code : '-',
            materialName: dimension === '物料' ? selectedMaterial.name : '-',
            remark: remark,
            createTime: now,
            updateTime: now,
            updater: '管理员',
            rules: JSON.parse(JSON.stringify(currentRules))
        };
        
        strategyData.push(newStrategy);
        alert('策略添加成功！');
    }
    
    closeModal();
    resetSearch();
}

// 编辑策略
function editStrategy(id) {
    const strategy = strategyData.find(s => s.id === id);
    if (!strategy) return;
    
    editingStrategyId = id;
    document.getElementById('modalTitle').textContent = '编辑入库策略';
    
    // 填充表单
    document.getElementById('strategyName').value = strategy.name;
    document.getElementById('managementDimension').value = strategy.dimension;
    document.getElementById('remark').value = strategy.remark || '';
    
    // 根据维度设置字段
    if (strategy.dimension === '库区') {
        document.getElementById('areaSelect').disabled = false;
        document.getElementById('areaSelect').value = strategy.area;
        document.getElementById('areaLabel').classList.add('required');
        document.getElementById('materialName').disabled = true;
        document.getElementById('materialName').value = '';
        document.getElementById('materialCode').value = '';
        document.getElementById('materialLabel').classList.remove('required');
        selectedMaterial = null;
    } else if (strategy.dimension === '物料') {
        document.getElementById('areaSelect').disabled = true;
        document.getElementById('areaSelect').value = '';
        document.getElementById('areaLabel').classList.remove('required');
        document.getElementById('materialName').disabled = false;
        document.getElementById('materialName').value = strategy.materialName;
        document.getElementById('materialCode').value = strategy.materialCode;
        document.getElementById('materialLabel').classList.add('required');
        // 设置已选择的物料
        selectedMaterial = materialList.find(m => m.code === strategy.materialCode);
    } else {
        document.getElementById('areaSelect').disabled = true;
        document.getElementById('areaSelect').value = '';
        document.getElementById('areaLabel').classList.remove('required');
        document.getElementById('materialName').disabled = true;
        document.getElementById('materialName').value = '';
        document.getElementById('materialCode').value = '';
        document.getElementById('materialLabel').classList.remove('required');
        selectedMaterial = null;
    }
    
    // 加载规则
    currentRules = JSON.parse(JSON.stringify(strategy.rules));
    renderRulesTable();
    
    document.getElementById('strategyModal').classList.add('active');
}

// 删除策略
function deleteStrategy(id) {
    const strategy = strategyData.find(s => s.id === id);
    if (!strategy) return;
    
    if (confirm(`确定要删除策略"${strategy.name}"吗？\n\n删除后将无法恢复。`)) {
        const index = strategyData.findIndex(s => s.id === id);
        if (index > -1) {
            strategyData.splice(index, 1);
            alert('策略删除成功！');
            resetSearch();
        }
    }
}

// 查看详情
function viewDetail(id) {
    const strategy = strategyData.find(s => s.id === id);
    if (!strategy) return;
    
    // 填充详情
    document.getElementById('detailStrategyName').textContent = strategy.name;
    document.getElementById('detailDimension').textContent = strategy.dimension;
    document.getElementById('detailArea').textContent = strategy.area;
    document.getElementById('detailMaterialCode').textContent = strategy.materialCode;
    document.getElementById('detailMaterialName').textContent = strategy.materialName;
    document.getElementById('detailRemark').textContent = strategy.remark || '-';
    document.getElementById('detailCreateTime').textContent = strategy.createTime;
    document.getElementById('detailUpdateTime').textContent = strategy.updateTime;
    document.getElementById('detailUpdater').textContent = strategy.updater;
    
    // 填充规则
    const tbody = document.getElementById('detailRulesTableBody');
    tbody.innerHTML = strategy.rules.map(rule => `
        <tr>
            <td>${rule.priority}</td>
            <td>${rule.rule}</td>
            <td>${rule.ignoreOnFail}</td>
        </tr>
    `).join('');
    
    document.getElementById('detailModal').classList.add('active');
}

// 关闭弹窗
function closeModal() {
    document.getElementById('strategyModal').classList.remove('active');
    editingStrategyId = null;
    currentRules = [];
}

// 关闭详情弹窗
function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// 获取当前时间
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
