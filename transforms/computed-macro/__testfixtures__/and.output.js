class Foo {
  get fooBar() {
    return this.foo && this.bar && this.etc && this.deep?.property;
  }
}