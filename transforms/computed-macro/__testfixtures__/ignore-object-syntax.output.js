import Component from '@ember/component';
import { and, gt } from '@ember/object/computed';

export default Component.extend({
  propAnd: and('x', 'y'),

  propGt: gt('x', 123),
});
