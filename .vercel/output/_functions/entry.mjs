import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DB9nFm74.mjs';
import { manifest } from './manifest_CLgBo40M.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/archive/download.astro.mjs');
const _page3 = () => import('./pages/api/archive.astro.mjs');
const _page4 = () => import('./pages/api/ash_init.astro.mjs');
const _page5 = () => import('./pages/api/auth/calendar_events/create.astro.mjs');
const _page6 = () => import('./pages/api/auth/calendar_events/delete.astro.mjs');
const _page7 = () => import('./pages/api/auth/calendar_events/get.astro.mjs');
const _page8 = () => import('./pages/api/auth/calendar_events/update.astro.mjs');
const _page9 = () => import('./pages/api/auth/debug_comments.astro.mjs');
const _page10 = () => import('./pages/api/auth/deletenotes.astro.mjs');
const _page11 = () => import('./pages/api/auth/get_all_notes.astro.mjs');
const _page12 = () => import('./pages/api/auth/get_bio.astro.mjs');
const _page13 = () => import('./pages/api/auth/get_book_annotations.astro.mjs');
const _page14 = () => import('./pages/api/auth/get_book_comments.astro.mjs');
const _page15 = () => import('./pages/api/auth/get_comment_ratings.astro.mjs');
const _page16 = () => import('./pages/api/auth/get_comments.astro.mjs');
const _page17 = () => import('./pages/api/auth/get_leaderboard.astro.mjs');
const _page18 = () => import('./pages/api/auth/get_notes.astro.mjs');
const _page19 = () => import('./pages/api/auth/get_notes_by_username.astro.mjs');
const _page20 = () => import('./pages/api/auth/get_posts.astro.mjs');
const _page21 = () => import('./pages/api/auth/get_tags.astro.mjs');
const _page22 = () => import('./pages/api/auth/logged-in.astro.mjs');
const _page23 = () => import('./pages/api/auth/login.astro.mjs');
const _page24 = () => import('./pages/api/auth/logout.astro.mjs');
const _page25 = () => import('./pages/api/auth/notes.astro.mjs');
const _page26 = () => import('./pages/api/auth/post_comments.astro.mjs');
const _page27 = () => import('./pages/api/auth/post_tags.astro.mjs');
const _page28 = () => import('./pages/api/auth/posts.astro.mjs');
const _page29 = () => import('./pages/api/auth/register.astro.mjs');
const _page30 = () => import('./pages/api/auth/reset-password.astro.mjs');
const _page31 = () => import('./pages/api/auth/save_book_annotation.astro.mjs');
const _page32 = () => import('./pages/api/auth/search_similar.astro.mjs');
const _page33 = () => import('./pages/api/auth/signout.astro.mjs');
const _page34 = () => import('./pages/api/auth/update_comment_gratitude.astro.mjs');
const _page35 = () => import('./pages/api/auth/update_comment_rating.astro.mjs');
const _page36 = () => import('./pages/api/auth/update-password.astro.mjs');
const _page37 = () => import('./pages/api/auth/user-data.astro.mjs');
const _page38 = () => import('./pages/api/chess/puzzle.astro.mjs');
const _page39 = () => import('./pages/api/chess-board-image.astro.mjs');
const _page40 = () => import('./pages/api/edges.astro.mjs');
const _page41 = () => import('./pages/api/errors/_id_.astro.mjs');
const _page42 = () => import('./pages/api/errors.astro.mjs');
const _page43 = () => import('./pages/api/game_over.astro.mjs');
const _page44 = () => import('./pages/api/game_request.astro.mjs');
const _page45 = () => import('./pages/api/get_active_game_requests.astro.mjs');
const _page46 = () => import('./pages/api/get_game_requests.astro.mjs');
const _page47 = () => import('./pages/api/get_profile.astro.mjs');
const _page48 = () => import('./pages/api/join_game.astro.mjs');
const _page49 = () => import('./pages/api/nodes.astro.mjs');
const _page50 = () => import('./pages/api/sreekgames/_id_.astro.mjs');
const _page51 = () => import('./pages/api/sreekgames.astro.mjs');
const _page52 = () => import('./pages/api/tasks/status_change.astro.mjs');
const _page53 = () => import('./pages/api/tasks/time_left_change.astro.mjs');
const _page54 = () => import('./pages/api/tasks/_id_.astro.mjs');
const _page55 = () => import('./pages/api/tasks.astro.mjs');
const _page56 = () => import('./pages/api/topics/_id_.astro.mjs');
const _page57 = () => import('./pages/api/topics.astro.mjs');
const _page58 = () => import('./pages/api/update_game.astro.mjs');
const _page59 = () => import('./pages/blog.astro.mjs');
const _page60 = () => import('./pages/books/have-read.astro.mjs');
const _page61 = () => import('./pages/books/read/_bookid_.astro.mjs');
const _page62 = () => import('./pages/books/reviews/dont-sleep-there-are-snakes.astro.mjs');
const _page63 = () => import('./pages/books/reviews/perfume.astro.mjs');
const _page64 = () => import('./pages/books/reviews/the-structure-of-scientific-revolutions.astro.mjs');
const _page65 = () => import('./pages/books/to-be-read.astro.mjs');
const _page66 = () => import('./pages/books/_category_.astro.mjs');
const _page67 = () => import('./pages/books.astro.mjs');
const _page68 = () => import('./pages/calendar.astro.mjs');
const _page69 = () => import('./pages/chess/games/_gameid_.astro.mjs');
const _page70 = () => import('./pages/chess/puzzles.astro.mjs');
const _page71 = () => import('./pages/chess/solutions/yusupov_revisions/part_1/basic_opening_principles.astro.mjs');
const _page72 = () => import('./pages/chess/solutions/yusupov_revisions/part_1/mating_motifs_1.astro.mjs');
const _page73 = () => import('./pages/chess/solutions/yusupov_revisions/part_1/mating_motifs_two.astro.mjs');
const _page74 = () => import('./pages/chess/solutions/yusupov_revisions/part_1/the_value_of_the_pieces.astro.mjs');
const _page75 = () => import('./pages/chess/solutions.astro.mjs');
const _page76 = () => import('./pages/chess/sreekgames/_id_.astro.mjs');
const _page77 = () => import('./pages/chess/sreekgames.astro.mjs');
const _page78 = () => import('./pages/chess.astro.mjs');
const _page79 = () => import('./pages/dashboard.astro.mjs');
const _page80 = () => import('./pages/debate/topic/_id_.astro.mjs');
const _page81 = () => import('./pages/debate.astro.mjs');
const _page82 = () => import('./pages/digital-archive.astro.mjs');
const _page83 = () => import('./pages/error-log.astro.mjs');
const _page84 = () => import('./pages/leaderboard.astro.mjs');
const _page85 = () => import('./pages/login.astro.mjs');
const _page86 = () => import('./pages/master-tracker.astro.mjs');
const _page87 = () => import('./pages/math/differential equations/taylor_series_method.astro.mjs');
const _page88 = () => import('./pages/math/differential equations/toricelli\'s_law_of_fluid.astro.mjs');
const _page89 = () => import('./pages/math/differential equations.astro.mjs');
const _page90 = () => import('./pages/math.astro.mjs');
const _page91 = () => import('./pages/notes/_slug_.astro.mjs');
const _page92 = () => import('./pages/notes.astro.mjs');
const _page93 = () => import('./pages/post-editor.astro.mjs');
const _page94 = () => import('./pages/posts/_slug_.astro.mjs');
const _page95 = () => import('./pages/profile.astro.mjs');
const _page96 = () => import('./pages/random.astro.mjs');
const _page97 = () => import('./pages/register.astro.mjs');
const _page98 = () => import('./pages/reset-password.astro.mjs');
const _page99 = () => import('./pages/reset-password-confirmed.astro.mjs');
const _page100 = () => import('./pages/rss.xml.astro.mjs');
const _page101 = () => import('./pages/search.astro.mjs');
const _page102 = () => import('./pages/tasks/_taskid_.astro.mjs');
const _page103 = () => import('./pages/tasks-kanban.astro.mjs');
const _page104 = () => import('./pages/update-password.astro.mjs');
const _page105 = () => import('./pages/_profile_.astro.mjs');
const _page106 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/archive/download.ts", _page2],
    ["src/pages/api/archive/index.ts", _page3],
    ["src/pages/api/ash_init.ts", _page4],
    ["src/pages/api/auth/calendar_events/create.ts", _page5],
    ["src/pages/api/auth/calendar_events/delete.ts", _page6],
    ["src/pages/api/auth/calendar_events/get.ts", _page7],
    ["src/pages/api/auth/calendar_events/update.ts", _page8],
    ["src/pages/api/auth/debug_comments.ts", _page9],
    ["src/pages/api/auth/deletenotes.ts", _page10],
    ["src/pages/api/auth/get_all_notes.ts", _page11],
    ["src/pages/api/auth/get_bio.ts", _page12],
    ["src/pages/api/auth/get_book_annotations.ts", _page13],
    ["src/pages/api/auth/get_book_comments.ts", _page14],
    ["src/pages/api/auth/get_comment_ratings.ts", _page15],
    ["src/pages/api/auth/get_comments.ts", _page16],
    ["src/pages/api/auth/get_leaderboard.ts", _page17],
    ["src/pages/api/auth/get_notes.ts", _page18],
    ["src/pages/api/auth/get_notes_by_username.ts", _page19],
    ["src/pages/api/auth/get_posts.ts", _page20],
    ["src/pages/api/auth/get_tags.ts", _page21],
    ["src/pages/api/auth/logged-in.ts", _page22],
    ["src/pages/api/auth/login.ts", _page23],
    ["src/pages/api/auth/logout.ts", _page24],
    ["src/pages/api/auth/notes.ts", _page25],
    ["src/pages/api/auth/post_comments.ts", _page26],
    ["src/pages/api/auth/post_tags.ts", _page27],
    ["src/pages/api/auth/posts.ts", _page28],
    ["src/pages/api/auth/register.ts", _page29],
    ["src/pages/api/auth/reset-password.ts", _page30],
    ["src/pages/api/auth/save_book_annotation.ts", _page31],
    ["src/pages/api/auth/search_similar.ts", _page32],
    ["src/pages/api/auth/signout.ts", _page33],
    ["src/pages/api/auth/update_comment_gratitude.ts", _page34],
    ["src/pages/api/auth/update_comment_rating.ts", _page35],
    ["src/pages/api/auth/update-password.ts", _page36],
    ["src/pages/api/auth/user-data.ts", _page37],
    ["src/pages/api/chess/puzzle.ts", _page38],
    ["src/pages/api/chess-board-image.ts", _page39],
    ["src/pages/api/edges/index.ts", _page40],
    ["src/pages/api/errors/[id].ts", _page41],
    ["src/pages/api/errors/index.ts", _page42],
    ["src/pages/api/game_over.ts", _page43],
    ["src/pages/api/game_request.ts", _page44],
    ["src/pages/api/get_active_game_requests.ts", _page45],
    ["src/pages/api/get_game_requests.ts", _page46],
    ["src/pages/api/get_profile.ts", _page47],
    ["src/pages/api/join_game.ts", _page48],
    ["src/pages/api/nodes/index.ts", _page49],
    ["src/pages/api/sreekgames/[id].ts", _page50],
    ["src/pages/api/sreekgames/index.ts", _page51],
    ["src/pages/api/tasks/status_change.ts", _page52],
    ["src/pages/api/tasks/time_left_change.ts", _page53],
    ["src/pages/api/tasks/[id].ts", _page54],
    ["src/pages/api/tasks/index.ts", _page55],
    ["src/pages/api/topics/[id].ts", _page56],
    ["src/pages/api/topics/index.ts", _page57],
    ["src/pages/api/update_game.ts", _page58],
    ["src/pages/blog.astro", _page59],
    ["src/pages/books/have-read.astro", _page60],
    ["src/pages/books/read/[bookid].astro", _page61],
    ["src/pages/books/reviews/dont-sleep-there-are-snakes.astro", _page62],
    ["src/pages/books/reviews/perfume.astro", _page63],
    ["src/pages/books/reviews/the-structure-of-scientific-revolutions.astro", _page64],
    ["src/pages/books/to-be-read.astro", _page65],
    ["src/pages/books/[category].astro", _page66],
    ["src/pages/books.astro", _page67],
    ["src/pages/calendar.astro", _page68],
    ["src/pages/chess/games/[gameid].astro", _page69],
    ["src/pages/chess/puzzles.astro", _page70],
    ["src/pages/chess/solutions/yusupov_revisions/part_1/basic_opening_principles.astro", _page71],
    ["src/pages/chess/solutions/yusupov_revisions/part_1/mating_motifs_1.astro", _page72],
    ["src/pages/chess/solutions/yusupov_revisions/part_1/mating_motifs_two.astro", _page73],
    ["src/pages/chess/solutions/yusupov_revisions/part_1/the_value_of_the_pieces.astro", _page74],
    ["src/pages/chess/solutions/index.astro", _page75],
    ["src/pages/chess/sreekgames/[id].astro", _page76],
    ["src/pages/chess/sreekgames/index.astro", _page77],
    ["src/pages/chess.astro", _page78],
    ["src/pages/dashboard.astro", _page79],
    ["src/pages/debate/topic/[id].astro", _page80],
    ["src/pages/debate/index.astro", _page81],
    ["src/pages/digital-archive.astro", _page82],
    ["src/pages/error-log.astro", _page83],
    ["src/pages/leaderboard.astro", _page84],
    ["src/pages/login.astro", _page85],
    ["src/pages/master-tracker.astro", _page86],
    ["src/pages/math/differential equations/taylor_series_method.astro", _page87],
    ["src/pages/math/differential equations/toricelli's_law_of_fluid.astro", _page88],
    ["src/pages/math/differential equations/index.astro", _page89],
    ["src/pages/math/index.astro", _page90],
    ["src/pages/notes/[slug].astro", _page91],
    ["src/pages/notes.astro", _page92],
    ["src/pages/post-editor.astro", _page93],
    ["src/pages/posts/[slug].astro", _page94],
    ["src/pages/profile.astro", _page95],
    ["src/pages/random.astro", _page96],
    ["src/pages/register.astro", _page97],
    ["src/pages/reset-password.astro", _page98],
    ["src/pages/reset-password-confirmed.astro", _page99],
    ["src/pages/rss.xml.js", _page100],
    ["src/pages/search.astro", _page101],
    ["src/pages/tasks/[taskid].astro", _page102],
    ["src/pages/tasks-kanban.astro", _page103],
    ["src/pages/update-password.astro", _page104],
    ["src/pages/[profile].astro", _page105],
    ["src/pages/index.astro", _page106]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "2998796f-b789-4409-a8a0-2e9651fd01db",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
