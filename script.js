const rcCount = 10;

const lcNames = [
  "Part 9~10",
  "Part 11~12",
  "Part 13~14",
  "Part 15~16",
  "LC Test 1",
  "LC Test 2",
  "LC Test 3",
  "LC Test 4",
  "LC Test 5",
  "LC Test 6",
  "LC Test 7",
  "LC Test 8",
  "LC Test 9",
  "LC Test 10"
];

function makeRows(prefix, items){
  const rows = [];

  items.forEach(name => {
    rows.push(`
      <tr class="data-row" data-group="${prefix}">
        <td>${name}</td>
        <td><input class="check part-check" type="checkbox"></td>
        <td><input class="check part-check" type="checkbox"></td>
        <td><input class="check part-check" type="checkbox"></td>
        <td class="row-percent">0.0%</td>
        <td class="row-hearts"></td>
      </tr>
    `);
  });

  rows.push(`
    <tr class="avg-row" data-group="${prefix}">
      <td colspan="4" style="text-align:center">평균</td>
      <td class="avg-percent">0.0%</td>
      <td class="avg-hearts"></td>
    </tr>
  `);

  return rows.join("");
}

const rcNames = Array.from({ length: rcCount }, (_, i) => `RC Test ${i + 1}`);

document.getElementById("rcBody").innerHTML = makeRows("RC", rcNames);
document.getElementById("lcBody").innerHTML = makeRows("LC", lcNames);

function heartsHtml(percent, totalHearts, filledHeart, emptyHeart, filledClass, emptyClass = "heart-empty"){
  const filled = Math.round((percent / 100) * totalHearts);
  const empty = totalHearts - filled;

  return `
    <span class="${filledClass}">${filledHeart.repeat(filled)}</span>
    <span class="${emptyClass}">${emptyHeart.repeat(empty)}</span>
  `;
}

function updateGroup(group, percentId, heartsId, doneId, filledClass, heartChar){
  const rows = [...document.querySelectorAll(`tr.data-row[data-group="${group}"]`)];
  let sumPercent = 0;
  let completed = 0;

  rows.forEach(row => {
    const checks = [...row.querySelectorAll(".part-check")];
    const checkedCount = checks.filter(c => c.checked).length;
    const percent = (checkedCount / 3) * 100;

    row.querySelector(".row-percent").textContent = percent.toFixed(1) + "%";

    row.querySelector(".row-hearts").innerHTML =
      heartsHtml(percent, 5, heartChar, "🤍", filledClass);

    if(percent === 100) completed++;
    sumPercent += percent;
  });

  const avgPercent = rows.length ? sumPercent / rows.length : 0;
  const avgRow = document.querySelector(`tr.avg-row[data-group="${group}"]`);

  avgRow.querySelector(".avg-percent").textContent = avgPercent.toFixed(1) + "%";

  avgRow.querySelector(".avg-hearts").innerHTML =
    heartsHtml(avgPercent, 5, heartChar, "🤍", filledClass);

  document.getElementById(percentId).textContent = avgPercent.toFixed(1) + "%";

  document.getElementById(heartsId).innerHTML =
    heartsHtml(avgPercent, 10, heartChar, "🤍", filledClass);

  document.getElementById(doneId).textContent = `${completed} / ${rows.length} 완료`;

  return {
    avgPercent,
    completed,
    total: rows.length
  };
}

function updateAll(){
  const rc = updateGroup(
    "RC",
    "rcPercent",
    "rcHearts",
    "rcDone",
    "heart-blue",
    "💙"
  );

  const lc = updateGroup(
    "LC",
    "lcPercent",
    "lcHearts",
    "lcDone",
    "heart-pink",
    "🩷"
  );

  const allAvg = ((rc.avgPercent * rc.total) + (lc.avgPercent * lc.total)) / (rc.total + lc.total);
  const allDone = rc.completed + lc.completed;
  const allTotal = rc.total + lc.total;

  document.getElementById("allPercent").textContent = allAvg.toFixed(1) + "%";

  document.getElementById("allHearts").innerHTML =
    heartsHtml(allAvg, 10, "💖", "🤍", "heart-purple");

  document.getElementById("allDone").textContent = `${allDone} / ${allTotal} 완료`;
}

document.addEventListener("change", (e) => {
  if(e.target.classList.contains("part-check")){
    updateAll();
  }
});

function showSection(type){
  const rcSection = document.getElementById("rcSection");
  const lcSection = document.getElementById("lcSection");

  if(type === "rc"){
    rcSection.style.display = "block";
    lcSection.style.display = "none";
  } else {
    rcSection.style.display = "none";
    lcSection.style.display = "block";
  }
}

updateAll();
