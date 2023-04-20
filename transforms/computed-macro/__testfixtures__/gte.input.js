import { gte } from '@ember/object/computed';

class Foo {
  @gte('foo.bar', 9000) bar;
}