const clockLocations = [
  ["Argentina", "Buenos Aires", "America/Argentina/Buenos_Aires"], ["Australia", "Brisbane", "Australia/Brisbane"],
  ["Australia", "Perth", "Australia/Perth"], ["Australia", "Sydney", "Australia/Sydney"], ["Austria", "Vienna", "Europe/Vienna"],
  ["Bangladesh", "Dhaka", "Asia/Dhaka"], ["Brazil", "São Paulo", "America/Sao_Paulo"], ["Canada", "Toronto", "America/Toronto"],
  ["Canada", "Vancouver", "America/Vancouver"], ["Chile", "Santiago", "America/Santiago"], ["China", "Beijing", "Asia/Shanghai"],
  ["Colombia", "Bogotá", "America/Bogota"], ["Denmark", "Copenhagen", "Europe/Copenhagen"], ["Egypt", "Cairo", "Africa/Cairo"],
  ["Finland", "Helsinki", "Europe/Helsinki"], ["France", "Paris", "Europe/Paris"], ["Germany", "Berlin", "Europe/Berlin"],
  ["Greece", "Athens", "Europe/Athens"], ["Hong Kong", "Hong Kong", "Asia/Hong_Kong"], ["Hungary", "Budapest", "Europe/Budapest"],
  ["Iceland", "Reykjavik", "Atlantic/Reykjavik"], ["India", "Mumbai", "Asia/Kolkata"], ["Indonesia", "Jakarta", "Asia/Jakarta"],
  ["Ireland", "Dublin", "Europe/Dublin"], ["Italy", "Rome", "Europe/Rome"], ["Japan", "Tokyo", "Asia/Tokyo"],
  ["Kenya", "Nairobi", "Africa/Nairobi"], ["Malaysia", "Kuala Lumpur", "Asia/Kuala_Lumpur"], ["Mexico", "Mexico City", "America/Mexico_City"],
  ["Morocco", "Casablanca", "Africa/Casablanca"], ["Netherlands", "Amsterdam", "Europe/Amsterdam"], ["New Zealand", "Auckland", "Pacific/Auckland"],
  ["New Zealand", "Wellington", "Pacific/Auckland"], ["Nigeria", "Lagos", "Africa/Lagos"], ["Norway", "Oslo", "Europe/Oslo"],
  ["Pakistan", "Karachi", "Asia/Karachi"], ["Peru", "Lima", "America/Lima"], ["Philippines", "Manila", "Asia/Manila"],
  ["Poland", "Warsaw", "Europe/Warsaw"], ["Portugal", "Lisbon", "Europe/Lisbon"], ["Qatar", "Doha", "Asia/Qatar"],
  ["Russia", "Moscow", "Europe/Moscow"], ["Saudi Arabia", "Riyadh", "Asia/Riyadh"], ["Singapore", "Singapore", "Asia/Singapore"],
  ["South Africa", "Cape Town", "Africa/Johannesburg"], ["South Korea", "Seoul", "Asia/Seoul"], ["Spain", "Madrid", "Europe/Madrid"],
  ["Sweden", "Stockholm", "Europe/Stockholm"], ["Switzerland", "Zurich", "Europe/Zurich"], ["Thailand", "Bangkok", "Asia/Bangkok"],
  ["Türkiye", "Istanbul", "Europe/Istanbul"], ["United Arab Emirates", "Dubai", "Asia/Dubai"], ["United Kingdom", "London", "Europe/London"],
  ["United States", "Anchorage", "America/Anchorage"], ["United States", "Chicago", "America/Chicago"], ["United States", "Denver", "America/Denver"],
  ["United States", "Honolulu", "Pacific/Honolulu"], ["United States", "Los Angeles", "America/Los_Angeles"], ["United States", "New York", "America/New_York"],
  ["Afghanistan", "Kabul", "Asia/Kabul"], ["Albania", "Tirana", "Europe/Tirane"], ["Algeria", "Algiers", "Africa/Algiers"],
  ["Angola", "Luanda", "Africa/Luanda"], ["Antigua and Barbuda", "St. John's", "America/Antigua"], ["Armenia", "Yerevan", "Asia/Yerevan"],
  ["Azerbaijan", "Baku", "Asia/Baku"], ["Bahamas", "Nassau", "America/Nassau"], ["Bahrain", "Manama", "Asia/Bahrain"],
  ["Barbados", "Bridgetown", "America/Barbados"], ["Belarus", "Minsk", "Europe/Minsk"], ["Belgium", "Brussels", "Europe/Brussels"],
  ["Belize", "Belmopan", "America/Belize"], ["Benin", "Porto-Novo", "Africa/Porto-Novo"], ["Bolivia", "La Paz", "America/La_Paz"],
  ["Bosnia and Herzegovina", "Sarajevo", "Europe/Sarajevo"], ["Botswana", "Gaborone", "Africa/Gaborone"], ["Brunei", "Bandar Seri Begawan", "Asia/Brunei"],
  ["Burkina Faso", "Ouagadougou", "Africa/Ouagadougou"], ["Cameroon", "Yaounde", "Africa/Douala"], ["Chad", "N'Djamena", "Africa/Ndjamena"],
  ["Costa Rica", "San José", "America/Costa_Rica"], ["Croatia", "Zagreb", "Europe/Zagreb"], ["Cuba", "Havana", "America/Havana"],
  ["Cyprus", "Nicosia", "Asia/Nicosia"], ["Ecuador", "Quito", "America/Guayaquil"], ["El Salvador", "San Salvador", "America/El_Salvador"],
  ["Estonia", "Tallinn", "Europe/Tallinn"], ["Ethiopia", "Addis Ababa", "Africa/Addis_Ababa"], ["Fiji", "Suva", "Pacific/Fiji"],
  ["Gabon", "Libreville", "Africa/Libreville"], ["Georgia", "Tbilisi", "Asia/Tbilisi"], ["Ghana", "Accra", "Africa/Accra"],
  ["Guatemala", "Guatemala City", "America/Guatemala"], ["Guinea", "Conakry", "Africa/Conakry"], ["Guyana", "Georgetown", "America/Guyana"],
  ["Haiti", "Port-au-Prince", "America/Port-au-Prince"], ["Honduras", "Tegucigalpa", "America/Tegucigalpa"], ["Iran", "Tehran", "Asia/Tehran"],
  ["Iraq", "Baghdad", "Asia/Baghdad"], ["Jamaica", "Kingston", "America/Jamaica"], ["Jordan", "Amman", "Asia/Amman"],
  ["Kazakhstan", "Almaty", "Asia/Almaty"], ["Kuwait", "Kuwait City", "Asia/Kuwait"], ["Laos", "Vientiane", "Asia/Vientiane"],
  ["Latvia", "Riga", "Europe/Riga"], ["Lebanon", "Beirut", "Asia/Beirut"], ["Liberia", "Monrovia", "Africa/Monrovia"],
  ["Libya", "Tripoli", "Africa/Tripoli"], ["Lithuania", "Vilnius", "Europe/Vilnius"], ["Luxembourg", "Luxembourg", "Europe/Luxembourg"],
  ["Madagascar", "Antananarivo", "Indian/Antananarivo"], ["Malawi", "Lilongwe", "Africa/Blantyre"], ["Maldives", "Malé", "Indian/Maldives"],
  ["Mali", "Bamako", "Africa/Bamako"], ["Malta", "Valletta", "Europe/Malta"], ["Mauritius", "Port Louis", "Indian/Mauritius"],
  ["Mongolia", "Ulaanbaatar", "Asia/Ulaanbaatar"], ["Montenegro", "Podgorica", "Europe/Podgorica"], ["Namibia", "Windhoek", "Africa/Windhoek"],
  ["Nepal", "Kathmandu", "Asia/Kathmandu"], ["Nicaragua", "Managua", "America/Managua"], ["Niger", "Niamey", "Africa/Niamey"],
  ["North Macedonia", "Skopje", "Europe/Skopje"], ["Panama", "Panama City", "America/Panama"], ["Paraguay", "Asunción", "America/Asuncion"],
  ["Rwanda", "Kigali", "Africa/Kigali"], ["Senegal", "Dakar", "Africa/Dakar"], ["Serbia", "Belgrade", "Europe/Belgrade"],
  ["Sierra Leone", "Freetown", "Africa/Freetown"], ["Slovakia", "Bratislava", "Europe/Bratislava"], ["Slovenia", "Ljubljana", "Europe/Ljubljana"],
  ["Somalia", "Mogadishu", "Africa/Mogadishu"], ["Sri Lanka", "Colombo", "Asia/Colombo"], ["Sudan", "Khartoum", "Africa/Khartoum"],
  ["Suriname", "Paramaribo", "America/Paramaribo"], ["Syria", "Damascus", "Asia/Damascus"], ["Taiwan", "Taipei", "Asia/Taipei"],
  ["Tajikistan", "Dushanbe", "Asia/Dushanbe"], ["Tanzania", "Dar es Salaam", "Africa/Dar_es_Salaam"], ["Togo", "Lomé", "Africa/Lome"],
  ["Trinidad and Tobago", "Port of Spain", "America/Port_of_Spain"], ["Tunisia", "Tunis", "Africa/Tunis"], ["Turkmenistan", "Ashgabat", "Asia/Ashgabat"],
  ["Uganda", "Kampala", "Africa/Kampala"], ["Ukraine", "Kyiv", "Europe/Kyiv"], ["Uruguay", "Montevideo", "America/Montevideo"],
  ["Uzbekistan", "Tashkent", "Asia/Tashkent"], ["Venezuela", "Caracas", "America/Caracas"], ["Yemen", "Sana'a", "Asia/Aden"],
  ["Zambia", "Lusaka", "Africa/Lusaka"], ["Zimbabwe", "Harare", "Africa/Harare"]
].map(([country, city, zone]) => ({ country, city, zone, name: city }))
  .sort((a, b) => a.country.localeCompare(b.country) || a.city.localeCompare(b.city));

const cityByRegion = {
  US: "America/New_York", CA: "America/Toronto", GB: "Europe/London", AU: "Australia/Sydney",
  NZ: "Pacific/Auckland", IN: "Asia/Kolkata", JP: "Asia/Tokyo", CN: "Asia/Shanghai",
  SG: "Asia/Singapore", AE: "Asia/Dubai", BR: "America/Sao_Paulo", MX: "America/Mexico_City",
  FR: "Europe/Paris", DE: "Europe/Berlin", IT: "Europe/Rome", ES: "Europe/Madrid",
  ZA: "Africa/Johannesburg", NG: "Africa/Lagos", EG: "Africa/Cairo", TR: "Europe/Istanbul"
};
const fallbackSelections = ["America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney"];
let referenceTime = new Date();
let activeCard = 0;
let timePickerCard = 0;
let selectedHour = 0;
let selectedMinute = 0;
let selectedSecond = 0;

function formatParts(date, zone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  }).formatToParts(date).reduce((parts, part) => {
    if (part.type !== "literal") parts[part.type] = Number(part.value);
    return parts;
  }, {});
}

function timeInputValue(date, zone) {
  const parts = formatParts(date, zone);
  const hour = parts.hour === 24 ? 0 : parts.hour;
  const period = hour >= 12 ? "PM" : "AM";
  return `${String(hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")} ${period}`;
}

function setReferenceFromInput(value, zone) {
  const parts = value.trim().match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
  if (!parts) return false;
  const numericParts = parts.slice(1).map(Number);
  if (!numericParts.every(Number.isFinite)) return false;
  const [hour, minute, second = 0] = numericParts;
  if (hour > 23 || minute > 59 || second > 59) return false;
  const nowParts = formatParts(referenceTime, zone);
  const localAsUtc = Date.UTC(nowParts.year, nowParts.month - 1, nowParts.day, hour, minute, second);
  const currentAsUtc = Date.UTC(nowParts.year, nowParts.month - 1, nowParts.day, nowParts.hour % 24, nowParts.minute, nowParts.second);
  referenceTime = new Date(localAsUtc - (currentAsUtc - referenceTime.getTime()));
  return true;
}

function updateWorldClocks() {
  document.querySelectorAll("[data-clock-select]").forEach(select => {
    const index = Number(select.dataset.clockSelect);
    const location = clockLocations.find(item => item.zone === select.value) || clockLocations[0];
    const parts = formatParts(referenceTime, select.value);
    const time = timeInputValue(referenceTime, select.value);
    const date = new Intl.DateTimeFormat(undefined, { timeZone: select.value, weekday: "short", month: "short", day: "numeric" }).format(referenceTime);
    document.getElementById(`clockDate${index}`).textContent = date;
    const locationButton = document.getElementById(`clockLocation${index}`);
    locationButton.textContent = location.city;
    const timeDisplay = document.getElementById(`clockTime${index}`);
    timeDisplay.textContent = time;
    timeDisplay.setAttribute("aria-label", `Choose time for ${location.city}: ${time}`);
    const face = select.closest(".clock-card").querySelector(".clock-face");
    face.querySelector(".clock-hour").style.transform = `rotate(${(parts.hour % 12) * 30 + parts.minute * .5}deg)`;
    face.querySelector(".clock-minute").style.transform = `rotate(${parts.minute * 6 + parts.second * .1}deg)`;
    face.querySelector(".clock-second").style.transform = `rotate(${parts.second * 6}deg)`;
  });
}

function openPicker(index) {
  activeCard = index;
  document.getElementById("clockPicker").hidden = false;
  document.getElementById("clockPickerSearch").focus();
  renderPickerList();
}

function openTimePicker(index) {
  timePickerCard = index;
  const value = timeInputValue(referenceTime, document.getElementById(`clockZone${index}`).value).match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
  selectedHour = value ? Number(value[1]) : 0;
  selectedMinute = value ? Number(value[2]) : 0;
  selectedSecond = value && value[3] ? Number(value[3]) : 0;
  document.querySelectorAll(".inline-time-picker").forEach(picker => picker.hidden = true);
  const card = document.querySelector(`.clock-card[data-clock-card="${index}"]`);
  document.querySelectorAll(".clock-card").forEach(item => item.classList.remove("time-picker-open"));
  card.classList.add("time-picker-open");
  let picker = card.querySelector(".inline-time-picker");
  if (!picker) {
    picker = document.createElement("div");
    picker.className = "inline-time-picker";
    picker.innerHTML = '<div class="time-picker-top"><div class="time-picker-value"></div><button class="time-picker-done" type="button">Done</button></div><div class="scroll-time-picker"><div><span>Hour</span><div class="time-scroll" data-time-unit="hour"></div></div><div><span>Minute</span><div class="time-scroll" data-time-unit="minute"></div></div><div><span>Second</span><div class="time-scroll" data-time-unit="second"></div></div></div>';
    card.append(picker);
    picker.addEventListener("click", event => event.stopPropagation());
    picker.querySelector(".time-picker-done").addEventListener("click", event => {
      event.stopPropagation();
      const zone = document.getElementById(`clockZone${timePickerCard}`).value;
      const value = [selectedHour, selectedMinute, selectedSecond].map(item => String(item).padStart(2, "0")).join(":");
      if (setReferenceFromInput(value, zone)) showResetControl();
      updateWorldClocks();
      picker.hidden = true;
      picker.closest(".clock-card").classList.remove("time-picker-open");
    });
  }
  picker.hidden = false;
  picker.querySelectorAll(".time-scroll").forEach(scroll => { scroll.dataset.positioned = ""; });
  renderScrollPicker();
}

function renderScrollPicker() {
  const picker = document.querySelector(`.clock-card[data-clock-card="${timePickerCard}"] .inline-time-picker`);
  [["hour", 24], ["minute", 60], ["second", 60]].forEach(([unit, count]) => {
    const scroll = picker.querySelector(`[data-time-unit="${unit}"]`);
    const selected = unit === "hour" ? selectedHour : unit === "minute" ? selectedMinute : selectedSecond;
    if (!scroll.children.length) for (let value = 0; value < count; value += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "scroll-time-choice";
      button.textContent = String(value).padStart(2, "0");
      button.classList.toggle("selected", value === selected);
      button.addEventListener("click", () => {
        if (unit === "hour") selectedHour = value;
        if (unit === "minute") selectedMinute = value;
        if (unit === "second") selectedSecond = value;
        scroll.querySelectorAll(".scroll-time-choice").forEach(choice => choice.classList.toggle("selected", Number(choice.textContent) === value));
        updateTimePickerValue();
      });
      scroll.append(button);
    }
    const active = scroll.querySelector(".selected");
    if (active && !scroll.dataset.positioned) {
      scroll.scrollTop = active.offsetTop - scroll.clientHeight / 2 + active.offsetHeight / 2;
      scroll.dataset.positioned = "true";
    }
  });
  updateTimePickerValue();
}

function updateTimePickerValue() {
  document.querySelector(`.clock-card[data-clock-card="${timePickerCard}"] .time-picker-value`).textContent = [selectedHour, selectedMinute, selectedSecond]
    .map(value => String(value).padStart(2, "0")).join(":");
}

function closePicker() {
  document.getElementById("clockPicker").hidden = true;
}

function renderPickerList() {
  const query = document.getElementById("clockPickerSearch").value.toLowerCase();
  const list = document.getElementById("clockPickerList");
  list.innerHTML = "";
  const matches = clockLocations.filter(location => `${location.country} ${location.city}`.toLowerCase().includes(query));
  matches.forEach(location => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${location.country} — ${location.city}`;
    button.addEventListener("click", () => {
      document.getElementById(`clockZone${activeCard}`).value = location.zone;
      closePicker();
      updateWorldClocks();
    });
    list.append(button);
  });
  const firstMatch = list.querySelector("button");
  if (firstMatch) firstMatch.scrollIntoView({ block: "nearest" });
}

function setHeading(text) {
  document.getElementById("clocks-heading").textContent = text;
}

function showResetControl() {
  setHeading("Time updated.");
  document.getElementById("resetClockButton").hidden = false;
}

const region = new Intl.Locale(navigator.language).region;
const detectedZone = cityByRegion[region] || Intl.DateTimeFormat().resolvedOptions().timeZone;
const userZone = clockLocations.some(location => location.zone === detectedZone) ? detectedZone : fallbackSelections[0];
const selections = [userZone, ...fallbackSelections.filter(zone => zone !== userZone)].slice(0, 4);
document.querySelectorAll("[data-clock-select]").forEach(select => {
  clockLocations.forEach(location => {
    const option = document.createElement("option");
    option.value = location.zone;
    option.textContent = location.city;
    select.append(option);
  });
  select.value = selections[Number(select.dataset.clockSelect)] || fallbackSelections[Number(select.dataset.clockSelect)];
});
document.getElementById("resetClockButton").hidden = true;
document.querySelectorAll(".clock-card").forEach(card => {
  const index = Number(card.dataset.clockCard);
  card.addEventListener("click", event => {
    if (!event.target.closest(".clock-time-display") && !event.target.closest(".clock-location")) openPicker(index);
  });
  document.getElementById(`clockLocation${index}`).addEventListener("click", event => {
    event.stopPropagation();
    openPicker(index);
  });
  document.getElementById(`clockTime${index}`).addEventListener("click", event => {
    event.stopPropagation();
    openTimePicker(index);
  });
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker(index);
    }
  });
});
document.getElementById("resetClockButton").addEventListener("click", () => {
  referenceTime = new Date();
  setHeading("Select a time.");
  document.getElementById("resetClockButton").hidden = true;
  updateWorldClocks();
});
document.getElementById("clockPickerSearch").addEventListener("input", renderPickerList);
document.getElementById("clockPickerSearch").addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  const firstMatch = document.querySelector("#clockPickerList button");
  if (!firstMatch) return;
  event.preventDefault();
  firstMatch.click();
});
document.getElementById("closeClockPicker").addEventListener("click", closePicker);
document.querySelector("[data-close-clock-picker]").addEventListener("click", closePicker);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closePicker();
    document.querySelectorAll(".inline-time-picker").forEach(picker => {
      picker.hidden = true;
      picker.closest(".clock-card").classList.remove("time-picker-open");
    });
  }
});
updateWorldClocks();
window.setInterval(() => {
  referenceTime = new Date(referenceTime.getTime() + 1000);
  updateWorldClocks();
}, 1000);
