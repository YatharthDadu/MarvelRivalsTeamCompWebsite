import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Shield, Swords, Cross, Users, Save, Download, Trash2, RotateCcw, Bookmark, BookmarkCheck, Share2, DownloadCloud, ChevronsRight, Plus, Minus, FolderOpen, Search, X, ArrowRight, ChevronDown } from 'lucide-react';
import { heroes, teamUps, roles } from './data';
import './index.css';

const heroToCode = {};
const codeToHero = {};
const vanguards = [...heroes].filter(h => h.role === roles.VANGUARD).sort((a,b) => a.name.localeCompare(b.name));
const duelists = [...heroes].filter(h => h.role === roles.DUELIST).sort((a,b) => a.name.localeCompare(b.name));
const strategists = [...heroes].filter(h => h.role === roles.STRATEGIST).sort((a,b) => a.name.localeCompare(b.name));

vanguards.forEach((h, i) => { const code = `a${i+1}`; heroToCode[h.id] = code; codeToHero[code] = h.id; });
duelists.forEach((h, i) => { const code = `b${i+1}`; heroToCode[h.id] = code; codeToHero[code] = h.id; });
strategists.forEach((h, i) => { const code = `c${i+1}`; heroToCode[h.id] = code; codeToHero[code] = h.id; });

const ROLE_SECTIONS = [
  { role: roles.VANGUARD, heroes: vanguards, cls: 'vanguard' },
  { role: roles.DUELIST, heroes: duelists, cls: 'duelist' },
  { role: roles.STRATEGIST, heroes: strategists, cls: 'strategist' },
];

const heroById = new Map(heroes.map(h => [h.id, h]));
const teamUpById = new Map(teamUps.map(t => [t.id, t]));

// Teams saved before team-ups carried provider/recipient still hold the old
// objects, so look the current one up by id.
const resolveTeamUp = (tu) => teamUpById.get(tu.id) || tu;

// --- Fast synergy lookup: every team-up is a hero pair, so index them by pair ---
const HERO_COUNT = heroes.length;
const heroIdxById = new Map(heroes.map((h, i) => [h.id, i]));
const pairHasTU = new Uint8Array(HERO_COUNT * HERO_COUNT);
const pairTUList = new Array(HERO_COUNT * HERO_COUNT).fill(null);
for (const tu of teamUps) {
  let a = heroIdxById.get(tu.heroes[0]);
  let b = heroIdxById.get(tu.heroes[1]);
  if (a === undefined || b === undefined) continue;
  if (a > b) { const t = a; a = b; b = t; }
  const k = a * HERO_COUNT + b;
  if (!pairTUList[k]) { pairTUList[k] = []; pairHasTU[k] = 1; }
  pairTUList[k].push(tu);
}

// Helper to get role icon
const getRoleClass = (role) => {
  if (role === roles.VANGUARD) return 'role-vanguard';
  if (role === roles.DUELIST) return 'role-duelist';
  if (role === roles.STRATEGIST) return 'role-strategist';
  return '';
};

const RoleIcon = ({ role, size = 15 }) => {
  if (role === roles.VANGUARD) return <Shield size={size} strokeWidth={2.5} />;
  if (role === roles.DUELIST) return <Swords size={size} strokeWidth={2.5} />;
  return <Cross size={size} strokeWidth={2.5} />;
};

// Combinatorics helper
function getCombinations(array, size) {
  const result = [];
  function combine(start, combo) {
    if (combo.length === size) {
      result.push(combo);
      return;
    }
    for (let i = start; i < array.length; i++) {
      combine(i + 1, [...combo, array[i]]);
    }
  }
  combine(0, []);
  return result;
}

function checkFormation(team, formationReq) {
  let v = 0, d = 0, s = 0;
  for (let i = 0; i < team.length; i++) {
    if (team[i].role === roles.VANGUARD) v++;
    else if (team[i].role === roles.DUELIST) d++;
    else if (team[i].role === roles.STRATEGIST) s++;
  }
  return v === formationReq.v && d === formationReq.d && s === formationReq.s;
}

function getOptimalTeamUpCombo(activeTUs, teamIds) {
  let bestCombo = [];
  let maxHeroes = 0;
  let maxCount = 0;

  function backtrack(index, currentSelection) {
    if (index === activeTUs.length) {
      let uniqueHeroes = new Set();
      for (let tu of currentSelection) {
        for (let h of tu.heroes) uniqueHeroes.add(h);
      }

      if (uniqueHeroes.size > maxHeroes || (uniqueHeroes.size === maxHeroes && currentSelection.length > maxCount)) {
        maxHeroes = uniqueHeroes.size;
        maxCount = currentSelection.length;
        bestCombo = [...currentSelection];
      }
      return;
    }

    // Option 1: skip
    backtrack(index + 1, currentSelection);

    // Option 2: include it, unless that hero is already receiving a team-up
    // (a hero can only benefit from one at a time)
    let tu = activeTUs[index];
    let canInclude = true;
    for (let selected of currentSelection) {
      if (selected.recipient === tu.recipient) {
        canInclude = false;
        break;
      }
    }
    if (canInclude) {
      currentSelection.push(tu);
      backtrack(index + 1, currentSelection);
      currentSelection.pop();
    }
  }

  backtrack(0, []);

  let buffedSet = new Set();
  for (let tu of bestCombo) {
    for (let h of tu.heroes) buffedSet.add(h);
  }

  let unbuffed = teamIds.filter(id => !buffedSet.has(id));

  return {
    maxCount,
    maxHeroes,
    combo: bestCombo,
    unbuffed
  };
}

function getValidPlayerAssignment(team, playerPools) {
  let assignment = new Array(6).fill(null);
  let usedHeroes = new Set();

  for (let i = 0; i < 6; i++) {
    const pool = playerPools[i];
    if (pool.length > 0) {
      let found = false;
      for (let h of team) {
        if (pool.includes(h.id)) { found = true; break; }
      }
      if (!found) return null;
    }
  }

  function matchPlayer(playerIdx) {
    if (playerIdx === 6) return true;

    const pool = playerPools[playerIdx];
    for (let h of team) {
      if (!usedHeroes.has(h.id)) {
        if (pool.length === 0 || pool.includes(h.id)) {
          assignment[playerIdx] = h;
          usedHeroes.add(h.id);
          if (matchPlayer(playerIdx + 1)) return true;
          usedHeroes.delete(h.id);
          assignment[playerIdx] = null;
        }
      }
    }
    return false;
  }

  if (matchPlayer(0)) return assignment;
  return null;
}

function calculateSynergies(teamArray) {
  let activeTeamUps = [];
  const heroIds = teamArray.map(h => h.id);
  for (let tu of teamUps) {
    // Check if all heroes for this team up are in the teamArray
    let isActive = true;
    for (let id of tu.heroes) {
      if (!heroIds.includes(id)) {
        isActive = false;
        break;
      }
    }
    if (isActive) {
      activeTeamUps.push(tu);
    }
  }
  return activeTeamUps;
}

// Retry a failed image once (transient network errors) before hiding it
function retryImageOnce(img) {
  if (!img.dataset.retried) {
    img.dataset.retried = '1';
    const base = img.src.split('?')[0];
    setTimeout(() => { img.src = `${base}?r=${Date.now()}`; }, 600);
    return true;
  }
  return false;
}

function HeroTile({ hero, picked, index, onClick }) {
  const handleError = (e) => {
    if (!retryImageOnce(e.target)) e.target.style.display = 'none';
  };
  return (
    <button
      className={`hero-tile ${getRoleClass(hero.role)} ${picked ? 'picked' : ''}`}
      style={{ '--i': index }}
      onClick={onClick}
      title={hero.name}
    >
      <div className="tile-role"><RoleIcon role={hero.role} size={11} /></div>
      <div className="tile-portrait">
        <img src={`/heroes/${hero.id}.webp`} alt={hero.name} loading="lazy" onError={handleError} />
      </div>
      <div className="tile-name">{hero.name}</div>
      <div className="tile-shine" />
    </button>
  );
}

const heroInitials = (name) =>
  name.replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

// Lord (deluxe) avatar. Not every hero has one yet (The Hood), so fall back to a
// placeholder plate rather than substituting a differently-framed hero portrait.
function LordAvatar({ hero }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span className="avatar-missing" title={`${hero.name} — no deluxe avatar yet`}>
        <span className="am-initials">{heroInitials(hero.name)}</span>
      </span>
    );
  }

  return (
    <img
      src={`/avatars/${hero.id}.webp`}
      alt={hero.name}
      loading="lazy"
      onError={(e) => { if (!retryImageOnce(e.target)) setMissing(true); }}
    />
  );
}

function RosterMember({ hero, playerIdx, noTeamUp, receives }) {
  const title = receives
    ? `${hero.name} — gets an enhanced team-up`
    : (noTeamUp ? `${hero.name} — not in any team-up` : `${hero.name} — enables a team-up`);
  return (
    <div className={`roster-member ${noTeamUp ? 'no-teamup' : ''} ${receives ? 'receives' : ''}`}>
      <div className="player-label"><span>P{playerIdx + 1}</span></div>
      <div className="avatar-plate" title={title}>
        <LordAvatar hero={hero} />
        {receives && <span className="buff-flag"><Sparkles size={11} /></span>}
      </div>
      <span className="roster-name" title={hero.name}>{hero.name}</span>
    </div>
  );
}

// Who is involved: player number + avatar + hero name
function HeroChip({ hero, player, kind }) {
  return (
    <div className={`hero-chip ${kind}`}>
      <div className="chip-avatar">
        <LordAvatar hero={hero} />
      </div>
      <span className={`pbadge ${kind === 'recipient' ? 'gold' : ''}`}><span>P{player}</span></span>
      <span className="chip-name">{hero.name}</span>
    </div>
  );
}

// Team-ups grouped by the hero who RECEIVES the enhanced ability. A hero can only
// benefit from one at a time, so several providers under one recipient are
// mutually exclusive choices.
function SynergyBreakdown({ rec }) {
  const playerOf = new Map();
  rec.team.forEach((h, i) => playerOf.set(h.id, i + 1));

  const hasOptimal = !!(rec.optimal && rec.optimal.combo);
  const activeIds = new Set(hasOptimal ? rec.optimal.combo.map(tu => tu.id) : []);

  const order = [];
  const byRecipient = new Map();
  for (const raw of rec.synergies) {
    const tu = resolveTeamUp(raw);
    const rid = tu.recipient;
    if (!rid) continue;
    if (!byRecipient.has(rid)) { byRecipient.set(rid, []); order.push(rid); }
    byRecipient.get(rid).push(tu);
  }

  return (
    <div className="synergy-breakdown">
      {order.map(recipientId => {
        const options = byRecipient.get(recipientId);
        const recipientHero = heroById.get(recipientId);
        if (!recipientHero) return null;
        const sorted = [...options].sort(
          (a, b) => (activeIds.has(b.id) ? 1 : 0) - (activeIds.has(a.id) ? 1 : 0)
        );

        return (
          <div className="tu-group" key={recipientId}>
            <div className="tu-group-head">
              <HeroChip hero={recipientHero} player={playerOf.get(recipientId)} kind="recipient" />
              <span className="tu-role-note">
                {options.length > 1
                  ? `Gets an enhanced team-up from 1 of these ${options.length}`
                  : 'Gets an enhanced team-up from'}
              </span>
            </div>

            <div className="tu-options">
              {sorted.map(tu => {
                const isActive = !hasOptimal || activeIds.has(tu.id);
                const provider = heroById.get(tu.provider);
                return (
                  <div className={`tu-option ${isActive ? 'active' : 'alt'}`} key={tu.id}>
                    <div className="tu-flow">
                      <ArrowRight size={15} className="tu-arrow" />
                      <span className="tu-from">from</span>
                      {provider && (
                        <HeroChip hero={provider} player={playerOf.get(provider.id)} kind="provider" />
                      )}
                      {hasOptimal && (
                        <span className="tu-status"><span>{isActive ? 'Active' : 'Alt'}</span></span>
                      )}
                    </div>
                    <div className="tu-name">{tu.name}</div>
                    <div className="tu-desc">{tu.description}</div>
                    {tu.enhanced && (
                      <div className="tu-desc tu-enhanced">
                        <span className="tu-enh-label">Enhanced</span> {tu.enhanced}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TeamCard({ rec, index, title, gold, saved, onShare, onToggleSave }) {
  const playerOf = new Map();
  rec.team.forEach((h, i) => playerOf.set(h.id, i + 1));
  const unbuffed = (rec.optimal && rec.optimal.unbuffed) || [];
  const unbuffedSet = new Set(unbuffed);
  const optionCount = rec.synergies ? rec.synergies.length : 0;
  const receivingIds = new Set(
    ((rec.optimal && rec.optimal.combo) || []).map(tu => resolveTeamUp(tu).recipient).filter(Boolean)
  );

  return (
    <div className="team-card" style={{ '--i': Math.min(index, 6) }}>
      <div className="team-header">
        <div className={`rank-plate ${gold ? 'gold' : ''}`}><span>{title}</span></div>
        <div className="team-header-actions">
          <div className="synergy-score">
            <Sparkles size={18} />
            {rec.maxValid} Active Team-Ups {rec.synergies.length > rec.maxValid && <span className="score-sub">({rec.synergies.length} Options)</span>}
          </div>
          <button className="icon-btn" onClick={onShare} title="Copy Share Code">
            <Share2 size={20} />
          </button>
          <button className={`icon-btn ${saved ? 'gold' : ''}`} onClick={onToggleSave} title={saved ? "Unsave Team" : "Save Team"}>
            {saved ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
          </button>
        </div>
      </div>

      <div className="team-roster">
        {rec.team.map((hero, playerIdx) => (
          <RosterMember
            key={hero.id}
            hero={hero}
            playerIdx={playerIdx}
            noTeamUp={unbuffedSet.has(hero.id)}
            receives={receivingIds.has(hero.id)}
          />
        ))}
      </div>

      {optionCount > 0 && (
        <div className="team-ups-list">
          <h4>
            Team-Ups
            <span className="tu-legend">{rec.maxValid} active{optionCount > rec.maxValid ? ` · ${optionCount} options` : ''}</span>
          </h4>
          <SynergyBreakdown rec={rec} />
        </div>
      )}

      {unbuffed.length > 0 && (
        <div className="unbuffed-warning">
          <span className="unbuffed-label">No team-up</span>
          {unbuffed.map(id => {
            const h = heroById.get(id);
            if (!h) return null;
            return (
              <span key={id} className="unbuffed-hero">
                <span className="pbadge"><span>P{playerOf.get(id)}</span></span> {h.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function App() {
  const [playerPools, setPlayerPools] = useState(() => {
    const saved = localStorage.getItem('marvelRivalsPlayerPools');
    return saved ? JSON.parse(saved) : [[], [], [], [], [], []];
  });
  const [activePlayerTab, setActivePlayerTab] = useState(0);
  const [formation, setFormation] = useState(() => {
    const saved = localStorage.getItem('marvelRivalsFormation');
    return saved ? JSON.parse(saved) : { v: 2, d: 2, s: 2 };
  });
  const [savedLoadouts, setSavedLoadouts] = useState(() => {
    const saved = localStorage.getItem('marvelRivalsSavedLoadouts');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedTeams, setSavedTeams] = useState(() => {
    const saved = localStorage.getItem('marvelRivalsSavedTeams');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewMode, setViewMode] = useState('GENERATOR'); // 'GENERATOR' or 'SAVED_TEAMS'

  useEffect(() => {
    localStorage.setItem('marvelRivalsPlayerPools', JSON.stringify(playerPools));
  }, [playerPools]);

  useEffect(() => {
    localStorage.setItem('marvelRivalsFormation', JSON.stringify(formation));
  }, [formation]);
  useEffect(() => {
    localStorage.setItem('marvelRivalsSavedLoadouts', JSON.stringify(savedLoadouts));
  }, [savedLoadouts]);
  useEffect(() => {
    localStorage.setItem('marvelRivalsSavedTeams', JSON.stringify(savedTeams));
  }, [savedTeams]);
  const TEAMS_PER_PAGE = 6;
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeQuery, setActiveQuery] = useState(() => {
    const saved = localStorage.getItem('marvelRivalsActiveQuery');
    return saved ? JSON.parse(saved) : null;
  });
  const [loadoutsOpen, setLoadoutsOpen] = useState(false);
  const [heroSearch, setHeroSearch] = useState('');
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [modalValue, setModalValue] = useState('');

  useEffect(() => {
    if (activeQuery) localStorage.setItem('marvelRivalsActiveQuery', JSON.stringify(activeQuery));
  }, [activeQuery]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => { if (e.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal]);

  const showToast = (msg, type = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2600);
  };

  const openModal = (cfg) => { setModalValue(''); setModal(cfg); };

  const copyToClipboard = (text, okMsg) => {
    try {
      navigator.clipboard.writeText(text).then(
        () => showToast(okMsg),
        () => showToast('Could not access clipboard', 'err')
      );
    } catch {
      showToast('Could not access clipboard', 'err');
    }
  };

  const confirmModal = () => {
    if (!modal) return;
    const value = modalValue.trim();
    if (modal.input && !value) return;
    setModal(null);
    modal.onConfirm(value);
  };

  const toggleHeroInPool = (heroId) => {
    setPlayerPools(prev => {
      let newPools = [...prev];
      let currentPool = [...newPools[activePlayerTab]];
      if (currentPool.includes(heroId)) {
        currentPool = currentPool.filter(id => id !== heroId);
      } else {
        currentPool.push(heroId);
      }
      newPools[activePlayerTab] = currentPool;
      return newPools;
    });
  };

  const handleSaveLoadout = () => {
    openModal({
      title: 'Save Loadout',
      message: 'Name this squad configuration.',
      input: true,
      placeholder: 'Loadout name...',
      confirmLabel: 'Save',
      onConfirm: (name) => {
        setSavedLoadouts(prev => [...prev, {
          id: Date.now(),
          name,
          playerPools,
          formation
        }]);
        showToast(`Loadout "${name}" saved`);
      }
    });
  };

  const handleLoadLoadout = (loadout) => {
    openModal({
      title: 'Load Loadout',
      message: `Load "${loadout.name}"? This will overwrite your current unsaved configuration.`,
      confirmLabel: 'Load',
      onConfirm: () => {
        setPlayerPools(loadout.playerPools);
        setFormation(loadout.formation);
        showToast(`Loadout "${loadout.name}" loaded`);
      }
    });
  };

  const handleDeleteLoadout = (id) => {
    openModal({
      title: 'Delete Loadout',
      message: 'Are you sure you want to delete this loadout?',
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => {
        setSavedLoadouts(prev => prev.filter(l => l.id !== id));
        showToast('Loadout deleted');
      }
    });
  };

  const handleResetCurrent = () => {
    openModal({
      title: 'Reset Configuration',
      message: 'Reset your formation and all player pools?',
      confirmLabel: 'Reset',
      danger: true,
      onConfirm: () => {
        setPlayerPools([[], [], [], [], [], []]);
        setFormation({ v: 2, d: 2, s: 2 });
        showToast('Configuration reset');
      }
    });
  };

  const handleExportLoadout = (loadout) => {
    const { v, d, s } = loadout.formation;
    const formStr = `${v},${d},${s}`;
    const poolsStr = loadout.playerPools.map(pool => pool.map(id => heroToCode[id]).filter(Boolean).join(',')).join(';');
    const code = `LOADOUT-${formStr};${poolsStr}`;
    copyToClipboard(code, 'Loadout code copied to clipboard');
  };

  const handleImportLoadout = () => {
    openModal({
      title: 'Import Loadout',
      message: 'Paste a loadout share code.',
      input: true,
      placeholder: 'LOADOUT-...',
      confirmLabel: 'Import',
      onConfirm: (codeStr) => {
        try {
          const code = codeStr.replace('LOADOUT-', '');
          const parts = code.split(';');
          if (parts.length !== 7) throw new Error();

          const formParts = parts[0].split(',').map(n => parseInt(n, 10));
          if (formParts.length !== 3 || formParts.some(isNaN)) throw new Error();
          const formation = { v: formParts[0], d: formParts[1], s: formParts[2] };

          const playerPools = parts.slice(1).map(poolStr => {
            if (!poolStr) return [];
            return poolStr.split(',').map(c => codeToHero[c]).filter(Boolean);
          });

          setPlayerPools(playerPools);
          setFormation(formation);
          showToast('Loadout imported successfully');
        } catch (e) {
          showToast('Invalid loadout code', 'err');
        }
      }
    });
  };

  const getTeamId = (team) => team.map(h => h.id).sort().join('-');

  const toggleSaveTeam = (teamData) => {
    const id = getTeamId(teamData.team);
    setSavedTeams(prev => {
      if (prev.some(t => getTeamId(t.team) === id)) {
        return prev.filter(t => getTeamId(t.team) !== id);
      }
      return [...prev, teamData];
    });
  };

  const isTeamSaved = (team) => savedTeams.some(t => getTeamId(t.team) === getTeamId(team));

  const handleExportTeam = (rec) => {
    const codeStr = rec.team.map(h => heroToCode[h.id]).filter(Boolean).join(',');
    copyToClipboard(`TEAM-${codeStr}`, 'Team code copied to clipboard');
  };

  const handleImportTeam = () => {
    openModal({
      title: 'Import Team',
      message: 'Paste a team share code.',
      input: true,
      placeholder: 'TEAM-...',
      confirmLabel: 'Import',
      onConfirm: (codeStr) => {
        try {
          const code = codeStr.replace('TEAM-', '');
          const heroCodes = code.split(',');
          if (heroCodes.length !== 6) throw new Error();

          const heroIds = heroCodes.map(c => codeToHero[c]).filter(Boolean);
          if (heroIds.length !== 6) throw new Error();

          const importedTeamArr = heroIds.map(id => heroes.find(h => h.id === id)).filter(Boolean);
          if (importedTeamArr.length !== 6) throw new Error();

          let activeTUs = [];
          for(let i=0; i<teamUps.length; i++) {
            let tu = teamUps[i];
            let hasAll = true;
            for(let j=0; j<tu.heroes.length; j++) {
                let hId = tu.heroes[j];
                if (!heroIds.includes(hId)) { hasAll=false; break; }
            }
            if(hasAll) activeTUs.push(tu);
          }

          let optimal = getOptimalTeamUpCombo(activeTUs, heroIds);
          let maxValid = optimal.maxCount;
          let score = (optimal.maxHeroes * 10000) + (maxValid * 100) + activeTUs.length;

          const teamData = { team: importedTeamArr, score, maxValid, optimal, synergies: activeTUs };

          const id = getTeamId(teamData.team);
          setSavedTeams(prev => {
            if (!prev.some(t => getTeamId(t.team) === id)) {
              return [...prev, teamData];
            }
            return prev;
          });
          setViewMode('SAVED_TEAMS');
          showToast('Team imported and saved');
        } catch (e) {
          showToast('Invalid team code', 'err');
        }
      }
    });
  };

  const clearActivePool = () => {
    setPlayerPools(prev => prev.map((p, i) => i === activePlayerTab ? [] : p));
  };

  const handleFormationChange = (roleKey, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > 6) num = 6;
    setFormation(prev => ({ ...prev, [roleKey]: num }));
  };

  const totalFormationCount = formation.v + formation.d + formation.s;

  const recommendedTeams = useMemo(() => {
    if (!activeQuery) return null;
    const { formation: queryFormation, playerPools: queryPools, totalFormationCount: queryTotal } = activeQuery;

    if (queryTotal !== 6) return [];

    // Separate heroes by role
    const vPool = heroes.filter(h => h.role === roles.VANGUARD);
    const dPool = heroes.filter(h => h.role === roles.DUELIST);
    const sPool = heroes.filter(h => h.role === roles.STRATEGIST);

    // Pre-calculate combinations for each role pool, with hero indices for pair lookups
    const mapCombos = (cs) => cs.map(c => ({ heroes: c, idx: c.map(h => heroIdxById.get(h.id)) }));
    const vCombos = mapCombos(getCombinations(vPool, queryFormation.v));
    const dCombos = mapCombos(getCombinations(dPool, queryFormation.d));
    const sCombos = mapCombos(getCombinations(sPool, queryFormation.s));

    const poolSets = queryPools.map(p => new Set(p));
    const anyPools = poolSets.some(ps => ps.size > 0);

    // Keep a ranked buffer larger than 50 so the diversity pass has room to pick from
    const BUFFER = 400;
    const top = [];
    let minScore = -1;
    const ti = new Array(6);

    for (const v of vCombos) for (const d of dCombos) for (const s of sCombos) {
      // 1. Cheap necessary pool check: every non-empty pool must contain someone on this team
      if (anyPools) {
        let allOk = true;
        for (let p = 0; p < 6 && allOk; p++) {
          const ps = poolSets[p];
          if (ps.size === 0) continue;
          let found = false;
          for (let x = 0; x < v.heroes.length && !found; x++) if (ps.has(v.heroes[x].id)) found = true;
          for (let x = 0; x < d.heroes.length && !found; x++) if (ps.has(d.heroes[x].id)) found = true;
          for (let x = 0; x < s.heroes.length && !found; x++) if (ps.has(s.heroes[x].id)) found = true;
          if (!found) allOk = false;
        }
        if (!allOk) continue;
      }

      // 2. Gather active team-ups via the 15 hero pairs
      let n = 0;
      for (const x of v.idx) ti[n++] = x;
      for (const x of d.idx) ti[n++] = x;
      for (const x of s.idx) ti[n++] = x;

      let activeTUs = null;
      for (let i = 0; i < 5; i++) {
        const a = ti[i];
        for (let j = i + 1; j < 6; j++) {
          const b = ti[j];
          const k = a < b ? a * HERO_COUNT + b : b * HERO_COUNT + a;
          if (pairHasTU[k]) {
            if (!activeTUs) activeTUs = [];
            const hit = pairTUList[k];
            for (let x = 0; x < hit.length; x++) activeTUs.push(hit[x]);
          }
        }
      }
      const tuCount = activeTUs ? activeTUs.length : 0;

      // 3. Upper-bound prune: skip teams that cannot beat the current cutoff
      const upper = Math.min(6, 2 * tuCount) * 10000 + tuCount * 100 + tuCount;
      if (top.length === BUFFER && upper <= minScore) continue;

      const teamArr = [...v.heroes, ...d.heroes, ...s.heroes];
      const optimal = getOptimalTeamUpCombo(activeTUs || [], teamArr.map(h => h.id));
      const score = (optimal.maxHeroes * 10000) + (optimal.maxCount * 100) + tuCount;
      if (top.length === BUFFER && score <= minScore) continue;

      // 4. Full player-pool matching, only for teams that make the cut
      let assignment = teamArr;
      if (anyPools) {
        assignment = getValidPlayerAssignment(teamArr, queryPools);
        if (!assignment) continue;
      }

      // 5. Insert into the sorted buffer
      const entry = { team: assignment, score, maxValid: optimal.maxCount, optimal, synergies: activeTUs || [] };
      let lo = 0, hi = top.length;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (top[mid].score >= score) lo = mid + 1; else hi = mid; }
      top.splice(lo, 0, entry);
      if (top.length > BUFFER) top.pop();
      if (top.length === BUFFER) minScore = top[BUFFER - 1].score;
    }

    // 6. Diversity pass: at most 3 teams sharing the same 5-hero core
    const picked = [];
    for (const t of top) {
      const idList = t.team.map(h => h.id);
      let similar = 0;
      for (const p of picked) {
        let shared = 0;
        for (const id of idList) if (p.idSet.has(id)) shared++;
        if (shared >= 5) { similar++; if (similar >= 3) break; }
      }
      if (similar >= 3) continue;
      picked.push({ entry: t, idSet: new Set(idList) });
      if (picked.length === 50) break;
    }

    return picked.map(p => p.entry);
  }, [activeQuery]);

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-logo">Team-Up&nbsp;<span className="accent">Builder</span></div>
        <nav className="topbar-tabs">
          <button
            className={`nav-tab ${viewMode === 'GENERATOR' ? 'active' : ''}`}
            onClick={() => setViewMode('GENERATOR')}
          >
            Team Builder
          </button>
          <button
            className={`nav-tab ${viewMode === 'SAVED_TEAMS' ? 'active' : ''}`}
            onClick={() => setViewMode('SAVED_TEAMS')}
          >
            Saved Teams<span className="tab-count">{savedTeams.length}</span>
          </button>
        </nav>
        <div className="topbar-right">
          <div className="topbar-credits">Made by TruishRocks, Girf,<br />voidmonster3 &amp; Earlyhydra</div>
          <div className="season-tag"><span>Season 9</span></div>
        </div>
      </div>

      <div className="stage">
        <section className="select-zone">
          <div className="zone-head">
            <Users size={18} />
            <span className="zone-title">Assemble Your Squad</span>
            <span className="results-count"><span>{heroes.length} Heroes</span></span>
          </div>

          <div className="squad-strip">
            {[0, 1, 2, 3, 4, 5].map(idx => (
              <button
                key={idx}
                onClick={() => setActivePlayerTab(idx)}
                className={`squad-slot ${activePlayerTab === idx ? 'active' : ''}`}
              >
                <span>P{idx + 1}</span>
                <span className="pool-count">{playerPools[idx].length > 0 ? playerPools[idx].length : 'ANY'}</span>
              </button>
            ))}
          </div>
          <p className="pool-hint">
            Pick heroes for <strong>Player {activePlayerTab + 1}'s</strong> pool — an empty pool means that player can flex to anyone.
          </p>

          {playerPools[activePlayerTab].length > 0 && (
            <div className="pool-chips">
              {playerPools[activePlayerTab].map(id => {
                const chipHero = heroes.find(h => h.id === id);
                if (!chipHero) return null;
                return (
                  <button key={id} className="pool-chip" onClick={() => toggleHeroInPool(id)} title={`Remove ${chipHero.name}`}>
                    <span>{chipHero.name}</span>
                    <X size={11} />
                  </button>
                );
              })}
              <button className="pool-chip clear" onClick={clearActivePool}>
                <span>Clear All</span>
                <Trash2 size={11} />
              </button>
            </div>
          )}

          <div className="formation-strip">
            {[
              { key: 'v', role: roles.VANGUARD, cls: 'role-box-vanguard', label: 'Vanguard' },
              { key: 'd', role: roles.DUELIST, cls: 'role-box-duelist', label: 'Duelist' },
              { key: 's', role: roles.STRATEGIST, cls: 'role-box-strategist', label: 'Strategist' },
            ].map(({ key, role, cls, label }) => (
              <div key={key} className={`form-group ${cls}`}>
                <span className="role-tag"><RoleIcon role={role} size={14} /> {label}</span>
                <span className="stepper">
                  <button
                    className="stepper-btn"
                    onClick={() => handleFormationChange(key, String(formation[key] - 1))}
                    aria-label={`Fewer ${label}s`}
                  ><Minus size={12} /></button>
                  <span className="stepper-value">{formation[key]}</span>
                  <button
                    className="stepper-btn"
                    onClick={() => handleFormationChange(key, String(formation[key] + 1))}
                    aria-label={`More ${label}s`}
                  ><Plus size={12} /></button>
                </span>
              </div>
            ))}
            <div className={`formation-total ${totalFormationCount === 6 ? 'ok' : 'bad'}`}>
              <span className="total-num">{totalFormationCount}/6</span>
              <span className="total-label">{totalFormationCount === 6 ? 'Ready' : 'Adjust'}</span>
            </div>
          </div>

          <div className="search-bar">
            <Search size={15} />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search heroes..."
              aria-label="Search heroes"
            />
            {heroSearch && (
              <button className="search-clear" onClick={() => setHeroSearch('')} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="gallery">
            {(() => {
              const q = heroSearch.trim().toLowerCase();
              const sections = ROLE_SECTIONS.map(section => ({
                ...section,
                heroes: q ? section.heroes.filter(h => h.name.toLowerCase().includes(q)) : section.heroes,
              })).filter(section => section.heroes.length > 0);

              if (sections.length === 0) {
                return <div className="gallery-empty">No heroes match "{heroSearch}".</div>;
              }

              return sections.map(section => (
                <div key={section.role} className={`role-section-${section.cls}`}>
                  <div className="role-header">
                    <RoleIcon role={section.role} size={18} />
                    <span className="role-name">{section.role}</span>
                    <span className="role-count">{section.heroes.length}</span>
                    <div className="role-line" />
                  </div>
                  <div className="hero-grid">
                    {section.heroes.map((hero, i) => (
                      <HeroTile
                        key={hero.id}
                        hero={hero}
                        index={i}
                        picked={playerPools[activePlayerTab].includes(hero.id)}
                        onClick={() => toggleHeroInPool(hero.id)}
                      />
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </section>

        <div className="stage-divider" />

        <section className="results-zone">
          <div className="zone-head">
            <Sparkles size={18} />
            <span className="zone-title">{viewMode === 'SAVED_TEAMS' ? 'Saved Synergistic Teams' : 'Top Synergistic Teams'}</span>
            <span className="results-count">
              <span>
                {viewMode === 'SAVED_TEAMS'
                  ? `${savedTeams.length} saved teams`
                  : (activeQuery === null ? "Ready to Build" : `Showing top ${recommendedTeams.length} results`)
                }
              </span>
            </span>
            <button className="btn btn-sm" style={{marginLeft: '0.6rem'}} onClick={handleImportTeam}>
              <span className="btn-inner"><DownloadCloud size={13} /> Import Team</span>
            </button>
          </div>

          <div className="results-scroll">
            {viewMode === 'SAVED_TEAMS' ? (
              savedTeams.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-title">No Saved Teams</div>
                  <p className="empty-sub">Click the bookmark icon on any generated team to save it here!</p>
                </div>
              ) : (
                savedTeams.map((rec, idx) => (
                  <TeamCard
                    key={idx}
                    rec={rec}
                    index={idx}
                    title={`Saved Team #${idx + 1}`}
                    saved={isTeamSaved(rec.team)}
                    onShare={() => handleExportTeam(rec)}
                    onToggleSave={() => toggleSaveTeam(rec)}
                  />
                ))
              )
            ) : activeQuery === null ? (
              <div className="empty-state">
                <div className="empty-title">Ready to Build</div>
                <p className="empty-sub">Configure your team and click Generate Teams.</p>
              </div>
            ) : activeQuery.totalFormationCount !== 6 ? (
              <div className="empty-state">
                <div className="empty-title">Invalid Formation</div>
                <p className="empty-sub">Your role counts must exactly equal 6 heroes.</p>
              </div>
            ) : recommendedTeams.length === 0 ? (
              <div className="empty-state">
                <div className="empty-title">No Valid Combinations</div>
                <p className="empty-sub">Try adjusting your formation or assigning more flexible heroes to the player pools.</p>
              </div>
            ) : (
              <>
                {recommendedTeams.slice(0, visibleCount).map((rec, idx) => (
                  <TeamCard
                    key={idx}
                    rec={rec}
                    index={idx < 3 ? idx : idx % TEAMS_PER_PAGE}
                    title={`Rank #${idx + 1}`}
                    gold={idx === 0}
                    saved={isTeamSaved(rec.team)}
                    onShare={() => handleExportTeam(rec)}
                    onToggleSave={() => toggleSaveTeam(rec)}
                  />
                ))}

                {visibleCount < recommendedTeams.length && (
                  <button
                    className="btn show-more"
                    onClick={() => setVisibleCount(c => Math.min(c + TEAMS_PER_PAGE, recommendedTeams.length))}
                  >
                    <span className="btn-inner">
                      <ChevronDown size={20} />
                      Show More
                      <span className="show-more-count">{visibleCount} / {recommendedTeams.length}</span>
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <div className="dock">
        <button className="btn" onClick={handleSaveLoadout}>
          <span className="btn-inner"><Save size={14} /> Save Loadout</span>
        </button>
        <button className="btn" onClick={handleImportLoadout}>
          <span className="btn-inner"><DownloadCloud size={14} /> Import Code</span>
        </button>
        <div className="loadouts-anchor">
          <button className="btn" onClick={() => setLoadoutsOpen(o => !o)}>
            <span className="btn-inner"><FolderOpen size={14} /> Loadouts ({savedLoadouts.length})</span>
          </button>
          {loadoutsOpen && (
            <button className="loadouts-backdrop" aria-label="Close loadouts" onClick={() => setLoadoutsOpen(false)} />
          )}
          {loadoutsOpen && (
            <div className="loadouts-pop">
              <div className="pop-title">Saved Loadouts</div>
              {savedLoadouts.length === 0 ? (
                <div className="pop-empty">No loadouts saved yet — configure your squad and hit Save Loadout.</div>
              ) : (
                <div className="rows">
                  {savedLoadouts.map(loadout => (
                    <div key={loadout.id} className="row">
                      <button className="btn btn-sm" onClick={() => { handleLoadLoadout(loadout); setLoadoutsOpen(false); }}>
                        <span className="btn-inner"><Download size={12} /> {loadout.name}</span>
                      </button>
                      <button className="btn btn-sm" onClick={() => handleExportLoadout(loadout)} title="Copy Share Code">
                        <span className="btn-inner"><Share2 size={12} /></span>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteLoadout(loadout.id)}>
                        <span className="btn-inner"><Trash2 size={12} /></span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <button className="btn btn-danger" onClick={handleResetCurrent}>
          <span className="btn-inner"><RotateCcw size={14} /> Reset</span>
        </button>
        <div className="dock-spacer" />
        <button
          className="btn btn-primary btn-lg"
          disabled={totalFormationCount !== 6}
          title={totalFormationCount !== 6 ? `Formation must total 6 heroes (currently ${totalFormationCount})` : undefined}
          onClick={() => { setVisibleCount(3); setViewMode('GENERATOR'); setActiveQuery({ playerPools, formation, totalFormationCount }); }}
        >
          <span className="btn-inner">Generate Teams <ChevronsRight size={22} /></span>
        </button>
      </div>

      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{modal.title}</div>
            {modal.message && <p className="modal-message">{modal.message}</p>}
            {modal.input && (
              <input
                className="modal-input"
                autoFocus
                value={modalValue}
                placeholder={modal.placeholder || ''}
                onChange={(e) => setModalValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') confirmModal(); }}
              />
            )}
            <div className="modal-actions">
              <button className="btn" onClick={() => setModal(null)}>
                <span className="btn-inner">Cancel</span>
              </button>
              <button className={`btn ${modal.danger ? 'btn-danger' : 'btn-primary'}`} onClick={confirmModal}>
                <span className="btn-inner">{modal.confirmLabel || 'Confirm'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
