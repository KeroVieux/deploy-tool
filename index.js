#!/usr/bin/env node

/**
 * Module dependencies.
 */
const program = require('commander')
const shell = require('shelljs')

const SERVER = ''
const SERVER_PATH = ''

program
    .command('deploy [project]')
    .alias('d')
    .description('发布到服务器')
    .action(async (project) => {
      if (project) {
        shell.exec(`tar -zcvf ${process.cwd()}/dist.tar.gz dist/*`)
        shell.exec(`ssh root@${SERVER} "cd ${SERVER_PATH}/${project} ; rm -rf *"`)
        shell.exec(`scp ${process.cwd()}/dist.tar.gz root@${SERVER}:${SERVER_PATH}/${project}`)
        shell.exec(
            `ssh root@${SERVER} "cd ${SERVER_PATH}/${project} ; tar -zxvf dist.tar.gz ; mv ${SERVER_PATH}/${project}/dist/* ${SERVER_PATH}/${project} ; rm -rf dist.tar.gz ; rm -rf dist"`
        )
        shell.exec(`rm -rf ${process.cwd()}/dist.tar.gz`)
      } else {
        program.help()
      }
    })
program.command('*').action(() => {
  return program.help()
})
program.parse(process.argv)
