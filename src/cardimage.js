export default {
  create(issue) {
    return new Promise(function(resolve, reject) {
      // Require library
      let gd = require('node-gd');
      let w = 136, h = Math.round(issue.fields.summary.length * 7.5) + 30, lh = 13, p = 0;
      // Create blank new image in memory
      let img = gd.createSync(w, h);

      // Set background color
      img.colorAllocate(255, 255, 255);

      // Set text color
      let txtColor = img.colorAllocate(0, 0, 0);

      // Set full path to font file
      let fontPath = 'fonts/NotoMono-Regular.ttf';

      // Render string in image
      img.stringFT(txtColor, fontPath, 11, 4.71239, w - p - lh, p, issue.key);
      img.stringFT(txtColor, fontPath, 9, 4.71239, w - p - (lh * 2), p, issue.fields.summary);

      // Write image buffer to disk
      //img.savePng('jiracard.png', 1, function(err) {
      img.saveJpeg('jiracard.jpg', 100, function(err) {
        if(err) {
          throw err;
        }
        resolve('jiracard.jpg');
      });

      // Destroy image to clean memory
      img.destroy();
    });
  }
}
