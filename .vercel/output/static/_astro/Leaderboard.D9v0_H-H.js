import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as a}from"./index.Cu2Fb987.js";import"./_commonjsHelpers.gnU0ypJ3.js";function g(){const[l,i]=a.useState([]),[c,n]=a.useState(!0),[t,m]=a.useState(null);a.useEffect(()=>{o()},[]);const o=async()=>{try{n(!0);const r=await fetch("/api/auth/get_leaderboard",{method:"GET",credentials:"include"});if(!r.ok)throw new Error("Failed to fetch leaderboard");const s=await r.json();i(s.players||[])}catch(r){console.error("Error fetching leaderboard:",r),m("Failed to load leaderboard")}finally{n(!1)}},b=r=>r>=2e3?"#28a745":r>=1600?"#17a2b8":r>=1200?"#ffc107":"#6c757d",d=()=>e.jsxs("div",{className:"leaderboard-header",style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.2rem 1.5rem 0.5rem 1.5rem"},children:[e.jsx("h3",{style:{margin:0,fontWeight:700,fontSize:"1.3rem",color:"#222",fontFamily:"Inter, sans-serif",letterSpacing:"-0.5px"},children:"Leaderboard"}),e.jsx("button",{className:"refresh-btn",onClick:o,style:{background:"none",border:"none",fontSize:"1.2rem",cursor:"pointer",color:"#888",borderRadius:"0",padding:"0.2rem 0.5rem",transition:"background 0.2s"},title:"Refresh",children:"↻"})]});return c?e.jsxs("div",{className:"leaderboard-container lesswrong-leaderboard",children:[e.jsx(d,{}),e.jsxs("div",{className:"loading-state",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("span",{children:"Loading rankings..."})]})]}):t?e.jsxs("div",{className:"leaderboard-container lesswrong-leaderboard",children:[e.jsx(d,{}),e.jsxs("div",{className:"error-state",children:[e.jsx("span",{children:t}),e.jsx("button",{className:"retry-btn",onClick:o,children:"Try Again"})]})]}):e.jsxs("div",{className:"leaderboard-container lesswrong-leaderboard",children:[e.jsx(d,{}),e.jsx("div",{className:"leaderboard-table-wrapper",children:e.jsxs("div",{className:"leaderboard-table",children:[e.jsxs("div",{className:"leaderboard-row leaderboard-header-row",children:[e.jsx("div",{className:"leaderboard-col rank-col",children:"Rank"}),e.jsx("div",{className:"leaderboard-col user-col",children:"Username"}),e.jsx("div",{className:"leaderboard-col games-col",children:"Games"}),e.jsx("div",{className:"leaderboard-col elo-col",children:"ELO"})]}),l.length===0?e.jsx("div",{className:"empty-state",children:e.jsx("span",{children:"No players found"})}):l.map((r,s)=>e.jsxs("div",{className:"leaderboard-row",children:[e.jsx("div",{className:"leaderboard-col rank-col",children:s+1}),e.jsx("div",{className:"leaderboard-col user-col",children:r.username||"Anonymous"}),e.jsx("div",{className:"leaderboard-col games-col",children:r.games_played||0}),e.jsx("div",{className:"leaderboard-col elo-col",style:{color:b(r.skill_mean),fontWeight:700,textAlign:"right"},children:Math.round(r.skill_mean||1500)})]},r.id))]})}),e.jsx("style",{jsx:!0,children:`
        .lesswrong-leaderboard {
          background: #f8f4f0;
          border: 1px solid #e6e1d7;
          border-radius: 0;
          box-shadow: 0 4px 24px 0 rgba(60,60,60,0.10);
          width: 100%;
          max-width: none;
          margin: 0;
          padding-bottom: 1.5rem;
        }
        .leaderboard-table-wrapper {
          overflow-x: auto;
        }
        .leaderboard-table {
          width: 100%;
          min-width: 350px;
          margin-top: 0.5rem;
        }
        .leaderboard-row {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ececec;
          transition: background 0.18s;
          background: none;
        }
        .leaderboard-row:last-child {
          border-bottom: none;
        }
        .leaderboard-row:hover:not(.leaderboard-header-row) {
          background: #f3ede6;
        }
        .leaderboard-header-row {
          background: #f5f3ef;
          font-weight: 600;
          color: #555;
          font-size: 1.01rem;
          border-bottom: 2px solid #e6e1d7;
        }
        .leaderboard-col {
          padding: 0.7rem 0.7rem;
          font-size: 1.05rem;
          font-family: 'Inter', sans-serif;
          color: #222;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rank-col {
          flex: 0.5;
          text-align: right;
          color: #888;
        }
        .user-col {
          flex: 2.2;
          text-align: left;
        }
        .games-col {
          flex: 1.1;
          text-align: right;
          color: #888;
        }
        .elo-col {
          flex: 1.1;
          text-align: right;
        }
        .loading-state, .error-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          color: #6c757d;
          font-size: 0.98rem;
        }
        .loading-spinner {
          width: 22px;
          height: 22px;
          border: 2px solid #e9ecef;
          border-top: 2px solid #6c757d;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 0.7rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .retry-btn {
          background: #456650;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0;
          font-size: 0.9rem;
          cursor: pointer;
          margin-top: 0.7rem;
          transition: background-color 0.2s;
        }
        .retry-btn:hover {
          background: #333;
        }
      `})]})}export{g as default};
