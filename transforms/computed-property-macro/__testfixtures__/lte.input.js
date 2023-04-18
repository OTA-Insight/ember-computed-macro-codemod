import { lte } from '@ember/object/computed';

class Foo {
  @lte('foo.bar', 9000) bar;
}