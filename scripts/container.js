// 容器管理页面交互
document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    let editingId = null;

    // 模拟容器数据
    const mockContainers = [
        {
            id: 1,
            code: 'TP-001',
            type: '小金属框',
            length: 600,
            width: 400,
            height: 300,
            status: '已满',
            createTime: '2024-01-10 09:00:00',
            location: '1-5-12-1',
            hasTransaction: true,
            materials: [
                { code: 'WL-2024-001', name: '电子元件A型', quantity: 8, inTime: '2024-01-15 10:30:00', age: 16 },
                { code: 'WL-2024-003', name: '塑料配件C型', quantity: 12, inTime: '2024-01-16 14:20:00', age: 15 }
            ]
        },
        {
            id: 2,
            code: 'TP-002',
            type: '大金属框',
            length: 1200,
            width: 800,
            height: 600,
            status: '占用',
            createTime: '2024-01-11 10:30:00',
            location: '2-8-10-1',
            hasTransaction: true,
            materials: [
                { code: 'WL-2024-002', name: '机械零件B型', quantity: 3, inTime: '2024-01-18 09:15:00', age: 13 }
            ]
        },
        {
            id: 3,
            code: 'TP-003',
            type: '塑料托盘',
            length: 1000,
            width: 800,
            height: 150,
            status: '空闲',
            createTime: '2024-01-12 14:20:00',
            location: '-',
            hasTransaction: false,
            materials: []
        },
        {
            id: 4,
            code: 'TP-004',
            type: '长物料钢托盘',
            length: 3000,
            width: 500,
            height: 200,
            status: '已满',
            createTime: '2024-01-13 16:45:00',
            location: '3-15-8-1',
            hasTransaction: true,
            materials: [
                { code: 'WL-2024-004', name: '长物料钢材D型', quantity: 2, inTime: '2024-01-20 11:20:00', age: 11 }
            ]
        },
        {
            id: 5,
            code: 'TP-005',
            type: '小金属框',
            length: 600,
            width: 400,
            height: 300,
            status: '占用',
            createTime: '2024-01-14 11:20:00',
            location: '1-10-11-2',
            hasTransaction: true,
            materials: [
                { code: 'WL-2024-005', name: '金属材料E型', quantity: 5, inTime: '2024-01-22 15:30:00', age: 9 }
            ]
        },
        {
            id: 6,
            code: 'RQ-2024-006',
            type: '大金属框',
            length: 1200,
            width: 800,
            height: 600,
            status: '空闲',
            createTime: '2024-01-15 13:15:00',
            location: '-',
            hasTransaction: false,
            materials: []
        }
    ];

    let containers = [...mockContainers];
    let filteredContainers = [...containers];

    // 渲染表格
    function renderTable() {
        const tbody = document.getElementById('containerTableBody');
        tbody.innerHTML = '';

        if (filteredContainers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">暂无数据</td></tr>';
            return;
        }

        filteredContainers.forEach(container => {
            const statusClass = container.status === '空闲' ? 'idle' : container.status === '占用' ? 'occupied' : 'full';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${container.code}</td>
                <td>${container.type}</td>
                <td>${container.length}×${container.width}×${container.height}</td>
                <td><span class="status-badge ${statusClass}">${container.status}</span></td>
                <td>${container.createTime}</td>
                <td>${container.location}</td>
                <td>
                    <div class="action-btns">
                        <button class="detail-btn" data-id="${container.id}">详情</button>
                        <button class="edit-btn" data-id="${container.id}">编辑</button>
                        <button class="delete-btn" data-id="${container.id}">删除</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // 绑定操作按钮事件
        bindActionButtons();
    }

    // 绑定操作按钮事件
    function bindActionButtons() {
        const detailBtns = document.querySelectorAll('.detail-btn');
        const editBtns = document.querySelectorAll('.edit-btn');
        const deleteBtns = document.querySelectorAll('.delete-btn');

        detailBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                showDetail(id);
            });
        });

        editBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editContainer(id);
            });
        });

        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteContainer(id);
            });
        });
    }

    // 查询
    document.getElementById('searchBtn').addEventListener('click', function() {
        const code = document.getElementById('searchCode').value.trim();
        const type = document.getElementById('containerType').value;
        const status = document.getElementById('containerStatus').value;

        filteredContainers = containers.filter(c => {
            let match = true;
            
            if (code) {
                match = match && c.code.includes(code);
            }
            
            if (type) {
                match = match && c.type === type;
            }
            
            if (status) {
                match = match && c.status === status;
            }
            
            return match;
        });

        renderTable();
    });

    // 重置
    document.getElementById('resetBtn').addEventListener('click', function() {
        document.getElementById('searchCode').value = '';
        document.getElementById('containerType').value = '';
        document.getElementById('containerStatus').value = '';
        filteredContainers = [...containers];
        renderTable();
    });

    // 新增容器
    document.getElementById('addBtn').addEventListener('click', function() {
        editingId = null;
        document.getElementById('modalTitle').textContent = '新增容器';
        document.getElementById('containerForm').reset();
        document.getElementById('containerModal').classList.add('active');
    });

    // 编辑容器
    function editContainer(id) {
        editingId = id;
        const container = containers.find(c => c.id === id);
        
        if (!container) return;

        document.getElementById('modalTitle').textContent = '编辑容器';
        document.getElementById('containerCode').value = container.code;
        document.getElementById('containerTypeInput').value = container.type;
        document.getElementById('containerLength').value = container.length;
        document.getElementById('containerWidth').value = container.width;
        document.getElementById('containerHeight').value = container.height;

        document.getElementById('containerModal').classList.add('active');
    }

    // 删除容器
    function deleteContainer(id) {
        const container = containers.find(c => c.id === id);
        
        if (!container) return;

        if (container.hasTransaction) {
            alert('该容器已发生过业务，不可删除！');
            return;
        }

        if (confirm(`确定要删除容器"${container.code}"吗？`)) {
            containers = containers.filter(c => c.id !== id);
            filteredContainers = filteredContainers.filter(c => c.id !== id);
            renderTable();
            alert('删除成功！');
        }
    }

    // 显示详情
    function showDetail(id) {
        const container = containers.find(c => c.id === id);
        
        if (!container) return;

        // 填充基本信息
        document.getElementById('detailCode').textContent = container.code;
        document.getElementById('detailType').textContent = container.type;
        document.getElementById('detailSize').textContent = `${container.length}×${container.width}×${container.height}mm`;
        
        const statusClass = container.status === '空闲' ? 'idle' : container.status === '占用' ? 'occupied' : 'full';
        document.getElementById('detailStatus').innerHTML = `<span class="status-badge ${statusClass}">${container.status}</span>`;
        
        document.getElementById('detailLocation').textContent = container.location;
        document.getElementById('detailCreateTime').textContent = container.createTime;

        // 填充物料明细
        const materialBody = document.getElementById('materialDetailBody');
        materialBody.innerHTML = '';

        if (container.materials.length === 0) {
            materialBody.innerHTML = '<tr><td colspan="5" class="empty-data">该容器暂无存放物料</td></tr>';
        } else {
            container.materials.forEach(material => {
                const ageClass = material.age < 7 ? 'new' : material.age < 30 ? 'normal' : 'old';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${material.code}</td>
                    <td>${material.name}</td>
                    <td>${material.quantity}</td>
                    <td>${material.inTime}</td>
                    <td><span class="age-tag ${ageClass}">${material.age}天</span></td>
                `;
                materialBody.appendChild(tr);
            });
        }

        document.getElementById('detailModal').classList.add('active');
    }

    // 保存
    document.getElementById('saveBtn').addEventListener('click', function() {
        const code = document.getElementById('containerCode').value.trim();
        const type = document.getElementById('containerTypeInput').value;
        const length = parseInt(document.getElementById('containerLength').value);
        const width = parseInt(document.getElementById('containerWidth').value);
        const height = parseInt(document.getElementById('containerHeight').value);

        // 验证
        if (!code || !type || !length || !width || !height) {
            alert('请填写所有必填项！');
            return;
        }

        if (editingId) {
            // 编辑
            const container = containers.find(c => c.id === editingId);
            if (container) {
                container.code = code;
                container.type = type;
                container.length = length;
                container.width = width;
                container.height = height;
            }
            alert('修改成功！');
        } else {
            // 新增
            const newContainer = {
                id: containers.length > 0 ? Math.max(...containers.map(c => c.id)) + 1 : 1,
                code,
                type,
                length,
                width,
                height,
                status: '空闲',
                createTime: new Date().toLocaleString('zh-CN', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                }).replace(/\//g, '-'),
                location: '-',
                hasTransaction: false,
                materials: []
            };
            containers.push(newContainer);
            alert('新增成功！');
        }

        filteredContainers = [...containers];
        renderTable();
        document.getElementById('containerModal').classList.remove('active');
    });

    // 取消
    document.getElementById('cancelBtn').addEventListener('click', function() {
        document.getElementById('containerModal').classList.remove('active');
    });

    // 关闭弹窗
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    document.getElementById('detailCloseBtn').addEventListener('click', function() {
        document.getElementById('detailModal').classList.remove('active');
    });

    // 点击弹窗外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    // 初始化
    renderTable();
});
