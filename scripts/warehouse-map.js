// 库位地图交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 当前选中的层，默认12层
    let currentLevel = 12;
    
    // 生成库位网格
    generateWarehouseGrid(currentLevel);

    const detailPopup = document.getElementById('detailPopup');
    let currentSelectedCell = null;

    // 生成库位网格函数
    function generateWarehouseGrid(level) {
        const container = document.getElementById('warehouseGrid');
        container.innerHTML = ''; // 清空现有内容
        
        const rows = 4; // 4排
        const cols = 32; // 32列

        // 随机生成库位状态
        function getRandomStatus() {
            const rand = Math.random();
            if (rand < 0.5) return 'occupied'; // 50%有货
            if (rand < 0.7) return 'empty'; // 20%空库位
            if (rand < 0.8) return 'empty-pallet'; // 10%空托
            if (rand < 0.9) return 'material-locked'; // 10%物料锁定
            if (rand < 0.95) return 'locked'; // 5%库位锁定
            return 'disabled'; // 5%禁用
        }

        function getStatusText(status) {
            switch(status) {
                case 'occupied': return '有货';
                case 'empty': return '空库位';
                case 'empty-pallet': return '空托';
                case 'material-locked': return '物料锁定';
                case 'locked': return '库位锁定';
                case 'disabled': return '禁用';
                default: return '未知';
            }
        }

        // 生成每一排
        for (let row = 1; row <= rows; row++) {
            // 1排有2深，其他排只有1深
            const depths = (row === 1) ? 2 : 1;
            
            // 排标题 - 显示排和层
            const stackHeader = document.createElement('div');
            stackHeader.className = 'stack-header';
            stackHeader.setAttribute('data-row', row);
            stackHeader.innerHTML = `<h3 class="stack-title">${row}排-${level}层</h3>`;
            container.appendChild(stackHeader);

            // 表格容器
            const gridTable = document.createElement('div');
            gridTable.className = 'grid-table';
            gridTable.setAttribute('data-row', row);

            // 表头
            const gridHeader = document.createElement('div');
            gridHeader.className = 'grid-header';
            gridHeader.innerHTML = '<div class="grid-cell header-cell">深 / 列</div>';
            
            for (let col = 1; col <= cols; col++) {
                const headerCell = document.createElement('div');
                headerCell.className = 'grid-cell header-cell';
                headerCell.textContent = col;
                gridHeader.appendChild(headerCell);
            }
            gridTable.appendChild(gridHeader);

            // 生成每一深
            for (let depth = 1; depth <= depths; depth++) {
                const gridRow = document.createElement('div');
                gridRow.className = 'grid-row';

                // 行头
                const rowHeader = document.createElement('div');
                rowHeader.className = 'grid-cell row-header';
                rowHeader.textContent = depth;
                gridRow.appendChild(rowHeader);

                // 生成每一列
                for (let col = 1; col <= cols; col++) {
                    // 库位编码格式：排-列-层-深
                    const location = `${row}-${col}-${level}-${depth}`;
                    const status = getRandomStatus();
                    
                    const cell = document.createElement('div');
                    cell.className = `grid-cell location-cell ${status}`;
                    cell.setAttribute('data-location', location);
                    cell.innerHTML = `
                        <div class="cell-code">${row}-${col}-${level}-${depth}</div>
                        <div class="cell-status">${getStatusText(status)}</div>
                    `;
                    
                    gridRow.appendChild(cell);
                }

                gridTable.appendChild(gridRow);
            }

            container.appendChild(gridTable);
        }

        // 绑定点击事件
        bindLocationCellEvents();
        
        // 应用排的筛选
        const rowSelect = document.getElementById('rowSelect');
        if (rowSelect) {
            const checkboxes = rowSelect.querySelectorAll('input[type="checkbox"]');
            const selectedRows = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            filterWarehouseRows(selectedRows);
        }
    }

    // 绑定库位单元格事件
    function bindLocationCellEvents() {
        const locationCells = document.querySelectorAll('.location-cell');
        
        locationCells.forEach(cell => {
            cell.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                
                const location = this.getAttribute('data-location');
                const rect = this.getBoundingClientRect();
                
                // 移除之前的选中状态
                if (currentSelectedCell) {
                    currentSelectedCell.classList.remove('selected');
                }
                
                // 添加选中状态
                this.classList.add('selected');
                currentSelectedCell = this;
                
                // 解析库位编码
                const parts = location.split('-');
                const row = parts[0];
                const col = parts[1];
                const level = parts[2];
                const depth = parts[3];
                
                // 判断库位状态
                const isOccupied = this.classList.contains('occupied');
                const isEmpty = this.classList.contains('empty');
                const isLocked = this.classList.contains('locked');
                
                // 获取库位数据
                const data = {
                    name: `${row}排-${col}列-${level}层-${depth}深`,
                    area: `${row}排库区`,
                    container: isEmpty ? '-' : `EU${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
                    qty: isEmpty ? 0 : Math.floor(Math.random() * 10) + 1
                };
                
                // 更新弹窗内容
                document.getElementById('popupLocation').textContent = location;
                document.getElementById('popupName').textContent = data.name;
                document.getElementById('popupArea').textContent = data.area;
                document.getElementById('popupContainer').textContent = data.container;
                document.getElementById('popupQty').textContent = data.qty;
                
                // 显示弹窗
                detailPopup.classList.add('active');
                
                // 定位弹窗（在单元格旁边）
                const popupWidth = detailPopup.offsetWidth || 280;
                const popupHeight = detailPopup.offsetHeight || 200;
                
                // 计算弹窗位置（优先显示在右侧）
                let left = rect.right + 10 + window.scrollX;
                let top = rect.top + window.scrollY;
                
                // 如果右侧空间不够，显示在左侧
                if (left + popupWidth > window.innerWidth + window.scrollX) {
                    left = rect.left - popupWidth - 10 + window.scrollX;
                }
                
                // 如果左侧也不够，显示在单元格下方
                if (left < window.scrollX) {
                    left = rect.left + window.scrollX;
                    top = rect.bottom + 10 + window.scrollY;
                }
                
                // 如果下方空间不够，向上调整
                if (top + popupHeight > window.innerHeight + window.scrollY) {
                    top = rect.top - popupHeight - 10 + window.scrollY;
                }
                
                // 确保不超出视口顶部
                if (top < window.scrollY) {
                    top = window.scrollY + 10;
                }
                
                detailPopup.style.left = left + 'px';
                detailPopup.style.top = top + 'px';
            });
        });
    }

    // 点击其他地方关闭弹窗
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.location-cell') && !e.target.closest('.detail-popup')) {
            detailPopup.classList.remove('active');
            if (currentSelectedCell) {
                currentSelectedCell.classList.remove('selected');
                currentSelectedCell = null;
            }
        }
    });

    // 自定义多选下拉框
    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(select => {
        const trigger = select.querySelector('.select-trigger');
        const checkboxes = select.querySelectorAll('input[type="checkbox"]');
        const selectText = select.querySelector('.select-text');

        // 更新显示文本
        function updateText() {
            const checked = Array.from(checkboxes).filter(cb => cb.checked);
            const total = checkboxes.length;
            
            if (checked.length === 0) {
                selectText.textContent = '请选择';
            } else if (checked.length === total) {
                selectText.textContent = '全部';
            } else {
                const labels = checked.map(cb => cb.nextElementSibling.textContent);
                selectText.textContent = labels.join(', ');
            }
        }

        // 初始化显示
        updateText();

        // 点击触发器切换下拉框
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 关闭其他下拉框
            customSelects.forEach(s => {
                if (s !== select) {
                    s.classList.remove('active');
                }
            });
            
            // 切换当前下拉框
            select.classList.toggle('active');
        });

        // 复选框变化时更新文本
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateText();
                
                // 获取选中的值
                const selectedValues = Array.from(checkboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                
                console.log('选中的值：', selectedValues);
                
                // 如果是排的筛选，触发库位显示更新
                if (select.id === 'rowSelect') {
                    filterWarehouseRows(selectedValues);
                }
            });
        });
    });

    // 筛选库位排显示
    function filterWarehouseRows(selectedRows) {
        const allStackHeaders = document.querySelectorAll('.stack-header');
        const allGridTables = document.querySelectorAll('.grid-table');
        
        if (selectedRows.length === 0) {
            // 如果没有选中任何排，隐藏所有
            allStackHeaders.forEach(element => {
                element.style.display = 'none';
            });
            allGridTables.forEach(element => {
                element.style.display = 'none';
            });
            return;
        }
        
        // 显示/隐藏对应的排
        allStackHeaders.forEach(header => {
            const row = header.getAttribute('data-row');
            if (selectedRows.includes(row)) {
                header.style.display = 'block';
            } else {
                header.style.display = 'none';
            }
        });
        
        allGridTables.forEach(table => {
            const row = table.getAttribute('data-row');
            if (selectedRows.includes(row)) {
                table.style.display = 'table';
            } else {
                table.style.display = 'none';
            }
        });
    }

    // 点击其他地方关闭下拉框
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-select')) {
            customSelects.forEach(select => {
                select.classList.remove('active');
            });
        }
    });

    // 视图切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            console.log('切换到视图：', view);
            // 这里可以添加视图切换逻辑
        });
    });

    // 数字输入框增减
    const numBtns = document.querySelectorAll('.num-btn');
    numBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            let input;
            
            if (target) {
                // 定位库位的输入框
                input = document.getElementById(`locate${target.charAt(0).toUpperCase() + target.slice(1)}`);
            } else {
                // 其他输入框
                input = this.parentElement.querySelector('.num-input');
            }
            
            if (!input) return;
            
            let value = parseInt(input.value) || 1;
            const min = parseInt(input.getAttribute('min')) || 1;
            const max = parseInt(input.getAttribute('max')) || 999;
            
            if (this.textContent === '+') {
                if (value < max) value++;
            } else if (this.textContent === '-' && value > min) {
                value--;
            }
            
            input.value = value;
        });
    });

    // 定位按钮
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function() {
        locateWarehousePosition();
    });

    // 库位定位功能
    function locateWarehousePosition() {
        const row = parseInt(document.getElementById('locateRow').value);
        const col = parseInt(document.getElementById('locateCol').value);
        const level = parseInt(document.getElementById('locateLevel').value);
        const depth = parseInt(document.getElementById('locateDepth').value);

        // 验证输入
        if (row < 1 || row > 4) {
            alert('排的范围是1-4');
            return;
        }
        if (col < 1 || col > 32) {
            alert('列的范围是1-32');
            return;
        }
        if (level < 1 || level > 12) {
            alert('层的范围是1-12');
            return;
        }
        if (depth < 1 || depth > 2) {
            alert('深的范围是1-2');
            return;
        }
        
        // 如果是2-4排，深度只能是1
        if (row > 1 && depth > 1) {
            alert('2-4排只有1深');
            return;
        }

        // 如果当前层不是目标层，切换到目标层
        if (currentLevel !== level) {
            currentLevel = level;
            
            // 更新层选择下拉框
            const levelSelect = document.getElementById('levelSelect');
            levelSelect.value = level;
            
            // 重新生成库位网格
            generateWarehouseGrid(currentLevel);
        }

        // 确保目标排被选中
        const rowSelect = document.getElementById('rowSelect');
        const rowCheckboxes = rowSelect.querySelectorAll('input[type="checkbox"]');
        let targetRowChecked = false;
        
        rowCheckboxes.forEach(cb => {
            if (cb.value === row.toString()) {
                if (!cb.checked) {
                    cb.checked = true;
                    targetRowChecked = true;
                }
            }
        });
        
        // 如果刚勾选了目标排，需要更新显示
        if (targetRowChecked) {
            const selectedRows = Array.from(rowCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            filterWarehouseRows(selectedRows);
            
            // 更新排选择器的显示文本
            const selectText = rowSelect.querySelector('.select-text');
            if (selectText) {
                if (selectedRows.length === 4) {
                    selectText.textContent = '全部';
                } else {
                    const labels = selectedRows.map(r => r + '排');
                    selectText.textContent = labels.join(', ');
                }
            }
        }

        // 构建库位编码
        const location = `${row}-${col}-${level}-${depth}`;
        
        // 延迟查找和定位，确保DOM已更新
        setTimeout(() => {
            const targetCell = document.querySelector(`[data-location="${location}"]`);
            
            if (targetCell) {
                // 移除之前的选中状态
                if (currentSelectedCell) {
                    currentSelectedCell.classList.remove('selected');
                }
                
                // 选中目标库位
                targetCell.classList.add('selected');
                currentSelectedCell = targetCell;
                
                // 滚动到目标库位
                targetCell.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'center'
                });
                
                // 高亮闪烁效果
                targetCell.style.animation = 'highlight-flash 1s ease-in-out';
                setTimeout(() => {
                    targetCell.style.animation = '';
                }, 1000);
                
                console.log('已定位到库位：', location);
            } else {
                alert(`未找到库位：${location}`);
            }
        }, 100);
    }

    // 常用操作按钮
    const opBtns = document.querySelectorAll('.op-btn, .op-btn-link');
    opBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('执行操作：', this.textContent);
            // 这里可以添加操作逻辑
        });
    });

    // 筛选下拉框
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            console.log('筛选条件变更：', this.value);
            
            // 如果是层的筛选，重新生成库位网格
            if (this.id === 'levelSelect') {
                currentLevel = parseInt(this.value);
                generateWarehouseGrid(currentLevel);
            }
        });
    });
});
