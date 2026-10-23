'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Video,
  Play,
  BookOpen,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Share2,
  Truck
} from 'lucide-react';

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
}

const TRAINING_MODULES: TrainingCourse[] = [
  {
    id: 'course-01',
    title: 'De Foto Simple a Fotografía Profesional con Celular',
    description: 'Aprende a capturar la textura y colores vivos de tus platos y pouches usando luz natural en tu planta.',
    duration: '14 min',
    thumbnail: '/assets/videos/video-foto-profesional.png',
    category: 'Marketing Visual',
  },
  {
    id: 'course-02',
    title: 'Diseño de Catálogos y Redes en Canva',
    description: 'Plantillas prediseñadas oficiales listas para promocionar tus productos en WhatsApp y redes sociales.',
    duration: '18 min',
    thumbnail: '/assets/videos/video-disena-canva.png',
    category: 'Herramientas Digitales',
  },
  {
    id: 'course-03',
    title: 'Cómo Hacer que tu Marca Agroindustrial Destaque',
    description: 'Estrategias de diferenciación para cooperativas y productores regionales frente a marcas masivas.',
    duration: '22 min',
    thumbnail: '/assets/videos/video-marca-destaque.png',
    category: 'Identidad de Marca',
  },
  {
    id: 'course-04',
    title: 'Estrategias para Vender en Redes Sociales',
    description: 'Cómo captar pedidos de clientes particulares, deportistas y tiendas especializadas en Lima.',
    duration: '16 min',
    thumbnail: '/assets/videos/video-vender-redes.png',
    category: 'Comercialización',
  },
  {
    id: 'course-05',
    title: 'Cuándo y Cómo Invertir en Publicidad Digital',
    description: 'Guía paso a paso para pautar anuncios con bajo presupuesto y retorno medible.',
    duration: '20 min',
    thumbnail: '/assets/videos/video-invertir-publicidad.png',
    category: 'Crecimiento',
  },
  {
    id: 'course-06',
    title: 'Gestión Efectiva de Redes Sociales para Productores',
    description: 'Buenas prácticas para responder consultas de clientes y publicar contenido educativo sobre liofilizados.',
    duration: '15 min',
    thumbnail: '/assets/videos/video-redes-sociales.png',
    category: 'Atención al Cliente',
  },
];

interface CommunityPost {
  id: string;
  author: string;
  company: string;
  region: string;
  title: string;
  content: string;
  repliesCount: number;
  date: string;
  tag: string;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Roberto Huamán',
    company: 'Cooperativa Valle Sagrado',
    region: 'Cusco',
    title: 'Consolidación de carga Cusco - Lima para reducir flete',
    content: 'Estamos coordinando un flete refrigerado/seco para el 5 de noviembre desde Anta hacia Lima. Si alguien en Cusco tiene cajas por enviar, contáctennos para compartir costos.',
    repliesCount: 4,
    date: 'Hace 2 días',
    tag: 'Logística Compartida',
  },
  {
    id: 'post-2',
    author: 'Elena Morales',
    company: 'BioAlimentos Junín',
    region: 'Junín',
    title: 'Fabricante de bolsas foil tricapa con certificación DIGESA',
    content: 'Comparto el contacto de una fábrica en Lurín que produce pouches tricapa con válvula de desgasificado y sellado hermético apto para exportación.',
    repliesCount: 7,
    date: 'Hace 4 días',
    tag: 'Proveedores e Insumos',
  },
  {
    id: 'post-3',
    author: 'Juan Quispe',
    company: 'Super Foods Andinos',
    region: 'Puno',
    title: 'Requisitos para trámite de renovación RSA en DIGESA VUCE',
    content: 'Les recomiendo ingresar el expediente con 45 días de anticipación. Si tienen dudas con los análisis bromatológicos de laboratorio acreditado INACAL, les puedo guiar.',
    repliesCount: 9,
    date: 'Hace 1 semana',
    tag: 'Regulación y DIGESA',
  },
];

export default function AgrocomunidadesPage() {
  const [selectedVideo, setSelectedVideo] = useState<TrainingCourse | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostItem: CommunityPost = {
      id: `post-${Date.now()}`,
      author: 'Roberto Huamán',
      company: 'Cooperativa Agraria Valle Sagrado',
      region: 'Cusco',
      title: newTitle,
      content: newContent,
      repliesCount: 0,
      date: 'Recién publicado',
      tag: 'Consulta General',
    };

    setPosts([newPostItem, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostForm(false);
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Encabezado y Navegación */}
      <div>
        <Link
          href="/producer"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Productos</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
              Agrocomunidades y Desalfabetización Digital
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-muted mt-1">
              Programa de formación técnica y red colaborativa para productores agroindustriales peruanos.
            </p>
          </div>
          <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-brand-md text-amber-900 text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Membresía Plan Oro Habilitada</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: Cursos en Video de Desalfabetización Digital */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-brand-primary">
              Módulos Prácticos de Capacitación
            </h2>
            <p className="text-xs text-brand-text-muted">
              Cursos breves y directos al grano diseñados especialmente para la realidad agroindustrial.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            6 Módulos Disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRAINING_MODULES.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-brand-primary/10 rounded-brand-xl overflow-hidden shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video bg-gray-100 overflow-hidden cursor-pointer" onClick={() => setSelectedVideo(course)}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-mono font-bold rounded">
                    {course.duration}
                  </span>
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand-primary/80 text-white text-[10px] font-bold rounded uppercase">
                    {course.category}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="font-extrabold text-sm text-brand-primary line-clamp-1 group-hover:text-brand-secondary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-brand-text-muted line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedVideo(course)}
                  className="w-full py-2 bg-brand-surface-soft hover:bg-gray-200 text-brand-primary rounded-brand-md text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Ver Clase Práctica</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: Muro Interactivo de la Agrocomunidad */}
      <section className="bg-white border border-brand-primary/10 rounded-brand-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-secondary-dark mb-0.5">
              <Users className="w-4 h-4" />
              <span>Red Colaborativa de Productores Peruanos</span>
            </div>
            <h2 className="text-lg font-extrabold text-brand-primary">
              Muro de Consultas, Alianzas y Fletes Compartidos
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="px-4 py-2 bg-brand-primary text-white rounded-brand-md text-xs font-bold hover:bg-brand-primary-light transition-colors self-start sm:self-auto"
          >
            {showNewPostForm ? 'Cerrar Formulario' : '+ Publicar en la Comunidad'}
          </button>
        </div>

        {postSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-brand-md text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Tu publicación ha sido compartida con todos los productores de la red ALTOQ PE.</span>
          </div>
        )}

        {/* Formulario Nueva Publicación */}
        {showNewPostForm && (
          <form onSubmit={handleCreatePost} className="p-4 rounded-brand-lg bg-gray-50 border border-gray-200 space-y-3 animate-fadeIn text-xs">
            <h3 className="font-extrabold text-sm text-brand-primary">Nueva Consulta o Propuesta para la Red</h3>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Título:</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej. Flete compartido Ayacucho - Lima para quincena de Noviembre"
                className="w-full px-3 py-2 border border-gray-300 rounded-brand-md bg-white focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Mensaje o Detalle:</label>
              <textarea
                required
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Describe tu propuesta, consulta sobre registros sanitarios, proveedores de empaque o fletes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-brand-md bg-white focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="px-3 py-1.5 border border-gray-300 rounded-brand-md text-gray-700 font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-primary text-white rounded-brand-md font-extrabold hover:bg-brand-primary-light transition-colors"
              >
                Publicar Mensaje
              </button>
            </div>
          </form>
        )}

        {/* Listado de Publicaciones */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-brand-lg border border-gray-200 hover:border-brand-primary/30 transition-all space-y-2 bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-brand-primary">
                    {post.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary">
                    {post.tag}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {post.date}
                </span>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-brand-text-muted">
                <div>
                  <strong>{post.author}</strong> • {post.company} ({post.region})
                </div>
                <div className="flex items-center space-x-1 text-brand-primary font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.repliesCount} respuestas</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Reproductor de Clase */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-brand-xl max-w-2xl w-full p-6 shadow-2xl border border-brand-primary/10 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary-dark">
                  {selectedVideo.category} • {selectedVideo.duration}
                </span>
                <h3 className="text-base font-extrabold text-brand-primary">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-brand-lg overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white space-y-2 p-4 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
                <div className="text-xs font-bold max-w-sm">
                  Sesión educativa de ALTOQ PE para productores agroindustriales.
                </div>
              </div>
            </div>

            <div className="p-3 bg-brand-bg/50 rounded-brand-md text-xs text-brand-text-muted leading-relaxed">
              <strong>Resumen de la sesión:</strong> {selectedVideo.description} Incluye plantillas descargables para el empaque y ficha técnica.
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="px-5 py-2 bg-brand-primary text-white rounded-brand-md text-xs font-extrabold hover:bg-brand-primary-light transition-colors"
              >
                Entendido / Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
