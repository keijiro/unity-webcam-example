#pragma strict

var sampleRate = 44100;
var clipLength = 2.0;
var analysisWindow = 0.2;

private function CheckSampleRate() {
	var minFreq : int;
	var maxFreq : int;
	Microphone.GetDeviceCaps("", minFreq, maxFreq);
	if (minFreq > 0 && maxFreq > 0) {
		sampleRate = Mathf.Clamp(sampleRate, minFreq, maxFreq);
	}
	Debug.Log("Microphone sampling rate: " + sampleRate);
}

function Start () {
	CheckSampleRate();

	var clip = Microphone.Start(null, true, clipLength, sampleRate);
	var samples = new float[analysisWindow * sampleRate];

	while (true) {
		yield;

		var position = Microphone.GetPosition(null);
		if (position < samples.Length) position += clipLength * sampleRate;
		clip.GetData(samples, position - samples.Length);

		var rms = 0.0;
		for (var level in samples) {
			rms += level * level;
		}
		rms = Mathf.Sqrt(rms / samples.Length);

		var dbScale = 0.5 * (2.0 + Mathf.Log10(rms));
		transform.localScale = Vector3.one * (Mathf.Clamp01(dbScale) + 1.0);
	}
}
