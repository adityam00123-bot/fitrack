const fs = require('fs');
let code = fs.readFileSync('src/data/exercisesData.ts', 'utf8');

const replacements = [
  { id: "id: 'ex-bench-press',", add: "    videoUrl: '/exercises/barbell_bench_press.mp4'," },
  { id: "id: 'ex-dips-chest',", add: "    videoUrl: '/exercises/chest_dip.mp4'," },
  { id: "id: 'ex-deadlift',", add: "    videoUrl: '/exercises/barbell_deadlift.mp4'," },
  { id: "id: 'ex-barbell-row',", add: "    videoUrl: '/exercises/barbell_bent_over_row.mp4'," },
  { id: "id: 'ex-pull-up',", add: "    videoUrl: '/exercises/pull_up.mp4'," },
  { id: "id: 'ex-lat-pulldown',", add: "    videoUrl: '/exercises/lat_pulldown.mp4'," },
  { id: "id: 'ex-overhead-press',", add: "    videoUrl: '/exercises/overhead_press.mp4'," },
  { id: "id: 'ex-db-lateral-raise',", add: "    videoUrl: '/exercises/lateral_raise.mp4'," },
  { id: "id: 'ex-barbell-squat',", add: "    videoUrl: '/exercises/barbell_squat.mp4'," },
  { id: "id: 'ex-leg-press',", add: "    videoUrl: '/exercises/leg_press.mp4'," },
  { id: "id: 'ex-romanian-deadlift',", add: "    videoUrl: '/exercises/romanian_deadlift.mp4'," },
  { id: "id: 'ex-barbell-curl',", add: "    videoUrl: '/exercises/barbell_curl.mp4'," },
  { id: "id: 'ex-cable-pushdown',", add: "    videoUrl: '/exercises/cable_pushdown.mp4'," }
];

for (const r of replacements) {
  if (code.includes(r.id) && !code.includes(r.add)) {
    code = code.replace(r.id, r.id + '\n' + r.add);
  }
}

fs.writeFileSync('src/data/exercisesData.ts', code);
console.log('Successfully updated exercisesData.ts with videoUrls!');
