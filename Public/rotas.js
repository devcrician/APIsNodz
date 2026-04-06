const apiData = {
    categories: [
        {
   id: 'downloads',
   name: 'Downloads',
   icon: 'fas fa-download',
   color: '#20B2AA',
   description: 'APIs para download de conteúdo multimídia',
   routes: [
       {
   id: 'youtubeaudio',
   name: 'YouTube Audio',
   method: 'GET',
   path: '/api/downloads/youtube/audio?url='
       },
       {
   id: 'youtubevideo',
   name: 'YouTube Video',
   method: 'GET',
   path: '/api/downloads/youtube/video?url='
       },
       {
   id: 'instagram',
   name: 'Instagram',
   method: 'GET',
   path: '/api/downloads/instagram?url='
       },
        {
   id: 'pinterest1',
   name: 'Pinterest',
   method: 'GET',
   path: '/api/downloads/pinterest?url='
       },
       {
   id: 'tiktok',
   name: 'TikTok',
   method: 'GET',
   path: '/api/downloads/tiktok?url='
       },
       {
   id: 'facebook',
   name: 'FaceBook',
   method: 'GET',
   path: '/api/downloads/facebook?url='
      },
       {
   id: 'kwai',
   name: 'Kwai',
   method: 'GET',
   path: '/api/downloads/kwai?url='
      },
       {
   id: 'twitter',
   name: 'Twitter',
   method: 'GET',
   path: '/api/downloads/twitter?url='
      },
      {
        id: 'gdrive',
        name: 'Gdrive',
        method: 'GET',
        path: '/api/downloads/gdrive?url='
      },
      {
        id: 'capcut',
        name: 'CapCut',
        method: 'GET',
        path: '/api/downloads/capcut?url='
      },
     {
       id: 'fdroid',
       name: 'Fdroid',
       method: 'GET',
       path: '/api/downloads/fdroid?url='
     },
     {
       id: 'threads',
       name: 'Threads',
       method: 'GET',
       path: '/api/downloads/threads?url='
     }
   ]
        },
        {
   id: 'tools',
   name: 'Tools',
   icon: 'fas fa-tools',
   color: '#00FF7F',
   description: 'Ferramentas úteis para desenvolvedores',
   routes: [
       {
         id: 'lyrics',
         name: 'Lyrics',
         method: 'GET',
         path: '/api/tools/lyrics?query='
       },
       {
         id: 'gerarnick',
         name: 'Gerar Nick',
         method: 'GET',
         path: '/api/tools/gerarnick?query='
       },
       {
         id: 'codificar',
         name: 'Codificar',
         method: 'GET',
         path: '/api/tools/codificar?query='
       },
       {
         id: 'decodificar',
         name: 'Decodificar',
         method: 'GET',
         path: '/api/tools/decodificar?query='
       },
       {
         id: 'morse',
         name: 'Morse',
         method: 'GET',
         path: '/api/tools/morse?query='
       },
       {
         id: 'pensador',
         name: 'Pensador',
         method: 'GET',
         path: '/api/tools/pensador?query='
       },
       {
         id: 'historias',
         name: 'Histórias',
         method: 'GET',
         path: '/api/tools/historias'
       }
   ]
        },
        {
          id: 'canvas',
          name: 'Canvas',
          icon: 'fas fa-paint-brush',
          color: '#E755C3',
          description: 'Canvas de diversos tipos',
          routes: [
   {
     id: 'musica',
     name: 'Musica',
     method: 'GET',
     path: '/api/canvas/musica?titulo='
   },
   {
     id: 'instagramstk',
     name: 'Instagram',
     method: 'GET',
     path: '/api/canvas/instagram?username='
   }
   ]
        },
         {
   id: 'stalkers',
   name: 'Stalkers',
   icon: 'fas fa-eye',
   color: '#6c2bd9',
   description: 'Stalkers de perfis de redes sociais',
   routes: [
       {
   id: 'igstalk',
   name: 'Instagram',
   method: 'GET',
   path: '/api/stalkers/instagram?user='
       },
       {
         id: 'tikstalk',
         name: 'TikTok',
         method: 'GET',
         path: '/api/stalkers/tiktok?user='
       }
   ]
        },
        {
   id: 'ia',
   name: 'Ias',
   icon: 'fas fa-robot',
   color: '#ADFF2F',
   description: 'Serviços avançados de IA',
   routes: [
       {
   id: 'copilot',
   name: 'Copilot',
   method: 'GET',
   path: '/api/ias/copilot?prompt='
       }, 
       {
   id: 'qwen/qwen3-235b-a22b',
   name: 'Qwen3-235b-a22b',
   method: 'GET',
   path: '/api/ias/qwen3-235b-a22b?prompt='
       }, 
       {
   id: 'google/gemma-7b',
   name: 'Gemma-7b',
   method: 'GET',
   path: '/api/ias/gemma-7b?prompt='
       }, 
       {
   id: 'moonshotai/kimi-k2-instruct',
   name: 'Kimi-k2-instruct',
   method: 'GET',
   path: '/api/ias/kimi-k2-instruct?prompt='
       }, 
       {
   id: 'abacusai/dracarys-llama-3.1-70b-instruct',
   name: 'Dracarys-llama-3',
   method: 'GET',
   path: '/api/ias/dracarys-llama-3?prompt='
       }, 
       {
   id: 'microsoft/phi-3-medium-4k-instruct',
   name: 'Phi-3-medium-4k-instruct',
   method: 'GET',
   path: '/api/ias/phi-3-medium-4k-instruct?prompt='
       }
   ]
        },
        {
   id: 'consultas',
   name: 'Consultas',
   icon: 'fas fa-mask',
   color: '#fbbf24',
   description: 'APIs utilitárias diversas',
   routes: [
       {
   id: 'nome',
   name: 'Nome',
   method: 'GET',
   path: '/api/consultas/nome?dados='
       },
       {
         id: 'cpf',
         name: 'Cpf',
         method: 'GET',
         path: '/api/consultas/cpf?dados='
       },
     {
       id: 'telefone',
       name: 'Telefone',
       method: 'GET',
       path: '/api/consultas/telefone?dados='
     },
     {
       id: 'placa',
       name: 'Placa',
       method: 'GET',
       path: '/api/consultas/placa?dados='
     }
   ]
        },
        {
   id: 'pesquisas',
   name: 'Pesquisas',
   icon: 'fas fa-search',
   color: '#f87171',
   description: 'APIs de pesquisa de mídias',
   routes: [
       {
   id: 'youtube',
   name: 'YouTube',
   method: 'GET',
   path: '/api/pesquisas/youtube?query='
       },
       {
   id: 'pinterest',
   name: 'Pinterest',
   method: 'GET',
   path: '/api/pesquisas/pinterest?query='
       }, 
       {
   id: 'audiomeme',
   name: 'AudioMeme',
   method: 'GET',
   path: '/api/pesquisas/audiomeme?query='
       }, 
       {
   id: 'dicionario',
   name: 'Dicionario',
   method: 'GET',
   path: '/api/pesquisas/dicionario?query='
       }, 
       {
   id: 'playstore',
   name: 'PlayStore',
   method: 'GET',
   path: '/api/pesquisas/playstore?query='
       }, 
       {
   id: 'horoscopo',
   name: 'Horoscopo',
   method: 'GET',
   path: '/api/pesquisas/horoscopo?query='
       }, 
       {
   id: 'tiktoksrc',
   name: 'TikTok',
   method: 'GET',
   path: '/api/pesquisas/tiktok?query='
       }, 
       {
   id: 'bing',
   name: 'Bing',
   method: 'GET',
   path: '/api/pesquisas/bing?query='
       }
   ]
        }, 
        {
   id: 'logotipos',
   name: 'Logotipos',
   icon: 'fas fa-certificate',
   color: '#808080',
   description: 'APIs de logotipos do ephoto',
   routes: [
       {
   id: 'darkgreen',
   name: 'DarkGreen',
   method: 'GET',
   path: '/api/logotipos/darkgreen?text='
       }, 
       {
   id: 'glitch',
   name: 'Glitch',
   method: 'GET',
   path: '/api/logotipos/glitch?text='
       }, 
       {
   id: 'write',
   name: 'Write',
   method: 'GET',
   path: '/api/logotipos/write?text='
       }, 
       {
   id: 'advanced',
   name: 'Advanced',
   method: 'GET',
   path: '/api/logotipos/advanced?text='
       }, 
       {
   id: 'typography',
   name: 'Typography',
   method: 'GET',
   path: '/api/logotipos/typography?text='
       }, 
       {
   id: 'pixel',
   name: 'Pixel',
   method: 'GET',
   path: '/api/logotipos/pixel?text='
       }, 
       {
   id: 'neon',
   name: 'Neon',
   method: 'GET',
   path: '/api/logotipos/neon?text='
       }, 
       {
   id: 'flag',
   name: 'Flag',
   method: 'GET',
   path: '/api/logotipos/flag?text='
       }, 
       {
   id: 'americanflag',
   name: 'Americanflag',
   method: 'GET',
   path: '/api/logotipos/americanflag?text='
       }, 
       {
   id: 'deleting',
   name: 'Deleting',
   method: 'GET',
   path: '/api/logotipos/deleting?text='
       }
   ]
        }
    ]
};