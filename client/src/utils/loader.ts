import { EventsObject } from "./EventsObject.ts";

class Loading extends EventsObject {
  imgs = [
    "assets/images/backside.png",
    "assets/images/uno-logo.png",
    "assets/images/draw4-blank.png",
    "assets/images/draw2-blank.png",
    "assets/images/draw2-blue.png",
    "assets/images/draw2-green.png",
    "assets/images/draw2-red.png",
    "assets/images/draw2-yellow.png",
    "assets/images/draw4.png",
    "assets/images/front-black.png",
    "assets/images/front-blue.png",
    "assets/images/front-green.png",
    "assets/images/front-red.png",
    "assets/images/front-yellow.png",
    "assets/images/reverse-blank.png",
    "assets/images/reverse-blue.png",
    "assets/images/reverse-green.png",
    "assets/images/reverse-red.png",
    "assets/images/reverse-yellow.png",
    "assets/images/skip-blank.png",
    "assets/images/skip-blue.png",
    "assets/images/skip-green.png",
    "assets/images/skip-red.png",
    "assets/images/skip-yellow.png",
    "assets/images/wild.png",
  ];

  totalCnt = 0;
  loadedCnt = 0;

  constructor() {
    super();
    this.onProgress = this.onProgress.bind(this);
  }

  load() {
    this.totalCnt = this.imgs.length;
    this.loadedCnt = 0;

    for (const img of this.imgs) {
      this.preloadImage(img);
    }
  }

  preloadImage(url: string) {
    try {
      const _img = new Image();
      _img.src = url;
      _img.onload = this.onProgress;
    } catch (e) {
      console.error("Failed Loading Images");
      console.error(e);
    }
  }

  onProgress() {
    this.loadedCnt++;
    this.fireEvent("progress", this.loadedCnt / this.totalCnt);
    if (this.loadedCnt === this.totalCnt) this.fireEvent("completed");
  }
}

const Loader = new Loading();
export default Loader;
