"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Plus, Pencil, Trash2, ArrowLeft, Calendar, CheckCircle2,
    Users as UsersIcon, ShieldCheck, Newspaper, Mic, Hash,
    Inbox, CalendarClock, TrendingUp
} from 'lucide-react';
import RichTextEditor from '@/components/Richtexteditor';
import ImageUrlInput from '@/components/admin/ImageUrlInput';
import AdminSidebar, { AdminView } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ActivityChart from '@/components/admin/ActivityChart';
import { ToastProvider, useToast } from '@/components/admin/Toast';
import { ConfirmProvider, useConfirm } from '@/components/admin/ConfirmDialog';
import { StatCard, SearchInput, StatusBadge, EmptyState, Avatar, ThumbBox, IconActionButton, ListShell, TableSkeleton, CardSkeleton } from '@/components/admin/ui';

export default function AdminBlogAreaPage() {
    return (
        <ToastProvider>
            <ConfirmProvider>
                <AdminBlogArea />
            </ConfirmProvider>
        </ToastProvider>
    );
}

function timeAgo(dateString: string) {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (minutes < 1) return 'agora mesmo';
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days}d`;
}

function AdminBlogArea() {
    const router = useRouter();
    const toast = useToast();
    const confirm = useConfirm();

    const [currentView, setCurrentView] = useState<AdminView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    const [formData, setFormData] = useState<{ title: string; content: string; category: string; imageUrl: string; authorIds: number[] }>({ title: '', content: '', category: 'Insights', imageUrl: '', authorIds: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);

    // Criação de nova categoria de artigo, direto na tela do artigo
    const [isNewCategory, setIsNewCategory] = useState(false);

    // Criacao rapida de um novo autor (nome + foto), direto na tela do artigo
    const [showNewAuthorForm, setShowNewAuthorForm] = useState(false);
    const [newAuthorName, setNewAuthorName] = useState('');
    const [newAuthorImageUrl, setNewAuthorImageUrl] = useState('');
    const [newAuthorBio, setNewAuthorBio] = useState('');
    const [isCreatingAuthor, setIsCreatingAuthor] = useState(false);

    // Formulário de usuário (criação e edição)
    const [userFormData, setUserFormData] = useState({
        name: '',
        email: '',
        password: '',
        imageUrl: '',
        bio: '',
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

    // silent=true é usado pela atualização automática em segundo plano: não mostra o
    // esqueleto de carregamento nem um toast de erro a cada tentativa (evita ruído
    // caso uma única requisição periódica falhe).
    const fetchData = async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const [resPosts, resUsers, resLeads, resAgenda] = await Promise.all([
                fetch('/api/posts'),
                fetch('/api/users'),
                fetch('/api/leads'),
                fetch('/api/agenda')
            ]);

            if (resPosts.ok) setPosts(await resPosts.json());
            if (resUsers.ok) setUsers(await resUsers.json());
            if (resLeads.ok) setLeads(await resLeads.json());
            if (resAgenda.ok) setAgendaItems(await resAgenda.json());
        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            if (!silent) toast.error("Erro ao carregar os dados do painel.");
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Mantém os dados (principalmente os contatos, para o sino de notificações) em dia
        // mesmo sem o admin recarregar a página manualmente.
        const interval = setInterval(() => fetchData(true), 45000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Troca de tela e fecha o menu mobile, se estiver aberto
    const navigateTo = (view: AdminView) => {
        setCurrentView(view);
        setIsSidebarOpen(false);
    };

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
        setFormData({ title: '', content: '', category: 'Insights', imageUrl: '', authorIds: [] });
        setEditingPostId(null);
        setIsNewCategory(false);
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
            imageUrl: post.imageUrl || '',
            authorIds: (post.authors || []).map((a: any) => a.id)
        });
        setEditingPostId(post.id);
        setIsNewCategory(false);
        setCurrentView('create');
    };

    // Alterna a seleção de um autor no formulário do artigo
    const toggleFormAuthor = (userId: number) => {
        setFormData((prev) => ({
            ...prev,
            authorIds: prev.authorIds.includes(userId)
                ? prev.authorIds.filter((id) => id !== userId)
                : [...prev.authorIds, userId]
        }));
    };

    // Cria um autor "rapido" (so nome + foto, sem login) e ja marca ele no artigo
    const handleCreateQuickAuthor = async () => {
        if (!newAuthorName.trim()) return toast.error("Digite o nome do autor!");

        setIsCreatingAuthor(true);
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newAuthorName.trim(),
                    imageUrl: newAuthorImageUrl.trim() || null,
                    bio: newAuthorBio.trim() || null,
                    role: 'Autor',
                    status: 'Ativo'
                })
            });

            if (response.ok) {
                const newUser = await response.json();
                setUsers((prev) => [newUser, ...prev]);
                setFormData((prev) => ({ ...prev, authorIds: [...prev.authorIds, newUser.id] }));
                setNewAuthorName('');
                setNewAuthorImageUrl('');
                setNewAuthorBio('');
                setShowNewAuthorForm(false);
                toast.success("Autor adicionado com sucesso!");
            } else {
                const data = await response.json().catch(() => ({}));
                toast.error(data.error || "Erro ao criar autor.");
            }
        } catch (error) {
            console.error("Erro na requisicao:", error);
            toast.error("Erro na requisição ao criar autor.");
        } finally {
            setIsCreatingAuthor(false);
        }
    };

    // Cria OU atualiza um artigo, dependendo se estamos editando
    const handleCreatePost = async (e: React.FormEvent, status: string) => {
        e.preventDefault();
        if (!formData.title) return toast.error("O título é obrigatório!");
        if (formData.authorIds.length === 0) return toast.error("Selecione pelo menos um autor!");

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
                    status: status
                })
            });

            if (response.ok) {
                await fetchData();
                resetPostForm();
                setCurrentView('list');
                toast.success(isEditing ? "Artigo atualizado com sucesso!" : "Artigo salvo com sucesso!");
            } else {
                const data = await response.json().catch(() => ({}));
                toast.error(data.error || "Erro ao salvar artigo.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro na requisição ao salvar artigo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePost = async (post: any) => {
        const ok = await confirm({
            title: 'Excluir artigo',
            message: `Tem certeza que deseja excluir o artigo "${post.title}"? Essa ação não pode ser desfeita.`,
            confirmLabel: 'Excluir',
        });
        if (!ok) return;

        try {
            const response = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
            if (response.ok) {
                setPosts((prev) => prev.filter((p) => p.id !== post.id));
                toast.success("Artigo excluído.");
            } else {
                const data = await response.json().catch(() => ({}));
                toast.error(data.error || "Erro ao excluir artigo.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro na requisição ao excluir artigo.");
        }
    };

    // ---------- USUÁRIOS ----------

    const resetUserForm = () => {
        setUserFormData({ name: '', email: '', password: '', imageUrl: '', bio: '', role: 'Autor', status: 'Ativo' });
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
            imageUrl: user.imageUrl || '',
            bio: user.bio || '',
            role: user.role || 'Autor',
            status: user.status || 'Ativo'
        });
        setEditingUserId(user.id);
        setCurrentView('createUser');
    };

    // Cria OU atualiza um usuário, dependendo se estamos editando
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userFormData.name || !userFormData.email) return toast.error("Nome e E-mail são obrigatórios!");

        const isEditing = editingUserId !== null;
        if (!isEditing && !userFormData.password) return toast.error("A senha é obrigatória para criar um usuário!");
        if (userFormData.password && userFormData.password.length < 6) return toast.error("A senha deve ter pelo menos 6 caracteres!");

        setIsSubmittingUser(true);
        try {
            const url = isEditing ? `/api/users/${editingUserId}` : '/api/users';
            const method = isEditing ? 'PUT' : 'POST';

            // Na edição, só envia a senha se o campo foi preenchido (mantém a senha atual caso contrário)
            const payload = isEditing && !userFormData.password
                ? { name: userFormData.name, email: userFormData.email, imageUrl: userFormData.imageUrl, bio: userFormData.bio, role: userFormData.role, status: userFormData.status }
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
                toast.success(isEditing ? "Usuário atualizado com sucesso!" : "Usuário criado com sucesso!");
            } else {
                const data = await response.json().catch(() => ({}));
                toast.error(data.error || "Erro ao salvar usuário.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro na requisição ao salvar usuário.");
        } finally {
            setIsSubmittingUser(false);
        }
    };

    const handleDeleteUser = async (user: any) => {
        const ok = await confirm({
            title: 'Excluir usuário',
            message: `Tem certeza que deseja excluir o usuário "${user.name}"? Essa ação não pode ser desfeita.`,
            confirmLabel: 'Excluir',
        });
        if (!ok) return;

        try {
            const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
            if (response.ok) {
                setUsers((prev) => prev.filter((u) => u.id !== user.id));
                toast.success("Usuário excluído.");
            } else {
                const data = await response.json().catch(() => ({}));
                toast.error(data.error || "Erro ao excluir usuário.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro na requisição ao excluir usuário.");
        }
    };

    // ---------- CONTATOS (LEADS) ----------

    const handleDeleteLead = async (lead: any) => {
        const ok = await confirm({
            title: 'Excluir contato',
            message: `Tem certeza que deseja excluir o contato de "${lead.name}"? Essa ação não pode ser desfeita.`,
            confirmLabel: 'Excluir',
        });
        if (!ok) return;

        try {
            const response = await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' });
            if (response.ok) {
                setLeads((prev) => prev.filter((l) => l.id !== lead.id));
                toast.success("Contato excluído.");
            } else {
                const data = await response.json().catch(() => ({}));
                toast.error(data.error || "Erro ao excluir contato.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro na requisição ao excluir contato.");
        }
    };

    // ---------- AGENDA (EVENTOS) ----------

    const resetAgendaForm = () => {
        setAgendaFormData({
            category: '',
            title: '',
            image: '',
            gridClass: AGENDA_LAYOUT_OPTIONS[2].value,
            speakers: '',
            link: '',
            order: 0,
            status: 'Ativo'
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
            order: typeof item.order === 'number' ? item.order : 0,
            status: item.status || 'Ativo'
        });
        setEditingAgendaId(item.id);
        setCurrentView('createAgenda');
    };

    // Cria OU atualiza um evento da agenda, dependendo se estamos editando
    const handleCreateAgenda = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agendaFormData.category || !agendaFormData.title || !agendaFormData.image || !agendaFormData.speakers) {
            return toast.error("Categoria, título, imagem e palestrantes são obrigatórios!");
        }

        setIsSubmittingAgenda(true);
        try {
            const isEditing = editingAgendaId !== null;
            const url = isEditing ? `/api/agenda/${editingAgendaId}` : '/api/agenda';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agendaFormData)
            });

            if (response.ok) {
                await fetchData();
                resetAgendaForm();
                setCurrentView('agenda');
                toast.success(isEditing ? "Evento atualizado com sucesso!" : "Evento criado com sucesso!");
            } else {
                const data = await response.json().catch(() => ({}));
                toast.error(data.error || "Erro ao salvar evento.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro na requisição ao salvar evento.");
        } finally {
            setIsSubmittingAgenda(false);
        }
    };

    const handleDeleteAgenda = async (item: any) => {
        const ok = await confirm({
            title: 'Excluir evento',
            message: `Tem certeza que deseja excluir o evento "${item.title}"? Essa ação não pode ser desfeita.`,
            confirmLabel: 'Excluir',
        });
        if (!ok) return;

        try {
            const response = await fetch(`/api/agenda/${item.id}`, { method: 'DELETE' });
            if (response.ok) {
                setAgendaItems((prev) => prev.filter((a) => a.id !== item.id));
                toast.success("Evento excluído.");
            } else {
                const data = await response.json().catch(() => ({}));
                toast.error(data.error || "Erro ao excluir evento.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro na requisição ao excluir evento.");
        }
    };

    // Traduz o value do select do formulário público para um rótulo legível
    const courseLabels: Record<string, string> = {
        'direito-regulatorio': 'Direito Regulatório',
        'gestao-juridica': 'Gestão do Departamento Jurídico',
        'compliance': 'Compliance e Governança',
        'inovacao': 'Inovação e Tecnologia Jurídica'
    };
    const formatCourse = (course: string | null) => (course ? (courseLabels[course] || course) : '—');

    // ---------- DERIVADOS ----------

    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.status === 'Publicado').length;
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Ativo').length;

    // Gráfico de atividade do dashboard: contatos recebidos por dia, no período selecionado
    const [chartRangeDays, setChartRangeDays] = useState<7 | 30>(7);

    const leadsChartData = useMemo(() => {
        const days: { label: string; value: number }[] = [];
        const dayFormat = chartRangeDays === 7
            ? { weekday: 'short' as const }
            : { day: '2-digit' as const, month: '2-digit' as const };

        for (let i = chartRangeDays - 1; i >= 0; i--) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() - i);
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const count = leads.filter((l) => {
                const created = new Date(l.createdAt);
                return created >= date && created < nextDate;
            }).length;

            const label = date.toLocaleDateString('pt-BR', dayFormat).replace('.', '');
            days.push({ label, value: count });
        }
        return days;
    }, [leads, chartRangeDays]);

    const leadsInRange = useMemo(() => leadsChartData.reduce((sum, d) => sum + d.value, 0), [leadsChartData]);

    // Próximos eventos ativos da agenda, ordenados pela ordem de exibição definida no admin
    const upcomingAgenda = useMemo(() => {
        return [...agendaItems]
            .filter((a) => a.status === 'Ativo')
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .slice(0, 4);
    }, [agendaItems]);

    // Contatos mais recentes, para o painel lateral do dashboard
    const recentLeadsPanel = useMemo(() => {
        return [...leads]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4);
    }, [leads]);

    // Categorias já usadas em artigos existentes, combinadas com as padrão (sem duplicatas)
    const categoryOptions = useMemo(() => {
        const defaults = ['Insights', 'Estratégia', 'Direito Trabalhista', 'Tributário'];
        const fromPosts = posts.map((p) => p.category).filter(Boolean);
        return Array.from(new Set([...defaults, ...fromPosts]));
    }, [posts]);

    const filteredPosts = useMemo(() => {
        const term = postSearch.trim().toLowerCase();
        if (!term) return posts;
        return posts.filter((p) =>
            p.title?.toLowerCase().includes(term) ||
            p.category?.toLowerCase().includes(term) ||
            (p.authors || []).some((a: any) => a.name?.toLowerCase().includes(term))
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
        if (currentView === 'createAgenda') return editingAgendaId ? 'Editar Evento' : 'Novo Evento';
        return '';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const inputCls = "w-full px-4 py-3 bg-[var(--a-input-bg)] border border-transparent rounded-2xl text-[var(--a-text)] placeholder:text-[var(--a-faint)] focus:outline-none focus:border-[var(--a-accent)]/40 transition-all";
    const labelCls = "block text-sm font-medium text-[var(--a-muted)] mb-2";

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <AdminSidebar
                currentView={currentView}
                onNavigate={navigateTo}
                onLogout={handleLogout}
                leadsCount={leads.length}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* --- ÁREA PRINCIPAL --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <AdminHeader title={getPageTitle()} onMenuClick={() => setIsSidebarOpen(true)} leads={leads} onViewAllLeads={() => navigateTo('leads')} />

                <div className="flex-1 overflow-auto p-4 md:p-8 relative">
                    {isLoading ? (
                        <div className="max-w-6xl mx-auto space-y-6">
                            <div className="h-44 rounded-[28px] bg-[var(--a-surface)] border border-[var(--a-border)] animate-pulse" />
                            <CardSkeleton />
                            <TableSkeleton />
                        </div>
                    ) : (
                        <>
                            {/* TELA 0: DASHBOARD */}
                            {currentView === 'dashboard' && (
                                <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--a-text)]">Visão geral</h2>
                                            <p className="text-sm text-[var(--a-muted)] mt-1">Artigos, usuários e contatos em um só lugar.</p>
                                        </div>
                                        <button onClick={handleStartCreatePost} className="bg-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] text-[var(--a-accent-contrast)] px-6 py-3 rounded-full font-bold transition-colors flex items-center gap-2 shrink-0">
                                            <Plus className="w-5 h-5" />
                                            Novo Artigo
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <StatCard icon={Newspaper} label="Total de artigos" value={totalPosts} />
                                        <StatCard icon={CheckCircle2} label="Publicados" value={publishedPosts} />
                                        <StatCard icon={UsersIcon} label="Usuários" value={totalUsers} />
                                        <StatCard icon={ShieldCheck} label="Usuários ativos" value={activeUsers} variant="highlight" />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        {/* Gráfico de atividade: contatos recebidos no período */}
                                        <div className="lg:col-span-2 bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[28px] p-6 md:p-8">
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                                <div>
                                                    <h3 className="font-bold text-[var(--a-text)] text-xl">Contatos recebidos</h3>
                                                    <p className="text-sm text-[var(--a-muted)] mt-1">
                                                        <span className="font-bold text-[var(--a-text)]">{leadsInRange}</span> nos últimos {chartRangeDays} dias
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 bg-[var(--a-surface-2)] rounded-full p-1">
                                                    <button
                                                        onClick={() => setChartRangeDays(7)}
                                                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${chartRangeDays === 7 ? 'bg-[var(--a-accent)] text-[var(--a-accent-contrast)]' : 'text-[var(--a-muted)] hover:text-[var(--a-text)]'}`}
                                                    >
                                                        7 dias
                                                    </button>
                                                    <button
                                                        onClick={() => setChartRangeDays(30)}
                                                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${chartRangeDays === 30 ? 'bg-[var(--a-accent)] text-[var(--a-accent-contrast)]' : 'text-[var(--a-muted)] hover:text-[var(--a-text)]'}`}
                                                    >
                                                        30 dias
                                                    </button>
                                                </div>
                                            </div>
                                            {leadsInRange === 0 ? (
                                                <EmptyState icon={TrendingUp} title="Nenhum contato no período." description="Assim que chegarem novos contatos pelo site, eles aparecem aqui." />
                                            ) : (
                                                <ActivityChart points={leadsChartData} />
                                            )}
                                        </div>

                                        {/* Coluna lateral: próximos eventos + contatos recentes */}
                                        <div className="space-y-4">
                                            <div className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[28px] p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-bold text-[var(--a-text)] text-sm">Próximos eventos</h3>
                                                    <button onClick={() => navigateTo('agenda')} className="text-xs text-[var(--a-muted)] hover:text-[var(--a-accent)] font-semibold transition-colors">Ver todos</button>
                                                </div>
                                                {upcomingAgenda.length === 0 ? (
                                                    <p className="text-sm text-[var(--a-muted)]">Nenhum evento ativo no momento.</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {upcomingAgenda.map((item) => (
                                                            <div key={item.id} className="flex items-center gap-3">
                                                                <ThumbBox src={item.image} />
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-sm font-semibold text-[var(--a-text)] truncate">{item.title}</p>
                                                                    <p className="text-xs text-[var(--a-muted)] truncate flex items-center gap-1"><CalendarClock className="w-3 h-3 shrink-0" />{item.category}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[28px] p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-bold text-[var(--a-text)] text-sm">Contatos recentes</h3>
                                                    <button onClick={() => navigateTo('leads')} className="text-xs text-[var(--a-muted)] hover:text-[var(--a-accent)] font-semibold transition-colors">Ver todos</button>
                                                </div>
                                                {recentLeadsPanel.length === 0 ? (
                                                    <p className="text-sm text-[var(--a-muted)]">Nenhum contato recebido ainda.</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {recentLeadsPanel.map((lead) => (
                                                            <div key={lead.id} className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-[var(--a-surface-2)] flex items-center justify-center text-[var(--a-accent)] shrink-0">
                                                                    <Inbox className="w-4 h-4" />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-sm font-semibold text-[var(--a-text)] truncate">{lead.name || lead.email}</p>
                                                                    <p className="text-xs text-[var(--a-muted)] truncate">{timeAgo(lead.createdAt)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-4 px-1">
                                            <h3 className="font-bold text-[var(--a-text)] text-xl">Artigos recentes</h3>
                                            <button onClick={() => navigateTo('list')} className="text-sm text-[var(--a-muted)] hover:text-[var(--a-accent)] font-semibold transition-colors">Ver todos &rarr;</button>
                                        </div>
                                        {posts.length === 0 ? (
                                            <div className="bg-[var(--a-surface-2)] rounded-[28px]">
                                                <EmptyState icon={Newspaper} title="Nenhum artigo encontrado." description="Crie o seu primeiro artigo para vê-lo listado aqui." />
                                            </div>
                                        ) : (
                                            <ListShell>
                                                {posts.slice(0, 3).map((post) => (
                                                    <div key={post.id} className="rounded-2xl bg-[var(--a-surface)] border border-[var(--a-border)] px-5 py-4 flex items-center gap-4">
                                                        <ThumbBox src={post.imageUrl} />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-[var(--a-text)] truncate">{post.title}</p>
                                                            <div className="flex items-center gap-2 mt-1 text-xs text-[var(--a-muted)]">
                                                                <span>{post.category}</span>
                                                                <span className="w-1 h-1 rounded-full bg-[var(--a-faint)]" />
                                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                        <StatusBadge status={post.status} />
                                                    </div>
                                                ))}
                                            </ListShell>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* TELA 1: LISTA DE ARTIGOS */}
                            {currentView === 'list' && (
                                <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                        <SearchInput value={postSearch} onChange={setPostSearch} placeholder="Buscar artigos..." />
                                        <button onClick={handleStartCreatePost} className="bg-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] text-[var(--a-accent-contrast)] px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all w-full sm:w-auto justify-center">
                                            <Plus className="w-5 h-5" />
                                            Criar novo artigo
                                        </button>
                                    </div>

                                    {filteredPosts.length === 0 ? (
                                        <div className="bg-[var(--a-surface-2)] rounded-[28px]">
                                            <EmptyState
                                                icon={Newspaper}
                                                title={postSearch ? 'Nenhum artigo corresponde à busca.' : 'Nenhum artigo encontrado.'}
                                                description={postSearch ? undefined : 'Crie o seu primeiro artigo!'}
                                            />
                                        </div>
                                    ) : (
                                        <ListShell>
                                            {filteredPosts.map((post) => (
                                                <div key={post.id} className="rounded-2xl bg-[var(--a-surface)] border border-[var(--a-border)] px-4 py-4 md:px-5 flex flex-wrap md:flex-nowrap items-center gap-4">
                                                    <ThumbBox src={post.imageUrl} />
                                                    <div className="min-w-0 flex-1 basis-40">
                                                        <p className="font-semibold text-[var(--a-text)] truncate">{post.title}</p>
                                                        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--a-muted)]">
                                                            <span>{post.category}</span>
                                                            <span className="w-1 h-1 rounded-full bg-[var(--a-faint)]" />
                                                            <span>{formatDate(post.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center shrink-0">
                                                        {post.authors && post.authors.length > 0 ? (
                                                            <div className="flex -space-x-2">
                                                                {post.authors.map((a: any) => (
                                                                    <Avatar key={a.id} src={a.imageUrl} name={a.name} size={7} />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-[var(--a-faint)]">Sem autor</span>
                                                        )}
                                                    </div>
                                                    <StatusBadge status={post.status} />
                                                    <div className="flex items-center gap-1 ml-auto md:ml-0">
                                                        <IconActionButton onClick={() => handleStartEditPost(post)} title="Editar"><Pencil className="w-4 h-4" /></IconActionButton>
                                                        <IconActionButton onClick={() => handleDeletePost(post)} title="Excluir" variant="danger"><Trash2 className="w-4 h-4" /></IconActionButton>
                                                    </div>
                                                </div>
                                            ))}
                                        </ListShell>
                                    )}
                                </motion.div>
                            )}

                            {/* TELA 2: CRIAR / EDITAR ARTIGO */}
                            {currentView === 'create' && (
                                <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
                                    <button onClick={() => { resetPostForm(); setCurrentView('list'); }} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[var(--a-muted)] hover:text-[var(--a-text)] transition-colors">
                                        <ArrowLeft className="w-4 h-4" />
                                        Voltar para a lista
                                    </button>
                                    <div className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[28px] p-6 md:p-10">
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div className="md:col-span-2 space-y-6">
                                                    <div>
                                                        <label className={labelCls}>Título do artigo</label>
                                                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: O futuro do compliance..." className={inputCls} />
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>Conteúdo</label>
                                                        <RichTextEditor
                                                            content={formData.content}
                                                            onChange={(html) => setFormData({ ...formData, content: html })}
                                                            placeholder="Escreva o seu artigo aqui..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="bg-[var(--a-surface-2)] p-5 rounded-2xl">
                                                        <h3 className="font-bold text-[var(--a-text)] mb-4">Publicação</h3>
                                                        <button disabled={isSubmitting} onClick={(e) => handleCreatePost(e, 'Publicado')} className="w-full bg-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] text-[var(--a-accent-contrast)] py-3 rounded-full font-bold transition-colors mb-3 disabled:opacity-50">
                                                            {isSubmitting ? 'Salvando...' : editingPostId ? 'Publicar alterações' : 'Publicar artigo'}
                                                        </button>
                                                        <button disabled={isSubmitting} onClick={(e) => handleCreatePost(e, 'Rascunho')} className="w-full bg-[var(--a-text)]/5 hover:bg-[var(--a-text)]/10 text-[var(--a-text)] py-3 rounded-full font-bold transition-colors disabled:opacity-50">
                                                            Salvar rascunho
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>Categoria</label>
                                                        {isNewCategory ? (
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    autoFocus
                                                                    value={formData.category}
                                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                                    placeholder="Nome da nova categoria"
                                                                    className={`flex-1 min-w-0 ${inputCls}`}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setIsNewCategory(false); setFormData({ ...formData, category: categoryOptions[0] || '' }); }}
                                                                    className="shrink-0 px-4 py-3 rounded-2xl bg-[var(--a-text)]/5 text-[var(--a-text)] text-sm font-bold hover:bg-[var(--a-text)]/10 transition-colors"
                                                                >
                                                                    Cancelar
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <select
                                                                value={formData.category}
                                                                onChange={(e) => {
                                                                    if (e.target.value === '__new__') {
                                                                        setIsNewCategory(true);
                                                                        setFormData({ ...formData, category: '' });
                                                                    } else {
                                                                        setFormData({ ...formData, category: e.target.value });
                                                                    }
                                                                }}
                                                                className={inputCls}
                                                            >
                                                                {categoryOptions.map((cat) => (
                                                                    <option key={cat} value={cat}>{cat}</option>
                                                                ))}
                                                                <option value="__new__">+ Nova categoria...</option>
                                                            </select>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>Autores</label>
                                                        {formData.authorIds.length > 0 && (
                                                            <div className="flex -space-x-3 mb-3">
                                                                {formData.authorIds.map((id) => {
                                                                    const author = users.find((u) => u.id === id);
                                                                    if (!author) return null;
                                                                    return <Avatar key={id} src={author.imageUrl} name={author.name} size={10} />;
                                                                })}
                                                            </div>
                                                        )}
                                                        <div className="max-h-56 overflow-y-auto space-y-1 bg-[var(--a-surface-2)] rounded-2xl p-2">
                                                            {users.length === 0 ? (
                                                                <p className="text-sm text-[var(--a-faint)] p-2">Nenhum usuário cadastrado.</p>
                                                            ) : (
                                                                users.map((user) => (
                                                                    <label key={user.id} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[var(--a-text)]/5 cursor-pointer transition-colors">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={formData.authorIds.includes(user.id)}
                                                                            onChange={() => toggleFormAuthor(user.id)}
                                                                            className="w-4 h-4 accent-[var(--a-accent)]"
                                                                        />
                                                                        <Avatar src={user.imageUrl} name={user.name} size={7} />
                                                                        <span className="text-sm text-[var(--a-text)] truncate">{user.name}</span>
                                                                    </label>
                                                                ))
                                                            )}
                                                        </div>
                                                        {showNewAuthorForm ? (
                                                            <div className="mt-2 p-3 bg-[var(--a-surface-2)] rounded-2xl space-y-2">
                                                                <input
                                                                    type="text"
                                                                    value={newAuthorName}
                                                                    onChange={(e) => setNewAuthorName(e.target.value)}
                                                                    placeholder="Nome do novo autor"
                                                                    className="w-full px-3 py-2.5 bg-[var(--a-input-bg)] border border-transparent rounded-xl text-sm text-[var(--a-text)] placeholder:text-[var(--a-faint)] focus:outline-none focus:border-[var(--a-accent)]/40"
                                                                />
                                                                <ImageUrlInput
                                                                    value={newAuthorImageUrl}
                                                                    onChange={setNewAuthorImageUrl}
                                                                    placeholder="Foto do autor (URL)"
                                                                    inputClassName="flex-1 min-w-0 px-3 py-2.5 bg-[var(--a-input-bg)] border border-transparent rounded-xl text-sm text-[var(--a-text)] placeholder:text-[var(--a-faint)] focus:outline-none focus:border-[var(--a-accent)]/40"
                                                                />
                                                                <textarea
                                                                    value={newAuthorBio}
                                                                    onChange={(e) => setNewAuthorBio(e.target.value)}
                                                                    placeholder="Mini currículo do autor (exibido junto com a foto no artigo)"
                                                                    rows={2}
                                                                    className="w-full px-3 py-2.5 bg-[var(--a-input-bg)] border border-transparent rounded-xl text-sm text-[var(--a-text)] placeholder:text-[var(--a-faint)] focus:outline-none focus:border-[var(--a-accent)]/40 resize-none"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        type="button"
                                                                        disabled={isCreatingAuthor}
                                                                        onClick={handleCreateQuickAuthor}
                                                                        className="flex-1 bg-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] text-[var(--a-accent-contrast)] py-2 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
                                                                    >
                                                                        {isCreatingAuthor ? 'Adicionando...' : 'Adicionar autor'}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => { setShowNewAuthorForm(false); setNewAuthorName(''); setNewAuthorImageUrl(''); setNewAuthorBio(''); }}
                                                                        className="px-4 py-2 rounded-full text-sm font-bold text-[var(--a-text)] bg-[var(--a-text)]/5 hover:bg-[var(--a-text)]/10 transition-colors"
                                                                    >
                                                                        Cancelar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowNewAuthorForm(true)}
                                                                className="mt-2 w-full text-sm font-semibold text-[var(--a-accent)] hover:text-[var(--a-accent-hover)] bg-[var(--a-text)]/5 hover:bg-[var(--a-text)]/10 rounded-2xl py-2.5 transition-colors"
                                                            >
                                                                + Adicionar novo autor
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>Imagem de capa (URL)</label>
                                                        <ImageUrlInput
                                                            value={formData.imageUrl}
                                                            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                                        />
                                                        {formData.imageUrl && (
                                                            <div className="mt-3 rounded-2xl overflow-hidden bg-[var(--a-surface-2)]">
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
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                        <SearchInput value={userSearch} onChange={setUserSearch} placeholder="Buscar usuários..." />
                                        <button onClick={handleStartCreateUser} className="bg-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] text-[var(--a-accent-contrast)] px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all w-full sm:w-auto justify-center">
                                            <Plus className="w-5 h-5" />
                                            Adicionar usuário
                                        </button>
                                    </div>

                                    {filteredUsers.length === 0 ? (
                                        <div className="bg-[var(--a-surface-2)] rounded-[28px]">
                                            <EmptyState
                                                icon={UsersIcon}
                                                title={userSearch ? 'Nenhum usuário corresponde à busca.' : 'Nenhum usuário cadastrado.'}
                                            />
                                        </div>
                                    ) : (
                                        <ListShell>
                                            {filteredUsers.map((user) => (
                                                <div key={user.id} className="rounded-2xl bg-[var(--a-surface)] border border-[var(--a-border)] px-4 py-4 md:px-5 flex flex-wrap md:flex-nowrap items-center gap-4">
                                                    <Avatar src={user.imageUrl} name={user.name} size={9} />
                                                    <div className="min-w-0 flex-1 basis-40">
                                                        <p className="font-semibold text-[var(--a-text)] truncate">{user.name}</p>
                                                        <p className="text-xs text-[var(--a-muted)] truncate">{user.email}</p>
                                                    </div>
                                                    <span className="text-xs text-[var(--a-muted)] bg-[var(--a-text)]/5 px-3 py-1 rounded-full shrink-0">{user.role}</span>
                                                    <span className="text-xs text-[var(--a-faint)] shrink-0 hidden sm:block">{formatDate(user.createdAt)}</span>
                                                    <StatusBadge status={user.status} activeValue="Ativo" />
                                                    <div className="flex items-center gap-1 ml-auto md:ml-0">
                                                        <IconActionButton onClick={() => handleStartEditUser(user)} title="Editar"><Pencil className="w-4 h-4" /></IconActionButton>
                                                        <IconActionButton onClick={() => handleDeleteUser(user)} title="Excluir" variant="danger"><Trash2 className="w-4 h-4" /></IconActionButton>
                                                    </div>
                                                </div>
                                            ))}
                                        </ListShell>
                                    )}
                                </motion.div>
                            )}

                            {/* TELA 4: CRIAR / EDITAR USUÁRIO */}
                            {currentView === 'createUser' && (
                                <motion.div key="createUser" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto">
                                    <button onClick={() => { resetUserForm(); setCurrentView('users'); }} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[var(--a-muted)] hover:text-[var(--a-text)] transition-colors">
                                        <ArrowLeft className="w-4 h-4" />
                                        Voltar para usuários
                                    </button>

                                    <div className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[28px] p-6 md:p-10">
                                        <div className="space-y-6">
                                            <div>
                                                <label className={labelCls}>Nome completo</label>
                                                <input
                                                    type="text"
                                                    value={userFormData.name}
                                                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                                                    placeholder="Ex: João da Silva"
                                                    className={inputCls}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>E-mail</label>
                                                <input
                                                    type="email"
                                                    value={userFormData.email}
                                                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                                                    placeholder="Ex: joao@empresa.com"
                                                    className={inputCls}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>
                                                    Senha {editingUserId && <span className="text-[var(--a-faint)]">(deixe em branco para manter a atual)</span>}
                                                </label>
                                                <input
                                                    type="password"
                                                    value={userFormData.password}
                                                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                                                    placeholder={editingUserId ? "••••••••" : "Mínimo de 6 caracteres"}
                                                    className={inputCls}
                                                />
                                            </div>

                                            <div>
                                                <label className={labelCls}>Foto de perfil (URL)</label>
                                                <div className="flex items-center gap-4">
                                                    <Avatar src={userFormData.imageUrl} name={userFormData.name} size={14} />
                                                    <ImageUrlInput
                                                        value={userFormData.imageUrl}
                                                        onChange={(url) => setUserFormData({ ...userFormData, imageUrl: url })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={labelCls}>Mini currículo</label>
                                                <textarea
                                                    value={userFormData.bio}
                                                    onChange={(e) => setUserFormData({ ...userFormData, bio: e.target.value })}
                                                    placeholder="Ex: Mestre em Direito da Regulação pela FGV, atua há 10 anos com compliance corporativo."
                                                    rows={3}
                                                    className={`${inputCls} resize-none`}
                                                />
                                                <p className="text-xs text-[var(--a-faint)] mt-1.5">Exibido junto com a foto do autor nos artigos do blog.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className={labelCls}>Papel (role)</label>
                                                    <select
                                                        value={userFormData.role}
                                                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                                                        className={inputCls}
                                                    >
                                                        <option value="Autor">Autor</option>
                                                        <option value="Editor">Editor</option>
                                                        <option value="Administrador">Administrador</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Status</label>
                                                    <select
                                                        value={userFormData.status}
                                                        onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value })}
                                                        className={inputCls}
                                                    >
                                                        <option value="Ativo">Ativo</option>
                                                        <option value="Inativo">Inativo</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
                                                <button
                                                    onClick={() => { resetUserForm(); setCurrentView('users'); }}
                                                    className="px-6 py-3 rounded-full font-bold text-[var(--a-text)] bg-[var(--a-text)]/5 hover:bg-[var(--a-text)]/10 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    disabled={isSubmittingUser}
                                                    onClick={handleCreateUser}
                                                    className="px-6 py-3 rounded-full font-bold text-[var(--a-accent-contrast)] bg-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] transition-colors disabled:opacity-50"
                                                >
                                                    {isSubmittingUser ? 'Salvando...' : editingUserId ? 'Salvar alterações' : 'Salvar usuário'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            {/* TELA 5: CONTATOS RECEBIDOS */}
                            {currentView === 'leads' && (
                                <motion.div key="leads" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                        <SearchInput value={leadSearch} onChange={setLeadSearch} placeholder="Buscar contatos..." />
                                        <p className="text-sm text-[var(--a-muted)] font-semibold">{filteredLeads.length} contato(s)</p>
                                    </div>

                                    {filteredLeads.length === 0 ? (
                                        <div className="bg-[var(--a-surface-2)] rounded-[28px]">
                                            <EmptyState
                                                title={leadSearch ? 'Nenhum contato corresponde à busca.' : 'Nenhum contato recebido ainda.'}
                                            />
                                        </div>
                                    ) : (
                                        <ListShell>
                                            {filteredLeads.map((lead) => (
                                                <div key={lead.id} className="rounded-2xl bg-[var(--a-surface)] border border-[var(--a-border)] px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-[var(--a-text)] truncate">{lead.name || 'Não informado'}</p>
                                                        <a href={`mailto:${lead.email}`} className="text-xs text-[var(--a-muted)] hover:text-[var(--a-accent)] transition-colors">{lead.email}</a>
                                                        {lead.message && (
                                                            <p className="text-xs text-[var(--a-faint)] truncate max-w-md mt-1" title={lead.message}>{lead.message}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                                                        {lead.phone && (
                                                            <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--a-muted)] hover:text-[var(--a-accent)] bg-[var(--a-text)]/5 px-3 py-1 rounded-full transition-colors">{lead.phone}</a>
                                                        )}
                                                        {(lead.course || lead.subject) && (
                                                            <span className="text-xs text-[var(--a-text)] bg-[var(--a-text)]/5 px-3 py-1 rounded-full">{lead.course ? formatCourse(lead.course) : lead.subject}</span>
                                                        )}
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${lead.source === 'popup' ? 'bg-[var(--a-highlight-to)]/15 text-[var(--a-highlight-to)]' : 'bg-[var(--a-accent)]/15 text-[var(--a-accent)]'}`}>
                                                            {lead.source === 'popup' ? 'Popup' : 'Formulário'}
                                                        </span>
                                                        <span className="text-xs text-[var(--a-faint)]">{formatDate(lead.createdAt)}</span>
                                                    </div>
                                                    <IconActionButton onClick={() => handleDeleteLead(lead)} title="Excluir" variant="danger"><Trash2 className="w-4 h-4" /></IconActionButton>
                                                </div>
                                            ))}
                                        </ListShell>
                                    )}
                                </motion.div>
                            )}

                            {/* TELA 6: LISTA DE EVENTOS DA AGENDA */}
                            {currentView === 'agenda' && (
                                <motion.div key="agenda" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                        <SearchInput value={agendaSearch} onChange={setAgendaSearch} placeholder="Buscar eventos..." />
                                        <button onClick={handleStartCreateAgenda} className="bg-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] text-[var(--a-accent-contrast)] px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all w-full sm:w-auto justify-center">
                                            <Plus className="w-5 h-5" />
                                            Criar novo evento
                                        </button>
                                    </div>

                                    {filteredAgenda.length === 0 ? (
                                        <div className="bg-[var(--a-surface-2)] rounded-[28px]">
                                            <EmptyState
                                                title={agendaSearch ? 'Nenhum evento corresponde à busca.' : 'Nenhum evento encontrado.'}
                                                description={agendaSearch ? undefined : 'Crie o seu primeiro evento!'}
                                            />
                                        </div>
                                    ) : (
                                        <ListShell>
                                            {filteredAgenda.map((item) => (
                                                <div key={item.id} className="rounded-2xl bg-[var(--a-surface)] border border-[var(--a-border)] px-4 py-4 md:px-5 flex flex-wrap md:flex-nowrap items-center gap-4">
                                                    <ThumbBox src={item.image} />
                                                    <div className="min-w-0 flex-1 basis-40">
                                                        <p className="font-semibold text-[var(--a-text)] truncate">{item.title}</p>
                                                        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--a-muted)]">
                                                            <span className="truncate max-w-[160px]">{item.category}</span>
                                                            <span className="w-1 h-1 rounded-full bg-[var(--a-faint)] shrink-0" />
                                                            <span className="flex items-center gap-1 truncate"><Mic className="w-3 h-3 shrink-0" />{item.speakers}</span>
                                                        </div>
                                                    </div>
                                                    <span className="hidden sm:flex items-center gap-1 text-xs text-[var(--a-faint)] shrink-0"><Hash className="w-3 h-3" />{item.order}</span>
                                                    <StatusBadge status={item.status} activeValue="Ativo" />
                                                    <div className="flex items-center gap-1 ml-auto md:ml-0">
                                                        <IconActionButton onClick={() => handleStartEditAgenda(item)} title="Editar"><Pencil className="w-4 h-4" /></IconActionButton>
                                                        <IconActionButton onClick={() => handleDeleteAgenda(item)} title="Excluir" variant="danger"><Trash2 className="w-4 h-4" /></IconActionButton>
                                                    </div>
                                                </div>
                                            ))}
                                        </ListShell>
                                    )}
                                </motion.div>
                            )}

                            {/* TELA 7: CRIAR / EDITAR EVENTO DA AGENDA */}
                            {currentView === 'createAgenda' && (
                                <motion.div key="createAgenda" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto">
                                    <button onClick={() => { resetAgendaForm(); setCurrentView('agenda'); }} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[var(--a-muted)] hover:text-[var(--a-text)] transition-colors">
                                        <ArrowLeft className="w-4 h-4" />
                                        Voltar para agenda
                                    </button>

                                    <div className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[28px] p-6 md:p-10">
                                        <div className="space-y-6">
                                            <div>
                                                <label className={labelCls}>Categoria</label>
                                                <input
                                                    type="text"
                                                    value={agendaFormData.category}
                                                    onChange={(e) => setAgendaFormData({ ...agendaFormData, category: e.target.value })}
                                                    placeholder="Ex: [ PROGRAMA ESPECIAL ]"
                                                    className={inputCls}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Título do evento</label>
                                                <input
                                                    type="text"
                                                    value={agendaFormData.title}
                                                    onChange={(e) => setAgendaFormData({ ...agendaFormData, title: e.target.value })}
                                                    placeholder="Ex: Estratégia e Inovação — 2026/2027"
                                                    className={inputCls}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Palestrantes</label>
                                                <input
                                                    type="text"
                                                    value={agendaFormData.speakers}
                                                    onChange={(e) => setAgendaFormData({ ...agendaFormData, speakers: e.target.value })}
                                                    placeholder="Ex: HELENA VILLA-LOBOS, ROBERTO K. MENDES"
                                                    className={inputCls}
                                                />
                                                <p className="text-xs text-[var(--a-faint)] mt-1.5">Separe os nomes por vírgula.</p>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Imagem de fundo (URL)</label>
                                                <ImageUrlInput
                                                    value={agendaFormData.image}
                                                    onChange={(url) => setAgendaFormData({ ...agendaFormData, image: url })}
                                                />
                                                {agendaFormData.image && (
                                                    <div className="mt-3 rounded-2xl overflow-hidden bg-[var(--a-surface-2)]">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={agendaFormData.image}
                                                            alt="Pré-visualização"
                                                            className="w-full h-32 object-cover"
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Link (opcional)</label>
                                                <input
                                                    type="text"
                                                    value={agendaFormData.link}
                                                    onChange={(e) => setAgendaFormData({ ...agendaFormData, link: e.target.value })}
                                                    placeholder="https://..."
                                                    className={inputCls}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Tamanho do card</label>
                                                <select
                                                    value={agendaFormData.gridClass}
                                                    onChange={(e) => setAgendaFormData({ ...agendaFormData, gridClass: e.target.value })}
                                                    className={inputCls}
                                                >
                                                    {AGENDA_LAYOUT_OPTIONS.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className={labelCls}>Ordem de exibição</label>
                                                    <input
                                                        type="number"
                                                        value={agendaFormData.order}
                                                        onChange={(e) => setAgendaFormData({ ...agendaFormData, order: Number(e.target.value) })}
                                                        className={inputCls}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Status</label>
                                                    <select
                                                        value={agendaFormData.status}
                                                        onChange={(e) => setAgendaFormData({ ...agendaFormData, status: e.target.value })}
                                                        className={inputCls}
                                                    >
                                                        <option value="Ativo">Ativo</option>
                                                        <option value="Inativo">Inativo</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
                                                <button
                                                    onClick={() => { resetAgendaForm(); setCurrentView('agenda'); }}
                                                    className="px-6 py-3 rounded-full font-bold text-[var(--a-text)] bg-[var(--a-text)]/5 hover:bg-[var(--a-text)]/10 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    disabled={isSubmittingAgenda}
                                                    onClick={handleCreateAgenda}
                                                    className="px-6 py-3 rounded-full font-bold text-[var(--a-accent-contrast)] bg-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] transition-colors disabled:opacity-50"
                                                >
                                                    {isSubmittingAgenda ? 'Salvando...' : editingAgendaId ? 'Salvar alterações' : 'Salvar evento'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
