const apiData = {
    categories: [
        {
            id: 'downloads',
            name: 'Downloads',
            icon: 'fas fa-download',
            color: '#20B2AA',
            description: 'APIs para download de conteúdo multimídia',
            routes: [
                { id: 'youtubeaudio', name: 'YouTube Audio', method: 'GET', path: '/api/downloads/youtube/audio?url=' },
                { id: 'youtubevideo', name: 'YouTube Video', method: 'GET', path: '/api/downloads/youtube/video?url=' },
                { id: 'instagram', name: 'Instagram', method: 'GET', path: '/api/downloads/instagram?url=' },
                { id: 'pinterest', name: 'Pinterest', method: 'GET', path: '/api/downloads/pinterest?url=' },
                { id: 'tiktok', name: 'TikTok', method: 'GET', path: '/api/downloads/tiktok?url=' },
                { id: 'facebook', name: 'Facebook', method: 'GET', path: '/api/downloads/facebook?url=' },
                { id: 'kwai', name: 'Kwai', method: 'GET', path: '/api/downloads/kwai?url=' },
                { id: 'twitter', name: 'Twitter', method: 'GET', path: '/api/downloads/twitter?url=' },
                { id: 'gdrive', name: 'Google Drive', method: 'GET', path: '/api/downloads/gdrive?url=' },
                { id: 'capcut', name: 'CapCut', method: 'GET', path: '/api/downloads/capcut?url=' },
                { id: 'fdroid', name: 'F-Droid', method: 'GET', path: '/api/downloads/fdroid?url=' },
                { id: 'threads', name: 'Threads', method: 'GET', path: '/api/downloads/threads?url=' }
            ]
        },
        {
            id: 'tools',
            name: 'Tools',
            icon: 'fas fa-tools',
            color: '#00FF7F',
            description: 'Ferramentas úteis para desenvolvedores',
            routes: [
                { id: 'lyrics', name: 'Lyrics', method: 'GET', path: '/api/tools/lyrics?query=' },
                { id: 'gerarnick', name: 'Gerar Nick', method: 'GET', path: '/api/tools/gerarnick?query=' },
                { id: 'codificar', name: 'Codificar', method: 'GET', path: '/api/tools/codificar?query=' },
                { id: 'decodificar', name: 'Decodificar', method: 'GET', path: '/api/tools/decodificar?query=' },
                { id: 'morse', name: 'Morse', method: 'GET', path: '/api/tools/morse?query=' },
                { id: 'pensador', name: 'Pensador', method: 'GET', path: '/api/tools/pensador?query=' },
                { id: 'historias', name: 'Histórias', method: 'GET', path: '/api/tools/historias' }
            ]
        },
        {
            id: 'ias',
            name: 'IAs',
            icon: 'fas fa-robot',
            color: '#ADFF2F',
            description: 'Serviços avançados de IA',
            routes: [
                { id: 'copilot', name: 'Copilot', method: 'GET', path: '/api/ias/copilot?prompt=' },
                { id: 'qwen3', name: 'Qwen3-235b-A22b', method: 'GET', path: '/api/ias/qwen3-235b-a22b?prompt=' },
                { id: 'gemma', name: 'Gemma-7b', method: 'GET', path: '/api/ias/gemma-7b?prompt=' },
                { id: 'kimi', name: 'Kimi-k2-instruct', method: 'GET', path: '/api/ias/kimi-k2-instruct?prompt=' },
                { id: 'dracarys', name: 'Dracarys-llama-3', method: 'GET', path: '/api/ias/dracarys-llama-3?prompt=' },
                { id: 'phi', name: 'Phi-3-medium', method: 'GET', path: '/api/ias/phi-3-medium?prompt=' }
            ]
        },
        {
            id: 'stalkers',
            name: 'Stalkers',
            icon: 'fas fa-eye',
            color: '#6c2bd9',
            description: 'Stalkers de perfis de redes sociais',
            routes: [
                { id: 'igstalk', name: 'Instagram', method: 'GET', path: '/api/stalkers/instagram?user=' },
                { id: 'tikstalk', name: 'TikTok', method: 'GET', path: '/api/stalkers/tiktok?user=' }
            ]
        },
        {
            id: 'consultas',
            name: 'Consultas',
            icon: 'fas fa-mask',
            color: '#fbbf24',
            description: 'APIs utilitárias diversas',
            routes: [
                { id: 'nome', name: 'Nome', method: 'GET', path: '/api/consultas/nome?dados=' },
                { id: 'cpf', name: 'CPF', method: 'GET', path: '/api/consultas/cpf?dados=' },
                { id: 'telefone', name: 'Telefone', method: 'GET', path: '/api/consultas/telefone?dados=' },
                { id: 'placa', name: 'Placa', method: 'GET', path: '/api/consultas/placa?dados=' }
            ]
        },
        {
            id: 'pesquisas',
            name: 'Pesquisas',
            icon: 'fas fa-search',
            color: '#f87171',
            description: 'APIs de pesquisa de mídias',
            routes: [
                { id: 'youtube', name: 'YouTube', method: 'GET', path: '/api/pesquisas/youtube?query=' },
                { id: 'pinterest', name: 'Pinterest', method: 'GET', path: '/api/pesquisas/pinterest?query=' },
                { id: 'audiomeme', name: 'AudioMeme', method: 'GET', path: '/api/pesquisas/audiomeme?query=' },
                { id: 'dicionario', name: 'Dicionário', method: 'GET', path: '/api/pesquisas/dicionario?query=' },
                { id: 'playstore', name: 'PlayStore', method: 'GET', path: '/api/pesquisas/playstore?query=' },
                { id: 'horoscopo', name: 'Horóscopo', method: 'GET', path: '/api/pesquisas/horoscopo?query=' },
                { id: 'tiktok', name: 'TikTok', method: 'GET', path: '/api/pesquisas/tiktok?query=' },
                { id: 'bing', name: 'Bing', method: 'GET', path: '/api/pesquisas/bing?query=' }
            ]
        },
        {
            id: 'canvas',
            name: 'Canvas',
            icon: 'fas fa-paint-brush',
            color: '#E755C3',
            description: 'Canvas de diversos tipos',
            routes: [
                { id: 'musica', name: 'Música', method: 'GET', path: '/api/canvas/musica?titulo=&artista=&views=&tempo=&imagem=' },
                { id: 'instagram', name: 'Instagram', method: 'GET', path: '/api/canvas/instagram?username=&followers=&following=&posts=&imagem=' },
                { id: 'musicpersonalizado', name: 'Music Personalizado', method: 'GET', path: '/api/canvas/music-personalizado?titulo=&artista=&views=&tempo=&imagem=' },
                { id: 'musiccolorido', name: 'Music Colorido', method: 'GET', path: '/api/canvas/music-colorido?titulo=&artista=&views=&tempo=&imagem=' }
            ]
        },
        {
            id: 'logotipos1',
            name: 'Logotipos (1 Texto)',
            icon: 'fas fa-font',
            color: '#FF6347',
            description: 'APIs de logotipos com 1 texto',
            routes: [
                { id: 'darkgreen', name: 'Dark Green', method: 'GET', path: '/api/logotipos/darkgreen?text=' },
                { id: 'glitch', name: 'Glitch', method: 'GET', path: '/api/logotipos/glitch?text=' },
                { id: 'write', name: 'Write', method: 'GET', path: '/api/logotipos/write?text=' },
                { id: 'advanced', name: 'Advanced', method: 'GET', path: '/api/logotipos/advanced?text=' },
                { id: 'typography', name: 'Typography', method: 'GET', path: '/api/logotipos/typography?text=' },
                { id: 'pixel', name: 'Pixel', method: 'GET', path: '/api/logotipos/pixel?text=' },
                { id: 'neon', name: 'Neon', method: 'GET', path: '/api/logotipos/neon?text=' },
                { id: 'flag', name: 'Flag', method: 'GET', path: '/api/logotipos/flag?text=' },
                { id: 'americanflag', name: 'American Flag', method: 'GET', path: '/api/logotipos/americanflag?text=' },
                { id: 'deleting', name: 'Deleting', method: 'GET', path: '/api/logotipos/deleting?text=' },
                { id: 'vintage', name: 'Vintage', method: 'GET', path: '/api/logotipos/vintage?text=' },
                { id: 'tiktoklogo', name: 'TikTok Logo', method: 'GET', path: '/api/logotipos/tiktok?text=' },
                { id: 'buoys', name: 'Buoys', method: 'GET', path: '/api/logotipos/buoys?text=' },
                { id: 'wood', name: 'Wood', method: 'GET', path: '/api/logotipos/wood?text=' },
                { id: 'space3d', name: 'Space 3D', method: 'GET', path: '/api/logotipos/space3d?text=' },
                { id: 'wolf', name: 'Wolf', method: 'GET', path: '/api/logotipos/wolf?text=' },
                { id: 'steel', name: 'Steel', method: 'GET', path: '/api/logotipos/steel?text=' },
                { id: 'lettering', name: 'Lettering', method: 'GET', path: '/api/logotipos/lettering?text=' }
            ]
        },
        {
            id: 'logotipos2',
            name: 'Logotipos (2 Textos)',
            icon: 'fas fa-magic',
            color: '##0627e6',
            description: 'APIs de logotipos com 2 textos',
            routes: [
                { id: 'blackpink', name: 'BlackPink', method: 'GET', path: '/api/logotipos/ephoto/blackpink?text1=&text2=' },
                { id: 'deadpool', name: 'Deadpool', method: 'GET', path: '/api/logotipos/ephoto/deadpool?text1=&text2=' },
                { id: 'amongus', name: 'Among Us', method: 'GET', path: '/api/logotipos/ephoto/amongus?text1=&text2=' },
                { id: 'thor', name: 'Thor', method: 'GET', path: '/api/logotipos/ephoto/thor?text1=&text2=' },
                { id: 'neon2', name: 'Neon 2', method: 'GET', path: '/api/logotipos/ephoto/neon2?text1=&text2=' },
                { id: 'stone3d', name: 'Stone 3D', method: 'GET', path: '/api/logotipos/ephoto/stone3d?text1=&text2=' },
                { id: 'captainamerica', name: 'Captain America', method: 'GET', path: '/api/logotipos/ephoto/captainamerica?text1=&text2=' },
                { id: 'graffiti', name: 'Graffiti', method: 'GET', path: '/api/logotipos/ephoto/graffiti?text1=&text2=' },
                { id: 'avengers', name: 'Avengers', method: 'GET', path: '/api/logotipos/ephoto/avengers?text1=&text2=' }
            ]
        }
    ]
};