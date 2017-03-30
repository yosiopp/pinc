#!/usr/bin/env node --use_strict
const path = require('path')
const fs   = require('fs-extra')
const yaml = require('js-yaml')
const argv = require('argv')

const VERSION = JSON.parse(fs.readFileSync('package.json', 'utf8')).version
const INCLUDE_CODE = /\{\{ (\w+) \}\}/g

const opt = ((arg) => {
    if(arg.targets.length == 0) arg.targets.push('pinc.yaml');
    if(!arg.options.hasOwnProperty('dest')) arg.options['dest'] = 'dest';
    if(!arg.options.hasOwnProperty('template')) arg.options['template'] = 'template';
    if(!arg.options.hasOwnProperty('partial')) arg.options['partial'] = 'partial';
    return arg;
})(argv.version(VERSION).option([
    { name:'dest', short:'d', type:'string', description :'destination directory', example: "pinc -d dest" },
    { name:'template', short:'t', type:'string', description :'template directory', example: "pinc -t template" },
    { name:'partial', short:'p', type:'string', description :'partial directory', example: "pinc -p partial" },
]).run());

try {
    var doc = yaml.safeLoad(fs.readFileSync(opt.targets[0], 'utf8'))
} catch(e) {
    console.error('Error: require pinc.yaml')
    process.exit(1)
}

for (var id in doc) {
    var url = doc[id].url
    var tmpl = doc[id].template
    var part = doc[id].partial
    try {
        console.log(`${id} -> ${path.join(opt.options.dest, url)}`)
        build(url, tmpl, part)
    } catch(e) {
        console.error('' + e);
    }
}

function readFrom(dir, file){
    return fs.readFileSync(path.join(dir, file), 'utf8')
}

function build(url, template, partials) {
    let dest = readFrom(opt.options.template, template)
    let places = dest.match(INCLUDE_CODE).map((m) => { return m.replace(/[\{ \}]/g,"") })
    for(let i in places){
        let key = places[i]
        let part = ""
        try{
            let path = partials[key].trim()
            if(0 == path.indexOf('@')){
                // if start with '@' then treat as immidiate value.
                part = path.substring(1)
            }
            else {
                // read from partial file
                part = readFrom(opt.options.partial, path)
            }
        } catch(e){
            e.name = 'Warn'
            console.warn('' + e)
        }
        dest = dest.replace(`{{ ${key} }}`, part)
    }
    fs.outputFileSync(path.join(opt.options.dest, url), dest)
}