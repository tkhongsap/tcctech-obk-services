import { createServer } from './utils/server';

createServer()
  .then((server) => {
    server.listen(3000, () => {
      console.log(
        `Listening service notification dev on http://localhost:3000`,
      );
    });
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
    console.log('trigger deploy')
  });
