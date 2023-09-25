const socket: Socket = io.connect();

interface Coordinate {
  x: number;
  y: number;
}

interface Message {
  user: string;
  content: string;
}

interface User {
  name: string;
  color: string;
  id: number;
}

interface Pin {
  user: User;
  message: string;
  coordinates: Coordinate;
}

const appendRawHTML = (el: HTMLElement, string: string) => {
  el.insertAdjacentHTML("beforeend", string);
};

window.addEventListener("load", ()=> nametag.value = "")
const colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];

let user: User = {};

const nametag: HTMLInputElement = document.getElementsByClassName("nametag")[0];

nametag.addEventListener("keydown", (event) => {
  user.name = nametag.value;

  if (event.key === "Escape" || event.key === "Enter") {
    nametag.blur();
  }
});

const onClick = (event: MouseEvent | PointerEvent) => {
  if (event.target == document.body) {
    const inputs = document.getElementsByClassName("pin-input");
    if (inputs.length) inputs[0].remove();
    const pinInput = document.createElement("input");
    pinInput.className = "pin-input";
    pinInput.type = "text";

    pinInput.addEventListener("keydown", (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Enter") {
        const pin: Pin = {
          user: user,
          message: pinInput.value,
          coordinates: { x: event.clientX, y: event.clientY },
        };
        socket.emit("pin", pin);
        pinInput.remove();
      } else if (keyEvent.key === "Escape") {
        pinInput.remove();
      }
    });

    pinInput.style.position = "absolute";
    pinInput.style.left = event.clientX.toString() + "px";
    pinInput.style.top = event.clientY.toString() + "px";
    pinInput.style.color = user.color;
    document.body.append(pinInput);

    window.setTimeout(() => pinInput.focus(), 0);
  }
};

const drawPin = (pin: Pin) => {
  const pinElement = document.createElement("div");
  pinElement.style.position = "absolute";
  pinElement.style.left = pin.coordinates.x.toString() + "px";
  pinElement.style.top = pin.coordinates.y.toString() + "px";
  pinElement.innerText = pin.message;
  pinElement.style.color = pin.user.color;
  pinElement.setAttribute(
    "title",
    pin.user.id == user.id ? "you posted this" : pin.user.name + " posted this",
  );
  document.body.appendChild(pinElement);
  window.setTimeout(() => {
    fadeOutElement(pinElement);
  }, 5000);
  console.log(pin);
};

const fadeOutElement = (el: HTMLElement) => {
  el.style.opacity = "1";
  let counter = 100;
  const recursiveFade = () => {
    if (counter > 0) {
      counter--;
      el.style.opacity = (Number(el.style.opacity) - 0.01).toString();
      window.setTimeout(recursiveFade, 100);
    } else {
      el.remove();
    }
  };
  recursiveFade();
};

socket.on("pin", (pin: Pin) => drawPin(pin));

document.body.addEventListener("mousedown", onClick);

socket.on("connect", function () {
  user = {
    name: "anonymous",
    color: colors[Math.floor(Math.random() * colors.length)],
    id: Math.random() * 100000,
  };
  nametag.style.color = user.color;
});
