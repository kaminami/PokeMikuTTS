PokeMikuTTS
===========

ポケット・ミクで、簡易なText to Speechを実現するライブラリ。大変な棒読み。


2014年6月時点では、Google Chromeでのみ動作する。

[ミク語変換API]( http://aikelab.net/mikugo/)を利用させていただいている。
こちらはライブラリ製作者の提供するサービスではないので、使用時には注意していただきたい。

## Requirements
* jQuery
* Underscore.js
* NSX-1互換モードに設定されたポケミク


## Example
```JavaScript

var sentence = '犬も歩けば棒に当たる';
var engine = new PokeMikuTTS.TTSEngine();
engine.speech(sentence);

```

## License
MIT