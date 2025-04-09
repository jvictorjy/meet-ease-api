export class BcryptDIToken {
  public static readonly HashComparer: unique symbol = Symbol('HashComparer');
  public static readonly HashGenerator: unique symbol = Symbol('HashGenerator');

  public static readonly Encrypter: unique symbol = Symbol('Encrypter');
}
