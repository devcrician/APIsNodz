document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mobileToggle = document.getElementById('mobileToggle');
    const categoriesMenu = document.getElementById('categoriesMenu');
    const statsGrid = document.getElementById('statsGrid');
    const currentApiUrl = document.getElementById('currentApiUrl');
    const searchInput = document.getElementById('searchInput');

    let openCategory = null;
    let routesChart = null;

    const API_BASE_URL = window.location.origin;

    if (typeof apiData === 'undefined') {
        console.error('Erro: apiData não está definido');
        const chartCanvas = document.getElementById('routesChart');
        if (chartCanvas && chartCanvas.parentElement) {
            chartCanvas.parentElement.innerHTML = 
                '<div style="color: red; text-align: center; padding: 50px;">Erro: Dados da API não carregados</div>';
        }
        return;
    }

    function calculateStats() {
        const totalCategories = apiData.categories.length;
        const totalRoutes = apiData.categories.reduce((sum, cat) => sum + cat.routes.length, 0);
        
        return [
            {
                title: totalCategories.toString(),
                subtitle: 'Categorias',
                icon: 'fas fa-layer-group',
                color: '#7B68EE',
                type: 'text'
            },
            {
                title: totalRoutes.toString(),
                subtitle: 'Rotas Totais',
                icon: 'fas fa-route',
                color: '#00CED1',
                type: 'text'
            },
            {
                title: '07/04/26',
                subtitle: 'Última Atualização',
                icon: 'fas fa-calendar-alt',
                color: '#FF1493',
                type: 'text'
            },
            {
                title: 'Online',
                subtitle: 'Status',
                icon: 'fas fa-circle',
                color: '#22c55e',
                type: 'text'
            },
            {
                title: '',
                subtitle: 'Visitas',
                icon: 'fas fa-eye',
                color: '#fbbf24',
                type: 'counter'
            }
        ];
    }

    function renderStats() {
        const stats = calculateStats();
        statsGrid.innerHTML = stats.map((stat, index) => {
            if (stat.type === 'counter') {
                return `
                    <div class="stat-card counter-card" style="animation-delay: ${index * 0.1}s; cursor: default;">
                        <div class="stat-icon" style="background: ${stat.color}">
                            <i class="${stat.icon}"></i>
                        </div>
                        <div class="stat-info">
                            <div class="counter-container">
                                <a href='https://www.counter12.com' target="_blank">
                                    <img src='https://www.counter12.com/img-cC39z4Y4y96cwz17-55.gif' border='0' alt='contador de visitas' class="counter-image">
                                </a>
                            </div>
                            <p>${stat.subtitle}</p>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="stat-card" style="animation-delay: ${index * 0.1}s; cursor: default;">
                        <div class="stat-icon" style="background: ${stat.color}">
                            <i class="${stat.icon}"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${stat.title}</h3>
                            <p>${stat.subtitle}</p>
                        </div>
                    </div>
                `;
            }
        }).join('');
        
        document.querySelectorAll('.stat-card').forEach((card) => {
            card.classList.add('fade-in');
        });
    }

    function renderCategories() {
        categoriesMenu.innerHTML = apiData.categories.map(category => `
            <div class="category-group" data-category="${category.id}">
                <div class="category-header ${openCategory === category.id ? 'active' : ''}">
                    <div class="category-title">
                        <div class="category-icon" style="background: ${category.color}">
                            <i class="${category.icon}"></i>
                        </div>
                        <span>${category.name}</span>
                    </div>
                    <i class="fas fa-chevron-right category-arrow"></i>
                </div>
                <div class="routes-list ${openCategory === category.id ? 'open' : ''}">
                    ${category.routes.map((route, routeIndex) => `
                        <a href="${API_BASE_URL}${route.path}" 
                           class="route-item" 
                           target="_blank"
                           title="${route.description || route.name}"
                           style="animation-delay: ${routeIndex * 0.05}s"
                           onclick="event.stopPropagation(); handleRouteClick('${route.path}');">
                            <i class="fas fa-external-link-alt"></i>
                            <span class="route-name">${route.name}</span>
                            <span class="route-method method-${route.method.toLowerCase()}">${route.method}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', function(e) {
                e.stopPropagation();
                const categoryId = this.closest('.category-group').dataset.category;
                toggleCategory(categoryId);
            });
        });
    }

    function toggleCategory(categoryId) {
        if (openCategory === categoryId) {
            openCategory = null;
        } else {
            openCategory = categoryId;
        }
        renderCategories();
    }

    window.handleRouteClick = function(path) {
        const fullUrl = `${API_BASE_URL}${path}`;
        currentApiUrl.textContent = fullUrl;
        currentApiUrl.style.animation = 'none';
        setTimeout(() => {
            currentApiUrl.style.animation = 'pulse 0.5s';
        }, 10);
        
        if (window.innerWidth < 1024) {
            sidebar.classList.remove('active');
        }
        
        return true;
    };

    function createChart() {
        const canvas = document.getElementById('routesChart');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        const categories = apiData.categories.map(cat => cat.name);
        const routesCount = apiData.categories.map(cat => cat.routes.length);
        
        const gradientColors = [
            '#7B68EE', '#00CED1', '#FF1493', '#fbbf24', '#22c55e', 
            '#3b82f6', '#ef4444', '#a855f7', '#ec489a', '#14b8a6'
        ];
        
        const backgroundColors = routesCount.map((_, index) => gradientColors[index % gradientColors.length] + '80');
        const borderColors = routesCount.map((_, index) => gradientColors[index % gradientColors.length]);
        
        if (routesChart) {
            routesChart.destroy();
        }
        
        try {
            routesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: categories,
                    datasets: [{
                        label: 'Quantidade de Rotas',
                        data: routesCount,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 2,
                        borderRadius: 8,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#ffffff',
                                font: {
                                    size: 12,
                                    family: 'Inter, sans-serif'
                                },
                                boxWidth: 12,
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#d4d4d4',
                            borderColor: '#333333',
                            borderWidth: 1,
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return `Rotas: ${context.raw}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#d4d4d4',
                                font: {
                                    size: 11
                                },
                                stepSize: 1
                            },
                            title: {
                                display: true,
                                text: 'Quantidade de Rotas',
                                color: '#a3a3a3',
                                font: {
                                    size: 12,
                                    weight: '500'
                                },
                                align: 'center'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#d4d4d4',
                                font: {
                                    size: 11,
                                    weight: '500'
                                },
                                maxRotation: 45,
                                minRotation: 35
                            },
                            title: {
                                display: true,
                                text: 'Categorias',
                                color: '#a3a3a3',
                                font: {
                                    size: 12,
                                    weight: '500'
                                },
                                align: 'center'
                            }
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 20,
                            bottom: 10
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                }
            });
            
            console.log('Gráfico criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar gráfico:', error);
            canvas.parentElement.innerHTML = '<div style="color: red; text-align: center; padding: 50px;">Erro ao renderizar gráfico</div>';
        }
    }

    function init() {
        renderStats();
        renderCategories();
        
        setTimeout(() => {
            createChart();
        }, 100);
        
        currentApiUrl.textContent = API_BASE_URL;
        
        const chartCard = document.querySelector('.chart-card');
        if (chartCard) {
            chartCard.classList.add('fade-in');
        }
    }

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        document.querySelectorAll('.category-group').forEach(group => {
            const categoryName = group.querySelector('.category-title span').textContent.toLowerCase();
            const routes = group.querySelectorAll('.route-item');
            
            let hasMatch = categoryName.includes(searchTerm);
            
            routes.forEach(route => {
                const routeName = route.querySelector('.route-name').textContent.toLowerCase();
                const routeMatches = routeName.includes(searchTerm);
                
                route.style.display = routeMatches ? 'flex' : 'none';
                
                if (routeMatches) {
                    hasMatch = true;
                }
            });
            
            group.style.display = hasMatch ? 'block' : 'none';
        });
    });

    mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (window.innerWidth < 1024 && 
            !sidebar.contains(event.target) && 
            !mobileToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });

    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    init();
});