// 菜单切换功能
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    const menuGroups = document.querySelectorAll('.menu-group');
    const contentFrame = document.getElementById('content-frame');

    // 菜单项点击
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            menuItems.forEach(mi => mi.classList.remove('active'));
            
            // 添加active类到当前项
            this.classList.add('active');
            
            // 获取页面名称并加载对应页面
            const pageName = this.getAttribute('data-page');
            contentFrame.src = `pages/${pageName}.html`;
        });
    });

    // 菜单分组点击
    menuGroups.forEach(group => {
        const title = group.querySelector('.menu-group-title');
        title.addEventListener('click', function(e) {
            e.preventDefault();
            group.classList.toggle('active');
        });
    });

    // 退出按钮
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        if (confirm('确定要退出系统吗？')) {
            alert('退出成功');
            // 这里可以添加实际的退出逻辑
        }
    });
});
