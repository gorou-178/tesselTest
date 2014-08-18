/**
 * Created by gurimmer on 2014/08/19.
 */

var tessel = require('tessel');
var sdcardlib = require('sdcard');
var sdcard = sdcardlib.use(tessel.port['D'], {getFilesystems: true, watchCard: true}, function(err, fss){
    console.log("getFilesystems");
});

/*
    watchCard: trueの場合
    sdカード差し込む→inserted→ready→外す→removed→付ける→(なし)→外す→removed
*/

/*
    オプションなし(カード付き)
    ready→終了
 */

/*
    オプションなし(カードなし)
    sdカード差し込む→エラー
 */

/*
    オプション(getFilesystems: true)
    sdカード差し込む→use callback→ready
 */

/*
    オプション(getFilesystems: true, watchCard: true)外した状態
    sdカード差し込む→inserted→use callback→ready→外す→removed→付ける→なし→外す→removed
 */

/*
    オプション(getFilesystems: true, watchCard: true)差し込んだ状態
    use callback→ready→外す→removed→付ける→inserted→外す→removed
 */

sdcard.on('ready', function() {
    console.log("ready");
    console.log("sdcard present: " + sdcard.isPresent());
});

sdcard.on('inserted', function(){
    console.log("inserted");
});

sdcard.on('removed', function(){
    console.log("removed");
});

sdcard.on('error', function(err){
    console.log('error connecting module', err);
});

