
const _nav = [
    {
        name: 'Dashboard',
        to: '/dashboard',
        icon: <i className="bi bi-house fs-6 me-1"></i>,
    },
    {
        name: 'Menu',
        divider: true
    },
    {
        name: 'Avaliações',
        to: '/avaliacoes',
        icon: <i className="bi bi-activity fs-6 me-1"></i>,
    },
    {
        name: 'Treinos',
        to: '/treinos',
        icon: <i className="bi bi-clipboard-check fs-6 me-1"></i>,
    },
    {
        name: 'Cardápios',
        to: '/cardapios',
        icon: <i className="bi bi-book fs-6 me-1"></i>,
    },
    {
        name: 'Pagamentos',
        to: '/pagamentos',
        icon: <i className="bi bi-bank fs-6 me-1"></i>,
    },
    // {
    //     menu: true,
    //     name: 'Cadastros',
    //     icon: <i className="bi bi-list fs-6 me-1"></i>,
    //     items: [
    //         {
        
    //             name: 'Teste',
    //             icon: <i className="bi bi-box fs-6 me-1"></i>,
    //             to: '/teste',
    //         },
    //     ],
    // },
]

export default _nav;