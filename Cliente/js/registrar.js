
document.addEventListener('DOMContentLoaded', function() {
    const form= document.getElementById('form');

    var miModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    var modalLabel= document.getElementById("exampleModalLabel");
    const btnOkey = document.getElementById('btn-okey');
    
    if (!window.conectado || window.conectado== undefined) {
        modalLabel.textContent= "No hay conexión con el servidor. Por favor, intenta de nuevo más tarde.";
        miModal.show();
        btnOkey.addEventListener('click', function() {
            window.location.href="../index.html";
        });
        return;
    }else{
        form.addEventListener('submit', function(e){
            e.preventDefault();
            

            var  name= document.getElementById('nombre').value;
            var edad= document.getElementById('edad').value;
            var carrera= document.getElementById('carrera').value;
            var filePhoto= document.getElementById('filePhoto');
            
            
            var img='';
            if(filePhoto.files.length > 0){
                var reader= new FileReader();
                reader.onload= function(e){
                    img= e.target.result;
                    const data={
                        command: signUp,
                        name: name,
                        age: edad,
                        carrer: carrera,
                        photo: img,
                        footPrint: ''
                    }
                    modalLabel.textContent="Datos registrados exitosamente";
                    miModal.show();
                    btnOkey.addEventListener('click', function() {
                        window.location.href="../index.html";
                    });
                    console.log(data)
                    ws.send(JSON.stringify(data));
                }
                reader.readAsDataURL(filePhoto.files[0]);
            }
        });
    }
});