#pragma strict

var suspendedObject : GameObject;

function Start () {
#if UNITY_WEBPLAYER || UNITY_FLASH
	yield Application.RequestUserAuthorization(UserAuthorization.WebCam | UserAuthorization.Microphone);
#endif
	suspendedObject.SetActive(true);
}
