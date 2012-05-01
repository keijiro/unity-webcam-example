#pragma strict

private var agent : NavMeshAgent;

function Awake () {
    agent = GetComponent.<NavMeshAgent>();
}

function StartActivity () {
    while (true) {
        agent.SetDestination(Vector3(Random.Range(-5.0, 5.0), 0.0, Random.Range(-5.0, 5.0)));
        while (agent.velocity.magnitude > 0.1) yield;
        audio.Play();
        yield WaitForSeconds(Random.Range(2.0, 4.0));
    }
}

function Update () {
    if (agent.velocity.magnitude < 0.3) {
        animation.CrossFade("Idle");
    } else {
        animation.CrossFade("RelaxedWalk");
    }
}
