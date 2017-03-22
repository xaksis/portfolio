---
title: Add filters in Vue 2
description: How to add filters in Vue 2
type: blog
img: /images/codebits.png
layout: ./src/markup/layout/blog.handlebars
createDate: 2017-03-21T13:29:35.000Z
---

Just started experimenting with [Vue](https://vuejs.org/) and I must say, out of all the javascript frameworks I've experimented with recently (react, angular 2), Vue makes the most sense to me and has the fastest 0-60. One of the first things I had to look up a bit was how to add custom filters. It seems like vue 2 has decided to get rid of its in-built filters. So i'm going to quickly go over it in case anyone else is looking as well. 

# Your single page view component
so the single page view comoponent probably has a script part that looks like this

```javascript
export default {
  name: 'Learn',
  data () {
    return {
      message: 'You loaded this page on ' + new Date(),
    }
  }
}
```

# Create a filters file
Let's first create a javascript file that holds all our filters. 

```javascript
// filters/index.js

function capitalize(value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export { capitalize }
```
As you can see we have created a capitalize function and are exporting that. If you have more than one, you can export all of them like so: ` export {capitalize, filter 2, filter 3} `

# Import filters in our component
Going back to our component, we can now import the filters in there
```javascript
import {capitalize} from '../filters'

export default {
  name: 'Learn',
  data () {
    return {
      message: 'You loaded this page on ' + new Date(),
    }
  }
}
```
but wait... we're not done yet.

# Add the imported function to component's methods
```javascript
import {capitalize} from '../filters'

export default {
  name: 'Learn',
  data () {
    return {
      message: 'You loaded this page on ' + new Date(),
    }
  },
  methods: {
    capitalize
    //other methods...
  }
}
```
that's it! we're done. now to use it in the template all we have to do is: 
```html
<span>{{ capitalize(something) }}</span>
```