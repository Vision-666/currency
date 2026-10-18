const $ = id => document.getElementById(id);

function initGlobe() {
  const canvas = $("worldGlobe");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  let features = [];
  let rotation = -20;
  let tilt = 8;
  let zoom = 1;
  let dragging = false;
  let previousPoint;
  let angularVelocity = .008;
  let lastFrame = performance.now();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const bounds = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(bounds.width * ratio));
    canvas.height = Math.max(1, Math.round(bounds.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  };
  const project = (longitude, latitude, centerX, centerY, radius) => {
    const lon = (longitude + rotation) * Math.PI / 180;
    const lat = latitude * Math.PI / 180;
    const tiltRadians = tilt * Math.PI / 180;
    const x = Math.cos(lat) * Math.sin(lon);
    const y = Math.cos(tiltRadians) * Math.sin(lat) - Math.sin(tiltRadians) * Math.cos(lat) * Math.cos(lon);
    const visible = Math.cos(lat) * Math.cos(lon) > -0.04;
    return { x: centerX + radius * x, y: centerY - radius * y, visible };
  };
  const isInsideGlobe = event => {
    const bounds = canvas.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;
    const radius = Math.min(width * .37, height * .43) * zoom;
    const x = event.clientX - bounds.left - width * .5;
    const y = event.clientY - bounds.top - height * .48;
    return x * x + y * y <= radius * radius;
  };
  const drawPolygon = (coordinates, centerX, centerY, radius, fill) => {
    coordinates.forEach(ring => {
      let segment = [];
      const paintSegment = () => {
        if (segment.length < 3) {
          segment = [];
          return;
        }
        context.beginPath();
        context.moveTo(segment[0].x, segment[0].y);
        segment.slice(1).forEach(point => context.lineTo(point.x, point.y));
        context.closePath();
        context.fillStyle = fill;
        context.fill();
        context.strokeStyle = "rgba(197, 247, 216, .32)";
        context.lineWidth = .65;
        context.stroke();
        segment = [];
      };
      ring.forEach(([longitude, latitude]) => {
        const point = project(longitude, latitude, centerX, centerY, radius);
        if (point.visible) {
          segment.push(point);
        } else {
          paintSegment();
        }
      });
      paintSegment();
    });
  };
  const draw = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);
    const centerX = width * .5;
    const centerY = height * .48;
    const radius = Math.min(width * .37, height * .43) * zoom;
    const glow = context.createRadialGradient(centerX - radius * .35, centerY - radius * .45, radius * .05, centerX, centerY, radius * 1.25);
    glow.addColorStop(0, "#8290ff");
    glow.addColorStop(.6, "#5968dc");
    glow.addColorStop(1, "#26317e");
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fillStyle = glow;
    context.fill();
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.clip();
    context.strokeStyle = "rgba(197, 247, 216, .22)";
    context.lineWidth = .7;
    for (let longitude = -150; longitude <= 180; longitude += 30) {
      context.beginPath();
      let started = false;
      for (let latitude = -90; latitude <= 90; latitude += 4) {
        const point = project(longitude, latitude, centerX, centerY, radius);
        if (point.visible) {
          if (!started) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
          started = true;
        }
      }
      context.stroke();
    }
    for (let latitude = -60; latitude <= 60; latitude += 30) {
      context.beginPath();
      let started = false;
      for (let longitude = -180; longitude <= 180; longitude += 4) {
        const point = project(longitude, latitude, centerX, centerY, radius);
        if (point.visible) {
          if (!started) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
          started = true;
        }
      }
      context.stroke();
    }
    features.forEach(feature => {
      const geometries = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
      geometries.forEach(polygon => drawPolygon(polygon, centerX, centerY, radius, "#c5f7d8"));
    });
    context.restore();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.strokeStyle = "rgba(197, 247, 216, .7)";
    context.lineWidth = 1.2;
    context.stroke();
  };
  const animate = timestamp => {
    const elapsed = Math.min(50, timestamp - lastFrame);
    lastFrame = timestamp;
    if (!dragging && !reducedMotion) {
      rotation += angularVelocity * elapsed;
      angularVelocity += (.008 - angularVelocity) * Math.min(1, elapsed / 1200);
      draw();
    }
    window.requestAnimationFrame(animate);
  };
  canvas.addEventListener("pointerdown", event => {
    if (!isInsideGlobe(event)) return;
    dragging = true;
    angularVelocity = 0;
    previousPoint = event;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", event => {
    if (!dragging) return;
    const elapsed = Math.max(8, event.timeStamp - previousPoint.timeStamp);
    const horizontalDelta = event.clientX - previousPoint.clientX;
    rotation += horizontalDelta * .45;
    angularVelocity = Math.max(-.7, Math.min(.7, horizontalDelta * .45 / elapsed));
    tilt = Math.max(-55, Math.min(55, tilt - (event.clientY - previousPoint.clientY) * .3));
    previousPoint = event;
    draw();
  });
  canvas.addEventListener("pointerup", event => {
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointercancel", () => { dragging = false; });
  canvas.addEventListener("wheel", event => {
    if (!isInsideGlobe(event)) return;
    event.preventDefault();
    zoom = Math.max(.8, Math.min(1.2, zoom - event.deltaY * .001));
    draw();
  }, { passive: false });
  window.addEventListener("resize", resize);
  fetch("/assets/world-countries.json")
    .then(response => {
      if (!response.ok) throw new Error("Country boundary data unavailable.");
      return response.json();
    })
    .then(data => {
      features = data.features || [];
      resize();
    })
    .catch(error => {
      console.error(error);
      resize();
    });
  resize();
  window.requestAnimationFrame(animate);
}
initGlobe();
