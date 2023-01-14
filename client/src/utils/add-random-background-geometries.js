
export default function addRandomBackgroundGeometries(scene, density = 0.5) {
  // Create a variable to store the number of shapes
  const numShapes = Math.pow(scene.map.size / 75 * density, 2);
  // Create a variable to store the possible shapes
  // const shapeTypes = ['circle', 'rectangle'];
  const shapeTypes = ['rectangle'];

  function getRandomColor() {
    let r = Phaser.Math.RND.integerInRange(0, 255).toString(16);
    let g = Phaser.Math.RND.integerInRange(0, 255).toString(16);
    let b = Phaser.Math.RND.integerInRange(0, 255).toString(16);
    r = (r.length == 1) ? '0' + r : r;
    g = (g.length == 1) ? '0' + g : g;
    b = (b.length == 1) ? '0' + b : b;
    return '0x' + r + g + b;
  }

  // Loop through the number of shapes
  for (let i = 0; i < numShapes; i++) {
    // Choose a random shape type
    let shapeType = Phaser.Math.RND.pick(shapeTypes);
    // Choose a random x and y position
    let x = Phaser.Math.RND.between(0, scene.map.size);
    let y = Phaser.Math.RND.between(0, scene.map.size);
    if (shapeType === 'circle') {
      // Create a random circle
      let circle = scene.add.circle(x, y, Phaser.Math.RND.between(25, 50), getRandomColor(), Phaser.Math.RND.between(0.01, 0.05));
    } else if (shapeType === 'rectangle') {
      // Create a random rectangle
      let width = Phaser.Math.RND.between(50, 100);
      let height = Phaser.Math.RND.between(50, 100);
      let rectangle = scene.add.rectangle(x, y, width, height, getRandomColor(), 0.5, Phaser.Math.RND.between(0.01, 0.05)).setAlpha(0.2);
    }
  }
}