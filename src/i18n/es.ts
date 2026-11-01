/**
 * Spanish (Puerto Rico) copy. Every user-visible string on the landing
 * page lives here so an `en.ts` with the same shape can be added later.
 */
export const es = {
	lang: 'es-PR',
	ogLocale: 'es_PR',
	meta: {
		title: 'PRMSH | Meshtastic, MeshCore y redes mesh en Puerto Rico',
		description:
			'Explora Meshtastic y MeshCore en Puerto Rico. Descubre las redes mesh LoRa, conecta con la comunidad y participa en Discord, Facebook y Reddit.',
		ogImageAlt:
			'Mapa topográfico de Puerto Rico con la Cordillera Central y nodos de radio ilustrativos. PRMSH, comunidad de redes mesh LoRa.',
	},
	a11y: {
		skip: 'Saltar al contenido',
		newTab: '(abre en una pestaña nueva)',
		menuOpen: 'Abrir menú',
		menuClose: 'Cerrar menú',
		primaryNav: 'Principal',
		footerNav: 'Enlaces de PRMSH',
		home: 'PRMSH, inicio',
	},
	nav: {
		home: 'Inicio',
		meshtastic: 'Meshtastic',
		meshcore: 'MeshCore',
		community: 'Comunidad',
		discord: 'Únete al Discord',
	},
	hero: {
		eyebrow: 'Puerto Rico / Redes inalámbricas descentralizadas',
		title: 'Puerto Rico, conectado nodo a nodo.',
		body: 'Exploramos, construimos y conectamos redes mesh LoRa en Puerto Rico. Descubre Meshtastic, conoce MeshCore y únete a una comunidad que cree en la comunicación descentralizada.',
		primary: 'Explorar Meshtastic',
		secondary: 'Descubrir MeshCore',
	},
	map: {
		label:
			'Mapa topográfico de Puerto Rico. La Cordillera Central cruza el centro de la isla de oeste a este, entre los llanos costeros del norte y la costa sur. Una ruta ilustrativa conecta nodos desde Mayagüez hasta San Juan pasando por Monte Guilarte, Cerro de Punta y Cayey.',
		annotations: ['Puerto Rico', 'LoRa / redes mesh', 'Comunicaciones descentralizadas'],
		regions: {
			cordillera: 'Cordillera Central',
			north: 'Llanos costeros del norte',
			south: 'Costa sur',
			luquillo: 'Sierra de Luquillo',
		},
		peak: 'Cerro de Punta · 1338 m',
		legendNode: 'Nodo ilustrativo',
		legendRoute: 'Ruta multisalto ilustrativa',
		legendContour: 'Curvas de nivel: 50 m, luego cada 150 m',
		band: 'Banda ISM 902–928 MHz',
		disclaimer:
			'Relieve a partir de datos SRTM y USGS 3DEP. Los nodos y las rutas son ilustrativos: no representan cobertura medida ni enlaces en operación.',
	},
	platforms: {
		title: 'Dos plataformas. Una comunidad.',
		body: 'Explora los ecosistemas de redes mesh LoRa y encuentra la plataforma que mejor se adapta a tus intereses y proyectos.',
		note: 'Meshtastic y MeshCore son proyectos independientes. Sus protocolos, aplicaciones y redes no son intercambiables: cada sitio te explica cómo empezar con la suya.',
		items: {
			meshtastic: {
				name: 'Meshtastic',
				category: 'Comunicación mesh LoRa de código abierto',
				body: 'Descubre dispositivos compatibles, configuración, canales, nodos y recursos para comenzar a experimentar con Meshtastic.',
				cta: 'Entrar a Meshtastic',
			},
			meshcore: {
				name: 'MeshCore',
				category: 'Ecosistema de redes mesh LoRa',
				body: 'Explora MeshCore, sus dispositivos, conceptos de red y recursos para formar parte de esta alternativa de comunicación mesh.',
				cta: 'Entrar a MeshCore',
			},
		},
	},
	how: {
		title: 'Una red que se construye entre todos.',
		body: 'En una red mesh no hay torre central. Cada radio puede recibir un mensaje y retransmitirlo al próximo, así que la red crece con cada nodo que alguien instala.',
		steps: [
			{
				name: 'Explora',
				body: 'Conoce los dispositivos LoRa y las opciones disponibles para experimentar con redes mesh.',
			},
			{
				name: 'Conecta',
				body: 'Aprende sobre nodos, configuración, antenas, alcance y la topología de las redes.',
			},
			{
				name: 'Comparte',
				body: 'Intercambia experiencias, resuelve dudas y colabora con otros entusiastas en Puerto Rico.',
			},
		],
		diagram: {
			title: 'Por qué importan los saltos',
			caption:
				'Perfil real del terreno entre Ponce y Arecibo. La Cordillera Central bloquea la línea de vista directa; un nodo en un punto alto puede retransmitir el mensaje y completar la ruta en dos saltos.',
			blocked: 'Sin línea de vista directa',
			hop: 'Salto',
			relay: 'Repetidor',
			distance: 'Distancia (km)',
			elevation: 'Elevación (m)',
			exaggeration: 'Exageración vertical ×15',
			illustrative: 'Enlaces ilustrativos, no verificados en operación.',
		},
	},
	community: {
		title: 'La red también somos nosotros.',
		body: 'Comparte proyectos, pregunta, aprende y ayuda a crecer la comunidad de redes mesh en Puerto Rico.',
		channels: {
			discord: {
				name: 'Discord',
				body: 'Conversaciones, colaboración y ayuda entre miembros.',
				cta: 'Únete al Discord',
			},
			facebook: {
				name: 'Facebook',
				body: 'Conecta con la comunidad y participa en las conversaciones.',
				cta: 'Visitar grupo',
			},
			reddit: {
				name: 'Reddit',
				body: 'Comparte preguntas, experiencias y conversaciones sobre Meshtastic en Puerto Rico.',
				cta: 'Visitar subreddit',
			},
		},
	},
	closing: {
		title: 'Puerto Rico se conecta desde aquí.',
		body: 'Descubre las redes mesh, comparte lo que aprendes y forma parte de una comunidad construida nodo a nodo.',
		meshtastic: 'Explorar Meshtastic',
		meshcore: 'Explorar MeshCore',
		discord: 'Unirme a Discord',
	},
	footer: {
		description: 'Comunidad de redes mesh LoRa en Puerto Rico.',
		platforms: 'Plataformas',
		community: 'Comunidad',
		legal:
			'PRMSH es un portal comunitario independiente. No está afiliado a Meshtastic LLC, al proyecto MeshCore ni a ningún fabricante de hardware. Meshtastic® es una marca registrada de Meshtastic LLC.',
		rights: 'PRMSH',
	},
};

export type Dictionary = typeof es;
