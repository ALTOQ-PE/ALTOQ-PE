// ==============================================================================
// ALTOQ PE - COMPONENTE DE RECETA EXPRESS EN YOUTUBE (LITE EMBED)
// Reproductor ligero con fachada previa para máximo rendimiento (0% retraso)
// REGLA ESTRICTA: Sin uso de emojis en código ni contenido
// ==============================================================================

'use client';

import React, { useState } from 'react';

export interface YoutubeRecipeEmbedProps {
  videoIdOrUrl: string;
  recipeTitle: string;
  prepTimeMinutes?: number;
}

export const YoutubeRecipeEmbed: React.FC<YoutubeRecipeEmbedProps> = ({
  videoIdOrUrl,
  recipeTitle,
  prepTimeMinutes = 3,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extraer ID de video si se pasa una URL completa de YouTube
  const getVideoId = (input: string) => {
    if (!input) return '';
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : input;
  };

  const videoId = getVideoId(videoIdOrUrl);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (!videoId) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-neutral-950 aspect-video shadow-md border border-neutral-800 group">
      {isPlaying ? (
        <iframe
          className="w-full h-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={`Receta Express: ${recipeTitle}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="w-full h-full relative block text-left focus:outline-none focus:ring-2 focus:ring-[#8BAA52]"
          aria-label={`Reproducir receta express de ${recipeTitle}`}
        >
          {/* Imagen de Portada Optimizada */}
          <img
            src={thumbnailUrl}
            alt={`Miniatura de preparación: ${recipeTitle}`}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
            loading="lazy"
          />

          {/* Gradiente de contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Insignia de Tiempo de Preparación */}
          <div className="absolute top-3 left-3 bg-[#0F3D2E]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border border-[#8BAA52]/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8BAA52]" />
            <span>Listo en {prepTimeMinutes} minutos</span>
          </div>

          {/* Boton de Play Estilo YouTube */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-10 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#CC0000] transition-transform">
              <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Titulo Inferior */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-xs font-medium text-neutral-300">Receta Express ALTOQ PE</p>
            <p className="text-sm font-bold truncate">{recipeTitle}</p>
          </div>
        </button>
      )}
    </div>
  );
};
