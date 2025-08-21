    const canvas = document.getElementById("linacCanvas");
    const ctx = canvas.getContext("2d");

    const tubeCount = 6;
    const tubeWidth = 50; // kürzere Röhren
    const gapWidth = 50; // Abstand für Beschleunigungsstrecke
    const tubeHeight = 80;
    const tubes = [];
    const offsetX = 100;

    let particle = {
      x: offsetX - 20,
      y: canvas.height / 2,
      radius: 10,
      v: 1
    };

    let score = 0;
    let highscore = localStorage.getItem("linacHighscore") || 0;
    document.getElementById("highscore").textContent = highscore;

    for (let i = 0; i < tubeCount; i++) {
      tubes.push({
        x: offsetX + i * (tubeWidth + gapWidth),
        polarity: i % 2 === 0 ? -1 : 1 // -1 = negativ (anziehend), 1 = positiv (abstoßend)
      });
    }

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      tubes.forEach((tube) => {
        if (
          mx >= tube.x &&
          mx <= tube.x + tubeWidth &&
          my >= particle.y - tubeHeight / 2 &&
          my <= particle.y + tubeHeight / 2
        ) {
          tube.polarity *= -1;
        }
      });
    });

    function update() {
      tubes.forEach((tube, i) => {
        const nextX = i < tubes.length - 1 ? tubes[i + 1].x : canvas.width;
        const accelZoneStart = tube.x + tubeWidth;
        const accelZoneEnd = nextX;

        if (particle.x >= accelZoneStart && particle.x <= accelZoneEnd) {
          const fieldPolarity = tube.polarity;
          const force = fieldPolarity === 1 ? -0.1 : 0.1;
          particle.v += force;
        }
      });

      particle.x += particle.v;
      if (particle.v < 0) particle.v = 0;

      score = Math.floor(particle.v * 100);
      document.getElementById("score").textContent = score;

      if (particle.x > canvas.width - 20) {
        if (score > highscore) {
          localStorage.setItem("linacHighscore", score);
          alert("🏆 Neuer Highscore: " + score);
        } else {
          alert("🏍️ Spiel beendet! Dein Score: " + score);
        }
        reset();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Teilchenquelle
      ctx.fillStyle = "magenta";
      ctx.fillRect(offsetX - 60, particle.y - 30, 40, 60);

      // Röhren
      tubes.forEach((tube) => {
        ctx.fillStyle = tube.polarity === -1 ? "#cce5ff" : "#ffcccc";
        ctx.fillRect(tube.x, particle.y - tubeHeight / 2, tubeWidth, tubeHeight);
        ctx.strokeStyle = "black";
        ctx.strokeRect(tube.x, particle.y - tubeHeight / 2, tubeWidth, tubeHeight);

        ctx.fillStyle = "black";
        ctx.font = "20px sans-serif";
        ctx.fillText(tube.polarity === 1 ? "+" : "-", tube.x + tubeWidth / 2 - 5, particle.y + 7);
      });

      // Teilchen
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.fillText("+", particle.x - 4, particle.y + 5);
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    function reset() {
      particle.x = offsetX - 20;
      particle.v = 1;
      score = 0;
      document.getElementById("score").textContent = score;
      document.getElementById("highscore").textContent = localStorage.getItem("linacHighscore");
    }

    loop();
