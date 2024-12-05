async function carregarDadosPerfil() {
    try {
        const resposta = await fetch('dados-perfil.json');
        const dados = await resposta.json();
        
        const elementoNome = document.getElementById('nome');
        await digitarTexto(elementoNome, dados.nome);
        
        document.getElementById('titulo').textContent = dados.titulo;
        document.getElementById('bio').textContent = dados.bio;
        document.getElementById('foto-perfil').src = dados.foto;

        // Social Icons for main bio section
        const linksSociais = document.getElementById('links-sociais');
        const linksSociaisContato = document.getElementById('links-sociais-contato');
        
        // Limpar links existentes
        linksSociais.innerHTML = '';
        linksSociaisContato.innerHTML = '';

        // Criar links sociais
        dados.linksSociais.forEach(social => {
            let finalUrl = social.url;
            switch (social.nome.toLowerCase()) {
                case 'whatsapp':
                    finalUrl = `https://wa.me/${social.url}`;
                    break;
                case 'email':
                    finalUrl = `mailto:${social.url}`;
                    break;
            }

            const a = document.createElement('a');
            a.href = finalUrl;
            a.className = 'social-icon d-inline-flex align-items-center me-3 mb-2';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.innerHTML = `
                <i class="bi bi-${social.icone} me-2"></i>
                <span class="social-platform">${social.nome}</span>
            `;
            
            linksSociais.appendChild(a.cloneNode(true));
            linksSociaisContato.appendChild(a);
        });

        // Atualizar seção de contato
        const emailContato = document.querySelector('#contato .col-md-6');
        const emailSocial = dados.linksSociais.find(s => s.nome.toLowerCase() === 'email');
        const whatsappSocial = dados.linksSociais.find(s => s.nome.toLowerCase() === 'whatsapp');
        
        emailContato.innerHTML = `
            <ul class="list-unstyled">
            <li><i class="bi bi-${emailSocial.icone} me-2"></i>Email: ${emailSocial.url}</li>
            <li><i class="bi bi-${whatsappSocial.icone} me-2"></i>WhatsApp: ${whatsappSocial.url.replace(/(\d{2})(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3 $4-$5')}</li>
            </ul>
        `;

        const listaLinguagens = document.getElementById('lista-linguagens');
        dados.linguagens.forEach(linguagem => {
            let nivelWidth = '33%';
            let nivelClass = 'nivel-basico';
            
            switch(linguagem.nivel.toLowerCase()) {
            case 'básico':
            nivelWidth = '33%';
            nivelClass = 'nivel-basico';
            break;
            case 'médio':
            nivelWidth = '66%';
            nivelClass = 'nivel-medio';
            break;
            case 'avançado':
            nivelWidth = '100%';
            nivelClass = 'nivel-avancado';
            break;
            }

            const elementoLinguagem = document.createElement('div');
            elementoLinguagem.className = 'col-md-6 mb-4 fade-in';
            elementoLinguagem.innerHTML = `
            <div class="card linguagem-card">
            <div class="card-body">
                <img src="${linguagem.icone}" alt="${linguagem.nome}" class="linguagem-icon">
                <h5 class="card-title mb-3">${linguagem.nome}</h5>
                <div class="progress">
                <div class="progress-bar ${nivelClass}" role="progressbar" 
                    style="width: ${nivelWidth};" 
                    aria-valuenow="${nivelWidth}" aria-valuemin="0" aria-valuemax="100">
                </div>
                </div>
                <small class="nivel-texto mt-3 d-block">
                Conhecimento ${linguagem.nivel}
                </small>
            </div>
            </div>
            `;
            listaLinguagens.appendChild(elementoLinguagem);
        });

        const listaExperiencias = document.getElementById('lista-experiencias');
        dados.experiencias.forEach(experiencia => {
            const elementoExperiencia = document.createElement('div');
            elementoExperiencia.className = 'col fade-in';
            elementoExperiencia.innerHTML = `
                <div class="card experiencia-card">
                    <div class="card-body">
                        <h5 class="card-title">${experiencia.cargo}</h5>
                        <h6 class="experiencia-empresa">${experiencia.empresa}</h6>
                        <p class="experiencia-periodo"><i class="bi bi-calendar"></i> ${experiencia.periodo}</p>
                        <p class="card-text">${experiencia.descricao}</p>
                    </div>
                </div>
            `;
            listaExperiencias.appendChild(elementoExperiencia);
        });

        const listaProjetos = 
document.getElementById('lista-projetos');
        const indicadoresProjetos = document.getElementById('indicadores-projetos');
        
        dados.projetos.forEach((projeto, index) => {
            // Criar indicador
            const indicador = document.createElement('button');
            indicador.type = 'button';
            indicador.setAttribute('data-bs-target', '#carrossel-projetos');
            indicador.setAttribute('data-bs-slide-to', index.toString());
            if (index === 0) indicador.classList.add('active');
            indicadoresProjetos.appendChild(indicador);

            // Criar slide
            const elementoProjeto = document.createElement('div');
            elementoProjeto.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            elementoProjeto.innerHTML = `
                <div class="card">
                    <div class="card-body text-center">
                        <h3 class="card-title mb-4">${projeto.nome}</h3>
                        <p class="card-text mb-4">${projeto.descricao}</p>
                        <a href="${projeto.url}" class="btn btn-primary" target="_blank">
                            <i class="bi bi-eye"></i> Ver Projeto
                        </a>
                    </div>
                </div>
            `;
            listaProjetos.appendChild(elementoProjeto);
        });

        iniciarAnimacoes();

    } catch (erro) {
        console.error('Erro ao carregar dados do perfil:', erro);
    }
}

async function digitarTexto(elemento, texto) {
    let index = 0;
    elemento.textContent = '';
    
    while (index < texto.length) {
        elemento.textContent += texto.charAt(index);
        index++;
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    elemento.appendChild(cursor);
}

function iniciarAnimacoes() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function atualizarMenuAtivo() {
    const secoes = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    secoes.forEach(secao => {
        const topo = secao.offsetTop - 100;
        const id = secao.getAttribute('id');
        if (window.scrollY >= topo) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
            secao.classList.add('section-highlight');
        } else {
            secao.classList.remove('section-highlight');
        }
    });
}

function ajustarScrollMenu() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const offset = 80; // Ajuste conforme necessário
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosPerfil();
    window.addEventListener('scroll', atualizarMenuAtivo);
    ajustarScrollMenu();
});

