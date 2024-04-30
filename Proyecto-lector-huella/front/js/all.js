document.addEventListener("DOMContentLoaded", async ()=>{
    const conectado = localStorage.getItem("conectado");  
  var miModal = new bootstrap.Modal(document.getElementById("exampleModal"));
  var modalLabel = document.getElementById("exampleModalLabel");
  const btnOkey = document.getElementById("btn-okey");
  let ws;
  ws = new WebSocket('ws://localhost:4321');

  if (conectado === "false" || conectado === undefined) {
    modalLabel.textContent =
      "No hay conexión con el servidor. Por favor, intenta de nuevo más tarde.";
    miModal.show();
    btnOkey.addEventListener("click", function () {
      window.location.href = "../index.html";
    });
    return;
  }
  const response= await fetch('http://localhost:4321/api/arduino/getAllData')
  const data= await response.json()
  const tabla= document.getElementById('tabla-huellas')
  let tr;
  let th_nombre, th_edad, th_carrera, th_idhuella, th_correo, th_img, img;
  for(let i=0; i<data.length; i++){
    const urlGetImage = `http://localhost:4321/api/arduino/getImages/${data[i].fotoUser}`
    const respuesta= await fetch(urlGetImage)
    const imgBlob= await respuesta.blob();
    const image= URL.createObjectURL(imgBlob)


    tr= document.createElement('tr')
    th_nombre= document.createElement('th')
    th_edad= document.createElement('th')
    th_carrera= document.createElement('th')
    th_idhuella= document.createElement('th')
    th_correo= document.createElement('th')
    th_img= document.createElement('th')
    img= document.createElement('img')

    img.src= image

    th_nombre.innerHTML= data[i].nombre
    th_edad.innerHTML= data[i].EDAD + " Años"
    th_carrera.innerHTML= data[i].carrera
    th_idhuella.innerHTML= data[i].id_huella
    th_correo.innerHTML= data[i].correoInstitucional
    th_img.appendChild(img)
    

    tr.appendChild(th_idhuella)
    tr.appendChild(th_nombre)
    tr.appendChild(th_edad)
    tr.appendChild(th_carrera)
    tr.appendChild(th_correo)
    tr.appendChild(th_img)

    tabla.appendChild(tr)
  }
  
  const back= document.getElementById('back')
  back.addEventListener('click', (e)=>{
    e.preventDefault()
    window.location.href= "../index.html"
  })
})