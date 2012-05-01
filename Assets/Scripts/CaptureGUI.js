#pragma strict

var requestedWidth = 256;
var requestedHeight = 256;

private var devices : WebCamDevice[];
private var deviceIndex : int;
private var webcam : WebCamTexture;
private var target : GameObject;

function Start () {
    devices = WebCamTexture.devices;
    webcam = new WebCamTexture(devices[deviceIndex].name, requestedWidth, requestedHeight);

    target = GameObject.FindWithTag("Face");
    target.renderer.material.mainTexture = webcam;

    webcam.Play();
}

function Update () {
    if (webcam) {
        target.transform.localScale = Vector3(1.0, 1.0 * webcam.height / webcam.width, 1.0);
    }
}

function OnGUI () {
    if (!webcam) return;

    var sw = Screen.width;
    var sh = Screen.height;

    GUILayout.BeginArea(Rect(0.05 * sw, 0.8 * sh, 0.9 * sw, 0.1 * sh));
    GUILayout.BeginHorizontal();

    if (GUILayout.Button("SHOOT", GUILayout.ExpandHeight(true))) {
        ShootTexture();
    }

    if (devices.Length > 1 && GUILayout.Button("SWITCH", GUILayout.ExpandHeight(true))) {
        SwitchCamera();
    }

    if (!Microphone.IsRecording(null)) {
        if (GUILayout.Button("RECORD", GUILayout.ExpandHeight(true))) {
            RecordAudio();
        }
        if (GUILayout.Button("PLAY", GUILayout.ExpandHeight(true))) {
            audio.Play();
        }
    }

    GUILayout.EndHorizontal();
    GUILayout.EndArea();
}

private function RecordAudio () {
    StartCoroutine(function() {
        audio.clip = Microphone.Start(null, true, 2.0, 44100);
        yield WaitForSeconds(2.0);
        Microphone.End(null);

        GameObject.FindWithTag("Player").audio.clip = audio.clip;
    }());
}

private function ShootTexture () {
    var bakedTexture = new Texture2D(webcam.width, webcam.height);
    bakedTexture.SetPixels(webcam.GetPixels());
    bakedTexture.Apply();

    target.renderer.material.mainTexture = bakedTexture;
    Destroy(webcam);

    StartCoroutine(function(){
        var root = GameObject.FindWithTag("Player");

        for (var pt in GameObject.FindGameObjectsWithTag("Spawn")) {
            Instantiate(root, pt.transform.position, Quaternion.identity);
        }

        yield WaitForSeconds(0.5);

        GameObject.Find("Camera Pivot").animation.Play();

        for (var player in GameObject.FindGameObjectsWithTag("Player")) {
            player.SendMessage("StartActivity");
        }
    }());
}

private function SwitchCamera () {
    webcam.Stop();
    Destroy(webcam);

    deviceIndex = (deviceIndex + 1) % devices.Length;

    webcam = new WebCamTexture(devices[deviceIndex].name, requestedWidth, requestedHeight);
    target.renderer.material.mainTexture = webcam;

    webcam.Play();
}
