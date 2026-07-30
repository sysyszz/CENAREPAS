import {useNavigation} from "../hooks/useNavigateTo";


export default function Contacto(){

const {irAdmin}=useNavigation();


return(

<section id="contacto">


<h2>
CONTÁCTANOS
</h2>


<p>
📞 302-123-8060
</p>

<p>
✉ ventas@arepas.com
</p>

<p>
📍 Bogotá Colombia
</p>


<button onClick={irAdmin}>
Panel Administrativo →
</button>


</section>

)

}