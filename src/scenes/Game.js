import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
    this.scaleRatio = window.devicePixelRatio / 3;
    this.playerspeed = 250;

    this.is_holding = {
      left: false,
      right: false,
      direction: false,
    };
  }

  preload() {
    this.load.setPath("assets");

    this.load.image("background", "bg.png");
    this.load.image("levelmap", "levelmap.png");
    this.load.image("ground", "ground.png");
    this.load.image("block", "block.png");

    this.load.atlas("greycat", "greycatspritesheet.png", "greycatsprite.json");
    this.load.atlas("mouseidle", "mouseidlesheet.png", "mouseidlesheet.json");
    this.load.atlas("mouserun", "mouserunsheet.png", "mouserunsheet.json");
    this.load.atlas("mousedie", "mousediesheet.png", "mousediesheet.json");

    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
  }

  create() {
    this.add.image(512, 384, "background");

    let level = this.add.image(0, 0, "levelmap").setDepth(100);
    level.setPosition(this.width / 2, this.height / 2.3);

    this.ground = this.add.group();

    this.sand = this.add
      .sprite(this.width / 2, this.height / 2, "ground")
      .setDepth(101);

    this.platform = this.add
      .tileSprite(this.width / 2, this.height / 1.2, 10 * 32, 1 * 32, "ground")
      .setScale((this.scaleRatio * this.width) / 2, this.scaleRatio * 3);
    this.physics.add.existing(this.platform, true);
    this.ground.add(this.platform);

    this.cat = this.physics.add
      .sprite(this.width / 2, this.height / 2, "greycat")
      .setDepth(200)
      .setScale(this.scaleRatio * 10)
      .refreshBody();

    this.physics.add.existing(this.cat);

    this.cat.setCollideWorldBounds(true);

    this.physics.add.collider(this.cat, this.ground);
    this.cursor = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    // Create all animations for the player

    // Idle
    this.anims.create({
      key: "standing",
      frames: this.anims.generateFrameNames("greycat", {
        prefix: "idlefront",
        end: 3,
        zeroPad: 4,
      }),
      repeat: -1,
    });

    // Run right
    this.anims.create({
      key: "runright",
      frames: this.anims.generateFrameNames("greycat", {
        prefix: "runright",
        end: 7,
        zeroPad: 4,
      }),
      repeat: -1,
    });

    // Run left
    this.anims.create({
      key: "runleft",
      frames: this.anims.generateFrameNames("greycat", {
        prefix: "runleft",
        end: 7,
        zeroPad: 4,
      }),
      repeat: -1,
    });

    this.ap = this.input.activePointer;

    let w = 0.45 * this.width;
    let h = this.height;
    this.zone_left = this.add.zone(0, 0, w, h);
    this.zone_left.setOrigin(0, 0);
    this.zone_left.setScrollFactor(0);
    this.zone_left.setDepth(500);

    this.zone_right = this.add.zone(this.width, 0, w, h);
    this.zone_right.setOrigin(1, 0);
    this.zone_right.setScrollFactor(0);
    this.zone_right.setDepth(500);

    this.zone_left.setInteractive();
    this.zone_right.setInteractive();

    this.zone_left.on(
      "pointerdown",
      () => {
        this.holdLeft();
      },
      this
    );
    this.zone_left.on(
      "pointerup",
      () => {
        this.releaseLeft();
      },
      this
    );
    this.zone_left.on("pointerover", () => {
      this.enterLeft();
    });
    this.zone_left.on("pointerout", () => {
      this.releaseLeft();
    });

    this.zone_right.on(
      "pointerdown",
      () => {
        this.holdRight();
      },
      this
    );
    this.zone_right.on(
      "pointerup",
      () => {
        this.releaseRight();
      },
      this
    );
    this.zone_right.on("pointerover", () => {
      this.enterRight();
    });
    this.zone_right.on("pointerout", () => {
      this.releaseRight();
    });
    /* HOW TO ADD TEXT
    this.add
      .text(
        512,
        490,
        "Make something fun!\nand share it with us:\nsupport@phaser.io",
        {
          fontFamily: "Arial Black",
          fontSize: 38,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        }
      )
      .setOrigin(0, 0.5)
      .setDepth(100);
      */
  }

  update(time, delta) {
    const { left, right } = this.cursor;

    if (
      left.isDown ||
      this.keyA.isDown ||
      this.is_holding.direction == "left"
    ) {
      this.cat.setVelocityX(-this.playerspeed);
      this.cat.anims.play("runleft", true);
    } else if (
      right.isDown ||
      this.keyD.isDown ||
      this.is_holding.direction == "right"
    ) {
      this.cat.setVelocityX(this.playerspeed);
      this.cat.anims.play("runright", true);
    } else {
      this.cat.setVelocityX(0);
      this.cat.anims.play("standing", true);
    }
  }

  holdLeft() {
    this.is_holding.left = true;
    this.is_holding.direction = "left";
    console.log("left");
  }

  holdRight() {
    this.is_holding.right = true;
    this.is_holding.direction = "right";
    console.log(this.is_holding.direction);
  }

  releaseLeft() {
    this.is_holding.left = false;
    this.is_holding.direction = false;
  }

  releaseRight() {
    this.is_holding.right = false;
    this.is_holding.direction = false;
  }

  enterLeft() {
    if (this.ap.leftButtonDown()) {
      this.is_holding.left = true;
      this.is_holding.direction = "left";

      if (this.is_holding.right) {
        this.is_holding.right = false;
      }
    }
  }

  enterRight() {
    if (this.ap.leftButtonDown()) {
      this.is_holding.right = true;
      this.is_holding.direction = "right";

      if (this.is_holding.left) {
        this.is_holding.left = false;
      }
    }
  }
}
