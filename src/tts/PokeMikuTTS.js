var PokeMikuTTS;

(function(PokeMikuTTS) {
    var MIDIAccessor = (function() {
        function MIDIAccessor() {
            this.midiOutput = null;
        };

        MIDIAccessor.prototype.openPocketMiku = function(openCallback) {
            var self = this;

            if (navigator.requestMIDIAccess) {
                navigator
                    .requestMIDIAccess({sysex:true})
                    .then(function(aMIDIAccess) {
                        var outputs =  aMIDIAccess.outputs();

                        for (var i = 0; i < outputs.length; i++) {
                            var eachOut = outputs[i];
                            if (eachOut.name.trim() == 'NSX-39') {
                                self.midiOutput = eachOut;
                                openCallback(self.midiOutput);
                                break;
                            }
                        };
                    }, function(failMessage) {
                        console.log("NSX-39 not found: " + failMessage);
                    });
            }
        };

        return MIDIAccessor;
    })();
    PokeMikuTTS.MIDIAccessor = MIDIAccessor;

    var Player = (function() {
        function Player(midiOutput) {
            this.intervalId;
            this.interval = 340;
            this.midiOutput = midiOutput;
            this.charCodeList = [];
        };

        Player.prototype.start = function(charCodeList) {
            this.cursor = 0;
            var self = this;

            this.charCodeList = charCodeList;

            this.intervalId = setInterval(function() {
                self.next();
            }, this.interval);
        };

        Player.prototype.stop = function() {
            clearInterval(this.intervalId);
        };

        Player.prototype.next = function() {
            if (this.cursor >= this.charCodeList.length) {
                this.stop();
                return;
            }

            var code = this.charCodeList[this.cursor];
            if (code >= 0) {
                this.noteOn(code);
            }

            this.cursor = this.cursor + 1;
        };

        Player.prototype.noteOn = function(charCode) {
            var self = this;

            var sysex = [0xF0, 0x43, 0x79, 0x09, 0x11, 0x0A, 0x00, charCode, 0xF7];
            var noteOn = [0x90, 67, 0x7f];
            var noteOff = [0x80, 67, 0x7f];
            var delay = 300;

            self.midiOutput.send(sysex);
            _.delay(function() {self.midiOutput.send(noteOn)}, 10);
            _.delay(function() {self.midiOutput.send(noteOff)}, delay);
        };

        return Player;
    })();
    PokeMikuTTS.Player = Player;


    var TTSEngine = (function() {
        function TTSEngine() {
        };

        TTSEngine.prototype.translateCharCode = function(romajiSentence) {
            // 半角スペースでローマ字毎に分割。全角スペースで分節が区切られる
            var romajiList = romajiSentence.split(" ");
            console.log(romajiList);

            var charCodeList= [];
            romajiList.forEach(function(eachRomaji) {
                var charCode = PokeMikuTTS.romaji2CharCode[eachRomaji.trim()];
                if (charCode == undefined) { charCode = -1 }
                charCodeList.push(charCode);
            });

            return charCodeList;
        };

        TTSEngine.prototype.speech = function(sentence) {
            var self = this;
            var translator = new Mikugo.Translator();
            translator.translate(sentence, function(romajiSentence) {
                var charCodeList = self.translateCharCode(romajiSentence);
                self.playByMidi(charCodeList)
            });
        };

        TTSEngine.prototype.playByMidi = function(charCodeList) {
            var midiAccessor = new MIDIAccessor();
            midiAccessor.openPocketMiku(function(midiOutput) {
                console.log(midiOutput);

                var player = new Player(midiOutput);
                player.start(charCodeList);
            });
        };

        return TTSEngine;
    })();
    PokeMikuTTS.TTSEngine = TTSEngine;

    PokeMikuTTS.romaji2CharCode = {
        a: 0,
        i: 1,
        u: 2,
        e: 3,
        o: 4,
        ka: 5,
        ki: 6,
        ku: 7,
        ke: 8,
        ko: 9,
        ga: 10,
        gi: 11,
        gu: 12,
        ge: 13,
        go: 14,
        kya: 15,
        kyu: 16,
        kyo: 17,
        gya: 18,
        gyu: 19,
        gyo: 20,
        sa: 21,
        suxi: 22,
        su: 23,
        se: 24,
        so: 25,
        za: 26,
        zuxi: 27,
        zu: 28,
        ze: 29,
        zo: 30,
        sha: 31,
        shi: 32,
        shu: 33,
        shixe: 34,
        sho: 35,
        ja: 36,
        ji: 37,
        ju: 38,
        je: 39,
        jo: 40,
        ta: 41,
        texi: 42,
        toxu: 43,
        te: 44,
        to: 45,
        da: 46,
        xi: 47,
        doxu: 48,
        de: 49,
        do: 50,
        texyu: 51,
        dexyu: 52,
        cha: 53,
        chi: 54,
        chu: 55,
        che: 56,
        cho: 57,
        tsuxa: 58,
        tsuxi: 59,
        tsu: 60,
        tsuxe: 61,
        tsuxo: 62,
        na: 63,
        ni: 64,
        nu: 65,
        ne: 66,
        no: 67,
        nya: 68,
        nyu: 69,
        nyo: 70,
        ha: 71,
        hi: 72,
        fu: 73,
        he: 74,
        ho: 75,
        ba: 76,
        bi: 77,
        bu: 78,
        be: 79,
        bo: 80,
        pa: 81,
        pi: 82,
        pu: 83,
        pe: 84,
        po: 85,
        hya: 86,
        hyu: 87,
        hyo: 88,
        bya: 89,
        byu: 90,
        byo: 91,
        pya: 92,
        pyu: 93,
        pyo: 94,
        fa: 95,
        fi: 96,
        fuxyu: 97,
        fe: 98,
        fo: 99,
        ma: 100,
        mi: 101,
        mu: 102,
        me: 103,
        mo: 104,
        mya: 105,
        myu: 106,
        myo: 107,
        ya: 108,
        yu: 109,
        yo: 110,
        ra: 111,
        ri: 112,
        ru: 113,
        re: 114,
        ro: 115,
        rya: 116,
        ryu: 117,
        ryo: 118,
        wa: 119,
        uxi: 120,
        uxe: 121,
        uxo: 122,
        n: 123
    };
})(PokeMikuTTS || (PokeMikuTTS = {}));