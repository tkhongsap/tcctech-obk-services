import { encodePassword } from '../../src/utils/encrypt';

describe('buzzebee encrypt password', () => {
  test.each([
    ['P@ssword000', '9dhlfJIKP7V2bYz8aNfK1w==', 'SLa6zQrFUfOtOuOd2GCtsGK+QTw='],
    ['P@ssword002', 'N7urLmzn3867CsD8KteN7g==', 'xiTv5Lvg4yLXbG4xjDkZEz+xAp4='],
    ['P@ssword003', 'dQD8IBeHyXEwBNMZAUFOhg==', 'CnNxIHTI42Lq667jmvaYbNzPbQ0='],
    [
      'iLoveOBK2025!',
      'PLbWU/U3LpaYIp3kJB1gqw==',
      'yD85yo3nlR31R4IUwuKsSQyfB9s=',
    ],
    [
      'HelloWorld98101157!',
      'oiXQoTbgfXjUh+0X4dAyRA==',
      'h3Wu0xNONQnoexb88f+zRfzQKes=',
    ],
    ['ExPat001!', 'NEngf6y4/NH7ZkDTaJNPDQ==', 'gtNXGEkGA+cbXhw19PHI6qx+NY8='],
  ])('encodePassword', (password, salt, expected) => {
    const hashPassword = encodePassword(password, salt);
    expect(hashPassword).toEqual(expected);
  });
});
