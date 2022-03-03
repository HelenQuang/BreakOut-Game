const rulesBtn = document.getElementById("rules-btn");
const rules = document.getElementById("rules");
const closeBtn = document.getElementById("close-btn");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let score = 0;
let highScore = localStorage.getItem("score");
const brickRowCount = 9;
const brickColumnCount = 6;

//Rules
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));

// Create, draw and move ball
const ball = {
  x: canvas.width / 2, //Position on x
  y: canvas.height / 2, //Position on y
  size: 10,
  speed: 4,
  dx: 4, //Movement direction
  dy: -4,
};

const drawBall = () => {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); //Draw ball into a circle
  context.fillStyle = "#855928";
  context.fill(); //Add color
  context.closePath();
};

const moveBall = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //Wall restriction right and left
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; //To reverse to the other way
  }

  //Wall restriction top and bottom
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  //Ball collision with paddle
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  //Ball collision with bricks
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  //Ball hit bottom wall => lose
  if (ball.y + ball.size > canvas.height) {
    if (localStorage.getItem("score") < score) {
      localStorage.setItem("score", score);
    }

    highScore = localStorage.getItem("score");
    resetBricks();
    score = 0;
    ball.speed = 4;
  }
};

//Create, draw and move paddle
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0, //Dont need dy bc only move up & down
};

const drawPaddle = () => {
  context.beginPath();
  context.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  context.fillStyle = "#855928";
  context.fill();
  context.closePath();
};

const movePaddle = () => {
  paddle.x += paddle.dx;

  //Wall restriction
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
};

//Create and draw bricks
const brickFe = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickFe.w + brickFe.padding) + brickFe.offsetX;
    const y = j * (brickFe.h + brickFe.padding) + brickFe.offsetY;

    bricks[i][j] = { x, y, ...brickFe };
  }
}

const drawBricks = () => {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      context.beginPath();
      context.rect(brick.x, brick.y, brick.w, brick.h);
      context.fillStyle = brick.visible ? "#855928" : "transparent";
      context.fill();
      context.closePath();
    });
  });
};

//Draw score
const drawScore = () => {
  context.font = "24px Dosis";
  context.fillText(`Score: ${score}`, canvas.width - 100, 30);
};

// Draw High Score
const drawHighScore = () => {
  context.font = "24px Dosis";
  context.fillText(
    `High Score: ${localStorage.getItem("score")}`,
    canvas.width - 250,
    30
  );
};

//Increase score
const increaseScore = () => {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {
    resetBricks();
  }
};

const resetBricks = () => {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
};

//Update canvas drawing and animation
const update = () => {
  //Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //Draw everything
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawHighScore();

  //Animation
  movePaddle();
  moveBall();

  requestAnimationFrame(update);
};
update();

//Keyboard event handler
document.addEventListener("keydown", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
});

document.addEventListener("keyup", (e) => {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
});
