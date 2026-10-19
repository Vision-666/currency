const $ = id => document.getElementById(id);

function initGlobe() {
  const canvas = $("worldGlobe");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  let features = [];
  let landTexture;
  let landTextureWidth = 1440;
  let landTextureHeight = 720;
  let rotation = -20;
  let tilt = 8;
  let zoom = 1;
  let dragging = false;
  let previousPoint;
  let angularVelocity = .008;
  let lastFrame = performance.now();
  let electronPhase = 0;
  const electronBaseSpeed = .00065;
  const electronRotationInfluence = 1.4;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getElectronSpeed = () => Math.max(
    -.025,
    Math.min(.025, electronBaseSpeed + angularVelocity * Math.PI / 180 * electronRotationInfluence)
  );
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
    const depth = Math.cos(tiltRadians) * Math.cos(lat) * Math.cos(lon) + Math.sin(tiltRadians) * Math.sin(lat);
    const visible = depth > -0.015;
    return { x: centerX + radius * x, y: centerY - radius * y, visible, depth };
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
  const buildLandTexture = () => {
    const map = document.createElement("canvas");
    map.width = landTextureWidth;
    map.height = landTextureHeight;
    const mapContext = map.getContext("2d");
    mapContext.fillStyle = "#a7d7bf";
    features.forEach(feature => {
      const geometries = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
      geometries.forEach(polygon => polygon.forEach(ring => {
        mapContext.beginPath();
        ring.forEach(([longitude, latitude], index) => {
          const x = (longitude + 180) / 360 * map.width;
          const y = (90 - latitude) / 180 * map.height;
          if (index === 0) mapContext.moveTo(x, y);
          else mapContext.lineTo(x, y);
        });
        mapContext.closePath();
        mapContext.fill("evenodd");
      }));
    });
    landTexture = mapContext.getImageData(0, 0, map.width, map.height).data;
  };
  const sampleLand = (textureX, textureY) => {
    if (!landTexture) return 0;
    const x = ((textureX % landTextureWidth) + landTextureWidth) % landTextureWidth;
    const y = Math.max(0, Math.min(landTextureHeight - 1, textureY));
    const centerX = Math.floor(x);
    const centerY = Math.floor(y);
    let total = 0;
    for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
      const sampleY = Math.max(0, Math.min(landTextureHeight - 1, centerY + offsetY));
      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        const sampleX = (centerX + offsetX + landTextureWidth) % landTextureWidth;
        total += landTexture[(sampleY * landTextureWidth + sampleX) * 4 + 3] / 255;
      }
    }
    const average = total / 9;
    if (average < .28) return 0;
    const edge = Math.max(0, Math.min(1, (average - .28) / .5));
    return edge * edge * (3 - 2 * edge);
  };
  const draw = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = window.devicePixelRatio || 1;
    context.clearRect(0, 0, width, height);
    const centerX = width * .5;
    const centerY = height * .48;
    const radius = Math.min(width * .37, height * .43) * zoom;
    const drawElectronOrbit = (angle, color, phase, frontOpacity) => {
      const orbitX = radius * 1.34;
      const orbitY = radius * .48;
      context.save();
      context.translate(centerX, centerY);
      context.rotate(angle);
      context.beginPath();
      context.ellipse(0, 0, orbitX, orbitY, 0, 0, Math.PI * 2);
      context.strokeStyle = color.replace("OPACITY", frontOpacity);
      context.lineWidth = 1.15;
      context.setLineDash([radius * .11, radius * .08]);
      context.lineDashOffset = 0;
      context.shadowColor = color.replace("OPACITY", frontOpacity);
      context.shadowBlur = 13;
      context.stroke();
      context.setLineDash([]);
      for (let electronIndex = 0; electronIndex < 3; electronIndex += 1) {
        const electronAngle = phase + electronIndex * Math.PI * 2 / 3;
        const electronX = orbitX * Math.cos(electronAngle);
        const electronY = orbitY * Math.sin(electronAngle);
        context.beginPath();
        context.arc(electronX, electronY, Math.max(2, radius * .022), 0, Math.PI * 2);
        context.fillStyle = color.replace("OPACITY", ".72");
        context.shadowColor = color.replace("OPACITY", ".72");
        context.shadowBlur = 8;
        context.fill();
      }
      context.restore();
    };
    drawElectronOrbit(-.58, "rgba(89, 235, 218, OPACITY)", electronPhase, ".12");
    drawElectronOrbit(.58, "rgba(141, 111, 255, OPACITY)", -electronPhase * .82, ".1");
    const glow = context.createRadialGradient(centerX - radius * .35, centerY - radius * .45, radius * .05, centerX, centerY, radius * 1.25);
    glow.addColorStop(0, "#7a9fc1");
    glow.addColorStop(.55, "#326181");
    glow.addColorStop(1, "#102b46");
    context.save();
    context.shadowColor = "rgba(4, 15, 26, .45)";
    context.shadowBlur = 22;
    context.shadowOffsetY = 10;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fillStyle = glow;
    context.fill();
    context.restore();
    const image = context.createImageData(Math.ceil(width * ratio), Math.ceil(height * ratio));
    const tiltRadians = tilt * Math.PI / 180;
    for (let y = 0; y < image.height; y += 1) {
      for (let x = 0; x < image.width; x += 1) {
        const pixelX = (x + .5) / ratio;
        const pixelY = (y + .5) / ratio;
        const nx = (pixelX - centerX) / radius;
        const ny = (centerY - pixelY) / radius;
        const distance = nx * nx + ny * ny;
        if (distance > 1) continue;
        const nz = Math.sqrt(1 - distance);
        const mapY = Math.cos(tiltRadians) * ny + Math.sin(tiltRadians) * nz;
        const mapZ = Math.cos(tiltRadians) * nz - Math.sin(tiltRadians) * ny;
        const longitude = Math.atan2(nx, mapZ) * 180 / Math.PI - rotation;
        const latitude = Math.asin(Math.max(-1, Math.min(1, mapY))) * 180 / Math.PI;
        const textureX = ((longitude + 180 + 360) % 360) / 360 * landTextureWidth;
        const textureY = (90 - latitude) / 180 * (landTextureHeight - 1);
        const light = Math.max(.24, .72 + mapY * .12 + nz * .18);
        const landAmount = sampleLand(textureX, textureY);
        const source = [
          24 + (132 - 24) * landAmount,
          73 + (185 - 73) * landAmount,
          105 + (158 - 105) * landAmount
        ];
        const index = (y * image.width + x) * 4;
        image.data[index] = source[0] * light;
        image.data[index + 1] = source[1] * light;
        image.data[index + 2] = source[2] * light;
        image.data[index + 3] = 255;
      }
    }
    context.putImageData(image, 0, 0);
    drawElectronOrbit(-.58, "rgba(89, 235, 218, OPACITY)", electronPhase, ".5");
    drawElectronOrbit(.58, "rgba(141, 111, 255, OPACITY)", -electronPhase * .82, ".42");
  };
  const animate = timestamp => {
    const elapsed = Math.min(50, timestamp - lastFrame);
    lastFrame = timestamp;
    if (!dragging && !reducedMotion) {
      rotation += angularVelocity * elapsed;
      electronPhase = (electronPhase + elapsed * getElectronSpeed()) % (Math.PI * 2);
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
    electronPhase = (electronPhase + elapsed * getElectronSpeed()) % (Math.PI * 2);
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
      buildLandTexture();
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
