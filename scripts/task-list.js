// 任务列表页面脚本

// 模拟任务数据
let taskData = [
    {
        id: 1,
        taskNo: 'TASK-RK-2024-0001-001',
        orderNo: 'RK-2024-0001',
        commandType: '入库',
        taskType: '普通入库',
        containerCode: 'TP-001',
        materials: [
            { name: '电子元件A型', qty: 30 }
        ],
        pickLocation: '-',
        putLocation: '1-5-12-1',
        pickPort: '1号入库口',
        putPort: '-',
        status: '已完成',
        createTime: '2024-01-17 15:20:00',
        startTime: '2024-01-17 15:25:00',
        completeTime: '2024-01-17 15:30:25',
        errorReason: '',
        isUrgent: false
    },
    {
        id: 2,
        taskNo: 'TASK-RK-2024-0002-001',
        orderNo: 'RK-2024-0002',
        commandType: '入库',
        taskType: '普通入库',
        containerCode: 'TP-002',
        materials: [
            { name: '机械零件B型', qty: 20 }
        ],
        pickLocation: '-',
        putLocation: '1-6-12-1',
        pickPort: '1号入库口',
        putPort: '-',
        status: '执行中',
        createTime: '2024-01-17 16:00:00',
        startTime: '2024-01-17 16:05:00',
        completeTime: '-',
        errorReason: '',
        isUrgent: false
    },
    {
        id: 3,
        taskNo: 'TASK-CK-2024-0001-001',
        orderNo: 'CK-2024-0001',
        commandType: '出库',
        taskType: '普通出库',
        containerCode: 'TP-001',
        materials: [
            { name: '电子元件A型', qty: 30 }
        ],
        pickLocation: '1-5-12-1',
        putLocation: '-',
        pickPort: '-',
        putPort: '1号出库口',
        status: '已完成',
        createTime: '2024-01-18 09:00:00',
        startTime: '2024-01-18 09:05:00',
        completeTime: '2024-01-18 09:10:30',
        errorReason: '',
        isUrgent: false
    },
    {
        id: 4,
        taskNo: 'TASK-CK-2024-0002-001',
        orderNo: 'CK-2024-0002',
        commandType: '出库',
        taskType: '组盘出库',
        containerCode: 'TP-003',
        materials: [
            { name: '塑料配件C型', qty: 50 },
            { name: '金属材料E型', qty: 20 }
        ],
        pickLocation: '1-3-8-1',
        putLocation: '-',
        pickPort: '-',
        putPort: '2号出库口',
        status: '待执行',
        createTime: '2024-01-18 10:30:00',
        startTime: '-',
        completeTime: '-',
        errorReason: '',
        isUrgent: false
    },
    {
        id: 5,
        taskNo: 'TASK-PD-2024-001-001',
        orderNo: 'PD-2024-001',
        commandType: '出库',
        taskType: '盘点出库',
        containerCode: 'TP-005',
        materials: [
            { name: '长物料钢材D型', qty: 15 }
        ],
        pickLocation: '2-5-10-1',
        putLocation: '-',
        pickPort: '-',
        putPort: '盘点口1',
        status: '已完成',
        createTime: '2024-01-19 14:00:00',
        startTime: '2024-01-19 14:05:00',
        completeTime: '2024-01-19 14:15:00',
        errorReason: '',
        isUrgent: false
    },
    {
        id: 6,
        taskNo: 'TASK-PD-2024-001-002',
        orderNo: 'PD-2024-001',
        commandType: '入库',
        taskType: '盘点入库',
        containerCode: 'TP-005',
        materials: [
            { name: '长物料钢材D型', qty: 15 }
        ],
        pickLocation: '-',
        putLocation: '2-5-10-1',
        pickPort: '盘点口1',
        putPort: '-',
        status: '已完成',
        createTime: '2024-01-19 15:00:00',
        startTime: '2024-01-19 15:05:00',
        completeTime: '2024-01-19 15:10:00',
        errorReason: '',
        isUrgent: false
    },
    {
        id: 7,
        taskNo: 'TASK-HK-2024-001',
        orderNo: '-',
        commandType: '入库',
        taskType: '托盘回库',
        containerCode: 'TP-010',
        materials: [],
        pickLocation: '-',
        putLocation: '3-2-7-1',
        pickPort: '2号出库口',
        putPort: '-',
        status: '异常',
        createTime: '2024-01-20 11:00:00',
        startTime: '2024-01-20 11:05:00',
        completeTime: '-',
        errorReason: '满入',
        isUrgent: false
    },
    {
        id: 8,
        taskNo: 'TASK-CK-2024-0003-001',
        orderNo: 'CK-2024-0003',
        commandType: '出库',
        taskType: '普通出库',
        containerCode: 'TP-006',
        materials: [
            { name: '金属材料E型', qty: 35 }
        ],
        pickLocation: '3-2-7-1',
        putLocation: '-',
        pickPort: '-',
        putPort: '1号出库口',
        status: '待执行',
        createTime: '2024-01-20 13:30:00',
        startTime: '-',
        completeTime: '-',
        errorReason: '',
        isUrgent: true
    },
    {
        id: 9,
        taskNo: 'TASK-KTP-2024-001',
        orderNo: '-',
        commandType: '入库',
        taskType: '空托盘入库',
        containerCode: 'TP-020',
        materials: [],
        pickLocation: '-',
        putLocation: '1-1-1-1',
        pickPort: '1号入库口',
        putPort: '-',
        status: '已完成',
        createTime: '2024-01-21 09:00:00',
        startTime: '2024-01-21 09:05:00',
        completeTime: '2024-01-21 09:08:00',
        errorReason: '',
        isUrgent: false
    },
    {
        id: 10,
        taskNo: 'TASK-CK-2024-0004-001',
        orderNo: 'CK-2024-0004',
        commandType: '出库',
        taskType: '普通出库',
        containerCode: 'TP-007',
        materials: [
            { name: '电子元件A型', qty: 25 }
        ],
        pickLocation: '1-8-12-2',
        putLocation: '-',
        pickPort: '-',
        putPort: '1号出库口',
        status: '已取消',
        createTime: '2024-01-21 10:00:00',
        startTime: '-',
        completeTime: '-',
        errorReason: '',
        isUrgent: false
    }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...taskData];
let forceCompleteTaskId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('taskTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(task => {
        const statusClass = getStatusClass(task.status);
        const commandClass = task.commandType === '入库' ? 'inbound' : 'outbound';
        
        // 格式化物料信息
        let materialInfo = '-';
        if (task.materials && task.materials.length > 0) {
            materialInfo = task.materials.map(m => `${m.name}×${m.qty}`).join('、');
        } else if (task.taskType.includes('空托盘') || task.taskType === '托盘回库') {
            materialInfo = task.taskType.includes('空托盘') ? '空托盘' : 
                          (task.materials.length === 0 ? '空托盘' : '非空托盘');
        }
        
        // 操作按钮
        let actions = [];
        if (task.status === '待执行') {
            if (!task.isUrgent) {
                actions.push(`<button class="urgent-btn" onclick="urgentTask(${task.id})">加急</button>`);
            }
            actions.push(`<button class="cancel-btn" onclick="cancelTask(${task.id})">取消</button>`);
        }
        if (task.status === '执行中' || task.status === '异常') {
            actions.push(`<button class="force-btn" onclick="forceComplete(${task.id})">强制完成</button>`);
        }
        
        return `
        <tr>
            <td>
                ${task.taskNo}
                ${task.isUrgent ? '<span class="urgent-flag">加急</span>' : ''}
            </td>
            <td>${task.orderNo}</td>
            <td><span class="command-badge ${commandClass}">${task.commandType}</span></td>
            <td><span class="task-type-badge">${task.taskType}</span></td>
            <td>${task.containerCode}</td>
            <td class="material-info">${materialInfo}</td>
            <td>${task.pickLocation}</td>
            <td>${task.putLocation}</td>
            <td>${task.pickPort}</td>
            <td>${task.putPort}</td>
            <td><span class="status-badge ${statusClass}">${task.status}</span></td>
            <td>${task.createTime}</td>
            <td>${task.startTime}</td>
            <td>${task.completeTime}</td>
            <td>${task.errorReason ? `<span class="error-reason">${task.errorReason}</span>` : '-'}</td>
            <td>
                <div class="action-btns">
                    ${actions.join('')}
                </div>
            </td>
        </tr>
    `}).join('');

    updatePagination();
}

// 获取状态样式类
function getStatusClass(status) {
    const statusMap = {
        '待执行': 'pending',
        '执行中': 'processing',
        '已完成': 'completed',
        '异常': 'error',
        '已取消': 'cancelled'
    };
    return statusMap[status] || 'pending';
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
    document.getElementById('searchBtn').addEventListener('click', searchTasks);
    
    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', resetSearch);
    
    // 导出按钮
    document.getElementById('exportBtn').addEventListener('click', exportData);
    
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
    
    // 强制完成弹窗
    document.getElementById('forceClose').addEventListener('click', closeForceModal);
    document.getElementById('forceSaveBtn').addEventListener('click', saveForceComplete);
    document.getElementById('forceCancelBtn').addEventListener('click', closeForceModal);
    
    // 点击弹窗外部关闭
    document.getElementById('forceCompleteModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeForceModal();
        }
    });
}

// 查询任务
function searchTasks() {
    const taskNo = document.getElementById('searchTaskNo').value.trim().toLowerCase();
    const orderNo = document.getElementById('searchOrderNo').value.trim().toLowerCase();
    const commandType = document.getElementById('searchCommandType').value;
    const taskType = document.getElementById('searchTaskType').value;
    const container = document.getElementById('searchContainer').value.trim().toLowerCase();
    const status = document.getElementById('searchStatus').value;
    const createStartDate = document.getElementById('searchCreateStartDate').value;
    const createEndDate = document.getElementById('searchCreateEndDate').value;
    const completeStartDate = document.getElementById('searchCompleteStartDate').value;
    const completeEndDate = document.getElementById('searchCompleteEndDate').value;
    
    filteredData = taskData.filter(task => {
        const matchTaskNo = !taskNo || task.taskNo.toLowerCase().includes(taskNo);
        const matchOrderNo = !orderNo || task.orderNo.toLowerCase().includes(orderNo);
        const matchCommandType = !commandType || task.commandType === commandType;
        const matchTaskType = !taskType || task.taskType === taskType;
        const matchContainer = !container || task.containerCode.toLowerCase().includes(container);
        const matchStatus = !status || task.status === status;
        
        // 创建时间筛选
        let matchCreateDate = true;
        if (createStartDate || createEndDate) {
            const taskDate = task.createTime.split(' ')[0];
            if (createStartDate && taskDate < createStartDate) matchCreateDate = false;
            if (createEndDate && taskDate > createEndDate) matchCreateDate = false;
        }
        
        // 完成时间筛选
        let matchCompleteDate = true;
        if (completeStartDate || completeEndDate) {
            if (task.completeTime === '-') {
                matchCompleteDate = false;
            } else {
                const completeDate = task.completeTime.split(' ')[0];
                if (completeStartDate && completeDate < completeStartDate) matchCompleteDate = false;
                if (completeEndDate && completeDate > completeEndDate) matchCompleteDate = false;
            }
        }
        
        return matchTaskNo && matchOrderNo && matchCommandType && matchTaskType && 
               matchContainer && matchStatus && matchCreateDate && matchCompleteDate;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchTaskNo').value = '';
    document.getElementById('searchOrderNo').value = '';
    document.getElementById('searchCommandType').value = '';
    document.getElementById('searchTaskType').value = '';
    document.getElementById('searchContainer').value = '';
    document.getElementById('searchStatus').value = '';
    document.getElementById('searchCreateStartDate').value = '';
    document.getElementById('searchCreateEndDate').value = '';
    document.getElementById('searchCompleteStartDate').value = '';
    document.getElementById('searchCompleteEndDate').value = '';
    
    filteredData = [...taskData];
    currentPage = 1;
    renderTable();
}

// 加急任务
function urgentTask(id) {
    const task = taskData.find(t => t.id === id);
    if (!task) return;
    
    if (task.status !== '待执行') {
        alert('只有待执行状态的任务可以加急！');
        return;
    }
    
    if (confirm(`确定要将任务"${task.taskNo}"设置为加急吗？\n\n加急后该任务将优先执行。`)) {
        task.isUrgent = true;
        alert('任务已设置为加急！');
        renderTable();
    }
}

// 取消任务
function cancelTask(id) {
    const task = taskData.find(t => t.id === id);
    if (!task) return;
    
    if (task.status !== '待执行') {
        alert('只有待执行状态的任务可以取消！');
        return;
    }
    
    if (confirm(`确定要取消任务"${task.taskNo}"吗？\n\n取消后该任务将不再执行。`)) {
        task.status = '已取消';
        task.isUrgent = false;
        alert('任务已取消！');
        renderTable();
    }
}

// 强制完成
function forceComplete(id) {
    const task = taskData.find(t => t.id === id);
    if (!task) return;
    
    if (task.status !== '执行中' && task.status !== '异常') {
        alert('只有执行中或异常状态的任务可以强制完成！');
        return;
    }
    
    forceCompleteTaskId = id;
    document.getElementById('forceReason').value = '';
    document.getElementById('forceCompleteModal').classList.add('active');
}

// 保存强制完成
function saveForceComplete() {
    const reason = document.getElementById('forceReason').value;
    
    if (!reason) {
        alert('请选择强制完成原因！');
        return;
    }
    
    const task = taskData.find(t => t.id === forceCompleteTaskId);
    if (task) {
        task.status = '已完成';
        task.completeTime = getCurrentTime();
        task.errorReason = `强制完成-${reason}`;
        
        alert(`任务已强制完成！\n\n系统将自动更新库存，默认该任务已按照任务内容执行。`);
        closeForceModal();
        renderTable();
    }
}

// 关闭强制完成弹窗
function closeForceModal() {
    document.getElementById('forceCompleteModal').classList.remove('active');
    forceCompleteTaskId = null;
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

// 导出数据
function exportData() {
    if (filteredData.length === 0) {
        alert('没有可导出的数据！');
        return;
    }
    
    // 构建CSV内容
    const headers = [
        '任务号', '关联单据号', '命令类型', '任务类型', '容器编码', '物料信息',
        '取货库位', '放货库位', '取货库口', '放货库口', '状态', 
        '创建时间', '开始时间', '完成时间', '异常原因', '是否加急'
    ];
    
    let csvContent = headers.join(',') + '\n';
    
    filteredData.forEach(task => {
        // 格式化物料信息
        let materialInfo = '-';
        if (task.materials && task.materials.length > 0) {
            materialInfo = task.materials.map(m => `${m.name}×${m.qty}`).join('、');
        } else if (task.taskType.includes('空托盘') || task.taskType === '托盘回库') {
            materialInfo = task.taskType.includes('空托盘') ? '空托盘' : 
                          (task.materials.length === 0 ? '空托盘' : '非空托盘');
        }
        
        const row = [
            task.taskNo,
            task.orderNo,
            task.commandType,
            task.taskType,
            task.containerCode,
            materialInfo,
            task.pickLocation,
            task.putLocation,
            task.pickPort,
            task.putPort,
            task.status,
            task.createTime,
            task.startTime,
            task.completeTime,
            task.errorReason || '-',
            task.isUrgent ? '是' : '否'
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
    link.setAttribute('download', `任务列表_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`成功导出 ${filteredData.length} 条任务记录！`);
}
