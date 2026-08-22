import { StylePresetOption } from "../types";

export const STYLE_PRESETS: StylePresetOption[] = [
  {
    id: "cinematic-live-action",
    name: "Cinematic 35mm Live Action",
    category: "Photorealistic",
    description: "Rich film grain, anamorphic lens flares, dynamic cinematic lighting and photorealistic depth of field.",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    promptModifier: "cinematic 35mm film still, photorealistic, anamorphic lens flare, shallow depth of field, blockbuster movie production, 8k resolution, IMAX quality",
  },
  {
    id: "concept-art-matte",
    name: "Digital Concept Art & Matte Painting",
    category: "Illustration",
    description: "Atmospheric digital art, painterly textures, dramatic environment perspective, artstation trending quality.",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    promptModifier: "detailed concept art, digital matte painting, atmospheric lighting, moody concept illustration, ArtStation trending, masterwork painterly details",
  },
  {
    id: "noir-monochrome",
    name: "Vintage Film Noir & Chiaroscuro",
    category: "Monochrome",
    description: "High-contrast black & white, venetian blind shadows, deep blacks, moody smoke and tungsten rim lighting.",
    badgeColor: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
    promptModifier: "classic 1940s film noir, high-contrast monochrome black and white photography, dramatic chiaroscuro shadows, venetian blind light beams, smoky atmosphere, silver gelatin print",
  },
  {
    id: "anime-graphic-novel",
    name: "Anime & Graphic Novel Keyframe",
    category: "Stylized",
    description: "Crisp cel-shaded character lines, dynamic perspective angles, vibrant saturated lighting effects.",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    promptModifier: "anime feature film keyframe, high-end animation studio production, bold lines, expressive emotion, dynamic cel shading, cinematic anime background",
  },
  {
    id: "pencil-storyboard-sketch",
    name: "Charcoal & Pencil Production Storyboard",
    category: "Sketch",
    description: "Classic studio director sketches, graphite hatching, camera motion arrows, raw expressive composition.",
    badgeColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    promptModifier: "authentic film production storyboard sketch, rough graphite pencil and charcoal drawing, dynamic shading, directional lighting indicators, professional concept storyboard panel",
  },
  {
    id: "3d-cgi-animation",
    name: "3D Stylized Pixar / DreamWorks Render",
    category: "Animation",
    description: "Warm subsurface scattering, soft ambient occlusion, expressive animated character staging.",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    promptModifier: "3D stylized CGI animated film still, octane render, soft volumetric lighting, warm subsurface scattering, Pixar quality character lighting, rich textures",
  },
];

export interface SampleScript {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
  suggestedStyle: string;
  scriptText: string;
}

export const SAMPLE_SCRIPTS: SampleScript[] = [
  {
    id: "cyberpunk-heist",
    title: "NEO-SHINJUKU: THE DATA BREACH",
    genre: "Cyberpunk Sci-Fi Thriller",
    synopsis: "A rogue netrunner and her cybernetic partner attempt to retrieve an encrypted quantum drive from a heavily secured skybridge during an acid rainstorm.",
    suggestedStyle: "cinematic-live-action",
    scriptText: `EXT. SKYBRIDGE - NIGHT

Torrential purple-tinted rain lashes against the reinforced glass high above Neo-Shinjuku. Holographic advertisements flicker in the mist below.

KIRA (28), augmented eye glowing electric amber, adjusts the neural jack on her cybernetic forearm. Water cascades off the brim of her tactical duster.

KIRA
(into comms, whisper)
System override complete. We have exactly thirty seconds before the sentinel drones cycle back.

Beside her, BAXTER (30s), a hulking ex-enforcer with chrome shoulder plating, primes a heavy thermal torch.

BAXTER
Thirty seconds is twenty more than I need. Stand clear.

He plunges the torch into the vault panel. Blue plasma sparks erupt, illuminating Kira's tense, focused face in harsh strobes.

Suddenly, a blinding searchlight pierces the rain. A high-pitched jet turbine screams.

KIRA
(eyes widening)
They're early. Get to the crane!

Kira draws a compact kinetic pistol, turning toward the shadows as three armed security droids emerge through the steam vents.`,
  },
  {
    id: "noir-detective",
    title: "THE SHADOW OVER MIDNIGHT",
    genre: "Classic 1940s Film Noir",
    synopsis: "Private investigator Jack Marlowe receives an unexpected late-night visitor carrying an unsealed blackmail envelope that implicates the city's district attorney.",
    suggestedStyle: "noir-monochrome",
    scriptText: `INT. MARLOWE'S OFFICE - MIDNIGHT

Rain taps against the foggy windowpane. Slanted shadows from the venetian blinds stretch across the battered mahogany desk like prison bars.

JACK MARLOWE (40s), unbuttoned collar, trenchcoat draped over his chair, pours a finger of amber whiskey into a chipped tumbler. Cigarette smoke curls into the dim overhead lamp light.

A soft KNOCK at the frosted glass door: "J. MARLOWE - PRIVATE INVESTIGATIONS".

Marlowe doesn't flinch. He slides his .38 revolver under the desk blotter.

MARLOWE
Door's unlocked. Make it quick, I'm off the clock.

The door creaks open. In steps EVELYN SINCLAIR (30s), draped in a dark silk coat with a wide-brimmed veiled hat. Her mascara is lightly smudged, but her posture is aristocratic.

EVELYN
You don't know me, Mr. Marlowe. But by morning, we'll either be partners or corpses.

She tosses a thick, blood-stained manila envelope onto the desk. It slides directly into the pool of lamp light.`,
  },
  {
    id: "cosmic-fantasy",
    title: "THE STARFORGE CHRONICLES",
    genre: "Epic Fantasy & Wonder",
    synopsis: "A young apprentice astronomer unlocks the ancient celestial astrolabe atop a floating mountain observatory as the alignment of three moons begins.",
    suggestedStyle: "concept-art-matte",
    scriptText: `EXT. OBSERVATORY PINNACLE - DUSK

Wind howls through the ancient crystalline spires of Mount Aethelgard. Below, a sea of golden clouds stretches to the horizon. In the twilight sky, three moons—one silver, one emerald, one sapphire—draw into a rare linear alignment.

ELIA (19), clad in embroidered celestial robes with brass goggles pushed onto her forehead, steps onto the central stone dais.

She holds a glowing prismatic crystal sphere in trembling hands.

ELIA
(reading ancient runes aloud)
"When the three eyes open, the path of starlight shall awaken the engine."

She lowers the sphere into the receptacle at the heart of a giant concentric bronze astrolabe.

The mechanism SHUDDERS. Rings of luminous ancient script ignite with turquoise fire, spinning in opposite directions.

Beams of concentrated starlight shoot straight into the heavens, parting the storm clouds and revealing a colossal drifting astral leviathan gliding between the stars.`,
  },
  {
    id: "western-standoff",
    title: "RED DUST AT NOON",
    genre: "Gritty Cinematic Western",
    synopsis: "Under the scorching desert sun, two former brothers-in-arms meet in the deserted ghost town of San Miguel for one final reckoning.",
    suggestedStyle: "cinematic-live-action",
    scriptText: `EXT. MAIN STREET - HIGH NOON

Heat waves shimmer above the cracked red earth. A wooden saloon sign CREAKS rhythmically in the dry desert breeze. Tumbleweeds drift past the boarded-up mercantile.

COLT VANCE (40s), weathered poncho, dusty Stetson pulled low, stands twenty paces from the town well. His hand hovers an inch above the walnut handle of his Peacemaker.

At the opposite end of the street, SILAS BLACK (40s), wearing a black wool duster with a silver pocket watch chain glinting in the sun, stops in his tracks.

SILAS
(voice dry as gravel)
You traveled a thousand miles of bad road just to die in the dirt, Vance.

VANCE
I traveled a thousand miles to keep a promise.

A clock bell in the distant mission tower begins to STRIKE TWELVE.

Both men lock eyes. Sweat drips down Vance's temple. Silas's fingers twitch on his holster.`,
  },
];
