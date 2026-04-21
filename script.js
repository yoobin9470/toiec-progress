const rcCount = 10;
const lcCount = 14;

function makeRows(prefix, count){
  const rows = [];
  for(let i=1;i<=count;i++){
    rows.push(`
      <tr class="data-row" data-group="${prefix}">
        <td>${prefix} Test ${i}</td>
        <td><input class="check part-check" type="checkbox"></td>
        <td><input class="check part-check" type="checkbox"></td>
        <td><input class="check part-check" type="checkbox"></td>
        <td class="row-percent">0.0%</td>
        <td class="row-hearts"></td>
      </tr>
    `);
  }

  rows.push(`
    <tr class="avg-row" data-group="${prefix}">
      <td colspan="4" style="text-align:center">평균</td>
      <td class="avg-percent">0.0%</td>
      <td class="avg-hearts"></td>
    </tr>
  `);

  return rows.join("");
}

document.getElementById("rcBody").innerHTML = makeRows("RC", rcCount);
document.getElementById("lcBody").innerHTML = makeRows("LC", lcCount);

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