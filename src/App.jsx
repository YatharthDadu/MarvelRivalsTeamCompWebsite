import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Shield, Swords, Heart, Filter, LayoutTemplate, Save, Download, Trash2, RotateCcw, Bookmark, BookmarkCheck, Share2, DownloadCloud } from 'lucide-react';
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

// Helper to get role icon
const getRoleClass = (role) => {
  if (role === roles.VANGUARD) return 'role-vanguard';
  if (role === roles.DUELIST) return 'role-duelist';
  if (role === roles.STRATEGIST) return 'role-strategist';
  return '';
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
    
    // Option 2: include if no overlap
    let tu = activeTUs[index];
    let canInclude = true;
    for (let selected of currentSelection) {
      if (selected.heroes[0] === tu.heroes[0]) {
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
  const [showMore, setShowMore] = useState(false);
  const [activeQuery, setActiveQuery] = useState(null);

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
    const name = prompt("Enter a name for this loadout:");
    if (name) {
      setSavedLoadouts(prev => [...prev, {
        id: Date.now(),
        name,
        playerPools,
        formation
      }]);
    }
  };

  const handleLoadLoadout = (loadout) => {
    if (window.confirm(`Load "${loadout.name}"? This will overwrite your current unsaved configuration.`)) {
      setPlayerPools(loadout.playerPools);
      setFormation(loadout.formation);
    }
  };

  const handleDeleteLoadout = (id) => {
    if (window.confirm("Are you sure you want to delete this loadout?")) {
      setSavedLoadouts(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleResetCurrent = () => {
    if (window.confirm("Are you sure you want to reset your current configuration?")) {
      setPlayerPools([[], [], [], [], [], []]);
      setFormation({ v: 2, d: 2, s: 2 });
    }
  };

  const handleExportLoadout = (loadout) => {
    const { v, d, s } = loadout.formation;
    const formStr = `${v},${d},${s}`;
    const poolsStr = loadout.playerPools.map(pool => pool.map(id => heroToCode[id]).filter(Boolean).join(',')).join(';');
    const code = `LOADOUT-${formStr};${poolsStr}`;
    navigator.clipboard.writeText(code);
    alert("Loadout code copied to clipboard!");
  };

  const handleImportLoadout = () => {
    const codeStr = prompt("Paste your Loadout code here:");
    if (!codeStr) return;
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
      alert("Loadout imported successfully!");
    } catch (e) {
      alert("Invalid loadout code format!");
    }
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
    navigator.clipboard.writeText(`TEAM-${codeStr}`);
    alert("Team code copied to clipboard!");
  };

  const handleImportTeam = () => {
    const codeStr = prompt("Paste your Team code here:");
    if (!codeStr) return;
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
      alert("Team imported and saved successfully!");
      
    } catch (e) {
      alert("Invalid team code format!");
    }
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

    let validTeams = [];

    // Separate heroes by role
    const vPool = heroes.filter(h => h.role === roles.VANGUARD);
    const dPool = heroes.filter(h => h.role === roles.DUELIST);
    const sPool = heroes.filter(h => h.role === roles.STRATEGIST);

    // Pre-calculate combinations for each role pool
    const vCombos = getCombinations(vPool, queryFormation.v);
    const dCombos = getCombinations(dPool, queryFormation.d);
    const sCombos = getCombinations(sPool, queryFormation.s);

    for (let v of vCombos) {
      for (let d of dCombos) {
        for (let s of sCombos) {
          // 1. Must satisfy Player Pools
          let teamArr = [...v, ...d, ...s];
          let assignment = getValidPlayerAssignment(teamArr, queryPools);
          if (!assignment) continue;

          // 2. Calculate synergies inline
          let activeTUs = [];
          for(let i=0; i<teamUps.length; i++) {
            let tu = teamUps[i];
            let hasAll = true;
            for(let j=0; j<tu.heroes.length; j++) {
               let hId = tu.heroes[j];
               let found = false;
               for(let x=0; x<v.length; x++) if(v[x].id===hId) found=true;
               if(!found) for(let x=0; x<d.length; x++) if(d[x].id===hId) found=true;
               if(!found) for(let x=0; x<s.length; x++) if(s[x].id===hId) found=true;
               if(!found) { hasAll=false; break; }
            }
            if(hasAll) { activeTUs.push(tu); }
          }
          
          let optimal = getOptimalTeamUpCombo(activeTUs, teamArr.map(h => h.id));
          let maxValid = optimal.maxCount;
          let score = (optimal.maxHeroes * 10000) + (maxValid * 100) + activeTUs.length;

          // 3. Add to validTeams
          validTeams.push({ team: assignment, score, maxValid, optimal, synergies: activeTUs });
        }
      }
    }

    validTeams.sort((a, b) => b.score - a.score);
    return validTeams.slice(0, 50);
  }, [activeQuery]);

  return (
    <div className="app-container">
      <header>
        <h1>Team-Up Builder</h1>
        <p className="subtitle">Discover Optimal 6-Hero Synergies for Marvel Rivals Season 9</p>
      </header>

      <main className="main-content">
        <aside className="panel">
          <div className="panel-title">
            <LayoutTemplate size={20} />
            <span>Team Configuration</span>
          </div>

          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
            <button onClick={handleSaveLoadout} style={{flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem'}}>
              <Save size={14} /> Save Loadout
            </button>
            <button onClick={handleResetCurrent} style={{flex: 1, padding: '0.5rem', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem'}}>
              <RotateCcw size={14} /> Reset Current
            </button>
          </div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
            <button onClick={handleImportLoadout} style={{flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem'}}>
              <DownloadCloud size={14} /> Import Code
            </button>
          </div>

          {savedLoadouts.length > 0 && (
            <div className="saved-loadouts" style={{marginBottom: '1.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px'}}>
              <div style={{fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase'}}>Saved Loadouts</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                {savedLoadouts.map(loadout => (
                  <div key={loadout.id} style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                    <button onClick={() => handleLoadLoadout(loadout)} style={{flex: 1, padding: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                      <Download size={12} /> {loadout.name}
                    </button>
                    <button onClick={() => handleExportLoadout(loadout)} style={{padding: '0.4rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}} title="Copy Share Code">
                      <Share2 size={12} />
                    </button>
                    <button onClick={() => handleDeleteLoadout(loadout.id)} style={{padding: '0.4rem', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="filter-section">
            <label className="filter-label" style={{marginBottom: '1rem'}}>
              Target Formation (Must equal 6)
            </label>
            
            <div className="formation-inputs">
              <div className="form-group role-box-vanguard">
                <label><Shield size={14} /> Vanguard</label>
                <input 
                  type="number" 
                  min="0" max="6" 
                  value={formation.v} 
                  onChange={(e) => handleFormationChange('v', e.target.value)} 
                />
              </div>
              
              <div className="form-group role-box-duelist">
                <label><Swords size={14} /> Duelist</label>
                <input 
                  type="number" 
                  min="0" max="6" 
                  value={formation.d} 
                  onChange={(e) => handleFormationChange('d', e.target.value)} 
                />
              </div>
              
              <div className="form-group role-box-strategist">
                <label><Heart size={14} /> Strategist</label>
                <input 
                  type="number" 
                  min="0" max="6" 
                  value={formation.s} 
                  onChange={(e) => handleFormationChange('s', e.target.value)} 
                />
              </div>
            </div>

            {totalFormationCount !== 6 && (
              <div className="formation-warning">
                Total heroes selected: <strong>{totalFormationCount}/6</strong>. Please adjust so it equals 6!
              </div>
            )}
          </div>

          <div className="filter-section" style={{marginTop: '2rem'}}>
            <div className="panel-title" style={{border: 'none', padding: 0}}>
              <Filter size={20} />
              <span>Player Hero Pools</span>
            </div>
            
            <div className="player-tabs" style={{display: 'flex', gap: '0.25rem', marginTop: '1rem'}}>
              {[0, 1, 2, 3, 4, 5].map(idx => (
                <button
                  key={idx}
                  onClick={() => setActivePlayerTab(idx)}
                  className={`player-tab ${activePlayerTab === idx ? 'active' : ''}`}
                  style={{
                    flex: 1, padding: '0.5rem 0', background: activePlayerTab === idx ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${activePlayerTab === idx ? 'var(--color-primary)' : 'var(--color-border)'}`, color: activePlayerTab === idx ? '#000' : 'rgba(255,255,255,0.6)', cursor: 'pointer',
                    fontWeight: activePlayerTab === idx ? 'bold' : 'normal', borderRadius: '4px'
                  }}
                >
                  {idx === 0 ? "You" : `P${idx + 1}`}
                  {playerPools[idx].length > 0 && <span style={{fontSize: '0.7rem', display: 'block'}}>{playerPools[idx].length}</span>}
                </button>
              ))}
            </div>
            <p style={{fontSize: '0.8rem', opacity: 0.7, margin: '0.75rem 0', lineHeight: 1.4}}>
              Select heroes for <strong>{activePlayerTab === 0 ? "Your" : `Player ${activePlayerTab + 1}'s`}</strong> pool. If empty, the player can play anyone.
            </p>
            
            <div className="hero-grid">
              {(() => {
                const selectedHeroes = heroes.filter(h => playerPools[activePlayerTab].includes(h.id));
                const unselectedHeroes = heroes.filter(h => !playerPools[activePlayerTab].includes(h.id));
                return [...selectedHeroes, ...unselectedHeroes].map(hero => {
                  const isSelected = playerPools[activePlayerTab].includes(hero.id);
                  return (
                    <button 
                      key={hero.id}
                      className={`hero-btn ${isSelected ? 'main-selected' : ''}`}
                      onClick={() => toggleHeroInPool(hero.id)}
                    >
                      <div className="hero-icon-container">
                        <img src={`/heroes/${hero.id}.png`} alt={hero.name} className="hero-icon" onError={(e) => { e.target.style.display = 'none'; }} />
                        <div className={`role-indicator ${getRoleClass(hero.role)}`} title={hero.role}></div>
                      </div>
                      <span className="hero-name" title={hero.name}>{hero.name}</span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
          
          <button 
            className="generate-btn" 
            style={{marginTop: '2rem', width: '100%', fontSize: '1.2rem', padding: '1rem', background: 'var(--color-primary)', border: 'none', color: '#000', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold'}}
            onClick={() => { setShowMore(false); setViewMode('GENERATOR'); setActiveQuery({ playerPools, formation, totalFormationCount }); }}
          >
            Generate Teams
          </button>
          
          <button 
            onClick={() => setViewMode('SAVED_TEAMS')}
            style={{marginTop: '1rem', width: '100%', fontSize: '1rem', padding: '0.8rem', background: viewMode === 'SAVED_TEAMS' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)', border: `1px solid ${viewMode === 'SAVED_TEAMS' ? 'var(--color-primary)' : 'var(--color-border)'}`, color: viewMode === 'SAVED_TEAMS' ? '#000' : '#fff', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
          >
            <Bookmark size={16} /> View Saved Teams ({savedTeams.length})
          </button>
          
          <button 
            onClick={handleImportTeam}
            style={{marginTop: '1rem', width: '100%', fontSize: '0.9rem', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: `1px solid var(--color-border)`, color: '#fff', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
          >
            <DownloadCloud size={14} /> Import Team Code
          </button>
        </aside>

        <section className="panel">
          <div className="panel-title" style={{justifyContent: 'space-between'}}>
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
              <Sparkles size={20} />
              <span>{viewMode === 'SAVED_TEAMS' ? 'Saved Synergistic Teams' : 'Top Synergistic Teams'}</span>
            </div>
            <span className="results-count">
              {viewMode === 'SAVED_TEAMS' 
                ? `${savedTeams.length} saved teams`
                : (activeQuery === null ? "Ready to Build" : `Showing top ${recommendedTeams.length} results`)
              }
            </span>
          </div>
          
          <div className="team-results">
            {viewMode === 'SAVED_TEAMS' ? (
              savedTeams.length === 0 ? (
                <div className="empty-state">
                  <p>No saved teams yet.</p>
                  <p style={{fontSize:'0.85rem', marginTop: '0.5rem', opacity: 0.7}}>Click the bookmark icon on any generated team to save it here!</p>
                </div>
              ) : (
                savedTeams.map((rec, idx) => {
                  const saved = isTeamSaved(rec.team);
                  return (
                    <div key={idx} className="team-card">
                      <div className="team-header">
                        <h3>Saved Team #{idx + 1}</h3>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <div className="synergy-score">
                            <Sparkles size={16} />
                            {rec.maxValid} Active Team-Ups {rec.synergies.length > rec.maxValid && <span style={{fontSize:'1rem', opacity:0.8}}>({rec.synergies.length} Options)</span>}
                          </div>
                          <button 
                            onClick={() => handleExportTeam(rec)} 
                            style={{background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '0.2rem'}}
                            title="Copy Share Code"
                          >
                            <Share2 size={22} />
                          </button>
                          <button 
                            onClick={() => toggleSaveTeam(rec)} 
                            style={{background: 'none', border: 'none', color: saved ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0.2rem'}}
                            title={saved ? "Unsave Team" : "Save Team"}
                          >
                            {saved ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="team-roster">
                        {rec.team.map((hero, playerIdx) => {
                          const playerLabel = playerIdx === 0 ? "You" : `P${playerIdx + 1}`;
                          return (
                            <div key={hero.id} className="roster-member">
                              <div className="player-label" style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.25rem', textAlign: 'center', textTransform: 'uppercase'}}>{playerLabel}</div>
                              <div className="roster-icon-container">
                                <img src={`/heroes/${hero.id}.png`} alt={hero.name} className="roster-icon" onError={(e) => { e.target.style.display = 'none'; }} />
                                <div className={`role-indicator ${getRoleClass(hero.role)}`}></div>
                              </div>
                              <span>{hero.name}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {rec.optimal && rec.optimal.combo && rec.optimal.combo.length > 0 && (
                        <div className="team-ups-list">
                          <h4>Synergies</h4>
                          {rec.optimal.combo.map(tu => (
                            <div key={tu.id} className="team-up-item">
                              <div>
                                <div className="team-up-name">{tu.name} ({tu.heroes.map(h => heroes.find(hx=>hx.id===h).name).join(', ')})</div>
                                <div className="team-up-desc">{tu.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {rec.synergies && rec.synergies.length > 0 && (
                        <div className="team-ups-list">
                          <h4>All Synergy Options</h4>
                          {(() => {
                            const groupedSynergies = {};
                            rec.synergies.forEach(tu => {
                              const activator = tu.heroes[0];
                              if (!groupedSynergies[activator]) groupedSynergies[activator] = [];
                              groupedSynergies[activator].push(tu);
                            });
                            
                            return Object.values(groupedSynergies).map(group => {
                              const tuNames = group.map(tu => tu.name).join(' / ');
                              const activatorHero = heroes.find(h => h.id === group[0].heroes[0]);
                              const targets = group.map(tu => heroes.find(h => h.id === tu.heroes[1])?.name || '').filter(Boolean).join(' / ');
                              
                              return (
                                <div key={group[0].id} className="team-up-item">
                                  <div>
                                    <div className="team-up-name">{tuNames} ({activatorHero?.name}, {targets})</div>
                                    {group.map((tu) => (
                                      <div key={tu.id} className="team-up-desc">
                                        {group.length > 1 && <strong style={{color: 'var(--color-primary)'}}>{tu.name}: </strong>}
                                        {tu.description}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      )}
                      
                      {rec.optimal && rec.optimal.unbuffed && rec.optimal.unbuffed.length > 0 && (
                        <div className="unbuffed-warning" style={{color: '#ff4d4d', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold'}}>
                          These characters do not get their enhanced team up: {rec.optimal.unbuffed.map(id => heroes.find(h => h.id === id).name).join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })
              )
            ) : activeQuery === null ? (
              <div className="empty-state">
                <p>Ready to Build.</p>
                <p style={{fontSize:'0.85rem', marginTop: '0.5rem', opacity: 0.7}}>Configure your team above and click Generate Teams.</p>
              </div>
            ) : activeQuery.totalFormationCount !== 6 ? (
              <div className="empty-state">
                <p>Invalid Formation.</p>
                <p style={{fontSize:'0.85rem', marginTop: '0.5rem', opacity: 0.7}}>Your role counts must exactly equal 6 heroes.</p>
              </div>
            ) : recommendedTeams.length === 0 ? (
              <div className="empty-state">
                <p>No valid combinations found.</p>
                <p style={{fontSize:'0.85rem', marginTop: '0.5rem', opacity: 0.7}}>Try adjusting your formation or assigning more flexible heroes to the player pools.</p>
              </div>
            ) : (
              <>
                {recommendedTeams.slice(0, 3).map((rec, idx) => {
                  const saved = isTeamSaved(rec.team);
                  return (
                    <div key={idx} className="team-card">
                      <div className="team-header">
                        <h3>Rank #{idx + 1}</h3>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <div className="synergy-score">
                            <Sparkles size={16} />
                            {rec.maxValid} Active Team-Ups {rec.synergies.length > rec.maxValid && <span style={{fontSize:'1rem', opacity:0.8}}>({rec.synergies.length} Options)</span>}
                          </div>
                          <button 
                            onClick={() => handleExportTeam(rec)} 
                            style={{background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '0.2rem'}}
                            title="Copy Share Code"
                          >
                            <Share2 size={22} />
                          </button>
                          <button 
                            onClick={() => toggleSaveTeam(rec)} 
                            style={{background: 'none', border: 'none', color: saved ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0.2rem'}}
                            title={saved ? "Unsave Team" : "Save Team"}
                          >
                            {saved ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="team-roster">
                      {rec.team.map((hero, playerIdx) => {
                        const playerLabel = playerIdx === 0 ? "You" : `P${playerIdx + 1}`;
                        return (
                          <div key={hero.id} className="roster-member">
                            <div className="player-label" style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.25rem', textAlign: 'center', textTransform: 'uppercase'}}>{playerLabel}</div>
                            <div className="roster-icon-container">
                              <img src={`/heroes/${hero.id}.png`} alt={hero.name} className="roster-icon" onError={(e) => { e.target.style.display = 'none'; }} />
                              <div className={`role-indicator ${getRoleClass(hero.role)}`}></div>
                            </div>
                            <span>{hero.name}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {rec.synergies && rec.synergies.length > 0 && (
                      <div className="team-ups-list">
                        <h4>Synergies</h4>
                        {(() => {
                          const groupedSynergies = {};
                          rec.synergies.forEach(tu => {
                            const activator = tu.heroes[0];
                            if (!groupedSynergies[activator]) groupedSynergies[activator] = [];
                            groupedSynergies[activator].push(tu);
                          });
                          
                          return Object.values(groupedSynergies).map(group => {
                            const tuNames = group.map(tu => tu.name).join(' / ');
                            const activatorHero = heroes.find(h => h.id === group[0].heroes[0]);
                            const targets = group.map(tu => heroes.find(h => h.id === tu.heroes[1])?.name || '').filter(Boolean).join(' / ');
                            
                            return (
                              <div key={group[0].id} className="team-up-item">
                                <div>
                                  <div className="team-up-name">{tuNames} ({activatorHero?.name}, {targets})</div>
                                  {group.map((tu) => (
                                    <div key={tu.id} className="team-up-desc">
                                      {group.length > 1 && <strong style={{color: 'var(--color-primary)'}}>{tu.name}: </strong>}
                                      {tu.description}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                    
                    {rec.optimal && rec.optimal.unbuffed && rec.optimal.unbuffed.length > 0 && (
                      <div className="unbuffed-warning" style={{color: '#ff4d4d', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold'}}>
                        These characters do not get their enhanced team up: {rec.optimal.unbuffed.map(id => heroes.find(h => h.id === id).name).join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
                
                {recommendedTeams.length > 3 && (
                  <button className="generate-btn" onClick={() => setShowMore(!showMore)} style={{marginTop: '0'}}>
                    <span>{showMore ? "Collapse Ranks 4-50" : `View Next ${recommendedTeams.length - 3} Teams`}</span>
                  </button>
                )}
                
                {showMore && recommendedTeams.slice(3).map((rec, i) => {
                  const idx = i + 3;
                  const saved = isTeamSaved(rec.team);
                  return (
                    <div key={idx} className="team-card">
                      <div className="team-header">
                        <h3>Rank #{idx + 1}</h3>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <div className="synergy-score">
                            <Sparkles size={16} />
                            {rec.maxValid} Active Team-Ups {rec.synergies.length > rec.maxValid && <span style={{fontSize:'1rem', opacity:0.8}}>({rec.synergies.length} Options)</span>}
                          </div>
                          <button 
                            onClick={() => handleExportTeam(rec)} 
                            style={{background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '0.2rem'}}
                            title="Copy Share Code"
                          >
                            <Share2 size={22} />
                          </button>
                          <button 
                            onClick={() => toggleSaveTeam(rec)} 
                            style={{background: 'none', border: 'none', color: saved ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0.2rem'}}
                            title={saved ? "Unsave Team" : "Save Team"}
                          >
                            {saved ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="team-roster">
                        {rec.team.map((hero, playerIdx) => {
                          const playerLabel = playerIdx === 0 ? "You" : `P${playerIdx + 1}`;
                          return (
                            <div key={hero.id} className="roster-member">
                              <div className="player-label" style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.25rem', textAlign: 'center', textTransform: 'uppercase'}}>{playerLabel}</div>
                              <div className="roster-icon-container">
                                <img src={`/heroes/${hero.id}.png`} alt={hero.name} className="roster-icon" onError={(e) => { e.target.style.display = 'none'; }} />
                                <div className={`role-indicator ${getRoleClass(hero.role)}`}></div>
                              </div>
                              <span>{hero.name}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {rec.synergies && rec.synergies.length > 0 && (
                        <div className="team-ups-list">
                          <h4>Synergies</h4>
                          {(() => {
                            const groupedSynergies = {};
                            rec.synergies.forEach(tu => {
                              const activator = tu.heroes[0];
                              if (!groupedSynergies[activator]) groupedSynergies[activator] = [];
                              groupedSynergies[activator].push(tu);
                            });
                            
                            return Object.values(groupedSynergies).map(group => {
                              const tuNames = group.map(tu => tu.name).join(' / ');
                              const activatorHero = heroes.find(h => h.id === group[0].heroes[0]);
                              const targets = group.map(tu => heroes.find(h => h.id === tu.heroes[1])?.name || '').filter(Boolean).join(' / ');
                              
                              return (
                                <div key={group[0].id} className="team-up-item">
                                  <div>
                                    <div className="team-up-name">{tuNames} ({activatorHero?.name}, {targets})</div>
                                    {group.map((tu) => (
                                      <div key={tu.id} className="team-up-desc">
                                        {group.length > 1 && <strong style={{color: 'var(--color-primary)'}}>{tu.name}: </strong>}
                                        {tu.description}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      )}
                      
                      {rec.optimal && rec.optimal.unbuffed && rec.optimal.unbuffed.length > 0 && (
                        <div className="unbuffed-warning" style={{color: '#ff4d4d', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold'}}>
                          These characters do not get their enhanced team up: {rec.optimal.unbuffed.map(id => heroes.find(h => h.id === id).name).join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </section>
      </main>
      <footer style={{
        textAlign: 'center', 
        padding: '2rem 1rem', 
        marginTop: 'auto', 
        color: 'rgba(255,255,255,0.4)', 
        fontSize: '0.9rem',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        Made By: TruishRocks, Girf, voidmonster3, and Earlyhydra
      </footer>
    </div>
  );
}

export default App;
