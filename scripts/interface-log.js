// 接口日志页面脚本

// 模拟接口日志数据
let logData = [
    {
        id: 1,
        businessType: '入库',
        url: 'http://api.wms.com/inbound/create',
        isSender: '是',
        isReceiver: '否',
        status: '成功',
        statusCode: 200,
        retryCount: 0,
        successTime: '2024-01-20 14:30:25',
        createTime: '2024-01-20 14:30:20',
        updateTime: '2024-01-20 14:30:25',
        requestContent: JSON.stringify({
            orderNo: 'IN202401200001',
            warehouseCode: 'WH001',
            materials: [
                {
                    materialCode: 'MAT001',
                    materialName: '物料A',
                    quantity: 100,
                    unit: '个'
                }
            ]
        }, null, 2),
        responseContent: JSON.stringify({
            code: 200,
            message: '成功',
            data: {
                taskId: 'TASK001',
                status: 'created'
            }
        }, null, 2)
    },
    {
        id: 2,
        businessType: '出库',
        url: 'http://api.wms.com/outbound/create',
        isSender: '是',
        isReceiver: '否',
        status: '成功',
        statusCode: 200,
        retryCount: 0,
        successTime: '2024-01-20 15:20:10',
        createTime: '2024-01-20 15:20:05',
        updateTime: '2024-01-20 15:20:10',
        requestContent: JSON.stringify({
            orderNo: 'OUT202401200001',
            warehouseCode: 'WH001',
            materials: [
                {
                    materialCode: 'MAT002',
                    materialName: '物料B',
                    quantity: 50,
                    unit: '个'
                }
            ]
        }, null, 2),
        responseContent: JSON.stringify({
            code: 200,
            message: '成功',
            data: {
                taskId: 'TASK002',
                status: 'created'
            }
        }, null, 2)
    },
    {
        id: 3,
        businessType: '入库',
        url: 'http://api.erp.com/inbound/callback',
        isSender: '否',
        isReceiver: '是',
        status: '失败',
        statusCode: 500,
        retryCount: 3,
        successTime: '-',
        createTime: '2024-01-20 16:10:30',
        updateTime: '2024-01-20 16:15:45',
        requestContent: JSON.stringify({
            taskId: 'TASK001',
            status: 'completed',
            completedTime: '2024-01-20 16:10:25'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 500,
            message: '服务器内部错误',
            error: 'Database connection timeout'
        }, null, 2)
    },
    {
        id: 4,
        businessType: '出库',
        url: 'http://api.erp.com/outbound/callback',
        isSender: '否',
        isReceiver: '是',
        status: '成功',
        statusCode: 200,
        retryCount: 1,
        successTime: '2024-01-20 16:25:15',
        createTime: '2024-01-20 16:25:10',
        updateTime: '2024-01-20 16:25:15',
        requestContent: JSON.stringify({
            taskId: 'TASK002',
            status: 'completed',
            completedTime: '2024-01-20 16:25:05'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 200,
            message: '成功'
        }, null, 2)
    },
    {
        id: 5,
        businessType: '其他',
        url: 'http://api.wms.com/inventory/sync',
        isSender: '是',
        isReceiver: '否',
        status: '处理中',
        statusCode: 0,
        retryCount: 0,
        successTime: '-',
        createTime: '2024-01-20 17:00:00',
        updateTime: '2024-01-20 17:00:00',
        requestContent: JSON.stringify({
            warehouseCode: 'WH001',
            syncType: 'full',
            timestamp: '2024-01-20 17:00:00'
        }, null, 2),
        responseContent: '-'
    },
    {
        id: 6,
        businessType: '入库',
        url: 'http://api.wms.com/inbound/update',
        isSender: '是',
        isReceiver: '否',
        status: '成功',
        statusCode: 200,
        retryCount: 0,
        successTime: '2024-01-20 17:30:20',
        createTime: '2024-01-20 17:30:18',
        updateTime: '2024-01-20 17:30:20',
        requestContent: JSON.stringify({
            orderNo: 'IN202401200002',
            status: 'confirmed',
            updateTime: '2024-01-20 17:30:15'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 200,
            message: '更新成功'
        }, null, 2)
    },
    {
        id: 7,
        businessType: '出库',
        url: 'http://api.wms.com/outbound/cancel',
        isSender: '是',
        isReceiver: '否',
        status: '失败',
        statusCode: 400,
        retryCount: 2,
        successTime: '-',
        createTime: '2024-01-20 18:00:00',
        updateTime: '2024-01-20 18:05:30',
        requestContent: JSON.stringify({
            orderNo: 'OUT202401200002',
            reason: '客户取消订单'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 400,
            message: '订单已发货，无法取消',
            error: 'Order already shipped'
        }, null, 2)
    },
    {
        id: 8,
        businessType: '其他',
        url: 'http://api.erp.com/material/query',
        isSender: '否',
        isReceiver: '是',
        status: '成功',
        statusCode: 200,
        retryCount: 0,
        successTime: '2024-01-20 18:30:05',
        createTime: '2024-01-20 18:30:00',
        updateTime: '2024-01-20 18:30:05',
        requestContent: JSON.stringify({
            materialCode: 'MAT003',
            warehouseCode: 'WH001'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 200,
            message: '成功',
            data: {
                materialCode: 'MAT003',
                materialName: '物料C',
                quantity: 200,
                unit: '个'
            }
        }, null, 2)
    }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...logData];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('logTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(log => {
        const statusClass = log.status === '成功' ? 'success' : 
                           log.status === '失败' ? 'failed' : 'pending';
        
        const senderClass = log.isSender === '是' ? 'yes' : 'no';
        const receiverClass = log.isReceiver === '是' ? 'yes' : 'no';
        
        return `
        <tr>
            <td>${log.businessType}</td>
            <td><span class="url-text" title="${log.url}">${log.url}</span></td>
            <td><span class="yes-no-badge ${senderClass}">${log.isSender}</span></td>
            <td><span class="yes-no-badge ${receiverClass}">${log.isReceiver}</span></td>
            <td><span class="status-badge ${statusClass}">${log.status}</span></td>
            <td>${log.statusCode || '-'}</td>
            <td>${log.retryCount}</td>
            <td>${log.successTime}</td>
            <td>${log.createTime}</td>
            <td>${log.updateTime}</td>
            <td>
                <div class="action-btns">
                    <button class="view-btn" onclick="viewMessage(${log.id})">查看报文</button>
                </div>
            </td>
        </tr>
    `}).join('');

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
    document.getElementById('searchBtn').addEventListener('click', searchLogs);
    
    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', resetSearch);
    
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
    document.getElementById('closeBtn').addEventListener('click', closeModal);
    
    // 点击弹窗外部关闭
    document.getElementById('messageModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// 查询日志
function searchLogs() {
    const businessType = document.getElementById('searchBusinessType').value;
    const isSender = document.getElementById('searchIsSender').value;
    const isReceiver = document.getElementById('searchIsReceiver').value;
    
    filteredData = logData.filter(log => {
        const matchBusinessType = !businessType || log.businessType === businessType;
        const matchIsSender = !isSender || log.isSender === isSender;
        const matchIsReceiver = !isReceiver || log.isReceiver === isReceiver;
        
        return matchBusinessType && matchIsSender && matchIsReceiver;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchBusinessType').value = '';
    document.getElementById('searchIsSender').value = '';
    document.getElementById('searchIsReceiver').value = '';
    
    filteredData = [...logData];
    currentPage = 1;
    renderTable();
}

// 查看报文
function viewMessage(id) {
    const log = logData.find(l => l.id === id);
    if (!log) return;
    
    // 填充报文信息
    document.getElementById('requestUrl').textContent = log.url;
    document.getElementById('statusCode').textContent = log.statusCode || '-';
    document.getElementById('requestContent').textContent = log.requestContent;
    document.getElementById('responseContent').textContent = log.responseContent;
    
    document.getElementById('messageModal').classList.add('active');
}

// 关闭弹窗
function closeModal() {
    document.getElementById('messageModal').classList.remove('active');
}
