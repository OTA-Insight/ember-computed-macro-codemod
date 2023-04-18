import { lt } from '@ember/object/computed';

class Foo {
  @lt('foo.bar', 9000) bar;
}