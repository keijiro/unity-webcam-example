#pragma strict

private var webcam : WebCamTexture;

function Start () {
	webcam = WebCamTexture();
	renderer.material.mainTexture = webcam;
	webcam.Play();
}
