// styles-manager.js
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. GERENCIADOR DE TEMAS - Alternar entre temas claros/escuros
    const themeToggle = document.createElement('button');
    themeToggle.textContent = 'Alternar Tema';
    themeToggle.classList.add('theme-toggle');
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: #333;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    `;
    document.body.appendChild(themeToggle);

    let isDarkTheme = false;
    
    themeToggle.addEventListener('click', function() {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle('dark-theme', isDarkTheme);
        
        // Disparar evento para atualizar variáveis CSS
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: isDarkTheme ? 'dark' : 'light' } 
        }));
    });

    // 2. AJUSTE DINÂMICO DE LAYOUT
    function adjustLayout() {
        const width = window.innerWidth;
        const products = document.querySelector('.products');
        const productItems = document.querySelectorAll('.product-item');
        
        if (products) {
            if (width < 768) {
                products.style.gridTemplateColumns = '1fr';
            } else if (width < 1024) {
                products.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                products.style.gridTemplateColumns = 'repeat(4, 1fr)';
            }
        }

        // Ajustar tamanhos das imagens baseado na tela
        productItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                if (width < 768) {
                    img.style.maxWidth = '100%';
                } else {
                    img.style.maxWidth = '300px';
                }
            }
        });
    }

    window.addEventListener('resize', adjustLayout);
    adjustLayout(); // Executar no carregamento

    // 3. CARREGAR VARIÁVEIS SASS DINAMICAMENTE
    function loadSassVariables() {
        const root = document.documentElement;
        
        // Simular carregamento de variáveis SASS
        const sassVariables = {
            '--primary-color': getComputedStyle(document.body).getPropertyValue('--primary-color') || '#007bff',
            '--secondary-color': getComputedStyle(document.body).getPropertyValue('--secondary-color') || '#6c757d',
            '--font-family': "'Roboto', sans-serif"
        };
        
        // Aplicar variáveis
        Object.keys(sassVariables).forEach(variable => {
            root.style.setProperty(variable, sassVariables[variable]);
        });
    }
    
    loadSassVariables();

    // 4. GERENCIADOR DE ESTADOS DOS PRODUTOS
    const productButtons = document.querySelectorAll('.product-button');
    
    productButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'all 0.3s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Efeito de clique
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Obter informações do produto
            const productItem = this.closest('.product-item');
            const productName = productItem.querySelector('h4').textContent;
            
            // Mostrar modal simples
            showProductModal(productName);
        });
    });

    // 5. MODAL DE INFORMAÇÕES DO PRODUTO
    function showProductModal(productName) {
        // Remover modal existente
        const existingModal = document.querySelector('.product-modal');
        if (existingModal) existingModal.remove();

        // Criar modal
        const modal = document.createElement('div');
        modal.classList.add('product-modal');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            z-index: 2000;
            text-align: center;
            min-width: 300px;
        `;

        modal.innerHTML = `
            <h3>${productName}</h3>
            <p>Detalhes do produto em breve!</p>
            <button class="modal-close" style="
                margin-top: 20px;
                padding: 10px 30px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">Fechar</button>
        `;

        document.body.appendChild(modal);

        // Overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1999;
        `;
        overlay.classList.add('modal-overlay');
        document.body.appendChild(overlay);

        // Fechar modal
        const closeModal = () => {
            modal.remove();
            overlay.remove();
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    // 6. ANIMAÇÕES DE SCROLL
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.product-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease';
            observer.observe(element);
        });
    }

    handleScrollAnimations();

    // 7. BUSCA DE PRODUTOS
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        margin: 20px 0;
        text-align: center;
    `;
    
    searchContainer.innerHTML = `
        <input type="text" id="productSearch" placeholder="Buscar produtos..." style="
            padding: 10px;
            width: 300px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        ">
    `;

    const section = document.querySelector('section .container');
    section.insertBefore(searchContainer, section.querySelector('h2').nextSibling);

    document.getElementById('productSearch').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const products = document.querySelectorAll('.product-item');
        
        products.forEach(product => {
            const name = product.querySelector('h4').textContent.toLowerCase();
            const description = product.querySelector('p').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });

    // 8. CONTADOR DE PRODUTOS
    function updateProductCount() {
        const totalProducts = document.querySelectorAll('.product-item').length;
        const visibleProducts = document.querySelectorAll('.product-item[style*="display: block"], .product-item:not([style*="display: none"])').length;
        
        const counter = document.createElement('div');
        counter.classList.add('product-counter');
        counter.style.cssText = `
            margin: 10px 0;
            color: #666;
            font-size: 14px;
        `;
        counter.textContent = `Mostrando ${visibleProducts} de ${totalProducts} produtos`;
        
        const existingCounter = document.querySelector('.product-counter');
        if (existingCounter) existingCounter.remove();
        
        section.insertBefore(counter, section.querySelector('.products'));
    }

    // Atualizar contador quando buscar
    const searchInput = document.getElementById('productSearch');
    searchInput.addEventListener('input', updateProductCount);
    
    // Contador inicial
    setTimeout(updateProductCount, 100);
});
