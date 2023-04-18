import { computed } from '@ember/object';

class Foo {
  @computed('foo.bar')
  get bar() {
    return this.foo.bar;
  }

  @computed('foo', 'bar', 'etc')
  get fooBar() {
    return this.foo && this.bar && this.etc;
  }
}