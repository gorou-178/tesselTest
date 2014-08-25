/**
 * Created by gurimmer on 2014/08/19.
 */

var tessel = require('tessel');
var sdcardlib = require('sdcard');
//    getFilesystems: false,
//    waitForCard: true,
//    watchCard: false
var sdcard = sdcardlib.use(tessel.port['D'], {getFilesystems:true, waitForCard:true, watchCard:true}, function(err, fss){
    console.log("callback: present = " + sdcard.isPresent());
});

sdcard.on('ready', function() {
    console.log("ready: present = " + sdcard.isPresent());
});

sdcard.on('inserted', function(){
    console.log("inserted: present = " + sdcard.isPresent());
});

sdcard.on('removed', function(){
    console.log("removed: present = " + sdcard.isPresent());
});

sdcard.on('error', function(err){
    console.log('error connecting module', err);
});

