import { gt } from '@ember/object/computed';

class Foo {
  @gt('foo.bar', 9000) bar;
}