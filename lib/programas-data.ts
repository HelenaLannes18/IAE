// ---------------------------------------------------------------
// Dados dos programas — IAE (Instituto de Advocacia Empresarial)
// Fonte: IAE_Paginas_de_Curso.md (v1.0, julho de 2026)
//
// REGRAS DE MARCA aplicadas aqui:
// - credenciais sempre nominais
// - sem vocabulário de infoproduto
// - posicionamento por afirmação
// - Daniela Vilhena e José Guilherme Costa NÃO entram no corpo docente
//   até consentimento formal por escrito (ver ANEXO B, item 2)
// ---------------------------------------------------------------

export type ProgramaStatus = "confirmado" | "lista-de-espera";

export interface FaqItem {
    pergunta: string;
    resposta: string;
}

export interface InfoGeral {
    label: string;
    valor: string;
}

export interface EstruturaBloco {
    titulo: string;
    encontros: string[];
}

export interface Docente {
    nome: string;
    credencial: string;
}

export interface Diferencial {
    titulo: string;
    texto: string;
}

export interface ParaQuemPerfil {
    titulo: string;
    texto: string;
}

export interface Programa {
    slug: string;
    numero: number;
    /** false = não deve ser roteado/publicado ainda (ver nota no próprio objeto) */
    publicavel: boolean;
    status: ProgramaStatus;
    seo: {
        titleTag: string;
        metaDescription: string;
        keywordPrincipal: string;
        secundarias: string[];
        caudaLonga: string[];
    };
    h1: string;
    posicionamento: string;
    ctaPrimario: string;
    sobre: string[];
    paraQuemE: {
        perfis: ParaQuemPerfil[];
        complemento?: string;
    };
    competencias: string[];
    cargaHorariaResumo: string;
    estrutura: EstruturaBloco[];
    metodologia: string[];
    corpoDocente: Docente[];
    infoGerais: InfoGeral[];
    blocoCaptura?: string;
    diferenciais: Diferencial[];
    faq: FaqItem[];
}

// ---------------------------------------------------------------
// 1. Gestão do Departamento Jurídico
// ---------------------------------------------------------------
const gestaoDepartamentoJuridico: Programa = {
    slug: "gestao-do-departamento-juridico",
    numero: 1,
    publicavel: true,
    status: "confirmado",
    seo: {
        titleTag: "Curso de Gestão do Departamento Jurídico | IAE Rio de Janeiro",
        metaDescription:
            "Programa executivo presencial no Rio de Janeiro para advogados que querem estruturar e liderar departamentos jurídicos. 24 horas, turmas reduzidas. Inscrições abertas.",
        keywordPrincipal: "curso de gestão do departamento jurídico",
        secundarias: [
            "gestão jurídica empresarial",
            "curso para advogado in-house",
            "departamento jurídico corporativo",
            "liderança jurídica",
            "curso jurídico Rio de Janeiro",
        ],
        caudaLonga: [
            "como estruturar um departamento jurídico",
            "orçamento de departamento jurídico",
            "métricas jurídicas",
            "KPI jurídico",
            "curso para head of legal",
        ],
    },
    h1: "Gestão do Departamento Jurídico",
    posicionamento:
        "Um programa executivo para advogados que vão estruturar, gerir e liderar áreas jurídicas dentro das empresas.",
    ctaPrimario: "Quero minha vaga",
    sobre: [
        "O departamento jurídico ocupa posição estratégica na estrutura das organizações. Suas decisões influenciam gestão de riscos, custos institucionais, governança e a tomada de decisão empresarial como um todo.",
        "Além de interpretar normas, o jurídico corporativo coordena fluxos decisórios, faz interface com as demais áreas da empresa, previne passivos e constrói estruturas mais eficientes. Compreender a lógica empresarial da gestão jurídica significa entender como estrutura, processos, orçamento e informação condicionam a eficiência do departamento e sua capacidade de gerar valor.",
        "O Programa Executivo em Gestão do Departamento Jurídico forma profissionais capazes de estruturar, gerir e desenvolver departamentos jurídicos de forma estratégica, integrando governança, controle de custos, métricas de desempenho e processos institucionais.",
    ],
    paraQuemE: {
        perfis: [
            {
                titulo: "Advogados de escritório que pretendem migrar para o jurídico interno.",
                texto: "A transição para o in-house exige um repertório que a advocacia contenciosa e consultiva não desenvolve: orçamento, indicadores, coordenação com áreas de negócio e gestão de escritórios externos. Este programa entrega esse repertório.",
            },
            {
                titulo: "Advogados já em departamentos jurídicos que buscam posições sênior.",
                texto: "A passagem de especialista técnico para gestor de área é o ponto em que a maioria das carreiras in-house trava. O programa trabalha justamente as competências que definem essa passagem.",
            },
        ],
        complemento:
            "Também é adequado a sócios de escritórios que atendem departamentos jurídicos e querem compreender a lógica de decisão do cliente.",
    },
    competencias: [
        "Ler o departamento jurídico como estrutura institucional dentro da empresa, identificando papéis, fluxos decisórios e formas de integração com as demais áreas.",
        "Estruturar e gerir orçamento jurídico, com critérios objetivos de alocação de recursos.",
        "Definir critérios de internalização e terceirização de demandas.",
        "Construir e gerir a relação com escritórios externos, incluindo modelos de honorários, avaliação de desempenho e controle de custo.",
        "Definir indicadores de desempenho do jurídico e reportá-los à diretoria em linguagem de negócio.",
        "Organizar processos internos, fluxos de informação e priorização de demandas.",
        "Avaliar e implantar ferramentas de tecnologia e inteligência artificial aplicadas ao departamento.",
        "Sustentar posições jurídicas em discussões estratégicas com áreas de negócio, finanças e alta administração.",
    ],
    cargaHorariaResumo: "Oito encontros de três horas, com progressão de fundamentos para aplicação.",
    estrutura: [
        {
            titulo: "Bloco I — Organização",
            encontros: [
                "O departamento jurídico na estrutura da empresa: papéis, mandato e posicionamento institucional",
                "Desenho de fluxos, priorização de demandas e relação com as áreas de negócio",
            ],
        },
        {
            titulo: "Bloco II — Governança",
            encontros: [
                "Orçamento jurídico: construção, defesa e acompanhamento",
                "Escritórios externos: critérios de seleção, modelos de honorários e avaliação",
                "Métricas e indicadores: o que medir e como reportar",
                "Dados, tecnologia e inteligência artificial no jurídico",
            ],
        },
        {
            titulo: "Bloco III — Aplicação",
            encontros: [
                "Casos práticos: decisões de estrutura e alocação de recursos",
                "Simulação decisória: apresentação do jurídico à alta administração",
            ],
        },
    ],
    metodologia: [
        "Cada encontro combina exposição estruturada, análise aplicada e debate técnico qualificado, em dinâmica que respeita a agenda de profissionais em exercício.",
        "O formato presencial favorece a interação entre advogados que atuam em setores estratégicos da economia, criando ambiente qualificado para troca de experiências e para o fortalecimento de rede profissional dentro e fora da sala de aula.",
        "Turmas reduzidas. A discussão de casos exige que todos os participantes falem.",
    ],
    corpoDocente: [
        {
            nome: "Gustavo Costa",
            credencial:
                "Presidente do Instituto de Advocacia Empresarial. Construiu toda a carreira no jurídico interno: 28 anos na White Martins, do grupo Linde, onde entrou como advogado júnior e chegou a Head of Legal para a América do Sul, com 17 anos como executivo e diretor estatutário. Sob sua liderança, o departamento foi reconhecido em 2024 como o melhor do setor químico e petroquímico. Mestre em Direito Regulatório pela FGV. Autor de Tchau, crachá! (2025).",
        },
        {
            nome: "Rodrigo Gadben",
            credencial: "Coordenador acadêmico do IAE. Doutor em regulação pela FGV.",
        },
    ],
    infoGerais: [
        { label: "Carga horária", valor: "24 horas — 8 encontros de 3 horas" },
        { label: "Formato", valor: "Presencial" },
        { label: "Local", valor: "Instituto de Advocacia Empresarial — Rua São José, 40, Centro, Rio de Janeiro/RJ" },
        { label: "Dia", valor: "Quintas-feiras" },
        { label: "Horário", valor: "18h30 às 21h30" },
        { label: "Início", valor: "Outubro de 2026" },
        { label: "Certificado", valor: "Certificado de programa executivo emitido pelo IAE" },
        { label: "Vagas", valor: "Turma reduzida" },
    ],
    diferenciais: [
        {
            titulo: "Compreensão organizacional do jurídico.",
            texto: "O departamento é analisado como estrutura institucional dentro da empresa, com papéis, fluxos decisórios, responsabilidades e coordenação entre áreas.",
        },
        {
            titulo: "Aplicação direta à prática corporativa.",
            texto: "Organização do jurídico interno, relação com escritórios externos, gestão de demandas e controle de budget.",
        },
        {
            titulo: "Desenvolvimento de capacidade decisória.",
            texto: "Internalização ou terceirização, priorização de recursos, gestão estratégica de riscos.",
        },
        {
            titulo: "Abordagem multidisciplinar.",
            texto: "Direito, gestão, finanças e governança corporativa.",
        },
        {
            titulo: "Professores que ocupam o cargo.",
            texto: "O corpo docente é formado por profissionais que dirigem departamentos jurídicos hoje, em grandes empresas.",
        },
        {
            titulo: "Temas contemporâneos.",
            texto: "Inteligência artificial aplicada ao jurídico, gestão de dados sensíveis e uso de tecnologia na organização de fluxos e decisões.",
        },
    ],
    faq: [
        {
            pergunta: "Preciso já trabalhar em departamento jurídico para fazer o curso?",
            resposta:
                "Não. O programa atende tanto advogados que atuam em escritórios e pretendem migrar para o jurídico interno quanto profissionais já dentro de departamentos jurídicos.",
        },
        {
            pergunta: "O curso é uma pós-graduação?",
            resposta:
                "É um programa executivo de 24 horas, com certificado emitido pelo IAE. O formato é o de educação executiva, voltado a profissionais em exercício.",
        },
        {
            pergunta: "As aulas são presenciais ou online?",
            resposta:
                "Presenciais, na Rua São José, 40, no Centro do Rio de Janeiro. O formato presencial é uma escolha: parte relevante do valor do programa está na troca entre os participantes.",
        },
        {
            pergunta: "Qual é o horário?",
            resposta: "Quintas-feiras, das 18h30 às 21h30, ao longo de oito semanas.",
        },
        {
            pergunta: "Há material didático?",
            resposta: "Sim. Cada encontro tem material próprio, com casos e instrumentos aplicáveis diretamente ao trabalho.",
        },
        {
            pergunta: "A empresa pode pagar pela inscrição?",
            resposta: "Sim. Emitimos nota fiscal e documentação para reembolso ou pagamento direto pela empresa.",
        },
    ],
};

// ---------------------------------------------------------------
// 2. Direito Regulatório
// ---------------------------------------------------------------
const direitoRegulatorio: Programa = {
    slug: "direito-regulatorio",
    numero: 2,
    publicavel: true,
    status: "confirmado",
    seo: {
        titleTag: "Curso de Direito Regulatório para Advogados | IAE Rio",
        metaDescription:
            "Programa executivo presencial em direito regulatório para advogados de empresa. Agências reguladoras, risco normativo e decisão empresarial. 24 horas, Rio de Janeiro.",
        keywordPrincipal: "curso de direito regulatório",
        secundarias: [
            "direito regulatório empresarial",
            "agências reguladoras curso",
            "risco regulatório",
            "curso de regulação para advogados",
            "direito administrativo econômico",
        ],
        caudaLonga: [
            "curso de direito regulatório presencial Rio de Janeiro",
            "compliance regulatório para advogado in-house",
            "como funciona a regulação setorial no Brasil",
        ],
    },
    h1: "Direito Regulatório",
    posicionamento:
        "Um programa executivo para advogados que precisam ler o ambiente regulatório e transformá-lo em decisão empresarial.",
    ctaPrimario: "Quero minha vaga",
    sobre: [
        "Setores inteiros da economia brasileira são organizados por decisões de agências reguladoras. Energia, saúde, telecomunicações, transporte, serviços financeiros, saneamento, mineração: em cada um deles, uma decisão normativa redefine margens, viabiliza ou inviabiliza projetos e altera o valor de contratos de longo prazo.",
        "Para o advogado de empresa, isso significa que a leitura regulatória deixou de ser especialidade setorial e passou a ser competência de base. Antecipar movimentos de agência, dimensionar risco normativo e traduzir isso em recomendação de negócio é o que separa o parecer técnico da contribuição estratégica.",
        "O Programa Executivo em Direito Regulatório articula bases constitucionais, teoria econômica e governança institucional para formar advogados capazes de compreender a regulação como elemento estruturante do mercado.",
    ],
    paraQuemE: {
        perfis: [
            {
                titulo: "Advogados de escritório que pretendem migrar para o jurídico interno,",
                texto: "especialmente em setores regulados, onde o domínio regulatório é o principal critério de contratação.",
            },
            {
                titulo: "Advogados já em departamentos jurídicos que buscam posições sênior",
                texto: "e precisam participar de discussões de projeto, expansão e contingência normativa de alto impacto.",
            },
        ],
        complemento:
            "Também é adequado a profissionais de compliance, relações institucionais e assuntos regulatórios com formação jurídica.",
    },
    competencias: [
        "Compreender as bases constitucionais e econômicas da regulação e os limites da intervenção estatal na atividade privada.",
        "Interpretar decisões regulatórias dentro de seu contexto econômico e institucional.",
        "Antecipar tendências normativas e identificar janelas de oportunidade e de risco.",
        "Avaliar impacto regulatório sobre projetos, contratos e investimentos.",
        "Estruturar respostas institucionais a consultas públicas, fiscalizações e processos sancionadores.",
        "Integrar governança regulatória à estratégia empresarial.",
        "Posicionar-se em discussões com áreas de negócio, diretoria e conselho sobre risco normativo.",
        "Trabalhar temas em formação: inteligência artificial, criptoativos, ESG e regulação adaptativa.",
    ],
    cargaHorariaResumo: "Oito encontros de três horas, com progressão de fundamentos para aplicação.",
    estrutura: [
        {
            titulo: "Bloco I — Fundamentos",
            encontros: [
                "Ordem econômica constitucional e os fundamentos da intervenção do Estado",
                "Teoria econômica da regulação: falhas de mercado, captura e desenho de incentivos",
            ],
        },
        {
            titulo: "Bloco II — Institucional",
            encontros: [
                "O Estado Regulador brasileiro: agências, competências e limites",
                "Processo regulatório: consulta pública, análise de impacto e participação institucional",
                "Controle da regulação: judiciário, tribunais de contas e revisão de decisões",
                "Governança regulatória dentro da empresa: estrutura, monitoramento e resposta",
            ],
        },
        {
            titulo: "Bloco III — Aplicação",
            encontros: [
                "Casos setoriais: leitura de decisões regulatórias e seus efeitos empresariais",
                "Simulação decisória: recomendação de negócio diante de mudança normativa",
            ],
        },
    ],
    metodologia: [
        "Cada encontro combina exposição estruturada, análise aplicada e debate técnico qualificado.",
        "A estrutura progressiva permite consolidar fundamentos, compreender a lógica da regulação e aplicar o raciocínio regulatório a cenários empresariais concretos.",
        "O formato presencial reúne advogados de setores regulados distintos — e boa parte do aprendizado vem dessa diferença de repertório na sala.",
    ],
    corpoDocente: [
        {
            nome: "Rodrigo Gadben",
            credencial: "Coordenador acadêmico do IAE. Doutor em regulação pela FGV.",
        },
        {
            nome: "Gustavo Costa",
            credencial:
                "Presidente do IAE. Mestre em Direito Regulatório pela FGV. Foram 28 anos na White Martins, do grupo Linde, de advogado júnior a Head of Legal para a América do Sul, com 17 anos como executivo e diretor estatutário. Em 2024, o departamento sob sua liderança foi reconhecido como o melhor do setor químico e petroquímico. Autor de Tchau, crachá! (2025).",
        },
    ],
    infoGerais: [
        { label: "Carga horária", valor: "24 horas — 8 encontros de 3 horas" },
        { label: "Formato", valor: "Presencial" },
        { label: "Local", valor: "Instituto de Advocacia Empresarial — Rua São José, 40, Centro, Rio de Janeiro/RJ" },
        { label: "Dia", valor: "Quintas-feiras" },
        { label: "Horário", valor: "18h30 às 21h30" },
        { label: "Início", valor: "Outubro de 2026" },
        { label: "Certificado", valor: "Certificado de programa executivo emitido pelo IAE" },
        { label: "Vagas", valor: "Turma reduzida" },
    ],
    diferenciais: [
        {
            titulo: "Compreensão estrutural.",
            texto: "Constituição, teoria econômica e governança institucional articuladas, com a regulação tratada como elemento estruturante do mercado.",
        },
        {
            titulo: "Aplicação direta à prática in-house.",
            texto: "Gestão de risco, previsibilidade normativa e decisão integrada ao negócio.",
        },
        {
            titulo: "Julgamento estratégico.",
            texto: "Maturidade decisória diante de tensões institucionais complexas: eficiência e legitimidade, inovação e segurança jurídica, intervenção e liberdade econômica.",
        },
        {
            titulo: "Abordagem multidisciplinar.",
            texto: "Direito, economia e políticas públicas.",
        },
        {
            titulo: "Temas contemporâneos.",
            texto: "Inteligência artificial, criptoativos, ESG e regulação adaptativa.",
        },
    ],
    faq: [
        {
            pergunta: "O curso é focado em algum setor específico?",
            resposta:
                "Não. A estrutura é transversal: os fundamentos e o método de análise se aplicam a qualquer setor regulado. Os casos discutidos cobrem setores diferentes, e a diversidade da turma faz parte do desenho.",
        },
        {
            pergunta: "Preciso ter formação em direito administrativo?",
            resposta: "Não. O programa constrói os fundamentos necessários nos dois primeiros encontros.",
        },
        {
            pergunta: "Qual a diferença entre este programa e uma pós-graduação em direito regulatório?",
            resposta:
                "A pós-graduação tem foco acadêmico e duração longa. Este é um programa executivo de 24 horas, orientado à aplicação empresarial e conduzido por profissionais que atuam no mercado.",
        },
        {
            pergunta: "As aulas são presenciais?",
            resposta: "Sim, na Rua São José, 40, no Centro do Rio de Janeiro, às quintas-feiras, das 18h30 às 21h30.",
        },
        {
            pergunta: "Posso cursar mais de um programa do IAE?",
            resposta: "Sim. Os programas são independentes e complementares.",
        },
        {
            pergunta: "A empresa pode pagar pela inscrição?",
            resposta: "Sim. Emitimos nota fiscal e a documentação necessária.",
        },
    ],
};

// ---------------------------------------------------------------
// 3. Direito Tributário (turma não confirmada → lista de espera)
// ---------------------------------------------------------------
const direitoTributario: Programa = {
    slug: "direito-tributario",
    numero: 3,
    publicavel: true,
    status: "lista-de-espera",
    seo: {
        titleTag: "Curso de Direito Tributário Empresarial | IAE Rio de Janeiro",
        metaDescription:
            "Programa executivo em direito tributário para advogados de empresa: reforma do consumo, risco fiscal e governança tributária. Entre na lista de espera do IAE.",
        keywordPrincipal: "curso de direito tributário empresarial",
        secundarias: [
            "direito tributário para advogado in-house",
            "governança tributária",
            "risco fiscal",
            "reforma tributária do consumo curso",
            "planejamento tributário empresarial",
        ],
        caudaLonga: [
            "curso de reforma tributária para advogados",
            "gestão de contencioso tributário",
            "como estruturar governança fiscal na empresa",
        ],
    },
    h1: "Direito Tributário",
    posicionamento: "Um programa executivo para advogados que tratam a tributação como variável de decisão empresarial.",
    ctaPrimario: "Entrar na lista de espera",
    sobre: [
        "A carga tributária influencia preços, margens, investimentos e decisões estratégicas em praticamente todos os setores da economia. Decisões tributárias moldam mercados, redirecionam investimentos e redefinem estruturas empresariais.",
        "Compreender a lógica empresarial da tributação vai além da interpretação da norma fiscal: envolve entender como decisões tributárias moldam estruturas de custo, influenciam a competitividade e condicionam a viabilidade econômica dos negócios.",
        "Em um país que atravessa a maior reformulação de seu sistema de tributação sobre o consumo em décadas, esse repertório se tornou requisito de participação nas discussões que definem o rumo das empresas.",
    ],
    paraQuemE: {
        perfis: [
            {
                titulo: "Advogados de escritório que pretendem migrar para o jurídico interno",
                texto: "e precisam substituir a lógica de tese pela lógica de gestão de risco fiscal.",
            },
            {
                titulo: "Advogados já em departamentos jurídicos que buscam posições sênior",
                texto: "e participam de decisões de estrutura societária, precificação e investimento.",
            },
        ],
        complemento:
            "Também é adequado a advogados que atuam com contencioso tributário e desejam ampliar repertório consultivo e de governança.",
    },
    competencias: [
        "Compreender a estrutura constitucional do sistema tributário e os limites da intervenção estatal.",
        "Ler a tributação como variável de gestão: efeito sobre preços, margens e fluxo de caixa.",
        "Avaliar impacto tributário sobre decisões de investimento e estrutura de negócios.",
        "Acompanhar e dimensionar os efeitos da reforma da tributação sobre o consumo.",
        "Estruturar controles internos e governança fiscal.",
        "Gerir risco tributário e prevenir passivos.",
        "Organizar a relação entre jurídico, contabilidade e finanças.",
        "Sustentar posições tributárias em discussões com diretoria e conselho.",
    ],
    cargaHorariaResumo: "Oito encontros de três horas.",
    estrutura: [
        {
            titulo: "Bloco I — Fundamentos",
            encontros: [
                "Estrutura constitucional do sistema tributário e ordem econômica",
                "Sistema tributário brasileiro: arquitetura, competências e conflitos",
            ],
        },
        {
            titulo: "Bloco II — Institucional",
            encontros: [
                "Reforma da tributação sobre o consumo: desenho, transição e efeitos empresariais",
                "Tributação como variável de gestão: preços, margens e fluxo de caixa",
                "Governança e conformidade tributária: controles internos e prevenção de passivos",
                "Contencioso administrativo e judicial: critérios de decisão e provisionamento",
            ],
        },
        {
            titulo: "Bloco III — Aplicação",
            encontros: [
                "Casos práticos: impacto fiscal sobre decisões empresariais",
                "Simulação decisória: recomendação tributária à alta administração",
            ],
        },
    ],
    metodologia: [
        "Exposição estruturada, análise aplicada e debate técnico qualificado, em oito encontros presenciais desenhados para profissionais em exercício.",
    ],
    corpoDocente: [],
    infoGerais: [
        { label: "Carga horária", valor: "24 horas — 8 encontros de 3 horas" },
        { label: "Formato", valor: "Presencial" },
        { label: "Local", valor: "Instituto de Advocacia Empresarial — Rua São José, 40, Centro, Rio de Janeiro/RJ" },
        { label: "Próxima turma", valor: "A definir" },
        { label: "Certificado", valor: "Certificado de programa executivo emitido pelo IAE" },
    ],
    blocoCaptura:
        "Entre na lista de espera e receba em primeira mão a data de abertura da próxima turma e as condições do primeiro lote.",
    diferenciais: [
        {
            titulo: "Compreensão estrutural.",
            texto: "Constituição, economia e organização do sistema tributário articuladas.",
        },
        {
            titulo: "Aplicação direta à prática in-house.",
            texto: "Gestão de risco fiscal, previsibilidade tributária e decisão estratégica.",
        },
        {
            titulo: "Julgamento estratégico.",
            texto: "Arrecadação e competitividade, eficiência econômica e segurança jurídica, planejamento e risco fiscal.",
        },
        {
            titulo: "Abordagem multidisciplinar.",
            texto: "Direito, economia, contabilidade e gestão empresarial.",
        },
        {
            titulo: "Governança tributária.",
            texto: "Instrumentos de governança fiscal, controles internos e estruturas de gestão de risco.",
        },
    ],
    faq: [
        {
            pergunta: "Quando abre a próxima turma?",
            resposta: "A data será anunciada em primeira mão para quem estiver na lista de espera.",
        },
        {
            pergunta: "O programa cobre a reforma tributária?",
            resposta:
                "Sim. A reformulação da tributação sobre o consumo é um dos eixos centrais, tratada pelos seus efeitos concretos sobre as empresas.",
        },
        {
            pergunta: "Preciso ser especialista em tributário?",
            resposta:
                "Não. O programa é dirigido ao advogado empresarial que precisa dominar a variável tributária na decisão, não apenas ao especialista.",
        },
    ],
};

export const PROGRAMAS: Programa[] = [gestaoDepartamentoJuridico, direitoRegulatorio, direitoTributario];

// ---------------------------------------------------------------
// 4. Direito do Trabalho Empresarial
//
// NÃO PUBLICAR. O próprio documento do cliente marca esta página como
// proposta não validada: "não há ementa aprovada, coordenação definida
// nem professor confirmado [...] precisa da validação de Gustavo Costa
// e Rodrigo Gadben antes de qualquer publicação". Mantido aqui como
// rascunho para revisão interna — publicavel: false impede que o hub
// e as rotas dinâmicas exponham esta página. Ver ANEXO B, item 6.
// ---------------------------------------------------------------
export const PROGRAMA_PROPOSTA_TRABALHISTA: Programa = {
    slug: "direito-do-trabalho-empresarial",
    numero: 4,
    publicavel: false,
    status: "lista-de-espera",
    seo: {
        titleTag: "Curso de Direito do Trabalho Empresarial | IAE Rio de Janeiro",
        metaDescription:
            "Programa executivo em direito do trabalho para advogados de empresa: passivo trabalhista, terceirização, negociação sindical e gestão de contencioso. IAE, Rio.",
        keywordPrincipal: "curso de direito do trabalho empresarial",
        secundarias: [
            "direito trabalhista para advogado in-house",
            "gestão de passivo trabalhista",
            "curso de compliance trabalhista",
            "negociação coletiva empresa",
        ],
        caudaLonga: [
            "como reduzir passivo trabalhista na empresa",
            "terceirização e responsabilidade trabalhista",
            "gestão de contencioso trabalhista em massa",
        ],
    },
    h1: "Direito do Trabalho Empresarial",
    posicionamento: "Um programa executivo para advogados que gerem risco trabalhista dentro das empresas.",
    ctaPrimario: "Entrar na lista de espera",
    sobre: [
        "Poucas áreas produzem impacto financeiro tão direto e tão recorrente quanto a trabalhista. Passivo em massa, provisionamento, terceirização, negociação coletiva, modelos de contratação em transformação: cada uma dessas frentes chega ao departamento jurídico como número no balanço antes de chegar como tese.",
        "O advogado que atua dentro da empresa precisa transitar entre o processo individual e a política institucional — entender por que o passivo se forma, onde ele se forma e o que muda a curva. Isso exige leitura conjunta de direito, gestão de pessoas, finanças e desenho de processo interno.",
        "O Programa Executivo em Direito do Trabalho Empresarial forma advogados capazes de tratar a matéria trabalhista como frente de gestão de risco e de custo dentro da organização.",
    ],
    paraQuemE: {
        perfis: [
            {
                titulo: "Advogados de escritório que pretendem migrar para o jurídico interno",
                texto: "e precisam passar da lógica de peça processual para a de prevenção estrutural.",
            },
            {
                titulo: "Advogados já em departamentos jurídicos que buscam posições sênior",
                texto: "e respondem por provisionamento, política de acordos e interface com recursos humanos.",
            },
        ],
        complemento: "Também é adequado a profissionais de recursos humanos e compliance com formação jurídica.",
    },
    competencias: [
        "Identificar as origens estruturais do passivo trabalhista dentro da empresa.",
        "Construir política de acordos e critérios objetivos de provisionamento.",
        "Gerir contencioso trabalhista em volume, com indicadores e curva de resultado.",
        "Avaliar risco em modelos de contratação, terceirização e trabalho por plataforma.",
        "Preparar e conduzir negociação coletiva com visão de custo e de relação de longo prazo.",
        "Estruturar compliance trabalhista: saúde e segurança, jornada e fiscalização.",
        "Articular a relação entre jurídico, recursos humanos e finanças.",
        "Reportar exposição trabalhista à alta administração em linguagem de negócio.",
    ],
    cargaHorariaResumo: "Oito encontros de três horas.",
    estrutura: [
        {
            titulo: "Bloco I — Fundamentos",
            encontros: [
                "O risco trabalhista na estrutura de custo da empresa",
                "Modelos de contratação e vínculo: fronteiras, tendências e exposição",
            ],
        },
        {
            titulo: "Bloco II — Institucional",
            encontros: [
                "Terceirização e responsabilidade na cadeia",
                "Gestão de contencioso em volume: provisionamento, política de acordo e indicadores",
                "Negociação coletiva e relação sindical",
                "Compliance trabalhista: jornada, saúde e segurança, fiscalização",
            ],
        },
        {
            titulo: "Bloco III — Aplicação",
            encontros: [
                "Casos práticos: formação e redução de passivo",
                "Simulação decisória: exposição trabalhista apresentada à diretoria",
            ],
        },
    ],
    metodologia: ["Exposição estruturada, análise aplicada e debate técnico qualificado, em oito encontros presenciais."],
    corpoDocente: [],
    infoGerais: [
        { label: "Carga horária", valor: "24 horas — 8 encontros de 3 horas" },
        { label: "Formato", valor: "Presencial" },
        { label: "Local", valor: "Instituto de Advocacia Empresarial — Rua São José, 40, Centro, Rio de Janeiro/RJ" },
        { label: "Próxima turma", valor: "A definir" },
        { label: "Certificado", valor: "Certificado de programa executivo emitido pelo IAE" },
    ],
    diferenciais: [],
    faq: [
        {
            pergunta: "Quando abre a próxima turma?",
            resposta: "A data será anunciada em primeira mão para quem estiver na lista de espera.",
        },
        {
            pergunta: "O curso é voltado ao contencioso?",
            resposta:
                "O contencioso é tratado como frente de gestão — política de acordos, provisionamento e indicadores — e não como técnica processual.",
        },
        {
            pergunta: "Preciso atuar exclusivamente com trabalhista?",
            resposta: "Não. O programa é dirigido ao advogado empresarial que responde por exposição trabalhista dentro da empresa.",
        },
    ],
};

export function getProgramaBySlug(slug: string): Programa | undefined {
    return PROGRAMAS.find((p) => p.slug === slug && p.publicavel);
}

// Imagens por programa (chave = `numero`). Escolhidas por não conterem
// pessoas — regra de marca do documento. São placeholders de arquitetura/
// biblioteca jurídica; trocar pelas fotos reais da sede quando houver ensaio.
// Compartilhado entre o hub (/programas) e a página de detalhe ([slug]).
export const IMAGENS_PROGRAMA: Record<number, string> = {
    1: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?q=80&w=1920",
    2: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1920",
    3: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1920",
};