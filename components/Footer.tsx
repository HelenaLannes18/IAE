export default function Footer() {
    return (
        <footer className="bg-[#16243A] pt-20 pb-10 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
                <div className="col-span-2">
                    <div className="mb-6">
                        {/* Aqui entra a sua nova logo */}
                        <img
                            src="/logo.png"
                            alt="Logo IAE"
                            className="h-16 w-auto object-contain rounded-lg"
                        />
                    </div>
                    {/* Aproveitei para traduzir e alinhar o texto com o tema do IAE */}
                    <p className="text-gray-300 max-w-sm mb-6">
                        Conectando a técnica jurídica à realidade corporativa através de programas executivos de excelência.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-white">Páginas</h4>
                    <ul className="space-y-3 text-gray-300">
                        <li><a href="#" className="hover:text-white-500 transition-colors">Home</a></li>
                        <li><a href="#" className="hover:text-white-500 transition-colors">Quem Somos</a></li>
                        <li><a href="#" className="hover:text-white-500 transition-colors">Programas Executivos</a></li>
                        <li><a href="#" className="hover:text-white-500 transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-white -500 transition-colors">Contato</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-white">Programas</h4>
                    <ul className="space-y-3 text-gray-300">
                        <li><a href="#" className="hover:text-white-500 transition-colors">Direito Regulatório</a></li>
                        <li><a href="#" className="hover:text-white-500 transition-colors">Gestão do Depto. Jurídico</a></li>
                        <li><a href="#" className="hover:text-white-500 transition-colors">Direito Tributário</a></li>
                        <li><a href="#" className="hover:text-white-500 transition-colors">Direito Trabalhista</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-white">Legal</h4>
                    <ul className="space-y-3 text-gray-300">
                        {/* Corrigi o pequeno erro de digitação "Provacidade" para "Privacidade" */}
                        <li><a href="#" className="hover:text-amber-500 transition-colors">Política de Privacidade</a></li>
                        <li><a href="#" className="hover:text-amber-500 transition-colors">Termos de Serviço</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-600/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <p>© 2026 Instituto de Advocacia Empresarial. Todos os direitos reservados.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <div className="w-8 h-8 rounded-full bg-gray-700 hover:bg-amber-500 transition-colors cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-700 hover:bg-amber-500 transition-colors cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-700 hover:bg-amber-500 transition-colors cursor-pointer"></div>
                </div>
            </div>
        </footer>
    );
}