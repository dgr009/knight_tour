// KnightTourApp.jsx — 모든 요구사항 통합·안정 버전
// -----------------------------------------------------------------------------
// • 방문 칸: .visited 클래스 → 선명한 빨강 그라데이션(투명도 NO)
// • 5-13 크기 선택, 크기 바꿀 때 자동 리셋
// • 컨트롤 두 줄(크기 선택 / 타이머 박스) ― 새 게임 버튼 제거
// • 상태·타이머 박스 · 위·아래 구분선 · 보드 중앙 정렬
// • 각 칸 흰색 두꺼운 테두리(border-2 border-white)
// • 첫 클릭 후 리셋·레이아웃 깨짐 해결
// -----------------------------------------------------------------------------

import React, { useState, useEffect, useRef } from 'react';

const MOVES = [
  [2, 1], [1, 2], [-1, 2], [-2, 1],
  [-2, -1], [-1, -2], [1, -2], [2, -1],
];
const legal = (p, v, n) =>
  !p ? [] :
    MOVES.map(([dr, dc]) => ({ row: p.row + dr, col: p.col + dc }))
         .filter(({ row, col }) => row >= 0 && row < n && col >= 0 && col < n && !v[row][col]);

const makeBoard = n => Array.from({ length: n }, () => Array(n).fill(false));
const fmt        = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function KnightTourApp() {
  const [size,    setSize]    = useState(5);
  const [visited, setVisited] = useState(() => makeBoard(5));
  const [pos,     setPos]     = useState(null);
  const [msg,     setMsg]     = useState('시작할 칸을 선택하세요 🐴');
  const [sec,     setSec]     = useState(0);
  const [records, setRecords] = useState([]);

  const timerRef = useRef(null);
  const startRef = useRef(null);

  /* ─ helper ─ */
  const reset = (s = size) => {
    clearInterval(timerRef.current);
    setVisited(makeBoard(s));
    setPos(null);
    setSec(0);
    setMsg('시작할 칸을 선택하세요 🐴');
  };

  const fail = (m) => {
    clearInterval(timerRef.current);
    setMsg(m);
    setTimeout(() => reset(size), 1000);
  };

  const succeed = () => {
    clearInterval(timerRef.current);
    setMsg('🎉 성공!');
    setRecords((prev) => [...prev, { size, sec }]);
  };

  const startTimer = () => {
    startRef.current = Date.now();
    timerRef.current =
      setInterval(() => setSec(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
  };

  /* ─ click ─ */
  const handleClick = (r, c) => {
    if (!pos) {
      const next = visited.map(row => row.slice());
      next[r][c] = true;
      const p = { row: r, col: c };
      setVisited(next); setPos(p); startTimer();
      if (legal(p, next, size).length === 0) fail('❌ 이동 칸 없음!');
      return;
    }
    if (visited[r][c]) return fail('❌ 이미 방문');
    if (!legal(pos, visited, size).some(p => p.row === r && p.col === c))
      return setMsg('⚠️ 불가능한 이동');
    
    setMsg('🐴 이동 중...');

    const next = visited.map(row => row.slice());
    next[r][c] = true;
    const p = { row: r, col: c };
    setVisited(next); setPos(p);

    if (next.flat().filter(Boolean).length === size * size) return succeed();
    if (legal(p, next, size).length === 0) fail('❌ 이동 칸 없음!');
  };

  /* 크기 변경 시 초기화 */
  useEffect(() => reset(size), [size]);

  /* ─ render ─ */
  return (
    <div className="min-h-screen flex flex-col items-center
                    bg-gradient-to-b from-rose-50 via-sky-50 to-indigo-50
                    dark:from-slate-800 dark:via-slate-900 dark:to-slate-950
                    ext-gray-800 dark:text-gray-200 px-0 py-8 mx-auto">

      {/* 헤더 */}
      <h1 className="text-4xl font-extrabold drop-shadow mb-4">Knightʼs Tour</h1>

      {/* 상태 메시지 박스 */}
      <div className="mb-8 max-w-md px-4 py-2 rounded-md bg-white/90 dark:bg-slate-700/60
                      shadow text-sm font-medium text-center">
        {msg}
      </div>

      {/* 컨트롤 ① : 크기 선택 */}
      <div className="mb-3 flex justify-center">
        <label className="flex items-center gap-2 text-sm">
          크기
          <select
            value={size}
            onChange={e => setSize(+e.target.value)}
            className="rounded border p-1 text-sm bg-white dark:bg-slate-700"
          >
            {Array.from({ length: 5 }, (_, i) => i + 5).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </label>
      </div>

      {/* 컨트롤 ② : 타이머 박스 */}
      <div className="mb-8 flex justify-center">
        <span className="px-4 py-1 rounded-lg bg-indigo-600 text-white
                         text-sm tracking-widest shadow-inner">
          ⏱ {fmt(sec)}
        </span>
      </div>

      {/* 위 구분선 */}
      <hr className="w-full max-w-2xl border-t border-indigo-200 dark:border-slate-600 mb-6" />

      {/* 보드 */}
      <div className="w-full max-w-[min(90vw,90vh)] aspect-square mx-auto mb-6">
        <div className="grid w-full h-full gap-px bg-gray-300 dark:bg-slate-600"
             style={{ gridTemplateColumns: `repeat(${size}, minmax(0,1fr))`,
                      gridTemplateRows:    `repeat(${size}, minmax(0,1fr))` }}>
          {visited.map((row, r) =>
            row.map((v, c) => {
              const curr  = pos && pos.row === r && pos.col === c;
              const isLeg = legal(curr ? pos : null, visited, size)
                              .some(p => p.row === r && p.col === c);

              return (
                <button key={`${r}-${c}`} onClick={() => handleClick(r, c)}
                  className={[
                    'aspect-square flex items-center justify-center select-none text-lg font-bold',
                    'border-2 border-white dark:border-slate-500',
                    (r + c) % 2
                      ? 'bg-white/70 dark:bg-slate-700/60'
                      : 'bg-white/40 dark:bg-slate-800/60',
                    v && 'visited',                      // 🔴 방문: custom CSS
                    isLeg && !v && 'ring-2 ring-cyan-400',
                    'hover:brightness-110 transition-colors',
                  ].join(' ')}>
                  {curr && <span style={{ fontSize: '70%' }} className="animate-bounce-xs">♞</span>}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 아래 구분선 */}
      <hr className="w-full max-w-2xl border-t border-indigo-200 dark:border-slate-600 mb-6" />

      {/* 완료 기록 */}
      <section className="w-full max-w-xs bg-white/90 dark:bg-slate-700/60
                          p-4 rounded-xl shadow-inner text-xs">
        <h2 className="font-semibold text-center mb-2">Records</h2>
        {records.length === 0 ? (
          <p className="text-center text-gray-500">없음</p>
        ) : (
          <ul className="space-y-1 max-h-32 overflow-y-auto">
            {records.map((r, i) => (
              <li key={i} className="flex justify-between">
                <span>{r.size}×{r.size}</span>
                <span>{fmt(r.sec)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
