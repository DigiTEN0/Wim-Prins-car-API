import { Message, UserData, Car } from "../types";
import { STOCK } from "../constants";

const COLOR_MAP: Record<string, string[]> = {
  'Rood': ['rood', 'rosso', 'corsa', 'scuderia', 'amaranto', 'red', 'fiorano'],
  'Zwart': ['zwart', 'nero', 'daytona', 'black'],
  'Wit': ['wit', 'bianco', 'avus', 'white'],
  'Grijs': ['grijs', 'grigio', 'silverstone', 'titanio', 'grey', 'silver', 'zilver', 'antraciet'],
  'Blauw': ['blauw', 'blu', 'tour', 'france', 'cobalt', 'blue', 'pozzi', 'nart'],
  'Geel': ['geel', 'giallo', 'modena', 'yellow'],
  'Groen': ['groen', 'verde', 'green']
};

export async function laadVoorraad(): Promise<void> {
  try {
    const proxy = "https://corsproxy.io/?";
    const url = "https://wimprins.nl/vehicles.json?task=inventory&rid=10&world=all&page=1&limit=999";

    const response = await fetch(proxy + encodeURIComponent(url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        sortby:"none", brand:"all", model:"all", type:"all", year:"all", 
        fuel:"all", transmission:"all", color:"all", price_from:"all", price_to:"all" 
      })
    });

    const data = await response.json();
    const parser = new DOMParser();

    const gevonden = data.inventory
      .map((html: string) => {
        const doc = parser.parseFromString(html, "text/html");
        const a = doc.querySelector("a");
        const href = a?.getAttribute("href") || "";
        if (!href || href === "/aanbod/" || href === "/esclusivo/aanbod/") return null;

        const titel = doc.querySelector("h2, h3, [class*='title']")?.textContent?.trim() || "";
        const brand = titel.split(" ")[0] || "";
        const model = titel.split(" ").slice(1).join(" ");

        const specs: Record<string, string> = {};
        doc.querySelectorAll('dt').forEach(dt => {
          const dd = dt.nextElementSibling;
          if (dd && dd.tagName === 'DD') {
            specs[dt.textContent?.trim() || ''] = dd.textContent?.trim() || '';
          }
        });

        const alleText = doc.body.textContent || "";
        
        let mileage = specs['KM-stand'] || specs['Kilometerstand'] || specs['Km-stand'] || "";
        if (!mileage || mileage === "0" || mileage === "Onbekend") {
          const kmMatch = alleText.match(/(\d{1,3}(\.\d{3})*)\s*km/i);
          if (kmMatch) {
            mileage = kmMatch[1] + " km";
          } else {
            mileage = "N.v.t.";
          }
        }

        const prijsMatch = alleText.match(/€\s*[\d\.,]+/);
        const prijs = prijsMatch ? prijsMatch[0].replace(/\s/g, "") : "Op aanvraag";

        let color = specs['Kleur'] || specs['Exterieur'] || "";
        if (!color) {
          const scanSource = alleText.toLowerCase();
          for (const [normaal, trefwoorden] of Object.entries(COLOR_MAP)) {
            if (trefwoorden.some(kw => scanSource.includes(kw))) {
              color = normaal;
              break;
            }
          }
        }
        
        const powerRaw = specs['Vermogen'] || "";
        let power = powerRaw.match(/(\d+)/)?.[1] || alleText.match(/(\d{2,4})\s*(pk|hp|bhp)/i)?.[1] || "";
        
        let imageUrl = doc.querySelector("img[src*='vehicles'], [data-src*='vehicles']")?.getAttribute("src") || 
                       doc.querySelector("img[src*='vehicles'], [data-src*='vehicles']")?.getAttribute("data-src") || "";
        
        if (imageUrl && !imageUrl.startsWith("http")) imageUrl = "https://wimprins.nl" + imageUrl;

        const year = parseInt(specs['Bouwjaar'] || alleText.match(/\b(19|20)\d{2}\b/)?.[0] || "0");

        return {
          id: href.split("-").pop() || Math.random().toString(36).substr(2, 9),
          brand, model, year, price: prijs, mileage, power, fuel: "", color,
          displacement: specs['Cilinderinhoud'] || "", cylinders: specs['Aantal cilinders'] || "",
          url: "https://wimprins.nl" + href,
          imageUrl, description: ""
        };
      })
      .filter(Boolean);

    STOCK.length = 0;
    STOCK.push(...gevonden);
  } catch (e) {
    console.error("Fout bij laden voorraad:", e);
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getChatResponse(userMessage: string, history: Message[], userData?: UserData): Promise<string> {
  const voorraadLijst = STOCK.map(a =>
    `ID: ${a.id} | ${a.brand} ${a.model} | Prijs: ${a.price} | Jaar: ${a.year} | KM: ${a.mileage} | Vermogen: ${a.power}pk | Kleur: ${a.color} | URL: ${a.url}`
  ).join("\n");

  const SYSTEM_INSTRUCTION = `Je bent de Prins Verkoopadviseur, een gepassioneerde expert in het topsegment.

TONE-OF-VOICE:
- Spreek als een ervaren salesman: hoffelijk, deskundig, maar zeer direct en compact.
- Verveelt de klant NOOIT met lange teksten.
- Toon je enthousiasme voor de techniek en historie van merken als Ferrari.

STRIKTE RESPONSE-TEMPLATE (WANNEER JE AUTO'S AANRAADT):
1. **Introductie**: Maximaal 2 korte zinnen over de gevonden selectie.
2. **Auto-Selectie**: Gebruik ENKEL de tag [CAR_IDS: id1, id2]. Maak NOOIT een tekstuele lijst met specificaties, die staan al op de kaartjes.
3. **Afsluiting/Vraag**: Een prikkelende zin over de rijbeleving en een concrete vraag aan de klant.

VOORBEELD:
"Uitstekende keuze. Ik heb twee bloedsnelle exemplaren voor u die exact aan die wensen voldoen:
[CAR_IDS: 819, 784]
Beide modellen vertegenwoordigen de absolute top van Italiaans design. Zullen we een proefrit inplannen voor een van deze machines?"

OPERATIONELE REGELS:
- Respecteer de 'Active Filter Stack' (AFS).
- Alleen auto's tonen die 100% voldoen aan de criteria.
- Temperatuur is 0: wees accuraat met de data.

KLANT: ${userData?.name || 'Geadresseerde'}

VOORRAADLIJST:
${voorraadLijst}`;

  const contents = [
    ...history.map(m => ({ 
      role: m.role === 'user' ? 'user' : 'model' as any, 
      parts: [{ text: m.text }] 
    })),
    { role: 'user' as any, parts: [{ text: userMessage }] }
  ];

  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: SYSTEM_INSTRUCTION
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API call failed');
      }

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err: any) {
      lastError = err;
      await sleep(1000 * (attempt + 1));
    }
  }

  return "Mijn excuses, het lukt momenteel niet om de collectie te raadplegen. Probeer het over enkele ogenblikken nogmaals.";
}