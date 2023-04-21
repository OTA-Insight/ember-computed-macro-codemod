# computed-macro


## Usage

```
npx ember-computed-macro-codemod path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js computed-macro path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [add-computed-decorator-import](#add-computed-decorator-import)
* [add-computed-decorator](#add-computed-decorator)
* [alias](#alias)
* [and](#and)
* [cleanup-imports](#cleanup-imports)
* [equal](#equal)
* [gt](#gt)
* [gte](#gte)
* [ignore-object-syntax](#ignore-object-syntax)
* [lt](#lt)
* [lte](#lte)
* [or](#or)
* [read-only](#read-only)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="add-computed-decorator-import">**add-computed-decorator-import**</a>

**Input** (<small>[add-computed-decorator-import.input.js](transforms/computed-macro/__testfixtures__/add-computed-decorator-import.input.js)</small>):
```js
import { set } from '@ember/object';
import { readOnly } from '@ember/object/computed';

class Foo {
  @readOnly('foo.bar') bar;

  etc() {
    set(this, 'test', 1);
  }
}
```

**Output** (<small>[add-computed-decorator-import.output.js](transforms/computed-macro/__testfixtures__/add-computed-decorator-import.output.js)</small>):
```js
import { set, computed } from '@ember/object';

class Foo {
  @computed('foo.bar')
  get bar() {
    return this.foo?.bar;
  }

  etc() {
    set(this, 'test', 1);
  }
}
```
---
<a id="add-computed-decorator">**add-computed-decorator**</a>

**Input** (<small>[add-computed-decorator.input.js](transforms/computed-macro/__testfixtures__/add-computed-decorator.input.js)</small>):
```js
import { readOnly } from '@ember/object/computed';

class Foo {
  @readOnly('foo.bar') bar;

  @and('foo', 'bar', 'etc') fooBar;
}
```

**Output** (<small>[add-computed-decorator.output.js](transforms/computed-macro/__testfixtures__/add-computed-decorator.output.js)</small>):
```js
import { computed } from '@ember/object';

class Foo {
  @computed('foo.bar')
  get bar() {
    return this.foo?.bar;
  }

  @computed('foo', 'bar', 'etc')
  get fooBar() {
    return this.foo && this.bar && this.etc;
  }
}
```
---
<a id="alias">**alias**</a>

**Input** (<small>[alias.input.js](transforms/computed-macro/__testfixtures__/alias.input.js)</small>):
```js
import { alias } from '@ember/object/computed';

class Foo {
  @alias('foo.bar') fooBar;
}
```

**Output** (<small>[alias.output.js](transforms/computed-macro/__testfixtures__/alias.output.js)</small>):
```js
class Foo {
  get fooBar() {
    return this.foo?.bar;
  }

  set fooBar(value) {
    this.foo.bar = value;
  }
}
```
---
<a id="and">**and**</a>

**Input** (<small>[and.input.js](transforms/computed-macro/__testfixtures__/and.input.js)</small>):
```js
import { and } from '@ember/object/computed';

class Foo {
  @and('foo', 'bar', 'etc') fooBar;
}
```

**Output** (<small>[and.output.js](transforms/computed-macro/__testfixtures__/and.output.js)</small>):
```js
class Foo {
  get fooBar() {
    return this.foo && this.bar && this.etc;
  }
}
```
---
<a id="cleanup-imports">**cleanup-imports**</a>

**Input** (<small>[cleanup-imports.input.js](transforms/computed-macro/__testfixtures__/cleanup-imports.input.js)</small>):
```js
import { readOnly, uniqBy } from '@ember/object/computed';

class Foo {
  @readOnly('foo.bar') bar;

  @uniqBy('fruits', 'id') uniqueFruits;
}
```

**Output** (<small>[cleanup-imports.output.js](transforms/computed-macro/__testfixtures__/cleanup-imports.output.js)</small>):
```js
import { uniqBy } from '@ember/object/computed';

class Foo {
  get bar() {
    return this.foo?.bar;
  }

  @uniqBy('fruits', 'id') uniqueFruits;
}
```
---
<a id="equal">**equal**</a>

**Input** (<small>[equal.input.js](transforms/computed-macro/__testfixtures__/equal.input.js)</small>):
```js
import { equal } from '@ember/object/computed';

class Foo {
  @equal('foo.bar', 1) isOne;
}
```

**Output** (<small>[equal.output.js](transforms/computed-macro/__testfixtures__/equal.output.js)</small>):
```js
class Foo {
  get isOne() {
    return this.foo?.bar === 1;
  }
}
```
---
<a id="gt">**gt**</a>

**Input** (<small>[gt.input.js](transforms/computed-macro/__testfixtures__/gt.input.js)</small>):
```js
import { gt } from '@ember/object/computed';

class Foo {
  @gt('foo.bar', 9000) bar;
}
```

**Output** (<small>[gt.output.js](transforms/computed-macro/__testfixtures__/gt.output.js)</small>):
```js
class Foo {
  get bar() {
    return this.foo?.bar > 9000;
  }
}
```
---
<a id="gte">**gte**</a>

**Input** (<small>[gte.input.js](transforms/computed-macro/__testfixtures__/gte.input.js)</small>):
```js
import { gte } from '@ember/object/computed';

class Foo {
  @gte('foo.bar', 9000) bar;
}
```

**Output** (<small>[gte.output.js](transforms/computed-macro/__testfixtures__/gte.output.js)</small>):
```js
class Foo {
  get bar() {
    return this.foo?.bar >= 9000;
  }
}
```
---
<a id="ignore-object-syntax">**ignore-object-syntax**</a>

**Input** (<small>[ignore-object-syntax.input.js](transforms/computed-macro/__testfixtures__/ignore-object-syntax.input.js)</small>):
```js
import Component from '@ember/component';
import { and, gt } from '@ember/object/computed';

export default Component.extend({
  propAnd: and('x', 'y'),

  propGt: gt('x', 123),
});

```

**Output** (<small>[ignore-object-syntax.output.js](transforms/computed-macro/__testfixtures__/ignore-object-syntax.output.js)</small>):
```js
import Component from '@ember/component';
import { and, gt } from '@ember/object/computed';

export default Component.extend({
  propAnd: and('x', 'y'),

  propGt: gt('x', 123),
});

```
---
<a id="lt">**lt**</a>

**Input** (<small>[lt.input.js](transforms/computed-macro/__testfixtures__/lt.input.js)</small>):
```js
import { lt } from '@ember/object/computed';

class Foo {
  @lt('foo.bar', 9000) bar;
}
```

**Output** (<small>[lt.output.js](transforms/computed-macro/__testfixtures__/lt.output.js)</small>):
```js
class Foo {
  get bar() {
    return this.foo?.bar < 9000;
  }
}
```
---
<a id="lte">**lte**</a>

**Input** (<small>[lte.input.js](transforms/computed-macro/__testfixtures__/lte.input.js)</small>):
```js
import { lte } from '@ember/object/computed';

class Foo {
  @lte('foo.bar', 9000) bar;
}
```

**Output** (<small>[lte.output.js](transforms/computed-macro/__testfixtures__/lte.output.js)</small>):
```js
class Foo {
  get bar() {
    return this.foo?.bar <= 9000;
  }
}
```
---
<a id="or">**or**</a>

**Input** (<small>[or.input.js](transforms/computed-macro/__testfixtures__/or.input.js)</small>):
```js
import { or } from '@ember/object/computed';

class Foo {
  @or('foo', 'bar') fooBar;
}
```

**Output** (<small>[or.output.js](transforms/computed-macro/__testfixtures__/or.output.js)</small>):
```js
class Foo {
  get fooBar() {
    return this.foo || this.bar;
  }
}
```
---
<a id="read-only">**read-only**</a>

**Input** (<small>[read-only.input.js](transforms/computed-macro/__testfixtures__/read-only.input.js)</small>):
```js
import { readOnly } from '@ember/object/computed';

class Foo {
  @readOnly('foo.bar') bar;
}
```

**Output** (<small>[read-only.output.js](transforms/computed-macro/__testfixtures__/read-only.output.js)</small>):
```js
class Foo {
  get bar() {
    return this.foo?.bar;
  }
}
```
<!--FIXTURES_CONTENT_END-->