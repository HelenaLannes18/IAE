export default function Footer() {
    return (
        <footer className="bg-[#16243A] pt-20 pb-10 px-4">


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