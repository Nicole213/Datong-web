// 入库日志页面脚本

const inboundFailureLogs = [
    {
        id: 1,
        logNo: 'INLOG-20260325-001',
        orderNo: 'RK-2026-001',
        containerCode: 'TP-1021',
        materialCode: 'WL-2026-001',
        materialName: '标准周转箱',
        stage: '堆垛机入库取货失败',
        retryStatus: '待重试',
        sourceSystem: 'WCS',
        status: '失败',
        statusCode: 500,
        retryCount: 2,
        createTime: '2026-03-25 08:12:16',
        lastRetryTime: '2026-03-25 08:18:45',
        requestUrl: '/api/inbound/stacker/pick',
        failureReason: '堆垛机执行入库取货时未成功取到托盘，设备返回取货超时。',
        requestContent: JSON.stringify({
            orderNo: 'RK-2026-001',
            taskNo: 'TASK-IN-301',
            aisleCode: 'XD-01',
            targetContainer: 'TP-1021',
            materialCode: 'WL-2026-001'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 500,
            message: 'stacker pick timeout',
            detail: '堆垛机在规定时间内未完成取货动作'
        }, null, 2)
    },
    {
        id: 2,
        logNo: 'INLOG-20260325-002',
        orderNo: 'RK-2026-003',
        containerCode: 'TP-2381',
        materialCode: 'WL-2026-005',
        materialName: '塑料托盘',
        stage: '堆垛机入库失败',
        retryStatus: '人工处理',
        sourceSystem: 'WCS',
        status: '失败',
        statusCode: 409,
        retryCount: 1,
        createTime: '2026-03-25 08:46:03',
        lastRetryTime: '2026-03-25 08:48:31',
        requestUrl: '/api/inbound/stacker/putaway',
        failureReason: '堆垛机执行入库任务时巷道互锁，设备未完成入库动作。',
        requestContent: JSON.stringify({
            orderNo: 'RK-2026-003',
            taskNo: 'TASK-IN-318',
            aisleCode: 'XD-03',
            targetLocation: '3-8-10-1',
            containerCode: 'TP-2381'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 409,
            message: 'aisle interlock detected',
            detail: '巷道 XD-03 当前存在互锁任务，入库动作被中止'
        }, null, 2)
    },
    {
        id: 3,
        logNo: 'INLOG-20260325-003',
        orderNo: 'RK-2026-006',
        containerCode: 'TP-3268',
        materialCode: 'WL-2026-002',
        materialName: '电子料盒',
        stage: '入库信息同步失败',
        retryStatus: '已告警',
        sourceSystem: 'ERP',
        status: '失败',
        statusCode: 504,
        retryCount: 3,
        createTime: '2026-03-25 09:05:22',
        lastRetryTime: '2026-03-25 09:17:08',
        requestUrl: '/api/inbound/sync',
        failureReason: '入库完成后回传ERP超时，入库信息未同步成功且已触发告警。',
        requestContent: JSON.stringify({
            orderNo: 'RK-2026-006',
            inboundStatus: 'FINISHED',
            finishedAt: '2026-03-25 09:05:20',
            warehouseCode: 'WH-01'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 504,
            message: 'sync timeout',
            detail: 'ERP服务 15 秒内未响应'
        }, null, 2)
    },
    {
        id: 4,
        logNo: 'INLOG-20260325-004',
        orderNo: 'RK-2026-008',
        containerCode: 'TP-4120',
        materialCode: 'WL-2026-012',
        materialName: '金属周转架',
        stage: '堆垛机入库取货失败',
        retryStatus: '待重试',
        sourceSystem: 'WCS',
        status: '失败',
        statusCode: 502,
        retryCount: 1,
        createTime: '2026-03-25 09:32:11',
        lastRetryTime: '2026-03-25 09:36:42',
        requestUrl: '/api/inbound/stacker/pick',
        failureReason: '堆垛机取货过程中扫码校验失败，未能完成入库取货。',
        requestContent: JSON.stringify({
            orderNo: 'RK-2026-008',
            taskNo: 'TASK-IN-336',
            aisleCode: 'XD-02',
            containerCode: 'TP-4120'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 502,
            message: 'barcode verify failed',
            detail: '容器 TP-4120 条码识别异常'
        }, null, 2)
    },
    {
        id: 5,
        logNo: 'INLOG-20260325-005',
        orderNo: 'RK-2026-010',
        containerCode: 'TP-5098',
        materialCode: 'WL-2026-018',
        materialName: '防静电托盘',
        stage: '堆垛机入库失败',
        retryStatus: '人工处理',
        sourceSystem: 'WCS',
        status: '失败',
        statusCode: 422,
        retryCount: 0,
        createTime: '2026-03-25 10:08:50',
        lastRetryTime: '-',
        requestUrl: '/api/inbound/stacker/putaway',
        failureReason: '堆垛机入库时目标库位被占用，任务被系统拦截。',
        requestContent: JSON.stringify({
            orderNo: 'RK-2026-010',
            taskNo: 'TASK-IN-352',
            targetLocation: '2-6-12-1',
            containerCode: 'TP-5098'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 422,
            message: 'target location occupied',
            detail: '目标库位 2-6-12-1 当前已有占用记录'
        }, null, 2)
    },
    {
        id: 6,
        logNo: 'INLOG-20260325-006',
        orderNo: 'RK-2026-011',
        containerCode: 'TP-6186',
        materialCode: 'WL-2026-003',
        materialName: '周转托盘盖板',
        stage: '入库信息同步失败',
        retryStatus: '待重试',
        sourceSystem: 'MES',
        status: '失败',
        statusCode: 500,
        retryCount: 2,
        createTime: '2026-03-25 10:26:14',
        lastRetryTime: '2026-03-25 10:31:19',
        requestUrl: '/api/inbound/status/sync',
        failureReason: '入库状态同步MES失败，返回报文缺少成功确认标识。',
        requestContent: JSON.stringify({
            orderNo: 'RK-2026-011',
            inboundStatus: 'PUTAWAY_FINISHED',
            finishedAt: '2026-03-25 10:26:10',
            locationCode: '1-4-8-2'
        }, null, 2),
        responseContent: JSON.stringify({
            code: 500,
            message: 'missing ack flag',
            detail: 'MES回传结果中缺少 ack=true 标识'
        }, null, 2)
    }
];

let currentPage = 1;
const pageSize = 8;
let filteredData = [...inboundFailureLogs];

document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

function initEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', searchLogs);
    document.getElementById('resetBtn').addEventListener('click', resetSearch);

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

    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('closeBtn').addEventListener('click', closeModal);
    document.getElementById('messageModal').addEventListener('click', function(event) {
        if (event.target === this) {
            closeModal();
        }
    });
}

function searchLogs() {
    const orderNo = document.getElementById('searchOrderNo').value.trim().toLowerCase();
    const containerCode = document.getElementById('searchContainerCode').value.trim().toLowerCase();
    const stage = document.getElementById('searchStage').value;
    const retryStatus = document.getElementById('searchRetryStatus').value;

    filteredData = inboundFailureLogs.filter(log => {
        const matchOrderNo = !orderNo || log.orderNo.toLowerCase().includes(orderNo);
        const matchContainerCode = !containerCode || (log.containerCode || '').toLowerCase().includes(containerCode);
        const matchStage = !stage || log.stage === stage;
        const matchRetryStatus = !retryStatus || log.retryStatus === retryStatus;

        return matchOrderNo && matchContainerCode && matchStage && matchRetryStatus;
    });

    currentPage = 1;
    renderTable();
}

function resetSearch() {
    document.getElementById('searchOrderNo').value = '';
    document.getElementById('searchContainerCode').value = '';
    document.getElementById('searchStage').value = '';
    document.getElementById('searchRetryStatus').value = '';

    filteredData = [...inboundFailureLogs];
    currentPage = 1;
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('logTableBody');

    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="11">未查询到匹配的入库失败日志记录</td>
            </tr>
        `;
        updatePagination();
        return;
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(log => `
        <tr>
            <td>${log.logNo}</td>
            <td>${log.orderNo}</td>
            <td>${log.containerCode || '-'}</td>
            <td><span class="stage-badge">${log.stage}</span></td>
            <td><div class="reason-text">${log.failureReason}</div></td>
            <td><span class="code-text">${log.statusCode}</span></td>
            <td>${log.retryCount}</td>
            <td><span class="retry-badge ${getRetryStatusClass(log.retryStatus)}">${log.retryStatus}</span></td>
            <td>${log.createTime}</td>
            <td>${log.lastRetryTime}</td>
            <td>
                <button class="view-btn" onclick="viewMessage(${log.id})">查看报文</button>
            </td>
        </tr>
    `).join('');

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

function getRetryStatusClass(retryStatus) {
    if (retryStatus === '待重试') return 'pending';
    if (retryStatus === '已告警') return 'alert';
    return 'manual';
}

function viewMessage(id) {
    const log = inboundFailureLogs.find(item => item.id === id);
    if (!log) return;

    document.getElementById('detailLogNo').textContent = log.logNo;
    document.getElementById('detailOrderNo').textContent = log.orderNo;
    document.getElementById('detailStage').textContent = log.stage;
    document.getElementById('detailSourceSystem').textContent = log.sourceSystem;
    document.getElementById('detailRequestUrl').textContent = log.requestUrl;
    document.getElementById('detailStatusCode').textContent = log.statusCode;
    document.getElementById('detailFailureReason').textContent = log.failureReason;
    document.getElementById('requestContent').textContent = log.requestContent;
    document.getElementById('responseContent').textContent = log.responseContent;

    document.getElementById('messageModal').classList.add('active');
}

function closeModal() {
    document.getElementById('messageModal').classList.remove('active');
}
