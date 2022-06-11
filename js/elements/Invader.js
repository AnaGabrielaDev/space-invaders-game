export class Invader {
  x;
  y;
  rank;
  file;
  type;
  width;
  height;
  image;

  constructor(x, y, rank, file, type, image) {
    this.x = x;
    this.y = y;
    this.rank = rank;
    this.file = file;
    this.type = type;
    this.width = 18;
    this.height = 25;
    this.image = image;
  }
}
