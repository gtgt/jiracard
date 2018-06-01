import fs from 'fs';
import request from 'request';
import PDFDocument from 'pdfkit';

export default {
  create(issue) {
    return new Promise(function(resolve, reject) {
      // Create a document
      let doc = new PDFDocument;

      // Pipe its output somewhere, like to a file or HTTP response
      // See below for browser usage
      doc.pipe(fs.createWriteStream('tmp/jiracard.pdf'));

      // Embed a font, set the font size, and render some text
      doc.font('fonts/NotoMono-Regular.ttf');

      // Render string in image
      doc.fontSize(11).text(issue.key).moveDown();
      doc.fontSize(9).text(issue.fields.summary);

      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      if (issue.fields.assignee) {
        let avatarUrl = issue.fields.assignee.avatarUrls['48x48'];
        request.get({url: avatarUrl, encoding: null}, function(error, response, body) {
          doc.image(body, 320, 0, {fit: [48, 48]});
          doc.end();
        });
      } else {
        doc.end();
      }
    });
  }
}
