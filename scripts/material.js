// 物料管理页面交互
document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    let editingId = null;

    // 模拟物料数据
    const mockMaterials = [
        {
            id: 1,
            code: 'WL-2024-001',
            name: '电子元件A型',
            type: '专用',
            length: 200,
            width: 150,
            height: 100,
            weight: 2.5,
            photo: 'https://via.placeholder.com/60',
            containers: [
                { type: '小金属框', ratio: '1/2', quantity: 10 },
                { type: '塑料托盘', ratio: '1/3', quantity: 20 }
            ],
            createTime: '2024-01-15 10:30:00',
            hasTransaction: true
        },
        {
            id: 2,
            code: 'WL-2024-002',
            name: '机械零件B型',
            type: '通用',
            length: 300,
            width: 200,
            height: 150,
            weight: 5.8,
            photo: 'https://via.placeholder.com/60',
            containers: [
                { type: '大金属框', ratio: '1/2', quantity: 5 }
            ],
            createTime: '2024-01-16 14:20:00',
            hasTransaction: false
        },
        {
            id: 3,
            code: 'WL-2024-003',
            name: '塑料配件C型',
            type: '专用',
            length: 150,
            width: 100,
            height: 80,
            weight: 1.2,
            photo: 'https://via.placeholder.com/60',
            containers: [
                { type: '小金属框', ratio: '1/4', quantity: 15 },
                { type: '塑料托盘', ratio: '1/2', quantity: 25 }
            ],
            createTime: '2024-01-17 09:15:00',
            hasTransaction: true
        },
        {
            id: 4,
            code: 'WL-2024-004',
            name: '长物料钢材D型',
            type: '通用',
            length: 2000,
            width: 100,
            height: 50,
            weight: 15.6,
            photo: 'https://via.placeholder.com/60',
            containers: [
                { type: '长物料钢托盘', ratio: '1/2', quantity: 3 }
            ],
            createTime: '2024-01-18 16:45:00',
            hasTransaction: false
        },
        {
            id: 5,
            code: 'WL-2024-005',
            name: '金属材料E型',
            type: '专用',
            length: 250,
            width: 180,
            height: 120,
            weight: 8.3,
            photo: 'https://via.placeholder.com/60',
            containers: [
                { type: '大金属框', ratio: '1/3', quantity: 8 },
                { type: '塑料托盘', ratio: '1/4', quantity: 12 }
            ],
            createTime: '2024-01-19 11:20:00',
            hasTransaction: true
        }
    ];

    let materials = [...mockMaterials];
    let filteredMaterials = [...materials];
    const containerMap = {
        '小金属框': 'small-metal',
        '大金属框': 'large-metal',
        '塑料托盘': 'plastic-pallet',
        '长物料钢托盘': 'long-steel-pallet'
    };
    const ratioKeyMap = {
        '1': 'full',
        '1/2': 'half',
        '1/3': 'third',
        '1/4': 'quarter'
    };

    function formatContainerConfig(container) {
        const ratioText = container.ratio ? `${container.ratio}=${container.quantity}` : container.quantity;
        return `${container.type}(${ratioText})`;
    }

    function getQuantityInputId(containerId, ratioKey) {
        return `qty-${containerId}-${ratioKey}`;
    }

    function resetContainerConfig() {
        document.querySelectorAll('input[name="container"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        document.querySelectorAll('.ratio-radio').forEach(radio => {
            radio.checked = false;
            radio.disabled = true;
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.disabled = true;
            input.value = '';
        });
    }

    function updateContainerRatioState(containerId) {
        const selectedRadio = document.querySelector(`.ratio-radio[data-container="${containerId}"]:checked`);

        document.querySelectorAll(`.quantity-input[data-container="${containerId}"]`).forEach(input => {
            const shouldEnable = selectedRadio && input.dataset.ratioKey === selectedRadio.dataset.ratioKey;
            input.disabled = !shouldEnable;

            if (!shouldEnable) {
                input.value = '';
            }
        });
    }

    function setContainerEnabled(containerId, enabled) {
        document.querySelectorAll(`.ratio-radio[data-container="${containerId}"]`).forEach(radio => {
            radio.disabled = !enabled;

            if (!enabled) {
                radio.checked = false;
            }
        });

        if (!enabled) {
            document.querySelectorAll(`.quantity-input[data-container="${containerId}"]`).forEach(input => {
                input.disabled = true;
                input.value = '';
            });
            return;
        }

        updateContainerRatioState(containerId);
    }

    // 渲染表格
    function renderTable() {
        const tbody = document.getElementById('materialTableBody');
        tbody.innerHTML = '';

        if (filteredMaterials.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">暂无数据</td></tr>';
            return;
        }

        filteredMaterials.forEach(material => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${material.code}</td>
                <td>${material.name}</td>
                <td>${material.type}</td>
                <td><img src="${material.photo}" class="material-photo" alt="物料照片"></td>
                <td>
                    <div class="container-tags">
                        ${material.containers.map(c => `<span class="container-tag">${formatContainerConfig(c)}</span>`).join('')}
                    </div>
                </td>
                <td>${material.createTime}</td>
                <td>
                    <div class="action-btns">
                        <button class="edit-btn" data-id="${material.id}">编辑</button>
                        <button class="delete-btn" data-id="${material.id}">删除</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // 绑定编辑和删除按钮事件
        bindActionButtons();
    }

    // 绑定操作按钮事件
    function bindActionButtons() {
        const editBtns = document.querySelectorAll('.edit-btn');
        const deleteBtns = document.querySelectorAll('.delete-btn');

        editBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editMaterial(id);
            });
        });

        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteMaterial(id);
            });
        });
    }

    // 查询
    document.getElementById('searchBtn').addEventListener('click', function() {
        const keyword = document.getElementById('searchKeyword').value.trim();
        const type = document.getElementById('materialType').value;
        const container = document.getElementById('containerType').value;

        filteredMaterials = materials.filter(m => {
            let match = true;
            
            if (keyword) {
                match = match && (m.code.includes(keyword) || m.name.includes(keyword));
            }
            
            if (type) {
                match = match && m.type === type;
            }
            
            if (container) {
                match = match && m.containers.some(c => c.type === container);
            }
            
            return match;
        });

        renderTable();
    });

    // 重置
    document.getElementById('resetBtn').addEventListener('click', function() {
        document.getElementById('searchKeyword').value = '';
        document.getElementById('materialType').value = '';
        document.getElementById('containerType').value = '';
        filteredMaterials = [...materials];
        renderTable();
    });

    // 新增物料
    document.getElementById('addBtn').addEventListener('click', function() {
        editingId = null;
        document.getElementById('modalTitle').textContent = '新增物料';
        document.getElementById('materialForm').reset();
        document.getElementById('photoPreview').innerHTML = '';

        resetContainerConfig();
        
        document.getElementById('materialModal').classList.add('active');
    });

    // 容器复选框变化事件
    document.querySelectorAll('input[name="container"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const containerId = this.getAttribute('data-container');
            setContainerEnabled(containerId, this.checked);
        });
    });

    document.querySelectorAll('.ratio-radio').forEach(radio => {
        radio.addEventListener('change', function() {
            const containerId = this.dataset.container;
            updateContainerRatioState(containerId);

            const quantityInput = document.getElementById(getQuantityInputId(containerId, this.dataset.ratioKey));
            if (quantityInput && !quantityInput.disabled) {
                quantityInput.focus();
            }
        });
    });

    // 编辑物料
    function editMaterial(id) {
        editingId = id;
        const material = materials.find(m => m.id === id);
        
        if (!material) return;

        document.getElementById('modalTitle').textContent = '编辑物料';
        document.getElementById('materialCode').value = material.code;
        document.getElementById('materialName').value = material.name;
        document.getElementById('materialTypeInput').value = material.type;

        resetContainerConfig();

        material.containers.forEach(container => {
            const checkbox = document.querySelector(`input[name="container"][value="${container.type}"]`);
            if (checkbox) {
                checkbox.checked = true;
                const containerId = containerMap[container.type];
                const ratio = container.ratio || '1/2';
                const ratioKey = ratioKeyMap[ratio];
                const radio = document.querySelector(`.ratio-radio[data-container="${containerId}"][value="${ratio}"]`);

                setContainerEnabled(containerId, true);

                if (radio) {
                    radio.checked = true;
                    updateContainerRatioState(containerId);

                    const quantityInput = document.getElementById(getQuantityInputId(containerId, ratioKey));
                    if (quantityInput) {
                        quantityInput.value = container.quantity;
                    }
                }
            }
        });

        // 显示照片预览
        if (material.photo) {
            document.getElementById('photoPreview').innerHTML = `<img src="${material.photo}" alt="物料照片">`;
        }

        document.getElementById('materialModal').classList.add('active');
    }

    // 删除物料
    function deleteMaterial(id) {
        const material = materials.find(m => m.id === id);
        
        if (!material) return;

        if (material.hasTransaction) {
            alert('该物料已产生出入库业务，不可删除！');
            return;
        }

        if (confirm(`确定要删除物料"${material.name}"吗？`)) {
            materials = materials.filter(m => m.id !== id);
            filteredMaterials = filteredMaterials.filter(m => m.id !== id);
            renderTable();
            alert('删除成功！');
        }
    }

    // 保存
    document.getElementById('saveBtn').addEventListener('click', function() {
        const code = document.getElementById('materialCode').value.trim();
        const name = document.getElementById('materialName').value.trim();
        const type = document.getElementById('materialTypeInput').value;

        // 获取选中的容器类型和配置
        const checkboxes = document.querySelectorAll('input[name="container"]:checked');
        const containers = [];
        
        for (let checkbox of checkboxes) {
            const containerType = checkbox.value;
            const containerId = containerMap[containerType];
            const selectedRatio = document.querySelector(`.ratio-radio[data-container="${containerId}"]:checked`);

            if (!selectedRatio) {
                alert(`请选择"${containerType}"的存储占比！`);
                return;
            }

            const quantityInput = document.getElementById(
                getQuantityInputId(containerId, selectedRatio.dataset.ratioKey)
            );
            const quantity = parseInt(quantityInput.value);

            if (!quantity || quantity < 1) {
                alert(`请填写"${containerType}"在${selectedRatio.value}下的存储数量！`);
                quantityInput.focus();
                return;
            }
            
            containers.push({
                type: containerType,
                ratio: selectedRatio.value,
                quantity: quantity
            });
        }

        // 验证
        if (!code || !name || !type) {
            alert('请填写所有必填项！');
            return;
        }

        if (containers.length === 0) {
            alert('请至少选择一种适配容器类型！');
            return;
        }

        if (editingId) {
            // 编辑
            const material = materials.find(m => m.id === editingId);
            if (material) {
                material.code = code;
                material.name = name;
                material.type = type;
                material.containers = containers;
            }
            alert('修改成功！');
        } else {
            // 新增
            const newMaterial = {
                id: materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1,
                code,
                name,
                type,
                photo: 'https://via.placeholder.com/60',
                containers,
                createTime: new Date().toLocaleString('zh-CN', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                }).replace(/\//g, '-'),
                hasTransaction: false
            };
            materials.push(newMaterial);
            alert('新增成功！');
        }

        filteredMaterials = [...materials];
        renderTable();
        document.getElementById('materialModal').classList.remove('active');
    });

    // 取消
    document.getElementById('cancelBtn').addEventListener('click', function() {
        document.getElementById('materialModal').classList.remove('active');
    });

    // 关闭弹窗
    document.querySelector('.modal-close').addEventListener('click', function() {
        document.getElementById('materialModal').classList.remove('active');
    });

    // 点击弹窗外部关闭
    document.getElementById('materialModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // 照片预览
    document.getElementById('materialPhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('photoPreview').innerHTML = `<img src="${e.target.result}" alt="物料照片">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // 初始化
    renderTable();
});
