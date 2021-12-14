let cam;
let poseNet;
let btn1, btn2, btn3;
let controller = "Section 1";
let handL, handR;

setup = () => {
    createCanvas(windowWidth, windowHeight);
    cam = createCapture(VIDEO);
    cam.hide();
    cam.size(windowWidth, windowHeight);
    poseNet = ml5.poseNet(cam, {
        flipHorizontal: true //flips interaction
    }, modelReady);
    poseNet.on('pose', gotPoses);

    handL = createVector(width / 2, height / 2);
    handR = createVector(width / 2, height / 2);

    noStroke();
    btn1 = new HButton((width / 2) - 200, height - 200, "try me!");
    btn2 = new HButton((width / 2), height - 200, "mysterious!");
    btn3 = new HButton((width / 2) + 200, height - 200, "???");
}

let gotPoses = (poses) => {
    //console.log(poses);
    //only detect if there is a person
    if (poses.length > 0) {
        handL.x = lerp(poses[0].pose.keypoints[9].position.x, handL.x, 0.5);
        handL.y = lerp(poses[0].pose.keypoints[9].position.y, handL.y, 0.5);
        handR.x = lerp(poses[0].pose.keypoints[10].position.x, handR.x, 0.5);
        handR.y = lerp(poses[0].pose.keypoints[10].position.y, handR.y, 0.5);
    }
}

let modelReady = () => {
    console.log('model ready');
}

draw = () => {
    //flip the video to match interaction
    push();
    translate(windowWidth, 0);
    scale(-1.0, 1.0);
    image(cam, 0, 0, windowWidth, windowHeight);
    scale(1.0, 1.0);
    pop();

    //Fade background
    fill(250, 250, 250, 200);
    rect(0, 0, width, height);

    //draw buttons, pass in hand positions to check if over
    btn1.update(handL.x, handL.y, handR.x, handR.y);
    btn2.update(handL.x, handL.y, handR.x, handR.y);
    btn3.update(handL.x, handL.y, handR.x, handR.y);

    //draw hands
    fill(255, 88, 113);
    ellipse(handL.x, handL.y, 50);
    ellipse(handR.x, handR.y, 50);

    //draw content
    fill(50);
    textAlign(CENTER);
    textSize(15);

    if (controller == "try me!") {
        text("Hi! Welcome! This station opened on December 10, 2017.", width / 2, height - 450);
    }
    if (controller == "mysterious!") {
        text("Qingdao Metro Line 2's symbol color is red.", width / 2, height - 450);
    }
    if (controller == "???") {
        text("Nearby we have Qingdao University Fushan Campus (East Gate).", width / 2, height - 450);
    }

}

class HButton {
    constructor(posX, posY, label) {
        this.x = posX;
        this.y = posY;
        this.label = label;
        this.hover = 0;
    }

    update(lx, ly, rx, ry) {
        rectMode(CENTER);
        fill(175, 39, 47);
        rect(this.x, this.y, 160, 100);

        let ld = dist(this.x, this.y, lx, ly);
        let rd = dist(this.x, this.y, rx, ry);
        if (ld < 50 || rd < 50) {
            this.hover += 2;
            if (this.hover > 120) {
                controller = this.label;
                this.hover -= 6;
            }
        } else {
            if (this.hover > 0) this.hover -= 6;
            if (this.hover < 0) this.hover = 0;
        }
        fill(255, 148, 154);

        rect(this.x, this.y, this.hover, 60);

        rectMode(CORNERS);
        fill(255);
        textAlign(CENTER);
        textSize(23);
        fontFamily: "futura";
        //can't change font
        text(this.label, this.x, this.y + 9);
    }
}
