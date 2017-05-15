'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs-extra');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the mathematical ' + chalk.red('generator-devlee') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'Input your project name'
    }, {
      type: 'list',
      name: 'type',
      message: 'Choose your project type',
      choices: [
        {
          name: 'react-ts',
          value: 'react-ts'
        }
      ]
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  default() {
    const map = {
      'react-ts': './react-ts'
    };
    const type = this.props.type;
    const dir = map[type];
    if (dir) {
      // 拷贝templates下面对应的文件夹至新项目目录
      fs.copySync(
        this.templatePath(`${dir}`),
        this.destinationPath(this.props.projectName)
      );
      // 如果是react-ts项目，修改配置文件
      if (type === 'react-ts') {
        fs.removeSync(`${this.props.projectName}/config.json`);
        this.fs.copyTpl(
          this.templatePath(`${dir}/config.json`),
          this.destinationPath(`${this.props.projectName}/config.json`),
          {
            appName: this.props.projectName
          }
        );
      }
    }
  }

  install() {
    process.chdir(process.cwd() + '/' + this.props.projectName);
    this.yarnInstall();
  }
};
