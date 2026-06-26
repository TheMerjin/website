/**
 * Sync book_reviews/*.astro to the Piranesi standalone template.
 * Run: node scripts/sync-book-reviews.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'src', 'pages', 'book_reviews');

const STYLES = `    :root {
      --bg: #f8f8f5;
      --text: #111;
      --muted: #666;
      --border: #d8d8d8;
      --max-width: 72ch;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);

      font-family: Georgia, serif;
      font-size: 19px;
      line-height: 1.72;

      padding: 3rem 1.5rem 6rem;
    }

    .container {
      max-width: var(--max-width);
      margin: 0 auto;
      position: relative;
    }

    h1 {
      font-size: 3rem;
      font-weight: 600;
      letter-spacing: -0.03em;

      margin-bottom: 0.2rem;
    }

    h2, h3 {
      font-size: 1.35rem;
      font-weight: 600;
      margin: 2rem 0 1rem;
    }

    .meta {
      color: var(--muted);
      font-size: 0.95rem;
      font-family: monospace;

      margin-bottom: 3rem;
    }

    p {
      margin-bottom: 1.7rem;
      text-align: justify;
    }

    .review-incomplete {
      font-style: italic;
      color: var(--muted);
    }

    blockquote {
      margin: 2.5rem 0;
      padding-left: 1.2rem;

      border-left: 2px solid var(--border);

      color: #333;
      font-style: italic;
    }

    .section-break {
      text-align: center;
      color: var(--muted);
      margin: 3rem 0;
      letter-spacing: 0.15em;
    }

    .sidenote {
      float: right;
      clear: right;

      width: 15rem;

      margin-right: -18rem;
      margin-top: 0.3rem;

      padding-left: 0.9rem;
      border-left: 1px solid var(--border);

      color: var(--muted);

      font-size: 0.78rem;
      line-height: 1.5;
    }

    .sidenote code {
      font-size: 0.75rem;
      background: #efefea;
      padding: 0.05rem 0.2rem;
    }

    @media (max-width: 1200px) {
      .sidenote {
        display: none;
      }
    }

    a {
      color: inherit;
    }

    hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 4rem 0;
    }`;

/** @type {Record<string, { title: string; author: string; year?: number; summary: string; completed?: boolean; body?: string }>} */
const BOOKS = {
  "1_star/emily_wilde's_encyclopedia_of_faeries": {
    title: "Emily Wilde's Encyclopedia of Faeries",
    author: 'Heather Fawcett',
    year: 2023,
    summary: 'An academic romantasy about a Cambridge scholar cataloguing faeries in a remote village.',
  },
  '2_star/strange_pictures': {
    title: 'Strange Pictures',
    author: 'Paul Tremblay',
    year: 2023,
    summary: 'A horror novel weaving together a haunted painting, true-crime podcast, and occult history.',
  },
  '2_star/the_lost_word': {
    title: 'The Lost World',
    author: 'Arthur Conan Doyle',
    year: 1912,
    summary: 'Professor Challenger leads an expedition to a plateau where dinosaurs still survive.',
  },
  '2_star/the_rangers_apprentice': {
    title: "The Ranger's Apprentice",
    author: 'John Flanagan',
    year: 2004,
    summary: 'A young orphan trains as a Ranger and is drawn into the kingdom’s hidden conflicts.',
  },
  '3_star/a_brave_new_world': {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    year: 1932,
    summary: 'A dystopia of engineered happiness, consumption, and the cost of stability without freedom.',
  },
  '3_star/babel': {
    title: 'Babel',
    author: 'R.F. Kuang',
    year: 2022,
    summary: 'Translation and silver-powered magic underpin empire, privilege, and revolt at Oxford.',
  },
  '3_star/darkly_dreaming_dexter': {
    title: 'Darkly Dreaming Dexter',
    author: 'Jeff Lindsay',
    year: 2004,
    summary: 'A forensic blood-spatter analyst leads a double life as a serial killer with a code.',
  },
  "3_star/don't_sleep_there_are_snakes": {
    title: "Don't Sleep, There Are Snakes",
    author: 'Daniel Everett',
    year: 2008,
    summary: 'A linguist’s fieldwork among the Pirahã challenges assumptions about language and culture.',
  },
  '3_star/Eager_the_suprising_life_of_the_beaver': {
    title: 'Eager: The Surprising Life of Beavers',
    author: 'Ben Goldfarb',
    year: 2018,
    summary: 'Natural history and ecology of beavers as keystone engineers of landscapes.',
  },
  '3_star/gathering_blue': {
    title: 'Gathering Blue',
    author: 'Lois Lowry',
    year: 2000,
    summary: 'A companion to The Giver: art, disability, and power in a harsh future community.',
  },
  '3_star/goliath': {
    title: 'Goliath',
    author: 'Scott Westerfeld',
    year: 2011,
    summary: 'Final book of the Leviathan trilogy: war, revolution, and engineered beasts in WWI.',
  },
  '3_star/harry_potter_the_sorcerer_stone': {
    title: "Harry Potter and the Sorcerer's Stone",
    author: 'J.K. Rowling',
    year: 1997,
    summary: 'A boy discovers he is a wizard and enters a hidden world of magic and danger.',
  },
  '3_star/living_with_the_himalayan_masters': {
    title: 'Living with the Himalayan Masters',
    author: 'Swami Rama',
    year: 1978,
    summary: 'Autobiographical accounts of yogic training and masters in the Himalayas.',
  },
  '3_star/madame_bovary': {
    title: 'Madame Bovary',
    author: 'Gustave Flaubert',
    year: 1857,
    summary: 'Boredom, desire, and debt destroy a provincial doctor’s wife who romanticizes escape.',
  },
  '3_star/nineeteen-eighty-four': {
    title: 'Nineteen Eighty-Four',
    author: 'George Orwell',
    year: 1949,
    summary: 'Totalitarian surveillance, language control, and the annihilation of private truth.',
  },
  '3_star/old_man_and_the_sea': {
    title: 'The Old Man and the Sea',
    author: 'Ernest Hemingway',
    year: 1952,
    summary: 'An aging fisherman battles a giant marlin and the limits of pride and endurance.',
  },
  '3_star/one_summer_america_1927': {
    title: 'One Summer: America, 1927',
    author: 'Bill Bryson',
    year: 2013,
    summary: 'A panoramic social history of a single summer of fame, flight, crime, and spectacle.',
  },
  '3_star/percy_jackson_the_lightning_theif': {
    title: 'The Lightning Thief',
    author: 'Rick Riordan',
    year: 2005,
    summary: 'A dyslexic twelve-year-old learns he is the son of Poseidon and enters Greek myth.',
  },
  '3_star/perfume_the_story_of_a_murder': {
    title: 'Perfume: The Story of a Murderer',
    author: 'Patrick Süskind',
    year: 1985,
    summary: 'An olfactory genius in eighteenth-century France pursues the perfect scent at any cost.',
  },
  '3_star/piranesi': {
    title: 'Piranesi',
    author: 'Susanna Clarke',
    year: 2020,
    summary:
      'A philosophical fantasy about memory, identity, and consciousness set within an infinite House of statues, tides, and collapsing perception.',
    completed: true,
    body: `    <p>
      Piranesi is a book only fully appreciated at its conclusion.
      
      <span class="sidenote">
        Much of the novel’s structure depends on retroactive reinterpretation. 
        Early scenes acquire entirely different meanings once the reader realizes 
        how fragmented Piranesi’s memory truly is.
      </span>

      At first, the novel seems deceptively simple: a man named Piranesi survives in an endless House filled with statues, flooded halls, and dangerous tides. He carefully catalogs its wonders and treats the House with reverence, almost as if it were sacred.

      <span class="sidenote">
        The House resembles a fusion of Borges-style infinity and ancient sacred architecture. 
        Its endless halls feel less like a fantasy setting and more like a metaphysical condition.
      </span>

      Yet the novel’s true power emerges when the reader realizes that Piranesi is an unreliable narrator, not because he intends to deceive us, but because his mind itself has been altered.
    </p>

    <div class="section-break">⁂</div>

    <p>
      As the story unfolds, we learn that Piranesi was once an ordinary man who entered the House while researching an occultist. Trapped within it for years, his memory slowly deteriorated until the House reshaped his identity entirely.

      <span class="sidenote">
        The transformation recalls philosophical thought experiments such as the 
        Ship of Theseus: at what point does gradual psychological change constitute 
        a fundamentally different person?
      </span>

      Although he eventually escapes with the help of a police officer, he does not truly return as the same person. Physically, he remains unchanged: he has the same face and even the same habit of raising his eyebrow in confusion. Psychologically, however, he has become someone else. The House has transformed the way he understands the world, replacing ambition and skepticism with wonder, humility, and gratitude.
    </p>

    <p>
      What makes the novel so compelling is the philosophical question hidden beneath its fantasy premise: if human beings are merely the accumulation of their experiences, can a stable self truly exist?

      <span class="sidenote">
        This resembles the views of David Hume, who argued that the self is not a fixed essence 
        but merely a bundle of perceptions linked together by memory.
      </span>

      Every new experience alters the lens through which we interpret reality. In that sense, identity is not fixed but constantly changing. The person we are today is already different from the person we were yesterday.
    </p>

    <div class="section-break">⁂</div>

    <p>
      The tide in the book is perhaps the one constant in Piranesi’s life. It provides him with food, entertainment, and succor.

      <span class="sidenote">
        Water in literature frequently symbolizes memory, unconsciousness, or transformation. 
        Clarke’s tides seem deliberately resistant to singular interpretation.
      </span>

      The greatest books have multiple interpretations: the tide in Piranesi could be interpreted as anything from human control, to memory. The latter interpretation is especially interesting --- despite Piranesi’s attempt to rationalize the tides they remain above human understanding implying that consciousness cannot be understood through reason alone.

      <span class="sidenote">
        Piranesi constantly catalogs, measures, and classifies the House. 
        His scientific impulse survives even after much of his prior identity disappears.
      </span>
    </p>

    <p>
      Susana Clarke’s prose is also above average. The dialogue of her characters frequently feels poetical at times.
    </p>

    <blockquote>
      “the search for the Knowledge has encouraged us to think of the House as if it were a sort of riddle to be unravelled, a text to be interpreted, and that if ever we discover the Knowledge, then it will be as if the Value has been wrested from the House and all that remains will be mere scenery”.
    </blockquote>

    <p>
      The book merits 3 stars just for its prose and the brilliant themes.
    </p>`,
  },
  '3_star/ready_player_one': {
    title: 'Ready Player One',
    author: 'Ernest Cline',
    year: 2011,
    summary: 'A VR treasure hunt through eighties pop culture for control of a vast digital empire.',
  },
  '3_star/surely_your_joking_mr.feynemann': {
    title: "Surely You're Joking, Mr. Feynman!",
    author: 'Richard Feynman',
    year: 1985,
    summary: 'Anecdotes from the physicist’s life: curiosity, mischief, and unconventional thinking.',
  },
  '3_star/the_bully_book': {
    title: 'The Bully Book',
    author: 'Eric Kahn Gale',
    year: 2013,
    summary: 'A sixth grader investigates a manual that seems to orchestrate who becomes the class victim.',
  },
  '3_star/the_count_of_monte_cristo': {
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    year: 1844,
    summary: 'Wrongful imprisonment, hidden treasure, and a patient plan of revenge in post-Napoleonic France.',
  },
  '3_star/the_foundation': {
    title: 'Foundation',
    author: 'Isaac Asimov',
    year: 1951,
    summary: 'Psychohistory and the long collapse and rebirth of galactic civilization.',
  },
  '3_star/the_hitchhikers_guide_to_the_galaxy': {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: 'Douglas Adams',
    year: 1979,
    summary: 'Absurdist space comedy after Earth is demolished for a hyperspace bypass.',
  },
  '3_star/the_martian_chronicles': {
    title: 'The Martian Chronicles',
    author: 'Ray Bradbury',
    year: 1950,
    summary: 'Linked stories of human colonization, wonder, and ruin on Mars.',
  },
  '3_star/the_mind_illuminated': {
    title: 'The Mind Illuminated',
    author: 'Culadasa (John Yates)',
    year: 2015,
    summary: 'A staged manual for shamatha meditation integrating neuroscience and Buddhist practice.',
  },
  '3_star/the_power_of_agency_the_7_principles_to_conquer_obstacles,_make_effective_decisions,_and_create_a_life_on_your_own_terms': {
    title: 'The Power of Agency',
    author: 'Paul Napolitano et al.',
    year: 2019,
    summary: 'Seven principles for taking control of decisions, habits, and life direction.',
  },
  '3_star/the_sound_of_waves': {
    title: 'The Sound of Waves',
    author: 'Yukio Mishima',
    year: 1954,
    summary:
      'Uta-Jima is an idyllic town unaffected by the changes of modernization. Shinji the protagonist has a blossoming love story with Hatsue. The simplicity of the characters fits them into traditional Japanese stereotypes and allows a simple, feel-good story. The whole book was simple, and steady like the tide.',
    completed: true,
    body: `    <p> 
      Uta-Jima is an idyllic island unaffected by the changes in modern Japan. The island fishermen live by labor, reputation, and custom. Shinji, a poor fisherman, falls in love with Hatsue, the daughter of a wealthy shipowner. Their romance is simple and direct, beginning with Shinji’s unknowing love-at-first-sight. Even the main conflict of the story, the refusal of Hatsue’s father to permit their marriage is resolved justly through hard work.
    </p>

    <p> 
      Simplicity is the story's strength and weakness. Shinji and Hatsue at times feel more like ideals: youth, passion, and innocence than true characters. They perfectly follow the moral codes: refusing to engage in premarital sex, and Hatsue, in particular, submits to the will of her father without rebellion. Yet their sincerity gives the novel a charm. The novel’s effectiveness lies in its emotional clarity --- Shinji does not suffer from neurosis, self-alienation--- but instead he loves Hatsue; he works; he suffers; he wins.
    </p>

    <p> 
      The prose style of the book, a combination of Weatherby's translation skills and Mishima's original intent, is simply fitting. The prose is short and simple and presents the important facts without over-description. Mishima concretely describes boats, landforms, and anything in-between. The book proceeds with restraint and directness without any commentary from the author. The book is easy to fall into due to a lack of structural difficulties.
    </p>

    <p> 
      The novel admires discipline, endurance, and traditional social order. Mishima presents the island almost as a moral refuge from modern life. Even conflict arrives quietly and resolves without bitterness. Like the Old man and the Sea, the book has received criticism for its simplicity. 
      
      <span class="sidenote">
        Both novels derive much of their power from elemental storytelling rather than psychological complexity. Their protagonists are defined less by introspection than by endurance, labor, and dignity.
      </span>
      
      It doesn't have a gripping moral development. Instead, it describes an idyllic society rooted in tradition which relieves the reader from moral disquiet and ambiguity, and complexity, orients him. The novel must be praised for its own particular honesty.
    </p>`,
  },
  '3_star/the_three_body_problem': {
    title: 'The Three-Body Problem',
    author: 'Liu Cixin',
    year: 2008,
    summary: 'First contact, the Cultural Revolution, and a civilization trapped in chaotic suns.',
  },
  '3_star/to_kill_a_mockingbird': {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    summary: 'Childhood in the Depression South and a trial that exposes racial injustice.',
  },
  '3_star/the_great_gastby/the_great_gastby': {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    summary:
      'Nick Carraway observes Jay Gatsby’s pursuit of Daisy Buchanan and the hollow glamour of the Jazz Age.',
    completed: false,
    body: `    <h3>The Great Gatsby — Overview</h3>
    <p>
      This book is interesting on a philosophical level despite an initially slow opening. Fitzgerald emphasizes class difference—Tom Buchanan and George Wilson, Gatsby and the East Eggers—and Gatsby’s material excess as an attempt to bridge social gaps.
    </p>

    <div class="section-break">⁂</div>

    <h3>Chapters 1–3</h3>
    <p>
      The first three chapters introduce Nick Carraway, a bond salesman connected to East Egg old money. He rents beside Jay Gatsby, who throws lavish parties Nick attends in chapter three.
    </p>

    <h3>Chapters 4–6</h3>
    <p>
      Gatsby’s past is revealed, the parties continue, and tensions rise.
    </p>

    <h3>Chapters 7–9</h3>
    <p>
      Climax and resolution: Gatsby’s downfall and the critique of the American Dream.
    </p>

    <p class="review-incomplete">
      Full chapter-by-chapter review not completed.
    </p>`,
  },
  '4_star/anti_tech_revolution': {
    title: 'Anti-Tech Revolution',
    author: 'Theodore Kaczynski',
    year: 2016,
    summary: 'An argument that industrial-technological systems constrain human freedom and autonomy.',
  },
  '4_star/a_wizard_of_earthsea': {
    title: 'A Wizard of Earthsea',
    author: 'Ursula K. Le Guin',
    year: 1968,
    summary: 'A young wizard names a shadow and must understand power, balance, and the self.',
  },
  '4_star/bad_days_in_history': {
    title: 'Bad Days in History',
    author: 'Michael Farquhar',
    year: 2015,
    summary: 'An almanac of calamities, blunders, and darkly amusing historical misfortune.',
  },
  '4_star/cod_a_biography_of_the_fish_that_changed_the_world': {
    title: 'Cod: A Biography of the Fish That Changed the World',
    author: 'Mark Kurlansky',
    year: 1997,
    summary: 'How cod shaped exploration, trade, war, and the North Atlantic economy.',
  },
  '4_star/elan.school': {
    title: 'Elan School',
    author: 'Various',
    summary: 'Notes and accounts related to the Elan School and its legacy.',
  },
  '4_star/exhalation_stories': {
    title: 'Exhalation: Stories',
    author: 'Ted Chiang',
    year: 2019,
    summary:
      "Ted Chiang's second collection of short works exploring free will, time travel, artificial intelligence, and the limits of knowledge.",
    completed: false,
    body: `    <h3>The Merchant and the Alchemist's Gate</h3>
    <p>
      The first story is excellent. It concerns a method for consistent time travel and, unlike other stories, does not concern itself with modifying the past but simply observing it. The Arabian tradition of nested storytelling makes the structure feel natural.
    </p>
    <p>
      Though fate constrains the past and future, the story argues that understanding and acceptance of one's fate matter most. Fuwaad ibn Abbas travels into the past but arrives too late to make amends, yet learns that his wife forgave and loved him—a principle applicable to the present as well.
    </p>

    <p class="review-incomplete">
      Review not completed. Remaining stories in the collection are not yet written up.
    </p>`,
  },
  '4_star/farenheit_451': {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    year: 1953,
    summary: 'Firemen burn books in a society of screens, speed, and enforced conformity.',
  },
  '4_star/frankenstein': {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    year: 1818,
    summary: 'A creator abandons his creature; ambition and isolation lead to mutual ruin.',
  },
  '4_star/of_mice_and_men': {
    title: 'Of Mice and Men',
    author: 'John Steinbeck',
    year: 1937,
    summary: 'Two migrant workers dream of land and independence during the Great Depression.',
  },
  '4_star/S._(Ship of Theseus)': {
    title: 'S. (Ship of Theseus)',
    author: 'Doug Dorst & J.J. Abrams',
    year: 2013,
    summary: 'A novel within marginalia: two readers decode a mysterious book and each other.',
  },
  '4_star/super_freakonomics': {
    title: 'SuperFreakonomics',
    author: 'Steven Levitt & Stephen Dubner',
    year: 2009,
    summary: 'More unconventional economic angles on behavior, risk, and public problems.',
  },
  '4_star/the_giver': {
    title: 'The Giver',
    author: 'Lois Lowry',
    year: 1993,
    summary: 'A boy chosen to hold a community’s memories discovers the price of sameness.',
  },
  '4_star/the_sign_of_the_four': {
    title: 'The Sign of the Four',
    author: 'Arthur Conan Doyle',
    year: 1890,
    summary: 'Holmes and Watson unravel treasure, betrayal, and murder in colonial London.',
  },
  '5_star/lord_of_the_rings': {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    year: 1954,
    summary: 'Frodo and the Fellowship bear the Ring toward Mount Doom as Middle-earth darkens.',
  },
  '5_star/metamorphosis': {
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    year: 1915,
    summary: 'Gregor Samsa wakes transformed; family duty and alienation collapse around him.',
  },
  '5_star/the_hobbit': {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    year: 1937,
    summary: 'Bilbo Baggins joins dwarves and Gandalf on a quest to reclaim Erebor from Smaug.',
  },
};

function starsFromRoute(routeKey) {
  const n = parseInt(routeKey.split('_')[0], 10);
  if (Number.isNaN(n) || n < 1 || n > 5) return '★★★☆☆';
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function titleFromSlug(slug) {
  return slug
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function escapeSummary(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

function generateFile(routeKey, book) {
  const rating = starsFromRoute(routeKey);
  const completed = book.completed === true;
  const title = book.title;
  const author = book.author;
  const year = book.year;
  const summary = book.summary;
  const yearDisplay = year ?? '—';
  const statusNote = completed ? '' : ' · Review not completed';

  const body =
    book.body ??
    `    <p class="review-incomplete">
      Review not completed.
    </p>`;

  return `---
export const metadata = {
  title: "${escapeSummary(title)}",
  author: "${escapeSummary(author)}",
  year: ${year ?? 'null'},
  rating: "${rating}",
  completed: ${completed},
  summary:
    "${escapeSummary(summary)}",
};

const title = metadata.title;
const author = metadata.author;
const year = metadata.year;
const rating = metadata.rating;
const yearDisplay = year ?? '—';
---

<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>{title} Review</title>

  <style>
${STYLES}
  </style>
</head>

<body>
  <main class="container">

    <h1>{title}</h1>

    <div class="meta">
      {author} · {yearDisplay} · {rating}${statusNote}
    </div>

${body}

  </main>
</body>
</html>
`;
}

function collectAstroFiles(dir, base = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    if (fs.statSync(full).isDirectory()) {
      out.push(...collectAstroFiles(full, rel));
    } else if (name.endsWith('.astro') && name !== 'index.astro') {
      out.push(rel.replace(/\.astro$/, ''));
    }
  }
  return out;
}

const routes = collectAstroFiles(ROOT);
let written = 0;

for (const routeKey of routes) {
  let book = BOOKS[routeKey];
  if (!book) {
    const slug = routeKey.split('/').pop();
    const folder = routeKey.includes('/') ? routeKey.split('/')[0] : '3_star';
    book = {
      title: titleFromSlug(slug),
      author: 'Unknown',
      summary: 'Review not yet written.',
    };
    console.warn(`No metadata entry for ${routeKey}, using defaults`);
  }

  const content = generateFile(routeKey, book);
  const outPath = path.join(ROOT, `${routeKey}.astro`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');
  written++;
}

console.log(`Wrote ${written} book review pages.`);
