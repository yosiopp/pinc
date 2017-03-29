#!/usr/bin/env node --use_strict
const path = require('path')
const fs   = require('fs-extra')
const yaml = require('js-yaml')

const INCLUDE_CODE = /\{\{ (\w+) \}\}/g

try {
    var doc = yaml.safeLoad(fs.readFileSync('pinc.yaml', 'utf8'))
} catch(e) {
    console.error('Error: require pinc.yaml')
    process.exit(1)
}

for (var id in doc) {
    var url = doc[id].url
    var tmpl = doc[id].template
    var part = doc[id].partial
    try {
        console.log(`${id} -> ${url}`)
        build(url, tmpl, part)
    } catch(e) {
        console.error('' + e);
    }
}

function readFrom(dir, file){
    return fs.readFileSync(path.join(dir, file), 'utf8')
}

function build(url, template, partials) {
    let dest = readFrom('template', template)
    let places = dest.match(INCLUDE_CODE).map((m) => { return m.replace(/[\{ \}]/g,"") })
    for(let i in places){
        let key = places[i]
        let part = ""
        try{
            part = readFrom('partial', partials[key])
        } catch(e){
            e.name = 'Warn'
            console.warn('' + e)
        }
        dest = dest.replace(`{{ ${key} }}`, part)
    }
    fs.outputFileSync(path.join('dest', url), dest)
}