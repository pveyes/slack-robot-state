# slack-robot-state

> [slack-robot](https://github.com/traveloka/slack-robot) plugin to enable state management

## Installing

You need to install slack-robot (if you still use npm version 2, it will be installed
for you because it's listed as peer dependencies)

```sh
$ npm install slack-robot slack-robot-state --save
```

## Usage

Specify path where you want to store the state

```js
var SlackRobot = require('slack-robot');
var state = require('slack-robot-state');
var robot = new SlackRobot('slack-token');

// if the file doesn't exist, it will be created for you
var stateFile = '/path/to/your/state/file.json';

// enable plugin
robot.use(state(stateFile));

// start using it
robot.setState({ key: 'value' });

if (robot.state.key === 'value') {
  // do something
}
```

## License

MIT