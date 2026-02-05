// 盘点作业页面脚本 - 参考出库作业交互模式

// 模拟当前终端配置
const currentPort = '盘点口 1';

// 模拟盘点计划数据
const inventoryPlan = {
    planNo: 'PD-2024-002',
    scope: '指定库区',
    owner: '李四',
    status: '执行中'
};

// 模拟物料主数据（从物料管理获取）
const masterMaterials = [
    { code: 'WL-2024-001', name: '电子元件A型', image: '📦' },
    { code: 'WL-2024-002', name: '机械零件B型', image: '⚙️' },
    { code: 'WL-2024-003', name: '塑料配件C型', image: '🔧' },
    { code: 'WL-2024-004', name: '橡胶密封圈D型', image: '⭕' },
    { code: 'WL-2024-005', name: '金属材料E型', image: '🔩' }
];

// 模拟容器数据
const containerData = {
    'TP-001': {
        code: 'TP-001',
        type: '标准托盘',
        location: '1-5-12-1',
        materials: [
            {
                code: 'WL-2024-001',
                name: '电子元件A型',
                image: '📦',
                needInventory: true,
                bookQty: 100,
                countQty: 0,
                difference: 0,
                result: ''
            },
            {
                code: 'WL-2024-002',
                name: '机械零件B型',
                image: '⚙️',
                needInventory: true,
                bookQty: 50,
                countQty: 0,
                difference: 0,
                result: ''
            },
            {
                code: 'WL-2024-003',
                name: '塑料配件C型',
                image: '🔧',
                needInventory: false,
                bookQty: 0,
                countQty: 0,
                difference: 0,
                result: ''
            }
        ]
    },
    'TP-002': {
        code: 'TP-002',
        type: '标准托盘',
        location: '1-6-12-1',
        materials: [
            {
                code: 'WL-2024-001',
                name: '电子元件A型',
                image: '📦',
                needInventory: true,
                bookQty: 80,
                countQty: 0,
                difference: 0,
                result: ''
            },
            {
                code: 'WL-2024-004',
                name: '橡胶密封圈D型',
                image: '⭕',
                needInventory: true,
                bookQty: 60,
                countQty: 0,
                difference: 0,
                result: ''
            }
        ]
    }
};

// 是否正在添加物料
let isAddingMaterial = false;

// 模拟可用库位
const availableLocations = [
    { code: '1-5-12-1', area: '库区A', status: '空库位' },
    { code: '1-6-12-1', area: '库区A', status: '空库位' },
    { code: '1-7-12-1', area: '库区A', status: '空库位' },
    { code: '2-5-12-1', area: '库区B', status: '空库位' },
    { code: '2-6-12-1', area: '库区B', status: '空库位' }
];

// 当前操作的容器
let currentContainer = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    initEventListeners();
});

// 初始化页面
function initPage() {
    // 设置盘点口标识
    document.getElementById('portBadge').textContent = currentPort;
    
    // 显示盘点计划信息
    document.getElementById('planNo').textContent = inventoryPlan.planNo;
    document.getElementById('planScope').textContent = inventoryPlan.scope;
    document.getElementById('planOwner').textContent = inventoryPlan.owner;
}

// 初始化事件监听
function initEventListeners() {
    // 扫描容器按钮
    document.getElementById('scanContainerBtn').addEventListener('click', scanContainer);
    
    // 扫描容器编码 - 支持回车键
    document.getElementById('scanContainerCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            scanContainer();
        }
    });
    
    // 扫描物料按钮
    document.getElementById('scanMaterialBtn').addEventListener('click', scanMaterial);
    
    // 扫描物料编码 - 支持回车键
    document.getElementById('scanMaterialCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            scanMaterial();
        }
    });
    
    // 扫码容器按钮（重新扫描）
    document.getElementById('scanNewContainerBtn').addEventListener('click', function() {
        if (confirm('确定要重新扫描容器吗？当前容器的盘点进度将不会保存。')) {
            // 返回扫描容器状态
            currentContainer = null;
            document.getElementById('currentInventorySection').style.display = 'none';
            document.getElementById('scanContainerSection').style.display = 'block';
            document.getElementById('scanContainerCode').value = '';
            document.getElementById('scanContainerCode').focus();
        }
    });
    
    // 添加物料按钮
    document.getElementById('addMaterialBtn').addEventListener('click', addMaterial);
    
    // 完成盘点按钮
    document.getElementById('completeInventoryBtn').addEventListener('click', completeInventory);
    
    // 取消按钮
    document.getElementById('cancelBtn').addEventListener('click', function() {
        if (confirm('确定要取消当前盘点操作吗？')) {
            // 返回扫描容器状态
            currentContainer = null;
            document.getElementById('currentInventorySection').style.display = 'none';
            document.getElementById('scanContainerSection').style.display = 'block';
            document.getElementById('scanContainerCode').value = '';
            document.getElementById('scanContainerCode').focus();
        }
    });
    
    // 确认入库库位弹窗
    document.getElementById('locationModalClose').addEventListener('click', closeLocationModal);
    document.getElementById('cancelLocationBtn').addEventListener('click', closeLocationModal);
    document.getElementById('confirmLocationBtn').addEventListener('click', confirmLocation);
    
    // 点击弹窗外部关闭
    document.getElementById('confirmLocationModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLocationModal();
        }
    });
}

// 扫描容器
function scanContainer() {
    const containerCode = document.getElementById('scanContainerCode').value.trim();
    
    if (!containerCode) {
        alert('请输入容器编码！');
        return;
    }
    
    // 查找容器
    const container = containerData[containerCode];
    
    if (!container) {
        alert('容器编码不存在或未到达盘点口！');
        document.getElementById('scanContainerCode').value = '';
        return;
    }
    
    // 设置当前容器（深拷贝）
    currentContainer = JSON.parse(JSON.stringify(container));
    
    // 隐藏扫描区域，显示盘点信息区域
    document.getElementById('scanContainerSection').style.display = 'none';
    document.getElementById('currentInventorySection').style.display = 'block';
    
    // 显示盘点计划信息
    document.getElementById('currentPlanNo').textContent = inventoryPlan.planNo;
    document.getElementById('currentPlanScope').textContent = inventoryPlan.scope;
    document.getElementById('currentPlanOwner').textContent = inventoryPlan.owner;
    
    // 显示容器信息
    displayContainerInfo();
    
    // 渲染物料明细
    renderMaterialTable();
    
    // 聚焦到物料扫描框
    document.getElementById('scanMaterialCode').focus();
}

// 显示容器信息
function displayContainerInfo() {
    document.getElementById('currentContainerCode').textContent = currentContainer.code;
    document.getElementById('currentContainerType').textContent = currentContainer.type;
    document.getElementById('currentContainerLocation').textContent = currentContainer.location;
}

// 渲染物料明细表格
function renderMaterialTable() {
    const tbody = document.getElementById('materialTableBody');
    
    if (!currentContainer) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8" style="text-align: center; color: #999;">请先扫描容器</td></tr>';
        return;
    }
    
    let html = '';
    
    // 渲染现有物料
    if (currentContainer.materials && currentContainer.materials.length > 0) {
        currentContainer.materials.forEach((material, index) => {
            const rowClass = material.needInventory ? 'need-inventory' : 'no-inventory';
            const badgeClass = material.needInventory ? 'need' : 'no-need';
            const badgeText = material.needInventory ? '需要盘点' : '不需要盘点';
            
            html += `<tr class="${rowClass}">`;
            html += `<td>${material.code}</td>`;
            html += `<td>${material.name}</td>`;
            html += `<td style="text-align: center; font-size: 24px;">${material.image}</td>`;
            html += `<td><span class="inventory-badge ${badgeClass}">${badgeText}</span></td>`;
            
            // 账面数量
            if (material.needInventory) {
                html += `<td>${material.bookQty}</td>`;
            } else {
                html += `<td style="color: #d9d9d9;">-</td>`;
            }
            
            // 盘点数量
            if (material.needInventory) {
                html += `
                    <td>
                        <input type="number" 
                            class="editable-qty" 
                            value="${material.countQty}" 
                            min="0"
                            data-index="${index}"
                            onchange="updateCountQty(${index}, this.value)"
                            placeholder="扫码或输入">
                    </td>
                `;
            } else {
                html += `<td style="color: #d9d9d9;">-</td>`;
            }
            
            // 盘点差异
            if (material.needInventory) {
                const diffClass = material.difference > 0 ? 'style="color: #52c41a; font-weight: 600;"' : 
                                 material.difference < 0 ? 'style="color: #ff4d4f; font-weight: 600;"' : '';
                const diffText = material.difference > 0 ? `+${material.difference}` : material.difference;
                html += `<td ${diffClass} id="diff-${index}">${diffText}</td>`;
            } else {
                html += `<td style="color: #d9d9d9;">-</td>`;
            }
            
            // 盘点结果
            if (material.needInventory && material.result) {
                const resultBadgeClass = material.result === '盘盈' ? 'surplus' : 
                                        material.result === '盘亏' ? 'loss' : 'normal';
                html += `<td><span class="result-badge ${resultBadgeClass}" id="result-${index}">${material.result}</span></td>`;
            } else if (material.needInventory) {
                html += `<td id="result-${index}" style="color: #d9d9d9;">-</td>`;
            } else {
                html += `<td style="color: #d9d9d9;">-</td>`;
            }
            
            html += `</tr>`;
        });
    }
    
    // 如果正在添加物料，显示添加行
    if (isAddingMaterial) {
        html += `
            <tr class="add-material-row">
                <td>
                    <input type="text" 
                        class="add-material-input" 
                        id="addMaterialCode" 
                        placeholder="物料编码"
                        onblur="handleMaterialCodeBlur(this.value)"
                        onkeypress="handleMaterialCodeKeypress(event)">
                </td>
                <td>
                    <input type="text" 
                        class="add-material-input" 
                        id="addMaterialName" 
                        placeholder="物料名称"
                        onblur="handleMaterialNameBlur(this.value)"
                        onkeypress="handleMaterialNameKeypress(event)">
                </td>
                <td style="text-align: center; font-size: 24px;" id="addMaterialImage">📦</td>
                <td><span class="inventory-badge need">需要盘点</span></td>
                <td>0</td>
                <td>
                    <input type="number" 
                        class="editable-qty" 
                        id="addMaterialQty" 
                        value="0" 
                        min="0"
                        placeholder="盘点数量">
                </td>
                <td id="addMaterialDiff" style="color: #d9d9d9;">-</td>
                <td>
                    <div class="add-material-actions">
                        <button class="action-btn-small primary" onclick="confirmAddMaterial()" title="确认添加">✓</button>
                        <button class="action-btn-small secondary" onclick="cancelAddMaterial()" title="取消">✕</button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    // 如果没有物料且不在添加状态
    if ((!currentContainer.materials || currentContainer.materials.length === 0) && !isAddingMaterial) {
        html = '<tr class="empty-row"><td colspan="8" style="text-align: center; color: #999;">该容器无物料，点击"添加物料"按钮添加</td></tr>';
    }
    
    tbody.innerHTML = html;
    
    // 如果正在添加物料，聚焦到物料编码输入框
    if (isAddingMaterial) {
        setTimeout(() => {
            const codeInput = document.getElementById('addMaterialCode');
            if (codeInput) {
                codeInput.focus();
            }
        }, 100);
    }
}

// 扫描物料
function scanMaterial() {
    const materialCode = document.getElementById('scanMaterialCode').value.trim();
    
    if (!materialCode) {
        alert('请输入物料编码！');
        return;
    }
    
    if (!currentContainer) {
        alert('请先扫描容器编码！');
        return;
    }
    
    // 查找物料
    const materialIndex = currentContainer.materials.findIndex(m => m.code === materialCode);
    
    if (materialIndex === -1) {
        alert('该物料不在当前容器中！');
        document.getElementById('scanMaterialCode').value = '';
        return;
    }
    
    const material = currentContainer.materials[materialIndex];
    
    // 检查是否需要盘点
    if (!material.needInventory) {
        alert('该物料无需盘点！');
        document.getElementById('scanMaterialCode').value = '';
        return;
    }
    
    // 自动填充盘点数量为账面数量
    material.countQty = material.bookQty;
    material.difference = 0;
    material.result = '正常';
    
    // 高亮显示该物料行
    highlightMaterialRow(materialIndex);
    
    // 重新渲染表格
    renderMaterialTable();
    
    // 清空扫描框
    document.getElementById('scanMaterialCode').value = '';
    
    alert(`物料 ${material.name} 已扫描！\n盘点数量已自动填充为账面数量：${material.bookQty}\n如需修改，请直接在表格中编辑`);
}

// 高亮显示物料行
function highlightMaterialRow(materialIndex) {
    const rows = document.querySelectorAll('#materialTableBody tr');
    rows.forEach((row, index) => {
        if (index === materialIndex) {
            row.classList.add('highlight');
            setTimeout(() => {
                row.classList.remove('highlight');
            }, 2000);
        }
    });
}

// 更新盘点数量
function updateCountQty(index, value) {
    const material = currentContainer.materials[index];
    const countQty = parseInt(value) || 0;
    
    if (countQty < 0) {
        alert('盘点数量不能小于0！');
        renderMaterialTable();
        return;
    }
    
    material.countQty = countQty;
    material.difference = countQty - material.bookQty;
    
    // 判断盘点结果
    if (material.difference > 0) {
        material.result = '盘盈';
    } else if (material.difference < 0) {
        material.result = '盘亏';
    } else {
        material.result = '正常';
    }
    
    // 更新显示
    const diffElement = document.getElementById(`diff-${index}`);
    const resultElement = document.getElementById(`result-${index}`);
    
    if (diffElement) {
        const diffText = material.difference > 0 ? `+${material.difference}` : material.difference;
        diffElement.textContent = diffText;
        
        if (material.difference > 0) {
            diffElement.style.color = '#52c41a';
            diffElement.style.fontWeight = '600';
        } else if (material.difference < 0) {
            diffElement.style.color = '#ff4d4f';
            diffElement.style.fontWeight = '600';
        } else {
            diffElement.style.color = '#666';
            diffElement.style.fontWeight = 'normal';
        }
    }
    
    if (resultElement) {
        const resultBadgeClass = material.result === '盘盈' ? 'surplus' : 
                                material.result === '盘亏' ? 'loss' : 'normal';
        resultElement.innerHTML = `<span class="result-badge ${resultBadgeClass}">${material.result}</span>`;
    }
}

// 添加物料
function addMaterial() {
    if (!currentContainer) {
        alert('请先扫描容器编码！');
        return;
    }
    
    if (isAddingMaterial) {
        alert('请先完成当前物料的添加！');
        return;
    }
    
    // 设置添加状态
    isAddingMaterial = true;
    
    // 重新渲染表格，显示添加行
    renderMaterialTable();
}

// 处理物料编码输入失焦
function handleMaterialCodeBlur(code) {
    if (!code || code.trim() === '') return;
    
    code = code.trim();
    
    // 检查是否已存在
    const exists = currentContainer.materials.some(m => m.code === code);
    if (exists) {
        alert('该物料已存在于容器中！');
        document.getElementById('addMaterialCode').value = '';
        document.getElementById('addMaterialCode').focus();
        return;
    }
    
    // 从物料主数据中查找
    const masterMaterial = masterMaterials.find(m => m.code === code);
    
    if (!masterMaterial) {
        alert('物料编码不存在！请检查物料管理中是否有该物料。');
        document.getElementById('addMaterialCode').value = '';
        document.getElementById('addMaterialCode').focus();
        return;
    }
    
    // 自动填充物料名称和图片
    document.getElementById('addMaterialName').value = masterMaterial.name;
    document.getElementById('addMaterialImage').textContent = masterMaterial.image;
    
    // 聚焦到盘点数量输入框
    document.getElementById('addMaterialQty').focus();
}

// 处理物料名称输入失焦
function handleMaterialNameBlur(name) {
    if (!name || name.trim() === '') return;
    
    name = name.trim();
    
    // 检查物料编码是否已填写
    const codeInput = document.getElementById('addMaterialCode');
    if (codeInput.value.trim() !== '') {
        // 如果编码已填写，不处理名称
        return;
    }
    
    // 从物料主数据中查找
    const masterMaterial = masterMaterials.find(m => m.name === name);
    
    if (!masterMaterial) {
        alert('物料名称不存在！请检查物料管理中是否有该物料。');
        document.getElementById('addMaterialName').value = '';
        document.getElementById('addMaterialName').focus();
        return;
    }
    
    // 检查是否已存在
    const exists = currentContainer.materials.some(m => m.code === masterMaterial.code);
    if (exists) {
        alert('该物料已存在于容器中！');
        document.getElementById('addMaterialName').value = '';
        document.getElementById('addMaterialName').focus();
        return;
    }
    
    // 自动填充物料编码和图片
    document.getElementById('addMaterialCode').value = masterMaterial.code;
    document.getElementById('addMaterialImage').textContent = masterMaterial.image;
    
    // 聚焦到盘点数量输入框
    document.getElementById('addMaterialQty').focus();
}

// 处理物料编码回车键
function handleMaterialCodeKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const code = event.target.value.trim();
        if (code) {
            handleMaterialCodeBlur(code);
        }
    }
}

// 处理物料名称回车键
function handleMaterialNameKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const name = event.target.value.trim();
        if (name) {
            handleMaterialNameBlur(name);
        }
    }
}

// 确认添加物料
function confirmAddMaterial() {
    const code = document.getElementById('addMaterialCode').value.trim();
    const name = document.getElementById('addMaterialName').value.trim();
    const qty = parseInt(document.getElementById('addMaterialQty').value) || 0;
    
    // 验证
    if (!code) {
        alert('请输入物料编码！');
        document.getElementById('addMaterialCode').focus();
        return;
    }
    
    if (!name) {
        alert('请输入物料名称！');
        document.getElementById('addMaterialName').focus();
        return;
    }
    
    if (qty < 0) {
        alert('盘点数量不能小于0！');
        document.getElementById('addMaterialQty').focus();
        return;
    }
    
    // 验证物料是否在主数据中
    const masterMaterial = masterMaterials.find(m => m.code === code && m.name === name);
    if (!masterMaterial) {
        alert('物料编码和名称不匹配！请检查输入。');
        return;
    }
    
    // 检查是否已存在
    const exists = currentContainer.materials.some(m => m.code === code);
    if (exists) {
        alert('该物料已存在于容器中！');
        return;
    }
    
    // 添加新物料
    const newMaterial = {
        code: code,
        name: name,
        image: document.getElementById('addMaterialImage').textContent,
        needInventory: true,
        bookQty: 0,
        countQty: qty,
        difference: qty - 0,
        result: qty > 0 ? '盘盈' : '正常'
    };
    
    currentContainer.materials.push(newMaterial);
    
    // 取消添加状态
    isAddingMaterial = false;
    
    // 重新渲染
    renderMaterialTable();
    
    alert(`物料 ${name} 已添加！\n账面数量：0\n盘点数量：${qty}\n盘点结果：${newMaterial.result}`);
}

// 取消添加物料
function cancelAddMaterial() {
    isAddingMaterial = false;
    renderMaterialTable();
}

// 完成盘点
function completeInventory() {
    if (!currentContainer) {
        alert('请先扫描容器！');
        return;
    }
    
    // 检查是否所有需要盘点的物料都已填写盘点数量
    const needInventoryMaterials = currentContainer.materials.filter(m => m.needInventory);
    const unfinished = needInventoryMaterials.filter(m => m.countQty === 0 && m.bookQty !== 0);
    
    if (unfinished.length > 0) {
        const confirm = window.confirm(
            `还有 ${unfinished.length} 个物料未填写盘点数量，确定完成盘点吗？\n\n未填写的物料将按盘点数量为0处理。`
        );
        if (!confirm) return;
    }
    
    // 显示库位确认弹窗
    showLocationModal();
}

// 显示库位确认弹窗
function showLocationModal() {
    // 显示容器信息
    document.getElementById('modalContainerCode').textContent = currentContainer.code;
    document.getElementById('modalContainerType').textContent = currentContainer.type;
    
    // 填充库位选项
    const locationSelect = document.getElementById('modalLocationSelect');
    locationSelect.innerHTML = '<option value="">请选择库位</option>' + 
        availableLocations.map(loc => 
            `<option value="${loc.code}">${loc.code} (${loc.area})</option>`
        ).join('');
    
    // 自动选择推荐库位（原库位）
    if (currentContainer.location) {
        locationSelect.value = currentContainer.location;
    } else if (availableLocations.length > 0) {
        locationSelect.value = availableLocations[0].code;
    }
    
    // 显示弹窗
    document.getElementById('confirmLocationModal').classList.add('active');
}

// 关闭库位确认弹窗
function closeLocationModal() {
    document.getElementById('confirmLocationModal').classList.remove('active');
}

// 确认入库
function confirmLocation() {
    const location = document.getElementById('modalLocationSelect').value;
    
    if (!location) {
        alert('请选择入库库位！');
        return;
    }
    
    if (!currentContainer) {
        alert('没有当前容器信息！');
        return;
    }
    
    // 生成盘点入库任务
    const taskNo = `PDRK-${Date.now()}`;
    
    // 统计盘点结果
    const inventoryResults = currentContainer.materials
        .filter(m => m.needInventory && m.result)
        .map(m => `${m.name}: ${m.result} (差异: ${m.difference > 0 ? '+' : ''}${m.difference})`)
        .join('\n');
    
    alert(`盘点入库任务已生成！\n\n任务号：${taskNo}\n容器：${currentContainer.code}\n入库库位：${location}\n\n盘点结果：\n${inventoryResults || '无差异'}\n\n容器将被送至指定库位`);
    
    // 关闭弹窗
    closeLocationModal();
    
    // 重置页面，返回扫描容器状态
    currentContainer = null;
    document.getElementById('currentInventorySection').style.display = 'none';
    document.getElementById('scanContainerSection').style.display = 'block';
    document.getElementById('scanContainerCode').value = '';
    document.getElementById('scanContainerCode').focus();
}
