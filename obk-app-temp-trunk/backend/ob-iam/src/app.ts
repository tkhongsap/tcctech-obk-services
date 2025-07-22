import { createServer } from './utils/server';

createServer()
  .then((server) => {
    server.listen(3000, () => {
      console.log(`Listening service iam dev on http://localhost:3000`);
      console.log('trigger');
    });
  })
  .catch((err) => {
    console.log(`Error: ${err} `);
  });
