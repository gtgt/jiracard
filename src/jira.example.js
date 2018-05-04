import https from 'https';

export default {
  projects() {
    return new Promise(function(resolve, reject) {
      resolve([
      ]);
    });
  },
  issues(project) {
    return new Promise(function(resolve, reject) {
      https.get('https://raw.githubusercontent.com/gtgt/jiracard/master/example.json', (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^(application\/json|text\/plain)/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
          console.error(error.message);
          // consume response data to free up memory
          res.resume();
          return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData.issues);
          } catch (e) {
            console.error(e.message);
          }
        });
      }).on('error', (e) => {
        reject(e.message);
      });
    });
  }
}