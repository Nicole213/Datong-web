// 角色管理页面脚本

// 系统菜单结构
const systemMenus = [
    {
        id: 'home',
        name: '首页',
        icon: '🏠',
        isSingle: true,
        permissions: ['查看']
    },
    {
        id: 'map',
        name: '库位地图',
        icon: '🗺️',
        isSingle: true,
        permissions: ['查看']
    },
    {
        id: 'warehouse',
        name: '仓库管理',
        icon: '🏢',
        children: [
            { id: 'area', name: '库区管理', permissions: ['查看', '新增', '编辑', '删除'] },
            { id: 'location', name: '库位管理', permissions: ['查看', '新增', '编辑', '删除'] },
            { id: 'port', name: '库口管理', permissions: ['查看', '新增', '编辑', '删除'] },
            { id: 'station', name: '库台管理', permissions: ['查看', '新增', '编辑', '删除'] },
            { id: 'aisle', name: '巷道管理', permissions: ['查看', '新增', '编辑', '删除'] }
        ]
    },
    {
        id: 'inbound',
        name: '入库管理',
        icon: '📥',
        children: [
            { id: 'inbound-order', name: '入库单', permissions: ['查看', '新增', '编辑', '删除', '审核'] },
            { id: 'inbound-operation', name: '入库作业', permissions: ['查看', '执行作业', '完成作业'] }
        ]
    },
    {
        id: 'outbound',
        name: '出库管理',
        icon: '📤',
        children: [
            { id: 'outbound-order', name: '出库单', permissions: ['查看', '新增', '编辑', '删除', '审核'] },
            { id: 'outbound-operation', name: '出库作业', permissions: ['查看', '执行作业', '完成作业'] }
        ]
    },
    {
        id: 'inventory',
        name: '盘点管理',
        icon: '📊',
        children: [
            { id: 'inventory-plan', name: '盘点计划', permissions: ['查看', '新增', '编辑', '删除', '执行'] },
            { id: 'inventory-operation', name: '盘点作业', permissions: ['查看', '执行作业', '完成作业'] }
        ]
    },
    {
        id: 'stock',
        name: '库存管理',
        icon: '📦',
        children: [
            { id: 'stock-detail', name: '库存明细', permissions: ['查看', '锁定', '解锁', '清空', '导出'] }
        ]
    },
    {
        id: 'task',
        name: '任务管理',
        icon: '📋',
        children: [
            { id: 'task-list', name: '任务列表', permissions: ['查看', '加急', '强制完成', '取消', '导出'] }
        ]
    },
    {
        id: 'strategy',
        name: '策略配置',
        icon: '⚙️',
        children: [
            { id: 'inbound-strategy', name: '入库策略', permissions: ['查看', '新增', '编辑', '删除'] },
            { id: 'outbound-strategy', name: '出库策略', permissions: ['查看', '新增', '编辑', '删除'] }
        ]
    },
    {
        id: 'system',
        name: '系统管理',
        icon: '🔧',
        children: [
            { id: 'user', name: '用户管理', permissions: ['查看', '新增', '编辑', '禁用', '启用', '重置密码'] },
            { id: 'role', name: '角色管理', permissions: ['查看', '新增', '编辑', '删除', '权限配置'] }
        ]
    },
    {
        id: 'basic',
        name: '基础数据',
        icon: '📋',
        children: [
            { id: 'material', name: '物料管理', permissions: ['查看', '新增', '编辑', '删除'] },
            { id: 'container', name: '容器管理', permissions: ['查看', '新增', '编辑', '删除'] }
        ]
    }
];

// 角色权限数据（存储每个角色的权限配置）
let rolePermissionsData = {};

let currentConfigRoleId = null;
let currentSelectedMenu = null;

// 模拟角色数据
let roleData = [
    {
        id: 1,
        name: '系统管理员',
        code: 'ROLE-001',
        createTime: '2024-01-01 10:00:00',
        remark: '拥有系统所有权限，可管理用户、角色、配置等'
    },
    {
        id: 2,
        name: '仓库管理员',
        code: 'ROLE-002',
        createTime: '2024-01-01 10:05:00',
        remark: '负责仓库日常管理，包括入库、出库、盘点等业务操作'
    },
    {
        id: 3,
        name: '操作员',
        code: 'ROLE-003',
        createTime: '2024-01-01 10:10:00',
        remark: '执行具体的入库、出库、盘点作业任务'
    },
    {
        id: 4,
        name: '查看员',
        code: 'ROLE-004',
        createTime: '2024-01-01 10:15:00',
        remark: '只能查看库存、任务、单据等信息，无操作权限'
    }
];

// 模拟用户数据（从用户管理模块获取）
const userData = [
    { id: 1, username: '张三', roles: ['系统管理员'] },
    { id: 2, username: '李四', roles: ['仓库管理员'] },
    { id: 3, username: '王五', roles: ['操作员', '查看员'] },
    { id: 4, username: '赵六', roles: ['操作员'] },
    { id: 5, username: '钱七', roles: ['查看员'] }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...roleData];
let editingRoleId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('roleTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(role => {
        // 获取绑定该角色的用户
        const boundUsers = userData.filter(user => user.roles.includes(role.name));
        const userNames = boundUsers.length > 0 
            ? boundUsers.map(u => u.username).join('、') 
            : '-';
        
        return `
        <tr>
            <td>${role.name}</td>
            <td>${role.code}</td>
            <td>${userNames}</td>
            <td>${role.createTime}</td>
            <td>${role.remark || '-'}</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editRole(${role.id})">编辑</button>
                    <button class="delete-btn" onclick="deleteRole(${role.id})">删除</button>
                    <button class="permission-btn" onclick="configPermission(${role.id})">权限配置</button>
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
    document.getElementById('searchBtn').addEventListener('click', searchRoles);
    
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
    document.getElementById('saveBtn').addEventListener('click', saveRole);
    
    // 权限配置弹窗关闭
    document.getElementById('permissionConfigClose').addEventListener('click', closePermissionConfigModal);
    document.getElementById('cancelPermissionBtn').addEventListener('click', closePermissionConfigModal);
    document.getElementById('savePermissionBtn').addEventListener('click', savePermissionConfig);
    
    // 点击弹窗外部关闭
    document.getElementById('roleModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    document.getElementById('permissionConfigModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePermissionConfigModal();
        }
    });
}

// 查询角色
function searchRoles() {
    const roleName = document.getElementById('searchRoleName').value.trim().toLowerCase();
    
    filteredData = roleData.filter(role => {
        const matchName = !roleName || role.name.toLowerCase().includes(roleName);
        return matchName;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchRoleName').value = '';
    
    filteredData = [...roleData];
    currentPage = 1;
    renderTable();
}

// 打开新增弹窗
function openAddModal() {
    editingRoleId = null;
    document.getElementById('modalTitle').textContent = '新增角色';
    
    // 清空表单
    document.getElementById('roleName').value = '';
    document.getElementById('remark').value = '';
    
    document.getElementById('roleModal').classList.add('active');
}

// 保存角色
function saveRole() {
    const name = document.getElementById('roleName').value.trim();
    const remark = document.getElementById('remark').value.trim();
    
    // 验证
    if (!name) {
        alert('请输入角色名称！');
        return;
    }
    
    const now = getCurrentTime();
    
    if (editingRoleId) {
        // 编辑
        const role = roleData.find(r => r.id === editingRoleId);
        if (role) {
            // 检查角色名称是否与其他角色重复
            if (roleData.some(r => r.id !== editingRoleId && r.name === name)) {
                alert('该角色名称已存在，请使用其他名称！');
                return;
            }
            
            const oldName = role.name;
            role.name = name;
            role.remark = remark;
            
            // 更新用户数据中的角色名称
            userData.forEach(user => {
                const index = user.roles.indexOf(oldName);
                if (index > -1) {
                    user.roles[index] = name;
                }
            });
            
            alert('角色信息更新成功！');
        }
    } else {
        // 新增 - 检查角色名称是否已存在
        if (roleData.some(r => r.name === name)) {
            alert('该角色名称已存在，请使用其他名称！');
            return;
        }
        
        // 生成角色编码
        const maxId = roleData.length > 0 ? Math.max(...roleData.map(r => r.id)) : 0;
        const code = 'ROLE-' + String(maxId + 1).padStart(3, '0');
        
        const newRole = {
            id: maxId + 1,
            name: name,
            code: code,
            createTime: now,
            remark: remark
        };
        
        roleData.push(newRole);
        alert('角色添加成功！');
    }
    
    closeModal();
    resetSearch();
}

// 编辑角色
function editRole(id) {
    const role = roleData.find(r => r.id === id);
    if (!role) return;
    
    editingRoleId = id;
    document.getElementById('modalTitle').textContent = '编辑角色';
    
    // 填充表单
    document.getElementById('roleName').value = role.name;
    document.getElementById('remark').value = role.remark || '';
    
    document.getElementById('roleModal').classList.add('active');
}

// 删除角色
function deleteRole(id) {
    const role = roleData.find(r => r.id === id);
    if (!role) return;
    
    // 检查是否有用户绑定该角色
    const boundUsers = userData.filter(user => user.roles.includes(role.name));
    
    let confirmMsg = `确定要删除角色"${role.name}"吗？\n\n`;
    if (boundUsers.length > 0) {
        confirmMsg += `该角色当前绑定了 ${boundUsers.length} 个用户：${boundUsers.map(u => u.username).join('、')}\n\n`;
        confirmMsg += '删除后，这些用户将失去该角色对应的权限。';
    } else {
        confirmMsg += '删除后将无法恢复。';
    }
    
    if (confirm(confirmMsg)) {
        // 从用户数据中移除该角色
        userData.forEach(user => {
            const index = user.roles.indexOf(role.name);
            if (index > -1) {
                user.roles.splice(index, 1);
            }
        });
        
        // 删除角色
        const index = roleData.findIndex(r => r.id === id);
        if (index > -1) {
            roleData.splice(index, 1);
            alert('角色删除成功！');
            resetSearch();
        }
    }
}

// 关闭弹窗
function closeModal() {
    document.getElementById('roleModal').classList.remove('active');
    editingRoleId = null;
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


// 权限配置
function configPermission(id) {
    const role = roleData.find(r => r.id === id);
    if (!role) return;
    
    currentConfigRoleId = id;
    currentSelectedMenu = null;
    
    document.getElementById('configRoleName').textContent = role.name;
    
    // 初始化角色权限数据
    if (!rolePermissionsData[id]) {
        rolePermissionsData[id] = {};
    }
    
    // 渲染菜单树
    renderMenuTree();
    
    // 默认选中并显示首页配置
    setTimeout(() => {
        const homeMenuItem = document.querySelector('.menu-single-item');
        if (homeMenuItem) {
            homeMenuItem.classList.add('active');
            currentSelectedMenu = { groupId: 'home', menuId: 'home' };
            renderSingleMenuPermissionConfig('home');
        }
    }, 0);
    
    document.getElementById('permissionConfigModal').classList.add('active');
}

// 获取权限数量状态类名
function getPermissionCountClass(configuredCount, totalCount) {
    if (configuredCount === 0) {
        return 'none'; // 未配置 - 灰色
    } else if (configuredCount === totalCount) {
        return 'full'; // 全部配置 - 绿色
    } else {
        return 'partial'; // 部分配置 - 蓝色
    }
}

// 渲染菜单树
function renderMenuTree() {
    const menuTree = document.getElementById('menuTree');
    const rolePermissions = rolePermissionsData[currentConfigRoleId] || {};
    
    menuTree.innerHTML = systemMenus.map(menu => {
        // 如果是单层菜单，直接显示为可点击项
        if (menu.isSingle) {
            const configuredCount = (rolePermissions[menu.id] || []).length;
            const totalCount = menu.permissions.length;
            const statusClass = getPermissionCountClass(configuredCount, totalCount);
            
            return `
                <div class="menu-single-item" onclick="selectSingleMenu('${menu.id}')">
                    <span class="menu-item-name">${menu.icon} ${menu.name}</span>
                    <span class="permission-count ${statusClass}">${configuredCount}/${totalCount}</span>
                </div>
            `;
        }
        
        // 多层菜单，显示为可展开的组
        return `
            <div class="menu-group-item" id="menu-group-${menu.id}">
                <div class="menu-group-header" onclick="toggleMenuGroup('${menu.id}')">
                    <span class="menu-group-arrow">▼</span>
                    <span>${menu.icon} ${menu.name}</span>
                </div>
                <div class="menu-sub-items">
                    ${menu.children.map(sub => {
                        const configuredCount = (rolePermissions[sub.id] || []).length;
                        const totalCount = sub.permissions.length;
                        const statusClass = getPermissionCountClass(configuredCount, totalCount);
                        
                        return `
                            <div class="menu-sub-item" onclick="selectMenu('${menu.id}', '${sub.id}')">
                                <span class="menu-item-name">${sub.name}</span>
                                <span class="permission-count ${statusClass}">${configuredCount}/${totalCount}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// 选择单层菜单
function selectSingleMenu(menuId) {
    // 移除所有active状态
    document.querySelectorAll('.menu-sub-item, .menu-single-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加active状态 - 找到对应的菜单项元素
    const menuItem = event.currentTarget || event.target.closest('.menu-single-item');
    if (menuItem) {
        menuItem.classList.add('active');
    }
    
    currentSelectedMenu = { groupId: menuId, menuId: menuId };
    
    // 渲染权限配置
    renderSingleMenuPermissionConfig(menuId);
}

// 渲染单层菜单的权限配置
function renderSingleMenuPermissionConfig(menuId) {
    const menu = systemMenus.find(m => m.id === menuId);
    if (!menu || !menu.isSingle) return;
    
    const rolePermissions = rolePermissionsData[currentConfigRoleId] || {};
    const menuPermissions = rolePermissions[menuId] || [];
    
    const configArea = document.getElementById('permissionConfigArea');
    configArea.innerHTML = `
        <div class="permission-module-title">${menu.name}</div>
        <div class="permission-options">
            ${menu.permissions.map(perm => {
                const isChecked = menuPermissions.includes(perm);
                const permDesc = getPermissionDescription(perm);
                return `
                    <div class="permission-option">
                        <input type="checkbox" 
                               id="perm-${menuId}-${perm}" 
                               value="${perm}"
                               ${isChecked ? 'checked' : ''}
                               onchange="updatePermission('${menuId}', '${perm}', this.checked)">
                        <label class="permission-option-label" for="perm-${menuId}-${perm}">
                            <span class="permission-option-name">${perm}</span>
                            <span class="permission-option-desc">${permDesc}</span>
                        </label>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 切换菜单组展开/收起
function toggleMenuGroup(groupId) {
    const groupElement = document.getElementById(`menu-group-${groupId}`);
    groupElement.classList.toggle('collapsed');
}

// 选择菜单
function selectMenu(groupId, menuId) {
    // 移除所有active状态
    document.querySelectorAll('.menu-sub-item, .menu-single-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加active状态 - 找到对应的菜单项元素
    const menuItem = event.currentTarget || event.target.closest('.menu-sub-item');
    if (menuItem) {
        menuItem.classList.add('active');
    }
    
    currentSelectedMenu = { groupId, menuId };
    
    // 渲染权限配置
    renderPermissionConfig(groupId, menuId);
}

// 渲染权限配置
function renderPermissionConfig(groupId, menuId) {
    const menu = systemMenus.find(m => m.id === groupId);
    if (!menu) return;
    
    const subMenu = menu.children.find(s => s.id === menuId);
    if (!subMenu) return;
    
    const rolePermissions = rolePermissionsData[currentConfigRoleId] || {};
    const menuPermissions = rolePermissions[menuId] || [];
    
    const configArea = document.getElementById('permissionConfigArea');
    configArea.innerHTML = `
        <div class="permission-module-title">${subMenu.name}</div>
        <div class="permission-options">
            ${subMenu.permissions.map(perm => {
                const isChecked = menuPermissions.includes(perm);
                const permDesc = getPermissionDescription(perm);
                return `
                    <div class="permission-option">
                        <input type="checkbox" 
                               id="perm-${menuId}-${perm}" 
                               value="${perm}"
                               ${isChecked ? 'checked' : ''}
                               onchange="updatePermission('${menuId}', '${perm}', this.checked)">
                        <label class="permission-option-label" for="perm-${menuId}-${perm}">
                            <span class="permission-option-name">${perm}</span>
                            <span class="permission-option-desc">${permDesc}</span>
                        </label>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 获取权限描述
function getPermissionDescription(permission) {
    const descriptions = {
        '查看': '可以查看该模块的数据列表和详情',
        '新增': '可以创建新的数据记录',
        '编辑': '可以修改已有的数据记录',
        '删除': '可以删除数据记录',
        '审核': '可以审核单据',
        '执行作业': '可以执行作业任务',
        '完成作业': '可以完成作业任务',
        '锁定': '可以锁定库存',
        '解锁': '可以解锁库存',
        '清空': '可以清空库存',
        '导出': '可以导出数据',
        '加急': '可以将任务设置为加急',
        '强制完成': '可以强制完成任务',
        '取消': '可以取消任务',
        '禁用': '可以禁用用户',
        '启用': '可以启用用户',
        '重置密码': '可以重置用户密码',
        '权限配置': '可以配置角色权限',
        '执行': '可以执行计划'
    };
    return descriptions[permission] || '该权限的操作权限';
}

// 更新权限
function updatePermission(menuId, permission, checked) {
    if (!rolePermissionsData[currentConfigRoleId]) {
        rolePermissionsData[currentConfigRoleId] = {};
    }
    
    if (!rolePermissionsData[currentConfigRoleId][menuId]) {
        rolePermissionsData[currentConfigRoleId][menuId] = [];
    }
    
    const permissions = rolePermissionsData[currentConfigRoleId][menuId];
    
    if (checked) {
        if (!permissions.includes(permission)) {
            permissions.push(permission);
        }
    } else {
        const index = permissions.indexOf(permission);
        if (index > -1) {
            permissions.splice(index, 1);
        }
    }
    
    // 更新菜单树中的权限数量显示
    updateMenuPermissionCount(menuId);
}

// 更新菜单权限数量显示
function updateMenuPermissionCount(menuId) {
    const rolePermissions = rolePermissionsData[currentConfigRoleId] || {};
    const configuredCount = (rolePermissions[menuId] || []).length;
    
    // 查找对应的菜单项并更新
    const menuItems = document.querySelectorAll('.menu-single-item, .menu-sub-item');
    menuItems.forEach(item => {
        const countSpan = item.querySelector('.permission-count');
        if (countSpan) {
            // 检查是否是当前要更新的菜单项
            const itemText = item.querySelector('.menu-item-name')?.textContent || '';
            
            // 查找对应的菜单配置
            let matchedMenu = null;
            
            // 检查单层菜单
            for (const menu of systemMenus) {
                if (menu.isSingle && menu.id === menuId) {
                    if (itemText.includes(menu.name)) {
                        matchedMenu = menu;
                        break;
                    }
                }
                // 检查多层菜单的子项
                if (menu.children) {
                    for (const child of menu.children) {
                        if (child.id === menuId && itemText.includes(child.name)) {
                            matchedMenu = child;
                            break;
                        }
                    }
                }
                if (matchedMenu) break;
            }
            
            // 只更新匹配的菜单项
            if (matchedMenu) {
                const totalCount = matchedMenu.permissions.length;
                const statusClass = getPermissionCountClass(configuredCount, totalCount);
                
                // 移除所有状态类
                countSpan.classList.remove('none', 'partial', 'full');
                // 添加新的状态类
                countSpan.classList.add(statusClass);
                // 更新文本
                countSpan.textContent = `${configuredCount}/${totalCount}`;
            }
        }
    });
}

// 保存权限配置
function savePermissionConfig() {
    if (!currentConfigRoleId) return;
    
    const role = roleData.find(r => r.id === currentConfigRoleId);
    if (!role) return;
    
    // 统计配置的权限数量
    const permissions = rolePermissionsData[currentConfigRoleId] || {};
    let totalCount = 0;
    Object.values(permissions).forEach(perms => {
        totalCount += perms.length;
    });
    
    alert(`权限配置保存成功！\n\n角色：${role.name}\n已配置权限数：${totalCount}`);
    closePermissionConfigModal();
}

// 关闭权限配置弹窗
function closePermissionConfigModal() {
    document.getElementById('permissionConfigModal').classList.remove('active');
    currentConfigRoleId = null;
    currentSelectedMenu = null;
}
