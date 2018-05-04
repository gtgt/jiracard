  export default {
    create(issue) {
      // Require library
      let gd = require('node-gd');
      let w = 80, h = Math.round(issue.fields.summary.length * 7.5), lh = 13, p = 10;
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
      img.savePng('jiracard.png', 1, function(err) {
        if(err) {
          throw err;
        }
      });

      // Destroy image to clean memory
      img.destroy();
    }
  }
