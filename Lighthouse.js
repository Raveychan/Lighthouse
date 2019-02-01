const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
    return chrome.kill().then(() => results.lhr)
    });
  });
}

const opts = {
  chromeFlags: ['--show-paint-rectsper', '--headless']
};

const path = process.argv[2];
const repeats = process.argv[3];
let performance
let accessibility
let seo
let bestpractices
let firstcontentfulpaint
let firstmeaningfulpaint
let firstCPUidle
let inputlatency
let interactive
let speedindex

async function run () {
  for (i = 0; i < repeats; i++ ) {
    await launchChromeAndRunLighthouse(path, opts).then(results => {

      if (i <= 0) {
        console.log(path);
      }
      
      console.log(
        [
          results.categories.performance.score * 100,
          results.categories.accessibility.score * 100,
          results.categories.seo.score * 100,
          results.categories['best-practices'].score * 100,
          results.audits['is-on-https']['first-contentful-paint'].displayValue,
          results.audits['is-on-https']['first-meaningful-paint'].displayValue,
          results.audits['is-on-https']['first-cpu-idle'].displayValue,
          results.audits['is-on-https']['estimated-input-latency'].displayValue,
          results.audits['is-on-https'].interactive.displayValue,
          results.audits['is-on-https']['speed-index'].displayValue
        ]
      )

        performance = performance + results.categories.performance.score * 100;
        accessibility = accessibility + results.categories.accessibility.score * 100;
        seo = seo + results.categories.seo.score * 100;
        bestpractices = bestpractices + results.categories['best-practices'].score * 100;
        firstcontentfulpaint = firstcontentfulpaint + results.audits['is-on-https']['first-contentful-paint'].displayValue * 100;
        firstmeaningfulpaint = firstmeaningfulpaint + results.audits['is-on-https']['first-meaningful-paint'].displayValue * 100;
        firstCPUidle = firstCPUidle + results.audits['is-on-https']['first-cpu-idle'].displayValue * 100;
        inputlatency = inputlatency + results.audits['is-on-https']['estimated-input-latency'].displayValue * 100;
        interactive = interactive + results.audits['is-on-https'].interactive.displayValue * 100;
        speedindex = speedindex + results.audits['is-on-https']['speed-index'].displayValue * 100;

    });
  }
  console.log('Average performance' + ' ' + '=' + ' ' + performance / i)
  console.log('Average accessibility' + ' ' + '=' + ' ' + accessibility / i)
  console.log('Average seo' + ' ' + '=' + ' ' + seo / i)
  console.log('Average best-practices' + ' ' + '=' + ' ' + bestpractices / i)
  console.log('Average first contentful paint' + ' ' + '=' + ' ' + firstcontentfulpaint / i)
  console.log('Average first meaningful paint' + ' ' + '=' + ' ' + firstmeaningfulpaint / i)
  console.log('Average first CPU idle' + ' ' + '=' + ' ' + firstCPUidle / i)
  console.log('Average estimated input latency' + ' ' + '=' + ' ' + inputlatency / i)
  console.log('Average time to interactive' + ' ' + '=' + ' ' + interactive / i)
  console.log('Average speed index' + ' ' + '=' + ' ' + speedindex / i)
}
run();
