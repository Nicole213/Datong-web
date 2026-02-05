// 盘点计划页面脚本

// 模拟数据
let inventoryPlans = [
    {
        id: 1,
        planNo: 'PD-2024-001',
        source: 'manual',
        scopeType: '全仓库',
        scopeDetails: [],
        status: 'completed',
        creator: '管理员',
        createTime: '2024-01-10 09:00:00',
        planTime: '2024-01-12 08:00:00',
        owner: '王五',
        completeTime: '2024-01-12 18:30:00',
        remark: '年度盘点',
        inventoryPort: '出库口1'
    },
    {
        id: 2,
        planNo: 'PD-2024-002',
        source: 'sync',
        scopeType: '指定库区',
        scopeDetails: ['库区A', '库区B'],
        status: 'processing',
        creator: '系统',
        createTime: '2024-01-16 14:20:00',
        planTime: '2024-01-18 08:00:00',
        owner: '李四',
        completeTime: '',
        remark: '客户要求盘点',
        inventoryPort: '出库口2'
    },
    {
        id: 3,
        planNo: 'PD-2024-003',
        source: 'manual',
        scopeType: '指定库位',
        scopeDetails: ['1-5-12-1', '1-6-12-1', '2-5-12-1'],
        status: 'pending',
        creator: '管理员',
        createTime: '2024-01-15 10:30:00',
        planTime: '2024-01-20 09:00:00',
        owner: '张三',
        completeTime: '',
        remark: '重点库位盘点'
    },
    {
        id: 4,
        planNo: 'PD-2024-004',
        source: 'manual',
        scopeType: '指定物料',
        scopeDetails: ['WL-2024-001', 'WL-2024-002'],
        status: 'pending',
        creator: '管理员',
        createTime: '2024-01-17 11:00:00',
        planTime: '2024-01-22 10:00:00',
        owner: '张三',
        completeTime: '',
        remark: '高价值物料盘点'
    },
    {
        id: 5,
        planNo: 'PD-2024-005',
        source: 'manual',
        scopeType: '指定容器',
        scopeDetails: ['TP-001', 'TP-002', 'TP-003'],
        status: 'paused',
        creator: '管理员',
        createTime: '2024-01-18 15:30:00',
        planTime: '2024-01-25 14:00:00',
        owner: '李四',
        completeTime: '',
        remark: '异常容器盘点',
        inventoryPort: '出库口1'
    },
    {
        id: 6,
        planNo: 'PD-2024-006',
        source: 'sync',
        scopeType: '指定物料',
        scopeDetails: ['WL-2024-005', 'WL-2024-006', 'WL-2024-007'],
        status: 'cancelled',
        creator: '系统',
        createTime: '2024-01-14 09:15:00',
        planTime: '2024-01-16 08:00:00',
        owner: '王五',
        completeTime: '',
        remark: '客户取消盘点'
    }
];

// 模拟物料数据
const materials = [
    { code: 'WL-2024-001', name: '电子元件A型' },
    { code: 'WL-2024-002', name: '机械零件B型' },
    { code: 'WL-2024-003', name: '塑料配件C型' },
    { code: 'WL-2024-004', name: '橡胶密封圈D型' },
    { code: 'WL-2024-005', name: '金属材料E型' },
    { code: 'WL-2024-006', name: '电子芯片F型' },
    { code: 'WL-2024-007', name: '塑料外壳G型' },
    { code: 'WL-2024-008', name: '金属螺丝H型' },
    { code: 'WL-2024-009', name: '橡胶垫片I型' },
    { code: 'WL-2024-010', name: '电子线路板J型' }
];

// 模拟库区数据
const areas = ['库区A', '库区B', '库区C', '库区D', '库区E'];

// 模拟库位数据
const locations = [
    '1-5-12-1', '1-6-12-1', '1-7-12-1', '1-8-12-1',
    '2-5-12-1', '2-6-12-1', '2-7-12-1', '2-8-12-1',
    '3-5-12-1', '3-6-12-1', '3-7-12-1', '3-8-12-1',
    '4-5-12-1', '4-6-12-1', '4-7-12-1', '4-8-12-1'
];

// 模拟容器数据
const containers = [
    'TP-001', 'TP-002', 'TP-003', 'TP-004', 'TP-005',
    'TP-006', 'TP-007', 'TP-008', 'TP-009', 'TP-010'
];

// 当前编辑的计划
let currentPlan = null;
let isEditMode = false;
let startingPlanId = null; // 正在开始的盘点计划ID
let editingPortPlanId = null; // 正在修改盘点口的计划ID

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    initEventListeners();
});

// 初始化页面
function initPage() {
    renderTable();
}

// 初始化事件监听
function initEventListeners() {
    // 新增按钮
    document.getElementById('addPlanBtn').addEventListener('click', openAddModal);
    
    // 查询按钮
    document.getElementById('searchBtn').addEventListener('click', searchPlans);
    
    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', resetFilters);
    
    // 弹窗关闭
    document.getElementById('modalClose').addEventListener('click', closePlanModal);
    document.getElementById('cancelPlanBtn').addEventListener('click', closePlanModal);
    document.getElementById('detailClose').addEventListener('click', closeDetailModal);
    document.getElementById('closeDetailBtn').addEventListener('click', closeDetailModal);
    
    // 保存按钮
    document.getElementById('savePlanBtn').addEventListener('click', savePlan);
    
    // 盘点范围变化
    document.getElementById('scopeType').addEventListener('change', onScopeTypeChange);
    
    // 点击弹窗外部关闭
    document.getElementById('planModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePlanModal();
        }
    });
    
    document.getElementById('detailModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDetailModal();
        }
    });
    
    document.getElementById('startPlanModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeStartPlanModal();
        }
    });
    
    document.getElementById('editPortModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditPortModal();
        }
    });
    
    // 开始盘点弹窗按钮
    document.getElementById('startModalClose').addEventListener('click', closeStartPlanModal);
    document.getElementById('cancelStartBtn').addEventListener('click', closeStartPlanModal);
    document.getElementById('confirmStartBtn').addEventListener('click', confirmStartPlan);
    
    // 修改盘点口弹窗按钮
    document.getElementById('editPortModalClose').addEventListener('click', closeEditPortModal);
    document.getElementById('cancelEditPortBtn').addEventListener('click', closeEditPortModal);
    document.getElementById('confirmEditPortBtn').addEventListener('click', confirmEditPort);
}

// 渲染表格
function renderTable(data = inventoryPlans) {
    const tbody = document.getElementById('planTableBody');
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: #999;">暂无数据</td></tr>';
        document.getElementById('totalCount').textContent = '0';
        return;
    }
    
    tbody.innerHTML = data.map(plan => {
        // 构建操作按钮数组
        let actions = [];
        
        // 详情按钮（始终显示）
        actions.push(`<button class="action-btn" onclick="viewDetail(${plan.id})">详情</button>`);
        
        // 编辑按钮（可编辑时显示）
        if (canEdit(plan)) {
            actions.push(`<button class="action-btn" onclick="editPlan(${plan.id})">编辑</button>`);
        }
        
        // 根据状态显示不同的操作按钮
        if (plan.status === 'pending') {
            actions.push(`<button class="action-btn" onclick="startPlan(${plan.id})">开始盘点</button>`);
            actions.push(`<button class="action-btn" onclick="cancelPlan(${plan.id})">取消计划</button>`);
        } else if (plan.status === 'processing') {
            actions.push(`<button class="action-btn" onclick="pausePlan(${plan.id})">暂停盘点</button>`);
            actions.push(`<button class="action-btn" onclick="terminatePlan(${plan.id})">终止盘点</button>`);
        } else if (plan.status === 'paused') {
            actions.push(`<button class="action-btn" onclick="resumePlan(${plan.id})">继续盘点</button>`);
        }
        
        // 删除按钮（可删除时显示）
        if (canDelete(plan)) {
            actions.push(`<button class="action-btn" onclick="deletePlan(${plan.id})">删除</button>`);
        }
        
        return `
            <tr>
                <td>${plan.planNo}</td>
                <td><span class="source-badge ${plan.source}">${getSourceText(plan.source)}</span></td>
                <td>${plan.scopeType}</td>
                <td><span class="status-badge ${plan.status}">${getStatusText(plan.status)}</span></td>
                <td>${plan.creator}</td>
                <td>${plan.createTime}</td>
                <td>${plan.planTime}</td>
                <td>${plan.owner}</td>
                <td>${plan.completeTime || '-'}</td>
                <td>
                    <div class="action-btns">
                        ${actions.join('')}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('totalCount').textContent = data.length;
}

// 获取来源文本
function getSourceText(source) {
    const map = {
        'sync': '客户WMS同步',
        'manual': '手工创建'
    };
    return map[source] || source;
}

// 获取状态文本
function getStatusText(status) {
    const map = {
        'pending': '待执行',
        'processing': '执行中',
        'completed': '已完成',
        'paused': '已暂停',
        'cancelled': '已取消',
        'terminated': '已终止'
    };
    return map[status] || status;
}

// 判断是否可编辑
function canEdit(plan) {
    // 执行中/已完成/已取消的不可编辑
    if (['processing', 'completed', 'cancelled'].includes(plan.status)) {
        return false;
    }
    // 从接口同步的不可编辑
    if (plan.source === 'sync') {
        return false;
    }
    return true;
}

// 判断是否可删除
function canDelete(plan) {
    // 执行中/已完成/已取消的不可删除
    if (['processing', 'completed', 'cancelled'].includes(plan.status)) {
        return false;
    }
    // 从接口同步的不可删除
    if (plan.source === 'sync') {
        return false;
    }
    // 已终止的不可删除
    if (plan.status === 'terminated') {
        return false;
    }
    return true;
}

// 打开新增弹窗
function openAddModal() {
    isEditMode = false;
    currentPlan = null;
    
    document.getElementById('modalTitle').textContent = '新增盘点计划';
    document.getElementById('planNo').value = generatePlanNo();
    document.getElementById('scopeType').value = '';
    document.getElementById('owner').value = '';
    document.getElementById('planTime').value = '';
    document.getElementById('remark').value = '';
    
    document.getElementById('scopeSection').style.display = 'none';
    document.getElementById('scopeContent').innerHTML = '';
    
    document.getElementById('planModal').classList.add('active');
}

// 生成盘点计划号
function generatePlanNo() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `PD-${year}${month}${day}-${random}`;
}

// 编辑计划
function editPlan(id) {
    const plan = inventoryPlans.find(p => p.id === id);
    if (!plan) return;
    
    if (!canEdit(plan)) {
        alert('该盘点计划不可编辑！');
        return;
    }
    
    isEditMode = true;
    currentPlan = plan;
    
    document.getElementById('modalTitle').textContent = '编辑盘点计划';
    document.getElementById('planNo').value = plan.planNo;
    document.getElementById('scopeType').value = plan.scopeType;
    document.getElementById('owner').value = plan.owner;
    document.getElementById('planTime').value = plan.planTime.replace(' ', 'T');
    document.getElementById('remark').value = plan.remark;
    
    // 触发范围类型变化
    onScopeTypeChange();
    
    // 设置已选择的范围
    setTimeout(() => {
        if (plan.scopeDetails && plan.scopeDetails.length > 0) {
            plan.scopeDetails.forEach(detail => {
                const checkbox = document.querySelector(`input[value="${detail}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }, 100);
    
    document.getElementById('planModal').classList.add('active');
}

// 删除计划
function deletePlan(id) {
    const plan = inventoryPlans.find(p => p.id === id);
    if (!plan) return;
    
    if (!canDelete(plan)) {
        alert('该盘点计划不可删除！');
        return;
    }
    
    if (confirm(`确定要删除盘点计划 ${plan.planNo} 吗？`)) {
        inventoryPlans = inventoryPlans.filter(p => p.id !== id);
        renderTable();
        alert('删除成功！');
    }
}

// 开始盘点
function startPlan(id) {
    const plan = inventoryPlans.find(p => p.id === id);
    if (!plan) return;
    
    if (plan.status !== 'pending') {
        alert('只有待执行状态的盘点计划才能开始！');
        return;
    }
    
    startingPlanId = id;
    document.getElementById('startPlanNo').textContent = plan.planNo;
    document.getElementById('inventoryPort').value = '';
    document.getElementById('startPlanModal').classList.add('active');
}

// 确认开始盘点
function confirmStartPlan() {
    const port = document.getElementById('inventoryPort').value;
    
    if (!port) {
        alert('请选择盘点口！');
        return;
    }
    
    const plan = inventoryPlans.find(p => p.id === startingPlanId);
    if (!plan) return;
    
    // 模拟开始盘点流程
    const index = inventoryPlans.findIndex(p => p.id === startingPlanId);
    if (index !== -1) {
        inventoryPlans[index].status = 'processing';
        inventoryPlans[index].inventoryPort = port;
    }
    
    closeStartPlanModal();
    renderTable();
    
    alert(`盘点计划 ${plan.planNo} 已开始执行！\n盘点口：${port}\n\n系统已完成以下操作：\n1. 生成盘点任务\n2. 锁定盘点范围内的库位\n3. 向WCS下发盘点出库任务`);
}

// 关闭开始盘点弹窗
function closeStartPlanModal() {
    document.getElementById('startPlanModal').classList.remove('active');
    startingPlanId = null;
}

// 打开修改盘点口弹窗
function openEditPortModal() {
    const planId = parseInt(document.getElementById('editPortBtn').getAttribute('data-plan-id'));
    const plan = inventoryPlans.find(p => p.id === planId);
    if (!plan) return;
    
    editingPortPlanId = planId;
    document.getElementById('editPortPlanNo').textContent = plan.planNo;
    document.getElementById('currentPort').textContent = plan.inventoryPort || '-';
    document.getElementById('newInventoryPort').value = '';
    document.getElementById('editPortModal').classList.add('active');
}

// 确认修改盘点口
function confirmEditPort() {
    const newPort = document.getElementById('newInventoryPort').value;
    
    if (!newPort) {
        alert('请选择新盘点口！');
        return;
    }
    
    const plan = inventoryPlans.find(p => p.id === editingPortPlanId);
    if (!plan) return;
    
    const oldPort = plan.inventoryPort;
    
    if (newPort === oldPort) {
        alert('新盘点口与当前盘点口相同！');
        return;
    }
    
    if (confirm(`确定要将盘点口从 ${oldPort} 修改为 ${newPort} 吗？\n\n已执行的任务将继续在原盘点口执行，未执行的任务将使用新盘点口。`)) {
        const index = inventoryPlans.findIndex(p => p.id === editingPortPlanId);
        if (index !== -1) {
            inventoryPlans[index].inventoryPort = newPort;
        }
        
        closeEditPortModal();
        
        // 刷新详情页面
        viewDetail(editingPortPlanId);
        
        alert(`盘点口修改成功！\n原盘点口：${oldPort}\n新盘点口：${newPort}\n\n已执行的任务继续在 ${oldPort} 执行\n未执行的任务将使用 ${newPort}`);
    }
}

// 关闭修改盘点口弹窗
function closeEditPortModal() {
    document.getElementById('editPortModal').classList.remove('active');
    editingPortPlanId = null;
}

// 取消计划
function cancelPlan(id) {
    const plan = inventoryPlans.find(p => p.id === id);
    if (!plan) return;
    
    if (plan.status !== 'pending') {
        alert('只有待执行状态的盘点计划才能取消！');
        return;
    }
    
    if (confirm(`确定要取消盘点计划 ${plan.planNo} 吗？取消后将无法恢复。`)) {
        const index = inventoryPlans.findIndex(p => p.id === id);
        if (index !== -1) {
            inventoryPlans[index].status = 'cancelled';
            inventoryPlans[index].completeTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
        }
        renderTable();
        alert('取消成功！');
    }
}

// 暂停盘点
function pausePlan(id) {
    const plan = inventoryPlans.find(p => p.id === id);
    if (!plan) return;
    
    if (plan.status !== 'processing') {
        alert('只有执行中状态的盘点计划才能暂停！');
        return;
    }
    
    if (confirm(`确定要暂停盘点计划 ${plan.planNo} 吗？`)) {
        const index = inventoryPlans.findIndex(p => p.id === id);
        if (index !== -1) {
            inventoryPlans[index].status = 'paused';
        }
        renderTable();
        alert('暂停成功！');
    }
}

// 继续盘点
function resumePlan(id) {
    const plan = inventoryPlans.find(p => p.id === id);
    if (!plan) return;
    
    if (plan.status !== 'paused') {
        alert('只有已暂停状态的盘点计划才能继续！');
        return;
    }
    
    if (confirm(`确定要继续盘点计划 ${plan.planNo} 吗？`)) {
        const index = inventoryPlans.findIndex(p => p.id === id);
        if (index !== -1) {
            inventoryPlans[index].status = 'processing';
        }
        renderTable();
        alert('已恢复执行！');
    }
}

// 终止盘点
function terminatePlan(id) {
    const plan = inventoryPlans.find(p => p.id === id);
    if (!plan) return;
    
    if (plan.status !== 'processing') {
        alert('只有执行中状态的盘点计划才能终止！');
        return;
    }
    
    if (confirm(`确定要终止盘点计划 ${plan.planNo} 吗？终止后将无法恢复，已盘点的数据将保留。`)) {
        const index = inventoryPlans.findIndex(p => p.id === id);
        if (index !== -1) {
            inventoryPlans[index].status = 'terminated';
            inventoryPlans[index].completeTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
        }
        renderTable();
        alert('终止成功！');
    }
}

// 查看详情
function viewDetail(id) {
    const plan = inventoryPlans.find(p => p.id === id);
    if (!plan) return;
    
    // 显示基本信息
    document.getElementById('detailPlanNo').textContent = plan.planNo;
    document.getElementById('detailSource').textContent = getSourceText(plan.source);
    document.getElementById('detailScope').textContent = plan.scopeType;
    document.getElementById('detailCreator').textContent = plan.creator;
    document.getElementById('detailCreateTime').textContent = plan.createTime;
    document.getElementById('detailPlanTime').textContent = plan.planTime;
    document.getElementById('detailOwner').textContent = plan.owner;
    document.getElementById('detailRemark').textContent = plan.remark || '-';
    
    // 显示盘点口信息
    const portSpan = document.getElementById('detailInventoryPort');
    const editPortBtn = document.getElementById('editPortBtn');
    
    // 执行中/已完成/已暂停/已终止状态显示盘点口
    const showPortStatuses = ['processing', 'completed', 'paused', 'terminated'];
    
    if (showPortStatuses.includes(plan.status) && plan.inventoryPort) {
        portSpan.textContent = plan.inventoryPort;
        // 执行中或已暂停状态可以修改盘点口
        if (plan.status === 'processing' || plan.status === 'paused') {
            editPortBtn.style.display = 'inline-block';
            editPortBtn.setAttribute('data-plan-id', plan.id);
        } else {
            editPortBtn.style.display = 'none';
        }
    } else {
        // 待执行/已取消状态显示为空
        portSpan.textContent = '-';
        editPortBtn.style.display = 'none';
    }
    
    // 显示盘点物料明细
    renderDetailMaterial(plan);
    
    // 显示盘点任务
    renderDetailTasks(plan);
    
    document.getElementById('detailModal').classList.add('active');
}

// 渲染详情物料明细
function renderDetailMaterial(plan) {
    const container = document.getElementById('detailMaterialContent');
    
    if (plan.scopeType === '全仓库') {
        container.innerHTML = `
            <p style="color: #666; margin-bottom: 16px;">盘点范围：全仓库所有物料</p>
            ${renderInventoryTable('全仓库', plan)}
        `;
    } else if (plan.scopeType === '指定物料') {
        // 按指定物料盘点：以容器维度展示
        container.innerHTML = `
            <p style="color: #666; margin-bottom: 16px;">盘点物料：${plan.scopeDetails.map(code => {
                const material = materials.find(m => m.code === code);
                return material ? `${material.code} - ${material.name}` : code;
            }).join('、')}</p>
            ${renderInventoryByMaterial(plan)}
        `;
    } else if (plan.scopeType === '指定库位') {
        // 按指定库位盘点：以库位为维度展示
        container.innerHTML = `
            <p style="color: #666; margin-bottom: 16px;">盘点库位：${plan.scopeDetails.join('、')}</p>
            ${renderInventoryByLocation(plan)}
        `;
    } else if (plan.scopeType === '指定库区') {
        // 按指定库区盘点：列出库区内所有库位
        container.innerHTML = `
            <p style="color: #666; margin-bottom: 16px;">盘点库区：${plan.scopeDetails.join('、')}</p>
            ${renderInventoryByArea(plan)}
        `;
    } else if (plan.scopeType === '指定容器') {
        // 按指定容器盘点：列表展示容器及物料明细
        container.innerHTML = `
            <p style="color: #666; margin-bottom: 16px;">盘点容器：${plan.scopeDetails.join('、')}</p>
            ${renderInventoryByContainer(plan)}
        `;
    }
}

// 按指定物料盘点 - 以容器维度展示
function renderInventoryByMaterial(plan) {
    // 模拟数据：各容器内存放的指定物料
    const mockData = [
        {
            container: 'TP-001',
            location: '1-5-12-1',
            materialCode: 'WL-2024-001',
            materialName: '电子元件A型',
            bookQty: 100,
            actualQty: 98,
            difference: -2,
            result: '盘亏'
        },
        {
            container: 'TP-003',
            location: '1-7-12-1',
            materialCode: 'WL-2024-001',
            materialName: '电子元件A型',
            bookQty: 50,
            actualQty: null, // 未盘点
            difference: null,
            result: null
        },
        {
            container: 'TP-005',
            location: '2-5-12-1',
            materialCode: 'WL-2024-002',
            materialName: '机械零件B型',
            bookQty: 80,
            actualQty: 80,
            difference: 0,
            result: '正常'
        }
    ];
    
    return `
        <table class="detail-table">
            <thead>
                <tr>
                    <th>容器编码</th>
                    <th>所在库位</th>
                    <th>物料编码</th>
                    <th>物料名称</th>
                    <th>账面数量</th>
                    <th>盘点数量</th>
                    <th>盘点差异</th>
                    <th>盘点结果</th>
                </tr>
            </thead>
            <tbody>
                ${mockData.map((item, index) => `
                    <tr>
                        <td>${item.container}</td>
                        <td>${item.location}</td>
                        <td>${item.materialCode}</td>
                        <td>${item.materialName}</td>
                        <td>${item.bookQty}</td>
                        <td>${item.actualQty !== null ? item.actualQty : '-'}</td>
                        <td class="${item.difference !== null ? (item.difference > 0 ? 'diff-positive' : item.difference < 0 ? 'diff-negative' : '') : ''}">${item.difference !== null ? (item.difference > 0 ? '+' : '') + item.difference : '-'}</td>
                        <td>${item.result ? `<span class="result-badge ${item.result === '盘盈' ? 'surplus' : item.result === '盘亏' ? 'loss' : 'normal'}">${item.result}</span>` : '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// 按指定库位盘点 - 以库位为维度展示
function renderInventoryByLocation(plan) {
    // 模拟数据：指定库位内的容器及物料明细
    const mockData = [
        {
            location: '1-5-12-1',
            container: 'TP-001',
            materials: [
                { code: 'WL-2024-001', name: '电子元件A型', bookQty: 100, actualQty: 98, difference: -2, result: '盘亏' },
                { code: 'WL-2024-002', name: '机械零件B型', bookQty: 50, actualQty: null, difference: null, result: null }
            ]
        },
        {
            location: '1-6-12-1',
            container: 'TP-002',
            materials: [
                { code: 'WL-2024-003', name: '塑料配件C型', bookQty: 80, actualQty: 82, difference: 2, result: '盘盈' }
            ]
        }
    ];
    
    let html = '';
    mockData.forEach(loc => {
        html += `
            <div class="location-group">
                <div class="location-header">
                    <strong>库位：${loc.location}</strong>
                    <span style="margin-left: 20px;">容器：${loc.container}</span>
                </div>
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>物料编码</th>
                            <th>物料名称</th>
                            <th>账面数量</th>
                            <th>盘点数量</th>
                            <th>盘点差异</th>
                            <th>盘点结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${loc.materials.map(mat => `
                            <tr>
                                <td>${mat.code}</td>
                                <td>${mat.name}</td>
                                <td>${mat.bookQty}</td>
                                <td>${mat.actualQty !== null ? mat.actualQty : '-'}</td>
                                <td class="${mat.difference !== null ? (mat.difference > 0 ? 'diff-positive' : mat.difference < 0 ? 'diff-negative' : '') : ''}">${mat.difference !== null ? (mat.difference > 0 ? '+' : '') + mat.difference : '-'}</td>
                                <td>${mat.result ? `<span class="result-badge ${mat.result === '盘盈' ? 'surplus' : mat.result === '盘亏' ? 'loss' : 'normal'}">${mat.result}</span>` : '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });
    
    return html;
}

// 按指定库区盘点 - 列出库区内所有库位
function renderInventoryByArea(plan) {
    // 模拟数据：库区内的库位、容器及物料明细
    const mockData = [
        {
            area: '库区A',
            locations: [
                {
                    location: '1-5-12-1',
                    container: 'TP-001',
                    materials: [
                        { code: 'WL-2024-001', name: '电子元件A型', bookQty: 100, actualQty: 98, difference: -2, result: '盘亏' }
                    ]
                },
                {
                    location: '1-6-12-1',
                    container: null, // 空库位
                    materials: []
                },
                {
                    location: '1-7-12-1',
                    container: 'TP-003',
                    materials: [
                        { code: 'WL-2024-002', name: '机械零件B型', bookQty: 50, actualQty: null, difference: null, result: null },
                        { code: 'WL-2024-003', name: '塑料配件C型', bookQty: 30, actualQty: 32, difference: 2, result: '盘盈' }
                    ]
                }
            ]
        }
    ];
    
    let html = '';
    mockData.forEach(area => {
        html += `<div class="area-group">`;
        area.locations.forEach(loc => {
            html += `
                <div class="location-group">
                    <div class="location-header">
                        <strong>库位：${loc.location}</strong>
                        ${loc.container ? `<span style="margin-left: 20px;">容器：${loc.container}</span>` : '<span style="margin-left: 20px; color: #999;">空库位</span>'}
                    </div>
            `;
            
            if (loc.materials.length > 0) {
                html += `
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>物料编码</th>
                                <th>物料名称</th>
                                <th>账面数量</th>
                                <th>盘点数量</th>
                                <th>盘点差异</th>
                                <th>盘点结果</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${loc.materials.map(mat => `
                                <tr>
                                    <td>${mat.code}</td>
                                    <td>${mat.name}</td>
                                    <td>${mat.bookQty}</td>
                                    <td>${mat.actualQty !== null ? mat.actualQty : '-'}</td>
                                    <td class="${mat.difference !== null ? (mat.difference > 0 ? 'diff-positive' : mat.difference < 0 ? 'diff-negative' : '') : ''}">${mat.difference !== null ? (mat.difference > 0 ? '+' : '') + mat.difference : '-'}</td>
                                    <td>${mat.result ? `<span class="result-badge ${mat.result === '盘盈' ? 'surplus' : mat.result === '盘亏' ? 'loss' : 'normal'}">${mat.result}</span>` : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else if (loc.container) {
                html += `<p style="color: #999; padding: 12px;">该容器暂无物料</p>`;
            }
            
            html += `</div>`;
        });
        html += `</div>`;
    });
    
    return html;
}

// 按指定容器盘点 - 列表展示容器及物料明细
function renderInventoryByContainer(plan) {
    // 模拟数据：指定容器及物料明细
    const mockData = [
        {
            container: 'TP-001',
            location: '1-5-12-1',
            materials: [
                { code: 'WL-2024-001', name: '电子元件A型', bookQty: 100, actualQty: 98, difference: -2, result: '盘亏' },
                { code: 'WL-2024-002', name: '机械零件B型', bookQty: 50, actualQty: null, difference: null, result: null }
            ]
        },
        {
            container: 'TP-002',
            location: '1-6-12-1',
            materials: [
                { code: 'WL-2024-003', name: '塑料配件C型', bookQty: 80, actualQty: 82, difference: 2, result: '盘盈' }
            ]
        },
        {
            container: 'TP-004',
            location: '2-3-12-1',
            materials: [] // 空容器
        }
    ];
    
    let html = '';
    mockData.forEach(cont => {
        html += `
            <div class="container-group">
                <div class="container-header">
                    <strong>容器：${cont.container}</strong>
                    <span style="margin-left: 20px;">所在库位：${cont.location}</span>
                    ${cont.materials.length === 0 ? '<span style="margin-left: 20px; color: #999;">空容器</span>' : ''}
                </div>
        `;
        
        if (cont.materials.length > 0) {
            html += `
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>物料编码</th>
                            <th>物料名称</th>
                            <th>账面数量</th>
                            <th>盘点数量</th>
                            <th>盘点差异</th>
                            <th>盘点结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cont.materials.map(mat => `
                            <tr>
                                <td>${mat.code}</td>
                                <td>${mat.name}</td>
                                <td>${mat.bookQty}</td>
                                <td>${mat.actualQty !== null ? mat.actualQty : '-'}</td>
                                <td class="${mat.difference !== null ? (mat.difference > 0 ? 'diff-positive' : mat.difference < 0 ? 'diff-negative' : '') : ''}">${mat.difference !== null ? (mat.difference > 0 ? '+' : '') + mat.difference : '-'}</td>
                                <td>${mat.result ? `<span class="result-badge ${mat.result === '盘盈' ? 'surplus' : mat.result === '盘亏' ? 'loss' : 'normal'}">${mat.result}</span>` : '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            html += `<p style="color: #999; padding: 12px; text-align: center;">该容器暂无物料</p>`;
        }
        
        html += `</div>`;
    });
    
    return html;
}

// 通用盘点表格（用于全仓库）
function renderInventoryTable(type, plan) {
    return `
        <table class="detail-table">
            <thead>
                <tr>
                    <th>物料编码</th>
                    <th>物料名称</th>
                    <th>容器编码</th>
                    <th>所在库位</th>
                    <th>账面数量</th>
                    <th>盘点数量</th>
                    <th>盘点差异</th>
                    <th>盘点结果</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>WL-2024-001</td>
                    <td>电子元件A型</td>
                    <td>TP-001</td>
                    <td>1-5-12-1</td>
                    <td>100</td>
                    <td>98</td>
                    <td class="diff-negative">-2</td>
                    <td><span class="result-badge loss">盘亏</span></td>
                </tr>
                <tr>
                    <td>WL-2024-002</td>
                    <td>机械零件B型</td>
                    <td>TP-002</td>
                    <td>1-6-12-1</td>
                    <td>50</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>WL-2024-003</td>
                    <td>塑料配件C型</td>
                    <td>TP-003</td>
                    <td>1-7-12-1</td>
                    <td>80</td>
                    <td>82</td>
                    <td class="diff-positive">+2</td>
                    <td><span class="result-badge surplus">盘盈</span></td>
                </tr>
            </tbody>
        </table>
    `;
}

// 渲染详情盘点任务
function renderDetailTasks(plan) {
    const tbody = document.getElementById('detailTaskBody');
    
    // 模拟盘点任务数据
    const mockTasks = [
        {
            taskNo: 'TASK-PD-2024-001-001',
            commandType: '出库',
            taskType: '盘点出库',
            planNo: plan.planNo,
            container: 'TP-001',
            materials: [
                { code: 'WL-2024-001', name: '电子元件A型', qty: 100 },
                { code: 'WL-2024-002', name: '机械零件B型', qty: 50 }
            ],
            pickLocation: '1-5-12-1',
            putLocation: '-',
            pickPort: '-',
            putPort: '盘点口1',
            status: 'completed',
            createTime: '2024-01-20 09:00:00',
            startTime: '2024-01-20 09:15:00',
            completeTime: '2024-01-20 09:30:00'
        },
        {
            taskNo: 'TASK-PD-2024-001-002',
            commandType: '入库',
            taskType: '盘点入库',
            planNo: plan.planNo,
            container: 'TP-001',
            materials: [
                { code: 'WL-2024-001', name: '电子元件A型', qty: 98 },
                { code: 'WL-2024-002', name: '机械零件B型', qty: 50 }
            ],
            pickLocation: '-',
            putLocation: '1-5-12-1',
            pickPort: '盘点口1',
            putPort: '-',
            status: 'completed',
            createTime: '2024-01-20 09:30:00',
            startTime: '2024-01-20 09:45:00',
            completeTime: '2024-01-20 10:00:00'
        },
        {
            taskNo: 'TASK-PD-2024-001-003',
            commandType: '出库',
            taskType: '盘点出库',
            planNo: plan.planNo,
            container: 'TP-002',
            materials: [
                { code: 'WL-2024-003', name: '塑料配件C型', qty: 80 }
            ],
            pickLocation: '1-6-12-1',
            putLocation: '-',
            pickPort: '-',
            putPort: '盘点口2',
            status: 'processing',
            createTime: '2024-01-20 10:00:00',
            startTime: '2024-01-20 10:10:00',
            completeTime: '-'
        },
        {
            taskNo: 'TASK-PD-2024-001-004',
            commandType: '出库',
            taskType: '盘点出库',
            planNo: plan.planNo,
            container: 'TP-003',
            materials: [
                { code: 'WL-2024-002', name: '机械零件B型', qty: 50 },
                { code: 'WL-2024-003', name: '塑料配件C型', qty: 30 }
            ],
            pickLocation: '1-7-12-1',
            putLocation: '-',
            pickPort: '-',
            putPort: '盘点口1',
            status: 'pending',
            createTime: '2024-01-20 10:15:00',
            startTime: '-',
            completeTime: '-'
        }
    ];
    
    if (mockTasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="14" style="text-align: center; color: #999;">暂无盘点任务</td></tr>';
        return;
    }
    
    tbody.innerHTML = mockTasks.map(task => {
        // 格式化物料信息
        const materialInfo = task.materials.map(m => `${m.code} - ${m.name} × ${m.qty}`).join('、');
        
        // 命令类型样式
        const commandClass = task.commandType === '入库' ? 'inbound' : 'outbound';
        
        return `
            <tr>
                <td>${task.taskNo}</td>
                <td>${task.planNo}</td>
                <td><span class="command-badge ${commandClass}">${task.commandType}</span></td>
                <td><span class="task-type-badge">${task.taskType}</span></td>
                <td>${task.container}</td>
                <td style="max-width: 180px; word-wrap: break-word;">${materialInfo}</td>
                <td>${task.pickLocation}</td>
                <td>${task.putLocation}</td>
                <td>${task.pickPort}</td>
                <td>${task.putPort}</td>
                <td><span class="status-badge ${task.status}">${getTaskStatusText(task.status)}</span></td>
                <td>${task.createTime}</td>
                <td>${task.startTime}</td>
                <td>${task.completeTime}</td>
            </tr>
        `;
    }).join('');
}

// 获取任务状态文本
function getTaskStatusText(status) {
    const map = {
        'pending': '待执行',
        'processing': '执行中',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return map[status] || status;
}

// 渲染详情盘点结果

// 盘点范围类型变化
function onScopeTypeChange() {
    const scopeType = document.getElementById('scopeType').value;
    const scopeSection = document.getElementById('scopeSection');
    const scopeContent = document.getElementById('scopeContent');
    
    if (!scopeType || scopeType === '全仓库') {
        scopeSection.style.display = 'none';
        return;
    }
    
    scopeSection.style.display = 'block';
    
    let html = '<div class="scope-selection">';
    
    // 添加搜索框
    if (scopeType === '指定物料') {
        html += `
            <div class="scope-search">
                <input type="text" class="scope-search-input" id="scopeSearchInput" 
                    placeholder="搜索物料编码或名称" onkeyup="filterScopeItems()">
                <span class="search-icon">🔍</span>
            </div>
        `;
    } else if (scopeType === '指定库区') {
        html += `
            <div class="scope-search">
                <input type="text" class="scope-search-input" id="scopeSearchInput" 
                    placeholder="搜索库区名称" onkeyup="filterScopeItems()">
                <span class="search-icon">🔍</span>
            </div>
        `;
    } else if (scopeType === '指定库位') {
        html += `
            <div class="scope-search">
                <input type="text" class="scope-search-input" id="scopeSearchInput" 
                    placeholder="搜索库位编码" onkeyup="filterScopeItems()">
                <span class="search-icon">🔍</span>
            </div>
        `;
    } else if (scopeType === '指定容器') {
        html += `
            <div class="scope-search">
                <input type="text" class="scope-search-input" id="scopeSearchInput" 
                    placeholder="搜索容器编码" onkeyup="filterScopeItems()">
                <span class="search-icon">🔍</span>
            </div>
        `;
    }
    
    html += '<div class="scope-list" id="scopeList">';
    
    if (scopeType === '指定物料') {
        materials.forEach(material => {
            html += `
                <div class="scope-item" data-search="${material.code.toLowerCase()} ${material.name.toLowerCase()}">
                    <input type="checkbox" id="material_${material.code}" value="${material.code}">
                    <label for="material_${material.code}">${material.code} - ${material.name}</label>
                </div>
            `;
        });
    } else if (scopeType === '指定库区') {
        areas.forEach(area => {
            html += `
                <div class="scope-item" data-search="${area.toLowerCase()}">
                    <input type="checkbox" id="area_${area}" value="${area}">
                    <label for="area_${area}">${area}</label>
                </div>
            `;
        });
    } else if (scopeType === '指定库位') {
        locations.forEach(location => {
            html += `
                <div class="scope-item" data-search="${location.toLowerCase()}">
                    <input type="checkbox" id="location_${location}" value="${location}">
                    <label for="location_${location}">${location}</label>
                </div>
            `;
        });
    } else if (scopeType === '指定容器') {
        containers.forEach(container => {
            html += `
                <div class="scope-item" data-search="${container.toLowerCase()}">
                    <input type="checkbox" id="container_${container}" value="${container}">
                    <label for="container_${container}">${container}</label>
                </div>
            `;
        });
    }
    
    html += '</div></div>';
    scopeContent.innerHTML = html;
}

// 过滤范围选项
function filterScopeItems() {
    const searchInput = document.getElementById('scopeSearchInput');
    if (!searchInput) return;
    
    const searchText = searchInput.value.toLowerCase().trim();
    const scopeItems = document.querySelectorAll('.scope-item');
    
    let visibleCount = 0;
    scopeItems.forEach(item => {
        const searchData = item.getAttribute('data-search');
        if (searchData.includes(searchText)) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // 显示搜索结果提示
    const scopeList = document.getElementById('scopeList');
    let resultHint = scopeList.querySelector('.search-result-hint');
    
    if (searchText && visibleCount === 0) {
        if (!resultHint) {
            resultHint = document.createElement('div');
            resultHint.className = 'search-result-hint';
            scopeList.appendChild(resultHint);
        }
        resultHint.textContent = '未找到匹配的结果';
        resultHint.style.display = 'block';
    } else {
        if (resultHint) {
            resultHint.style.display = 'none';
        }
    }
}

// 保存计划
function savePlan() {
    const planNo = document.getElementById('planNo').value;
    const scopeType = document.getElementById('scopeType').value;
    const owner = document.getElementById('owner').value;
    const planTime = document.getElementById('planTime').value;
    const remark = document.getElementById('remark').value;
    
    // 验证必填项
    if (!scopeType) {
        alert('请选择盘点范围！');
        return;
    }
    
    if (!owner) {
        alert('请选择负责人！');
        return;
    }
    
    if (!planTime) {
        alert('请选择计划盘点时间！');
        return;
    }
    
    // 获取选择的范围
    let scopeDetails = [];
    if (scopeType !== '全仓库') {
        const checkboxes = document.querySelectorAll('#scopeContent input[type="checkbox"]:checked');
        scopeDetails = Array.from(checkboxes).map(cb => cb.value);
        
        if (scopeDetails.length === 0) {
            alert('请至少选择一个具体对象！');
            return;
        }
    }
    
    const planData = {
        planNo: planNo,
        source: 'manual',
        scopeType: scopeType,
        scopeDetails: scopeDetails,
        status: 'pending',
        creator: '管理员',
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        planTime: planTime.replace('T', ' '),
        owner: owner,
        completeTime: '',
        remark: remark
    };
    
    if (isEditMode && currentPlan) {
        // 编辑模式
        const index = inventoryPlans.findIndex(p => p.id === currentPlan.id);
        if (index !== -1) {
            inventoryPlans[index] = { ...currentPlan, ...planData };
        }
        alert('修改成功！');
    } else {
        // 新增模式
        planData.id = inventoryPlans.length > 0 ? Math.max(...inventoryPlans.map(p => p.id)) + 1 : 1;
        inventoryPlans.push(planData);
        alert('新增成功！');
    }
    
    closePlanModal();
    renderTable();
}

// 关闭计划弹窗
function closePlanModal() {
    document.getElementById('planModal').classList.remove('active');
    currentPlan = null;
    isEditMode = false;
}

// 关闭详情弹窗
function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// 查询
function searchPlans() {
    const planNo = document.getElementById('filterPlanNo').value.trim();
    const source = document.getElementById('filterSource').value;
    const status = document.getElementById('filterStatus').value;
    const owner = document.getElementById('filterOwner').value.trim();
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;
    
    let filtered = inventoryPlans;
    
    if (planNo) {
        filtered = filtered.filter(p => p.planNo.includes(planNo));
    }
    
    if (source) {
        filtered = filtered.filter(p => p.source === source);
    }
    
    if (status) {
        filtered = filtered.filter(p => p.status === status);
    }
    
    if (owner) {
        filtered = filtered.filter(p => p.owner.includes(owner));
    }
    
    if (startDate) {
        filtered = filtered.filter(p => p.createTime >= startDate);
    }
    
    if (endDate) {
        filtered = filtered.filter(p => p.createTime <= endDate + ' 23:59:59');
    }
    
    renderTable(filtered);
}

// 重置筛选
function resetFilters() {
    document.getElementById('filterPlanNo').value = '';
    document.getElementById('filterSource').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterOwner').value = '';
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    
    renderTable();
}
