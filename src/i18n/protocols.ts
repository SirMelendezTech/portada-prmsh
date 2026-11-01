/**
 * Meshtastic vs MeshCore comparison, in Spanish and English.
 *
 * Every factual row was checked on 2026-10-31 against the projects' own
 * sources (listed in `sources`). Re-check the version-specific rows
 * (`reviewed`, routing, encryption, apps, presets) on each major release.
 */

export const reviewed = {
	date: '2026-10-31',
	meshtastic: { stable: '2.7.26', alpha: '2.8.1' },
	meshcore: { stable: '1.18.0' },
};

export interface Row {
	k: string;
	mt: string;
	mc: string;
}

export interface Step {
	mt: string;
	mc: string;
}

const es = {
	meta: {
		title: 'Meshtastic vs MeshCore: diferencias y cuál elegir | PRMSH',
		description:
			'Comparación de Meshtastic y MeshCore, las dos redes mesh LoRa más usadas: quién retransmite, saltos, cifrado, apps, ajustes de radio y qué significa cada una en Puerto Rico.',
		ogImageAlt: 'PRMSH: comparación de Meshtastic y MeshCore, redes mesh LoRa en Puerto Rico.',
	},
	hero: {
		title: 'Meshtastic y MeshCore, lado a lado.',
		lead: 'Los dos envían mensajes de texto por radio LoRa, sin señal celular ni internet, y corren en buena parte del mismo hardware. La diferencia de fondo es quién retransmite: en Meshtastic, por defecto, cualquier nodo; en MeshCore, solo los repetidores.',
		reviewedLabel: 'Revisado',
		reviewedDate: '31 de octubre de 2026',
		versionsLabel: 'Versiones',
		mtVersion: `Meshtastic ${reviewed.meshtastic.stable} estable, ${reviewed.meshtastic.alpha} alfa`,
		mcVersion: `MeshCore ${reviewed.meshcore.stable}`,
	},
	short: {
		title: 'La respuesta corta',
		mt: {
			title: 'Elige Meshtastic si…',
			items: [
				'quieres que dos o más radios se comuniquen de inmediato, sin instalar nada más;',
				'te mueves en grupo: excursiones, eventos, apoyo en emergencias;',
				'prefieres que el firmware y las apps sean de código abierto;',
				'la gente cerca de ti ya usa Meshtastic.',
			],
		},
		mc: {
			title: 'Elige MeshCore si…',
			items: [
				'planificas cobertura de pueblo o región con repetidores en puntos altos;',
				'mucha gente comparte la red y quieres ocupar menos tiempo de aire;',
				'quieres que los mensajes directos sigan una ruta fija una vez aprendida;',
				'la gente cerca de ti ya usa MeshCore.',
			],
		},
		incompatTitle: 'No se comunican entre sí.',
		incompat:
			'Usan formatos de paquete, cifrado y ajustes de radio distintos. Lo que sí comparten es el hardware: muchas placas se pueden reprogramar de uno a otro.',
	},
	table: {
		title: 'Lado a lado',
		caption: 'Comparación de Meshtastic y MeshCore por característica',
		feature: 'Característica',
		rows: [
			{
				k: 'Quién retransmite',
				mt: 'Todos los nodos por defecto (rol CLIENT). Hay roles que no retransmiten, como CLIENT_MUTE, y roles de infraestructura, como ROUTER.',
				mc: 'Solo los repetidores (y room servers con la retransmisión activada). Los companions, los radios personales, no retransmiten.',
			},
			{
				k: 'Cómo viaja un mensaje',
				mt: 'Inundación controlada: cada nodo retransmite una vez y se calla si oye que otro ya lo hizo. Desde 2.6, los mensajes directos aprenden el próximo salto.',
				mc: 'Los canales siempre inundan por los repetidores. El primer mensaje directo inunda; el reporte de entrega trae la ruta y los siguientes la siguen.',
			},
			{
				k: 'Límite de saltos',
				mt: 'De 1 a 7, configurable. Por defecto, 3.',
				mc: 'Hasta 64 con identificadores de 1 byte; 32 y 21 con identificadores de 2 y 3 bytes (firmware 1.14 o más reciente).',
			},
			{
				k: 'Carga útil por paquete',
				mt: '233 bytes',
				mc: '184 bytes',
			},
			{
				k: 'Cifrado',
				mt: 'Canales con AES de 128 o 256 bits, según la llave. Mensajes directos con llave pública (X25519). En 2.8, los broadcasts van firmados.',
				mc: 'Identidad Ed25519 y adverts firmados. Mensajes directos y canales con AES-128.',
			},
			{
				k: 'Canal público',
				mt: 'Su llave está publicada: cualquiera puede leerlo.',
				mc: 'Su llave está publicada: cualquiera puede leerlo.',
			},
			{
				k: 'Apps',
				mt: 'Gratis y de código abierto: Android, iOS y web.',
				mc: 'App oficial gratis para Android e iOS, no es de código abierto. Quitar la espera en la administración remota por radio es un pago opcional. Hay clientes web de la comunidad.',
			},
			{
				k: 'Licencia del firmware',
				mt: 'GPL-3.0',
				mc: 'MIT',
			},
			{
				k: 'Ajuste por defecto en EE. UU. y Puerto Rico',
				mt: 'LongFast: 906.875 MHz, 250 kHz, SF11',
				mc: 'Preset recomendado: 910.525 MHz, 62.5 kHz, SF7',
			},
			{
				k: 'Infraestructura',
				mt: 'No hace falta: dos radios ya forman una red.',
				mc: 'Para llegar más allá del alcance directo hace falta al menos un repetidor.',
			},
			{
				k: 'Inicio del proyecto',
				mt: '2020',
				mc: '2025',
			},
		] satisfies Row[],
	},
	routing: {
		title: 'Cómo viaja un mensaje',
		body: 'El mismo mensaje directo, de A a B, cruzando siete radios. Avanza paso a paso para ver quién transmite en cada red.',
		legendClient: 'Radio que puede retransmitir',
		legendCompanion: 'Companion: no retransmite',
		legendRepeater: 'Repetidor',
		legendTx: 'Transmite en este paso',
		legendQuiet: 'Lo oyó y no retransmite',
		prev: 'Paso anterior',
		next: 'Siguiente paso',
		reset: 'Volver al inicio',
		stepOf: 'Paso {n} de {total}',
		illustrative:
			'Diagrama simplificado. En una red real, quién oye a quién depende del terreno, la altura y las antenas.',
		steps: [
			{
				mt: 'A transmite. Los radios 1 y 2 lo oyen.',
				mc: 'A transmite. El companion 1 y el repetidor 2 lo oyen.',
			},
			{
				mt: 'El radio 2, más lejano, retransmite primero. El 1 lo oye y se queda callado.',
				mc: 'Solo el repetidor 2 retransmite. El companion 1 nunca retransmite.',
			},
			{
				mt: 'El radio 4 retransmite y el mensaje llega a B tras dos retransmisiones.',
				mc: 'El repetidor 4 retransmite y el mensaje llega a B. El reporte de entrega vuelve a A con la ruta 2 → 4.',
			},
			{
				mt: 'Desde 2.6, el próximo mensaje directo a B usa los radios que lo entregaron.',
				mc: 'El próximo mensaje directo a B sigue la ruta guardada: solo transmiten los repetidores 2 y 4.',
			},
		] satisfies Step[],
	},
	pr: {
		title: 'Qué significa en Puerto Rico',
		items: [
			{
				title: 'El relieve manda',
				body: 'La Cordillera Central bloquea la línea de vista entre la costa norte y la costa sur. En las dos redes, lo que más alarga el alcance es tener nodos o repetidores en puntos altos con buena antena, no el protocolo.',
				link: 'Ver el perfil Ponce–Arecibo',
				href: '/#como-funciona',
			},
			{
				title: 'Misma banda, ajustes distintos',
				body: 'En Puerto Rico aplican las reglas de EE. UU.: las dos usan la banda de 902 a 928 MHz. Con sus ajustes por defecto no se oyen entre sí, así que pueden convivir en la misma zona.',
			},
			{
				title: 'Empieza por la red de tu zona',
				body: 'Antes de comprar o reprogramar un radio, pregunta en el Discord qué red usa la gente cerca de ti. Eso pesa más que cualquier fila de la tabla.',
			},
		],
	},
	faq: {
		title: 'Preguntas frecuentes',
		items: [
			{
				q: '¿Un radio Meshtastic puede hablar con uno MeshCore?',
				a: 'No. Los protocolos son incompatibles: un mensaje de una red no se puede leer ni retransmitir en la otra.',
			},
			{
				q: '¿Puedo cambiar mi radio de una red a la otra?',
				a: 'En muchas placas, sí. Cada proyecto tiene su programador web: flasher.meshtastic.org y flasher.meshcore.io. La configuración, los contactos y la identidad del radio no pasan de un firmware al otro.',
			},
			{
				q: '¿Cuál llega más lejos?',
				a: 'Depende sobre todo de la altura, la antena y el terreno. LongFast, el ajuste de Meshtastic, favorece el alcance de cada transmisión. El preset estrecho de MeshCore hace transmisiones más cortas, que ocupan menos tiempo de aire.',
			},
			{
				q: '¿Cuál es mejor?',
				a: 'Ninguno en absoluto. Meshtastic es más sencillo para grupos que se mueven y no tienen infraestructura. MeshCore está pensado para redes con repetidores planificados. La mejor opción suele ser la que ya usa la gente a tu alrededor.',
			},
			{
				q: '¿Cuánto cuesta?',
				a: 'El firmware de los dos es gratis. Necesitas una placa LoRa compatible con la banda de 915 MHz y un teléfono o computadora para usarla.',
			},
		],
	},
	sources: {
		title: 'Fuentes',
		body: 'Datos verificados en la documentación y el código de cada proyecto. NodakMesh publicó una comparación que sirvió de punto de partida.',
	},
	cta: {
		title: '¿Listo para empezar?',
		body: 'Cada sitio te guía con el hardware, la configuración y la red en Puerto Rico.',
		mt: 'Entrar a Meshtastic',
		mc: 'Entrar a MeshCore',
		discord: 'Preguntar en Discord',
	},
};

export type ProtocolsCopy = typeof es;

const en: ProtocolsCopy = {
	meta: {
		title: 'Meshtastic vs MeshCore: differences and which to choose | PRMSH',
		description:
			'A comparison of Meshtastic and MeshCore, the two most-used LoRa mesh networks: who relays, hops, encryption, apps, radio settings and what each means in Puerto Rico.',
		ogImageAlt: 'PRMSH: Meshtastic and MeshCore compared, LoRa mesh networks in Puerto Rico.',
	},
	hero: {
		title: 'Meshtastic and MeshCore, side by side.',
		lead: 'Both send text messages over LoRa radio, with no cell service or internet, and they run on much of the same hardware. The core difference is who relays: in Meshtastic, any node does by default; in MeshCore, only repeaters do.',
		reviewedLabel: 'Reviewed',
		reviewedDate: 'October 31, 2026',
		versionsLabel: 'Versions',
		mtVersion: `Meshtastic ${reviewed.meshtastic.stable} stable, ${reviewed.meshtastic.alpha} alpha`,
		mcVersion: `MeshCore ${reviewed.meshcore.stable}`,
	},
	short: {
		title: 'The short answer',
		mt: {
			title: 'Choose Meshtastic if…',
			items: [
				'you want two or more radios talking right away, with nothing else to set up;',
				'you move as a group: hikes, events, emergency support;',
				'you want open-source firmware and apps;',
				'people near you already use Meshtastic.',
			],
		},
		mc: {
			title: 'Choose MeshCore if…',
			items: [
				'you are planning town or regional coverage with repeaters on high ground;',
				'many people share the network and you want to use less airtime;',
				'you want direct messages to follow a fixed route once it is learned;',
				'people near you already use MeshCore.',
			],
		},
		incompatTitle: 'They can’t talk to each other.',
		incompat:
			'They use different packet formats, encryption and radio settings. What they share is hardware: many boards can be reflashed from one to the other.',
	},
	table: {
		title: 'Side by side',
		caption: 'Meshtastic and MeshCore compared by feature',
		feature: 'Feature',
		rows: [
			{
				k: 'Who relays',
				mt: 'Every node by default (CLIENT role). Some roles don’t relay, such as CLIENT_MUTE, and some are infrastructure, such as ROUTER.',
				mc: 'Only repeaters (and room servers with relaying turned on). Companions, the personal radios, never relay.',
			},
			{
				k: 'How a message travels',
				mt: 'Managed flooding: each node rebroadcasts once and stays quiet if it hears someone else already did. Since 2.6, direct messages learn the next hop.',
				mc: 'Channel messages always flood through repeaters. The first direct message floods; the delivery report brings back the route, and later messages follow it.',
			},
			{
				k: 'Hop limit',
				mt: '1 to 7, configurable. Default is 3.',
				mc: 'Up to 64 with 1-byte IDs; 32 and 21 with 2- and 3-byte IDs (firmware 1.14 or newer).',
			},
			{
				k: 'Payload per packet',
				mt: '233 bytes',
				mc: '184 bytes',
			},
			{
				k: 'Encryption',
				mt: 'Channels use 128- or 256-bit AES, depending on the key. Direct messages use public keys (X25519). In 2.8, broadcasts are signed.',
				mc: 'Ed25519 identities and signed adverts. Direct and channel messages use AES-128.',
			},
			{
				k: 'Public channel',
				mt: 'Its key is published: anyone can read it.',
				mc: 'Its key is published: anyone can read it.',
			},
			{
				k: 'Apps',
				mt: 'Free and open source: Android, iOS and web.',
				mc: 'Official app is free for Android and iOS, not open source. Removing the wait on remote admin over radio is an optional purchase. Community web clients exist.',
			},
			{
				k: 'Firmware license',
				mt: 'GPL-3.0',
				mc: 'MIT',
			},
			{
				k: 'Default in the US and Puerto Rico',
				mt: 'LongFast: 906.875 MHz, 250 kHz, SF11',
				mc: 'Recommended preset: 910.525 MHz, 62.5 kHz, SF7',
			},
			{
				k: 'Infrastructure',
				mt: 'Not needed: two radios already make a network.',
				mc: 'At least one repeater is needed to reach beyond direct range.',
			},
			{
				k: 'Project started',
				mt: '2020',
				mc: '2025',
			},
		],
	},
	routing: {
		title: 'How a message travels',
		body: 'The same direct message, from A to B, across seven radios. Step through to see who transmits on each network.',
		legendClient: 'Radio that can relay',
		legendCompanion: 'Companion: never relays',
		legendRepeater: 'Repeater',
		legendTx: 'Transmits in this step',
		legendQuiet: 'Heard it, stays quiet',
		prev: 'Previous step',
		next: 'Next step',
		reset: 'Start over',
		stepOf: 'Step {n} of {total}',
		illustrative:
			'Simplified diagram. On a real network, who hears whom depends on terrain, height and antennas.',
		steps: [
			{
				mt: 'A transmits. Radios 1 and 2 hear it.',
				mc: 'A transmits. Companion 1 and repeater 2 hear it.',
			},
			{
				mt: 'Radio 2, farther away, rebroadcasts first. Radio 1 hears that and stays quiet.',
				mc: 'Only repeater 2 retransmits. Companion 1 never relays.',
			},
			{
				mt: 'Radio 4 rebroadcasts and the message reaches B after two relays.',
				mc: 'Repeater 4 retransmits and the message reaches B. The delivery report returns to A with the route 2 → 4.',
			},
			{
				mt: 'Since 2.6, the next direct message to B uses the radios that delivered it.',
				mc: 'The next direct message to B follows the saved route: only repeaters 2 and 4 transmit.',
			},
		],
	},
	pr: {
		title: 'What it means in Puerto Rico',
		items: [
			{
				title: 'Terrain decides',
				body: 'The Cordillera Central blocks line of sight between the north and south coasts. On both networks, what extends range most is nodes or repeaters on high ground with a good antenna, not the protocol.',
				link: 'See the Ponce–Arecibo profile (Spanish)',
				href: '/#como-funciona',
			},
			{
				title: 'Same band, different settings',
				body: 'US rules apply in Puerto Rico: both use the 902–928 MHz band. On their default settings they don’t hear each other, so they can share an area.',
			},
			{
				title: 'Start with your local network',
				body: 'Before you buy or reflash a radio, ask on Discord which network people near you use. That matters more than any row in the table.',
			},
		],
	},
	faq: {
		title: 'Frequently asked questions',
		items: [
			{
				q: 'Can a Meshtastic radio talk to a MeshCore radio?',
				a: 'No. The protocols are incompatible: a message on one network can’t be read or relayed on the other.',
			},
			{
				q: 'Can I switch my radio from one network to the other?',
				a: 'On many boards, yes. Each project has a web flasher: flasher.meshtastic.org and flasher.meshcore.io. Settings, contacts and the radio’s identity don’t carry over between firmwares.',
			},
			{
				q: 'Which one reaches farther?',
				a: 'Mostly it depends on height, antenna and terrain. LongFast, Meshtastic’s default, favors the reach of each transmission. MeshCore’s narrow preset makes shorter transmissions that use less airtime.',
			},
			{
				q: 'Which one is better?',
				a: 'Neither, in general. Meshtastic is simpler for groups on the move without infrastructure. MeshCore is built for networks with planned repeaters. The best choice is usually the one people around you already use.',
			},
			{
				q: 'How much does it cost?',
				a: 'Both firmwares are free. You need a LoRa board for the 915 MHz band and a phone or computer to use it.',
			},
		],
	},
	sources: {
		title: 'Sources',
		body: 'Facts checked against each project’s documentation and source code. A comparison published by NodakMesh served as a starting point.',
	},
	cta: {
		title: 'Ready to start?',
		body: 'Each site walks you through hardware, setup and the network in Puerto Rico (in Spanish).',
		mt: 'Go to Meshtastic',
		mc: 'Go to MeshCore',
		discord: 'Ask on Discord',
	},
};

export const protocolsCopy = { es, en };

/** Primary sources, language-neutral. */
export const sources = [
	{
		project: 'Meshtastic',
		title: 'Mesh broadcast algorithm',
		url: 'https://meshtastic.org/docs/overview/mesh-algo/',
	},
	{
		project: 'Meshtastic',
		title: 'Encryption',
		url: 'https://meshtastic.org/docs/overview/encryption/',
	},
	{
		project: 'Meshtastic',
		title: 'Radio settings',
		url: 'https://meshtastic.org/docs/overview/radio-settings/',
	},
	{
		project: 'Meshtastic',
		title: 'LoRa configuration',
		url: 'https://meshtastic.org/docs/configuration/radio/lora/',
	},
	{
		project: 'Meshtastic',
		title: 'Device roles',
		url: 'https://meshtastic.org/docs/configuration/radio/device/',
	},
	{
		project: 'Meshtastic',
		title: 'mesh.proto (DATA_PAYLOAD_LEN)',
		url: 'https://github.com/meshtastic/protobufs/blob/master/meshtastic/mesh.proto',
	},
	{
		project: 'Meshtastic',
		title: 'Firmware releases',
		url: 'https://github.com/meshtastic/firmware/releases',
	},
	{ project: 'MeshCore', title: 'FAQ', url: 'https://docs.meshcore.io/faq/' },
	{ project: 'MeshCore', title: 'Packet format', url: 'https://docs.meshcore.io/packet_format/' },
	{
		project: 'MeshCore',
		title: 'Firmware source and releases',
		url: 'https://github.com/meshcore-dev/MeshCore',
	},
	{
		project: 'NodakMesh',
		title: 'MeshCore vs Meshtastic (2026)',
		url: 'https://nodakmesh.org/protocols',
	},
] as const;
