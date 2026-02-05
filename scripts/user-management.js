// 用户管理页面脚本

// 系统初始密码
const INITIAL_PASSWORD = '123456';

// 系统菜单结构（与角色管理保持一致）
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

// 模拟角色权限数据（从角色管理模块获取）
const rolePermissionsData = {
    '系统管理员': {
        'home': ['查看'],
        'map': ['查看'],
        'area': ['查看', '新增', '编辑', '删除'],
        'location': ['查看', '新增', '编辑', '删除'],
        'port': ['查看', '新增', '编辑', '删除'],
        'station': ['查看', '新增', '编辑', '删除'],
        'aisle': ['查看', '新增', '编辑', '删除'],
        'inbound-order': ['查看', '新增', '编辑', '删除', '审核'],
        'inbound-operation': ['查看', '执行作业', '完成作业'],
        'outbound-order': ['查看', '新增', '编辑', '删除', '审核'],
        'outbound-operation': ['查看', '执行作业', '完成作业'],
        'inventory-plan': ['查看', '新增', '编辑', '删除', '执行'],
        'inventory-operation': ['查看', '执行作业', '完成作业'],
        'stock-detail': ['查看', '锁定', '解锁', '清空', '导出'],
        'task-list': ['查看', '加急', '强制完成', '取消', '导出'],
        'inbound-strategy': ['查看', '新增', '编辑', '删除'],
        'outbound-strategy': ['查看', '新增', '编辑', '删除'],
        'user': ['查看', '新增', '编辑', '禁用', '启用', '重置密码'],
        'role': ['查看', '新增', '编辑', '删除', '权限配置'],
        'material': ['查看', '新增', '编辑', '删除'],
        'container': ['查看', '新增', '编辑', '删除']
    },
    '仓库管理员': {
        'home': ['查看'],
        'map': ['查看'],
        'area': ['查看', '编辑'],
        'location': ['查看', '编辑'],
        'inbound-order': ['查看', '新增', '编辑', '审核'],
        'inbound-operation': ['查看', '执行作业', '完成作业'],
        'outbound-order': ['查看', '新增', '编辑', '审核'],
        'outbound-operation': ['查看', '执行作业', '完成作业'],
        'inventory-plan': ['查看', '新增', '编辑', '执行'],
        'inventory-operation': ['查看', '执行作业', '完成作业'],
        'stock-detail': ['查看', '导出'],
        'task-list': ['查看', '加急', '导出']
    },
    '操作员': {
        'home': ['查看'],
        'inbound-operation': ['查看', '执行作业', '完成作业'],
        'outbound-operation': ['查看', '执行作业', '完成作业'],
        'inventory-operation': ['查看', '执行作业', '完成作业'],
        'stock-detail': ['查看'],
        'task-list': ['查看']
    },
    '查看员': {
        'home': ['查看'],
        'map': ['查看'],
        'area': ['查看'],
        'location': ['查看'],
        'inbound-order': ['查看'],
        'outbound-order': ['查看'],
        'stock-detail': ['查看'],
        'task-list': ['查看']
    }
};

let currentViewUserId = null;
let currentViewSelectedMenu = null;

// 角色权限映射（旧版本，保留用于兼容）
const rolePermissions = {
    '系统管理员': {
        '系统管理': ['用户管理', '角色管理', '系统配置', '日志查看'],
        '仓库管理': ['库区管理', '库位管理', '库口管理', '库台管理', '巷道管理'],
        '入库管理': ['入库单管理', '入库作业'],
        '出库管理': ['出库单管理', '出库作业'],
        '盘点管理': ['盘点计划', '盘点作业'],
        '库存管理': ['库存明细', '库存锁定', '库存调整'],
        '任务管理': ['任务列表', '任务监控'],
        '策略配置': ['入库策略', '出库策略'],
        '基础数据': ['物料管理', '容器管理']
    },
    '仓库管理员': {
        '仓库管理': ['库区管理', '库位管理', '库口管理', '库台管理', '巷道管理'],
        '入库管理': ['入库单管理', '入库作业'],
        '出库管理': ['出库单管理', '出库作业'],
        '盘点管理': ['盘点计划', '盘点作业'],
        '库存管理': ['库存明细', '库存锁定'],
        '任务管理': ['任务列表'],
        '基础数据': ['物料管理', '容器管理']
    },
    '操作员': {
        '入库管理': ['入库作业'],
        '出库管理': ['出库作业'],
        '盘点管理': ['盘点作业'],
        '库存管理': ['库存明细（查看）'],
        '任务管理': ['任务列表（查看）']
    },
    '查看员': {
        '库存管理': ['库存明细（查看）'],
        '任务管理': ['任务列表（查看）'],
        '入库管理': ['入库单（查看）'],
        '出库管理': ['出库单（查看）']
    }
};

// 模拟用户数据
let userData = [
    {
        id: 1,
        username: '张三',
        phone: '13800138001',
        roles: ['系统管理员'],
        status: 'active',
        lastLoginTime: '2024-01-20 14:30:25'
    },
    {
        id: 2,
        username: '李四',
        phone: '13800138002',
        roles: ['仓库管理员'],
        status: 'active',
        lastLoginTime: '2024-01-20 10:15:30'
    },
    {
        id: 3,
        username: '王五',
        phone: '13800138003',
        roles: ['操作员', '查看员'],
        status: 'active',
        lastLoginTime: '2024-01-19 16:45:10'
    },
    {
        id: 4,
        username: '赵六',
        phone: '13800138004',
        roles: ['操作员'],
        status: 'disabled',
        lastLoginTime: '2024-01-18 09:20:00'
    },
    {
        id: 5,
        username: '钱七',
        phone: '13800138005',
        roles: ['查看员'],
        status: 'active',
        lastLoginTime: '2024-01-20 08:30:15'
    }
];

// 分页配置
let currentPage = 1;
const pageSize = 10;
let filteredData = [...userData];
let editingUserId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    initEventListeners();
});

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('userTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map(user => {
        const statusClass = user.status === 'active' ? 'active' : 'disabled';
        const statusText = user.status === 'active' ? '正常' : '已禁用';
        const statusAction = user.status === 'active' ? 
            `<button class="disable-btn" onclick="disableUser(${user.id})">禁用</button>` :
            `<button class="enable-btn" onclick="enableUser(${user.id})">启用</button>`;
        
        const roleTags = user.roles.map(role => `<span class="role-tag">${role}</span>`).join('');
        
        return `
        <tr>
            <td>${user.username}</td>
            <td>${user.phone}</td>
            <td><div class="role-tags">${roleTags}</div></td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${user.lastLoginTime}</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editUser(${user.id})">编辑</button>
                    ${statusAction}
                    <button class="reset-pwd-btn" onclick="resetPassword(${user.id})">重置密码</button>
                    <button class="permission-btn" onclick="viewPermission(${user.id})">权限查看</button>
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
    document.getElementById('searchBtn').addEventListener('click', searchUsers);
    
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
    document.getElementById('saveBtn').addEventListener('click', saveUser);
    
    // 权限弹窗关闭
    document.getElementById('permissionClose').addEventListener('click', closePermissionModal);
    document.getElementById('permissionCloseBtn').addEventListener('click', closePermissionModal);
    
    // 点击弹窗外部关闭
    document.getElementById('userModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    document.getElementById('permissionModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePermissionModal();
        }
    });
}

// 查询用户
function searchUsers() {
    const username = document.getElementById('searchUsername').value.trim().toLowerCase();
    const phone = document.getElementById('searchPhone').value.trim();
    const role = document.getElementById('searchRole').value;
    
    filteredData = userData.filter(user => {
        const matchUsername = !username || user.username.toLowerCase().includes(username);
        const matchPhone = !phone || user.phone.includes(phone);
        const matchRole = !role || user.roles.includes(role);
        
        return matchUsername && matchPhone && matchRole;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置查询
function resetSearch() {
    document.getElementById('searchUsername').value = '';
    document.getElementById('searchPhone').value = '';
    document.getElementById('searchRole').value = '';
    
    filteredData = [...userData];
    currentPage = 1;
    renderTable();
}

// 打开新增弹窗
function openAddModal() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = '新增用户';
    
    // 清空表单
    document.getElementById('username').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('phone').disabled = false;
    document.getElementById('phoneLabel').classList.add('required');
    
    // 清空角色选择
    const checkboxes = document.querySelectorAll('#roleCheckboxGroup input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    document.getElementById('userModal').classList.add('active');
}

// 保存用户
function saveUser() {
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // 获取选中的角色
    const checkboxes = document.querySelectorAll('#roleCheckboxGroup input[type="checkbox"]:checked');
    const roles = Array.from(checkboxes).map(cb => cb.value);
    
    // 验证
    if (!username) {
        alert('请输入用户名！');
        return;
    }
    
    if (!phone) {
        alert('请输入手机号！');
        return;
    }
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert('请输入正确的手机号格式！');
        return;
    }
    
    if (roles.length === 0) {
        alert('请至少选择一个角色！');
        return;
    }
    
    const now = getCurrentTime();
    
    if (editingUserId) {
        // 编辑
        const user = userData.find(u => u.id === editingUserId);
        if (user) {
            user.username = username;
            user.roles = roles;
            
            alert('用户信息更新成功！');
        }
    } else {
        // 新增 - 检查手机号是否已存在
        if (userData.some(u => u.phone === phone)) {
            alert('该手机号已被使用，请使用其他手机号！');
            return;
        }
        
        const newUser = {
            id: userData.length > 0 ? Math.max(...userData.map(u => u.id)) + 1 : 1,
            username: username,
            phone: phone,
            roles: roles,
            status: 'active',
            lastLoginTime: '-'
        };
        
        userData.push(newUser);
        alert(`用户添加成功！\n\n初始密码为：${INITIAL_PASSWORD}\n请提醒用户首次登录后修改密码。`);
    }
    
    closeModal();
    resetSearch();
}

// 编辑用户
function editUser(id) {
    const user = userData.find(u => u.id === id);
    if (!user) return;
    
    editingUserId = id;
    document.getElementById('modalTitle').textContent = '编辑用户';
    
    // 填充表单
    document.getElementById('username').value = user.username;
    document.getElementById('phone').value = user.phone;
    document.getElementById('phone').disabled = true;
    document.getElementById('phoneLabel').classList.remove('required');
    
    // 设置角色选择
    const checkboxes = document.querySelectorAll('#roleCheckboxGroup input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = user.roles.includes(cb.value);
    });
    
    document.getElementById('userModal').classList.add('active');
}

// 禁用用户
function disableUser(id) {
    const user = userData.find(u => u.id === id);
    if (!user) return;
    
    if (confirm(`确定要禁用用户"${user.username}"吗？\n\n禁用后该账号将无法登录系统，但不会清除数据。`)) {
        user.status = 'disabled';
        alert('用户已禁用！');
        renderTable();
    }
}

// 启用用户
function enableUser(id) {
    const user = userData.find(u => u.id === id);
    if (!user) return;
    
    if (confirm(`确定要启用用户"${user.username}"吗？\n\n启用后该账号将恢复登录权限，并自动继承原有角色的权限。`)) {
        user.status = 'active';
        alert('用户已启用！');
        renderTable();
    }
}

// 重置密码
function resetPassword(id) {
    const user = userData.find(u => u.id === id);
    if (!user) return;
    
    if (confirm(`确定要重置用户"${user.username}"的密码吗？\n\n密码将被重置为初始密码：${INITIAL_PASSWORD}`)) {
        alert(`密码重置成功！\n\n用户：${user.username}\n手机号：${user.phone}\n新密码：${INITIAL_PASSWORD}\n\n请提醒用户尽快修改密码。`);
    }
}

// 查看权限
function viewPermission(id) {
    const user = userData.find(u => u.id === id);
    if (!user) return;
    
    currentViewUserId = id;
    currentViewSelectedMenu = null;
    
    // 设置用户名
    document.getElementById('permViewUsername').textContent = user.username;
    
    // 合并所有角色的权限
    const userPermissions = {};
    user.roles.forEach(role => {
        const permissions = rolePermissionsData[role];
        if (permissions) {
            Object.keys(permissions).forEach(menuId => {
                if (!userPermissions[menuId]) {
                    userPermissions[menuId] = new Set();
                }
                permissions[menuId].forEach(perm => {
                    userPermissions[menuId].add(perm);
                });
            });
        }
    });
    
    // 转换为数组格式
    const userPermissionsArray = {};
    Object.keys(userPermissions).forEach(menuId => {
        userPermissionsArray[menuId] = Array.from(userPermissions[menuId]);
    });
    
    // 渲染菜单树
    renderPermViewMenuTree(userPermissionsArray);
    
    // 默认选中并显示首页配置
    setTimeout(() => {
        const homeMenuItem = document.querySelector('#permViewMenuTree .menu-single-item');
        if (homeMenuItem) {
            homeMenuItem.classList.add('active');
            currentViewSelectedMenu = { groupId: 'home', menuId: 'home' };
            renderPermViewSingleMenuConfig('home', userPermissionsArray);
        }
    }, 0);
    
    document.getElementById('permissionModal').classList.add('active');
}

// 渲染权限查看菜单树
function renderPermViewMenuTree(userPermissions) {
    const menuTree = document.getElementById('permViewMenuTree');
    
    menuTree.innerHTML = systemMenus.map(menu => {
        // 如果是单层菜单，直接显示为可点击项
        if (menu.isSingle) {
            const configuredCount = (userPermissions[menu.id] || []).length;
            const totalCount = menu.permissions.length;
            const statusClass = getPermissionCountClass(configuredCount, totalCount);
            
            return `
                <div class="menu-single-item" onclick="selectPermViewSingleMenu('${menu.id}')">
                    <span class="menu-item-name">${menu.icon} ${menu.name}</span>
                    <span class="permission-count ${statusClass}">${configuredCount}/${totalCount}</span>
                </div>
            `;
        }
        
        // 多层菜单，显示为可展开的组
        return `
            <div class="menu-group-item" id="perm-view-menu-group-${menu.id}">
                <div class="menu-group-header" onclick="togglePermViewMenuGroup('${menu.id}')">
                    <span class="menu-group-arrow">▼</span>
                    <span>${menu.icon} ${menu.name}</span>
                </div>
                <div class="menu-sub-items">
                    ${menu.children.map(sub => {
                        const configuredCount = (userPermissions[sub.id] || []).length;
                        const totalCount = sub.permissions.length;
                        const statusClass = getPermissionCountClass(configuredCount, totalCount);
                        
                        return `
                            <div class="menu-sub-item" onclick="selectPermViewMenu('${menu.id}', '${sub.id}')">
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

// 选择单层菜单（权限查看）
function selectPermViewSingleMenu(menuId) {
    // 移除所有active状态
    document.querySelectorAll('#permViewMenuTree .menu-sub-item, #permViewMenuTree .menu-single-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加active状态
    const menuItem = event.currentTarget || event.target.closest('.menu-single-item');
    if (menuItem) {
        menuItem.classList.add('active');
    }
    
    currentViewSelectedMenu = { groupId: menuId, menuId: menuId };
    
    // 获取用户权限
    const user = userData.find(u => u.id === currentViewUserId);
    if (!user) return;
    
    const userPermissions = {};
    user.roles.forEach(role => {
        const permissions = rolePermissionsData[role];
        if (permissions) {
            Object.keys(permissions).forEach(mid => {
                if (!userPermissions[mid]) {
                    userPermissions[mid] = new Set();
                }
                permissions[mid].forEach(perm => {
                    userPermissions[mid].add(perm);
                });
            });
        }
    });
    
    const userPermissionsArray = {};
    Object.keys(userPermissions).forEach(mid => {
        userPermissionsArray[mid] = Array.from(userPermissions[mid]);
    });
    
    // 渲染权限配置
    renderPermViewSingleMenuConfig(menuId, userPermissionsArray);
}

// 渲染单层菜单的权限配置（权限查看）
function renderPermViewSingleMenuConfig(menuId, userPermissions) {
    const menu = systemMenus.find(m => m.id === menuId);
    if (!menu || !menu.isSingle) return;
    
    const menuPermissions = userPermissions[menuId] || [];
    
    const configArea = document.getElementById('permViewConfigArea');
    configArea.innerHTML = `
        <div class="permission-module-title">${menu.name}</div>
        <div class="permission-options">
            ${menu.permissions.map(perm => {
                const isChecked = menuPermissions.includes(perm);
                const permDesc = getPermissionDescription(perm);
                return `
                    <div class="permission-option ${isChecked ? '' : 'permission-disabled'}">
                        <input type="checkbox" 
                               id="perm-view-${menuId}-${perm}" 
                               value="${perm}"
                               ${isChecked ? 'checked' : ''}
                               disabled>
                        <label class="permission-option-label" for="perm-view-${menuId}-${perm}">
                            <span class="permission-option-name">${perm}</span>
                            <span class="permission-option-desc">${permDesc}</span>
                        </label>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 切换菜单组展开/收起（权限查看）
function togglePermViewMenuGroup(groupId) {
    const groupElement = document.getElementById(`perm-view-menu-group-${groupId}`);
    groupElement.classList.toggle('collapsed');
}

// 选择菜单（权限查看）
function selectPermViewMenu(groupId, menuId) {
    // 移除所有active状态
    document.querySelectorAll('#permViewMenuTree .menu-sub-item, #permViewMenuTree .menu-single-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加active状态
    const menuItem = event.currentTarget || event.target.closest('.menu-sub-item');
    if (menuItem) {
        menuItem.classList.add('active');
    }
    
    currentViewSelectedMenu = { groupId, menuId };
    
    // 获取用户权限
    const user = userData.find(u => u.id === currentViewUserId);
    if (!user) return;
    
    const userPermissions = {};
    user.roles.forEach(role => {
        const permissions = rolePermissionsData[role];
        if (permissions) {
            Object.keys(permissions).forEach(mid => {
                if (!userPermissions[mid]) {
                    userPermissions[mid] = new Set();
                }
                permissions[mid].forEach(perm => {
                    userPermissions[mid].add(perm);
                });
            });
        }
    });
    
    const userPermissionsArray = {};
    Object.keys(userPermissions).forEach(mid => {
        userPermissionsArray[mid] = Array.from(userPermissions[mid]);
    });
    
    // 渲染权限配置
    renderPermViewMenuConfig(groupId, menuId, userPermissionsArray);
}

// 渲染权限配置（权限查看）
function renderPermViewMenuConfig(groupId, menuId, userPermissions) {
    const menu = systemMenus.find(m => m.id === groupId);
    if (!menu) return;
    
    const subMenu = menu.children.find(s => s.id === menuId);
    if (!subMenu) return;
    
    const menuPermissions = userPermissions[menuId] || [];
    
    const configArea = document.getElementById('permViewConfigArea');
    configArea.innerHTML = `
        <div class="permission-module-title">${subMenu.name}</div>
        <div class="permission-options">
            ${subMenu.permissions.map(perm => {
                const isChecked = menuPermissions.includes(perm);
                const permDesc = getPermissionDescription(perm);
                return `
                    <div class="permission-option ${isChecked ? '' : 'permission-disabled'}">
                        <input type="checkbox" 
                               id="perm-view-${menuId}-${perm}" 
                               value="${perm}"
                               ${isChecked ? 'checked' : ''}
                               disabled>
                        <label class="permission-option-label" for="perm-view-${menuId}-${perm}">
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

// 关闭弹窗
function closeModal() {
    document.getElementById('userModal').classList.remove('active');
    editingUserId = null;
}

// 关闭权限弹窗
function closePermissionModal() {
    document.getElementById('permissionModal').classList.remove('active');
    currentViewUserId = null;
    currentViewSelectedMenu = null;
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
