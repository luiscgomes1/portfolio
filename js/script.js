async function carregarDadosPerfil() {
    try {
        const resposta = await fetch('data/dados-perfil.json');
        const dados = await resposta.json();

        preencherInformacoesPessoais(dados);
        preencherLinksSociais(dados.linksSociais);
        preencherLinguagens(dados.linguagens);
        preencherExperiencias(dados.experiencias);
        preencherProjetos(dados.projetos);
        iniciarAnimacoes();

    } catch (erro) {
        console.error('Erro ao carregar dados do perfil:', erro);
    }
}

async function preencherInformacoesPessoais(dados) {
    const nome = document.querySelector('#nome');
    const descricao = document.querySelector('#bio');
    const foto = document.querySelector('#foto-perfil');

    await digitarTexto(nome, dados.nome);
    descricao.textContent = dados.descricao;
    foto.src = dados.foto;

}

function preencherLinksSociais(linksSociais) {
    const socialLinks = document.querySelector('#links-sociais');
    const linksSociaisContato = document.querySelector('#links-sociais-contato');

    socialLinks.innerHTML = '';
    linksSociaisContato.innerHTML = '';

    linksSociais.forEach(social => {
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
        socialLinks.appendChild(a.cloneNode(true));
        linksSociaisContato.appendChild(a);
    });

    const emailContato = document.querySelector('#contato .col-md-6');
    const emailSocial = linksSociais.find(s => s.nome.toLowerCase() === 'email');
    const whatsappSocial = linksSociais.find(s => s.nome.toLowerCase() === 'whatsapp');

    emailContato.innerHTML = `
            <ul class="list-unstyled">
            <li><i class="bi bi-${emailSocial.icone} me-2"></i>Email: ${emailSocial.url}</li>
            <li><i class="bi bi-${whatsappSocial.icone} me-2"></i>WhatsApp: ${whatsappSocial.url.replace(/(\d{2})(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3 $4-$5')}</li>
            </ul>
            <div class="contato-separator d-none d-md-block"></div>
        `;
}

function preencherLinguagens(linguagens) {
    const listaLinguagens = document.querySelector('#lista-linguagens');

    linguagens.forEach(linguagem => {
        let nivelWidth = '33%';
        let nivelClass = 'nivel-basico';

        switch (linguagem.nivel.toLowerCase()) {
            case 'básico':
                nivelWidth = '33%';
                nivelClass = 'nivel-basico';
                break;
            case 'intermediário':
                nivelWidth = '66%';
                nivelClass = 'nivel-intermediario';
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
}

function converterData(dataStr) {
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(ano, mes - 1, dia);
}

function preencherExperiencias(experiencias) {
    const listaExperiencias = document.querySelector('#lista-experiencias');

    experiencias.sort((a,b) => {
        const dataFinalA = converterData(a.periodo.split(' - ')[1]);
        const dataFinalB = converterData(b.periodo.split(' - ')[1]);
        return dataFinalB - dataFinalA;
    }).forEach(experiencia => {
        const elementoExperiencia = document.createElement('div');
        elementoExperiencia.className = 'fade-in';
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
}

function preencherProjetos(projetos) {
    const listaProjetos = document.querySelector('#lista-projetos');
    const indicadoresProjetos = document.querySelector('#indicadores-projetos');

    projetos.forEach((projeto, index) => {
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