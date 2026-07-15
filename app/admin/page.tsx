"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/Richtexteditor';


export default function AdminBlogArea() {
    const router = useRouter();
    const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'create' | 'users' | 'createUser' | 'leads' | 'agenda' | 'createAgenda'>('dashboard');

    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [agendaItems, setAgendaItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Busca
    const [postSearch, setPostSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [leadSearch, setLeadSearch] = useState('');
    const [agendaSearch, setAgendaSearch] = useState('');

    // Formulário de artigo (criação e edição)
    const [formData, setFormData] = useState({ title: '', content: '', category: 'Insights', imageUrl: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);

    // Formulário de usuário (criação e edição)
    const [userFormData, setUserFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Autor',
        status: 'Ativo'
    });
    const [isSubmittingUser, setIsSubmittingUser] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

    // Formulário de item da agenda (criação e edição)
    const AGENDA_LAYOUT_OPTIONS = [
        { label: 'Grande (vertical, ocupa 2 linhas)', value: 'md:col-span-1 md:row-span-2 min-h-[400px] md:min-h-[600px]' },
        { label: 'Largo (horizontal, ocupa 2 colunas)', value: 'md:col-span-2 md:row-span-1 min-h-[300px]' },
        { label: 'Padrão (1x1)', value: 'md:col-span-1 md:row-span-1 min-h-[300px]' }
    ];

    const [agendaFormData, setAgendaFormData] = useState({
        category: '',
        title: '',
        image: '',
        gridClass: AGENDA_LAYOUT_OPTIONS[2].value,
        speakers: '',
        link: '',
        order: 0,
        status: 'Ativo'
    });
    const [isSubmittingAgenda, setIsSubmittingAgenda] = useState(false);
    const [editingAgendaId, setEditingAgendaId] = useState<number | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [resPosts, resUsers, resLeads, resAgenda] = await Promise.all([
                fetch('/api/posts'),
                fetch('/api/users'),
                fetch('/api/leads'),
                fetch('/api/agenda') // NOVA BUSCA DA AGENDA
            ]);

            if (resPosts.ok) setPosts(await resPosts.json());
            if (resUsers.ok) setUsers(await resUsers.json());
            if (resLeads.ok) setLeads(await resLeads.json());
            if (resAgenda.ok) setAgendaItems(await resAgenda.json());
        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Erro ao sair:', error);
        } finally {
            router.push('/admin/login');
            router.refresh();
        }
    };

    // ---------- ARTIGOS ----------

    const resetPostForm = () => {
        setFormData({ title: '', content: '', category: 'Insights', imageUrl: '' });
        setEditingPostId(null);
    };

    const handleStartCreatePost = () => {
        resetPostForm();
        setCurrentView('create');
    };

    const handleStartEditPost = (post: any) => {
        setFormData({
            title: post.title || '',
            content: post.content || '',
            category: post.category || 'Insights',
            imageUrl: post.imageUrl || ''
        });
        setEditingPostId(post.id);
        setCurrentView('create');
    };

    const handleCreatePost = async (e: React.FormEvent, status: string) => {
        e.preventDefault();
        if (!formData.title) return alert("O título é obrigatório!");

        setIsSubmitting(true);
        try {
            const isEditing = editingPostId !== null;
            const url = isEditing ? `/api/posts/${editingPostId}` : '/api/posts';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    status: status,
                    authorId: 1
                })
            });

            if (response.ok) {
                await fetchData();
                resetPostForm();
                setCurrentView('list');
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.error || "Erro ao salvar artigo.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePost = async (post: any) => {
        if (!confirm(`Tem certeza que deseja excluir o artigo "${post.title}"? Essa ação não pode ser desfeita.`)) return;

        try {
            const response = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
            if (response.ok) {
                setPosts((prev) => prev.filter((p) => p.id !== post.id));
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.error || "Erro ao excluir artigo.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    // ---------- USUÁRIOS ----------

    const resetUserForm = () => {
        setUserFormData({ name: '', email: '', password: '', role: 'Autor', status: 'Ativo' });
        setEditingUserId(null);
    };

    const handleStartCreateUser = () => {
        resetUserForm();
        setCurrentView('createUser');
    };

    const handleStartEditUser = (user: any) => {
        setUserFormData({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || 'Autor',
            status: user.status || 'Ativo'
        });
        setEditingUserId(user.id);
        setCurrentView('createUser');
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userFormData.name || !userFormData.email) return alert("Nome e E-mail são obrigatórios!");

        const isEditing = editingUserId !== null;
        if (!isEditing && !userFormData.password) return alert("A senha é obrigatória para criar um usuário!");
        if (userFormData.password && userFormData.password.length < 6) return alert("A senha deve ter pelo menos 6 caracteres!");

        setIsSubmittingUser(true);
        try {
            const url = isEditing ? `/api/users/${editingUserId}` : '/api/users';
            const method = isEditing ? 'PUT' : 'POST';

            const payload = isEditing && !userFormData.password
                ? { name: userFormData.name, email: userFormData.email, role: userFormData.role, status: userFormData.status }
                : userFormData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                await fetchData();
                resetUserForm();
                setCurrentView('users');
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.error || "Erro ao salvar usuário.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        } finally {
            setIsSubmittingUser(false);
        }
    };

    const handleDeleteUser = async (user: any) => {
        if (!confirm(`Tem certeza que deseja excluir o usuário "${user.name}"? Essa ação não pode ser desfeita.`)) return;

        try {
            const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
            if (response.ok) {
                setUsers((prev) => prev.filter((u) => u.id !== user.id));
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.error || "Erro ao excluir usuário.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    // ---------- CONTATOS (LEADS) ----------

    const handleDeleteLead = async (lead: any) => {
        if (!confirm(`Tem certeza que deseja excluir o contato de "${lead.name}"? Essa ação não pode ser desfeita.`)) return;

        try {
            const response = await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' });
            if (response.ok) {
                setLeads((prev) => prev.filter((l) => l.id !== lead.id));
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.error || "Erro ao excluir contato.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    const courseLabels: Record<string, string> = {
        'direito-regulatorio': 'Direito Regulatório',
        'gestao-juridica': 'Gestão do Departamento Jurídico',
        'compliance': 'Compliance e Governança',
        'inovacao': 'Inovação e Tecnologia Jurídica'
    };
    const formatCourse = (course: string | null) => (course ? (courseLabels[course] || course) : '—');


    // ---------- AGENDA ----------

    const resetAgendaForm = () => {
        setAgendaFormData({
            category: '', title: '', image: '', gridClass: AGENDA_LAYOUT_OPTIONS[2].value, speakers: '', link: '', order: 0, status: 'Ativo'
        });
        setEditingAgendaId(null);
    };

    const handleStartCreateAgenda = () => {
        resetAgendaForm();
        setCurrentView('createAgenda');
    };

    const handleStartEditAgenda = (item: any) => {
        setAgendaFormData({
            category: item.category || '',
            title: item.title || '',
            image: item.image || '',
            gridClass: item.gridClass || AGENDA_LAYOUT_OPTIONS[2].value,
            speakers: item.speakers || '',
            link: item.link || '',
            order: item.order || 0,
            status: item.status || 'Ativo'
        });
        setEditingAgendaId(item.id);
        setCurrentView('createAgenda');
    };

    const handleCreateAgenda = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agendaFormData.title || !agendaFormData.category || !agendaFormData.image || !agendaFormData.speakers) {
            return alert("Categoria, Título, Imagem e Palestrantes são obrigatórios!");
        }

        setIsSubmittingAgenda(true);
        try {
            const isEditing = editingAgendaId !== null;
            const url = isEditing ? `/api/agenda/${editingAgendaId}` : '/api/agenda';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...agendaFormData,
                    order: Number(agendaFormData.order) // Garante que a ordem é salva como número
                })
            });

            if (response.ok) {
                await fetchData();
                resetAgendaForm();
                setCurrentView('agenda');
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.error || "Erro ao salvar item da agenda.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        } finally {
            setIsSubmittingAgenda(false);
        }
    };

    const handleDeleteAgenda = async (item: any) => {
        if (!confirm(`Tem certeza que deseja excluir o evento "${item.title}"? Essa ação não pode ser desfeita.`)) return;

        try {
            const response = await fetch(`/api/agenda/${item.id}`, { method: 'DELETE' });
            if (response.ok) {
                setAgendaItems((prev) => prev.filter((a) => a.id !== item.id));
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.error || "Erro ao excluir evento.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };


    // ---------- DERIVADOS / FILTROS ----------

    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.status === 'Publicado').length;
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Ativo').length;
    const totalAgendaItems = agendaItems.length;

    const filteredPosts = useMemo(() => {
        const term = postSearch.trim().toLowerCase();
        if (!term) return posts;
        return posts.filter((p) =>
            p.title?.toLowerCase().includes(term) ||
            p.category?.toLowerCase().includes(term) ||
            p.author?.name?.toLowerCase().includes(term)
        );
    }, [posts, postSearch]);

    const filteredUsers = useMemo(() => {
        const term = userSearch.trim().toLowerCase();
        if (!term) return users;
        return users.filter((u) =>
            u.name?.toLowerCase().includes(term) ||
            u.email?.toLowerCase().includes(term) ||
            u.role?.toLowerCase().includes(term)
        );
    }, [users, userSearch]);

    const filteredLeads = useMemo(() => {
        const term = leadSearch.trim().toLowerCase();
        if (!term) return leads;
        return leads.filter((l) =>
            l.name?.toLowerCase().includes(term) ||
            l.email?.toLowerCase().includes(term) ||
            l.phone?.toLowerCase().includes(term) ||
            l.subject?.toLowerCase().includes(term) ||
            l.message?.toLowerCase().includes(term) ||
            formatCourse(l.course).toLowerCase().includes(term)
        );
    }, [leads, leadSearch]);

    const filteredAgenda = useMemo(() => {
        const term = agendaSearch.trim().toLowerCase();
        if (!term) return agendaItems;
        return agendaItems.filter((a) =>
            a.title?.toLowerCase().includes(term) ||
            a.category?.toLowerCase().includes(term) ||
            a.speakers?.toLowerCase().includes(term)
        );
    }, [agendaItems, agendaSearch]);

    const getPageTitle = () => {
        if (currentView === 'dashboard') return 'Visão Geral';
        if (currentView === 'list') return 'Artigos do Blog';
        if (currentView === 'create') return editingPostId ? 'Editar Artigo' : 'Novo Artigo';
        if (currentView === 'users') return 'Gestão de Usuários';
        if (currentView === 'createUser') return editingUserId ? 'Editar Usuário' : 'Novo Usuário';
        if (currentView === 'leads') return 'Contatos Recebidos';
        if (currentView === 'agenda') return 'Agenda de Eventos';
        if (currentView === 'createAgenda') return editingAgendaId ? 'Editar Evento' : 'Novo Evento da Agenda';
        return '';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#F3F1EC] flex flex-col md:flex-row font-sans text-[#3A3733]">
            {/* --- SIDEBAR --- */}
            <aside className="w-full md:w-64 bg-[#16243A] text-[#C7BFB3] flex flex-col shadow-2xl z-20 shrink-0">
                <div className="h-20 flex items-center px-8 border-b border-[#F3F1EC]/10">
                    <span className="text-2xl font-bold text-[#F3F1EC] tracking-widest">IAE<span className="text-[#9A9186]">.</span></span>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2">
                    <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${currentView === 'dashboard' ? 'bg-[#F3F1EC]/10 text-[#F3F1EC] font-semibold border border-[#F3F1EC]/20' : 'text-[#C7BFB3] hover:bg-[#F3F1EC]/5 hover:text-[#F3F1EC]'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Dashboard
                    </button>

                    <button onClick={() => setCurrentView('agenda')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${(currentView === 'agenda' || currentView === 'createAgenda') ? 'bg-[#F3F1EC]/10 text-[#F3F1EC] font-semibold border border-[#F3F1EC]/20' : 'text-[#C7BFB3] hover:bg-[#F3F1EC]/5 hover:text-[#F3F1EC]'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Agenda
                    </button>

                    <button onClick={() => setCurrentView('list')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${(currentView === 'list' || currentView === 'create') ? 'bg-[#F3F1EC]/10 text-[#F3F1EC] font-semibold border border-[#F3F1EC]/20' : 'text-[#C7BFB3] hover:bg-[#F3F1EC]/5 hover:text-[#F3F1EC]'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" /></svg>
                        Gestão do Blog
                    </button>

                    <button onClick={() => setCurrentView('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${(currentView === 'users' || currentView === 'createUser') ? 'bg-[#F3F1EC]/10 text-[#F3F1EC] font-semibold border border-[#F3F1EC]/20' : 'text-[#C7BFB3] hover:bg-[#F3F1EC]/5 hover:text-[#F3F1EC]'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        Usuários
                    </button>

                    <button onClick={() => setCurrentView('leads')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${currentView === 'leads' ? 'bg-[#F3F1EC]/10 text-[#F3F1EC] font-semibold border border-[#F3F1EC]/20' : 'text-[#C7BFB3] hover:bg-[#F3F1EC]/5 hover:text-[#F3F1EC]'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Contatos
                        {leads.length > 0 && (
                            <span className="ml-auto bg-[#F3F1EC]/10 text-[#F3F1EC] text-xs font-bold px-2 py-0.5 rounded-full border border-[#F3F1EC]/20">{leads.length}</span>
                        )}
                    </button>
                </nav>

                <div className="p-4 border-t border-[#F3F1EC]/10">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-[#9A9186] flex items-center justify-center text-[#16243A] font-bold text-sm">A</div>
                        <div className="text-sm">
                            <p className="text-[#F3F1EC] font-semibold">Admin</p>
                            <p className="text-xs text-[#C7BFB3]">admin@iae.com.br</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#C7BFB3] hover:bg-[#F3F1EC]/5 hover:text-[#F3F1EC] transition-colors text-left"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sair
                    </button>
                </div>
            </aside>

            {/* --- ÁREA PRINCIPAL --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-[#F3F1EC] border-b border-[#C7BFB3]/50 flex items-center justify-between px-8 shrink-0">
                    <h1 className="text-xl font-bold text-[#16243A]">{getPageTitle()}</h1>
                    <div className="flex items-center gap-4">
                        <button className="relative text-[#9A9186] hover:text-[#16243A] transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F3F1EC]"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 relative">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-[#9A9186] font-bold animate-pulse">Carregando dados reais...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {/* TELA 0: DASHBOARD */}
                            {currentView === 'dashboard' && (
                                <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto space-y-8">
                                    <div className="bg-[#16243A] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
                                        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#C7BFB3]/10 blur-3xl pointer-events-none"></div>
                                        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>
                                        <div className="relative z-10 text-center md:text-left">
                                            <h2 className="text-2xl md:text-3xl font-bold text-[#F3F1EC] mb-2">Bem-vindo de volta, Admin! 👋</h2>
                                            <p className="text-[#C7BFB3]">Aqui está o que está acontecendo na sua plataforma hoje.</p>
                                        </div>
                                        <div className="mt-6 md:mt-0 relative z-10 flex gap-3">
                                            <button onClick={handleStartCreateAgenda} className="bg-transparent hover:bg-[#F3F1EC]/10 border border-[#F3F1EC]/30 text-[#F3F1EC] px-6 py-3 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2">
                                                Novo Evento
                                            </button>
                                            <button onClick={handleStartCreatePost} className="bg-[#F3F1EC] hover:bg-white text-[#16243A] px-6 py-3 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                Novo Artigo
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="bg-white border border-[#C7BFB3]/60 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                                            <div className="w-14 h-14 rounded-xl bg-[#F3F1EC] flex items-center justify-center text-[#16243A]"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" /></svg></div>
                                            <div><p className="text-sm font-bold text-[#9A9186] uppercase tracking-wide">Total de Artigos</p><p className="text-3xl font-extrabold text-[#3A3733] mt-1">{totalPosts}</p></div>
                                        </div>
                                        <div className="bg-white border border-[#C7BFB3]/60 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                                            <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                            <div><p className="text-sm font-bold text-[#9A9186] uppercase tracking-wide">Eventos Agenda</p><p className="text-3xl font-extrabold text-[#3A3733] mt-1">{totalAgendaItems}</p></div>
                                        </div>
                                        <div className="bg-white border border-[#C7BFB3]/60 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                                            <div className="w-14 h-14 rounded-xl bg-[#F3F1EC] flex items-center justify-center text-[#16243A]"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
                                            <div><p className="text-sm font-bold text-[#9A9186] uppercase tracking-wide">Usuários</p><p className="text-3xl font-extrabold text-[#3A3733] mt-1">{totalUsers}</p></div>
                                        </div>
                                        <div className="bg-white border border-[#C7BFB3]/60 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                                            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                                            <div><p className="text-sm font-bold text-[#9A9186] uppercase tracking-wide">Contatos Hoje</p><p className="text-3xl font-extrabold text-[#3A3733] mt-1">{leads.length}</p></div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-[#C7BFB3]/60 rounded-2xl shadow-sm overflow-hidden">
                                        <div className="px-6 py-5 border-b border-[#C7BFB3]/50 flex justify-between items-center bg-[#F3F1EC]/30">
                                            <h3 className="font-bold text-[#16243A] text-lg">Artigos Recentes</h3>
                                            <button onClick={() => setCurrentView('list')} className="text-sm text-[#9A9186] hover:text-[#16243A] font-semibold transition-colors">Ver todos &rarr;</button>
                                        </div>
                                        <div className="divide-y divide-[#C7BFB3]/30">
                                            {posts.length === 0 ? (
                                                <p className="p-6 text-[#9A9186] text-center">Nenhum artigo encontrado.</p>
                                            ) : (
                                                posts.slice(0, 3).map((post) => (
                                                    <div key={post.id} className="p-6 flex items-center justify-between hover:bg-[#F3F1EC]/40 transition-colors">
                                                        <div>
                                                            <p className="font-semibold text-[#3A3733] mb-1">{post.title}</p>
                                                            <div className="flex gap-4 text-sm text-[#9A9186]">
                                                                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>{post.category}</span>
                                                                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{formatDate(post.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${post.status === 'Publicado' ? 'bg-[#16243A]/10 text-[#16243A]' : 'bg-[#C7BFB3]/30 text-[#3A3733]'}`}>{post.status}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TELA 1: LISTA DE ARTIGOS */}
                            {currentView === 'list' && (
                                <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                                        <div className="relative w-full sm:w-96">
                                            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9186]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            <input
                                                type="text"
                                                value={postSearch}
                                                onChange={(e) => setPostSearch(e.target.value)}
                                                placeholder="Buscar artigos..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C7BFB3] rounded-lg text-sm text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all shadow-sm"
                                            />
                                        </div>
                                        <button onClick={handleStartCreatePost} className="bg-[#16243A] hover:bg-[#16243A]/90 text-[#F3F1EC] px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#16243A]/20 transition-all w-full sm:w-auto justify-center">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                            Criar Novo Artigo
                                        </button>
                                    </div>

                                    <div className="bg-white border border-[#C7BFB3]/60 rounded-2xl shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-[#F3F1EC]/50 border-b border-[#C7BFB3]/50 text-xs uppercase tracking-wider text-[#9A9186] font-semibold">
                                                        <th className="px-6 py-4">Título</th>
                                                        <th className="px-6 py-4">Categoria</th>
                                                        <th className="px-6 py-4">Autor</th>
                                                        <th className="px-6 py-4">Data</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#C7BFB3]/30">
                                                    {filteredPosts.length === 0 ? (
                                                        <tr><td colSpan={6} className="px-6 py-8 text-center text-[#9A9186]">
                                                            {postSearch ? 'Nenhum artigo corresponde à busca.' : 'Nenhum artigo encontrado. Crie o seu primeiro!'}
                                                        </td></tr>
                                                    ) : (
                                                        filteredPosts.map((post) => (
                                                            <tr key={post.id} className="hover:bg-[#F3F1EC]/60 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        {post.imageUrl ? (
                                                                            // eslint-disable-next-line @next/next/no-img-element
                                                                            <img src={post.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#C7BFB3]/60 shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }} />
                                                                        ) : (
                                                                            <div className="w-10 h-10 rounded-lg bg-[#F3F1EC] border border-[#C7BFB3]/60 shrink-0" />
                                                                        )}
                                                                        <p className="font-semibold text-[#3A3733] truncate max-w-xs">{post.title}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-[#3A3733]/80">{post.category}</td>
                                                                <td className="px-6 py-4 text-sm text-[#3A3733]/80">{post.author?.name || 'Desconhecido'}</td>
                                                                <td className="px-6 py-4 text-sm text-[#9A9186]">{formatDate(post.createdAt)}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'Publicado' ? 'bg-[#16243A] text-[#F3F1EC]' : 'bg-[#C7BFB3]/40 text-[#3A3733]'}`}>{post.status}</span>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <button onClick={() => handleStartEditPost(post)} title="Editar" className="p-2 text-[#9A9186] hover:text-[#16243A] hover:bg-[#C7BFB3]/20 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                                                        <button onClick={() => handleDeletePost(post)} title="Excluir" className="p-2 text-[#9A9186] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TELA 2: CRIAR / EDITAR ARTIGO */}
                            {currentView === 'create' && (
                                <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
                                    <button onClick={() => { resetPostForm(); setCurrentView('list'); }} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#9A9186] hover:text-[#16243A] transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                        Voltar para a lista
                                    </button>
                                    <div className="bg-white rounded-2xl shadow-sm border border-[#C7BFB3]/60 p-6 md:p-10">
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div className="md:col-span-2 space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-[#3A3733] mb-2">Título do Artigo</label>
                                                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: O futuro do compliance..." className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] focus:bg-white transition-all" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-[#3A3733] mb-2">Conteúdo</label>
                                                        <RichTextEditor
                                                            content={formData.content}
                                                            onChange={(html) => setFormData({ ...formData, content: html })}
                                                            placeholder="Escreva o seu artigo aqui..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="bg-[#F3F1EC]/50 p-5 rounded-xl border border-[#C7BFB3]/60">
                                                        <h3 className="font-bold text-[#16243A] mb-4 pb-4 border-b border-[#C7BFB3]/50">Publicação</h3>
                                                        <button disabled={isSubmitting} onClick={(e) => handleCreatePost(e, 'Publicado')} className="w-full bg-[#16243A] hover:bg-[#16243A]/90 text-[#F3F1EC] py-3 rounded-lg font-bold shadow-md transition-colors mb-3 disabled:opacity-50">
                                                            {isSubmitting ? 'Salvando...' : editingPostId ? 'Publicar Alterações' : 'Publicar Artigo'}
                                                        </button>
                                                        <button disabled={isSubmitting} onClick={(e) => handleCreatePost(e, 'Rascunho')} className="w-full bg-white hover:bg-[#C7BFB3]/20 border border-[#9A9186] text-[#3A3733] py-3 rounded-lg font-bold transition-colors disabled:opacity-50">
                                                            Salvar Rascunho
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-[#3A3733] mb-2">Categoria</label>
                                                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all">
                                                            <option value="Insights">Insights</option>
                                                            <option value="Estratégia">Estratégia</option>
                                                            <option value="Direito Trabalhista">Direito Trabalhista</option>
                                                            <option value="Tributário">Tributário</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-[#3A3733] mb-2">Imagem de Capa (URL)</label>
                                                        <input
                                                            type="text"
                                                            value={formData.imageUrl}
                                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                            placeholder="https://..."
                                                            className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                        />
                                                        {formData.imageUrl && (
                                                            <div className="mt-3 rounded-xl overflow-hidden border border-[#C7BFB3]/60 bg-white">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={formData.imageUrl}
                                                                    alt="Pré-visualização da capa"
                                                                    className="w-full h-32 object-cover"
                                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TELA 3: GESTÃO DE USUÁRIOS */}
                            {currentView === 'users' && (
                                <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                                        <div className="relative w-full sm:w-96">
                                            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9186]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            <input
                                                type="text"
                                                value={userSearch}
                                                onChange={(e) => setUserSearch(e.target.value)}
                                                placeholder="Buscar usuários..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C7BFB3] rounded-lg text-sm text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all shadow-sm"
                                            />
                                        </div>
                                        <button onClick={handleStartCreateUser} className="bg-[#16243A] hover:bg-[#16243A]/90 text-[#F3F1EC] px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#16243A]/20 transition-all w-full sm:w-auto justify-center">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                            Adicionar Usuário
                                        </button>
                                    </div>

                                    <div className="bg-white border border-[#C7BFB3]/60 rounded-2xl shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-[#F3F1EC]/50 border-b border-[#C7BFB3]/50 text-xs uppercase tracking-wider text-[#9A9186] font-semibold">
                                                        <th className="px-6 py-4">Usuário</th>
                                                        <th className="px-6 py-4">Papel</th>
                                                        <th className="px-6 py-4">Data de Cadastro</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#C7BFB3]/30">
                                                    {filteredUsers.length === 0 ? (
                                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-[#9A9186]">
                                                            {userSearch ? 'Nenhum usuário corresponde à busca.' : 'Nenhum usuário cadastrado.'}
                                                        </td></tr>
                                                    ) : (
                                                        filteredUsers.map((user) => (
                                                            <tr key={user.id} className="hover:bg-[#F3F1EC]/60 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div>
                                                                        <p className="font-semibold text-[#3A3733]">{user.name}</p>
                                                                        <p className="text-sm text-[#9A9186]">{user.email}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-[#3A3733]/80">{user.role}</td>
                                                                <td className="px-6 py-4 text-sm text-[#9A9186]">{formatDate(user.createdAt)}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Ativo' ? 'bg-[#16243A] text-[#F3F1EC]' : 'bg-[#C7BFB3]/40 text-[#3A3733]'}`}>{user.status}</span>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <button onClick={() => handleStartEditUser(user)} title="Editar" className="p-2 text-[#9A9186] hover:text-[#16243A] hover:bg-[#C7BFB3]/20 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                                                        <button onClick={() => handleDeleteUser(user)} title="Excluir" className="p-2 text-[#9A9186] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TELA 4: CRIAR / EDITAR USUÁRIO */}
                            {currentView === 'createUser' && (
                                <motion.div key="createUser" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto">
                                    <button onClick={() => { resetUserForm(); setCurrentView('users'); }} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#9A9186] hover:text-[#16243A] transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                        Voltar para usuários
                                    </button>

                                    <div className="bg-white rounded-2xl shadow-sm border border-[#C7BFB3]/60 p-6 md:p-10">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-[#3A3733] mb-2">Nome Completo</label>
                                                <input
                                                    type="text"
                                                    value={userFormData.name}
                                                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                                                    placeholder="Ex: João da Silva"
                                                    className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[#3A3733] mb-2">E-mail</label>
                                                <input
                                                    type="email"
                                                    value={userFormData.email}
                                                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                                                    placeholder="Ex: joao@empresa.com"
                                                    className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[#3A3733] mb-2">
                                                    Senha {editingUserId && <span className="font-normal text-[#9A9186]">(deixe em branco para manter a atual)</span>}
                                                </label>
                                                <input
                                                    type="password"
                                                    value={userFormData.password}
                                                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                                                    placeholder={editingUserId ? "••••••••" : "Mínimo de 6 caracteres"}
                                                    className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Papel (Role)</label>
                                                    <select
                                                        value={userFormData.role}
                                                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                                                        className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                    >
                                                        <option value="Autor">Autor</option>
                                                        <option value="Editor">Editor</option>
                                                        <option value="Administrador">Administrador</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Status</label>
                                                    <select
                                                        value={userFormData.status}
                                                        onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value })}
                                                        className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                    >
                                                        <option value="Ativo">Ativo</option>
                                                        <option value="Inativo">Inativo</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-[#C7BFB3]/30 flex justify-end gap-4">
                                                <button
                                                    onClick={() => { resetUserForm(); setCurrentView('users'); }}
                                                    className="px-6 py-3 rounded-lg font-bold text-[#3A3733] bg-[#F3F1EC] hover:bg-[#C7BFB3]/30 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    disabled={isSubmittingUser}
                                                    onClick={handleCreateUser}
                                                    className="px-6 py-3 rounded-lg font-bold text-[#F3F1EC] bg-[#16243A] hover:bg-[#16243A]/90 shadow-md transition-colors disabled:opacity-50"
                                                >
                                                    {isSubmittingUser ? 'Salvando...' : editingUserId ? 'Salvar Alterações' : 'Salvar Usuário'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TELA 5: CONTATOS RECEBIDOS */}
                            {currentView === 'leads' && (
                                <motion.div key="leads" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                                        <div className="relative w-full sm:w-96">
                                            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9186]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            <input
                                                type="text"
                                                value={leadSearch}
                                                onChange={(e) => setLeadSearch(e.target.value)}
                                                placeholder="Buscar contatos..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C7BFB3] rounded-lg text-sm text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all shadow-sm"
                                            />
                                        </div>
                                        <p className="text-sm text-[#9A9186] font-semibold">{filteredLeads.length} contato(s)</p>
                                    </div>

                                    <div className="bg-white border border-[#C7BFB3]/60 rounded-2xl shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-[#F3F1EC]/50 border-b border-[#C7BFB3]/50 text-xs uppercase tracking-wider text-[#9A9186] font-semibold">
                                                        <th className="px-6 py-4">Contato</th>
                                                        <th className="px-6 py-4">Telefone</th>
                                                        <th className="px-6 py-4">Assunto / Programa</th>
                                                        <th className="px-6 py-4">Mensagem</th>
                                                        <th className="px-6 py-4">Origem</th>
                                                        <th className="px-6 py-4">Recebido em</th>
                                                        <th className="px-6 py-4 text-right">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#C7BFB3]/30">
                                                    {filteredLeads.length === 0 ? (
                                                        <tr><td colSpan={7} className="px-6 py-8 text-center text-[#9A9186]">
                                                            {leadSearch ? 'Nenhum contato corresponde à busca.' : 'Nenhum contato recebido ainda.'}
                                                        </td></tr>
                                                    ) : (
                                                        filteredLeads.map((lead) => (
                                                            <tr key={lead.id} className="hover:bg-[#F3F1EC]/60 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div>
                                                                        <p className="font-semibold text-[#3A3733]">{lead.name || 'Não informado'}</p>
                                                                        <a href={`mailto:${lead.email}`} className="text-sm text-[#9A9186] hover:text-[#16243A] transition-colors">{lead.email}</a>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-[#3A3733]/80">
                                                                    {lead.phone ? (
                                                                        <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#16243A] transition-colors">{lead.phone}</a>
                                                                    ) : '—'}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-[#3A3733]/80">
                                                                    {lead.course ? (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F3F1EC] border border-[#C7BFB3]/60 text-[#3A3733]">{formatCourse(lead.course)}</span>
                                                                    ) : lead.subject ? (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F3F1EC] border border-[#C7BFB3]/60 text-[#3A3733]">{lead.subject}</span>
                                                                    ) : '—'}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-[#3A3733]/80 max-w-xs">
                                                                    {lead.message ? (
                                                                        <p className="truncate" title={lead.message}>{lead.message}</p>
                                                                    ) : '—'}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.source === 'popup' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                                                                        {lead.source === 'popup' ? 'Popup' : 'Formulário'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-[#9A9186]">{formatDate(lead.createdAt)}</td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <button onClick={() => handleDeleteLead(lead)} title="Excluir" className="p-2 text-[#9A9186] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TELA 6: AGENDA LISTA */}
                            {currentView === 'agenda' && (
                                <motion.div key="agenda" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                                        <div className="relative w-full sm:w-96">
                                            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9186]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            <input
                                                type="text"
                                                value={agendaSearch}
                                                onChange={(e) => setAgendaSearch(e.target.value)}
                                                placeholder="Buscar na agenda..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C7BFB3] rounded-lg text-sm text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all shadow-sm"
                                            />
                                        </div>
                                        <button onClick={handleStartCreateAgenda} className="bg-[#16243A] hover:bg-[#16243A]/90 text-[#F3F1EC] px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#16243A]/20 transition-all w-full sm:w-auto justify-center">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                            Adicionar Evento
                                        </button>
                                    </div>

                                    <div className="bg-white border border-[#C7BFB3]/60 rounded-2xl shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-[#F3F1EC]/50 border-b border-[#C7BFB3]/50 text-xs uppercase tracking-wider text-[#9A9186] font-semibold">
                                                        <th className="px-6 py-4">Evento / Imagem</th>
                                                        <th className="px-6 py-4">Categoria</th>
                                                        <th className="px-6 py-4">Palestrantes</th>
                                                        <th className="px-6 py-4">Ordem</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#C7BFB3]/30">
                                                    {filteredAgenda.length === 0 ? (
                                                        <tr><td colSpan={6} className="px-6 py-8 text-center text-[#9A9186]">
                                                            {agendaSearch ? 'Nenhum evento corresponde à busca.' : 'Sua agenda está vazia. Adicione o primeiro evento!'}
                                                        </td></tr>
                                                    ) : (
                                                        filteredAgenda.map((item) => (
                                                            <tr key={item.id} className="hover:bg-[#F3F1EC]/60 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        {item.image ? (
                                                                            // eslint-disable-next-line @next/next/no-img-element
                                                                            <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-[#C7BFB3]/60 shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }} />
                                                                        ) : (
                                                                            <div className="w-12 h-12 rounded-lg bg-[#F3F1EC] border border-[#C7BFB3]/60 shrink-0" />
                                                                        )}
                                                                        <p className="font-semibold text-[#3A3733] truncate max-w-[250px]">{item.title}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-[#3A3733]/80">{item.category}</td>
                                                                <td className="px-6 py-4 text-sm text-[#3A3733]/80 truncate max-w-[200px]">{item.speakers}</td>
                                                                <td className="px-6 py-4 text-sm font-semibold text-[#9A9186]">{item.order}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Ativo' ? 'bg-[#16243A] text-[#F3F1EC]' : 'bg-[#C7BFB3]/40 text-[#3A3733]'}`}>{item.status}</span>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        {item.link && (
                                                                            <a href={item.link} target="_blank" rel="noopener noreferrer" title="Ver Link" className="p-2 text-[#9A9186] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                                            </a>
                                                                        )}
                                                                        <button onClick={() => handleStartEditAgenda(item)} title="Editar" className="p-2 text-[#9A9186] hover:text-[#16243A] hover:bg-[#C7BFB3]/20 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                                                        <button onClick={() => handleDeleteAgenda(item)} title="Excluir" className="p-2 text-[#9A9186] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TELA 7: CRIAR / EDITAR AGENDA */}
                            {currentView === 'createAgenda' && (
                                <motion.div key="createAgenda" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
                                    <button onClick={() => { resetAgendaForm(); setCurrentView('agenda'); }} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#9A9186] hover:text-[#16243A] transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                        Voltar para agenda
                                    </button>

                                    <div className="bg-white rounded-2xl shadow-sm border border-[#C7BFB3]/60 p-6 md:p-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Categoria <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={agendaFormData.category}
                                                        onChange={(e) => setAgendaFormData({ ...agendaFormData, category: e.target.value })}
                                                        placeholder="Ex: Evento / Workshop"
                                                        className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Título do Evento <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={agendaFormData.title}
                                                        onChange={(e) => setAgendaFormData({ ...agendaFormData, title: e.target.value })}
                                                        placeholder="Ex: A Nova Lei Trabalhista..."
                                                        className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Palestrantes <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={agendaFormData.speakers}
                                                        onChange={(e) => setAgendaFormData({ ...agendaFormData, speakers: e.target.value })}
                                                        placeholder="Ex: João da Silva, Maria Souza"
                                                        className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Link Inscrição / Zoom (Opcional)</label>
                                                    <input
                                                        type="url"
                                                        value={agendaFormData.link}
                                                        onChange={(e) => setAgendaFormData({ ...agendaFormData, link: e.target.value })}
                                                        placeholder="https://zoom.us/..."
                                                        className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Tamanho do Card na Tela <span className="text-red-500">*</span></label>
                                                    <select
                                                        value={agendaFormData.gridClass}
                                                        onChange={(e) => setAgendaFormData({ ...agendaFormData, gridClass: e.target.value })}
                                                        className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                    >
                                                        {AGENDA_LAYOUT_OPTIONS.map((opt) => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-[#3A3733] mb-2">Ordem Exibição</label>
                                                        <input
                                                            type="number"
                                                            value={agendaFormData.order}
                                                            onChange={(e) => setAgendaFormData({ ...agendaFormData, order: Number(e.target.value) })}
                                                            className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-[#3A3733] mb-2">Status</label>
                                                        <select
                                                            value={agendaFormData.status}
                                                            onChange={(e) => setAgendaFormData({ ...agendaFormData, status: e.target.value })}
                                                            className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                        >
                                                            <option value="Ativo">Ativo</option>
                                                            <option value="Inativo">Inativo</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Imagem de Fundo (URL) <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={agendaFormData.image}
                                                        onChange={(e) => setAgendaFormData({ ...agendaFormData, image: e.target.value })}
                                                        placeholder="https://..."
                                                        className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all"
                                                    />
                                                    {agendaFormData.image && (
                                                        <div className="mt-3 rounded-xl overflow-hidden border border-[#C7BFB3]/60 bg-white">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={agendaFormData.image}
                                                                alt="Preview da agenda"
                                                                className="w-full h-32 object-cover"
                                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 mt-8 border-t border-[#C7BFB3]/30 flex justify-end gap-4">
                                            <button
                                                onClick={() => { resetAgendaForm(); setCurrentView('agenda'); }}
                                                className="px-6 py-3 rounded-lg font-bold text-[#3A3733] bg-[#F3F1EC] hover:bg-[#C7BFB3]/30 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                disabled={isSubmittingAgenda}
                                                onClick={handleCreateAgenda}
                                                className="px-8 py-3 rounded-lg font-bold text-[#F3F1EC] bg-[#16243A] hover:bg-[#16243A]/90 shadow-md transition-colors disabled:opacity-50"
                                            >
                                                {isSubmittingAgenda ? 'Salvando...' : editingAgendaId ? 'Salvar Alterações' : 'Salvar Evento'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </main>
        </div>
    );
}