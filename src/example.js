window.onload = function() {
    document.getElementById('speechButton').onclick = function(event) {
        $("#translated").empty();

        var sentence = $("#sentence").val().trim();
        var engine = new PokeMikuTTS.TTSEngine();
        engine.speech(sentence);
    };
}