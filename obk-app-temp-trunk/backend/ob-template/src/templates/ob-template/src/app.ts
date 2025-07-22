import { createServer } from './utils/server';

createServer()
  .then((server) => {
    server.listen(3000, () => {
      console.log(`Listening on http://localhost:3000`);
    });
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });
