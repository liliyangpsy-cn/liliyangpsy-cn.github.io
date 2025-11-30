// 主要JavaScript功能文件
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initAnimations();
    initSkillsChart();
    initParticleBackground();
    initTypingEffect();
    initScrollEffects();
});

// 导航栏功能
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // 滚动时改变导航栏样式
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    });
    
    // 移动端菜单切换
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 动画初始化
function initAnimations() {
    // 页面加载动画
    anime({
        targets: '.card-hover',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(200),
        duration: 800,
        easing: 'easeOutExpo'
    });
    
    // 技能项目悬停动画
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        item.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

// 技能雷达图
function initSkillsChart() {
    const chartDom = document.getElementById('skills-chart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: '专业技能评估',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#1e3a8a'
            }
        },
        radar: {
            indicator: [
                { name: '研究设计', max: 100 },
                { name: '数据分析', max: 100 },
                { name: '临床实践', max: 100 },
                { name: 'AI技术应用', max: 100 },
                { name: '学术写作', max: 100 },
                { name: '跨文化沟通', max: 100 }
            ],
            shape: 'polygon',
            splitNumber: 5,
            axisName: {
                color: '#374151',
                fontSize: 12
            },
            splitLine: {
                lineStyle: {
                    color: '#e5e7eb'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(30, 58, 138, 0.05)', 'rgba(245, 158, 11, 0.05)']
                }
            }
        },
        series: [{
            name: '技能水平',
            type: 'radar',
            data: [{
                value: [95, 92, 90, 88, 94, 85],
                name: '当前水平',
                areaStyle: {
                    color: 'rgba(30, 58, 138, 0.3)'
                },
                lineStyle: {
                    color: '#1e3a8a',
                    width: 2
                },
                itemStyle: {
                    color: '#f59e0b',
                    borderColor: '#1e3a8a',
                    borderWidth: 2
                }
            }],
            animationDuration: 2000,
            animationEasing: 'cubicOut'
        }]
    };
    
    myChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 粒子背景效果
function initParticleBackground() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    
    // 使用p5.js创建粒子系统
    new p5(function(p) {
        let particles = [];
        const numParticles = 50;
        
        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('particle-container');
            
            // 创建粒子
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6),
                    opacity: p.random(0.1, 0.3)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // 更新和绘制粒子
            particles.forEach(particle => {
                // 更新位置
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // 边界检查
                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                
                // 绘制粒子
                p.fill(255, 255, 255, particle.opacity * 255);
                p.noStroke();
                p.ellipse(particle.x, particle.y, particle.size);
                
                // 连接线
                particles.forEach(other => {
                    const distance = p.dist(particle.x, particle.y, other.x, other.y);
                    if (distance < 100) {
                        p.stroke(255, 255, 255, (1 - distance / 100) * 50);
                        p.strokeWeight(0.5);
                        p.line(particle.x, particle.y, other.x, other.y);
                    }
                });
            });
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
}

// 打字机效果
function initTypingEffect() {
    const titleElement = document.getElementById('hero-title');
    if (!titleElement) return;
    
    const text = titleElement.textContent;
    titleElement.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        } else {
            // 打字完成后移除光标效果
            setTimeout(() => {
                titleElement.classList.remove('typing-effect');
            }, 2000);
        }
    };
    
    // 延迟开始打字效果
    setTimeout(typeWriter, 1000);
}

// 滚动效果
function initScrollEffects() {
    // 滚动时显示元素
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // 观察所有卡片元素
    document.querySelectorAll('.card-hover').forEach(card => {
        observer.observe(card);
    });
    
    // 成就徽章动画
    const badges = document.querySelectorAll('.achievement-badge');
    badges.forEach((badge, index) => {
        setTimeout(() => {
            badge.classList.add('animate-bounce');
        }, index * 500);
    });
}

// 技能项目点击效果
document.addEventListener('click', function(e) {
    if (e.target.closest('.skill-item')) {
        const item = e.target.closest('.skill-item');
        
        // 创建涟漪效果
        const ripple = document.createElement('div');
        ripple.className = 'absolute inset-0 bg-blue-100 rounded-lg opacity-0';
        item.style.position = 'relative';
        item.appendChild(ripple);
        
        anime({
            targets: ripple,
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.2],
            duration: 600,
            easing: 'easeOutQuad',
            complete: () => {
                ripple.remove();
            }
        });
    }
});

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    .animate-fade-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-bounce {
        animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0, -10px, 0);
        }
        70% {
            transform: translate3d(0, -5px, 0);
        }
        90% {
            transform: translate3d(0, -2px, 0);
        }
    }
`;
document.head.appendChild(style);