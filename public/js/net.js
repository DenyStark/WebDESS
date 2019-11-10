const petriObjects = [];
const transitionObjects = [];

function createPetri() {
  const id = (Math.round(Math.random() * 1e12)).toString(26);
  const object = new PetriObject(id);
  petriObjects.push(object);
}

function createTransition() {
  const id = (Math.round(Math.random() * 1e12)).toString(26);
  const object = new TransitionObject(id);
  transitionObjects.push(object);
}
