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
    this.width = 19;
    this.height = 23;
    this.image = image;
  }
}
