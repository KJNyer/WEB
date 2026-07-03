const http = require('http');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');
const { error } = require('console');



const server = express();

server.use(express.urlencoded({ extended: true }));

server.use(express.static('public')); // sirve HTML, imágenes, CSS, todo

const conexion = mysql.createConnection({
    host:'10.1.15.29',
    user:'alumno',
    password:'alumno',
    database:'Javier'
});

const  cabecera =fs.readFileSync("public/header.html","utf8");
const  final=fs.readFileSync("public/footer.html","utf8");


server.post("/lol",(req,res)=>{
    const correo=req.body.correo;
    const clave=req.body.clave

    if((correo=="c@campeones.com") &&(clave=="1234")){
        const contenido=`
             <br>
             <img src="images/lol2.jpg">
             <br>
             <a href="/campeones"><h1>PROCEDA A LA GRIETA</h1></a>

        `;
        res.send(cabecera+contenido+final);
    }else{
        const contenido=`
        <br>
        <br>
        <img src="images/lol3.gif">
        <br>
        <h1>CARECES DE JG</h1>
        <br>
        <a href="/"><h1>Volver</h1></a>
        `;
        res.send(cabecera+contenido+final);
    }

});
server.get ("/campeones",(req,res)=>{
    const informacion=conexion.query("select * from campeones",(error,data)=>{
        let fila=``;
        if (error)
        {
            fila=`
            <tr>
            <td colspan="5">NO HAY CAMPEONES DISPONIBLES</td>
            </tr>
            `;
        }else{
            for (const i of data){
                fila+=`
                <tr>
                    <td>${i.id}</td><td>${i.nombre}</td><td>${i.rol}</td><td>${i.dificultad}</td><td><a href="/editar_campeon?id=${i.id}">EDITAR</a>&nbsp;<a href="/eliminar_campeon?id=${i.id}">BORRAR</a>&nbsp;</td>
                </tr>
                `;
        }
            }
            const contenido=`
                <table border="1" width="600">
                    <tr>
                        <td>
                            <table width="100%">
                                <tr>
                                    <td>ID</td><td>Nombre</td><td>rol</td><td>dificultad</td><td>accion</td>
                                </tr>
                                ${fila}
                            </table>
                        </td>
                    </tr>
                    </table>
                    <br>
                    <input type="button" name="btn_nuevo" value="nuevocampeon" onClick="location='/nuevo_campeon'";>
            `;
            res.send(cabecera+contenido+final);
       

    });

});

server.get("/editar_campeon",(req,res)=>{
    const id_recibido=req.query.id;

    conexion.query("select * from campeones where id=?",[id_recibido],(error,data)=>{
        if (error||data.length==0){
            const contenido=`
            <h1>no existe tal cosa</h1>
            <br>
            <img src="images/lol1.png"><br><br>
            <input type ="button" name="btn" value="regresar a la lista de campeones" onClick="location='/campeones';">
            `;
            res.send(cabecera+contenido+final);
        }else{
            const nombre_recibido =data[0].nombre;
            const rol_recibido=data[0].rol;
            const dificultad_recibido=data[0].dificultad;
            const contenido=`
            <form name="editara" action="actualizar_campeones" method="POST">
                <input type="hidden" name="id" value="${id_recibido}">
                <table border="1" width="600">
                    <tr>
                        <td>
                            <table>
                                <tr>
                                    <td>Nombre:</td><td><input type="text" name="nombre" value="${nombre_recibido}"></td>
                                </tr>
                                <tr>
                                    <td>Rol:</td><td><input type="text" name="rol" value="${rol_recibido}"></td>
                                </tr>
                                <tr>
                                    <td>Dificultad:</td><td><input type="number" name="dificultad" value="${dificultad_recibido}"></td>
                                </tr>
                                <tr>
                                    <td coldspan="2" align="center"><input type="submit" name="btn_actualizar" value="Actualizar campeones"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </form>
            `;
            res.send(cabecera+contenido+final);


        }

    });

});
server.post("/actualizar_campeones",(req,res)=>{
    const id_recibido=req.body.id;
    const nombre_recibido=req.body.nombre;
    const rol_recibido=req.body.rol;
    const dificultad_recibido=req.body.dificultad;

    conexion.query("update campeones set nombre=?,rol=?,dificultad=? where id=?",[nombre_recibido,rol_recibido,dificultad_recibido,id_recibido],(error,data)=>{
        if (error||data.length==0){
            const contenido=`
            <h1>error al actualizar</h1>
            <br>
            <img src=""images/lol1.png"><br><br>
            <input type ="button" name="btn" value="regresar a la lista de campeones" onClick="location='/campeones';">
            `;
            res.send(cabecera+contenido+final);
        }
        else{
            const contenido =`
            <script>
                alert("Informacion actualizada");\n
                location="/campeones";
            </script>
            `;
            res.send(cabecera+contenido+final);
        }

    });

});

server.get("/eliminar_campeon",(req,res)=>{
    const id_recibido=req.query.id;

    conexion.query("select * from campeones where id=?",[id_recibido],(error,data)=>{
        if (error||data.length==0){
            const contenido=`
            <h1>no existe tal cosa</h1>
            <br>
            <img src=""images/lol1.png"><br><br>
            <input type ="button" name="btn" value="regresar a la lista de campeones" onClick="location='/campeones';">
            `;
            res.send(cabecera+contenido+final);
        }else{
            const nombre_recibido =data[0].nombre;

            const contenido=`
                <h1>¿ESTAS SEGURO que desea eliminar el campeo:  ${nombre_recibido}?</h1>
                <br>
                <input type="button" name="btn1" value="si" onClick="location='/confirmar_eliminacion?id=${id_recibido}';">
                &nbsp&nbsp&nbsp&nbsp&nbsp;
                <input type="button" name="btn2" value="no" onClick="location='/campeones';">

            `;
            res.send(cabecera+contenido+final);


        }

    });

});

server.get("/confirmar_eliminacion",(req,res)=>{
    const id_recibido=req.query.id;

    conexion.query("delete from campeones where id=?",[id_recibido],(error,data)=>{
        if (error||data.length==0){
            const contenido=`
            <h1>Error al eliminar el campeones </h1>
            <br>
            <img src="images/lol1.png"><br><br>
            <input type ="button" name="btn" value="regresar a la lista de campeones" onClick="location='/campeones';">
            `;
            res.send(cabecera+contenido+final);
        }else{

            const contenido=`
                <script>
                        alert("campeones eliminado");\n
                        location="/campeones";
                
                </script>
                

            `;
            res.send(cabecera+contenido+final);


        }

    });

});


server.listen(3000, () => {
    console.log('Servidor iniciado en puerto 3000 (OK) ');
});